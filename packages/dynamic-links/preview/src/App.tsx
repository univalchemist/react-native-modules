import React from "react";
import { SafeAreaView, Text, StyleSheet } from "react-native";
import { useDynamicLinks } from "@ftdr/react-native-dynamic-links";
import { NavigationContainer, useNavigation } from "@react-navigation/native";
import {
  createNativeStackNavigator,
  NativeStackNavigationProp,
} from "@react-navigation/native-stack";

type RootStackParamList = {
  Home: undefined;
  DynamicLink: undefined;
};

const Stack = createNativeStackNavigator<RootStackParamList>();

const HomeScreen = () => {
  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.title}>Welcome</Text>
    </SafeAreaView>
  );
};

const DynamicLinkScreen = () => {
  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.title}>Dynamic Link</Text>
    </SafeAreaView>
  );
};

type NavigationProp = NativeStackNavigationProp<RootStackParamList>;

const Navigation = () => {
  const { navigate } = useNavigation<NavigationProp>();

  useDynamicLinks({
    onLink: (link) => {
      console.log("onLink", link);

      if (link.url === 'https://ahs.com') {
        navigate("DynamicLink");
      }
    },
    onForegroundLink: (link) => console.log("onForegroundLink", link),
    onBackgroundLink: (link) => console.log("onBackgroundLink", link),
  });

  return (
    <Stack.Navigator>
      <Stack.Screen name="Home" component={HomeScreen} />
      <Stack.Screen name="DynamicLink" component={DynamicLinkScreen} />
    </Stack.Navigator>
  );
};

const App = () => {
  return (
    <NavigationContainer>
      <Navigation />
    </NavigationContainer>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  title: {
    fontSize: 40,
    fontWeight: "700",
    color: '#000',
  },
});

export default App;
