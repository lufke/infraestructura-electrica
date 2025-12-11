import { useAuth } from '@/src/contexts/AuthContext'
import { useLoteo } from '@/src/contexts/LoteoContext'
import { addLineaBT } from '@/src/database/queries/lineas_bt'
import { LineaBT } from '@/src/types'
import { router, useLocalSearchParams } from 'expo-router'
import { useSQLiteContext } from 'expo-sqlite'
import React, { useEffect, useState } from 'react'; // Agregar useEffect
import {
    Alert,
    StyleSheet,
} from 'react-native'
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view"
import {
    Button,
    SegmentedButtons,
    Text,
    TextInput
} from 'react-native-paper'

const NuevaLineaBT = () => {
    const db = useSQLiteContext()
    const params = useLocalSearchParams()
    const { currentLoteoId } = useLoteo() // Cambiar a currentLoteoId
    const { session } = useAuth()

    console.log('Parámetros BT recibidos:', params)

    // Estado inicial vacío
    const [lineaBT, setLineaBT] = useState<Partial<LineaBT>>({
        // Inicializar vacío, se llenará con useEffect
    })

    // Efecto para cargar parámetros cuando cambien
    useEffect(() => {
        if (params.id_soporte_inicio && params.id_soporte_final) {
            console.log('Cargando nuevos parámetros BT:', params)
            setLineaBT(prev => ({
                ...prev,
                id_soporte_inicio: Number(params.id_soporte_inicio),
                id_soporte_final: Number(params.id_soporte_final),
                created_by: session?.user.id,
                updated_by: session?.user.id,
            }))
        }
    }, [params.id_soporte_inicio, params.id_soporte_final, session?.user.id])

    // Efecto para resetear cuando la pantalla se monte
    useEffect(() => {
        // Resetear el estado cuando la pantalla se monta
        const resetState = () => {
            setLineaBT({
                id_soporte_inicio: params.id_soporte_inicio ? Number(params.id_soporte_inicio) : 0,
                id_soporte_final: params.id_soporte_final ? Number(params.id_soporte_final) : 0,
                created_by: session?.user.id,
                updated_by: session?.user.id,
            })
        }

        resetState()
    }, [])

    const handleFasesChange = (value: string) => {
        setLineaBT(prev => ({
            ...prev,
            fases: Number(value)
        }))
    }

    const handleSeccionChange = (value: string) => {
        // Validar que sea un número
        const numValue = parseInt(value, 10)
        if (!isNaN(numValue)) {
            setLineaBT(prev => ({
                ...prev,
                seccion: numValue
            }))
        } else if (value === '') {
            setLineaBT(prev => ({
                ...prev,
                seccion: undefined
            }))
        }
    }

    const handleMaterialConductorChange = (value: string) => {
        setLineaBT(prev => ({
            ...prev,
            material: value as any
        }))
    }

    const handleCondicionChange = (value: string) => {
        setLineaBT(prev => ({
            ...prev,
            condicion: value as any
        }))
    }

    const handleNotasChange = (value: string) => {
        setLineaBT(prev => ({
            ...prev,
            notas: value
        }))
    }

    const handleAislacionChange = (value: string) => {
        setLineaBT(prev => ({
            ...prev,
            aislacion: value as any
        }))
    }

    const crearLineaBT = async () => {
        // Validar que tenemos los soportes
        if (!lineaBT.id_soporte_inicio || !lineaBT.id_soporte_final) {
            Alert.alert('Error', 'No se han especificado los soportes de inicio y fin')
            return
        }

        if (!lineaBT.fases) {
            Alert.alert('Error', 'El número de fases es obligatorio')
            return
        }

        if (!lineaBT.seccion) {
            Alert.alert('Error', 'La sección es obligatoria')
            return
        }

        if (!lineaBT.material?.trim()) {
            Alert.alert('Error', 'El material del conductor es obligatorio')
            return
        }

        if (!lineaBT.condicion?.trim()) {
            Alert.alert('Error', 'La condición es obligatoria')
            return
        }

        if (!lineaBT.aislacion?.trim()) {
            Alert.alert('Error', 'La aislación es obligatoria')
            return
        }

        try {
            const resultado = await addLineaBT(db, lineaBT)
            Alert.alert('Éxito', `Línea BT creada con id: ${resultado.lastInsertRowId}`)

            // Navegar al mapa con reset
            if (currentLoteoId) {
                router.replace({
                    pathname: `/loteos/${currentLoteoId}/(tabs)/mapa`,
                    params: { refresh: Date.now().toString() }
                })
            } else {
                router.back()
            }

        } catch (error) {
            console.error('Error al crear línea BT:', error)
            Alert.alert('Error', 'No se pudo crear la línea BT')
        }
    }

    return (
        <KeyboardAwareScrollView
            style={styles.container}
            contentContainerStyle={styles.content}
            enableOnAndroid
            extraScrollHeight={40}
            keyboardShouldPersistTaps="handled"
        >
            <Text variant="headlineMedium" style={styles.title}>
                Nuevo Tramo BT
            </Text>

            {/* Mostrar información de los soportes seleccionados */}
            <Text variant="bodyLarge" style={styles.soporteInfo}>
                Soporte Inicio: {lineaBT.id_soporte_inicio || 'No seleccionado'}
            </Text>
            <Text variant="bodyLarge" style={styles.soporteInfo}>
                Soporte Fin: {lineaBT.id_soporte_final || 'No seleccionado'}
            </Text>

            {/* --- Inputs --- */}
            <Text variant="bodyMedium" style={styles.label}>Número de Fases:</Text>
            <SegmentedButtons
                value={lineaBT.fases?.toString() || ''}
                onValueChange={handleFasesChange}
                buttons={[
                    { value: '1', label: 'Monofásico' },
                    { value: '3', label: 'Trifásico' },
                ]}
                style={styles.segmentedButtons}
            />

            <Text variant="bodyMedium" style={styles.label}>Material del Conductor:</Text>
            <SegmentedButtons
                value={lineaBT.material || ''}
                onValueChange={handleMaterialConductorChange}
                buttons={[
                    { value: 'ALUMINIO', label: 'Aluminio' },
                    { value: 'COBRE', label: 'Cobre' },
                ]}
                style={styles.segmentedButtons}
            />

            <Text variant="bodyMedium" style={styles.label}>Aislación:</Text>
            <SegmentedButtons
                value={lineaBT.aislacion || ''}
                onValueChange={handleAislacionChange}
                buttons={[
                    { value: 'DESNUDO', label: 'Desnudo' },
                    { value: 'AISLADO', label: 'Aislado' },
                ]}
                style={styles.segmentedButtons}
            />

            <TextInput
                label="Sección (mm²)"
                value={lineaBT.seccion?.toString() || ''}
                onChangeText={handleSeccionChange}
                style={styles.input}
                mode="outlined"
                keyboardType="numeric"
                placeholder="Ej: 16, 25, 35..."
            />

            <Text variant="bodyMedium" style={styles.label}>Condición:</Text>
            <SegmentedButtons
                value={lineaBT.condicion || ''}
                onValueChange={handleCondicionChange}
                buttons={[
                    { value: 'BUENO', label: 'Bueno' },
                    { value: 'REGULAR', label: 'Regular' },
                    { value: 'MALO', label: 'Malo' },
                ]}
                style={styles.segmentedButtons}
            />

            <TextInput
                label="Notas"
                value={lineaBT.notas || ''}
                onChangeText={handleNotasChange}
                style={[styles.input, styles.textArea]}
                mode="outlined"
                multiline
                numberOfLines={4}
                placeholder="Observaciones adicionales..."
            />

            <Button
                mode="contained"
                onPress={crearLineaBT}
                style={styles.button}
                icon="check"
                disabled={!lineaBT.id_soporte_inicio || !lineaBT.id_soporte_final}
            >
                Crear Tramo BT
            </Button>

            <Button
                mode="outlined"
                onPress={() => router.back()}
                style={styles.button}
                icon="arrow-left"
            >
                Cancelar
            </Button>

            {/* Solo para debug - puedes comentar esto en producción */}
            <Text variant="bodySmall" style={styles.debugText}>
                Parámetros: {JSON.stringify(params)}
            </Text>
        </KeyboardAwareScrollView>
    )
}

export default NuevaLineaBT

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#f5f5f5",
    },
    content: {
        padding: 16,
        paddingBottom: 40,
    },
    title: {
        textAlign: "center",
        fontWeight: "bold",
        marginBottom: 20,
        color: '#333',
    },
    soporteInfo: {
        backgroundColor: '#e8f5e9',
        padding: 12,
        borderRadius: 8,
        marginBottom: 12,
        fontWeight: '600',
        color: '#2e7d32',
        borderWidth: 1,
        borderColor: '#c8e6c9',
    },
    label: {
        marginBottom: 8,
        fontWeight: '600',
        color: '#444',
    },
    input: {
        marginBottom: 16,
        backgroundColor: "white",
    },
    textArea: {
        minHeight: 100,
    },
    segmentedButtons: {
        marginBottom: 20,
    },
    button: {
        marginBottom: 12,
    },
    debugText: {
        marginTop: 10,
        fontSize: 10,
        color: '#666',
        textAlign: 'center',
    },
})