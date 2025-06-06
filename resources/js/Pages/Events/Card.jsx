import { usePage } from "@inertiajs/react"
import { formatLocalizedDate } from "../utility"

export const Card = ({ event }) => {
    const { auth } = usePage().props
    return (
        <section className="border border-gray-300 rounded-2xl p-1.5 shadow-sm">
            <img src={`/storage/${event.poster}`} alt={event.title} className="w-full aspect-square object-cover rounded-lg" />
            <div className="p-4">
                {auth?.user?.role === 'admin' && event?.ormawa?.name && (
                    <h2 className="text-xs font-semibold text-gray-700 italic mb-1.5">By {event?.ormawa?.name}</h2>
                )}
                <h2 className="text-lg font-semibold mb-1.5">{event.title}</h2>
                <p className="text-gray-600">
                    {event.description.length > 20 ? `${event.description.slice(0, 20)}...` : event.description}
                </p>
                <p className="text-gray-500">Location: {event.location}</p>
                <p className="text-gray-500">
                    Registration: {formatLocalizedDate(event.registrationStart)} - {formatLocalizedDate(event.registrationEnd)}
                </p>
                <p className="text-gray-500">
                    Event: {formatLocalizedDate(event.eventStart)} - {formatLocalizedDate(event.eventEnd)}
                </p>
            </div>
        </section >
    )
}
