import { useFocusEffect, useLocalSearchParams, useRouter } from "expo-router";
import { useSQLiteContext } from "expo-sqlite";
import React, { useCallback, useState } from "react";
import { FlatList, StyleSheet, View } from "react-native";
import { Appbar, FAB, List, Text } from "react-native-paper";

type Camara = {
    id: number;
    placa: string | null;
    tipo_camara: string | null;
    condicion: string | null;
    id_soporte: number;
    synced: number | null;
};

export default function CamarasIndex() {
    const { id } = useLocalSearchParams<{ id: string }>();
    const router = useRouter();
    const db = useSQLiteContext();
    const [camaras, setCamaras] = useState<Camara[]>([]);

    const loadCamaras = async () => {
        if (!id) return;

        try {
            const result = await db.getAllAsync<Camara>(
                `SELECT * FROM camaras WHERE id_soporte = ?`,
                [id]
            );
            setCamaras(result);
        } catch (err) {
            console.error("Error loading camaras:", err);
        }
    };

    useFocusEffect(
        useCallback(() => {
            loadCamaras();
        }, [id])
    );

    const getSyncColor = (synced: number | null | undefined) => {
        return synced === 1 ? '#4CAF50' : '#F44336';
    };

    const renderItem = ({ item }: { item: Camara }) => (
        <List.Item
            title={item.placa || "CÁMARA SIN PLACA"}
            description={`Tipo: ${item.tipo_camara || 'N/A'} - Condición: ${item.condicion || 'N/A'} - ID: ${item.id}`}
            left={props => (
                <List.Icon
                    {...props}
                    icon="cctv"
                    color={getSyncColor(item.synced)}
                />
            )}
            right={props => <List.Icon {...props} icon="chevron-right" />}
            onPress={() => {
                console.log('Cámara seleccionada:', item.id);
            }}
        />
    );

    return (
        <View style={styles.container}>
            <Appbar.Header>
                <Appbar.BackAction onPress={() => router.back()} />
                <Appbar.Content title="Cámaras" />
            </Appbar.Header>

            <FlatList
                data={camaras}
                keyExtractor={(item) => item.id.toString()}
                renderItem={renderItem}
                ListEmptyComponent={
                    <View style={styles.emptyContainer}>
                        <Text>No hay cámaras registradas para este soporte.</Text>
                    </View>
                }
            />

            <FAB
                icon="plus"
                label="Agregar Cámara"
                onPress={() => router.push(`/loteos/${id}/(tabs)/soportes/${id}/camaras/new`)}
                style={styles.fab}
            />
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
    fab: {
        position: 'absolute',
        bottom: 16,
        right: 16,
    },
});
