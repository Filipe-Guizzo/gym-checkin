import { LoginUserRequest } from "../../models/auth/LoginUserRequest";
import { api } from "../../api/Api";

export default class AuthService{
    
    async loginUser(request: LoginUserRequest) {
        return await api.post('/login', request)
        .then((response)=>{
            return response;
        })
        .catch((error)=>{
            console.log(error);
            return error;
        })
    }
} 