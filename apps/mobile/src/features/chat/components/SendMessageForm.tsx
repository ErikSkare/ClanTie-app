import {
  View,
  ViewProps,
  TextInput,
  TouchableOpacity,
  Animated,
  ActivityIndicator,
} from "react-native";
import {Ionicons} from "@expo/vector-icons";
import {useFormik} from "formik";
import {useEffect, useRef} from "react";
import ImageUploader from "@/components/ImageUploader";
import {trpc} from "@/lib/trpc";
import uriToFileMeta from "@/utils/uriToFileMeta";
import toFormData from "@/utils/toFormData";

interface SendMessageFormProps extends ViewProps {
  clanId: number;
}

const SendMessageForm: React.FC<SendMessageFormProps> = ({
  clanId,
  className = "",
  ...props
}) => {
  const slideInAnim = useRef(new Animated.Value(100)).current;

  const utils = trpc.useContext();

  const {data, isLoading, isError} = trpc.clan.getCurrentMember.useQuery({
    clanId,
  });

  const {mutateAsync} = trpc.chat.sendMessage.useMutation({
    onMutate: async ({content, hasImage}) => {
      if (!data) return;

      await utils.chat.getMessages.cancel({clanId, limit: 10});

      const previous = utils.chat.getMessages.getInfiniteData({
        clanId,
        limit: 10,
      });

      utils.chat.getMessages.setInfiniteData({clanId, limit: 10}, (old) => {
        if (!old) return;
        return {
          ...old,
          pages: [
            {
              result: [
                {
                  sentBy: {
                    user: {isActive: true, id: data.userId},
                    avatarUrl: data.avatarUrl,
                    nickname: data.nickname,
                  },
                  content,
                  images: hasImage ? [{url: formik.values.imageUri}] : [],
                  createdAt: new Date(Date.now()),
                },
              ],
              newCursor: undefined,
            },
            ...old.pages,
          ],
        };
      });

      formik.resetForm();

      return {previous};
    },
    onError: (error, data, ctx) => {
      utils.chat.getMessages.setInfiniteData({clanId}, ctx?.previous);
    },
  });

  const formik = useFormik({
    initialValues: {text: "", imageUri: ""},
    onSubmit: async (values) => {
      const {upload} = await mutateAsync({
        clanId,
        content: values.text === "" ? null : values.text,
        hasImage: values.imageUri !== "",
      });

      if (upload) {
        const fileMeta = uriToFileMeta(values.imageUri);
        if (!fileMeta) return;

        await fetch(upload.url, {
          method: "POST",
          body: toFormData({
            ...upload.fields,
            "Content-Type": fileMeta.type,
            file: fileMeta,
          }),
        });
      }
    },
  });

  useEffect(() => {
    if (formik.values.text === "" && formik.values.imageUri === "") {
      slideInAnim.setValue(100);
    } else {
      Animated.timing(slideInAnim, {
        toValue: 0,
        duration: 150,
        useNativeDriver: true,
      }).start();
    }
  }, [formik.values.text, formik.values.imageUri]);

  if (isLoading)
    return (
      <View className="h-12 justify-center items-center">
        <ActivityIndicator color="white" />
      </View>
    );

  if (isError) return null;

  return (
    <View className={`flex-row h-12 ${className}`} {...props}>
      <ImageUploader
        className="h-full mr-4"
        onChange={formik.handleChange("imageUri")}
        value={formik.values.imageUri}
      />
      <TextInput
        placeholder="Üzenet küldés"
        placeholderTextColor="#64748b"
        className="flex-1 rounded px-4 py-2 bg-slate-900 text-white"
        style={{fontFamily: "Roboto_400Regular"}}
        onChangeText={formik.handleChange("text")}
        onBlur={formik.handleBlur("text")}
        value={formik.values.text}
      />
      {(formik.values.text !== "" || formik.values.imageUri !== "") && (
        <TouchableOpacity onPress={() => formik.handleSubmit()}>
          <Animated.View
            className="ml-4 justify-center items-center h-full aspect-square bg-green-400 rounded-full"
            style={{transform: [{translateX: slideInAnim}]}}
          >
            <Ionicons name="send" size={16} color="white" />
          </Animated.View>
        </TouchableOpacity>
      )}
    </View>
  );
};

export default SendMessageForm;
