import { useContext } from 'react';
import { formatDate } from '../../utils/formatDate';

import AuthContext from '../../context/AuthContext';

const Message = ({ message }) => {

  const { user } = useContext(AuthContext);
  console.log(message.timestamp, formatDate(message.timestamp));
  return (
    <li className='mt-16 sm:mt-5'>
        <div className={`${user.id === message.sender.id ? 'ml-auto flex flex-row-reverse' : 'mr-auto flex'} space-x-3 items-start`}>
            <figure className='relative min-w-10 min-w-10 rounded-full'>
                <div className={`absolute -top-1 right-0 w-4 h-4 rounded-full border-2 border-white bg-green-600`}/>
                <img src={message.sender.pfp} alt='partner pfp' className='w-10 h-10 rounded-full object-fill'/>
            </figure>
            <div className='relative w-full space-y-1'>
                <h2 className={`${user.id === message.sender.id ? 'flex justify-end items-center mr-3 space-x-2 ' : 'space-x-1'}  max-w-full truncate text-sm`}> 
                <span className='font-semibold text-gray-500 max-w-full'>{message.sender.name} </span> 
                <span className='text-gray-400 text-xs'>{formatDate(message.timestamp)}</span>
                </h2>
                <div className={`p-2.5 ${user.id === message.sender.id ? 'bg-blue-500  text-white absolute right-3' : 'bg-gray-200'} rounded-full inline-block`}>{message.content}</div>
            </div>
        </div>
    </li>
  )
}

export default Message
