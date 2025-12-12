import { MaterialCommunityIcons } from "@expo/vector-icons";
import { Tabs } from "expo-router";

export default function Layout() {
    return (
        <Tabs
            screenOptions={{
                // headerShown: false,


            }}
        // initialRouteName="mapa_soporte_linea"
        >
            <Tabs.Screen
                name="index"
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
                    // headerShown: false,
                }}
            />
            <Tabs.Screen
                name="info"
                options={{
                    title: "Info",
                    tabBarIcon: ({ color, size }) => (
                        <MaterialCommunityIcons name="information-outline" size={size} color={color} />
                    ),
                    headerShown: true,
                    // href: null,
                }}
            />


            {/* Ocultar del tab bar - solo accesibles por navegación */}
            <Tabs.Screen
                name="soportes/new"
                options={{
                    href: null,
                    headerShown: true,
                }}
            />
            <Tabs.Screen
                name="soportes/[id]"
                options={{
                    href: null,
                    headerShown: false,
                }}
            />
            <Tabs.Screen
                name="lineas/index"
                options={{
                    title: "Lineas",
                    tabBarIcon: ({ color, size }) => (
                        <MaterialCommunityIcons name="transmission-tower" size={size} color={color} />
                    ),
                    headerShown: true,
                    href: null,
                }}
            />
            <Tabs.Screen
                name="lineas/bt/index"
                options={{
                    href: null,
                    headerShown: false,
                }}
            />
            <Tabs.Screen
                name="lineas/bt/new"
                options={{
                    href: null,
                }}
            />
            <Tabs.Screen
                name="lineas/mt/index"
                options={{
                    href: null,
                }}
            />
            <Tabs.Screen
                name="lineas/mt/new"
                options={{
                    href: null,
                }}
            />

        </Tabs>
    );
}