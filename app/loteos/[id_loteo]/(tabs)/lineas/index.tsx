import { useGlobalSearchParams, useRouter } from "expo-router";
import { View } from "react-native";
import { Button, Text } from "react-native-paper";

export default function Lineas() {
    const router = useRouter();
    const { id_loteo } = useGlobalSearchParams();

    return (
        <View>
            <Text>Lineas</Text>
            <Button
                mode="contained"
                onPress={() => router.push(`/loteos/${id_loteo}/lineas/bt/new`)}
                style={{ marginBottom: 10 }}
            >
                Nuevo Tramo BT
            </Button>
            <Button
                mode="contained"
                onPress={() => router.push(`/loteos/${id_loteo}/lineas/mt/new`)}
            >
                Nuevo Tramo MT
            </Button>
        </View>
    );
}
