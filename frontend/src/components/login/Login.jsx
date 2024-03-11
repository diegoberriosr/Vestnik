import { useState, useContext } from 'react';
import { useFormik } from 'formik'

// Icon imports
import { FaFacebookMessenger } from "react-icons/fa";
import { IoIosWarning } from "react-icons/io";

// Component imports
import Step0 from './Step0';
import Step1 from './Step1';
import PopUpAlert from '../alerts/PopUpAlert';
import CircleLoader from 'react-spinners/CircleLoader';

// Context imports
import AuthContext from '../../context/AuthContext';

const Login = () => {
  const [step, setStep] = useState(0)
  const [disabled, setDisabled] = useState(true);
  const [loading, setLoading] = useState(false);
  const [alertMessage, setAlertMessage] = useState(null);

  const {loginUser} = useContext(AuthContext);

  const {values, errors, touched, handleChange, handleBlur} = useFormik({
    initialValues : {
      'email' : '',
      'password' : ''
    }
  })



  const handleContinue = () => {
    if(!disabled && step < 1) setStep(step+1);
    else loginUser(values, setLoading, setAlertMessage);
  }

  return (
    <>
        <div className='w-screen h-screen sm:mt-5 sm:w-[500px] sm:h-[600px] bg-white drop-shadow-2xl flex flex-col items-center px-5 pt-10'>
                <FaFacebookMessenger className='text-dark-salmon text-5xl'/>
                <h6 className='mt-1.5 font-bold text-4xl'>Vestnik</h6>
                <h3 className='mt-3'>Chat anywhere, anytime.</h3>
                { step === 0 && <Step0 values={values} errors={errors} touched={touched} setDisabled={setDisabled} handleChange={handleChange} handleBlur={handleBlur}/>}
                { step === 1 && <Step1 values={values} setDisabled={setDisabled} handleChange={handleChange} handleBlur={handleBlur} />}
                <button disabled={disabled} className={`${disabled ? 'opacity-50' : 'hover:opacity-90'} mt-2 w-[300px] h-10 border border-black bg-salmon font-bold`} onClick={handleContinue}>{loading ?
                 <CircleLoader color='#ffffff' loading={loading} size={40}/> : 
                 'Continue'}</button>
                { step === 0 &&
                <>
                    <span className='mt-10'>Don't have an account?</span>
                    <span className='text-salmon'>Create account</span>
                </>
                }
        </div>
        {alertMessage && <PopUpAlert color='bg-white'>
                <IoIosWarning className='text-2xl text-red-500'/>
                <span className='font-bold'>{alertMessage}</span>
            </PopUpAlert>}
    </>
  )
}

export default Login
