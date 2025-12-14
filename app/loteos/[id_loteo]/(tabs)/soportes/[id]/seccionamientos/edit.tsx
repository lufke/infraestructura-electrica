import { useAuth } from '@/src/contexts/AuthContext'
import { getSeccionamientoById, updateSeccionamiento } from '@/src/database/queries/seccionamientos'
import { Seccionamiento } from '@/src/types'
import { router, useLocalSearchParams } from 'expo-router'
import { useSQLiteContext } from 'expo-sqlite'
import React, { useEffect, useState } from 'react'
import { ActivityIndicator, Alert, StyleSheet, View } from 'react-native'
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view"
import { Button, SegmentedButtons, Text, TextInput } from 'react-native-paper'

const EditarSeccionamiento = () => {
    const db = useSQLiteContext()
    const { id_elemento } = useLocalSearchParams<{ id_elemento: string }>()
    const { session } = useAuth()

    const [seccionamiento, setSeccionamiento] = useState<Partial<Seccionamiento>>({})
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        loadData()
    }, [id_elemento])

    const loadData = async () => {
        if (!id_elemento) return;
        try {
            const data = await getSeccionamientoById(db, Number(id_elemento)) as Seccionamiento;
            if (data) {
                setSeccionamiento({ ...data, updated_by: session?.user.id });
            }
        } catch (error) {
            console.error(error);
            Alert.alert('Error', 'No se pudo cargar la información');
        } finally {
            setLoading(false);
        }
    }

    const guardarCambios = async () => {
        if (!seccionamiento.tipo) {
            Alert.alert('Error', 'El tipo es obligatorio')
            return
        }
        if (!seccionamiento.condicion) {
            Alert.alert('Error', 'La condición es obligatoria')
            return
        }

        try {
            await updateSeccionamiento(db, Number(id_elemento), seccionamiento)
            Alert.alert('Éxito', `Seccionamiento actualizado`)
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
            <Text variant="headlineMedium" style={styles.title}>Editar Seccionamiento #{id_elemento}</Text>

            <TextInput
                label="Letrero"
                value={seccionamiento.letrero}
                onChangeText={text => setSeccionamiento({ ...seccionamiento, letrero: text })}
                style={styles.input}
                mode="outlined"
            />

            <SegmentedButtons
                value={seccionamiento.nivel_tension || ''}
                onValueChange={val => setSeccionamiento({ ...seccionamiento, nivel_tension: val as any })}
                buttons={[
                    { value: 'MT', label: 'MT' },
                    { value: 'BT', label: 'BT' },
                ]}
                style={styles.segmentedButtons}
            />

            <SegmentedButtons
                value={seccionamiento.tipo || ''}
                onValueChange={val => setSeccionamiento({ ...seccionamiento, tipo: val as any })}
                buttons={[
                    { value: 'FUS', label: 'Fusible' },
                    { value: 'REC', label: 'Reconectador' },
                    { value: 'CUC', label: 'Cuchilla' },
                    { value: 'AUT', label: 'Automático' },
                ]}
                style={styles.segmentedButtons}
            />

            <SegmentedButtons
                value={seccionamiento.posicion || ''}
                onValueChange={val => setSeccionamiento({ ...seccionamiento, posicion: val as any })}
                buttons={[
                    { value: 'ABIERTO', label: 'Abierto' },
                    { value: 'CERRADO', label: 'Cerrado' },
                ]}
                style={styles.segmentedButtons}
            />

            <SegmentedButtons
                value={seccionamiento.fases?.toString() || ''}
                onValueChange={val => setSeccionamiento({ ...seccionamiento, fases: Number(val) })}
                buttons={[
                    { value: '1', label: '1' },
                    { value: '2', label: '2' },
                    { value: '3', label: '3' },
                ]}
                style={styles.segmentedButtons}
            />

            <SegmentedButtons
                value={seccionamiento.condicion || ''}
                onValueChange={val => setSeccionamiento({ ...seccionamiento, condicion: val as any })}
                buttons={[
                    { value: 'BUENO', label: 'Bueno' },
                    { value: 'REGULAR', label: 'Regular' },
                    { value: 'MALO', label: 'Malo' },
                ]}
                style={styles.segmentedButtons}
            />

            <TextInput
                label="Notas"
                value={seccionamiento.notas}
                onChangeText={text => setSeccionamiento({ ...seccionamiento, notas: text })}
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

export default EditarSeccionamiento

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: "#f5f5f5" },
    content: { padding: 16, paddingBottom: 40 },
    center: { flex: 1, justifyContent: 'center', alignItems: 'center' },
    title: { textAlign: "center", fontWeight: "bold", marginBottom: 20 },
    input: { marginBottom: 12, backgroundColor: "white" },
    segmentedButtons: { marginBottom: 16 },
    button: { marginBottom: 12 },
})
