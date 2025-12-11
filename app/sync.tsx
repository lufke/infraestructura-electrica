import { Stack } from "expo-router";
import { useSQLiteContext } from "expo-sqlite";
import { useEffect, useState } from "react";
import { ScrollView, StyleSheet, View } from "react-native";
import { ActivityIndicator, Button, List, ProgressBar, Text, useTheme } from "react-native-paper";
import { getUnsyncedCounts, syncDatabase } from "../src/services/dbSync";

export default function SyncScreen() {
    const db = useSQLiteContext();
    const theme = useTheme();
    const [counts, setCounts] = useState<Record<string, number>>({});
    const [loading, setLoading] = useState(false);
    const [syncing, setSyncing] = useState(false);
    const [progress, setProgress] = useState(0);
    const [statusMessage, setStatusMessage] = useState("");

    const refreshCounts = async () => {
        setLoading(true);
        try {
            const results = await getUnsyncedCounts(db);
            setCounts(results);
        } catch (e) {
            console.error(e);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        refreshCounts();
    }, []);

    const handleSync = async () => {
        setSyncing(true);
        setStatusMessage("Iniciando sincronización...");
        setProgress(0);

        try {
            await syncDatabase(db, (current, total, message) => {
                setProgress(current / total);
                setStatusMessage(message);
            });
            setStatusMessage("¡Sincronización completada!");
            await refreshCounts();
        } catch (e) {
            setStatusMessage("Error durante la sincronización");
            console.error(e);
        } finally {
            setSyncing(false);
        }
    };

    const totalUnsynced = Object.values(counts).reduce((a, b) => a + b, 0);

    return (
        <View style={{ flex: 1, backgroundColor: theme.colors.background }}>
            <Stack.Screen options={{ title: "Sincronización" }} />

            <View style={styles.header}>
                <Text variant="headlineMedium" style={{ fontWeight: "bold" }}>Sincronización</Text>
                <Text variant="bodyLarge" style={{ color: theme.colors.outline }}>
                    {totalUnsynced} elementos pendientes
                </Text>
            </View>

            {syncing && (
                <View style={styles.progressContainer}>
                    <Text variant="bodyMedium" style={{ marginBottom: 5 }}>{statusMessage}</Text>
                    <ProgressBar progress={progress} color={theme.colors.primary} style={{ height: 8, borderRadius: 4 }} />
                </View>
            )}

            <ScrollView contentContainerStyle={styles.list}>
                {loading ? (
                    <ActivityIndicator style={{ marginTop: 20 }} />
                ) : (
                    Object.entries(counts).map(([table, count]) => (
                        count > 0 && (
                            <List.Item
                                key={table}
                                title={table.toUpperCase()}
                                description={`${count} registros pendientes`}
                                left={props => <List.Icon {...props} icon="database-clock" />}
                                right={props => <Text {...props} style={{ alignSelf: "center", fontWeight: "bold" }}>{count}</Text>}
                                style={{ backgroundColor: theme.colors.surface, marginBottom: 1, borderRadius: 8 }}
                            />
                        )
                    ))
                )}
                {!loading && totalUnsynced === 0 && !syncing && (
                    <View style={styles.emptyState}>
                        <List.Icon icon="check-circle" color={theme.colors.primary} />
                        <Text variant="bodyLarge">Todo sincronizado</Text>
                    </View>
                )}
            </ScrollView>

            <View style={styles.footer}>
                <Button
                    mode="contained"
                    onPress={handleSync}
                    loading={syncing}
                    disabled={syncing || totalUnsynced === 0}
                    contentStyle={{ height: 50 }}
                >
                    {syncing ? "Sincronizando..." : "Sincronizar Ahora"}
                </Button>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    header: {
        padding: 20,
        backgroundColor: "transparent",
    },
    progressContainer: {
        paddingHorizontal: 20,
        paddingBottom: 10,
    },
    list: {
        paddingHorizontal: 16,
        paddingBottom: 100,
    },
    emptyState: {
        alignItems: "center",
        justifyContent: "center",
        padding: 40,
    },
    footer: {
        position: "absolute",
        bottom: 0,
        left: 0,
        right: 0,
        padding: 16,
        backgroundColor: "white", // Or theme surface
        elevation: 4,
    }
});
