import { useEffect } from 'react'
import { Outlet } from 'react-router-dom'

const PersistLogin = () => {
    console.log("Persist login")
    useEffect(() => {
    }, [])
  return (
    <div><Outlet /></div>
  )
}

export default PersistLogin