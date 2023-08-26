import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useHistory, useParams } from 'react-router-dom';
import { destroyVisualization, fetchVisualizationById, setVisualizationError } from '../../store/visualization';
import LineGraph from '../Graphs/LineGraph';
import AreaGraph from '../Graphs/AreaGraph';
import RadarGraph from '../Graphs/RadarGraph';
import BarGraph from '../Graphs/BarGraph';
import OpenModalButton from "../OpenModalButton";
import UpdateVisualizationModal from '../UpdateVisualizationModal';
import PostCommentModal from '../PostCommentModal';
import { destroyComment, fetchComments } from '../../store/comments';
import EditCommentModal from '../EditCommentModal';
import { createFavorite, deleteFavorite, fetchFavorites } from '../../store/favorites';
import './detail.css'

const VisualizationDetail = () => {
    const { id } = useParams();
    const dispatch = useDispatch()
    const history = useHistory()
    const visId = Number(id)


    const currentUser = useSelector((state) => state.session?.user)
    const comments = useSelector((state) => state.commentReducer);
    const visualization = useSelector((state) => state.visualizationReducer[visId])
    const visualizationError = useSelector((state) => state.visualizationReducer.error)
    const favorites = useSelector((state) => state.favoritesReducer)
    const [graphSize, setGraphSize] = useState({ width: 0, height: 0 });
    const [userFavorite, setUserFavorite] = useState({});


    useEffect(() => {
        if (visualization) {
            setGraphSize({ width: visualization.width, height: visualization.height });
        }
    }, [visualization]);



    useEffect(() => {
        
        dispatch(fetchVisualizationById(visId))
            .catch((error) => {
                dispatch(setVisualizationError(error.toString()))
            })
        dispatch(fetchComments(visId))



    }, [dispatch, visId,])


    useEffect(() => {
        if (currentUser) {
            dispatch(fetchFavorites)
        }
    }, [dispatch, currentUser])

    useEffect(() => {
        setUserFavorite(favorites)
    }, [favorites])

    const isFav = (visualizationId) => {
        return Object.values(userFavorite).some(fav => fav.visualization_id === visualizationId);
    }

    const addToFavs = async () => {
        await dispatch(createFavorite(visualization.id))
        

    }
    const removeFromFavs = async () => {
        const favoriteId = Object.values(userFavorite).find(fav => fav.visualization_id === visualization.id).id;
        await dispatch(deleteFavorite(favoriteId));
    };



    const handleDelete = async () => {
        const confrim = window.confirm('Are you sure you want to delete this graph this action cant be undone')
        if (confrim) {
            await dispatch(destroyVisualization(visualization.id))
            history.push('/library')
        }
    }



    const handleCommentDelete = async (id) => {
        const confrim = window.confirm('Are you sure you want to delete this  comment this action cant be undone')
        if (confrim) {
            await dispatch(destroyComment(id))

        }
    }


    const getGraphComponent = (visualization) => {
        const { visualization_type, data_file_id, color, chart_data } = visualization;
        switch (visualization_type) {
            case 'bar':
                return <BarGraph file={data_file_id} color={color} width={graphSize.width} height={graphSize.height} selectedFileData={chart_data} />;
            case 'line':
                return <LineGraph file={data_file_id} color={color} width={graphSize.width} height={graphSize.height} selectedFileData={chart_data} />;
            case 'area':
                return <AreaGraph file={data_file_id} color={color} width={graphSize.width} height={graphSize.height} selectedFileData={chart_data} />;
            // case 'circle':
            //   return <PieGraph file={data_file_id} color={color} width={width} height={height} selectedFileData={chart_data} />;
            case 'radar':
                return <RadarGraph file={data_file_id} color={color} width={graphSize.width} height={graphSize.height} selectedFileData={chart_data} />;
            default:
                return null;
        }
    };
   

    if (visualizationError) {
        return <p>{visualizationError}</p>;
    }

    if (!visualization) {
        return <p>Loading Graph</p>
    }

    if (visualization.visibility === 'private' && currentUser && currentUser.id !== visualization.user_id) {
        return <p>This graph is private.</p>
    }

    return (
        <div className='container'>
            <h2 className='title'>{visualization.title}</h2>
            <div className='graph-container'>
                {getGraphComponent(visualization)}
            </div>
            <div className='controls'>


                {currentUser && currentUser.id === visualization.user_id && (
                    <div className="edit-delete-buttons">
                        <OpenModalButton
                            buttonText={
                                <div className="button-content">
                                    <img src="https://res.cloudinary.com/dfnqaxcck/image/upload/v1693074707/graphit%20icons%20and%20pngs/edit_3102301_nczfsp.ico" alt="edit Icon" style={{ width: "40px", height: "40px" }} />

                                </div>
                            }
                            modalComponent={
                                <UpdateVisualizationModal visualization={visualization} />
                            }
                            className='vis-update'
                        />
                        <button className='vis-delete' onClick={handleDelete}>
                            <img src="https://res.cloudinary.com/dfnqaxcck/image/upload/v1693074708/graphit%20icons%20and%20pngs/bin_484662_poklaj.ico" alt="delete Icon" style={{ width: "40px", height: "40px" }} />
                        </button>
                    </div>
                )}
                {currentUser && currentUser.id !== visualization.user_id && (
                    isFav(visualization.id) ?
                        <button className='remove-fav' onClick={removeFromFavs}>
                            <img src="https://res.cloudinary.com/dfnqaxcck/image/upload/v1693074708/graphit%20icons%20and%20pngs/heart_7494155_nupxhp.png" alt="favorite Icon" style={{ width: "40px", height: "40px" }} />
                        </button>
                        :
                        <button className='add-fav' onClick={addToFavs}>
                            <img src="https://res.cloudinary.com/dfnqaxcck/image/upload/v1693074708/graphit%20icons%20and%20pngs/love_4929791_myco01.ico" alt="favorite Icon" style={{ width: "40px", height: "40px" }} />
                        </button>

                )}
                <p className='description'>{visualization.description}</p>
                <div className="comment-views-buttons">


                    <OpenModalButton
                        buttonText={
                            <div className="button-content">
                                <img src="https://res.cloudinary.com/dfnqaxcck/image/upload/v1693074707/graphit%20icons%20and%20pngs/comment_1380338_znswqh.ico" alt="Comment Icon" style={{ width: "40px", height: "40px" }} />

                            </div>

                        }
                        modalComponent={
                            <PostCommentModal visualizationId={visualization.id} />
                        }
                        className='d-open-btn'
                    />
                    <button className='views'>
                        <div className="button-content">
                            <img src="https://res.cloudinary.com/dfnqaxcck/image/upload/v1693074709/graphit%20icons%20and%20pngs/monitoring_6103108_ukpxpl.ico" alt="view Icon" style={{ width: "40px", height: "35px" }} />
                            {visualization.views}
                        </div>
                    </button>
                </div>
            </div>
            {Object.values(comments).map((comment) => (
                <div key={comment.id} className="comment-card">
                    <div className="comment-content">
                        <h4 className="comment-user"><strong>{comment.username}:</strong></h4>
                        <p className="comment-text">{comment.content}</p>
                    </div>
                    {currentUser && comment.user_id === currentUser.id &&
                        <div className="comment-controls">
                            <OpenModalButton
                                buttonText={
                                    <i className="fa-solid fa-pen"></i>
                                }
                                modalComponent={
                                    <EditCommentModal comment={comment} />
                                }
                                className='d-open-btn'
                            />
                            <button className='d-open-btn' onClick={() => handleCommentDelete(comment.id)}><i class="fa-regular fa-trash-can"></i></button>
                        </div>
                    }
                </div>
            ))}

        </div>
    )
}

export default VisualizationDetail;
