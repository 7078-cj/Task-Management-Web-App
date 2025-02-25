import React, { useContext } from 'react'
import { useNavigate } from 'react-router-dom'
import AuthContext from '../Context/AuthContext'

function Login() {

    let {loginUser} = useContext(AuthContext)
    const nav = useNavigate()

  return (
    <div className='flex flex-col justify-center items-center h-screen'>
        <form onSubmit={loginUser} className='flex flex-col justify-center items-center space-y-2'>
            Username: <input type="text" name='username' className='outline-none border-2 rounded-md px-2 py-1 text-slate-500 w-full focus:border-blue-300'/>
            Password: <input type="password" name="password" id="" className='outline-none border-2 rounded-md px-2 py-1 text-slate-500 w-full focus:border-blue-300' />
            <input type="submit" className='w-full justify-center py-1 bg-blue-500 hover:bg-blue-600 active:bg-blue-700 rounded-md text-white ring-2' />
        </form>
        <h1>have an account? <a href="/register" className='text-cyan-500'>Register</a></h1>
        
    </div>
  )
}

export default Login