export default () => ({
    expo: {
        name: "infraestructura-electrica",
        slug: "infraestructura-electrica",
        version: "1.0.0",
        orientation: "portrait",
        icon: "./assets/images/icon.png",
        scheme: "infraestructuraelectrica",
        userInterfaceStyle: "automatic",
        newArchEnabled: true,

        ios: {
            package: "cl.pipechela.infraestructura_electrica",
            supportsTablet: true,
            config: {
                googleMapsApiKey: process.env.EXPO_PUBLIC_GOOGLE_MAPS_API_KEY,
            },
        },

        android: {
            package: "cl.pipechela.infraestructura_electrica",
            adaptiveIcon: {
                backgroundColor: "#E6F4FE",
                foregroundImage: "./assets/images/android-icon-foreground.png",
                backgroundImage: "./assets/images/android-icon-background.png",
                monochromeImage: "./assets/images/android-icon-monochrome.png",
            },
            edgeToEdgeEnabled: true,
            predictiveBackGestureEnabled: false,
            config: {
                googleMaps: {
                    apiKey: process.env.EXPO_PUBLIC_GOOGLE_MAPS_API_KEY,
                },
            },
            permissions: [
                "location",
                "location-precise",
                "location-always",
                "location-while-in-use",
            ],
        },

        web: {
            output: "static",
            favicon: "./assets/images/favicon.png",
        },

        plugins: [
            "expo-router",
            [
                "expo-splash-screen",
                {
                    image: "./assets/images/splash-icon.png",
                    imageWidth: 200,
                    resizeMode: "contain",
                    backgroundColor: "#000000",
                    dark: {
                        backgroundColor: "#ffffff",
                    },
                },
            ],
            "expo-sqlite",
            [
                "expo-location",
                {
                    isAndroidBackgroundLocationEnabled: true,
                    isAndroidForegroundServiceEnabled: true,
                },
            ],
        ],

        experiments: {
            typedRoutes: true,
            reactCompiler: true,
        },

        extra: {
            eas: {
                projectId: "bb40b793-ed87-4779-a70b-a17018971cbc",
            },

            // variables que quieres usar dentro de JS
            apiUrl: process.env.EXPO_PUBLIC_API_URL,
        },
    },
});
