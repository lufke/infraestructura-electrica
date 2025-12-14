import React, { memo } from 'react';
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

const MapMarkers = ({ markers, selectedSoportes, onMarkerPress, onCalloutPress }: MapMarkersProps) => {

    const getMarkerColor = (marker: { id: number; tipo: string }) => {
        const isSelected = selectedSoportes.some(s => s.id === marker.id && s.tipo === marker.tipo);

        if (isSelected) {
            return '#FFD700'; // Amarillo para marcadores seleccionados
        }

        switch (marker.tipo) {
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

    const getMarkerSize = (marker: { id: number; tipo: string }) => {
        const isSelected = selectedSoportes.some(s => s.id === marker.id && s.tipo === marker.tipo);
        return isSelected ? 28 : 22;
    };

    return (
        <>
            {markers.map((marker) => (
                <Marker
                    key={`${marker.tipo}-${marker.id}`}
                    coordinate={{ latitude: marker.latitude, longitude: marker.longitude }}
                    title={`${marker.tipo}`}
                    description={marker.placa ? `${marker.placa}` : `ID #${marker.id}`}
                    onPress={() => onMarkerPress(marker)}
                    onCalloutPress={() => onCalloutPress(marker.soporte_id || marker.id)}
                    zIndex={selectedSoportes.some(s => s.id === marker.id) ? 999 : 1}
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
        </>
    );
};

export default memo(MapMarkers);
