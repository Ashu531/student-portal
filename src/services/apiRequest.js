import axios from 'axios';
import { logoutUser } from './authService';

export const apiRequest = async (
    options
) => {
    let response = await axios({
        baseURL: API_URL,
        url: options.url,
        headers: {
            token: options.token,
            ...options.headers
        },
        method: options.method,
        data: options.data,
    }).then(async res => {
        delete options['token']
        await options.onSuccess(res.data);
    })
    .catch(async error => {
        if(error.response){
            delete options['token']
            if(onStatus401(error.response.status)) {
                logout();
            } else {
                await options.onError(error.response);
            }
        } else {
            delete options['token']
        }
    })
}

export const onStatus401 = (statusCode) => {
    
    return statusCode == 401;
}

export const logout = async () => {
    const loggedOut = await logoutUser();
    if(loggedOut)
        navigate('/login', {replace: true});
}
