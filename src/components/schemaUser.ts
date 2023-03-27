import { z } from 'zod';

export const SchemaLogin = z.object({
  email: z.string().email({ message: 'It must be email' }),
  password: z.string().min(4, { message: 'Password must be more than 4' }),
});

export const SchemaSignUp = z
  .object({
    email: z.string().email({ message: 'It must be email' }),
    password: z.string().min(4, { message: 'Password must be more than 4' }),
    passwordAgain: z
      .string()
      .min(4, { message: 'Password must be more than 4' }),
    firstName: z.string().nonempty(),
    lastName: z.string().nonempty(),
  })
  .refine((data) => data.password === data.passwordAgain, {
    message: 'Password doesn`t match',
  });
export const SchemaResetPass = z
  .object({
    email: z.string().email({ message: 'It must be email' }),
    password: z.string().min(4, { message: 'Password must be more than 4' }),
    passwordAgain: z
      .string()
      .min(4, { message: 'Password must be more than 4' }),
  })
  .refine((data) => data.password === data.passwordAgain, {
    message: 'Password doesn`t match',
  });

  export const SchemaNewDialogue = z
  .object({
    nameDialogue: z.string().min(4, { message: 'Chat name must be more than 4 letters' }),
    emailTo : z.string().email({ message: 'It must be email' })

  })
