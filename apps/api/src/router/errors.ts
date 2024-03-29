export type FieldErrors = {
  [x: string]: string[] | undefined;
  [x: number]: string[] | undefined;
  [x: symbol]: string[] | undefined;
};

export class ApplicationError extends Error {
  constructor(message: string) {
    super(message);
  }
}

export class ValidationError extends ApplicationError {
  fieldErrors: FieldErrors;

  constructor(fieldErrors: FieldErrors) {
    super("Incorrect input!");
    this.fieldErrors = fieldErrors;
  }
}
