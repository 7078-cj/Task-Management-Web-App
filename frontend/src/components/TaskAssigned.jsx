import React, { useContext, useEffect, useState } from 'react'
import AuthContext from '../Context/AuthContext';
import { Link } from 'react-router-dom';

function TaskAssigned() {

  const {user,authTok} = useContext(AuthContext)
  const [tasks,setTasks] = useState()
  
  var getData = async() =>{
    try{
      var response = await fetch(`http://127.0.0.1:8000/api/tasksassigned/${user.user_id}/`,{
        method: "GET",
        headers: {
          'Content-Type' : 'application/json',
          'Authorization': 'Bearer ' + String(authTok.access),
        }
      })

      var result = await response.json();
      console.log(result)
      setTasks(result)
      
      
      
      
    }
    catch(err){
      console.log(err.message)
    }
  }

  useEffect(()=>{
    getData()
  },[])

  return (
    <div className="p-6 bg-gray-100 rounded-lg shadow-md">
      {/* Header */}
      <h2 className="text-xl font-bold text-gray-800 mb-4 border-b pb-2">
        📝 Task Assigned
      </h2>

      {/* Task List */}
      <ul className="space-y-3">
        {tasks?.map((task) => (
          <li
            key={task.id}
            className="p-4 border border-gray-300 rounded-lg bg-white shadow-sm flex justify-between items-center transition-transform transform hover:scale-[1.02]"
          >
            {/* Task Link */}
            <Link
              to={`/taskboard/${task.project}`}
              className="font-semibold text-blue-600 hover:underline"
            >
              {task.taskName}
            </Link>

            {/* Status Badge */}
            <span
              className={`px-3 py-1 text-sm font-semibold rounded-full ${
                task.taskStatus === "P"
                  ? "bg-blue-200 text-blue-800"
                  : task.taskStatus === "IP"
                  ? "bg-yellow-200 text-yellow-800"
                  : "bg-red-200 text-red-800"
              }`}
            >
              {task.taskStatus === "P"
                ? "Pending"
                : task.taskStatus === "IP"
                ? "In Progress"
                : "On Hold"}
            </span>
          </li>
        ))}
      </ul>
    </div>

  )
}

export default TaskAssigned