// Icon imports
import { FaFacebookMessenger } from "react-icons/fa";

// Component imports
import LoginForm from "./LoginForm";

const Login = ( { handleLoginModal, handleRegisterModal }) => {
  return (
    <div className='flex flex-col items-center justify-center'>
      <FaFacebookMessenger className='text-sky-500 text-4xl'/>
      <h3 className='mt-3 font-bold text-3xl text-gray-900'>Sign in to your account</h3>
      <LoginForm handleLoginModal={handleLoginModal} handleRegisterModal={handleRegisterModal}/>
    </div>
  )
}

export default Login
