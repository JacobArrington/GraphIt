import React, { useState, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { useHistory } from 'react-router-dom';
import { editVisualization, fetchVisualization } from '../../store/visualization';
import { useModal } from '../../context/Modal';
import './update.css'

const UpdateVisualizationModal = ({ visualization }) => {
  const dispatch = useDispatch();
  const history = useHistory();
  const { closeModal } = useModal();
  const [title, setTitle] = useState(visualization.title);
  const [description, setDescription] = useState(visualization.description);
  const [width, setWidth] = useState(visualization.width);
  const [height, setHeight] = useState(visualization.height);
  const [color, setColor] = useState(visualization.color);
  const [visibility, setVisibility] = useState(visualization.visibility);
  const handleSubmit = async (e) => {
    e.preventDefault();
    const updatedVisualizationData = {
      title,
      description,
      visualization_type: visualization.visualization_type,
      data_file_id: visualization.data_file_id,
      views: visualization.views,
      visibility,
      color,
      width,
      height,
    };
    await dispatch(editVisualization(visualization.id, updatedVisualizationData));
    history.push(`/graph/${visualization.id}`);
    await dispatch(fetchVisualization());
    closeModal();
  };
  return (
    <form onSubmit={handleSubmit} className="form-container">
       <div><h2>Update Graph</h2></div>
      <div className="form-input">
        <label>Title:</label>
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
        />
      </div>

      <div className="form-input">
        <label>Description:</label>
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          required
        />
      </div>
      
      <div className="form-input">
        <label>Visibility:</label>
        <select
          value={visibility}
          onChange={(e) => setVisibility(e.target.value)}
          required
        >
          <option value="private">Private</option>
          <option value="public">Public</option>
        </select>
      </div>

      <div className="form-input">
        <label>Color:</label>
        <input
          type="color"
          value={color}
          onChange={(e) => setColor(e.target.value)}
          required
        />
      </div>

      <div className="form-input">
        <label>Width (%)</label>
        <input
          type="number"
          value={width}
          onChange={(e) => setWidth(e.target.value)}
          required
        />
      </div>

      <div className="form-input">
        <label>Height (px)</label>
        <input
          type="number"
          value={height}
          onChange={(e) => setHeight(e.target.value)}
          required
        />
      </div>

      <button className="form-submit" type="submit">Update Visualization</button>
    </form>
  );
};



export default UpdateVisualizationModal;
