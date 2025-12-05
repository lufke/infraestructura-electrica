import NumericInput from '@/src/components/ui/NumericInput'
import { addLoteo } from '@/src/database/queries/loteos'
import { Loteo } from '@/src/types/loteo'
import { router, useLocalSearchParams } from 'expo-router'
import { useSQLiteContext } from 'expo-sqlite'
import React, { useState } from 'react'
import {
    Alert,
    StyleSheet,
    View,
} from 'react-native'
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view"
import {
    Button,
    SegmentedButtons,
    Text,
    TextInput
} from 'react-native-paper'

const NuevoLoteo = () => {
    const db = useSQLiteContext()
    const params = useLocalSearchParams()

    const [loteo, setLoteo] = useState<Partial<Loteo>>({
        nombre: '',
        direccion: '',
        propietario: '',
        telefono: '',
        correo: '',
        comuna: '',
        distribuidora: '',
        n_cliente: '',
        tension_mt: undefined,
        tension_bt: undefined,
        nivel_tension: undefined,
        latitud: undefined,
        longitud: undefined,
        notas: '',
        created_by: params.userId as string || '',
        updated_by: params.userId as string || ''
    })

    const handleNivelTensionChange = (value: string) => {
        const updated = { ...loteo, nivel_tension: value }

        if (value === 'BT') {
            updated.tension_mt = undefined
        }

        setLoteo(updated)
    }

    const crearLoteo = async () => {
        if (!loteo.nombre?.trim()) {
            Alert.alert('Error', 'El nombre es obligatorio')
            return
        }

        if (loteo.nivel_tension === 'MT' && !loteo.tension_mt) {
            Alert.alert('Error', 'Debe ingresar la tensión MT cuando el nivel es MT')
            return
        }

        if (loteo.nivel_tension === 'BT' && !loteo.tension_bt) {
            Alert.alert('Error', 'Debe ingresar la tensión BT cuando el nivel es BT')
            return
        }

        try {
            const resultado = await addLoteo(db, loteo)
            Alert.alert('Éxito', `Loteo creado con id: ${resultado.lastInsertRowId}`)
            router.back()
        } catch (error) {
            console.error(error)
            Alert.alert('Error', 'No se pudo crear el loteo')
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
                Nuevo Loteo
            </Text>

            {/* --- Inputs --- */}
            <TextInput
                label="Nombre *"
                value={loteo.nombre}
                onChangeText={text => setLoteo({ ...loteo, nombre: text })}
                style={styles.input}
                mode="outlined"
            />

            <TextInput
                label="Propietario"
                value={loteo.propietario}
                onChangeText={text => setLoteo({ ...loteo, propietario: text })}
                style={styles.input}
                mode="outlined"
            />

            <TextInput
                label="Dirección"
                value={loteo.direccion}
                onChangeText={text => setLoteo({ ...loteo, direccion: text })}
                style={styles.input}
                mode="outlined"
            />

            <TextInput
                label="Comuna"
                value={loteo.comuna}
                onChangeText={text => setLoteo({ ...loteo, comuna: text })}
                style={styles.input}
                mode="outlined"
            />

            <TextInput
                label="Teléfono"
                value={loteo.telefono}
                onChangeText={text => setLoteo({ ...loteo, telefono: text })}
                style={styles.input}
                mode="outlined"
                keyboardType="phone-pad"
            />

            <TextInput
                label="Correo electrónico"
                value={loteo.correo}
                onChangeText={text => setLoteo({ ...loteo, correo: text })}
                style={styles.input}
                mode="outlined"
                autoCapitalize="none"
                inputMode="email"
            />

            <TextInput
                label="Distribuidora Eléctrica"
                value={loteo.distribuidora}
                onChangeText={text => setLoteo({ ...loteo, distribuidora: text })}
                style={styles.input}
                mode="outlined"
            />

            <TextInput
                label="N° Cliente"
                value={loteo.n_cliente}
                onChangeText={text => setLoteo({ ...loteo, n_cliente: text })}
                style={styles.input}
                mode="outlined"
            />

            <Text variant="bodyLarge" style={styles.sectionTitle}>
                Nivel de Tensión *
            </Text>

            <SegmentedButtons
                value={loteo.nivel_tension || ''}
                onValueChange={handleNivelTensionChange}
                buttons={[
                    { value: 'BT', label: 'BT (Baja Tensión)' },
                    { value: 'MT', label: 'MT (Media Tensión)' },
                ]}
                style={styles.segmentedButtons}
            />

            {/* BT */}
            <NumericInput
                label="Tensión BT (V) *"
                value={loteo.tension_bt}
                onChange={value => setLoteo({ ...loteo, tension_bt: value })}
                style={styles.input}
            />

            {/* MT si aplica */}
            {loteo.nivel_tension === 'MT' && (
                <NumericInput
                    label="Tensión MT (kV) *"
                    value={loteo.tension_mt}
                    onChange={value => setLoteo({ ...loteo, tension_mt: value })}
                    style={styles.input}
                />
            )}

            <Text variant="bodyLarge" style={styles.sectionTitle}>
                Coordenadas
            </Text>

            <View style={styles.row}>
                <NumericInput
                    label="Latitud"
                    value={loteo.latitud}
                    onChange={value => setLoteo({ ...loteo, latitud: value })}
                    style={[styles.input, styles.halfInput]}
                    mode="outlined"
                />

                <NumericInput
                    label="Longitud"
                    value={loteo.longitud}
                    onChange={value => setLoteo({ ...loteo, longitud: value })}
                    style={[styles.input, styles.halfInput]}
                    mode="outlined"
                />
            </View>

            <TextInput
                label="Notas"
                value={loteo.notas}
                onChangeText={text => setLoteo({ ...loteo, notas: text })}
                style={styles.input}
                mode="outlined"
                multiline
                numberOfLines={4}
            />

            <Button mode="contained" onPress={crearLoteo} style={styles.button} icon="check">
                Crear Loteo
            </Button>

            <Button mode="outlined" onPress={() => router.back()} style={styles.button} icon="arrow-left">
                Cancelar
            </Button>
        </KeyboardAwareScrollView>
    )
}

export default NuevoLoteo

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
