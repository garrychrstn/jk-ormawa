import { useState } from "react";
import Layout from "../Layout";
import { router, useForm } from "@inertiajs/react";
import { toast } from "react-toastify";
import { Box, Modal } from "@mui/material";
import { defaultModalStyling } from "../utility";

const View = ({ event }) => {
    const [page, setPage] = useState("detail");
    const [edit, setEdit] = useState(false);
    const [image, setImage] = useState({
        open: false,
        path: ''
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
    return (
        <section className="flex flex-col gap-4">
            <header className="mb-2">
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
                <div className="flex items-center justify-between">
                    <h1 className="font-semibold">
                        <span>
                            {event.title}
                        </span>
                        <span className="block text-sm italic font-normal">Dibuat oleh : {event.creator.name}</span>
                        <span className="block text-sm italic font-normal">Link : {`/event/register/${event.token}`}</span>
                    </h1>
                    <div className="switch flex items-center gap-2 p-1 bg-[#e5ebf0] rounded-lg">
                        <button
                            onClick={() => setPage("detail")}
                            className={`${page === "detail" ? "bg-slate-300" : ""
                                } rounded-md px-3 py-1.5 transition-all duration-200`}
                        >
                            Detil
                        </button>
                        <button
                            onClick={() => setPage("registration")}
                            className={`${page === "registration" ? "bg-slate-300" : ""
                                } rounded-md px-3 py-1.5 transition-all duration-200`}
                        >
                            Pendaftaran
                        </button>
                    </div>
                </div>
            </header>
            <section className="p-4">
                {page === "detail" ? (
                    <div className="detail flex gap-7 justify-center h-full">
                        <div className="w-full">
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
                                <button
                                    onClick={() => edit ? update() : setEdit(true)}
                                    className="px-3 py-1 bg-slate-200 hover:bg-slate-400 transition-colors rounded-md"
                                >
                                    {edit ? "Simpan" : "Edit"}
                                </button>
                            </div>
                        </div>
                        <img
                            src={`/storage/${event.poster}`}
                            className="h-96 rounded-lg"
                        />
                    </div>
                ) : (
                    <div>
                        <div className="overflow-x-auto">
                            <table className="table-auto w-full border-collapse border border-gray-300">
                                <thead>
                                    <tr className="bg-gray-100">
                                        {["No", "Nama", "Email", "Nomor WA", "Pembayaran", "Acc"].map((header, idx) => (
                                            <th key={idx} className="border border-gray-300 px-4 py-2 text-center font-medium">
                                                {header}
                                            </th>
                                        ))}
                                    </tr>
                                </thead>
                                <tbody>
                                    {event.participant.map((participant, index) => (
                                        <tr key={index} className="hover:bg-gray-50">
                                            <td className="border border-gray-300 px-4 py-2 text-center">
                                                {index + 1}
                                            </td>
                                            {["name", "email", "phoneNumber"].map((field, idx) => (
                                                <td key={idx} className="border border-gray-300 px-4 py-2 text-center">
                                                    {participant[field]}
                                                </td>
                                            ))}
                                            <td className="border border-gray-300 px-4 py-2 text-center">
                                                <button
                                                    onClick={() => setImage({ open: true, path: participant.payment })}
                                                    className="px-2 py-1 bg-blue-500 text-white rounded-md"
                                                >
                                                    Toggle Image
                                                </button>
                                            </td>
                                            <td className="border border-gray-300 px-4 py-2 text-center">
                                                <input
                                                    type="checkbox"
                                                    checked={participant.isApproved}
                                                    disabled
                                                    className="h-4 w-4"
                                                />
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                )}
            </section>
        </section>
    );
};

View.layout = (page) => <Layout children={page} />;
export default View;
