import React from 'react'
import { Link } from 'react-router-dom'
import SideBarBtn from './SideBarBtn'
import { Badge, Button, NavLink } from '@mantine/core';

function SideBar() {
  return (
    <div className='flex flex-col items-center gap-4 p-4'>
      {/* <SideBarBtn path={"/"} pathName={"Projects"}/>
      <SideBarBtn path={"/projectsassigned"} pathName={"Projects Assigned"}/> */}
      <NavLink
       href="/"
       label="Projects"
       leftSection={<box-icon name='home-alt'></box-icon>}
      />
      <NavLink
       href="/projectsassigned"
       label="Assigned Projects"
       description="Projects that have task assigned to you"
       leftSection={<box-icon name='right-arrow-alt'></box-icon>}
      />
      
    </div>
  )
}

export default SideBar