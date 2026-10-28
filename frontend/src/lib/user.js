import axios from "axios";
import {BASE_URL} from "./config.js";

export function register ({name, email, password}) {
    return axios.post(`${BASE_URL}/register`, {name, email, password});
}

export function login ({email, password}) {
    return axios.post(`${BASE_URL}/login`, {email, password});
}