import React from 'react';

const Handle = ({ position, isActive, ...props }) => (
    <div
        className={`Slider_handle ${ isActive ? 'Slider_handle-active' : '' }`}
        style={{ left: `${position}%` }}
        draggable="false"
        {...props}
    > </div>
);

export default Handle;