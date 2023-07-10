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
    const currentUser = useSelector((state) => state.session.user);
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
      <div className='title'>
        <h2>{currentUser.username}'s Libary</h2>
      </div>
      <div className='file-fav'>
        <div className='file-container'>

            <div className='file-header-container'>
                <h4 className='file-header'>SELECT A FILE</h4>
            </div>
           
            <div className='file-list'>
                {Object.values(allFiles).map((file, index) => (
                    <div key={index} className='file-item' onClick={() => handleFileClick(file.id)}>
                        <div className='file-icon'>
                            <span className='file-name'>{file.filename}</span>
                        </div>
                    </div>
                ))}
            </div>

            <div className='opn-btn-container'>
                <OpenModalButton
                    buttonText={
                        <div className="button-content">
                            <img src="https://storage.cloud.google.com/graphit_bucket/file_1092216.png" alt="Graph Icon" style={{width: "20px", height: "20px"}} />
                            <span className="open-btn-text">upload</span>
                        </div>
                    }
                    className='open-btn upload'
                    modalComponent={
                        <PostFileModal />
                    }
                />

                {selectedFileId &&
                    <OpenModalButton
                        buttonText={
                            <div className="button-content">
                                <img src="https://storage.cloud.google.com/graphit_bucket/market-fluctuation_3121599.png" alt="Graph Icon" style={{width: "20px", height: "20px"}} />
                                <span className="graph-text">graph it!</span>
                            </div>
                        }
                        className='open-btn graph-btn'
                        modalComponent={
                            <PostVisualizationModal selectedFileId={selectedFileId} selectedFileData={selectedFileData} />
                        }
                    />
                }
            </div>
        </div>
        <Favorites />
      </div>
      </>
    )
}

export default DataFiles
