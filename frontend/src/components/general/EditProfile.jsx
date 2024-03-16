import { useState, useEffect, useContext } from 'react';
import { useFormik } from 'formik';

// Icon imports
import { IoMdClose } from "react-icons/io";

// Component imports
import MoonLoader from 'react-spinners/MoonLoader';

// Context imports
import AuthContext from '../../context/AuthContext';

const EditProfile = ({ shrink, setShrink }) => {

  const [disabled, setDisabled] = useState(true);
  const [loading, setLoading] = useState(false);
  const {user} = useContext(AuthContext);

  const {values, handleChange, handleBlur} = useFormik({
    initialValues : {
        'username' : user.name,
        'pfp' :  user.pfp
    }
  });

  const handleEditProfile = (e) => {
    if (e) e.preventDefault();
    if (values.username.length === 0 ) return;

    setLoading(true);

  } 

  useEffect( () => {
    if (values.username.length === 0 || values.username === user.name) setDisabled(true);
    else setDisabled(false);
  }, [values]);

  useEffect( () => {
    if(loading){
        const timer = setTimeout( () => {
            setShrink(true);
        }, 3000)

        return () => clearTimeout(timer);
    }
  }, [loading]);

  return (
    <div className={`relative w-screen h-screen sm:w-[500px] sm:h-[400px] shadow p-5 ${ shrink ? 'animate-shrink' : 'animate-grow' } bg-white mt-auto mb-auto rounded`}>
        <IoMdClose className='absolute top-3 right-3 text-2xl text-gray-400 cursor pointer' onClick={() => setShrink(true)}/>
        <h2 className='font-semibold'>Profile</h2>
        <p className='mt-1 text-gray-600 text-sm'>Edit your public information.</p>
        <form onSubmit={e => handleEditProfile(e)}>
            <div className='mt-10 space-y-2'>
            <label className='font-semibold'>Name</label>
            <input value={values.username} name='username' id='name'
            className='w-full h-10 pl-2.5 border border-gray-600 focus:outline-none focus:border-2 focus:border-blue-300 rounded transition-colors duration-300 ' placeholder="Your profile's name"
            onChange={handleChange} onBlur={handleBlur}/>
            </div>
            <div className='mt-5 space-y-2 flex items-center space-x-5'>
                <figure className='w-12 h-12 rounded-full'>
                  <img src={user.pfp} alt='user pfp' className='w-full h-full rounded-full object-fit'/>
                </figure>
                <button className='font-semibold'>Change</button>
             </div>
        </form>
        <div className='mt-16 h-20 w-full flex items-center justify-end space-x-5 border border-b-0 border-r-0 border-l-0'>
        <button onClick={() => setShrink(true)}>Cancel</button>
        <button disabled={disabled} className={`w-[80px] h-10 flex items-center justify-center text-white bg-blue-500\
         rounded-lg ${ disabled || loading ? 'opacity-50' : 'hover:bg-blue-600 hover:text-gray-50'} transition-colors duration-300`}
         onClick={handleEditProfile}>
          { loading ? <MoonLoader loading={loading} color='#FFFFFF' size={25}/> : 'Continue'}
        </button>  
        </div>
    </div>
  )
}

export default EditProfile