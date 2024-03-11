import { AiFillMessage } from "react-icons/ai";
import { MdPeopleAlt } from "react-icons/md";
import { CiLogout } from "react-icons/ci";


const Sidebar = () => {
  return (
   <div className='hidden xl:flex xl:flex-col w-[5%] h-screen border items-center py-2.5'>
      <div className='h-10 w-10 bg-gray-100 rounded-lg flex items-center justify-center'>
        <AiFillMessage className='text-2xl text-gray-600'/>
      </div>
      <div className='h-10 w-10 rounded-lg flex items-center justify-center'>
        <MdPeopleAlt className='text-2xl text-gray-600'/>
      </div>
      <div className='h-10 w-10 rounded-lg flex items-center justify-center'>
        <CiLogout className='text-2xl text-gray-600'/>
      </div>
      <div className='relative mt-auto h-10 w-10 rounded-full bg-gray-600'>
        <div className='absolute top-0 right-0 border-2 boder-white h-4 w-4 bg-green-600 rounded-full'/>
      </div>
  </div>
  )
}

export default Sidebar
