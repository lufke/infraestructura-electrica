
import { useLoteo } from "@/src/contexts/LoteoContext";
import { getCamarasByLoteoId } from "@/src/database/queries/camaras";
import { getPostesByLoteoId } from "@/src/database/queries/postes";
import { addSoporte, getSoportesByLoteoId } from "@/src/database/queries/soportes";
import * as Location from "expo-location";
import { useFocusEffect, useRouter } from "expo-router";
import { useSQLiteContext } from "expo-sqlite";
import React, { useEffect, useRef, useState } from "react";
import { Alert, StyleSheet, View } from "react-native";
import MapView, { Marker, PROVIDER_GOOGLE, Region } from "react-native-maps";
import { Button, Dialog, FAB, IconButton, Portal, RadioButton, Text } from "react-native-paper";

export default function Mapa() {
    const { currentLoteoId, setCurrentSoporteId } = useLoteo();
    const router = useRouter();
    const db = useSQLiteContext();
    const mapRef = useRef<MapView | null>(null);

    const [userLocation, setUserLocation] = useState<{ latitude: number; longitude: number; altitude?: number | null; accuracy?: number | null } | null>(null);
    const [markers, setMarkers] = useState<Array<{ id: number; latitude: number; longitude: number; tipo: string; placa?: string }>>([]);
    const [region, setRegion] = useState<Region>({
        latitude: -33.45,
        longitude: -70.6667,
        latitudeDelta: 0.05,
        longitudeDelta: 0.05,
    });

    // Estado para el dialog
    const [dialogVisible, setDialogVisible] = useState(false);
    const [selectedType, setSelectedType] = useState<string>("POSTE");
    const [pendingLocation, setPendingLocation] = useState<{ latitude: number; longitude: number; altitude?: number | null; accuracy?: number | null } | null>(null);

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
                    latitudeDelta: 0.01,
                    longitudeDelta: 0.01,
                };
                setRegion(newRegion);
                mapRef.current?.animateToRegion(newRegion, 800);
            } catch (err) {
                console.warn("Error al obtener ubicación:", err);
            }
        })();
    }, []);

    const goToUserLocation = async () => {
        if (!userLocation) {
            try {
                const pos = await Location.getCurrentPositionAsync();
                const { latitude, longitude, accuracy, altitude } = pos.coords;
                setUserLocation({ latitude, longitude, accuracy, altitude });
                mapRef.current?.animateToRegion({
                    latitude,
                    longitude,
                    latitudeDelta: 0.01,
                    longitudeDelta: 0.01,
                }, 400);
            } catch (err) {
                Alert.alert("Error", "No se pudo obtener la ubicación");
            }
        } else {
            mapRef.current?.animateToRegion({
                latitude: userLocation.latitude,
                longitude: userLocation.longitude,
                latitudeDelta: 0.01,
                longitudeDelta: 0.01,
            }, 400);
        }
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
            });

            console.log({ result });

            // Agregar marcador visual
            setMarkers([...markers, {
                id: result.lastInsertRowId,
                latitude: pendingLocation.latitude,
                longitude: pendingLocation.longitude,
                tipo: selectedType
            }]);

            setPendingLocation(null);
            // setCurrentSoporteId(null);

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
            >
                {/* Marcadores de soportes */}
                {markers.map((marker) => (
                    <Marker
                        key={marker.id}
                        coordinate={{ latitude: marker.latitude, longitude: marker.longitude }}
                        title={`${marker.tipo}`}
                        description={marker.placa ? `${marker.placa}` : `Soporte #${marker.id}`}
                        pinColor="red"
                    >
                        <View style={{
                            width: 20,
                            height: 20,
                            borderRadius: 10,
                            backgroundColor: marker.tipo === 'CAMARA' ? '#03A9F4' : 'red',
                            borderColor: 'white',
                            borderWidth: 2,
                        }} />
                    </Marker>
                ))}
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

            {/* FAB para agregar soporte */}
            <FAB
                icon="plus"
                label="Agregar Soporte"
                onPress={showAddSoporteDialog}
                style={styles.fab}
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
    fab: {
        position: "absolute",
        bottom: 80,
        right: 16,
    },
});
