import { useState } from 'react';

// Icon imports
import { GoEye } from "react-icons/go";
import { GoEyeClosed } from "react-icons/go";

const Input = ({ name, type, id, label, value, error, touched, handleChange, handleBlur }) => {
  
  const [visible, setVisible] = useState( type === 'password' ? false : true);
  
  const handlePasswordVisibility = () => {
    setVisible(!visible);
  }

  return (
    <div className='relative w-full mt-5'>
      <label className='text-sm text-gray-900 font-semibold' htmlFor={id}>{label}</label>
      <input value={value} name={name} id={id} type={type === 'password' ? ( visible ? 'text' : 'password' ) : type}
      className={`mt-2 pl-1 h-8 w-full shadow-sm border ${ error && touched ? 'border-red-700' : 'border-gray-300 focus:border-sky-500'} focus:border-2 rounded focus:outline-none transition-colors duration-300`}
      onChange={handleChange} onBlur={handleBlur}/>
      {error && touched && <span className='absolute -bottom-5 left-2 text-red-700 text-xs'>{error}</span>}
      {
        type === 'password'  && 
        <div className='absolute bottom-1.5 right-2 cursor-pointer' onClick={handlePasswordVisibility}>
            { visible ? <GoEyeClosed/> : <GoEye/> }
        </div>
      }
    </div>
  )
}

export default Input
