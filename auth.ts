import NextAuth from "next-auth"
import Google from "next-auth/providers/google"
import Credentials from "next-auth/providers/credentials"
import axios from "axios"

type AuthUser = {
  id?: string
  accessToken?: string
}

type SessionWithAccessToken = {
  user: {
    id?: string
  }
  accessToken?: string
}

export const { handlers, auth, signIn, signOut } = NextAuth({
  providers: [
    Google({
      clientId: process.env.AUTH_GOOGLE_ID || process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.AUTH_GOOGLE_SECRET || process.env.GOOGLE_CLIENT_SECRET,
    }),
    Credentials({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
            console.log("[DEBUG-AUTH] Missing credentials");
            return null;
        }
        
        const apiUrl = process.env.NEXT_PUBLIC_API_URL;
        console.log(`[DEBUG-AUTH] Calling API: ${apiUrl}/auth/login with Email: ${credentials.email}`);
        
        try {
          const res = await axios.post(`${apiUrl}/auth/login`, {
            email: credentials.email,
            password: credentials.password,
          })
          
          if (res.status === 200 && res.data.user) {
            return {
              ...res.data.user,
              accessToken: res.data.token, 
            }
          }
          return null
        } catch {
          return null
        }
      }
    })
  ],
  session: { strategy: "jwt" },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        const authUser = user as typeof user & AuthUser
        token.id = authUser.id
        token.accessToken = authUser.accessToken
      }
      return token
    },
    async session({ session, token }) {
      if (token) {
        const sessionWithAccessToken = session as typeof session & SessionWithAccessToken
        sessionWithAccessToken.user.id = token.id as string
        sessionWithAccessToken.accessToken = token.accessToken as string | undefined
      }
      return session
    }
  },
  pages: {
    signIn: "/login",
  }
})
