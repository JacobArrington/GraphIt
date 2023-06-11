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
    console.log(selectedFileData);
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
    console.log(newVis)
    if (newVis) {
      history.push(`/library`)
      closeModal()
      await dispatch(fetchVisualization())
    }
  };

  console.log(chartType)

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
  console.log(selectedFileId, '@@@@@@@@@@@')


  return (
    <form onSubmit={handleSubmit} className="form-container">
      <div className="form-group">
        <label>
          Title:
          <input
            type="text"
            value={title}
            className="form-input"
            onChange={(e) => setTitle(e.target.value)}
            required
          />
        </label>
      </div>
  
      <div className="form-group">
        <label>
          Description:
          <textarea
            value={description}
            className="form-input"
            onChange={(e) => setDescription(e.target.value)}
            required
          />
        </label>
      </div>
  
      <div className="chart-type-group">
        <button className="chart-type-button"type="button" onClick={() => setChartType('bar')}>Bar</button>
        <button className="chart-type-button" type="button" onClick={() => setChartType('line')}>Line</button>
        <button className="chart-type-button" type="button" onClick={() => setChartType('area')}>Area</button>
        <button className="chart-type-button" type="button" onClick={() => setChartType('radar')}>Radar</button>
        {errorMessage && <p className="error-message">{errorMessage}</p>}
      </div>
  
      <div className="form-group">
        <label>
          Visibility:
          <select
            checked={visibility}
            className="form-input"
            onChange={(e) => setVisibility(e.target.value)}
            required
          >
            <option value="private">Private</option>
            <option value="public">Public</option>
          </select>
        </label>
      </div>
  
      <div className="form-group">
        <label>
          Color:
          <input
            type="color"
            value={color}
            className="form-input"
            onChange={(e) => setColor(e.target.value)}
            required
          />
        </label>
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
