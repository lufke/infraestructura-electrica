import { useNavigation } from "@/src/contexts/NavigationContext";
import { getSoportesByLoteoId } from "@/src/database/queries/soportes";
import { Soporte } from "@/src/types/soporte";
import { useFocusEffect } from "expo-router";
import { useSQLiteContext } from "expo-sqlite";
import { useCallback, useState } from "react";
import { FlatList, View } from "react-native";
import { Text } from "react-native-paper";

export default function Loteo() {

    const { currentLoteoId } = useNavigation();
    const [soportes, setSoportes] = useState<Soporte[]>([]);
    const db = useSQLiteContext();
    const loadSoportes = async () => {
        const result = await getSoportesByLoteoId(db, currentLoteoId!);
        setSoportes(result as Soporte[]);
    }

    useFocusEffect(
        useCallback(() => {
            loadSoportes();
        }, [])
    )
    return (
        <View>
            <FlatList
                data={soportes}
                keyExtractor={(item) => item.id.toString()}
                renderItem={({ item }) => (
                    <Text>{JSON.stringify(item)}</Text>
                )}
            />
        </View>
    )
}