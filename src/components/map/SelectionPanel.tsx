import React, { memo } from 'react';
import { StyleSheet, View } from 'react-native';
import { Button, Chip, IconButton, Text } from 'react-native-paper';

interface MarkerData {
    id: number;
    latitude: number;
    longitude: number;
    tipo: string;
    placa?: string;
}

interface SelectionPanelProps {
    isLineMode: 'linea_bt' | 'linea_mt' | null;
    selectedSoportes: MarkerData[];
    distance: number | null;
    onClose: () => void;
    onRemoveSoporte: (id: number) => void;
    onSave: () => void;
}

const SelectionPanel = ({ isLineMode, selectedSoportes, distance, onClose, onRemoveSoporte, onSave }: SelectionPanelProps) => {
    if (!isLineMode) return null;

    const getLineLabel = () => {
        if (isLineMode === 'linea_bt') {
            return 'Línea BT';
        } else if (isLineMode === 'linea_mt') {
            return 'Línea MT';
        }
        return 'Línea';
    };

    const getLineColor = () => {
        if (isLineMode === 'linea_bt') {
            return '#22ff3fff';
        } else if (isLineMode === 'linea_mt') {
            return '#ff0000ff';
        }
        return '#3498db';
    };

    const formatDistance = (meters: number) => {
        if (meters >= 1000) {
            return `${(meters / 1000).toFixed(2)} km`;
        }
        return `${meters} m`;
    };

    const lineColor = getLineColor();

    return (
        <View style={[styles.selectionPanel, { borderColor: lineColor }]}>
            <View style={styles.selectionHeader}>
                <IconButton
                    icon="close"
                    size={20}
                    onPress={onClose}
                    style={styles.closeButton}
                />
                <Text variant="titleMedium" style={styles.modeTitle}>
                    {getLineLabel()}
                </Text>
            </View>

            <Text variant="bodyLarge" style={styles.selectionTitle}>
                {selectedSoportes.length === 0 && "👆 Selecciona el primer soporte"}
                {selectedSoportes.length === 1 && `✅ Primer soporte: ${selectedSoportes[0].tipo} #${selectedSoportes[0].id}`}
                {selectedSoportes.length === 2 && "✅ Listo! Presiona 'Guardar Línea' para continuar"}
            </Text>

            {selectedSoportes.length > 0 && (
                <View style={styles.chipsContainer}>
                    {selectedSoportes.map(soporte => (
                        <Chip
                            key={soporte.id}
                            style={[styles.chip, { backgroundColor: '#FFF3CD' }]}
                            textStyle={{ color: '#856404' }}
                            onClose={() => onRemoveSoporte(soporte.id)}
                        >
                            {soporte.tipo} #{soporte.id}
                        </Chip>
                    ))}
                </View>
            )}

            {distance !== null && (
                <Text variant="titleMedium" style={styles.distanceText}>
                    📐 Distancia: {formatDistance(distance)}
                </Text>
            )}

            {/* Botón para guardar la línea */}
            <Button
                mode="contained"
                onPress={onSave}
                disabled={selectedSoportes.length !== 2}
                icon="content-save"
                style={styles.saveButton}
                buttonColor={lineColor}
            >
                Guardar Línea
            </Button>
        </View>
    );
};

const styles = StyleSheet.create({
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
    saveButton: {
        marginTop: 8,
    }
});

export default memo(SelectionPanel);
