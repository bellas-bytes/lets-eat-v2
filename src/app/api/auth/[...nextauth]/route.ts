import NextAuth, { NextAuthOptions } from "next-auth"
import EmailProvider from "next-auth/providers/email"
import { PrismaClient } from '@prisma/client'
import { Resend } from "resend"
import { PrismaAdapter } from '@next-auth/prisma-adapter'

const prisma = new PrismaClient()
const resend = new Resend(process.env.RESEND_API_KEY!)

export const authOptions: NextAuthOptions = {
  adapter: PrismaAdapter(prisma),
  debug: true,
  providers: [
    EmailProvider({
      async sendVerificationRequest({ identifier, url }) {
        await resend.emails.send({
          from: "Your App <onboarding@resend.dev>",
          to: [identifier],
          subject: "Sign in to Your App",
          html: `<p>Click <a href="${url}">here</a> to sign in.</p>`,
        })
      },
    }),
  ],
 callbacks: {
  async signIn({ user }) {
    console.log('signIn user:', user)

    const existing = await prisma.user.findUnique({ where: { email: user.email! } })

    if (!existing) {
      await prisma.user.create({
        data: {
          email: user.email!,
          name: user.name,
          isApproved: false,
          isAdmin: false,
        },
      })
      console.log('New user created but not approved')
      return false
    }

    console.log('Existing user isApproved:', existing.isApproved)
    return existing.isApproved
  },
    async session({ session }) {
      if (session.user?.email) {
        const user = await prisma.user.findUnique({ where: { email: session.user.email } })
        session.user.id = user?.id
        session.user.isApproved = user?.isApproved
        session.user.isAdmin = user?.isAdmin
      }
      return session
    },
  },
}

const handler = NextAuth(authOptions)
export { handler as GET, handler as POST }
