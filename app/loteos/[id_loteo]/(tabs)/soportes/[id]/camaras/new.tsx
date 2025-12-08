import { useLoteo } from '@/src/contexts/LoteoContext'
import { addCamara } from '@/src/database/queries/camaras'
import { Camara } from '@/src/types'
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

const NuevaCamara = () => {
    const db = useSQLiteContext()
    const params = useLocalSearchParams()
    const { currentSoporteId } = useLoteo()

    // Asegurar que tenemos un id_soporte válido
    const soporteId = currentSoporteId || (params.id ? Number(params.id) : 0)

    const [camara, setCamara] = useState<Partial<Camara>>({
        id_soporte: soporteId,
        created_by: params.userId as string || '',
        updated_by: params.userId as string || ''
    })

    const handleTipoCamaraChange = (value: string) => {
        setCamara(prev => ({
            ...prev,
            tipo_camara: value
        }))
    }

    const handleCondicionChange = (value: string) => {
        setCamara(prev => ({
            ...prev,
            condicion: value
        }))
    }

    const crearCamara = async () => {

        if (!camara.tipo_camara?.trim()) {
            Alert.alert('Error', 'El tipo de camara es obligatorio')
            return
        }

        if (!camara.placa?.trim()) {
            Alert.alert('Error', 'La placa es obligatoria')
            return
        }


        if (!camara.condicion?.trim()) {
            Alert.alert('Error', 'La condición es obligatoria')
            return
        }

        try {
            const resultado = await addCamara(db, camara)
            Alert.alert('Éxito', `Poste creado con id: ${resultado.lastInsertRowId}`)
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
                Nueva Camara
            </Text>

            {/* --- Inputs --- */}
            <TextInput
                label="Placa *"
                value={camara.placa}
                onChangeText={text => setCamara({ ...camara, placa: text })}
                style={styles.input}
                mode="outlined"
            />

            <SegmentedButtons
                value={camara.tipo_camara || ''}
                onValueChange={handleTipoCamaraChange}
                buttons={[
                    { value: 'A', label: 'A (Pequeña)' },
                    { value: 'B', label: 'B (Mediana)' },
                    { value: 'C', label: 'C (Grande)' },
                ]}
                style={styles.segmentedButtons}
            />

            {/* botones para elegir condicion de poste */}
            <SegmentedButtons
                value={camara.condicion || ''}
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
                value={camara.notas}
                onChangeText={text => setCamara({ ...camara, notas: text })}
                style={styles.input}
                mode="outlined"
                multiline
                numberOfLines={4}
            />

            <Button mode="contained" onPress={crearCamara} style={styles.button} icon="check">
                Crear Camara
            </Button>

            <Button mode="outlined" onPress={() => router.back()} style={styles.button} icon="arrow-left">
                Cancelar
            </Button>
            <Text variant="bodyMedium">{JSON.stringify(camara)}</Text>
        </KeyboardAwareScrollView>
    )
}

export default NuevaCamara

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
