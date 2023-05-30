import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';
import InstituteForm from '../elementalComponents/instituteForm/InstituteForm';

export default function Signup() {
    
    const getData = async () => {

    }

    useEffect(() => {

    }, [])

    return (
        <div className='signup'>
            <InstituteForm
             title="Institute Information"
             description='Enter information, as applicable!'
            />
        </div>
    )
}



