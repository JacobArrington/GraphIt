import React, { useState, useRef } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { fetchFile, postFile } from '../../store/dataFiles';

import { useModal } from '../../context/Modal';
import './postfile.css'

function PostFileModal() {
  const dispatch = useDispatch()
  const { closeModal } = useModal()
  const fileInputRef = useRef(null);

  const [filename, setFileName] = useState('')
  const [filetype, setFileType] = useState('')
  const [filepath, setFilepath] = useState(null);
  const [isPublic, setIsPublic] = useState(false);
  const [errors, setErrors] = useState([])

  const triggerFileInput = () => {
    fileInputRef.current.click(); 
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append('file', filepath);
    formData.append('filename', filename)
    formData.append('filetype', filetype)

    try {
      const data = await dispatch(postFile(formData));
      await dispatch(fetchFile());
      if (data.error) {
        setErrors([data.error]);
      } else {
        closeModal();
      }
    } catch (err) {
      closeModal()
    }
  }

  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    setFilepath(file);

    let cleanedName = file.name.split('.').slice(0, -1).join('.'); // Extracts the name without extension
    cleanedName = cleanedName.replace(/[\W_]+/g, ' '); // Removes special characters and underscores, replaces with whitespace
    cleanedName = cleanedName.replace(/\s+/g, ''); // Removes whitespace characters
    cleanedName = cleanedName.replace(/(?:^|\s)\S/g, function(a) { return a.toUpperCase(); }); // Capitalizes first letter of every word

    setFileName(cleanedName);
    setFileType(file.type);
  }

  return (
    <div className="modal-content-container"> 
      <h1>Add File</h1>
      <form onSubmit={handleSubmit} className="add-file-form" encType='multipart/form-data'>
        <ul>
          {errors.map((error, idx) => (
            <li key={idx}>{error}</li>
          ))}
        </ul>
        <div className="input-container"> 
          <label className="custom-file-upload">
            <input ref={fileInputRef} type="file" style={{ display: "none" }} onChange={handleFileUpload} required />
          </label>
          {filepath ? filepath.name : "No file chosen yet..."}
          <div className="upload-btn" onClick={triggerFileInput}>Upload File</div>
          <label>
            Public File
          </label>
          <input
            type="checkbox"
            checked={isPublic}
            onChange={(e) => setIsPublic(e.target.checked)}
            className="public-file-checkbox"
          />
        </div>
        <button type="submit" className="add-file-button">Add File</button>
      </form>
    </div>
  );
}

export default PostFileModal;
