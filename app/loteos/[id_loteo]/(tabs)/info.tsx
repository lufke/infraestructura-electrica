import ExportJsonButton from "@/src/components/ui/ExportJSONButton";
import { useLoteo } from "@/src/contexts/LoteoContext";
import { getLoteoById } from "@/src/database/queries/loteos";
import { Loteo } from "@/src/types";
import { useFocusEffect } from "expo-router";
import { useSQLiteContext } from "expo-sqlite";
import { useCallback, useState } from "react";
import { ActivityIndicator, Text, View } from "react-native";

export default function Info() {
    const db = useSQLiteContext();
    const { currentLoteoId } = useLoteo();
    const [loteo, setLoteo] = useState<Loteo | null>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const getLoteoInfo = useCallback(async () => {
        // Solo ejecutar si tenemos un ID válido
        if (!currentLoteoId) {
            setLoteo(null);
            return;
        }

        setLoading(true);
        setError(null);

        try {
            const response = await getLoteoById(db, currentLoteoId) as Loteo;
            setLoteo(response);
        } catch (err) {
            setError("Error al cargar información del loteo");
            console.error(err);
        } finally {
            setLoading(false);
        }
    }, [currentLoteoId, db]); // ← Dependencias correctas

    // Se ejecuta cada vez que:
    // 1. La pantalla recibe foco
    // 2. Cambia currentLoteoId
    useFocusEffect(
        useCallback(() => {
            getLoteoInfo();
        }, [getLoteoInfo]) // ← Dependencia de la función
    );

    // Para debug - ahora sí muestra el valor real
    console.log("loteo:", loteo);

    if (loading) {
        return (
            <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                <ActivityIndicator size="large" />
                <Text>Cargando...</Text>
            </View>
        );
    }

    if (error) {
        return (
            <View>
                <Text style={{ color: 'red' }}>{error}</Text>
            </View>
        );
    }

    return (
        <View style={{ padding: 20 }}>
            <Text>ID del loteo actual: {currentLoteoId}</Text>
            {loteo ? (
                <>
                    <Text>Nombre: {loteo.nombre}</Text>
                    {/* <Text>Ubicación: {loteo.ubicacion}</Text> */}
                    <Text>Detalles: {JSON.stringify(loteo)}</Text>
                </>
            ) : (
                <Text>No hay información del loteo</Text>
            )}
            <ExportJsonButton loteoId={currentLoteoId} />
        </View>
    );
}