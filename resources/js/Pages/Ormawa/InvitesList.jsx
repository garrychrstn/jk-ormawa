import { Box, Modal } from "@mui/material";
import { defaultModalStyling } from "../utility";
import { useEffect, useState } from "react";
import { router } from "@inertiajs/react";
import { toast } from "react-toastify";
import { Copy } from "lucide-react";

const InvitesList = ({ open, close, id }) => {
    const [listing, setListing] = useState([])
    useEffect(() => {
        console.log('requesting invites')
        axios.get(`/invites?id=${id}`)
            .then((res) => {
                setListing(res.data);
            })
            .catch((err) => {
                console.error('Error loading invites:', err);
                toast.error('Failed to load invites!');
            });
    }, [])
    function generateListing() {
        console.log('to /invites/create')
        axios.post('/invites/create', { ormawaId: id.toString() })
            .then((res) => {
                console.log(res.data)
                setListing([...listing, res.data])
                toast.success('Token generated successfully!');
                // Refresh the listing after creating a new token

            })
            .catch((err) => {
                console.error('Error generating token:', err);
                toast.error('Failed to generate token!');
            });
    }
    return (
        <Modal position='center' open={open} onClose={close}>
            <Box sx={defaultModalStyling}>
                <section className="text-center justify-center">
                    <div className="flex items-center justify-between">
                        <h1 className="text-lg font-semibold mb-4">Invites Listing</h1>
                        <button onClick={generateListing} className="bg-slate-500 hover:bg-slate-600 text-white px-3 py-1.5 text-sm rounded shadow-sm transition duration-200 ease-in-out focus:outline-none">
                            Generate Token
                        </button>
                    </div>
                    <div className="listing bg-white rounded-lg p-6">
                        {listing.length === 0 ? (
                            <div className="text-center py-12 text-gray-500 flex flex-col items-center">
                                <svg className="w-16 h-16 mb-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
                                </svg>
                                <p className="text-lg font-medium">No invites found.</p>
                                <p className="text-sm mt-1">Generate a token to create one.</p>
                            </div>
                        ) : (
                            <div className="overflow-hidden rounded-lg border border-gray-200 mt-4">
                                <div className="grid grid-cols-4 gap-4 bg-gray-50 p-4 border-b border-gray-200">
                                    <div className="font-semibold text-gray-700">Token</div>
                                    <div className="font-semibold text-gray-700">Name</div>
                                    <div className="font-semibold text-gray-700">Role</div>
                                    <div className="font-semibold text-gray-700">Status</div>
                                    <div className="font-semibold text-gray-700">Action</div>
                                </div>
                                <div className="divide-y divide-gray-200">
                                    {listing.map((list, index) => (
                                        <div key={`row-${index}`} className="grid grid-cols-5 gap-4 p-4 hover:bg-gray-50 transition-colors duration-150">
                                            <div className="truncate text-blue-600 font-mono text-xs">{list.token}</div>
                                            <div className="truncate text-xs">{list.ormawa?.name || 'N/A'}</div>
                                            <div className="truncate capitalize text-xs">{list.role}</div>
                                            <div className="truncate">
                                                <span className={`px-2 py-1 rounded-full text-2xs ${list.status === 'used' ? 'bg-red-100 text-red-800' :
                                                    list.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                                                        'bg-gray-100 text-gray-800'
                                                    }`}>
                                                    {list.status}
                                                </span>
                                            </div>
                                            <div>
                                                <button
                                                    onClick={() => {
                                                        navigator.clipboard.writeText(list.token)
                                                            .then(() => {
                                                                toast.info('Token copied to clipboard!');
                                                            })
                                                            .catch((err) => {
                                                                console.error('Failed to copy:', err);
                                                                toast.error('Failed to copy token!');
                                                            });
                                                    }}
                                                    className="bg-blue-500 hover:bg-blue-600 text-white px-2 py-1 text-xs rounded shadow-sm transition duration-200 ease-in-out focus:outline-none"
                                                >
                                                    <Copy size={14} />
                                                </button>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>
                </section>
            </Box>
        </Modal>
    )
}

export default InvitesList;
