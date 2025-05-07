import { useEffect, useState } from "react";
import Layout from "../Layout";
import FormModal from "./FormModal";
import { Card } from "./Card";
import { router } from "@inertiajs/react";
import { ThermometerSnowflakeIcon } from "lucide-react";

const Index = ({ events = [] }) => {
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
                <h1 className="text-xl font-semibold">Listing</h1>
                <button
                    onClick={() => setAddEvent({ ...addEvent, open: true })} // Ensure the state is updated correctly
                    className="px-3 py-1 bg-slate-200 hover:bg-slate-400 transition-colors rounded"
                >
                    + New
                </button>
            </header>
            <div className="listing grid md:grid-cols-4 grid-cols-2 gap-3">
                {list.length > 0 ? (
                    list.map((event) => (
                        <a
                            href={`/event/${event.token}`}
                            target="_blank"
                            key={event.id}
                            className="h-full flex"
                        >
                            <Card event={event} className="flex-grow" />
                        </a>
                    ))
                ) : (
                    <div className="w-full text-gray-500">
                        No event available
                    </div>
                )}
            </div>
        </section>
    );
};

Index.layout = (page) => <Layout children={page} />;
export default Index;
