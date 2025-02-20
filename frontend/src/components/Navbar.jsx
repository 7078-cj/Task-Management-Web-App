import React, { useContext, useEffect, useRef, useState } from 'react'
import AuthContext from '../Context/AuthContext'
import { Link } from 'react-router-dom'

function Navbar() {

    var [handleProfileClick,setHandleProfileClick] = useState(false)
    var [handleNotifClick,setHandleNotifClick] = useState(false)
    const [notifs,setNotifs] = useState([])
    const [newNotifs,setNewNotifs] = useState(false)
    const {user,authTok} = useContext(AuthContext)
    
    const prof = useRef()
    const notif = useRef()
    const socketRef = useRef(null);

    useEffect(()=>{

        const handleClickOutsideprofile = (event) => {
            if (prof.current && !prof.current.contains(event.target)) {
                setHandleProfileClick(false);
            }
          };

          const handleClickOutsidenotif = (event) => {
            if (notif.current && !notif.current.contains(event.target)) {
                setHandleNotifClick(false);
                setNewNotifs(false);
            }
          };

          
          document.addEventListener('mousedown', handleClickOutsideprofile);
          document.addEventListener('mousedown', handleClickOutsidenotif);
          return () => {
        
            document.removeEventListener('mousedown', handleClickOutsideprofile);
            document.removeEventListener('mousedown', handleClickOutsidenotif);
        };

    },[])

    console.log(handleProfileClick)

    var getData = async() =>{
        try{
          var response = await fetch(`http://127.0.0.1:8000/api/notifications/${user.user_id}/`,{
            method: "GET",
            headers: {
              'Content-Type' : 'application/json',
              'Authorization': 'Bearer ' + String(authTok.access),
            }
          })
    
          var result = await response.json();
          console.log(result)
          setNotifs(result);
          
          
          
        }
        catch(err){
          console.log(err.message)
        }
      }



    useEffect(() => {
        getData();
              if (user) {
    
                socketRef.current = new WebSocket(`ws://127.0.0.1:8000/ws/notification/${user.user_id}`);
    
                  socketRef.current.onopen = () => {
                      console.log('WebSocket connection established');
                  };
      
                  socketRef.current.onmessage = (event) => {
                      const Notifs = JSON.parse(event.data);
                      console.log(Notifs.notifs)
                      setNotifs(Notifs.notifs)
                      setNewNotifs(true);

                  }
                }
                      
                      
                      
                  return () => {
                    socketRef.current.close();
                  }
          }, []);
        
    const notifClick = () =>{
        setHandleNotifClick(!handleNotifClick)
        if (newNotifs == true){
            setNewNotifs(false)
        }
        
    }

    
  return (
    <div  className='flex items-center justify-around p-5'>
        <h1>7078</h1>

        <div className='flex items-center gap-5'>
        <div className="relative" ref={notif}>
            {/* Notification Bell Icon */}
            <div
                className="rounded-full p-5 bg-slate-300 cursor-pointer"
                onClick={notifClick}
            >
                 <box-icon 
                    name="bell" 
                    type={newNotifs ? 'solid' : 'regular'} 
                    color={newNotifs ? '#0000FF' : 'black'}
                ></box-icon>
            </div>

            {/* Notification Popup */}
            {handleNotifClick && (
                <div className="absolute right-0 mt-2 w-64 bg-white shadow-lg rounded-md p-3 z-30">
                    <h4 className="font-bold text-lg">Notifications</h4>
                    <hr className="my-2" />
                    {notifs.length > 0 ? (
                        <ul>
                            {notifs.map((notif, index) => (
                                <a href={`/taskboard/${notif.project.id}`}>
                                <li key={index} className="p-2 border-b last:border-none hover:bg-gray-100">
                                    {notif.message}
                                    
                                </li>
                                </a>
                            ))}
                        </ul>
                    ) : (
                        <p className="text-gray-500">No new notifications</p>
                    )}
                </div>
            )}
        </div>
            
            
            <div className='flex items-center gap-3' >
                <img src="https://i.pinimg.com/736x/bd/b7/95/bdb795aabdeeea18824f8ab188b68b0b.jpg" 
                    alt="" className='rounded-full w-20 h-20'  />
                <div ref={prof}>
                    <h1 onClick={
                        () => {
                            setHandleProfileClick(!handleProfileClick)
                        }
                    }>Username</h1>

{
                    handleProfileClick ? (
                        <div>
                            profile
                        </div>
                    ):
                    <></>
                }
                </div>

                
            </div>
        </div>
    </div>
  )
}

export default Navbar