import { useAuth } from '@/src/contexts/AuthContext'
import { getSubestacionById, updateSubestacion } from '@/src/database/queries/subestaciones'
import { Subestacion } from '@/src/types'
import { router, useLocalSearchParams } from 'expo-router'
import { useSQLiteContext } from 'expo-sqlite'
import React, { useEffect, useState } from 'react'
import { ActivityIndicator, Alert, StyleSheet, View } from 'react-native'
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view"
import { Button, SegmentedButtons, Text, TextInput } from 'react-native-paper'

const EditarSubestacion = () => {
    const db = useSQLiteContext()
    const { id_elemento } = useLocalSearchParams<{ id_elemento: string }>()
    const { session } = useAuth()

    const [subestacion, setSubestacion] = useState<Partial<Subestacion>>({})
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        loadData()
    }, [id_elemento])

    const loadData = async () => {
        if (!id_elemento) return;
        try {
            const data = await getSubestacionById(db, Number(id_elemento)) as Subestacion;
            if (data) {
                setSubestacion({ ...data, updated_by: session?.user.id });
            }
        } catch (error) {
            console.error(error);
            Alert.alert('Error', 'No se pudo cargar la información');
        } finally {
            setLoading(false);
        }
    }

    const guardarCambios = async () => {
        if (!subestacion.potencia) {
            Alert.alert('Error', 'La potencia es obligatoria')
            return
        }
        if (!subestacion.condicion) {
            Alert.alert('Error', 'La condición es obligatoria')
            return
        }

        try {
            await updateSubestacion(db, Number(id_elemento), subestacion)
            Alert.alert('Éxito', `Subestación actualizada`)
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
            <Text variant="headlineMedium" style={styles.title}>Editar Subestación #{id_elemento}</Text>

            <TextInput
                label="Letrero/Nombre"
                value={subestacion.letrero}
                onChangeText={text => setSubestacion({ ...subestacion, letrero: text })}
                style={styles.input}
                mode="outlined"
            />

            <TextInput
                label="Potencia (kVA)"
                value={subestacion.potencia?.toString() || ''}
                onChangeText={text => setSubestacion({ ...subestacion, potencia: Number(text) })}
                style={styles.input}
                mode="outlined"
                keyboardType="numeric"
            />

            <SegmentedButtons
                value={subestacion.fases?.toString() || ''}
                onValueChange={val => setSubestacion({ ...subestacion, fases: Number(val) })}
                buttons={[
                    { value: '1', label: '1' },
                    { value: '2', label: '2' },
                    { value: '3', label: '3' },
                ]}
                style={styles.segmentedButtons}
            />

            <SegmentedButtons
                value={subestacion.condicion || ''}
                onValueChange={val => setSubestacion({ ...subestacion, condicion: val as any })}
                buttons={[
                    { value: 'BUENO', label: 'Bueno' },
                    { value: 'REGULAR', label: 'Regular' },
                    { value: 'MALO', label: 'Malo' },
                ]}
                style={styles.segmentedButtons}
            />

            <TextInput
                label="Notas"
                value={subestacion.notas}
                onChangeText={text => setSubestacion({ ...subestacion, notas: text })}
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

export default EditarSubestacion

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: "#f5f5f5" },
    content: { padding: 16, paddingBottom: 40 },
    center: { flex: 1, justifyContent: 'center', alignItems: 'center' },
    title: { textAlign: "center", fontWeight: "bold", marginBottom: 20 },
    input: { marginBottom: 12, backgroundColor: "white" },
    segmentedButtons: { marginBottom: 16 },
    button: { marginBottom: 12 },
})
