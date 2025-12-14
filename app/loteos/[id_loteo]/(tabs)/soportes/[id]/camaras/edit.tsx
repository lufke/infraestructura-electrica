import { useAuth } from '@/src/contexts/AuthContext'
import { getCamaraById, updateCamara } from '@/src/database/queries/camaras'
import { Camara } from '@/src/types'
import { router, useLocalSearchParams } from 'expo-router'
import { useSQLiteContext } from 'expo-sqlite'
import React, { useEffect, useState } from 'react'
import {
    ActivityIndicator,
    Alert,
    StyleSheet,
    View
} from 'react-native'
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view"
import {
    Button,
    SegmentedButtons,
    Text,
    TextInput
} from 'react-native-paper'

const EditarCamara = () => {
    const db = useSQLiteContext()
    const { id_elemento } = useLocalSearchParams<{ id_elemento: string }>()
    const { session } = useAuth()

    const [camara, setCamara] = useState<Partial<Camara>>({})
    const [loading, setLoading] = useState(true)
    const [isSinPlaca, setIsSinPlaca] = useState(false)
    const [isNumerico, setIsNumerico] = useState(false)

    useEffect(() => {
        loadData()
    }, [id_elemento])

    const loadData = async () => {
        if (!id_elemento) return;
        try {
            const data = await getCamaraById(db, Number(id_elemento)) as Camara;
            if (data) {
                setCamara({ ...data, updated_by: session?.user.id });
                if (data.placa === 'SIN PLACA') setIsSinPlaca(true);
            }
        } catch (error) {
            console.error(error);
            Alert.alert('Error', 'No se pudo cargar la información');
        } finally {
            setLoading(false);
        }
    }

    const toggleSinPlaca = () => {
        if (!isSinPlaca) {
            setCamara(prev => ({ ...prev, placa: 'SIN PLACA' }))
            setIsSinPlaca(true)
        } else {
            setCamara(prev => ({ ...prev, placa: '' }))
            setIsSinPlaca(false)
        }
    }

    const guardarCambios = async () => {
        if (!camara.placa?.trim()) {
            Alert.alert('Error', 'La placa es obligatoria')
            return
        }
        if (!camara.tipo_camara) {
            Alert.alert('Error', 'El tipo de cámara es obligatorio')
            return
        }
        if (!camara.condicion) {
            Alert.alert('Error', 'La condición es obligatoria')
            return
        }

        try {
            await updateCamara(db, Number(id_elemento), camara)
            Alert.alert('Éxito', `Cámara actualizada`)
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
            keyboardShouldPersistTaps="handled"
        >
            <Text variant="headlineMedium" style={styles.title}>
                Editar Cámara #{id_elemento}
            </Text>

            <TextInput
                label="Placa *"
                value={camara.placa}
                onChangeText={text => setCamara({ ...camara, placa: text })}
                style={styles.input}
                mode="outlined"
                disabled={isSinPlaca}
                keyboardType={isNumerico ? 'numeric' : 'default'}
                right={<TextInput.Icon icon={isSinPlaca ? 'close-circle' : 'tag-off'} onPress={toggleSinPlaca} forceTextInputFocus={false} />}
                left={<TextInput.Icon icon={isNumerico ? 'alphabetical' : 'numeric'} onPress={() => setIsNumerico(!isNumerico)} forceTextInputFocus={false} />}
            />

            <SegmentedButtons
                value={camara.tipo_camara || ''}
                onValueChange={val => setCamara({ ...camara, tipo_camara: val as any })}
                buttons={[
                    { value: 'A', label: 'Tipo A' },
                    { value: 'B', label: 'Tipo B' },
                    { value: 'C', label: 'Tipo C' },
                ]}
                style={styles.segmentedButtons}
            />

            <SegmentedButtons
                value={camara.condicion || ''}
                onValueChange={val => setCamara({ ...camara, condicion: val as any })}
                buttons={[
                    { value: 'BUENO', label: 'Bueno' },
                    { value: 'REGULAR', label: 'Regular' },
                    { value: 'MALO', label: 'Malo' },
                ]}
                style={styles.segmentedButtons}
            />

            <TextInput
                label="Notas"
                value={camara.notas}
                onChangeText={text => setCamara({ ...camara, notas: text })}
                style={styles.input}
                mode="outlined"
                multiline
                numberOfLines={4}
            />

            <Button mode="contained" onPress={guardarCambios} style={styles.button} icon="content-save">
                Guardar Cambios
            </Button>

            <Button mode="outlined" onPress={() => router.back()} style={styles.button} icon="arrow-left">
                Cancelar
            </Button>

        </KeyboardAwareScrollView>
    )
}

export default EditarCamara

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: "#f5f5f5" },
    content: { padding: 16, paddingBottom: 40 },
    center: { flex: 1, justifyContent: 'center', alignItems: 'center' },
    title: { textAlign: "center", fontWeight: "bold", marginBottom: 20 },
    input: { marginBottom: 12, backgroundColor: "white" },
    segmentedButtons: { marginBottom: 16 },
    button: { marginBottom: 12 },
})
