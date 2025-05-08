import { ToastContainer } from "react-toastify";
import { Box, Modal } from "@mui/material"
import { defaultModalStyling } from "../utility"
import { router, useForm } from "@inertiajs/react"
import { useEffect } from "react"
import { toast } from "react-toastify"
import { useState } from "react";

const ModalLPJ = ({ open, close, event }) => {
    const { data, setData } = useForm()
    const [error, setError] = useState('')
    function upload() {
        if (data.lpj && data.lpj.type !== "application/pdf") {
            toast.error("The uploaded file must be a PDF.");
            setError("The uploaded file must be a PDF.")
            return;
        }
        const send = { ...data, id: event.id }
        console.log(send)
        router.post('/event/lpj', send, {
            onSuccess: res => {
                close()
            },
            onError: err => {

            }
        })
    }
    return (
        <Modal position='center' open={open} onClose={close}>
            <Box sx={defaultModalStyling}>
                {/* <ToastContainer
                    position="top-right"
                    autoClose={1500}
                    hideProgressBar={true}
                    newestOnTop={false}
                    closeOnClick={false}
                    pauseOnFocusLoss
                    draggable
                    pauseOnHover
                    theme="dark"
                /> */}
                <h1 className="text-center text-lg font-medium mb-3">
                    Upload LPJ
                </h1>
                {error && (
                    <p className="text-white bg-red-400 p-2 rounded-md mb-2">{error}</p>
                )}
                <label htmlFor="lpj" className="block bg-slate-500 text-white rounded px-4 py-2 text-center cursor-pointer mb-3">
                    {data.lpj ? data.lpj.name : "Choose PDF file"}
                </label>
                <input
                    id="lpj"
                    type="file"
                    onChange={(e) => setData('lpj', e.target.files[0])}
                    className="hidden"
                />
                <div className="flex items-center gap-4 justify-between">
                    <button onClick={close} className="w-full rounded-md py-1 bg-slate-300 mt-3">
                        Cancel
                    </button>
                    <button onClick={upload} className="w-full rounded-md py-1 bg-blue-400 text-white hover:bg-blue-500 transition-all mt-3">
                        Upload
                    </button>
                </div>
            </Box>
        </Modal>
    )
}

export default ModalLPJ
