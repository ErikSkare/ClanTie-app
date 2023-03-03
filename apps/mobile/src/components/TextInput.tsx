import {Platform} from "expo-modules-core";
import {useState} from "react";
import {
  View,
  Text,
  TextInputProps as RNTextInputProps,
  TextInput as RNTextInput,
  TouchableOpacity,
} from "react-native";

interface TextInputProps extends RNTextInputProps {
  label: string;
  containerClassName?: string;
  error?: string;
}

const TextInput: React.FC<TextInputProps> = ({
  label,
  containerClassName = "",
  secureTextEntry = false,
  error,
  ...props
}) => {
  const [hidden, setHidden] = useState<boolean>(secureTextEntry);

  return (
    <View className={containerClassName}>
      <Text className="mb-2">
        <Text
          className={`${error ? "text-red-400" : "text-slate-300"} uppercase`}
          style={{fontFamily: "Roboto_700Bold"}}
        >
          {label}
        </Text>
        {error && (
          <Text
            className="text-red-400"
            style={{fontFamily: "Roboto_400Regular_Italic"}}
          >
            {" - "}
            {error}
          </Text>
        )}
      </Text>
      <View>
        <RNTextInput
          className={`bg-slate-900 text-white ${
            Platform.OS === "ios" ? "py-[14px]" : "py-2"
          } px-4 rounded ${secureTextEntry && "pr-24"}`}
          style={{fontFamily: "Roboto_400Regular"}}
          secureTextEntry={hidden}
          {...props}
        />
        {secureTextEntry && (
          <TouchableOpacity
            className="absolute right-0 px-4 h-full flex flex-col justify-center"
            onPress={() => setHidden((val) => !val)}
          >
            <Text
              className="text-slate-300 text-xs"
              style={{fontFamily: "Roboto_400Regular"}}
            >
              {hidden ? "Megjelenítés" : "Elrejtés"}
            </Text>
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
};

export default TextInput;
