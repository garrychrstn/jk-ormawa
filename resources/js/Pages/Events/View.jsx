import { useState } from "react";
import Layout from "../Layout";
import { router, useForm, usePage } from "@inertiajs/react";
import { toast } from "react-toastify";
import { Box, Modal } from "@mui/material";
import { defaultModalStyling } from "../utility";
import { Check, ChevronLeft, Trash2 } from "lucide-react";
import axios from "axios";
import { useEffect } from "react";
import ModalLPJ from "./ModalLPJ";
import ModalDocumentation from "./ModalDocumentation";

const View = ({ event }) => {
    document.title = "View Event | MORG"
    const { auth } = usePage().props
    const [page, setPage] = useState("detail");
    const [edit, setEdit] = useState(false);
    const [adminFeedback, setAdminFeedback] = useState(false)
    const [image, setImage] = useState({
        open: false,
        path: ''
    })
    const [lpj, setLpj] = useState({
        open: false,
        data: {}
    })
    const [documentation, setDocumentation] = useState({
        open: false,
        data: {}
    })
    const { data, setData, errors, processing } = useForm(event);

    function update() {
        router.post('/event/update', data, {
            onSuccess: res => {
                toast.success('Event updated')
            },
            onError: err => {
                console.log(err)
                toast.error('Fail to update')
            }
        })
        setEdit(false)
    }
    function activate() {
        axios.post(`/event/active/${event.id}`)
            .then(res => {
                if (!data.active) {
                    toast.success(`Event di aktifkan`);
                    setData("active", true);
                } else {
                    toast.success(`Event di non-aktifkan`);
                    setData("active", false);
                }
            }).catch(err => {
                console.log(err)
            })
    }
    function approve(id, action) {
        axios.post(`/event/approve`, { id, action })
            .then(res => {
                toast.success(action ? 'Pendaftaran diterima' : 'Pendaftaran ditolak')
                const updatedParticipants = data.participant.map(participant =>
                    participant.id === id ? { ...participant, isApproved: action } : participant
                );
                setData("participant", updatedParticipants);
            })
            .catch(err => {

            })
    }
    function downloadLpj() {
        const link = document.createElement('a');
        link.href = `/storage/${event.lpj}`;
        link.download = event.lpj;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    }
    function sendFeedback() {
        router.post('/event/adminfeedback', { eventId: event.id, feedback: data.adminFeedback }, {
            onSuccess: res => {
                toast.success('feedback sent')
                setAdminFeedback(false)
            }
        });
    }
    return (
        <section className="flex flex-col gap-4">
            <header>
                {lpj.open && <ModalLPJ open={lpj.open} close={() => setLpj({ open: false, data: {} })} event={event} />}
                <Modal position='center' open={image.open} onClose={() => setImage({ open: false, path: '' })}>
                    <Box sx={{
                        position: 'absolute',
                        top: '50%',
                        left: '50%',
                        transform: 'translate(-50%, -50%)',
                        width: 600,
                        p: 4,
                        borderRadius: '10px'
                    }}>
                        <img src={`/storage/${image.path}`} className="rounded-md w-full object-contain" />
                    </Box>
                </Modal>
                <Modal position='center' open={adminFeedback} onClose={() => setAdminFeedback(false)} >
                    <Box sx={defaultModalStyling}>
                        <h1>Beri feedback pada event ini</h1>
                        <div className="mb-4">
                            <textarea
                                type="text"
                                value={data.adminFeedback}
                                onChange={(e) => setData('adminFeedback', e.target.value)}
                                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm px-3 py-2 border"
                            />
                        </div>
                        <div className="flex items-center gap-2">
                            <button className="w-full px-3 py-1 hover:bg-slate-500 transition-all rounded-md text-white bg-blue-400">
                                Cancel
                            </button>
                            <button onClick={() => sendFeedback()} className="px-3 py-1 bg-slate-600 hover:bg-slate-700 transition-all rounded-md w-full text-white">
                                Kirim
                            </button>
                        </div>
                    </Box>
                </Modal>
                {documentation.open && <ModalDocumentation open={documentation.open} close={() => setDocumentation({ open: false, data: {} })} event={event} />}
                <div className="flex flex-wrap items-center justify-between">
                    <div>
                        <div className="flex items-center gap-2 mb-2">
                            <button onClick={() => window.history.back()} className="rounded-md p-1 bg-slate-200">
                                <ChevronLeft />
                            </button>
                            <span className="font-semibold">
                                {event.title} <span className={`my-2 inline font-semibold text-sm text-slate-900 ${data.active ? 'bg-green-200' : 'bg-red-200'} rounded-md px-3 py-1`}>
                                    {data.active ? 'active' : 'inactive'}
                                </span>
                            </span>
                        </div>
                        <h1 className="block">
                            <span className="block text-sm italic font-normal">Dibuat oleh : {event.creator.name}</span>
                            <span className="my-2 block text-sm italic font-normal">Link : <span className="bg-slate-200 rounded-md px-3 py-1">{`/event/view/${event.token}`}</span></span>
                        </h1>
                    </div>
                    <div className="ml-auto mt-4 sm:mt-0">
                        <div className="switch flex justify-center mb-2 items-center gap-2 p-1 bg-[#e5ebf0] rounded-lg">
                            <button
                                onClick={() => setPage("detail")}
                                className={`${page === "detail" ? "bg-slate-300" : ""
                                    } rounded-md px-3 py-1.5 transition-all w-full duration-200`}
                            >
                                Detail
                            </button>
                            <button
                                onClick={() => setPage("peserta")}
                                className={`${page === "peserta" ? "bg-slate-300" : ""
                                    } rounded-md px-3 py-1.5 transition-all  w-full duration-200`}
                            >
                                Peserta
                            </button>
                            <button
                                onClick={() => setPage("documentation")}
                                className={`${page === "documentation" ? "bg-slate-300" : ""
                                    } rounded-md px-3 py-1.5 transition-all  w-full duration-200`}
                            >
                                Dokumentasi
                            </button>
                        </div>
                        <div className="flex items-center gap-2">
                            {
                                new Date(event.eventEnd) < new Date() && !event.lpj && auth?.user?.ormawa?.id === event.ormawaId && (
                                    <button onClick={() => setLpj({ open: true, data: event })} className="px-3 py-1 bg-slate-400 hover:bg-slate-500 transition-all rounded-md text-white w-full">
                                        Upload LPJ
                                    </button>
                                )
                            }
                            {event.lpj && auth?.user?.role === 'admin' && (
                                <button onClick={() => setAdminFeedback(true)} className="px-3 py-1 bg-slate-600 hover:bg-slate-700 transition-all rounded-md text-white w-full">
                                    Feedback
                                </button>
                            )}
                            {event.lpj && auth?.user?.ormawa?.id === event.ormawaId && (
                                <button onClick={() => setLpj({ open: true, data: event })} className="px-3 py-1 bg-slate-400 hover:bg-slate-500 transition-all rounded-md text-white w-full">
                                    Edit LPJ
                                </button>
                            )}
                            {event.lpj && (
                                <button onClick={() => downloadLpj()} className="px-3 py-1 bg-slate-400 hover:bg-slate-500 transition-all rounded-md w-full text-white">Download LPJ</button>
                            )}
                            {!event.lpj && auth?.user?.ormawa?.id === event.ormawaId && (
                                <button
                                    onClick={() => activate()}
                                    className={`px-3 py-1 rounded-md transition-colors ${data.active ? 'bg-red-500 text-white hover:bg-red-700' : 'bg-green-500 text-white hover:bg-green-700'}`}
                                >
                                    {data.active ? "Deactivate" : "Activate"}
                                </button>
                            )}
                        </div>
                    </div>
                </div>
            </header>
            <section className="py-4">
                {page === "detail" ? (
                    <div className="detail flex gap-7 justify-center h-full">
                        <div className="w-full">
                            {event.adminFeedback && (
                                <div className="mb-4 bg-slate-200 rounded-md p-4">
                                    <span className="block text-sm font-medium text-gray-700">
                                        Feedback dari kemahasiswaan
                                    </span>
                                    <p>{event.adminFeedback}</p>
                                </div>
                            )}
                            <div className="mb-4">
                                <label className="block text-sm font-medium text-gray-700">
                                    Judul
                                </label>
                                <input
                                    type="text"
                                    value={data.title}
                                    onChange={(e) => setData("title", e.target.value)}
                                    disabled={!edit}
                                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm px-3 py-2 border"
                                />
                            </div>
                            <div className="mb-4">
                                <label className="block text-sm font-medium text-gray-700">
                                    Deskripsi
                                </label>
                                <textarea
                                    value={data.description}
                                    onChange={(e) => setData("description", e.target.value)}
                                    disabled={!edit}
                                    className="mt-1 block w-full h-32 rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm resize-none px-3 py-2 border"
                                />
                            </div>
                            <div className="mb-4">
                                <label className="block text-sm font-medium text-gray-700">
                                    Wa Group
                                </label>
                                <input
                                    type="text"
                                    value={data.waGroup}
                                    onChange={(e) => setData("waGroup", e.target.value)}
                                    disabled={!edit}
                                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm px-3 py-2 border"
                                />
                            </div>
                            <div className="mb-4">
                                <label className="block text-sm font-medium text-gray-700">
                                    Lokasi
                                </label>
                                <input
                                    type="text"
                                    value={data.location}
                                    onChange={(e) => setData("location", e.target.value)}
                                    disabled={!edit}
                                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm px-3 py-2 border"
                                />
                            </div>
                            <div className="grid grid-cols-4 gap-2 items-center">
                                <div className="mb-4">
                                    <label className="block text-sm font-medium text-gray-700">
                                        Tanggal Mulai Pendaftaran
                                    </label>
                                    <input
                                        type="datestring"
                                        value={data.registrationStart}
                                        onChange={(e) => setData("registrationStart", e.target.value)}
                                        disabled={!edit}
                                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm px-3 py-2 border"
                                    />
                                </div>
                                <div className="mb-4">
                                    <label className="block text-sm font-medium text-gray-700">
                                        Tanggal Akhir Pendaftaran
                                    </label>
                                    <input
                                        type="datestring"
                                        value={data.registrationEnd}
                                        onChange={(e) => setData("registrationEnd", e.target.value)}
                                        disabled={!edit}
                                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm px-3 py-2 border"
                                    />
                                </div>
                                <div className="mb-4">
                                    <label className="block text-sm font-medium text-gray-700">
                                        Tanggal Mulai Acara
                                    </label>
                                    <input
                                        type="datestring"
                                        value={data.eventStart}
                                        onChange={(e) => setData("eventStart", e.target.value)}
                                        disabled={!edit}
                                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm px-3 py-2 border"
                                    />
                                </div>
                                <div className="mb-4">
                                    <label className="block text-sm font-medium text-gray-700">
                                        Tanggal Akhir Acara
                                    </label>
                                    <input
                                        type="datestring"
                                        value={data.eventEnd}
                                        onChange={(e) => setData("eventEnd", e.target.value)}
                                        disabled={!edit}
                                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm px-3 py-2 border"
                                    />
                                </div>
                            </div>
                            <div className="mb-4">
                                <label className="block text-sm font-medium text-gray-700">
                                    Harga
                                </label>
                                <input
                                    type="number"
                                    value={data.price}
                                    onChange={(e) => setData("price", e.target.value)}
                                    disabled={!edit}
                                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm px-3 py-2 border"
                                />
                            </div>
                            <div className="mb-4">
                                <label className="block text-sm font-medium text-gray-700">
                                    Poster
                                </label>
                                <input
                                    type="file"
                                    onChange={(e) => setData("poster", e.target.files[0])}
                                    disabled={!edit}
                                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm px-3 py-2 border"
                                />
                            </div>
                            <div className="flex justify-end gap-2 mt-4">
                                {edit && (
                                    <button
                                        onClick={() => setEdit(!edit)}
                                        className="px-3 py-1 bg-slate-200 hover:bg-slate-400 transition-colors rounded-md"
                                    >
                                        Batal
                                    </button>
                                )}
                                {auth?.user?.ormawa?.id === event.ormawaId && (
                                    <button
                                        onClick={() => edit ? update() : setEdit(true)}
                                        className="px-3 py-1 bg-slate-200 hover:bg-slate-400 transition-colors rounded-md"
                                    >
                                        {edit ? "Simpan" : "Edit"}
                                    </button>
                                )}
                            </div>
                        </div>
                        <img
                            src={`/storage/${event.poster}`}
                            className="h-96 rounded-lg"
                        />
                    </div>
                ) : page === 'peserta' ? (
                    <div>
                        <div className="mb-4">
                            <h2 className="text-lg font-semibold">Statistik Pendaftaran</h2>
                            <div className="flex gap-4 mt-2">
                                <div className="p-4 bg-blue-100 rounded-md shadow">
                                    <p className="text-sm font-medium text-gray-700">Total Peserta</p>
                                    <p className="text-xl font-bold text-blue-600">{data.participant.length}</p>
                                </div>
                                <div className="p-4 bg-green-100 rounded-md shadow">
                                    <p className="text-sm font-medium text-gray-700">Peserta Disetujui</p>
                                    <p className="text-xl font-bold text-green-600">{data.participant.filter(p => p.isApproved).length}</p>
                                </div>
                                <div className="p-4 bg-red-100 rounded-md shadow">
                                    <p className="text-sm font-medium text-gray-700">Peserta Ditolak</p>
                                    <p className="text-xl font-bold text-red-600">{data.participant.filter(p => !p.isApproved).length}</p>
                                </div>
                            </div>
                        </div>
                        <div className="overflow-x-auto">
                            <table className="table-auto w-full border-collapse border border-gray-300">
                                <thead>
                                    <tr className="bg-gray-100">
                                        <th className="border border-gray-300 px-4 py-2 text-center font-medium">No</th>
                                        <th className="border border-gray-300 px-4 py-2 text-center font-medium">Nama</th>
                                        <th className="border border-gray-300 px-4 py-2 text-center font-medium">Email</th>
                                        <th className="border border-gray-300 px-4 py-2 text-center font-medium">Nomor WA</th>
                                        <th className="border border-gray-300 px-4 py-2 text-center font-medium">Pembayaran</th>
                                        <th className="border border-gray-300 px-4 py-2 text-center font-medium">Action</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {data.participant.map((participant, index) => (
                                        <tr key={index} className="hover:bg-gray-50">
                                            <td className="border border-gray-300 px-4 py-2 text-center">
                                                {index + 1}
                                            </td>
                                            <td className="border border-gray-300 px-4 py-2 text-center">
                                                {participant.name}
                                            </td>
                                            <td className="border border-gray-300 px-4 py-2 text-center">
                                                {participant.email}
                                            </td>
                                            <td className="border border-gray-300 px-4 py-2 text-center">
                                                <a href={`https://wa.me/${participant.phoneNumber}`} target="_blank">{participant.phoneNumber}</a>
                                            </td>
                                            <td className="border border-gray-300 px-4 py-2 text-center">
                                                <button
                                                    onClick={() => setImage({ open: true, path: participant.payment })}
                                                    className="px-2 py-1 text-sm bg-slate-500 text-white rounded-md"
                                                >
                                                    Cek Bukti
                                                </button>
                                            </td>
                                            <td className="border border-gray-300 px-4 py-2 text-center">
                                                {/* <input
                                                    type="checkbox"
                                                    checked={participant.isApproved}
                                                    className="h-4 w-4"
                                                /> */}
                                                {participant.isApproved ? (
                                                    <button onClick={() => approve(participant.id, false)} className="bg-red-400 p-1.5 rounded-md text-white">
                                                        <Trash2 size={18} />
                                                    </button>
                                                ) : (
                                                    <button onClick={() => approve(participant.id, true)} className="bg-green-400 p-1.5 rounded-md text-white">
                                                        <Check size={18} />
                                                    </button>
                                                )}
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                        <div className="overflow-x-auto">
                            <h2 className="text-lg font-semibold">Feedback peserta</h2>
                            <table className="table-auto w-full border-collapse border border-gray-300">
                                <thead>
                                    <tr className="bg-gray-100">
                                        <th className="border border-gray-300 px-4 py-2 text-center font-medium">No</th>
                                        <th className="border border-gray-300 px-4 py-2 text-center font-medium">Nama</th>
                                        <th className="border border-gray-300 px-4 py-2 text-center font-medium">Email</th>
                                        <th className="border border-gray-300 px-4 py-2 text-center font-medium">Feedback</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {data.feedback.map((feed, index) => (
                                        <tr key={index} className="hover:bg-gray-50">
                                            <td className="border border-gray-300 px-4 py-2 text-center">
                                                {index + 1}
                                            </td>
                                            <td className="border border-gray-300 px-4 py-2 text-center">
                                                {feed.name ? (
                                                    <span>{feed.name}</span>
                                                ) : (
                                                    <span className="text-gray-600 italic">
                                                        anonimus
                                                    </span>
                                                )}
                                            </td>
                                            <td className="border border-gray-300 px-4 py-2 text-center">
                                                {feed.email ? (
                                                    <span>{feed.email}</span>
                                                ) : (
                                                    <span className="text-gray-600 italic">
                                                        anonimus
                                                    </span>
                                                )}
                                            </td>
                                            <td className="border border-gray-300 px-4 py-2 text-center">
                                                {feed.feedback}
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                ) : (
                    <div>
                        <h2 className="text-lg font-semibold">Dokumentasi</h2>
                        <header className="w-full flex items-center justify-end mb-4">
                            <button onClick={() => setDocumentation({ ...documentation, open: true })} className="bg-slate-400 rounded-md text-white px-2 py-1 hover:bg-slate-500 transition-all">
                                Tambah Dokumentasi
                            </button>
                        </header>
                        <div className="flex justify-center">
                            <div className="docs grid grid-cols-2 md:grid-cols-6 gap-3">
                                {event.docs
                                    .filter(doc => ['png', 'jpg', 'jpeg'].includes(doc.type))
                                    .map((doc, index) => (
                                        <img
                                            key={index}
                                            src={`/storage/${doc.doc}`}
                                            alt={`Documentation ${index + 1}`}
                                            className="w-64 object-cover rounded-md"
                                        />
                                    ))}
                            </div>
                        </div>
                    </div>
                )}
            </section>
        </section >
    );
};

View.layout = (page) => <Layout children={page} />;
export default View;
