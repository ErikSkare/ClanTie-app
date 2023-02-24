import {trpc} from "@/lib/trpc";
import {FlatList, ActivityIndicator, View, ViewProps, Text} from "react-native";
import Message from "./Message";
import SendMessageForm from "./SendMessageForm";

interface MessagesProps extends ViewProps {
  clanId: number;
}

const Messages: React.FC<MessagesProps> = ({
  clanId,
  className = "",
  ...props
}) => {
  const {
    data,
    isLoading,
    isError,
    fetchNextPage,
    isFetchingNextPage,
    isRefetching,
  } = trpc.chat.getMessages.useInfiniteQuery(
    {
      clanId,
      limit: 10,
    },
    {getNextPageParam: (lastPage) => lastPage.newCursor, cacheTime: 0}
  );

  if (isLoading)
    return (
      <View className={`justify-center items-center ${className}`} {...props}>
        <ActivityIndicator size="large" color="white" />
      </View>
    );

  if (isError) return null;

  return (
    <View className={className} {...props}>
      <FlatList
        data={data.pages.flatMap((page) => page.result)}
        inverted={true}
        onEndReached={() => fetchNextPage()}
        renderItem={({item}) => <Message {...item} wrapperClassName="my-2" />}
        initialNumToRender={10}
        keyExtractor={(data) =>
          `${data.sentBy.user.id}-${data.createdAt.toISOString()}`
        }
        ListFooterComponent={
          isFetchingNextPage ? (
            <ActivityIndicator color="white" size="large" className="mb-2" />
          ) : null
        }
        ListHeaderComponent={
          isRefetching ? (
            <ActivityIndicator color="white" size="large" className="mt-2" />
          ) : null
        }
        ListEmptyComponent={
          <Text
            className="text-slate-400"
            style={{fontFamily: "Roboto_400Regular"}}
          >
            Sajnos még nincsenek üzenetek
          </Text>
        }
      />
      <SendMessageForm clanId={clanId} className="mt-4" />
    </View>
  );
};

export default Messages;
