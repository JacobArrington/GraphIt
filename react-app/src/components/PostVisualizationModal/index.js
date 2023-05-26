import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { postVisualization } from '../../store/visulazation';
import { useHistory } from 'react-router-dom';
import LineGraph from '../Graphs/LineGraph';
import AreaGraph from '../Graphs/AreaGraph';
import PieGraph from '../Graphs/CircleGraph';
import RadarGraph from '../Graphs/RadarGraph';
import BarGraph from '../Graphs/BarGraph.js';
import { useModal } from '../../context/Modal';

const PostVisualizationModal = ({ selectedFileId }) => {
  const dispatch = useDispatch();
  const history = useHistory()
  const { closeModal } = useModal()
  const [chartType, setChartType] = useState('');
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [chartWidth, setChartWidth] = useState(500);
  const [chartHeight, setChartHeight] = useState(500);

  const [size, setSize] = useState({ width: '100', height: 400 });
  const [views, setViews] = useState(0);
  const [visibility, setVisibility] = useState(true);
  const [color, setColor] = useState('#000000');


  const handleSubmit = async (e) => {
    e.preventDefault();
    const visualizationData = {
      title,
      description,
      visualization_type: chartType,
      data_file_id: selectedFileId,
      views,
      visibility,
      color,
      size,
    };
    let newVis = await dispatch(postVisualization(visualizationData));
    if (newVis) {
      history.push(`/visualizations/`)
      closeModal()
    }
  };


  const graph = (chartType) => {
    switch (chartType) {
      case 'bar':
        return <BarGraph file={selectedFileId} color={color} width={chartWidth} height={chartHeight} />
      case 'line':
        return <LineGraph file={selectedFileId} color={color} width={chartWidth} height={chartHeight} />
      case 'area':
        return <AreaGraph file={selectedFileId} color={color} width={chartWidth} height={chartHeight} />
      case 'circle':
        return <PieGraph file={selectedFileId} color={color} width={chartWidth} height={chartHeight} />
      case 'radar':
        return <RadarGraph file={selectedFileId} color={color} width={chartWidth} height={chartHeight} />

    }
  }
console.log(selectedFileId,'@@@@@@@@@@@')


  return (
    <form onSubmit={handleSubmit}>
      <label>
        Title:
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
      </label>

      <label>
        Description:
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />
      </label>
      <div>
        <button onClick={() => setChartType('bar')}>Bar</button>
        <button onClick={() => setChartType('line')}>Line</button>
        <button onClick={() => setChartType('area')}>Area</button>
        <button onClick={() => setChartType('circle')}>Circle</button>
        <button onClick={() => setChartType('radar')}>Radar</button>

      </div>


      <label>
        Views:
        <input
          type="number"
          value={views}
          onChange={(e) => setViews(e.target.value)}
        />
      </label>

      <label>
        Visibility:
        <input
          type="checkbox"
          checked={visibility}
          onChange={(e) => setVisibility(e.target.checked)}
        />
      </label>

      <label>
        Color:
        <input
          type="color"
          value={color}
          onChange={(e) => setColor(e.target.value)}
        />
      </label>

      <label>Width (%)</label>
      <input 
        type="number" 
        value={size.width} 
        onChange={(e) => setSize({...size, width: e.target.value + '%'})} 
      />

      <label>Height (px)</label>
      <input 
        type="number" 
        value={size.height} 
        onChange={(e) => setSize({...size, height: e.target.value})} 
      />

      <div className="chart-container">
        {graph(chartType)}
      </div>

      <button type="submit">Submit</button>
    </form>
  );
};

export default PostVisualizationModal;
