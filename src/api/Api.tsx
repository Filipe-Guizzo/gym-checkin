import axios from "axios";
import { environment } from "../environments/enviroment";

export const api = axios.create({
    baseURL: environment.API_URL,
});