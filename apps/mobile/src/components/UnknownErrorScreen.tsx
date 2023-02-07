import {FallbackProps} from "react-error-boundary";
import {View, Text} from "react-native";
import {StatusBar} from "expo-status-bar";
import EmptyLayout from "./layouts/EmptyLayout";
import Button from "./Button";

const UnknownErrorScreen: React.FC<FallbackProps> = ({resetErrorBoundary}) => {
  return (
    <EmptyLayout className="flex justify-center items-center">
      <View className="mx-8">
        <Text
          className="text-lg text-white mb-4"
          style={{fontFamily: "Roboto_700Bold"}}
        >
          Valami hiba történt!
        </Text>
        <Button
          content="Újrapróbálkozom"
          onPress={() => resetErrorBoundary()}
        />
      </View>
      <StatusBar backgroundColor="#1E293B" translucent={false} />
    </EmptyLayout>
  );
};

export default UnknownErrorScreen;
