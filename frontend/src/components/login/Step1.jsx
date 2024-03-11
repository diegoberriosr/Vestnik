
import { useEffect } from 'react';

const Step1 = ({values, setDisabled, handleChange, handleBlur}) => {

  useEffect(() => {
    if (values.password.length===0) setDisabled(true);
    else setDisabled(false);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [values]);

  return (
    <>
      <input disabled={true} value={values.email} name='email' className='opacity-50 mt-5 pl-1.5 w-[300px] h-10 focus:outline-none border' placeholder='E-mail address' onChange={handleChange} onBlur={handleBlur}/> 
      <input value={values.password} name='password' className='mt-5 pl-1.5 w-[300px] h-10 focus:outline-none border' placeholder='Password' onChange={handleChange} onBlur={handleBlur}/> 
      <span className='mr-44 text-salmon text-xs horver:underline cursor-pointer mb-10'>Forgot password?</span>
    </>
  )
}

export default Step1
