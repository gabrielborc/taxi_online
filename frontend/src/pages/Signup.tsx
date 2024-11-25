import { useState } from 'react';
import './Signup.css';

async function callSignup(account: any) {
  const response = await fetch('http://localhost:3000/signup', {
    method: 'POST',
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify(account)
  });

  return response.json();
}

function truncString(str: string) {
  return `${str.substring(0,5)}...`;
} 

export default function Signup() {
  const [success, setSuccess] = useState({
    isSuccess: false,
    message: ''
  });
  const [error, setError] = useState({ 
    isError: false,
    message: ''
  })
  const [form, setForm] = useState({
    name: '',
    email: '',
    cpf: '',
    password: '',
    isPassenger: false
  });
  

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const account = await callSignup(form);

    if (account.accountId) {
      setError({ ...error, isError: false });
      setSuccess({ 
        isSuccess: true, 
        message: `Conta ${truncString(account.accountId)} cadastrado com sucesso!` 
      });
    } else {
      setError({ isError: true, message: account.message });
      setSuccess({ ...success, isSuccess: false });
    }
  }

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { type, name, value, checked } = event.target;

    setForm((form) => ({
      ...form,
      [name]: type === 'checkbox'
        ? checked
        : value
    }));
  }

  return (
    <div className="container">
      {success.isSuccess && (
        <div className='messageSuccess'>
          {success.message}
        </div>
      )}

      {error.isError && (
        <div className='messageError'>
          {error.message}
        </div>
      )}

      <form action="POST" onSubmit={handleSubmit}>
        <div>
          <input type="text" name="name" placeholder="Name" onChange={handleChange} />
        </div>
        <div>
          <input type="text" name="email" placeholder="Email" onChange={handleChange} />
        </div>
        <div>
          <input type="text" name="cpf" placeholder="000.000.000-00" onChange={handleChange} />
        </div>
        <div>
          <input type="password" name="password" placeholder="Password" onChange={handleChange} />
        </div>
        <div>
          <input type="checkbox" id="isPassenger" name="isPassenger" onChange={handleChange} />
          <label htmlFor="isPassenger">Passageiro</label>
        </div>
        <div>
          <input type="submit" value="Cadastrar" />
        </div>
      </form>
    </div>
  );
}