import React, { useContext, useEffect, useState } from 'react'
import AuthContext from '../Context/AuthContext';
import { Link } from 'react-router-dom';
import { Accordion, Badge } from '@mantine/core';

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
  const items = tasks?.map((item) => (
    <Accordion.Item key={item.value} value={item.taskName} >
      <Accordion.Control icon={item.emoji} ><div className='flex flex-row justify-evenly'><h1>{item.taskName}</h1><Badge color={`${
                item.taskStatus === "P"
                  ? "blue"
                  : item.taskStatus === "IP"
                  ? "yellow"
                  : "red"
              }`}>{item.taskStatus}</Badge></div></Accordion.Control>
      <Accordion.Panel>Description: {item.taskDescription}</Accordion.Panel>
      <Accordion.Panel>Status:  <span
              className={`px-3 py-1 text-sm font-semibold rounded-full ${
                item.taskStatus === "P"
                  ? "bg-blue-200 text-blue-800"
                  : item.taskStatus === "IP"
                  ? "bg-yellow-200 text-yellow-800"
                  : "bg-red-200 text-red-800"
              }`}
            >
              {item.taskStatus === "P"
                ? "Pending"
                : item.taskStatus === "IP"
                ? "In Progress"
                : "On Hold"}
            </span></Accordion.Panel>
    </Accordion.Item>
  ));

  return (
    <div className="p-6 bg-gray-100 rounded-lg shadow-md">
      {/* Header */}
      <h2 className="text-xl font-bold text-gray-800 mb-4 border-b pb-2">
        📝 Task Assigned
      </h2>

      <Accordion defaultValue="Apples">
        {items}
      </Accordion>
    </div>

  )
}

export default TaskAssigned