'use client'

import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'

interface User {
  id: string
  email: string
  name: string | null
  isApproved: boolean
}

export default function AdminPage() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [users, setUsers] = useState<User[]>([])

  useEffect(() => {
    if (status === 'loading') return

    if (!session?.user?.isAdmin) {
      router.push('/') // redirect non-admins
    }
  }, [session, status, router])

  useEffect(() => {
    if (session?.user?.isAdmin) {
      fetch('/api/admin/users').then(res => res.json()).then(setUsers)
    }
  }, [session])

  if (status === 'loading' || !session?.user?.isAdmin) {
    return <p className="p-4">Checking access...</p>
  }

    async function approve(email: string): Promise<void> {
        try {
            const response = await fetch('/api/admin/approve', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ email }),
            });

            if (!response.ok) {
                throw new Error('Failed to approve user');
            }

            setUsers(prevUsers =>
                prevUsers.map(user =>
                    user.email === email ? { ...user, isApproved: true } : user
                )
            );
        } catch (error) {
            console.error('Error approving user:', error);
        }
    }

  return (
    <div className="p-6 max-w-xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">Member Approval</h1>
      <ul className="space-y-3">
        {users.map(user => (
          <li key={user.email} className="flex justify-between items-center p-4 border rounded bg-base-100">
            <div>
              <p className="font-medium">{user.name || 'No name'}</p>
              <p className="text-sm opacity-70">{user.email}</p>
            </div>
            {user.isApproved ? (
              <span className="badge badge-success">Approved</span>
            ) : (
              <button className="btn btn-sm btn-primary" onClick={() => approve(user.email)}>
                Approve
              </button>
            )}
          </li>
        ))}
      </ul>
    </div>
  )
}
