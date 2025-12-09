import ThemeToggle from "@/src/components/ui/ThemeToggle";
import { Href, useRouter } from "expo-router";
import * as SQLite from 'expo-sqlite';
import { Alert, View } from "react-native";
import { Button, Text } from "react-native-paper";

export default function Index() {
  const router = useRouter();
  const db = SQLite.useSQLiteContext();



  const deleteDB = async () => {
    try {
      const dbName = 'infraestructura.db';

      // const db = await SQLite.openDatabaseAsync(dbName);

      // Asegurar el cierre de write-ahead log
      await db.execAsync("PRAGMA wal_checkpoint(TRUNCATE)");

      await db.closeAsync();

      // Ahora borrar
      await SQLite.deleteDatabaseAsync(dbName);

      Alert.alert("Éxito", "Base de datos eliminada. Reinicia la app.");
    } catch (error) {
      console.error(error);
      Alert.alert("Error", "No se pudo eliminar la base de datos: " + error);
    }
  };


  return (
    <View
      style={{
        flex: 1,
        padding: 20,
      }}
    >
      <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
        <Text variant="headlineMedium">Inicio</Text>
        <ThemeToggle />
      </View>

      <Button
        mode="contained"
        icon="home"
        onPress={() => router.push("/loteos" as Href)}
        style={{ marginBottom: 10 }}
      >
        IR A LOTEOS
      </Button>

      <Button
        mode="contained"
        icon="plus"
        onPress={() => router.push("/loteos/new" as Href)}
        style={{ marginBottom: 20 }}
      >
        AGREGAR LOTEO
      </Button>

      <Button
        mode="outlined"
        icon="database-remove"
        textColor="red"
        onPress={async () => {
          Alert.alert(
            "Eliminar Base de Datos",
            "¿Estás seguro? Se perderán todos los datos y tendrás que reiniciar la app.",
            [
              { text: "Cancelar", style: "cancel" },
              {
                text: "Eliminar",
                style: "destructive",
                onPress: deleteDB
              }
            ]
          );
        }}
        style={{ marginTop: 'auto', borderColor: 'red' }}
      >
        ELIMINAR BASE DE DATOS
      </Button>

    </View>
  );
}
