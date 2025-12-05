import ThemeToggle from "@/src/components/ui/ThemeToggle";
import { Href, useRouter } from "expo-router";
import { View } from "react-native";
import { Button, Text } from "react-native-paper";

export default function Index() {
  const router = useRouter();

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

    </View>
  );
}
