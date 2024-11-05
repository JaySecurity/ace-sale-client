import { useState } from 'react';

const CodeInput = ({ setCode, setCodeSent }) => {
  const [value, valueSet] = useState<string>('');

  const handleChange = (e) => {
    valueSet(e?.target?.value || '');
  };

  return (
    <div id='code-section' className='bottom-code'>
      <div className='code-section'>
        <div className='lbls'>Enter confirmation code</div>
        <input
          type='text'
          id='codeInput'
          className='input-section'
          placeholder='Enter confirmation code'
          value={value}
          onChange={handleChange}
        />
        <div className='button-group'>
          <button
            id='sendCodeButton'
            className='sendbutton'
            onClick={() => setCode(value)}
          >
            Confirm Сode
          </button>
          <button
            id='backToEmailButton'
            className='backbutton'
            onClick={() => setCodeSent(false)}
          >
            Back
          </button>
        </div>
      </div>
    </div>
  );
};

export default CodeInput;
