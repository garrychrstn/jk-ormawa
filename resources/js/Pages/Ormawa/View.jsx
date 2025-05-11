import { Link } from "@inertiajs/react"
import { Card } from "../Events/Card"
import Layout from "../Layout"

const View = ({ ormawa }) => {
    return (
        <section className="flex flex-col gap-4">
            <h1 className="font-semibold text-lg">{ormawa.name}</h1>
            <header className="desc flex items-center justify-evenly bg-gray-100 p-4 rounded-lg border border-gray-200">
                <div className="flex flex-col items-center">
                    <img src={`/storage/${ormawa.logo}`} alt="ormawa logo" className="w-24 h-24 rounded-full border-2 border-gray-300" />
                </div>
                <div className="">
                    <h1 className="text-xl font-bold text-gray-800">{ormawa.name}</h1>
                    <h1 className="text-sm text-gray-600">{ormawa.description || 'N/A'}</h1>
                </div>
                <div>
                    <h1 className="text-gray-600">Jumlah anggota : {ormawa.members.length}</h1>
                    <h1 className="text-gray-600">Total Event : {ormawa.events.length}</h1>
                </div>
            </header>
            <section>
                <h1 className="my-2">Event Active : </h1>
                <div className="grid grid-cols-5 gap-5">
                    {ormawa.events.map(event => {
                        if (event.active) return (
                            <Link
                                href={`/event/${event.token}`}
                                key={event.id}
                                className="h-full flex hover:bg-slate-50 transition-all"
                            >
                                <Card event={event} className="flex-grow" />
                            </Link>
                        )
                    })}
                </div>
            </section>
            <section>
                <h1 className="my-2">Event Selesai : </h1>
                <div className="grid grid-cols-5 gap-5">
                    {ormawa.events.map(event => {
                        if (!event.active) return (
                            <Link
                                href={`/event/${event.token}`}
                                key={event.id}
                                className="h-full flex hover:bg-slate-50 transition-all"
                            >
                                <Card event={event} className="flex-grow" />
                            </Link>
                        )
                    })}
                </div>
            </section>
        </section>
    )
}

View.layout = (page) => <Layout children={page} />
export default View
