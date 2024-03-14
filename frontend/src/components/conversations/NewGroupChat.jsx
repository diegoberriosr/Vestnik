import { useState, useEffect } from 'react';
import { useFormik } from 'formik';
import  MoonLoader from 'react-spinners/MoonLoader';

import { IoMdClose } from "react-icons/io";

const NewConversation = ({ shrink, setShrink }) => {

  const [loading, setLoading] = useState(false);
  const [disabled, setDisabled] = useState(true);

  console.log('loading');

  const {values, handleChange, handleBlur} = useFormik({
    initialValues : {
      'name' : ''
    }
  });

  const handleCreateGroup = (e) => {
    if (e) e.preventDefault();
    if ( values.name.length === 0) return;

    setLoading(true);

  };

  useEffect( () => {
    if (values.name.length === 0) setDisabled(true);
    else setDisabled(false);
  }, [values]);

  useEffect( () => {
    if (loading) {
      const timer = setTimeout( () => {
        setShrink(true);
      }, 3000)
      return () => clearTimeout(timer);
    }
  }, [loading])

  return (
    <div className={`relative w-screen h-screen sm:w-[500px] sm:h-[400px] sm:mt-auto sm:mb-auto bg-white rounded-lg shadow ${ shrink ? 'animate-shrink' : 'animate-grow'} p-5`}>
      <IoMdClose className='absolute top-3 right-3 text-xl text-gray-400 font-bold cursor-pointer' onClick={() => setShrink(true)}/>
      <h2 className='font-semibold'>Create a group chat</h2>
      <p className='mt-1 text-gray-600 text-sm'>Create a chat with more than two people</p>
      <form onSubmit={ e => handleCreateGroup(e) }>
        <div className='mt-10 space-y-2'>
          <label className='font-semibold'>Name</label>
          <input value={values.name} name='name' id='name'
          className='w-full h-10 pl-2.5 border border-gray-600 focus:outline-none focus:border-2 focus:border-blue-300 rounded transition-colors duration-300 ' placeholder='Group name'
          onChange={handleChange} onBlur={handleBlur}/>
        </div>
        <div className='mt-5 space-y-2'>
          <label className='font-semibold'>Members</label> 
          <input className='w-full h-10 pl-2.5 border border-gray-600 focus:outline-none focus:border-2 focus:border-blue-300 rounded transition-colors duration-300 ' placeholder='Members'/>
        </div>
      </form>
      <div className='mt-10 h-20 w-full flex items-center justify-end space-x-5 border border-b-0 border-r-0 border-l-0'>
        <button onClick={() => setShrink(true)}>Cancel</button>
        <button disabled={disabled} className={`w-[80px] h-10 flex items-center justify-center text-white bg-blue-500\
         rounded-lg ${ disabled || loading ? 'opacity-50' : 'hover:bg-blue-600 hover:text-gray-50'} transition-colors duration-300`}
         onClick={handleCreateGroup}>
          { loading ? <MoonLoader loading={loading} color='#FFFFFF' size={25}/> : 'Continue'}
        </button>  
      </div>
    </div>
  )
}

export default NewConversation
