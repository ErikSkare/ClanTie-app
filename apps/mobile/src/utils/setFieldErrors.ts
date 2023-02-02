export type SetterFunction = (field: string, message: string) => void;

export type FieldErrors = {
  [x: string]: string[] | undefined;
  [x: number]: string[] | undefined;
  [x: symbol]: string[] | undefined;
};

export default function setFieldErrors(
  setter: SetterFunction,
  fieldErrors: FieldErrors | null
) {
  if (!fieldErrors) return;

  for (const [key, value] of Object.entries(fieldErrors)) {
    if (!key || !value || !value[0]) return;
    setter(key, value[0]);
  }
}
