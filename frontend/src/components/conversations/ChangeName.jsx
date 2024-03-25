import { useState, useEffect, useContext } from 'react';
import { useFormik } from 'formik';
import axios from 'axios';

import MoonLoader from 'react-spinners/MoonLoader';

import ConversationsContext from '../../context/ConversationsContext';
import AuthContext from '../../context/AuthContext';

const ChangeName = ({ shrink, setShrink}) => {
  const [disabled, setDisabled] = useState(true);
  const [loading, setLoading] = useState(false);
  const { activeConversation, setActiveConversation, setConversations, setMessages, chatSocket } = useContext(ConversationsContext);
  const { authTokens } = useContext(AuthContext);

  const { values, handleBlur, handleChange } = useFormik({
    initialValues : {
        'name' : activeConversation.name
    }
  });

  const handleChangeName = () => {
    setLoading(true);

    let headers;

    if (authTokens) {
        headers = {
            'Authorization' : 'Bearer ' + String(authTokens.access)
        }
    }

    axios({
        url : 'http://127.0.0.1:8000/groups/name/update',
        method : 'PUT',
        headers : headers,
        data : {'group_id' : activeConversation.id, name : values.name}
    })
    .then ( (res) => {
        setActiveConversation( prevStatus => {
            let updatedStatus = {...prevStatus};
            updatedStatus.name = values.name;

            return updatedStatus;
        });

        setConversations( prevStatus => {
            let updatedStatus = [...prevStatus];
            const index = updatedStatus.findIndex( conversation => conversation.id === activeConversation.id);

            updatedStatus[index].name = values.name;
            updatedStatus[index].last_message = res.data;
            return updatedStatus
        });

        setMessages( prevStatus => {
            if (prevStatus.length > 0) return [...prevStatus, res.data];
            return [res.data];
        });

        chatSocket.send(JSON.stringify({
          'type' : 'update_group_name',
          'receiver_ids' : activeConversation.partners.map( partner => partner.id),
          'conversation_id' : activeConversation.id,
          'new_name' : values.name,
        }));

        setShrink(true);
    })
    .catch( err => {
        console.log(err);
        setLoading(false);
    })
  };


  useEffect( () => {
    if (values.name.length === 0 || values.name === activeConversation.name) setDisabled(true);
    else setDisabled(false);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [values])

  return (
    <div className={`mt-auto mb-auto w-[500px] rounded-lg shadow-lg bg-white ${ shrink ? 'animate-shrink' : 'animate-grow'} px-5 pt-5 pb-2.5`}>
      <h3 className='font-bold'>Change group name</h3>
      <div className='mt-5'>
        <label htmlFor='name' className='font-semibold'>Name</label>
        <input value={values.name} id='name' name='name' className='mt-1 pl-2.5 w-full h-10 rounded border border-gray-200 focus:outline-none focus:border-2 focus:border-sky-500' 
        onChange={handleChange} onBlur={handleBlur}/>
      </div>
      <div className='mt-5 h-16 w-full flex items-center justify-end space-x-5 border border-b-0 border-r-0 border-l-0'>
        <button onClick={() => setShrink(true)}>Cancel</button>
        <button disabled={disabled} className={`w-[80px] h-10 flex items-center justify-center text-white bg-sky-400
         rounded-lg ${ disabled || loading ? 'opacity-50' : 'hover:bg-sky-600 hover:text-gray-50'} transition-colors duration-300`}
         onClick={handleChangeName}>
          { loading ? <MoonLoader loading={loading} color='#FFFFFF' size={25}/> : 'Continue'}
        </button>  
      </div>
    </div>
  )
}

export default ChangeName
