import { useState, useEffect, useContext } from 'react';
import { useFormik } from 'formik';

// Icon imports
import { FaGoogle } from "react-icons/fa";
import { FaGithub } from "react-icons/fa";
import { IoCloseSharp } from "react-icons/io5";

// Component imports
import Input from '../inputs/Input';
import PopUpAlert from '../alerts/PopUpAlert';
import ClipLoader from 'react-spinners/ClipLoader';

// Context imports
import AuthContext from '../../context/AuthContext';

const LoginForm = ({ handleLoginModal, handleRegisterModal }) => {
  const [disabled, setDisabled] = useState(true);
  const [loading, setLoading] = useState(false);
  const [alertMessage, setAlertMessage] = useState(null);

  const{ loginUser } = useContext(AuthContext);

  const {values, handleChange, handleBlur } = useFormik({
    initialValues : {
        'email' : '',
        'password' : ''
    }
  });

  const handleSubmit = (event) => {
    if(disabled) return;

    event.preventDefault()
    loginUser(values, setLoading, setAlertMessage);
  }

  useEffect( () => {

    if ( values.email.length === 0 || values.password.length === 0) setDisabled(true);
    else if (loading) setDisabled(true);
    else setDisabled(false);
  }, [values, loading]);
  
  useEffect( () => {
    if (alertMessage) {
      const timer = setTimeout( () => {
        setAlertMessage(null);
      }, 5000);

      return () => clearTimeout(timer);
    };
  }, [alertMessage])


  return (
    <>
      <div className='relative mt-5 w-[400px] px-4 md:px-10 py-8 bg-white rounded-lg shadow-lg text-gray-900'>
      <div className='h-5 w-5 hover:bg-gray-200 text-gray-500 rounded-full absolute top-3 right-5 flex items-center justify-center text-xl'
      onClick={handleLoginModal}>
        <IoCloseSharp/>
      </div>
      <form onSubmit={(e) => handleSubmit(e)}>
        <Input name='email' type='email' value={values.email} id='email' label='E-mail address' handleChange={handleChange} handleBlur={handleBlur}/>
        <Input name='password' type='password' value={values.password} id='password' label='Password' handleChange={handleChange} handleBlur={handleBlur}/>
        <button disabled={disabled} type='submit'
        className={`${disabled ? 'opacity-50' : 'hover:bg-opacity-90'} mt-5 h-8 w-full flex items-center justify-center text-white bg-sky-500 rounded`}>
          { loading ? <ClipLoader loading={loading} size={25} color='#FFFFFF'/> : 'Log in' }
        </button>
      </form>
      <div className='mt-5 relative w-full flex items-center justify-center text-sm text-gray-500'> 
        <span className='w-full h-1 border-t border-gray-300'/>
        <span className='absolute bg-white px-2 pb-1.5'>Or continue with</span>
      </div>
      <div className='w-full flex items-center justify-between mt-6'>
        <button className='w-[49%] h-8 border border-gray-300 rounded text-gray-500 flex items-center justify-center hover:opacity-90 cursor-not-allowed'>
          <FaGoogle/>
        </button>
        <button className='w-[49%] h-8 border border-gray-300 rounded text-gray-500 flex items-center justify-center hover:opacity-90 cursor-not-allowed'>
          <FaGithub/>
        </button>
      </div>
      <p className='w-full text-center mt-6 text-gray-500 text-xs'>New to Vestnik? <span className='underline hover:opacity-90 cursor-pointer' onClick={handleRegisterModal}>Create an account</span></p>
      <p className='w-full text-center mt-6 text-gray-500 text-xs'>Don't want to register? <span className='underline hover:opacity-90 cursor-pointer' onClick={() => { setDisabled(true); loginUser({ email: 'testboy@mail.com', password : '12345'})}}>Try a demo account</span></p>
    </div>
    { alertMessage && <PopUpAlert message={alertMessage} error/>}
    </>
  )
}

export default LoginForm
