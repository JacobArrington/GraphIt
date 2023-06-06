import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchFavorites, deleteFavorite } from '../../store/favorites'; 
import { Link } from 'react-router-dom';

const Favorites = () => {
    const dispatch = useDispatch();
    const currentUser = useSelector((state) => state.session?.user);
    const favorites = useSelector((state) => state.favoritesReducer);

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
        <div>
            <h2>Your Favorite Visualizations</h2>
            {Object.values(favorites).map((favorite) =>(
                <div key={favorite.id}>
                <Link to={`/visualizations/${favorite.visualization_id}`}>
                    Visualization {favorite.visualization_id}
                </Link>
                <button onClick={() => handleDeleteFavorite(favorite.id)}>
                    Remove from Favorites
                </button>
            </div>
                
            ))}
                
            
        </div>
    );
};

export default Favorites;
