import { useState, useContext} from 'react';

import axios from 'axios';

import RoundedCheckbox from "../inputs/RoundedCheckbox"
import MoonLoader from 'react-spinners/MoonLoader';

import AuthContext from '../../context/AuthContext';
import ConversationsContext from '../../context/ConversationsContext';

const MessageMenu = ({shrink, setShrink, messageId, senderId, isAdmin}) => {
  const [option, setOption] = useState('');
  const [disabled, setDisabled] = useState(true);
  const [loading, setLoading] = useState(false);

  const {authTokens, user} = useContext(AuthContext);
  const { setMessages, setConversations, activeConversation, chatSocket } = useContext(ConversationsContext);

  const handleChange = (status) => {
    if(disabled) setDisabled(false);
    setOption(status);
  };

  const handleSubmit = (event) => {
    event.preventDefault()
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
        data : { message_id : messageId, permanent : option === 'deleteAll' ? true : false}
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
        });

        if (option === 'deleteAll') chatSocket.send(JSON.stringify({
            'type' : 'delete_message',
            'receiver_ids' : activeConversation.partners.map( partner => partner.id),
            'message_id' : messageId,
            'last_message_id' : res.data.id,
            'conversation_id' : activeConversation.id,
        })) 
        setShrink(true);
    })
    .catch( err => {
        setLoading(false);
        console.log(err);
    })
  }

  return (
    <div className={`relative w-[600px] bg-white rounded p-5 z-[25] mt-auto mb-auto ${ shrink ? 'animate-shrink' : 'animate-grow'}`}>
        <h3 className='text-lg'>Who do you want to remove this message for</h3>
        <form className='mt-5' onSubmit={(e) => handleSubmit(e)}>
            {(user.id === senderId || isAdmin) &&
            <RoundedCheckbox 
            selectedValue={option}
            value='deleteAll'
            handleChange={handleChange}
            containerStyle='mb-5 flex items-start' 
            labelText='Remove for everyone'
            descriptionText="You'll permanently remove this message for all chat members"/>
            }
            <RoundedCheckbox 
            selectedValue={option}
            value='delete'
            handleChange={handleChange}
            containerStyle='mb-5 flex items-start' 
            labelText='Remove for myself'
            descriptionText="This message will be deleted for you. Other chat members will still be able to see it"/>
            <div className='mt-10 mr-auto w-full flex items-center justify-end space-x-3'>
                <button type='button' className='w-[100px] h-10 text-sky-500 text-center' onClick={ () => setShrink(true)}>
                    Cancel
                </button>            
                <button type='submit' className={`${ disabled ? 'opacity-50' : ''} w-[100px] h-10 text-red-900 flex items-center justify-center`} disabled={option === '' ? true : false}>
                    { loading ? <MoonLoader loading={loading} color='#FF0000' size={15}/>: 'Remove'}
                </button>
            </div>
        </form>
    </div>
  )
}

export default MessageMenu