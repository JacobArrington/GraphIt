import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { fetchFile } from '../../store/dataFiles';
import OpenModalButton from "../OpenModalButton";
import PostFileModal from '../PostFileModal';
import { useState } from 'react';
import PostVisualizationModal from '../PostVisualizationModal';
import Favorites from '../Favorites';

import './datafiles.css'
function DataFiles() {
    const dispatch = useDispatch()
    const allFiles = useSelector((state) => state.fileReducer)
    const [selectedFileId, setSelectedFileId] = useState(null)
    const [selectedFileData, setSelectedFileData] = useState([]);



    useEffect(() => {
        dispatch(fetchFile());
    }, [dispatch])

    const handleFileClick = (fileId) => {
        setSelectedFileId(fileId);

        fetch(`/api/files/${fileId}`)
            .then(response => response.json())
            .then(responseData => {
                if (Array.isArray(responseData.data)) {
                    setSelectedFileData(responseData.data);
                };
            })


    }
    return (
        <>
            <div className='file-container'>
                <div className='file-header-container'>
                    <h2 className='file-header'>Your Files</h2>
                </div>

                <div className='file-list'>
        {Object.values(allFiles).map((file, index) => (
          <div key={index} className='file-item' onClick={() => handleFileClick(file.id)}>
            <button className='file-icon '>
            <i className="fa-regular fa-file-lines"></i>
            <span className='file-name'>{file.filename}</span>
            </button>
          </div>




                    ))}
                </div>
            </div>
            <div className='opn-btn-container'>
            <OpenModalButton
        buttonText={
            <>
             <i class="fa-solid fa-file-arrow-up" ></i>
              <span className="open-btn-text">Add</span>
            </>
          }
        className='open-btn'
        modalComponent={
            <PostFileModal />
        }
    />
                
                {selectedFileId &&
                    <OpenModalButton
                        buttonText={
                            <>
                            <i class="fa-solid fa-chart-column"></i>
                            <span className=" graph-text" >graph it!</span>
                            </>
                        }
                        className='open-btn'
                        modalComponent={
                            <PostVisualizationModal selectedFileId={selectedFileId} selectedFileData={selectedFileData} />
                        }
                    />
                }
            </div>

            <Favorites />
        </>
    )

}
export default DataFiles
