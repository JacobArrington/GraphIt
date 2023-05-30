import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useHistory, useParams } from 'react-router-dom';
import { destroyVisualization, fetchVisualizationById } from '../../store/visualization';
import LineGraph from '../Graphs/LineGraph';
import AreaGraph from '../Graphs/AreaGraph';
import RadarGraph from '../Graphs/RadarGraph';
import BarGraph from '../Graphs/BarGraph';
import OpenModalButton from "../OpenModalButton";
import UpdateVisualizationModal from '../UpdateVisualizationModal';


const VisualizationDetail = () => {
    const { id } = useParams();
    const dispatch = useDispatch()
    const history = useHistory()
    const visId = Number(id)

    
    const allVis = useSelector((state) => state.visualizationReducer);
    const visualization = useSelector((state) => state.visualizationReducer[visId])

   

    useEffect(() => {
        if(!visualization && allVis[visId]){
            console.log("fetching visualization with id:", visId);
            dispatch(fetchVisualizationById(visId))
        }
    }, [dispatch, visId, visualization])

    const handleDelete = async () =>{
        const confrim = window.confirm('Are you sure you want to delete this this action cant be undone')
        if(confrim){
            await dispatch(destroyVisualization(visualization.id))
            history.push('/graph')
        }
    }


    const getGraphComponent = (visualization) => {
        const { visualization_type, data_file_id, color, width, height, chart_data } = visualization;
        switch (visualization_type) {
            case 'bar':
                return <BarGraph file={data_file_id} color={color} width={width} height={height} selectedFileData={chart_data} />;
            case 'line':
                return <LineGraph file={data_file_id} color={color} width={width} height={height} selectedFileData={chart_data} />;
            case 'area':
                return <AreaGraph file={data_file_id} color={color} width={width} height={height} selectedFileData={chart_data} />;
            // case 'circle':
            //   return <PieGraph file={data_file_id} color={color} width={width} height={height} selectedFileData={chart_data} />;
            case 'radar':
                return <RadarGraph file={data_file_id} color={color} width={width} height={height} selectedFileData={chart_data} />;
            default:
                return null;
        }
    };

    if (!visualization) {
        return <p>Loading Graph</p>
    }

    return (
        <div>
            <h2>{visualization.title}</h2>
            {getGraphComponent(visualization)}
            <p>{visualization.description}</p>
            <OpenModalButton
        buttonText="Update Visualization"
        modalComponent={
          <UpdateVisualizationModal visualization={visualization} />
        }
      />
      <button onClick={handleDelete}>Delete</button>
        </div>
    )
}

export default VisualizationDetail
