import React, { useState, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { fetchVisualization, postVisualization } from '../../store/visualization';
import { useHistory } from 'react-router-dom';
import LineGraph from '../Graphs/LineGraph';
import AreaGraph from '../Graphs/AreaGraph';
// import PieGraph from '../Graphs/CircleGraph';
import RadarGraph from '../Graphs/RadarGraph';
import BarGraph from '../Graphs/BarGraph.js';
import { useModal } from '../../context/Modal';

const PostVisualizationModal = ({ selectedFileId, selectedFileData }) => {
  const dispatch = useDispatch();
  const history = useHistory()
  const { closeModal } = useModal()
  const [chartType, setChartType] = useState('');
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [width, setWidth] = useState(100);
  const [height, setHeight] = useState(500);
  const [views, setViews] = useState(0);
  const [visibility, setVisibility] = useState('public');
  const [color, setColor] = useState('#000000');
  const [chartData, setChartData] = useState([]);


  useEffect(() => {
    setChartData(selectedFileData)
  }, [selectedFileData])



  const previewData = chartData.slice(0, 5);


  const handleSubmit = async (e) => {
    e.preventDefault();
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
      history.push(`/graph`)
      await dispatch(fetchVisualization())
      closeModal()
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

        <button onClick={() => setChartType('radar')}>Radar</button>

      </div>


      {/* <label>
        Views:
        <input
          type="number"
          value={views}
          onChange={(e) => setViews(e.target.value)}
        />
      </label> */}

      <label>
        Visibility:
        <select
          
          checked={visibility}
          onChange={(e) => setVisibility(e.target.checked)}
        >
          <option value="private">Private</option>
          <option value="public">Public</option>
        </select>
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
        value={width}
        onChange={(e) => setWidth(e.target.value)}
      />

      <label>Height (px)</label>
      <input
        type="number"
        value={height}
        onChange={(e) => setHeight(e.target.value)}
      />
      <div>
        {graph(chartType)}
      </div>


      <button type="submit">Submit</button>
    </form>
  );
};

export default PostVisualizationModal;
