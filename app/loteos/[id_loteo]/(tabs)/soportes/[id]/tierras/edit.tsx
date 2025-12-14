import { useAuth } from '@/src/contexts/AuthContext'
import { getTierraById, updateTierra } from '@/src/database/queries/tierras'
import { Tierra } from '@/src/types'
import { router, useLocalSearchParams } from 'expo-router'
import { useSQLiteContext } from 'expo-sqlite'
import React, { useEffect, useState } from 'react'
import { ActivityIndicator, Alert, StyleSheet, View } from 'react-native'
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view"
import { Button, SegmentedButtons, Text, TextInput } from 'react-native-paper'

const EditarTierra = () => {
    const db = useSQLiteContext()
    const { id_elemento } = useLocalSearchParams<{ id_elemento: string }>()
    const { session } = useAuth()

    const [tierra, setTierra] = useState<Partial<Tierra>>({})
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        loadData()
    }, [id_elemento])

    const loadData = async () => {
        if (!id_elemento) return;
        try {
            const data = await getTierraById(db, Number(id_elemento)) as Tierra;
            if (data) {
                setTierra({ ...data, updated_by: session?.user.id });
            }
        } catch (error) {
            console.error(error);
            Alert.alert('Error', 'No se pudo cargar la información');
        } finally {
            setLoading(false);
        }
    }

    const guardarCambios = async () => {
        if (!tierra.tipo) {
            Alert.alert('Error', 'El tipo es obligatorio')
            return
        }
        if (!tierra.condicion) {
            Alert.alert('Error', 'La condición es obligatoria')
            return
        }

        try {
            await updateTierra(db, Number(id_elemento), tierra)
            Alert.alert('Éxito', `Tierra actualizada`)
            router.back()
        } catch (error) {
            console.error(error)
            Alert.alert('Error', 'No se pudo actualizar')
        }
    }

    if (loading) return <View style={styles.center}><ActivityIndicator size="large" /></View>

    return (
        <KeyboardAwareScrollView
            style={styles.container}
            contentContainerStyle={styles.content}
            enableOnAndroid
        >
            <Text variant="headlineMedium" style={styles.title}>Editar Tierra #{id_elemento}</Text>

            <SegmentedButtons
                value={tierra.tipo || ''}
                onValueChange={val => setTierra({ ...tierra, tipo: val as any })}
                buttons={[
                    { value: 'TP', label: 'TP (Protección)' },
                    { value: 'TS', label: 'TS (Servicio)' },
                ]}
                style={styles.segmentedButtons}
            />

            <TextInput
                label="Resistencia"
                value={tierra.resistencia?.toString() || ''}
                onChangeText={text => setTierra({ ...tierra, resistencia: Number(text) })}
                style={styles.input}
                mode="outlined"
                keyboardType="numeric"
            />

            <SegmentedButtons
                value={tierra.condicion || ''}
                onValueChange={val => setTierra({ ...tierra, condicion: val as any })}
                buttons={[
                    { value: 'BUENO', label: 'Bueno' },
                    { value: 'REGULAR', label: 'Regular' },
                    { value: 'MALO', label: 'Malo' },
                ]}
                style={styles.segmentedButtons}
            />

            <TextInput
                label="Notas"
                value={tierra.notas}
                onChangeText={text => setTierra({ ...tierra, notas: text })}
                style={styles.input}
                mode="outlined"
                multiline
                numberOfLines={4}
            />

            <Button mode="contained" onPress={guardarCambios} style={styles.button} icon="content-save">Guardar Cambios</Button>
            <Button mode="outlined" onPress={() => router.back()} style={styles.button} icon="arrow-left">Cancelar</Button>
        </KeyboardAwareScrollView>
    )
}

export default EditarTierra

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: "#f5f5f5" },
    content: { padding: 16, paddingBottom: 40 },
    center: { flex: 1, justifyContent: 'center', alignItems: 'center' },
    title: { textAlign: "center", fontWeight: "bold", marginBottom: 20 },
    input: { marginBottom: 12, backgroundColor: "white" },
    segmentedButtons: { marginBottom: 16 },
    button: { marginBottom: 12 },
})
