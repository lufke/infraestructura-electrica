import { useLoteo } from "@/src/contexts/LoteoContext";
import { addSeccionamiento } from "@/src/database/queries/seccionamientos";
import { Seccionamiento } from "@/src/types";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useSQLiteContext } from "expo-sqlite";
import { useState } from "react";
import { Alert, StyleSheet } from "react-native";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import { Button, SegmentedButtons, Text, TextInput } from "react-native-paper";

export default function SeccionamientosNew() {

    const db = useSQLiteContext()
    const params = useLocalSearchParams()
    const router = useRouter()
    const { currentSoporteId } = useLoteo()

    // Asegurar que tenemos un id_soporte válido
    const soporteId = currentSoporteId || (params.id ? Number(params.id) : 0)

    const [seccionamiento, setSeccionamiento] = useState<Partial<Seccionamiento>>({
        id_soporte: soporteId,
        created_by: params.userId as string || '',
        updated_by: params.userId as string || ''
    })

    const handleTipoChange = (value: string) => {
        setSeccionamiento(prev => ({
            ...prev,
            tipo: value as string
        }))
    }

    const handlePosicionChange = (value: string) => {
        setSeccionamiento(prev => ({
            ...prev,
            posicion: value as string
        }))
    }

    const handleNivelTensionChange = (value: string) => {
        setSeccionamiento(prev => ({
            ...prev,
            nivel_tension: value as string,
            tipo: undefined // Reset tipo when level changes
        }))
    }

    const getTipoOptions = () => {
        if (seccionamiento.nivel_tension === 'BT') {
            return [
                { value: 'FUS', label: 'FUS' },
                { value: 'AUT', label: 'AUT' },
            ]
        } else if (seccionamiento.nivel_tension === 'MT') {
            return [
                { value: 'FUS', label: 'FUS' },
                { value: 'REC', label: 'REC' },
                { value: 'CUC', label: 'CUC' },
                { value: 'ALD', label: 'ALD' },
                { value: 'CODO', label: 'CODO' },
            ]
        }
        return []
    }

    const handleCondicionChange = (value: string) => {
        setSeccionamiento(prev => ({
            ...prev,
            condicion: value as string
        }))
    }

    const handleLetreroChange = (value: string) => {
        setSeccionamiento(prev => ({
            ...prev,
            letrero: value as string
        }))
    }

    const handleFaseChange = (value: string) => {
        setSeccionamiento(prev => ({
            ...prev,
            fases: Number(value)
        }))
    }

    const handleCorrienteChange = (value: string) => {
        setSeccionamiento(prev => ({
            ...prev,
            corriente: Number(value)
        }))
    }

    const handleNotasChange = (value: string) => {
        setSeccionamiento(prev => ({
            ...prev,
            notas: value as string
        }))
    }

    const crearSeccionamiento = async () => {
        if (!seccionamiento.letrero) {
            Alert.alert('Error', 'El letrero es obligatorio')
            return
        }
        if (!seccionamiento.nivel_tension) {
            Alert.alert('Error', 'El nivel de tension es obligatorio')
            return
        }
        if (!seccionamiento.tipo) {
            Alert.alert('Error', 'El tipo de seccionamiento es obligatorio')
            return
        }
        if (!seccionamiento.posicion) {
            Alert.alert('Error', 'La posicion es obligatoria')
            return
        }
        if (!seccionamiento.fases) {
            Alert.alert('Error', 'Las fases son obligatorias')
            return
        }
        if (!seccionamiento.condicion) {
            Alert.alert('Error', 'La condicion es obligatoria')
            return
        }

        try {
            const result = await addSeccionamiento(db, seccionamiento)
            Alert.alert('Exito', `Seccionamiento creado correctamente con ID: ${result.lastInsertRowId}`)
            router.back()
        } catch (error) {
            console.error(error)
            Alert.alert('Error', 'Error al crear el seccionamiento')
        }
    }

    return (
        <KeyboardAwareScrollView
            style={styles.container}
            contentContainerStyle={styles.content}
            enableAutomaticScroll
            extraScrollHeight={40}
            keyboardShouldPersistTaps="handled"
        >
            <Text variant="headlineMedium" style={styles.title}>Nuevo Seccionamiento</Text>
            <Text>{JSON.stringify(seccionamiento)}</Text>
            <TextInput
                label="Letrero"
                value={seccionamiento.letrero || ''}
                onChangeText={handleLetreroChange}
                style={styles.input}
                mode="outlined"
            />
            <SegmentedButtons
                value={seccionamiento.nivel_tension || ''}
                onValueChange={handleNivelTensionChange}
                buttons={[
                    { value: 'BT', label: 'BT' },
                    { value: 'MT', label: 'MT' },
                ]}
                style={styles.segmentedButtons}
            />

            {seccionamiento.nivel_tension && (
                <SegmentedButtons
                    value={seccionamiento.tipo || ''}
                    onValueChange={handleTipoChange}
                    buttons={getTipoOptions()}
                    style={styles.segmentedButtons}
                />
            )}
            <SegmentedButtons
                value={seccionamiento.posicion || ''}
                onValueChange={handlePosicionChange}
                buttons={[
                    { value: 'ABIERTO', label: 'Abierto' },
                    { value: 'CERRADO', label: 'Cerrado' },
                ]}
                style={styles.segmentedButtons}
            />

            <SegmentedButtons
                value={seccionamiento.condicion || ''}
                onValueChange={handleCondicionChange}
                buttons={[
                    { value: 'BUENO', label: 'Bueno' },
                    { value: 'REGULAR', label: 'Regular' },
                    { value: 'MALO', label: 'Malo' },
                ]}
                style={styles.segmentedButtons}
            />
            <SegmentedButtons
                value={seccionamiento.fases?.toString() || ''}
                onValueChange={handleFaseChange}
                buttons={[
                    { value: '1', label: 'Monofásico' },
                    { value: '2', label: 'Bifásico' },
                    { value: '3', label: 'Trifásico' },
                ]}
                style={styles.segmentedButtons}
            />
            <TextInput
                label="Corriente"
                value={seccionamiento.corriente?.toString() || ''}
                onChangeText={handleCorrienteChange}
                style={styles.input}
                mode="outlined"
                keyboardType="numeric"
            />

            <TextInput
                label="Notas"
                value={seccionamiento.notas || ''}
                onChangeText={handleNotasChange}
                style={styles.input}
                mode="outlined"
                multiline
                numberOfLines={4}
            />

            <Button
                mode="contained"
                onPress={crearSeccionamiento}
                style={styles.button}
            >
                Crear Seccionamiento
            </Button>
            <Button
                mode="outlined"
                onPress={() => router.back()}
                style={styles.button}
            >
                Cancelar
            </Button>

        </KeyboardAwareScrollView>
    )
}

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
        textAlign: 'center',
        fontWeight: 'bold',
        marginBottom: 20,
    },
    input: {
        marginBottom: 12,
        backgroundColor: 'white',
    },
    segmentedButtons: {
        marginBottom: 16,
    },
    seccionTitle: {
        marginTop: 16,
        marginBottom: 8,
        fontWeight: '600'
    },
    row: {
        flexDirection: 'row',
        gap: 8,
        marginBottom: 12,
    },
    halfInput: {
        flex: 1
    },
    button: {
        marginBottom: 12
    }
})