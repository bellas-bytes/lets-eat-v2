'use client'

import { useEffect, useState } from 'react'

interface User {
  id: string
  email: string
  name: string | null
  isApproved: boolean
}

export default function AdminPage() {
  const [users, setUsers] = useState<User[]>([])

  useEffect(() => {
    fetch('/api/admin/users').then(res => res.json()).then(setUsers)
  }, [])

  const approve = async (email: string) => {
    await fetch('/api/admin/approve', {
      method: 'POST',
      body: JSON.stringify({ email }),
      headers: { 'Content-Type': 'application/json' },
    })
    setUsers(users.map(u => u.email === email ? { ...u, isApproved: true } : u))
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
