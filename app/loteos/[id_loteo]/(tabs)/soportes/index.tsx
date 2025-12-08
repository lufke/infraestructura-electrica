import { useLoteo } from "@/src/contexts/LoteoContext";
import { getCamarasByLoteoId } from "@/src/database/queries/camaras";
import { getPostesByLoteoId } from "@/src/database/queries/postes";
import { getSoportesByLoteoId } from "@/src/database/queries/soportes";
import { Camara, Poste, Soporte } from "@/src/types";
import { useFocusEffect, useRouter } from "expo-router";
import { useSQLiteContext } from "expo-sqlite";
import { useCallback, useState } from "react";
import { FlatList, StyleSheet, View } from "react-native";
import { List, Text } from "react-native-paper";

type SoporteItem = (Poste | Camara) & { tipo: 'POSTE' | 'CAMARA' };


export default function SoportesList() {
    const { currentLoteoId } = useLoteo();
    const [items, setItems] = useState<SoporteItem[]>([]);
    const db = useSQLiteContext();
    const [soportes, setSoportes] = useState<Soporte[]>([]);

const router = useRouter()
    const loadSoportesCamarasPostes = async () => {
        if (!currentLoteoId) return;

        const soportesResult = await getSoportesByLoteoId(db, currentLoteoId);
        console.log({ soportesResult });
        // Fetch both postes and camaras
        const postesResult = await getPostesByLoteoId(db, currentLoteoId);
        const camarasResult = await getCamarasByLoteoId(db, currentLoteoId);

        // Add type identifier to each item
        const postes = (postesResult as Poste[]).map(p => ({ ...p, tipo: 'POSTE' as const }));
        const camaras = (camarasResult as Camara[]).map(c => ({ ...c, tipo: 'CAMARA' as const }));

        // Combine and sort by ID
        const combined = [...postes, ...camaras].sort((a, b) => a.id - b.id);
        setItems(combined);
        console.log({ combined })
        setSoportes(soportesResult as Soporte[]);
    }

    const loadSoportes = async () => {
        if (!currentLoteoId) return;

        const soportesResult = await getSoportesByLoteoId(db, currentLoteoId);
        console.log({ soportesResult });
        setSoportes(soportesResult as Soporte[]);
    }

    useFocusEffect(
        useCallback(() => {
            loadSoportesCamarasPostes();
            loadSoportes();
        }, [currentLoteoId])
    )

    const getSyncColor = (synced: number | null | undefined) => {
        return synced === 1 ? '#4CAF50' : '#F44336';
    };

    const soporteItem = ({ item }: { item: Soporte }) => {
        return (
            <List.Item
                title={`${item.id} - ${item.tipo}`}
            />
        )

    }

    // renderSoporteItem

    const renderItem = ({ item }: { item: SoporteItem }) => {
        if (item.tipo === 'POSTE') {
            const poste = item as Poste & { tipo: 'POSTE' };
            return (
                <List.Item
                    title={poste.placa || "POSTE SIN PLACA"}
                    description={`Material: ${poste.material || 'N/A'} - Altura: ${poste.altura_nivel_tension || 'N/A'} - ID Soporte: ${poste.id_soporte}`}
                    left={props => (
                        <List.Icon
                            {...props}
                            icon="transmission-tower"
                            color={getSyncColor(poste.synced)}

                        />
                    )}
                    right={props => <List.Icon {...props} icon="chevron-right" />}
                    onPress={() => {
                        console.log('Poste seleccionado:', poste.id);
                        router.navigate(`/loteos`)
                    }}
                />
            );
        } else {
            const camara = item as Camara & { tipo: 'CAMARA' };
            return (
                <List.Item
                    title={camara.placa || "CÁMARA SIN PLACA"}
                    description={`Tipo: ${camara.tipo_camara || 'N/A'} - Condición: ${camara.condicion || 'N/A'} - ID: ${camara.id}`}
                    left={props => (
                        <List.Icon
                            {...props}
                            icon="cctv"
                            color={getSyncColor(camara.synced)}
                        />
                    )}
                    right={props => <List.Icon {...props} icon="chevron-right" />}
                    onPress={() => {
                        console.log('Cámara seleccionada:', camara.id);
                    }}
                />
            );
        }
    };

    return (
        <View style={styles.container}>
            {true
                ? (<FlatList
                    data={items}
                    keyExtractor={(item) => `${item.tipo}-${item.id}`}
                    renderItem={renderItem}
                    ListEmptyComponent={
                        <View style={styles.emptyContainer}>
                            <Text>No hay postes ni cámaras registrados para este loteo.</Text>
                        </View>
                    }
                />)
                : (
                    <FlatList
                        data={soportes}
                        keyExtractor={(item) => `${item.id}`}
                        renderItem={soporteItem}
                        ListEmptyComponent={
                            <View style={styles.emptyContainer}>
                                <Text>No hay soportes registrados para este loteo.</Text>
                            </View>
                        }
                    />)
            }
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f5f5f5',
    },
    emptyContainer: {
        padding: 20,
        alignItems: 'center',
    },
});