import React from 'react'
import { Link } from 'react-router-dom'
import SideBarBtn from './SideBarBtn'

function SideBar() {
  return (
    <div className='flex flex-col items-center gap-4'>
      <SideBarBtn path={"/"} pathName={"Projects"}/>
      <SideBarBtn path={"/projectsassigned"} pathName={"Projects Assigned"}/>
    </div>
  )
}

export default SideBar