import React, { useState } from 'react';
import axios from 'axios';

const PhotoUpload = ({ userId }) => {
  const [file, setFile] = useState(null);

  const handleFileChange = (event) => {
    setFile(event.target.files[0]);
  };

  const handleUpload = async () => {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('userId', userId); // Include the user ID

    const response = await axios.post('http://localhost:8000/uploads', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });

    console.log(response.data);
  };

  return (
    <div>
      <input type="file" onChange={handleFileChange} />
      <button onClick={handleUpload}>Upload</button>
    </div>
  );
};

export default PhotoUpload;
