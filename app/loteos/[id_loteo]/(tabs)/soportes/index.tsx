import { useLoteo } from "@/src/contexts/LoteoContext";
import { getCamarasByLoteoId } from "@/src/database/queries/camaras";
import { getPostesByLoteoId } from "@/src/database/queries/postes";
import { getSoportesByLoteoId, hardDeleteSoporte } from "@/src/database/queries/soportes";
import { Camara, Poste, Soporte } from "@/src/types";
import { useFocusEffect, useRouter } from "expo-router";
import { useSQLiteContext } from "expo-sqlite";
import { useCallback, useState } from "react";
import { Alert, FlatList, StyleSheet, View } from "react-native";
import { IconButton, List, Text } from "react-native-paper";

type SoporteItem = (Poste | Camara) & { tipo: 'POSTE' | 'CAMARA' };


export default function SoportesList() {
    const { currentLoteoId, currentSoporteId, setCurrentSoporteId } = useLoteo();
    const [items, setItems] = useState<SoporteItem[]>([]);
    const db = useSQLiteContext();
    const [soportes, setSoportes] = useState<Soporte[]>([]);

    const router = useRouter()
    const loadSoportesCamarasPostes = async () => {
        if (!currentLoteoId) return;

        const soportesResult = await getSoportesByLoteoId(db, currentLoteoId);
        // console.log({ soportesResult });
        // Fetch both postes and camaras
        const postesResult = await getPostesByLoteoId(db, currentLoteoId);
        const camarasResult = await getCamarasByLoteoId(db, currentLoteoId);

        // Add type identifier to each item
        const postes = (postesResult as Poste[]).map(p => ({ ...p, tipo: 'POSTE' as const }));
        const camaras = (camarasResult as Camara[]).map(c => ({ ...c, tipo: 'CAMARA' as const }));

        // Combine and sort by ID
        const combined = [...postes, ...camaras].sort((a, b) => a.id - b.id);
        setItems(combined);
        // console.log({ combined })
        setSoportes(soportesResult as Soporte[]);
    }

    const loadSoportes = async () => {
        if (!currentLoteoId) return;

        const soportesResult = await getSoportesByLoteoId(db, currentLoteoId);
        // console.log({ soportesResult });
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

    const handleDelete = (id_soporte: number) => {
        Alert.alert(
            "Eliminar Soporte",
            "¿Estás seguro de que deseas eliminar este soporte? Esta acción no se puede deshacer.",
            [
                { text: "Cancelar", style: "cancel" },
                {
                    text: "Eliminar",
                    style: "destructive",
                    onPress: async () => {
                        try {
                            console.log("Eliminando soporte con ID:", id_soporte);
                            await hardDeleteSoporte(db, id_soporte);
                            loadSoportesCamarasPostes();
                        } catch (error) {
                            console.error("Error al eliminar soporte:", error);
                            Alert.alert("Error", "No se pudo eliminar el soporte.");
                        }
                    }
                }
            ]
        );
    };

    const soporteItem = ({ item }: { item: Soporte }) => {
        return (
            <List.Item
                title={`${item.id} - ${item.tipo}`}
                right={props => (
                    <View style={styles.rightActions}>
                        <IconButton
                            icon="trash-can-outline"
                            iconColor="red"
                            onPress={() => handleDelete(item.id)}
                        />
                        <List.Icon {...props} icon="chevron-right" />
                    </View>
                )}
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
                    // description={`ID POSTE: ${poste.altura_nivel_tension} - ID Soporte: ${poste.id_soporte}`}
                    description={`Tipo: ${poste.altura_nivel_tension || 'N/A'} - ${poste.material || 'N/A'}`}
                    left={props => (
                        <List.Icon
                            {...props}
                            icon="transmission-tower"
                            color={getSyncColor(poste.synced)}

                        />
                    )}
                    right={props => (
                        <View style={styles.rightActions}>
                            <IconButton
                                icon="trash-can-outline"
                                iconColor="red"
                                onPress={() => handleDelete(poste.id_soporte)}
                            />
                            <List.Icon {...props} icon="chevron-right" />
                        </View>
                    )}
                    onPress={() => {
                        // console.log('Poste seleccionado:', poste.id);
                        setCurrentSoporteId(poste.id_soporte);
                        router.navigate(`/loteos/${currentLoteoId}/soportes/${poste.id_soporte}`)
                    }}
                />
            );
        } else {
            const camara = item as Camara & { tipo: 'CAMARA' };
            return (
                <List.Item
                    title={camara.placa || "CÁMARA SIN PLACA"}
                    description={`ID CÁMARA: ${camara.id} - ID Soporte: ${camara.id_soporte}`}
                    left={props => (
                        <List.Icon
                            {...props}
                            icon="square-outline"
                            color={getSyncColor(camara.synced)}
                        />
                    )}
                    right={props => (
                        <View style={styles.rightActions}>
                            <IconButton
                                icon="trash-can-outline"
                                iconColor="red"
                                onPress={() => handleDelete(camara.id_soporte)}
                            />
                            <List.Icon {...props} icon="chevron-right" />
                        </View>
                    )}
                    onPress={() => {
                        // console.log('Cámara seleccionada:', camara.id);
                        setCurrentSoporteId(camara.id_soporte);
                        router.navigate(`/loteos/${currentLoteoId}/soportes/${camara.id_soporte}`)
                    }}
                />
            );
        }
    };

    return (
        <View style={styles.container}>
            {true
                ? (
                    <FlatList
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
    rightActions: {
        flexDirection: 'row',
        alignItems: 'center',
    },
});