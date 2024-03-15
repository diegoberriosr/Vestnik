import React from 'react'

const Notification = ({messageContent, timestamp}) => {
  return (
    <li className='w-full flex flex-col items-center justify-center text-sm mt-2.5'>
        <span>{timestamp}</span>
        <p className='p-2.5 rounded-full bg-gray-200'>{messageContent}</p>
    </li>
  )
}

export default Notification
