import { useLoteo } from "@/src/contexts/LoteoContext";
import { getLoteoById } from "@/src/database/queries/loteos";
import { Loteo } from "@/src/types/loteo";
import { useFocusEffect } from "expo-router";
import { useSQLiteContext } from "expo-sqlite";
import { useCallback, useState } from "react";
import { View } from "react-native";
import { Text } from "react-native-paper";
export default function IndexLoteo() {

    const { currentLoteoId } = useLoteo();
    console.log(currentLoteoId);
    const [loteo, setLoteo] = useState<Loteo | null>(null);
    const db = useSQLiteContext();

    const loadLoteo = async () => {
        const result = await getLoteoById(db, currentLoteoId!);
        console.log(result);
        setLoteo(result as any);
    }

    useFocusEffect(
        useCallback(() => {
            loadLoteo();
        }, [currentLoteoId])
    )
    return (
        <View>
            <Text>{currentLoteoId}</Text>
            <Text>{JSON.stringify(loteo)}</Text>
        </View>
    )
}