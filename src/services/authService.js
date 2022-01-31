import axios from "axios";

const saveToken = (token) => {
    localStorage.setItem('credenc-fms-student-portal', token);
}

const getToken = () => {
    return localStorage.getItem('credenc-fms-student-portal');
}

const authenticateUser = async (token) => {
    return await axios.get(`${API_URL}/api/kid/v1/installments/${token}/`)
    .then(res => res.data)
    .catch(error => error.response.data);
}

const getUser = (token) => {
    const user = authenticateUser(token);
    return user.status;
}

export {
    saveToken,
    getToken,
    getUser,
}