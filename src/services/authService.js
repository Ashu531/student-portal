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
    // let user = await axios.get(`${API_URL}/api/kid/v1/installments/${token}/`)
    // .then(res => res.data)
    // .catch(err => console.log(err));
    await delay(2000);
    return false;
}

export {
    saveToken,
    getToken,
    authenticateUser,
}