import React, {useEffect, useState} from 'react';
import { useDispatch } from 'react-redux';
import { fetchComments, postComment } from '../../store/comments';
import {useModal} from '../../context/Modal';
import { fetchVisualizationById } from '../../store/visualization';

const PostCommentModal =({visualizationId}) =>{
    const dispatch = useDispatch();
    const [content, setContent] = useState("");
    const {closeModal} =useModal()
    const [isCommentPosted, setCommentPosted] = useState(false)

    useEffect(()=>{
        if(isCommentPosted){
            dispatch(fetchComments(visualizationId))
            setCommentPosted(false)
        }
    })

    const handleCommentSubmit =async (e) =>{
        e.preventDefault()
        const comment ={
            content,
            visualizationId
        }
       let newComment = await dispatch(postComment(comment,visualizationId));
        if(newComment){
            
           setCommentPosted(true)
            closeModal()
        }
    }
    return(
        <div>
            <h2>Post a Comment</h2>
            <form onSubmit={handleCommentSubmit}>
                <label htmlFor='content'>Comment</label>
                <textarea 
                id='content'
                value={content}
                onChange={(e) => setContent(e.target.value)}
                required
                
                />
                <button type='submit'>Submit Comment</button>
            </form>
        </div>
    )
}

export default PostCommentModal;
