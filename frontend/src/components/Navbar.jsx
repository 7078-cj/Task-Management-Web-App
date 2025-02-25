import React, { useContext, useEffect, useRef, useState } from 'react'
import AuthContext from '../Context/AuthContext'
import { Link } from 'react-router-dom'
import { Avatar, CloseButton, Notification } from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import { Drawer, Button } from '@mantine/core';

function Navbar() {

    
    var [handleNotifClick,setHandleNotifClick] = useState(false)
    const [isEditing, setIsEditing] = useState(false);

    const [editProfile, setEditProfile] = useState();

    

    const [notifs,setNotifs] = useState([])
    const [newNotifs,setNewNotifs] = useState(false)
    const {user,authTok,logOut} = useContext(AuthContext)
    const [profile,setProfile] = useState()
    
    
    const notif = useRef()
    const socketRef = useRef(null);

    useEffect(()=>{

          const handleClickOutsidenotif = (event) => {
            if (notif.current && !notif.current.contains(event.target)) {
                setHandleNotifClick(false);
                setNewNotifs(false);
            }
          };

          
          
          document.addEventListener('mousedown', handleClickOutsidenotif);
          return () => {
        
            
            document.removeEventListener('mousedown', handleClickOutsidenotif);
        };

    },[])

   
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

      var getProfile = async() =>{
        try{
          var response = await fetch(`http://127.0.0.1:8000/api/getProfile/${user.user_id}/`,{
            method: "GET",
            headers: {
              'Content-Type' : 'application/json',
              'Authorization': 'Bearer ' + String(authTok.access),
            }
          })
    
          var result = await response.json();
          console.log(result)
          setProfile(result);
          setEditProfile(result)
          
          
          
        }
        catch(err){
          console.log(err.message)
        }
      }



    useEffect(() => {
        getData();
        getProfile();
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

    

    const handleSave = async(e) => {
           
            const formData = new FormData();
            formData.append("bio", e.target.bio.value);
            formData.append("profilePic", e.target.profilePic.files[0])
            
        
            try {
                const response = await fetch(`http://127.0.0.1:8000/api/updateProfile/${user.user_id}/`, {
                    method: "PUT",
                    headers: {
                        "Accept": "application/json",
                        'Authorization': 'Bearer ' + String(authTok.access),
                       
                    },
                    body: formData,
                });
        
                if (!response.ok) {
                    throw new Error(`HTTP error! Status: ${response.status}`);
                }
        
                const data = await response.json();
                console.log("Profile updated:", data);
                setProfile(data);
                setIsEditing(false);
            } catch (error) {
                console.error("Error updating profile:", error);
            }
        };

    const handleNotiifDelete = async(notifID) =>{
            
        const response = await fetch(`http://127.0.0.1:8000/api/deleteNotification/${notifID}/`, {
            method: "DELETE",
            headers: {
                "Accept": "application/json",
                'Authorization': 'Bearer ' + String(authTok.access),
               
            },
        });

        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }

        const data = await response.json();
        console.log("Notif Deleted:", data);
        

        setNotifs((prevNotifs) => prevNotifs.filter((notif) => notif.id !== notifID));
          
    }
    

    const [opened, { open, close }] = useDisclosure(false);

  return (
    <div  className='flex items-center justify-around p-5'>
        <h1>7078</h1>

        <div className='flex items-center gap-5'>
        <div className="relative" ref={notif}>
            {/* Notification Bell Icon */}
            <div
                className="rounded-full h-[40px] w-[40px] flex justify-center items-center bg-slate-300 cursor-pointer"
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
                        <ul className='flex flex-col gap-3 '>
                            {notifs.map((notif, index) => (
                                <div className='flex flex-row gap-5 items-center justify-center'>
                                    <a href={`/taskboard/${notif.project.id}`}>
                                        {/* <li key={index} className="p-2 border-b last:border-none hover:bg-gray-100">
                                            {notif.message}
                                            
                                        </li> */}
                                        <Notification withCloseButton={false} withBorder title="New Task Assigned">
                                            {notif.message}
                                        </Notification>
                                
                                    </a>
                                    <CloseButton onClick={()=>{handleNotiifDelete(notif.id)}} />
                                </div>
                            ))}
                        </ul>
                    ) : (
                        <p className="text-gray-500">No new notifications</p>
                    )}
                </div>
            )}
        </div>
            
            
            <div className='flex items-center gap-3'>
                {/* <img src={profile?.profile?.profilePic 
                            ? `http://127.0.0.1:8000${profile.profile.profilePic}`
                            : "https://via.placeholder.com/100"} 
                    alt="Profile"
                    className='rounded-full w-20 h-20'  /> */}
                     <Avatar  src={profile?.profile?.profilePic 
                            ? `http://127.0.0.1:8000${profile.profile.profilePic}`
                            : "https://via.placeholder.com/100"} alt="it's me" />
                <div >
                    <h1  onClick={open}>{profile?.username}</h1>


                    
                        <Drawer opened={opened} onClose={close} title="Profile" >
                            {isEditing ? (
                                <form className='' onSubmit={handleSave} encType="multipart/form-data">
                                    ProfilePic: 
                                    <input
                                        type="file"
                                        className="border p-1 rounded w-full mb-2"
                                        value={editProfile.profilePic}
                                        name='profilePic'
                                        onChange={(e) =>
                                            setEditProfile({ ...editProfile, profilePic: e.target.value })
                                        }
                                    />
                                    <textarea
                                        className="border p-1 rounded w-full mb-2"
                                        value={profile?.profile?.bio}
                                        name='bio'
                                        onChange={(e) =>
                                            setEditProfile({ ...editProfile, bio: e.target.value })
                                        }
                                    ></textarea>
                                    <button
                                        className="bg-green-500 text-white px-3 py-1 rounded mr-2"
                                       
                                    >
                                        Save
                                    </button>
                                    <button
                                        className="bg-gray-300 px-3 py-1 rounded"
                                        onClick={() => setIsEditing(false)}
                                    >
                                        Cancel
                                    </button>
                                </form>
                            ):(
                                <div>

                                    <p><strong>Bio:</strong> <p>{profile?.profile?.bio ?? "No bio available"}</p></p>
                                    <button
                                        className="bg-blue-500 text-white px-3 py-1 rounded mt-2"
                                        onClick={() => setIsEditing(true)}
                                    >
                                        Edit
                                    </button>
                                </div>
                            )}
                               </Drawer>
                    
                  
                
                </div>

                
            </div>
            <Button fullWidth variant="filled" color="rgba(250, 150, 150, 1)" onClick={()=>{logOut()}}>LogOut</Button>
        </div>
        
    </div>
  )
}

export default Navbar