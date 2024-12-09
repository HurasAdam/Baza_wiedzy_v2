import { IMAGES } from '@/constants/images';
import useAuth from '@/hooks/useAuth';
import React from 'react'
import { Navigate, Outlet } from 'react-router-dom'

const AuthLayout = () => {

  const { user, isLoading } = useAuth();



if(user){
  return <Navigate to="/dashboard"/>
}else{
  return (
    <section className='min-h-screen flex w-full bg-blue-400'>
      <div className='flex-1 my-auto hidden lg:flex flex-col items-center mt-10'>
      <span className='text-orange-700 font-bold text-2xl mb-1.5'>LIBRUS</span>
        <h1 className=' text-6xl text-blue-50 font-bold font-inter '>Baza wiedzy</h1>
        <span className='my-2 text-indigo-200 font-semibold'>Helpdesk</span>
      
        <img src={IMAGES.loginImage} alt="" />
{/* <img className='w-auto max-h-[700px]' src={CONSTANTS.IMAGES.landingImage} alt="" /> */}

</div>
          <div className='flex-1 md:w-2/5 h-screen bg-white flex justify-center max-w-8xl mx-auto '>
       
    <Outlet/>
    </div>


    </section>
  )
}




}

export default AuthLayout