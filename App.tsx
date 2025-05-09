import React from "react";
import { SafeAreaView, StyleSheet, StatusBar } from "react-native";
import { CryptoProvider } from "./contexts/CryptoContext";
import MarketOverview from "./components/MarketOverview";

const App: React.FC = () => {
  return (
    <CryptoProvider>
      <SafeAreaView style={styles.container}>
        <StatusBar barStyle="dark-content" backgroundColor="#fff" />
        <MarketOverview />
      </SafeAreaView>
    </CryptoProvider>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f5f5",
  },
});

export default App;
