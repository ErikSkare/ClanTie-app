import {View, ViewProps} from "react-native";
import {useFormik} from "formik";
import {z} from "zod";
import {toFormikValidationSchema} from "zod-formik-adapter";
import Button from "@/components/Button";
import TextInput from "@/components/TextInput";

const CreateClanSchema = z.object({
  clanName: z.string({required_error: "Kérjük töltsd ki a mezőt!"}),
  nickName: z.string({required_error: "Kérjük töltsd ki a mezőt!"}),
});

const CreateClanForm: React.FC<ViewProps> = ({...props}) => {
  const formik = useFormik({
    initialValues: {clanName: "", nickName: ""},
    validationSchema: toFormikValidationSchema(CreateClanSchema),
    validateOnBlur: true,
    validateOnChange: false,
    validateOnMount: true,
    onSubmit: (values) => console.log(values),
  });

  return (
    <View {...props}>
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
        onChangeText={formik.handleChange("nickName")}
        onBlur={formik.handleBlur("nickName")}
        error={formik.touched.nickName ? formik.errors.nickName : undefined}
      />
      <Button content="Mehet" onPress={() => formik.handleSubmit()} />
    </View>
  );
};

export default CreateClanForm;
