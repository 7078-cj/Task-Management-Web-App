import React, { useContext } from 'react'
import { useNavigate } from 'react-router-dom';
import AuthContext from '../Context/AuthContext';

function RegisterPage() {
  const nav = useNavigate()
  let {loginUser} = useContext(AuthContext)
  var RegisterUser = async(e) =>{
        e.preventDefault();

        let response = await fetch(
          "http://127.0.0.1:8000/api/registerUser/",{
            method: "POST",
            headers:{
              'Content-Type' : 'application/json',
             
            },
            body :JSON.stringify({
                                  'username' :e.target.username.value,
                                    'email':e.target.email.value,
                                  'password' :e.target.password.value,
                                  
                                  })
          }
        )
        let data = await response.json()
                console.log(data)
                if (response.status ==200){
                  
                  nav('/')
      }
    }

  return (
    <div className='flex flex-col justify-center items-center'>
      
      <form onSubmit={RegisterUser} className="form">
        <input 
          type="text" 
          name="username" 
          placeholder="Enter User Name" 
          className="input"  // Specific class name for username
        />
        <input 
          type="email" 
          name="email" 
          placeholder="Enter User Email" 
          className="input-email"  // Specific class name for email
        />
        <input 
          type="password" 
          name="password" 
          placeholder="Enter Password" 
          className="input"  // Specific class name for password
        />
        <input 
          type="submit" 
          value="Register" 
          className="input"  // Specific class name for submit button
        />
    </form>
    <button className="home-button" onClick={()=>nav('/login')} >Log In</button>

      
    </div>
  )
}

export default RegisterPage