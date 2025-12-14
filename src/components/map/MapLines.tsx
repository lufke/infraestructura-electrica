import React, { memo } from 'react';
import { Polyline } from 'react-native-maps';

export interface LineaMapa {
    id: number;
    tipo: 'linea_bt' | 'linea_mt';
    soporte_inicio_id: number;
    soporte_final_id: number;
    distancia_metros?: number;
    coordenadas: Array<{ latitude: number; longitude: number }>;
}

interface MapLinesProps {
    lineas: LineaMapa[];
    showTempLine: boolean;
    tempLineCoordinates?: Array<{ latitude: number; longitude: number }>;
    isLineMode?: 'linea_bt' | 'linea_mt' | null;
}

const MapLines = ({ lineas, showTempLine, tempLineCoordinates, isLineMode }: MapLinesProps) => {

    const getLineColor = (tipo?: 'linea_bt' | 'linea_mt') => {
        const lineType = tipo || isLineMode;
        if (lineType === 'linea_bt') {
            return '#22ff3fff'; // Verde para BT
        } else if (lineType === 'linea_mt') {
            return '#ff0000ff'; // Rojo para MT
        }
        return '#3498db'; // Azul por defecto
    };

    return (
        <>
            {/* Líneas existentes (BT y MT) */}
            {lineas.map((linea) => (
                <Polyline
                    key={`${linea.tipo}-${linea.id}`}
                    coordinates={linea.coordenadas}
                    strokeColor={getLineColor(linea.tipo)}
                    strokeWidth={3}
                />
            ))}

            {/* Línea temporal entre soportes seleccionados (solo en modo creación) */}
            {showTempLine && tempLineCoordinates && (
                <Polyline
                    coordinates={tempLineCoordinates}
                    strokeColor={getLineColor()}
                    strokeWidth={4}
                    lineDashPattern={[10, 5]} // Línea punteada para distinguirla de las existentes
                />
            )}
        </>
    );
};

export default memo(MapLines);
