import { getCamarasByLoteoId } from '@/src/database/queries/camaras';
import { getEmpalmesByLoteoId } from '@/src/database/queries/empalmes';
import { getEstructurasByLoteoId } from '@/src/database/queries/estructuras';
import { getLineasBTByLoteoId } from '@/src/database/queries/lineas_bt';
import { getLineasMTByLoteoId } from '@/src/database/queries/lineas_mt';
import { getLoteoById } from '@/src/database/queries/loteos';
import { getLuminariasByLoteoId } from '@/src/database/queries/luminarias';
import { getPostesByLoteoId } from '@/src/database/queries/postes';
import { getSeccionamientosByLoteoId } from '@/src/database/queries/seccionamientos';
import { getSoportesByLoteoId } from '@/src/database/queries/soportes';
import { getSubestacionesByLoteoId } from '@/src/database/queries/subestaciones';
import { getTierrasByLoteoId } from '@/src/database/queries/tierras';
import { getTirantesByLoteoId } from '@/src/database/queries/tirantes';
import * as FileSystem from 'expo-file-system/legacy';
import * as Sharing from 'expo-sharing';
import { useSQLiteContext } from 'expo-sqlite';
import React, { useState } from 'react';
import { Alert, StyleSheet, View } from 'react-native';
import { Button } from 'react-native-paper';

interface ExportJsonButtonProps {
    loteoId: number | null;
}

export default function ExportJsonButton({ loteoId }: ExportJsonButtonProps) {
    const [exporting, setExporting] = useState(false);
    const db = useSQLiteContext();

    const handleExport = async () => {
        if (!loteoId) {
            Alert.alert('Error', 'No hay un loteo seleccionado');
            return;
        }

        setExporting(true);

        try {
            // Cargar todos los datos
            const [loteo, soportes, postes, camaras, lineasBT, lineasMT, estructuras, seccionamientos, subestaciones, tirantes, tierras, luminarias, empalmes] = await Promise.all([
                getLoteoById(db, loteoId),
                getSoportesByLoteoId(db, loteoId),
                getPostesByLoteoId(db, loteoId),
                getCamarasByLoteoId(db, loteoId),
                getLineasBTByLoteoId(db, loteoId),
                getLineasMTByLoteoId(db, loteoId),
                getEstructurasByLoteoId(db, loteoId),
                getSeccionamientosByLoteoId(db, loteoId),
                getSubestacionesByLoteoId(db, loteoId),
                getTirantesByLoteoId(db, loteoId),
                getTierrasByLoteoId(db, loteoId),
                getLuminariasByLoteoId(db, loteoId),
                getEmpalmesByLoteoId(db, loteoId)
            ]);

            // Crear objeto de datos
            const exportData = {
                loteo,
                soportes,
                postes,
                camaras,
                lineasBT,
                lineasMT,
                estructuras,
                seccionamientos,
                subestaciones,
                tirantes,
                tierras,
                luminarias,
                empalmes,
                metadata: {
                    export_date: new Date().toISOString(),
                    total_soportes: soportes.length,
                    total_lineas_bt: lineasBT.length,
                    total_lineas_mt: lineasMT.length,
                    total_empalmes: empalmes.length,
                    total_camaras: camaras.length,
                    total_estructuras: estructuras.length,
                    total_seccionamientos: seccionamientos.length,
                    total_subestaciones: subestaciones.length,
                    total_tirantes: tirantes.length,
                    total_tierras: tierras.length,
                    total_luminarias: luminarias.length,
                    total_postes: postes.length
                }
            };

            // Crear nombre de archivo
            const timestamp = new Date().getTime();
            const fileName = `loteo_${loteoId}_${timestamp}.json`;
            const filePath = `${FileSystem.documentDirectory || FileSystem.cacheDirectory}${fileName}`;

            // Convertir a JSON y guardar
            const jsonContent = JSON.stringify(exportData, null, 0);
            await FileSystem.writeAsStringAsync(filePath, jsonContent, { encoding: 'utf8' });

            // Intentar compartir
            const canShare = await Sharing.isAvailableAsync();

            if (canShare) {
                await Sharing.shareAsync(filePath, {
                    mimeType: 'application/json',
                    dialogTitle: `Exportar Loteo ${loteoId}`,
                    UTI: 'public.json'
                });
            } else {
                Alert.alert(
                    'Exportado',
                    `Archivo guardado en:\n${filePath}`,
                    [{ text: 'OK' }]
                );
            }

        } catch (error: any) {
            console.error('Error al exportar:', error);
            Alert.alert('Error', `No se pudo exportar: ${error.message}`);
        } finally {
            setExporting(false);
        }
    };

    if (!loteoId) {
        return null;
    }

    return (
        <View style={styles.container}>
            <Button
                mode="contained"
                onPress={handleExport}
                disabled={exporting}
                icon={exporting ? "loading" : "database-export"}
                loading={exporting}
                style={styles.button}
                buttonColor="#4CAF50"
            >
                {exporting ? 'Exportando...' : 'Exportar JSON'}
            </Button>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        marginBottom: 8,
    },
    button: {
        borderRadius: 8,
        paddingVertical: 6,
    },
});