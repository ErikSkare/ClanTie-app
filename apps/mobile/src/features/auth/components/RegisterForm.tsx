import {View, ViewProps} from "react-native";
import {Formik} from "formik";
import {z} from "zod";
import {toFormikValidationSchema} from "zod-formik-adapter";
import TextInput from "@/components/TextInput";
import Button from "@/components/Button";

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
  return (
    <View {...props}>
      <Formik
        initialValues={{email: "", firstName: "", lastName: "", password: ""}}
        validationSchema={toFormikValidationSchema(RegisterSchema)}
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
              onChangeText={handleChange("lastName")}
              onBlur={handleBlur("lastName")}
              value={values.lastName}
              label="Vezetéknév"
              containerClassName="mb-4"
              error={touched.lastName ? errors.lastName : undefined}
            />
            <TextInput
              onChangeText={handleChange("firstName")}
              onBlur={handleBlur("firstName")}
              value={values.firstName}
              label="Keresztnév"
              containerClassName="mb-4"
              error={touched.firstName ? errors.firstName : undefined}
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
              content="Regisztráció"
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

export default RegisterForm;
