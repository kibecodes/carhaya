import NextAuth, { DefaultSession, DefaultUser } from "next-auth";
import Facebook from "next-auth/providers/facebook";
import Google from "next-auth/providers/google";
import Credentials from "next-auth/providers/credentials";
import { JWT } from "next-auth/jwt";
import axios from "axios";
import { jwtDecode } from "./utils/jwt";

declare module "next-auth" {
  interface Session {
    user: {
      id?: string;
      role: string;
      accessToken: string;
    } & DefaultSession["user"];
  }

  interface User extends DefaultUser {
    id?: string;
    role: string;
    accessToken: string;
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    id: string;
    role: string;
    accessToken: string;
  }
}

interface DecodedPayload {
  UserId: string;
  email: string;
  role: string;
  sub: string;
  jti: string;
  nbf: number;
  exp: number;
  iat: number;
}

export const { auth, handlers, signIn, signOut } = NextAuth({
  pages: {
    signIn: "/login",
    error: "/error",
  },
  providers: [
    Facebook,
    Google,
    Credentials({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "text" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        try {
          const response = await axios.post(
            "https://carhire.transfa.org/api/auth/login",
            {
              email: credentials.email,
              password: credentials.password,
            }
          );

          if (response.status === 200) {
            const { token } = response.data;
            const decodedToken = jwtDecode(token);

            let payload: DecodedPayload;
            payload = JSON.parse(decodedToken.payload) as DecodedPayload;

            const { UserId, role, email } = payload;
            const user = { accessToken: token, id: UserId, role, email };

            return user;
          } else {
            throw new Error("Invalid credentials");
          }
        } catch (error) {
          console.error(error);
          throw new Error("Login failed");
        }
      },
    }),
  ],
  session: {
    strategy: "jwt",
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.accessToken = user.accessToken;
        token.role = user.role;
        if (user.id) token.id = user.id;
      }
      return token;
    },

    async session({ session, token }) {
      session.user.accessToken = token.accessToken;
      session.user.role = token.role;
      session.user.id = token.id;

      return session;
    },
  },
  secret: process.env.NEXTAUTH_SECRET,
});
