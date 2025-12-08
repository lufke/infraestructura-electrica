import { useFocusEffect, useLocalSearchParams, useRouter } from "expo-router";
import { useSQLiteContext } from "expo-sqlite";
import React, { useCallback, useState } from "react";
import { FlatList, StyleSheet, View } from "react-native";
import { Appbar, FAB, List, Text } from "react-native-paper";

type Tierra = {
    id: number;
    tipo_tierra: string | null;
    resistencia: number | null;
    id_soporte: number;
    synced: number | null;
};

export default function TierrasIndex() {
    const { id } = useLocalSearchParams<{ id: string }>();
    const router = useRouter();
    const db = useSQLiteContext();
    const [tierras, setTierras] = useState<Tierra[]>([]);

    const loadTierras = async () => {
        if (!id) return;

        try {
            const result = await db.getAllAsync<Tierra>(
                `SELECT * FROM tierras WHERE id_soporte = ?`,
                [id]
            );
            setTierras(result);
        } catch (err) {
            console.error("Error loading tierras:", err);
        }
    };

    useFocusEffect(
        useCallback(() => {
            loadTierras();
        }, [id])
    );

    const getSyncColor = (synced: number | null | undefined) => {
        return synced === 1 ? '#4CAF50' : '#F44336';
    };

    const renderItem = ({ item }: { item: Tierra }) => (
        <List.Item
            title={`Tierra #${item.id}`}
            description={`Tipo: ${item.tipo_tierra || 'N/A'} - Resistencia: ${item.resistencia || 'N/A'}Ω`}
            left={props => (
                <List.Icon
                    {...props}
                    icon="earth"
                    color={getSyncColor(item.synced)}
                />
            )}
            right={props => <List.Icon {...props} icon="chevron-right" />}
            onPress={() => {
                console.log('Tierra seleccionada:', item.id);
            }}
        />
    );

    return (
        <View style={styles.container}>
            <Appbar.Header>
                <Appbar.BackAction onPress={() => router.back()} />
                <Appbar.Content title="Tierras" />
            </Appbar.Header>

            <FlatList
                data={tierras}
                keyExtractor={(item) => item.id.toString()}
                renderItem={renderItem}
                ListEmptyComponent={
                    <View style={styles.emptyContainer}>
                        <Text>No hay tierras registradas para este soporte.</Text>
                    </View>
                }
            />

            <FAB
                icon="plus"
                label="Agregar Tierra"
                onPress={() => router.push(`/loteos/${id}/(tabs)/soportes/${id}/tierras/new`)}
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
