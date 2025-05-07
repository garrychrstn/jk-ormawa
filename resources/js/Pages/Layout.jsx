import { Link, router, usePage } from "@inertiajs/react";
import {
    Calendar1,
    Check,
    CircleAlert,
    Clock3,
    Computer,
    Home,
    Library,
    Loader,
    LogIn,
    LogOut,
    PanelLeftDashed,
    PanelRight,
    Printer,
    TentTree,
    Ticket,
    User2,
    Users2,
    X,
} from "lucide-react";
import React, { useEffect, useState } from "react";
import { Menu, MenuItem, Sidebar, SubMenu } from "react-pro-sidebar";
import { ToastContainer } from "react-toastify";
import useIsPortrait from "./Utils/useIsPortrait";

const Layout = ({ children }) => {
    const { auth } = usePage().props;
    const { url } = usePage();
    const isPortrait = useIsPortrait()
    const [light, setLight] = useState(true);
    const [collapsedWidth, setCollapsedWidth] = useState(80);
    const [sidebar, setSidebar] = useState(true);
    const colors = {
        light: {
            white: "#FFFFFF",
            cool: "e5ebf0",
        },
    };
    useEffect(() => {
        console.log(auth)
    }, [auth])
    useEffect(() => {
        if (isPortrait) {
            setCollapsedWidth(0);
        } else {
            setCollapsedWidth(80);
        }
    }, [isPortrait]);
    function logOut() {
        router.post("/logout");
    }
    return (
        <section className="layout bg-white flex text-textLight relative">
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
            <div
                className={
                    isPortrait
                        ? `h-screen fixed z-50 flex p-2`
                        : "h-screen z-50 flex p-2"
                }
            >
                <Sidebar
                    className={
                        isPortrait
                            ? `h-full fixed z-50`
                            : "h-full z-50"
                    }
                    collapsed={!sidebar}
                    backgroundColor="#f9f9f9"
                    rootStyles={{
                        // borderRight: "1px solid #ededed",
                    }}
                    overlay={true}
                    collapsedWidth={`${collapsedWidth}px`}
                    onBackdropClick={() => setSidebar(false)}
                >
                    <button className="text-center m-auto flex items-center" onClick={() => router.visit
                        ('/dashboard')}>
                        <div className="flex  py-8 justify-center gap-1 text-slate rounded-md items-center m-auto">
                            <img src='/images/indonusa.png' alt='morg Logo' className="w-14" />
                            <p
                                className={`title ${sidebar ? "block" : "hidden"
                                    }`}
                            >
                                <span className="font-light text-3xl">
                                    MORG
                                </span>
                            </p>
                        </div>
                    </button>
                    <Menu
                        menuItemStyles={{
                            button: {
                                color: "#414752",
                                margin: "10px 0",
                                backgroundColor: light ? colors.light.cool : "#FFFFFF",
                                marginLeft: "10px",
                                marginRight: "10px",
                                borderRadius: '10px',
                                "&:hover": {
                                    backgroundColor: "#e5ebf0",
                                },
                            },
                        }}
                    >
                        <MenuItem
                            id="dashboard"
                            icon={<Home />}
                            active={url.startsWith('/dashboard')}
                            component={<Link href='/dashboard' />}
                        >
                            Dashboard
                        </MenuItem>
                        {auth?.user?.role === "admin" && (
                            <MenuItem
                                id="ormawa"
                                icon={<Home />}
                                active={url.startsWith('/ormawa')}
                                component={<Link href='/ormawa' />}
                            >
                                Ormawa
                            </MenuItem>
                        )}
                        {auth?.user?.role === 'ormawa' && (
                            <MenuItem
                                id="event"
                                icon={<Calendar1 />}
                                active={url.startsWith('/event')}
                                component={<Link href='/event' />}
                            >
                                Event
                            </MenuItem>
                        )}
                    </Menu>
                </Sidebar>
                {isPortrait && sidebar && (
                    <div
                        className="w-full min-h-screen fixed left-[250px] bg-slate-700 opacity-70 z-50"
                        onClick={() => setSidebar(false)} // Close sidebar when clicking overlay
                    />
                )}
            </div>
            <main className="w-full overflow-y-scroll z-0 max-h-screen ml-0">
                <header className="flex items-center px-10 pt-6 pb-4 justify-between sticky top-0 z-50 backdrop-blur-sm">
                    <div className="flex items-center">
                        <button
                            className=""
                            onClick={() => setSidebar(!sidebar)}
                        >
                            <div className="rounded-full p-1.5">
                                <PanelLeftDashed className="w-6 h-6" />
                            </div>
                        </button>
                    </div>
                    <div className="flex items-stretch gap-3">
                        {auth?.user && auth.user.role === 'ormawa' && (
                            <div
                                className="flex gap-3 border items-center border-slate-400 px-3 py-1 rounded-md h-full"
                            >
                                <div className="justify-start text-left leading-tight">
                                    <p className="mb-0">{auth.user.ormawa.name}</p>
                                </div>
                            </div>
                        )}
                        {auth?.user && (
                            <button
                                onClick={() => logOut()}
                                className="flex gap-3 border items-center border-slate-400 px-3 py-1 rounded-md h-full"
                            >
                                <User2 />
                                <div className="justify-start text-left leading-tight">
                                    <p className="mb-0">{auth.user.email}</p>
                                    <small className="-mt-1">{auth.user.role}</small>
                                </div>
                            </button>
                        )}
                        {auth?.user && (
                            <button
                                onClick={() => logOut()}
                                className="border py-1.5 px-2 rounded-md border-slate-400 hover:text-white hover:bg-slate-600 mytransition h-full"
                            >
                                <LogOut />
                            </button>
                        )}
                    </div>
                </header>
                <section className="maincontent px-10 relative">
                    {React.cloneElement(children)}
                </section>
            </main>
        </section >
    );
};

export default Layout;
