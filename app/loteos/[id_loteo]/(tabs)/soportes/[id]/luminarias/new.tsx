import { useAuth } from '@/src/contexts/AuthContext';
import { addLuminaria } from '@/src/database/queries/luminarias';
import { Luminaria } from '@/src/types';
import { router, useGlobalSearchParams } from 'expo-router';
import { useSQLiteContext } from 'expo-sqlite';
import React, { useState } from 'react';
import {
    Alert,
    StyleSheet,
} from 'react-native';
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import {
    Button,
    SegmentedButtons,
    Text,
    TextInput
} from 'react-native-paper';

const NuevaLuminaria = () => {
    const db = useSQLiteContext();
    const params = useGlobalSearchParams();
    const { session } = useAuth();

    const [luminaria, setLuminaria] = useState<Partial<Luminaria>>({
        id_soporte: params.id ? Number(params.id) : 0,
        id_empalme: params.id_empalme ? Number(params.id_empalme) : undefined,
        condicion: 'BUENO',
        created_by: session?.user.id,
        updated_by: session?.user.id,
    });

    const handleTipoLamparaChange = (value: string) => {
        setLuminaria(prev => ({
            ...prev,
            tipo_lampara: value
        }));
    };

    const handleCondicionChange = (value: string) => {
        setLuminaria(prev => ({
            ...prev,
            condicion: value
        }));
    };

    const handleNotasChange = (value: string) => {
        setLuminaria(prev => ({
            ...prev,
            notas: value
        }));
    };

    const crearLuminaria = async () => {
        if (!luminaria.tipo_lampara?.trim()) {
            Alert.alert('Error', 'El tipo de lámpara es obligatorio');
            return;
        }

        if (!luminaria.potencia) {
            Alert.alert('Error', 'La potencia es obligatoria');
            return;
        }

        if (!luminaria.id_empalme) {
            Alert.alert('Error', 'Debe seleccionar un empalme');
            return;
        }

        try {
            await addLuminaria(db, luminaria as any);
            Alert.alert('Éxito', 'Luminaria creada correctamente', [
                {
                    text: 'OK',
                    onPress: () => router.back()
                }
            ]);
        } catch (error) {
            console.error('Error al crear luminaria:', error);
            Alert.alert('Error', 'No se pudo crear la luminaria');
        }
    };

    return (
        <KeyboardAwareScrollView
            style={styles.container}
            contentContainerStyle={styles.contentContainer}
            keyboardShouldPersistTaps="handled"
            enableOnAndroid={true}
            extraScrollHeight={20}
        >
            <Text variant="headlineMedium" style={styles.title}>
                Nueva Luminaria
            </Text>

            {/* Tipo de Lámpara */}
            <Text variant="labelLarge" style={styles.label}>Tipo de Lámpara *</Text>
            <SegmentedButtons
                value={luminaria.tipo_lampara || ''}
                onValueChange={handleTipoLamparaChange}
                buttons={[
                    { value: 'LED', label: 'LED' },
                    { value: 'HM', label: 'HM' },
                    { value: 'HPS', label: 'HPS' },
                ]}
                style={styles.segmentedButtons}
            />

            {/* Potencia */}
            <TextInput
                label="Potencia (W) *"
                value={luminaria.potencia?.toString() || ''}
                onChangeText={text => setLuminaria({ ...luminaria, potencia: text ? parseFloat(text) : undefined })}
                style={styles.input}
                mode="outlined"
                keyboardType="numeric"
            />

            {/* ID Empalme */}
            <TextInput
                label="ID Empalme *"
                value={luminaria.id_empalme?.toString() || ''}
                onChangeText={text => setLuminaria({ ...luminaria, id_empalme: text ? parseInt(text) : undefined })}
                style={styles.input}
                mode="outlined"
                keyboardType="numeric"
                placeholder="Ingrese el ID del empalme"
            />

            {/* Condición */}
            <Text variant="labelLarge" style={styles.label}>Condición</Text>
            <SegmentedButtons
                value={luminaria.condicion || 'BUENO'}
                onValueChange={handleCondicionChange}
                buttons={[
                    { value: 'BUENO', label: 'Bueno' },
                    { value: 'REGULAR', label: 'Regular' },
                    { value: 'MALO', label: 'Malo' },
                ]}
                style={styles.segmentedButtons}
            />

            {/* Notas */}
            <TextInput
                label="Notas"
                value={luminaria.notas || ''}
                onChangeText={handleNotasChange}
                style={styles.input}
                mode="outlined"
                multiline
                numberOfLines={4}
            />

            {/* Botones */}
            <Button
                mode="contained"
                onPress={crearLuminaria}
                style={styles.button}
            >
                Crear Luminaria
            </Button>

            <Button
                mode="outlined"
                onPress={() => router.back()}
                style={styles.button}
            >
                Cancelar
            </Button>
        </KeyboardAwareScrollView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f5f5f5',
    },
    contentContainer: {
        padding: 16,
    },
    title: {
        marginBottom: 24,
        fontWeight: 'bold',
    },
    label: {
        marginTop: 16,
        marginBottom: 8,
    },
    input: {
        marginBottom: 12,
    },
    segmentedButtons: {
        marginBottom: 12,
    },
    button: {
        marginTop: 16,
    },
});

export default NuevaLuminaria;