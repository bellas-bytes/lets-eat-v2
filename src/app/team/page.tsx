'use client'

import { useEffect, useState } from 'react'
import { useSession } from 'next-auth/react'

interface Member {
  id: string
  name: string
  role: string
  bio: string
  imageUrl: string
}

export default function TeamPage() {
  const { data: session } = useSession()
  const [members, setMembers] = useState<Member[]>([])
  const [form, setForm] = useState({ name: '', role: '', bio: '', imageUrl: '' })

  useEffect(() => {
    fetch('/api/team').then(res => res.json()).then(setMembers)
  }, [])

  const submit = async () => {
    const res = await fetch('/api/team', {
      method: 'POST',
      body: JSON.stringify(form),
      headers: { 'Content-Type': 'application/json' },
    })
    if (res.ok) {
      const newMember = await res.json()
      setMembers([...members, newMember])
      setForm({ name: '', role: '', bio: '', imageUrl: '' })
    }
  }

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold mb-4">Meet the Team</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
        {members.map(m => (
          <div key={m.id} className="card bg-base-100 shadow">
            <figure><img src={m.imageUrl} alt={m.name} className="h-40 object-cover w-full" /></figure>
            <div className="card-body">
              <h2 className="card-title">{m.name}</h2>
              <p className="text-sm">{m.role}</p>
              <p>{m.bio}</p>
            </div>
          </div>
        ))}
      </div>

      {session?.user?.isApproved && (
        <div className="mt-8">
          <h2 className="text-xl font-bold mb-2">Add Team Member</h2>
          <input className="input input-bordered w-full mb-2" name="name" placeholder="Name" onChange={e => setForm(f => ({ ...f, name: e.target.value }))} />
          <input className="input input-bordered w-full mb-2" name="role" placeholder="Role" onChange={e => setForm(f => ({ ...f, role: e.target.value }))} />
          <textarea className="textarea textarea-bordered w-full mb-2" name="bio" placeholder="Bio" onChange={e => setForm(f => ({ ...f, bio: e.target.value }))} />
          <input className="input input-bordered w-full mb-2" name="imageUrl" placeholder="Image URL" onChange={e => setForm(f => ({ ...f, imageUrl: e.target.value }))} />
          <button className="btn btn-primary" onClick={submit}>Add</button>
        </div>
      )}
    </div>
  )
}
