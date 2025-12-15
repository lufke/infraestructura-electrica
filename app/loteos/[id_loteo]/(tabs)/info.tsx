import ExportJsonButton from "@/src/components/ui/ExportJSONButton";
import { useLoteo } from "@/src/contexts/LoteoContext";
import { getLineasBTByLoteoId } from "@/src/database/queries/lineas_bt";
import { getLineasMTByLoteoId } from "@/src/database/queries/lineas_mt";
import { getLoteoById } from "@/src/database/queries/loteos";
import { getSoportesByLoteoId } from "@/src/database/queries/soportes";
import { Loteo } from "@/src/types";
import { useFocusEffect } from "expo-router";
import { useSQLiteContext } from "expo-sqlite";
import { useCallback, useState } from "react";
import { ActivityIndicator, RefreshControl, ScrollView, StyleSheet, View } from "react-native";
import { Avatar, Card, Divider, Text, useTheme } from "react-native-paper";

export default function Info() {
    const db = useSQLiteContext();
    const { currentLoteoId } = useLoteo();
    const theme = useTheme();
    const [loteo, setLoteo] = useState<Loteo | null>(null);
    const [stats, setStats] = useState({
        postes: 0,
        camaras: 0,
        lineasBT: 0,
        lineasMT: 0,
        metrosBT: 0,
        metrosMT: 0
    });
    const [loading, setLoading] = useState(false);
    const [refreshing, setRefreshing] = useState(false);

    const loadData = useCallback(async () => {
        if (!currentLoteoId) return;

        try {
            setLoading(true);
            const [loteoData, soportesData, btData, mtData] = await Promise.all([
                getLoteoById(db, currentLoteoId),
                getSoportesByLoteoId(db, currentLoteoId),
                getLineasBTByLoteoId(db, currentLoteoId),
                getLineasMTByLoteoId(db, currentLoteoId)
            ]);

            setLoteo(loteoData as Loteo);

            const soportes = soportesData as any[];
            const bt = btData as any[];
            const mt = mtData as any[];

            setStats({
                postes: soportes.filter(s => s.tipo === 'POSTE').length,
                camaras: soportes.filter(s => s.tipo === 'CAMARA').length,
                lineasBT: bt.length,
                lineasMT: mt.length,
                metrosBT: Math.round(bt.reduce((acc, curr) => acc + (curr.largo || 0), 0)),
                metrosMT: Math.round(mt.reduce((acc, curr) => acc + (curr.largo || 0), 0))
            });

        } catch (err) {
            console.error("Error loading info:", err);
        } finally {
            setLoading(false);
            setRefreshing(false);
        }
    }, [currentLoteoId, db]);

    useFocusEffect(
        useCallback(() => {
            loadData();
        }, [loadData])
    );

    const onRefresh = useCallback(() => {
        setRefreshing(true);
        loadData();
    }, [loadData]);

    if (loading && !refreshing && !loteo) {
        return (
            <View style={styles.centerContainer}>
                <ActivityIndicator size="large" color={theme.colors.primary} />
                <Text style={{ marginTop: 10 }}>Cargando información...</Text>
            </View>
        );
    }

    if (!loteo) {
        return (
            <View style={styles.centerContainer}>
                <Text>No se encontró información del loteo.</Text>
            </View>
        );
    }

    return (
        <ScrollView
            contentContainerStyle={styles.container}
            refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
        >
            <Card style={styles.headerCard}>
                <Card.Content style={styles.headerContent}>
                    <Avatar.Icon size={64} icon="city-variant-outline" style={{ backgroundColor: theme.colors.primaryContainer }} />
                    <View style={styles.headerText}>
                        <Text variant="headlineSmall" style={{ fontWeight: 'bold' }}>{loteo.nombre}</Text>
                        <Text variant="bodyMedium" style={{ color: theme.colors.outline }}>ID: {loteo.id}</Text>
                        <Text variant="bodySmall" style={{ marginTop: 4 }}>
                            Creado: {new Date(String(loteo.created_at || '')).toLocaleDateString()}
                        </Text>
                    </View>
                </Card.Content>
            </Card>

            <Divider style={styles.divider} />

            <Text variant="titleMedium" style={styles.sectionTitle}>Resumen de Red</Text>

            <View style={styles.statsGrid}>
                <StatCard
                    label="Postes"
                    value={stats.postes.toLocaleString('es-CL')}
                    icon="transmission-tower"
                    color="#795548"
                />
                <StatCard
                    label="Cámaras"
                    value={stats.camaras.toLocaleString('es-CL')}
                    icon="circle-double"
                    color="#607D8B"
                />
                <StatCard
                    label="Líneas BT"
                    value={`${stats.metrosBT.toLocaleString('es-CL')} m`}
                    subvalue={`(${stats.lineasBT.toLocaleString('es-CL')} tramos)`}
                    icon="flash"
                    color="#FFC107"
                />
                <StatCard
                    label="Líneas MT"
                    value={`${stats.metrosMT.toLocaleString('es-CL')} m`}
                    subvalue={`(${stats.lineasMT.toLocaleString('es-CL')} tramos)`}
                    icon="lightning-bolt"
                    color="#F44336"
                />
            </View>

            <View style={styles.actionsContainer}>
                <ExportJsonButton loteoId={currentLoteoId} />
            </View>
        </ScrollView>
    );
}

const StatCard = ({ label, value, subvalue, icon, color }: { label: string, value: string, subvalue?: string, icon: string, color: string }) => (
    <Card style={styles.statCard}>
        <Card.Content style={styles.statContent}>
            <Avatar.Icon size={40} icon={icon} style={{ backgroundColor: 'transparent' }} color={color} />
            <Text variant="headlineMedium" style={{ fontWeight: 'bold', color }}>{value}</Text>
            {subvalue && <Text variant="bodySmall" style={{ color: 'gray' }}>{subvalue}</Text>}
            <Text variant="bodySmall" style={{ textAlign: 'center', marginTop: 4 }}>{label}</Text>
        </Card.Content>
    </Card>
);

const styles = StyleSheet.create({
    container: {
        padding: 16,
        paddingBottom: 40,
    },
    centerContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    headerCard: {
        marginBottom: 16,
        elevation: 2,
    },
    headerContent: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    headerText: {
        marginLeft: 16,
        flex: 1,
    },
    divider: {
        marginVertical: 16,
    },
    sectionTitle: {
        marginBottom: 12,
        fontWeight: 'bold',
    },
    statsGrid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'space-between',
        marginBottom: 24,
    },
    statCard: {
        width: '48%', // 2 columns approx
        marginBottom: 12,
        alignItems: 'center',
        elevation: 1,
    },
    statContent: {
        alignItems: 'center',
        paddingVertical: 12,
    },
    actionsContainer: {
        marginTop: 'auto',
    }
});