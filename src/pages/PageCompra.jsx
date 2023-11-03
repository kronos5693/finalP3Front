import React from 'react'
import NavBar from '../components/NavBar/navBar'
import { useParams } from 'react-router-dom'

const PageCompra = () => {
const {excu}= useParams();
  return (
    <>
      <NavBar  />
      <div>PageCompra:{excu}</div>
    </>
   
  )
}

export default PageCompra