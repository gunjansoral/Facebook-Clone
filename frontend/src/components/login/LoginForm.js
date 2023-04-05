import React, { useState } from 'react'
import { Formik, Form } from 'formik'
import { Link } from 'react-router-dom'
import * as Yup from 'yup'
import LoginInput from '../inputs/logininput'
import { useDispatch } from 'react-redux'
import DotLoader from "react-spinners/DotLoader"
import axios from "axios";
import { useNavigate } from 'react-router-dom'
import Cookies from 'js-cookie'
const loginInfos = {
    email: '',
    password: ''
}
const LoginForm = ({ setVisible }) => {
    const [login, setLogin] = useState(loginInfos)
    const { email, password } = login
    const dispatch = useDispatch()
    const navigate = useNavigate()
    const handleLoginChange = (e) => {
        const { name, value } = e.target
        setLogin({ ...login, [name]: value })
    }
    const loginValidation = Yup.object({
        email: Yup.string()
            .required("Email address is required")
            .email("Must be a valid email")
            .max(100),
        password: Yup.string()
            .required("Password is required")
    })
    const [error, setError] = useState('')
    const [loading, setLoading] = useState(false)
    const loginSubmit = async () => {
        try {
            setLoading(true)
            const { data } = await axios.post(
                `${process.env.REACT_APP_BACKEND_URL}/login`,
                {
                    email,
                    password
                }
            )
            dispatch({ type: 'LOGIN', payload: data })
            Cookies.set('user', JSON.stringify(data))
            navigate('/')
        } catch (error) {
            setLoading(false)
            setError(error.response.data.message)
        }
    }
    return (
        <div className="login_wrap">
            <div className="login_1">
                <img src="../../icons/facebook.svg" alt="" />
                <span>Facebook helps you connect and share with the people in your life.
                </span>
            </div>
            <div className="login_2">
                <div className="login_2_wrap">
                    <Formik
                        enableReinitialize
                        initialValues={{
                            email,
                            password
                        }}
                        validationSchema={loginValidation}
                        onSubmit={() => {
                            loginSubmit()
                        }}
                    >
                        {(formik) =>
                        (<Form>
                            <LoginInput
                                type='text'
                                name='email'
                                placeholder='Email address or phone'
                                onChange={handleLoginChange}

                            />
                            <LoginInput
                                type='password'
                                name='password'
                                placeholder='Password'
                                onChange={handleLoginChange}
                                bottom
                            />
                            <button type='submit' className='blue_btn'>Log In</button>
                        </Form>)}
                    </Formik>
                    <Link to="/reset" className='forgot_password'>Forgotten password?</Link>
                    <DotLoader color="blue" loading={loading} size={30} />
                    {error && <div className="error_text">{error}</div>}
                    <div className="sign_splitter"></div>
                    <button onClick={() => setVisible(true)} className="blue_btn open_signup">Create Account</button>
                </div>
                <Link className='sign_extra' to='/'>
                    <b>Create a Page </b>
                    for a celebrity, brand or business.
                </Link>
            </div>
        </div>
    )
}

export default LoginForm