import React from 'react'
import { Outlet } from 'react-router-dom'

const AuthLayout = () => {
  return (
    <section className='min-h-screen flex w-full bg-blue-100'>
      <div className='flex-1 my-auto hidden lg:flex flex-col items-center mt-20'>
        <h1 className=' text-6xl text-indigo-800 font-bold'>Baza wiedzy</h1>
{/* <img className='w-auto max-h-[700px]' src={CONSTANTS.IMAGES.landingImage} alt="" /> */}

</div>
          <div className='flex-1 md:w-2/5 h-screen bg-white flex justify-center max-w-8xl mx-auto '>
       
    <Outlet/>
    </div>


    </section>
  )
}

export default AuthLayout