
const PlaceholderMessage = ({ position, pfp, name, message, reverse, animation}) => {
  return (
    <div className={`absolute ${position} flex ${ reverse ? 'flex-row-reverse' : 'space-x-2.5'} ${animation}`}>
      <figure className='w-3 h-3 sm:w-5 sm:h-5 md:w-8 md:h-8 lg:w-10 lg:h-10 rounded-full'>
        <img src={pfp} alt='doodle mockup pfp' className='w-full h-full rounded-full object-fill' />
      </figure>
      <div className='space-y-0.5 pt-1 text-xs sm:text-sm md:text-md'>
        <p className='font-bold'>{name}</p>
        <p className='bg-sky-500 text-white p-2.5 rounded-full'>{message}</p>
      </div>
    </div>
  )
}

export default PlaceholderMessage
