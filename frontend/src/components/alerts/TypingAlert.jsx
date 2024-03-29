
const TypingAlert = ({ pfp }) => {
  return (
    <li className='flex mt-5 space-x-3 animate-materialize'>
      <figure className='w-10 h-10 rounded-full'>
        <img src={pfp} alt='partner pfp' className='w-full h-full rounded-full object-fill'/>
      </figure>
      <div className='h-[10%] bg-gray-200 rounded-full p-2.5 flex items-center justify-center space-x-1'>
            <div className='min-h-2 min-w-2 rounded-full bg-black animate-bounce-1'/>
            <div className='min-h-2 min-w-2 rounded-full bg-black animate-bounce-2'/>
            <div className='min-h-2 min-w-2 rounded-full bg-black animate-bounce-3'/>
      </div>
    </li>
  )
}

export default TypingAlert
