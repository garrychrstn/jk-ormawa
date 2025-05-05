import { Box, Modal } from "@mui/material";
import { defaultModalStyling } from "../utility";
import { useState } from "react";
import { router } from "@inertiajs/react";
import { toast } from "react-toastify";

const FormModal = ({ open, close, edit }) => {
    const [data, setData] = useState({})
    function changeData(key, value) {
        setData({ ...data, [key]: value })
    }
    function submit() {
        const path = edit ? '/ormawa/update' : '/ormawa/create'
        router.post(path, data, {
            onSuccess: (res) => {
                console.log(res)
                toast.success('Ormawa created successfully');
                close();
            },
            onError: (err) => {
                console.log(err)
                toast.error('Failed to create Ormawa');
                close();
            }
        })
    }
    return (
        <Modal position='center' open={open} onClose={close}>
            <Box sx={defaultModalStyling}>
                <div className="text-center justify-center">
                    <h1 className="text-lg font-semibold mb-4">Add New Ormawa</h1>
                    <div className="flex flex-col gap-4">
                        <div className="flex flex-col text-left">
                            <label htmlFor="name" className="mb-1 font-medium">Name <span className="text-red-500">*</span></label>
                            <input
                                type="text"
                                id="name"
                                name="name"
                                value={data.name || ''}
                                onChange={(e) => changeData('name', e.target.value)}
                                className="border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                placeholder="Enter ormawa name"
                                required
                                autoFocus
                            />
                        </div>

                        <div className="flex flex-col text-left">
                            <label htmlFor="description" className="mb-1 font-medium">Description</label>
                            <textarea
                                id="description"
                                name="description"
                                value={data.description || ''}
                                onChange={(e) => changeData('description', e.target.value)}
                                rows="3"
                                className="border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                placeholder="Enter description"
                            ></textarea>
                        </div>

                        <div className="flex flex-col text-left">
                            <label htmlFor="logo" className="mb-1 font-medium">Logo</label>
                            <input
                                type="file"
                                id="logo"
                                name="logo"
                                onChange={(e) => changeData('logo', e.target.files[0])}
                                accept="image/*"
                                className="border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                        </div>

                        <div className="flex gap-3 justify-end mt-4">
                            <button
                                type="button"
                                onClick={close}
                                className="px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-100 transition-colors"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={submit}
                                type="button"
                                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
                            >
                                Submit
                            </button>
                        </div>
                    </div>
                </div>
            </Box>
        </Modal>
    )
}

export default FormModal;
