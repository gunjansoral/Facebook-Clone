import axios from 'axios'
import { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Navigate, useNavigate, useParams } from 'react-router-dom'
import CreatePost from '../../components/createPost'
import Header from '../../components/header'
import LeftHome from '../../components/home/left'
import RightHome from '../../components/home/right'
import Stories from '../../components/home/stories'
import ActivateForm from './ActivateForm'
import Cookies from 'js-cookie'
import './style.css'
export default function Activate() {
  const dispatch = useDispatch()
  const [success, setSuccess] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(true)
  const { user } = useSelector((user) => ({ ...user }))
  const { token } = useParams()
  const navigate = useNavigate()
  useEffect(() => {
    activateAccount()
  }, [])
  const activateAccount = async () => {
    try {
      setLoading(true)
      const { data } = await axios.post(`${process.env.REACT_APP_BACKEND_URL}/activate`,
        { token },
        {
          headers: {
            Authorization: `Bearer ${user.token}`
          }
        })
      // console.log(data)
      setSuccess(data.message)
      Cookies.set('user', JSON.stringify({ ...user, verified: true }))
      dispatch({
        type: 'VERIFY',
        payload: true
      })
      setTimeout(() => {
        navigate("/")
      }, 3000)
    } catch (error) {
      setError(error.response.data.message)
      console.error(error.response.data.message)
      setTimeout(() => {
        navigate("/")
      }, 3000)
    }
  }
  return (
    <div className='home'>
      {success && (
        <ActivateForm
          type='success'
          text={success}
          header="Account verification succeded"
          loading={loading}
        />
      )}
      {error && (
        <ActivateForm
          type="error"
          header="Account verification failed."
          text={error}
          loading={loading}
        />
      )}
      <Header />
      <LeftHome user={user} />
      <div className="home_middle">
        <Stories />
        <CreatePost user={user} />
      </div>
      <RightHome user={user} />
    </div>
  )
}
