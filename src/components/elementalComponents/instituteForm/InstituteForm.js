import React, { useEffect, useState } from 'react';
import Button from '../button/Button';
import InputField from '../inputField/InputField';
import { getToken } from '../../../services/authService';
import axios from 'axios';
import Select from 'react-select';
import constant from '../../../config/constant'

const relations = [
    { value: 'Father', label: 'Father' },
    { value: 'Mother', label: 'Mother' },
    { value: 'Brother', label: 'Brother' },
    { value: 'Sister', label: 'Sister' },
  ];

export default function InstituteForm({
    title,
    description
}) {

    const [relation,setRelation] = useState('')
    const [requiredField,setRequiredField] = useState(false);
    const [instituteDetails,setInstituteDetails] = useState([]); 

    const handleSubmit=()=>{
       
    }

    useEffect(() => {
       getFieldData()
    }, [])

    const getFieldData=async()=>{

        let params = window.location.pathname
        let url = params.substring(7,params.length)
        const data = await axios.get(`${API_URL}/api/fees/v2/adhoc/link/${url}/`)
        .then(res => {
            setRequiredField(res.data.data)
        })
        .catch(error => error.response.data);

        return data;

    }

    const handleField=(item,e)=>{
        let data = {}

        let details = [...instituteDetails];
        if(details?.length > 0){
            for(let i = 0; i < details.length; i++){
                const set = details[i];
                if(set.label === item.label){
                    details[i] = {
                        'label': item.label,
                        'value' : e
                    }
                    // array.splice[index,0,data]
                    setInstituteDetails(details)
                }
                else{
                    data = {
                        'label': item.label,
                        'value' : e
                    }
                    setInstituteDetails([...details,data])
                }
            }
        }else{
            data = {
                'label': item.label,
                'value' : e
            }
            setInstituteDetails([data])
        }
    }

    const handleRelation=(e)=>{
         setRelation(e.value)
    }

    return (
        <div className='institute'>
            <div className='institute-container'>
            <div className="institute-application">
                   <div>
                       <h2 className="institute-application-heading">{title}</h2>
                       <p className='institute-application-subheading'>{description}</p>
                   </div>
                    <form className='form'>
                        <div className='form-content'>
                            {requiredField && requiredField.map((item,index)=>{
                                return(
                                    item.type === 1 ?
                                        <div className="formDiv" key={index}>
                                            <label className="label">{item.label}</label>
                                            <InputField handleChange={(e)=>handleField(item,e)} maxLength={30} />
                                        </div>
                                     : item.type === 2 ? 
                                        <div className="formDiv" key={index}>
                                            <label className="label">{item.label}</label>
                                            <InputField handleChange={(e)=>handleField(item,e)} maxLength={10} />
                                        </div>
                                    :
                                        <div className="formDiv" key={index}>
                                            <label className="label">{item.label}</label>
                                            <Select
                                                defaultValue={relation}
                                                onChange={(e)=>handleRelation(e)}
                                                options={relations}
                                                styles={select}
                                            />
                                        </div>
                                )
                            })}
                        </div>
                    </form>
               </div>
                <div className='button-container'>
                    <Button 
                    text='Proceed' 
                    classes='button'
                    handleClick={()=>handleSubmit()}
                    />
                </div>
               </div>
              
            </div>
    )
}

const select = {
    height: 54,
    width: '100%'
}

const formDiv={

}



