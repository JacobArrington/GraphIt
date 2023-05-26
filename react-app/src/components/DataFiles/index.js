import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { fetchFile } from '../../store/dataFiles';
import OpenModalButton from "../OpenModalButton";
import PostFileModal from '../PostFileModal';

function DataFiles(){
    const dispatch = useDispatch()
    const allFiles = useSelector((state) => state.fileReducer)
    const [selectedFileId, setSelectedFileId] = useState(null)

    

    useEffect(() =>{
        dispatch(fetchFile());
    },[dispatch])

    const handleFileClick = (fileId) => {
        setSelectedFileId(fileId);
      }
return(
    <>
    <div className='file-container'>
        <h2 className='file-header'>Your Files</h2>
        <div className='file-list'>
            {Object.values(allFiles).map((file,index)=>(
                <div key={index} className='file-list' onClick={() => handleFileClick(file.id)}>
                    <h4 className='title'>{file.filename}</h4>
                    <p className='details'>{file.file_type}</p>
                </div>
            ))}
        </div>
    </div>
    <OpenModalButton 
        buttonText="Add a file"
        modalComponent={
            <PostFileModal />
        }
    />
    </>
)

}
export default DataFiles
