import React, { useEffect ,useState} from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useHistory } from 'react-router-dom'
import { fetchVisualization } from '../../store/visualization';
import LineGraph from '../Graphs/LineGraph';
import AreaGraph from '../Graphs/AreaGraph';
// import PieGraph from '../Graphs/CircleGraph';
import RadarGraph from '../Graphs/RadarGraph';
import BarGraph from '../Graphs/BarGraph';
import './allvis.css'

const AllVisualizations = () => {
  const dispatch = useDispatch();
  const history = useHistory()
  const currentUser = useSelector((state) => state.session.user);
  const allVis = useSelector((state) => state.visualizationReducer);
  const [graphSize, setGraphSize] = useState({width: 80, height: 300});

  useEffect(() => {
    dispatch(fetchVisualization());
  }, [dispatch]);

  const handleVisualizationClick = (id) => {
    history.push(`/graph/${id}`)
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

  return (
    <div className='all-visualization-container'>
      <h2 className='all-visualization-header'>All Visualizations</h2>
      <div className='all-visualization-list'>
        {Object.values(allVis)
          .filter(visualization => visualization.visibility === 'public')
          .map((visualization) => (
            <div key={visualization.id} className='all-visualization-list-item' onClick={() => handleVisualizationClick(visualization.id)}>
              <h4 className='title'>{visualization.title}</h4>
              <p className='username'>Created by: {visualization.username || "Unknown"}</p>
              {getGraphComponent(visualization)}
            </div>
          ))}
      </div>
    </div>
  );
};

export default AllVisualizations;

// import React from 'react';
//  import BarGraph from '../Graphs/BarGraph';

// function AllVisualizations() {
//   return (
//     <div>
//       <h1>My Bar Graph</h1>
//       <BarGraph color="#8884d8" width={100} height={500} />
//     </div>
//   );
// }

// export default AllVisualizations;
