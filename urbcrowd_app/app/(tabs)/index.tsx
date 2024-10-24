import {
  FlatList,
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Modal,
  TextInput,
  Button,
} from "react-native";
import React, { useState } from "react";
// import { Picker } from "@react-native-picker/picker";
import ListItem from "@/components/Listagem";
interface Item {
  id: string;
  nome: string;
  endereco: string;
  tipo: string;
  status: string;
  nota: number;
}

// Exemplo de dados para preencher a lista
const data: Item[] = [
  {
    id: "1",
    nome: "Buraco na rua",
    endereco: "Rua A, 123",
    tipo: "asfalto",
    status: "Ativo",
    nota: 32,
  },
  {
    id: "2",
    nome: "Poste quebrado",
    endereco: "Rua B, 456",
    tipo: "Iluminação",
    status: "Inativo",
    nota: 12,
  },
  {
    id: "3",
    nome: "Arvore tombada",
    endereco: "Avenida C, 789",
    tipo: "Natural",
    status: "Ativo",
    nota: 44,
  },
  {
    id: "3",
    nome: "Arvore tombadadasdasdasdadasdasdasdasda",
    endereco: "Avenida C, 789",
    tipo: "Natural",
    status: "Ativo",
    nota: 22,
  },
  {
    id: "3",
    nome: "Arvore tombada",
    endereco: "Avenida C, 789",
    tipo: "Natural",
    status: "Ativo",
    nota: 13,
  },
  {
    id: "3",
    nome: "Arvore tombada",
    endereco: "Avenida C, 789",
    tipo: "Natural",
    status: "Ativo",
    nota: 20,
  },
  {
    id: "3",
    nome: "Arvore tombada",
    endereco: "Avenida C, 789",
    tipo: "Natural",
    status: "Ativo",
    nota: 5,
  },
  {
    id: "3",
    nome: "Arvore tombada",
    endereco: "Avenida C, 789",
    tipo: "Natural",
    status: "Ativo",
    nota: 5,
  },
  {
    id: "3",
    nome: "Arvore tombada",
    endereco: "Avenida C, 789",
    tipo: "Natural",
    status: "Ativo",
    nota: 2,
  },
];

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
  const [filteredData, setFilteredData] = useState<Item[]>(data);

  // Função para aplicar os filtros
  const applyFilters = () => {
    let filtered = data;

    if (selectedTipo) {
      filtered = filtered.filter((item) => item.tipo === selectedTipo);
    }
    if (selectedStatus) {
      filtered = filtered.filter((item) => item.status === selectedStatus);
    }
    if (enderecoFiltro) {
      filtered = filtered.filter((item) =>
        item.endereco.toLowerCase().includes(enderecoFiltro.toLowerCase())
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
    setFilteredData(data);
    setIsModalVisible(false); // Fechar o modal
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
        data={filteredData}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => <ListItem item={item} />} // Usando o ListItem aqui
        ListHeaderComponent={
          <Text style={styles.header}>Problemas relatados:</Text>
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
    backgroundColor: "#1a3d1a",
    marginTop: 40,
  },
  header: {
    fontSize: 24,
    fontWeight: "bold",
    textAlign: "left",
    color: "#FFF",
    marginVertical: 20,
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
    flexDirection: "row",
    alignItems: "center",
  },
  likesText: {
    marginLeft: 8,
    color: "black",
    fontSize: 18,
  },
});
