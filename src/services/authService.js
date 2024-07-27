import axios from "axios";

const saveToken = (token) => {
    localStorage.setItem('fms-student-portal', token);
}

const removeToken = () => {
    localStorage.removeItem('fms-student-portal');
    removeStudents();
}

const getToken = () => {
    // console.log('getting token from localhost...');
    return localStorage.getItem('fms-student-portal');
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
    .catch(error => {
        alert(error.response.data.error)
        return error.response.data
    });
    if(user && user.status){
        saveToken(token);
        return true;
    } else{
        removeToken();
    }
    
    return false;
}

const logoutUser = async () => {
    const token = getToken();  

    try {
        let res = await axios.post(`${API_URL}/api/auth/v1/logout/`, {}, {
            headers: {
                'Token': `${token}`
            }
        });

        if (res.status === 200) {
            removeToken();
            return true;
        }
    } catch (error) {
        alert(error.response?.data?.error || 'Logout failed');
        return false;
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