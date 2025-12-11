import { useAuth } from "@/src/contexts/AuthContext";
import { useLoteo } from "@/src/contexts/LoteoContext";
import { getCamarasByLoteoId } from "@/src/database/queries/camaras";
import { getPostesByLoteoId } from "@/src/database/queries/postes";
import { addSoporte, getSoportesByLoteoId } from "@/src/database/queries/soportes";
import * as Location from "expo-location";
import { useFocusEffect, useRouter } from "expo-router";
import { useSQLiteContext } from "expo-sqlite";
import React, { useEffect, useRef, useState } from "react";
import { Alert, StyleSheet, View } from "react-native";
import MapView, { Marker, Polyline, PROVIDER_GOOGLE, Region } from "react-native-maps";
import { Button, Chip, Dialog, FAB, IconButton, Portal, RadioButton, Text } from "react-native-paper";

// Constantes para la región
const VERTICAL_150M = 0.00135; // 150 metros verticales
const HORIZONTAL_ASPECT_RATIO = 1.25; // Relación de aspecto (ancho/alto)

export default function Mapa() {
    const { currentLoteoId, setCurrentSoporteId } = useLoteo();
    const { session } = useAuth();
    const router = useRouter();
    const db = useSQLiteContext();
    const mapRef = useRef<MapView | null>(null);

    const [userLocation, setUserLocation] = useState<{ latitude: number; longitude: number; altitude?: number | null; accuracy?: number | null } | null>(null);
    const [markers, setMarkers] = useState<Array<{ id: number; latitude: number; longitude: number; tipo: string; placa?: string }>>([]);
    const [region, setRegion] = useState<Region>({
        latitude: -33.45,
        longitude: -70.6667,
        latitudeDelta: VERTICAL_150M, // 150 metros verticales
        longitudeDelta: VERTICAL_150M * HORIZONTAL_ASPECT_RATIO, // Proporcional al alto
    });

    // Estado para el dialog de agregar soporte
    const [dialogVisible, setDialogVisible] = useState(false);
    const [selectedType, setSelectedType] = useState<string>("POSTE");
    const [pendingLocation, setPendingLocation] = useState<{ latitude: number; longitude: number; altitude?: number | null; accuracy?: number | null } | null>(null);

    // Estados para la funcionalidad de línea entre soportes
    const [selectedSoportes, setSelectedSoportes] = useState<Array<{ id: number; latitude: number; longitude: number; tipo: string; placa?: string }>>([]);
    const [showLine, setShowLine] = useState(false);
    const [distance, setDistance] = useState<number | null>(null);
    const [isLineMode, setIsLineMode] = useState<'linea_bt' | 'linea_mt' | null>(null);

    // Estado para FAB.Group
    const [fabOpen, setFabOpen] = useState(false);

    // Cargar soportes
    const loadSoportes = async () => {
        if (!currentLoteoId) return;
        try {
            const [soportes, postes, camaras] = await Promise.all([
                getSoportesByLoteoId(db, currentLoteoId),
                getPostesByLoteoId(db, currentLoteoId),
                getCamarasByLoteoId(db, currentLoteoId)
            ]);

            const mappedMarkers = (soportes as any[]).map(s => {
                let placa = undefined;
                if (s.tipo === 'POSTE') {
                    placa = (postes as any[]).find(p => p.id_soporte === s.id)?.placa;
                } else if (s.tipo === 'CAMARA') {
                    placa = (camaras as any[]).find(c => c.id_soporte === s.id)?.placa;
                }

                return {
                    id: s.id,
                    latitude: s.latitud,
                    longitude: s.longitud,
                    tipo: s.tipo,
                    placa
                };
            });
            setMarkers(mappedMarkers);
        } catch (error) {
            console.error("Error cargando soportes:", error);
        }
    };

    useFocusEffect(
        React.useCallback(() => {
            loadSoportes();
            // Resetear selección al cambiar de loteo
            resetLineMode();
        }, [currentLoteoId])
    );

    // Solicitar permisos y obtener ubicación
    useEffect(() => {
        (async () => {
            try {
                const { status } = await Location.requestForegroundPermissionsAsync();
                if (status !== "granted") {
                    Alert.alert("Permiso denegado", "No se concedió permiso para acceder a la ubicación.");
                    return;
                }
                const pos = await Location.getCurrentPositionAsync({ accuracy: Location.Accuracy.High });
                const { latitude, longitude, altitude, accuracy } = pos.coords;
                setUserLocation({ latitude, longitude, altitude, accuracy });

                const newRegion = {
                    latitude,
                    longitude,
                    latitudeDelta: VERTICAL_150M, // 150 metros verticales
                    longitudeDelta: VERTICAL_150M * HORIZONTAL_ASPECT_RATIO, // Proporcional
                };
                setRegion(newRegion);
                mapRef.current?.animateToRegion(newRegion, 800);
            } catch (err) {
                console.warn("Error al obtener ubicación:", err);
            }
        })();
    }, []);

    // Función para calcular distancia en metros (fórmula de Haversine)
    const calculateDistance = (coord1: { latitude: number; longitude: number }, coord2: { latitude: number; longitude: number }) => {
        const R = 6371000; // Radio de la Tierra en metros
        const lat1 = coord1.latitude * Math.PI / 180;
        const lat2 = coord2.latitude * Math.PI / 180;
        const deltaLat = (coord2.latitude - coord1.latitude) * Math.PI / 180;
        const deltaLon = (coord2.longitude - coord1.longitude) * Math.PI / 180;

        const a = Math.sin(deltaLat / 2) * Math.sin(deltaLat / 2) +
            Math.cos(lat1) * Math.cos(lat2) *
            Math.sin(deltaLon / 2) * Math.sin(deltaLon / 2);
        const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

        return Math.round(R * c); // Distancia en metros (redondeada)
    };

    // Formatear distancia para mostrar
    const formatDistance = (meters: number) => {
        if (meters >= 1000) {
            return `${(meters / 1000).toFixed(2)} km`;
        }
        return `${meters} m`;
    };

    const resetLineMode = () => {
        setSelectedSoportes([]);
        setShowLine(false);
        setDistance(null);
        setIsLineMode(null);
        setFabOpen(false);
    };

    const handleMarkerPress = (marker: { id: number; latitude: number; longitude: number; tipo: string; placa?: string }) => {
        // Si estamos en modo línea (BT o MT)
        if (isLineMode) {
            const isAlreadySelected = selectedSoportes.some(s => s.id === marker.id);

            if (isAlreadySelected) {
                // Deseleccionar el marcador
                const newSelection = selectedSoportes.filter(s => s.id !== marker.id);
                setSelectedSoportes(newSelection);
                if (newSelection.length < 2) {
                    setShowLine(false);
                    setDistance(null);
                }
            } else {
                if (selectedSoportes.length === 0) {
                    // Primer marcador seleccionado
                    setSelectedSoportes([marker]);
                } else if (selectedSoportes.length === 1) {
                    // Segundo marcador seleccionado
                    const newSelection = [...selectedSoportes, marker];
                    setSelectedSoportes(newSelection);

                    // Calcular distancia
                    const dist = calculateDistance(newSelection[0], newSelection[1]);
                    setDistance(dist);

                    // Crear línea visualmente
                    setShowLine(true);

                    // Ajustar la vista del mapa para mostrar ambos marcadores
                    if (newSelection[0] && newSelection[1]) {
                        const minLat = Math.min(newSelection[0].latitude, newSelection[1].latitude);
                        const maxLat = Math.max(newSelection[0].latitude, newSelection[1].latitude);
                        const minLon = Math.min(newSelection[0].longitude, newSelection[1].longitude);
                        const maxLon = Math.max(newSelection[0].longitude, newSelection[1].longitude);

                        const latitude = (minLat + maxLat) / 2;
                        const longitude = (minLon + maxLon) / 2;
                        const latitudeDelta = (maxLat - minLat) * 1.5;
                        const longitudeDelta = (maxLon - minLon) * 1.5;

                        mapRef.current?.animateToRegion({
                            latitude,
                            longitude,
                            latitudeDelta: Math.max(latitudeDelta, 0.002),
                            longitudeDelta: Math.max(longitudeDelta, 0.002),
                        }, 500);
                    }

                    // Navegar a la pantalla de creación de línea después de un breve retraso
                    setTimeout(() => {
                        if (currentLoteoId && isLineMode) {
                            // Extraer el tipo (bt o mt) de isLineMode
                            const tipo = isLineMode === 'linea_bt' ? 'bt' : 'mt';

                            // Navegar a la pantalla de creación de línea con parámetros
                            router.push({
                                pathname: `/loteos/${currentLoteoId}/(tabs)/lineas/${tipo}/new`,
                                params: {
                                    id_soporte_inicio: newSelection[0].id.toString(),
                                    id_soporte_final: newSelection[1].id.toString(),
                                    distancia_metros: dist.toString()
                                }
                            });

                            // Resetear el modo línea
                            resetLineMode();
                        }
                    }, 800); // Pequeño retraso para que el usuario vea la línea creada
                } else {
                    // Ya hay 2 seleccionados, reemplazar
                    Alert.alert(
                        "Selección completa",
                        "Ya tienes 2 soportes seleccionados. ¿Deseas reemplazar uno?",
                        [
                            { text: "Cancelar", style: "cancel" },
                            {
                                text: "Reemplazar",
                                onPress: () => {
                                    // Reemplazar el segundo marcador
                                    const newSelection = [selectedSoportes[0], marker];
                                    setSelectedSoportes(newSelection);

                                    // Calcular distancia
                                    const dist = calculateDistance(newSelection[0], newSelection[1]);
                                    setDistance(dist);
                                    setShowLine(true);
                                }
                            }
                        ]
                    );
                }
            }
        }
    };

    const handleStartLineMode = (type: 'linea_bt' | 'linea_mt') => {
        if (markers.length < 2) {
            Alert.alert(
                "Soportes insuficientes",
                "Necesitas al menos 2 soportes para crear una línea"
            );
            setFabOpen(false);
            return;
        }

        setIsLineMode(type);
        setFabOpen(false);

        Alert.alert(
            `Modo línea ${type === 'linea_bt' ? 'BT' : 'MT'} activado`,
            "Selecciona dos soportes para crear una línea entre ellos. Después de seleccionar el segundo soporte, se abrirá el formulario de creación de línea.",
            [{ text: "Entendido" }]
        );
    };

    const showAddSoporteDialog = async () => {
        let location = null;

        try {
            // Siempre obtener la ubicación actual precisa
            const pos = await Location.getCurrentPositionAsync({ accuracy: Location.Accuracy.Highest });
            location = {
                latitude: pos.coords.latitude,
                longitude: pos.coords.longitude,
                altitude: pos.coords.altitude,
                accuracy: pos.coords.accuracy
            };
            setUserLocation({ latitude: location.latitude, longitude: location.longitude });
        } catch (err) {
            Alert.alert("Error", "No se pudo obtener la ubicación");
            return;
        }

        if (!currentLoteoId) {
            Alert.alert("Error", "No hay un loteo seleccionado");
            return;
        }

        // Guardar la ubicación y mostrar el dialog
        setPendingLocation(location);
        setSelectedType("POSTE");
        setDialogVisible(true);
        setFabOpen(false);
    };

    const handleConfirmAddSoporte = async () => {
        if (!pendingLocation || !currentLoteoId) {
            return;
        }

        setDialogVisible(false);

        try {
            const result = await addSoporte(db, {
                tipo: selectedType,
                latitud: pendingLocation.latitude,
                longitud: pendingLocation.longitude,
                id_loteo: currentLoteoId,
                altitud: pendingLocation.altitude || undefined,
                precision: pendingLocation.accuracy || undefined,
                created_by: session?.user.id,
                updated_by: session?.user.id,
            });

            // Agregar marcador visual
            const newMarker = {
                id: result.lastInsertRowId,
                latitude: pendingLocation.latitude,
                longitude: pendingLocation.longitude,
                tipo: selectedType
            };

            setMarkers([...markers, newMarker]);
            setPendingLocation(null);

            // Navegar a la pantalla de detalles del soporte
            router.push(`/loteos/${currentLoteoId}/(tabs)/soportes/${result.lastInsertRowId}`);
        } catch (err) {
            console.error(err);
            Alert.alert("Error", "No se pudo crear el soporte");
            setPendingLocation(null);
        }
    };

    const handleCancelDialog = () => {
        setDialogVisible(false);
        setPendingLocation(null);
    };

    const goToUserLocation = async () => {
        if (!userLocation) {
            try {
                const pos = await Location.getCurrentPositionAsync();
                const { latitude, longitude } = pos.coords;
                setUserLocation({ latitude, longitude });

                mapRef.current?.animateToRegion({
                    latitude,
                    longitude,
                    latitudeDelta: VERTICAL_150M, // 150 metros verticales
                    longitudeDelta: VERTICAL_150M * HORIZONTAL_ASPECT_RATIO, // Proporcional
                }, 400);
            } catch (err) {
                Alert.alert("Error", "No se pudo obtener la ubicación");
            }
        } else {
            mapRef.current?.animateToRegion({
                latitude: userLocation.latitude,
                longitude: userLocation.longitude,
                latitudeDelta: VERTICAL_150M, // 150 metros verticales
                longitudeDelta: VERTICAL_150M * HORIZONTAL_ASPECT_RATIO, // Proporcional
            }, 400);
        }
    };

    const getMarkerColor = (marker: { id: number; tipo: string }) => {
        const isSelected = selectedSoportes.some(s => s.id === marker.id);

        if (isSelected) {
            return '#FFD700'; // Amarillo para marcadores seleccionados
        }

        if (marker.tipo === 'CAMARA') {
            return '#03A9F4'; // Azul claro para cámaras
        }

        return '#e74c3c'; // Rojo para postes
    };

    const getMarkerSize = (marker: { id: number }) => {
        const isSelected = selectedSoportes.some(s => s.id === marker.id);
        return isSelected ? 28 : 22;
    };

    const getLineColor = () => {
        if (isLineMode === 'linea_bt') {
            return '#22ff3fff'; // Naranja para BT
        } else if (isLineMode === 'linea_mt') {
            return '#ff0000ff'; // Púrpura para MT
        }
        return '#3498db'; // Azul por defecto
    };

    const getLineLabel = () => {
        if (isLineMode === 'linea_bt') {
            return 'Línea BT';
        } else if (isLineMode === 'linea_mt') {
            return 'Línea MT';
        }
        return 'Línea';
    };

    // Acciones del FAB.Group
    const actions = [
        {
            icon: 'lightning-bolt',
            label: 'Línea MT',
            onPress: () => handleStartLineMode('linea_mt'),
        },
        {
            icon: 'flash',
            label: 'Línea BT',
            onPress: () => handleStartLineMode('linea_bt'),
        },
        {
            icon: 'plus',
            label: 'Agregar Soporte',
            onPress: showAddSoporteDialog,
        },
    ];

    return (
        <View style={styles.container}>
            <MapView
                ref={mapRef}
                style={styles.map}
                provider={PROVIDER_GOOGLE}
                initialRegion={region}
                showsUserLocation={true}
                showsMyLocationButton={false}
                showsScale
                mapType="hybrid"
                onPress={() => {
                    // Si tocas el mapa fuera de un marcador, no hacer nada
                }}
            >
                {/* Marcadores de soportes */}
                {markers.map((marker) => (
                    <Marker
                        key={marker.id}
                        coordinate={{ latitude: marker.latitude, longitude: marker.longitude }}
                        title={`${marker.tipo}`}
                        description={marker.placa ? `${marker.placa}` : `Soporte #${marker.id}`}
                        onPress={() => handleMarkerPress(marker)}
                    >
                        <View style={{
                            width: getMarkerSize(marker),
                            height: getMarkerSize(marker),
                            borderRadius: getMarkerSize(marker) / 2,
                            backgroundColor: getMarkerColor(marker),
                            borderColor: 'white',
                            borderWidth: 3,
                            shadowColor: '#000',
                            shadowOffset: { width: 0, height: 2 },
                            shadowOpacity: 0.3,
                            shadowRadius: 3,
                            elevation: 4,
                        }} />
                    </Marker>
                ))}

                {/* Línea entre soportes seleccionados */}
                {showLine && selectedSoportes.length === 2 && (
                    <Polyline
                        coordinates={[
                            { latitude: selectedSoportes[0].latitude, longitude: selectedSoportes[0].longitude },
                            { latitude: selectedSoportes[1].latitude, longitude: selectedSoportes[1].longitude }
                        ]}
                        strokeColor={getLineColor()}
                        strokeWidth={4}
                    />
                )}
            </MapView>

            {/* Controles flotantes */}
            <View style={styles.controls}>
                <IconButton
                    icon="crosshairs-gps"
                    mode="contained"
                    size={24}
                    onPress={goToUserLocation}
                    style={styles.controlButton}
                />
            </View>

            {/* Panel de información cuando está en modo línea */}
            {isLineMode && (
                <View style={[styles.selectionPanel, { borderColor: getLineColor() }]}>
                    <View style={styles.selectionHeader}>
                        <IconButton
                            icon="close"
                            size={20}
                            onPress={resetLineMode}
                            style={styles.closeButton}
                        />
                        <Text variant="titleMedium" style={styles.modeTitle}>
                            {getLineLabel()}
                        </Text>
                    </View>

                    <Text variant="bodyLarge" style={styles.selectionTitle}>
                        {selectedSoportes.length === 0 && "👆 Selecciona el primer soporte"}
                        {selectedSoportes.length === 1 && `✅ Primer soporte: ${selectedSoportes[0].tipo} #${selectedSoportes[0].id}`}
                        {selectedSoportes.length === 2 && "✅ Listo! Redirigiendo al formulario..."}
                    </Text>

                    {selectedSoportes.length > 0 && (
                        <View style={styles.chipsContainer}>
                            {selectedSoportes.map(soporte => (
                                <Chip
                                    key={soporte.id}
                                    style={[styles.chip, { backgroundColor: '#FFF3CD' }]}
                                    textStyle={{ color: '#856404' }}
                                    onClose={() => {
                                        const newSelection = selectedSoportes.filter(s => s.id !== soporte.id);
                                        setSelectedSoportes(newSelection);
                                        if (newSelection.length < 2) {
                                            setShowLine(false);
                                            setDistance(null);
                                        }
                                    }}
                                >
                                    {soporte.tipo} #{soporte.id}
                                </Chip>
                            ))}
                        </View>
                    )}

                    {distance && (
                        <Text variant="titleMedium" style={styles.distanceText}>
                            📐 Distancia: {formatDistance(distance)}
                        </Text>
                    )}
                </View>
            )}

            {/* FAB.Group principal */}
            <FAB.Group
                open={fabOpen}
                visible={!isLineMode} // Solo visible cuando NO está en modo línea
                icon={fabOpen ? "close" : "plus"}
                actions={actions}
                onStateChange={({ open }) => setFabOpen(open)}
                fabStyle={styles.fab}
                style={styles.fabGroup}
            />

            {/* Dialog para seleccionar tipo de soporte */}
            <Portal>
                <Dialog visible={dialogVisible} onDismiss={handleCancelDialog}>
                    <Dialog.Title>Agregar Soporte</Dialog.Title>
                    <Dialog.Content>
                        <Text variant="bodyMedium" style={{ marginBottom: 16 }}>
                            ¿Qué tipo de soporte desea agregar?
                        </Text>
                        <RadioButton.Group onValueChange={setSelectedType} value={selectedType}>
                            <RadioButton.Item label="Poste" value="POSTE" />
                            <RadioButton.Item label="Cámara" value="CAMARA" />
                        </RadioButton.Group>
                    </Dialog.Content>
                    <Dialog.Actions>
                        <Button onPress={handleCancelDialog}>Cancelar</Button>
                        <Button onPress={handleConfirmAddSoporte}>Agregar</Button>
                    </Dialog.Actions>
                </Dialog>
            </Portal>
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1 },
    map: { flex: 1 },
    controls: {
        position: "absolute",
        right: 12,
        top: 12,
        alignItems: "center",
    },
    controlButton: {
        backgroundColor: "white",
        marginBottom: 12,
        elevation: 3,
    },
    fabGroup: {
        paddingBottom: 60,
    },
    fab: {
        // backgroundColor: '#6200ee',
    },
    selectionPanel: {
        position: "absolute",
        bottom: 80,
        left: 16,
        right: 16,
        backgroundColor: "rgba(255, 255, 255, 0.98)",
        borderRadius: 12,
        padding: 16,
        elevation: 5,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        borderWidth: 2,
    },
    selectionHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 12,
    },
    modeTitle: {
        flex: 1,
        fontWeight: "bold",
        textAlign: "center",
        color: '#333',
    },
    closeButton: {
        margin: 0,
        marginRight: 8,
    },
    selectionTitle: {
        fontWeight: "bold",
        marginBottom: 12,
        textAlign: "center",
        color: '#333',
    },
    chipsContainer: {
        flexDirection: "row",
        justifyContent: "center",
        marginBottom: 12,
        flexWrap: "wrap",
    },
    chip: {
        marginHorizontal: 4,
        marginVertical: 2,
    },
    distanceText: {
        fontWeight: "bold",
        color: "#2c3e50",
        textAlign: "center",
        marginBottom: 12,
    },
});