import React, { useEffect, useRef, useState } from 'react'

function Navbar() {

    var [handleProfileClick,setHandleProfileClick] = useState(false)
    var [handleNotifClick,setHandleNotifClick] = useState(false)

    const prof = useRef()
    const notif = useRef()

    useEffect(()=>{

        const handleClickOutsideprofile = (event) => {
            if (prof.current && !prof.current.contains(event.target)) {
                setHandleProfileClick(false);
            }
          };

          const handleClickOutsidenotif = (event) => {
            if (notif.current && !notif.current.contains(event.target)) {
                setHandleNotifClick(false);
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
  return (
    <div  className='flex items-center justify-around p-5'>
        <h1>7078</h1>

        <div className='flex items-center gap-5'>
            {/* Notification Icon */}
            <div className='rounded-full p-5 bg-slate-300' ref={notif}>
                <box-icon name='bell' onClick={
                        () => {
                            setHandleNotifClick(!handleNotifClick)
                        }
                    }></box-icon>
                {handleNotifClick ? (
                        <div>
                            notif
                        </div>
                    ):
                    <></>
                
                }
                
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