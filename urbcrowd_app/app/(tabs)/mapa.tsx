import React, { useState, useEffect } from "react";
import { StyleSheet, View, Text, TouchableOpacity } from "react-native";
import MapView, { Marker, Region } from "react-native-maps";
import * as Location from "expo-location";

// Definindo os tipos das coordenadas
interface Coordinates {
  latitude: number;
  longitude: number;
  latitudeDelta: number;
  longitudeDelta: number;
}

const MapComponent: React.FC = () => {
  const [location, setLocation] = useState<Coordinates | null>(null); // Localização atual do usuário
  const [selectedLocation, setSelectedLocation] = useState<Coordinates | null>(
    null
  ); // Localização selecionada pelo usuário
  const [errorMsg, setErrorMsg] = useState<string | null>(null); // Mensagem de erro

  // Obter a localização atual do usuário
  useEffect(() => {
    (async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") {
        setErrorMsg("Permissão para acessar localização foi negada");
        return;
      }

      let location = await Location.getCurrentPositionAsync({});
      setLocation({
        latitude: location.coords.latitude,
        longitude: location.coords.longitude,
        latitudeDelta: 0.01,
        longitudeDelta: 0.01,
      });
    })();
  }, []);

  // Manipula o clique do usuário no mapa
  //   const handleMapPress = (event: MapEvent): void => {
  //     const { latitude, longitude } = event.nativeEvent.coordinate;
  //     setSelectedLocation({
  //       latitude,
  //       longitude,
  //       latitudeDelta: 0.01,
  //       longitudeDelta: 0.01,
  //     });
  //   };

  if (!location) {
    return (
      <View style={styles.loading}>
        <Text>Carregando localização...</Text>
        {errorMsg ? <Text>{errorMsg}</Text> : null}
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <MapView
        style={styles.map}
        initialRegion={location as Region} // Tipagem do `Region` para MapView
        // onPress={handleMapPress}
      >
        {/* Marcador da localização atual */}
        <Marker
          coordinate={{
            latitude: location.latitude,
            longitude: location.longitude,
          }}
          title="Você está aqui"
        />

        {/* Marcador da localização selecionada */}
        {selectedLocation && (
          <Marker
            coordinate={{
              latitude: selectedLocation.latitude,
              longitude: selectedLocation.longitude,
            }}
            title="Localização Selecionada"
          />
        )}
        <View>
          <TouchableOpacity style={styles.button}>
            <Text style={styles.plusSign}>+</Text>
          </TouchableOpacity>
        </View>
      </MapView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  map: {
    ...StyleSheet.absoluteFillObject, // Faz o mapa ocupar todo o espaço do container
  },
  loading: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  buttonContainer: {
    position: "absolute", // Permite a sobreposição
    bottom: 20, // Distância do fundo
    left: 20, // Distância da esquerda
    right: 20, // Distância da direita
  },
  button: {
    width: 100,
    height: 100,
    borderRadius: 50, // Raio de 50 para um círculo perfeito
    backgroundColor: "#FFA07A", // Cor laranja
    justifyContent: "center",
    alignItems: "center",
  },

  plusSign: {
    fontSize: 40,
    color: "#FFFFFF", // Cor branca para o sinal de mais
  },
});

export default MapComponent;
