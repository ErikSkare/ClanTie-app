import {View, ViewProps} from "react-native";
import {useFormik} from "formik";
import {z} from "zod";
import {toFormikValidationSchema} from "zod-formik-adapter";
import {trpc} from "@/lib/trpc";
import TextInput from "@/components/TextInput";
import Button from "@/components/Button";
import setFieldErrors from "@/utils/setFieldErrors";
import useTokenStore from "../stores/useTokenStore";

const RegisterSchema = z.object({
  email: z
    .string({required_error: "Kérjük töltsd ki a mezőt!"})
    .email({message: "Kérjük valódi címet adj meg!"}),
  firstName: z.string({required_error: "Kérjük töltsd ki a mezőt!"}),
  lastName: z.string({required_error: "Kérjük töltsd ki a mezőt!"}),
  password: z
    .string({required_error: "Kérjük töltsd ki a mezőt!"})
    .min(7, "Legalább 7 karakterből kell állnia!"),
});

const RegisterForm: React.FC<ViewProps> = ({...props}) => {
  const authenticate = useTokenStore((state) => state.authenticate);

  const {mutate, isLoading} = trpc.auth.register.useMutation({
    onSuccess: ({accessToken, refreshToken}) => {
      authenticate(accessToken, refreshToken);
    },
    onError: (error) => {
      if (!error.data) return;
      if (error.data.code == "BAD_REQUEST")
        setFieldErrors(formik.setFieldError, error.data.fieldErrors);
    },
  });

  const formik = useFormik({
    initialValues: {email: "", firstName: "", lastName: "", password: ""},
    validationSchema: toFormikValidationSchema(RegisterSchema),
    validateOnBlur: true,
    validateOnChange: false,
    validateOnMount: true,
    onSubmit: (values) => mutate(values),
  });

  return (
    <View {...props}>
      <TextInput
        onChangeText={formik.handleChange("email")}
        onBlur={formik.handleBlur("email")}
        value={formik.values.email}
        label="E-mail cím"
        containerClassName="mb-4"
        error={formik.touched.email ? formik.errors.email : undefined}
      />
      <TextInput
        onChangeText={formik.handleChange("lastName")}
        onBlur={formik.handleBlur("lastName")}
        value={formik.values.lastName}
        label="Vezetéknév"
        containerClassName="mb-4"
        error={formik.touched.lastName ? formik.errors.lastName : undefined}
      />
      <TextInput
        onChangeText={formik.handleChange("firstName")}
        onBlur={formik.handleBlur("firstName")}
        value={formik.values.firstName}
        label="Keresztnév"
        containerClassName="mb-4"
        error={formik.touched.firstName ? formik.errors.firstName : undefined}
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
        content="Regisztráció"
        className="mt-8"
        onPress={() => formik.handleSubmit()}
        disabled={!formik.isValid}
        isLoading={isLoading}
      />
    </View>
  );
};

export default RegisterForm;
