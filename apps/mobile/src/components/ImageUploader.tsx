import {TouchableOpacity, TouchableOpacityProps} from "react-native";
import {Feather, Ionicons} from "@expo/vector-icons";
import * as ImagePicker from "expo-image-picker";

interface ImageUploaderProps extends TouchableOpacityProps {
  onChange?: (text: string) => void;
  onBlur?: () => void;
  value: string;
}

const ImageUploader: React.FC<ImageUploaderProps> = ({
  value,
  onChange = () => undefined,
  onBlur = () => undefined,
  className = "",
  ...props
}) => {
  async function open() {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      quality: 0.5,
      selectionLimit: 1,
    });
    if (!result.canceled && result.assets[0]) {
      onChange(result.assets[0].uri);
    }
    onBlur();
  }

  function handlePress() {
    if (value === "") open();
    else {
      onChange("");
    }
  }

  return (
    <TouchableOpacity
      className={`h-full aspect-square bg-slate-900 rounded-full justify-center items-center ${className}`}
      onPress={handlePress}
      {...props}
    >
      {value !== "" ? (
        <Ionicons name="close" size={24} color="white" />
      ) : (
        <Feather name="plus" size={24} color="#94a3b8" />
      )}
    </TouchableOpacity>
  );
};

export default ImageUploader;
