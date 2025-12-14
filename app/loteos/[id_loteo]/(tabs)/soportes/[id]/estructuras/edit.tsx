import { useAuth } from '@/src/contexts/AuthContext'
import { getEstructuraById, updateEstructura } from '@/src/database/queries/estructuras'
import { Estructura } from '@/src/types'
import { router, useLocalSearchParams } from 'expo-router'
import { useSQLiteContext } from 'expo-sqlite'
import React, { useEffect, useState } from 'react'
import { ActivityIndicator, Alert, StyleSheet, View } from 'react-native'
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view"
import { Button, SegmentedButtons, Text, TextInput } from 'react-native-paper'

const EditarEstructura = () => {
    const db = useSQLiteContext()
    const { id_elemento } = useLocalSearchParams<{ id_elemento: string }>()
    const { session } = useAuth()

    const [estructura, setEstructura] = useState<Partial<Estructura>>({})
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        loadData()
    }, [id_elemento])

    const loadData = async () => {
        if (!id_elemento) return;
        try {
            const data = await getEstructuraById(db, Number(id_elemento)) as Estructura;
            if (data) {
                setEstructura({ ...data, updated_by: session?.user.id });
            }
        } catch (error) {
            console.error(error);
            Alert.alert('Error', 'No se pudo cargar la información');
        } finally {
            setLoading(false);
        }
    }

    const guardarCambios = async () => {
        if (!estructura.descripcion) {
            Alert.alert('Error', 'La descripción es obligatoria')
            return
        }
        if (!estructura.condicion) {
            Alert.alert('Error', 'La condición es obligatoria')
            return
        }

        try {
            await updateEstructura(db, Number(id_elemento), estructura)
            Alert.alert('Éxito', `Estructura actualizada`)
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
            <Text variant="headlineMedium" style={styles.title}>Editar Estructura #{id_elemento}</Text>

            <SegmentedButtons
                value={estructura.nivel_tension || ''}
                onValueChange={val => setEstructura({ ...estructura, nivel_tension: val as any })}
                buttons={[
                    { value: 'BT', label: 'BT' },
                    { value: 'MT', label: 'MT' },
                ]}
                style={styles.segmentedButtons}
            />

            <SegmentedButtons
                value={estructura.fases?.toString() || ''}
                onValueChange={val => setEstructura({ ...estructura, fases: Number(val) })}
                buttons={[
                    { value: '1', label: '1' },
                    { value: '2', label: '2' },
                    { value: '3', label: '3' },
                ]}
                style={styles.segmentedButtons}
            />

            <TextInput
                label="Descripción (Tipo)"
                value={estructura.descripcion}
                onChangeText={text => setEstructura({ ...estructura, descripcion: text })}
                style={styles.input}
                mode="outlined"
            />

            <SegmentedButtons
                value={estructura.material_conductor || ''}
                onValueChange={val => setEstructura({ ...estructura, material_conductor: val as any })}
                buttons={[
                    { value: 'CU', label: 'Cobre' },
                    { value: 'AL', label: 'Aluminio' },
                    { value: 'ACSR', label: 'ACSR' },
                ]}
                style={styles.segmentedButtons}
            />

            <SegmentedButtons
                value={estructura.condicion || ''}
                onValueChange={val => setEstructura({ ...estructura, condicion: val as any })}
                buttons={[
                    { value: 'BUENO', label: 'Bueno' },
                    { value: 'REGULAR', label: 'Regular' },
                    { value: 'MALO', label: 'Malo' },
                ]}
                style={styles.segmentedButtons}
            />

            <TextInput
                label="Notas"
                value={estructura.notas}
                onChangeText={text => setEstructura({ ...estructura, notas: text })}
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

export default EditarEstructura

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: "#f5f5f5" },
    content: { padding: 16, paddingBottom: 40 },
    center: { flex: 1, justifyContent: 'center', alignItems: 'center' },
    title: { textAlign: "center", fontWeight: "bold", marginBottom: 20 },
    input: { marginBottom: 12, backgroundColor: "white" },
    segmentedButtons: { marginBottom: 16 },
    button: { marginBottom: 12 },
})
