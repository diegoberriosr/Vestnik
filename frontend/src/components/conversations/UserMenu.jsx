import { useState, useContext,  useEffect} from 'react';
import axios from 'axios';

import RoundedCheckbox from '../inputs/RoundedCheckbox';
import MoonLoader from 'react-spinners/MoonLoader';

import ConversationsContext from '../../context/ConversationsContext';
import AuthContext from '../../context/AuthContext';

const UserMenu = ({ shrink, setShrink, user }) => {

  const [loading, setLoading] = useState(false);
  const [disabled, setDisabled] = useState(true);
  const [option, setOption] = useState('');
  
  const { authTokens } = useContext(AuthContext);
  const { setMessages, activeConversation, setConversations, setActiveConversation, conversations } = useContext(ConversationsContext);

  const handleContinue = () => {
    setLoading(true);

    let headers;

    if (authTokens) {
      headers = {
        'Authorization' : 'Bearer ' + String(authTokens.access)
      }
    };

    const baseUrl = 'http://127.0.0.1:8000/';
    let path;
    let data;

    if(option === 'message') {
      const filteredConversations = conversations.filter( conversation => !conversation.is_group_chat) // filter group chats
      const index = filteredConversations.findIndex( conversation => conversation.partners[0].id === user.id);

      if (index > -1){
        setActiveConversation(conversations[index]);
        setShrink(true);
        return;
      };

      path = 'conversations/create';
      data = {user_ids : [user.id]};
    }

    else if (option === 'admin') {
    path ='groups/admins/update';
    data = {group_id : activeConversation.id , user_ids : [user.id]}
    }

    else
    {
    path = 'groups/members/update';
    data = {group_id : activeConversation.id, user_ids : [user.id]}
    }
 
    axios({
      url : baseUrl+path,
      method : option === 'message' ? 'POST' : 'PUT',
      headers : headers,
      data : data
    })
    .then( (res) => {
      if( option === 'remove') {
        const lastMessage = { is_notification : true, content : `${user.name} was removed from this group.`, sender : null, timestamp : new Date().getTime()};
        
        setConversations( prevStatus => {
          const index = conversations.findIndex( conversation => conversation.id === activeConversation.id);
          let updatedStatus = [...prevStatus];
          conversations[index].partners = conversations[index].partners.filter( partner => partner.id !== user.id);
          conversations[index].last_message = lastMessage;

          return updatedStatus;
        })
        setMessages(prevStatus => {
          if (prevStatus.length > 0) return [...prevStatus, lastMessage];
          return [lastMessage];
        })
      };

      if (option === 'admin') {
        const lastMessage = { is_notification : true, content : `${user.name} is ${ user.is_admin ? 'no longer' : 'now'} an admin for this group.`, timestamp : new Date().getTime()}
        setConversations( prevStatus => {
          const conversationIndex = prevStatus.findIndex( conversation => conversation.id === activeConversation.id);
          let updatedStatus = [...conversations];
          const partnerIndex = updatedStatus[conversationIndex].partners.findIndex( partner => partner.id === user.id);

          conversations[conversationIndex].partners[partnerIndex].is_admin = !conversations[conversationIndex].partners[partnerIndex].is_admin;
          conversations[conversationIndex].last_message = lastMessage;
          return updatedStatus;

        });

        setMessages(prevStatus => {
          if (prevStatus.length > 0) return [...prevStatus, lastMessage];
          return [lastMessage];
        })
      };

      if ( option === 'message') {
        setActiveConversation(res.data);
        setConversations( prevStatus => {
          if(prevStatus.length > 0) return [res.data, ...prevStatus];
          return [res.data];
        });
      }

      setShrink(true);
      setLoading(false);
    })
    .catch( err => {
      setLoading(false);
      console.log(err);
    })
  };

  useEffect( () => {
    if (option === '') setDisabled(true);
    else setDisabled(false);
  }, [option])

  return (
    <div className={`relative mt-auto mb-auto w-[500px] h-[400px] p-5 bg-white rounded ${shrink ? 'animate-shrink' : 'animate-grow'}`}>
      <h3 className='font-semibold'>Select an action</h3>
      <RoundedCheckbox value='message' containerStyle='mt-5 flex items-start'  labelText={`Message ${user.name}`} descriptionText='Start a new conversation or continue an already existing one with them' handleChange={setOption}/>    
      <RoundedCheckbox value='admin' containerStyle='mt-5 flex items-start' labelText={`Update ${user.name}'s administrator status`} descriptionText="Add or remove them from this group's administrator list" handleChange={setOption}/>   
      <RoundedCheckbox value='remove' containerStyle='mt-5 flex items-start' labelText={`Remove ${user.name}`} descriptionText='Remove them from this group.' handleChange={setOption}/>   
      <div className='absolute bottom-2 right-5 h-20 w-full flex items-center justify-end space-x-5 border border-b-0 border-r-0 border-l-0'>
        <button onClick={() => setShrink(true)}>Cancel</button>
        <button disabled={disabled} className={`w-[80px] h-10 flex items-center justify-center text-white bg-blue-500\
         rounded-lg ${ disabled || loading ? 'opacity-50' : 'hover:bg-blue-600 hover:text-gray-50'} transition-colors duration-300`}
         onClick={handleContinue}>
          { loading ? <MoonLoader loading={loading} color='#FFFFFF' size={25}/> : 'Continue'}
        </button>  
      </div>
    </div>
  )
}

export default UserMenu
