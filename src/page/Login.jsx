import React, { useState } from 'react';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { NavLink, useNavigate } from 'react-router-dom'
import { auth } from '../../FirebaseConfig';

const Login = () => {
    const navigate = useNavigate();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const onLogin = (e) => {
        e.preventDefault();
        signInWithEmailAndPassword(auth, email, password)
            .then((userCredential) => {
                // Signed in
                const user = userCredential.user;
                navigate("/")
                console.log(user);
            })
            .catch((error) => {
                const errorCode = error.code;
                const errorMessage = error.message;
                console.log(errorCode, errorMessage)
            });

    }


    return (
        <>
            <main >
                <section>
                    <div className='text-center flex flex-col gap-5'>
                        <h1 className='text-3xl'> Sunday Mourners Merchandise  </h1>

                        <form className='flex flex-col gap-5'>
                            <div className='flex justify-between w-[60%] mx-auto'>
                                <label htmlFor="email-address">
                                    Email address
                                </label>
                                <input
                                    className='w-[300px]'
                                    id="email-address"
                                    name="email"
                                    type="email"
                                    required
                                    placeholder="Email address"
                                    onChange={(e) => setEmail(e.target.value)}
                                />
                            </div>

                            <div className='flex justify-between w-[60%] mx-auto'>
                                <label htmlFor="password">
                                    Password
                                </label>
                                <input
                                    className='w-[300px]'

                                    id="password"
                                    name="password"
                                    type="password"
                                    required
                                    placeholder="Password"
                                    onChange={(e) => setPassword(e.target.value)}
                                />
                            </div>

                            <div>
                                <button
                                    onClick={onLogin}
                                >
                                    Login
                                </button>
                            </div>
                        </form>

                        {/* <p className="text-sm text-white text-center">
                            No account yet? {' '}
                            <NavLink to="/signup">
                                Sign up
                            </NavLink>
                        </p> */}

                    </div>
                </section>
            </main>
        </>
    )
}

export default Login