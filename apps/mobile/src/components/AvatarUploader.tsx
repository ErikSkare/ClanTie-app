import {useState} from "react";
import {
  TouchableOpacity,
  TouchableOpacityProps,
  View,
  Text,
} from "react-native";
import * as ImagePicker from "expo-image-picker";
import FastImage from "react-native-fast-image";

interface ImageUploaderProps extends TouchableOpacityProps {
  error?: boolean;
  onChange?: (text: string) => void;
  onBlur: () => void;
}

const AvatarUploader: React.FC<ImageUploaderProps> = ({
  error = false,
  onChange = () => undefined,
  onBlur = () => undefined,
  className = "",
  ...props
}) => {
  const [imageUri, setImageUri] = useState<string>();

  async function open() {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.5,
      selectionLimit: 1,
    });
    if (!result.canceled && result.assets[0]) {
      setImageUri(result.assets[0].uri);
      onChange(result.assets[0].uri);
    }
    onBlur();
  }

  return (
    <TouchableOpacity
      className={`flex flex-row justify-center ${className}`}
      onPress={open}
      {...props}
    >
      <View
        className={`relative w-28 h-28 rounded-full ${
          error ? "border-red-400" : "border-slate-400"
        } border-2 flex justify-center items-center p-2`}
      >
        {imageUri ? (
          <FastImage
            source={{uri: imageUri}}
            className="w-full h-full rounded-full"
          />
        ) : (
          <Text
            className={`text-center uppercase ${
              error ? "text-red-400" : "text-slate-300"
            }`}
            style={{fontFamily: "Roboto_700Bold"}}
          >
            Avatar feltöltés
          </Text>
        )}
      </View>
    </TouchableOpacity>
  );
};

export default AvatarUploader;
