const BarLabel = ({x, y, width, height, index, data}) => {
    const value = data[index].displayName;
  
    if (value) {
      return <text x={x + width / 2} y={y - 10} textAnchor="middle" fill="#000">{value}</text>
    }
  
    return null;
  };

export default BarLabel
