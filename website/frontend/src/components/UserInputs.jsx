import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './userInput.css';
import SignUpImage from '../assets/SignUpImage.jpg'; // Import the image

function App() {
  const [data, setData] = useState([]);
  const [formData, setFormData] = useState({
    number_of_room: '',
    land_width: '',
    land_length: '',
    floor_angle: '0',
  });
  const navigate = useNavigate();

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = () => {
    fetch('http://localhost:8081/users', {
      credentials: 'include'
    })
      .then(res => {
        if (!res.ok) {
          throw new Error('Network response was not ok');
        }
        return res.json();
      })
      .then(data => {
        console.log('Fetched data:', data);
        setData(data);
      })
      .catch(error => {
        console.error('Error fetching data:', error);
        showToast('error', error.message);
      });
  };

  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name === 'number_of_room' && value > 10) {
      showToast('error', 'Number of rooms cannot exceed 10');
      return;
    }
    if (name === 'number_of_room' && value < 0) {
      showToast('error', 'Enter correct value');
      return;
    }
    if (name === 'land_width' && value < 0) {
      showToast('error', 'Enter correct value');
      return;
    }
    if (name === 'land_length' && value < 0) {
      showToast('error', 'Enter correct value');
      return;
    }
    if (name === 'land_width' && value > 50) {
      showToast('error', 'Width cannot exceed 50 Feet');
      return;
    }
    
    if (name === 'land_length' && value > 50) {
      showToast('error', 'Length cannot exceed 50 Feet');
      return;
    }
    
    setFormData({ ...formData, [e.target.name]: e.target.value });

  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const requestOptions = {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(formData),
      credentials : 'include'
    };

    fetch('http://localhost:8081/users', requestOptions)
      .then(response => {
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        return response.json();
      })
      .then(newPropertyData => {
        console.log('New property added:', newPropertyData);
        fetchData(); // Refresh the data after adding a new property
        showToast('success', 'Property added successfully!');
        setFormData({ number_of_room: '', land_width: '', land_length: '', floor_angle: '0' }); // Clear the form
      })
      .catch(error => {
        console.error('Error adding property:', error);
        showToast('error', error.message);
      });
  };

  const handleGenerate2DPlan = () => {
    navigate('/generate-2d-plan');
  };

  const showToast = (type, message) => {
    const toast = document.createElement('div');
    toast.className = `toast ${type}`;
    toast.textContent = message;
    document.body.appendChild(toast);

    setTimeout(() => {
      toast.classList.add('show');
    }, 100);

    setTimeout(() => {
      toast.classList.remove('show');
      setTimeout(() => {
        document.body.removeChild(toast);
      }, 300);
    }, 3000);
  };

  return (
    <div className="app">
      <img src={SignUpImage} alt="Sign" className="user-image" />
      <div className="container">
        <h2>Add your plan data</h2>
        <form onSubmit={handleSubmit}>
          <label>
            Number of Rooms (Only bed rooms you want):
            <input type="number" name="number_of_room" value={formData.number_of_room} onChange={handleChange} required />
          </label>
          <label>
            Land Width (by Feet):
            <input type="number" name="land_width" value={formData.land_width} onChange={handleChange} required />
          </label>
          <label>
            Land Length (by Feet):
            <input type="number" name="land_length" value={formData.land_length} onChange={handleChange} required />
          </label>
          <label>
            Land Angle (Have or Not):
            <select name="floor_angle" value={formData.floor_angle} onChange={handleChange} required>
              <option value="0">0</option>
              <option value="1">1</option>
            </select>
          </label>
          <button type="submit">Submit</button>
          <button type="button" onClick={handleGenerate2DPlan}>Generate 2D Plan</button>
        </form>

        <h2>Your Entered Data</h2>
        <table>
          <thead>
            <tr>
              <th>ID</th>
              <th>Rooms</th>
              <th>Land Width</th>
              <th>Land Length</th>
              <th>Land Angle</th>
            </tr>
          </thead>
          <tbody>
            {data.map((d, i) => (
              <tr key={i}>
                <td>{d.input_id}</td>
                <td>{d.number_of_room}</td>
                <td>{d.land_width}</td>
                <td>{d.land_length}</td>
                <td>{d.floor_angle}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default App;
