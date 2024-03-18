import { useContext, useState, useEffect } from 'react';
import axios from 'axios';

import Select from '../inputs/Select';
import MoonLoader from 'react-spinners/MoonLoader';

import ConversationsContext from "../../context/ConversationsContext"
import AuthContext from '../../context/AuthContext';

const AddUsers = ({ shrink, setShrink}) => {
  const {activeConversation, setMessages, setConversations} = useContext(ConversationsContext);
  const {authTokens} = useContext(AuthContext);

  const [disabled, setDisabled] = useState(true);
  const [loading, setLoading] = useState(false);
  const [userIds, setUserIds] = useState([]);

  const partnerIds = activeConversation.partners.map( partner => partner.id);

  const handleCreateGroup = (e) => {
    if (e) e.preventDefault();


    let headers;

    if (authTokens){
      headers = {
        'Authorization' : 'Bearer ' + String(authTokens.access)
      }
    }

    setLoading(true);
    axios({
      url : 'http://127.0.0.1:8000/groups/create',
      method : 'POST',
      headers : headers,
      data : { user_ids : userIds },
    })
    .then( res => {
      setConversations( prevStatus => {
        if (prevStatus.length > 0) return [res.data, ...prevStatus];
        return [res.data];
      });
      setShrink(true);
    })
    .catch( err => {
        setLoading(false);
        console.log(err);
    })
    
  };

  useEffect( () => {
    if(userIds.length === 0) setDisabled(true);
    else setDisabled(false);
  }, [userIds])

    return (
    <div className={`relative mt-auto mb-auto w-[500px] h-[300px] bg-white p-5 ${ shrink ? 'animate-shrink' : 'animate-grow'}`}>
      <h3 className='max-w-full truncate'>Add users to <span className='font-bold'>{activeConversation.name}</span></h3>
      <Select setUsers={setUserIds} excludeList={partnerIds}/>
      <div className='absolute bottom-2 right-5 h-20 w-full flex items-center justify-end space-x-5 border border-b-0 border-r-0 border-l-0'>
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

export default AddUsers
