import { useState } from "react"
import Layout from "../Layout"
import axios from "axios"
import { usePage } from "@inertiajs/react"
import { toast } from "react-toastify"
import { Minus } from "lucide-react"

const Member = ({ member, invites }) => {
    document.title = 'Anggota | MORG'
    const [page, setPage] = useState('member')
    const [invite, setInvite] = useState(invites || [])
    const [members, setMembers] = useState(member || [])
    const { auth } = usePage().props
    function generateListing() {
        axios.post('/invites/create', { ormawaId: auth.user.ormawa.id.toString() })
            .then((res) => {
                console.log(res.data)
                setInvite([...invite, res.data])
                toast.success('Token generated successfully!');
                // Refresh the listing after creating a new token

            })
            .catch((err) => {
                console.error('Error generating token:', err);
                toast.error('Failed to generate token!');
            });
    }
    function deleteReferal(id) {
        console.log(id)
        axios.get(`/invites/delete/${id}`)
            .then(res => {
                setInvite(invite.filter(inv => inv.id !== id));
                toast.success('Invite deleted successfully!');
            })
    }
    function deactivate(id) {
        axios.post('/member/deactivate', { id })
            .then(res => {
                setMembers(members.filter(member => member.id !== id));
                toast.success('Member deactivated successfully!');
            }).catch(err => {

            })
    }
    return (
        <section>
            <header className="flex justify-between items-center mb-4">
                <h1 className="text-xl font-semibold">Daftar Anggota</h1>

                <div className="switch flex items-center gap-2 p-1 bg-[#e5ebf0] rounded-lg">
                    <button
                        onClick={() => setPage("member")}
                        className={`${page === "member" ? "bg-slate-300" : ""
                            } rounded-md px-3 py-1.5 transition-all duration-200`}
                    >
                        Anggota
                    </button>
                    <button
                        onClick={() => setPage("referal")}
                        className={`${page === "referal" ? "bg-slate-300" : ""
                            } rounded-md px-3 py-1.5 transition-all duration-200`}
                    >
                        Referal
                    </button>
                </div>
            </header>
            {page === 'member' ? (
                <div className="">
                    <table className="table-auto w-full">
                        <thead>
                            <tr>
                                <td className="px-2 py-1 font-semibold">No</td>
                                <td className="px-2 py-1 font-semibold">Nama</td>
                                <td className="px-2 py-1 font-semibold">Email</td>
                                <td className="px-2 py-1 font-semibold">Is PJ</td>
                                <td className="px-2 py-1 font-semibold">Action</td>
                            </tr>
                        </thead>
                        <tbody>
                            {members.map((member, index) => (
                                <tr key={index}>
                                    <td className="px-2 border-b border-gray-200 py-1">{index + 1}</td>
                                    <td className="px-2 border-b border-gray-200 py-1">{member.name}</td>
                                    <td className="px-2 border-b border-gray-200 py-1">{member.email}</td>
                                    <td className="px-2 border-b border-gray-200 py-1">{member.isPj ? "Yes" : "No"}</td>
                                    <td className="px-2 border-b border-gray-200 py-1">
                                        <button onClick={() => deactivate(member.id)} className="bg-red-400 rounded-md text-white">
                                            <Minus />
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            ) : (
                <div className="my-4">
                    <div className="flex items-center justify-between">
                        <h1 className="text-xl font-semibold mb-4">Daftar Invites</h1>
                        <button onClick={generateListing} className="bg-slate-500 rounded-md text-white p-1">
                            + Referal
                        </button>
                    </div>
                    <table className="table-auto w-full">
                        <thead>
                            <tr>
                                <td className="px-2 py-1 font-semibold">No</td>
                                <td className="px-2 py-1 font-semibold">Token</td>
                                <td className="px-2 py-1 font-semibold">Role</td>
                                <td className="px-2 py-1 font-semibold">Status</td>
                                <td className="px-2 py-1 font-semibold">Aksi</td>
                            </tr>
                        </thead>
                        <tbody>
                            {invite.map((inv, index) => (
                                <tr key={index}>
                                    <td className="px-2 border-b border-gray-200 py-1">{index + 1}</td>
                                    <td className="px-2 border-b border-gray-200 py-1">{inv.token}</td>
                                    <td className="px-2 border-b border-gray-200 py-1">{inv.role}</td>
                                    <td className="px-2 border-b border-gray-200 py-1">{inv.status}</td>
                                    <td className="px-2 border-b border-gray-200 py-1">
                                        <button onClick={() => deleteReferal(inv.id)} className="bg-red-400 text-white p-1 rounded-md">
                                            Hapus
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        </section>
    )
}

Member.layout = (page) => <Layout children={page} />
export default Member
