import {KeyboardAvoidingView, Platform, ViewProps} from "react-native";
import {useFormik} from "formik";
import {z} from "zod";
import {toFormikValidationSchema} from "zod-formik-adapter";
import {trpc} from "@/lib/trpc";
import AvatarUploader from "@/components/AvatarUploader";
import Button from "@/components/Button";
import TextInput from "@/components/TextInput";
import uploadToS3 from "@/utils/uploadToS3";

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
      const upload = await mutateAsync({
        clanId,
        fromId,
        nickname: values.nickname,
      });

      await uploadToS3(values.avatarUri, upload);

      onSuccess();
    },
  });

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : undefined}
      {...props}
    >
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
    </KeyboardAvoidingView>
  );
};

export default AcceptInvitationForm;
