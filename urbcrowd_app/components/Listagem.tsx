import React from "react";
import { View, Text, StyleSheet } from "react-native";

import { FontAwesome, MaterialIcons, Ionicons } from "@expo/vector-icons";
import AntDesign from "@expo/vector-icons/AntDesign";

// Definindo a interface dos dados
interface Item {
  id: string;
  nome: string;
  endereco: string;
  tipo: string;
  status: string;
  nota: number;
}

// Definindo as props que o componente ListItem irá receber
interface ListItemProps {
  item: Item;
}

// Componente ListItem
const ListItem: React.FC<ListItemProps> = ({ item }) => {
  return (
    <View style={styles.container}>
      <View style={styles.problemContainer}>
        <View style={styles.problemItem}>
          <View style={styles.Iconbox}>
            {item.status === "Ativo" ? (
              <FontAwesome name="clock-o" size={40} color="red" />
            ) : (
              <FontAwesome name="check-circle" size={40} color="blue" />
            )}
          </View>
          <View style={styles.problemDetails}>
            <Text numberOfLines={1} style={styles.problemTitle}>
              {item.nome}
            </Text>
            <Text numberOfLines={1} style={styles.problemSubtitle}>
              {item.endereco}
            </Text>
            <Text numberOfLines={1} style={styles.problemSubtitle}>
              {item.tipo}
            </Text>
          </View>

          <View style={styles.likesContainer}>
            <AntDesign name="like2" size={30} color="black" />
            <Text numberOfLines={1} style={styles.problemSubtitle}>
              {item.nota}
            </Text>
          </View>
          <View style={styles.imageContainer}></View>
        </View>
      </View>
    </View>
  );
};

// Estilos do componente
const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 1,
  },
  header: {
    backgroundColor: "#2e4d2e",
    padding: 8,
    borderTopLeftRadius: 8,
    borderTopRightRadius: 8,
  },
  headerText: {
    color: "white",
    fontWeight: "bold",
    fontSize: 18,
  },
  problemContainer: {
    height: 100,
    width: "95%",
    backgroundColor: "#f5f5dc",
    padding: 12,
    marginTop: 5,
    borderRadius: 8,
  },
  problemItem: {
    flexDirection: "row",
    alignItems: "center",
    borderBottomWidth: 1,
    borderBottomColor: "#ccc",
    paddingVertical: 5,
  },
  Iconbox: {
    // backgroundColor: "#6666",
    marginLeft: 2,
    flexDirection: "column",
    alignItems: "center",
    width: 50,
    height: 70,
    justifyContent: "center",
    borderBottomColor: "#ccc",
  },
  problemDetails: {
    // backgroundColor: "#fff",

    width: "40%",
    height: 70,
    marginLeft: 10,
  },
  problemTitle: {
    fontWeight: "bold",
    fontSize: 16,
  },
  problemSubtitle: {
    color: "#666",
    fontSize: 14,
  },
  likesContainer: {
    // backgroundColor: "#6666",
    marginLeft: 2,
    flexDirection: "column",
    alignItems: "center",
    width: 50,
    height: 70,
    justifyContent: "center",
    borderBottomColor: "#ccc",
  },
  imageContainer: {
    backgroundColor: "red",
    marginLeft: 10,
    flexDirection: "column",
    alignItems: "center",
    width: 70,
    height: 70,
    justifyContent: "center",
    borderBottomColor: "#ccc",
  },
  likesText: {
    marginLeft: 8,
    color: "black",
    fontSize: 18,
  },
});

export default ListItem;
