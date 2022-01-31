import * as actionTypes from './actions';
import config from './../config';

const initialState = {
    isOpen: [], //for active default menu
    isTrigger: [], //for active default menu, set blank for horizontal
    ...config,
    isFullScreen: false, // static can't change
    DashboardInitialState: {
        locationBlock: {    
            location: '',
            category: '',            
            state: ''
        },
        yearBlock: {
            year_opened: '',
            status: '',
            operational_years: ''
        },
        annualBlock: {
            annual_max: '',
            annual_min: '',
            monthly_max: ''
        },
        AnnualAvgBlock: {
            annual_5_yr_avg: '',
            annual_long_avg: ''
        },
        dailyInfoBlock: {
            total_rain_days: '',
            rain_days_greater_than_10mm: '',
            rain_days_greater_than_25mm: '',
            dry_days: '',
            dry_days_consec: ''
        },        
        annualMM: '',
        monthBlock: {
            Jan: '',
            Feb: '',
            Mar: '',
            Apr: '',
            May: '',
            Jun: '',
            Jul: '',
            Aug: '',
            Sep: '',
            Oct: '',
            Nov: '',
            Dec: ''
        },
        seasonBlock: {
            Summer: '',
            Autumn: '',
            Winter: '',
            Spring: ''
        }
    },
    weatherType: 'Rainfall',
    isFetching: true,
    isComputing: true
};

const reducer = (state = initialState, action) => {
    let trigger = [];
    let open = [];
    
    switch (action.type) {
        case actionTypes.COLLAPSE_MENU:
            return {
                ...state,
                collapseMenu: !state.collapseMenu
            };
        case actionTypes.COLLAPSE_TOGGLE:
            if (action.menu.type === 'sub') {
                open = state.isOpen;
                trigger = state.isTrigger;

                const triggerIndex = trigger.indexOf(action.menu.id);
                if (triggerIndex > -1) {
                    open = open.filter(item => item !== action.menu.id);
                    trigger = trigger.filter(item => item !== action.menu.id);
                }

                if (triggerIndex === -1) {
                    open = [...open, action.menu.id];
                    trigger = [...trigger, action.menu.id];
                }
            } else {
                open = state.isOpen;
                const triggerIndex = (state.isTrigger).indexOf(action.menu.id);
                trigger = (triggerIndex === -1) ? [action.menu.id] : [];
                open = (triggerIndex === -1) ? [action.menu.id] : [];
            }

            return {
                ...state,
                isOpen: open,
                isTrigger: trigger
            };
        case actionTypes.NAV_CONTENT_LEAVE:
            return {
                ...state,
                isOpen: open,
                isTrigger: trigger,
            };
        case actionTypes.NAV_COLLAPSE_LEAVE:
            if (action.menu.type === 'sub') {
                open = state.isOpen;
                trigger = state.isTrigger;

                const triggerIndex = trigger.indexOf(action.menu.id);
                if (triggerIndex > -1) {
                    open = open.filter(item => item !== action.menu.id);
                    trigger = trigger.filter(item => item !== action.menu.id);
                }
                return {
                    ...state,
                    isOpen: open,
                    isTrigger: trigger,
                };
            }
            return {...state};
        case actionTypes.FULL_SCREEN :
            return {
                ...state,
                isFullScreen: !state.isFullScreen
            };
        case actionTypes.FULL_SCREEN_EXIT:
            return {
                ...state,
                isFullScreen: false
            };
        case actionTypes.CHANGE_LAYOUT:
            return {
                ...state,
                layout: action.layout
            };
        case actionTypes.ON_WEATHER_TYPE_CHANGE:
            if (action.weatherType === 'Rainfall') {
                return {
                    ...state,
                    weatherType: 'Rainfall'
                };    
            } else if (action.weatherType === 'Minimum Temperature') {
                return {
                    ...state,
                    weatherType: 'Minimum Temperature'
                };
            } else if (action.weatherType === 'Maximum Temperature') {
                return {
                    ...state,
                    weatherType: 'Maximum Temperature'
                };
            } else if (action.weatherType === 'Solar Exposure') {
                return {
                    ...state,
                    weatherType: "Solar Exposure"
                };
            } else {
                return {
                    ...state,
                    weatherType: ''
                };
            };
        case actionTypes.SET_IS_FETCHING:
            return {
                ...state,
                isFetching: action.isFetchingStatus
            };
        case actionTypes.SET_IS_COMPUTING:
            return {
                ...state,
                isComputing: action.isComputingStatus
            };            
        default:
            return state;
    }
};

export default reducer;