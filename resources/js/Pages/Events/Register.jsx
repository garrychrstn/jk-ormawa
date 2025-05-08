import { router, useForm } from "@inertiajs/react"
import { Box, Modal } from "@mui/material"
import { useEffect, useState } from "react"
import { toast, ToastContainer } from "react-toastify"
import { defaultModalStyling, formatToRupiah } from "../utility"
import axios from "axios"

const Register = ({ event }) => {
    const { data, setData, errors, processing } = useForm()
    const [register, setRegister] = useState(false)
    const [review, setReview] = useState(false)
    const [success, setSuccess] = useState(false)
    useEffect(() => {
        setData('eventId', event.id)
    }, [event])
    function submit() {
        const path = register ? '/event/register' : '/event/feedback'
        if (register) {
            if (!data.name || !data.email || !data.phoneNumber || !data.payment) {
                toast.error('All field must be filled')
                return
            }
        } else {
            if (!data.feedback) {
                toast.error('All field must be filled')
                return
            }
        }
        router.post(path, data, {
            onSuccess: res => {
                console.log(res)
                setSuccess(true)
                toast.success("Operation successfull");
            },
            onError: err => {

            }
        })

    }
    return (
        <section className="px-12 py-10 md:py-0 bg-gray-100 rounded-lg shadow-md">
            <ToastContainer
                position="bottom-right"
                autoClose={1500}
                hideProgressBar={true}
                newestOnTop={false}
                closeOnClick={false}
                pauseOnFocusLoss
                draggable
                pauseOnHover
                theme="dark"
            />
            {register && (
                <Modal position='center' open={register} onClose={() => setRegister(false)}>
                    <Box sx={{
                        position: 'absolute',
                        top: '50%',
                        left: '50%',
                        transform: 'translate(-50%, -50%)',
                        width: 400,
                        bgcolor: 'background.paper',
                        boxShadow: 24,
                        p: 4,
                        borderRadius: '10px'
                    }}>
                        <div>
                            {success && (
                                <div className="px-3 py-1.5 bg-green-500 rounded-lg text-white mb-4">
                                    <span className="text-white block">
                                        Registration Successful
                                    </span>
                                    <span className="text-sm">Please contact admin for confirmation</span>
                                </div>
                            )}
                            <div className="space-y-4">
                                <div>
                                    <label htmlFor="name" className="block text-sm font-medium text-gray-700">Name</label>
                                    <input
                                        type="text"
                                        id="name"
                                        name="name"
                                        value={data.name || ''}
                                        onChange={(e) => setData('name', e.target.value)}
                                        placeholder="Enter your name"
                                        className="mt-1 px-3 py-2 block w-full border-gray-300 rounded-md border focus:ring-slate-500 focus:outline-none focus:ring-2 sm:text-sm"
                                    />
                                    {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name}</p>}
                                </div>
                                <div>
                                    <label htmlFor="email" className="block text-sm font-medium text-gray-700">Email</label>
                                    <input
                                        type="email"
                                        id="email"
                                        name="email"
                                        value={data.email || ''}
                                        onChange={(e) => setData('email', e.target.value)}
                                        placeholder="Enter your email"
                                        className="mt-1 px-3 py-2 block w-full border-gray-300 rounded-md border focus:ring-slate-500 focus:outline-none focus:ring-2 sm:text-sm"
                                    />
                                    {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email}</p>}
                                </div>
                                <div>
                                    <label htmlFor="phoneNumber" className="block text-sm font-medium text-gray-700">Phone Number</label>
                                    <input
                                        type="text"
                                        id="phoneNumber"
                                        name="phoneNumber"
                                        value={data.phoneNumber || ''}
                                        onChange={(e) => setData('phoneNumber', e.target.value)}
                                        placeholder="62xxxx"
                                        className="mt-1 px-3 py-2 block w-full border-gray-300 rounded-md border focus:ring-slate-500 focus:outline-none focus:ring-2 sm:text-sm"
                                    />
                                    {errors.phoneNumber && <p className="text-red-500 text-xs mt-1">{errors.phoneNumber}</p>}
                                </div>
                                <div>
                                    <label htmlFor="payment" className="block text-sm font-medium text-gray-700">Payment</label>
                                    <input
                                        type="file"
                                        id="payment"
                                        name="payment"
                                        onChange={(e) => setData('payment', e.target.files[0])}
                                        className="mt-1 block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border file:border-gray-300 file:text-sm file:font-medium file:bg-gray-50 file:text-gray-700 hover:file:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-slate-500"
                                    />
                                    {errors.payment && <p className="text-red-500 text-xs mt-1">{errors.payment}</p>}
                                </div>
                                <div>
                                    <button
                                        onClick={submit}
                                        disabled={processing}
                                        className="w-full py-2 px-4 bg-slate-500 text-white rounded-md shadow-sm hover:bg-slate-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-slate-500"
                                    >
                                        Submit
                                    </button>
                                </div>
                            </div>
                        </div>
                    </Box>
                </Modal>
            )}
            {review && (
                <Modal position='center' open={review} onClose={() => setReview(false)}>
                    <Box sx={{
                        position: 'absolute',
                        top: '50%',
                        left: '50%',
                        transform: 'translate(-50%, -50%)',
                        width: 400,
                        bgcolor: 'background.paper',
                        boxShadow: 24,
                        p: 4,
                        borderRadius: '10px'
                    }}>
                        <div>
                            {success && (
                                <div className="px-3 py-1.5 bg-green-500 rounded-lg text-white mb-4">
                                    <span className="text-white block">
                                        Review Successful
                                    </span>
                                </div>
                            )}
                            <div className="space-y-4">
                                <div>
                                    <div>
                                        <label htmlFor="name" className="block text-sm font-medium text-gray-700">Name (opsional)</label>
                                        <input
                                            type="text"
                                            id="name"
                                            name="name"
                                            value={data.name || ''}
                                            onChange={(e) => setData('name', e.target.value)}
                                            placeholder="Enter your name (opsional)"
                                            className="mt-1 px-3 py-2 block w-full border-gray-300 rounded-md border focus:ring-slate-500 focus:outline-none focus:ring-2 sm:text-sm"
                                        />
                                        {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name}</p>}
                                    </div>
                                    <div>
                                        <label htmlFor="email" className="block text-sm font-medium text-gray-700">Email (opsional)</label>
                                        <input
                                            type="text"
                                            id="email"
                                            name="email"
                                            value={data.email || ''}
                                            onChange={(e) => setData('email', e.target.value)}
                                            placeholder="Enter your email (opsional)"
                                            className="mt-1 px-3 py-2 block w-full border-gray-300 rounded-md border focus:ring-slate-500 focus:outline-none focus:ring-2 sm:text-sm"
                                        />
                                        {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name}</p>}
                                    </div>
                                    <label htmlFor="feedback" className="block text-sm font-medium text-gray-700">Feedback </label>
                                    <textarea
                                        type="text"
                                        id="feedback"
                                        name="feedback"
                                        value={data.feedback || ''}
                                        onChange={(e) => setData('feedback', e.target.value)}
                                        placeholder="Masukan feedback anda"
                                        className="mt-1 px-3 py-2 block w-full border-gray-300 rounded-md border focus:ring-slate-500 focus:outline-none focus:ring-2 sm:text-sm"
                                    />
                                    {errors.feedback && <p className="text-red-500 text-xs mt-1">{errors.feedback}</p>}
                                </div>
                                <div>
                                    <button
                                        onClick={submit}
                                        disabled={processing}
                                        className="w-full py-2 px-4 bg-slate-500 text-white rounded-md shadow-sm hover:bg-slate-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-slate-500"
                                    >
                                        Submit
                                    </button>
                                </div>
                            </div>
                        </div>
                    </Box>
                </Modal>
            )}
            <div className="lg:flex gap-7 items-center lg:h-screen">
                <div>
                    <div className="mb-4">
                        <img
                            src={`/storage/${event.poster}`}
                            className="w-full h-auto rounded-md"
                        />
                    </div>
                </div>
                <div>
                    <h1 className="text-2xl font-bold text-gray-800 mb-2">{event.title}</h1>
                    <p className="text-gray-700 mb-4 whitespace-pre-line">{event.description}</p>
                    <span className="text-lg text-gray-700 font-bold mb-3 block">
                        Fee : {formatToRupiah(event.price)}
                    </span>
                    <p className="text-gray-600 mb-2">
                        <strong className="font-semibold">Start:</strong> {new Date(event.eventStart).toLocaleString()}
                    </p>
                    <p className="text-gray-600 mb-2">
                        <strong className="font-semibold">End:</strong> {new Date(event.eventEnd).toLocaleString()}
                    </p>
                    <p className="text-gray-600">
                        <strong className="font-semibold">Location:</strong> {event.location}
                    </p>

                    {new Date(event.eventEnd) < new Date() && (
                        <button
                            onClick={() => setReview(true)}
                            className="w-full mt-4 py-2 px-4 bg-blue-500 text-white rounded-md shadow-sm hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                        >
                            Review
                        </button>
                    )}
                    {new Date(event.registrationEnd) >= new Date() && (
                        <button
                            onClick={() => setRegister(true)}
                            disabled={processing}
                            className="w-full mt-4 py-2 px-4 bg-slate-500 text-white rounded-md shadow-sm hover:bg-slate-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-slate-500"
                        >
                            Register
                        </button>
                    )}
                </div>
            </div>
        </section >
    )
}

export default Register
