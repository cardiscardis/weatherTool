import React from 'react';
import { withRouter } from 'react-router-dom';

//class ScrollToTop extends React.Component {
class Scrolltotop extends React.Component {
    componentDidUpdate(prevProps) {
        if (this.props.location !== prevProps.location) {
            window.scrollTo(0, 0)
        }
    }

    render() {
        return this.props.children
    }
}

//export default withRouter(ScrollToTop);
const ScrollToTop = withRouter(Scrolltotop);
export default ScrollToTop;