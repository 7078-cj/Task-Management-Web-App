import { Box, Dialog, Modal } from '@mui/material'
import React, { useContext, useEffect, useRef, useState } from 'react'
import { use } from 'react'
import { Link } from 'react-router-dom'
import AuthContext from '../Context/AuthContext'
import { Progress } from '@mantine/core'

function Project({id,ProjectName,tasks,completedTasks,ProjectManager}) {

  const {user,authTok} = useContext(AuthContext)
  var [progress,setProgress] = useState((completedTasks/tasks)*100)
  var [handleMenuClick,setHandleMenuClick] = useState(false)
  var [edit, setEdit] = useState(true)
  const [projectName, setProjectName] = useState(ProjectName);
  const menu = useRef()

  const handleInputChange = (event) => {
    setProjectName(event.target.value); // Update state when textarea changes
    
  };


  const handleSubmit = (e) => {
    e.preventDefault();

    setEdit(false)
  };

 
  useEffect(()=>{
  
          const handleClickOutsidemenu = (event) => {
              if (menu.current && !menu.current.contains(event.target)) {
                setHandleMenuClick(false);
              }
            };
  
            
            document.addEventListener('mousedown', handleClickOutsidemenu);
            return () => {
          
              
              document.removeEventListener('mousedown', handleClickOutsidemenu);
          };
  
      },[])

      var putData = async (e) => {
        e.preventDefault(); 
    
        try {
            var response = await fetch(`http://127.0.0.1:8000/api/projects/${id}/`, {
                method: "PUT",
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
            setEdit(false)
        } catch (err) {
            console.error('Error:', err.message);
        }
    };

    var deleteData = async (e) => {
      e.preventDefault(); 
  
      try {
          var response = await fetch(`http://127.0.0.1:8000/api/projects/${id}/`, {
              method: "DELETE",
              headers: {
                  'Authorization': 'Bearer ' + String(authTok.access),
              },
          });
  
          
          if (!response.ok) {
              
              const errorMessage = await response.json(); 
              throw new Error(errorMessage.detail || 'Error occurred'); 
          }
  
          
          window.location.reload();
          
      } catch (err) {
          console.error('Error:', err.message);
      }
  };
  
    



  return (
    // <div className='w-[300px] h-[200px] m-5 rounded-lg p-4  bg-slate-300 flex flex-col gap-5 items-center justify-center'>
    //   <div className='flex'>
    //     <h1>{ProjectName}</h1>
    //     <box-icon name='menu'></box-icon>
    //   </div>
        
    //     {/* Progress Bar */}
    //     <div>
    //       <div className='w-[200px] h-5 bg-slate-400 rounded-lg'>
    //         <div className='bg-green-400 h-5 rounded-lg'  style={{ width:`${progress}%` }}></div>
    //       </div>
    //       <h1 className=' right-0'>{progress}%</h1>
          
    //     </div>

        
    // </div>

    <div className="relative w-80 h-40 p-4 rounded-xl border border-neutral-300 shadow-sm m-2">
    {/* Background */}
    <div className="absolute inset-0 rounded-xl bg-white opacity-90"></div>

    {/* Progress and Completed Tasks */}
    <div className="relative ">
      <div className="flex justify-between items-center mb-2">
        <div className="text-black text-sm font-bold">{completedTasks}/{tasks}</div>
        <div className="text-black text-sm font-bold">{progress}%</div>
      </div>
      <div className="w-full bg-gray-200 h-2 rounded-sm overflow-hidden">
      <Progress color="cyan" size="xl" value={progress} striped />
      </div>
      <div className="flex justify-between mt-2 text-gray-500 text-xs font-medium">
        <span>Completed Tasks</span>
        <span>Progress</span>
      </div>
    </div>

    {/* Project Title */}
    <div className="relative mt-4 flex justify-between items-center">
      {edit ? (
        <Link to={`/taskboard/${id}`} className="text-black font-extrabold">
          {projectName}
        </Link>
      ) : (
        <form className="flex flex-row gap-2" onSubmit={putData}>
          <textarea
            name="projectName"
            onChange={handleInputChange}
            placeholder={projectName}
            className="border rounded p-1 w-full"
          />
          <button className="bg-blue-500 text-white px-2 rounded">Submit</button>
        </form>
      )}
      <div className="flex items-center space-x-2">
        <box-icon name="message-square-x" onClick={() => setHandleMenuClick(true)}></box-icon>
        <box-icon name="edit" onClick={() => setEdit(!edit)}></box-icon>
      </div>
    </div>

    {/* Modal for Deletion */}
    {handleMenuClick && (
      <Modal open={handleMenuClick} onClose={() => setHandleMenuClick(false)}>
        <Box className="absolute top-1/2 left-1/2 bg-slate-200 p-4 w-72 flex gap-4 justify-between items-center">
          <h1 className="ml-3">Delete {projectName}?</h1>
          <form action="DELETE" onSubmit={deleteData}>
            <button className="bg-red-500 text-white px-4 py-2 rounded">Delete</button>
          </form>
        </Box>
      </Modal>
    )}
  </div>
  )
}

export default Project