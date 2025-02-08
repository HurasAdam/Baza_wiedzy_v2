import API from "@/config/api.client"

export const getUserNotifications = async() =>{
    return API.get('/notifications');
}



export  const notificationApi ={
    getUserNotifications
} 