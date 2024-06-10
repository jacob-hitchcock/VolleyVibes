// src/hooks/useFormValidation.js
import { useState } from 'react';

const useFormValidation = (initialState,validate) => {
    const [form,setForm] = useState(initialState);
    const [errors,setErrors] = useState({});

    const handleChange = (e) => {
        const { name,value } = e.target;
        setForm({ ...form,[name]: value });
    };

    const handleSubmit = (e,onSubmit) => {
        e.preventDefault();
        const validationErrors = validate(form);
        if(Object.keys(validationErrors).length > 0) {
            setErrors(validationErrors);
        } else {
            setErrors({});
            onSubmit();
        }
    };

    return { form,errors,handleChange,handleSubmit,setForm,setErrors };
};

export default useFormValidation;
