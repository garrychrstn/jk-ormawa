import { Box, Modal } from "@mui/material";
import { defaultModalStyling } from "../utility";
import { useState } from "react";
import { router } from "@inertiajs/react";
import { toast } from "react-toastify";
import axios from "axios";

const FormModal = ({ open, close, edit }) => {
    const [data, setData] = useState({
        registrationStart: new Date().toISOString().split("T")[0],
        registrationEnd: new Date(new Date().setDate(new Date().getDate() + 7))
            .toISOString()
            .split("T")[0],
    });
    function changeData(key, value) {
        setData({ ...data, [key]: value });
    }
    function submit() {
        if (
            !data.title ||
            !data.description ||
            !data.location ||
            !data.poster ||
            !data.registrationStart ||
            !data.registrationEnd ||
            !data.eventStart ||
            !data.eventEnd ||
            !data.price || !data.waGroup
        ) {
            toast.error("All fields are required.");
            return;
        }
        const path = edit ? "/event/update" : "/event/create";
        router.post(path, data, {
            onSuccess: (res) => {
                toast.success("Event created successfully");
                close();
            },
            onError: (err) => {
                console.log(err);
                toast.error("Failed to create event");
                close();
            },
        });
    }
    return (
        <Modal position="center" open={open} onClose={close}>
            <Box sx={defaultModalStyling}>
                <div className="text-center justify-center">
                    <h1 className="text-lg font-semibold mb-4">
                        Tambah event baru
                    </h1>
                    <div className="flex flex-col gap-4">
                        <div className="flex flex-col text-left">
                            <label htmlFor="title" className="mb-1 font-medium">
                                Nama Event{" "}
                                <span className="text-red-500">*</span>
                            </label>
                            <input
                                type="text"
                                id="title"
                                name="title"
                                value={data.title || ""}
                                onChange={(e) =>
                                    changeData("title", e.target.value)
                                }
                                className="border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                placeholder="Enter event title"
                                required
                                autoFocus
                            />
                        </div>

                        <div className="flex flex-col text-left">
                            <label
                                htmlFor="description"
                                className="mb-1 font-medium"
                            >
                                Deskripsi acara
                            </label>
                            <textarea
                                id="description"
                                name="description"
                                value={data.description || ""}
                                onChange={(e) =>
                                    changeData("description", e.target.value)
                                }
                                rows="3"
                                className="border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                placeholder="Enter description"
                            ></textarea>
                        </div>

                        <div className="flex flex-col text-left">
                            <label
                                htmlFor="location"
                                className="mb-1 font-medium"
                            >
                                Lokasi acara
                            </label>
                            <input
                                type="text"
                                id="location"
                                name="location"
                                value={data.location || ""}
                                onChange={(e) =>
                                    changeData("location", e.target.value)
                                }
                                rows="3"
                                className="border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                placeholder="Enter location"
                            ></input>
                        </div>
                        <div className="flex flex-col text-left">
                            <label htmlFor="price" className="mb-1 font-medium">
                                Harga
                            </label>
                            <input
                                type="number"
                                id="price"
                                name="price"
                                onChange={(e) =>
                                    changeData("price", e.target.value)
                                }
                                className="border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                        </div>
                        <div className="flex flex-col text-left">
                            <label htmlFor="waGroup" className="mb-1 font-medium">
                                WA Group
                            </label>
                            <input
                                type="text"
                                id="waGroup"
                                name="waGroup"
                                onChange={(e) =>
                                    changeData("waGroup", e.target.value)
                                }
                                className="border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                        </div>
                        <div className="flex flex-col text-left">
                            <label
                                htmlFor="poster"
                                className="mb-1 font-medium"
                            >
                                Poster
                            </label>
                            <input
                                type="file"
                                id="poster"
                                name="poster"
                                onChange={(e) =>
                                    changeData("poster", e.target.files[0])
                                }
                                accept="image/*"
                                className="border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                        </div>
                        <div className="flex items-center justify-between gap-3">
                            <div className="flex flex-col text-left w-full">
                                <label
                                    htmlFor="registrationStart"
                                    className="mb-1 font-medium"
                                >
                                    Pendaftaran dimulai pada
                                </label>
                                <input
                                    type="date"
                                    id="registrationStart"
                                    name="registrationStart"
                                    value={data.registrationStart || ""}
                                    onChange={(e) =>
                                        changeData(
                                            "registrationStart",
                                            e.target.value
                                        )
                                    }
                                    className="border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                />
                            </div>
                            <div className="flex flex-col text-left w-full">
                                <label
                                    htmlFor="registrationEnd"
                                    className="mb-1 font-medium"
                                >
                                    Pendaftaran berakhir pada
                                </label>
                                <input
                                    type="date"
                                    id="registrationEnd"
                                    name="registrationEnd"
                                    value={data.registrationEnd || ""}
                                    onChange={(e) =>
                                        changeData(
                                            "registrationEnd",
                                            e.target.value
                                        )
                                    }
                                    className="border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                />
                            </div>
                        </div>
                        <div className="flex items-center justify-between gap-3">
                            <div className="flex flex-col text-left w-full">
                                <label
                                    htmlFor="eventStart"
                                    className="mb-1 font-medium"
                                >
                                    Event mulai pada
                                </label>
                                <input
                                    type="date"
                                    id="eventStart"
                                    name="eventStart"
                                    value={data.eventStart || ""}
                                    onChange={(e) =>
                                        changeData("eventStart", e.target.value)
                                    }
                                    className="border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                />
                            </div>

                            <div className="flex flex-col text-left w-full">
                                <label
                                    htmlFor="eventEnd"
                                    className="mb-1 font-medium"
                                >
                                    Event berakhir pada
                                </label>
                                <input
                                    type="date"
                                    id="eventEnd"
                                    name="eventEnd"
                                    value={data.eventEnd || ""}
                                    onChange={(e) =>
                                        changeData("eventEnd", e.target.value)
                                    }
                                    className="border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                />
                            </div>
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
    );
};

export default FormModal;
