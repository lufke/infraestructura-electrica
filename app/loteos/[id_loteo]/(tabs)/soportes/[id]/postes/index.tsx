import { useFocusEffect, useLocalSearchParams, useRouter } from "expo-router";
import { useSQLiteContext } from "expo-sqlite";
import React, { useCallback, useState } from "react";
import { FlatList, StyleSheet, View } from "react-native";
import { Appbar, FAB, List, Text } from "react-native-paper";

type Poste = {
    id: number;
    placa: string | null;
    material: string | null;
    altura: number | null;
    id_soporte: number;
    synced: number | null;
};

export default function PostesIndex() {
    const { id } = useLocalSearchParams<{ id: string }>();
    const router = useRouter();
    const db = useSQLiteContext();
    const [postes, setPostes] = useState<Poste[]>([]);

    const loadPostes = async () => {
        if (!id) return;

        try {
            const result = await db.getAllAsync<Poste>(
                `SELECT * FROM postes WHERE id_soporte = ?`,
                [id]
            );
            setPostes(result);
        } catch (err) {
            console.error("Error loading postes:", err);
        }
    };

    useFocusEffect(
        useCallback(() => {
            loadPostes();
        }, [id])
    );

    const getSyncColor = (synced: number | null | undefined) => {
        return synced === 1 ? '#4CAF50' : '#F44336';
    };

    const renderItem = ({ item }: { item: Poste }) => (
        <List.Item
            title={item.placa || "POSTE SIN PLACA"}
            description={`Material: ${item.material || 'N/A'} - Altura: ${item.altura || 'N/A'}m - ID: ${item.id}`}
            left={props => (
                <List.Icon
                    {...props}
                    icon="transmission-tower"
                    color={getSyncColor(item.synced)}
                />
            )}
            right={props => <List.Icon {...props} icon="chevron-right" />}
            onPress={() => {
                console.log('Poste seleccionado:', item.id);
            }}
        />
    );

    return (
        <View style={styles.container}>
            <Appbar.Header>
                <Appbar.BackAction onPress={() => router.back()} />
                <Appbar.Content title="Postes" />
            </Appbar.Header>

            <FlatList
                data={postes}
                keyExtractor={(item) => item.id.toString()}
                renderItem={renderItem}
                ListEmptyComponent={
                    <View style={styles.emptyContainer}>
                        <Text>No hay postes registrados para este soporte.</Text>
                    </View>
                }
            />

            <FAB
                icon="plus"
                label="Agregar Poste"
                onPress={() => router.push(`/loteos/${id}/(tabs)/soportes/${id}/postes/new`)}
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
