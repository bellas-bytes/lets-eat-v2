'use client'

import Link from 'next/link'
import { useSession, signIn, signOut } from 'next-auth/react'

export default function Navbar() {
  const { data: session } = useSession()

  return (
    <div className="navbar bg-base-100 border-b">
      <div className="flex-1">
        <Link href="/" className="btn btn-ghost text-xl">✨ Club Portal</Link>
      </div>
      <div className="flex-none">
        <ul className="menu menu-horizontal px-1 gap-1">
          <li><Link href="/events">Events</Link></li>
          <li><Link href="/team">Team</Link></li>
          <li><Link href="/resources">Resources</Link></li>
          {!session ? (
            <li><button className="btn btn-sm btn-outline" onClick={() => signIn()}>Login</button></li>
          ) : (
            <li><button className="btn btn-sm" onClick={() => signOut()}>Logout</button></li>
          )}
        </ul>
      </div>
    </div>
  )
}
