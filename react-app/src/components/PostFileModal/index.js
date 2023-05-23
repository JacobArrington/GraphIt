import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { fetchFile, postFile } from '../../store/dataFiles';

import { useModal } from '../../context/Modal';


function PostFileModal() {
  const dispatch = useDispatch()
  const { closeModal } = useModal()

  const [filename, setFileName] = useState('')
  const [filetype, setFileType] = useState('')
  const [filePath, setFilePath] = useState('');
  const [errors, setErrors] = useState([])

  const handleSubmit = async (e) => {
    e.preventDefault();

    const datafile = {
      filename,
      filetype,
      filePath,
    }
    const data = await dispatch(postFile(datafile))
    if (data) {
      setErrors(data)
    } else {
      closeModal()
    }
  }

  const handleFileUpload = (e) => {
    setFilePath(e.target.files[0])
  }
  return (
    <>
      <h1>Add File</h1>
      <form onSubmit={handleSubmit} className="add-file-form">
        <ul>
          {errors.map((error, idx) => (
            <li key={idx}>{error}</li>
          ))}
        </ul>
        <label>
          File Name
          <input
            type="text"
            value={filename}
            onChange={(e) => setFileName(e.target.value)}
            required
            className="add-file-input"
          />
        </label>
        <label>
          File Path
          <input type="file" onChange={handleFileUpload} required />
        </label>
        <label>
          File Type
          <select
            value={filetype}
            onChange={(e) => setFileType(e.target.value)}
            required
            className="add-file-select"
          >
            <option value="">Select a file type...</option>
            <option value="json">JSON</option>
            <option value="csv">CSV</option>
            <option value="xlsx">XLSX</option>
          </select>
        </label>
        <button type="submit" className="add-file-button">Add File</button>
      </form>
    </>
  );
}

export default PostFileModal;
