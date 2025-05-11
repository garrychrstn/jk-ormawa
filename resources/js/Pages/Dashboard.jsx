
import { useState } from "react";
import Layout from "./Layout";
import { Link, router, useForm } from "@inertiajs/react";
import { toast } from "react-toastify";
import { Card } from "./Events/Card";

const Dashboard = ({ ormawa, events, eventCount, participantSum, participantAverage }) => {
    const [edit, setEdit] = useState(false)
    const { data, setData, processing } = useForm({
        logo: null, name: ormawa.name, description: ormawa.description
    })
    function update() {
        router.post('/ormawa/update', data, {
            onSuccess: () => {
                toast.success('Ormawa Updated')
            },
            onError: () => {
                toast.error('Ormawa Updated')
            }
        })
    }
    return (
        <div className="flex flex-col gap-5">
            <h1>Welcome to the Dashboard</h1>
            <header className="desc flex items-center justify-evenly bg-gray-100 p-4 rounded-lg border border-gray-200">
                <div className="flex flex-col items-center">
                    {edit && (
                        <label className="text-sm text-gray-600 mb-1">Logo</label>
                    )}
                    {edit ? (
                        <input
                            type="file"
                            onChange={(e) => setData('logo', e.target.files[0])}
                            className="block w-full text-sm text-gray-900 border border-gray-300 rounded-lg cursor-pointer bg-gray-50 focus:outline-none"
                        />
                    ) : (
                        <img src={`/storage/${ormawa.logo}`} alt="ormawa logo" className="w-24 h-24 rounded-full border-2 border-gray-300" />
                    )}
                </div>
                <div className="">
                    {edit && (
                        <label className="text-sm text-gray-600 mb-1 block">Name</label>
                    )}
                    {edit ? (
                        <input
                            type="text"
                            value={data.name}
                            onChange={(e) => setData('name', e.target.value)}
                            className="block w-full text-sm text-gray-900 border border-gray-300 rounded-lg p-2 focus:outline-none"
                        />
                    ) : (
                        <h1 className="text-xl font-bold text-gray-800">{ormawa.name}</h1>
                    )}
                    {edit && (
                        <label className="text-sm text-gray-600 mb-1 block">Description</label>
                    )}
                    {edit ? (
                        <textarea
                            type="text"
                            value={data.description}
                            onChange={(e) => {
                                if (e.target.value.length <= 244) {
                                    setData('description', e.target.value);
                                }
                            }}
                            className="block w-full text-sm text-gray-900 border border-gray-300 rounded-lg p-2 focus:outline-none"
                        />
                    ) : (
                        <h1 className="text-sm text-gray-600">{ormawa.description || 'N/A'}</h1>
                    )}
                </div>
                <div className="text-white rounded-md flex-col justify-center items-center">
                    {!edit && (
                        <button onClick={() => setEdit(true)} className="rounded-md px-4 py-1 block bg-slate-400 w-full my-1">
                            Edit
                        </button>
                    )}
                    {edit && (
                        <>
                            <button onClick={() => update()} className="rounded-md px-4 py-1 block bg-slate-400 w-full my-1">
                                Simpan
                            </button>
                            <button onClick={() => setEdit(false)} className="rounded-md px-4 py-1 block bg-blue-400 w-full">
                                Batal
                            </button>
                        </>
                    )}
                </div>
            </header>
            <div className="statistic">
                <h1 className="text-lg font-semibold mb-4">Overview: </h1>
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    <div className="bg-white p-4 rounded-lg shadow border border-gray-200">
                        <h2 className="text-sm text-gray-600">Total Member</h2>
                        <p className="text-2xl font-bold text-gray-800">{ormawa.members.length}</p>
                    </div>
                    <div className="bg-white p-4 rounded-lg shadow border border-gray-200">
                        <h2 className="text-sm text-gray-600">Total Events</h2>
                        <p className="text-2xl font-bold text-gray-800">{eventCount}</p>
                    </div>
                    <div className="bg-white p-4 rounded-lg shadow border border-gray-200">
                        <h2 className="text-sm text-gray-600">Total Peserta</h2>
                        <p className="text-2xl font-bold text-gray-800">{participantSum}</p>
                    </div>
                    <div className="bg-white p-4 rounded-lg shadow border border-gray-200">
                        <h2 className="text-sm text-gray-600">Rata rata peserta per Event</h2>
                        <p className="text-2xl font-bold text-gray-800">{participantAverage} / Event</p>
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
        </div>
    );
};

Dashboard.layout = (page) => <Layout children={page} />
export default Dashboard;
