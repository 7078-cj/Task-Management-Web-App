import React, { useContext, useEffect, useRef, useState } from 'react'

import { Box, Dialog, Modal } from '@mui/material'
import AuthContext from '../Context/AuthContext';
import { Avatar, Blockquote, ScrollArea } from '@mantine/core';
import { Modal as MD, Button } from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';


function Task({TaskID,TaskName,TaskDescription,TaskStatus,AssignedTo=[],AssignedToAvatar,DueDate,projectID,updateFunc,deleteFunc,ProjectManager}) {

  const {user} = useContext(AuthContext)
 
  let statusColor = "bg-gray-400"; // Default color

  switch (TaskStatus) {
    case "Pending":
      statusColor = "bg-blue-500";
      break;
    case "In Progress":
      statusColor = "bg-amber-500";
      break;
    case "On Hold":
      statusColor = "bg-red-500";
      break;
    case "Completed":
        statusColor = "bg-teal-500";
        break;
    default:
      statusColor = "bg-blue-500";
  }

  var [taskClick,setTaskClick] = useState(false)
  var [handleDelete, setHandleDelete] = useState(false)
  var taskMenu = useRef()

  const [formData, setFormData] = useState({
          taskID:TaskID,
          taskName: TaskName,
          taskDescription: TaskDescription,
          taskStatus: TaskStatus,
        });
  
        const handleChange = (event) => {
          const { name, value } = event.target;
          setFormData((prev) => ({
              ...prev,
              [name]: value, // Dynamically update the correct key
          }));
      };

    const handleSubmit = (e) => {
      e.preventDefault();
      updateFunc(e,formData)
      setTaskClick(false)
    }

    const handeDelete = (e) => {
      e.preventDefault();
      deleteFunc(e,TaskID)
      setHandleDelete(false)
    }
    
    
    const [opened, { open, close }] = useDisclosure(false);

  return (
    <div className="bg-white rounded-lg p-4 shadow m-3">
      <div className="flex justify-between mb-2">
        <div className='flex flex-col'>
          <h3 className="text-lg font-semibold">{TaskName}</h3>
          
          <MD opened={opened} onClose={close} title="Task Description">
            {TaskDescription}
          </MD>

          <div className='p-4'>
            <Button variant="default" onClick={open}>
              Task Description
            </Button>
          </div>
          
          
        </div>
        
        <div className='flex flex-row gap-2'>
           {AssignedTo.some(assignedUser => assignedUser.username === user.username)||ProjectManager == user.username ? <div className="text-gray-500" ref={taskMenu} onClick={()=>{setTaskClick(true)}}><div>...</div></div>:<></>}
            
            {ProjectManager == user.username ?<>
            <box-icon name='message-square-x' onClick={()=>{setHandleDelete(true)}} ></box-icon>
            <Modal open={handleDelete} onClose={()=>{setHandleDelete(false)}} >
              <Box className="absolute top-[50%] left-[50%] transform -translate-x-1/2 -translate-y-1/2 bg-white shadow-lg rounded-lg p-6 w-80 text-center">
                <h1 className="text-lg font-semibold text-gray-800">Delete <span className="text-red-500">{TaskName}</span>?</h1>
                
                <div className="flex justify-center gap-4 mt-4">
                  <button 
                    className="bg-red-500 text-white px-6 py-3 rounded-lg shadow-md hover:bg-red-600 transition-all"
                    onClick={handeDelete}
                  >
                    Delete
                  </button>
                  
                  
                </div>
              </Box>

          
            </Modal></>:<></>}
          </div>
          <Dialog
            open={taskClick}
            onClose={() => setTaskClick(false)}
            PaperProps={{
              style: { padding: '20px', position: 'relative', width: '400px', zIndex: 1300 },
            }}
          >
            <div className="bg-white shadow rounded-lg p-4">
              <h3 className="text-xl font-semibold">Edit Task</h3>
              <form action="" onSubmit={handleSubmit}>
              <input
                type="text"
                className="ml-2 border border-gray-300 rounded-md px-2 py-1 w-full"
                placeholder="Enter Task Title(s)"
                value={formData.taskName}
                onChange={handleChange}
                name="taskName"
              />
              <textarea
                className="mt-2 border border-gray-300 rounded-md px-2 py-1 w-full"
                placeholder="Enter Task Description"
                name='taskDescription'
                
                onChange={handleChange}
              >{formData.taskDescription}</textarea>
              <div className="flex items-center mt-4">
                <span className="font-semibold">Status:</span>
                <select 
                        className="ml-2 border border-gray-300 rounded-md px-2 py-1" 
                        name="taskStatus" 
                        value={formData.taskStatus}
                        onChange={handleChange}
                    >
                        <option value="P">Pending</option>
                        <option value="IP">In Progress</option>
                        <option value="OH">On Hold</option>
                        <option value="C">Completed</option>
                    </select>
              </div>
              <button className="mt-4 bg-blue-500 text-white rounded-md px-4 py-2 hover:bg-blue-600">
                Update
              </button>
              </form>
            </div>
          </Dialog>
          
        </div>
       

      <div className="flex items-center mb-4">
        <span className={`${statusColor} text-white px-2 py-1 rounded-full mr-2`}>{TaskStatus}</span>
      </div>

      <div className="flex flex-col items-center mt-4">
        <div className="flex flex-row">
         
          
          <span className="text-gray-600">
          <ScrollArea h={100}>
      {/* ... content */}
    
              Assigned to: {Array.isArray(AssignedTo) && AssignedTo.length > 0 ? (
                  AssignedTo.map((user, index) => (
                      <span key={index} className='flex flex-row gap-2 p-2'>
                          <Avatar src={user.profile?.profilePic 
                                                      ? `${user.profile.profilePic}`
                                                      : ""} alt="it's me" />
                                                      
                          {user.username}
                          {index < AssignedTo.length - 1 && ', '}
                      </span>
                  ))
              ) : (
                  <span>No users assigned</span>
              )}
              </ScrollArea>
          </span>
          
        </div>

        {/* <div class="flex flex-row items-center mt-2 absolute">
          <form action="">
            <span class="font-semibold">Status:</span>
            <select class="ml-2 border border-gray-300 rounded-md px-2 py-1" name='TaskStatus'>
            <option value="pending">Pending</option>
            <option value="in-progress">In Progress</option>
            <option value="on-hold">On Hold</option>
            
          </select>
          
          </form>
        <button>Update</button>
      </div> */}
       
      </div>
    </div>
  )
}

export default Task