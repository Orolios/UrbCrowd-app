import React, { useState, useEffect } from "react";
import {
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  Alert,
  Image,
  Modal,
} from "react-native";
import * as ImagePicker from 'expo-image-picker';
import { Picker } from '@react-native-picker/picker';
import { useRouter, useNavigation } from 'expo-router';
import * as Location from "expo-location";

import ImageViewer from '@/components/ImageViewer'
import { Colors } from '@/constants/Colors';

const ReportProblemScreen = () => {
    const navigation = useNavigation();

    const cameraIcon = require("../assets/images/camera.png");

    const [title, setTitle] = useState<string>();
    const [description, setDescription] = useState<string>();
    const [location, setLocation] = useState<string | null>();

    const [geocodedInformation, setGeocodedInformation] = useState<any>(null);

    const [selectedType, setSelectedType] = useState("esgoto");
    const [modalVisible, setModalVisible] = useState<boolean>(false);

    const [selectedImages, setSelectedImages] = useState<(string | undefined)[]>([undefined, undefined, undefined, undefined]);

    const pickImageAsync = async (imageIndex: number) => {    
      let result = await ImagePicker.launchImageLibraryAsync({
        allowsEditing: true,
        quality: 1,
        base64: false
      });
  
      if (!result.canceled) {
        let updatedImages = [...selectedImages];
        let index = updatedImages.findIndex(el => el === undefined);
        index = index == -1 ? imageIndex : index;

        updatedImages[index] = result.assets[0].uri;
        setSelectedImages(updatedImages);
      } else {
      }
    };

    const handleGetCurrentLocation = async () => {
        let location = await Location.getCurrentPositionAsync({});

        const geocodeInformation = {accuracy: location.coords.accuracy,
            altitude: location.coords.altitude,
            latitude: location.coords.latitude, 
            longitude: location.coords.longitude};

        let place: Location.LocationGeocodedAddress[] = await Location.reverseGeocodeAsync(geocodeInformation);
        
        setGeocodedInformation(location.coords);
        setLocation(place[0].formattedAddress);
        setModalVisible(false);
    }

    const searchGeoLocation = async (locationText: string) => {
        let geocodedInformation = await Location.geocodeAsync(locationText);
        console.log(geocodedInformation)
        setLocation(locationText);

        const locationObject = {coords: {...geocodedInformation[0], altitudeAccuracy: null, heading: null, speed: null}, timestamp: null}
        setGeocodedInformation(locationObject);
    }


    const router = useRouter();

    return (
        <View>
            <View style={styles.header}>
                <Text style={styles.title}>Relatar Problema</Text>
                <View style={styles.headerButtons}>
                    <TouchableOpacity onPress={() => router.back()}>
                        <Text style={styles.cancelButton}>Cancelar</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.createButton}>
                        <Text style={styles.createButtonText}>Criar</Text>
                    </TouchableOpacity>
                </View>
            </View>
            <View style={styles.container}>
                <View style={styles.inputGroup}>
                    <Text style={styles.label}>Título</Text>
                    <TextInput style={styles.input} placeholder="Adicione um título" placeholderTextColor="#B3B3B3"
                               value={title} onChangeText={setTitle} />
                </View>
                <View style={styles.inputGroup}>
                    <Text style={styles.label}>Descrição</Text>
                    <TextInput style={styles.textArea} placeholder="Adicione uma breve descrição do problema" placeholderTextColor="#B3B3B3" multiline
                               value={description} onChangeText={setDescription} />
                </View>
                <View style={styles.inputGroup}>
                    <Text style={styles.label}>Tipo de problema</Text>
                    <Picker style={styles.picker}
                            selectedValue={selectedType}
                            onValueChange={(itemValue, itemIndex) => setSelectedType(itemValue)}>
                            <Picker.Item label="Esgoto" value="esgoto"></Picker.Item>
                            <Picker.Item label="Asfalto/Calçada" value="calçada"></Picker.Item>
                            <Picker.Item label="Outro" value="outro"></Picker.Item>
                    </Picker>
                </View>
                <View style={styles.inputGroup}>
                    <Text style={styles.label}>Localização</Text>
                    <TextInput style={styles.input} placeholder="Adicione a localização do problema" placeholderTextColor="#B3B3B3" onPress={() => setModalVisible(true)}
                               value={!!location ? location : undefined} onChangeText={setLocation}/>
                </View>
                <View style={styles.inputGroup}>
                    <Text style={styles.label}>Fotos</Text>
                    <View style={styles.photoContainer}>
                        <TouchableOpacity onPress={() => pickImageAsync(0)}>
                            <ImageViewer imgSource={cameraIcon} selectedImage={selectedImages[0]} />
                        </TouchableOpacity>
                        <TouchableOpacity onPress={() => pickImageAsync(1)}>
                            <ImageViewer imgSource={cameraIcon} selectedImage={selectedImages[1]} />
                        </TouchableOpacity>
                        <TouchableOpacity onPress={() => pickImageAsync(2)}>
                            <ImageViewer imgSource={cameraIcon} selectedImage={selectedImages[2]} />
                        </TouchableOpacity>
                        <TouchableOpacity onPress={() => pickImageAsync(3)}>
                            <ImageViewer imgSource={cameraIcon} selectedImage={selectedImages[3]} />
                        </TouchableOpacity>
                    </View>
                </View>
            </View>
            <Modal
                visible={modalVisible}
                transparent={false}
                animationType="none"
            >   
                <View style={{borderTopColor: Colors.blackText, borderTopWidth: 2}}>
                    <View style={styles.modalHeader}>
                        <TouchableOpacity onPress={() => setModalVisible(false)}>
                            <Image style={styles.backArrow} source={require("../assets/images/back-arrow.png")}></Image>
                        </TouchableOpacity>
                        <TextInput style={styles.modalInput} placeholder="Selecionar local" placeholderTextColor={Colors.blackText}
                                   value={!!location ? location : undefined} onChangeText={setLocation} onEndEditing={(e) => searchGeoLocation(e.nativeEvent.text) }></TextInput>
                    </View>
                    <View style={styles.mainContainer}>
                        <TouchableOpacity style={{flexDirection: "row", alignItems: "center", marginBottom: 14}} onPress={handleGetCurrentLocation}>
                            <Image style={styles.icon} source={require("../assets/images/target.png")}></Image>
                            <Text style={styles.locationText}>Seu Local</Text>
                        </TouchableOpacity>
                        <View style={{borderBottomColor: Colors.text, borderBottomWidth: 2}}></View>
                    </View>
                </View>
            </Modal>
        </View>

    );
}

const styles = StyleSheet.create({
    container: {
        height: "100%",
        backgroundColor: Colors.background,
        padding: 16,
        borderRadius: 8,
    },
    header: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignContent: "space-around",
        paddingHorizontal: 16,
        paddingVertical: 8,
        paddingTop: 32,
        height: 72,
        backgroundColor: Colors.tab
    },
    headerButtons: {
        flexDirection: "row",
        alignItems: 'center',
    },
    title: {
        color: Colors.text,
        fontSize: 20
    },
    picker: {
        backgroundColor: 'white'
    },
    headerText: {
        color: 'white',
        fontSize: 18,
    },
    cancelButton: {
        color: '#111D13',
        marginRight: 18,
    },
    createButton: {
        justifyContent: "center",
        backgroundColor: Colors.primary,
        paddingVertical: 4,
        paddingHorizontal: 16,
        borderRadius: 4,
        height: 32
    },
    createButtonText: {
        color: Colors.text,
        fontSize: 18,
    },
    inputGroup: {
        marginBottom: 16,
    },
    label: {
        color: Colors.text,
        marginBottom: 8,
        fontSize: 16
    },
    input: {
        backgroundColor: 'white',
        padding: 8,
        borderRadius: 4,
        borderColor: '#e2e8f0',
        borderWidth: 1,
    },
    textArea: {
        backgroundColor: 'white',
        padding: 8,
        borderRadius: 4,
        borderColor: '#e2e8f0',
        borderWidth: 1,
        height: 80,
        textAlignVertical: 'top',
    },
    photoContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    photo: {
        width: 64,
        height: 64,
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 4,
    },
    cameraIcon: {
        fontSize: 24,
        color: '#22543d',
    },
    modalHeader: {
        flexDirection: "row",
        backgroundColor: Colors.tab,
        height: 72,
        alignItems: "center",
        padding: 14
    },
    modalInput: {
        backgroundColor: "transparent"
    },
    backArrow: {
        height: 24,
        width: 32,
        marginRight: 16
    },
    icon: {
        height: 44,
        width: 44,
        color: Colors.blackText
    },
    mainContainer: {
        backgroundColor: Colors.background,
        height: "100%",
        padding: 14
    },
    locationText: {
        color: Colors.text,
        fontSize: 20,
        marginLeft: 12
    }
});

export default ReportProblemScreen;