import { ToastContainer, toast } from "react-toastify";
import { Box, Modal } from "@mui/material";
import { defaultModalStyling } from "../utility";
import { router, useForm } from "@inertiajs/react";
import { useEffect, useState } from "react";

const ModalDocumentation = ({ open, close, event }) => {
    const { data, setData } = useForm({ eventId: event.id, documentation: null });
    const [error, setError] = useState("");

    function handleFiles(event) {
        const files = Array.from(event.target.files);
        if (files.length > 0) {
            setData({ ...data, documentation: files });
        }
    }

    useEffect(() => {
        console.log(data);
    }, [data]);

    function upload() {
        router.post("/event/documentation", data, {
            onSuccess: () => {
                toast.success("Upload successful!");
                close();
            },
            onError: (err) => {
                setError("Failed to upload documentation. Please try again.");
                console.error(err);
            },
        });
    }

    return (
        <Modal position="center" open={open} onClose={close}>
            <Box sx={defaultModalStyling}>
                <ToastContainer
                    position="top-right"
                    autoClose={1500}
                    hideProgressBar={true}
                    newestOnTop={false}
                    closeOnClick={false}
                    pauseOnFocusLoss
                    draggable
                    pauseOnHover
                    theme="dark"
                />
                <h1 className="text-center text-lg font-medium mb-3">
                    Upload Documentation
                </h1>
                {error && (
                    <p className="text-white bg-red-400 p-2 rounded-md mb-2">{error}</p>
                )}
                <label
                    htmlFor="documentation"
                    className="block bg-slate-500 text-white rounded px-4 py-2 text-center cursor-pointer mb-3"
                >
                    {data.documentation && data.documentation.length > 0
                        ? `${data.documentation.length} file(s) selected`
                        : "Choose PDF file(s)"}
                </label>
                <input
                    id="documentation"
                    type="file"
                    multiple
                    onChange={handleFiles}
                    className="hidden"
                />
                <div className="flex items-center gap-4 justify-between">
                    <button
                        onClick={close}
                        className="w-full rounded-md py-1 bg-slate-300 mt-3"
                    >
                        Cancel
                    </button>
                    <button
                        onClick={upload}
                        className="w-full rounded-md py-1 bg-blue-400 text-white hover:bg-blue-500 transition-all mt-3"
                    >
                        Upload
                    </button>
                </div>
            </Box>
        </Modal>
    );
};

export default ModalDocumentation;
