import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import {BrowserRouter as Router,Route,Routes} from 'react-router-dom'
import { AuthProvider } from './Context/AuthContext'
import LoginPage from './Pages/LoginPage'
import RegisterPage from './Pages/RegisterPage'
import Home from './Pages/Home'
import PrivateRoutes from './Context/PrivateRoutes'
import TaskBoard from './Pages/TaskBoard'
import ProjectsAssigned from './Pages/ProjectsAssigned'
import '@mantine/core/styles.css';

import { MantineProvider } from '@mantine/core';

function App() {
  const [count, setCount] = useState(0)

  return (
    <>
    <MantineProvider>
      <Router>
        <AuthProvider>
          <Routes>
            
            
            <Route path='/' element={
              <PrivateRoutes>
                <Home/>
              </PrivateRoutes>}/>

              <Route path='/taskboard/:id' element={
              <PrivateRoutes>
                <TaskBoard/>
              </PrivateRoutes>}/>

              <Route path='/projectsassigned' element={
              <PrivateRoutes>
                <ProjectsAssigned/>
              </PrivateRoutes>}/>
              

            <Route path='/login' element={<LoginPage/>}/>
            <Route path='/register' element={<RegisterPage/>}/>
          </Routes>
        </AuthProvider>
    </Router>
    </MantineProvider>
    </>
  )
}

export default App
