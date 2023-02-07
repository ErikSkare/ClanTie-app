import bcrypt from "bcrypt";

export default Object.freeze({
  async hash(password: string) {
    const salt = await bcrypt.genSalt();
    return bcrypt.hash(password, salt);
  },

  async verify(password: string, hash: string) {
    return bcrypt.compare(password, hash);
  },
});
