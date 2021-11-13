import React from 'react';
import Handle from './render/Handle';
import Knob from "./render/Knob";
import Rail from "./render/Rail";
import {sortAsc, valueToPosition, positionToValue} from '../utils';

class Slider extends React.Component {

    constructor(props) {
        super(props);
        this.ref = React.createRef();
        this.state = { activeHandleIndex: null };
    }

    // Lifecycle hooks

    componentDidMount() {
        document.addEventListener('mousemove', this.mouseMoveHandler);
        document.addEventListener('touchmove', this.touchMoveHandler);
        document.addEventListener('mouseup', this.clickEndHandler);
        document.addEventListener('touchend', this.clickEndHandler);
    }

    componentWillUnmount() {
        document.removeEventListener('mousemove', this.mouseMoveHandler);
        document.removeEventListener('touchmove', this.touchMoveHandler);
        document.removeEventListener('mouseup', this.clickEndHandler);
        document.removeEventListener('touchend', this.clickEndHandler);
    }

    // Component getters

    /**
     * Coordinates, in pixels, of the slider component in the DOM.
     * @returns {{top: number|null, left: number|null, bottom: number|null, right: number|null}}
     */
    get sliderCoordinates() {
        return this.ref.current !== null
            ? this.ref.current.getBoundingClientRect()
            : { left: null, right: null, top: null, bottom: null };
    }

    /**
     * The length of this slider component in pixels.
     * @returns {number}
     */
    get sliderPixelLength() {
        const { left, right } = this.sliderCoordinates;
        return right - left;
    }

    /**
     * The handle's positions are a percentage distance down the rail
     * (using css `left: X%`). Need to scale the values from a range of min/max
     * to 0/1 and multiply by 100 for a percent.
     * @returns {number[]}
     */
    get handlePositions() {
        const { values, min, max } = this.props;
        return values.map(val => {
            // These checks ensure handles never fly off the rails
            if (val > max)
                return 100; // Max position
            else if (val < min)
                return 0; // Min position
            else
                return valueToPosition(val, min, max);
        });
    }

    /**
     * Start and stop positions of the colored rail.
     * @returns {number[]|null} - [ startPos, endPos ]
     */
    get coloredRailPositions() {
        if (!this.props.coloredRailEnabled || this.handlePositions.length < 1) {
            return null;
        }

        if (this.handlePositions.length === 1) {
            return [ 0, this.handlePositions[0] ];
        } else {
            const sortedHandlePositions = sortAsc(this.handlePositions);
            return [
                sortedHandlePositions[0],
                sortedHandlePositions.slice(-1)
            ];
        }
    }

    /**
     * An array of tuples representing positions that can be snapped to (e.g. 25%) and the distance in
     * percentage points that a handle needs to be away from that position in order to snap.
     * @returns {number[][]} - [ position, snapToThreshold ]
     */
    get snapToThresholds() {
        return this.props.knobs
            .filter(({ snapToThreshold }) => !isNaN(snapToThreshold) && snapToThreshold > 0)
            .map(({ position, snapToThreshold }) => [ position, snapToThreshold ]);
    }

    // Component methods

    /**
     * Determine if a knob is a part of the colored section of a rail and needs to be colored also.
     * @param {number} position
     * @returns {boolean}
     */
    knobIsColored(position) {
        if (this.coloredRailPositions === null) {
            return false;
        }

        const [ startPos, endPos ] = this.coloredRailPositions;

        return startPos <= position && endPos >= position;
    }

    /**
     * Loop over snapping positions/thresholds to determine if a position needs to snap to a new position.
     * @param {number} position
     * @returns {number} - the new position after snapping
     */
    calculateSnappedPosition(position) {
        this.snapToThresholds.forEach(([ snapToPos, threshold ]) => {
            const lowerBound = snapToPos - threshold;
            const upperBound = snapToPos + threshold;
            if (position >= lowerBound && position <= upperBound) {
                position = snapToPos;
            }
        });

        return position;
    }

    /**
     * Calculate the new value from a dragged handle's position and call the `onChange` prop.
     * @param {number} cursorX - the x position (in pixels) of the mouse
     */
    drag(cursorX) {
        const { activeHandleIndex } = this.state;

        if (activeHandleIndex !== null) {
            const {
                values,
                min,
                max,
                collisionsEnabled,
                snapToEnabled,
                onChange
            } = this.props;

            // Convert the cursor's X position from pixels to a percentage of the slider's width
            let cursorPosition = (cursorX - this.sliderCoordinates.left) / this.sliderPixelLength * 100;

            if (snapToEnabled) {
                cursorPosition = this.calculateSnappedPosition(cursorPosition);
            }

            let cursorValue;
            if (cursorPosition < 0) {
                // If slider goes below 0%, set it to min
                cursorValue = min;
            } else if (cursorPosition > 100) {
                // If slider exceeds 100%, set it to the max
                cursorValue = max;
            } else {
                // Convert from percentage-based position back to true value
                cursorValue = positionToValue(cursorPosition, min, max);
            }

            let newValues = [ ...values ];
            newValues[activeHandleIndex] = cursorValue;

            // If collisions are enabled, sort the values in ascending order
            if (collisionsEnabled) {
                newValues = sortAsc(newValues);
            }

            onChange(newValues);
        }
    }

    /**
     * @param {number|null} handleIndex
     */
    setActiveHandleIndex(handleIndex) {
        this.setState({ activeHandleIndex: handleIndex });
    }

    // Event handlers

    /**
     * Event handler for both `mouseup` and `touchend`.
     */
    clickEndHandler = () => this.setActiveHandleIndex(null);

    mouseMoveHandler = e => this.drag(e.pageX);

    touchMoveHandler = e => {
        if (e.touches && e.touches.length > 0) {
            this.drag(e.touches[0].pageX);
        }
    }

    render() {
        const handles = this.handlePositions.map((position, handleIndex) => (
            <Handle
                position={position}
                isActive={this.state.activeHandleIndex === handleIndex}
                onMouseDown={() => this.setActiveHandleIndex(handleIndex)}
                onTouchStart={() => this.setActiveHandleIndex(handleIndex)}
                key={`handle_${handleIndex}`}
            />
        ));

        const knobs = this.props.knobs.map(({ position, type }) => (
            <Knob
                position={position}
                type={type}
                isColored={this.knobIsColored(position)}
                key={`knob_${position}`}
            />
        ));

        return (
            <div className="Slider" ref={this.ref}>
                <Rail coloredRailPositions={this.coloredRailPositions} />
                {handles}
                {knobs}
            </div>
        );
    }
}

Slider.defaultProps = {
    coloredRailEnabled: true,
    collisionsEnabled: true,
    snapToEnabled: true,
}

export default Slider;