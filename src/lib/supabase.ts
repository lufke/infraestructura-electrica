
import AsyncStorage from '@react-native-async-storage/async-storage';
import { createClient } from '@supabase/supabase-js';
import Constants from 'expo-constants';
import 'react-native-url-polyfill/auto';

// Método seguro con validación
const getSupabaseConfig = () => {
    const supabaseUrl = Constants.expoConfig?.extra?.supabaseUrl;
    const supabaseAnonKey = Constants.expoConfig?.extra?.supabaseAnonKey;

    // Debug - solo en desarrollo
    if (__DEV__) {
        console.log('🔧 Supabase Config:', {
            url: supabaseUrl ? '✅ Presente' : '❌ Faltante',
            key: supabaseAnonKey ? '✅ Presente' : '❌ Faltante',
            urlValue: supabaseUrl ? `${supabaseUrl.substring(0, 30)}...` : 'none'
        });
    }

    if (!supabaseUrl || !supabaseAnonKey) {
        throw new Error(
            'Supabase configuration missing. ' +
            'Check your app.config.js and EAS build variables.'
        );
    }

    return { supabaseUrl, supabaseAnonKey };
};

const { supabaseUrl, supabaseAnonKey } = getSupabaseConfig();

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
    auth: {
        storage: AsyncStorage,
        autoRefreshToken: true,
        persistSession: true,
        detectSessionInUrl: false,
    },
});
