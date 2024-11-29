import React, { useState, useContext } from "react";
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
import * as SecureStore from 'expo-secure-store';
import Constants from "expo-constants";

import ImageViewer from '@/components/ImageViewer'
import { Colors } from '@/constants/Colors';
import { Address, ComplaintTypes } from "@/components/complaint-helper"
import { ComplaintContext } from "@/contexts/complaints";

const ReportProblemScreen = () => {
    const navigation = useNavigation();
    let { render, setData } = useContext(ComplaintContext);

    interface geocodedInformation {
        latitude: number,
        longitude: number
    }

    const cameraIcon = require("../assets/images/camera.png");

    const [title, setTitle] = useState<string>();
    const [description, setDescription] = useState<string>();
    const [location, setLocation] = useState<string | null>();
    const [address, setAddress] = useState<Address | null>();

    const [geocodedInformation, setGeocodedInformation] = useState<geocodedInformation | null>(null);

    const [selectedType, setSelectedType] = useState<ComplaintTypes>(ComplaintTypes.TRASH);
    const [modalVisible, setModalVisible] = useState<boolean>(false);

    //const [selectedImages, setSelectedImages] = useState<(string | undefined)[]>([undefined, undefined, undefined, undefined]);
    const [selectedImage, setSelectedImage] = useState<(ImagePicker.ImagePickerAsset | undefined)>(undefined);

    const pickImageAsync = async (imageIndex: number) => {    
      if (selectedImage) {
        setSelectedImage(undefined);
        return;
      }

      let result = await ImagePicker.launchImageLibraryAsync({
        allowsEditing: true,
        quality: 1,
        base64: false
      });
  
      if (!result.canceled) {
        /*let updatedImages = [...selectedImages];
        let index = updatedImages.findIndex(el => el === undefined);
        index = index == -1 ? imageIndex : index;

        updatedImages[index] = result.assets[0].uri;
        setSelectedImages(updatedImages);*/

        let updatedImage = result.assets[0];
        setSelectedImage(updatedImage);
      } else {
      }
    };

    const handleGetCurrentLocation = async () => {
        let location = await Location.getCurrentPositionAsync({});

        const geocodedInformation = {accuracy: location.coords.accuracy,
            altitude: location.coords.altitude,
            latitude: location.coords.latitude, 
            longitude: location.coords.longitude};

        let place: Location.LocationGeocodedAddress[] = await Location.reverseGeocodeAsync(geocodedInformation);

        const address: Address = {
            addressLine: place[0].street,
            city: place[0].subregion,
            federalState: place[0].region
        }

        let geoInformation : geocodedInformation = {
            latitude: location.coords.latitude,
            longitude: location.coords.longitude
        };
        
        setGeocodedInformation(geoInformation);
        setLocation(place[0].formattedAddress);
        setAddress(address);
        setModalVisible(false);
    }

    const searchGeoLocation = async (locationText: string) => {
        let geocodedInformation = await Location.geocodeAsync(locationText);

        if (!geocodedInformation[0]) {
            Alert.alert("Erro", "Não foi possível encontrar o endereço digitado.")
            return;
        }

        const geolocationInformation: geocodedInformation = {
            latitude: geocodedInformation[0].latitude,
            longitude: geocodedInformation[0].longitude
        };

        let place: Location.LocationGeocodedAddress[] = await Location.reverseGeocodeAsync(geocodedInformation[0]);

        const address: Address = {
            addressLine: place[0].street,
            city: place[0].subregion,
            federalState: place[0].region
        }

        setGeocodedInformation(geolocationInformation);
        setLocation(place[0].formattedAddress);
        setAddress(address);
        setModalVisible(false);
    }

    const updateRender = () => {
        setData(++render);
    }

    const uploadComplaint = async (updateRender: any) => {
        let bearer = await SecureStore.getItemAsync('secure_token');

        const complaintPayload = {
            title: title,
            address: address,
            geolocation: geocodedInformation,
            type: ComplaintTypes[selectedType],
            description: description
        };

        const hostUri = 'http://urbcrowd-dev.sa-east-1.elasticbeanstalk.com';

        fetch(hostUri + '/complaints', {
            method: 'POST',
            body: JSON.stringify(complaintPayload),
            headers: { "Content-type": "application/json; charset=UTF-8", Authorization: 'Bearer ' + bearer}
        }).then(response => {
            if (!response.ok) {
                throw new Error("Falha ao criar reclamação. Tente novamente mais tarde.");
            }

            return response.json();
        }).then(() => {
            updateRender();
            router.back();
        })
        .catch(err => Alert.alert("Erro", err.message));
    }

    const uploadComplaintWithImage = async(updateRender: any) => {
        let bearer = await SecureStore.getItemAsync('secure_token');

        let formData = new FormData();

        // @ts-expect-error: special react native format for form data
        formData.append('image', { uri: selectedImage?.uri, name: selectedImage?.fileName, type: selectedImage!.mimeType });
        formData.append('title', title!);
        formData.append('address.addressLine', address!.addressLine!);
        formData.append('address.city', address!.city!);
        formData.append('address.federalState', address!.federalState!);
        formData.append('geolocation.latitude', geocodedInformation!.latitude.toString());
        formData.append('geolocation.longitude', geocodedInformation!.longitude.toString());
        formData.append('type', ComplaintTypes[selectedType]);
        formData.append('description', description!);

        const hostUri = 'http://urbcrowd-dev.sa-east-1.elasticbeanstalk.com';

        fetch(hostUri + '/complaints-image', {
            method: 'POST',
            body: formData,
            headers: {
                Authorization: 'Bearer ' + bearer
            }
        }).then(response => {
            if (!response.ok) {
                throw new Error("Falha ao criar reclamação. Tente novamente mais tarde.");
            }

            return response.json();
        }).then(() => {
            updateRender();
            router.back();
        })
        .catch(err => Alert.alert("Erro", err.message));
    };

    const router = useRouter();


    return (
        <View>
            <View style={styles.header}>
                <Text style={styles.title}>Relatar Problema</Text>
                <View style={styles.headerButtons}>
                    <TouchableOpacity onPress={() => router.back()}>
                        <Text style={styles.cancelButton}>Cancelar</Text>
                    </TouchableOpacity>
                    <TouchableOpacity  style={styles.createButton} onPress={() => !!selectedImage ? uploadComplaintWithImage(updateRender) : uploadComplaint(updateRender)}>
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
                            <Picker.Item label="Lixo" value={ComplaintTypes.TRASH}></Picker.Item>
                            <Picker.Item label="Iluminação" value={ComplaintTypes.LIGHTING}></Picker.Item> 
                            <Picker.Item label="Asfalto" value={ComplaintTypes.ASPHALT}></Picker.Item>
                            <Picker.Item label="Esgoto" value={ComplaintTypes.SEWAGE}></Picker.Item>
                            <Picker.Item label="Calçada" value={ComplaintTypes.SIDEWALK}></Picker.Item>
                            <Picker.Item label="Capinagem" value={ComplaintTypes.WEEDING}></Picker.Item>
                            <Picker.Item label="Outro" value={ComplaintTypes.OTHER}></Picker.Item>
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
                            <ImageViewer imgSource={cameraIcon} selectedImage={!!selectedImage ? selectedImage.uri : selectedImage} />
                        </TouchableOpacity>
                        {/*<TouchableOpacity onPress={() => pickImageAsync(1)}>
                            <ImageViewer imgSource={cameraIcon} selectedImage={selectedImages[1]} />
                        </TouchableOpacity>
                        <TouchableOpacity onPress={() => pickImageAsync(2)}>
                            <ImageViewer imgSource={cameraIcon} selectedImage={selectedImages[2]} />
                        </TouchableOpacity>
                        <TouchableOpacity onPress={() => pickImageAsync(3)}>
                            <ImageViewer imgSource={cameraIcon} selectedImage={selectedImages[3]} />
                        </TouchableOpacity>*/}
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
        backgroundColor: "transparent",
        width: "100%"
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