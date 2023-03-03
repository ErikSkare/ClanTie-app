import {useFormik} from "formik";
import {KeyboardAvoidingView, Platform, ViewProps} from "react-native";
import {z} from "zod";
import {trpc} from "@/lib/trpc";
import Button from "@/components/Button";
import TextInput from "@/components/TextInput";
import {toFormikValidationSchema} from "zod-formik-adapter";
import setFieldErrors from "@/utils/setFieldErrors";
import {useState} from "react";

const InviteSchema = z.object({
  email: z
    .string({required_error: "Kérjük töltsd ki a mezőt!"})
    .email({message: "Kérjük valódi címet adj meg!"}),
});

interface InviteFormProps extends ViewProps {
  clanId: number;
}

const InviteForm: React.FC<InviteFormProps> = ({clanId, ...props}) => {
  const [content, setContent] = useState("Mehet");

  const {mutate, isLoading} = trpc.clan.invite.useMutation({
    onError: (error) => {
      if (!error.data) return;
      if (error.data.code == "BAD_REQUEST")
        setFieldErrors(formik.setFieldError, error.data.fieldErrors);
      setContent("Mehet");
    },
    onSuccess: () => setContent("Sikeres meghívás!"),
  });

  const formik = useFormik({
    initialValues: {email: ""},
    validationSchema: toFormikValidationSchema(InviteSchema),
    validateOnBlur: true,
    validateOnChange: false,
    validateOnMount: true,
    onSubmit: (values) => mutate({email: values.email, clanId}),
  });

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : undefined}
      {...props}
    >
      <TextInput
        label="E-mail címe"
        className="mb-8"
        onChangeText={formik.handleChange("email")}
        onBlur={formik.handleBlur("email")}
        error={formik.touched.email ? formik.errors.email : undefined}
      />
      <Button
        content={content}
        onPress={() => formik.handleSubmit()}
        isLoading={isLoading}
      />
    </KeyboardAvoidingView>
  );
};

export default InviteForm;
