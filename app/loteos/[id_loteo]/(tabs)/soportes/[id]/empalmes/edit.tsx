import { useAuth } from '@/src/contexts/AuthContext'
import { getEmpalmeById, updateEmpalme } from '@/src/database/queries/empalmes'
import { Empalme } from '@/src/types'
import { router, useLocalSearchParams } from 'expo-router'
import { useSQLiteContext } from 'expo-sqlite'
import React, { useEffect, useState } from 'react'
import { ActivityIndicator, Alert, StyleSheet, View } from 'react-native'
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view"
import { Button, SegmentedButtons, Text, TextInput } from 'react-native-paper'

const EditarEmpalme = () => {
    const db = useSQLiteContext()
    const { id_elemento } = useLocalSearchParams<{ id_elemento: string }>()
    const { session } = useAuth()

    const [empalme, setEmpalme] = useState<Partial<Empalme>>({})
    const [loading, setLoading] = useState(true)
    const [isSinAcceso, setIsSinAcceso] = useState(false)
    const [isNumerico, setIsNumerico] = useState(false)

    useEffect(() => {
        loadData()
    }, [id_elemento])

    const loadData = async () => {
        if (!id_elemento) return;
        try {
            const data = await getEmpalmeById(db, Number(id_elemento)) as Empalme;
            if (data) {
                setEmpalme({ ...data, updated_by: session?.user.id });
                if (data.n_medidor === 'S/E' || data.n_medidor === 'SIN ACCESO') setIsSinAcceso(true);
            }
        } catch (error) {
            console.error(error);
            Alert.alert('Error', 'No se pudo cargar la información');
        } finally {
            setLoading(false);
        }
    }

    const toggleSinAcceso = () => {
        if (!isSinAcceso) {
            setEmpalme(prev => ({ ...prev, n_medidor: 'S/E' }))
            setIsSinAcceso(true)
        } else {
            setEmpalme(prev => ({ ...prev, n_medidor: '' }))
            setIsSinAcceso(false)
        }
    }

    const guardarCambios = async () => {
        if (!empalme.n_medidor?.trim()) {
            Alert.alert('Error', 'El número de medidor es obligatorio')
            return
        }
        if (!empalme.nivel_tension) {
            Alert.alert('Error', 'El nivel de tensión es obligatorio')
            return
        }
        if (!empalme.fases) {
            Alert.alert('Error', 'El número de fases es obligatorio')
            return
        }

        try {
            await updateEmpalme(db, Number(id_elemento), empalme)
            Alert.alert('Éxito', `Empalme actualizado`)
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
            <Text variant="headlineMedium" style={styles.title}>Editar Empalme #{id_elemento}</Text>

            <TextInput
                label="N° Medidor *"
                value={empalme.n_medidor}
                onChangeText={text => setEmpalme({ ...empalme, n_medidor: text })}
                style={styles.input}
                mode="outlined"
                disabled={isSinAcceso}
                keyboardType={isNumerico ? 'numeric' : 'default'}
                right={<TextInput.Icon icon={isSinAcceso ? 'check-circle' : 'cancel'} onPress={toggleSinAcceso} forceTextInputFocus={false} />}
                left={<TextInput.Icon icon={isNumerico ? 'alphabetical' : 'numeric'} onPress={() => setIsNumerico(!isNumerico)} forceTextInputFocus={false} />}
            />

            <SegmentedButtons
                value={empalme.nivel_tension || ''}
                onValueChange={val => setEmpalme({ ...empalme, nivel_tension: val as any })}
                buttons={[
                    { value: 'BT', label: 'BT' },
                    { value: 'MT', label: 'MT' },
                ]}
                style={styles.segmentedButtons}
            />

            <SegmentedButtons
                value={empalme.fases?.toString() || ''}
                onValueChange={val => setEmpalme({ ...empalme, fases: Number(val) })}
                buttons={[
                    { value: '1', label: 'Monofásico' },
                    { value: '3', label: 'Trifásico' },
                ]}
                style={styles.segmentedButtons}
            />

            <SegmentedButtons
                value={empalme.activo !== undefined ? empalme.activo.toString() : ''}
                onValueChange={val => setEmpalme({ ...empalme, activo: Number(val) })}
                buttons={[
                    { value: '1', label: 'Activo' },
                    { value: '0', label: 'Inactivo' },
                ]}
                style={styles.segmentedButtons}
            />

            <TextInput
                label="Notas"
                value={empalme.notas}
                onChangeText={text => setEmpalme({ ...empalme, notas: text })}
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

export default EditarEmpalme

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: "#f5f5f5" },
    content: { padding: 16, paddingBottom: 40 },
    center: { flex: 1, justifyContent: 'center', alignItems: 'center' },
    title: { textAlign: "center", fontWeight: "bold", marginBottom: 20 },
    input: { marginBottom: 12, backgroundColor: "white" },
    segmentedButtons: { marginBottom: 16 },
    button: { marginBottom: 12 },
})
