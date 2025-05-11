import { useEffect, useState } from "react";
import Layout from "../Layout";
import FormModal from "./FormModal";
import { Card } from "./Card";
import { Link, router } from "@inertiajs/react";
import { ThermometerSnowflakeIcon } from "lucide-react";

const Index = ({ events = [] }) => {
    document.title = "Events | MORG"
    const [list, setlist] = useState(events);
    const [addEvent, setAddEvent] = useState({
        open: false,
        data: null,
        edit: false,
    });
    useEffect(() => {
        console.log("events", events);
    }, [events]);

    return (
        <section>
            {addEvent.open && (
                <FormModal
                    open={addEvent.open}
                    close={() => setAddEvent({ ...addEvent, open: false })} // Pass a function reference
                />
            )}
            <header className="flex justify-between items-center mb-4">
                <h1 className="text-xl font-semibold">Daftar Event</h1>
                <button
                    onClick={() => setAddEvent({ ...addEvent, open: true })} // Ensure the state is updated correctly
                    className="px-3 py-1 bg-slate-200 hover:bg-slate-400 transition-colors rounded"
                >
                    + New
                </button>
            </header>
            <section>
                <h1 className="my-2">Event Active : </h1>
                <div className="grid grid-cols-5 gap-5">
                    {list.map(event => {
                        if (event.active) return (
                            <Link
                                href={`/event/${event.token}`}
                                key={event.id}
                                className="h-full flex hover:bg-slate-50 transition-all"
                            >
                                <Card event={event} className="flex-grow" />
                            </Link>
                        )
                    })}
                </div>
            </section>
            <section>
                <h1 className="my-2">Event Selesai : </h1>
                <div className="grid grid-cols-5 gap-5">
                    {list.map(event => {
                        if (!event.active) return (
                            <Link
                                href={`/event/${event.token}`}
                                key={event.id}
                                className="h-full flex hover:bg-slate-50 transition-all"
                            >
                                <Card event={event} className="flex-grow" />
                            </Link>
                        )
                    })}
                </div>
            </section>
        </section>
    );
};

Index.layout = (page) => <Layout children={page} />;
export default Index;
