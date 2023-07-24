import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { editFile } from '../../store/dataFiles';
import {useModal} from '../../context/Modal';
import './updatefile.css'

function UpdateFileModal({file}){
    const dispatch = useDispatch();
    const { closeModal } = useModal();
    const [isPublic, setIsPublic] = useState(file.is_public)
    const [errors, setErrors] = useState([]);

    useEffect(() => {
      setIsPublic(file.is_public);
  }, [file]);


    const handleSubmit = async (e) => {
        e.preventDefault();
    
        const data = await dispatch(editFile(file.id, { isPublic }));
        if (data) {
          setErrors(data);
        } else {
          closeModal();
        }
      }
    
      return (
        <div className="modal-content-container">
          <h1>Update File</h1>
          <form onSubmit={handleSubmit} className="update-file-form">
            <ul>
              {errors.map((error, idx) => (
                <li key={idx}>{error}</li>
              ))}
            </ul>
            <div className="input-container">
              <label>
                Public File
                <input
                  type="checkbox"
                  checked={isPublic}
                  onChange={(e) => setIsPublic(e.target.checked)}
                  className="public-file-checkbox"
                />
              </label>
            </div>
            <button type="submit" className="update-file-button">Update File</button>
          </form>
        </div>
      );
    }
    export default UpdateFileModal;
