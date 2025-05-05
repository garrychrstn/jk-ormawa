import Layout from "./Layout";

const Dashboard = () => {
    return (
        <div>
            <h1>Welcome to the DashboardAdmin</h1>
        </div>
    );
};

Dashboard.layout = (page) => <Layout children={page} />
export default Dashboard;
