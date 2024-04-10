import { z } from "zod";
const schema = z.object({
  email: z.string().email(),
});
export const validateEmail = (email: string) => {
  console.log(email);
  try {
    schema.parse({ email });
    return true;
  } catch (error) {
    return false;
  }
};
