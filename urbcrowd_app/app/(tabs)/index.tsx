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
import React, { useEffect, useState } from "react";
import { useRouter } from 'expo-router';
import { FontAwesome } from "@expo/vector-icons";
import { Colors } from '@/constants/Colors';
import * as SecureStore from 'expo-secure-store';
import AntDesign from "@expo/vector-icons/AntDesign";
import ListItem from "@/components/Listagem";
import { Item, getAddressString, translateComplaintType} from "@/components/complaint-helper"

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

// Exemplo de dados para preencher a lista

const renderItem = ({ item }: { item: Item }) => (
  // <View style={styles.itemContainer}>
  //   <Text style={styles.title}>{item.nome}</Text>
  //   <Text style={styles.subtitle}>Endereço: {item.endereco}</Text>
  //   <Text>Tipo: {item.tipo}</Text>
  //   <Text>Status: {item.status}</Text>
  //   <Text>Nota: {item.nota}</Text>
  // </View>
  <View style={styles.problemItem}>
    <View style={styles.problemDetails}>
      <Text style={styles.problemTitle}>Buraco na rua</Text>
      <Text style={styles.problemSubtitle}>Rua Shigeo Mori, XXXX</Text>
      <Text style={styles.problemSubtitle}>Tipo: Asfalto </Text>
    </View>
    <View style={styles.likesContainer}>
      <Text style={styles.likesText}>20</Text>
    </View>
  </View>
);

export default function HomeScreen() {
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [selectedTipo, setSelectedTipo] = useState<string | null>(null);
  const [selectedStatus, setSelectedStatus] = useState<string | null>(null);
  const [enderecoFiltro, setEnderecoFiltro] = useState<string>("");
  const [initalData, setInitialData] = useState<Item[]>();
  const [filteredData, setFilteredData] = useState<Item[]>();

  const [isDetailModalVisible, setIsDetailModalVisible] = useState(false);
  const [selectedItem, setSelectedItem] = useState<Item | null>(null);

  const router = useRouter();
  // Function to handle item click
  const handleItemClick = (item: Item) => {
    setSelectedItem(item);
    setIsDetailModalVisible(true);
  };

  useEffect(() => {
    const getBearer = async() => {
      let bearer = await SecureStore.getItemAsync('secure_token')

      const hostUri = 'http://urbcrowd-dev.sa-east-1.elasticbeanstalk.com';
      
      fetch(hostUri + '/complaints', {
        method: 'GET',
        headers: {Authorization: 'Bearer ' + bearer}
    }).then(response => response.json())
    .then((data) => {
      const complaintList: Item[] = data.map((complaint: any) => {
        return {  id: complaint.id,
          nome: complaint.title,
          descricao: complaint.description,
          endereco: complaint.address,
          tipo: complaint.type,
          status: complaint.status,
          nota: complaint.thumbsUpCount,
          imagem: complaint.imageHref,
          data: complaint.createdDate,
          curtido:  complaint.userHasThumbsUp }
      })
  
      return complaintList;
    })
    .then(list => setInitialData(list))
    .catch(error => {Alert.alert("Erro", "Não foi possível obter os problemas relatados no momento.")})
      };

    getBearer();
  }, [])


  // Function to close the modal
  const closeDetailModal = () => {
    setSelectedItem(null);
    setIsDetailModalVisible(false);
  };

  // Função para aplicar os filtros
  const applyFilters = () => {
    let filtered = initalData!;

    if (selectedTipo) {
      filtered = filtered.filter((item) => item.tipo === selectedTipo);
    }
    if (selectedStatus) {
      filtered = filtered.filter((item) => item.status === selectedStatus);
    }
    if (enderecoFiltro) {
      filtered = filtered.filter((item) =>
        getAddressString(item.endereco).toLowerCase().includes(enderecoFiltro.toLowerCase())
      );
    }

    setFilteredData(filtered);
    setIsModalVisible(false); // Fechar o modal após aplicar os filtros
  };

  // Função para limpar os filtros
  const clearFilters = () => {
    setSelectedTipo(null);
    setSelectedStatus(null);
    setEnderecoFiltro("");
    setFilteredData(initalData);
    setIsModalVisible(false); // Fechar o modal
  };

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
        onPress={() => setIsModalVisible(true)}
      >
        <Text style={styles.buttonText}>Abrir Filtro</Text>
      </TouchableOpacity>

      {/* Modal para o filtro */}
      <Modal visible={isModalVisible} transparent={true} animationType="slide">
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Filtros</Text>

            {/* Filtro por Tipo */}
            <Text style={styles.label}>Tipo</Text>
            {/* <Picker
              selectedValue={selectedTipo}
              onValueChange={(value) => setSelectedTipo(value)}
            >
              <Picker.Item label="Todos" value={null} />
              <Picker.Item label="Cliente" value="Cliente" />
              <Picker.Item label="Fornecedor" value="Fornecedor" />
            </Picker> */}

            {/* Filtro por Status */}
            <Text style={styles.label}>Status</Text>

            {/* Filtro por Endereço */}
            <Text style={styles.label}>Endereço</Text>
            <TextInput
              style={styles.input}
              placeholder="Digite o endereço"
              value={enderecoFiltro}
              onChangeText={(text) => setEnderecoFiltro(text)}
            />

            {/* Botões de Aplicar e Limpar */}
            <View style={styles.modalButtons}>
              <Button title="Aplicar Filtros" onPress={applyFilters} />
              <Button
                title="Limpar Filtros"
                color="red"
                onPress={clearFilters}
              />
            </View>
          </View>
        </View>
      </Modal>

      {/* Lista Filtrada */}
      <FlatList
        data={filteredData ? filteredData : initalData}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <TouchableOpacity onPress={() => handleItemClick(item)}>
            <ListItem item={item} thumbsUp={thumbsUp} />
          </TouchableOpacity>
        )} // Usando o ListItem aqui
        ListHeaderComponent={
          <Text style={styles.header}>Problemas relatados</Text>
        }
      />

      <TouchableOpacity style={styles.reportButton} onPress={() => router.push("/Relatar")}>
        <FontAwesome name="plus" size={44} color={Colors.text} />
      </TouchableOpacity>

      {/* Detail Modal */}
      <DetailModal
        item={selectedItem}
        visible={isDetailModalVisible}
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
    marginVertical: 20,
    paddingLeft: 12
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
    backgroundColor: "#6200ee",
    padding: 15,
    borderRadius: 8,
    alignItems: "center",
    marginBottom: 20,
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
  // Link to view map
  mapLink: {
    fontSize: 14,
    color: "#FFF",
    fontWeight: "bold",
    marginTop: 5,
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
    backgroundColor: Colors.primary,
    borderRadius: 50,
    height: 80,
    width: 80,
    justifyContent: "center",
    alignItems: "center",
    position: "absolute",
    bottom: 16,
    right: 16
  },
  buttonIcon: {
    textAlign: "center",
    fontSize: 64,
    color: Colors.text,
  }
});
