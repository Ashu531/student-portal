import axios from "axios";

const saveToken = (token) => {
    localStorage.setItem('credenc-fms-student-portal', token);
}

const getToken = () => {
    console.log('getting token from localhost...');
    return localStorage.getItem('credenc-fms-student-portal');
}

const delay = ms => new Promise(res => setTimeout(res, ms));
const authenticateUser = async (token) => {
    console.log('sending request...');
    let user = await axios.get(`${API_URL}/api/kid/v1/authentication/${token}/`)
    .then(res => res.data)
    .catch(err => console.log(err));
    if(user.status){
        saveToken(token);
        return true;
    }
    
    return false;
}

const logoutUser = async () => {
    console.log('logging out...');
    let res = await axios.delete(`${API_URL}/api/kid/v1/logout/${getToken()}/`)
    .then(res => res.data)
    .catch(err => console.log(err));
    if(res.status){
        localStorage.removeItem('credenc-fms-student-portal');
        return true;
    }

    return false;
}

export {
    saveToken,
    getToken,
    authenticateUser,
    delay,
    logoutUser,
}