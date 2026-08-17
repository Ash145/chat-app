import React, { useEffect } from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'
import Navbar from './components/Navbar'
import HomePage from './pages/HomePage'
import SignInPage from './pages/SignInPage'
import SignUpPage from './pages/SignUpPage'
import SettingsPage from './pages/SettingsPage'
import ProfilePage from './pages/ProfilePage'
import { useAuthStore } from './store/useAuthStore'
import { useThemeStore } from "./store/useThemeStore";
import { Loader2 } from 'lucide-react'
import { Toaster } from 'react-hot-toast'

const App = () => {

  const { authUser, checkAuth, isCheckingAuth } = useAuthStore();
  const { theme } = useThemeStore();

  useEffect(() => {
    checkAuth();
  }, [checkAuth]);
  
  if (isCheckingAuth && !authUser) {
    return <div>
      <div className='flex items-center justify-center h-screen'>
        <Loader2 className='size-8 animate-spin' />
      </div>
    </div>;
  }

  return (
    <div data-theme={theme}>
      <Navbar />
      <Routes>
        <Route path='/' element={ authUser ?<HomePage /> : <Navigate to='/signin' />} />
        <Route path='/signin' element={!authUser ? <SignInPage /> : <Navigate to='/' />} />
        <Route path='/signup' element={!authUser ? <SignUpPage /> : <Navigate to='/' />} />
        <Route path='/settings' element={<SettingsPage />} />
        <Route path='/profile' element={authUser ? <ProfilePage /> : <Navigate to='/signin' />} />
      </Routes>

      <Toaster />
    </div>
  )
}

export default App