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
import { createFavorite } from '../../store/favorites';
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
    const [graphSize, setGraphSize] = useState({ width: 0, height: 0 });
    const [favoriteAdded, setFavoriteAdded] = useState(false);

    useEffect(() => {
        if (visualization) {
            setGraphSize({ width: visualization.width, height: visualization.height });
        }
    }, [visualization]);



    useEffect(() => {
        console.log('fetching visualization...');
        dispatch(fetchVisualizationById(visId))
            .catch((error) => {
                dispatch(setVisualizationError(error.toString()))
            })
        dispatch(fetchComments(visId))



    }, [dispatch, visId,])

    const addToFavs = async () => {
        await dispatch(createFavorite(visualization.id))
        history.push('/library');

    }



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
    console.log('visualization: ', visualization);

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
                                    <img src="https://storage.googleapis.com/graphit_bucket/icons/edit_3102301.ico" alt="edit Icon" style={{ width: "40px", height: "40px" }} />

                                </div>
                            }
                            modalComponent={
                                <UpdateVisualizationModal visualization={visualization} />
                            }
                            className='vis-update'
                        />
                        <button className='vis-delete' onClick={handleDelete}>
                            <img src="https://storage.googleapis.com/graphit_bucket/icons/bin_484662.ico" alt="delete Icon" style={{ width: "40px", height: "40px" }} />
                        </button>
                    </div>
                )}
                {currentUser && currentUser.id !== visualization.user_id && (
                    <button className='add-fav' onClick={addToFavs}>
                        <img src="https://storage.googleapis.com/graphit_bucket/icons/love_4929791.ico" alt="favorite Icon" style={{ width: "40px", height: "40px" }} />
                    </button>
                    
                )}
                <p className='description'>{visualization.description}</p>
                <div className="comment-views-buttons">
                    

                    <OpenModalButton
                        buttonText={
                            <div className="button-content">
                                <img src="https://storage.googleapis.com/graphit_bucket/icons/comment_1380338.ico" alt="Comment Icon" style={{ width: "40px", height: "40px" }} />

                            </div>

                        }
                        modalComponent={
                            <PostCommentModal visualizationId={visualization.id} />
                        }
                        className='d-open-btn'
                    />
                    <button className='views'>
                    <div lassName="button-content">
                <img src="https://storage.googleapis.com/graphit_bucket/icons/monitoring_6103108.ico" alt="view Icon" style={{width: "40px", height: "35px"}} />
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
                                    <i class="fa-solid fa-pen"></i>
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
