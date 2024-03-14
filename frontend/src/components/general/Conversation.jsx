import { useContext, useState, useEffect } from 'react';

// Icon imports
import { MdArrowBackIos } from "react-icons/md";
import { BsThreeDots } from "react-icons/bs";
import { FaImage } from "react-icons/fa";
import { BiSolidSend } from "react-icons/bi";

// Component imports
import ConversationHeader from '../conversations/ConversationHeader';
import GroupChatHeader from '../conversations/GroupChatHeader';
import ConversationDrawer from '../conversations/ConversationDrawer';

// Context imports
import ConversationsContext from '../../context/ConversationsContext';


const Conversation = () => {
  const [displayInformation, setDisplayInformation] = useState(false);
  const {activeConversation, setActiveConversation} = useContext(ConversationsContext);

  useEffect( () => {
    setDisplayInformation(false);
  }, [activeConversation])

  if (!activeConversation) return null;
  return (
  <main className={`${ activeConversation ? 'w-screen' : ''} w-screen xl:w-[70%] h-screen border`}>
    <header className='w-full h-14 flex items-center justify-between px-5 shadow'>
        {activeConversation.is_group_chat ? <GroupChatHeader setDisplayInformation={setDisplayInformation}/> : <ConversationHeader setDisplayInformation={setDisplayInformation}/>}
    </header>
    <ul className='w-full h-[calc(100vh-114px)] border overflow-y-auto'>
        
    </ul>
    <footer className='w-full h-14 flex items-center justify-between px-5'>
        <FaImage className='text-3xl text-blue-300 cursor-pointer'/>
        <input className='w-[90%] h-10 pl-5 bg-gray-100 rounded-full focus:outline-none focus:border-2 focus:border-blue-300 mx-2 sm:mx-0' placeholder='Type a message'/>
        <button className='h-10 w-10 bg-blue-300 rounded-full text-center text-white flex items-center justify-center'>
            <BiSolidSend className='text-2xl'/>
        </button>
    </footer>
    <ConversationDrawer isVisible={displayInformation} setDisplayInformation={setDisplayInformation}/>
  </main>
  )
}

export default Conversation
