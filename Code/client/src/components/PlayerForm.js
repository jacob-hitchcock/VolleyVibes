// src/components/PlayerForm.js
import React from 'react';

const PlayerForm = ({ form,errors,handleChange,handleSubmit,editMode }) => {
    return (
        <form onSubmit={handleSubmit}>
            <div>
                <label>Name:</label>
                <input
                    type="text"
                    name="name"
                    placeholder="Name"
                    value={form.name}
                    onChange={handleChange}
                    required
                />
                {errors.name && <span className="error">{errors.name}</span>}
            </div>
            <div>
                <label>Age:</label>
                <input
                    type="number"
                    name="age"
                    placeholder="Age"
                    value={form.age}
                    onChange={handleChange}
                />
                {errors.age && <span className="error">{errors.age}</span>}
            </div>
            <div>
                <label>Gender:</label>
                <input
                    type="text"
                    name="gender"
                    placeholder="Gender"
                    value={form.gender}
                    onChange={handleChange}
                    required
                />
                {errors.gender && <span className="error">{errors.gender}</span>}
            </div>
            <button type="submit">{editMode ? 'Update Player' : 'Add Player'}</button>
        </form>
    );
};

export default PlayerForm;
