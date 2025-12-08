import { MaterialCommunityIcons } from "@expo/vector-icons";
import { Tabs } from "expo-router";

export default function Layout() {
    return (
        <Tabs
            screenOptions={{
                headerShown: false,
            }}
        >
            <Tabs.Screen
                name="index"
                options={{
                    title: "Inicio",
                    tabBarIcon: ({ color, size }) => (
                        <MaterialCommunityIcons name="home" size={size} color={color} />
                    ),
                }}
            />
            <Tabs.Screen
                name="mapa"
                options={{
                    title: "Mapa",
                    tabBarIcon: ({ color, size }) => (
                        <MaterialCommunityIcons name="map" size={size} color={color} />
                    ),
                }}
            />
            <Tabs.Screen
                name="soportes/index"
                options={{
                    title: "Soportes",
                    tabBarIcon: ({ color, size }) => (
                        <MaterialCommunityIcons name="transmission-tower" size={size} color={color} />
                    ),
                    headerShown: false,
                }}
            />
            {/* Ocultar del tab bar - solo accesibles por navegación */}
            <Tabs.Screen
                name="soportes/new"
                options={{
                    href: null,
                }}
            />
            <Tabs.Screen
                name="soportes/[id]"
                options={{
                    href: null,
                }}
            />
        </Tabs>
    );
}