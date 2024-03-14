import { useContext } from 'react';
import axios from 'axios';

import ConversationsContext from '../../context/ConversationsContext';
import AuthContext from '../../context/AuthContext';

const UserMiniature = ({ profile }) => {
  const { setActiveConversation, setConversations } = useContext(ConversationsContext);
  const { authTokens } = useContext(AuthContext);

  const handleNewConversation = () => {

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

  console.log(profile.id);

  return (
    <article className='w-full h-20 flex items-center space-x-2.5 hover:bg-gray-100 p-1 cursor-pointer' onClick={handleNewConversation}>
      <figure className='w-10 h-10 rounded-full'>
        <img src={profile.pfp} alt='user pfp' className='w-10 h-10 rounded-full object-fill'/>
      </figure>
      <span className='font-semibold'>{profile.name}</span>
    </article>
  )
}

export default UserMiniature
