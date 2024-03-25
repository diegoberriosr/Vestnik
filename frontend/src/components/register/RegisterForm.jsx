
import { useState, useContext, useEffect } from 'react';
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
import AuthContext from "../../context/AuthContext"

// Schema imports
import registerSchema from '../../schemas/register';

const RegisterForm = ({ handleLoginModal, handleRegisterModal }) => {

  const [loading, setLoading ] = useState(false);
  const [disabled, setDisabled] = useState(true);
  const [alertMessage, setAlertMessage] = useState(null);

  const {registerUser} = useContext(AuthContext);

  const { values, handleChange, handleBlur, errors, touched } = useFormik({
    initialValues : {
        'email' : '',
        'name' : '',
        'password' : ''
    },
    validationSchema : registerSchema
  });

  const handleSubmit = (event) => {
    if(disabled) return;

    event.preventDefault();
    registerUser(values, setLoading, setAlertMessage);
  };

  useEffect( () => {
    if( values.email.length === 0 || values.password.length === 0 || values.name.length === 0) setDisabled(true);
    else setDisabled(false);
  }, [values, errors]);

  useEffect( () => {
    if (alertMessage) {
      const timer = setTimeout( () => {
        setAlertMessage(null);
      }, 5000);

      return () => clearTimeout(timer);
    }
  })
  
  return (
    <>
      <div className='relative mt-5 w-screen sm:w-[400px] px-4 md:px-10 py-8 bg-white rounded-lg shadow text-gray-900'>
      <div className='h-5 w-5 hover:bg-gray-200 text-gray-500 rounded-full absolute top-3 right-5 flex items-center justify-center text-xl'
      onClick={handleRegisterModal}>
        <IoCloseSharp/>
      </div>
        <form onSubmit={(e) => handleSubmit(e)}>
          <Input name='email' type='email' value={values.email} id='email' label='Your e-mail address' 
          error={errors['email']} touched={touched['email']}
          handleChange={handleChange} handleBlur={handleBlur}/>
          <Input name='name' type='text' value={values.name} id='name' label='Your name' 
          error={errors['name']} touched={touched['name']}
          handleChange={handleChange} handleBlur={handleBlur}/>     
          <Input name='password' type='password' value={values.password} id='password' label='Your password' 
          error={errors['password']} touched={touched['password']}
          handleChange={handleChange} handleBlur={handleBlur}/>  
          <button disabled={disabled} onClick={() => {registerUser(values, setLoading, setAlertMessage)}}
        className={`${disabled ? 'opacity-50' : 'hover:bg-opacity-90'} mt-8 h-8 w-full flex items-center justify-center text-white bg-sky-500 rounded`}>
          { loading ? <ClipLoader loading={loading} size={25} color='#FFFFFF'/> : 'Log in' }
        </button>
        </form>
      <div className='mt-5 relative w-full flex items-center justify-center text-sm text-gray-500'> 
        <span className='w-full h-1 border-t border-gray-300'/>
        <span className='absolute bg-white px-2 pb-1.5'>Or register with</span>
      </div>
      <div className='w-full flex items-center justify-between mt-6'>
        <button className='w-[49%] h-8 border border-gray-300 rounded text-gray-500 flex items-center justify-center hover:opacity-90'>
          <FaGoogle/>
        </button>
        <button className='w-[49%] h-8 border border-gray-300 rounded text-gray-500 flex items-center justify-center hover:opacity-90'>
          <FaGithub/>
        </button>
      </div>
      <p className='w-full text-center mt-6 text-gray-500 text-sm'>Already have an account? <span className='underline hover:opacity-90 cursor-pointer' onClick={handleLoginModal}>Log in</span></p>         
      </div>
      { alertMessage && <PopUpAlert message={alertMessage} error/> }
    </>
  )
}

export default RegisterForm
