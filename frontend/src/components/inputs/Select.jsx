import { useState, useEffect, useContext } from 'react';
import axios from 'axios';

import ReactSelect from 'react-select';
import AuthContext from '../../context/AuthContext';

const Select = ({ setUsers, excludeList }) => {
  const [matches, setMatches] = useState([]);
  const [inputValue, setInputValue] = useState('');

  const { authTokens } = useContext(AuthContext);

  const options = matches ? matches.map( match => ({ value : match.id, label : match.name })) : null;

  const handleChange = (users) => {
    setUsers(users.map(user => user.value));
  }

  const handleInputChange = (value) => {
    setInputValue(value);
  }

  
  useEffect( () => {
    let headers;

    if (authTokens){
      headers = {
        'Authorization' : 'Bearer ' + String(authTokens.access)
      }
    }

    axios({
        url : 'http://127.0.0.1:8000/users',
        method : 'GET',
        headers : headers,
        params : { s : inputValue}
    })
    .then( res => {
        if (Array.isArray(res.data)) setMatches(prevStatus => {
          if(excludeList) setMatches(res.data.filter( match => !excludeList.includes(match.id)))
          return res.data;
        });
        else setMatches([]);
    })
    .catch( err => {
        console.log(err);
    });
  }, [inputValue]);

  return (
    <div className='mt-5'>
        <label>Members</label>
        <ReactSelect options={options} isMulti className='basic-multi-select' classNamePrefix='select' onChange={handleChange} onInputChange={handleInputChange}/>
    </div>
  )
}

export default Select
