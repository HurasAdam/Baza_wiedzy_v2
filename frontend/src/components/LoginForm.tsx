import React from 'react'
import { useForm } from 'react-hook-form';

import * as types from "../../types/index";
import TextBox from './core/TextBox';
import Button from './core/Button';

interface ILoginFormProps{
    onSave:(formData:types.ILoginFormData)=>void;
    errorMessage?:string;
}

const LoginForm:React.FC<ILoginFormProps> = ({onSave,errorMessage}) => {




    const {register, formState: { errors  },handleSubmit}=useForm({
        defaultValues:{
          name:"",
          surname:"",
          email:"",
          password:"",
          confirmPassword:"",
        },
        mode: "onChange",
      })

const onSubmit = handleSubmit((data)=>{
    onSave(data)
})


  return (
    <div className='w-full p-4 md:p-1 flex flex-col justify-center items-center min-h-full'>
    <form
      onSubmit={onSubmit}
      className='form-container w-full md:w-[440px] flex flex-col gap-y-8 bg-white px-10 pt-14 pb-14'
    >
      <div className=''>
        <p className='text-blue-600 text-3xl font-bold text-center'>
         Zaloguj się
        </p>
        <p className='text-center text-base text-gray-600 mt-4 '>
       i korzystaj z gotowych szablonów odpowiedzi
        </p>
      </div>
  
      <div className='flex flex-col gap-y-5'>
 
            <TextBox
          placeholder='your password'
          type='email'
          name='email'
          label='Email'
           className='w-full rounded-lg'
          register={register("email", {
            required: "Email jest wymagany",
          })}
          error={errors.email ? errors.email.message : ""}
        />
                 <TextBox
          placeholder='your password'
          type='password'
          name='password'
          label='Hasło'
           className='w-full rounded-lg'
          register={register("password", {
            required: {
              value: true,
              message: "Password is required",
            },
            minLength: {
              value: 6,
              message: "Password length must be at least 6 characters",
            },
          })}
          error={errors.password ? errors.password.message : ""}
        />

  
        <span className='text-sm text-gray-500 hover:text-blue-600 hover:underline cursor-pointer'>
          Zapomniałeś hasła?
        </span>
  
        <Button
          type='submit'
          label='Utwórz'
          className='flex w-full justify-center rounded-md bg-indigo-600 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600'
        />
      </div>
  {    errorMessage && <span className='block text-center font-semibold text-sm text-rose-600'>{errorMessage}</span>}

    </form>
  </div>
    )
  
}

export default LoginForm