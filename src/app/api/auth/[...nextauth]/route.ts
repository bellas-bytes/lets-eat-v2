import NextAuth from "next-auth"
import EmailProvider from "next-auth/providers/email"
import { Resend } from "resend"
import { PrismaClient } from "@prisma/client"

const prisma = new PrismaClient()
const resend = new Resend(process.env.RESEND_API_KEY!)

const handler = NextAuth({
  providers: [
    EmailProvider({
  async sendVerificationRequest({ identifier, url }) {
    const { error } = await resend.emails.send({
      from: "Your App <onboarding@resend.dev>",
      to: [identifier],
      subject: "Sign in to Your App",
      html: `
        <div style="font-family: sans-serif; padding: 1rem;">
          <h2>Sign in to Your App</h2>
          <p>Click the button below to log in:</p>
          <a href="${url}" style="
            display: inline-block;
            padding: 10px 20px;
            margin-top: 1rem;
            background-color: #6366f1;
            color: white;
            text-decoration: none;
            border-radius: 6px;
          ">Sign in</a>
          <p>If you didn't request this, you can ignore this email.</p>
        </div>
      `,
    })

    if (error) {
      console.error("Resend error:", error)
      throw new Error("Could not send email.")
    }
  },
}),
  ],
  callbacks: {
    async signIn({ user }) {
      const existingUser = await prisma.user.findUnique({
        where: { email: user.email! },
      })

      if (!existingUser) {
        await prisma.user.create({
          data: {
            email: user.email!,
            name: user.name,
            isApproved: false,
          },
        })
        return false
      }

      return existingUser.isApproved
    },
    async session({ session }) {
      if (session.user?.email) {
        const user = await prisma.user.findUnique({
          where: { email: session.user.email },
        })
        session.user.id = user?.id
        session.user.isApproved = user?.isApproved
      }
      return session
    },
  },
})

export { handler as GET, handler as POST }
