import {useFormik} from "formik";
import {View, ViewProps} from "react-native";
import {z} from "zod";
import Button from "@/components/Button";
import TextInput from "@/components/TextInput";
import {toFormikValidationSchema} from "zod-formik-adapter";

const InviteSchema = z.object({
  email: z
    .string({required_error: "Kérjük töltsd ki a mezőt!"})
    .email({message: "Kérjük valódi címet adj meg!"}),
});

interface InviteFormProps extends ViewProps {
  clanId: number;
}

const InviteForm: React.FC<InviteFormProps> = ({clanId, ...props}) => {
  const formik = useFormik({
    initialValues: {email: ""},
    validationSchema: toFormikValidationSchema(InviteSchema),
    validateOnBlur: true,
    validateOnChange: false,
    validateOnMount: true,
    onSubmit: (values) => console.log(values, clanId),
  });

  return (
    <View {...props}>
      <TextInput
        label="E-mail címe"
        className="mb-8"
        onChangeText={formik.handleChange("email")}
        onBlur={formik.handleBlur("email")}
        error={formik.touched.email ? formik.errors.email : undefined}
      />
      <Button content="Mehet" onPress={() => formik.handleSubmit()} />
    </View>
  );
};

export default InviteForm;
