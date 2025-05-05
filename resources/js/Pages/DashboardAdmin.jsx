import Layout from "./Layout";

const DashboardAdmin = () => {
    return (
        <div>
            <h1>Welcome to the DashboardAdmin</h1>
        </div>
    );
};

DashboardAdmin.layout = (page) => <Layout children={page} />
export default DashboardAdmin;
