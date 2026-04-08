// src/hooks/useFormValidation.js
import { useState } from 'react';

/**
 * Generic form state and validation hook.
 * Manages field values, error messages, and submit behavior.
 *
 * @param {Object} initialState - Initial form field values (e.g. { name: '', age: '' }).
 * @param {Function} validate - Function that receives the current form and returns an errors object.
 *   Return an empty object `{}` if the form is valid.
 * @returns {{
 *   form: Object,
 *   errors: Object,
 *   handleChange: Function,
 *   handleSubmit: Function,
 *   setForm: Function,
 *   setErrors: Function
 * }}
 */
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
