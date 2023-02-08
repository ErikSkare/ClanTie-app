import {View, ViewProps} from "react-native";
import {useFormik} from "formik";
import {z} from "zod";
import {toFormikValidationSchema} from "zod-formik-adapter";
import {trpc} from "@/lib/trpc";
import AvatarUploader from "@/components/AvatarUploader";
import Button from "@/components/Button";
import TextInput from "@/components/TextInput";
import toFormData from "@/utils/toFormData";
import uriToFileMeta from "@/utils/uriToFileMeta";

interface AcceptInvitationFormProps extends ViewProps {
  onSuccess: () => void;
  clanId: number;
  fromId: number;
}

const AcceptInvitationSchema = z.object({
  avatarUri: z.string(),
  nickname: z.string({required_error: "Kérjük töltsd ki a mezőt!"}),
});

const AcceptInvitationForm: React.FC<AcceptInvitationFormProps> = ({
  onSuccess,
  clanId,
  fromId,
  ...props
}) => {
  const {mutateAsync, isLoading} = trpc.clan.acceptInvitation.useMutation();

  const formik = useFormik({
    initialValues: {nickname: "", avatarUri: ""},
    validationSchema: toFormikValidationSchema(AcceptInvitationSchema),
    validateOnBlur: true,
    validateOnChange: false,
    validateOnMount: true,
    onSubmit: async (values) => {
      const {url, fields} = await mutateAsync({
        clanId,
        fromId,
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

export default AcceptInvitationForm;
