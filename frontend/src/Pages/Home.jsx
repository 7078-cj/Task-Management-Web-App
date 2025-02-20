import React from 'react'
import Navbar from '../components/Navbar'
import SideBar from '../components/SideBar'

import DashBoard from '../components/DashBoard'
import TaskAssigned from '../components/TaskAssigned'

function Home() {
  return (
    <>
      <Navbar/>

      <div className='grid grid-cols-[20%_60%]'>
        <SideBar/>
        <DashBoard/>
      </div>
      
    </>
  )
}

export default Home