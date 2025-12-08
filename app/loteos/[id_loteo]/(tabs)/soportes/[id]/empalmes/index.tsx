import { Empalme } from "@/src/types";
import { useFocusEffect, useLocalSearchParams, useRouter } from "expo-router";
import { useSQLiteContext } from "expo-sqlite";
import React, { useCallback, useState } from "react";
import { FlatList, StyleSheet, View } from "react-native";
import { Appbar, FAB, List, Text } from "react-native-paper";


export default function EmpalmesIndex() {
    const { id } = useLocalSearchParams<{ id: string }>();
    const router = useRouter();
    const db = useSQLiteContext();
    const [empalmes, setEmpalmes] = useState<Empalme[]>([]);

    const loadEmpalmes = async () => {
        if (!id) return;

        try {
            const result = await db.getAllAsync<Empalme>(
                `SELECT * FROM empalmes WHERE id_soporte = ?`,
                [id]
            );
            setEmpalmes(result);
        } catch (err) {
            console.error("Error loading empalmes:", err);
        }
    };

    useFocusEffect(
        useCallback(() => {
            loadEmpalmes();
        }, [id])
    );

    const getSyncColor = (synced: number | null | undefined) => {
        return synced === 1 ? '#4CAF50' : '#F44336';
    };

    const renderItem = ({ item }: { item: Empalme }) => (
        <List.Item
            title={`Empalme #${item.id}`}
            description={`Medidor: ${item.n_medidor || 'N/A'} - Capacidad: ${item.capacidad || 'N/A'} A`}
            left={props => (
                <List.Icon
                    {...props}
                    icon="connection"
                    color={getSyncColor(item.synced)}
                />
            )}
            right={props => <List.Icon {...props} icon="chevron-right" />}
            onPress={() => {
                console.log('Empalme seleccionado:', item.id);
            }}
        />
    );

    return (
        <View style={styles.container}>
            <Appbar.Header>
                <Appbar.BackAction onPress={() => router.back()} />
                <Appbar.Content title="Empalmes" />
            </Appbar.Header>

            <FlatList
                data={empalmes}
                keyExtractor={(item) => item.id.toString()}
                renderItem={renderItem}
                ListEmptyComponent={
                    <View style={styles.emptyContainer}>
                        <Text>No hay empalmes registrados para este soporte.</Text>
                    </View>
                }
            />

            <FAB
                icon="plus"
                label="Agregar Empalme"
                onPress={() => router.push(`/loteos/${id}/(tabs)/soportes/${id}/empalmes/new`)}
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
