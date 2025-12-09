import { useLoteo } from "@/src/contexts/LoteoContext";
import { addSubestacion } from "@/src/database/queries/subestaciones";
import { Subestacion } from "@/src/types";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useSQLiteContext } from "expo-sqlite";
import { useState } from "react";
import { Alert, StyleSheet, View } from "react-native";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import { Button, Chip, SegmentedButtons, Text, TextInput } from "react-native-paper";

export default function SubestacionNew() {

    const db = useSQLiteContext()
    const params = useLocalSearchParams()
    const router = useRouter()
    const { currentSoporteId } = useLoteo()

    const getPotenciaOptions = () => {
        const fases = subestacion.fases
        if (fases === 1 || fases === 2) {
            return ['5', '10', '15']
        } else if (fases === 3) {
            return ['15', '30', '45', '75', '100', '150', '200', '300', '500']
        }
        return ['5', '10', '15', '30', '45', '75', '100', '150', '200', '300', '500']
    }

    // Asegurar que tenemos un id_soporte válido
    const soporteId = currentSoporteId || (params.id ? Number(params.id) : 0)

    const [subestacion, setSubestacion] = useState<Partial<Subestacion>>({
        id_soporte: soporteId,
        created_by: params.userId as string || '',
        updated_by: params.userId as string || ''
    })

    const handleNombreChange = (value: string) => {
        setSubestacion(prev => ({
            ...prev,
            nombre: value as any
        }))
    }

    const handleTensionChange = (value: string) => {
        setSubestacion(prev => ({
            ...prev,
            tension: Number(value)
        }))
    }

    const handlePotenciaChange = (value: string) => {
        setSubestacion(prev => ({
            ...prev,
            potencia: Number(value)
        }))
    }

    const handleFasesChange = (value: string) => {
        setSubestacion(prev => ({
            ...prev,
            fases: Number(value),
            potencia: undefined
        }))
    }

    const handleLetreroChange = (value: string) => {
        setSubestacion(prev => ({
            ...prev,
            letrero: value as any
        }))
    }

    const handleMarcaChange = (value: string) => {
        setSubestacion(prev => ({
            ...prev,
            marca: value as any
        }))
    }

    const handleSerieChange = (value: string) => {
        setSubestacion(prev => ({
            ...prev,
            serie: value as any
        }))
    }

    const handleNotasChange = (value: string) => {
        setSubestacion(prev => ({
            ...prev,
            notas: value as any
        }))
    }

    const handleCondicionChange = (value: string) => {
        setSubestacion(prev => ({
            ...prev,
            condicion: value as any
        }))
    }

    const crearSubestacion = async () => {
        if (!subestacion.letrero) {
            Alert.alert('Error', 'El letrero de la subestacion es obligatorio')
            return
        }
        if (!subestacion.tension) {
            Alert.alert('Error', 'La tension es obligatoria')
            return
        }
        if (!subestacion.potencia) {
            Alert.alert('Error', 'La potencia es obligatoria')
            return
        }
        if (!subestacion.fases) {
            Alert.alert('Error', 'Las fases son obligatorias')
            return
        }
        if (!subestacion.condicion) {
            Alert.alert('Error', 'La condicion es obligatoria')
            return
        }

        try {
            const result = await addSubestacion(db, subestacion)
            Alert.alert('Exito', `Subestacion creada correctamente con ID: ${result.lastInsertRowId}`)
            router.back()
        } catch (error) {
            console.error(error)
            Alert.alert('Error', 'Error al crear la subestacion')
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
            <Text variant="headlineMedium" style={styles.title}>Nueva Subestacion</Text>

            <TextInput
                label="Letrero"
                value={subestacion.letrero || ''}
                onChangeText={handleLetreroChange}
                style={styles.input}
                mode="outlined"
            />

            <SegmentedButtons
                value={subestacion.tension?.toString() || ''}
                onValueChange={handleTensionChange}
                buttons={[
                    { value: '12', label: '12kV' },
                    { value: '13.2', label: '13.2kV' },
                    { value: '23', label: '23kV' },
                ]}
                style={styles.segmentedButtons}
            />
            <SegmentedButtons
                value={subestacion.fases?.toString() || ''}
                onValueChange={handleFasesChange}
                buttons={[
                    { value: '1', label: 'Monofásica' },
                    { value: '2', label: 'Bifásica' },
                    { value: '3', label: 'Trifásica' },
                ]}
                style={styles.segmentedButtons}
            />
            {subestacion.fases && (
                <>
                    <Text variant="titleMedium" style={styles.sectionTitle}>Potencia (kVA)</Text>
                    <View style={styles.chipContainer}>
                        {getPotenciaOptions().map((val) => (
                            <Chip
                                key={val}
                                selected={subestacion.potencia?.toString() === val}
                                onPress={() => handlePotenciaChange(val)}
                                style={styles.chip}
                                showSelectedOverlay
                            >
                                {val}kVA
                            </Chip>
                        ))}
                    </View>
                </>
            )}
            <TextInput
                label="Marca"
                value={subestacion.marca || ''}
                onChangeText={handleMarcaChange}
                style={styles.input}
                mode="outlined"
            />
            <TextInput
                label="Serie"
                value={subestacion.serie || ''}
                onChangeText={handleSerieChange}
                style={styles.input}
                mode="outlined"
            />
            <SegmentedButtons
                value={subestacion.condicion || ''}
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
                value={subestacion.notas || ''}
                onChangeText={handleNotasChange}
                style={styles.input}
                mode="outlined"
                multiline
                numberOfLines={4}
            />

            <Button
                mode="contained"
                onPress={crearSubestacion}
                style={styles.button}
            >
                Crear Subestacion
            </Button>
            <Button
                mode="outlined"
                onPress={() => router.back()}
                style={styles.button}
            >
                Cancelar
            </Button>
            <Text variant="bodyMedium" >{JSON.stringify(subestacion)}</Text>

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
    chipContainer: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 8,
        marginBottom: 16,
    },
    chip: {
        marginBottom: 4,
    },
    sectionTitle: {
        marginTop: 8,
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