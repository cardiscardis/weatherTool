import React from 'react';

const Rail = ({ coloredRailPositions }) => {
    let coloredRail = null;

    if (Array.isArray(coloredRailPositions) && coloredRailPositions.length === 2) {
        const [ startPos, endPos ] = coloredRailPositions;
        coloredRail = (
            <div
                className="Slider_rail Slider_rail-colored"
                style={{ left: `${startPos}%`, right: `${100 - endPos}%` }}
            > </div>
        );
    }

    return (
        <div className="Slider_rail">
            {coloredRail}
        </div>
    );
};

export default Rail;