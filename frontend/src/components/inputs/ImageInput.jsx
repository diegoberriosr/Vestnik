import { useState } from 'react';

// Icon imports
import { IoMdClose } from "react-icons/io";

const ImageInput = ({children, generateUrl, handleGenerateUrl, setFiles}) => {
  
  const [loaded, setLoaded] = useState(false);

  const handleLoadImage = (event) => {
    const file = event.target.files[0];

    if (file) {
        setFiles(file);
        if (generateUrl) {
          const url = URL.createObjectURL(file)
          handleGenerateUrl(url);
        }
        setLoaded(true);
    }
  }

  const handleRemoveImage = (event) => {
    event.stopPropagation();
    setFiles(null);

    if (generateUrl) handleGenerateUrl('');
    setLoaded(false);
  }

  return (
    <div className='relative'>
        { loaded && 
        <div className={`${  loaded ? 'w-8 h-8 text-2xl sm:w-3 sm:h-3 sm:absolute sm:-top-2 sm:-right-2 sm:text-xs' : ''} flex items-center justify-center rounded-full bg-sky-500 text-white cursor-pointer animate-materialize`} onClick={(e) => handleRemoveImage(e)}> 
                <IoMdClose/>
        </div>}
        <label htmlFor='images' className={`${ loaded ? 'hidden sm:block' : ''}`}>
            {children}
        </label>
        <input type='file' id='images' className='hidden' onChange={(e) => handleLoadImage(e)}/>
    </div>
  )
}

export default ImageInput
