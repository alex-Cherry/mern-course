import React, { useState, useContext } from 'react';
import { useHistory } from 'react-router-dom';

import { useHttp } from '../hooks/useHttp';
import { AuthContext } from '../context/auth.context';

const CreatePage = () => {

  const [link, setLink] = useState('');
  const { request } = useHttp();
  const { token } = useContext(AuthContext);
  const history = useHistory();

  const pressHandler = async (event) => {
    if (event.key === 'Enter') {
      try {
        const data = await request('/api/link/generate', 'POST', { from: link }, {
          Authorization: `Bearer ${token}`
        });
        history.push(`/detail/${data.link._id}`);
      } catch (e) {}
    }
  }

  return (
    <div className="row">
      <div className="col s8 offset-s2" style={{ paddingTop: '2rem' }}>
        <div className="input-field">
          <input
            placeholder="Введите email"
            id="link"
            type="text"
            value={link}
            onChange={e => setLink(e.target.value)}
            onKeyPress={pressHandler}
          />
          <label htmlFor="link">Введите ссыдке</label>
        </div>
      </div>
    </div>
  );
}

export default CreatePage;
