import React, { useEffect, useRef, useState } from 'react'
import Project from './Project'
import { Link } from 'react-router-dom'
import { useContext } from 'react'
import AuthContext from '../Context/AuthContext'
import CreateProject from './CreateProject'

function DashBoard() {
  const {user,authTok} = useContext(AuthContext)
  const [projects,setProjects] = useState([])
  
  var getData = async() =>{
    try{
      var response = await fetch(`http://127.0.0.1:8000/api/users/${user.user_id}/projects/`,{
        method: "GET",
        headers: {
          'Content-Type' : 'application/json',
          'Authorization': 'Bearer ' + String(authTok.access),
        }
      })

      var result = await response.json();
      console.log(result)
      return setProjects(result);
    }
    catch(err){
      console.log(err.message)
    }
  }

  useEffect(()=>{
    getData()
  },[])

  var [handleAdd,setHandleAdd] = useState(false)
    
    const add = useRef()
  
    useEffect(()=>{
  
      const handleClickOutsideAdd = (event) => {
        if (add.current && !add.current.contains(event.target)) {
            setHandleAdd(false);
        }
      };
  
      document.addEventListener('mousedown', handleClickOutsideAdd);
      return () => {
        document.removeEventListener('mousedown', handleClickOutsideAdd);
      }
    },[])

  return (
    <div className='bg-slate-200 h-screen grid grid-rows-[10%_90%] rounded-lg m-2'>
        <div className='bg-white w-[95%] m-2 ml-11 flex gap-4 justify-center items-center'>
            <h1>Projects</h1>
            <div ref={add} className=''>
              <button className="overflow-hidden rounded-lg relative w-36 h-10 cursor-pointer flex items-center border border-green-500 bg-green-500 group hover:bg-green-500 active:bg-green-500 active:border-green-500"
              onClick={()=>{
                setHandleAdd(!handleAdd)
              }}>
              <span className="text-gray-200 font-semibold ml-8 transform group-hover:translate-x-20 transition-all duration-300">Project</span>
              <span className="absolute right-0 h-full w-10 rounded-lg bg-green-500 flex items-center justify-center transform group-hover:translate-x-0 group-hover:w-full transition-all duration-300">
                <svg className="svg w-8 text-white" fill="none" height={24} stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} viewBox="0 0 24 24" width={24} xmlns="http://www.w3.org/2000/svg">
                  <line x1={12} x2={12} y1={5} y2={19} />
                  <line x1={5} x2={19} y1={12} y2={12} />
                </svg>
              </span>
            </button>

            {handleAdd ? (<CreateProject state={setHandleAdd}/>):<></>}
            </div>
           
        </div>
        <div className='bg-slate-50 w-[95%] m-2 ml-11 rounded-lg flex flex-wrap gap-6 justify-start items-stretch'>
         
        {projects.map((project, index) => (
                <Project
                    id={project.id} 
                    ProjectName={project.projectName}
                    tasks={project.total_tasks}
                    completedTasks={project.completed_tasks}
                    ProjectManager={project.projectManager}
                />
            ))}
          
            
        </div>
    </div>
  )
}

export default DashBoard