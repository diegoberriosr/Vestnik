import { AiFillMessage } from "react-icons/ai";
import { MdPeopleAlt } from "react-icons/md";
import { CiLogout } from "react-icons/ci";



const BottomBar = () => {
  return (
    <ul className='block xl:hidden w-full h-14 flex'>
        <li className='w-4/12 h-full flex justify-center text-gray-600 text-4xl'>
            <AiFillMessage/>
        </li>
        <li className='w-4/12 h-full flex justify-center text-gray-600 text-4xl'>
            <MdPeopleAlt/>
        </li>
        <li className='w-4/12 h-full flex justify-center text-gray-600 text-4xl'>
            <CiLogout/>
        </li>
    </ul>
  )
}

export default BottomBar
