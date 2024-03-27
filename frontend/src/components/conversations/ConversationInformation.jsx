import { useContext } from 'react';

import ConversationsContext from '../../context/ConversationsContext';

const ConversationInformation = () => {
  const {activeConversation} = useContext(ConversationsContext);
  return (
    <div className='w-full p-5 flex flex-col justify-center items-center'>
      <figure className='relative w-40 h-40 rounded-full'>
        { activeConversation.partners[0].is_online && <div className='absolute -right-1 -top-1 w-10 h-10 rounded-full border-2 border-white bg-green-600'/> }
        <img src={activeConversation.partners[0].pfp} alt='conversation partner pfp' className='w-full h-full object-fill rounded-full'/>
      </figure>
      <h3 className='text-2xl font-semibold'>{activeConversation.partners[0].name}</h3>
      <h2>~{activeConversation.partners[0].email}</h2>
      <p className='w-full'>{activeConversation.partners[0].info}</p>
    </div>
  )
}

export default ConversationInformation
