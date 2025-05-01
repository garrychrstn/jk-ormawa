import Layout from "./Layout"

const Hello = () => {
    console.log('hello')
    return (
        <div className="text-red-500">Hello World!</div>
    )
}

Hello.layout = (page) => <Layout children={page} />
export default Hello;
