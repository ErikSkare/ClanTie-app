import {View, ViewProps} from "react-native";
import {useFormik} from "formik";
import {z} from "zod";
import {toFormikValidationSchema} from "zod-formik-adapter";
import {trpc} from "@/lib/trpc";
import Button from "@/components/Button";
import TextInput from "@/components/TextInput";
import AvatarUploader from "@/components/AvatarUploader";
import toFormData from "@/utils/toFormData";
import uriToFileMeta from "@/utils/uriToFileMeta";

interface CreateClanFormProps extends ViewProps {
  onSuccess?: () => void;
}

const CreateClanSchema = z.object({
  avatarUri: z.string(),
  clanName: z.string({required_error: "Kérjük töltsd ki a mezőt!"}),
  nickname: z.string({required_error: "Kérjük töltsd ki a mezőt!"}),
});

const CreateClanForm: React.FC<CreateClanFormProps> = ({
  onSuccess = () => undefined,
  ...props
}) => {
  const {mutateAsync, isLoading} = trpc.clan.create.useMutation();

  const formik = useFormik({
    initialValues: {clanName: "", nickname: "", avatarUri: ""},
    validationSchema: toFormikValidationSchema(CreateClanSchema),
    validateOnBlur: true,
    validateOnChange: false,
    validateOnMount: true,
    onSubmit: async (values) => {
      const {url, fields} = await mutateAsync({
        clanName: values.clanName,
        nickname: values.nickname,
      });

      const fileMeta = uriToFileMeta(values.avatarUri);
      if (!fileMeta) return;

      await fetch(url, {
        method: "POST",
        body: toFormData({
          ...fields,
          "Content-Type": fileMeta.type,
          file: fileMeta,
        }),
      });

      onSuccess();
    },
  });

  return (
    <View {...props}>
      <AvatarUploader
        className="mb-4"
        onChange={formik.handleChange("avatarUri")}
        onBlur={() => {
          formik.setFieldTouched("avatarUri", true);
          formik.validateForm();
        }}
        error={
          formik.touched.avatarUri
            ? formik.errors.avatarUri !== undefined
            : false
        }
      />
      <TextInput
        label="Klán neve"
        containerClassName="mb-4"
        onChangeText={formik.handleChange("clanName")}
        onBlur={formik.handleBlur("clanName")}
        error={formik.touched.clanName ? formik.errors.clanName : undefined}
      />
      <TextInput
        label="Becenevem"
        containerClassName="mb-8"
        onChangeText={formik.handleChange("nickname")}
        onBlur={formik.handleBlur("nickname")}
        error={formik.touched.nickname ? formik.errors.nickname : undefined}
      />
      <Button
        content="Mehet"
        onPress={() => formik.handleSubmit()}
        isLoading={isLoading}
      />
    </View>
  );
};

export default CreateClanForm;
