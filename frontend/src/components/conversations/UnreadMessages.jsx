
const UnreadMessages = ({number}) => {
  return (
    <div className='mt-0.5 min-w-3 max-h-3 min-h-3  rounded-full bg-blue-500 flex items-center justify-center text-white font-semibold text-xs'>
      {number}
    </div>
  )
}

export default UnreadMessages
