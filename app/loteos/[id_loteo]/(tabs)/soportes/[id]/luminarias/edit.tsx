import { useAuth } from '@/src/contexts/AuthContext'
import { getLuminariaById, updateLuminaria } from '@/src/database/queries/luminarias'
import { Luminaria } from '@/src/types'
import { router, useLocalSearchParams } from 'expo-router'
import { useSQLiteContext } from 'expo-sqlite'
import React, { useEffect, useState } from 'react'
import { ActivityIndicator, Alert, StyleSheet, View } from 'react-native'
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view"
import { Button, SegmentedButtons, Text, TextInput } from 'react-native-paper'

const EditarLuminaria = () => {
    const db = useSQLiteContext()
    const { id_elemento } = useLocalSearchParams<{ id_elemento: string }>()
    const { session } = useAuth()

    const [luminaria, setLuminaria] = useState<Partial<Luminaria>>({})
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        loadData()
    }, [id_elemento])

    const loadData = async () => {
        if (!id_elemento) return;
        try {
            const data = await getLuminariaById(db, Number(id_elemento)) as Luminaria;
            if (data) {
                setLuminaria({ ...data, updated_by: session?.user.id });
            }
        } catch (error) {
            console.error(error);
            Alert.alert('Error', 'No se pudo cargar la información');
        } finally {
            setLoading(false);
        }
    }

    const guardarCambios = async () => {
        if (!luminaria.tipo_lampara) {
            Alert.alert('Error', 'El tipo de lámpara es obligatorio')
            return
        }
        if (!luminaria.condicion) {
            Alert.alert('Error', 'La condición es obligatoria')
            return
        }

        try {
            await updateLuminaria(db, Number(id_elemento), luminaria)
            Alert.alert('Éxito', `Luminaria actualizada`)
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
            <Text variant="headlineMedium" style={styles.title}>Editar Luminaria #{id_elemento}</Text>

            <SegmentedButtons
                value={luminaria.tipo_lampara || ''}
                onValueChange={val => setLuminaria({ ...luminaria, tipo_lampara: val as any })}
                buttons={[
                    { value: 'LED', label: 'LED' },
                    { value: 'HM', label: 'HM' }, // Halogenuro Metálico
                    { value: 'HPS', label: 'HPS' }, // Sodio Alta Presión
                ]}
                style={styles.segmentedButtons}
            />

            <TextInput
                label="Potencia (W)"
                value={luminaria.potencia?.toString() || ''}
                onChangeText={text => setLuminaria({ ...luminaria, potencia: Number(text) })}
                style={styles.input}
                mode="outlined"
                keyboardType="numeric"
            />

            <SegmentedButtons
                value={luminaria.condicion || ''}
                onValueChange={val => setLuminaria({ ...luminaria, condicion: val as any })}
                buttons={[
                    { value: 'BUENO', label: 'Bueno' },
                    { value: 'REGULAR', label: 'Regular' },
                    { value: 'MALO', label: 'Malo' },
                ]}
                style={styles.segmentedButtons}
            />

            <TextInput
                label="Notas"
                value={luminaria.notas}
                onChangeText={text => setLuminaria({ ...luminaria, notas: text })}
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

export default EditarLuminaria

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: "#f5f5f5" },
    content: { padding: 16, paddingBottom: 40 },
    center: { flex: 1, justifyContent: 'center', alignItems: 'center' },
    title: { textAlign: "center", fontWeight: "bold", marginBottom: 20 },
    input: { marginBottom: 12, backgroundColor: "white" },
    segmentedButtons: { marginBottom: 16 },
    button: { marginBottom: 12 },
})
