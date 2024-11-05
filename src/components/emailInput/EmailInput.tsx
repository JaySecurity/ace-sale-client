import { useState } from 'react';
import { connectWithEmail } from '../../lib/api';
const EmailInput = ({ setEmail, setCodeSent, wallet }) => {
  const [value, valueSet] = useState<string>('');

  const handleChange = (e) => {
    valueSet(e?.target?.value || '');
  };

  const handleEmail = async () => {
    setEmail(value);
    try {
      const resp = await connectWithEmail({ wallet, email: value });
      console.log(resp);
      setCodeSent(true);
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <div id='email-section' className='bottom-email'>
      <div className='email-section'>
        <div className='lbls'>Enter email</div>
        <input
          type='email'
          id='emailInput'
          className='input-section'
          placeholder='Enter your email'
          onChange={handleChange}
          value={value}
        />
        <button
          id='sendEmailButton'
          className='sendbutton'
          onClick={handleEmail}
        >
          Send Code
        </button>
      </div>
    </div>
  );
};

export default EmailInput;
