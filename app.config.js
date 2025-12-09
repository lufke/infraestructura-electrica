export default ({ config }) => {
    const profile = process.env.EAS_BUILD_PROFILE || "preview";

    const variants = {
        dev: {
            name: "Infraestructura Eléctrica (Dev)",
            slug: "infraestructura-electrica-dev",
            package: "cl.pipechela.infraestructura_electrica.dev",
        },
        preview: {
            name: "Infraestructura Eléctrica (Preview)",
            slug: "infraestructura-electrica-preview",
            package: "cl.pipechela.infraestructura_electrica.preview",
        },
        production: {
            name: "Infraestructura Eléctrica",
            slug: "infraestructura-electrica",
            package: "cl.pipechela.infraestructura_electrica",
        },
    };

    const v = variants[profile] ?? variants.preview;

    return {
        expo: {
            ...config.expo,

            name: v.name,
            slug: 'infraestructura-electrica',

            icon: "./assets/images/icon.png",

            scheme: "infraestructuraelectrica",
            version: "1.0.0",
            orientation: "portrait",
            userInterfaceStyle: "automatic",
            newArchEnabled: true,

            /* ===== iOS ===== */
            ios: {
                bundleIdentifier: v.package,
                supportsTablet: true,
                config: {
                    // ❗CORREGIDO
                    googleMapsApiKey: process.env.GOOGLE_MAPS_API_KEY,
                },
            },

            /* ===== ANDROID ===== */
            android: {
                package: v.package,
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
                        // ❗CORREGIDO
                        apiKey: process.env.GOOGLE_MAPS_API_KEY,
                    },
                },
                permissions: [
                    "ACCESS_FINE_LOCATION",
                    "ACCESS_COARSE_LOCATION"
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

            extra: {
                eas: {
                    projectId: "bb40b793-ed87-4779-a70b-a17018971cbc",
                },
                apiUrl: process.env.EXPO_PUBLIC_API_URL,
                buildProfile: profile,
                googleMapsApiKey: process.env.GOOGLE_MAPS_API_KEY,
            },

            experiments: {
                typedRoutes: true,
                reactCompiler: true,
            },
        },
    };
};
