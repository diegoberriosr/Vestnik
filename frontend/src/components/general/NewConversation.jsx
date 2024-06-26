import { useState, useContext, useEffect } from 'react';
import { useFormik } from 'formik';
import axios from 'axios';

import BarLoader from 'react-spinners/BarLoader';
import UserMiniature from './UserMiniature';
import BottomBar from './BottomBar';

import ConversationsContext from '../../context/ConversationsContext';
import AuthContext from '../../context/AuthContext';

const NewConversation = () => {
  const [isFocused, setIsFocused] = useState(false);
  const [matches, setMatches] = useState([]);
  const [loading, setLoading] = useState(false);
  const { activeConversation } = useContext(ConversationsContext);
  const { authTokens } = useContext(AuthContext);

  const {values, handleChange, handleBlur} = useFormik({
    initialValues: {
      's' : ''
    }
  })

  useEffect( () => {
    if (values.s.length > 0 && isFocused) {
      let headers;

      if (authTokens) {
        headers = {
          'Authorization' : 'Bearer ' + String(authTokens.access)
        }
      }
      setLoading(true);
      axios({
        url : 'https://vestnik.onrender.com/users',
        method : 'GET',
        headers : headers,
        params : {s : values.s}
      })
      .then( res => {
        setMatches(res.data);
        setLoading(false);
      })
      .catch( err => {
        console.log(err);
        setLoading(false);
      })
    }
    else setMatches([]);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [values.s])


  return (
    <div className={`${ activeConversation ? 'hidden xl:block w-[25%]' :  'w-screen xl:w-[25%]'} h-screen border `}>
        <header className='h-28 w-full flex-col items-center py-2.5 px-5 space-y-2.5 border border-t-0 border-r-0 border-l-0'>
            <h3 className='font-bold text-2xl'>People</h3>
            <input
            value={values.s} name='s' 
            className='pl-2.5 w-full h-10 border focus:outline-none focus:border-2 focus:border-blue-300 bg-transparent rounded-lg transition-all duration-300' placeholder='Search for a name or e-mail address'
            onFocus={() => setIsFocused(true)}
            onChange={handleChange} onBlur={handleBlur}/>
        </header>
        <div className='w-full min-h-[5px]'>
          {loading && <BarLoader loading={loading} color='#0ea5e9' cssOverride={{width : '100%'}}/> }
        </div>
        <main className='px-5'>
          { matches.length > 0 && matches.map( (profile,index) => <UserMiniature key={index} profile={profile}/>)}
          { isFocused && !loading && matches.length === 0 && values.s.length > 0 && <h3 className='font-bold text-2xl text-center pt-10'>No matches found</h3>}
        </main>
        <BottomBar/>
    </div>
  )
}

export default NewConversation
