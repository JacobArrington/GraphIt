const GET_VIS = "visualization/GET_VIS"
const ADD_VIS = "visualization/ADD_VIS"
const GET_BY_ID = "visualization/GET_BY_ID"
const UPDATE_VIS = "visualization/UPDATE_VIS";
const DELETE_VIS = "visualization/DELETE_VIS";
const SET_VIS_ERROR = 'visualization/SET_VISUALIZATION_ERROR'



const getVisualizations =(visualizations) =>({
    type: GET_VIS,
    visualizations
})

const addVisualizations =(visualization) =>({
    type: ADD_VIS,
    visualization
})

const getVisualizationId =(visualization) =>({
    type: GET_BY_ID,
    visualization
})

const updateVisualizations =(visualization) =>({
    type: UPDATE_VIS,
    visualization
})

const deleteVisualizations =(id) =>({
    type: DELETE_VIS,
    id
})

export const setVisualizationError = (error) => ({
    type: SET_VIS_ERROR,
    error,
  });

export const fetchVisualization = () => async (dispatch) =>{
    const response = await fetch('/api/visualizations')
    if(response.ok){
        const visualizations = await response.json()
        dispatch(getVisualizations(visualizations))
    }
}

export const postVisualization = (visData) => async (dispatch) =>{
    const response = await fetch('/api/visualizations',{
        method: "POST",
        headers: {"Content-Type" : "application/json"},
        body: JSON.stringify(visData)

    })
    if(response.ok){
        const visualization = await response.json()
        dispatch(addVisualizations(visualization))
        return visualization
    }
}

export const fetchVisualizationById =(id) =>async (dispatch) =>{
    
    const response = await fetch(`/api/visualizations/${id}`)
    if(response.ok){
        const visualizations = await response.json()
        dispatch(getVisualizationId(visualizations))
        return visualizations
    }else if(response.status === 403){
        dispatch(setVisualizationError('You do not have premission to view this graph'))
    }else{
        dispatch(setVisualizationError('an error has a occured while fetching this graph'))
    }
}


export const editVisualization =(id,visData) => async(dispatch) =>{
    const response = await fetch(`/api/visualizations/${id}`,{
        method: 'PUT',
        headers: {"Content-Type" : "application/json"},
        body: JSON.stringify(visData)  
    })
    if(response.ok){
        const updateVis = await response.json()
        dispatch(updateVisualizations(updateVis))
    }
    

}

export const destroyVisualization=(id)=> async(dispatch) =>{
    const response = await fetch(`/api/visualizations/${id}`,{
        method:'DELETE'
    })
    if(response.ok){
       return dispatch(deleteVisualizations(id))
    }
}

const initState ={}

export default function visualizationReducer(state = initState, action){
    let newState = {}
    switch(action.type){
        case GET_VIS:{
            action.visualizations.forEach((visualization)=>{
                newState[visualization.id] = visualization
            })
            return newState
        }
        case ADD_VIS:{
            newState[action.visualization.id] = action.visualization
            return newState
        }
        case GET_BY_ID:{
            newState= {[action.visualization.id]: action.visualization }
            return newState 
        }
        case UPDATE_VIS:{
            const newState = {...state};
            newState[action.visualization.id] = action.visualization
            return newState;
            
        }
        case DELETE_VIS:{
            const newState = {...state}
            delete newState[action.id]
            return newState
        }
        case SET_VIS_ERROR:{
            
            newState.error = action.error
            return newState
        }
        default:
            return state
        
    }
}
