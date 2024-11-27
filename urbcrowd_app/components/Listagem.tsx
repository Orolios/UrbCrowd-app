import React from "react";
import { View, Text, StyleSheet, Image, Alert, TouchableOpacity } from "react-native";
import { Colors } from '@/constants/Colors';
import { FontAwesome } from "@expo/vector-icons";
import AntDesign from "@expo/vector-icons/AntDesign";
import * as SecureStore from 'expo-secure-store';
import { Item, getAddressString, translateComplaintType} from "./complaint-helper";

// Definindo as props que o componente ListItem irá receber
interface ListItemProps {
  item: Item;
  thumbsUp(id: string, item: Item): any;
}

// Componente ListItem
const ListItem: React.FC<ListItemProps> = ({ item, thumbsUp }) => {

  const renderTypeIcon = () => {
    switch (item.tipo) {
      case ("TRASH"):
        return <Image style={styles.typeIcon} source={require("../assets/images/trash-bin.png")}></Image>;
      case ("LIGHTING"):
        return <Image style={styles.typeIcon} source={require("../assets/images/broken-lamp.png")}></Image>;
      case ("SEWAGE"):
        return <Image style={styles.typeIcon} source={require("../assets/images/sewage.png")}></Image>;
      case ("ASPHALT"):
        return <Image style={styles.typeIcon} source={require("../assets/images/broken-road.png")}></Image>;
      case ("SIDEWALK"):
        return <Image style={styles.typeIcon} source={require("../assets/images/sidewalk.png")}></Image>;
      case ("WEEDING"):
        return <Image style={styles.typeIcon} source={require("../assets/images/weeding.png")}></Image>;
      default:
        return <Image style={styles.typeIcon} source={require("../assets/images/other.png")}></Image>;
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.problemContainer}>
        <View style={styles.problemItem}>
          <View style={styles.Iconbox}>
            {item.status === "OPEN" ? (
              <View style={styles.Iconbox}>
                <FontAwesome name="clock-o" size={40} color="red" />
                <Text>Aberto</Text>
              </View>
            ) : (
              <View style={styles.Iconbox}>
                <FontAwesome name="check-circle" size={40} color="blue" />
                <Text>Resolvido</Text>
              </View>
            )}
          </View>
          <View style={styles.problemDetails}>
            <Text numberOfLines={1} style={styles.problemTitle}>
              {item.nome}
            </Text>
            <Text numberOfLines={1} style={styles.problemSubtitle}>
              {getAddressString(item.endereco)}
            </Text>
            <Text numberOfLines={1} style={styles.problemSubtitle}>
              Tipo: {translateComplaintType(item.tipo)}
              {renderTypeIcon()}
            </Text>
          </View>

          <TouchableOpacity style={styles.likesContainer} onPress={() => thumbsUp(item.id, item)}>
            <AntDesign name={item.curtido ? "like1" : "like2"} size={30} color="black" />
            <Text numberOfLines={1} style={styles.problemSubtitle}>
              {item.nota}
            </Text>
          </TouchableOpacity>
        </View>
        <View style={styles.imageContainer}>
          <Image style={styles.image} source={item.imagem ? {uri: item.imagem} : require("../assets/images/no-photos.png")}></Image>
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
    width: "100%",
    backgroundColor: Colors.text,
    paddingLeft: 12,
    marginTop: 8,
    borderRadius: 0,
    flexDirection: "row"
  },
  problemItem: {
    paddingTop: 12,
    flexDirection: "row",
    width: "75%",
  },
  Iconbox: {
    marginLeft: 2,
    flexDirection: "column",
    alignItems: "center",
    width: 70,
    height: 70,
    justifyContent: "center",
    alignContent: "center"
  },
  problemDetails: {
    height: 70,
    marginLeft: 12,
    width: '60%'
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
    flexDirection: "column",
    alignItems: "center",
    width: 50,
    height: 70,
    justifyContent: "center",
  },
  imageContainer: {
    backgroundColor: Colors.blackText,
    marginLeft: 12,
    flexDirection: "column",
    alignItems: "center",

    justifyContent: "center"
  },
  image: {
    alignSelf: "center",
    flex: 1,
    width: 100,
    height: 100,
    color: Colors.blackText
  },
  likesText: {
    marginLeft: 8,
    color: "black",
    fontSize: 18,
  },
  typeIcon: {
    width: 24,
    height: 24
  }
});

export default ListItem;
