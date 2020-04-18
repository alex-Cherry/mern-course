import React, { useState, useEffect, useContext } from 'react';
import { useHttp } from '../hooks/useHttp';
import { useMessage } from '../hooks/useMessage';
import { AuthContext } from '../context/auth.context';

const AuthPage = () => {

  const auth = useContext(AuthContext);
  const [form, setForm] = useState({ email: '', password: '' });
  const { loading, error, request, clearError } = useHttp();
  const msg = useMessage();

  useEffect(() => {
    msg(error);
    clearError();
  }, [error, msg, clearError]);

  useEffect(() => {
    window.M.updateTextFields();
  }, []);

  const changeHandler = event => {
    setForm({ ...form, [event.target.name]: event.target.value });
  }

  const registerHandler = async () => {
    try {
      const data = await request('/api/auth/register', 'POST', { ...form });
      msg(data.message);
    } catch (e) {
    }
  }

  const loginHandler = async () => {
    try {
      const data = await request('/api/auth/login', 'POST', { ...form });
      console.log(data)
      auth.login(data.token, data.userId)

    } catch (e) {
    }
  }

  return (
    <div className="row">
      <div className="col s6 offset-s3">
        <h1>Сократи Ссылку</h1>
        <div className="card blue darken-1">
          <div className="card-content white-text">
            <span className="card-title">Авторизация</span>

            <div>

              <div className="input-field">
                <input
                  placeholder="Введите email"
                  id="email"
                  type="email"
                  className="validate yellow-input"
                  name="email"
                  onChange={changeHandler}
                />
                <label htmlFor="email">Email</label>
              </div>

              <div className="input-field">
                <input
                  placeholder="Введите пароль"
                  id="password"
                  type="password"
                  className="validate yellow-input"
                  name="password"
                  onChange={changeHandler}
                />
                <label htmlFor="password">Пароль</label>
              </div>

            </div>

          </div>
          <div className="card-action">
            {/* Enter */}
            <button
              className="btn yellow darken-4"
              style={{marginRight: 10}}
              disabled={loading}
              onClick={loginHandler}
            >
              Войти
            </button>
            {/* Register */}
            <button
              className="btn grey lighten-1 black-text"
              disabled={loading}
              onClick={registerHandler}
            >
              Регистрация
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default AuthPage;
