import React, { useState, useEffect, useContext } from "react";
import { StyleSheet, View, Text, TouchableOpacity } from "react-native";
import MapView, { LatLng, Marker, Region } from "react-native-maps";
import * as Location from "expo-location";
import { useRouter, useLocalSearchParams } from 'expo-router';
import { Colors } from "@/constants/Colors";
import { Item } from "@/components/complaint-helper";
import { ComplaintContext } from "@/contexts/complaints";

// Definindo os tipos das coordenadas
interface Coordinates {
  latitude: number,
  longitude: number,
  latitudeDelta: number,
  longitudeDelta: number,
}

interface LocationInfo {
  key: string,
  nome: string,
  location: Coordinates
}


const MapComponent: React.FC = () => {
  const router = useRouter();

  const [complaints, setComplaints] = useState<Item[] | null>(null);
  const [location, setLocation] = useState<Coordinates | null>(null); // Localização atual do usuário
  const [selectedLocation, setSelectedLocation] = useState<Coordinates | null>(
    null
  );
  const [coordinates, setCoordinates] = useState<LocationInfo[] | null>(null); // Localização selecionada pelo usuário
  const [errorMsg, setErrorMsg] = useState<string | null>(null); // Mensagem de erro

  const { initialComplaints } = useContext(ComplaintContext);

  // Obter a localização atual do usuário
  useEffect(() => {
    (async () => {
        let { status } = await Location.requestForegroundPermissionsAsync();
        if (status !== "granted") {
          setErrorMsg("Permissão para acessar localização foi negada");
          return;
        }
  
        let location = await Location.getCurrentPositionAsync({});
        const coordinates: Coordinates = {
          latitude: location.coords.latitude,
          longitude: location.coords.longitude,
          latitudeDelta: 0.01,
          longitudeDelta: 0.01,
        }

        setLocation(coordinates);
    })();
  }, []);

  useEffect(() => {
    setComplaints(initialComplaints);
  }, [initialComplaints])

  useEffect(() => {
      if (!!complaints) {
        setCoordinates(complaints!.map(({ id, nome, geolocation }) => (
          {key: id, nome: nome, location: {latitude: geolocation.latitude, longitude: geolocation.longitude, latitudeDelta: 0.01, longitudeDelta: 0.01}}
        )));
      }
  }, [complaints])

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

        {!!coordinates ? coordinates.map(marker => 
          <Marker key={marker.key}
                  coordinate={marker.location}
                  title={marker.nome}></Marker>
        ) : ""}

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
      </MapView>
      <TouchableOpacity style={styles.button} onPress={() => router.push("/Relatar")}>
        <Text style={styles.plusSign}>+</Text>
      </TouchableOpacity>
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
    width: 80,
    height: 80,
    borderRadius: 50, // Raio de 50 para um círculo perfeito
    backgroundColor: Colors.primary, // Cor laranja
    justifyContent: "center",
    alignItems: "center",
    position: "absolute",
    bottom: 16,
    right: 16
  },

  plusSign: {
    fontSize: 40,
    color: Colors.text, // Cor branca para o sinal de mais
  },
});

export default MapComponent;
