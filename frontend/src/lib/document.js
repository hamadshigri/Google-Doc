import axios from "axios";
import { BASE_URL } from "./config.js";

export function getAllDocument(token) {
    return axios.get(`${BASE_URL}/document` , {
        headers: {
            'Authorization': `Bearer ${token}`,
            'Accept': 'application/json'
        }
    });
}

export function createDocument({title, content}, token) {
    return axios.post(`${BASE_URL}/document` , {title, content}, {
        headers: {
            'Authorization': `Bearer ${token}`,
            'Accept': 'application/json'
        }
    });
}

export function getDocumentById(id, token) {
    return axios.get(`${BASE_URL}/document/${id}`, {
        headers: {
            'Authorization': `Bearer ${token}`,
            'Accept': 'application/json'
        }
    });
}

export function updateDocument(id, {title, content}, token) {
    return axios.put(`${BASE_URL}/document/${id}`, {title, content}, {
        headers: {
            'Authorization': `Bearer ${token}`,
            'Accept': 'application/json'
        }
    });
}

export function deleteDocument(id, token) {
    return axios.delete(`${BASE_URL}/document/${id}`, {
        headers: {
            'Authorization': `Bearer ${token}`,
            'Accept': 'application/json'
        }
    });
}
