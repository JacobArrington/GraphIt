import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { fetchFavorites, deleteFavorite } from '../../store/favorites'; 
import { Link } from 'react-router-dom';
import './fav.css'

function Favorites() {
    const dispatch = useDispatch();
    const currentUser = useSelector((state) => state.session?.user);
    const favorites = useSelector((state) => state.favoritesReducer);
    const visualizations = useSelector((state) => state.visualizationReducer);

    useEffect(() => {
        dispatch(fetchFavorites());
    }, [dispatch]);

    const handleDeleteFavorite = async (id) => {
        const confirm = window.confirm('Are you sure you want to delete this favorite? This action cannot be undone.');
        if (confirm) {
            await dispatch(deleteFavorite(id));
        }
    };

    return (
        <>
            
            <div className='favorites-container'>
                <h4 className='favorites-header'>YOUR FAVORITES</h4>
                <div className='favorites-list'>
                    {Object.values(favorites).map((favorite) => {
                        const visualization = Object.values(visualizations).find(vis => vis.id === favorite.visualization_id);
                        return (
                            <div key={favorite.id} className='favorite-item'>
                                <Link to={`/graph/${favorite.visualization_id}`} className='favorite-link'>
                                    {visualization?.title} 
                                </Link>
                                <button onClick={() => handleDeleteFavorite(favorite.id)} className='favorite-button'>
                                <img src="https://storage.cloud.google.com/graphit_bucket/icons/heart_7494155.ico" alt="Graph Icon" style={{width: "30px", height: "30px"}} />
                                </button>
                            </div>
                        );
                    })}
                </div>
            </div>
        </>
    );
};

export default Favorites;
