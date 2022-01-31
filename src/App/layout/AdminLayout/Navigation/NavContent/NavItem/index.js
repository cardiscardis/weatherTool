import React, {Component} from 'react';
import {connect} from 'react-redux';
import {NavLink} from 'react-router-dom';
import {withRouter} from 'react-router-dom';
import windowSize from 'react-window-size';

import Aux from "../../../../../../hoc/_Aux";
import NavIcon from "./../NavIcon";
import NavBadge from "./../NavBadge";
import * as actionTypes from "../../../../../../store/actions";

class NavItem extends Component {

    render() {
        let itemTitle = this.props.item.title;
        if (this.props.item.icon) {
            itemTitle = <span className="pcoded-mtext">{this.props.item.title}</span>;
        }

        let itemTarget = '';
        if (this.props.item.target) {
            itemTarget = '_blank';
        }

        let subContent;
        if(this.props.item.external) {
            subContent = (
                <a href={this.props.item.url} target='_blank' rel='noopener noreferrer'>
                    <NavIcon items={this.props.item}/>
                    {itemTitle}
                    <NavBadge layout={this.props.layout} items={this.props.item}/>
                </a>
            );
        } else {
            subContent = (
                <NavLink to={this.props.item.url} className="nav-link" exact={true} target={itemTarget}>
                    <NavIcon items={this.props.item}/>
                    {itemTitle}
                    <NavBadge layout={this.props.layout} items={this.props.item}/>
                </NavLink>
            );
        }
        let mainContent = '';
        if (this.props.layout === 'horizontal') {
            mainContent = (
                <li id={this.props.item.id} onClick={(e) => this.props.onItemLeave(e)}>{subContent}</li>
            );
        } else {
            if (this.props.windowWidth < 992) {
                mainContent = (
                    <li id={this.props.item.id} className={this.props.item.classes} onClick={(e) => this.props.onItemClick(e)}>{subContent}</li>
                );
            } else {
                mainContent = (
                    <li id={this.props.item.id} className={this.props.item.classes} onClick={(e) => this.props.onClick(e)}>{subContent}</li>
                );
            }
        }

        return (
            <Aux>
                {mainContent}
            </Aux>
        );
    }
}

const mapStateToProps = state => {
    return {
        layout: state.layout,
        collapseMenu: state.collapseMenu
    }
};

const mapDispatchToProps = dispatch => {
    return {
        onItemClick: (e) => {
            console.log('onitemclick')
            if (e.currentTarget.id === 'rainfall') dispatch({type: actionTypes.ON_WEATHER_TYPE_CHANGE, weatherType: 'Rainfall'});
            else if (e.currentTarget.id === 'min_temp') dispatch({type: actionTypes.ON_WEATHER_TYPE_CHANGE, weatherType: 'Minimum Temperature'});
            else if (e.currentTarget.id === 'max_temp') dispatch({type: actionTypes.ON_WEATHER_TYPE_CHANGE, weatherType: 'Maximum Temperature'});
            else if (e.currentTarget.id === 'solar') dispatch({type: actionTypes.ON_WEATHER_TYPE_CHANGE, weatherType: 'Solar Exposure'});
            dispatch({type: actionTypes.SET_IS_FETCHING, isFetchingStatus: true});
            dispatch({type: actionTypes.SET_IS_COMPUTING, isComputingStatus: true});
            dispatch({type: actionTypes.COLLAPSE_MENU});
        },
        onItemLeave: (e) => {
            console.log('onitemleave')
            if (e.currentTarget.id === 'rainfall') dispatch({type: actionTypes.ON_WEATHER_TYPE_CHANGE, weatherType: 'Rainfall'});
            else if (e.currentTarget.id === 'min_temp') dispatch({type: actionTypes.ON_WEATHER_TYPE_CHANGE, weatherType: 'Minimum Temperature'});
            else if (e.currentTarget.id === 'max_temp') dispatch({type: actionTypes.ON_WEATHER_TYPE_CHANGE, weatherType: 'Maximum Temperature'});
            else if (e.currentTarget.id === 'solar') dispatch({type: actionTypes.ON_WEATHER_TYPE_CHANGE, weatherType: 'Solar Exposure'});
            dispatch({type: actionTypes.SET_IS_FETCHING, isFetchingStatus: true})
            dispatch({type: actionTypes.SET_IS_COMPUTING, isComputingStatus: true});            
            dispatch({type: actionTypes.NAV_CONTENT_LEAVE})
        },
        onClick: (e) => {
            console.log(e.currentTarget.id)
            if (e.currentTarget.id === 'rainfall') dispatch({type: actionTypes.ON_WEATHER_TYPE_CHANGE, weatherType: 'Rainfall'});            
            else if (e.currentTarget.id === 'min_temp') dispatch({type: actionTypes.ON_WEATHER_TYPE_CHANGE, weatherType: 'Minimum Temperature'});            
            else if (e.currentTarget.id === 'max_temp') dispatch({type: actionTypes.ON_WEATHER_TYPE_CHANGE, weatherType: 'Maximum Temperature'});
            else if (e.currentTarget.id === 'solar') dispatch({type: actionTypes.ON_WEATHER_TYPE_CHANGE, weatherType: 'Solar Exposure'});
            dispatch({type: actionTypes.SET_IS_FETCHING, isFetchingStatus: true})
            dispatch({type: actionTypes.SET_IS_COMPUTING, isComputingStatus: true});
            
            
        }
    }
};

export default withRouter(connect(mapStateToProps, mapDispatchToProps) (windowSize(NavItem)));
