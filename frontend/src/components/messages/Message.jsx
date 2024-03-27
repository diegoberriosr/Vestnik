import { useContext } from 'react';
import { formatDate } from '../../utils/formatDate';

// Icon imports
import { TiTick } from "react-icons/ti";

// Context imports
import AuthContext from '../../context/AuthContext';

const Message = ({ message, handleOpenDeleteModal, isGroupChat, numberOfPartners}) => {

  const { user } = useContext(AuthContext);

  
  return (
    <li className={`mt-5 max-w-6/12 flex ${message.sender.id === user.id ?  'flex-row-reverse' : 'justify-start'} space-x-3.5`}>
        <figure className='relative w-10 h-10 rounded-full'>
         { message.sender.is_online && <div className='absolute -right-1 -top-1 w-4 h-4 rounded-full border-2 border-white bg-green-600'/> }
          <img src={message.sender.pfp} alt='message sender pfp' className='w-full h-full rounded-full object-fill'/>
        </figure>
        <div className={`w-full space-y-2 flex flex-col ${ message.sender.id === user.id ? 'items-end px-3.5' : 'items-start' }`}>
          <p className='space-x-1'>
            <span className='text-gray-500 font-semibold'>{message.sender.name}</span>
            <span className='text-gray-400 text-sm'>{formatDate(message.timestamp)}</span>
          </p>
        <p className={`max-w-[70%] ${ message.sender.id === user.id ? 'bg-sky-500 text-white' : 'bg-gray-100'} rounded-full rounded-full p-2.5 inline-block cursor-pointer`} onClick={ () => handleOpenDeleteModal(message)}>
          { message.content}
        </p>
        { message.sender.id === user.id &&
        <p className='text-xs flex items-center mr-1'>
          { isGroupChat ?
          <span>{ message.read_count === numberOfPartners ? 'Read by all' : 'Delivered to all'}</span>
          :
          <span>{message.read_count === numberOfPartners ? 'Read' : 'Delivered'}</span>
          }
          <TiTick className={ (message.read_count === numberOfPartners)  ? 'text-sky-500' : 'text-gray-500'}/>
        </p>
        }
        </div>
      </li>
  )
}

export default Message
