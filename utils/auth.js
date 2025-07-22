import { PrismaAdapter } from "@next-auth/prisma-adapter";
import { prisma } from "./prisma";
import CredentialsProvider from "next-auth/providers/credentials";
import { getServerSession } from "next-auth";
import { compare } from "bcrypt";

export const authOptions = {
  adapter: PrismaAdapter(prisma),
  providers: [
    CredentialsProvider({
      name: "credentials",
      credentials: {
        email: { label: "email", type: "text" },
        password: { label: "password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials.email || !credentials.password) {
          throw new Error("Invalid credentials");
        }
        const user = await prisma.user.findUnique({
          where: {
            email: credentials.email,
          },
          select: {
            id: true,
            email: true,
            name: true,
            password: true,
            initialCapital: true,
          },
        });
        if (!user || !user.password) {
          throw new Error("Invalid Credentials!");
        }
        const isValid = await compare(credentials.password, user.password);

        if (!isValid) {
          throw new Error("Invalid credentials");
        }
        return user;
      },
    }),
  ],

  pages: {
    signIn: "/",
  },
  session: {
    strategy: "jwt",
  },
  secret: process.env.NEXTAUTH_SECRET,
  callbacks: {
    async session({ session, token }) {
      if (token) {
        session.user.id = token.id;
        session.user.name = token.name;
        session.user.email = token.email;
        session.user.initialCapital = token.initialCapital;
      }
      return session;
    },
    async jwt({ token, user, trigger, session }) {
      if (user) {
        (token.id = user.id),
          (token.email = user.email),
          (token.name = user.name),
          (token.initialCapital = user.initialCapital ?? 0);
      }

      if (trigger === "update" && session?.name) {
        token.name = session.name;
      }
      if (trigger === "update" && session?.initialCapital !== undefined) {
        token.initialCapital = session.initialCapital;
      }
      return token;
    },
  },
};

export const getAuthSession = () => getServerSession(authOptions);
