import React, { useState } from 'react';
import { useNavigate } from "react-router-dom";

function JobPosting() {
  const [formData, setFormData] = useState({
    company_name: '',
    job_description: '',
    role: '',
    primary_skills: 33,
    secondary_skills: 33,
    other_skills: 34,
    primary_skills_name: '',
    secondary_skills_name: '',
    other_skills_name: '',
    package: '',
    stipend_amount: ''
  });

  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const navigate = useNavigate();

  const handleSliderChange = (event) => {
    const { name, value } = event.target;
    const newValue = parseInt(value, 10);

    const total = formData.primary_skills + formData.secondary_skills + formData.other_skills;

    // Find the other two sliders
    const otherSliders = {
        primary_skills: ['secondary_skills', 'other_skills'],
        secondary_skills: ['primary_skills', 'other_skills'],
        other_skills: ['primary_skills', 'secondary_skills'],
    };

    const [slider1, slider2] = otherSliders[name];

    // Calculate the total of the other two sliders
    const otherTotal = formData[slider1] + formData[slider2];

    if (total !== 100) {
        // Adjust the other two sliders proportionally
        const remainingPercentage = 100 - newValue;

        const slider1NewValue = Math.round((formData[slider1] / otherTotal) * remainingPercentage);
        const slider2NewValue = 100 - (newValue + slider1NewValue);

        setFormData((prevData) => ({
            ...prevData,
            [name]: newValue,
            [slider1]: slider1NewValue,
            [slider2]: slider2NewValue,
        }));
    } else {
        // Just update the value for the current slider
        setFormData((prevData) => ({
            ...prevData,
            [name]: newValue,
        }));
    }

    setError('');
};


  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
    setError('');
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    try {
      const response = await fetch('http://localhost:5000/job-posting', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        const errorMessage = await response.json();
        throw new Error(errorMessage.message || 'Failed to create job posting.');
      }

      const data = await response.json();
      setMessage(data.message);
      setFormData({
        company_name: '',
        job_description: '',
        role: '',
        primary_skills: 33,
        secondary_skills: 33,
        other_skills: 34,
        primary_skills_name: '',
        secondary_skills_name: '',
        other_skills_name: '',
        package: '',
        stipend_amount: ''
      });

      setTimeout(() => {
        navigate("/hr-dashboard");
      }, 2000);

    } catch (error) {
      console.error('Error:', error);
      setError(error.message);
      setMessage('');
    }
  };

  return (
    <div style={styles.container}>
      <h2 style={styles.heading}>Create Job Posting</h2>
      <form style={styles.form} onSubmit={handleSubmit}>
        <input
          type="text"
          name="company_name"
          value={formData.company_name}
          onChange={handleChange}
          placeholder="Company Name"
          style={styles.input}
          required
        />
        <textarea
          name="job_description"
          value={formData.job_description}
          onChange={handleChange}
          placeholder="Job Description"
          style={styles.textarea}
          required
        />
        <input
          type="text"
          name="role"
          value={formData.role}
          onChange={handleChange}
          placeholder="Role"
          style={styles.input}
          required
        />
        <input
          type="text"
          name="primary_skills_name"
          value={formData.primary_skills_name}
          onChange={handleChange}
          placeholder="Primary Skills (e.g., JavaScript)"
          style={styles.input}
          required
        />
        <input
          type="text"
          name="secondary_skills_name"
          value={formData.secondary_skills_name}
          onChange={handleChange}
          placeholder="Secondary Skills (e.g., React)"
          style={styles.input}
          required
        />
        <input
          type="text"
          name="other_skills_name"
          value={formData.other_skills_name}
          onChange={handleChange}
          placeholder="Other Skills (e.g., Docker)"
          style={styles.input}
          required
        />
        <div style={styles.sliderContainer}>
          <label>Primary Skills: {formData.primary_skills}%</label>
          <input
            type="range"
            name="primary_skills"
            min="0"
            max="100"
            value={formData.primary_skills}
            onChange={handleSliderChange}
            style={styles.slider}
          />
        </div>
        <div style={styles.sliderContainer}>
          <label>Secondary Skills: {formData.secondary_skills}%</label>
          <input
            type="range"
            name="secondary_skills"
            min="0"
            max="100"
            value={formData.secondary_skills}
            onChange={handleSliderChange}
            style={styles.slider}
          />
        </div>
        <div style={styles.sliderContainer}>
          <label>Other Skills: {formData.other_skills}%</label>
          <input
            type="range"
            name="other_skills"
            min="0"
            max="100"
            value={formData.other_skills}
            onChange={handleSliderChange}
            style={styles.slider}
          />
        </div>
        <input
          type="text"
          name="package"
          value={formData.package}
          onChange={handleChange}
          placeholder="Package"
          style={styles.input}
          required
        />
        <input
          type="text"
          name="stipend_amount"
          value={formData.stipend_amount}
          onChange={handleChange}
          placeholder="Stipend Amount"
          style={styles.input}
          required
        />
        <button type="submit" style={styles.button}>Create Job Posting</button>
      </form>
      {message && <div style={styles.successMessage}>{message}</div>}
      {error && <div style={styles.errorMessage}>Error: {error}</div>}
    </div>
  );
}

const styles = {
  container: {
    maxWidth: '600px',
    margin: '0 auto',
    padding: '20px',
    backgroundColor: '#f9f9f9',
    boxShadow: '0 2px 10px rgba(0, 0, 0, 0.1)',
    borderRadius: '10px'
  },
  heading: {
    textAlign: 'center',
    color: '#333',
    marginBottom: '20px'
  },
  form: {
    display: 'flex',
    flexDirection: 'column'
  },
  input: {
    width: '100%',
    padding: '12px',
    marginBottom: '15px',
    border: '1px solid #ccc',
    borderRadius: '5px',
    fontSize: '16px'
  },
  textarea: {
    width: '100%',
    padding: '12px',
    marginBottom: '15px',
    border: '1px solid #ccc',
    borderRadius: '5px',
    fontSize: '16px',
    minHeight: '100px',
    resize: 'vertical'
  },
  sliderContainer: {
    marginBottom: '15px'
  },
  slider: {
    width: '100%'
  },
  button: {
    padding: '10px 20px',
    backgroundColor: '#007BFF',
    color: 'white',
    fontSize: '16px',
    border: 'none',
    borderRadius: '5px',
    cursor: 'pointer',
    transition: 'background-color 0.3s ease'
  },
  successMessage: {
    color: 'green',
    marginTop: '20px',
    textAlign: 'center'
  },
  errorMessage: {
    color: 'red',
    marginTop: '20px',
    textAlign: 'center'
  }
};

export default JobPosting;
