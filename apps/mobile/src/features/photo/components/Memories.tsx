import {
  FlatList,
  View,
  ViewProps,
  Image,
  Text,
  ActivityIndicator,
} from "react-native";
import {trpc} from "@/lib/trpc";

interface MemoriesProps extends ViewProps {
  clanId: number;
}

const Memories: React.FC<MemoriesProps> = ({clanId, ...props}) => {
  const {
    data,
    isLoading,
    isError,
    isFetchingNextPage,
    isRefetching,
    refetch,
    fetchNextPage,
  } = trpc.picture.getAlbumPictures.useInfiniteQuery(
    {clanId: clanId, limit: 3},
    {getNextPageParam: (lastPage) => lastPage.newCursor}
  );

  if (isLoading) return <ActivityIndicator color="white" size="large" />;

  if (isError) return null;

  return (
    <View {...props}>
      <FlatList
        data={data.pages.flatMap((page) => page.result)}
        numColumns={3}
        refreshing={isRefetching}
        onRefresh={() => refetch()}
        onEndReached={() => fetchNextPage()}
        renderItem={({item}) => (
          <View className="w-1/3 p-1">
            <Image
              className="aspect-[9/16] rounded"
              source={{uri: item.imageUrl}}
              resizeMode="contain"
            />
          </View>
        )}
        ListFooterComponent={
          isFetchingNextPage ? (
            <ActivityIndicator color="white" size="large" className="mt-4" />
          ) : null
        }
        ListEmptyComponent={
          <Text
            className="text-slate-400"
            style={{fontFamily: "Roboto_400Regular"}}
          >
            Sajnos még nincsenek emlékek
          </Text>
        }
      />
    </View>
  );
};

export default Memories;
