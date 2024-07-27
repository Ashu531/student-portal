import React, { useState } from "react";
import PropTypes from "prop-types";
import ".//tabBar.css";

const TabBar = (props) => {
  const { items, handleTabNumber, selected, type = "default" } = props;
  const [activeItem, setActiveitem] = useState(selected);
  
  const handleClick = (i) => {
    setActiveitem(i);
    handleTabNumber(i);
  };

  return (
      <ul className="plms-list">
        {items.map((item, i) => {
          const isActive = i === activeItem;
          return <li className={`plms-item ${isActive ? "plms-active-tab": ""}`} key={i} onClick={() => handleClick(i)} style={{width: '25%'}}>{item}</li>
        })}
      </ul>
  );
};

TabBar.propTypes = {
  items: PropTypes.array.isRequired,
  handleTabNumber: PropTypes.func.isRequired,
  // selected: PropTypes.number,
  // variant: PropTypes.string
};

export default TabBar;
