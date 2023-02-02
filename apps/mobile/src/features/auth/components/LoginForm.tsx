import {View, ViewProps} from "react-native";
import {Formik} from "formik";
import {z} from "zod";
import {toFormikValidationSchema} from "zod-formik-adapter";
import TextInput from "@/components/TextInput";
import Button from "@/components/Button";

const LoginSchema = z.object({
  email: z
    .string({required_error: "Kérjük töltsd ki a mezőt!"})
    .email({message: "Kérjük valódi címet adj meg!"}),
  password: z
    .string({required_error: "Kérjük töltsd ki a mezőt!"})
    .min(7, "Legalább 7 karakterből kell állnia!"),
});

const LoginForm: React.FC<ViewProps> = ({...props}) => {
  return (
    <View {...props}>
      <Formik
        initialValues={{email: "", password: ""}}
        validationSchema={toFormikValidationSchema(LoginSchema)}
        validateOnBlur={true}
        validateOnChange={false}
        validateOnMount={true}
        onSubmit={(values) => {
          console.log(values);
        }}
      >
        {({
          handleChange,
          handleBlur,
          handleSubmit,
          values,
          touched,
          errors,
          isValid,
        }) => (
          <>
            <TextInput
              onChangeText={handleChange("email")}
              onBlur={handleBlur("email")}
              value={values.email}
              label="E-mail cím"
              containerClassName="mb-4"
              error={touched.email ? errors.email : undefined}
            />
            <TextInput
              onChangeText={handleChange("password")}
              onBlur={handleBlur("password")}
              value={values.password}
              label="Jelszó"
              secureTextEntry={true}
              error={touched.password ? errors.password : undefined}
            />
            <Button
              content="Bejelentkezés"
              className="mt-8"
              onPress={() => handleSubmit()}
              disabled={!isValid}
            />
          </>
        )}
      </Formik>
    </View>
  );
};

export default LoginForm;
