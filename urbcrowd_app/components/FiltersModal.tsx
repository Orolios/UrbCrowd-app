import { View, Text, StyleSheet, Image, Modal, TouchableOpacity } from "react-native";
import AntDesign from "@expo/vector-icons/AntDesign";
import { Colors } from '@/constants/Colors';
import { Item } from "./complaint-helper";


type Props = {
    initialData: Item[];
    visible: boolean;
  };

export default function FiltersModal({ initialData, visible }: Props) {
    return (
        <Modal visible={visible} transparent={true} animationType="slide">
            <View style={styles.header}>
                <AntDesign name="filter" color={Colors.text}> size={32}</AntDesign>
            </View>
        </Modal>
    )
}

const styles = StyleSheet.create({
    header: {
        alignContent: "center",
        backgroundColor: Colors.tab
    }
})