import React from 'react'
import { useAuthStore } from '../store/useAuthStore.js'

const ChatPage = () => {
    const { login, isLoggedIn, authUser } = useAuthStore();
    console.log(isLoggedIn, authUser)
  return (
    <div>
        <p>Chat page</p>
        <button className='btn btn-primary' onClick={login}>Click to test zustand</button>
    </div>
  )
}

export default ChatPage
