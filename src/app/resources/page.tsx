'use client'

import { useEffect, useState } from 'react'
import { useSession } from 'next-auth/react'

interface Resource {
  id: string
  title: string
  url: string
  description: string
}

export default function ResourcesPage() {
  const { data: session } = useSession()
  const [resources, setResources] = useState<Resource[]>([])
  const [form, setForm] = useState({ title: '', url: '', description: '' })

  useEffect(() => {
    fetch('/api/resources').then(res => res.json()).then(setResources)
  }, [])

  const submit = async () => {
    const res = await fetch('/api/resources', {
      method: 'POST',
      body: JSON.stringify(form),
      headers: { 'Content-Type': 'application/json' },
    })
    if (res.ok) {
      const newItem = await res.json()
      setResources([...resources, newItem])
      setForm({ title: '', url: '', description: '' })
    }
  }

  return (
    <div className="p-6 max-w-3xl mx-auto">
      <h1 className="text-3xl font-bold mb-4">Resources</h1>
      <ul className="space-y-4 mb-6">
        {resources.map(r => (
          <li key={r.id} className="border p-4 rounded bg-base-100">
            <a href={r.url} className="text-xl font-semibold text-primary hover:underline">{r.title}</a>
            <p className="text-sm">{r.description}</p>
          </li>
        ))}
      </ul>

      {session?.user?.isApproved && (
        <div>
          <h2 className="text-xl font-bold mb-2">Add Resource</h2>
          <input className="input input-bordered w-full mb-2" name="title" placeholder="Title" onChange={e => setForm(f => ({ ...f, title: e.target.value }))} />
          <input className="input input-bordered w-full mb-2" name="url" placeholder="URL" onChange={e => setForm(f => ({ ...f, url: e.target.value }))} />
          <textarea className="textarea textarea-bordered w-full mb-2" name="description" placeholder="Description" onChange={e => setForm(f => ({ ...f, description: e.target.value }))} />
          <button className="btn btn-primary" onClick={submit}>Add</button>
        </div>
      )}
    </div>
  )
}
