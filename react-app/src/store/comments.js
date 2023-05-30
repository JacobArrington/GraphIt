const GET_COMMENTS = "comments/GET_COMMENTS"
const ADD_COMMENT = "comments/ADD_COMMENT"
const UPDATE_COMMENT = "comments/UPDATE_COMMENT"
const DELETE_COMMENT = "comments/DELETE_COMMENT"

const getComments =(comments) =>({
    type: GET_COMMENTS,
    comments
})

const addComment =(comment) =>({
    type: ADD_COMMENT,
    comment
})

const updateComment =(comment) =>({
    type:UPDATE_COMMENT,
    comment
})

const deleteComment =(id) => ({
    type: DELETE_COMMENT,
    id
})

export const fetchComments =(vis_id) => async(dispatch) =>{
    const response = await fetch(`/api/comments/${vis_id}`)

    if(response.ok){
        const comments = await response.json()
        console.log(comments)
        dispatch(getComments(comments.comments))
    }
}

export const postComment =(comment,vis_id) => async (dispatch) =>{
    const response = await fetch(`/api/comments/${vis_id}`,{
      method: "POST",
      headers:{
        "Content-Type": "application/json",
      },
      body: JSON.stringify(comment) 
    })
    if(response.ok){
        const newComment = await response.json();
        dispatch(addComment(newComment))
        return newComment
    }
}

export const editComment = (comment, id) => async (dispatch) =>{
    const response = await fetch(`/api/comments/${id}`,{
        method: "PUT",
        headers:{
            "Content-Type": "application/json",
        },
        body: JSON.stringify(comment)
    })
    if(response.ok){
        const updComment = await response.json()
        dispatch(updateComment(updComment))
        return updComment
    }
}

export const destroyComment=(id) => async(dispatch) =>{
    const response = await fetch(`/api/comments/${id}`,{
        method: "DELETE"
    })
    if(response.ok){
        return dispatch(deleteComment(id))
    }
}

const initState ={}

export default function commentReducer(state = initState, action){
    let newState ={}
    switch(action.type){
        case GET_COMMENTS:{
            action.comments.forEach((comment) =>{
                newState[comment.id] = comment
            })
            return newState
        }
        case ADD_COMMENT:{
            newState[action.comment.id] = action.comment
            return newState
        }
        case UPDATE_COMMENT:{
            const newState ={...state};
            newState[action.comment.id] = action.comment
            return newState
        }
        case DELETE_COMMENT:{
            const newState = {...state}
            delete newState[action.id]
            return newState
        }
        default:
            return state
    }
}
