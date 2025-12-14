import { useLoteo } from "@/src/contexts/LoteoContext";
import { getCamarasBySoporteId } from "@/src/database/queries/camaras";
import { getEmpalmesBySoporteId } from "@/src/database/queries/empalmes";
import { getEstructurasBySoporteId } from "@/src/database/queries/estructuras";
import { getLuminariasBySoporteId } from "@/src/database/queries/luminarias";
import { getPostesBySoporteId } from "@/src/database/queries/postes";
import { getSeccionamientosBySoporteId } from "@/src/database/queries/seccionamientos";
import { getSoporteById, hardDeleteSoporte } from "@/src/database/queries/soportes";
import { getSubestacionesBySoporteId } from "@/src/database/queries/subestaciones";
import { getTierrasBySoporteId } from "@/src/database/queries/tierras";
import { getTirantesBySoporteId } from "@/src/database/queries/tirantes";
import { Camara, Empalme, Estructura, Luminaria, Poste, Seccionamiento, Soporte, Subestacion, Tierra, Tirante } from "@/src/types";
import { useFocusEffect, useLocalSearchParams, useRouter } from "expo-router";
import { useSQLiteContext } from "expo-sqlite";
import React, { useEffect, useState } from "react";
import { Alert, ScrollView, StyleSheet, View } from "react-native";
import { Appbar, Avatar, Card, Divider, FAB, Text, TouchableRipple } from "react-native-paper";


type SoporteElements = {
    camaras?: Camara[];
    empalmes?: Empalme[];
    estructuras?: Estructura[];
    luminarias?: Luminaria[];
    postes?: Poste[];
    seccionamientos?: Seccionamiento[];
    subestaciones?: Subestacion[];
    tierras?: Tierra[];
    tirantes?: Tirante[];
}

export default function SoporteDetails() {
    const { id } = useLocalSearchParams<{ id: string }>();
    const { currentLoteoId } = useLoteo();
    const router = useRouter();
    const db = useSQLiteContext();
    const [soporte, setSoporte] = useState<Soporte | null>(null);
    const [fabOpen, setFabOpen] = useState(false);
    const [soporteElements, setSoporteElements] = useState<SoporteElements>({});

    console.log({ id, currentLoteoId })
    console.log(soporteElements)

    useEffect(() => {
        loadSoporteDetails();
    }, [id]);

    useFocusEffect(
        React.useCallback(() => {
            getSoporteElements(Number(id));
        }, [id])
    );

    const loadSoporteDetails = async () => {
        if (!id) return;

        try {
            // const result = await db.getFirstAsync<Soporte>(
            //     `SELECT * FROM soportes WHERE id = ?`,
            //     [id]
            // );
            const result = await getSoporteById(db, Number(id)) as Soporte
            setSoporte(result);
            await getSoporteElements(Number(id));
        } catch (err) {
            console.error("Error loading soporte:", err);
        }
    };

    const navigateTo = (path: string) => {
        router.push(`/loteos/${currentLoteoId}/(tabs)/soportes/${id}/${path}`);
    };

    const handleDeleteSoporte = async () => {
        try {
            await hardDeleteSoporte(db, Number(id))
            Alert.alert(
                'Soporte eliminado',
                'El soporte ha sido eliminado correctamente',
                [
                    {
                        text: 'Aceptar',
                        onPress: () => router.back(),
                    },
                ]
            )
            // router.back()
        } catch (error) {
            console.error(error)
        }
    }

    const getSoporteElements = async (id_soporte: number) => {
        try {
            const camaras = await getCamarasBySoporteId(db, id_soporte) as Camara[]
            const empalmes = await getEmpalmesBySoporteId(db, id_soporte) as Empalme[]
            const estructuras = await getEstructurasBySoporteId(db, id_soporte) as Estructura[]
            const luminarias = await getLuminariasBySoporteId(db, id_soporte) as Luminaria[]
            const postes = await getPostesBySoporteId(db, id_soporte) as Poste[]
            const seccionamientos = await getSeccionamientosBySoporteId(db, id_soporte) as Seccionamiento[]
            const subestaciones = await getSubestacionesBySoporteId(db, id_soporte) as Subestacion[]
            const tierras = await getTierrasBySoporteId(db, id_soporte) as Tierra[]
            const tirantes = await getTirantesBySoporteId(db, id_soporte) as Tirante[]
            setSoporteElements({ camaras, empalmes, estructuras, luminarias, postes, seccionamientos, subestaciones, tierras, tirantes })

            // console.log({ soporteElements })

            // crear las siguientes funciones en 

        } catch (error) {
            console.error(error)
        }
    }


    return (
        <View style={styles.container}>
            <Appbar.Header>
                <Appbar.BackAction onPress={() => router.back()} />
                <Appbar.Content title={`Soporte #${id}`} />
                <Appbar.Action icon="map" onPress={() => router.push(`/loteos/${currentLoteoId}`)} />
                {/* <Appbar.Action icon={'plus'} onPress={getSoporteElements} /> */}
            </Appbar.Header>

            <ScrollView style={styles.content}>
                {/* {soporte && (
                    <Card style={styles.infoCard}>
                        <Card.Content>
                            <Text variant="titleMedium" style={styles.cardTitle}>
                                Información del Soporte
                            </Text>
                            <View style={styles.infoRow}>
                                <Text variant="bodyMedium" style={styles.label}>Tipo:</Text>
                                <Text variant="bodyMedium">{soporte.tipo}</Text>
                            </View>
                            <View style={styles.infoRow}>
                                <Text variant="bodyMedium" style={styles.label}>Latitud:</Text>
                                <Text variant="bodyMedium">{soporte.latitud.toFixed(6)}</Text>
                            </View>
                            <View style={styles.infoRow}>
                                <Text variant="bodyMedium" style={styles.label}>Longitud:</Text>
                                <Text variant="bodyMedium">{soporte.longitud.toFixed(6)}</Text>
                            </View>
                        </Card.Content>
                    </Card>
                )} */}

                {/* Element Cards */}
                {renderElementCard('Postes', 'transmission-tower', soporteElements.postes, (item: Poste) => (
                    <>

                        <View style={styles.infoRow}>
                            <Text>#{item.id} {item.placa}</Text>
                            <Text>{item.material} {item.altura_nivel_tension}</Text>
                        </View>
                    </>
                ), (item) => navigateTo(`postes?id_elemento=${item.id}`))}

                {renderElementCard('Cámaras', 'square-outline', soporteElements.camaras, (item: Camara) => (
                    <>
                        {item.placa && (
                            <View style={styles.infoRow}>
                                <Text>#{item.id} {item.placa}</Text>
                                <Text>TIPO: {item.tipo_camara}</Text>
                            </View>
                        )}
                    </>
                ), (item) => navigateTo(`camaras?id_elemento=${item.id}`))}

                {renderElementCard('Estructuras', 'railroad-light', soporteElements.estructuras, (item: Estructura) => (
                    <>
                        <View style={styles.infoRow}>
                            <Text>#{item.id} {item.nivel_tension}</Text>
                            <Text>{item.descripcion} {item.fases}F</Text>
                        </View>
                    </>
                ), (item) => navigateTo(`estructuras?id_elemento=${item.id}`))}



                {renderElementCard('Subestaciones', 'circle-multiple-outline', soporteElements.subestaciones, (item: Subestacion) => (
                    <>
                        <View style={styles.infoRow}>
                            <Text>#{item.id} S/E {item.letrero}</Text>
                            <Text>{item.potencia}kVA - {item.fases}F</Text>
                        </View>
                    </>
                ), (item) => navigateTo(`subestaciones?id_elemento=${item.id}`))}

                {renderElementCard('Seccionamientos', 'electric-switch', soporteElements.seccionamientos, (item: Seccionamiento) => (
                    <>
                        <View style={styles.infoRow}>
                            <Text>#{item.id} {item.tipo} {item.letrero}</Text>
                            <Text>{item.posicion} {item.fases}F</Text>
                        </View>
                    </>
                ), (item) => navigateTo(`seccionamientos?id_elemento=${item.id}`))}


                {renderElementCard('Luminarias', 'lightbulb-on-outline', soporteElements.luminarias, (item: Luminaria) => (
                    <>
                        <View style={styles.infoRow}>
                            <Text style={styles.label}>ID:</Text>
                            <Text>#{item.id}</Text>
                        </View>
                        <View style={styles.infoRow}>
                            <Text style={styles.label}>Tipo:</Text>
                            <Text>{item.tipo_lampara}</Text>
                        </View>
                        <View style={styles.infoRow}>
                            <Text style={styles.label}>Potencia:</Text>
                            <Text>{item.potencia}W</Text>
                        </View>
                        {item.condicion && (
                            <View style={styles.infoRow}>
                                <Text style={styles.label}>Condición:</Text>
                                <Text>{item.condicion}</Text>
                            </View>
                        )}
                    </>
                ), (item) => navigateTo(`luminarias?id_elemento=${item.id}`))}

                {renderElementCard('Empalmes', 'home-lightning-bolt-outline', soporteElements.empalmes, (item: Empalme) => (
                    <>
                        <View style={styles.infoRow}>
                            <Text>#{item.id} {item.n_medidor}</Text>
                            <Text>{item.nivel_tension} {item.fases}F - {item.activo ? 'Activo' : 'Inactivo'}</Text>
                        </View>
                    </>
                ), (item) => navigateTo(`empalmes?id_elemento=${item.id}`))}

                {renderElementCard('Tierras', 'filter-variant', soporteElements.tierras, (item: Tierra) => (
                    <>
                        <View style={styles.infoRow}>
                            <Text>#{item.id} Tipo: {item.tipo}</Text>
                        </View>
                    </>
                ), (item) => navigateTo(`tierras?id_elemento=${item.id}`))}

                {renderElementCard('Tirantes', 'anchor', soporteElements.tirantes, (item: Tirante) => (
                    <>
                        <View style={styles.infoRow}>
                            <Text>#{item.id} {item.nivel_tension}</Text>
                            <Text>{item.tipo} {item.fijacion}</Text>
                        </View>
                    </>
                ), (item) => navigateTo(`tirantes?id_elemento=${item.id}`))}


                <Card style={styles.instructionCard}>
                    <Card.Content>
                        <Text variant="bodyMedium" style={styles.instructionText}>
                            Usa el botón + para agregar características a este soporte
                        </Text>
                    </Card.Content>
                </Card>
            </ScrollView>
            {/* en el fab group, si el tipo de soporte es poste, no se muestra el boton de Cámaras, si es camara, no se muestra el boton de Postes */}
            <FAB.Group
                open={fabOpen}
                visible
                icon={fabOpen ? 'close' : 'plus'}
                actions={[
                    // boton para eliminar el soporte
                    {
                        icon: 'delete',
                        label: 'Eliminar',
                        onPress: () => Alert.alert('Eliminar soporte', '¿Estás seguro de eliminar este soporte?', [
                            {
                                text: 'Cancelar',
                                onPress: () => console.log('Cancelado'),
                                style: 'cancel',
                            },
                            {
                                text: 'Eliminar',
                                onPress: handleDeleteSoporte,
                            },
                        ]),
                    },
                    ,// Solo mostrar Postes si el soporte NO es CAMARA y NO tiene ya un poste
                    (soporte?.tipo == 'POSTE' && (!soporteElements.postes || soporteElements.postes.length === 0)) && {
                        icon: 'transmission-tower',
                        label: 'Postes',
                        onPress: () => navigateTo('postes/new'),
                    },
                    // Solo mostrar Cámaras si el soporte NO es POSTE y NO tiene ya una camara
                    (soporte?.tipo == 'CAMARA' && (!soporteElements.camaras || soporteElements.camaras.length === 0)) && {
                        icon: 'square-outline',
                        label: 'Cámaras',
                        onPress: () => navigateTo('camaras/new'),
                    },
                    {
                        // icon: 'cube-outline',
                        // icon: 'lightning-bolt-outline',
                        icon: 'railroad-light',
                        label: 'Estructuras',
                        onPress: () => navigateTo('estructuras/new'),
                    },
                    {
                        icon: 'electric-switch',
                        label: 'Seccionamientos',
                        onPress: () => navigateTo('seccionamientos/new'),
                    },
                    {
                        icon: 'circle-multiple-outline',
                        label: 'Subestaciones',
                        onPress: () => navigateTo('subestaciones/new'),
                    },
                    soporte?.tipo == 'POSTE' && {
                        icon: 'anchor',
                        label: 'Tirantes',
                        onPress: () => navigateTo('tirantes/new'),
                    },
                    {
                        // icon: 'arrow-down-thin-circle-outline',
                        icon: 'filter-variant',
                        label: 'Tierras',
                        onPress: () => navigateTo('tierras/new'),
                    },
                    {
                        // icon: 'meter-electric-outline',
                        icon: 'home-lightning-bolt-outline',
                        label: 'Empalmes',
                        onPress: () => navigateTo('empalmes/new'),
                    },


                    soporte?.tipo == 'POSTE' && {
                        icon: 'lightbulb-on-outline',
                        label: 'Luminarias',
                        onPress: () => navigateTo('luminarias/new'),
                    },
                ].filter((action): action is { icon: string; label: string; onPress: () => void } => Boolean(action))} // Filtrar valores false/undefined
                onStateChange={({ open }) => setFabOpen(open)}
                onPress={() => {
                    if (fabOpen) {
                        // do nothing
                    }
                }}
            />
        </View>
    );
}

const renderElementCard = (title: string, icon: string, elements: any[] | undefined, renderContent: (item: any) => React.ReactNode, onItemPress?: (item: any) => void) => {
    if (!elements || elements.length === 0) return null;
    return (
        <Card style={styles.elementCard}>
            <Card.Content>
                <View style={styles.elementHeader}>
                    <Avatar.Icon size={32} icon={icon} style={styles.elementIcon} color="#2196F3" />
                    <Text style={styles.elementTitle}>{title} ({elements.length})</Text>
                </View>
                {elements.map((item, index) => (
                    <TouchableRipple key={index} onPress={() => onItemPress && onItemPress(item)}>
                        <View>
                            {index > 0 && <Divider style={{ marginVertical: 8 }} />}
                            {renderContent(item)}
                        </View>
                    </TouchableRipple>
                ))}
            </Card.Content>
        </Card>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f5f5f5',
    },
    content: {
        flex: 1,
        padding: 16,
    },
    infoCard: {
        marginBottom: 16,
    },
    instructionCard: {
        marginBottom: 16,
        backgroundColor: '#E3F2FD',
    },
    instructionText: {
        textAlign: 'center',
        color: '#1976D2',
    },
    cardTitle: {
        marginBottom: 12,
        fontWeight: 'bold',
    },
    infoRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 8,
    },
    label: {
        fontWeight: '600',
        color: '#666',
    },
    elementHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 12
    },
    elementIcon: {
        backgroundColor: '#E3F2FD'
    },
    elementTitle: {
        marginLeft: 12,
        fontWeight: 'bold',
        fontSize: 16
    },
    elementCard: {
        marginBottom: 12,
        // borderLeftWidth: 4,
        // borderLeftColor: '#2196F3'
    }
});
