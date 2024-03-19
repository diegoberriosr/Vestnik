import { useState, useContext} from 'react';

import axios from 'axios';

import RoundedCheckbox from "../inputs/RoundedCheckbox"

import AuthContext from '../../context/AuthContext';
import ConversationsContext from '../../context/ConversationsContext';

const MessageMenu = ({shrink, setShrink, messageId, senderId, isAdmin}) => {
  const [deleteAll, setDeleteAll] = useState(false);
  const [disabled, setDisabled] = useState(true);
  const [loading, setLoading] = useState(false);

  const {authTokens, user} = useContext(AuthContext);
  const { setMessages, setConversations, activeConversation } = useContext(ConversationsContext);

  const handleChange = (status) => {
    if(disabled) setDisabled(false);
    setDeleteAll(status);
  };

  const handleSubmit = () => {
    setLoading(true);
    let headers;

    if (authTokens){
        headers = {
            'Authorization' : 'Bearer ' + String(authTokens.access)
        }
    }

    axios({
        url : 'http://127.0.0.1:8000/messages/delete',
        method : 'PUT',
        headers : headers,   
        data : { message_id : messageId, permanent : deleteAll}
    })
    .then( (res) => {
        setConversations( prevStatus => {
            const index = prevStatus.findIndex( conversation => conversation.id === activeConversation.id);
            let updatedStatus = [...prevStatus];
            updatedStatus[index].last_message = res.data
            return updatedStatus;
        })
        setMessages( prevStatus => {
            return prevStatus.filter( message => message.id !== messageId);
        })
        setShrink(true);
    })
    .catch( err => {
        setLoading(false);
        console.log(err);
    })
  }

  return (
    <div className={`relative w-[600px] h-[300px] bg-white rounded p-5 z-[25] mt-auto mb-auto ${ shrink ? 'animate-shrink' : 'animate-grow'}`}>
        <h3 className='text-lg'>Who do you want to remove this message for</h3>
        
        <form>
            {(user.id === senderId || isAdmin) &&
            <RoundedCheckbox 
            value={true}
            handleChange={handleChange}
            containerStyle='mt-5 flex items-start' 
            labelText='Remove for everyone'
            descriptionText="You'll permanently remove this message for all chat members"/>
            }
            <RoundedCheckbox 
            value={false}
            handleChange={handleChange}
            containerStyle='mt-5 flex items-start' 
            labelText='Remove for myself'
            descriptionText="This message will be deleted for you. Other chat members will still be able to see it"/>
        </form>
        <div className='absolute bottom-3.5 right-3.5 w-full flex items-center justify-end space-x-3'>
            <button className='w-[100px] h-10 text-blue-900 text-center' onClick={ () => setShrink(true)}>
                Cancel
            </button>            
            <button className='w-[100px] h-10 text-red-900 text-center' disabled={disabled} onClick={handleSubmit}>
                { loading ? 'LOADING' : 'Remove'}
            </button>
        </div>
    </div>
  )
}

export default MessageMenu