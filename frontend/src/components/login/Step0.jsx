import { useEffect } from 'react';

const Step0 = ({values, errors, setDisabled, handleChange, handleBlur}) => {
  
  useEffect( () => {
    if (values.email.length === 0 || errors['email']) setDisabled(true);
    else setDisabled(false);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [values.email])

  return (
    <>
        <button className='mt-10 w-[300px] h-10 border flex justify-center items-center'>
             Google
        </button>
        <button className='mt-2.5 w-[300px] h-10 border flex justify-center items-center'>
            Apple
        </button>
         <div className='mt-5 flex items-center space-x-2'>
            <span className='w-[135px] h-1 border border-b-0 border-l-0 border-r-0 mt-1'/>
            <span>or</span>
            <span className='w-[135px] h-1 border border-b-0 border-l-0 border-r-0 mt-1'/>
        </div>
        <input value={values.email} name='email' className='mt-5 pl-1.5 w-[300px] h-10 focus:outline-none border' placeholder='E-mail address' onChange={handleChange} onBlur={handleBlur}/>
    </>
  )
}

export default Step0
