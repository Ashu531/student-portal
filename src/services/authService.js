import axios from "axios";

const saveToken = (token) => {
    localStorage.setItem('credenc-fms-student-portal', token);
}

const removeToken = () => {
    localStorage.removeItem('credenc-fms-student-portal');
    removeStudents();
}

const getToken = () => {
    // console.log('getting token from localhost...');
    return localStorage.getItem('credenc-fms-student-portal');
}

const saveStudents = (students) => {
    localStorage.setItem('credenc-fms-students', JSON.stringify(students));
}

const removeStudents = () => {
    localStorage.removeItem('credenc-fms-students');
}

const getStudents = () => {
    const students = JSON.parse(localStorage.getItem('credenc-fms-students'));
    return students != null && students.length > 0 ? students : [];
}

const delay = ms => new Promise(res => setTimeout(res, ms));
const authenticateUser = async (token) => {
    // console.log('sending request...');
    if(token == null){
        token = getToken();
    }
    
    let user = await axios.get(`${API_URL}/api/kid/v1/authentication/${token}/`)
    .then(res => res.data)
    .catch(err => console.log(err));
    if(user && user.status){
        saveToken(token);
        return true;
    } else{
        removeToken();
    }
    
    return false;
}

const logoutUser = async () => {
    // console.log('logging out...');
    let res = await axios.delete(`${API_URL}/api/kid/v1/logout/${getToken()}/`)
    .then(res => res.data)
    .catch(err => console.log(err));
    if(res){
        removeToken();
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
    saveStudents,
    getStudents
}