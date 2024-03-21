import { IoIosCloseCircle } from "react-icons/io";
import { RiVerifiedBadgeFill } from "react-icons/ri";

const PopUpAlert = ({error, message}) => {
  return (
    <div className='fixed top-0 right-2 w-[300px] h-16 flex space-x-2.5 items-center bg-white rounded-lg shadow-lg pl-8 animate-alert-downwards'>
        <div className={`w-5 h-full rounded-l-lg absolute left-0 ${ error ? 'bg-red-900' : 'bg-green-600'}`}/>
        { error ? <IoIosCloseCircle className='text-red-900 text-4xl'/> :  <RiVerifiedBadgeFill className='text-green-600 text-4xl'/>}
        <div>
          <p className='font-semibold'>Error</p>
          <p className='text-gray-900 text-sm'>{message}</p>
        </div>
    </div>
  )
}

export default PopUpAlert
