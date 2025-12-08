import { useFocusEffect, useLocalSearchParams, useRouter } from "expo-router";
import { useSQLiteContext } from "expo-sqlite";
import React, { useCallback, useState } from "react";
import { FlatList, StyleSheet, View } from "react-native";
import { Appbar, FAB, List, Text } from "react-native-paper";

type Tirante = {
    id: number;
    tipo_tirante: string | null;
    material: string | null;
    longitud: number | null;
    id_soporte: number;
    synced: number | null;
};

export default function TirantesIndex() {
    const { id } = useLocalSearchParams<{ id: string }>();
    const router = useRouter();
    const db = useSQLiteContext();
    const [tirantes, setTirantes] = useState<Tirante[]>([]);

    const loadTirantes = async () => {
        if (!id) return;

        try {
            const result = await db.getAllAsync<Tirante>(
                `SELECT * FROM tirantes WHERE id_soporte = ?`,
                [id]
            );
            setTirantes(result);
        } catch (err) {
            console.error("Error loading tirantes:", err);
        }
    };

    useFocusEffect(
        useCallback(() => {
            loadTirantes();
        }, [id])
    );

    const getSyncColor = (synced: number | null | undefined) => {
        return synced === 1 ? '#4CAF50' : '#F44336';
    };

    const renderItem = ({ item }: { item: Tirante }) => (
        <List.Item
            title={`Tirante #${item.id}`}
            description={`Tipo: ${item.tipo_tirante || 'N/A'} - Material: ${item.material || 'N/A'} - Longitud: ${item.longitud || 'N/A'}m`}
            left={props => (
                <List.Icon
                    {...props}
                    icon="cable-data"
                    color={getSyncColor(item.synced)}
                />
            )}
            right={props => <List.Icon {...props} icon="chevron-right" />}
            onPress={() => {
                console.log('Tirante seleccionado:', item.id);
            }}
        />
    );

    return (
        <View style={styles.container}>
            <Appbar.Header>
                <Appbar.BackAction onPress={() => router.back()} />
                <Appbar.Content title="Tirantes" />
            </Appbar.Header>

            <FlatList
                data={tirantes}
                keyExtractor={(item) => item.id.toString()}
                renderItem={renderItem}
                ListEmptyComponent={
                    <View style={styles.emptyContainer}>
                        <Text>No hay tirantes registrados para este soporte.</Text>
                    </View>
                }
            />

            <FAB
                icon="plus"
                label="Agregar Tirante"
                onPress={() => router.push(`/loteos/${id}/(tabs)/soportes/${id}/tirantes/new`)}
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
