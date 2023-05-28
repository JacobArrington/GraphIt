const GET_VIS = "visualization/GET_VIS"
const ADD_VIS = "visualization/ADD_VIS"


const getVisualizations =(visualizations) =>({
    type: GET_VIS,
    visualizations
})

const addVisualizations =(visualization) =>({
    type: ADD_VIS,
    visualization
})

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
        default:
            return state
        
    }
}
