import { useAuth } from "@/src/contexts/AuthContext";
import { useLoteo } from "@/src/contexts/LoteoContext";
import { addTirante } from "@/src/database/queries/tirantes";
import { Tirante } from "@/src/types";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useSQLiteContext } from "expo-sqlite";
import { useState } from "react";
import { Alert, StyleSheet } from "react-native";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import { Button, SegmentedButtons, Text, TextInput } from "react-native-paper";

export default function TirantesNew() {
    const db = useSQLiteContext()
    const params = useLocalSearchParams()
    const router = useRouter()
    const { currentSoporteId } = useLoteo()
    const { session } = useAuth()

    // Asegurar que tenemos un id_soporte válido
    const soporteId = currentSoporteId || (params.id ? Number(params.id) : 0)

    const [tirante, setTirante] = useState<Partial<Tirante>>({
        id_soporte: soporteId,
        created_by: session?.user.id,
        updated_by: session?.user.id,
    })

    const handleNivelTensionChange = (value: string) => {
        setTirante(prev => ({
            ...prev,
            nivel_tension: value as any
        }))
    }

    const handleTipoChange = (value: string) => {
        setTirante(prev => ({
            ...prev,
            tipo: value
        }))
    }

    const handleFijacionChange = (value: string) => {
        setTirante(prev => ({
            ...prev,
            fijacion: value
        }))
    }

    const handleCondicionChange = (value: string) => {
        setTirante(prev => ({
            ...prev,
            condicion: value
        }))
    }

    const handleNotasChange = (value: string) => {
        setTirante(prev => ({
            ...prev,
            notas: value
        }))
    }

    const handleCantidadChange = (value: string) => {
        setTirante(prev => ({
            ...prev,
            cantidad: Number(value)
        }))
    }

    const crearTirante = async () => {
        if (!tirante.nivel_tension) {
            Alert.alert('Error', 'El nivel de tensión es obligatorio')
            return
        }

        if (!tirante.tipo) {
            Alert.alert('Error', 'El tipo es obligatorio')
            return
        }

        if (!tirante.fijacion) {
            Alert.alert('Error', 'La fijación es obligatoria')
            return
        }

        if (!tirante.condicion) {
            Alert.alert('Error', 'La condición es obligatoria')
            return
        }

        if (!tirante.cantidad) {
            Alert.alert('Error', 'La cantidad es obligatoria')
            return
        }
        try {
            const resultado = await addTirante(db, tirante)
            Alert.alert('Éxito', `Tirante creado correctamente con ID: ${resultado.lastInsertRowId}`)
            router.back()
        } catch (error) {
            console.error(error)
            Alert.alert('Error', 'Hubo un error al crear el tirante')
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
            <Text variant="headlineMedium" style={styles.title}>Nuevo Tirante</Text>

            <SegmentedButtons
                value={tirante.nivel_tension || ''}
                onValueChange={handleNivelTensionChange}
                buttons={[
                    { value: 'BT', label: 'BT (Baja Tensión)' },
                    { value: 'MT', label: 'MT (Media Tensión)' },
                ]}
                style={styles.segmentedButtons}
            />

            <SegmentedButtons
                value={tirante.tipo || ''}
                onValueChange={handleTipoChange}
                buttons={[
                    { value: 'SIMPLE', label: 'Simple' },
                    { value: 'DOBLE', label: 'Doble' },
                ]}
                style={styles.segmentedButtons}
            />

            <SegmentedButtons
                value={tirante.fijacion || ''}
                onValueChange={handleFijacionChange}
                buttons={[
                    { value: 'PISO', label: 'Piso' },
                    { value: 'POSTE MOZO', label: 'Poste Mozos' },
                    { value: 'RIEL', label: 'Riel' },
                ]}
                style={styles.segmentedButtons}
            />

            <SegmentedButtons
                value={tirante.condicion || ''}
                onValueChange={handleCondicionChange}
                buttons={[
                    { value: 'BUENO', label: 'Bueno' },
                    { value: 'REGULAR', label: 'Regular' },
                    { value: 'MALO', label: 'Malo' },
                ]}
                style={styles.segmentedButtons}
            />

            <TextInput
                label={'Cantidad'}
                value={tirante.cantidad?.toString()}
                onChangeText={handleCantidadChange}
                style={styles.input}
                mode="outlined"
                keyboardType="numeric"
                keyboardAppearance="dark"
            />

            <TextInput
                label="Notas"
                value={tirante.notas}
                onChangeText={handleNotasChange}
                style={styles.input}
                mode="outlined"
                multiline
                numberOfLines={4}
            />

            <Button mode="contained" onPress={crearTirante} style={styles.button} icon="check">
                Crear Tirante
            </Button>

            <Button mode="outlined" onPress={() => router.back()} style={styles.button} icon="arrow-left">
                Cancelar
            </Button>
            <Text variant="bodyMedium">{JSON.stringify(tirante)}</Text>
        </KeyboardAwareScrollView>
    );
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
