import { Navigate, Outlet } from 'react-router-dom'
import useAuth from '@/hooks/useAuth';
import { IMAGES } from '@/constants/images';

export const AuthLayout = () => {
    const { user, status } = useAuth();

    console.log("_____AuthLayout______", status, user)

    if (status === 'pending') {
        return <div>Loading... AuthLayout</div>
    }

    if (status === 'success') {
        return <Navigate to="/" />;
    }

    return (
        <section className='min-h-screen flex w-full bg-blue-400'>
            <div className='flex-1 my-auto hidden lg:flex flex-col items-center mt-10'>
                <div className=' mb-1.5 flex gap-2'>
                    <img src={IMAGES.Logo} className='w-9 h-9' alt="" />
                    <span className='text-orange-600 font-bold text-2xl'>LIBRUS</span>
                </div>
                <h1 className=' text-6xl text-blue-50 font-bold font-inter '>Baza wiedzy</h1>
                <span className='my-2 text-indigo-200 font-semibold'>Helpdesk</span>
                <img src={IMAGES.loginImage} alt="" />
            </div>
            <div className='flex-1 md:w-2/5 h-screen bg-white flex justify-center max-w-8xl mx-auto '>
                <Outlet />
            </div>
        </section>
    )
}




// import { IMAGES } from '@/constants/images';
// import useAuth from '@/hooks/useAuth';
// import React from 'react'
// import { Navigate, Outlet } from 'react-router-dom'

// export const AuthLayout:React.FC = () => {
//   const { user } = useAuth();

// if(user){
//   return <Navigate to="/dashboard"/>
// }else{
//   return (
//     <section className='min-h-screen flex w-full bg-blue-400'>
//       <div className='flex-1 my-auto hidden lg:flex flex-col items-center mt-10'>
//       <div className=' mb-1.5 flex gap-2'>
//       <img src={IMAGES.Logo} className='w-9 h-9' alt="" />
//         <span className='text-orange-600 font-bold text-2xl'>LIBRUS</span>
//         </div>
//         <h1 className=' text-6xl text-blue-50 font-bold font-inter '>Baza wiedzy</h1>
//         <span className='my-2 text-indigo-200 font-semibold'>Helpdesk</span>
//         <img src={IMAGES.loginImage} alt="" />
// </div>
//           <div className='flex-1 md:w-2/5 h-screen bg-white flex justify-center max-w-8xl mx-auto '>
//     <Outlet/>
//     </div>
//     </section>
//   )
// }

// }

