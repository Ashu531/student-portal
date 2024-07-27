import axios from "axios";


export const saveForm = async (payload, token) => {

    const response = await axios.post(`${API_URL}/api/loan/v1/loan-lead/`, payload, {
        headers: {
            token: `${token}`,
        },
    }).then(res => {
        return res.data
    })
    .catch(err => {
        // if(err.response.data.error.length > 0){
        //     alert(err.response.data.error)
        // }
       return err.response
    })
    
    return response;

}

export const saveEditedForm = async (payload, token) => {

    const response = await axios.post(`${API_URL}/api/loan/v1/loan-lead/`, payload, {
        headers: {
            token: `${token}`,
        },
    }).then(res => res.data.data)
    .catch(err => console.log(err.response))

    return response;

}

export const saveDraft = async (payload, token) => {

    const response = await axios.post(`${API_URL}/api/loan/loan/lead/`, payload, {
        headers: {
            token: `${token}`,
        },
    }).then(res => res.data.data)
    .catch(err => {
        alert(err.response.data.error)
    })

    return response;

}


export const getProfileData = async (token) => {

    const response = await axios.get(`${API_URL}/api/loan/lead/profile/`, {
        headers: {
            token: `${token}`,
        },
    }).then(res => res.data.data)
    .catch(err => console.log(err))

    return response;

}

export const getDraftCount = async (token) => {

    const response = await axios.get(`${API_URL}/api/loan/draftscount/`, {
        headers: {
            token: `${token}`,
        },
    }).then(res => res.data.data)
    .catch(err => console.log(err))

    return response;

}