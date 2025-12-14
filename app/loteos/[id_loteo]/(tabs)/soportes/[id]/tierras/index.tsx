import { getTierraById } from "@/src/database/queries/tierras";
import { Tierra } from "@/src/types";
import { useFocusEffect, useLocalSearchParams, useRouter } from "expo-router";
import { useSQLiteContext } from "expo-sqlite";
import React, { useCallback, useState } from "react";
import { Alert, ScrollView, StyleSheet, View } from "react-native";
import { ActivityIndicator, Appbar, Card, Divider, Text } from "react-native-paper";

export default function TierraDetail() {
    const { id_loteo, id, id_elemento } = useLocalSearchParams<{ id_loteo: string, id: string, id_elemento: string }>();
    const router = useRouter();
    const db = useSQLiteContext();
    const [tierra, setTierra] = useState<Tierra | null>(null);
    const [loading, setLoading] = useState(true);

    const loadData = async () => {
        if (!id_elemento) return;
        setLoading(true);
        try {
            const result = await getTierraById(db, Number(id_elemento)) as Tierra;
            setTierra(result);
        } catch (err) {
            console.error("Error loading tierra:", err);
            Alert.alert("Error", "No se pudo cargar la información de la tierra.");
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
    if (!tierra) return <View style={styles.emptyContainer}><Text>No se encontró la tierra.</Text></View>;

    return (
        <View style={styles.container}>
            <Appbar.Header>
                <Appbar.BackAction onPress={() => router.back()} />
                <Appbar.Content title={`Tierra #${tierra.id}`} />
                <Appbar.Action icon="pencil" onPress={() => {
                    router.push({
                        pathname: `/loteos/${id_loteo}/(tabs)/soportes/${id}/tierras/edit`,
                        params: { id_elemento: tierra.id }
                    } as any);
                }} />
            </Appbar.Header>

            <ScrollView style={styles.content}>
                <Card style={styles.card}>
                    <Card.Content>
                        <Text variant="titleLarge" style={styles.title}>Información General</Text>
                        <Divider style={styles.divider} />

                        <DetailRow label="ID" value={`#${tierra.id}`} />
                        <DetailRow label="Tipo" value={tierra.tipo} />
                        <DetailRow label="Condición" value={tierra.condicion} />
                        <DetailRow label="Notas" value={tierra.notas} />

                        <Divider style={styles.divider} />
                        <DetailRow label="Sincronizado" value={tierra.synced === 1 ? "Sí" : "No"} />
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
    container: { flex: 1, backgroundColor: '#f5f5f5' },
    loadingContainer: { flex: 1, justifyContent: 'center', alignItems: 'center' },
    emptyContainer: { flex: 1, justifyContent: 'center', alignItems: 'center' },
    content: { padding: 16 },
    card: { marginBottom: 16 },
    title: { marginBottom: 8, fontWeight: 'bold' },
    divider: { marginBottom: 16 },
    row: { flexDirection: 'row', marginBottom: 12, alignItems: 'center' },
    label: { fontWeight: 'bold', width: 120, color: '#666' },
    value: { flex: 1, color: '#333' }
});
