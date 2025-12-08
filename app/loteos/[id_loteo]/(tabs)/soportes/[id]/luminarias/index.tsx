import { useFocusEffect, useLocalSearchParams, useRouter } from "expo-router";
import { useSQLiteContext } from "expo-sqlite";
import React, { useCallback, useState } from "react";
import { FlatList, StyleSheet, View } from "react-native";
import { Appbar, FAB, List, Text } from "react-native-paper";

type Luminaria = {
    id: number;
    tipo_luminaria: string | null;
    potencia: number | null;
    estado: string | null;
    id_soporte: number;
    synced: number | null;
};

export default function LuminariasIndex() {
    const { id } = useLocalSearchParams<{ id: string }>();
    const router = useRouter();
    const db = useSQLiteContext();
    const [luminarias, setLuminarias] = useState<Luminaria[]>([]);

    const loadLuminarias = async () => {
        if (!id) return;

        try {
            const result = await db.getAllAsync<Luminaria>(
                `SELECT * FROM luminarias WHERE id_soporte = ?`,
                [id]
            );
            setLuminarias(result);
        } catch (err) {
            console.error("Error loading luminarias:", err);
        }
    };

    useFocusEffect(
        useCallback(() => {
            loadLuminarias();
        }, [id])
    );

    const getSyncColor = (synced: number | null | undefined) => {
        return synced === 1 ? '#4CAF50' : '#F44336';
    };

    const renderItem = ({ item }: { item: Luminaria }) => (
        <List.Item
            title={`Luminaria #${item.id}`}
            description={`Tipo: ${item.tipo_luminaria || 'N/A'} - Potencia: ${item.potencia || 'N/A'}W - Estado: ${item.estado || 'N/A'}`}
            left={props => (
                <List.Icon
                    {...props}
                    icon="lightbulb-on-outline"
                    color={getSyncColor(item.synced)}
                />
            )}
            right={props => <List.Icon {...props} icon="chevron-right" />}
            onPress={() => {
                console.log('Luminaria seleccionada:', item.id);
            }}
        />
    );

    return (
        <View style={styles.container}>
            <Appbar.Header>
                <Appbar.BackAction onPress={() => router.back()} />
                <Appbar.Content title="Luminarias" />
            </Appbar.Header>

            <FlatList
                data={luminarias}
                keyExtractor={(item) => item.id.toString()}
                renderItem={renderItem}
                ListEmptyComponent={
                    <View style={styles.emptyContainer}>
                        <Text>No hay luminarias registradas para este soporte.</Text>
                    </View>
                }
            />

            <FAB
                icon="plus"
                label="Agregar Luminaria"
                onPress={() => router.push(`/loteos/${id}/(tabs)/soportes/${id}/luminarias/new`)}
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
