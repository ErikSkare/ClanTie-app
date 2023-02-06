import {
  TouchableOpacity,
  TouchableOpacityProps,
  View,
  Text,
} from "react-native";

interface ImageUploaderProps extends TouchableOpacityProps {
  label: string;
  error?: boolean;
}

const ImageUploader: React.FC<ImageUploaderProps> = ({
  label,
  error = false,
  className = "",
  ...props
}) => {
  return (
    <TouchableOpacity
      className={`flex flex-row justify-center ${className}`}
      {...props}
    >
      <View
        className={`relative w-28 h-28 rounded-full ${
          error ? "border-red-400" : "border-slate-400"
        } border-2 flex justify-center items-center p-4`}
      >
        <Text
          className={`text-center uppercase ${
            error ? "text-red-400" : "text-slate-300"
          }`}
          style={{fontFamily: "Roboto_700Bold"}}
        >
          {label}
        </Text>
      </View>
    </TouchableOpacity>
  );
};

export default ImageUploader;
