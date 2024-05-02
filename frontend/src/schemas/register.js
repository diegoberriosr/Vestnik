import { object, string } from 'yup';
import axios from 'axios';

let registerSchema = object({
    email : string().email('You must provide a valid e-mail address.').required('What is your e-mail address?').test('email', 'E-mail address is already taken', async value => {
        const res = await axios({
            url : 'https://vestnik.onrender.com/email_exists/',
            method : 'GET',
            params : { email : value}
        })
        console.log(res.data.email_exists)
        return res.data.email_exists ? false : true

    }),
    name : string().required('What is your name?.'),
    password : string().required('This field is required')


})

export default registerSchema