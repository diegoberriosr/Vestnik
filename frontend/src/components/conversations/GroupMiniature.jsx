
const ConversationMiniature = () => {
  return (
    <li className='w-full h-14 p-5 flex items-center space-x-3 hover:bg-gray-100'>
      <figure className='relative w-10 h-10'>
        <figure className='absoulte top-0 mr-auto ml-auto w-5 h-5 bg-gray-600 rounded-full'/>
        <figure className='absolute bottom-0 left-0 w-5 h-5 bg-gray-600 rounded-full'/>
        <figure className='absolute bottom-0 right-0 w-5 h-5 bg-gray-600 rounded-full'/>
      </figure>
      <article className='w-10/12'>
        <div className='flex w-full items-center justify-between'>
            <h3 className='font-bold'>Group chat name</h3>
            <span className='text-xs text-gray-500'>Timestamp</span>
        </div>
        <p className='text-gray-500'>Last message</p>
      </article>
    </li>
  )
}

export default ConversationMiniature