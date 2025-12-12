import { useAuth } from '@/src/contexts/AuthContext'
import { useLoteo } from '@/src/contexts/LoteoContext'
import { addEmpalme } from '@/src/database/queries/empalmes'
import { Empalme } from '@/src/types'
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

const NuevoEmpalme = () => {
    const db = useSQLiteContext()
    const params = useLocalSearchParams()
    const { currentSoporteId } = useLoteo()
    const { session } = useAuth()

    // Asegurar que tenemos un id_soporte válido
    const soporteId = currentSoporteId || (params.id ? Number(params.id) : 0)

    const [empalme, setEmpalme] = useState<Partial<Empalme>>({
        id_soporte: soporteId,
        created_by: session?.user.id,
        updated_by: session?.user.id,
    })

    const handleNivelTensionChange = (value: string) => {
        setEmpalme(prev => ({
            ...prev,
            nivel_tension: value as any
        }))
    }

    const handleFasesChange = (value: string) => {
        setEmpalme(prev => ({
            ...prev,
            fases: Number(value)
        }))
    }

    const handleActivoChange = (value: string) => {
        setEmpalme(prev => ({
            ...prev,
            activo: Number(value)
        }))
    }

    const crearEmpalme = async () => {

        if (!empalme.n_medidor?.trim()) {
            Alert.alert('Error', 'El número de medidor es obligatorio')
            return
        }

        if (!empalme.nivel_tension?.trim()) {
            Alert.alert('Error', 'El nivel de tensión es obligatorio')
            return
        }

        if (!empalme.fases) {
            Alert.alert('Error', 'El número de fases es obligatorio')
            return
        }

        // if (!empalme.activo) {
        //     Alert.alert('Error', 'El estado es obligatorio')
        //     return
        // }

        try {
            const resultado = await addEmpalme(db, empalme)
            Alert.alert('Éxito', `Empalme creado con id: ${resultado.lastInsertRowId}`)
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
                Nuevo Empalme
            </Text>

            {/* --- Inputs --- */}
            <TextInput
                label="Numero Medidor *"
                value={empalme.n_medidor}
                onChangeText={text => setEmpalme({ ...empalme, n_medidor: text })}
                style={styles.input}
                mode="outlined"
            />

            <SegmentedButtons
                value={empalme.nivel_tension || ''}
                onValueChange={handleNivelTensionChange}
                buttons={[
                    { value: 'BT', label: 'BT (Baja Tension)' },
                    { value: 'MT', label: 'MT (Media Tension)' },
                ]}
                style={styles.segmentedButtons}
            />

            {/* botones para elegir condicion de poste */}
            <SegmentedButtons
                value={empalme.fases?.toString() || ''}
                onValueChange={handleFasesChange}
                buttons={[
                    { value: '1', label: 'Monofásico' },
                    { value: '3', label: 'Trifásico' },
                ]}
                style={styles.segmentedButtons}
            />

            <SegmentedButtons
                value={empalme.activo?.toString() || ''}
                onValueChange={handleActivoChange}
                buttons={[
                    { value: '1', label: 'Activo' },
                    { value: '0', label: 'Inactivo' },
                ]}
                style={styles.segmentedButtons}
            />

            <TextInput
                label="Capacidad *"
                value={empalme.capacidad === 0 ? '' : empalme.capacidad?.toString()}
                onChangeText={text => setEmpalme({ ...empalme, capacidad: Number(text) })}
                style={styles.input}
                keyboardType="numeric"
                mode="outlined"
            />

            <TextInput
                label="Direccion"
                value={empalme.direccion}
                onChangeText={text => setEmpalme({ ...empalme, direccion: text })}
                style={styles.input}
                mode="outlined"
                multiline
                numberOfLines={2}
            />

            <TextInput
                label="Parcela"
                value={empalme.parcela}
                onChangeText={text => setEmpalme({ ...empalme, parcela: text })}
                style={styles.input}
                mode="outlined"
            />

            <TextInput
                label="Notas"
                value={empalme.notas}
                onChangeText={text => setEmpalme({ ...empalme, notas: text })}
                style={styles.input}
                mode="outlined"
                multiline
                numberOfLines={4}
            />

            <Button mode="contained" onPress={crearEmpalme} style={styles.button} icon="check">
                Crear Empalme
            </Button>

            <Button mode="outlined" onPress={() => router.back()} style={styles.button} icon="arrow-left">
                Cancelar
            </Button>
            <Text variant="bodyMedium">{JSON.stringify(empalme)}</Text>
        </KeyboardAwareScrollView>
    )
}

export default NuevoEmpalme

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
