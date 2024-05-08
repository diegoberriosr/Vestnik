import { useState, useEffect, useContext } from 'react';
import { useFormik } from 'formik';
import axios from 'axios';

// Icon imports
import { IoMdClose } from "react-icons/io";

// Component imports
import ImageInput from '../inputs/ImageInput';
import MoonLoader from 'react-spinners/MoonLoader';

// Context imports
import AuthContext from '../../context/AuthContext';
import ConversationsContext from '../../context/ConversationsContext';

const EditProfile = ({ shrink, setShrink }) => {

  const [disabled, setDisabled] = useState(true);
  const [loading, setLoading] = useState(false);
  const {user, authTokens, setUser} = useContext(AuthContext);
  const { chatSocket, getAllOnlineUserIds, conversations } = useContext(ConversationsContext);

  const [imageUrl, setImageUrl] = useState('');
  const [file, setFile] = useState(null);
  const image = new FormData();

  const {values, handleChange, handleBlur} = useFormik({
    initialValues : {
        'name' : user.name,
        'info' : user.info,
        'pfp' :  user.pfp
    }
  });

  const handleEditProfile = (e) => {

    if (e) e.preventDefault();
    if (values.name.length === 0 ) return;

    setLoading(true);
    let headers;

    if (authTokens) {
      headers = {
        'Authorization' : 'Bearer ' + String(authTokens.access),
        'Content-Type' : ''
      }
    };

    const data = new FormData();
    
    data.append('name', values.name);
    data.append('info', values.info);

    if (file) data.append('pfp', file); 

    axios({
      url : 'https://vestnik.onrender.com/update/profile',
      method : 'PUT',
      headers : headers,
      data : data
    })
    .then( (res) => {
      setUser(res.data);

      chatSocket.send(JSON.stringify({
        'type' : 'update_profile',
        'receiver_ids' : getAllOnlineUserIds(conversations),
        'origin_id' : user.id,
        'new_name' : values.name,
        'new_info' : values.info,
        'new_pfp' : values.pfp
      }))

      setLoading(false);
      setShrink(true);
    })
    .catch ( err => {
      console.log(err);
      setLoading(false);
    });

  } 

  useEffect( () => {
    if (values.name=== user.name && values.info === user.info && values.pfp === user.pfp) setDisabled(true);
    else setDisabled(false);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [values]);


 
  return (
    <div className={`relative w-screen h-screen sm:w-[500px] sm:h-[400px] shadow p-5 ${ shrink ? 'animate-shrink' : 'animate-grow' } bg-white mt-auto mb-auto rounded`}>
        <IoMdClose className='absolute top-3 right-3 text-2xl text-gray-400 cursor-pointer' onClick={() => setShrink(true)}/>
        <h2 className='font-semibold'>Profile</h2>
        <p className='mt-1 text-gray-600 text-sm'>Edit your public information.</p>
        <form onSubmit={e => handleEditProfile(e)}>
        <div className='mt-5 space-y-2 flex items-center space-x-5'>
              <ImageInput image={image} generateUrl handleGenerateUrl={setImageUrl} setFiles={setFile}>
                  <figure className='w-12 h-12 rounded-full cursor-pointer'>
                    <img src={imageUrl.length > 0 ? imageUrl : user.pfp} alt='user pfp' className='w-full h-full rounded-full object-fit'/>
                  </figure>
              </ImageInput>
                <button className='font-semibold'>Change</button>
             </div>
            <div className='mt-5 space-y-2'>
            <label className='font-semibold'>Name</label>
            <input value={values.name} name='name' id='name'
            className='w-full h-10 pl-2.5 border border-gray-600 focus:outline-none focus:border-2 focus:border-blue-300 rounded transition-colors duration-300 ' placeholder="Your profile's name"
            onChange={handleChange} onBlur={handleBlur}/>
            </div>
            <div className='mt-5 space-y-2'>
            <label className='font-semibold'>Info</label>
            <input value={values.info} name='info' id='info'
            className='w-full h-10 pl-2.5 border border-gray-600 focus:outline-none focus:border-2 focus:border-blue-300 rounded transition-colors duration-300 ' placeholder="Your profile's info"
            onChange={handleChange} onBlur={handleBlur}/>
            </div>
        </form>
        <div className='mt-1 h-20 w-full flex items-center justify-end space-x-5'>
        <button type='button' onClick={() => setShrink(true)}>Cancel</button>
        <button type='submit' disabled={disabled} className={`w-[80px] h-10 flex items-center justify-center text-white bg-sky-500
         rounded-lg ${ disabled || loading ? 'opacity-50' : 'hover:bg-sky-600 hover:text-gray-50'} transition-colors duration-300`}
         onClick={handleEditProfile}>
          { loading ? <MoonLoader loading={loading} color='#FFFFFF' size={25}/> : 'Continue'}
        </button>  
        </div>
    </div>
  )
}

export default EditProfile
