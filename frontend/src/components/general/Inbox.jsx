import { useState, useEffect, useContext } from 'react';

// Icon imports
import { MdOutlineGroupAdd } from "react-icons/md";

// Component imports
import BottomBar from './BottomBar';
import ConversationMiniature from '../conversations/ConversationMiniature';
import GroupMiniature from '../conversations/GroupMiniature';
import Modal from '../general/Modal';
import NewGroupChat from '../conversations/NewGroupChat';
// Context imports
import ConversationsContext from '../../context/ConversationsContext';



const Inbox = () => {
  
  const {conversations, activeConversation} = useContext(ConversationsContext)
  const [newGroupModal, setNewGroupModal] = useState(false);

  const [ shrink, setShrink] = useState(false);

  useEffect( () => {
    if (shrink){
      const timer = setTimeout(() => {
        setNewGroupModal(false);
        setShrink(false);
  
        return () => clearTimeout(timer);
      }, 250)
    }
  }, [shrink])

  return (
  <>
    <aside className={`${ activeConversation ? 'hidden xl:block w-[25%]' :  'w-screen xl:w-[25%]'} h-screen border`}>
      
      <header className='h-14 w-full flex items-center justify-between px-5'>
        <h6 className='text-2xl font-bold'>Messages</h6>
        <i className='bg-gray-200 w-8 h-8 rounded-full flex items-center justify-center hover:opacity-90 cursor-pointer' onClick={() => setNewGroupModal(true)}>
          <MdOutlineGroupAdd className='text-lg text-gray-600'/>
        </i>
      </header>
      {conversations.length > 0 ?
        <ul className='w-full h-[calc(100vh-113px)] xl:h-[calc(100vh-57px)] overflow-y-auto'>
        {conversations.map( conversation => {
          if(conversation.is_group_chat) return <GroupMiniature group={conversation}/>
          return <ConversationMiniature conversation={conversation}/>
        })}
        </ul>
        :
        <div className='w-full mt-20 flex flex-col items-center justify-center'>
          <h3 className='text-2xl font-semibold'>No conversations available</h3>
          <button className='mt-2 w-6/12 h-10 bg-blue-600 rounded-full text-white hover:opacity-90' onClick={() => setNewGroupModal(true)}>Start a new one</button>
        </div>
      }
      <BottomBar/>
    </aside>
    <Modal isVisible={newGroupModal} full={true}>
      <NewGroupChat shrink={shrink} setShrink={setShrink}/>
    </Modal>
  </>
  )
}

export default Inbox
