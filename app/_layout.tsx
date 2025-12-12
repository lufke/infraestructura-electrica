import { AuthProvider, useAuth } from "@/src/contexts/AuthContext";
import { LoteoProvider } from "@/src/contexts/LoteoContext";
import { ThemeProvider, useThemeContext } from "@/src/contexts/ThemeContext";
import { sqlInit } from "@/src/database/sqlInit";
import { darkTheme, lightTheme } from "@/src/themes/theme";
import { Stack, useRouter, useSegments } from "expo-router";
import { SQLiteProvider } from "expo-sqlite";
import React, { useEffect } from "react";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { PaperProvider } from "react-native-paper";

function AuthGuard({ children }: { children: React.ReactNode }) {
  const { session, loading } = useAuth();
  const segments = useSegments();
  const router = useRouter();

  useEffect(() => {
    if (loading) return;

    const inAuthGroup = segments[0] === 'auth';

    if (!session && !inAuthGroup) {
      // Redirect to the sign-in page.
      router.replace('/auth/login');
    } else if (session && inAuthGroup) {
      // Redirect away from the sign-in page.
      router.replace('/');
    }
  }, [session, loading, segments]);

  return <>{children}</>;
}

function ThemedApp() {
  const { isDark } = useThemeContext()
  const theme = isDark ? darkTheme : lightTheme;

  return (
    <PaperProvider theme={theme}>
      <Stack
        screenOptions={{
          title: "Loteos",
          headerStyle: {
            backgroundColor: theme.colors.primary,
          },
          headerTintColor: theme.colors.onPrimary,
          headerTitleStyle: {
            fontWeight: 'bold',
          },
          contentStyle: {
            backgroundColor: theme.colors.background,
          },
          // headerShown: false,
        }}
      >
        <Stack.Screen name="index" options={{ headerShown: true }} />
        <Stack.Screen name="loteos/[id_loteo]/(tabs)" options={{ headerShown: false }} />
      </Stack>
    </PaperProvider>
  )
}

export default function RootLayout() {

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <AuthProvider>
        <LoteoProvider>
          <ThemeProvider>
            <SQLiteProvider databaseName="infraestructura.db" onInit={sqlInit}>
              <AuthGuard>
                <ThemedApp />
              </AuthGuard>
            </SQLiteProvider>
          </ThemeProvider>
        </LoteoProvider>
      </AuthProvider>
    </GestureHandlerRootView>
  );
}
