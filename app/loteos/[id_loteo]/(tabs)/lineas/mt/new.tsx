import { useAuth } from '@/src/contexts/AuthContext'
import { useLoteo } from '@/src/contexts/LoteoContext'
import { addLineaMT } from '@/src/database/queries/lineas_mt'
import { LineaMT } from '@/src/types'
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

const NuevaLineaMT = () => {
    const db = useSQLiteContext()
    const params = useLocalSearchParams()
    const { currentLoteoId } = useLoteo() // Cambiar de currentSoporteId a currentLoteoId
    const { session } = useAuth()

    console.log('Parámetros recibidos:', params)

    // Estado inicial vacío
    const [lineaMT, setLineaMT] = useState<Partial<LineaMT>>({
        // Inicializar vacío, se llenará con useEffect
    })

    // Efecto para cargar parámetros cuando cambien
    useEffect(() => {
        if (params.id_soporte_inicio && params.id_soporte_final) {
            console.log('Cargando nuevos parámetros:', params)
            setLineaMT(prev => ({
                ...prev,
                id_soporte_inicio: Number(params.id_soporte_inicio),
                id_soporte_final: Number(params.id_soporte_final),
                created_by: session?.user.id,
                updated_by: session?.user.id,
            }))
        }
    }, [params.id_soporte_inicio, params.id_soporte_final, session?.user.id])

    // Efecto para resetear cuando la pantalla se enfoque
    useEffect(() => {
        // Resetear el estado cuando la pantalla se monta
        const resetState = () => {
            setLineaMT({
                id_soporte_inicio: params.id_soporte_inicio ? Number(params.id_soporte_inicio) : 0,
                id_soporte_final: params.id_soporte_final ? Number(params.id_soporte_final) : 0,
                created_by: session?.user.id,
                updated_by: session?.user.id,
            })
        }

        resetState()

        // También puedes agregar un listener para cuando la pantalla se enfoque
        // usando useFocusEffect si lo necesitas
    }, [])

    const handleFasesChange = (value: string) => {
        setLineaMT(prev => ({
            ...prev,
            fases: Number(value)
        }))
    }

    const handleSeccionChange = (value: string) => {
        setLineaMT(prev => ({
            ...prev,
            seccion: Number(value)
        }))
    }

    const handleMaterialConductorChange = (value: string) => {
        setLineaMT(prev => ({
            ...prev,
            material: value as any
        }))
    }

    const handleCondicionChange = (value: string) => {
        setLineaMT(prev => ({
            ...prev,
            condicion: value as any
        }))
    }

    const handleNotasChange = (value: string) => {
        setLineaMT(prev => ({
            ...prev,
            notas: value
        }))
    }

    const handleAislacionChange = (value: string) => {
        setLineaMT(prev => ({
            ...prev,
            aislacion: value as any
        }))
    }

    const crearLineaMT = async () => {
        if (!lineaMT.id_soporte_inicio || !lineaMT.id_soporte_final) {
            Alert.alert('Error', 'No se han especificado los soportes de inicio y fin')
            return
        }

        if (!lineaMT.fases) {
            Alert.alert('Error', 'El número de fases es obligatorio')
            return
        }

        if (!lineaMT.seccion) {
            Alert.alert('Error', 'La sección es obligatoria')
            return
        }

        if (!lineaMT.material?.trim()) {
            Alert.alert('Error', 'El material del conductor es obligatorio')
            return
        }

        if (!lineaMT.condicion?.trim()) {
            Alert.alert('Error', 'La condición es obligatoria')
            return
        }

        try {
            const resultado = await addLineaMT(db, lineaMT)
            Alert.alert('Éxito', `Linea MT creada con id: ${resultado.lastInsertRowId}`)

            // Navegar al mapa con reset
            router.replace({
                pathname: `/loteos/${currentLoteoId}/(tabs)/mapa`,
                params: { refresh: Date.now().toString() }
            })

        } catch (error) {
            console.error(error)
            Alert.alert('Error', JSON.stringify(error))
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
                Nuevo Tramo MT
            </Text>

            {/* Mostrar información de los soportes seleccionados */}
            <Text variant="bodyLarge" style={styles.soporteInfo}>
                Soporte Inicio: {lineaMT.id_soporte_inicio || 'No seleccionado'}
            </Text>
            <Text variant="bodyLarge" style={styles.soporteInfo}>
                Soporte Fin: {lineaMT.id_soporte_final || 'No seleccionado'}
            </Text>

            {/* --- Inputs --- */}
            <SegmentedButtons
                value={lineaMT.fases?.toString() || ''}
                onValueChange={handleFasesChange}
                buttons={[
                    { value: '1', label: 'Monofásico' },
                    { value: '2', label: 'Bifásico' },
                    { value: '3', label: 'Trifásico' },
                ]}
                style={styles.segmentedButtons}
            />

            <SegmentedButtons
                value={lineaMT.material || ''}
                onValueChange={handleMaterialConductorChange}
                buttons={[
                    { value: 'ALUMINIO', label: 'Aluminio' },
                    { value: 'COBRE', label: 'Cobre' },
                ]}
                style={styles.segmentedButtons}
            />

            <SegmentedButtons
                value={lineaMT.aislacion || ''}
                onValueChange={handleAislacionChange}
                buttons={[
                    { value: 'DESNUDO', label: 'Desnudo' },
                    { value: 'AISLADO', label: 'Aislado' },
                ]}
                style={styles.segmentedButtons}
            />

            <TextInput
                label="Seccion mm2"
                value={lineaMT.seccion?.toString() || ''}
                onChangeText={handleSeccionChange}
                style={styles.input}
                mode="outlined"
                keyboardType='numeric'
            />

            <SegmentedButtons
                value={lineaMT.condicion || ''}
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
                value={lineaMT.notas || ''}
                onChangeText={handleNotasChange}
                style={styles.input}
                mode="outlined"
                multiline
                numberOfLines={4}
            />

            <Button
                mode="contained"
                onPress={crearLineaMT}
                style={styles.button}
                icon="check"
                disabled={!lineaMT.id_soporte_inicio || !lineaMT.id_soporte_final}
            >
                Crear Tramo MT
            </Button>

            <Button
                mode="outlined"
                onPress={() => router.back()}
                style={styles.button}
                icon="arrow-left"
            >
                Cancelar
            </Button>

            {/* Solo para debug */}
            <Text variant="bodySmall" style={styles.debugText}>
                Parámetros: {JSON.stringify(params)}
            </Text>
            <Text variant="bodySmall" style={styles.debugText}>
                Estado: {JSON.stringify(lineaMT)}
            </Text>
        </KeyboardAwareScrollView>
    )
}

export default NuevaLineaMT

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
    },
    soporteInfo: {
        backgroundColor: '#e3f2fd',
        padding: 10,
        borderRadius: 5,
        marginBottom: 10,
        fontWeight: '600',
    },
    input: {
        marginBottom: 12,
        backgroundColor: "white",
    },
    segmentedButtons: {
        marginBottom: 16,
    },
    sectionTitle: {
        marginTop: 16,
        marginBottom: 8,
        fontWeight: "600",
    },
    row: {
        flexDirection: "row",
        gap: 8,
        marginBottom: 12,
    },
    halfInput: {
        flex: 1,
    },
    button: {
        marginBottom: 12,
    },
    debugText: {
        marginTop: 10,
        fontSize: 10,
        color: '#666',
    },
})