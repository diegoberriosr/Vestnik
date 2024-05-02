import { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { useFormik } from 'formik';

import { IoMdClose } from "react-icons/io";

import  MoonLoader from 'react-spinners/MoonLoader';
import Select from '../inputs/Select';

import AuthContext from '../../context/AuthContext';
import ConversationsContext from '../../context/ConversationsContext';


const NewGroupChat = ({ shrink, setShrink }) => {

  const [loading, setLoading] = useState(false);
  const [disabled, setDisabled] = useState(true);
  const [users, setUsers] = useState([]);

  const { authTokens } = useContext(AuthContext);
  const { setActiveConversation, setConversations, chatSocket} = useContext(ConversationsContext);


  const {values, handleChange, handleBlur} = useFormik({
    initialValues : {
      'name' : ''
    }
  });

  const handleCreateGroup = (e) => {
    if (e) e.preventDefault();
    if ( values.name.length === 0) return;

    let headers;

    if (authTokens){
      headers = {
        'Authorization' : 'Bearer ' + String(authTokens.access)
      }
    }

    setLoading(true);
    axios({
      url : 'https://vestnik.onrender.com/groups/create',
      method : 'POST',
      headers : headers,
      data : { name : values.name, user_ids : users },
    })
    .then( res => {
      setActiveConversation(res.data);
      setConversations( prevStatus => {
        if (prevStatus.length > 0) return [res.data, ...prevStatus];
        return [res.data];
      });
      chatSocket.send(JSON.stringify({
        'type' : 'new_message',
        'receiver_ids' : res.data.partners.map( partner => partner.id),
        'message_id' : res.data.id,
        'conversation_id' : res.data.id
      }));
      setShrink(true);
    })
    .catch( err => {
      setLoading(false);
      console.log(err);
    })

  };

  useEffect( () => {
    if (values.name.length === 0 || users.length === 0) setDisabled(true);
    else setDisabled(false);
  }, [values, users]);

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
        <Select setUsers={setUsers}/>
      </form>
      <div className='mt-10 h-20 w-full flex items-center justify-end space-x-5 border border-b-0 border-r-0 border-l-0'>
        <button onClick={() => setShrink(true)}>Cancel</button>
        <button disabled={disabled} className={`w-[80px] h-10 flex items-center justify-center text-white bg-sky-400
         rounded-lg ${ disabled || loading ? 'opacity-50' : 'hover:bg-sky-500 hover:text-gray-50'} transition-colors duration-300`}
         onClick={handleCreateGroup}>
          { loading ? <MoonLoader loading={loading} color='#FFFFFF' size={25}/> : 'Continue'}
        </button>  
      </div>
    </div>
  )
}

export default NewGroupChat
