import { Link } from "@inertiajs/react";
import Layout from "./Layout";
import { Card } from "./Events/Card";

const DashboardAdmin = ({ events, ormawa, totalEvents, recentEvents }) => {
    return (
        <div className="flex flex-col gap-5">
            <h1>Welcome to the Admin Dashboard</h1>
            <div className="statistic">
                <h1 className="text-lg font-semibold mb-4">Overview: </h1>
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    <div className="bg-white p-4 rounded-lg shadow border border-gray-200">
                        <h2 className="text-sm text-gray-600">Event Active</h2>
                        <p className="text-2xl font-bold text-gray-800">{events.length}</p>
                    </div>
                    <div className="bg-white p-4 rounded-lg shadow border border-gray-200">
                        <h2 className="text-sm text-gray-600">Total Events</h2>
                        <p className="text-2xl font-bold text-gray-800">{totalEvents}</p>
                    </div>
                    <div className="bg-white p-4 rounded-lg shadow border border-gray-200">
                        <h2 className="text-sm text-gray-600">Baru saja selesai</h2>
                        <p className="text-2xl font-bold text-gray-800">{recentEvents.length}</p>
                    </div>
                    <div className="bg-white p-4 rounded-lg shadow border border-gray-200">
                        <h2 className="text-sm text-gray-600">Jumlah Ormawa</h2>
                        <p className="text-2xl font-bold text-gray-800">{ormawa.length}</p>
                    </div>
                </div>
            </div>
            <div className="eventactive">
                <h1 className="text-lg font-semibold mb-4">Event Aktif : </h1>
                <div className="events grid md:grid-cols-7 grid-cols-2 gap-3">
                    {events.length > 0 ? (
                        events.map((event) => (
                            <Link
                                href={`/event/${event.token}`}
                                key={event.id}
                                className="h-full flex hover:bg-slate-50 transition-all"
                            >
                                <Card event={event} className="flex-grow" />
                            </Link>
                        ))
                    ) : (
                        <div className="w-full text-gray-500">
                            No event available
                        </div>
                    )}
                </div>
            </div>
            <div className="eventfinsihed">
                <h1 className="text-lg font-semibold mb-4">Baru saja selesai : </h1>
                <div className="events grid md:grid-cols-7 grid-cols-2 gap-3">
                    {recentEvents.length > 0 ? (
                        recentEvents.map((event) => (
                            <Link
                                href={`/event/${event.token}`}
                                key={event.id}
                                className="h-full flex hover:bg-slate-50 transition-all"
                            >
                                <Card event={event} className="flex-grow" />
                            </Link>
                        ))
                    ) : (
                        <div className="w-full text-gray-500">
                            No event available
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

DashboardAdmin.layout = (page) => <Layout children={page} />
export default DashboardAdmin;
