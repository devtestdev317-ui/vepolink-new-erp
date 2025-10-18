import { z } from "zod";
export { z };

const LoginSchema = z.object({
    userId: z.string().min(1, "Required"),
    password: z.string().min(8, "Password must be at least 8 characters")
});

const validateLogin = (data: unknown) => {
    return LoginSchema.parse(data);
};

export { LoginSchema, validateLogin };