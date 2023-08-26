import React, { useState, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { fetchVisualization, postVisualization } from '../../store/visualization';
import { useHistory } from 'react-router-dom';
import LineGraph from '../Graphs/LineGraph';
import AreaGraph from '../Graphs/AreaGraph';
// import PieGraph from '../Graphs/CircleGraph';
import RadarGraph from '../Graphs/RadarGraph';
import BarGraph from '../Graphs/BarGraph.js';
import './post.css'
import { useModal } from '../../context/Modal';

const PostVisualizationModal = ({ selectedFileId, selectedFileData }) => {
  const dispatch = useDispatch();
  const history = useHistory()
  const { closeModal } = useModal()
  const [chartType, setChartType] = useState(null);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [width, setWidth] = useState(100);
  const [height, setHeight] = useState(500);
  const [views, setViews] = useState(0);
  const [visibility, setVisibility] = useState('public');
  const [color, setColor] = useState('#000000');
  const [chartData, setChartData] = useState([]);
  const [errorMessage, setErrorMessage] = useState('');
  


  useEffect(() => {
    setChartData(selectedFileData)
    
  }, [selectedFileData])



  const previewData = chartData.slice(0, 5);


  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!chartType) {
      setErrorMessage('Please select a chart type.');
      return;
    }
    const visualizationData = {
      title,
      description,
      visualization_type: chartType,
      data_file_id: selectedFileId,
     // views,
      visibility,
      color,
      width,
      height,
    };
  
    let newVis = await dispatch(postVisualization(visualizationData));
  
    if (newVis) {
      history.push(`/library`)
      closeModal()
      await dispatch(fetchVisualization())
    }
  };



  const graph = (chartType) => {
    switch (chartType) {
      case 'bar':
        return <BarGraph file={selectedFileId} color={color} width={width} height={height} selectedFileData={selectedFileData} />
      case 'line':
        return <LineGraph file={selectedFileId} color={color} width={width} height={height} selectedFileData={selectedFileData} />
      case 'area':
        return <AreaGraph file={selectedFileId} color={color} width={width} height={height} selectedFileData={selectedFileData} />
      // case 'circle':
      //   return <PieGraph file={selectedFileId} color={color} width={width} height={height} selectedFileData={selectedFileData}/>
      case 'radar':
        return <RadarGraph file={selectedFileId} color={color} width={width} height={height} selectedFileData={selectedFileData} />
      default:
        return null;
    }
  }
 


  return (
    <form onSubmit={handleSubmit} className="form-container">
      <div><h2>Graph it!</h2></div>
      <div className="form-group">
        <label>
          Title:
          </label>
          <input
            type="text"
            value={title}
            className="form-input"
            onChange={(e) => setTitle(e.target.value)}
            required
          />
        
      </div>
  
      <div className="form-group">
        <label>
          Description:
          </label>
          <textarea
            value={description}
            className="form-input"
            onChange={(e) => setDescription(e.target.value)}
            required
          />
       
      </div>
  
      <div className="chart-type-group">
      <button className={`chart-type-button ${chartType === 'bar' ? 'selected-graph' : ''}`} type="button" onClick={() => setChartType('bar')}>
  <div className="chart-type-content">
    <img src="https://res.cloudinary.com/dfnqaxcck/image/upload/v1693074707/graphit%20icons%20and%20pngs/bar-chart_900772_ikw9u5.png" alt="bar graph" style={{width: "40 px", height: "35px"}} />
    <span>Bar</span>
  </div>
</button>

<button className={`chart-type-button ${chartType === 'line' ? 'selected-graph' : ''}`} type="button" onClick={() => setChartType('line')}>
  <div className="chart-type-content">
    <img src="https://res.cloudinary.com/dfnqaxcck/image/upload/v1693074708/graphit%20icons%20and%20pngs/line_lajw3s.ico" alt="line graph" style={{width: "40px", height: "35px"}} />
    <span>Line</span>
  </div>
</button>

<button className={`chart-type-button ${chartType === 'area' ? 'selected-graph' : ''}`} type="button" onClick={() => setChartType('area')}>
  <div className="chart-type-content">
    <img src="https://res.cloudinary.com/dfnqaxcck/image/upload/v1693074707/graphit%20icons%20and%20pngs/areagraph_egieso.ico" alt="area graph" style={{width: "40px", height: "35px"}} />
    <span>Area</span>
  </div>
</button>

<button className={`chart-type-button ${chartType === 'radar' ? 'selected-graph' : ''}`} type="button" onClick={() => setChartType('radar')}>
  <div className="chart-type-content">
    <img src="https://res.cloudinary.com/dfnqaxcck/image/upload/v1693074709/graphit%20icons%20and%20pngs/radar-chart_olbvx7.png" alt="radar graph" style={{width: "40px", height: "35px"}} />
    <span>Radar</span>
  </div>
</button>
        {errorMessage && <p className="error-message">{errorMessage}</p>}
      </div>
  
      <div className="form-group">
        <label>
          Visibility:
          </label>
          <select
            checked={visibility}
            className="form-input"
            onChange={(e) => setVisibility(e.target.value)}
            required
          >
            <option value="private">Private</option>
            <option value="public">Public</option>
          </select>
        
      </div>
  
      <div className="form-group">
        <label>
          Color:
          </label>
          <input
            type="color"
            value={color}
            className="form-input"
            onChange={(e) => setColor(e.target.value)}
            required
          />
        
      </div>
  
      <div className="form-group">
        <label>Width (%)</label>
        <input
          type="number"
          value={width}
          className="form-input"
          onChange={(e) => setWidth(e.target.value)}
          required
        />
      </div>
  
      <div className="form-group">
        <label>Height (px)</label>
        <input
          type="number"
          value={height}
          className="form-input"
          onChange={(e) => setHeight(e.target.value)}
          required
        />
      </div>
  
   
  
      <div className="form-group">
        <button type="submit" className="form-submit">Submit</button>
      </div>
    </form>
  )}

export default PostVisualizationModal;
