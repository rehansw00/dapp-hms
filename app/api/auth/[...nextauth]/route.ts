import NextAuth from 'next-auth';
import { MongoDBAdapter } from '@next-auth/mongodb-adapter';
import CredentialsProvider from 'next-auth/providers/credentials';
import { MongoClient } from 'mongodb';
import bcrypt from 'bcryptjs';

const clientPromise = MongoClient.connect(process.env.MONGODB_URI!);

const authOptions = {
  adapter: MongoDBAdapter(clientPromise),
  providers: [
    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          throw new Error('Email and password are required');
        }

        const client = await clientPromise;
        const db = client.db('MongoDB');

        const user = await db.collection('users').findOne({
          email: credentials.email
        });

        if (!user || !user.password) {
          throw new Error('Invalid credentials');
        }

        const isValid = await bcrypt.compare(credentials.password, user.password);
        if (!isValid) {
          throw new Error('Invalid credentials');
        }

        return {
          id: user._id.toString(),
          email: user.email,
          name: user.name,
          role: user.role
        };
      }
    })
  ],
  pages: {
    signIn: '/login',
    error: '/login?error=AuthFailed',
    newUser: null
  },
  session: {
    strategy: 'jwt' as const, // Ensure the strategy is correctly typed
    maxAge: 30 * 24 * 60 * 60
  },
  callbacks: {
    async jwt({ token, user }: { token: any; user?: any }) {
      if (user) {
        token.id = user.id;
        token.role = user.role;
      }
      return token;
    },
    async session({ session, token }: { session: any; token: any }) {
      if (token && session.user) {
        session.user.id = token.id;
        session.user.role = token.role;
      }
      return session;
    }
  }
};

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };