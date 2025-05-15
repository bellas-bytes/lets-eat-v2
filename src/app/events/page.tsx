'use client'
import { prisma } from '@/lib/prisma'

export default async function EventsPage() {
  const events = await prisma.event.findMany({ orderBy: { date: 'asc' } })

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-4">Upcoming Events</h1>
      <div className="grid gap-6">
        {events.map((event: {
            id: string
            title: string
            imageUrl: string
            description: string
            location: string
            date: Date
            }) => (
            <div key={event.id} className="card bg-base-100 shadow">
                <figure><img src={event.imageUrl} alt={event.title} className="w-full h-64 object-cover" /></figure>
                <div className="card-body">
                <h2 className="card-title">{event.title}</h2>
                <p>{event.description}</p>
                <p className="text-sm opacity-70">{event.location}</p>
                <p className="text-sm opacity-70">{new Date(event.date).toLocaleString()}</p>
                </div>
            </div>
            ))}
      </div>
    </div>
  )
}
