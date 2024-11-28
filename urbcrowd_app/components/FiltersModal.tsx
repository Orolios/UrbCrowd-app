import React, { useState } from "react";
import { View, Text, StyleSheet, TextInput, Image, Modal, TouchableOpacity } from "react-native";
import { Picker } from '@react-native-picker/picker';
import AntDesign from "@expo/vector-icons/AntDesign";
import { Colors } from '@/constants/Colors';
import { Item, ComplaintTypes, getAddressString } from "./complaint-helper";


type Props = {
    initialData: Item[];
    visible: boolean;
    apply(filteredData: Item[]): any;
    clear(): any;
    closeModal(): any;
  };

export default function FiltersModal({ initialData, visible, apply, clear, closeModal }: Props) {

    const [address, setAddress] = useState<string>("");
    const [selectedType, setSelectedType] = useState<ComplaintTypes | null>(null);
    const [selectedStatus, setSelectedStatus] = useState<string | null>(null);
    const [selectedOrdering, setSelectedOrdering] = useState<string>("RECENT");

    const applyFilters = () => {
        let filtered = initialData!;

        if (selectedType) {
          filtered = filtered.filter((item) => item.tipo === ComplaintTypes[selectedType]);
        }
        if (selectedStatus) {
          filtered = filtered.filter((item) => item.status === selectedStatus);
        }
        if (address) {
          filtered = filtered.filter((item) =>
            getAddressString(item.endereco).toLowerCase().includes(address.toLowerCase())
          );
        }

        filtered = applyOrdering(filtered);

        apply(filtered);
    }

    const applyOrdering = (filtered: Item[]) => {
        switch (selectedOrdering) {
            case "MORE_LIKES":
                return filtered.sort((a,b) => b.nota - a.nota);
            case "LEAST_LIKES":
                return filtered.sort((a,b) => a.nota - b.nota);
            case "OLDER":
                return filtered.sort((a,b) => new Date(a.data).getTime() - new Date(b.data).getTime());
            default:
                return filtered.sort((a,b) => new Date(b.data).getTime() - new Date(a.data).getTime());
        }
    }
    const clearFilters = () => {
        setAddress("");
        setSelectedType(null);
        setSelectedStatus(null);
        setSelectedOrdering("RECENT");

        clear();
    }

    return (
        <Modal visible={visible} transparent={true} animationType="slide">
            <View style={styles.modal}>
                <View style={styles.modalContent}>
                    <View style={styles.header}>
                        <TouchableOpacity style={{position: "absolute", top: 12, left: 16, zIndex: 1}} onPress={closeModal}>
                            <AntDesign name="arrowleft" color={Colors.text} size={32}></AntDesign>
                        </TouchableOpacity>
                        <AntDesign style={{flexGrow: 1, textAlign: "center"}} name="filter" color={Colors.text} size={32}></AntDesign>
                    </View>
                    <View style={styles.mainCointainer}>
                        <View style={styles.groupView}>
                            <Text style={styles.label}>Endereço</Text>
                            <TextInput style={styles.input}
                                    value={address}
                                    onChangeText={setAddress}></TextInput>
                        </View>
                        <View style={styles.groupView}>
                            <Text style={styles.label}>Tipo</Text>
                            <Picker style={styles.picker}
                                    selectedValue={selectedType}
                                    onValueChange={(itemValue, itemIndex) => setSelectedType(itemValue)}>
                                    <Picker.Item label="-" value={null}></Picker.Item>    
                                    <Picker.Item label="Lixo" value={ComplaintTypes.TRASH}></Picker.Item>
                                    <Picker.Item label="Iluminação" value={ComplaintTypes.LIGHTING}></Picker.Item> 
                                    <Picker.Item label="Asfalto" value={ComplaintTypes.ASPHALT}></Picker.Item>
                                    <Picker.Item label="Esgoto" value={ComplaintTypes.SEWAGE}></Picker.Item>
                                    <Picker.Item label="Calçada" value={ComplaintTypes.SIDEWALK}></Picker.Item>
                                    <Picker.Item label="Capinagem" value={ComplaintTypes.WEEDING}></Picker.Item>
                                    <Picker.Item label="Outro" value={ComplaintTypes.OTHER}></Picker.Item>
                            </Picker>
                        </View>
                        <View style={styles.groupView}>
                            <Text style={styles.label}>Status</Text>
                            <Picker style={styles.picker}
                                    selectedValue={selectedStatus}
                                    onValueChange={(itemValue, itemIndex) => setSelectedStatus(itemValue)}>
                                    <Picker.Item label="-" value={null}></Picker.Item>   
                                    <Picker.Item label="Aberto" value="OPEN"></Picker.Item>
                                    <Picker.Item label="Resolvido" value="SOLVED"></Picker.Item> 
                            </Picker>
                        </View>
                        <View style={styles.groupView}>
                            <Text style={styles.label}>Ordenar por</Text>
                            <Picker style={styles.picker}
                                    selectedValue={selectedOrdering}
                                    onValueChange={(itemValue, itemIndex) => setSelectedOrdering(itemValue)}>
                                    <Picker.Item label="Mais recente" value="RECENT"></Picker.Item>
                                    <Picker.Item label="Menos recente" value="OLDER"></Picker.Item>
                                    <Picker.Item label="Mais curtidas" value="MORE_LIKES"></Picker.Item> 
                                    <Picker.Item label="Menos curtidas" value="LEAST_LIKES"></Picker.Item> 
                            </Picker>
                        </View>

                        <View style={styles.buttonsContainer}>

                            <TouchableOpacity style={styles.clearButton} onPress={clearFilters}>
                                <Text style={styles.filterText}>Limpar Filtros</Text>
                            </TouchableOpacity>
                            
                            <TouchableOpacity style={styles.filterButton} onPress={applyFilters}>
                                <Text style={styles.filterText}>Filtrar</Text>
                            </TouchableOpacity>
                        </View>

                    </View>
                </View>
            </View>
        </Modal>
    )
}

const styles = StyleSheet.create({
    modal: {
        flex: 1,
        alignItems: "center",
        justifyContent: "center",
        alignContent: "center",
        backgroundColor: "rgba(0,0,0,0.8)"
    },
    modalContent: {

    },
    header: {
        alignItems: "center",
        flexDirection: "row",
        backgroundColor: Colors.tab,
        paddingVertical: 10,
        paddingHorizontal: 16
    },
    mainCointainer: {
        padding: 20,
        backgroundColor: Colors.background
    },
    groupView: {
        marginBottom: 16
    },
    input: {
        width: '100%',
        height: 60,
        backgroundColor: '#fff',
        borderWidth: 0,
        paddingHorizontal: 10,
    },
    label: {
        fontSize: 14,
        color: Colors.text,
        marginBottom: 8,
    },
    picker: {
        backgroundColor: 'white',
    },
    buttonsContainer: {
        marginTop: 20,
        flexDirection: "row",
        justifyContent: "space-between",              
        marginBottom: 20
    },
    clearButton: {
        width: "45%",
        height: 40,
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: Colors.error
    },
    filterButton: {
        width: "45%",
        height: 40,
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: Colors.primary
    },
    filterText: {
        fontSize: 16,
        color: Colors.text,
    }
})