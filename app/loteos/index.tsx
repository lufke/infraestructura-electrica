import { useAuth } from "@/src/contexts/AuthContext";
import { useLoteo } from "@/src/contexts/LoteoContext";
import { getLoteos, hardDeleteLoteo } from "@/src/database/queries/loteos";
import { Loteo } from "@/src/types/loteo";
import { Href, useFocusEffect, useRouter } from "expo-router";
import { useSQLiteContext } from "expo-sqlite";
import { useCallback, useState } from "react";
import { FlatList, View } from "react-native";
import { FAB, IconButton, List, Text } from "react-native-paper";

export default function Index() {
    const router = useRouter();
    const db = useSQLiteContext()
    const [loteos, setLoteos] = useState<Loteo[]>([]);
    const { session } = useAuth();

    const { setCurrentLoteoId } = useLoteo();

    const loadLoteos = async () => {
        if (!session?.user.id) return;
        const result = await getLoteos(db, session.user.id);
        setLoteos(result as Loteo[]);
    }

    useFocusEffect(
        useCallback(() => {
            loadLoteos();
        }, [])
    )

    const handleDelete = async (id: number) => {
        await hardDeleteLoteo(db, id);
        loadLoteos();
    }

    const handleSelectLoteo = (id: number) => {
        setCurrentLoteoId(id);
        router.push(`/loteos/${id}` as Href);
    }

    return (
        <View
            style={{
                flex: 1,
                padding: 20,
            }}
        >
            <FlatList
                ListHeaderComponent={<Text variant="titleMedium">Lista de Loteos</Text>}
                data={loteos}
                keyExtractor={(item) => item.id.toString()}
                renderItem={({ item }) => (
                    <List.Item
                        title={item.nombre}
                        description={item.direccion}
                        left={props => <List.Icon {...props} icon="folder" />}
                        right={props => (
                            <IconButton
                                {...props}
                                icon="delete"
                                onPress={() => handleDelete(item.id)}
                            />
                        )}
                        onPress={() => handleSelectLoteo(item.id)}
                    />
                )}
                ListEmptyComponent={<Text>No hay loteos registrados.</Text>}
            />
            <FAB
                icon="plus"
                onPress={() => router.push("/loteos/new" as Href)}
                style={{ position: 'absolute', bottom: 40, right: 30 }}
            />
        </View>
    );
}
