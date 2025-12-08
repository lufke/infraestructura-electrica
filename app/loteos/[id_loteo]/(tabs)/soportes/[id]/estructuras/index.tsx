import { useFocusEffect, useLocalSearchParams, useRouter } from "expo-router";
import { useSQLiteContext } from "expo-sqlite";
import React, { useCallback, useState } from "react";
import { FlatList, StyleSheet, View } from "react-native";
import { Appbar, FAB, List, Text } from "react-native-paper";

type Estructura = {
    id: number;
    tipo_estructura: string | null;
    material: string | null;
    id_soporte: number;
    synced: number | null;
};

export default function EstructurasIndex() {
    const { id } = useLocalSearchParams<{ id: string }>();
    const router = useRouter();
    const db = useSQLiteContext();
    const [estructuras, setEstructuras] = useState<Estructura[]>([]);

    const loadEstructuras = async () => {
        if (!id) return;

        try {
            const result = await db.getAllAsync<Estructura>(
                `SELECT * FROM estructuras WHERE id_soporte = ?`,
                [id]
            );
            setEstructuras(result);
        } catch (err) {
            console.error("Error loading estructuras:", err);
        }
    };

    useFocusEffect(
        useCallback(() => {
            loadEstructuras();
        }, [id])
    );

    const getSyncColor = (synced: number | null | undefined) => {
        return synced === 1 ? '#4CAF50' : '#F44336';
    };

    const renderItem = ({ item }: { item: Estructura }) => (
        <List.Item
            title={`Estructura #${item.id}`}
            description={`Tipo: ${item.tipo_estructura || 'N/A'} - Material: ${item.material || 'N/A'}`}
            left={props => (
                <List.Icon
                    {...props}
                    icon="cube-outline"
                    color={getSyncColor(item.synced)}
                />
            )}
            right={props => <List.Icon {...props} icon="chevron-right" />}
            onPress={() => {
                console.log('Estructura seleccionada:', item.id);
            }}
        />
    );

    return (
        <View style={styles.container}>
            <Appbar.Header>
                <Appbar.BackAction onPress={() => router.back()} />
                <Appbar.Content title="Estructuras" />
            </Appbar.Header>

            <FlatList
                data={estructuras}
                keyExtractor={(item) => item.id.toString()}
                renderItem={renderItem}
                ListEmptyComponent={
                    <View style={styles.emptyContainer}>
                        <Text>No hay estructuras registradas para este soporte.</Text>
                    </View>
                }
            />

            <FAB
                icon="plus"
                label="Agregar Estructura"
                onPress={() => router.push(`/loteos/${id}/(tabs)/soportes/${id}/estructuras/new`)}
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
