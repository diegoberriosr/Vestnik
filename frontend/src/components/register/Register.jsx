// Icon imports
import { FaFacebookMessenger } from "react-icons/fa";

// Component imports
import RegisterForm from "./RegisterForm";

const Register = ({ handleLoginModal, handleRegisterModal }) => {
  return (
    <div className='flex flex-col items-center justify-center'>
      <FaFacebookMessenger className='text-sky-500 text-4xl'/>
      <h3 className='mt-3 font-bold text-3xl text-gray-900'>Create an account</h3>
      <RegisterForm handleLoginModal={handleLoginModal} handleRegisterModal={handleRegisterModal}/>
    </div>
  )
}

export default Register