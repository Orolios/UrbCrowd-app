// import {
//   DarkTheme,
//   DefaultTheme,
//   ThemeProvider,
// } from "@react-navigation/native";
// import { useFonts } from "expo-font";
// import { Stack } from "expo-router";
// import * as SplashScreen from "expo-splash-screen";
// import { useEffect } from "react";
// import "react-native-reanimated";

// import { useColorScheme } from "@/hooks/useColorScheme";
// import { Colors } from "@/constants/Colors";

// // Prevent the splash screen from auto-hiding before asset loading is complete.
// SplashScreen.preventAutoHideAsync();

// export default function RootLayout() {
//   const colorScheme = useColorScheme();
//   const [loaded] = useFonts({
//     SpaceMono: require("../assets/fonts/SpaceMono-Regular.ttf"),
//   });

//   useEffect(() => {
//     if (loaded) {
//       SplashScreen.hideAsync();
//     }
//   }, [loaded]);

//   if (!loaded) {
//     return null;
//   }

//   return (
//     <ThemeProvider value={colorScheme === "dark" ? DarkTheme : DefaultTheme}>
//       <Stack>
//         <Stack.Screen name="index" options={{ headerShown: false }} />
//         <Stack.Screen
//           name="NovaConta"
//           options={{
//             headerTitle: "Voltar para o login",
//             headerStyle: {
//               backgroundColor: Colors.background,
//             },
//             headerTitleStyle: {
//               color: Colors.text,
//             },
//             headerShadowVisible: false,
//           }}
//         />
//         <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
//         <Stack.Screen name="+not-found" />
//       </Stack>
//     </ThemeProvider>
//   );
// }
import {
  DarkTheme,
  DefaultTheme,
  ThemeProvider,
} from "@react-navigation/native";
import { useFonts } from "expo-font";
import { Stack } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import { useEffect } from "react";
import "react-native-reanimated";

import index from "./index";

import { useColorScheme } from "@/hooks/useColorScheme";
import { Colors } from "@/constants/Colors";

// Prevenir a splash screen de ocultar automaticamente antes de carregar os assets
SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const colorScheme = useColorScheme(); // Hook personalizado para capturar o esquema de cores
  const [loaded] = useFonts({
    SpaceMono: require("../assets/fonts/SpaceMono-Regular.ttf"),
  });

  // Efeito para ocultar a splash screen quando as fontes forem carregadas
  useEffect(() => {
    if (loaded) {
      SplashScreen.hideAsync();
    }
  }, [loaded]);

  // Se as fontes não forem carregadas, não renderize nada
  if (!loaded) {
    return null;
  }

  return (
    // Tema baseado no esquema de cores (dark ou light)
    <ThemeProvider value={colorScheme === "dark" ? DarkTheme : DefaultTheme}>
      {/* Definição do Stack Navigator */}
      <Stack>
        {/* Tela inicial (index), sem header */}
        <Stack.Screen name="index" options={{ headerShown: false }} />

        {/* Tela de criação de nova conta */}
        <Stack.Screen
          name="NovaConta"
          options={{
            headerTitle: "Voltar para o login",
            headerStyle: {
              backgroundColor: Colors.background,
            },
            headerTitleStyle: {
              color: Colors.text,
            },
            headerShadowVisible: false,
          }}
        />

        {/* Tela de abas (tabs), sem header */}
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />

        {/* Tela de página não encontrada */}
        <Stack.Screen name="+not-found" />
      </Stack>
    </ThemeProvider>
  );
}
