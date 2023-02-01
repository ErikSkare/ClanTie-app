import {View, Text} from "react-native";
import {trpc} from "@/lib/trpc";

const Test = () => {
  const {data, status} = trpc.hello.greeting.useQuery();

  if (status == "loading")
    return (
      <View className="flex h-screen justify-center items-center">
        <Text>Loading...</Text>
      </View>
    );

  if (status == "error")
    return (
      <View className="flex h-screen justify-center items-center">
        <Text>Error!</Text>
      </View>
    );

  return (
    <View className="flex h-screen justify-center items-center">
      <Text>{data}</Text>
    </View>
  );
};

export default Test;
