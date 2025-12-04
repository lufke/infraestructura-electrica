import { ThemeProvider, useThemeContext } from "@/src/contexts/ThemeContext";
import { sqlInit } from "@/src/database/sqlInit";
import { darkTheme, lightTheme } from "@/src/themes/theme";
import { Stack } from "expo-router";
import { SQLiteProvider } from "expo-sqlite";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { PaperProvider } from "react-native-paper";

export default function RootLayout() {

  const { isDark } = useThemeContext()
  const theme = isDark ? darkTheme : lightTheme;
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>

      <ThemeProvider>
        <SQLiteProvider databaseName="infraestructura.db" onInit={sqlInit}>
          <PaperProvider theme={theme}>
            <Stack
              screenOptions={{
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
              }}
            />
          </PaperProvider>
        </SQLiteProvider>
      </ThemeProvider>
    </GestureHandlerRootView>
  );
}
