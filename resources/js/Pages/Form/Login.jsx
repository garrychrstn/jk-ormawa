import { router } from "@inertiajs/react";
import { useState } from "react";
import { toast, ToastContainer } from "react-toastify";

const Login = () => {
    const [action, setAction] = useState('login')
    const [data, setData] = useState({})
    function changeData(key, value) {
        setData({ ...data, [key]: value })
    }
    function submit() {
        console.log('submitting...')
        if (action === 'login') {
            if (!data.email || !data.password) {
                toast.error('Please fill in all required fields');
                return;
            }
            router.post('/user/login', data, {
                onSuccess: (res) => {
                    console.log('res', res)
                },
                onError: (err) => {
                    console.log('err', err)
                    toast.error(err[0])
                }
            })
        } else {
            console.log('data', data)
            if (!data.name || !data.email || !data.password || !data.confirmPassword) {
                toast.error('Please fill in all required fields');
                return;
            }
            if (data.password !== data.confirmPassword) {
                toast.error('Password does not match')
            }

            router.post('/user/create', data, {
                onSuccess: (res) => {
                    console.log('res', res)
                },
                onError: (err) => {
                    console.log('err', err)
                    toast.error(err.error)
                }
            })
        }
    }
    return (
        <section className="flex items-center justify-center min-h-screen bg-[#f9f9f9] px-4">
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
            <div className="bg-white p-8 rounded-xl shadow-lg w-full max-w-md border border-[#f9f9f9]">
                <div className="flex justify-center mb-4">
                    <img src='images/indonusa.png' className="w-36 h-auto" />
                </div>
                <h1 className="text-2xl font-semibold mb-2 text-center text-gray-800">
                    Indonusa Organizational Events
                </h1>
                <div className="flex items-center gap-2 w-full justify-evenly bg-blue-50 rounded-md p-1.5">
                    <button
                        className={`text-sm text-center py-1.5 rounded-md w-full transition-colors duration-200 ${action === 'login' ? 'bg-blue-500 text-white font-medium' : 'text-gray-600'}`}
                        onClick={() => setAction('login')}
                    >
                        Login
                    </button>
                    <button
                        className={`text-sm text-center py-1.5 rounded-md w-full transition-colors duration-200 ${action === 'register' ? 'bg-blue-500 text-white font-medium' : 'text-gray-600'}`}
                        onClick={() => setAction('register')}
                    >
                        Register
                    </button>
                </div>
                <div className="mt-4">
                    {action === 'login' ? (
                        <div>
                            <div className="mb-5">
                                <label htmlFor="email" className="block text-gray-700 mb-2 font-medium">Email</label>
                                <input
                                    type="email"
                                    id="email"
                                    className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 bg-[#f9f9f9]"
                                    placeholder="Enter your email"
                                    required
                                    onChange={(e) => changeData('email', e.target.value)}
                                />
                            </div>
                            <div className="mb-6">
                                <label htmlFor="password" className="block text-gray-700 mb-2 font-medium">Password</label>
                                <input
                                    type="password"
                                    id="password"
                                    className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 bg-[#f9f9f9]"
                                    placeholder="Enter your password"
                                    required
                                    onChange={(e) => changeData('password', e.target.value)}
                                />
                            </div>
                            <button
                                type="button"
                                onClick={() => submit()}
                                className="w-full bg-blue-500 text-white py-3 px-4 rounded-lg hover:bg-blue-600 transition-colors font-medium shadow-md hover:shadow-lg"
                            >
                                Login
                            </button>
                        </div>
                    ) : (
                        <form>
                            <div className="mb-5">
                                <label htmlFor="name" className="block text-gray-700 mb-2 font-medium">Name</label>
                                <input
                                    type="text"
                                    id="name"
                                    className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 bg-[#f9f9f9]"
                                    placeholder="Enter your name"
                                    required
                                    onChange={(e) => changeData('name', e.target.value)}
                                />
                            </div>
                            <div className="mb-5">
                                <label htmlFor="email" className="block text-gray-700 mb-2 font-medium">Email</label>
                                <input
                                    type="email"
                                    id="email"
                                    className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 bg-[#f9f9f9]"
                                    placeholder="Enter your email"
                                    required
                                    onChange={(e) => changeData('email', e.target.value)}
                                />
                            </div>
                            <div className="mb-5">
                                <label htmlFor="password" className="block text-gray-700 mb-2 font-medium">Password</label>
                                <input
                                    type="password"
                                    id="password"
                                    className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 bg-[#f9f9f9]"
                                    placeholder="Enter your password"
                                    required
                                    onChange={(e) => changeData('password', e.target.value)}
                                />
                            </div>
                            <div className="mb-5">
                                <label htmlFor="confirmPassword" className="block text-gray-700 mb-2 font-medium">Confirm Password</label>
                                <input
                                    type="password"
                                    id="confirmPassword"
                                    className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 bg-[#f9f9f9]"
                                    placeholder="Confirm your password"
                                    required
                                    onChange={(e) => changeData('confirmPassword', e.target.value)}
                                />
                            </div>
                            <div className="mb-6">
                                <label htmlFor="token" className="block text-gray-700 mb-2 font-medium">Token</label>
                                <input
                                    type="text"
                                    id="token"
                                    className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 bg-[#f9f9f9]"
                                    placeholder="Optional"
                                    onChange={(e) => changeData('token', e.target.value)}
                                />
                            </div>
                            <button
                                type="button"
                                onClick={() => submit()}
                                className="w-full bg-blue-500 text-white py-3 px-4 rounded-lg hover:bg-blue-600 transition-colors font-medium shadow-md hover:shadow-lg"
                            >
                                Register
                            </button>
                        </form>
                    )}
                    <p className="text-center text-gray-500 mt-6 text-sm">
                        © 2023 Indonusa Ormawa. All rights reserved.
                    </p>
                </div>
            </div>
        </section>
    );
};

export default Login;
