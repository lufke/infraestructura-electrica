import { useAuth } from '@/src/contexts/AuthContext'
import { getPosteById, updatePoste } from '@/src/database/queries/postes'
import { Poste } from '@/src/types'
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

const EditarPoste = () => {
    const db = useSQLiteContext()
    const { id_elemento } = useLocalSearchParams<{ id_elemento: string }>()
    const { session } = useAuth()

    const [poste, setPoste] = useState<Partial<Poste>>({})
    const [loading, setLoading] = useState(true)
    const [isSinPlaca, setIsSinPlaca] = useState(false)
    const [isNumerico, setIsNumerico] = useState(false)

    useEffect(() => {
        loadData()
    }, [id_elemento])

    const loadData = async () => {
        if (!id_elemento) return;
        try {
            const data = await getPosteById(db, Number(id_elemento)) as Poste;
            if (data) {
                setPoste({ ...data, updated_by: session?.user.id });
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
            setPoste(prev => ({ ...prev, placa: 'SIN PLACA' }))
            setIsSinPlaca(true)
        } else {
            setPoste(prev => ({ ...prev, placa: '' }))
            setIsSinPlaca(false)
        }
    }

    const guardarCambios = async () => {
        if (!poste.placa?.trim()) {
            Alert.alert('Error', 'La placa es obligatoria')
            return
        }
        if (!poste.altura_nivel_tension) {
            Alert.alert('Error', 'El nivel de tensión es obligatorio')
            return
        }
        if (!poste.material) {
            Alert.alert('Error', 'El material es obligatorio')
            return
        }
        if (!poste.condicion) {
            Alert.alert('Error', 'La condición es obligatoria')
            return
        }

        try {
            await updatePoste(db, Number(id_elemento), poste)
            Alert.alert('Éxito', `Poste actualizado`)
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
                Editar Poste #{id_elemento}
            </Text>

            <TextInput
                label="Placa *"
                value={poste.placa}
                onChangeText={text => setPoste({ ...poste, placa: text })}
                style={styles.input}
                mode="outlined"
                disabled={isSinPlaca}
                keyboardType={isNumerico ? 'numeric' : 'default'}
                right={<TextInput.Icon icon={isSinPlaca ? 'close-circle' : 'tag-off'} onPress={toggleSinPlaca} forceTextInputFocus={false} />}
                left={<TextInput.Icon icon={isNumerico ? 'alphabetical' : 'numeric'} onPress={() => setIsNumerico(!isNumerico)} forceTextInputFocus={false} />}
            />

            <SegmentedButtons
                value={poste.altura_nivel_tension || ''}
                onValueChange={val => setPoste({ ...poste, altura_nivel_tension: val as any })}
                buttons={[
                    { value: 'BT', label: 'BT' },
                    { value: 'MT', label: 'MT' },
                ]}
                style={styles.segmentedButtons}
            />

            <SegmentedButtons
                value={poste.material || ''}
                onValueChange={val => setPoste({ ...poste, material: val as any })}
                buttons={[
                    { value: 'MADERA', label: 'Madera' },
                    { value: 'CONCRETO', label: 'Concreto' },
                    { value: 'METAL', label: 'Metal' },
                ]}
                style={styles.segmentedButtons}
            />

            <SegmentedButtons
                value={poste.condicion || ''}
                onValueChange={val => setPoste({ ...poste, condicion: val as any })}
                buttons={[
                    { value: 'BUENO', label: 'Bueno' },
                    { value: 'REGULAR', label: 'Regular' },
                    { value: 'MALO', label: 'Malo' },
                ]}
                style={styles.segmentedButtons}
            />

            <TextInput
                label="Notas"
                value={poste.notas}
                onChangeText={text => setPoste({ ...poste, notas: text })}
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

export default EditarPoste

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: "#f5f5f5" },
    content: { padding: 16, paddingBottom: 40 },
    center: { flex: 1, justifyContent: 'center', alignItems: 'center' },
    title: { textAlign: "center", fontWeight: "bold", marginBottom: 20 },
    input: { marginBottom: 12, backgroundColor: "white" },
    segmentedButtons: { marginBottom: 16 },
    button: { marginBottom: 12 },
})
