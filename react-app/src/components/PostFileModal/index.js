import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { fetchFile, postFile } from '../../store/dataFiles';

import { useModal } from '../../context/Modal';
import './postfile.css'


function PostFileModal() {
  const dispatch = useDispatch()
  const { closeModal } = useModal()

  const [filename, setFileName] = useState('')
  const [filetype, setFileType] = useState('')
  const [filepath, setFilepath] = useState(null);
  const [errors, setErrors] = useState([])

  const handleSubmit = async (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append('file', filepath);
    formData.append('filename', filename)
    formData.append('filetype', filetype)


    console.log(formData, '!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!')
    console.log(Array.from(formData.entries()), '~~~~~~~~~~~~~~~~~~~~~~~');

    const data = await dispatch(postFile(formData))
    await dispatch(fetchFile())
    if (data) {
      setErrors(data)
    } else {
      closeModal()
    }
  }

  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    setFilepath(file);
    setFileName(file.name.split('.').slice(0, -1).join('.')); // Extracts the name without extension
    setFileType(file.type);
  }
  return (
    <div className="modal-content-container"> {/* Outer Container */}
      <h1>Add File</h1>
      <form onSubmit={handleSubmit} className="add-file-form" encType='multipart/form-data'>
        <ul>
          {errors.map((error, idx) => (
            <li key={idx}>{error}</li>
          ))}
        </ul>
        <div className="input-container"> {/* Input Container */}
          {/* <label>
            File Name
            <input
              type="text"
              value={filename}
              onChange={(e) => setFileName(e.target.value)}
              required
              className="add-file-input"
            />
          </label> */}
          <label className="custom-file-upload">
            <input type="file" style={{ display: "none" }} onChange={handleFileUpload} required />
            {filepath ? filepath.name : "No file chosen yet..."}
            <div className="upload-btn">Upload File</div>
          </label>
          {/* <label>
            File Type
            <select
              value={filetype}
              onChange={(e) => setFileType(e.target.value)}
              required
              className="add-file-select"
            >
              <option value="">Select a file type...</option>
              <option value="json">JSON</option>
              <option value="text/csv">CSV</option>

            </select>
          </label> */}
        </div>
        <button type="submit" className="add-file-button">Add File</button>
      </form>
    </div>
  );
}
export default PostFileModal;
