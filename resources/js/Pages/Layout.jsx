import { Link, router, usePage } from "@inertiajs/react";
import React, { useEffect, useState } from "react";

const Layout = ({ children }) => {
    const { auth } = usePage().props;
    return (
        <section className="layout flex text-textLight relative p-2 bg-[#F6F8FA] max-h-screen overflow-scroll">
            <h1>This is layout</h1>
            <section className="maincontent px-10 relative h-[82vh] overflow-y-scroll bg-white pt-7">
                {React.cloneElement(children)}
            </section>
        </section>
    );
};

export default Layout;
