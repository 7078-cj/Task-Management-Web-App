import React, { useContext, useEffect, useState } from 'react'
import AuthContext from '../Context/AuthContext'
import Project from '../components/Project'
import Navbar from '../components/Navbar'
import SideBar from '../components/SideBar'
import TaskAssigned from '../components/TaskAssigned'

function ProjectsAssigned() {

  const [projects,setProjects] = useState([])
  const {user,authTok} = useContext(AuthContext)
  
  var getData = async() =>{
    try{
      var response = await fetch(`http://127.0.0.1:8000/api/projectsassigned/${user.user_id}/`,{
        method: "GET",
        headers: {
          'Content-Type' : 'application/json',
          'Authorization': 'Bearer ' + String(authTok.access),
        }
      })

      var result = await response.json();
      console.log(result)
      setProjects(result);
      
      
    }
    catch(err){
      console.log(err.message)
    }
  }

    useEffect(()=>{
          getData()
        },[])

  

  return (
        <>
        <Navbar/>

          <div className='grid grid-cols-[20%_60%_20%]'>
            <SideBar/>
            <div>
                <div className="ml-10 text-2xl font-semibold text-gray-800 mb-4">Projects Assigned</div>

                <div className="bg-slate-50 w-[95%] h-screen m-2 ml-11 p-6 rounded-lg flex flex-wrap gap-6 justify-start items-stretch shadow-lg">
                  {projects.length > 0 ? (
                    projects.map((project, index) => (
                      <Project
                        key={project.id}  
                        id={project.id}
                        ProjectName={project.projectName}
                        tasks={project.total_tasks}
                        completedTasks={project.completed_tasks}
                        ProjectManager={project.projectManager}
                      />
                    ))
                  ) : (
                    <div className="text-gray-500 text-lg font-medium">No projects assigned</div>
                  )}
                </div>
              </div>
              <TaskAssigned/>
          </div>
            
    </>

  )
}

export default ProjectsAssigned