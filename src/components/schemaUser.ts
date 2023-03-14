import { z } from 'zod';

export const SchemaLogin = z.object({
  email: z.string().email({ message: 'It`s must be email' }),
  password: z.string().min(4, { message: 'Password must be more than 4' }),
});

export const SchemaSignUp = z
  .object({
    email: z.string().email({ message: 'It`s must be email' }),
    password: z.string().min(4, { message: 'Password must be more than 4' }),
    passwordAgain: z
      .string()
      .min(4, { message: 'Password must be more than 4' }),
    firstName: z.string().nonempty(),
    lastName: z.string().nonempty(),
  })
  .refine((data) => data.password === data.passwordAgain, {
    message: 'Password don`t match',
  });
export const SchemaResetPass = z
  .object({
    email: z.string().email({ message: 'It`s must be email' }),
    password: z.string().min(4, { message: 'Password must be more than 4' }),
    passwordAgain: z
      .string()
      .min(4, { message: 'Password must be more than 4' }),
  })
  .refine((data) => data.password === data.passwordAgain, {
    message: 'Password don`t match',
  });
