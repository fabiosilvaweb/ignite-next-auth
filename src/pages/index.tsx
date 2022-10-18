import type { NextPage } from 'next'
import { FormEvent, useContext, useState } from 'react'
import { AuthContext } from '../contexts/AuthContext';

const Home: NextPage = () => {
  const { signIn } = useContext(AuthContext)

  const [email, setEmail] = useState<string>('jonhdoe@gmail.com');
  const [password, setPassword] = useState<string>('123456');

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()

    await signIn({
      email,
      password
    })
  }

  return (
    <div style={{
      background: '#1f1f1f',
      width: '100%',
      height: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center'
    }}>
      <form action="" onSubmit={(event) => handleSubmit(event)}>
        <div>
        <input type="email" value={email} onChange={(event) => setEmail(event.target.value)} />
        </div>
        <div>
        <input type="password" value={password} onChange={(event) => setPassword(event.target.value)} />
        </div>
        <div>
        <button>Acessar Plataforma</button>
        </div>
      </form>
    </div>
  )
}

export default Home
