import Cookies from "js-cookie";
import { api } from "../../api/Api";

export default class CheckinService{
    
    async createCheckin(gymId: number, userId: number) {
        const TOKEN: any = Cookies.get('JWT_TOKEN');

        return await api.post('/checkins', { gymId: gymId, userId: userId}, { headers: {'Authorization': TOKEN}})
        .then((response)=>{
            return response;
        })
        .catch((error)=>{
            console.log(error);
            return error;
        })
    }

    async findById(userId: number, page:number) {
        const TOKEN: any = Cookies.get('JWT_TOKEN');

        return await api.get(`/checkins/user/${userId}?page=${page}&pageSize=100`, { headers: {'Authorization': TOKEN}})
        .then((response)=>{
            return response;
        })
        .catch((error)=>{
            console.log(error);
            return error;
        })
    }
} 