import { useState } from 'react';

const RoundedCheckbox = ({ value, handleChange, containerStyle, labelText, descriptionText}) => {
  
  const [clicked, setClicked] = useState(false);
  
  const handleClick = (e) => {
    if(!clicked) handleChange(value);
    setClicked(!clicked);
  }

  return (
        <div className={`${containerStyle} space-x-3.5`} onClick={ (e) => handleClick(e)}>
        <div className={`h-4 w-4 ${ clicked ? 'bg-blue-500' : 'bg-white' } rounded-full mt-1 flex justify-center items-center border border-gray-300`}>
            <div className={`h-1.5 w-1.5 mr-[0.75px] rounded-full bg-white ${ clicked ? 'block' : 'hidden'}`}/>
            <input type='hidden' value={value}/>
        </div>
        <div>
            <label>{labelText}</label>
            <p className='text-gray-400'>{descriptionText}</p>
        </div>
    </div>
  )
}

export default RoundedCheckbox
