import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchFavorites, deleteFavorite } from '../../store/favorites'; 
import { Link } from 'react-router-dom';
import './fav.css'

const Favorites = () => {
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
        <div className='favorites-container'>
            <h2 className='favorites-header'>Your Favorite Visualizations</h2>
            <div className='favorites-list'>
                {Object.values(favorites).map((favorite) => {
                    const visualization = Object.values(visualizations).find(vis => vis.id === favorite.visualization_id);
                    return (
                        <div key={favorite.id} className='favorite-item'>
                            <Link to={`/visualizations/${favorite.visualization_id}`} className='favorite-link'>
                                {visualization?.title} - {visualization?.visualization_type}
                            </Link>
                            <button onClick={() => handleDeleteFavorite(favorite.id)} className='favorite-button'>
                                Remove from Favorites
                            </button>
                        </div>
                    );
                })}
            </div>
        </div>
    );
};

export default Favorites;
