import { useLoteo } from "@/src/contexts/LoteoContext";
import { addTierra } from "@/src/database/queries/tierras";
import { Tierra } from "@/src/types";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useSQLiteContext } from "expo-sqlite";
import { useState } from "react";
import { Alert, StyleSheet } from "react-native";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import { Button, SegmentedButtons, Text, TextInput } from "react-native-paper";

export default function TierrasNew() {
    const db = useSQLiteContext()
    const router = useRouter()
    const params = useLocalSearchParams()
    const { currentSoporteId } = useLoteo()

    // Asegurar que tenemos un id_soporte válido
    const soporteId = currentSoporteId || (params.id ? Number(params.id) : 0)
    const [tierra, setTierra] = useState<Partial<Tierra>>({
        id_soporte: soporteId,
        created_by: params.userId as string || '',
        updated_by: params.userId as string || ''
    })

    const handleTipoChange = (value: string) => {
        setTierra(prev => ({
            ...prev,
            tipo: value
        }))
    }

    const handleCondicionChange = (value: string) => {
        setTierra(prev => ({
            ...prev,
            condicion: value
        }))
    }

    const handleResistenciaChange = (value: string) => {
        setTierra(prev => ({
            ...prev,
            resistencia: Number(value)
        }))
    }

    const handleNotasChange = (value: string) => {
        setTierra(prev => ({
            ...prev,
            notas: value
        }))
    }

    const crearTierra = async () => {
        if (!tierra.tipo) {
            Alert.alert('Error', 'El tipo es obligatorio')
            return
        }

        if (!tierra.condicion) {
            Alert.alert('Error', 'La condición es obligatoria')
            return
        }

        if (!tierra.notas) {
            Alert.alert('Error', 'Las notas son obligatorias')
            return
        }
        try {
            const resultado = await addTierra(db, tierra)
            Alert.alert('Éxito', `Tierra creada correctamente con ID: ${resultado.lastInsertRowId}`)
            router.back()
        } catch (error) {
            console.error(error)
            Alert.alert('Error', 'Hubo un error al crear la tierra')
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
            <Text variant="headlineMedium" style={styles.title}>Nuevo Tierra</Text>

            <SegmentedButtons
                value={tierra.tipo || ''}
                onValueChange={handleTipoChange}
                buttons={[
                    { value: 'TP', label: 'Tierra de Protección' },
                    { value: 'TS', label: 'Tierra de Servicio' },
                ]}
                style={styles.segmentedButtons}
            />

            <SegmentedButtons
                value={tierra.condicion || ''}
                onValueChange={handleCondicionChange}
                buttons={[
                    { value: 'BUENO', label: 'Bueno' },
                    { value: 'REGULAR', label: 'Regular' },
                    { value: 'MALO', label: 'Malo' },
                ]}
                style={styles.segmentedButtons}
            />

            <TextInput
                label="Resistencia"
                value={tierra.resistencia?.toString()}
                onChangeText={handleResistenciaChange}
                style={styles.input}
                mode="outlined"
            />

            <TextInput
                label="Notas"
                value={tierra.notas}
                onChangeText={handleNotasChange}
                style={styles.input}
                mode="outlined"
                multiline
                numberOfLines={4}
            />

            <Button mode="contained" onPress={crearTierra} style={styles.button} icon="check">
                Crear Tierra
            </Button>

            <Button mode="outlined" onPress={() => router.back()} style={styles.button} icon="arrow-left">
                Cancelar
            </Button>
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
