import { Link } from "@inertiajs/react";
import { List, Pencil, XIcon } from "lucide-react";

const Card = ({ ormawa, setInvites }) => {
    return (
        <Link href={`/ormawa/view/${ormawa.id}`}>
            <section className="p-4 border rounded-lg shadow-md">
                <div className="flex items-center gap-4">
                    <div className="flex-shrink-0">
                        {ormawa.logo ? (
                            <img src={`/storage/${ormawa.logo}`} alt={ormawa.name} className="w-16 h-16 object-cover rounded-full" />
                        ) : (
                            <XIcon />
                        )}
                    </div>
                    <div className="flex-1 ml-2">
                        <h2 className="text-xl font-bold text-gray-800 tracking-tight">{ormawa.name}</h2>
                        <div className="mt-1 text-gray-600 text-sm font-medium bg-gray-50 rounded-md px-2 py-1 max-w-fit">
                            {ormawa.description && ormawa.description.length > 32
                                ? ormawa.description.substring(0, 32) + '...'
                                : ormawa.description}
                            {!ormawa.description && <span className="text-gray-400 italic">No description</span>}
                        </div>
                    </div>
                    <div className="tools flex flex-col gap-3">
                        <button onClick={() => setInvites({ id: ormawa.id, open: true })} className="bg-gray-200 hover:bg-gray-300 p-1.5 rounded-md transition-colors">
                            <List size={17} />
                        </button>
                        <button className="bg-gray-200 hover:bg-gray-300 p-1.5 rounded-md transition-colors">
                            <Pencil size={17} />
                        </button>
                    </div>
                </div>
            </section>
        </Link>
    )
}
export default Card;
