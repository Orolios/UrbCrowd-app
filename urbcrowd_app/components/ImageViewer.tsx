import { StyleSheet } from 'react-native';
import { Image } from "react-native";
import type { ImageSourcePropType} from "react-native"

type Props = {
  imgSource: ImageSourcePropType;
  selectedImage?: string;
};

export default function ImageViewer({ imgSource, selectedImage }: Props) {
  const imageSource = selectedImage ? { uri: selectedImage } : imgSource;

  return <Image source={imageSource} style={styles.image} />;
}

const styles = StyleSheet.create({
  image: {
    width: 80,
    height: 80,
    borderRadius: 4,
    alignItems: "center"
  },
});