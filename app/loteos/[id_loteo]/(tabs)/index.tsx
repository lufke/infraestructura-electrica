import { useAuth } from "@/src/contexts/AuthContext";
import { useLoteo } from "@/src/contexts/LoteoContext";
import { getEmpalmesByLoteoId } from "@/src/database/queries/empalmes";
import { getEstructurasByLoteoId } from "@/src/database/queries/estructuras";
import { getLineasBTByLoteoId } from "@/src/database/queries/lineas_bt";
import { getLineasMTByLoteoId } from "@/src/database/queries/lineas_mt";
import { getLuminariasByLoteoId } from "@/src/database/queries/luminarias";
import { getSeccionamientosByLoteoId } from "@/src/database/queries/seccionamientos";
import { addSoporte, getSoportesByLoteoId } from "@/src/database/queries/soportes";
import { getSubestacionesByLoteoId } from "@/src/database/queries/subestaciones";
import { getTierrasByLoteoId } from "@/src/database/queries/tierras";
import { getTirantesByLoteoId } from "@/src/database/queries/tirantes";
import * as Location from "expo-location";
import { useFocusEffect, useRouter } from "expo-router";
import { useSQLiteContext } from "expo-sqlite";
import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Alert, StyleSheet, View } from "react-native";
import MapView, { PROVIDER_GOOGLE, Region } from "react-native-maps";
import { Button, Checkbox, Dialog, FAB, IconButton, Portal, RadioButton, Text, TextInput } from "react-native-paper";

// Components
import MapLines, { LineaMapa } from "@/src/components/map/MapLines";
import MapMarkers from "@/src/components/map/MapMarkers";
import SelectionPanel from "@/src/components/map/SelectionPanel";

// Constantes para la región
const VERTICAL = 50 / 111320;
const HORIZONTAL_ASPECT_RATIO = 20 / 9;

export default function Mapa() {
    const { currentLoteoId } = useLoteo();
    const { session } = useAuth();
    const router = useRouter();
    const db = useSQLiteContext();
    const mapRef = useRef<MapView | null>(null);

    const [userLocation, setUserLocation] = useState<{ latitude: number; longitude: number; altitude?: number | null; accuracy?: number | null } | null>(null);

    // Data states
    const [allMarkers, setAllMarkers] = useState<Array<{ id: number; latitude: number; longitude: number; tipo: string; placa?: string; soporte_id?: number }>>([]);
    const [allLineas, setAllLineas] = useState<LineaMapa[]>([]);

    // Filtered states (for rendering)
    const [markers, setMarkers] = useState<typeof allMarkers>([]);
    const [lineas, setLineas] = useState<typeof allLineas>([]);

    const [region, setRegion] = useState<Region>({
        latitude: -33.45,
        longitude: -70.6667,
        latitudeDelta: VERTICAL,
        longitudeDelta: VERTICAL * HORIZONTAL_ASPECT_RATIO,
    });

    // Dialogs
    const [dialogVisible, setDialogVisible] = useState(false);
    const [filterDialogVisible, setFilterDialogVisible] = useState(false);

    const [selectedType, setSelectedType] = useState<string>("POSTE");
    const [pendingLocation, setPendingLocation] = useState<{ latitude: number; longitude: number; altitude?: number | null; accuracy?: number | null } | null>(null);

    // Line Mode
    const [selectedSoportes, setSelectedSoportes] = useState<Array<{ id: number; latitude: number; longitude: number; tipo: string; placa?: string; soporte_id?: number }>>([]);
    const [showLine, setShowLine] = useState(false);
    const [distance, setDistance] = useState<number | null>(null);
    const [isLineMode, setIsLineMode] = useState<'linea_bt' | 'linea_mt' | null>(null);

    // Radius Filter
    const [filterRadius, setFilterRadius] = useState<string>("200");
    const [isFiltered, setIsFiltered] = useState(false);

    // FAB
    const [fabOpen, setFabOpen] = useState(false);

    // Layer visibility
    const [layers, setLayers] = useState({
        postes: true,
        camaras: true,
        bt: true,
        mt: true,
        empalmes: false,
        luminarias: false,
        seccionamientos: false,
        subestaciones: false,
        estructuras: false,
        tirantes: false,
        tierras: false
    });
    const [tempLayers, setTempLayers] = useState(layers);
    const [layerMenuVisible, setLayerMenuVisible] = useState(false);

    const openLayerMenu = () => {
        setTempLayers(layers);
        setLayerMenuVisible(true);
    };

    const saveLayers = () => {
        setLayers(tempLayers);
        setLayerMenuVisible(false);
    };

    /* --- HELPERS --- */
    const calculateDistance = (coord1: { latitude: number; longitude: number }, coord2: { latitude: number; longitude: number }) => {
        const R = 6371000;
        const lat1 = coord1.latitude * Math.PI / 180;
        const lat2 = coord2.latitude * Math.PI / 180;
        const deltaLat = (coord2.latitude - coord1.latitude) * Math.PI / 180;
        const deltaLon = (coord2.longitude - coord1.longitude) * Math.PI / 180;

        const a = Math.sin(deltaLat / 2) * Math.sin(deltaLat / 2) +
            Math.cos(lat1) * Math.cos(lat2) *
            Math.sin(deltaLon / 2) * Math.sin(deltaLon / 2);
        const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

        return Math.round(R * c);
    };

    /* --- LOADING DATA --- */
    const loadMapData = async () => {
        if (!currentLoteoId) return;
        try {
            const [
                soportes,
                lineasBT,
                lineasMT,
                empalmes,
                luminarias,
                seccionamientos,
                subestaciones,
                estructuras,
                tirantes,
                tierras
            ] = await Promise.all([
                getSoportesByLoteoId(db, currentLoteoId),
                getLineasBTByLoteoId(db, currentLoteoId),
                getLineasMTByLoteoId(db, currentLoteoId),
                getEmpalmesByLoteoId(db, currentLoteoId),
                getLuminariasByLoteoId(db, currentLoteoId),
                getSeccionamientosByLoteoId(db, currentLoteoId),
                getSubestacionesByLoteoId(db, currentLoteoId),
                getEstructurasByLoteoId(db, currentLoteoId),
                getTirantesByLoteoId(db, currentLoteoId),
                getTierrasByLoteoId(db, currentLoteoId)
            ]);

            const soportesMap: Record<number, { lat: number, long: number }> = {};
            (soportes as any[]).forEach(s => {
                soportesMap[s.id] = { lat: s.latitud, long: s.longitud };
            });

            const mappedMarkers = (soportes as any[]).map(s => ({
                id: s.id,
                latitude: s.latitud,
                longitude: s.longitud,
                tipo: s.tipo, // POSTE or CAMARA
                placa: undefined,
                soporte_id: s.id
            }));

            // Helper to add others
            const addOthers = (items: any[], tipo: string) => {
                items.forEach(item => {
                    const coords = soportesMap[item.id_soporte];
                    if (coords) {
                        mappedMarkers.push({
                            id: item.id,
                            latitude: coords.lat,
                            longitude: coords.long,
                            tipo: tipo,
                            placa: undefined,
                            soporte_id: item.id_soporte
                        });
                    }
                });
            };

            addOthers(empalmes as any[], 'EMPALME');
            addOthers(luminarias as any[], 'LUMINARIA');
            addOthers(seccionamientos as any[], 'SECCIONAMIENTO');
            addOthers(subestaciones as any[], 'SUBESTACION');
            addOthers(estructuras as any[], 'ESTRUCTURA');
            addOthers(tirantes as any[], 'TIRANTE');
            addOthers(tierras as any[], 'TIERRA');

            const mappedLineas: LineaMapa[] = [];
            const agregarLinea = (linea: any, tipo: 'linea_bt' | 'linea_mt', soportesArr: any[]) => {
                const sInicio = soportesArr.find(s => s.id === linea.id_soporte_inicio);
                const sFinal = soportesArr.find(s => s.id === linea.id_soporte_final);
                if (sInicio && sFinal) {
                    mappedLineas.push({
                        id: linea.id,
                        tipo,
                        soporte_inicio_id: linea.id_soporte_inicio,
                        soporte_final_id: linea.id_soporte_final,
                        distancia_metros: linea.distancia_metros,
                        coordenadas: [
                            { latitude: sInicio.latitud, longitude: sInicio.longitud },
                            { latitude: sFinal.latitud, longitude: sFinal.longitud }
                        ]
                    });
                }
            };

            (lineasBT as any[]).forEach(l => agregarLinea(l, 'linea_bt', soportes as any[]));
            (lineasMT as any[]).forEach(l => agregarLinea(l, 'linea_mt', soportes as any[]));

            setAllMarkers(mappedMarkers);
            setAllLineas(mappedLineas);

            // Set initial filtered state (show all if not filtered yet)
            if (!isFiltered) {
                setMarkers(mappedMarkers);
                setLineas(mappedLineas);
            } else {
                // Re-apply filter if needed
                applyRadiusFilter(mappedMarkers, mappedLineas);
            }

        } catch (error) {
            console.error("Error cargando datos:", error);
        }
    };

    useFocusEffect(
        useCallback(() => {
            loadMapData();
            resetLineMode();
        }, [currentLoteoId])
    );

    /* --- LOCATION & FILTER --- */
    useEffect(() => {
        (async () => {
            const { status } = await Location.requestForegroundPermissionsAsync();
            if (status === "granted") {
                const pos = await Location.getCurrentPositionAsync({ accuracy: Location.Accuracy.High });
                setUserLocation({
                    latitude: pos.coords.latitude,
                    longitude: pos.coords.longitude,
                    altitude: pos.coords.altitude,
                    accuracy: pos.coords.accuracy
                });

                // Only animate once initially
                // ...
            }
        })();
    }, []);

    const applyRadiusFilter = (markersData = allMarkers, lineasData = allLineas) => {
        if (region) {
            performFiltering(region, markersData, lineasData);
        } else {
            Alert.alert("Error", "No se pudo obtener ubicación para filtrar.");
        }
    };

    const performFiltering = (location: { latitude: number, longitude: number }, markersData: any[], lineasData: any[]) => {
        const radius = parseInt(filterRadius) || 200;

        const filteredMarkers = markersData.filter(m => {
            const dist = calculateDistance(location, { latitude: m.latitude, longitude: m.longitude });
            return dist <= radius;
        });

        // Keep lines where BOTH points are within radius (or visible markers)
        const visibleMarkerIds = new Set(filteredMarkers.map(m => m.id));
        const filteredLineas = lineasData.filter(l =>
            visibleMarkerIds.has(l.soporte_inicio_id) && visibleMarkerIds.has(l.soporte_final_id)
        );

        setMarkers(filteredMarkers);
        setLineas(filteredLineas);
        setIsFiltered(true);
        Alert.alert("Filtro Aplicado", `Mostrando ${filteredMarkers.length} soportes en un radio de ${radius}m.`);
    };

    const clearFilter = () => {
        setMarkers(allMarkers);
        setLineas(allLineas);
        setIsFiltered(false);
    };

    /* --- HANDLERS --- */
    const handleMarkerPress = useCallback((marker: any) => {
        if (!isLineMode) return;

        setSelectedSoportes(prev => {
            const isSelected = prev.some(s => s.id === marker.id);
            if (isSelected) {
                const newSelection = prev.filter(s => s.id !== marker.id);
                if (newSelection.length < 2) {
                    setShowLine(false);
                    setDistance(null);
                }
                return newSelection;
            } else {
                if (prev.length === 0) return [marker];
                if (prev.length === 1) {
                    const newSelection = [...prev, marker];
                    const dist = calculateDistance(newSelection[0], newSelection[1]);
                    setDistance(dist);
                    setShowLine(true);
                    return newSelection;
                }
                // Case > 1 not handled or replace?
                return prev;
            }
        });
    }, [isLineMode]);

    const handleCalloutPress = useCallback((id: number) => {
        router.push(`/loteos/${currentLoteoId}/(tabs)/soportes/${id}`);
    }, [currentLoteoId, router]);

    const handleSaveLine = () => {
        if (selectedSoportes.length !== 2 || !isLineMode || !currentLoteoId) return;
        const tipo = isLineMode === 'linea_bt' ? 'bt' : 'mt';
        router.push({
            pathname: `/loteos/${currentLoteoId}/(tabs)/lineas/${tipo}/new` as any,
            params: {
                id_soporte_inicio: (selectedSoportes[0].soporte_id || selectedSoportes[0].id).toString(),
                id_soporte_final: (selectedSoportes[1].soporte_id || selectedSoportes[1].id).toString(),
                distancia_metros: distance?.toString() || '0'
            }
        });
        resetLineMode();
    };

    const resetLineMode = () => {
        setSelectedSoportes([]);
        setShowLine(false);
        setDistance(null);
        setIsLineMode(null);
        setFabOpen(false);
    };

    const handleStartLineMode = (type: 'linea_bt' | 'linea_mt') => {
        if (markers.length < 2) {
            Alert.alert("Soportes insuficientes", "Necesitas al menos 2 soportes visibles.");
            return;
        }
        setIsLineMode(type);
        setFabOpen(false);
    };

    /* --- ADD SOPORTE --- */
    const showAddSoporteDialog = async () => {
        try {
            const pos = await Location.getCurrentPositionAsync({ accuracy: Location.Accuracy.Highest });
            setPendingLocation({
                latitude: pos.coords.latitude,
                longitude: pos.coords.longitude,
                altitude: pos.coords.altitude,
                accuracy: pos.coords.accuracy
            });
            setSelectedType("POSTE");
            setDialogVisible(true);
            setFabOpen(false);
        } catch {
            Alert.alert("Error", "No se pudo obtener la ubicación");
        }
    };

    const handleConfirmAddSoporte = async () => {
        if (!pendingLocation || !currentLoteoId) return;
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

            // Optimistic update
            const newMarker = {
                id: result.lastInsertRowId,
                latitude: pendingLocation.latitude,
                longitude: pendingLocation.longitude,
                tipo: selectedType
            };
            setAllMarkers([...allMarkers, newMarker]);
            setMarkers([...markers, newMarker]); // Also add to current view

            setPendingLocation(null);
            const tipoSoporte = selectedType === "POSTE" ? "postes" : "camaras";
            router.push(`/loteos/${currentLoteoId}/(tabs)/soportes/${result.lastInsertRowId}/${tipoSoporte}/new`);
        } catch (e) {
            console.error(e);
            Alert.alert("Error", "No se pudo crear el soporte");
        }
    };

    const tempLineCoordinates = useMemo(() => {
        if (selectedSoportes.length === 2) {
            return [
                { latitude: selectedSoportes[0].latitude, longitude: selectedSoportes[0].longitude },
                { latitude: selectedSoportes[1].latitude, longitude: selectedSoportes[1].longitude }
            ];
        }
        return undefined;
    }, [selectedSoportes]);

    const toggleAllLayers = (status: boolean) => {
        setTempLayers(prev => {
            const next = { ...prev };
            (Object.keys(next) as Array<keyof typeof next>).forEach(k => {
                next[k] = status;
            });
            return next;
        });
    };

    const visibleMarkers = useMemo(() => {
        return markers.filter(m => {
            if (m.tipo === 'POSTE') return layers.postes;
            if (m.tipo === 'CAMARA') return layers.camaras;
            if (m.tipo === 'EMPALME') return layers.empalmes;
            if (m.tipo === 'LUMINARIA') return layers.luminarias;
            if (m.tipo === 'SECCIONAMIENTO') return layers.seccionamientos;
            if (m.tipo === 'SUBESTACION') return layers.subestaciones;
            if (m.tipo === 'ESTRUCTURA') return layers.estructuras;
            if (m.tipo === 'TIRANTE') return layers.tirantes;
            if (m.tipo === 'TIERRA') return layers.tierras;
            return true;
        });
    }, [markers, layers]);

    const visibleLineas = useMemo(() => {
        return lineas.filter(l => (l.tipo === 'linea_bt' && layers.bt) || (l.tipo === 'linea_mt' && layers.mt));
    }, [lineas, layers]);

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
                onRegionChangeComplete={setRegion}
            >
                <MapMarkers
                    markers={visibleMarkers}
                    selectedSoportes={selectedSoportes}
                    onMarkerPress={handleMarkerPress}
                    onCalloutPress={handleCalloutPress}
                />

                <MapLines
                    lineas={visibleLineas}
                    showTempLine={showLine}
                    tempLineCoordinates={tempLineCoordinates}
                    isLineMode={isLineMode}
                />
            </MapView>

            <View style={styles.controls}>
                <IconButton
                    icon="crosshairs-gps"
                    mode="contained"
                    size={24}
                    onPress={async () => {
                        const pos = await Location.getCurrentPositionAsync();
                        mapRef.current?.animateToRegion({
                            latitude: pos.coords.latitude,
                            longitude: pos.coords.longitude,
                            latitudeDelta: VERTICAL,
                            longitudeDelta: VERTICAL * HORIZONTAL_ASPECT_RATIO,
                        });
                    }}
                    style={styles.controlButton}
                />

                <IconButton
                    icon="fit-to-screen"
                    mode="contained"
                    size={24}
                    onPress={() => {
                        if (allMarkers.length === 0) {
                            Alert.alert("Info", "No hay soportes para centrar.");
                            return;
                        }
                        const coords = allMarkers.map(m => ({ latitude: m.latitude, longitude: m.longitude }));
                        mapRef.current?.fitToCoordinates(coords, {
                            edgePadding: { top: 50, right: 50, bottom: 50, left: 50 },
                            animated: true,
                        });
                    }}
                    style={styles.controlButton}
                />

                <IconButton
                    icon="layers"
                    mode="contained"
                    size={24}
                    onPress={openLayerMenu}
                    style={styles.controlButton}
                />

                {isFiltered && (
                    <IconButton
                        icon="refresh"
                        mode="contained"
                        size={24}
                        containerColor="#E3F2FD"
                        iconColor="#1565C0"
                        onPress={() => {
                            // Re-apply filter using current map region
                            performFiltering(region, allMarkers, allLineas);
                        }}
                        style={styles.controlButton}
                    />
                )}

                <IconButton
                    icon={isFiltered ? "filter-off" : "filter"}
                    mode="contained"
                    size={24}
                    containerColor={isFiltered ? "#FFEBEE" : "white"}
                    iconColor={isFiltered ? "#D32F2F" : "black"}
                    onPress={() => isFiltered ? clearFilter() : setFilterDialogVisible(true)}
                    style={styles.controlButton}
                />
            </View>

            <SelectionPanel
                isLineMode={isLineMode}
                selectedSoportes={selectedSoportes}
                distance={distance}
                onClose={resetLineMode}
                onRemoveSoporte={(id) => setSelectedSoportes(prev => prev.filter(s => s.id !== id))}
                onSave={handleSaveLine}
            />

            <FAB.Group
                open={fabOpen}
                visible={!isLineMode}
                icon={fabOpen ? "close" : "plus"}
                actions={[
                    { icon: 'lightning-bolt', label: 'Línea MT', onPress: () => handleStartLineMode('linea_mt') },
                    { icon: 'flash', label: 'Línea BT', onPress: () => handleStartLineMode('linea_bt') },
                    { icon: 'plus', label: 'Agregar Soporte', onPress: showAddSoporteDialog },
                ]}
                onStateChange={({ open }) => setFabOpen(open)}
                fabStyle={styles.fab}
            />

            {/* Dialog to Add Soporte */}
            <Portal>
                <Dialog visible={dialogVisible} onDismiss={() => setDialogVisible(false)}>
                    <Dialog.Title>Agregar Soporte</Dialog.Title>
                    <Dialog.Content>
                        <Text variant="bodyMedium">Tipo de soporte:</Text>
                        <RadioButton.Group onValueChange={setSelectedType} value={selectedType}>
                            <RadioButton.Item label="Poste" value="POSTE" />
                            <RadioButton.Item label="Cámara" value="CAMARA" />
                        </RadioButton.Group>
                    </Dialog.Content>
                    <Dialog.Actions>
                        <Button onPress={() => setDialogVisible(false)}>Cancelar</Button>
                        <Button onPress={handleConfirmAddSoporte}>Agregar</Button>
                    </Dialog.Actions>
                </Dialog>
            </Portal>

            {/* Dialog for Filter Radius */}
            <Portal>
                <Dialog visible={filterDialogVisible} onDismiss={() => setFilterDialogVisible(false)}>
                    <Dialog.Title>Filtrar por Radio</Dialog.Title>
                    <Dialog.Content>
                        <Text style={{ marginBottom: 10 }}>Ingrese el radio en metros (default: 200m)</Text>
                        <TextInput
                            label="Radio (metros)"
                            value={filterRadius}
                            onChangeText={setFilterRadius}
                            keyboardType="numeric"
                            mode="outlined"
                        />
                    </Dialog.Content>
                    <Dialog.Actions>
                        <Button onPress={() => setFilterDialogVisible(false)}>Cancelar</Button>
                        <Button onPress={() => {
                            setFilterDialogVisible(false);
                            applyRadiusFilter();
                        }}>Aplicar</Button>
                    </Dialog.Actions>
                </Dialog>
            </Portal>
            {/* Dialog for Layers */}
            <Portal>
                <Dialog visible={layerMenuVisible} onDismiss={() => setLayerMenuVisible(false)}>
                    <Dialog.Title>Capas Visibles</Dialog.Title>
                    <Dialog.Content>
                        <View style={{ flexDirection: 'row', justifyContent: 'space-around', marginBottom: 10 }}>
                            <Button mode="text" onPress={() => toggleAllLayers(true)}>Todas</Button>
                            <Button mode="text" onPress={() => toggleAllLayers(false)}>Ninguna</Button>
                        </View>
                        <Checkbox.Item label="Postes" status={tempLayers.postes ? 'checked' : 'unchecked'} onPress={() => setTempLayers(prev => ({ ...prev, postes: !prev.postes }))} />
                        <Checkbox.Item label="Cámaras" status={tempLayers.camaras ? 'checked' : 'unchecked'} onPress={() => setTempLayers(prev => ({ ...prev, camaras: !prev.camaras }))} />
                        <Checkbox.Item label="Líneas BT" status={tempLayers.bt ? 'checked' : 'unchecked'} onPress={() => setTempLayers(prev => ({ ...prev, bt: !prev.bt }))} />
                        <Checkbox.Item label="Líneas MT" status={tempLayers.mt ? 'checked' : 'unchecked'} onPress={() => setTempLayers(prev => ({ ...prev, mt: !prev.mt }))} />
                        <Checkbox.Item label="Empalmes" status={tempLayers.empalmes ? 'checked' : 'unchecked'} onPress={() => setTempLayers(prev => ({ ...prev, empalmes: !prev.empalmes }))} />
                        <Checkbox.Item label="Luminarias" status={tempLayers.luminarias ? 'checked' : 'unchecked'} onPress={() => setTempLayers(prev => ({ ...prev, luminarias: !prev.luminarias }))} />
                        <Checkbox.Item label="Seccionamientos" status={tempLayers.seccionamientos ? 'checked' : 'unchecked'} onPress={() => setTempLayers(prev => ({ ...prev, seccionamientos: !prev.seccionamientos }))} />
                        <Checkbox.Item label="Subestaciones" status={tempLayers.subestaciones ? 'checked' : 'unchecked'} onPress={() => setTempLayers(prev => ({ ...prev, subestaciones: !prev.subestaciones }))} />
                        <Checkbox.Item label="Estructuras" status={tempLayers.estructuras ? 'checked' : 'unchecked'} onPress={() => setTempLayers(prev => ({ ...prev, estructuras: !prev.estructuras }))} />
                        <Checkbox.Item label="Tirantes" status={tempLayers.tirantes ? 'checked' : 'unchecked'} onPress={() => setTempLayers(prev => ({ ...prev, tirantes: !prev.tirantes }))} />
                        <Checkbox.Item label="Tierras" status={tempLayers.tierras ? 'checked' : 'unchecked'} onPress={() => setTempLayers(prev => ({ ...prev, tierras: !prev.tierras }))} />
                    </Dialog.Content>
                    <Dialog.Actions>
                        <Button onPress={() => setLayerMenuVisible(false)}>Cancelar</Button>
                        <Button onPress={saveLayers}>Aceptar</Button>
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
        zIndex: 100,
        elevation: 5,
    },
    controlButton: {
        backgroundColor: "white",
        marginBottom: 12,
        elevation: 3,
    },
    fab: {
        // Style... 
    }
});