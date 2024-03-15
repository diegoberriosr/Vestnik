import { useContext } from 'react';

import AuthContext from '../../context/AuthContext';

const Message = ({ message }) => {
  const { user } = useContext(AuthContext);
  console.log(message.sender.id, user.id);
  return (
    <li className='mt-2.5'>
        <div className={`${user.id === message.sender.id ? 'ml-auto flex flex-row-reverse' : 'mr-auto flex'} space-x-3 items-start`}>
            <figure className='relative rounded-full'>
                <div className={`absolute -top-1 right-0 w-4 h-4 rounded-full border-2 border-white bg-green-600`}/>
                <img src={message.sender.pfp} alt='partner pfp' className='w-10 h-10 rounded-full object-fill'/>
            </figure>
            <div className='relative w-full space-y-1'>
                <h2 className={`${user.id === message.sender.id ? 'flex justify-end items-center mr-3 ' : ''}`}><span className='font-semibold text-gray-500'>{message.sender.name} </span> {message.timestamp}</h2>
                <div className={`p-2.5 ${user.id === message.sender.id ? 'bg-blue-500  text-white absolute right-3' : 'bg-gray-200'} rounded-full inline-block`}>{message.content}</div>
            </div>
        </div>
    </li>
  )
}

export default Message
