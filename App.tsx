import "react-native-gesture-handler";
import { StatusBar } from "expo-status-bar";
import React from "react";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { Provider } from "react-redux";
import store from "./store/store";
import useCachedResources from "./hooks/useCachedResources";
import useColorScheme from "./hooks/useColorScheme";
import Navigation from "./navigation";
import { ThemeProvider } from "react-native-elements";
import { RootSiblingParent } from "react-native-root-siblings";

export default function App() {
  const isLoadingComplete = useCachedResources();

  const colorScheme = useColorScheme();

  if (!isLoadingComplete) {
    return null;
  } else {
    return (
      <Provider store={store}>
        <ThemeProvider>
          <RootSiblingParent>
            <SafeAreaProvider>
              <Navigation colorScheme={colorScheme} />
              <StatusBar />
            </SafeAreaProvider>
          </RootSiblingParent>
        </ThemeProvider>
      </Provider>
    );
  }
}
