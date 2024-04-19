import { api } from "../../api/Api";
import { CreateUserRequest } from "../../models/user/CreateUserResquest";

export default class UserService{
    
    async createUser(request: CreateUserRequest) {
        return await api.post('/users', request)
        .then((response)=>{
            return response;
        })
        .catch((error)=>{
            console.log(error);
            return error;
        })
    }

    async findById(id: number) {
        return await api.get(`/users/${id}`)
        .then((response)=>{
            return response;
        })
        .catch((error)=>{
            console.log(error);
            return error;
        })
    }
} 