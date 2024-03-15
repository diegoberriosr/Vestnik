import React from 'react'
import { formatDate } from '../../utils/formatDate'

const Notification = ({messageContent, timestamp}) => {
  return (
    <li className='w-full flex flex-col items-center justify-center text-sm mt-2.5 space-y-1'>
        <span className='text-gray-400 text-sm'>{formatDate(timestamp)}</span>
        <p className='p-2.5 rounded-full bg-gray-200'>{messageContent}</p>
    </li>
  )
}

export default Notification
