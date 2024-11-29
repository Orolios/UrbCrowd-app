import {
  FlatList,
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Modal,
  TextInput,
  Button,
  Image,
  Alert,
} from "react-native";
import React, { useEffect, useState, useContext } from "react";
import { useRouter, Link } from 'expo-router';
import { FontAwesome } from "@expo/vector-icons";
import { Colors } from '@/constants/Colors';
import * as SecureStore from 'expo-secure-store';
import AntDesign from "@expo/vector-icons/AntDesign";
import ListItem from "@/components/Listagem";
import FiltersModal from "@/components/FiltersModal";
import { Item, getAddressString, translateComplaintType} from "@/components/complaint-helper"
import { ComplaintContext } from "@/contexts/complaints";

const DetailModal = ({ item, visible, onClose }: { item: Item | null, visible: boolean, onClose: () => void }) => {

  const renderTypeIcon = (tipo: string) => {
    switch (tipo) {
      case ("TRASH"):
        return <Image style={styles.typeIcon} source={require("@/assets/images/trash-bin.png")}></Image>;
      case ("LIGHTING"):
        return <Image style={styles.typeIcon} source={require("@/assets/images/broken-lamp.png")}></Image>;
      case ("SEWAGE"):
        return <Image style={styles.typeIcon} source={require("@/assets/images/sewage.png")}></Image>;
      case ("ASPHALT"):
        return <Image style={styles.typeIcon} source={require("@/assets/images/broken-road.png")}></Image>;
      case ("SIDEWALK"):
        return <Image style={styles.typeIcon} source={require("@/assets/images/sidewalk.png")}></Image>;
      case ("WEEDING"):
        return <Image style={styles.typeIcon} source={require("@/assets/images/weeding.png")}></Image>;
      default:
        return <Image style={styles.typeIcon} source={require("@/assets/images/other.png")}></Image>;
    }
  };

  const renderStatus = (status: string) => {
    if (status === "OPEN") {
      return (<View style={{flexDirection: "row", alignItems: "center", marginBottom: 4}}>
              <Text style={{marginRight: 4}}>Status: Em aberto</Text>
              <FontAwesome name="clock-o" size={24} color="red" />
      </View>)
    } else {
      return (
        <View style={{flexDirection: "row", alignItems: "center", marginBottom: 4}}>
              <Text style={{marginRight: 4}}>Status: Resolvido</Text>
              <FontAwesome name="check-circle" size={24} color="blue" />
        </View>)
    }
  }

  const router = useRouter();

  return (
    <Modal visible={visible} transparent={true} animationType="slide">
      <View style={styles.detailmodalContainer}>
        <View style={styles.detailmodalContent}>
          {/* Header Section */}
          <View style={styles.headerSection}>
            <TouchableOpacity onPress={onClose}>
              <AntDesign name="arrowleft" size={36} color={Colors.blackText} />
            </TouchableOpacity>
            <View style={{flexDirection: "column", alignItems: "center"}}>
              <Text style={styles.detailtitle}>{item?.nome}</Text>
              <Text style={styles.status}>Relatado em: {new Date(item?.data!).toLocaleDateString()}</Text>
            </View>
            <View style={styles.likesContainer}>
              <AntDesign name="like2" size={30} color="black" />
              <Text numberOfLines={1} style={styles.problemSubtitle}>
                {item?.nota}
              </Text>
            </View>
          </View>

          <Text style={styles.sectionTitle}>Detalhes</Text>

          {/* Details Section */}
          <View style={styles.section}>
            {renderStatus(item?.status!)}
            {/* <Text style={styles.sectionText}>{item?.descricao}</Text> */}
            <View style={{flexDirection: "row", alignItems: "center"}}>
              <Text style={styles.detailLabel}>Tipo: {translateComplaintType(item?.tipo!)}</Text>
              {renderTypeIcon(item?.tipo!)}
            </View>
          </View>

          <Text style={styles.sectionTitle}>Descrição</Text>

          <View style={styles.section}>
            {/* <Text style={styles.sectionText}>{item?.descricao}</Text> */}
            <Text style={styles.detailLabel}>{item?.descricao}</Text>
          </View>

          {/* Location Section */}
          <Text style={styles.sectionTitle}>Localização</Text>
          <View style={styles.section}>
            <Text style={styles.detailLabel}>Logradouro: {item?.endereco.addressLine}</Text>
            <Text style={styles.detailLabel}>Cidade: {item?.endereco.city + " - " + item?.endereco.federalState}</Text>
          </View>

        {/* Photos Section */}
        {item?.imagem ? (<View>
          <Text style={styles.sectionTitle}>Fotos</Text>
          <View style={styles.photoSection}>
            <View style={styles.photoContainer}>
                <Image
                  source={{ uri: item?.imagem! }}
                  style={styles.photo}
                />
            </View>
          </View> 
        </View>) : (<Text style={styles.sectionTitle}>Não há fotos anexadas a esse problema.</Text>)}
        </View>
      </View>
    </Modal>
  );
};

export default function HomeScreen() {
  const [initalData, setInitialData] = useState<Item[]>();
  const [filteredData, setFilteredData] = useState<Item[]>();

  const [isDetailsModalVisible, setisDetailsModalVisible] = useState<boolean>(false);
  const [selectedItem, setSelectedItem] = useState<Item | null>(null);
  const [isFilterModalVisible, setIsFilterModalVisible] = useState<boolean>(false);

  const router = useRouter();
  // Function to handle item click
  const handleItemClick = (item: Item) => {
    setSelectedItem(item);
    setisDetailsModalVisible(true);
  };

  const { initialComplaints } = useContext(ComplaintContext);

  useEffect(() => {
    setInitialData(initialComplaints)
  })

  // Function to close the modal
  const closeDetailModal = () => {
    setSelectedItem(null);
    setisDetailsModalVisible(false);
  };

  // Função para aplicar os filtros
  const applyFilters = (filtered: Item[]) => {
    setFilteredData(filtered);
    setIsFilterModalVisible(false); // Fechar o modal após aplicar os filtros
  };

  // Função para limpar os filtros
  const clearFilters = () => {
    setFilteredData(initalData);
    setIsFilterModalVisible(false);
  };

  const closeFilterModal = () => setIsFilterModalVisible(false);

  const thumbsUp = async(id: string, item: Item) => {
    let bearer = await SecureStore.getItemAsync('secure_token');

    const hostUri = 'http://urbcrowd-dev.sa-east-1.elasticbeanstalk.com';

    fetch(hostUri + '/complaints/' + id, {
      method: "PATCH",
      headers: {Authorization: 'Bearer ' + bearer}
    }).then((response) => {
      const initialDataCopy = [...initalData!];

      const index = initialDataCopy.map(item => item.id).indexOf(id);

      initialDataCopy[index].curtido = !item.curtido;
      initialDataCopy[index].nota = item.curtido ? ++item.nota : --item.nota;

      setInitialData(initialDataCopy)
    })
    .catch(error => Alert.alert("Erro", "Tente novamente mais tarde."))
  };

  return (
    <View style={styles.container}>
      {/* Botão para abrir o modal */}
      <TouchableOpacity
        style={styles.filterButton}
        onPress={() => setIsFilterModalVisible(true)}
      >
        <Text style={styles.buttonText}>Abrir Filtros</Text>
      </TouchableOpacity>

      <FiltersModal initialData={initalData!} visible={isFilterModalVisible} closeModal={closeFilterModal} apply={applyFilters} clear={clearFilters}></FiltersModal>
      <Text style={styles.header}>Problemas relatados</Text>
      {/* Lista Filtrada */}
      <FlatList
        data={filteredData ? filteredData : initalData}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <TouchableOpacity onPress={() => handleItemClick(item)}>
            <ListItem item={item} thumbsUp={thumbsUp} />
          </TouchableOpacity>
        )} // Usando o ListItem aqui

      />

      <TouchableOpacity style={styles.reportButton} onPress={() => router.push("/Relatar")}>
        <Text style={styles.buttonIcon}>+</Text>
      </TouchableOpacity>

      {/* Detail Modal */}
      <DetailModal
        item={selectedItem}
        visible={isDetailsModalVisible}
        onClose={closeDetailModal}
      />

    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
    marginTop: 40,
  },
  header: {
    fontSize: 24,
    fontWeight: "bold",
    textAlign: "left",
    color: "#FFF",
    marginTop: 12,
    marginBottom: 14,
    paddingLeft: 16
  },
  itemContainer: {
    backgroundColor: "#fff",
    padding: 15,
    marginBottom: 10,
    borderRadius: 8,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 3,
  },
  title: {
    fontSize: 16,
    fontWeight: "bold",
  },
  subtitle: {
    fontSize: 14,
    color: "#666",
    marginVertical: 5,
  },
  filterButton: {
    backgroundColor: Colors.primary,
    padding: 15,
    alignItems: "center",
    marginBottom: 12,
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  modalContent: {
    backgroundColor: "#fff",
    padding: 20,
    borderRadius: 8,
    width: "80%",
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 10,
  },
  label: {
    fontSize: 16,
    marginBottom: 5,
  },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    padding: 10,
    marginBottom: 15,
  },
  modalButtons: {
    marginTop: 20,
  },
  headerText: {
    color: "white",
    fontWeight: "bold",
    fontSize: 18,
  },
  problemContainer: {
    backgroundColor: "#f5f5dc",
    padding: 16,
    marginTop: 16,
    borderRadius: 8,
  },
  problemItem: {
    flexDirection: "row",
    alignItems: "center",
    borderBottomWidth: 1,
    borderBottomColor: "#ccc",
    paddingVertical: 8,
  },
  problemDetails: {
    flex: 1,
    marginLeft: 16,
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
  },
  likesText: {
    marginLeft: 8,
    color: "black",
    fontSize: 18,
  },
  detailmodalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.7)", 
  },
  detailmodalContent: {
    backgroundColor: Colors.background,
    paddingBottom: 20,
    borderRadius: 4,
    marginHorizontal: 10, // Reduce horizontal margins to make it wider
    width: "90%", // Set the width to 90% of the screen
    height: "90%", // Set the height to 90% of the screen
    overflow: "scroll", // Allow the content to scroll if it's too large
  },
  typeIcon: {
    height: 24,
    width: 24
  },
  headerSection: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: Colors.text,
    padding: 10,
  },
  backButton: {
    alignSelf: "center",
    fontSize: 36,
    color: Colors.blackText,
  },
  detailtitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: Colors.blackText,
  },
  statusContainer: {
    alignItems: "center",
  },
  likes: {
    fontSize: 16,
    color: Colors.blackText,
  },
  status: {
    color: Colors.blackText,
    fontSize: 14,
  },
  section: {
    padding: 10,
    backgroundColor: Colors.text, 
  },
  photoSection: {
    padding: 10
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: Colors.text,
    marginBottom: 8,
    marginTop: 16,
    marginLeft: 8
  },
  sectionText: {
    fontSize: 14,
    color: "#e0e0e0",
  },
  detailLabel: {
    fontSize: 14,
    color: Colors.blackText,
  },
  viewMap: {
    justifyContent: "center",
    alignItems: "center",
    width: "30%"
  },
  // Photo container: display images in a row
  photoContainer: {
    flexDirection: "row",
    flexWrap: "wrap", // Allow images to wrap to the next line
  },
  photo: {
    width: 90,
    height: 90,
    marginRight: 5,
    backgroundColor: "#d0d0d0",
    borderRadius: 5,
  },
  reportButton: {
    width: 80,
    height: 80,
    borderRadius: 50,
    backgroundColor: Colors.primary,
    justifyContent: "center",
    alignItems: "center",
    position: "absolute",
    bottom: 16,
    right: 16
  },
  buttonIcon: {
    textAlign: "center",
    fontSize: 40,
    color: Colors.text,
  }
});
