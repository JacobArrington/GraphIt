const SET_FAVORITES = 'favorites/SET_FAVORITES';
const ADD_FAVORITE = 'favorites/ADD_FAVORITE';
const REMOVE_FAVORITE = 'favorites/REMOVE_FAVORITE'


export const setFavorites = (favorites) =>({
    type: SET_FAVORITES,
    favorites,
})

export const addFavorite =(favorite) =>({
    type: ADD_FAVORITE,
    favorite
})

export const removeFavorite =(id) =>({
    type: REMOVE_FAVORITE,
    id,
})


export const fetchFavorites = () => async(dispatch) =>{
    const response = await fetch('/api/favorites');
    if(response.ok){
        const favorites = await response.json();
        dispatch(setFavorites(favorites))
    }
}
export const createFavorite = (vis_id) => async(dispatch) => {
    //console.log(`vis_id in the frontend: ${vis_id}`)
    const response = await fetch(`/api/favorites/${vis_id}`,{
        method: "POST",
        headers:{
            "Content-Type": "application/json",
        },
    })
    if(response.ok){
        const newFav = await response.json();
        dispatch(addFavorite(newFav));
    } else if (response.status === 400){
        const data = await response.json();
        alert(data.error)
    }
    
}
export const deleteFavorite = (id) => async (dispatch) => {
    const response = await fetch(`/api/favorites/${id}`, {
        method: 'DELETE',
    });
    if (response.ok) {
        await response.json()
        dispatch(removeFavorite(id));
    }
};


const initState = {}

export default function favoritesReducer(state =initState, action){
    let newState = {}
    switch (action.type){
        case SET_FAVORITES:{
            action.favorites.forEach((fav)=>{
                newState[fav.id] = fav
            })
            return newState
        }
        case ADD_FAVORITE:{
            newState ={...state}
            newState[action.favorite.id] = action.favorite
            return newState
         }
         case REMOVE_FAVORITE:{
            const newState = {...state}
            delete newState[action.id]
            return newState
         }
         default:
            return state
    }
}
