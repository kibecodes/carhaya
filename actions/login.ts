"use server";

import * as z from "zod";
import { LoginSchema } from "@/schemas";
import axios from "axios";
import { jwtDecode } from "@/utils/jwt";

export const login = async (values: z.infer<typeof LoginSchema>) => {
  const validatedFields = LoginSchema.safeParse(values);

  if (!validatedFields) {
    return { error: "Invalid Fields!" };
  }

  const response = await axios.post(
    `https://carhire.transfa.org/api/auth/login`,
    validatedFields.data
  );

  if (response.status !== 200) {
    return { error: "failed response" };
  }

  const { token } = response.data;

  const decodedToken = jwtDecode(token);
  const { UserId, role } = decodedToken.payload;

  if (!decodedToken.payload) {
    return { error: "Failed to decode token!" };
  }

  return {
    success: "Login successful!",
    token,
    UserId,
    role,
  };
};
