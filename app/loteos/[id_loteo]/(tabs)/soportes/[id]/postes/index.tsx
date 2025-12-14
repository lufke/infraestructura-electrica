import { getPosteById } from "@/src/database/queries/postes";
import { Poste } from "@/src/types";
import { useFocusEffect, useLocalSearchParams, useRouter } from "expo-router";
import { useSQLiteContext } from "expo-sqlite";
import React, { useCallback, useState } from "react";
import { Alert, ScrollView, StyleSheet, View } from "react-native";
import { ActivityIndicator, Appbar, Card, Divider, Text } from "react-native-paper";

export default function PosteDetail() {
    const { id_loteo, id, id_elemento } = useLocalSearchParams<{ id_loteo: string, id: string, id_elemento: string }>();
    const router = useRouter();
    const db = useSQLiteContext();
    const [poste, setPoste] = useState<Poste | null>(null);
    const [loading, setLoading] = useState(true);

    const loadData = async () => {
        if (!id_elemento) return;
        setLoading(true);
        try {
            const result = await getPosteById(db, Number(id_elemento)) as Poste;
            setPoste(result);
        } catch (err) {
            console.error("Error loading poste:", err);
            Alert.alert("Error", "No se pudo cargar la información del poste.");
        } finally {
            setLoading(false);
        }
    };

    useFocusEffect(
        useCallback(() => {
            loadData();
        }, [id_elemento])
    );

    if (loading) return <View style={styles.loadingContainer}><ActivityIndicator size="large" /></View>;

    if (!poste) {
        return (
            <View style={styles.container}>
                <Appbar.Header>
                    <Appbar.BackAction onPress={() => router.back()} />
                    <Appbar.Content title="Detalle de Poste" />
                </Appbar.Header>
                <View style={styles.emptyContainer}>
                    <Text>No se encontró el poste.</Text>
                </View>
            </View>
        );
    }

    return (
        <View style={styles.container}>
            <Appbar.Header>
                <Appbar.BackAction onPress={() => router.back()} />
                <Appbar.Content title={`Poste #${poste.id}`} />
                <Appbar.Action icon="pencil" onPress={() => {
                    <Appbar.Action icon="pencil" onPress={() => {
                        router.push({
                            pathname: `/loteos/${id_loteo}/(tabs)/soportes/${id}/postes/edit`,
                            params: { id_elemento: poste.id }
                        } as any);
                    }} />
                }} />
            </Appbar.Header>

            <ScrollView style={styles.content}>
                <Card style={styles.card}>
                    <Card.Content>
                        <Text variant="titleLarge" style={styles.title}>Información General</Text>
                        <Divider style={styles.divider} />

                        <DetailRow label="ID" value={`#${poste.id}`} />
                        <DetailRow label="Placa" value={poste.placa || "Sin Placa"} />
                        <DetailRow label="Condición" value={poste.condicion} />
                        <DetailRow label="Notas" value={poste.notas} />
                        <DetailRow label="Material" value={poste.material} />
                        <DetailRow label="Altura" value={poste.altura ? `${poste.altura}m` : "N/A"} />
                        <DetailRow label="Tensión" value={poste.altura_nivel_tension} />

                        <Divider style={styles.divider} />
                        {/* Audit Info */}
                        <DetailRow label="Sincronizado" value={poste.synced === 1 ? "Sí" : "No"} />
                    </Card.Content>
                </Card>
            </ScrollView>
        </View>
    );
}

const DetailRow = ({ label, value }: { label: string, value: string | number | null | undefined }) => (
    <View style={styles.row}>
        <Text variant="bodyMedium" style={styles.label}>{label}:</Text>
        <Text variant="bodyMedium" style={styles.value}>{value || "-"}</Text>
    </View>
);

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f5f5f5',
    },
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    emptyContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    content: {
        padding: 16,
    },
    card: {
        marginBottom: 16,
    },
    title: {
        marginBottom: 8,
        fontWeight: 'bold',
    },
    divider: {
        marginBottom: 16,
    },
    row: {
        flexDirection: 'row',
        marginBottom: 12,
        alignItems: 'center' // Align mostly for multiline text if strictly row
    },
    label: {
        fontWeight: 'bold',
        width: 120,
        color: '#666',
    },
    value: {
        flex: 1,
        color: '#333',
    }
});
