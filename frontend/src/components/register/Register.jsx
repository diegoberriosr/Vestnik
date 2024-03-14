
import { useState, useContext } from 'react';
import { useFormik } from 'formik';


// Component imports
import PopUpAlert from '../alerts/PopUpAlert';

// Context imports
import AuthContext from "../../context/AuthContext"

const Register = () => {

  const [loading, setLoading ] = useState(false);
  const [alertMessage, setAlertMessage] = useState(null);
  const {registerUser} = useContext(AuthContext);

  const { values, handleChange, handleBlur } = useFormik({
    initialValues : {
        'email' : '',
        'username' : '',
        'password' : ''
    }
  });
  
  return (
    <div className='w-screen h-screen sm:w-[500px] sm:h-[600px] bg-white rounded shadow p-5'>
      <input value={values.email} name='email' placeholder='E-mail address' className='w-full h-10 border focus:outline-none' onChange={handleChange} onBlur={handleBlur}/>
      <input value={values.username} name='username' placeholder='Username' className='w-full h-10 border focus:outline-none' onChange={handleChange} onBlur={handleBlur}/>
      <input value={values.password} name='password' placeholder='Password' className='w-full h-10 border focus:outline-none' onChange={handleChange} onBlur={handleBlur}/>
      <button className='bg-dark-salmon border border-black' onClick={() => registerUser(values, setLoading, setAlertMessage)}>{ loading ? 'Loading' : 'Register'}</button>
      {alertMessage && <PopUpAlert>{alertMessage}</PopUpAlert>}
    </div>
  )
}

export default Register
