import React, { useContext } from 'react'
import AuthContext from '../Context/AuthContext'
import {useMutation} from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';

function CreateProject({state}) {
    const {user,authTok} = useContext(AuthContext)
    const nav =  useNavigate()
    
    var postData = async (e) => {
        e.preventDefault(); 
    
        try {
            var response = await fetch(`http://127.0.0.1:8000/api/users/${user.user_id}/projects/`, {
                method: "POST",
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': 'Bearer ' + String(authTok.access),
                },
                body: JSON.stringify({
                    projectName: e.target.projectName.value, 
                    projectManager: user.user_id, 
                }),
            });
    
            
            if (!response.ok) {
                
                const errorMessage = await response.json(); 
                throw new Error(errorMessage.detail || 'Error occurred'); 
            }
    
            var result = await response.json(); 
            console.log(result.status);
            window.location.reload()
            state(false)
        } catch (err) {
            console.error('Error:', err.message);
        }
    };
    
    
    


  return (
    <>
        <form onSubmit={postData} method='POST' class="bg-white shadow rounded-lg p-4 m-5 absolute z-10">
        <h3 class="text-xl font-semibold">
            <input type="text" name='projectName' class="ml-2 border border-gray-300 rounded-md px-2 py-1" placeholder="Enter Project Name"/>
            </h3>
        

        <div class="mt-4">
          <button type='submit' class="bg-blue-500 text-white rounded-md px-4 py-2 hover:bg-blue-600" >Create</button>
        </div>
    </form>
    </>
  )
}

export default CreateProject