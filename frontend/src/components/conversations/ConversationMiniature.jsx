import { useContext } from 'react';

import ConversationContext from '../../context/ConversationsContext';

const ConversationMiniature = ({ conversation }) => {
  const { setActiveConversation } = useContext(ConversationContext);

  return (
    <li className='w-full h-14 p-5 flex items-center space-x-3 hover:bg-gray-100' onClick={() => setActiveConversation(conversation)}>
      <figure className='w-10 h-10 rounded-full bg-gray-600 mb-1'> 
        <img src={conversation.partners[0].pfp} alt='conversation partner pfp' className='w-full h-full rounded-full'/>
      </figure>
      <article className='w-10/12'>
        <div className='flex w-full items-center justify-between'>
            <h3 className='font-bold'>{conversation.partners[0].name}</h3>
            <span className='text-xs text-gray-500'>Timestamp</span>
        </div>
        <p className='text-gray-500 h-2'>{conversation.last_message && conversation.last_message.content}</p>
      </article>
    </li>
  )
}

export default ConversationMiniature
