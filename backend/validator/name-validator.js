import z from "zod";

const nameSchema = z.object({
  firstName: z
    .string({ required_error: "First name is required" })
    .trim()
    .min(3, { message: "First name must be at least 3 characters" }),
  lastName: z
    .string({ required_error: "Last name is required" })
    .trim()
    .min(3, { message: "Last name must be at least 3 characters" }),
});

export default nameSchema;
