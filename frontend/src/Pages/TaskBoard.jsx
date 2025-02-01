import React, { useContext, useEffect, useRef, useState } from 'react'
import { useParams } from 'react-router-dom'
import Navbar from '../components/Navbar'
import SideBar from '../components/SideBar'
import Task from '../components/Task'

import AuthContext from '../Context/AuthContext'


function TaskBoard() {

    const {id} = useParams()
    const {user,authTok} = useContext(AuthContext)
    console.log(id)
    const [project, setProject] = useState()
    const [users, setUsers] = useState()
    console.log(project)

   
    var [progress,setProgress] = useState((project ? project.completed_tasks : 0/ project ? project.total_tasks : 0)*100)

   

    const [messages, setMessages] = useState([]);

    const [selectedUsers, setSelectedUsers] = useState([]);
    const [filteredUsers, setFilteredUsers] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    
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

    var getData = async() =>{
        try{
          var response = await fetch(`http://127.0.0.1:8000/api/projects/${id}/`,{
            method: "GET",
            headers: {
              'Content-Type' : 'application/json',
              'Authorization': 'Bearer ' + String(authTok.access),
            }
          })
    
          var result = await response.json();
          console.log(result)
          setProject(result);
          setTasks(result.projectTask || []);
        }
        catch(err){
          console.log(err.message)
        }
      }

      var getUsers = async() =>{
        try{
          var response = await fetch(`http://127.0.0.1:8000/api/all/user`,{
            method: "GET",
            headers: {
              'Content-Type' : 'application/json',
              'Authorization': 'Bearer ' + String(authTok.access),
            }
          })
    
          var result = await response.json();
          console.log(result)
          return setUsers(result);
        }
        catch(err){
          console.log(err.message)
        }
      }
    
      useEffect(()=>{
        getData()
        getUsers()
      },[])

      var [tasks, setTasks] = useState([])
      console.log(tasks)

      const socketRef = useRef(null);

        // websocker connection
        useEffect(() => {
          if (project) {

            socketRef.current = new WebSocket(`ws://127.0.0.1:8000/ws/project/${project.id}`);

              socketRef.current.onopen = () => {
                  console.log('WebSocket connection established');
              };
  
              socketRef.current.onmessage = (event) => {
                  const tasks = JSON.parse(event.data);
                  
                  if (tasks.create_task) {
                    const task = tasks.create_task.task;
                    
                    setTasks((prevTasks) => [...prevTasks, task]);
                  }
              };
  
              socketRef.current.onclose = () => {
                  console.log('WebSocket connection closed');
              };
  
              socketRef.current.onerror = (error) => {
                  console.error('WebSocket error:', error);
              };
  
              return () => {
                socketRef.current.close();
              };
          }
      }, [project]);

      

      const handleCheckBoxChange = (event) => {
        const { value, checked } = event.target;
        

        if (checked) {
          
          setSelectedUsers((prev) => [...prev, value]);
        } else {
          
          setSelectedUsers((prev) => prev.filter((user) => user !== value));
        }
      };

      const handleSearchChange = (e)=>{
        setSearchTerm(e.target.value);
      }

      useEffect(() => {
        const filtered = users ? users.filter((user) =>
          user.username.toLowerCase().includes(searchTerm.toLowerCase())):'loading'
        setFilteredUsers(filtered);
      }, [users, searchTerm]);

      const [formData, setFormData] = useState({
        taskName: "",
        taskDescription: "",
        taskStatus: "P",
        assignedTo:[]
      });

      useEffect(() => {
        setFormData((prev) => ({
            ...prev,
            assignedTo: selectedUsers, // Assign the array directly
        }));
    }, [selectedUsers]);

      const handleChange = (event) => {
        const { name, value } = event.target;
        setFormData((prev) => ({
            ...prev,
            [name]: value, // Dynamically update the correct key
        }));
    };

      


      const handleSend = (e) => {
        e.preventDefault();
        
        try {
            if (socketRef.current.readyState === WebSocket.OPEN) {
              socketRef.current.send(
                    JSON.stringify({
                        data: formData,
                        action: "create",
                    })
                );
            } else {
                console.warn("WebSocket is not open. Attempting to reconnect...");
                // Handle reconnection logic here if needed
            }
        } catch (error) {
            console.error("Error sending message:", error);
        }
    };

    const [pendingTasks, setPendingTasks] = useState([]);
    const [onHoldTasks, setOnHoldTasks] = useState([]);
    const [completedTasks, setCompletedTasks] = useState([]);
    const [inProgressTasks, setInProgressTasks] = useState([]);

    useEffect(() => {
        separateTasksByStatus();
    }, [tasks]);

    const separateTasksByStatus = () => {
        const pending = [];
        const onHold = [];
        const completed = [];
        const inProgress = [];

        tasks.forEach((task) => {
            switch (task.taskStatus) {
                case 'P':
                    pending.push(task);
                    break;
                case 'OH':
                    onHold.push(task);
                    break;
                case 'C':
                    completed.push(task);
                    break;
                case 'IP':
                    inProgress.push(task);
                    break;
                default:
                    break;
            }
        });

        setPendingTasks(pending);
        setOnHoldTasks(onHold);
        setCompletedTasks(completed);
        setInProgressTasks(inProgress);
    };
    console.log(pendingTasks)
    console.log(onHoldTasks)
    console.log(completedTasks)
    console.log(inProgressTasks)

      
        
      

  return (
    <>
        <Navbar/>
        
        <div className='grid grid-cols-[20%_80%]'>
          
            <SideBar/>
            <div className='bg-slate-200 min-h-screen grid grid-rows-[20%_80%] rounded-lg'>
        <div className='bg-white w-[95%] m-2 ml-11 flex flex-col gap-5 justify-center items-center'>
            <h1>{project ? project.projectName:"loading..."}</h1>
            <div>
            <div className='flex items-center gap-4'>
              <div className='w-[900px] h-5 bg-slate-400 rounded-lg'>
              <div className='bg-green-400 h-5 rounded-lg'  style={{ width:`${progress}%` }}></div>
            </div>
            <h1 className=' '>{progress}%</h1>
            </div>
           

            <div ref={add} className=''>
              <button className="overflow-hidden rounded-lg relative w-36 h-10 cursor-pointer flex items-center border border-green-500 bg-green-500 group hover:bg-green-500 active:bg-green-500 active:border-green-500"
              onClick={()=>{
                setHandleAdd(!handleAdd)
              }}>
              <span className="text-gray-200 font-semibold ml-8 transform group-hover:translate-x-20 transition-all duration-300">Add Task</span>
              <span className="absolute right-0 h-full w-10 rounded-lg bg-green-500 flex items-center justify-center transform group-hover:translate-x-0 group-hover:w-full transition-all duration-300">
                <svg className="svg w-8 text-white" fill="none" height={24} stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} viewBox="0 0 24 24" width={24} xmlns="http://www.w3.org/2000/svg">
                  <line x1={12} x2={12} y1={5} y2={19} />
                  <line x1={5} x2={19} y1={12} y2={12} />
                </svg>
              </span>
            </button>

                        {handleAdd ? (<form onSubmit={handleSend} className="bg-white shadow rounded-lg p-4 m-5 absolute flex flex-col gap-2">
                <h3 className="text-xl font-semibold">
                    <input 
                        type="text" 
                        className="ml-2 border border-gray-300 rounded-md px-2 py-1" 
                        name="taskName" 
                        value={formData.taskName}
                        onChange={handleChange} 
                        placeholder="Enter Task Title"
                    />
                </h3>
                <p className="text-gray-600">
                    <input 
                        type="text" 
                        className="ml-2 border border-gray-300 rounded-md px-2 py-1" 
                        name="taskDescription" 
                        value={formData.taskDescription}
                        onChange={handleChange} 
                        placeholder="Enter Task Description"
                    />
                </p>

                <div className="flex items-center mt-2">
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
                    </select>
                </div>

                <span className="font-semibold">Search User:</span>
                              <input
                                type="text"
                                placeholder="Search Users"
                                className="mb-2 border border-gray-300 rounded-md px-2 py-1"
                                onChange={handleSearchChange}
                              />

                              
                            <div class="flex items-center mt-2">
                            <span className="font-semibold">Assign To:</span>
                            <div className='overflow-y-scroll whitespace-nowrap flex flex-col h-[150px]'>
                              
                              {filteredUsers.map((user, index) => (
                                  <label
                                    key={index}
                                    className={`flex flex-row gap-2 ml-2 border border-gray-300 rounded-md px-2 py-1  ${
                                      selectedUsers.includes(user.id.toString()) ? 'bg-blue-500 text-white' : ''
                                    }`}
                                  >
                                    <input
                                      type="checkbox"
                                      name="selectedUser"
                                      value={user.id}
                                      checked={selectedUsers.includes(user.id.toString())}
                                      onChange={handleCheckBoxChange}
                                    />
                                    <div className='flex flex-col gap-1'>
                                      <h1 className='font-semibold'>{user.username}</h1>
                                      <h3>{user.email}</h3>
                                    </div>
                                    
                                  </label>
                                ))}

                            </div>
                            
                                
                              
                            </div>

                <div className="mt-4">
                    <button className="bg-blue-500 text-white rounded-md px-4 py-2 hover:bg-blue-600" type="submit">
                        Create Task
                    </button>
                </div>
            </form>):<></>}
            </div>


           

        </div>
        </div>
        <div className='bg-slate-50 w-[95%] m-2 ml-11 rounded-lg grid grid-cols-[25%_25%_25%_25%] p-5'>
          
          <div className=' bg-blue-100 m-2'>
            <h1 className='h-10 bg-blue-400 text-white text-xl text-center pt-1' >Pending</h1>
            <div className='overflow-y-auto max-h-[600px] m-5'>
            {pendingTasks.map((task, index) => (
                <Task TaskName={task.taskName} TaskDescription={task.taskDescription} TaskStatus={"Pending"} DueDate={'05/12/05'} AssignedTo={task.assignedTo} AssignedToAvatar={"null.jpg"}/>
            ))}
              
              
            </div>
          </div>
            
          <div className='bg-orange-100 m-2'>
            <h1 className='h-10 bg-amber-400 text-white text-xl text-center pt-1'>In Progress</h1>
            <div className='overflow-y-auto max-h-[600px] m-5'>
            {inProgressTasks.map((task, index) => (
                <Task TaskName={task.taskName} TaskDescription={task.taskDescription} TaskStatus={"In Progress"} DueDate={'05/12/05'} AssignedTo={task.assignedTo} AssignedToAvatar={"null.jpg"}/>
            ))}
            </div>
          </div>

          <div className='bg-red-100 m-2'>
            <h1 className='h-10 bg-red-400 text-white text-xl text-center pt-1'>On Hold</h1>
            <div className='overflow-y-auto max-h-[600px] m-5'>
            {onHoldTasks.map((task, index) => (
                <Task TaskName={task.taskName} TaskDescription={task.taskDescription} TaskStatus={"On Hold"} DueDate={'05/12/05'} AssignedTo={task.assignedTo} AssignedToAvatar={"null.jpg"}/>
            ))}
           
            </div>
          </div>

          <div className='bg-teal-100 m-2'>
            <h1 className='h-10 bg-teal-400 text-white text-xl text-center pt-1'>Completed</h1>
            <div className='overflow-y-auto max-h-[600px] m-5'>
            {completedTasks.map((task, index) => (
                <Task TaskName={task.taskName} TaskDescription={task.taskDescription} TaskStatus={"Completed"} DueDate={'05/12/05'} AssignedTo={task.assignedTo} AssignedToAvatar={"null.jpg"}/>
            ))}
            </div>
          </div>
        </div>
    </div>
        </div>
    </>
  )
}

export default TaskBoard