'use client'

import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { useState } from 'react'

export default function CreateEventPage() {
  const { data: session } = useSession()
  const router = useRouter()

  const [form, setForm] = useState({
    title: '',
    description: '',
    location: '',
    date: '',
  })

  const [image, setImage] = useState<File | null>(null)

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  const handleImage = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setImage(e.target.files[0])
    }
  }

  const handleSubmit = async () => {
    let imageUrl = ''

    if (image) {
      const formData = new FormData()
      formData.append('file', image)
      formData.append('upload_preset', 'your_unsigned_preset') // set up in Cloudinary settings

      const res = await fetch(`https://api.cloudinary.com/v1_1/${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}/image/upload`, {
        method: 'POST',
        body: formData,
      })

      const data = await res.json()
      imageUrl = data.secure_url
    }

    const res = await fetch('/api/events/create', {
      method: 'POST',
      body: JSON.stringify({ ...form, imageUrl }),
      headers: { 'Content-Type': 'application/json' },
    })

    if (res.ok) router.push('/events')
  }

  if (!session?.user?.isApproved) return <p className="p-4">You must be an approved member to post events.</p>

  return (
    <div className="max-w-lg mx-auto p-6 space-y-4">
      <h1 className="text-2xl font-bold">Create Event</h1>
      <input name="title" className="input input-bordered w-full" placeholder="Title" onChange={handleChange} />
      <input type="file" accept="image/*" onChange={handleImage} className="file-input file-input-bordered w-full" />
      <textarea name="description" className="textarea textarea-bordered w-full" placeholder="Description" onChange={handleChange} />
      <input name="location" className="input input-bordered w-full" placeholder="Location" onChange={handleChange} />
      <input name="date" type="datetime-local" className="input input-bordered w-full" onChange={handleChange} />
      <button className="btn btn-primary w-full" onClick={handleSubmit}>Submit</button>
    </div>
  )
}
