import useAuth from '@/hooks/useAuth';
import React from 'react'
import { Navigate, Outlet } from 'react-router-dom'

const AuthLayout = () => {

  const { user, isLoading } = useAuth();



if(user){
  return <Navigate to="/articles"/>
}else{
  return (
    <section className='min-h-screen flex w-full bg-customDark'>
      <div className='flex-1 my-auto hidden lg:flex flex-col items-center mt-20'>
        <h1 className=' text-5xl text-neutral-100 font-semibold font-inter'>Baza wiedzy</h1>
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