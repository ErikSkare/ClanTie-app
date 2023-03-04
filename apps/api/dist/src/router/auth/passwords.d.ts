declare const _default: Readonly<{
    hash(password: string): Promise<string>;
    verify(password: string, hash: string): Promise<boolean>;
}>;
export default _default;
