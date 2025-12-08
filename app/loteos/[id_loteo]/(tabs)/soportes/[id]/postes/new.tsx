import { useLoteo } from '@/src/contexts/LoteoContext'
import { addPoste } from '@/src/database/queries/postes'
import { Poste } from '@/src/types'
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

const NuevoPoste = () => {
    const db = useSQLiteContext()
    const params = useLocalSearchParams()
    const { currentLoteoId, currentSoporteId } = useLoteo()

    // Asegurar que tenemos un id_soporte válido
    const soporteId = currentSoporteId || (params.id ? Number(params.id) : 0)

    const [poste, setPoste] = useState<Partial<Poste>>({
        id_soporte: soporteId,
        placa: '',
        material: '',
        altura_nivel_tension: '',
        condicion: '',
        notas: '',
        created_by: params.userId as string || '',
        updated_by: params.userId as string || ''
    })
    const [isSinPlaca, setIsSinPlaca] = useState(false)

    const toggleSinPlaca = () => {
        if (!isSinPlaca) {
            setPoste(prev => ({ ...prev, placa: 'SIN PLACA' }))
            setIsSinPlaca(true)
        } else {
            setPoste(prev => ({ ...prev, placa: '' }))
            setIsSinPlaca(false)
        }
    }

    const handleNivelTensionChange = (value: string) => {
        setPoste(prev => ({
            ...prev,
            altura_nivel_tension: value as any
        }))
    }

    const handleMaterialChange = (value: string) => {
        setPoste(prev => ({
            ...prev,
            material: value
        }))
    }

    const handleCondicionChange = (value: string) => {
        setPoste(prev => ({
            ...prev,
            condicion: value
        }))
    }

    const handleNotasChange = (value: string) => {
        setPoste(prev => ({
            ...prev,
            notas: value
        }))
    }

    const crearPoste = async () => {
        if (!poste.placa?.trim()) {
            Alert.alert('Error', 'La placa es obligatoria')
            return
        }

        if (!poste.altura_nivel_tension?.trim()) {
            Alert.alert('Error', 'El nivel de tensión es obligatorio')
            return
        }


        if (!poste.material?.trim()) {
            Alert.alert('Error', 'El material es obligatorio')
            return
        }


        if (!poste.condicion?.trim()) {
            Alert.alert('Error', 'La condición es obligatoria')
            return
        }

        try {
            const resultado = await addPoste(db, poste)
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
                Nuevo Poste
            </Text>

            {/* --- Inputs --- */}
            <TextInput
                label="Placa *"
                value={poste.placa}
                onChangeText={text => setPoste({ ...poste, placa: text })}
                style={styles.input}
                mode="outlined"
                disabled={isSinPlaca}
                right={<TextInput.Icon icon={isSinPlaca ? 'close-circle' : 'tag-off'} onPress={toggleSinPlaca} forceTextInputFocus={false} />}
            />

            <SegmentedButtons
                value={poste.altura_nivel_tension || ''}
                onValueChange={handleNivelTensionChange}
                buttons={[
                    { value: 'BT', label: 'BT (Baja Tensión)' },
                    { value: 'MT', label: 'MT (Media Tensión)' },
                ]}
                style={styles.segmentedButtons}
            />

            {/* botones para elegir material de poste */}
            <SegmentedButtons
                value={poste.material || ''}
                onValueChange={handleMaterialChange}
                buttons={[
                    { value: 'MADERA', label: 'Madera' },
                    { value: 'CONCRETO', label: 'Concreto' },
                    { value: 'METAL', label: 'Metal' },
                ]}
                style={styles.segmentedButtons}
            />

            {/* botones para elegir condicion de poste */}
            <SegmentedButtons
                value={poste.condicion || ''}
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
                value={poste.notas}
                onChangeText={handleNotasChange}
                style={styles.input}
                mode="outlined"
                multiline
                numberOfLines={4}
            />

            <Button mode="contained" onPress={crearPoste} style={styles.button} icon="check">
                Crear Poste
            </Button>

            <Button mode="outlined" onPress={() => router.back()} style={styles.button} icon="arrow-left">
                Cancelar
            </Button>
            <Text variant="bodyMedium">{JSON.stringify(poste)}</Text>
        </KeyboardAwareScrollView>
    )
}

export default NuevoPoste

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
