import React from 'react'
import { Avatar } from '../ui/avatar'
import { AvatarFallback, AvatarImage } from '@radix-ui/react-avatar'

const UserAvatar = () => {
  return (
    <Avatar className='cursor-pointer'>
          <AvatarImage src="https://github.com/shadcn.png" alt="@shadcn" />
        <AvatarFallback className='flex items-center '>CN</AvatarFallback>
    </Avatar>
  )
}

export default UserAvatar