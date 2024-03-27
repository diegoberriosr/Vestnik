import { useContext } from 'react';
import axios from 'axios';

import ConversationsContext from '../../context/ConversationsContext';
import AuthContext from '../../context/AuthContext';

const UserMiniature = ({ profile }) => {
  const { setActiveConversation, setConversations, conversations} = useContext(ConversationsContext);
  const { authTokens } = useContext(AuthContext);

  const handleNewConversation = () => {

    const filteredConversations = conversations.filter( conversation => !conversation.is_group_chat) // filter group chats
    const index = filteredConversations.findIndex( conversation => conversation.partners[0].id === profile.id);

    if (index > -1) {
      setActiveConversation(conversations[index]);
      return;
    };

    let headers;

    if (authTokens) {
      headers = {
        'Authorization' : 'Bearer ' + String(authTokens.access)
      }
    };

    axios({
      url : 'http://127.0.0.1:8000/conversations/create',
      method : 'POST',
      headers : headers,
      data : {'user_ids' : [profile.id ]}
    })
    .then( res => {
      setActiveConversation(res.data);
      setConversations( prevStatus => {
        if (prevStatus.length > 0) return [...prevStatus, res.data]
        return [res.data];
      });
    })
    .catch( err => {
      console.log(err);
    })
  };



  return (
    <article className='w-full h-20 flex items-center space-x-2.5 hover:bg-gray-100 p-1 cursor-pointer' onClick={handleNewConversation}>
      <figure className='relative w-10 h-10 rounded-full'>
      { profile.is_online && <div className='absolute -right-1 -top-1 w-4 h-4 rounded-full border-2 border-white bg-green-600'/> }
        <img src={profile.pfp} alt='user pfp' className='w-10 h-10 rounded-full object-fill'/>
      </figure>
      <span className='font-semibold'>{profile.name}</span>
    </article>
  )
}

export default UserMiniature
