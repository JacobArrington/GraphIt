import React, {useEffect, useState} from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchComments, postComment } from '../../store/comments';
import { useModal } from '../../context/Modal';
import './postcom.css'
import { fetchVisualizationById } from '../../store/visualization';

const PostCommentModal =({visualizationId, username}) =>{
    const dispatch = useDispatch();
    const [content, setContent] = useState("");
    const {closeModal} =useModal()
    const [isCommentPosted, setCommentPosted] = useState(false)
    const currentUser = useSelector(state => state.session.user);

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
        <div className="modal-content-container"> {/* Use the same CSS class */}
            <h2>Post a Comment</h2>
            <form onSubmit={handleCommentSubmit} className="comment-form">
                <div className="input-container">
                  <label htmlFor='content'>Comment as {currentUser.username}</label>
                  <textarea 
                    id='content'
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                    required
                    className="comment-input"
                  />
                  <button type='submit' className="comment-button">Submit Comment</button>
                </div>
            </form>
        </div>
    )
}

export default PostCommentModal;
