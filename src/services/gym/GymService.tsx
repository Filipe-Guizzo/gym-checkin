import Cookies from "js-cookie";
import { api } from "../../api/Api";
import { CreateGymRequest } from "../../models/gym/CreateGymRequest";

export default class GymService{
    async findByName(name: string, page: number) {
        const TOKEN: any = Cookies.get('JWT_TOKEN');

        return await api.get(`/gyms/search?name=${name}&page=${page}&pageSize=100`, { headers: {'Authorization': TOKEN}})
        .then((response)=>{
            return response;
        })
        .catch((error)=>{
            console.log(error);
            return error;
        })
    }

    async createGym(request: CreateGymRequest) {
        const TOKEN: any = Cookies.get('JWT_TOKEN');

        return await api.post('/gyms', request, { headers: {'Authorization': TOKEN}})
        .then((response)=>{
            return response;
        })
        .catch((error)=>{
            console.log(error);
            return error;
        })
    }
}