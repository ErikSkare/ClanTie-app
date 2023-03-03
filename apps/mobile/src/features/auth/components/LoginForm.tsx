import {useState} from "react";
import {KeyboardAvoidingView, ViewProps, Platform} from "react-native";
import {useFormik} from "formik";
import {z} from "zod";
import {trpc} from "@/lib/trpc";
import {toFormikValidationSchema} from "zod-formik-adapter";
import TextInput from "@/components/TextInput";
import Button from "@/components/Button";
import useTokenStore from "../stores/useTokenStore";

const LoginSchema = z.object({
  email: z
    .string({required_error: "Kérjük töltsd ki a mezőt!"})
    .email({message: "Kérjük valódi címet adj meg!"}),
  password: z
    .string({required_error: "Kérjük töltsd ki a mezőt!"})
    .min(7, "Legalább 7 karakterből kell állnia!"),
});

const LoginForm: React.FC<ViewProps> = ({...props}) => {
  const [buttonContent, setButtonContent] = useState("Bejelentkezés");
  const authenticate = useTokenStore((state) => state.authenticate);

  const {mutate, isLoading} = trpc.auth.login.useMutation({
    onSuccess: ({accessToken, refreshToken}) => {
      authenticate(accessToken, refreshToken);
    },
    onError: (error) => {
      if (!error.data) return;
      if (error.data.code == "BAD_REQUEST") setButtonContent(error.message);
    },
  });

  const formik = useFormik({
    initialValues: {email: "", password: ""},
    validationSchema: toFormikValidationSchema(LoginSchema),
    validateOnBlur: true,
    validateOnChange: false,
    validateOnMount: true,
    onSubmit: (values) => mutate(values),
  });

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : undefined}
      {...props}
    >
      <TextInput
        onChangeText={formik.handleChange("email")}
        onBlur={formik.handleBlur("email")}
        value={formik.values.email}
        label="E-mail cím"
        containerClassName="mb-4"
        error={formik.touched.email ? formik.errors.email : undefined}
      />
      <TextInput
        onChangeText={formik.handleChange("password")}
        onBlur={formik.handleBlur("password")}
        value={formik.values.password}
        label="Jelszó"
        secureTextEntry={true}
        error={formik.touched.password ? formik.errors.password : undefined}
      />
      <Button
        content={buttonContent}
        className="mt-8"
        onPress={() => formik.handleSubmit()}
        isLoading={isLoading}
      />
    </KeyboardAvoidingView>
  );
};

export default LoginForm;
