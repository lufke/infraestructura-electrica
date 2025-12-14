import { useAuth } from '@/src/contexts/AuthContext'
import { getTiranteById, updateTirante } from '@/src/database/queries/tirantes'
import { Tirante } from '@/src/types'
import { router, useLocalSearchParams } from 'expo-router'
import { useSQLiteContext } from 'expo-sqlite'
import React, { useEffect, useState } from 'react'
import { ActivityIndicator, Alert, StyleSheet, View } from 'react-native'
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view"
import { Button, SegmentedButtons, Text, TextInput } from 'react-native-paper'

const EditarTirante = () => {
    const db = useSQLiteContext()
    const { id_elemento } = useLocalSearchParams<{ id_elemento: string }>()
    const { session } = useAuth()

    const [tirante, setTirante] = useState<Partial<Tirante>>({})
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        loadData()
    }, [id_elemento])

    const loadData = async () => {
        if (!id_elemento) return;
        try {
            const data = await getTiranteById(db, Number(id_elemento)) as Tirante;
            if (data) {
                setTirante({ ...data, updated_by: session?.user.id });
            }
        } catch (error) {
            console.error(error);
            Alert.alert('Error', 'No se pudo cargar la información');
        } finally {
            setLoading(false);
        }
    }

    const guardarCambios = async () => {
        if (!tirante.tipo) {
            Alert.alert('Error', 'El tipo es obligatorio')
            return
        }
        if (!tirante.condicion) {
            Alert.alert('Error', 'La condición es obligatoria')
            return
        }

        try {
            await updateTirante(db, Number(id_elemento), tirante)
            Alert.alert('Éxito', `Tirante actualizado`)
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
            <Text variant="headlineMedium" style={styles.title}>Editar Tirante #{id_elemento}</Text>

            <SegmentedButtons
                value={tirante.nivel_tension || ''}
                onValueChange={val => setTirante({ ...tirante, nivel_tension: val as any })}
                buttons={[
                    { value: 'BT', label: 'BT' },
                    { value: 'MT', label: 'MT' },
                ]}
                style={styles.segmentedButtons}
            />

            <SegmentedButtons
                value={tirante.tipo || ''}
                onValueChange={val => setTirante({ ...tirante, tipo: val as any })}
                buttons={[
                    { value: 'SIMPLE', label: 'Simple' },
                    { value: 'DOBLE', label: 'Doble' },
                ]}
                style={styles.segmentedButtons}
            />

            <SegmentedButtons
                value={tirante.fijacion || ''}
                onValueChange={val => setTirante({ ...tirante, fijacion: val as any })}
                buttons={[
                    { value: 'PISO', label: 'Piso' },
                    { value: 'POSTE MOZO', label: 'Poste Mozo' },
                    { value: 'RIEL', label: 'Riel' },
                ]}
                style={styles.segmentedButtons}
            />

            <TextInput
                label="Cantidad"
                value={tirante.cantidad?.toString() || ''}
                onChangeText={text => setTirante({ ...tirante, cantidad: Number(text) })}
                style={styles.input}
                mode="outlined"
                keyboardType="numeric"
            />

            <SegmentedButtons
                value={tirante.condicion || ''}
                onValueChange={val => setTirante({ ...tirante, condicion: val as any })}
                buttons={[
                    { value: 'BUENO', label: 'Bueno' },
                    { value: 'REGULAR', label: 'Regular' },
                    { value: 'MALO', label: 'Malo' },
                ]}
                style={styles.segmentedButtons}
            />

            <TextInput
                label="Notas"
                value={tirante.notas}
                onChangeText={text => setTirante({ ...tirante, notas: text })}
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

export default EditarTirante

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: "#f5f5f5" },
    content: { padding: 16, paddingBottom: 40 },
    center: { flex: 1, justifyContent: 'center', alignItems: 'center' },
    title: { textAlign: "center", fontWeight: "bold", marginBottom: 20 },
    input: { marginBottom: 12, backgroundColor: "white" },
    segmentedButtons: { marginBottom: 16 },
    button: { marginBottom: 12 },
})
