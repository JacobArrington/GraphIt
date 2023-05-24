import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { postVisualization } from '../../store/visulazation';

const PostVisualization = () => {
  const dispatch = useDispatch();

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [chartType, setChartType] = useState('');
  const [dataFileId, setDataFileId] = useState('');
  const [views, setViews] = useState(0);
  const [visibility, setVisibility] = useState(true);
  const [color, setColor] = useState('#000000');
  const [size, setSize] = useState(500);

  const handleSubmit = (e) => {
    e.preventDefault();
    const visualizationData = {
      title,
      description,
      chart_type: chartType,
      data_file_id: dataFileId,
      views,
      visibility,
      color,
      size,
    };
    dispatch(postVisualization(visualizationData));
  };

  const chartTypes = ['bar', 'line', 'area', 'circle', 'radar'];

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

      <fieldset>
        <legend>Chart Type:</legend>
        {chartTypes.map((type) => (
          <label key={type}>
            <input
              type="radio"
              name="chartType"
              value={type}
              checked={chartType === type}
              onChange={(e) => setChartType(e.target.value)}
            />
            {type.charAt(0).toUpperCase() + type.slice(1)}
          </label>
        ))}
      </fieldset>

      <label>
        Data File ID:
        <input
          type="text"
          value={dataFileId}
          onChange={(e) => setDataFileId(e.target.value)}
        />
      </label>

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

      <label>
        Size:
        <input
          type="number"
          value={size}
          onChange={(e) => setSize(e.target.value)}
        />
      </label>

      <button type="submit">Submit</button>
    </form>
  );
};

export default PostVisualization;
