import { useLoteo } from '@/src/contexts/LoteoContext'
import { addEstructura } from '@/src/database/queries/estructuras'
import { Estructura } from '@/src/types'
import { router, useLocalSearchParams } from 'expo-router'
import { useSQLiteContext } from 'expo-sqlite'
import React, { useState } from 'react'
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

const NuevaEstructura = () => {
    const db = useSQLiteContext()
    const params = useLocalSearchParams()
    const { currentSoporteId } = useLoteo()

    // Asegurar que tenemos un id_soporte válido
    const soporteId = currentSoporteId || (params.id ? Number(params.id) : 0)

    const [estructura, setEstructura] = useState<Partial<Estructura>>({
        id_soporte: soporteId,
        created_by: params.userId as string || '',
        updated_by: params.userId as string || ''
    })

    const handleNivelTensionChange = (value: string) => {
        setEstructura(prev => ({
            ...prev,
            nivel_tension: value as any,
            descripcion: undefined // Reset description when tension level changes
        }))
    }

    const getDescripcionOptions = () => {
        if (estructura.nivel_tension === 'BT') {
            return [
                { value: 'PASO', label: 'Paso' },
                { value: 'REMATE', label: 'Remate' },
                { value: 'DERIVACION', label: 'Derivación' },
                { value: 'LIMITE DE ZONA', label: 'Límite de Zona' },
            ]
        } else if (estructura.nivel_tension === 'MT') {
            return [
                { value: 'PORTANTE', label: 'Portante' },
                { value: 'REMATE', label: 'Remate' },
                { value: 'ANCLAJE', label: 'Anclaje' },
                { value: 'ARRANQUE', label: 'Arranque' },
            ]
        }
        return []
    }

    const handleFasesChange = (value: string) => {
        setEstructura(prev => ({
            ...prev,
            fases: Number(value)
        }))
    }

    const handleMaterialConductorChange = (value: string) => {
        setEstructura(prev => ({
            ...prev,
            material_conductor: value as any
        }))
    }

    const handleCondicionChange = (value: string) => {
        setEstructura(prev => ({
            ...prev,
            condicion: value as any
        }))
    }

    const handleNotasChange = (value: string) => {
        setEstructura(prev => ({
            ...prev,
            notas: value
        }))
    }

    const handleDescripcionChange = (value: string) => {
        setEstructura(prev => ({
            ...prev,
            descripcion: value
        }))
    }
    const crearEstructura = async () => {

        if (!estructura.descripcion?.trim()) {
            Alert.alert('Error', 'El tipo de estructura es obligatoria')
            return
        }

        if (!estructura.nivel_tension?.trim()) {
            Alert.alert('Error', 'El nivel de tensión es obligatorio')
            return
        }

        if (!estructura.fases) {
            Alert.alert('Error', 'El número de fases es obligatorio')
            return
        }

        if (!estructura.material_conductor?.trim()) {
            Alert.alert('Error', 'El material del conductor es obligatorio')
            return
        }

        if (!estructura.condicion?.trim()) {
            Alert.alert('Error', 'La condición es obligatoria')
            return
        }

        try {
            const resultado = await addEstructura(db, estructura)
            Alert.alert('Éxito', `Estructura creada con id: ${resultado.lastInsertRowId}`)
            router.back()
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
                Nueva Estructura
            </Text>

            {/* --- Inputs --- */}
            <SegmentedButtons
                value={estructura.nivel_tension || ''}
                onValueChange={handleNivelTensionChange}
                buttons={[
                    { value: 'BT', label: 'BT (Baja Tension)' },
                    { value: 'MT', label: 'MT (Media Tension)' },
                ]}
                style={styles.segmentedButtons}
            />

            {estructura.nivel_tension && (
                <SegmentedButtons
                    value={estructura.descripcion || ''}
                    onValueChange={handleDescripcionChange}
                    buttons={getDescripcionOptions()}
                    style={styles.segmentedButtons}
                />
            )}



            <SegmentedButtons
                value={estructura.fases?.toString() || ''}
                onValueChange={handleFasesChange}
                buttons={[
                    { value: '1', label: 'Monofásico' },
                    { value: '2', label: 'Bifásico' },
                    { value: '3', label: 'Trifásico' },
                ]}
                style={styles.segmentedButtons}
            />

            <SegmentedButtons
                value={estructura.material_conductor || ''}
                onValueChange={handleMaterialConductorChange}
                buttons={[
                    { value: 'ALUMINIO', label: 'Aluminio' },
                    { value: 'COBRE', label: 'Cobre' },
                ]}
                style={styles.segmentedButtons}
            />



            {/* botones para elegir condicion de poste */}
            <SegmentedButtons
                value={estructura.condicion || ''}
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
                value={estructura.notas}
                onChangeText={handleNotasChange}
                style={styles.input}
                mode="outlined"
                multiline
                numberOfLines={4}
            />

            <Button mode="contained" onPress={crearEstructura} style={styles.button} icon="check">
                Crear Estructura
            </Button>

            <Button mode="outlined" onPress={() => router.back()} style={styles.button} icon="arrow-left">
                Cancelar
            </Button>
            <Text variant="bodyMedium">{JSON.stringify(estructura)}</Text>
        </KeyboardAwareScrollView>
    )
}

export default NuevaEstructura

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
})
