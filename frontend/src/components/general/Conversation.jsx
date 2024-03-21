import { useContext, useState, useEffect } from 'react';
import { useFormik } from 'formik';
import axios from 'axios';


// Icon imports
import { FaImage } from "react-icons/fa";
import { BiSolidSend } from "react-icons/bi";

// Component imports
import ConversationHeader from '../conversations/ConversationHeader';
import GroupChatHeader from '../conversations/GroupChatHeader';
import ConversationDrawer from '../conversations/ConversationDrawer';
import Message from '../messages/Message';
import Notification from '../messages/Notification';
import TypingAlert from '../alerts/TypingAlert';
import Modal from './Modal';
import MessageMenu from '../conversations/MessageMenu';

// Context imports
import ConversationsContext from '../../context/ConversationsContext';
import AuthContext from '../../context/AuthContext';

const Conversation = () => {
  const [displayInformation, setDisplayInformation] = useState(false);
  const [deleteModal, setDeleteModal] = useState(false);
  const [shrink, setShrink] = useState(false);
  const [selectedMessage, setSelectedMessage] = useState(null);
  
  const [disabled, setDisabled] = useState(true);
  
  const {activeConversation, messages, setMessages, setConversations } = useContext(ConversationsContext);
  const { authTokens } = useContext(AuthContext);

  const {values, handleChange, handleBlur, setFieldValue} = useFormik({
    initialValues : {
      'content' : ''
    }
  });

  const handleSendMessage = (e) => {
                                                          
    if (e) e.preventDefault();
    if (!disabled){
        
        setFieldValue('content', '');
        let headers
        
        if (authTokens) {
          headers = {
            'Authorization' : 'Bearer ' + String(authTokens.access)
          }
        };
    
        axios({
          url : 'http://127.0.0.1:8000/messages/create',
          method : 'POST',
          headers : headers,
          data : { conversation_id : activeConversation.id, content : values.content}
        })
        .then( res => {
          setMessages( prevStatus => {
            if (prevStatus.length > 0) return [...prevStatus, res.data];
            return [res.data];
          });
          setConversations( prevStatus => {
            let updatedStatus = [...prevStatus];
            const index = updatedStatus.findIndex(conversation => activeConversation.id === conversation.id);

            updatedStatus[index].last_message = res.data;
            const arrangedArray =   [updatedStatus[index], ...updatedStatus.filter( conversation => conversation.id !== activeConversation.id )];
            return arrangedArray;
          });
        })
        .catch( err => {
          console.log(err)
        })
    }
  }

  const handleOpenDeleteModal = (message) => {
    setSelectedMessage(message);
    setDeleteModal(true);
  }

  useEffect( () => {
    setDisplayInformation(false);
  }, [activeConversation]);

  useEffect( () => {
    if (values.content.length === 0){
      setDisabled(true);
    }
    else {
      setDisabled(false);
    }
  }, [values.content]);

  useEffect( () => {
    if( shrink) {
      const timer = setTimeout( () => {
        setDeleteModal(false);
        setShrink(false);
      }, 250)

      return () => clearTimeout(timer);
    }
  }, [shrink])

  if (!activeConversation) return null;
  
  return (
  <main className={`relative ${ activeConversation ? 'w-screen' : ''} w-screen xl:w-[70%] h-screen`}>
    <header className='w-full h-16 flex items-center justify-between px-5 shadow'>
        {activeConversation && activeConversation.is_group_chat ? <GroupChatHeader setDisplayInformation={setDisplayInformation}/> : <ConversationHeader setDisplayInformation={setDisplayInformation}/>}
    </header>
    <ul className='w-full h-[calc(100vh-129px)] overflow-y-auto p-5'>
        { messages.length > 0 && messages.map( (message, index) => {
          if (message.is_notification) return <Notification key={index} messageContent={message.content} timestamp={message.timestamp}/>
          return <Message key={index} message={message} handleOpenDeleteModal={handleOpenDeleteModal}/>
        })}
        <TypingAlert pfp={activeConversation.partners[0].pfp}/>
    </ul>
    <footer className='w-full h-16 flex items-center justify-between px-5  border border-l-0 border-r-0 border-b-0'>
        <FaImage className='text-3xl text-sky-500 cursor-pointer'/>
        <form className='w-[90%]' onSubmit={e => handleSendMessage(e)}>
          <input name='content' value={values.content} 
          className='w-full h-10 pl-5 bg-gray-100 rounded-full focus:outline-none focus:border-2 focus:border-sky-500 mx-2 sm:mx-0' 
          placeholder='Type a message'
          onChange={handleChange}
          onBlur={handleBlur}/>
        </form>
        <button disabled={disabled} className={`${disabled ? 'opacity-50' : ''} h-10 w-10 bg-sky-500 rounded-full text-center text-white flex items-center justify-center`} onClick={handleSendMessage}>
            <BiSolidSend className='text-2xl'/>
        </button>
    </footer>
    <ConversationDrawer isVisible={displayInformation} setDisplayInformation={setDisplayInformation} isGroup={activeConversation.is_group_chat}/>
    <Modal isVisible={deleteModal}>
       { selectedMessage && <MessageMenu shrink={shrink} setShrink={setShrink} messageId={selectedMessage.id} senderId={selectedMessage.sender.id} isAdmin={selectedMessage.is_admin}/>}
    </Modal>
  </main>
  )
}

export default Conversation
