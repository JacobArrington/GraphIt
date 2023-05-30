import React, { useState, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { useHistory } from 'react-router-dom';
import { editVisualization, fetchVisualization } from '../../store/visualization';
import { useModal } from '../../context/Modal';

const UpdateVisualizationModal = ({ visualization }) => {
  const dispatch = useDispatch();
  const history = useHistory();
  const { closeModal } = useModal();
  const [title, setTitle] = useState(visualization.title);
  const [description, setDescription] = useState(visualization.description);
  const [width, setWidth] = useState(visualization.width);
  const [height, setHeight] = useState(visualization.height);
  const [color, setColor] = useState(visualization.color);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const updatedVisualizationData = {
      title,
      description,
      visualization_type: visualization.visualization_type,
      data_file_id: visualization.data_file_id,
      views: visualization.views,
      visibility: visualization.visibility,
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

      <button type="submit">Update Visualization</button>
    </form>
  );
};

export default UpdateVisualizationModal;
