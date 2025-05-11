import { Plus } from "lucide-react"
import Layout from "../Layout"
import Card from "./Card"
import { useEffect, useState } from "react";
import FormModal from "./FormModal";
import { router } from "@inertiajs/react";
import axios from "axios";
import InvitesList from "./InvitesList";

const Index = ({ ormawas }) => {
    document.title = "Ormawa | MORG"
    const [addOrmawa, setAddOrmawa] = useState({});
    const [invites, setInvites] = useState({
        open: false,
        id: null
    });
    return (
        <section>
            {addOrmawa.open && <FormModal open={addOrmawa.open} close={() => setAddOrmawa({ ...addOrmawa, open: false })} />}
            {invites.open && <InvitesList open={invites.open} close={() => setInvites({ ...invites, open: false })} id={invites.id} />}
            <header className="flex items-center justify-between py-6 px-4 mb-8 border-b border-gray-200">
                <h1 className="text-3xl font-bold text-gray-800">Ormawas</h1>
                <button onClick={() => setAddOrmawa({ ...addOrmawa, open: true })} className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors flex items-center gap-2">
                    <Plus />
                    <span className="font-semibold">NEW</span>
                </button>
            </header>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                {ormawas.length > 0 ? (
                    ormawas.map((ormawa) => (
                        <section key={ormawa.id} className="flex flex-col h-full">
                            <Card ormawa={ormawa} setInvites={setInvites} className="flex-1" />
                        </section>
                    ))
                ) : (
                    <div className="w-full text-center">
                        <p className="text-gray-500">No Ormawas found.</p>
                    </div>
                )}
            </div>
        </section>
    )
}

Index.layout = (page) => <Layout children={page} />
export default Index
