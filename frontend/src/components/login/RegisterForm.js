import { Formik, Form } from 'formik'
import { useState } from 'react'
import * as Yup from 'yup'
import RegisterInput from '../inputs/registerinput'
import DateOfBirthSelect from './DateOfBirthSelect'
import GenderSelect from './GenderSelect'
import { useDispatch } from 'react-redux'
import DotLoader from "react-spinners/DotLoader"
import axios from "axios";
import { useNavigate } from 'react-router-dom'
import Cookies from 'js-cookie'

export default function RegisterForm({ setVisible }) {
	const dispatch = useDispatch()
	const navigate = useNavigate()
	const userInfos = {
		firstname: '',
		lastname: '',
		email: '',
		password: '',
		bYear: new Date().getFullYear(),
		bMonth: new Date().getMonth() + 1,
		bDay: new Date().getDate(),
		gender: ''
	}
	const [user, setUser] = useState(userInfos)
	const {
		firstname,
		lastname,
		email,
		password,
		bYear,
		bMonth,
		bDay,
		gender
	} = user
	const handleRegisterChange = e => {
		const { name, value } = e.target
		setUser({ ...user, [name]: value })
	}
	const yearsTemp = new Date().getFullYear()
	const years = Array.from(new Array(108), (val, index) => yearsTemp - index)
	const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
	const getDays = () => {
		return new Date(bYear, bMonth, 0).getDate()
	}
	const days = Array.from(new Array(getDays()), (val, index) => 1 + index)
	const registerValidation = Yup.object({
		firstname: Yup.string()
			.required('First name is required')
			.min(2, `What's your first name?`)
			.max(16, `What's your first name?`)
			.matches(/^[aA-zZ]+$/, 'Numbers and special characters are not allowed.'),
		lastname: Yup.string()
			.required('Last name is required')
			.min(2, `What's your last name?`)
			.max(16, `What's your last name?`)
			.matches(/^[aA-zZ]+$/, 'Numbers and special characters are not allowed.'),
		email: Yup.string()
			.required("You'll need this when you log in and if you ever need to reset your password.")
			.email("Enter a valid email address."),
		password: Yup.string()
			.required("Enter a combination of at least six numbers, letters and puctiation marks(such as ! and &.")
			.min(6, "Password must be atleast 6 characters.")
			.max(36, "Password can't be more than 36 characters.")
	})
	const [dateError, setDateError] = useState("")
	const [genderError, setGenderError] = useState("")

	const [error, setError] = useState('')
	const [success, setSuccess] = useState('')
	const [loading, setLoading] = useState(false)

	const registerSubmit = async () => {
		try {
			const { data } = await axios.post(`${process.env.REACT_APP_BACKEND_URL}/register`,
				{
					firstname,
					lastname,
					email,
					password,
					bYear,
					bMonth,
					bDay,
					gender
				}
			)
			setError('')
			setSuccess(data.message)
			const { message, ...rest } = data
			setTimeout(() => {
				dispatch({ type: 'LOGIN', payload: rest })
				Cookies.set('user', JSON.stringify(rest))
				navigate('/')
			}, 2000)
		} catch (error) {
			setLoading(false)
			setSuccess('')
			setError(error.response.data.message)
		}
	}
	return (
		<div className="blur">
			<div className="register">
				<div className="register_header">
					<i onClick={() => setVisible(false)} className="exit_icon"></i>
					<span>Sign Up</span>
					<span>it's quick and easy</span>
				</div>
				<Formik
					enableReinitialize
					initialValues={{
						firstname,
						lastname,
						email,
						password,
						bYear,
						bMonth,
						bDay,
						gender
					}}
					validationSchema={registerValidation}
					onSubmit={() => {
						let currentDate = new Date()
						let pickedDate = new Date(bYear, bMonth - 1, bDay)
						let atleast14 = new Date(1970 + 14, 0, 1)
						let noMoreThan70 = new Date(1970 + 70, 0, 1)
						if ((currentDate - pickedDate) < atleast14) {
							setDateError("It's look like you entered the wrong info. Please make sure that you use real date of birth")
						} else if (currentDate - pickedDate > noMoreThan70) {
							setDateError("It's look like you entered the wrong info. Please make sure that you use real date of birth")
						} else if (gender === "") {
							setDateError("")
							setGenderError("Please change a gender. You can change who can see this later.")
						} else {
							setDateError("")
							setGenderError("")
							registerSubmit()
						}
					}}
				>
					{(formik) => (
						<Form className='register_form'>
							<div className="reg_line">
								<RegisterInput
									type="text"
									placeholder="First name"
									name="firstname"
									onChange={handleRegisterChange} />
								<RegisterInput
									type="text"
									placeholder="Last name"
									name="lastname"
									onChange={handleRegisterChange} />
							</div>
							<div className="reg_line">
								<RegisterInput
									type="text"
									placeholder="Mobile number or email address"
									name="email"
									onChange={handleRegisterChange} />
							</div>
							<div className="reg_line">
								<RegisterInput
									type="password"
									placeholder="New password"
									name="password"
									onChange={handleRegisterChange} />
							</div>
							<div className="reg_col">
								<div className="reg_line_header">
									Date of birth <i className="info_icon"></i>
								</div>
								<DateOfBirthSelect
									bDay={bDay}
									bMonth={bMonth}
									bYear={bYear}
									days={days}
									months={months}
									years={years}
									handleRegisterChange={handleRegisterChange}
									dateError={dateError}
								/>
							</div>
							<div className="reg_col">
								<div className="reg_line_header">
									Gender <i className="info_icon"></i>
								</div>
								<GenderSelect
									handleRegisterChange={handleRegisterChange}
									genderError={genderError}
								/>
							</div>
							<div className="reg_infos">
								By clicking Sign Up, you agree to our{" "}
								<span>Terms, Data Policy &nbsp;</span>
								and <span>Cookie Policy.</span> You may receive SMS
								notifications from us and can opt out at any time.
							</div>
							<div className="reg_btn_wrapper">
								<button type='submit' className="blue_btn open_signup">Sign Up</button>
							</div>
							<DotLoader color="blue" loading={loading} size={30} />
							{error && <div className="error_text">{error}</div>}
							{success && <div className="success_text">{success}</div>}
							{loading && <div className="error_text">{loading}</div>}
						</Form>
					)}
				</Formik>
			</div>
		</div>
	)
}
