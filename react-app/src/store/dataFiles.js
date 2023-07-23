const GET_FILE = "session/GET_FILE"
const ADD_FILE = "session/ADD_FILE"
const UPDATE_FILE = "session/UPDATE_FILE"
const DELETE_FILE = "session/DELETE_FILE"


const getFiles =(files) =>({
    type: GET_FILE,
    files,
})


const addFile =(file) =>({
    type: ADD_FILE,
    file,
})

const updateFile = (file) =>({
    type: UPDATE_FILE,
    file,
})

const deleteFile =(id) =>({
    type: DELETE_FILE,
    id,
    
})

export const fetchFile = () => async (dispatch) => {
    const response = await fetch('/api/files')
    if(response.ok){ 
        const files = await response.json()
        dispatch(getFiles(files))
    }
}

export const postFile = (formData) => async(dispatch) =>{
    const response = await fetch('/api/files',{
        method: "POST",
        // headers: {"Content-Type" : "application/json"},
        body: formData
    })
    if(response.ok){
        const file = await response.json()
        dispatch(addFile(file))
        return null
    }else{
        return response.json()
    }
}

export const editFile =(id,fileData) => async(dispatch) =>{
    const response = await fetch(`/api/files/${id}`,{
        method: 'PUT',
        headers: {"Content-Type" : "application/json"},
        body: JSON.stringify(fileData) 
    })
    if(response.ok){
        const updateF =await response.json()
        dispatch(updateFile(updateF))
    }
}



const initState = {}

export default function fileReducer(state = initState, action){
    let newState = {}
    switch(action.type){
        case GET_FILE:{
            newState = { ...state };
            action.files.forEach((file) => {
              newState[file.id] = file;
            });
            return newState;
           
        }
        case ADD_FILE:{
            newState[action.file.id] = action.file
            return newState
        }
        case UPDATE_FILE:{
            const newState = {...state}
            newState =[action.file.id] = action.file
            return newState
        }
        case DELETE_FILE:{
            const newState = {...state}
            delete newState[action.id]
            return newState
        }
        default:
            return state
    }
}
