import React, { useRef, useState } from 'react'

import { Box, Dialog, Modal } from '@mui/material'


function Task({TaskName,TaskDescription,TaskStatus,AssignedTo,AssignedToAvatar,DueDate}) {

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

  return (
    <div className="bg-white rounded-lg p-4 shadow m-3">
      <div className="flex justify-between mb-2">
        <div className='flex flex-col'>
          <h3 className="text-lg font-semibold">{TaskName}</h3>
          <span className="text-gray-600 max-h-[20px] m-5 p-4">{TaskDescription}</span>
        </div>
        
        <div className='flex flex-row gap-2'>
            <div className="text-gray-500" ref={taskMenu} onClick={()=>{setTaskClick(true)}}><div>...</div>
            
            </div>
            
            <box-icon name='message-square-x' onClick={()=>{setHandleDelete(true)}} ></box-icon>

            <Modal open={handleDelete} onClose={()=>{setHandleDelete(false)}} >
              <Box className='absolute top-[50%] left-[50%] bg-slate-200 p-4'>
                <h1>Delete {TaskName}??</h1>
                <button className='bg-red-400 p-5 rounded-lg'onClick={()=>{setHandleDelete(false)}}>Delete</button>
              </Box>
          
            </Modal>
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
              <input
                type="text"
                className="ml-2 border border-gray-300 rounded-md px-2 py-1 w-full"
                placeholder="Enter Task Title(s)"
              />
              <textarea
                className="mt-2 border border-gray-300 rounded-md px-2 py-1 w-full"
                placeholder="Enter Task Description"
              ></textarea>
              <div className="flex items-center mt-4">
                <span className="font-semibold">Status:</span>
                <select className="ml-2 border border-gray-300 rounded-md px-2 py-1">
                  <option value="pending">Pending</option>
                  <option value="in-progress">In Progress</option>
                  <option value="on-hold">On Hold</option>
                </select>
              </div>
              <button className="mt-4 bg-blue-500 text-white rounded-md px-4 py-2 hover:bg-blue-600">
                Update
              </button>
            </div>
          </Dialog>
          
        </div>
       

      <div className="flex items-center mb-4">
        <span className={`${statusColor} text-white px-2 py-1 rounded-full mr-2`}>{TaskStatus}</span>
        <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
          <path fill-rule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clip-rule="evenodd" />
        </svg>
        <span className="text-gray-600">{DueDate}</span>
      </div>

      

      

      <div className="flex flex-col items-center mt-4">
        <div className="flex flex-row">
          <img src="https://via.placeholder.com/32" alt="Avatar 1" className="rounded-full w-8 h-8 mr-2" />
          
          <span className="text-gray-600">Assigned to:{AssignedTo}</span>
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