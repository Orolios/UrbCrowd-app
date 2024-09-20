import React from "react";
import { View, Text, StyleSheet } from "react-native";

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
    <View style={styles.itemContainer}>
      <View
        style={{
          flexDirection: "row",
          marginBottom: 10,
          width: "100%",
          flexWrap: "nowrap",
          backgroundColor: "blue",
        }}
      >
        <View
          style={{
            flexWrap: "wrap",
            width: "10%",
            height: "100%",
            justifyContent: "center",
            marginRight: "2%",
            backgroundColor: "red",
          }}
        >
          {/* <View
            style={{
              width: 100,
              height: 100,

              backgroundColor: "purple",
            }}
          >
          
          </View> */}
        </View>
        <View
          style={{
            flexWrap: "wrap",
            width: "60%",
            height: "100%",
            justifyContent: "center",
            marginRight: "2%",
            backgroundColor: "purple",
          }}
        >
          <Text style={styles.title}>{item.nome}</Text>
          <Text style={styles.subtitle}>{item.endereco}</Text>
          <Text>Tipo: {item.tipo}</Text>
        </View>
      </View>
      <View
        style={{
          justifyContent: "space-around",
          flexWrap: "wrap",
          width: "53%",
          marginRight: "2%",
        }}
      ></View>
    </View>
  );
};

// Estilos do componente
const styles = StyleSheet.create({
  itemContainer: {
    backgroundColor: "orange",
    padding: 15,
    marginBottom: 10,
    borderRadius: 8,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 1,
    width: "90%",
  },
  title: {
    fontSize: 14,
    fontWeight: "bold",
  },
  subtitle: {
    fontSize: 12,
    color: "#666",
  },
});

export default ListItem;
