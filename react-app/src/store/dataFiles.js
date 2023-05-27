const GET_FILE = "session/GET_FILE"
const ADD_FILE = "session/ADD_FILE"


const getFiles =(files) =>({
    type: GET_FILE,
    files,
})


const addFile =(file) =>({
    type: ADD_FILE,
    file,
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



const initState = {}

export default function fileReducer(state = initState, action){
    let newState = {}
    switch(action.type){
        case GET_FILE:{
            action.files.forEach((file)=>{
                newState[file.id] = file
            })
            return newState
        }
        case ADD_FILE:{
            newState[action.file.id] = action.file
            return newState
        }
        default:
            return state
    }
}
