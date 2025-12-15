import React, { memo, useMemo } from 'react';
import { View } from 'react-native';
import { Marker } from 'react-native-maps';

interface MarkerData {
    id: number;
    latitude: number;
    longitude: number;
    tipo: string;
    placa?: string;
    soporte_id?: number;
}

interface MapMarkersProps {
    markers: MarkerData[];
    selectedSoportes: MarkerData[];
    onMarkerPress: (marker: MarkerData) => void;
    onCalloutPress: (id: number) => void;
}

const getMarkerColor = (tipo: string, isSelected: boolean) => {
    if (isSelected) {
        return '#FFD700'; // Amarillo para marcadores seleccionados
    }

    switch (tipo) {
        case 'CAMARA': return '#03A9F4'; // Azul claro
        case 'POSTE': return '#e74c3c'; // Rojo
        case 'EMPALME': return '#9C27B0'; // Morado
        case 'LUMINARIA': return '#FF9800'; // Naranja
        case 'SECCIONAMIENTO': return '#E91E63'; // Rosa
        case 'SUBESTACION': return '#4CAF50'; // Verde
        case 'ESTRUCTURA': return '#795548'; // Marrón
        case 'TIRANTE': return '#607D8B'; // Gris Azulado
        case 'TIERRA': return '#000000'; // Negro
        default: return '#9E9E9E'; // Gris default
    }
};

const MapMarkers = ({ markers, selectedSoportes, onMarkerPress, onCalloutPress }: MapMarkersProps) => {

    // Crear un Set de IDs seleccionados para búsqueda O(1) en lugar de O(n)
    const selectedIds = useMemo(() => {
        return new Set(selectedSoportes.map(s => `${s.tipo}-${s.id}`));
    }, [selectedSoportes]);

    // Memoizar los datos procesados de los marcadores
    const processedMarkers = useMemo(() => {
        return markers.map((marker) => {
            const key = `${marker.tipo}-${marker.id}`;
            const isSelected = selectedIds.has(key);
            const size = isSelected ? 28 : 22;
            const color = getMarkerColor(marker.tipo, isSelected);

            return {
                ...marker,
                key,
                isSelected,
                size,
                color,
                zIndex: isSelected ? 999 : 1
            };
        });
    }, [markers, selectedIds]);

    return (
        <>
            {processedMarkers.map((marker) => (
                <Marker
                    key={marker.key}
                    coordinate={{ latitude: marker.latitude, longitude: marker.longitude }}
                    title={`${marker.tipo}`}
                    description={marker.placa ? `${marker.placa}` : `ID #${marker.id}`}
                    onPress={() => onMarkerPress(marker)}
                    onCalloutPress={() => onCalloutPress(marker.soporte_id || marker.id)}
                    zIndex={marker.zIndex}
                >
                    <View style={{
                        width: marker.size,
                        height: marker.size,
                        borderRadius: marker.size / 2,
                        backgroundColor: marker.color,
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
        </>
    );
};

export default memo(MapMarkers);
