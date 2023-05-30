import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { editComment, fetchComments } from '../../store/comments';
import { useModal } from '../../context/Modal';
import { useEffect } from 'react';

const EditCommentModal = ({ comment }) => {
    const dispatch = useDispatch();
    const [content, setContent] = useState(comment.content);
    const { closeModal } = useModal();
    const [isCommentUpdated, setCommentUpdated] = useState(false)

    // useEffect(()=>{
    //     if(isCommentUpdated){
    //         dispatch(fetchComments(comment.visualization_id))
    //         setCommentUpdated(false)
    //     }
    //},[isCommentUpdated, dispatch, comment.visualization_id])

    const handleCommentUpdate = async (e) => {
        e.preventDefault();
        const updatedComment = {
            ...comment,
            content
        };

        let result = await dispatch(editComment(updatedComment, comment.id));
        if (result) {
            console.log("Comment updated, closing modal...")
            closeModal()
            dispatch(fetchComments(comment.visualization_id));
            //setCommentUpdated(true);
        }
    }

    return (
        <div>
            <h2>Edit Comment</h2>
            <form onSubmit={handleCommentUpdate}>
                <label htmlFor='content'>Comment</label>
                <textarea
                    id='content'
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                    required
                />
                <button type='submit'>Update Comment</button>
            </form>
        </div>
    )
}

export default EditCommentModal;
