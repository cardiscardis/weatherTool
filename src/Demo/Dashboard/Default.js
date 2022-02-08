import React, { useState, useEffect, memo } from 'react';
import { Row, Col, Card, Table, Form } from 'react-bootstrap' // Tabs, Tab, Form } from 'react-bootstrap';
import {connect} from 'react-redux';
import $ from 'jquery';

import UserService from "../services/user.service.js"
import * as actionTypes from "../../store/actions";
//import { decimalToFraction } from "../services/decimalToFraction.js"
//import FastService from "../services/fast.service.js"

import Loader from '../../App/layout/Loader'
import LineChart from "../Charts/Nvd3Chart/LineChart";
import MultiBarChart from "../Charts/Nvd3Chart/MultiBarChart";
import Mercator from '../Charts/Mercator';
//import TiltedBarChart from "../Charts/Nvd3Chart/MultiBarHorizontalChart";
//import PieChart from "../Charts/Nvd3Chart/PieBasicChart";
import Aux from "../../hoc/_Aux";
//import DEMO from "../../store/constant";
//import avatar1 from '../../assets/images/user/avatar-1.jpg';
//import avatar2 from '../../assets/images/user/avatar-2.jpg';
//import avatar3 from '../../assets/images/user/avatar-3.jpg';
import RawDataTable from '../Tables/BootstrapTable';
import SortTable from '../Tables/SortTable';
//import { setObservableConfig } from 'recompose';
//import { Slide } from '../slider/index.js';
//import { data } from 'jquery';

let mouseleave = (event, d) => {
    $('.nvtooltip').hide();
}
$('.nv-bar').on("mouseleave", mouseleave);


const getMonthlyMaxMonth = (num) => {
    let month = ''
    switch (num) {
    case 1:
        month = 'Jan';
        break;
    case 2:
        month = 'Feb';
        break;
    case 3:
        month = 'Mar';
        break;
    case 4:
        month = 'Apr';
        break;
    case 5:
        month = 'May';
        break;
    case 6:
        month = 'Jun';
        break;
    case 7:
        month = 'Jul';
        break;
    case 8:
        month = 'Aug';
        break;
    case 9:
        month = 'Sep';
        break;
    case 10:
        month = 'Oct';
        break;
    case 11:
        month = 'Nov';
        break;
    case 12:
        month = 'Dec';
        break;
    default: 
        month = '*'
    }
    return month;
}

function rankDuplicate(arr) {
    const sorted = [...new Set(arr)].sort((a, b) => b - a);
    const rank = new Map(sorted.map((x, i) => [x, i + 1]));
    return arr.map((x) => rank.get(x));
  }
  
  
const Dashboard = (props) => {  
        
    
    let weatherType = props.weatherType;
    let isFetching = props.isFetching;    
    let setIsFetching = props.setIsFetching;
    let isComputing = props.isComputing;
    let setIsComputing = props.setIsComputing;

    //const [ weatherType, setWeatherType ] = useState('Rainfall');
    //const [ isFetching, setIsFetching ] = useState(true);
    //const [ isComputing, setIsComputing ] = useState(true);
    const [ queryCode, setQueryCode ] = useState('68005 (Bowral)');
    const [ mainState, setMainState ] = useState({});
    const [ filterControl, setFilterControl ] = useState('Overview');
    const [ seasonControl, setSeasonControl ] = useState('Summer');
    const [ monthlyControl, setMonthlyControl ] = useState('February');
    const [ ojiControl, setOjiControl ] = useState('OJ');
    const [ analysisControl, setAnalysisControl ] = useState('Select Year');
    const [ codesAndData, setCodesAndData ] = useState({});    
    

    const onChange = (e) => {
        //e.preventDe
        e.stopPropagation();        
        setIsComputing(true);
        if (e.target.name === 'queryCode') {
            setQueryCode(e.target.value);
            setIsFetching(true);
            return false;
        } 
        /*if (e.target.name === 'weatherType') {
            setWeatherType(e.target.value); 
            setIsFetching(true);
        } */
        if (e.target.name === 'seasonControl') {
            return setSeasonControl(e.target.value);            
        } 
        if (e.target.name === 'monthlyControl') {
            return setMonthlyControl(e.target.value);            
        } 
        if (e.target.name === 'ojiControl') {
            return setOjiControl(e.target.value);            
        } 
        if (e.target.name === 'analysisControl') {
            return setAnalysisControl(e.target.value);
        } 
        if (e.target.name === 'filterControl') {
            return setFilterControl(e.target.value);
        }
    }   
 

    useEffect(() => {
        //get station codes and weather data from api
        async function fetchData() {
            if (isFetching) {
                let codes = [];
                let data = [];               
            
                await UserService.getUserBoard().then(async () => {
                    await UserService.getCodes().then(async (response) => {
                        codes = response.data;
                        return codes;
                    }, (e) => {
                        console.log(e);
                        alert('Error Fetching Data! Please Reload The Page To Continue...');
                        return setIsFetching(false); 
                    });
                    const qc = await queryCode.split(' ');
                    await UserService.getWeatherContent(weatherType, qc[0]).then(async (response) => {
                        data = await response.data;
                        return data;
                    }, (e) => {
                        console.log(e);
                        alert('Error Fetching Data! Please Reload The Page To Continue...');
                        return setIsFetching(false); 
                    });
                    let ans = { codes, data };
                    //return ans;
                    setCodesAndData(ans);
                    return setIsFetching(false);
                }, () => {
                    props.history.push("/auth/signin-1");
                    return window.location.reload();
                });
            } else return false;
        }
        
        //-----------------------------------------------
        if (isComputing) {
            fetchData().then(() => {
                let codes = codesAndData.codes;
                let data = codesAndData.data;
                //let qc = codesAndData.qc;
            
                let mainData = {};
                if (codes && data && codes.length && data.length) {
                    mainData.category = "Renewables";
                    mainData.data = [...data];
                    //set station codes for form render
                    mainData.stationCodes = [...codes];
    
                    //set location
                    if (filterControl === 'Location Tool' || filterControl === 'Overview') {
                        //set station location
                        const qc = queryCode.split(' ');
                        let location = codes.find((a) => {
                            return a.code === qc[0];
                        });
                        //set station details
                        mainData.locationData = location || {};
                        mainData.location = location.station || 'n/a';
                        mainData.stationState = location.sub_station || 'n/a';
                        mainData.district = location.District || 'n/a';
                        mainData.stationHeight = location.StationHeight || 'n/a'; 
                        mainData.open = location.Status || 'n/a';
                        mainData.latitude = location.Latitude || 'n/a';
                        mainData.longitude = location.Longitude || 'n/a';
                    }                    
                                        
                    
                        
                    
    
                    //set year opened
                    if (filterControl === 'Overview' || filterControl === 'Location Tool') {
                        let yearOpened = data[0].year;
                        if (yearOpened) {mainData.yearOpened = yearOpened;} else {mainData.yearOpened = 'n/a';}
    
                        //set operational years
                        let yearClosed = data[data.length - 1].year;
                        mainData.yearClosed = yearClosed;
                        let opYears = yearClosed - yearOpened;
                        if (opYears < 1) {
                            opYears = '<1';
                        }
                        mainData.opYears = opYears;
                    }
                    
    
                    //Annual Max and Min
                    //Grouping rain data by year
                    //first create year array
                    let arrOfYear = [];
                    //then create an array of rain data
                    let arrOfRainfall = [];
                    //create array for month+year
                    let arrOfYearAndMonth = [];
                    //push year data in year array and rain array (a must for the next stage to work well is to replace -1 values for rain array)
    
                    for (let a of data) {
                        arrOfYear.push(Number(a.year));
                        let yearPlusMonth = a.year+'-'+a.month;
                        arrOfYearAndMonth.push(yearPlusMonth);
                        if (weatherType === 'Rainfall') {
                            if (a.rainfall_amount === -1) {
                                arrOfRainfall.push(0);
                            } else {
                                arrOfRainfall.push(Number(a.rainfall_amount));
                            }
                        } else if (weatherType === 'Minimum Temperature') {
                            if (a.min_temp_celsius === -1) {
                                arrOfRainfall.push(0);
                            } else {
                                arrOfRainfall.push(Number(a.min_temp_celsius));
                            }
                        } else if (weatherType === 'Maximum Temperature') {
                            if (a.max_temp_celsius === -1) {
                                arrOfRainfall.push(0);
                            } else {
                                arrOfRainfall.push(Number(a.max_temp_celsius));
                            }
                        } else if (weatherType === 'Solar Exposure') {
                            if (a.solar_exposure === -1) {
                                arrOfRainfall.push(0);
                            } else {
                                arrOfRainfall.push(Number(a.solar_exposure));
                            }
                        }
                    }
                    
                    
                    //then create 2 objects. One for grouping years and frequency(ocurrence length)
                    //the other for grouping years and start index.
                    let yearsAndNumYears = {};
                    
                    //counter for arrOfYear
                    let counter = 1;
                    //counter for arrOfYearAndMonth
                    for (let i = 0; i < arrOfYear.length; i++) {
                        if (arrOfYear[i] === arrOfYear[i + 1]) {
                            counter++;
                        } else {
                            yearsAndNumYears[arrOfYear[i]] = counter;
                            counter = 1;
                        }
                    }
    
                    //calculating maximum rainfall for each year.
                    let year1 = Object.keys(yearsAndNumYears);
                    let freq = Object.values(yearsAndNumYears);
    
                    //calculate maximum rainfall for each year and then month. Also on five years basis.
                    let sumOfRainfallPerYear = {}, sumOfRainfallPerMonth = {}, sumOfRainfallPerFiveYears = {};
    
                    //seasonal data for last year
                    let winter = [], spring = [], summer = [], autumn = [];
    
                    //consec dry days (last year)
                    let dryDaysMaxConsec = {};
                    let dryDaysConsec = [];
    
                    //last year info data:
                    let daysWithRain = [], daysOfRainGreaterThan10 = [], daysOfRainGreaterThan25 = [], dryDays = [];
    
                    //array to hold lineChart data
                    let lineChartData = [];
                    
                    //year halfs and quarters
                    let h1 = [], h2 = [], q1 = [], q2 = [], q3 = [], q4 = [];
                    let h_1 = [], h_2 = [], q_1 = [], q_2 = [], q_3 = [], q_4 = [], winter_1 = [], spring_1 = [], summer_1 = [], autumn_1 = [];
    
                    //for each year (overall)
                    let winter2 = [], spring2 = [], summer2 = [], autumn2 = [], winter_cc = [], winterStartDecRain = [];
    
                    //for each month per year. g means graph (for monthly filter contents)
                    let g_jan = [], g_feb = [], g_mar = [], g_apr = [], g_may = [], g_jun = [], g_jul = [], g_aug = [], g_sep = [], g_oct = [], g_nov = [], g_dec = [];
    
                    let forMonthlyTable = [], forAnnualTable = [], forMonthlyFilterTable = [], forAveragesFilterTable = [], forOJIndexTable = [];
                    let forAveragesLineChart = [], winterStartDecRainAvg = {};

                    let forCWAnnualTraversing = [], forCWCoolTraversing = [], forCWWarmTraversing = [], forCoolAndWarmFilterTable = [];
                    let coolAndWarm_jan = [], coolAndWarm_feb = [], coolAndWarm_mar = [], coolAndWarm_apr = [], coolAndWarm_may = [], coolAndWarm_jun = [];
                    let coolAndWarm_jul = [], coolAndWarm_aug = [], coolAndWarm_sep = [], coolAndWarm_oct = [], coolAndWarm_nov = [], coolAndWarm_dec = [];
                    let coolAndWarm_annual = [], coolAndWarm_cool = [], coolAndWarm_warm = [];
    
                    //five year basis array.
                    let fiveYearsArr = [];                    
                    let fiveYearStart = year1[0];  
                    let basis = 5;
                    //ten year basis averages array.      
                    let tenYearStart = `${year1[0][0]}${year1[0][1]}${year1[0][2]}0`;
                    let basis10 = year1.indexOf(String(Number(tenYearStart) + 10));
                    //fifty year basis averages array.
                    let fiftyYearStart = `${year1[0][0]}${year1[0][1]}${year1[0][2]}0`;
                    let basis50 = year1.indexOf(String(Number(fiftyYearStart) + 50));
                    //last 100 years basis averages array.
                    let last100YearStart = `${year1[year1.length - 1][0]}${year1[year1.length - 1][1]}00`;
                    
                    // 5 years interval average per month per year (for averages filter table 2 contents).
                    let forAvg5_jan = [], forAvg5_feb = [], forAvg5_mar = [], forAvg5_apr = [], forAvg5_may = [], forAvg5_jun = [], forAvg5_jul = [], forAvg5_aug = [];
                    let forAvg5_sep = [], forAvg5_oct = [], forAvg5_nov = [], forAvg5_dec = [], forAvg5_annual = [], forAvg5_q1 = [], forAvg5_q2 = [], forAvg5_q3 = [];
                    let forAvg5_q4 = [], forAvg5_h1 = [], forAvg5_h2 = [], forAvg5_winter = [], forAvg5_spring = [], forAvg5_summer = [], forAvg5_autumn = [];
                    let avgPerFiveYears = [];
                    // 10 years interval average per month per year (for averages filter table 2 contents).
                    let forAvg10_jan = [], forAvg10_feb = [], forAvg10_mar = [], forAvg10_apr = [], forAvg10_may = [], forAvg10_jun = [], forAvg10_jul = [], forAvg10_aug = [];
                    let forAvg10_sep = [], forAvg10_oct = [], forAvg10_nov = [], forAvg10_dec = [], forAvg10_annual = [], forAvg10_q1 = [], forAvg10_q2 = [], forAvg10_q3 = [];
                    let forAvg10_q4 = [], forAvg10_h1 = [], forAvg10_h2 = [], forAvg10_winter = [], forAvg10_spring = [], forAvg10_summer = [], forAvg10_autumn = [];
                    let avgPerTenYears = [];
                    // 10 years interval from 1960
                    let forSince1960 = [], since1960tenYearStart = '1960', since1960tenYearStart2 = `${year1[0][0]}${year1[0][1]}${year1[0][2]}0`;
                    let since1960PerTenYears = [], eVals = [], fVals = [], since1960_basis10 = String(Number(since1960tenYearStart2) + 10), b2 = 'n/a', b61 = 'n/a';
                    //50 years interval average per month per year (for averages filter table 2 contents).
                    let forAvg50_jan = [], forAvg50_feb = [], forAvg50_mar = [], forAvg50_apr = [], forAvg50_may = [], forAvg50_jun = [], forAvg50_jul = [], forAvg50_aug = [];
                    let forAvg50_sep = [], forAvg50_oct = [], forAvg50_nov = [], forAvg50_dec = [], forAvg50_annual = [], forAvg50_q1 = [], forAvg50_q2 = [], forAvg50_q3 = [];
                    let forAvg50_q4 = [], forAvg50_h1 = [], forAvg50_h2 = [], forAvg50_winter = [], forAvg50_spring = [], forAvg50_summer = [], forAvg50_autumn = [];
                    let avgPerFiftyYears = [];
                    //last 100 years interval average per month per year (for averages filter table 2 contents).
                    let forAvg100_jan = [], forAvg100_feb = [], forAvg100_mar = [], forAvg100_apr = [], forAvg100_may = [], forAvg100_jun = [], forAvg100_jul = [], forAvg100_aug = [];
                    let forAvg100_sep = [], forAvg100_oct = [], forAvg100_nov = [], forAvg100_dec = [], forAvg100_annual = [], forAvg100_q1 = [], forAvg100_q2 = [], forAvg100_q3 = [];
                    let forAvg100_q4 = [], forAvg100_h1 = [], forAvg100_h2 = [], forAvg100_winter = [], forAvg100_spring = [], forAvg100_summer = [], forAvg100_autumn = [];
                    let last100YearAvg = [];
                    //Long Term Average (all years) per month per year (for averages filter table 2 contents).
                    let forAvgLTA_jan = [], forAvgLTA_feb = [], forAvgLTA_mar = [], forAvgLTA_apr = [], forAvgLTA_may = [], forAvgLTA_jun = [], forAvgLTA_jul = [], forAvgLTA_aug = [];
                    let forAvgLTA_sep = [], forAvgLTA_oct = [], forAvgLTA_nov = [], forAvgLTA_dec = [], forAvgLTA_annual = [], forAvgLTA_q1 = [], forAvgLTA_q2 = [], forAvgLTA_q3 = [];
                    let forAvgLTA_q4 = [], forAvgLTA_h1 = [], forAvgLTA_h2 = [], forAvgLTA_winter = [], forAvgLTA_spring = [], forAvgLTA_summer = [], forAvgLTA_autumn = [];
                    let ltaYearsAvg = [];
    
                    //averages barchart
                    let avgChart1Winter = [], avgChart1Spring = [], avgChart1Summer = [], avgChart1Autumn = [];
                    let avgChart2Annual = {};
                    let avgChart3monthFeb = [], avgChart3monthMar = [], avgChart3monthApr = [], avgChart3monthMay = [], avgChart3monthJun = [], avgChart3monthJul = [];
                    let avgChart3monthAug = [], avgChart3monthSep = [], avgChart3monthOct = [], avgChart3monthNov = [], avgChart3monthDec = [],  avgChart3monthJan = [];
                    let avgChart4h1h2 = {}, avgChart4q1q2q3q4 = {};
                    
    
                    //for oji line chart
                    let oji = [], sji = [], aji = []; //october-january, september-january and august-january
    
                    //for data analysis
                    let forDailyAnalysis = []; //daily rain per month per year
                    let janToDecMaxPerYear = []; //max rain per month per year
                    let hrpmConsec = []; //highest rain per month per year consec
                    let hnodConsec = [], hnodConsec2 = []; //highest no of days per month per year consec
                    let hdnodConsec = [], hdnodConsec2 = [];//highest no of dry days per month per year consec
                    let nord = []; //number of rain days per month per year
                    let nodd = []; //number of dry days per month per year
                    let nowd25 = [], nowd15 = [], nowd10 = []; //number of wet days > 25mm, 15mm and 10mm per month per year
                    
                    //for daily analysis
                    let arrOfEachMonthRainPerYear = [], arrOfEachMonthRainPerYear2 = [];
                    
                    //for rank
                    let rank = {};
                    let rank_annual = [], rank_jan = [], rank_feb = [], rank_mar = [], rank_apr = [], rank_may = [], rank_jun = [], rank_jul = [];
                    let rank_aug = [], rank_sep = [], rank_oct = [], rank_nov = [], rank_dec = [], rank_winter = [], rank_summer = [], rank_autumn = [], rank_spring = [];

                    //for Cool and Warm 
                    let scw = [];
    
                    //main loop
                    for (let i = 0; i <= year1.length-1; i++) {
                        //per Year Array
                        let arr = [];
                        //monthly rainfall array
                        let monthArray = [];
                        //year start and end
                        let start = 0;
                        let end = freq[0];
                                                
                        if (i !== 0) {
                            for (let j = 0; j <= i - 1; j++) {
                                start += freq[j];
                            }
                            end = 0;
                            for (let j = 0; j <= i; j++) {
                                end += freq[j];
                            }
                        }
                        
                        let janDecRainPerYear = {};
                        //let janDecRainPerNextYear = {};
                        let janDecRainPerYearAvg = {};                        
    
                        //for aj, sj and oj
                        let ad = [], sd = [], od = [];
    
                        //for each day of the month per year (for data analysis sample)                        
                        let twenty_2 = {}, twenty_3 = {}, twenty_4 = {}, twenty_5 = {}, twenty_6 = {}, twenty_7 = {}, twenty_8 = {}, twenty_9 = {};
                        let thirties = {}, thirty_1 = {}, ones = {}, twos = {}, threes = {}, fours= {}, fives = {}, sixes = {}, sevens = {};
                        let eights = {}, nines = {}, tens = {}, elevens = {}, twelves = {}, thirteens = {}, fourteens = {}, fifteens = {};
                        let sixteens = {}, eighteens = {}, nineteens = {}, twenties = {}, seveenteens = {}, twenty_1 = {};
                    
                        
                        let janToDecMax = {};
    
                        //highest rain per month for data analysis consec
                        let highestRainConsec1 = [];
                        let highestRainPerMonth1 = {}, hrpMonth = {}, hrpMonth2 = {};  //highest amount of rain per month consec                       
                        let highestNodPerMonth1 = {}, hnodMonth = {}, hnodMonth2 = {};//no of days of highest rain per month for data analysis consec                        
    
                        let highestDryNodConsec = {}, hdnodc = {}, hdnodc2 = {};                        
                        let highestDryConsec1 = [];
    
                        //rain days per month per year continues
                        let noOfRainDaysAnalysis = [];
                        let nrd = {};
    
                        //dry days per month per year continues
                        let noOfDryDaysAnalysis = [];
                        let ndd = {};
    
                        //wet days > 25mm, 15mm and 10mm per month per year continues
                        let noOfWetDaysAnalysis25 = [], noOfWetDaysAnalysis15 = [], noOfWetDaysAnalysis10 = [];
                        let nwd25 = {}, nwd15 = {}, nwd10 = {};
    
                        //for daily analysis                        
                        let monthlyCumulative = '';
                        let eachDayRainPerMonth = {}, arrOfEachMonthRain = {};
                        let eachDayRainPerMonth2 = {}, arrOfEachMonthRain2 = {};
                        
                        //loop through each year
                        for (let k = start; k <= end - 1; k++) {
                            //calculate yearly
                            arr.push(arrOfRainfall[k]);
    
                            //calculate five years interval/basis.
                            if (filterControl === 'Overview') {
                                if (year1[basis - 1]) {
                                    fiveYearsArr.push(Number(arrOfRainfall[k]));
                                    if (i === basis) {
                                        let fiveYearEnd = year1[basis - 1];
                                        let fiveYearStartAndEnd = fiveYearStart + '-' + fiveYearEnd;
                                        sumOfRainfallPerFiveYears[fiveYearStartAndEnd] = fiveYearsArr.reduce(function(a, b) {
                                            return a + b;
                                        }, 0);
                                        fiveYearsArr = [];
                                        fiveYearStart = year1[basis];
                                        basis += 5; 
                                        if (year1[basis - 1]) {
                                            fiveYearsArr.push(arrOfRainfall[k]);
                                        }
                                    }
                                }
                            
    
                                //consec dry days per year
                            
                                if (arrOfRainfall[k] === 0) {                               
                                    if (arrOfRainfall[k] === arrOfRainfall[k + 1]) {
                                        dryDaysConsec.push(arrOfRainfall[k]);
                                    } else {
                                        dryDaysConsec.push(arrOfRainfall[k]);   
                                        dryDaysMaxConsec[`${year1[i]}_${k}`] = dryDaysConsec.length;
                                        dryDaysConsec = [];
                                    }
                                }
                            }
                            
    
                            //calculate monthly           
                            let y = arrOfYearAndMonth[k].split('-');
                                                        
                            //last year daily data                            
                            if (String(data[k].year) === year1[year1.length - 1]) {
                                //last year data info. 
                                if (filterControl === 'Overview') {
                                    if (Number(arrOfRainfall[k]) > 0) {
                                        daysWithRain.push(Number(arrOfRainfall[k]));
                                    } 
                                    if (Number(arrOfRainfall[k]) > 10) {
                                        daysOfRainGreaterThan10.push(Number(arrOfRainfall[k]));
                                    } 
                                    if (Number(arrOfRainfall[k]) > 25) {
                                        daysOfRainGreaterThan25.push(Number(arrOfRainfall[k]));
                                    } 
                                    if (Number(arrOfRainfall[k]) <= 0) {
                                        dryDays.push(Number(arrOfRainfall[k]));
                                    }                               
                                                                                                                
    
                                    //season data for last year. The year starts with a winter (on January). 
                                    //Also, last year's December belongs to next year's winter. 
                                    if (y[1] === '1' || y[1] === '2') {
                                        winter.push(Number(arrOfRainfall[k]));
                                    }                                                                
                                    if (y[1] === '3' || y[1] === '4' || y[1] === '5') {
                                        spring.push(Number(arrOfRainfall[k]));
                                    }         
                                    if (y[1] === '6' || y[1] === '7' || y[1] === '8') {
                                        summer.push(Number(arrOfRainfall[k]));
                                    }         
                                    if (y[1] === '9' || y[1] === '10' || y[1] === '11') {
                                        autumn.push(Number(arrOfRainfall[k]));
                                    }                                
                                }
                            }
    
                            //---------------------------------------------
                            
                            //Populate each day of each month of each year. For Data Analysis
                            if (filterControl === 'Daily Analysis') {
                                if (data[k].day === 1 ) {
                                    ones[getMonthlyMaxMonth(Number(data[k].month))] = Number(arrOfRainfall[k]);                                    
                                }
                                if (data[k].day === 2) {
                                    twos[getMonthlyMaxMonth(Number(data[k].month))] = Number(arrOfRainfall[k]);
                                }
                                if (data[k].day === 3) {
                                    threes[getMonthlyMaxMonth(Number(data[k].month))] = Number(arrOfRainfall[k]);
                                }
                                if (data[k].day === 4) {
                                    fours[getMonthlyMaxMonth(Number(data[k].month))] = Number(arrOfRainfall[k]);
                                }
                                if (data[k].day === 5) {
                                    fives[getMonthlyMaxMonth(Number(data[k].month))] = Number(arrOfRainfall[k]);
                                }
                                if (data[k].day === 6) {
                                    sixes[getMonthlyMaxMonth(Number(data[k].month))] = Number(arrOfRainfall[k]);
                                }
                                if (data[k].day === 7) {
                                    sevens[getMonthlyMaxMonth(Number(data[k].month))] = Number(arrOfRainfall[k]);
                                }
                                if (data[k].day === 8) {
                                    eights[getMonthlyMaxMonth(Number(data[k].month))] = Number(arrOfRainfall[k]);
                                }
                                if (data[k].day === 9) {
                                    nines[getMonthlyMaxMonth(Number(data[k].month))] = Number(arrOfRainfall[k]);
                                }
                                if (data[k].day === 10) {
                                    tens[getMonthlyMaxMonth(Number(data[k].month))] = Number(arrOfRainfall[k]);
                                }
                                if (data[k].day === 11) {
                                    elevens[getMonthlyMaxMonth(Number(data[k].month))] = Number(arrOfRainfall[k]);
                                }
                                if (data[k].day === 12) {
                                    twelves[getMonthlyMaxMonth(Number(data[k].month))] = Number(arrOfRainfall[k]);
                                }
                                if (data[k].day === 13) {
                                    thirteens[getMonthlyMaxMonth(Number(data[k].month))] = Number(arrOfRainfall[k]);
                                }
                                if (data[k].day === 14) {
                                    fourteens[getMonthlyMaxMonth(Number(data[k].month))] = Number(arrOfRainfall[k]);
                                }
                                if (data[k].day === 15) {
                                    fifteens[getMonthlyMaxMonth(Number(data[k].month))] = Number(arrOfRainfall[k]);
                                }
                                if (data[k].day === 16) {
                                    sixteens[getMonthlyMaxMonth(Number(data[k].month))] = Number(arrOfRainfall[k]);
                                }
                                if (data[k].day === 17) {
                                    seveenteens[getMonthlyMaxMonth(Number(data[k].month))] = Number(arrOfRainfall[k]);
                                }
                                if (data[k].day === 18) {
                                    eighteens[getMonthlyMaxMonth(Number(data[k].month))] = Number(arrOfRainfall[k]);
                                }
                                if (data[k].day === 19) {
                                    nineteens[getMonthlyMaxMonth(Number(data[k].month))] = Number(arrOfRainfall[k]);
                                }
                                if (data[k].day === 20) {
                                    twenties[getMonthlyMaxMonth(Number(data[k].month))] = Number(arrOfRainfall[k]);
                                }
                                if (data[k].day === 21) {
                                    twenty_1[getMonthlyMaxMonth(Number(data[k].month))] = Number(arrOfRainfall[k]);
                                }
                                if (data[k].day === 22) {
                                    twenty_2[getMonthlyMaxMonth(Number(data[k].month))] = Number(arrOfRainfall[k]);
                                }
                                if (data[k].day === 23) {
                                    twenty_3[getMonthlyMaxMonth(Number(data[k].month))] = Number(arrOfRainfall[k]);
                                }
                                if (data[k].day === 24) {
                                    twenty_4[getMonthlyMaxMonth(Number(data[k].month))] = Number(arrOfRainfall[k]);
                                }
                                if (data[k].day === 25) {
                                    twenty_5[getMonthlyMaxMonth(Number(data[k].month))] = Number(arrOfRainfall[k]);
                                }
                                if (data[k].day === 26) {
                                    twenty_6[getMonthlyMaxMonth(Number(data[k].month))] = Number(arrOfRainfall[k]);
                                }
                                if (data[k].day === 27) {
                                    twenty_7[getMonthlyMaxMonth(Number(data[k].month))] = Number(arrOfRainfall[k]);
                                }
                                if (data[k].day === 28) {
                                    twenty_8[getMonthlyMaxMonth(Number(data[k].month))] = Number(arrOfRainfall[k]);
                                }
                                if (data[k].day === 29) {
                                    twenty_9[getMonthlyMaxMonth(Number(data[k].month))] = Number(arrOfRainfall[k]);
                                }
                                if (data[k].day === 30) {
                                    thirties[getMonthlyMaxMonth(Number(data[k].month))] = Number(arrOfRainfall[k]);
                                }
                                if (data[k].day === 31) {
                                    thirty_1[getMonthlyMaxMonth(Number(data[k].month))] = Number(arrOfRainfall[k]);
                                }    
                            }
                            
                            //seasonal
                            //season data for each other year including last
                            if (filterControl === 'Monthly Sort' || filterControl === 'Monthly' || filterControl === 'Seasonal' || filterControl === 'Seasonal Sort' ||
                            filterControl === 'H1H2Q1Q4' || filterControl === 'H1H2Q1Q4 Sort' || filterControl === 'OJ Index' || filterControl === 'Test Select Year' || 
                            filterControl === 'OJ Index Sort' || filterControl === 'Overview') {
                                if (y[1] === '1' || y[1] === '2') {
                                    winter2.push(arrOfRainfall[k] !==undefined ? Number(arrOfRainfall[k]):0);
                                }                                                                
                                if (y[1] === '3' || y[1] === '4' || y[1] === '5') {
                                    spring2.push(arrOfRainfall[k] !==undefined ? Number(arrOfRainfall[k]):0);
                                }         
                                if (y[1] === '6' || y[1] === '7' || y[1] === '8') {
                                    summer2.push(arrOfRainfall[k] !==undefined ? Number(arrOfRainfall[k]):0);
                                }         
                                if (y[1] === '9' || y[1] === '10' || y[1] === '11') {
                                    autumn2.push(arrOfRainfall[k] !==undefined ? Number(arrOfRainfall[k]):0);
                                }
                                //next year's winter begins
                                if (y[1] === '12') {
                                    winter_cc.push(arrOfRainfall[k] !==undefined ? Number(arrOfRainfall[k]):0);
                                }
    
                                //--------------------------------------------
                                
                                //compute for h1 and h2 (year halfs) 
                                if (y[1] === '1' || y[1] === '2' || y[1] === '3' || y[1] === '4' || y[1] === '5' || y[1] === '6') {                            
                                    h1.push(Number(arrOfRainfall[k]));
                                }
                                if (y[1] === '7' || y[1] === '8' || y[1] === '9' || y[1] === '10' || y[1] === '11' || y[1] === '12') {
                                    h2.push(Number(arrOfRainfall[k]));
                                }
                                //---------------------------------------------
    
                                //compute for q1 to q4 (year quarters)
                                if (y[1] === '1' || y[1] === '2' || y[1] === '3') {
                                    q1.push(Number(arrOfRainfall[k]));
                                }
                                if (y[1] === '4' || y[1] === '5' || y[1] === '6') {
                                    q2.push(Number(arrOfRainfall[k]));
                                }
                                if (y[1] === '7' || y[1] === '8' || y[1] === '9') {
                                    q3.push(Number(arrOfRainfall[k]));
                                }
                                if (y[1] === '10' || y[1] === '11' || y[1] === '12') {
                                    q4.push(Number(arrOfRainfall[k]));
    
                                //compute oj, sj and aj
                                //for oj
                                    od.push(Number(arrOfRainfall[k]) || 0);
                                }
                                //for sj
                                if (y[1] === '9' || y[1] === '10' || y[1] === '11' || y[1] === '12') {
                                    sd.push(Number(arrOfRainfall[k]) || 0);
                                }
                                //for aj
                                if (y[1] === '8' || y[1] === '9' || y[1] === '10' || y[1] === '11' || y[1] === '12') {
                                    ad.push(Number(arrOfRainfall[k]) || 0);
                                }                      
                            }                            
    
                            
                            //--------------------------------------------
                            
                            //monthly continues...                    
                            if (y[0] === String(data[k].year) && y[1] === String(data[k].month)) {                                                                                
                                if (arrOfYearAndMonth[k] === arrOfYearAndMonth[k + 1]) {                                    
                                    //monthly filter data
                                    monthArray.push(Number(arrOfRainfall[k]));
                                    //____________________________________________________
                                    
                                    //for daily cumulative                                    
                                    ///cumulative
                                    if (k === start) {
                                        arrOfEachMonthRain[`_${data[k].day}`] = Number(arrOfRainfall[k]);
                                        monthlyCumulative = Number(arrOfRainfall[k]);                                    
                                    } else {
                                        arrOfEachMonthRain[`_${data[k].day}`] = Number(arrOfRainfall[k]) + monthlyCumulative;
                                        monthlyCumulative += Number(arrOfRainfall[k]);
                                    }   
                                    //daily
                                    arrOfEachMonthRain2[`_${data[k].day}`] = Number(arrOfRainfall[k]);
                                    //____________________________________________________
    
                                    //data analysis filter
                                    //----------------------
                                    //highest consecutive for data analysis filter
                                    if (Number(arrOfRainfall[k]) > 0 && Number(arrOfRainfall[k + 1]) > 0) {
                                        highestRainConsec1.push(Number(arrOfRainfall[k]));
                                    } 
                                    if (Number(arrOfRainfall[k - 1]) > 0 && Number(arrOfRainfall[k]) > 0 && Number(arrOfRainfall[k + 1]) <= 0) {
                                        highestRainConsec1.push(Number(arrOfRainfall[k]));
                                        //amount of rain
                                        highestRainPerMonth1[`${data[k].year}${data[k].month}${data[k].day}`] = highestRainConsec1.reduce(function(a, b) {
                                            return a + b;
                                        }, 0); 
                                        //no of days
                                        highestNodPerMonth1[`${data[k].year}${data[k].month}${data[k].day}`] = highestRainConsec1.length;
                                        highestRainConsec1 = [];
                                    }
    
                                    //highest consecutive dry days for data analysis filter
                                    if (Number(arrOfRainfall[k]) === 0 && Number(arrOfRainfall[k + 1]) === 0) {
                                        highestDryConsec1.push(Number(arrOfRainfall[k]));
                                    } 
                                    if (Number(arrOfRainfall[k - 1]) === 0 && Number(arrOfRainfall[k]) === 0 && Number(arrOfRainfall[k + 1]) !== 0) {
                                        highestDryConsec1.push(Number(arrOfRainfall[k]));
                                        //no of dry days consec
                                        highestDryNodConsec[`${data[k].year}${data[k].month}${data[k].day}`] = highestDryConsec1.length;
                                        highestDryConsec1 = [];
                                    }
    
                                    //no of rain days per month per year
                                    if (Number(arrOfRainfall[k]) > 0) {
                                        noOfRainDaysAnalysis.push(arrOfRainfall[k]);
                                    }
    
                                    //no of dry days per month per year
                                    if (Number(arrOfRainfall[k]) === 0) {
                                        noOfDryDaysAnalysis.push(arrOfRainfall[k]);
                                    }
    
                                    //no of wet days > 25mm, 15mm and 10mm per month per year
                                    if (Number(arrOfRainfall[k]) > 25) {
                                        noOfWetDaysAnalysis25.push(arrOfRainfall[k]);
                                    }
                                    if (Number(arrOfRainfall[k]) > 15) {
                                        noOfWetDaysAnalysis15.push(arrOfRainfall[k]);
                                    }
                                    if (Number(arrOfRainfall[k]) > 10) {
                                        noOfWetDaysAnalysis10.push(arrOfRainfall[k]);
                                    }
    
                                } else {//last day of month!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
                                    
                                    //for daily cumulative (for last day)
                                    //cumulative
                                    arrOfEachMonthRain[`_${data[k].day}`] = Number(arrOfRainfall[k]) + monthlyCumulative;
                                    eachDayRainPerMonth = {...eachDayRainPerMonth, [getMonthlyMaxMonth(data[k].month)]: arrOfEachMonthRain};
                                    monthlyCumulative += Number(arrOfRainfall[k]);
                                    arrOfEachMonthRain = {};
                                    //daily
                                    arrOfEachMonthRain2[`_${data[k].day}`] = Number(arrOfRainfall[k]);
                                    eachDayRainPerMonth2 = {...eachDayRainPerMonth2, [getMonthlyMaxMonth(data[k].month)]: arrOfEachMonthRain2};
                                    arrOfEachMonthRain2 = {};
                                    //____________________________________________________
                                    //no of rain days per month per year
                                    if (Number(arrOfRainfall[k]) > 0) {
                                        noOfRainDaysAnalysis.push(arrOfRainfall[k]);
                                    }
                                    nrd = {...nrd, [getMonthlyMaxMonth(data[k].month)]: noOfRainDaysAnalysis.length};
                                    noOfRainDaysAnalysis = [];
    
                                    //no of dry days per month per year
                                    if (Number(arrOfRainfall[k]) === 0) {
                                        noOfDryDaysAnalysis.push(arrOfRainfall[k]);
                                    }
                                    ndd = {...ndd, [getMonthlyMaxMonth(data[k].month)]: noOfDryDaysAnalysis.length};
                                    noOfDryDaysAnalysis = [];
    
                                    //no of wet days > 25mm, 15mm and 10mm per month per year
                                    if (Number(arrOfRainfall[k]) > 25) {
                                        noOfWetDaysAnalysis25.push(arrOfRainfall[k]);
                                    }
                                    nwd25 = {...nwd25, [getMonthlyMaxMonth(data[k].month)]: noOfWetDaysAnalysis25.length};
                                    noOfWetDaysAnalysis25 = [];
                                    if (Number(arrOfRainfall[k]) > 15) {
                                        noOfWetDaysAnalysis15.push(arrOfRainfall[k]);
                                    }
                                    nwd15 = {...nwd15, [getMonthlyMaxMonth(data[k].month)]: noOfWetDaysAnalysis15.length};
                                    noOfWetDaysAnalysis15 = [];
                                    if (Number(arrOfRainfall[k]) > 10) {
                                        noOfWetDaysAnalysis10.push(arrOfRainfall[k]);
                                    }
                                    nwd10 = {...nwd10, [getMonthlyMaxMonth(data[k].month)]: noOfWetDaysAnalysis10.length};
                                    noOfWetDaysAnalysis10 = [];
    
    
                                    //highest rain per month consec continues for last day of month...
                                    if (Number(arrOfRainfall[k - 1]) > 0 && Number(arrOfRainfall[k]) > 0) {
                                        highestRainConsec1.push(Number(arrOfRainfall[k]));
                                        //amount of rain
                                        highestRainPerMonth1[`${data[k].year}${data[k].month}${data[k].day}`] = highestRainConsec1.reduce(function(a, b) {
                                            return a + b;
                                        }, 0);            
                                        ///no of days
                                        highestNodPerMonth1[`${data[k].year}${data[k].month}${data[k].day}`] = highestRainConsec1.length;
                                        highestRainConsec1 = [];
                                    } else {
                                        if (highestRainConsec1.length) {
                                            //amount of rain
                                            highestRainPerMonth1[`${data[k].year}${data[k].month}${data[k].day}`] = highestRainConsec1.reduce(function(a, b) {
                                                return a + b;
                                            }, 0);            
                                            //no of days
                                            highestNodPerMonth1[`${data[k].year}${data[k].month}${data[k].day}`] = highestRainConsec1.length;
                                            highestRainConsec1 = [];
                                        }                                        
                                    }                                    
                                    let hrpmValues = Object.values(highestRainPerMonth1);
                                    let hrpm = hrpmValues.length ? hrpmValues.reduce(function(a, b) {
                                        return Math.max(a, b);
                                    }) : 'n/a';
                                    //amount of rain
                                    hrpMonth = {...hrpMonth, [getMonthlyMaxMonth(data[k].month)]: hrpm};
                                    hrpMonth2 = {...hrpMonth2, [getMonthlyMaxMonth(data[k].month)]: hrpm === 'n/a' ? 0 : hrpm};
                                    //no of days
                                    hnodMonth = {...hnodMonth, [getMonthlyMaxMonth(data[k].month)]: Object.values(highestNodPerMonth1)[hrpmValues.indexOf(hrpm)] || 'n/a'};
                                    hnodMonth2 = {...hnodMonth2, [getMonthlyMaxMonth(data[k].month)]: Object.values(highestNodPerMonth1)[hrpmValues.indexOf(hrpm)] || 0};
                                    //reset
                                    highestRainPerMonth1 = {};
                                    highestNodPerMonth1 = {};                                    
    
                                    //highest no of dry days consec continues for last day of month...
                                    if (Number(arrOfRainfall[k - 1]) === 0 && Number(arrOfRainfall[k]) === 0) {
                                        highestDryConsec1.push(Number(arrOfRainfall[k]));
                                        ///no of days
                                        highestDryNodConsec[`${data[k].year}${data[k].month}${data[k].day}`] = highestDryConsec1.length;
                                        highestDryConsec1 = [];
                                    } else {
                                        if (highestDryConsec1.length) {                                            
                                            //no of days
                                            highestDryNodConsec[`${data[k].year}${data[k].month}${data[k].day}`] = highestDryConsec1.length;
                                            highestDryConsec1 = [];
                                        }                                        
                                    }                                    
                                    let hdnodConsecValues = Object.values(highestDryNodConsec);
                                    let hdnodConsecutive = hdnodConsecValues.length ? hdnodConsecValues.reduce(function(a, b) {
                                        return Math.max(a, b);
                                    }) : 'n/a';
                                    //amount of rain
                                    hdnodc = {...hdnodc, [getMonthlyMaxMonth(data[k].month)]: hdnodConsecutive};
                                    hdnodc2 = {...hdnodc2, [getMonthlyMaxMonth(data[k].month)]: hdnodConsecutive === 'n/a' ? 0 : hdnodConsecutive};
                                    //reset                                    
                                    highestDryNodConsec = {};
                                    //------------------------------------------------------------------------
                                    //month continues...for last day of month
                                    monthArray.push(Number(arrOfRainfall[k]));
                                    
                                    //Get max on the last day of month
                                    let maxOfMonthlyRain = monthArray.reduce(function(a, b) {
                                        return Math.max(a, b);
                                    });
    
                                    janToDecMax[getMonthlyMaxMonth(Number(data[k].month))] = maxOfMonthlyRain;
    
                                    //add up month rainfall data
                                    let sumOfMonthlyRain = monthArray.reduce(function(a, b) {
                                        return a + b;
                                    }, 0);
                                    //console.log(sumOfMonthlyRain)
                                    sumOfRainfallPerMonth[arrOfYearAndMonth[k]] = sumOfMonthlyRain;
    
                                    //preparing monthly filter
                                    janDecRainPerYear[getMonthlyMaxMonth(Number(y[1]))] = sumOfMonthlyRain;
                                    //janDecRainPerYear[getMonthlyMaxMonth(Number(y[1]))] = sumOfMonthlyRain;                                    

                                    janDecRainPerYearAvg[getMonthlyMaxMonth(Number(y[1]))] = Number(Number(sumOfMonthlyRain/monthArray.length).toFixed(2));
    
                                    //for averages Filter Table                                    
                                    if (data[k].month === 12) {                                        
                                        winterStartDecRainAvg[year1[i]] = sumOfMonthlyRain/monthArray.length;
                                    }
                                    
                                                                        
                                    //array to hold monthly data for monthly component
                                    if (filterControl === 'Monthly Raw Data') {
                                        forMonthlyTable.push({ 
                                            product_code: data[k].product_code,
                                            station_number: data[k].station_number,
                                            year: data[k].year,
                                            month: data[k].month,                                        
                                            rainfall_amount: Number(sumOfMonthlyRain).toFixed(2),
                                            quality: data[k].quality
                                        });
                                    }
                                    
    
                                    //for monthly line and bar chart. g means for graph (in monthly filter) 
                                    if (filterControl === 'Monthly Sort' || filterControl === 'Monthly') {
                                        if (data[k].month === 1) {
                                            g_jan.push({x: year1[i], y: sumOfMonthlyRain});
                                            
                                        } else if (data[k].month === 2) {
                                            g_feb.push({x: year1[i], y: sumOfMonthlyRain});
                                            
                                        } else if (data[k].month === 3) {
                                            g_mar.push({x: year1[i], y: sumOfMonthlyRain});
                                            
                                        } else if (data[k].month === 4) {
                                            g_apr.push({x: year1[i], y: sumOfMonthlyRain});
                                            
                                        } else if (data[k].month === 5) {
                                            g_may.push({x: year1[i], y: sumOfMonthlyRain});
                                            
                                        } else if (data[k].month === 6) {
                                            g_jun.push({x: year1[i], y: sumOfMonthlyRain});
                                            
                                        } else if (data[k].month === 7) {
                                            g_jul.push({x: year1[i], y: sumOfMonthlyRain});
                                            
                                        } else if (data[k].month === 8) {
                                            g_aug.push({x: year1[i], y: sumOfMonthlyRain});
                                            
                                        } else if (data[k].month === 9) {
                                            g_sep.push({x: year1[i], y: sumOfMonthlyRain});
                                            
                                        } else if (data[k].month === 10) {
                                            g_oct.push({x: year1[i], y: sumOfMonthlyRain});
                                            
                                        } else if (data[k].month === 11) {
                                            g_nov.push({x: year1[i], y: sumOfMonthlyRain});
                                            
                                        } else if (data[k].month === 12) {
                                            g_dec.push({x: year1[i], y: sumOfMonthlyRain});                                            
                                        }
                                    }
                                    
    
                                    //all months of the last year.
                                    if (filterControl === 'Overview') {
                                        if (String(data[k].year) === year1[year1.length - 1]) {                                        
                                            if (sumOfMonthlyRain) {                                            
                                                mainData[getMonthlyMaxMonth(Number(y[1]))] = sumOfMonthlyRain;
                                            } else {                                            
                                                mainData[getMonthlyMaxMonth(Number(y[1]))] = 'n/a';
                                            }
                                        }
                                    }                                                                        
    
    
                                    //reset
                                    monthArray = [];
                                }
                            }
                        }                        
    
                        //for daily cumulative
                        if (filterControl === 'Daily Cumulative') {
                            arrOfEachMonthRainPerYear.push({year: year1[i], r: eachDayRainPerMonth});
                            arrOfEachMonthRainPerYear2.push({year: year1[i], r: eachDayRainPerMonth2});
                        }
                        
    
                        //for data analysis
                        if (filterControl === 'Daily Analysis') {
                            forDailyAnalysis.push({
                                year: year1[i], rainfall_amount: {
                                    twenty_2, twenty_3, twenty_4, twenty_5, twenty_6, twenty_7, twenty_8,
                                    twenty_9, thirties, thirty_1, ones, twos, threes, fours, fives, sixes, sevens, eights, nines, tens, elevens, twelves,
                                    thirteens, fourteens, fifteens, sixteens, eighteens, nineteens, twenties, seveenteens, twenty_1
                                }
                            });
                            
                            //data analysis
                            mainData.forDailyAnalysis = forDailyAnalysis;
                                                
    
                            //for data analysis: max rain per month per year
                            janToDecMaxPerYear.push({year: year1[i], max: janToDecMax});
                            
                            //for data analysis: highest rain per month per year
                            //amount of rain
                            hrpmConsec.push({year: year1[i], r: hrpMonth});                        
                            //no of days
                            hnodConsec.push({year: year1[i], r: hnodMonth});
                            hnodConsec2.push({year: year1[i], r: hnodMonth2});
                            //no of dry days consec
                            hdnodConsec.push({year: year1[i], r: hdnodc});
                            hdnodConsec2.push({year: year1[i], r: hdnodc2});
                    
                            //for data analysis: number of rain days per month per year
                            nord.push({year: year1[i], r: nrd});
                            mainData.noOfRainDaysAnalysis = nord;                        
    
                            //for data analysis: number of dry days per month per year
                            nodd.push({year: year1[i], r: ndd});                        
                            mainData.noOfDryDaysAnalysis = nodd;                        
    
                            //for data analysis: number of wet days > 25mm, 15mm and 10mm per month per year
                            nowd25.push({year: year1[i], r: nwd25});                        
                            mainData.noOfWetDaysAnalysis25 = nowd25;                        
                            nowd15.push({year: year1[i], r: nwd15});                        
                            mainData.noOfWetDaysAnalysis15 = nowd15;                        
                            nowd10.push({year: year1[i], r: nwd10});                        
                            mainData.noOfWetDaysAnalysis10 = nowd10;
                        }
    
                        //sum of rainfall data by year;
                        let sumOfRainfall = arr.reduce(function(a, b) {
                            return a + b;
                        }, 0);
    
                        sumOfRainfallPerYear[year1[i]] = sumOfRainfall;
    
                        //lineChart Data
                        lineChartData.push({x: year1[i], y: sumOfRainfall});                                            
    
                        forAnnualTable.push({year: year1[i], rainfall_amount: Number(sumOfRainfall.toFixed(2))});
                        
                        //last year amount of rain
                        if (i === year1.length - 1) {
                            mainData.annualRainForLastYear = sumOfRainfall;                            
                        }
                        
    
                        //add up h1, h2, then q1-q4
                        let sumOfH1PerYear = h1.reduce(function(a, b) {
                            return a + b;
                        }, 0);
                        let sumOfH2PerYear = h2.reduce(function(a, b) {
                            return a + b;
                        }, 0);
                        let sumOfQ1PerYear = q1.reduce(function(a, b) {
                            return a + b;
                        }, 0);
                        let sumOfQ2PerYear = q2.reduce(function(a, b) {
                            return a + b;
                        }, 0);
                        let sumOfQ3PerYear = q3.reduce(function(a, b) {
                            return a + b;
                        }, 0);
                        let sumOfQ4PerYear = q4.reduce(function(a, b) {
                            return a + b;
                        }, 0);
                        let sumOfWinterPerYear = winter2.reduce(function(a, b) {
                            return a + b;
                        }, 0);
                        let sumOfSpringPerYear = spring2.reduce(function(a, b) {
                            return a + b;
                        }, 0);
                        let sumOfSummerPerYear = summer2.reduce(function(a, b) {
                            return a + b;
                        }, 0);
                        let sumOfAutumnPerYear = autumn2.reduce(function(a, b) {
                            return a + b;
                        }, 0);
    
                        
                            
                        //add winter start (last year december) rainfall to current winter rainfall
                        let wc = winter_cc.reduce(function(a, b) {
                            return a + b;
                        }, 0);
    
                        winterStartDecRain.push(wc);
    
                        //compute winter length to get mean average
                        //let winterLength = '';
                        if (winterStartDecRain[winterStartDecRain.length - 2]) {
                            sumOfWinterPerYear += winterStartDecRain[winterStartDecRain.length - 2];                        
                        }
    
                        if (filterControl === 'Monthly Sort' || filterControl === 'Monthly' || filterControl === 'Seasonal' || filterControl === 'Seasonal Sort' ||
                            filterControl === 'H1H2Q1Q4' || filterControl === 'H1H2Q1Q4 Sort' || filterControl === 'OJ Index' || filterControl === 'Test Select Year' || filterControl === 'OJ Index Sort') {
    
                            //then prepare {x: year, y: sum of var per year} for barChart
                            h_1.push({x: year1[i], y: sumOfH1PerYear});
                            h_2.push({x: year1[i], y: sumOfH2PerYear});
                            q_1.push({x: year1[i], y: sumOfQ1PerYear});
                            q_2.push({x: year1[i], y: sumOfQ2PerYear});
                            q_3.push({x: year1[i], y: sumOfQ3PerYear});
                            q_4.push({x: year1[i], y: sumOfQ4PerYear});
                            winter_1.push({x: year1[i], y: sumOfWinterPerYear});
                            spring_1.push({x: year1[i], y: sumOfSpringPerYear});
                            summer_1.push({x: year1[i], y: sumOfSummerPerYear});
                            autumn_1.push({x: year1[i], y: sumOfAutumnPerYear});
                        }
                        
                        //set season start
                        let from = '';
                        if (year1[i] === year1[0]) {
                            from = year1[i];
                        } else {
                            from = Number(year1[i]) - 1
                        }

                        //------------------------------------

                        //since 1960
                        if (filterControl === 'Since 1960') {
                            if (Number(year1[i]) === 1960) {                                
                                b2 = Number(sumOfRainfall);
                            }

                            if (Number(year1[i]) === 2019) {
                                b61 = Number(sumOfRainfall);
                            }
                            
                            if (Number(year1[0]) <= 1960 && Number(year1[i]) >= 1960 && Number(year1[i]) <= 2019) {
                                
                                //calculate 10 years interval/basis (from 1960).
                                if (Number(year1[i]) <= Number(since1960tenYearStart) + 9) {                                    
                                    let ann = Number(sumOfRainfall) || 0;

                                    forSince1960.push(ann || 0);
                                    if (Number(year1[i]) === Number(since1960tenYearStart) + 9) {                                        
                                       // let since1960tenYearEnd = year1[since1960_basis10 - 1];
                                        //let since1960tenYearStartAndEnd = since1960tenYearStart + '-' + since1960tenYearEnd;
                                        let e = forSince1960.reduce(function(a, b) {return a + b;}, 0);
                                        let f = e/10;
                                        since1960PerTenYears.push({//07067823134
                                            year: since1960tenYearStart + 's',
                                            e,
                                            f
                                        });

                                        eVals.push(e);
                                        fVals.push(f);

                                        forSince1960 = [];
        
                                        since1960tenYearStart = String(Number(since1960tenYearStart) + 10);
                                        //since1960_basis10 += 10;     
                                    }
                                }                                 
                            } else if (Number(year1[0]) > 1960 && Number(year1[i] <= 2019)) {
                                if (Number(year1[i]) <= Number(since1960_basis10) - 1) {
                                    let ann = Number(sumOfRainfall) || 0;

                                    forSince1960.push(ann || 0);

                                    //calculate 10 years interval/basis (for 1960)
                                    if (Number(year1[i]) === Number(since1960_basis10) - 1) {
                                        let e = forSince1960.reduce(function(a, b) {return a + b;}, 0);
                                        let f = e/10;
                                        since1960PerTenYears.push({
                                            year: since1960tenYearStart2 + 's',
                                            e,
                                            f
                                        });

                                        eVals.push(e);
                                        fVals.push(f);

                                        forSince1960 = [];
        
                                        since1960tenYearStart2 = since1960_basis10;
                                        since1960_basis10 = String(Number(since1960_basis10) + 10);
                                    }                                    
                                }                                
                            } 
                        }

                        //--------------------------------------

                        if (filterControl === 'Cool and Warm') {      
                            if (!isComputing) setIsComputing(true);
                            let nextYearJanToMar=[];                            
                            
                            //get january to march next year data for warm
                            //start looping from next year                            
                            //start of next year
                            scw.push(arr.length);
                            let scw2 = scw.reduce((a,b) => a+b,0);
                            let startCW = scw2;
                            let endCW = startCW + 100;
                            //weatherType: rainfall_amount, min_temp_celsius, max_temp_celsius, solar_exposure
                            for(let b = startCW; b <= endCW; b++) {
                                //console.log(data[b].year + ':' +  (Number(year1[i]) + 1))
                                if(data[b] && data[b].year === Number(year1[i]) + 1 && (data[b].month === 1 || data[b].month === 2 || data[b].month === 3)) {
                                    if (weatherType === 'Rainfall') {
                                        nextYearJanToMar.push(data[b].rainfall_amount !== -1?data[b].rainfall_amount:0)                                        
                                    } else if (weatherType === 'Minimum Temperature') {
                                        nextYearJanToMar.push(data[b].min_temp_celsius !== -1?data[b].min_temp_celsius:0)
                                    } else if (weatherType === 'Maximum Temperature') {
                                        nextYearJanToMar.push(data[b].max_temp_celsius !== -1?data[b].max_temp_celsius:0)
                                    } else if (weatherType === 'Solar Exposure') {
                                        nextYearJanToMar.push(data[b].solar_exposure !== -1?data[b].solar_exposure:0)
                                    }
                                } else break;
                            };   
                            if (isComputing) setIsComputing(false);
                            
                            let sumOfnextYearJanToMar = nextYearJanToMar.reduce((a, b) => a+b, 0);                            
                            //console.log(sumOfnextYearJanToMar)
                            
                            //for printing
                            let jan = janDecRainPerYear.Jan !== undefined ? Number(janDecRainPerYear.Jan) : 'n/a';
                            let feb = janDecRainPerYear.Feb !== undefined ? Number(janDecRainPerYear.Feb) : 'n/a';
                            let mar = janDecRainPerYear.Mar !== undefined ? Number(janDecRainPerYear.Mar) : 'n/a';
                            let apr = janDecRainPerYear.Apr !== undefined ? Number(janDecRainPerYear.Apr) : 'n/a';                            
                            let may = janDecRainPerYear.May !== undefined ? Number(janDecRainPerYear.May) : 'n/a';
                            let jun = janDecRainPerYear.Jun !== undefined ? Number(janDecRainPerYear.Jun) : 'n/a';
                            let jul = janDecRainPerYear.Jul !== undefined ? Number(janDecRainPerYear.Jul) : 'n/a';
                            let aug = janDecRainPerYear.Aug !== undefined ? Number(janDecRainPerYear.Aug) : 'n/a';
                            let sep = janDecRainPerYear.Sep !== undefined ? Number(janDecRainPerYear.Sep) : 'n/a';
                            let oct = janDecRainPerYear.Oct !== undefined ? Number(janDecRainPerYear.Oct) : 'n/a';
                            let nov = janDecRainPerYear.Nov !== undefined ? Number(janDecRainPerYear.Nov) : 'n/a';
                            let dec = janDecRainPerYear.Dec !== undefined ? Number(janDecRainPerYear.Dec) : 'n/a';

                            //for calculation                            
                            let apr2 = apr !== 'n/a' ? apr : 0;
                            let may2 = may !== 'n/a' ? may : 0;
                            let jun2 = jun !== 'n/a' ? jun : 0;
                            let jul2 = jul !== 'n/a' ? jul : 0;
                            let aug2 = aug !== 'n/a' ? aug : 0;
                            let sep2 = sep !== 'n/a' ? sep : 0;
                            let oct2 = oct !== 'n/a' ? oct : 0;
                            let nov2 = nov !== 'n/a' ? nov : 0;
                            let dec2 = dec !== 'n/a' ? dec : 0;                           
                            
                            let cool = apr2 + may2 + jun2 + jul2 + aug2 + sep2 + oct2;
                            let warm = nov2 + dec2 + sumOfnextYearJanToMar;

                            forCoolAndWarmFilterTable.push({
                                year: [year1[i]], jan, feb, mar, apr, may, jun, jul, aug, sep, oct, nov, dec, annual: Number(sumOfRainfall || 0),
                                cool, warm
                            });
                            
                            forCWAnnualTraversing.push(Number(sumOfRainfall || 0));
                            forCWCoolTraversing.push(cool);
                            forCWWarmTraversing.push(warm);

                            coolAndWarm_jan.push({x: year1[i], y: jan});
                            coolAndWarm_feb.push({x: year1[i], y: feb});
                            coolAndWarm_mar.push({x: year1[i], y: mar});
                            coolAndWarm_apr.push({x: year1[i], y: apr});
                            coolAndWarm_may.push({x: year1[i], y: may});
                            coolAndWarm_jun.push({x: year1[i], y: jun});
                            coolAndWarm_jul.push({x: year1[i], y: jul});
                            coolAndWarm_aug.push({x: year1[i], y: aug});
                            coolAndWarm_sep.push({x: year1[i], y: sep});
                            coolAndWarm_oct.push({x: year1[i], y: oct});
                            coolAndWarm_nov.push({x: year1[i], y: nov});
                            coolAndWarm_dec.push({x: year1[i], y: dec});
                            coolAndWarm_annual.push({x: year1[i], y: Number(sumOfRainfall || 0)});
                            coolAndWarm_cool.push({x: year1[i], y: cool});
                            coolAndWarm_warm.push({x: year1[i], y: warm});

                            mainData.forCoolAndWarmFilterTable = {forCoolAndWarmFilterTable, forCWAnnualTraversing, forCWCoolTraversing, forCWWarmTraversing};                            
                        }

                        //------------------------------

                        if (filterControl === 'Averages') {
    
                            let ann = janDecRainPerYearAvg.Jan + janDecRainPerYearAvg.Feb + janDecRainPerYearAvg.Mar + janDecRainPerYearAvg.Apr +
                            janDecRainPerYearAvg.May + janDecRainPerYearAvg.Jun + janDecRainPerYearAvg.Jul + janDecRainPerYearAvg.Aug +
                            janDecRainPerYearAvg.Sep + janDecRainPerYearAvg.Oct + janDecRainPerYearAvg.Nov + janDecRainPerYearAvg.Dec || 0
                            let qq1 = janDecRainPerYearAvg.Jan + janDecRainPerYearAvg.Feb + janDecRainPerYearAvg.Mar || 0;
                            let qq2 = janDecRainPerYearAvg.Apr + janDecRainPerYearAvg.May + janDecRainPerYearAvg.Jun || 0;
                            let qq3 = janDecRainPerYearAvg.Jul + janDecRainPerYearAvg.Aug + janDecRainPerYearAvg.Sep || 0;
                            let qq4 = janDecRainPerYearAvg.Oct + janDecRainPerYearAvg.Nov + janDecRainPerYearAvg.Dec || 0;
                            let hh1 = janDecRainPerYearAvg.Jan + janDecRainPerYearAvg.Feb + janDecRainPerYearAvg.Mar + janDecRainPerYearAvg.Apr +
                            janDecRainPerYearAvg.May + janDecRainPerYearAvg.Jun || 0;
                            let hh2 = janDecRainPerYearAvg.Jul + janDecRainPerYearAvg.Aug +
                            janDecRainPerYearAvg.Sep + janDecRainPerYearAvg.Oct + janDecRainPerYearAvg.Nov + janDecRainPerYearAvg.Dec || 0;
                            let win = janDecRainPerYearAvg.Jan + janDecRainPerYearAvg.Feb + winterStartDecRainAvg[year1[i - 1]] || 0;
                            let spr = janDecRainPerYearAvg.Mar + janDecRainPerYearAvg.Apr + janDecRainPerYearAvg.May || 0;
                            let summ = janDecRainPerYearAvg.Jun + janDecRainPerYearAvg.Jul + janDecRainPerYearAvg.Aug || 0;
                            let aut = janDecRainPerYearAvg.Sep + janDecRainPerYearAvg.Oct + janDecRainPerYearAvg.Nov || 0;                        
                        
                            forAveragesFilterTable.push({
                                year: [year1[i]], 
                                jan: Number(janDecRainPerYearAvg.Jan).toFixed(2) || -1, 
                                feb: Number(janDecRainPerYearAvg.Feb).toFixed(2) || -1,
                                mar: Number(janDecRainPerYearAvg.Mar).toFixed(2) || -1, 
                                apr: Number(janDecRainPerYearAvg.Apr).toFixed(2) || -1,
                                may: Number(janDecRainPerYearAvg.May).toFixed(2) || -1,
                                jun: Number(janDecRainPerYearAvg.Jun).toFixed(2) || -1,
                                jul: Number(janDecRainPerYearAvg.Jul).toFixed(2) || -1,
                                aug: Number(janDecRainPerYearAvg.Aug).toFixed(2) || -1,
                                sep: Number(janDecRainPerYearAvg.Sep).toFixed(2) || -1,
                                oct: Number(janDecRainPerYearAvg.Oct).toFixed(2) || -1,
                                nov: Number(janDecRainPerYearAvg.Nov).toFixed(2) || -1,
                                dec: Number(janDecRainPerYearAvg.Dec).toFixed(2) || -1,
                                annual: Number(ann).toFixed(2) || -1,
                                q1: Number(qq1).toFixed(2) || -1,
                                q2: Number(qq2).toFixed(2) || -1,
                                q3: Number(qq3).toFixed(2) || -1,
                                q4: Number(qq4).toFixed(2) || -1,
                                h1: Number(hh1).toFixed(2) || -1,
                                h2: Number(hh2).toFixed(2) || -1,
                                winter: Number(win).toFixed(2)  || -1,
                                spring: Number(spr).toFixed(2) || -1,
                                summer: Number(summ).toFixed(2) || -1,
                                autumn: Number(aut).toFixed(2) || -1,
                                from,
                                to: year1[i]
                            });
                        
                        
    
                            //for averages filter table 2
                            //long term average all years                        
                            forAvgLTA_jan.push(janDecRainPerYearAvg.Jan || 0);
                            forAvgLTA_feb.push(janDecRainPerYearAvg.Feb || 0);
                            forAvgLTA_mar.push(janDecRainPerYearAvg.Mar || 0);
                            forAvgLTA_apr.push(janDecRainPerYearAvg.Apr || 0);
                            forAvgLTA_may.push(janDecRainPerYearAvg.May || 0);
                            forAvgLTA_jun.push(janDecRainPerYearAvg.Jun || 0);
                            forAvgLTA_jul.push(janDecRainPerYearAvg.Jul || 0);
                            forAvgLTA_aug.push(janDecRainPerYearAvg.Aug || 0);
                            forAvgLTA_sep.push(janDecRainPerYearAvg.Sep || 0);
                            forAvgLTA_oct.push(janDecRainPerYearAvg.Oct || 0);
                            forAvgLTA_nov.push(janDecRainPerYearAvg.Nov || 0);
                            forAvgLTA_dec.push(janDecRainPerYearAvg.Dec || 0);
                            forAvgLTA_annual.push(ann || 0);
                            forAvgLTA_q1.push(qq1 || 0);
                            forAvgLTA_q2.push(qq2 || 0);
                            forAvgLTA_q3.push(qq3 || 0);
                            forAvgLTA_q4.push(qq4 || 0);
                            forAvgLTA_h1.push(hh1 || 0);
                            forAvgLTA_h2.push(hh2 || 0);
                            forAvgLTA_winter.push(win || 0);
                            forAvgLTA_spring.push(spr || 0);
                            forAvgLTA_summer.push(summ || 0);
                            forAvgLTA_autumn.push(aut || 0);
                            if (i === year1.length - 1) {
                                let ltaYearEnd = year1[year1.length - 1];
                                let ltaYearStartAndEnd = year1[0] + '-' + ltaYearEnd;
                                let jjan = forAvgLTA_jan.reduce(function(a, b) {return a + b;}, 0)/forAvgLTA_jan.length;
                                let ffeb = forAvgLTA_feb.reduce(function(a, b) {return a + b;}, 0)/forAvgLTA_feb.length;
                                let mmar = forAvgLTA_mar.reduce(function(a, b) {return a + b;}, 0)/forAvgLTA_mar.length;
                                let aapr = forAvgLTA_apr.reduce(function(a, b) {return a + b;}, 0)/forAvgLTA_apr.length;
                                let mmay = forAvgLTA_may.reduce(function(a, b) {return a + b;}, 0)/forAvgLTA_may.length;
                                let jjun = forAvgLTA_jun.reduce(function(a, b) {return a + b;}, 0)/forAvgLTA_jun.length;
                                let jjul = forAvgLTA_jul.reduce(function(a, b) {return a + b;}, 0)/forAvgLTA_jul.length;
                                let aaug = forAvgLTA_aug.reduce(function(a, b) {return a + b;}, 0)/forAvgLTA_aug.length;
                                let ssep = forAvgLTA_sep.reduce(function(a, b) {return a + b;}, 0)/forAvgLTA_sep.length;
                                let ooct = forAvgLTA_oct.reduce(function(a, b) {return a + b;}, 0)/forAvgLTA_oct.length;
                                let nnov = forAvgLTA_nov.reduce(function(a, b) {return a + b;}, 0)/forAvgLTA_nov.length;
                                let ddec = forAvgLTA_dec.reduce(function(a, b) {return a + b;}, 0)/forAvgLTA_dec.length;
                                let aann = forAvgLTA_annual.reduce(function(a, b) {return a + b;}, 0)/forAvgLTA_annual.length;
                                let qqq1 = forAvgLTA_q1.reduce(function(a, b) {return a + b;}, 0)/forAvgLTA_q1.length;
                                let qqq2 = forAvgLTA_q2.reduce(function(a, b) {return a + b;}, 0)/forAvgLTA_q2.length;
                                let qqq3 = forAvgLTA_q3.reduce(function(a, b) {return a + b;}, 0)/forAvgLTA_q3.length;
                                let qqq4 = forAvgLTA_q4.reduce(function(a, b) {return a + b;}, 0)/forAvgLTA_q4.length;
                                let hhh1 = forAvgLTA_h1.reduce(function(a, b) {return a + b;}, 0)/forAvgLTA_h1.length;
                                let hhh2 = forAvgLTA_h2.reduce(function(a, b) {return a + b;}, 0)/forAvgLTA_h2.length;
                                let wwin = forAvgLTA_winter.reduce(function(a, b) {return a + b;}, 0)/forAvgLTA_winter.length;
                                let sspr = forAvgLTA_spring.reduce(function(a, b) {return a + b;}, 0)/forAvgLTA_spring.length;
                                let ssumn = forAvgLTA_summer.reduce(function(a, b) {return a + b;}, 0)/forAvgLTA_summer.length;
                                let aaut = forAvgLTA_autumn.reduce(function(a, b) {return a + b;}, 0)/forAvgLTA_autumn.length;
                                ltaYearsAvg.push({
                                year: `LTA${ltaYearStartAndEnd}`,
                                    jan: Number(jjan).toFixed(2) || 0,
                                    feb: Number(ffeb).toFixed(2) || 0,
                                    mar: Number(mmar).toFixed(2) || 0,
                                    apr: Number(aapr).toFixed(2) || 0,
                                    may: Number(mmay).toFixed(2) || 0,
                                    jun: Number(jjun).toFixed(2) || 0,
                                    jul: Number(jjul).toFixed(2) || 0,
                                    aug: Number(aaug).toFixed(2) || 0,
                                    sep: Number(ssep).toFixed(2) || 0,
                                    oct: Number(ooct).toFixed(2) || 0,
                                    nov: Number(nnov).toFixed(2) || 0,
                                    dec: Number(ddec).toFixed(2) || 0,
                                    annual: Number(aann).toFixed(2) || 0,
                                    q1: Number(qqq1).toFixed(2) || 0,
                                    q2: Number(qqq2).toFixed(2) || 0,
                                    q3: Number(qqq3).toFixed(2) || 0,
                                    q4: Number(qqq4).toFixed(2) || 0,
                                    h1: Number(hhh1).toFixed(2) || 0,
                                    h2: Number(hhh2).toFixed(2) || 0,
                                    winter: Number(wwin).toFixed(2)  || 0,
                                    spring: Number(sspr).toFixed(2) || 0,
                                    summer: Number(ssumn).toFixed(2) || 0,
                                    autumn: Number(aaut).toFixed(2) || 0
                                });
                                avgChart2Annual[`LTA${ltaYearStartAndEnd}`] = {x: 'Annual', y: aann || 0};
                                
                                avgChart3monthJan.push({x: `LTA${ltaYearStartAndEnd}`, y: jjan || 0});
                                avgChart3monthFeb.push({x: `LTA${ltaYearStartAndEnd}`, y: ffeb || 0});
                                avgChart3monthMar.push({x: `LTA${ltaYearStartAndEnd}`, y: mmar || 0});
                                avgChart3monthApr.push({x: `LTA${ltaYearStartAndEnd}`, y: aapr || 0});
                                avgChart3monthMay.push({x: `LTA${ltaYearStartAndEnd}`, y: mmay || 0});
                                avgChart3monthJun.push({x: `LTA${ltaYearStartAndEnd}`, y: jjun || 0});
                                avgChart3monthJul.push({x: `LTA${ltaYearStartAndEnd}`, y: jjul || 0});
                                avgChart3monthAug.push({x: `LTA${ltaYearStartAndEnd}`, y: aaug || 0});
                                avgChart3monthSep.push({x: `LTA${ltaYearStartAndEnd}`, y: ssep || 0});
                                avgChart3monthOct.push({x: `LTA${ltaYearStartAndEnd}`, y: ooct || 0});
                                avgChart3monthNov.push({x: `LTA${ltaYearStartAndEnd}`, y: nnov || 0});
                                avgChart3monthDec.push({x: `LTA${ltaYearStartAndEnd}`, y: ddec || 0});
    
                                avgChart4h1h2[`LTA${ltaYearStartAndEnd}`] = [
                                    {x: 'H1', y: hhh1 || 0},
                                    {x: 'H2', y: hhh2 || 0}
                                ];
    
                                avgChart4q1q2q3q4[`LTA${ltaYearStartAndEnd}`] = [
                                    {x: 'Q1', y: qqq1 || 0},
                                    {x: 'Q2', y: qqq2 || 0},
                                    {x: 'Q3', y: qqq3 || 0},
                                    {x: 'Q4', y: qqq4 || 0}
                                ];
                            }
                            
    
                            //calculate 10 years interval/basis (for averages).                            
                            if (year1[basis10 - 1]) {                            
                                forAvg10_jan.push(janDecRainPerYearAvg.Jan || 0);
                                forAvg10_feb.push(janDecRainPerYearAvg.Feb || 0);
                                forAvg10_mar.push(janDecRainPerYearAvg.Mar || 0);
                                forAvg10_apr.push(janDecRainPerYearAvg.Apr || 0);
                                forAvg10_may.push(janDecRainPerYearAvg.May || 0);
                                forAvg10_jun.push(janDecRainPerYearAvg.Jun || 0);
                                forAvg10_jul.push(janDecRainPerYearAvg.Jul || 0);
                                forAvg10_aug.push(janDecRainPerYearAvg.Aug || 0);
                                forAvg10_sep.push(janDecRainPerYearAvg.Sep || 0);
                                forAvg10_oct.push(janDecRainPerYearAvg.Oct || 0);
                                forAvg10_nov.push(janDecRainPerYearAvg.Nov || 0);
                                forAvg10_dec.push(janDecRainPerYearAvg.Dec || 0);
                                forAvg10_annual.push(ann || 0);
                                forAvg10_q1.push(qq1 || 0);
                                forAvg10_q2.push(qq2 || 0);
                                forAvg10_q3.push(qq3 || 0);
                                forAvg10_q4.push(qq4 || 0);
                                forAvg10_h1.push(hh1 || 0);
                                forAvg10_h2.push(hh2 || 0);
                                forAvg10_winter.push(win || 0);
                                forAvg10_spring.push(spr || 0);
                                forAvg10_summer.push(summ || 0);
                                forAvg10_autumn.push(aut || 0);
                                if (i === basis10 - 1) {
                                    let tenYearEnd = year1[basis10 - 1];
                                    let tenYearStartAndEnd = tenYearStart + '-' + tenYearEnd;
                                    let jjan10 = forAvg10_jan.reduce(function(a, b) {return a + b;}, 0)/forAvg10_jan.length;
                                    let ffeb10 = forAvg10_feb.reduce(function(a, b) {return a + b;}, 0)/forAvg10_feb.length;
                                    let mmar10 = forAvg10_mar.reduce(function(a, b) {return a + b;}, 0)/forAvg10_mar.length;
                                    let aapr10 = forAvg10_apr.reduce(function(a, b) {return a + b;}, 0)/forAvg10_apr.length;
                                    let mmay10 = forAvg10_may.reduce(function(a, b) {return a + b;}, 0)/forAvg10_may.length;
                                    let jjun10 = forAvg10_jun.reduce(function(a, b) {return a + b;}, 0)/forAvg10_jun.length;
                                    let jjul10 = forAvg10_jul.reduce(function(a, b) {return a + b;}, 0)/forAvg10_jul.length;
                                    let aaug10 = forAvg10_aug.reduce(function(a, b) {return a + b;}, 0)/forAvg10_aug.length;
                                    let ssep10 = forAvg10_sep.reduce(function(a, b) {return a + b;}, 0)/forAvg10_sep.length;
                                    let ooct10 = forAvg10_oct.reduce(function(a, b) {return a + b;}, 0)/forAvg10_oct.length;
                                    let nnov10 = forAvg10_nov.reduce(function(a, b) {return a + b;}, 0)/forAvg10_nov.length;
                                    let ddec10 = forAvg10_dec.reduce(function(a, b) {return a + b;}, 0)/forAvg10_dec.length;
                                    let aann10 = forAvg10_annual.reduce(function(a, b) {return a + b;}, 0)/forAvg10_annual.length;
                                    let qqq110 = forAvg10_q1.reduce(function(a, b) {return a + b;}, 0)/forAvg10_q1.length;
                                    let qqq210 = forAvg10_q2.reduce(function(a, b) {return a + b;}, 0)/forAvg10_q2.length;
                                    let qqq310 = forAvg10_q3.reduce(function(a, b) {return a + b;}, 0)/forAvg10_q3.length;
                                    let qqq410 = forAvg10_q4.reduce(function(a, b) {return a + b;}, 0)/forAvg10_q4.length;
                                    let hhh110 = forAvg10_h1.reduce(function(a, b) {return a + b;}, 0)/forAvg10_h1.length;
                                    let hhh210 = forAvg10_h2.reduce(function(a, b) {return a + b;}, 0)/forAvg10_h2.length;
                                    let wwin10 = forAvg10_winter.reduce(function(a, b) {return a + b;}, 0)/forAvg10_winter.length;
                                    let sspr10 = forAvg10_spring.reduce(function(a, b) {return a + b;}, 0)/forAvg10_spring.length;
                                    let ssumn10 = forAvg10_summer.reduce(function(a, b) {return a + b;}, 0)/forAvg10_summer.length;
                                    let aaut10 = forAvg10_autumn.reduce(function(a, b) {return a + b;}, 0)/forAvg10_autumn.length;
                                    avgPerTenYears.push({
                                    year: `AVG${tenYearStartAndEnd}`,
                                    jan: Number(jjan10).toFixed(2) || 0,
                                    feb: Number(ffeb10).toFixed(2) || 0,
                                    mar: Number(mmar10).toFixed(2) || 0,
                                    apr: Number(aapr10).toFixed(2) || 0,
                                    may: Number(mmay10).toFixed(2) || 0,
                                    jun: Number(jjun10).toFixed(2) || 0,
                                    jul: Number(jjul10).toFixed(2) || 0,
                                    aug: Number(aaug10).toFixed(2) || 0,
                                    sep: Number(ssep10).toFixed(2) || 0,
                                    oct: Number(ooct10).toFixed(2) || 0,
                                    nov: Number(nnov10).toFixed(2) || 0,
                                    dec: Number(ddec10).toFixed(2) || 0,
                                    annual: Number(aann10).toFixed(2) || 0,
                                    q1: Number(qqq110).toFixed(2) || 0,
                                    q2: Number(qqq210).toFixed(2) || 0,
                                    q3: Number(qqq310).toFixed(2) || 0,
                                    q4: Number(qqq410).toFixed(2) || 0,
                                    h1: Number(hhh110).toFixed(2) || 0,
                                    h2: Number(hhh210).toFixed(2) || 0,
                                    winter: Number(wwin10).toFixed(2) || 0,
                                    spring: Number(sspr10).toFixed(2) || 0,
                                    summer: Number(ssumn10).toFixed(2) || 0,
                                    autumn: Number(aaut10).toFixed(2) || 0
                                    });
    
                                    avgChart1Winter.push({x: `AVG${tenYearStartAndEnd}`, y: wwin10 || 0});
                                    avgChart1Spring.push({x: `AVG${tenYearStartAndEnd}`, y: sspr10 || 0});
                                    avgChart1Summer.push({x: `AVG${tenYearStartAndEnd}`, y: ssumn10 || 0});
                                    avgChart1Autumn.push({x: `AVG${tenYearStartAndEnd}`, y: aaut10 || 0});
                                    
                                    avgChart2Annual[`AVG${tenYearStartAndEnd}`]= {x: "Annual", y: aann10 || 0};
    
                                    avgChart4h1h2[`AVG${tenYearStartAndEnd}`] = [
                                        {x: 'H1', y: hhh110 || 0},
                                        {x: 'H2', y: hhh210 || 0}
                                    ];
    
                                    avgChart4q1q2q3q4[`AVG${tenYearStartAndEnd}`] = [
                                        {x: 'Q1', y: qqq110 || 0},
                                        {x: 'Q2', y: qqq210 || 0},
                                        {x: 'Q3', y: qqq310 || 0},
                                        {x: 'Q4', y: qqq410 || 0}
                                    ];
    
                                    forAvg10_jan = []; forAvg10_feb = []; forAvg10_mar = [];; forAvg10_apr = []; forAvg10_may = []; forAvg10_jun = []; forAvg10_jul = []; forAvg10_aug = [];
                                    forAvg10_sep = []; forAvg10_oct = []; forAvg10_nov = []; forAvg10_dec = []; forAvg10_annual = []; forAvg10_q1 = []; forAvg10_q2 = []; forAvg10_q3 = [];
                                    forAvg10_q4 = []; forAvg10_h1 = []; forAvg10_h2 = []; forAvg10_winter = []; forAvg10_spring = []; forAvg10_summer = []; forAvg10_autumn = [];
    
                                    tenYearStart = year1[basis10];
                                    basis10 += 10;                                 
                                }
                            }
    
                            //calculate 50 years interval/basis (for averages).                            
                            if (year1[basis50 - 1]) {                            
                                forAvg50_jan.push(janDecRainPerYearAvg.Jan || 0);
                                forAvg50_feb.push(janDecRainPerYearAvg.Feb || 0);
                                forAvg50_mar.push(janDecRainPerYearAvg.Mar || 0);
                                forAvg50_apr.push(janDecRainPerYearAvg.Apr || 0);
                                forAvg50_may.push(janDecRainPerYearAvg.May || 0);
                                forAvg50_jun.push(janDecRainPerYearAvg.Jun || 0);
                                forAvg50_jul.push(janDecRainPerYearAvg.Jul || 0);
                                forAvg50_aug.push(janDecRainPerYearAvg.Aug || 0);
                                forAvg50_sep.push(janDecRainPerYearAvg.Sep || 0);
                                forAvg50_oct.push(janDecRainPerYearAvg.Oct || 0);
                                forAvg50_nov.push(janDecRainPerYearAvg.Nov || 0);
                                forAvg50_dec.push(janDecRainPerYearAvg.Dec || 0);
                                forAvg50_annual.push(ann || 0);
                                forAvg50_q1.push(qq1 || 0);
                                forAvg50_q2.push(qq2 || 0);
                                forAvg50_q3.push(qq3 || 0);
                                forAvg50_q4.push(qq4 || 0);
                                forAvg50_h1.push(hh1 || 0);
                                forAvg50_h2.push(hh2 || 0);
                                forAvg50_winter.push(win || 0);
                                forAvg50_spring.push(spr || 0);
                                forAvg50_summer.push(summ || 0);
                                forAvg50_autumn.push(aut || 0);                                
                                if (i === basis50 - 1) {
                                    let fiftyYearEnd = year1[basis50 - 1];
                                    let fiftyYearStartAndEnd = fiftyYearStart + '-' + fiftyYearEnd;
                                    let jjan50 = forAvg50_jan.reduce(function(a, b) {return a + b;}, 0)/forAvg50_jan.length;
                                    let ffeb50 = forAvg50_feb.reduce(function(a, b) {return a + b;}, 0)/forAvg50_feb.length;
                                    let mmar50 = forAvg50_mar.reduce(function(a, b) {return a + b;}, 0)/forAvg50_mar.length;
                                    let aapr50 = forAvg50_apr.reduce(function(a, b) {return a + b;}, 0)/forAvg50_apr.length;
                                    let mmay50 = forAvg50_may.reduce(function(a, b) {return a + b;}, 0)/forAvg50_may.length;
                                    let jjun50 = forAvg50_jun.reduce(function(a, b) {return a + b;}, 0)/forAvg50_jun.length;
                                    let jjul50 = forAvg50_jul.reduce(function(a, b) {return a + b;}, 0)/forAvg50_jul.length;
                                    let aaug50 = forAvg50_aug.reduce(function(a, b) {return a + b;}, 0)/forAvg50_aug.length;
                                    let ssep50 = forAvg50_sep.reduce(function(a, b) {return a + b;}, 0)/forAvg50_sep.length;
                                    let ooct50 = forAvg50_oct.reduce(function(a, b) {return a + b;}, 0)/forAvg50_oct.length;
                                    let nnov50 = forAvg50_nov.reduce(function(a, b) {return a + b;}, 0)/forAvg50_nov.length;
                                    let ddec50 = forAvg50_dec.reduce(function(a, b) {return a + b;}, 0)/forAvg50_dec.length;
                                    let aann50 = forAvg50_annual.reduce(function(a, b) {return a + b;}, 0)/forAvg50_annual.length;
                                    let qqq150 = forAvg50_q1.reduce(function(a, b) {return a + b;}, 0)/forAvg50_q1.length;
                                    let qqq250 = forAvg50_q2.reduce(function(a, b) {return a + b;}, 0)/forAvg50_q2.length;
                                    let qqq350 = forAvg50_q3.reduce(function(a, b) {return a + b;}, 0)/forAvg50_q3.length;
                                    let qqq450 = forAvg50_q4.reduce(function(a, b) {return a + b;}, 0)/forAvg50_q4.length;
                                    let hhh150 = forAvg50_h1.reduce(function(a, b) {return a + b;}, 0)/forAvg50_h1.length;
                                    let hhh250 = forAvg50_h2.reduce(function(a, b) {return a + b;}, 0)/forAvg50_h2.length;
                                    let wwin50 = forAvg50_winter.reduce(function(a, b) {return a + b;}, 0)/forAvg50_winter.length;
                                    let sspr50 = forAvg50_spring.reduce(function(a, b) {return a + b;}, 0)/forAvg50_spring.length;
                                    let ssumn50 = forAvg50_summer.reduce(function(a, b) {return a + b;}, 0)/forAvg50_summer.length;
                                    let aaut50 = forAvg50_autumn.reduce(function(a, b) {return a + b;}, 0)/forAvg50_autumn.length;
                                    avgPerFiftyYears.push({
                                    year: `AVG${fiftyYearStartAndEnd}`,
                                    jan: Number(jjan50).toFixed(2) || 0,
                                    feb: Number(ffeb50).toFixed(2) || 0,
                                    mar: Number(mmar50).toFixed(2) || 0,
                                    apr: Number(aapr50).toFixed(2) || 0,
                                    may: Number(mmay50).toFixed(2) || 0,
                                    jun: Number(jjun50).toFixed(2) || 0,
                                    jul: Number(jjul50).toFixed(2) || 0,
                                    aug: Number(aaug50).toFixed(2) || 0,
                                    sep: Number(ssep50).toFixed(2) || 0,
                                    oct: Number(ooct50).toFixed(2) || 0,
                                    nov: Number(nnov50).toFixed(2) || 0,
                                    dec: Number(ddec50).toFixed(2) || 0,
                                    annual: Number(aann50).toFixed(2) || 0,
                                    q1: Number(qqq150).toFixed(2) || 0,
                                    q2: Number(qqq250).toFixed(2) || 0,
                                    q3: Number(qqq350).toFixed(2) || 0,
                                    q4: Number(qqq450).toFixed(2) || 0,
                                    h1: Number(hhh150).toFixed(2) || 0,
                                    h2: Number(hhh250).toFixed(2) || 0,
                                    winter: Number(wwin50).toFixed(2) || 0,
                                    spring: Number(sspr50).toFixed(2) || 0,
                                    summer: Number(ssumn50).toFixed(2) || 0,
                                    autumn: Number(aaut50).toFixed(2) || 0
                                    });
                                    
                                    avgChart2Annual[`AVG${fiftyYearStartAndEnd}`] = {x: 'Annual', y: aann50 || 0};
    
                                    avgChart3monthJan.push({x: `AVG${fiftyYearStartAndEnd}`, y: jjan50 || 0});
                                    avgChart3monthFeb.push({x: `AVG${fiftyYearStartAndEnd}`, y: ffeb50 || 0});
                                    avgChart3monthMar.push({x: `AVG${fiftyYearStartAndEnd}`, y: mmar50 || 0});
                                    avgChart3monthApr.push({x: `AVG${fiftyYearStartAndEnd}`, y: aapr50 || 0});
                                    avgChart3monthMay.push({x: `AVG${fiftyYearStartAndEnd}`, y: mmay50 || 0});
                                    avgChart3monthJun.push({x: `AVG${fiftyYearStartAndEnd}`, y: jjun50 || 0});
                                    avgChart3monthJul.push({x: `AVG${fiftyYearStartAndEnd}`, y: jjul50 || 0});
                                    avgChart3monthAug.push({x: `AVG${fiftyYearStartAndEnd}`, y: aaug50 || 0});
                                    avgChart3monthSep.push({x: `AVG${fiftyYearStartAndEnd}`, y: ssep50 || 0});
                                    avgChart3monthOct.push({x: `AVG${fiftyYearStartAndEnd}`, y: ooct50 || 0});
                                    avgChart3monthNov.push({x: `AVG${fiftyYearStartAndEnd}`, y: nnov50 || 0});
                                    avgChart3monthDec.push({x: `AVG${fiftyYearStartAndEnd}`, y: ddec50 || 0});
    
                                    avgChart4h1h2[`AVG${fiftyYearStartAndEnd}`] = [
                                        {x: 'H1', y: hhh150 || 0},
                                        {x: 'H2', y: hhh250 || 0}
                                    ];
    
                                    avgChart4q1q2q3q4[`AVG${fiftyYearStartAndEnd}`] = [
                                        {x: 'Q1', y: qqq150 || 0},
                                        {x: 'Q2', y: qqq250 || 0},
                                        {x: 'Q3', y: qqq350 || 0},
                                        {x: 'Q4', y: qqq450 || 0}
                                    ];
    
                                    forAvg50_jan = []; forAvg50_feb = []; forAvg50_mar = [];; forAvg50_apr = []; forAvg50_may = []; forAvg50_jun = []; forAvg50_jul = []; forAvg50_aug = [];
                                    forAvg50_sep = []; forAvg50_oct = []; forAvg50_nov = []; forAvg50_dec = []; forAvg50_annual = []; forAvg50_q1 = []; forAvg50_q2 = []; forAvg50_q3 = [];
                                    forAvg50_q4 = []; forAvg50_h1 = []; forAvg50_h2 = []; forAvg50_winter = []; forAvg50_spring = []; forAvg50_summer = []; forAvg50_autumn = [];
    
                                    fiftyYearStart = year1[basis50];
                                    basis50 += 50;                                 
                                }
                            }                           
                            
    
                            //calculate last 100 years average (for averages).                            
                            if (Number(year1[i]) >= Number(last100YearStart)) {                            
                                forAvg100_jan.push(janDecRainPerYearAvg.Jan || 0);
                                forAvg100_feb.push(janDecRainPerYearAvg.Feb || 0);
                                forAvg100_mar.push(janDecRainPerYearAvg.Mar || 0);
                                forAvg100_apr.push(janDecRainPerYearAvg.Apr || 0);
                                forAvg100_may.push(janDecRainPerYearAvg.May || 0);
                                forAvg100_jun.push(janDecRainPerYearAvg.Jun || 0);
                                forAvg100_jul.push(janDecRainPerYearAvg.Jul || 0);
                                forAvg100_aug.push(janDecRainPerYearAvg.Aug || 0);
                                forAvg100_sep.push(janDecRainPerYearAvg.Sep || 0);
                                forAvg100_oct.push(janDecRainPerYearAvg.Oct || 0);
                                forAvg100_nov.push(janDecRainPerYearAvg.Nov || 0);
                                forAvg100_dec.push(janDecRainPerYearAvg.Dec || 0);
                                forAvg100_annual.push(ann || 0);
                                forAvg100_q1.push(qq1 || 0);
                                forAvg100_q2.push(qq2 || 0);
                                forAvg100_q3.push(qq3 || 0);
                                forAvg100_q4.push(qq4 || 0);
                                forAvg100_h1.push(hh1 || 0);
                                forAvg100_h2.push(hh2 || 0);
                                forAvg100_winter.push(win || 0);
                                forAvg100_spring.push(spr || 0);
                                forAvg100_summer.push(summ || 0);
                                forAvg100_autumn.push(aut || 0);
                                if (i === year1.length - 1) {
                                    let last100YearEnd = year1[year1.length - 1];
                                    let last100YearStartAndEnd = last100YearStart + '-' + last100YearEnd;
                                    let jjan_100 = forAvg100_jan.reduce(function(a, b) {return a + b;}, 0)/forAvg100_jan.length;
                                    let ffeb_100 = forAvg100_feb.reduce(function(a, b) {return a + b;}, 0)/forAvg100_feb.length;
                                    let mmar_100 = forAvg100_mar.reduce(function(a, b) {return a + b;}, 0)/forAvg100_mar.length;
                                    let aapr_100 = forAvg100_apr.reduce(function(a, b) {return a + b;}, 0)/forAvg100_apr.length;
                                    let mmay_100 = forAvg100_may.reduce(function(a, b) {return a + b;}, 0)/forAvg100_may.length;
                                    let jjun_100 = forAvg100_jun.reduce(function(a, b) {return a + b;}, 0)/forAvg100_jun.length;
                                    let jjul_100 = forAvg100_jul.reduce(function(a, b) {return a + b;}, 0)/forAvg100_jul.length;
                                    let aaug_100 = forAvg100_aug.reduce(function(a, b) {return a + b;}, 0)/forAvg100_aug.length;
                                    let ssep_100 = forAvg100_sep.reduce(function(a, b) {return a + b;}, 0)/forAvg100_sep.length;
                                    let ooct_100 = forAvg100_oct.reduce(function(a, b) {return a + b;}, 0)/forAvg100_oct.length;
                                    let nnov_100 = forAvg100_nov.reduce(function(a, b) {return a + b;}, 0)/forAvg100_nov.length;
                                    let ddec_100 = forAvg100_dec.reduce(function(a, b) {return a + b;}, 0)/forAvg100_dec.length;
                                    let aann_100 = forAvg100_annual.reduce(function(a, b) {return a + b;}, 0)/forAvg100_annual.length;
                                    let qqq1_100 = forAvg100_q1.reduce(function(a, b) {return a + b;}, 0)/forAvg100_q1.length;
                                    let qqq2_100 = forAvg100_q2.reduce(function(a, b) {return a + b;}, 0)/forAvg100_q2.length;
                                    let qqq3_100 = forAvg100_q3.reduce(function(a, b) {return a + b;}, 0)/forAvg100_q3.length;
                                    let qqq4_100 = forAvg100_q4.reduce(function(a, b) {return a + b;}, 0)/forAvg100_q4.length;
                                    let hhh1_100 = forAvg100_h1.reduce(function(a, b) {return a + b;}, 0)/forAvg100_h1.length;
                                    let hhh2_100 = forAvg100_h2.reduce(function(a, b) {return a + b;}, 0)/forAvg100_h2.length;
                                    let wwin_100 = forAvg100_winter.reduce(function(a, b) {return a + b;}, 0)/forAvg100_winter.length;
                                    let sspr_100 = forAvg100_spring.reduce(function(a, b) {return a + b;}, 0)/forAvg100_spring.length;
                                    let ssumn_100 = forAvg100_summer.reduce(function(a, b) {return a + b;}, 0)/forAvg100_summer.length;
                                    let aaut_100 = forAvg100_autumn.reduce(function(a, b) {return a + b;}, 0)/forAvg100_autumn.length;
                                    last100YearAvg.push({
                                    year: `AVG${last100YearStartAndEnd}`,
                                    jan: Number(jjan_100).toFixed(2) || 0,
                                    feb: Number(ffeb_100).toFixed(2) || 0,
                                    mar: Number(mmar_100).toFixed(2) || 0,
                                    apr: Number(aapr_100).toFixed(2) || 0,
                                    may: Number(mmay_100).toFixed(2) || 0,
                                    jun: Number(jjun_100).toFixed(2) || 0,
                                    jul: Number(jjul_100).toFixed(2) || 0,
                                    aug: Number(aaug_100).toFixed(2) || 0,
                                    sep: Number(ssep_100).toFixed(2) || 0,
                                    oct: Number(ooct_100).toFixed(2) || 0,
                                    nov: Number(nnov_100).toFixed(2) || 0,
                                    dec: Number(ddec_100).toFixed(2) || 0,
                                    annual: Number(aann_100).toFixed(2) || 0,
                                    q1: Number(qqq1_100).toFixed(2) || 0,
                                    q2: Number(qqq2_100).toFixed(2) || 0,
                                    q3: Number(qqq3_100).toFixed(2) || 0,
                                    q4: Number(qqq4_100).toFixed(2) || 0,
                                    h1: Number(hhh1_100).toFixed(2) || 0,
                                    h2: Number(hhh2_100).toFixed(2) || 0,
                                    winter: Number(wwin_100).toFixed(2) || 0,
                                    spring: Number(sspr_100).toFixed(2) || 0,
                                    summer: Number(ssumn_100).toFixed(2) || 0,
                                    autumn: Number(aaut_100).toFixed(2) || 0
                                    });                                                               
                                    avgChart2Annual[`AVG${last100YearStartAndEnd}`] = {x: 'Annual', y: aann_100 || 0};
    
                                    avgChart3monthJan.push({x: `AVG${last100YearStartAndEnd}`, y: jjan_100 || 0});
                                    avgChart3monthFeb.push({x: `AVG${last100YearStartAndEnd}`, y: ffeb_100 || 0});
                                    avgChart3monthMar.push({x: `AVG${last100YearStartAndEnd}`, y: mmar_100 || 0});
                                    avgChart3monthApr.push({x: `AVG${last100YearStartAndEnd}`, y: aapr_100 || 0});
                                    avgChart3monthMay.push({x: `AVG${last100YearStartAndEnd}`, y: mmay_100 || 0});
                                    avgChart3monthJun.push({x: `AVG${last100YearStartAndEnd}`, y: jjun_100 || 0});
                                    avgChart3monthJul.push({x: `AVG${last100YearStartAndEnd}`, y: jjul_100 || 0});
                                    avgChart3monthAug.push({x: `AVG${last100YearStartAndEnd}`, y: aaug_100 || 0});
                                    avgChart3monthSep.push({x: `AVG${last100YearStartAndEnd}`, y: ssep_100 || 0});
                                    avgChart3monthOct.push({x: `AVG${last100YearStartAndEnd}`, y: ooct_100 || 0});
                                    avgChart3monthNov.push({x: `AVG${last100YearStartAndEnd}`, y: nnov_100 || 0});
                                    avgChart3monthDec.push({x: `AVG${last100YearStartAndEnd}`, y: ddec_100 || 0});
    
                                    avgChart4h1h2[`AVG${last100YearStartAndEnd}`] = [
                                        {x: 'H1', y: hhh1_100 || 0},
                                        {x: 'H2', y: hhh2_100 || 0}
                                    ];
    
                                    avgChart4q1q2q3q4[`AVG${last100YearStartAndEnd}`] = [
                                        {x: 'Q1', y: qqq1_100 || 0},
                                        {x: 'Q2', y: qqq2_100 || 0},
                                        {x: 'Q3', y: qqq3_100 || 0},
                                        {x: 'Q4', y: qqq4_100 || 0}
                                    ];
                                }
                            }
                            
                            //calculate last 5 years average (for averages filter table 2).
                            if (year1[year1.length - 6] && Number(year1[i]) >= Number(year1[year1.length - 6]) && year1[i] !== year1[year1.length - 1]) {
                                forAvg5_jan.push(janDecRainPerYearAvg.Jan || 0);
                                forAvg5_feb.push(janDecRainPerYearAvg.Feb || 0);
                                forAvg5_mar.push(janDecRainPerYearAvg.Mar || 0);
                                forAvg5_apr.push(janDecRainPerYearAvg.Apr || 0);
                                forAvg5_may.push(janDecRainPerYearAvg.May || 0);
                                forAvg5_jun.push(janDecRainPerYearAvg.Jun || 0);
                                forAvg5_jul.push(janDecRainPerYearAvg.Jul || 0);
                                forAvg5_aug.push(janDecRainPerYearAvg.Aug || 0);
                                forAvg5_sep.push(janDecRainPerYearAvg.Sep || 0);
                                forAvg5_oct.push(janDecRainPerYearAvg.Oct || 0);
                                forAvg5_nov.push(janDecRainPerYearAvg.Nov || 0);
                                forAvg5_dec.push(janDecRainPerYearAvg.Dec || 0);
                                forAvg5_annual.push(ann || 0);
                                forAvg5_q1.push(qq1 || 0);
                                forAvg5_q2.push(qq2 || 0);
                                forAvg5_q3.push(qq3 || 0);
                                forAvg5_q4.push(qq4 || 0);
                                forAvg5_h1.push(hh1 || 0);
                                forAvg5_h2.push(hh2 || 0);
                                forAvg5_winter.push(win || 0);
                                forAvg5_spring.push(spr || 0);
                                forAvg5_summer.push(summ || 0);
                                forAvg5_autumn.push(aut || 0);                                
                                if (i === year1.length - 2) {                                
                                    let jjan_5 = forAvg5_jan.reduce(function(a, b) {return a + b;}, 0)/forAvg5_jan.length;
                                    let ffeb_5 = forAvg5_feb.reduce(function(a, b) {return a + b;}, 0)/forAvg5_feb.length;
                                    let mmar_5 = forAvg5_mar.reduce(function(a, b) {return a + b;}, 0)/forAvg5_mar.length;
                                    let aapr_5 = forAvg5_apr.reduce(function(a, b) {return a + b;}, 0)/forAvg5_apr.length;
                                    let mmay_5 = forAvg50_may.reduce(function(a, b) {return a + b;}, 0)/forAvg5_may.length;
                                    let jjun_5 = forAvg5_jun.reduce(function(a, b) {return a + b;}, 0)/forAvg5_jun.length;
                                    let jjul_5 = forAvg5_jul.reduce(function(a, b) {return a + b;}, 0)/forAvg5_jul.length;
                                    let aaug_5 = forAvg5_aug.reduce(function(a, b) {return a + b;}, 0)/forAvg5_aug.length;
                                    let ssep_5 = forAvg5_sep.reduce(function(a, b) {return a + b;}, 0)/forAvg5_sep.length;
                                    let ooct_5 = forAvg5_oct.reduce(function(a, b) {return a + b;}, 0)/forAvg5_oct.length;
                                    let nnov_5 = forAvg5_nov.reduce(function(a, b) {return a + b;}, 0)/forAvg5_nov.length;
                                    let ddec_5 = forAvg5_dec.reduce(function(a, b) {return a + b;}, 0)/forAvg5_dec.length;
                                    let aann_5 = forAvg5_annual.reduce(function(a, b) {return a + b;}, 0)/forAvg5_annual.length;
                                    let qqq1_5 = forAvg5_q1.reduce(function(a, b) {return a + b;}, 0)/forAvg5_q1.length;
                                    let qqq2_5 = forAvg5_q2.reduce(function(a, b) {return a + b;}, 0)/forAvg5_q2.length;
                                    let qqq3_5 = forAvg5_q3.reduce(function(a, b) {return a + b;}, 0)/forAvg5_q3.length;
                                    let qqq4_5 = forAvg5_q4.reduce(function(a, b) {return a + b;}, 0)/forAvg5_q4.length;
                                    let hhh1_5 = forAvg5_h1.reduce(function(a, b) {return a + b;}, 0)/forAvg5_h1.length;
                                    let hhh2_5 = forAvg5_h2.reduce(function(a, b) {return a + b;}, 0)/forAvg5_h2.length;
                                    let wwin_5 = forAvg5_winter.reduce(function(a, b) {return a + b;}, 0)/forAvg5_winter.length;
                                    let sspr_5 = forAvg5_spring.reduce(function(a, b) {return a + b;}, 0)/forAvg5_spring.length;
                                    let ssumn_5 = forAvg5_summer.reduce(function(a, b) {return a + b;}, 0)/forAvg5_summer.length;
                                    let aaut_5 = forAvg5_autumn.reduce(function(a, b) {return a + b;}, 0)/forAvg5_autumn.length;
                                    avgPerFiveYears.push({
                                    year: '5 Year AVG',
                                    jan: Number(jjan_5).toFixed(2) || 0,
                                    feb: Number(ffeb_5).toFixed(2) || 0,
                                    mar: Number(mmar_5).toFixed(2) || 0,
                                    apr: Number(aapr_5).toFixed(2) || 0,
                                    may: Number(mmay_5).toFixed(2) || 0,
                                    jun: Number(jjun_5).toFixed(2) || 0,
                                    jul: Number(jjul_5).toFixed(2) || 0,
                                    aug: Number(aaug_5).toFixed(2) || 0,
                                    sep: Number(ssep_5).toFixed(2) || 0,
                                    oct: Number(ooct_5).toFixed(2) || 0,
                                    nov: Number(nnov_5).toFixed(2) || 0,
                                    dec: Number(ddec_5).toFixed(2) || 0,
                                    annual: Number(aann_5).toFixed(2) || 0,
                                    q1: Number(qqq1_5).toFixed(2) || 0,
                                    q2: Number(qqq2_5).toFixed(2) || 0,
                                    q3: Number(qqq3_5).toFixed(2) || 0,
                                    q4: Number(qqq4_5).toFixed(2) || 0,
                                    h1: Number(hhh1_5).toFixed(2) || 0,
                                    h2: Number(hhh2_5).toFixed(2) || 0,
                                    winter: Number(wwin_5).toFixed(2) || 0,
                                    spring: Number(sspr_5).toFixed(2) || 0,
                                    summer: Number(ssumn_5).toFixed(2) || 0,
                                    autumn: Number(aaut_5).toFixed(2) || 0
                                    });
    
                                    avgChart1Winter.push({x: '5 Year AVG', y: wwin_5 || 0});
                                    avgChart1Spring.push({x: '5 Year AVG', y: sspr_5 || 0});
                                    avgChart1Summer.push({x: '5 Year AVG', y: ssumn_5 || 0});
                                    avgChart1Autumn.push({x: '5 Year AVG', y: aaut_5 || 0});
    
                                    avgChart2Annual['5 Year AVG'] = {x: 'Annual', y: aann_5 || 0};
    
                                    avgChart3monthJan.push({x: '5 Year AVG', y: jjan_5 || 0});
                                    avgChart3monthFeb.push({x: '5 Year AVG', y: ffeb_5 || 0});
                                    avgChart3monthMar.push({x: '5 Year AVG', y: mmar_5 || 0});
                                    avgChart3monthApr.push({x: '5 Year AVG', y: aapr_5 || 0});
                                    avgChart3monthMay.push({x: '5 Year AVG', y: mmay_5 || 0});
                                    avgChart3monthJun.push({x: '5 Year AVG', y: jjun_5 || 0});
                                    avgChart3monthJul.push({x: '5 Year AVG', y: jjul_5 || 0});
                                    avgChart3monthAug.push({x: '5 Year AVG', y: aaug_5 || 0});
                                    avgChart3monthSep.push({x: '5 Year AVG', y: ssep_5 || 0});
                                    avgChart3monthOct.push({x: '5 Year AVG', y: ooct_5 || 0});
                                    avgChart3monthNov.push({x: '5 Year AVG', y: nnov_5 || 0});
                                    avgChart3monthDec.push({x: '5 Year AVG', y: ddec_5 || 0});
    
                                    avgChart4h1h2['5 Year AVG'] = [
                                        {x: 'H1', y: hhh1_5 || 0},
                                        {x: 'H2', y: hhh2_5 || 0}
                                    ];
    
                                    avgChart4q1q2q3q4['5 Year AVG'] = [
                                        {x: 'Q1', y: qqq1_5 || 0},
                                        {x: 'Q2', y: qqq2_5 || 0},
                                        {x: 'Q3', y: qqq3_5 || 0},
                                        {x: 'Q4', y: qqq4_5 || 0}
                                    ];
                                }
                            }
                        
    
                        
                            //for averages line chart
                            forAveragesLineChart.push({x: year1[i], y: sumOfRainfall/arr.length || 0});
                        }
    
                        //------------------------------
                        
                        //for monthly, seasonal and H1H2Q1Q4 filter table
                        if (filterControl === 'Monthly Sort' || filterControl === 'Monthly' || filterControl === 'Seasonal' || filterControl === 'Seasonal Sort' ||
                            filterControl === 'H1H2Q1Q4' || filterControl === 'H1H2Q1Q4 Sort' || filterControl === 'OJ Index' || filterControl === 'Test Select Year' || filterControl === 'OJ Index Sort') {
                            forMonthlyFilterTable.push({
                                year: [year1[i]], 
                                jan: Number(janDecRainPerYear.Jan) || 0, 
                                feb: Number(janDecRainPerYear.Feb) || 0,
                                mar: Number(janDecRainPerYear.Mar) || 0, 
                                apr: Number(janDecRainPerYear.Apr) || 0,
                                may: Number(janDecRainPerYear.May) || 0,
                                jun: Number(janDecRainPerYear.Jun) || 0,
                                jul: Number(janDecRainPerYear.Jul) || 0,
                                aug: Number(janDecRainPerYear.Aug) || 0,
                                sep: Number(janDecRainPerYear.Sep) || 0,
                                oct: Number(janDecRainPerYear.Oct) || 0,
                                nov: Number(janDecRainPerYear.Nov) || 0,
                                dec: Number(janDecRainPerYear.Dec) || 0,
                                annual: Number(sumOfRainfall) || 0,
                                from,
                                to: year1[i],
                                q1: Number(sumOfQ1PerYear).toFixed(2) || -1,
                                q2: Number(sumOfQ2PerYear).toFixed(2) || -1, 
                                q3: Number(sumOfQ3PerYear).toFixed(2) || -1, 
                                q4: Number(sumOfQ4PerYear).toFixed(2) || -1,
                                h1: Number(sumOfH1PerYear).toFixed(2) || -1,
                                h2: Number(sumOfH2PerYear).toFixed(2) || -1,
                                winter: Number(sumOfWinterPerYear).toFixed(2) || -1,
                                spring: Number(sumOfSpringPerYear).toFixed(2) || -1,
                                summer: Number(sumOfSummerPerYear).toFixed(2) || -1,
                                autumn: Number(sumOfAutumnPerYear).toFixed(2) || -1
                            });
    
                            
                            //add up ad for aj, sd for sj, od for oj
                            ad = ad.reduce(function(a, b) {
                                return a + b;
                            }, 0);
    
                            sd = sd.reduce(function(a, b) {
                                return a + b;
                            }, 0);
    
                            od = od.reduce(function(a, b) {
                                return a + b;
                            }, 0);
                            
                            forOJIndexTable.push({
                                yearFrom: `${year1[i]}-${(String(Number(year1[i]) + 1)[2])}${(String(Number(year1[i]) + 1)[3])}`,                            
                                aj: ad,
                                sj: sd,
                                oj: od
                            });
    
                            //for OJ Index line chart
                            oji.push({x: `${year1[i]}.${(String(Number(year1[i]) + 1)[2])}${(String(Number(year1[i]) + 1)[3])}`, y: od});
                            sji.push({x: `${year1[i]}.${(String(Number(year1[i]) + 1)[2])}${(String(Number(year1[i]) + 1)[3])}`, y: sd});
                            aji.push({x: `${year1[i]}.${(String(Number(year1[i]) + 1)[2])}${(String(Number(year1[i]) + 1)[3])}`, y: ad});
    
                         /*
                            if (forOJIndexTable[forOJIndexTable.length-2]) {
                                oji[oji.length-2] = {...oji[oji.length-2], y: Number(oji[oji.length-2]) + Number(janDecRainPerYear.Jan)};
                                sji[sji.length-2] = {...sji[sji.length-2], y: Number(sji[sji.length-2]) + Number(janDecRainPerYear.Jan)};
                                aji[aji.length-2] = {...aji[aji.length-2], y: Number(aji[aji.length-2]) + Number(janDecRainPerYear.Jan)};
    
                                if (Number(year1[i]) === forOJIndexTable[forOJIndexTable.length-2].yearTo) {
    
                                    let aj = Number(forOJIndexTable[forOJIndexTable.length-2].aj) + Number(janDecRainPerYear.Jan);
                                    let sj = Number(forOJIndexTable[forOJIndexTable.length-2].sj) + Number(janDecRainPerYear.Jan);
                                    let oj = Number(forOJIndexTable[forOJIndexTable.length-2].oj) + Number(janDecRainPerYear.Jan);
    
                                    forOJIndexTable[forOJIndexTable.length-2] = {
                                        ...forOJIndexTable[forOJIndexTable.length-2], 
                                        aj,
                                        sj,
                                        oj
                                    };
                                }
                            }*/
                        }

                        if (filterControl === "Overview") {                            
                            rank_winter.push(sumOfWinterPerYear||0);
                            rank_spring.push(sumOfSpringPerYear||0);
                            rank_summer.push(sumOfSummerPerYear||0);
                            rank_autumn.push(sumOfAutumnPerYear||0);
                            //winter_cc
                            rank_jan.push(janDecRainPerYear.Jan !== undefined ? Number(janDecRainPerYear.Jan):0);
                            rank_feb.push(janDecRainPerYear.Feb !== undefined ? Number(janDecRainPerYear.Feb):0);
                            rank_mar.push(janDecRainPerYear.Mar !== undefined ? Number(janDecRainPerYear.Mar):0);
                            rank_apr.push(janDecRainPerYear.Apr !== undefined ? Number(janDecRainPerYear.Apr):0);
                            rank_may.push(janDecRainPerYear.May !== undefined ? Number(janDecRainPerYear.May):0);
                            rank_jun.push(janDecRainPerYear.Jun !== undefined ? Number(janDecRainPerYear.Jun):0);
                            rank_jul.push(janDecRainPerYear.Jul !== undefined ? Number(janDecRainPerYear.Jul):0);
                            rank_aug.push(janDecRainPerYear.Aug !== undefined ? Number(janDecRainPerYear.Aug):0);
                            rank_sep.push(janDecRainPerYear.Sep !== undefined ? Number(janDecRainPerYear.Sep):0);
                            rank_oct.push(janDecRainPerYear.Oct !== undefined ? Number(janDecRainPerYear.Oct):0);
                            rank_nov.push(janDecRainPerYear.Nov !== undefined ? Number(janDecRainPerYear.Nov):0);
                            rank_dec.push(janDecRainPerYear.Dec !== undefined ? Number(janDecRainPerYear.Dec):0);

                            rank_annual.push(sumOfRainfall || 0);
                        }
                        
    
                        //reset arrays
                        h1 = [];
                        h2 = [];
                        q1 = [];
                        q2 = [];
                        q3 = [];
                        q4 = [];
                        winter2 = [];
                        spring2 = [];
                        summer2 = [];
                        autumn2 = [];  
                    }

                    if (filterControl === 'Overview') {                        
                        rank.winter = rankDuplicate(rank_winter);
                        rank.summer = rankDuplicate(rank_summer);
                        rank.autumn = rankDuplicate(rank_autumn);
                        rank.spring = rankDuplicate(rank_spring);

                        rank.jan = rankDuplicate(rank_jan);
                        rank.feb = rankDuplicate(rank_feb);
                        rank.mar = rankDuplicate(rank_mar);
                        rank.apr = rankDuplicate(rank_apr);
                        rank.may = rankDuplicate(rank_may);
                        rank.jun = rankDuplicate(rank_jun);
                        rank.jul = rankDuplicate(rank_jul);
                        rank.aug = rankDuplicate(rank_aug);
                        rank.sep = rankDuplicate(rank_sep);
                        rank.oct = rankDuplicate(rank_oct);
                        rank.nov = rankDuplicate(rank_nov);
                        rank.dec = rankDuplicate(rank_dec);

                        rank.annual = rankDuplicate(rank_annual);
                        mainData.rank = rank;
                        //console.log(rank)
                    }

                    if (filterControl === 'Since 1960') {
                        if (forSince1960.length) {                            
                            let e = forSince1960.reduce(function(a, b) {return a + b;}, 0);
                            let f = e/10;
                            since1960PerTenYears.push({
                                year: Number(year1[0]) <= 1960 ? since1960tenYearStart + 's' : since1960tenYearStart2 + 's',
                                e,
                                f
                            });

                            eVals.push(e);
                            fVals.push(f);
                        } 
                        
                        let e10 = since1960PerTenYears[0].e - since1960PerTenYears[since1960PerTenYears.length-1].e;
                        let f10 = e10 / 10;
                        let eAvg = eVals.reduce(function(a, b) {return a + b;}, 0)/eVals.length;
                        let fAvg = fVals.reduce(function(a, b) {return a + b;}, 0)/fVals.length;
                        let e12 = b2-b61;
                        let e13 = e12/59;
                        mainData.for1960Data = {since1960PerTenYears, e10, f10, eAvg, fAvg, e12, e13};
                    }
    
                    mainData.avgChart1Winter = avgChart1Winter; mainData.avgChart1Spring = avgChart1Spring; mainData.avgChart1Summer = avgChart1Summer;
                    mainData.avgChart1Autumn = avgChart1Autumn; 
                    
                    mainData.avgChart3monthJan = avgChart3monthJan;
                    mainData.avgChart3monthFeb = avgChart3monthFeb; mainData.avgChart3monthMar = avgChart3monthMar; mainData.avgChart3monthApr = avgChart3monthApr;
                    mainData.avgChart3monthMay = avgChart3monthMay; mainData.avgChart3monthJun = avgChart3monthJun; mainData.avgChart3monthJul = avgChart3monthJul;
                    mainData.avgChart3monthAug = avgChart3monthAug; mainData.avgChart3monthSep = avgChart3monthSep; mainData.avgChart3monthOct = avgChart3monthOct;
                    mainData.avgChart3monthNov = avgChart3monthNov; mainData.avgChart3monthDec = avgChart3monthDec; 
                    
                    mainData.avgChart4h1h2 = avgChart4h1h2; mainData.avgChart2Annual = avgChart2Annual;
    
                    mainData.avgChart4q1q2q3q4 = avgChart4q1q2q3q4;
    
                    //commit averages table 2 data
                    mainData.avgPerFiveYears = avgPerFiveYears;
                    mainData.avgPerTenYears = avgPerTenYears;
                    mainData.avgPerFiftyYears = avgPerFiftyYears;
                    mainData.last100YearAvg = last100YearAvg;
                    mainData.ltaYearsAvg = ltaYearsAvg;
                    mainData.avgPerFiveYears = avgPerFiveYears;
    
                    //for Daily cumulative
                    mainData.cumulativeRain = arrOfEachMonthRainPerYear;
                    mainData.cumulativeRain2 = arrOfEachMonthRainPerYear2;
                    
                    //highest rain consec for data analysis
                    mainData.hrpmConsec = hrpmConsec;
                    mainData.hnodConsec = hnodConsec;
                    mainData.hdnodConsec = hdnodConsec;
                    mainData.hnodConsec2 = hnodConsec2;
                    mainData.hdnodConsec2 = hdnodConsec2;
                    //max per month per year
                    mainData.janToDecMaxPerYear = janToDecMaxPerYear;
                    
                    //remove last element of forOJIndexTable because it has no January
                    forOJIndexTable.pop();                     
                    oji.pop();
                    sji.pop();
                    aji.pop();
    
                    //comit oji, sji and aji
                    mainData = {...mainData, oji, sji, aji};                    
    
                    //commit jan - dec per year for monthly graphs
                    if (filterControl === 'Monthly Sort' || filterControl === 'Monthly') {
                        mainData = {...mainData, monthlyGraphs: {g_jan, g_feb, g_mar, g_apr, g_may, g_jun, g_jul, g_aug, g_sep, g_oct, g_nov, g_dec}};
                    }
                    
                    
                    mainData.forOJIndexTable = forOJIndexTable;
                    mainData.forMonthlyFilterTable = forMonthlyFilterTable;
                    mainData.forAveragesFilterTable = forAveragesFilterTable;
                    mainData.forAveragesLineChart = forAveragesLineChart;
    
                    //commit data to state for bar chart
                    mainData.h1 = h_1;
                    mainData.h2 = h_2;
                    mainData.q1 = q_1;
                    mainData.q2 = q_2;
                    mainData.q3 = q_3;
                    mainData.q4 = q_4;
                    mainData.winterPerYear = winter_1;
                    mainData.springPerYear = spring_1;
                    mainData.summerPerYear = summer_1;
                    mainData.autumnPerYear = autumn_1;                    
                    
                    //per year
                    let sumOfRainYears = Object.keys(sumOfRainfallPerYear);
                    let sumOfRain = '';
                    if (sumOfRainYears.length) {                                               
                        sumOfRain = Object.values(sumOfRainfallPerYear);
                        mainData.sumOfRainPerYear = sumOfRain;
                        mainData.sumOfRainYears = sumOfRainYears;
    
                        //overall year average
                        mainData.annualAvg = Number(sumOfRain.reduce(function(a, b) {
                            return a + b;
                        }, 0)/sumOfRain.length).toFixed(2);
    
                        //overall station rainfall
                        mainData.overallStationRainfall = sumOfRain.reduce(function(a, b) {
                            return a + b;
                        }, 0);
    
                        //annual max and min
                        let annualMax = sumOfRain.reduce(function(a, b) {
                            return Math.max(a, b);
                        }, 0);
                        let annualMin = sumOfRain.reduce(function(a, b) {
                            return Math.min(a, b);
                        });
    
                        let annualMaxIndex = sumOfRain.indexOf(annualMax);
                        let annualMinIndex = sumOfRain.indexOf(annualMin);
    
                        let annualMaxYear = year1[annualMaxIndex];
                        let annualMinYear = year1[annualMinIndex];
    
                        mainData.annualMax = annualMax || 'n/a';
                        mainData.annualMaxYear = annualMaxYear || 'n/a';
                        mainData.annualMin = annualMin || 'n/a';
                        mainData.annualMinYear = annualMinYear || 'n/a';
                    }
    
                    // month max, min, month and year name
                    if (Object.keys(sumOfRainfallPerMonth).length) {
                        let monthlyRainValues = Object.values(sumOfRainfallPerMonth);                    
                        let monthlyMaxOverall = monthlyRainValues.reduce(function(a, b) {
                            return Math.max(a, b);
                        }, 0);
                        let monthlyMaxIndex = monthlyRainValues.indexOf(monthlyMaxOverall);
                        let monthlyMaxDate = arrOfYearAndMonth[monthlyMaxIndex];
                        mainData.monthlyMax = monthlyMaxOverall
                        if (monthlyMaxDate) {
                            monthlyMaxDate = monthlyMaxDate.split('-');                            
                            mainData.monthlyMaxYear = monthlyMaxDate[0];
                            mainData.monthlyMaxMonth = getMonthlyMaxMonth(Number(monthlyMaxDate[1]));
                        }
                    }
                    
                    mainData.forMonthlyTable = forMonthlyTable;
                    mainData.forAnnualTable = forAnnualTable;                    
                                        
                    //Five years Average.
                    if (filterControl === 'Overview') {
                        let annualFiveYearAvg = '';
                        if (Object.keys(sumOfRainfallPerFiveYears).length) {
                            let perFiveValues = Object.values(sumOfRainfallPerFiveYears);
                            annualFiveYearAvg = perFiveValues.reduce(function(a, b) {
                                return Math.max(a, b);
                            }, 0)/5;                         
                        }       
                        mainData.annualFiveYearAvg = annualFiveYearAvg || 'n/a';                        
    
                    
                    
                        //Seasons 
                        if (winter.length) {
                            mainData.winter = winter.reduce(function(a, b) {
                                return a + b;
                            }, 0);
                        } else {
                            mainData.winter = 'n/a';                         
                        }
                        if (spring.length) {
                            mainData.spring = spring.reduce(function(a, b) {
                                return a + b;
                            }, 0);
                        } else {
                            mainData.spring = 'n/a'; 
                        }
                        if (summer.length) {
                            mainData.summer = summer.reduce(function(a, b) {
                                return a + b;
                            }, 0);
                        } else {                        
                            mainData.summer = 'n/a'; 
                        }
                        if (autumn.length) {
                            mainData.autumn = autumn.reduce(function(a, b) {
                                return a + b;
                            }, 0);
                        } else {                     
                            mainData.autumn = 'n/a';
                        }
                    
                        //dry days consec                    
                        if (Object.keys(dryDaysMaxConsec).length) {
                            mainData.dryDaysMaxConsec = Object.values(dryDaysMaxConsec).reduce((a, b) => {
                                return Math.max(a, b);
                            }, 0);
                        } else {
                            mainData.dryDaysMaxConsec = 'n/a';
                        }
    
                        //last year data info.
                        mainData.daysWithRain = daysWithRain.length || 'n/a';
                        mainData.daysOfRainGreaterThan10 = daysOfRainGreaterThan10.length || 'n/a'; 
                        mainData.daysOfRainGreaterThan25 = daysOfRainGreaterThan25.length || 'n/a';
                        mainData.dryDays = dryDays.length || 'n/a';
                    }
                    //lineChart data continues
                    mainData.lineChartData = lineChartData;                    
                    mainData.dataYears = year1;

                    //for cool and warm linechart
                    mainData.forCoolAndWarmFilterChart3 = {
                        coolAndWarm_jan, coolAndWarm_feb, coolAndWarm_mar, coolAndWarm_apr, coolAndWarm_may, coolAndWarm_jun, coolAndWarm_jul, 
                        coolAndWarm_aug, coolAndWarm_sep, coolAndWarm_oct, coolAndWarm_nov, coolAndWarm_dec, coolAndWarm_annual, coolAndWarm_cool, coolAndWarm_warm
                    }
    
                    console.log(mainData);
                    
                    //set Main state
                    return setMainState(mainData);                                                            
                } else return false;
                         
            }).then(() => {
                return setIsComputing(false);
            });
        }
    }, [ props, queryCode, weatherType, isFetching, isComputing, filterControl, codesAndData.codes, codesAndData.data, setIsFetching, setIsComputing ]);//, filterControl, codes, data ]);

    //homes.sort((a, b) => parseFloat(a.price) - parseFloat(b.price));

    const UserChoiceInput = () => (
        <>
        <Row>            
            <Col md={12} xl={12}>
                <h5>Choose weather type and station number to get started. Also change the filter to visualize data differently.</h5>
            </Col>
            {/*<Col md={4}>
                <Form.Control size="lg" as="select" className="mb-3" name='weatherType' value={weatherType} onChange={(e) => {onChange(e)}}>
                    <option>Rainfall</option>
                    <option>Minimum Temperature</option>
                    <option>Maximum Temperature</option>
                    <option>Solar Exposure</option>
                </Form.Control>
    </Col>*/}
            <Col md={6} xl={6}>
                <Form.Control size="lg" as="select" className="mb-3" name='queryCode' value={queryCode} onChange={(e) => {onChange(e)}}>
                    {Object.keys(mainState).length &&
                        mainState.stationCodes.map((c, i) => (<option key={i}>{`${c.code} (${c.sub_station})`}</option>))}
                </Form.Control>                                        
            </Col>
            <Col md={6} xl={6}>
                <Form.Control size="lg" as="select" className="mb-3" name='filterControl' value={filterControl} onChange={(e) => {onChange(e)}}>
                    <option>Overview</option>
                    <option>Location Tool</option>
                    <option>Daily Raw Data</option>
                    <option>Monthly Raw Data</option>
                    <option>Annual Raw Data</option>
                    <option>Annual Sort</option>
                    <option>H1H2Q1Q4</option>
                    <option>H1H2Q1Q4 Sort</option>
                    <option>Seasonal</option>
                    <option>Seasonal Sort</option>
                    <option>Monthly</option>
                    <option>Monthly Sort</option>
                    <option>Averages</option>
                    <option>OJ Index</option>
                    <option>OJ Index Sort</option>
                    <option>Test Select Year</option>
                    <option>Daily Analysis</option>
                    <option>Daily Cumulative</option>
                    <option>Since 1960</option>
                    <option>Cool and Warm</option>                    
                </Form.Control> 
            </Col>
            <Col md={12} xl={12}>
                {/*filterControl === 'Annual Sort' && <Slide min={mainState.yearOpened} max={mainState.yearClosed} />*/}
                {filterControl === 'Seasonal Sort' && <Form.Control size="lg" as="select" className="mb-3" name='seasonControl' value={seasonControl} onChange={(e) => {onChange(e)}}>
                    <option>Winter</option>
                    <option>Spring</option>
                    <option>Summer</option>
                    <option>Autumn</option>
                </Form.Control>}
            </Col>
            <Col md={12} xl={12}>                
                {filterControl === 'OJ Index Sort' && <Form.Control size="lg" as="select" className="mb-3" name='ojiControl' value={ojiControl} onChange={(e) => {onChange(e)}}>
                    <option>OJ</option>
                    <option>SJ</option>
                    <option>AJ</option>                    
                </Form.Control>}
            </Col>
            <Col md={12} xl={12}>                
                {(filterControl === 'Daily Analysis' || filterControl === 'Daily Cumulative') && <Form.Control size="lg" as="select" className="mb-3" name='analysisControl' value={analysisControl} onChange={(e) => {onChange(e)}}>
                    <option>Select Year</option>
                    {mainState.dataYears && mainState.dataYears.map((years, i) => <option key={i}>{years}</option>)}                    
                </Form.Control>}
            </Col>
            </Row>            
           <Row>
            <Col md={12} xl={12}>                
                {filterControl === 'Monthly Sort' && <Form.Control size="lg" as="select" className="mb-3" name='monthlyControl' value={monthlyControl} onChange={(e) => {onChange(e)}}>
                    <option>January</option>
                    <option>February</option>
                    <option>March</option>
                    <option>April</option>
                    <option>May</option>
                    <option>June</option>
                    <option>July</option>
                    <option>August</option>
                    <option>September</option>
                    <option>October</option>
                    <option>November</option>
                    <option>December</option>
                </Form.Control>}
            </Col>
        </Row>
        </>
    );


    /*const tabContent = (
        <Aux>                
            <div className="media friendlist-box align-items-center justify-content-center m-b-20">
                <div className="m-r-10 photo-table">
                    <a href={DEMO.BLANK_LINK}><img className="rounded-circle" style={{width: '40px'}} src={avatar1} alt="activity-user"/></a>
                </div>
                <div className="media-body">
                    <h6 className="m-0 d-inline">Silje Larsen</h6>
                    <span className="float-right d-flex  align-items-center"><i className="fa fa-caret-up f-22 m-r-10 text-c-green"/>3784</span>
                </div>
            </div>
            <div className="media friendlist-box align-items-center justify-content-center m-b-20">
                <div className="m-r-10 photo-table">
                    <a href={DEMO.BLANK_LINK}><img className="rounded-circle" style={{width: '40px'}} src={avatar2} alt="activity-user"/></a>
                </div>
                <div className="media-body">
                    <h6 className="m-0 d-inline">Julie Vad</h6>
                    <span className="float-right d-flex  align-items-center"><i className="fa fa-caret-up f-22 m-r-10 text-c-green"/>3544</span>
                </div>
            </div>
            <div className="media friendlist-box align-items-center justify-content-center m-b-20">
                <div className="m-r-10 photo-table">
                    <a href={DEMO.BLANK_LINK}><img className="rounded-circle" style={{width: '40px'}} src={avatar3} alt="activity-user"/></a>
                </div>
                <div className="media-body">
                    <h6 className="m-0 d-inline">Storm Hanse</h6>
                    <span className="float-right d-flex  align-items-center"><i className="fa fa-caret-down f-22 m-r-10 text-c-red"/>2739</span>
                </div>
            </div>
            <div className="media friendlist-box align-items-center justify-content-center m-b-20">
                <div className="m-r-10 photo-table">
                    <a href={DEMO.BLANK_LINK}><img className="rounded-circle" style={{width: '40px'}} src={avatar1} alt="activity-user"/></a>
                </div>
                <div className="media-body">
                    <h6 className="m-0 d-inline">Frida Thomse</h6>
                    <span className="float-right d-flex  align-items-center"><i className="fa fa-caret-down f-22 m-r-10 text-c-red"/>1032</span>
                </div>
            </div>
            <div className="media friendlist-box align-items-center justify-content-center m-b-20">
                <div className="m-r-10 photo-table">
                    <a href={DEMO.BLANK_LINK}><img className="rounded-circle" style={{width: '40px'}} src={avatar2} alt="activity-user"/></a>
                </div>
                <div className="media-body">
                    <h6 className="m-0 d-inline">Silje Larsen</h6>
                    <span className="float-right d-flex  align-items-center"><i className="fa fa-caret-up f-22 m-r-10 text-c-green"/>8750</span>
                </div>
            </div>
            <div className="media friendlist-box align-items-center justify-content-center">
                <div className="m-r-10 photo-table">
                    <a href={DEMO.BLANK_LINK}><img className="rounded-circle" style={{width: '40px'}} src={avatar3} alt="activity-user"/></a>
                </div>
                <div className="media-body">
                    <h6 className="m-0 d-inline">Storm Hanse</h6>
                    <span className="float-right d-flex  align-items-center"><i className="fa fa-caret-down f-22 m-r-10 text-c-red"/>8750</span>
                </div>
            </div>
        </Aux>
    );*/

    return ( 
        isFetching || isComputing ? 
            <Aux>
                <Loader />
                <div>
                    <span className="spinner-border spinner-border-sm"></span>
                    Please wait. Intense calculation may take a while...
                </div>
            </Aux>
        : (filterControl === 'Daily Cumulative') ?
            <Aux>
                <UserChoiceInput />            
                <Row>
                    <Col xl={12} md={12}>
                        {analysisControl !== 'Select Year' && <RawDataTable                     
                            cumulativeRain={mainState.cumulativeRain} 
                            cumulativeRain2={mainState.cumulativeRain2} 
                            q={analysisControl}
                        />}    
                    </Col>                
                </Row>
            </Aux> 

        : (filterControl === 'Daily Analysis') ?
            <Aux>
                <UserChoiceInput />            
                <Row>
                    <Col xl={12} md={12}>
                        {
                            analysisControl !== 'Select Year' && <RawDataTable 
                                forDailyAnalysis={mainState.forDailyAnalysis} 
                                q={analysisControl} 
                                janToDecMaxPerYear={mainState.janToDecMaxPerYear} 
                                hrpmConsec={mainState.hrpmConsec}
                                hnodConsec={mainState.hnodConsec}
                                hnodConsec2={mainState.hnodConsec2}
                                hdnodConsec={mainState.hdnodConsec}
                                hdnodConsec2={mainState.hdnodConsec2}
                                nord={mainState.noOfRainDaysAnalysis}
                                nodd={mainState.noOfDryDaysAnalysis}
                                nowd25={mainState.noOfWetDaysAnalysis25}
                                nowd15={mainState.noOfWetDaysAnalysis15}
                                nowd10={mainState.noOfWetDaysAnalysis10}                        
                            />
                        }
                    </Col>            
                </Row>
            </Aux>
        : (filterControl === 'Since 1960') ?
        <Aux>
            <UserChoiceInput />            
            <Row>
                <Col xl={12} md={12}>
                    <RawDataTable                     
                        since1960AnnualTable={mainState.forAnnualTable}
                        for1960Data={mainState.for1960Data}
                        filterControl={filterControl}
                    />    
                </Col>                
            </Row>
        </Aux> 
        : (filterControl === 'Test Select Year') ?
        <Aux>
            <Row>
                <Col xl={12} md={12}>
                    <UserChoiceInput />            
                </Col>
            </Row>                
            <Row>
                <Col xl={12} md={12}>
                    <RawDataTable 
                        testSelectData={mainState.forOJIndexTable} 
                        filterControl={filterControl} 
                        annualAvg={mainState.annualAvg}                                                 
                        ojiSelect={mainState.oji}
                        ojiSelect2={[...mainState.oji]}
                    />
                </Col>                    
            </Row>            
        </Aux>  
        : (filterControl === 'OJ Index Sort') ?
            <Aux>
                <Row>
                    <Col xl={12} md={12}>
                        <UserChoiceInput />            
                    </Col>
                </Row>                
                <Row>
                    <Col xl={12} md={12}>                        
                        <SortTable 
                            filterControl={filterControl}
                            ojs={mainState.forOJIndexTable} 
                            ojiControl={ojiControl}
                            ojiChartData={mainState.oji}
                            sjiChartData={mainState.sji}
                            ajiChartData={mainState.aji}
                        />                        
                    </Col>
                </Row> 
                <Row>
                    <Col xl={12} md={12}>
                        {ojiControl === 'OJ' && <LineChart data={mainState.oji} m={'OJ'} />}
                        {ojiControl === 'SJ' && <LineChart data={mainState.sji} m={'SJ'} />}
                        {ojiControl === 'AJ' && <LineChart data={mainState.aji} m={'AJ'} />}
                    </Col>
                </Row>               
            </Aux> 
        : (filterControl === 'OJ Index') ?
            <Aux>
                <Row>
                    <Col xl={12} md={12}>
                        <UserChoiceInput />            
                    </Col>
                </Row>                
                <Row>
                    <Col xl={12} md={12}>
                        <RawDataTable oj={mainState.forOJIndexTable} cutOff={true} />
                    </Col>                    
                </Row>
                <Row>
                    <Col xl={12} md={12}>
                        <LineChart oji={mainState.oji} sji={mainState.sji} aji={mainState.aji} />
                    </Col>
                </Row>
            </Aux> 
        : (filterControl === 'Averages') ?
            <Aux>
                <UserChoiceInput />            
                <Row>
                    <Col xl={12} md={12}>
                    {mainState.forAveragesFilterTable ? <RawDataTable 
                        averages={mainState.forAveragesFilterTable}
                        avgPerFiveYears={mainState.avgPerFiveYears}
                        avgPerTenYears={mainState.avgPerTenYears}
                        avgPerFiftyYears={mainState.avgPerFiftyYears}
                        last100YearAvg={mainState.last100YearAvg}
                        ltaYearsAvg={mainState.ltaYearsAvg}
                    /> : (
                        <div>
                        <span className="spinner-border spinner-border-sm"></span>
                        <span> Please wait. Intense computation may take a while...</span>
                        </div>
                        )}
                    </Col>
                    <Col xl={12} md={12}>
                    {mainState.forAveragesFilterTable.length ? <Card>
                        <Card.Header>
                            <Card.Title as="h5">Line Chart</Card.Title>
                        </Card.Header>
                        <Card.Body>
                            <LineChart data={mainState.forAveragesLineChart} m={'Annual AVG'} />
                        </Card.Body>
                    </Card> : (
                        <div>
                        <span className="spinner-border spinner-border-sm"></span>
                        <span> Please wait. Intense computation may take a while...</span>
                        </div>
                        )}
                    </Col>
                </Row>
                <Row>
                    <Col xl={12} md={12}>
                        {mainState.avgChart1Autumn.length ? <MultiBarChart 
                            winterAvg={mainState.avgChart1Winter} 
                            springAvg={mainState.avgChart1Spring}
                            summerAvg={mainState.avgChart1Summer}
                            autumnAvg={mainState.avgChart1Autumn}
                        /> : (
                            <div>
                            <span className="spinner-border spinner-border-sm"></span>
                            <span> Please wait. Intense computation may take a while...</span>
                            </div>
                            )}
                    </Col>
                    <Col xl={12} md={12}>
                        {Object.keys(mainState).length ? <MultiBarChart
                            janAvg={mainState.avgChart3monthJan} 
                            febAvg={mainState.avgChart3monthFeb}
                            marAvg={mainState.avgChart3monthMar}
                            aprAvg={mainState.avgChart3monthApr}
                            mayAvg={mainState.avgChart3monthMay}
                            junAvg={mainState.avgChart3monthJun}
                            julAvg={mainState.avgChart3monthJul}
                            augAvg={mainState.avgChart3monthAug}
                            sepAvg={mainState.avgChart3monthSep}
                            octAvg={mainState.avgChart3monthOct}
                            novAvg={mainState.avgChart3monthNov}
                            decAvg={mainState.avgChart3monthDec}
                        /> : (
                            <div>
                            <span className="spinner-border spinner-border-sm"></span>
                            <span> Please wait. Intense computation may take a while...</span>
                            </div>
                            )}
                    </Col>
                </Row>
                <Row>
                    <Col xl={12} md={12}>
                        {Object.keys(mainState).length ? <MultiBarChart 
                            avgAnnual={mainState.avgChart2Annual}                        
                        /> : (
                            <div>
                            <span className="spinner-border spinner-border-sm"></span>
                            <span> Please wait. Intense computation may take a while...</span>
                            </div>
                            )}
                    </Col>
                    <Col xl={12} md={12}>
                        {Object.keys(mainState).length ? <MultiBarChart 
                            hAvg={mainState.avgChart4h1h2}                        
                        />: (
                            <div>
                            <span className="spinner-border spinner-border-sm"></span>
                            <span> Please wait. Intense computation may take a while...</span>
                            </div>
                            )}
                    </Col>
                </Row>
                <Row>
                    <Col xl={12} md={12}>
                        {Object.keys(mainState).length ? <MultiBarChart 
                            qAvg={mainState.avgChart4q1q2q3q4}                        
                        />: (
                            <div>
                            <span className="spinner-border spinner-border-sm"></span>
                            <span> Please wait. Intense computation may take a while...</span>
                            </div>
                            )}
                    </Col>                
                </Row>
            </Aux> 
        : (filterControl === 'Monthly') ?
            <Aux>
                <UserChoiceInput />            
                <Row>
                    <Col xl={12} md={12}>                        
                        <RawDataTable mon={mainState.forMonthlyFilterTable} />
                    </Col>                    
                </Row>
                <Row>
                    <Col xl={12} md={12}>
                        <LineChart monthlyGraphs={mainState.monthlyGraphs} />
                    </Col>
                </Row>
                <Row>
                    <Col xl={12} md={12}>
                        <MultiBarChart monthlyGraphs={mainState.monthlyGraphs} />
                    </Col>
                </Row>
            </Aux>
        : (filterControl === 'Cool and Warm') ?
        <Aux>
            <UserChoiceInput />            
            <Row>
                <Col xl={12} md={12}>
                    <RawDataTable 
                        forCoolAndWarmFilterTable={mainState.forCoolAndWarmFilterTable}
                        filterControl={filterControl}
                        forCoolAndWarmFilterChart3={mainState.forCoolAndWarmFilterChart3}
                    />
                </Col>
            </Row>            
        </Aux>  
        : (filterControl === 'Monthly Sort') ?
            <Aux>
                <UserChoiceInput />            
                <Row>
                    <Col xl={12} md={12}>
                        {mainState.forMonthlyFilterTable ? <SortTable 
                            filterControl={filterControl}
                            ms={mainState.forMonthlyFilterTable} 
                            monthlyControl={monthlyControl}
                        />: (
                            <div>
                                <span className="spinner-border spinner-border-sm"></span>
                                <span> Please wait. Intense computation may take a while...</span>
                            </div>
                        )}
                        {/*mainState.forMonthlyFilterTable ? <RawDataTable mon={mainState.forMonthlyFilterTable} /> : (
                            <div>
                                <span className="spinner-border spinner-border-sm"></span>
                                <span> Please wait. Intense computation may take a while...</span>
                            </div>
                        )*/}
                    </Col>                     
                </Row>                            
            </Aux>  
        : (filterControl === 'Seasonal') ?
            <Aux>        
                <UserChoiceInput />            
                <Row>
                    <Col xl={12} md={12}>
                        <RawDataTable seasonal={mainState.forMonthlyFilterTable} />
                    </Col>            
                    <Col xl={12} md={12}>                    
                    {mainState.winterPerYear.length && <MultiBarChart winterPerYear={mainState.winterPerYear} 
                        springPerYear={mainState.springPerYear} summerPerYear={mainState.summerPerYear} 
                        autumnPerYear={mainState.autumnPerYear} />}
                    </Col>
                </Row>
            </Aux>
        : (filterControl === 'Seasonal Sort') ?
            <Aux>        
                <UserChoiceInput />            
                <Row>                
                    <Col xl={12} md={12}>
                        <SortTable 
                            filterControl={filterControl}
                            ss={mainState.forMonthlyFilterTable} 
                            seasonControl={seasonControl}
                        />                        
                    </Col>                                
                </Row>           
            </Aux>
        : (filterControl === 'H1H2Q1Q4 Sort') ?
            <Aux> 
                <Row>
                    <Col xl={12} md={12}>
                        <UserChoiceInput />   
                    </Col>                    
                </Row>                       
                <Row>
                    <Col xl={12} md={12}>
                        <SortTable 
                            filterControl={filterControl}
                            hqs={mainState.forMonthlyFilterTable}                            
                        />
                        {/*<RawDataTable hqSort={mainState.forMonthlyFilterTable} />*/}
                    </Col>                    
                </Row>                               
            </Aux>
        : (filterControl === 'H1H2Q1Q4') ?
            <Aux>        
                <UserChoiceInput />  
                <Row>
                    <RawDataTable hq={mainState.forMonthlyFilterTable} />
                </Row>          
                <Row>                
                    <Col>
                        {mainState.q1.length && <MultiBarChart q1={mainState.q1} q2={mainState.q2} q3={mainState.q3} q4={mainState.q4} />}
                    </Col>
                </Row>
                <Row>                
                    <Col>
                        {mainState.h1.length && <MultiBarChart h1={mainState.h1} h2={mainState.h2} />}
                    </Col>
                </Row>
            </Aux>
        : (filterControl === 'Annual Sort') ?
            <Aux>
                <Row>
                    <Col xl={12} md={12}>
                        <UserChoiceInput /> 
                    </Col>
                </Row>
                <Row>
                    <Col xl={12} md={12}>
                        {Object.keys(mainState).length && <SortTable                            
                            as={mainState.forAnnualTable}                         
                            annualAvg={mainState.annualAvg}
                            lineChartData={mainState.lineChartData}
                            sumOfRainYears={mainState.sumOfRainYears}
                            sumOfRain={mainState.sumOfRainPerYear}
                            filterControl={filterControl}
                            dataYears={mainState.dataYears}
                        />}
                    </Col>
                </Row>
            </Aux>        
        : (filterControl === 'Annual Raw Data') ?
            <Aux> 
                <UserChoiceInput />       
                <Row>
                    <Col md={6} xl={6}>
                        <RawDataTable annual={mainState.forAnnualTable} />
                    </Col>
                    <Col md={6} xl={6}>
                        <LineChart data={mainState.lineChartData} m={'Annual'} />
                    </Col>
                </Row>
            </Aux>  
        : (filterControl === 'Monthly Raw Data') ?
            <Aux>
                <UserChoiceInput />            
                <Row>
                    <Col xl={12} md={12}>
                        <RawDataTable monthly={mainState.forMonthlyTable} />
                    </Col>
                </Row>
            </Aux>  
        : (filterControl === 'Daily Raw Data') ?
            <Aux>   
                <UserChoiceInput />                     
                <Row>
                    <Col xl={12} md={12}>
                        <RawDataTable data={mainState.data} />
                    </Col>                    
                </Row>
            </Aux>
        : (filterControl === 'Location Tool') ? 
            <Aux>
                <UserChoiceInput />           
                <Row>            
                    <Col md={4} xl={4}>
                    <Card>
                        <Card.Body>
                            {/*<h6 className='mb-4'>Daily Sales</h6>8*/}
                            <div className="row d-flex align-items-center">
                                
                            <div className="col-7">
                                    <h6 className="f-w-300 d-flex align-items-center m-b-0">{/*<i className="feather icon-arrow-up text-c-green f-30 m-r-5"/>*/} Weather Station</h6>
                                </div>

                                <div className="col-5 text-right">
                                    <p className="m-b-0">{Object.keys(mainState).length ? mainState.location : 'n/a'}</p>
                                </div>
                                <hr />
                                
                                <div className="col-7">
                                    <h6 className="f-w-300 d-flex align-items-center m-b-0">{/*<i className="feather icon-arrow-up text-c-green f-30 m-r-5"/>*/} Source</h6>
                                </div>

                                <div className="col-5 text-right">
                                    <p className="m-b-0">{Object.keys(mainState).length ? mainState.source ? mainState.source : 'BOM' : 'n/a'}</p>
                                </div>
                                <hr />
                                <div className="col-7">
                                    <h6 className="f-w-300 d-flex align-items-center m-b-0">{/*<i className="feather icon-arrow-up text-c-green f-30 m-r-5"/>*/} Station Number</h6>
                                </div>

                                <div className="col-5 text-right">
                                    <p className="m-b-0">{queryCode ? queryCode : 'n/a'}</p>
                                </div>
                                <hr />
                                <div className="col-7">
                                    <h6 className="f-w-300 d-flex align-items-center m-b-0">{/*<i className="feather icon-arrow-up text-c-green f-30 m-r-5"/>*/} District</h6>
                                </div>

                                <div className="col-5 text-right">
                                    <p className="m-b-0">{Object.keys(mainState).length ? mainState.district ? mainState.district: 'n/a' : 'n/a'}</p>
                                </div>
                                <hr />
                                <div className="col-7">
                                    <h6 className="f-w-300 d-flex align-items-center m-b-0">{/*<i className="feather icon-arrow-up text-c-green f-30 m-r-5"/>*/} Station Height</h6>
                                </div>

                                <div className="col-5 text-right">
                                    <p className="m-b-0">{Object.keys(mainState).length ? mainState.stationHeight ? mainState.stationHeight: 'n/a' : 'n/a'}</p>
                                </div>
                                <hr />
                                <div className="col-7">
                                    <h6 className="f-w-300 d-flex align-items-center m-b-0">{/*<i className="feather icon-arrow-up text-c-green f-30 m-r-5"/>*/} Year Opened</h6>
                                </div>

                                <div className="col-5 text-right">
                                    <p className="m-b-0">{Object.keys(mainState).length ? mainState.yearOpened ? mainState.yearOpened: 'n/a' : 'n/a'}</p>
                                </div>
                                <hr />
                                <div className="col-7">
                                    <h6 className="f-w-300 d-flex align-items-center m-b-0">{/*<i className="feather icon-arrow-up text-c-green f-30 m-r-5"/>*/} Status</h6>
                                </div>

                                <div className="col-5 text-right">
                                    <p className="m-b-0">{Object.keys(mainState).length ? mainState.open ? mainState.open : 'n/a' : 'n/a'}</p>
                                </div>
                                <hr />
                                <div className="col-7">
                                    <h6 className="f-w-300 d-flex align-items-center m-b-0">{/*<i className="feather icon-arrow-up text-c-green f-30 m-r-5"/>*/} Operational (Years)</h6>
                                </div>

                                <div className="col-5 text-right">
                                    <p className="m-b-0">{Object.keys(mainState).length ? mainState.opYears ? mainState.opYears : 'n/a' : 'n/a'}</p>
                                </div>
                                <hr />
                                <div className="col-7">
                                    <h6 className="f-w-300 d-flex align-items-center m-b-0">{/*<i className="feather icon-arrow-up text-c-green f-30 m-r-5"/>*/} Latitude (decimal)</h6>
                                </div>

                                <div className="col-5 text-right">
                                    <p className="m-b-0">{Object.keys(mainState).length ? mainState.latitude ? mainState.latitude : 'n/a' : 'n/a'}</p>
                                </div>
                                <hr />
                                <div className="col-7">
                                    <h6 className="f-w-300 d-flex align-items-center m-b-0">{/*<i className="feather icon-arrow-up text-c-green f-30 m-r-5"/>*/} Longitude (decimal)</h6>
                                </div>

                                <div className="col-5 text-right">
                                    <p className="m-b-0">{Object.keys(mainState).length ? mainState.longitude ? mainState.longitude : 'n/a' : 'n/a'}</p>
                                </div>
                            </div>
                            {/*<div className="progress m-t-30" style={{height: '7px'}}>
                                <div className="progress-bar progress-c-theme" role="progressbar" style={{width: '50%'}} aria-valuenow="50" aria-valuemin="0" aria-valuemax="100"/>
                            </div>*/}
                        </Card.Body>
                    </Card>
                    </Col>
                    <Col md={8} xl={8}>
                        <div className='col-12'>                           
                            <Card className='Recent-Users'>                                
                                <Card.Body className='px-0 py-2'>
                                    <Table responsive hover>                                        
                                        <tbody>
                                            <tr className="unread">                                                
                                                <td>
                                                    <h6 className="mb-1">Site name</h6>
                                                    <span className="text-muted">{mainState.stationState}</span>
                                                </td>
                                                <td>
                                                    <h6 className="mb-1">Site number</h6>
                                                    <span className="text-muted">{queryCode}</span>
                                                </td>
                                                <td>
                                                    <h6 className="mb-1">Commenced</h6>
                                                    <span className="text-muted">{mainState.yearOpened}</span>
                                                </td>
                                            </tr>
                                            <tr className="unread">                                                
                                                <td>
                                                    <h6 className="mb-1">Latitude</h6>
                                                    <span className="text-muted">{mainState.latitude}</span>
                                                </td>
                                                <td>
                                                    <h6 className="mb-1">Longitude</h6>
                                                    <span className="text-muted">{mainState.longitude}</span>
                                                </td>
                                                <td>
                                                    <h6 className="mb-1">Elevation</h6>
                                                    <span className="text-muted">{mainState.stationHeight}</span>
                                                </td>
                                                <td>
                                                    <h6 className="mb-1">Operational Status</h6>
                                                    <span className="text-muted">{mainState.open}</span>
                                                </td>
                                            </tr>                                                                                                                  
                                        </tbody>
                                    </Table>
                                </Card.Body>
                            </Card>                                                   
                        </div>
                        <div className='col-12'>
                            <Mercator locationData={mainState.locationData} />
                        </div>                        
                    </Col>
                </Row>
            </Aux> 
        : (filterControl === 'Overview') &&
            <Aux> 
                <UserChoiceInput />                                 
                <Row>
                    <Col md={6} xl={3}>
                        <Card>
                            <Card.Body>
                                {/*<h6 className='mb-4'>Daily Sales</h6>8*/}
                                <div className="row d-flex align-items-center">
                                    <div className="col-7">
                                        <h6 className="f-w-300 d-flex align-items-center m-b-0">{/*<i className="feather icon-arrow-up text-c-green f-30 m-r-5"/>*/} Location</h6>
                                    </div>

                                    <div className="col-5 text-right">
                                        <p className="m-b-0">{Object.keys(mainState).length ? mainState.location : 'n/a'}</p>
                                    </div>
                                    <hr />
                                    <div className="col-7">
                                        <h6 className="f-w-300 d-flex align-items-center m-b-0">{/*<i className="feather icon-arrow-up text-c-green f-30 m-r-5"/>*/} State</h6>
                                    </div>

                                    <div className="col-5 text-right">
                                        <p className="m-b-0">{Object.keys(mainState).length && mainState.district}</p>
                                    </div>
                                    <hr />
                                    <div className="col-7">
                                        <h6 className="f-w-300 d-flex align-items-center m-b-0">{/*<i className="feather icon-arrow-up text-c-green f-30 m-r-5"/>*/} Category</h6>
                                    </div>

                                    <div className="col-5 text-right">
                                        <p className="m-b-0">{Object.keys(mainState).length ? mainState.category : 'n/a'}</p>
                                    </div>
                                </div>
                                {/*<div className="progress m-t-30" style={{height: '7px'}}>
                                    <div className="progress-bar progress-c-theme" role="progressbar" style={{width: '50%'}} aria-valuenow="50" aria-valuemin="0" aria-valuemax="100"/>
                                </div>*/}
                            </Card.Body>
                        </Card>
                        <Card>
                            <Card.Body>
                                {/*<h6 className='mb-4'>Daily Sales</h6>8*/}
                                <div className="row d-flex align-items-center">
                                    <div className="col-7">
                                        <h6 className="f-w-300 d-flex align-items-center m-b-0">{/*<i className="feather icon-arrow-up text-c-green f-30 m-r-5"/>*/} Year Opened</h6>
                                    </div>

                                    <div className="col-5 text-right">
                                        <p className="m-b-0">{mainState.yearOpened}</p>
                                    </div>
                                    <hr />
                                    <div className="col-7">
                                        <h6 className="f-w-300 d-flex align-items-center m-b-0">{/*<i className="feather icon-arrow-up text-c-green f-30 m-r-5"/>*/} Status</h6>
                                    </div>

                                    <div className="col-5 text-right">
                                        <p className="m-b-0">{mainState.open ? mainState.open : 'n/a'}</p>
                                    </div>
                                    <hr />
                                    <div className="col-7">
                                        <h6 className="f-w-300 d-flex align-items-center m-b-0">{/*<i className="feather icon-arrow-up text-c-green f-30 m-r-5"/>*/} Operational (Years)</h6>
                                    </div>

                                    <div className="col-5 text-right">
                                        <p className="m-b-0">{mainState.opYears}</p>
                                    </div>
                                </div>
                                {/*<div className="progress m-t-30" style={{height: '7px'}}>
                                    <div className="progress-bar progress-c-theme" role="progressbar" style={{width: '50%'}} aria-valuenow="50" aria-valuemin="0" aria-valuemax="100"/>
                                </div>*/}
                            </Card.Body>
                        </Card>
                        <Card>
                            <Card.Body>
                                {/*<h6 className='mb-4'>Daily Sales</h6>8*/}
                                <div className="row d-flex align-items-center">
                                    <div className="col-7">
                                        <h6 className="f-w-300 d-flex align-items-center m-b-0">{/*<i className="feather icon-arrow-up text-c-green f-30 m-r-5"/>*/} Annual Max (mm)</h6>
                                    </div>

                                    <div className="col-5 text-right">
                                        <p className="m-b-0">{(!mainState.annualMax || mainState.annualMax === 'n/a') ? 'n/a (n/a)' : `${Number(mainState.annualMax).toFixed(1)} (${mainState.annualMaxYear})`}</p>
                                    </div>
                                    <hr />
                                    <div className="col-7">
                                        <h6 className="f-w-300 d-flex align-items-center m-b-0">{/*<i className="feather icon-arrow-up text-c-green f-30 m-r-5"/>*/} Annual Min (mm)</h6>
                                    </div>

                                    <div className="col-5 text-right">
                                        <p className="m-b-0">{(!mainState.annualMin || mainState.annualMin === 'n/a') ? 'n/a (n/a)' : `${Number(mainState.annualMin).toFixed(1)} (${mainState.annualMinYear})`}</p>
                                    </div>
                                    <hr />
                                    <div className="col-7">
                                        <h6 className="f-w-300 d-flex align-items-center m-b-0">{/*<i className="feather icon-arrow-up text-c-green f-30 m-r-5"/>*/} Monthly Max (mm)</h6>
                                    </div>

                                    <div className="col-5 text-right">
                                        <p className="m-b-0">{(!mainState.monthlyMax || mainState.monthlyMax ==='n/a') ? 'n/a (n/a)' : `${Number(mainState.monthlyMax).toFixed(1)} (${mainState.monthlyMaxMonth}) (${mainState.monthlyMaxYear})`}</p>
                                    </div>
                                </div>
                                {/*<div className="progress m-t-30" style={{height: '7px'}}>
                                    <div className="progress-bar progress-c-theme" role="progressbar" style={{width: '50%'}} aria-valuenow="50" aria-valuemin="0" aria-valuemax="100"/>
                                </div>*/}
                            </Card.Body>
                        </Card>                        
                        <Card>
                            <Card.Body>
                                {/*<h6 className='mb-4'>Daily Sales</h6>8*/}
                                <div className="row d-flex align-items-center">
                                    <div className="col-7">
                                        <h6 className="f-w-300 d-flex align-items-center m-b-0">{/*<i className="feather icon-arrow-up text-c-green f-30 m-r-5"/>*/} Annual 5 Year AVG </h6>
                                    </div>

                                    <div className="col-5 text-right">
                                        <p className="m-b-0">{(!mainState.annualFiveYearAvg || mainState.annualFiveYearAvg === 'n/a') ? 'n/a' : Number(mainState.annualFiveYearAvg).toFixed(1)}</p>
                                    </div>
                                    <hr />
                                    <div className="col-7">
                                        <h6 className="f-w-300 d-flex align-items-center m-b-0">{/*<i className="feather icon-arrow-up text-c-green f-30 m-r-5"/>*/} Annual Long-Term AVG</h6>
                                    </div>                                    
                                    <div className="col-5 text-right">
                                        <p className="m-b-0">{(!mainState.annualAvg || mainState.annualAvg === 'n/a') ? 'n/a' : Number(mainState.annualAvg).toFixed(1)}</p>
                                    </div>
                                </div>
                                {/*<div className="progress m-t-30" style={{height: '7px'}}>
                                    <div className="progress-bar progress-c-theme" role="progressbar" style={{width: '50%'}} aria-valuenow="50" aria-valuemin="0" aria-valuemax="100"/>
                                </div>*/}
                            </Card.Body>
                        </Card>
                        <Card>
                            <Card.Body>
                                <h6 className='mb-4'>{`${mainState.yearClosed} Daily Info`}</h6>
                                <div className="row d-flex align-items-center">
                                    <div className="col-7">
                                        <h6 className="f-w-300 d-flex align-items-center m-b-0">{/*<i className="feather icon-arrow-up text-c-green f-30 m-r-5"/>*/} Total No. Rain days</h6>
                                    </div>

                                    <div className="col-5 text-right">
                                        <p className="m-b-0">{(!mainState.daysWithRain || mainState.daysWithRain === 'n/a') ? 'n/a' : Number(mainState.daysWithRain).toFixed(1)}</p>
                                    </div>
                                    <hr />
                                    <div className="col-7">
                                        <h6 className="f-w-300 d-flex align-items-center m-b-0">{/*<i className="feather icon-arrow-up text-c-green f-30 m-r-5"/>*/} No. Rain days &#62; 10mm</h6>
                                    </div>

                                    <div className="col-5 text-right">
                                        <p className="m-b-0">{(!mainState.daysOfRainGreaterThan10 || mainState.daysOfRainGreaterThan10 === 'n/a') ? 'n/a' : Number(mainState.daysOfRainGreaterThan10).toFixed(1)}</p>
                                    </div>
                                    <hr />
                                    <div className="col-7">
                                        <h6 className="f-w-300 d-flex align-items-center m-b-0">{/*<i className="feather icon-arrow-up text-c-green f-30 m-r-5"/>*/} No. Rain days &#62; 25mm</h6>
                                    </div>

                                    <div className="col-5 text-right">
                                        <p className="m-b-0">{(!mainState.daysOfRainGreaterThan25 || mainState.daysOfRainGreaterThan25 === 'n/a') ? 'n/a' : Number(mainState.daysOfRainGreaterThan25).toFixed(1)}</p>
                                    </div>
                                    <hr />
                                    <div className="col-7">
                                        <h6 className="f-w-300 d-flex align-items-center m-b-0">{/*<i className="feather icon-arrow-up text-c-green f-30 m-r-5"/>*/} Total No. Dry days</h6>
                                    </div>

                                    <div className="col-5 text-right">
                                        <p className="m-b-0">{(!mainState.dryDays || mainState.dryDays === 'n/a') ? 'n/a' : Number(mainState.dryDays).toFixed(1)}</p>
                                    </div>
                                    <hr />
                                    <div className="col-7">
                                        <h6 className="f-w-300 d-flex align-items-center m-b-0">{/*<i className="feather icon-arrow-up text-c-green f-30 m-r-5"/>*/} Max No. Dry days (consec)</h6>
                                    </div>

                                    <div className="col-5 text-right">
                                        <p className="m-b-0">{(!mainState.dryDaysMaxConsec || mainState.dryDaysMaxConsec === 'n/a') ? 'n/a' : Number(mainState.dryDaysMaxConsec).toFixed(1)}</p>
                                    </div>
                                </div>
                                {/*<div className="progress m-t-30" style={{height: '7px'}}>
                                    <div className="progress-bar progress-c-theme" role="progressbar" style={{width: '50%'}} aria-valuenow="50" aria-valuemin="0" aria-valuemax="100"/>
                                </div>*/}
                            </Card.Body>
                        </Card>
                    </Col>
                    <Col md={6} xl={4}>
                        <Card className='Recent-Users'>
                            {/*<Card.Header>
                                <Card.Title as='h5'>Recent Users</Card.Title>
                            </Card.Header>*/}
                            <Card.Body className='px-0 py-2'>
                                <Table responsive hover>
                                    <tbody>
                                    <tr className="unread">
                                        {/*<td><img className="rounded-circle" style={{width: '40px'}} src={avatar1} alt="activity-user"/></td>*/}
                                        <td>
                                            <h6 className="mb-1" style={{visibility: "hidden"}}>Isabella Christensen</h6>
                                            {/*<p className="m-0">Lorem Ipsum is simply dummy text of…</p>*/}
                                        </td>
                                        <td>
                                            <h6 className="text-muted">{/*<i className="fa fa-circle text-c-green f-10 m-r-15"/>*/}MM</h6>
                                        </td>
                                        <td><h6 className="text-muted">Rank</h6>{/*<a href={DEMO.BLANK_LINK} className="label theme-bg2 text-white f-12">Reject</a><a href={DEMO.BLANK_LINK} className="label theme-bg text-white f-12">Approve</a>*/}</td>
                                    </tr>                                
                                    <tr className="unread">
                                        {/*<td><img className="rounded-circle" style={{width: '40px'}} src={avatar1} alt="activity-user"/></td>*/}
                                        <td>
                                            <h6 className="mb-1">{`Annual ${mainState.yearClosed}`}</h6>
                                            {/*<p className="m-0">Lorem Ipsum is simply dummy text of…</p>*/}
                                        </td>
                                        <td>
                                            <h6 className="text-muted">{/*<i className="fa fa-circle text-c-green f-10 m-r-15"/>*/}{Number(mainState.annualRainForLastYear).toFixed(1)}</h6>
                                        </td>
                                        <td><h6 className="text-muted">{(!mainState || !mainState.rank || !mainState.rank.annual || !mainState.rank.annual[mainState.rank.annual.length - 1]) ? 'n/a' : String(mainState.rank.annual[mainState.rank.annual.length -1]) + '/' + String(mainState.opYears)}</h6>{/*  decimalToFraction(mainState.annualRainForLastYear / mainState.overallStationRainfall).display}</h6> <a href={DEMO.BLANK_LINK} className="label theme-bg2 text-white f-12">Reject</a><a href={DEMO.BLANK_LINK} className="label theme-bg text-white f-12">Approve</a>*/}</td>
                                    </tr>
                                    <tr className="unread" style={{visibility: "hidden"}}>
                                        {/*<td><img className="rounded-circle" style={{width: '40px'}} src={avatar1} alt="activity-user"/></td>*/}
                                        <td>
                                            <h6 className="mb-1" style={{visibility: "hidden"}}>Isabella Christensen</h6>
                                            {/*<p className="m-0">Lorem Ipsum is simply dummy text of…</p>*/}
                                        </td>
                                        <td>
                                            <h6 className="text-muted">{/*<i className="fa fa-circle text-c-green f-10 m-r-15"/>*/}MM</h6>
                                        </td>
                                        <td><h6 className="text-muted">Rank</h6>{/*<a href={DEMO.BLANK_LINK} className="label theme-bg2 text-white f-12">Reject</a><a href={DEMO.BLANK_LINK} className="label theme-bg text-white f-12">Approve</a>*/}</td>
                                    </tr>
                                    <tr className="unread">
                                        {/*<td><img className="rounded-circle" style={{width: '40px'}} src={avatar1} alt="activity-user"/></td>*/}
                                        <td>
                                            <h6 className="mb-1">{`Jan ${mainState.yearClosed}`}</h6>
                                            {/*<p className="m-0">Lorem Ipsum is simply dummy text of…</p>*/}
                                        </td>
                                        <td>
                                            <h6 className="text-muted">{/*<i className="fa fa-circle text-c-green f-10 m-r-15"/>*/}{(!mainState.Jan || mainState.Jan === 'n/a') ? 'n/a' : Number(mainState.Jan).toFixed(1)}</h6>
                                        </td>
                                        <td><h6 className="text-muted">{(!mainState || !mainState.rank || !mainState.rank.jan || !mainState.rank.jan[mainState.rank.jan.length - 1]) ? 'n/a' : String(mainState.rank.jan[mainState.rank.jan.length -1]) + '/' + String(mainState.opYears)}</h6>{/* decimalToFraction(mainState.Jan / mainState.annualRainForLastYear).display}</h6> <a href={DEMO.BLANK_LINK} className="label theme-bg2 text-white f-12">Reject</a><a href={DEMO.BLANK_LINK} className="label theme-bg text-white f-12">Approve</a>*/}</td>
                                    </tr>
                                    <tr className="unread">
                                        {/*<td><img className="rounded-circle" style={{width: '40px'}} src={avatar1} alt="activity-user"/></td>*/}
                                        <td>
                                            <h6 className="mb-1">{`Feb ${mainState.yearClosed}`}</h6>
                                            {/*<p className="m-0">Lorem Ipsum is simply dummy text of…</p>*/}
                                        </td>
                                        <td>
                                            <h6 className="text-muted">{/*<i className="fa fa-circle text-c-green f-10 m-r-15"/>*/}{(!mainState.Feb || mainState.Feb === 'n/a') ? 'n/a' : Number(mainState.Feb).toFixed(1)}</h6>
                                        </td>
                                        <td><h6 className="text-muted">{(!mainState || !mainState.rank || !mainState.rank.feb || !mainState.rank.feb[mainState.rank.feb.length - 1]) ? 'n/a' : String(mainState.rank.feb[mainState.rank.feb.length -1]) + '/' + String(mainState.opYears)}</h6>{/*<a href={DEMO.BLANK_LINK} className="label theme-bg2 text-white f-12">Reject</a><a href={DEMO.BLANK_LINK} className="label theme-bg text-white f-12">Approve</a>*/}</td>
                                    </tr>
                                    <tr className="unread">
                                        {/*<td><img className="rounded-circle" style={{width: '40px'}} src={avatar1} alt="activity-user"/></td>*/}
                                        <td>
                                            <h6 className="mb-1">{`Mar ${mainState.yearClosed}`}</h6>
                                            {/*<p className="m-0">Lorem Ipsum is simply dummy text of…</p>*/}
                                        </td>
                                        <td>
                                            <h6 className="text-muted">{/*<i className="fa fa-circle text-c-green f-10 m-r-15"/>*/}{(!mainState.Mar || mainState.Mar === 'n/a') ? 'n/a' : Number(mainState.Mar).toFixed(1)}</h6>
                                        </td>
                                        <td><h6 className="text-muted">{(!mainState || !mainState.rank || !mainState.rank.mar || !mainState.rank.mar[mainState.rank.mar.length - 1]) ? 'n/a' : String(mainState.rank.mar[mainState.rank.mar.length -1]) + '/' + String(mainState.opYears)}</h6>{/*<a href={DEMO.BLANK_LINK} className="label theme-bg2 text-white f-12">Reject</a><a href={DEMO.BLANK_LINK} className="label theme-bg text-white f-12">Approve</a>*/}</td>
                                    </tr>
                                    <tr className="unread">
                                        {/*<td><img className="rounded-circle" style={{width: '40px'}} src={avatar1} alt="activity-user"/></td>*/}
                                        <td>
                                            <h6 className="mb-1">{`Apr ${mainState.yearClosed}`}</h6>
                                            {/*<p className="m-0">Lorem Ipsum is simply dummy text of…</p>*/}
                                        </td>
                                        <td>
                                            <h6 className="text-muted">{/*<i className="fa fa-circle text-c-green f-10 m-r-15"/>*/}{(!mainState.Apr || mainState.Apr === 'n/a') ? 'n/a' : Number(mainState.Apr).toFixed(1)}</h6>
                                        </td>
                                        <td><h6 className="text-muted">{(!mainState || !mainState.rank || !mainState.rank.apr || !mainState.rank.apr[mainState.rank.apr.length - 1]) ? 'n/a' : String(mainState.rank.apr[mainState.rank.apr.length -1]) + '/' + String(mainState.opYears)}</h6>{/*<a href={DEMO.BLANK_LINK} className="label theme-bg2 text-white f-12">Reject</a><a href={DEMO.BLANK_LINK} className="label theme-bg text-white f-12">Approve</a>*/}</td>
                                    </tr>
                                    <tr className="unread">
                                        {/*<td><img className="rounded-circle" style={{width: '40px'}} src={avatar1} alt="activity-user"/></td>*/}
                                        <td>
                                            <h6 className="mb-1">{`May ${mainState.yearClosed}`}</h6>
                                            {/*<p className="m-0">Lorem Ipsum is simply dummy text of…</p>*/}
                                        </td>
                                        <td>
                                            <h6 className="text-muted">{/*<i className="fa fa-circle text-c-green f-10 m-r-15"/>*/}{(!mainState.May || mainState.May === 'n/a') ? 'n/a' : Number(mainState.May).toFixed(1)}</h6>
                                        </td>
                                        <td><h6 className="text-muted">{(!mainState || !mainState.rank || !mainState.rank.may || !mainState.rank.may[mainState.rank.may.length - 1]) ? 'n/a' : String(mainState.rank.may[mainState.rank.may.length -1]) + '/' + String(mainState.opYears)}</h6>{/*<a href={DEMO.BLANK_LINK} className="label theme-bg2 text-white f-12">Reject</a><a href={DEMO.BLANK_LINK} className="label theme-bg text-white f-12">Approve</a>*/}</td>
                                    </tr>
                                    <tr className="unread">
                                        {/*<td><img className="rounded-circle" style={{width: '40px'}} src={avatar1} alt="activity-user"/></td>*/}
                                        <td>
                                            <h6 className="mb-1">{`Jun ${mainState.yearClosed}`}</h6>
                                            {/*<p className="m-0">Lorem Ipsum is simply dummy text of…</p>*/}
                                        </td>
                                        <td>
                                            <h6 className="text-muted">{/*<i className="fa fa-circle text-c-green f-10 m-r-15"/>*/}{(!mainState.Jun || mainState.Jun === 'n/a') ? 'n/a' : Number(mainState.Jun).toFixed(1)}</h6>
                                        </td>
                                        <td><h6 className="text-muted">{(!mainState || !mainState.rank || !mainState.rank.jun || !mainState.rank.jun[mainState.rank.jun.length - 1]) ? 'n/a' : String(mainState.rank.jun[mainState.rank.jun.length -1]) + '/' + String(mainState.opYears)}</h6>{/*<a href={DEMO.BLANK_LINK} className="label theme-bg2 text-white f-12">Reject</a><a href={DEMO.BLANK_LINK} className="label theme-bg text-white f-12">Approve</a>*/}</td>
                                    </tr>
                                    <tr className="unread">
                                        {/*<td><img className="rounded-circle" style={{width: '40px'}} src={avatar1} alt="activity-user"/></td>*/}
                                        <td>
                                            <h6 className="mb-1">{`Jul ${mainState.yearClosed}`}</h6>
                                            {/*<p className="m-0">Lorem Ipsum is simply dummy text of…</p>*/}
                                        </td>
                                        <td>
                                            <h6 className="text-muted">{/*<i className="fa fa-circle text-c-green f-10 m-r-15"/>*/}{(!mainState.Jul || mainState.Jul === 'n/a') ? 'n/a' : Number(mainState.Jul).toFixed(1)}</h6>
                                        </td>
                                        <td><h6 className="text-muted">{(!mainState || !mainState.rank || !mainState.rank.jul || !mainState.rank.jul[mainState.rank.jul.length - 1]) ? 'n/a' : String(mainState.rank.jul[mainState.rank.jul.length -1]) + '/' + String(mainState.opYears)}</h6>{/*<a href={DEMO.BLANK_LINK} className="label theme-bg2 text-white f-12">Reject</a><a href={DEMO.BLANK_LINK} className="label theme-bg text-white f-12">Approve</a>*/}</td>
                                    </tr>
                                    <tr className="unread">
                                        {/*<td><img className="rounded-circle" style={{width: '40px'}} src={avatar1} alt="activity-user"/></td>*/}
                                        <td>
                                            <h6 className="mb-1">{`Aug ${mainState.yearClosed}`}</h6>
                                            {/*<p className="m-0">Lorem Ipsum is simply dummy text of…</p>*/}
                                        </td>
                                        <td>
                                            <h6 className="text-muted">{/*<i className="fa fa-circle text-c-green f-10 m-r-15"/>*/}{(!mainState.Aug || mainState.Aug === 'n/a') ? 'n/a' : Number(mainState.Aug).toFixed(1)}</h6>
                                        </td>
                                        <td><h6 className="text-muted">{(!mainState || !mainState.rank || !mainState.rank.aug || !mainState.rank.aug[mainState.rank.aug.length - 1]) ? 'n/a' : String(mainState.rank.aug[mainState.rank.aug.length -1]) + '/' + String(mainState.opYears)}</h6>{/*<a href={DEMO.BLANK_LINK} className="label theme-bg2 text-white f-12">Reject</a><a href={DEMO.BLANK_LINK} className="label theme-bg text-white f-12">Approve</a>*/}</td>
                                    </tr>
                                    <tr className="unread">
                                        {/*<td><img className="rounded-circle" style={{width: '40px'}} src={avatar1} alt="activity-user"/></td>*/}
                                        <td>
                                            <h6 className="mb-1">{`Sep ${mainState.yearClosed}`}</h6>
                                            {/*<p className="m-0">Lorem Ipsum is simply dummy text of…</p>*/}
                                        </td>
                                        <td>
                                            <h6 className="text-muted">{/*<i className="fa fa-circle text-c-green f-10 m-r-15"/>*/}{(!mainState.Sep || mainState.Sep === 'n/a') ? 'n/a' : Number(mainState.Sep).toFixed(1)}</h6>
                                        </td>
                                        <td><h6 className="text-muted">{(!mainState || !mainState.rank || !mainState.rank.sep || !mainState.rank.sep[mainState.rank.sep.length - 1]) ? 'n/a' : String(mainState.rank.sep[mainState.rank.sep.length -1]) + '/' + String(mainState.opYears)}</h6>{/*<a href={DEMO.BLANK_LINK} className="label theme-bg2 text-white f-12">Reject</a><a href={DEMO.BLANK_LINK} className="label theme-bg text-white f-12">Approve</a>*/}</td>
                                    </tr>
                                    <tr className="unread">
                                        {/*<td><img className="rounded-circle" style={{width: '40px'}} src={avatar1} alt="activity-user"/></td>*/}
                                        <td>
                                            <h6 className="mb-1">{`Oct ${mainState.yearClosed}`}</h6>
                                            {/*<p className="m-0">Lorem Ipsum is simply dummy text of…</p>*/}
                                        </td>
                                        <td>
                                            <h6 className="text-muted">{/*<i className="fa fa-circle text-c-green f-10 m-r-15"/>*/}{(!mainState.Oct || mainState.Oct === 'n/a') ? 'n/a' : Number(mainState.Oct).toFixed(1)}</h6>
                                        </td>
                                        <td><h6 className="text-muted">{(!mainState || !mainState.rank || !mainState.rank.oct || !mainState.rank.oct[mainState.rank.oct.length - 1]) ? 'n/a' : String(mainState.rank.oct[mainState.rank.oct.length -1]) + '/' + String(mainState.opYears)}</h6>{/*<a href={DEMO.BLANK_LINK} className="label theme-bg2 text-white f-12">Reject</a><a href={DEMO.BLANK_LINK} className="label theme-bg text-white f-12">Approve</a>*/}</td>
                                    </tr>
                                    <tr className="unread">
                                        {/*<td><img className="rounded-circle" style={{width: '40px'}} src={avatar1} alt="activity-user"/></td>*/}
                                        <td>
                                            <h6 className="mb-1">{`Nov ${mainState.yearClosed}`}</h6>
                                            {/*<p className="m-0">Lorem Ipsum is simply dummy text of…</p>*/}
                                        </td>
                                        <td>
                                            <h6 className="text-muted">{/*<i className="fa fa-circle text-c-green f-10 m-r-15"/>*/}{(!mainState.Nov || mainState.Nov === 'n/a') ? 'n/a' : Number(mainState.Nov).toFixed(1)}</h6>
                                        </td>
                                        <td><h6 className="text-muted">{(!mainState || !mainState.rank || !mainState.rank.nov || !mainState.rank.nov[mainState.rank.nov.length - 1]) ? 'n/a' : String(mainState.rank.nov[mainState.rank.nov.length -1]) + '/' + String(mainState.opYears)}</h6>{/*<a href={DEMO.BLANK_LINK} className="label theme-bg2 text-white f-12">Reject</a><a href={DEMO.BLANK_LINK} className="label theme-bg text-white f-12">Approve</a>*/}</td>
                                    </tr>
                                    <tr className="unread">
                                        {/*<td><img className="rounded-circle" style={{width: '40px'}} src={avatar1} alt="activity-user"/></td>*/}
                                        <td>
                                            <h6 className="mb-1">{`Dec ${mainState.yearClosed}`}</h6>
                                            {/*<p className="m-0">Lorem Ipsum is simply dummy text of…</p>*/}
                                        </td>
                                        <td>
                                            <h6 className="text-muted">{/*<i className="fa fa-circle text-c-green f-10 m-r-15"/>*/}{(!mainState.Dec || mainState.Dec === 'n/a') ? 'n/a' : Number(mainState.Dec).toFixed(1)}</h6>
                                        </td>
                                        <td><h6 className="text-muted">{(!mainState || !mainState.rank || !mainState.rank.dec || !mainState.rank.dec[mainState.rank.dec.length - 1]) ? 'n/a' : String(mainState.rank.dec[mainState.rank.dec.length -1]) + '/' + String(mainState.opYears)}</h6>{/*<a href={DEMO.BLANK_LINK} className="label theme-bg2 text-white f-12">Reject</a><a href={DEMO.BLANK_LINK} className="label theme-bg text-white f-12">Approve</a>*/}</td>
                                    </tr>
                                    <tr className="unread" style={{visibility: "hidden"}}>
                                        {/*<td><img className="rounded-circle" style={{width: '40px'}} src={avatar1} alt="activity-user"/></td>*/}
                                        <td>
                                            <h6 className="mb-1" style={{visibility: "hidden"}}>Isabella Christensen</h6>
                                            {/*<p className="m-0">Lorem Ipsum is simply dummy text of…</p>*/}
                                        </td>
                                        <td>
                                            <h6 className="text-muted">{/*<i className="fa fa-circle text-c-green f-10 m-r-15"/>*/}MM</h6>
                                        </td>
                                        <td><h6 className="text-muted">Rank</h6>{/*<a href={DEMO.BLANK_LINK} className="label theme-bg2 text-white f-12">Reject</a><a href={DEMO.BLANK_LINK} className="label theme-bg text-white f-12">Approve</a>*/}</td>
                                    </tr>
                                    <tr className="unread">
                                        {/*<td><img className="rounded-circle" style={{width: '40px'}} src={avatar1} alt="activity-user"/></td>*/}
                                        <td>
                                            <h6 className="mb-1">{`Summer ${mainState.yearClosed}`}</h6>
                                            {/*<p className="m-0">Lorem Ipsum is simply dummy text of…</p>*/}
                                        </td>
                                        <td>
                                            <h6 className="text-muted">{/*<i className="fa fa-circle text-c-green f-10 m-r-15"/>*/}{mainState.summer === 'n/a' ? mainState.summer : Number(mainState.summer).toFixed(1)}</h6>
                                        </td>
                                        <td><h6 className="text-muted">{(!mainState || !mainState.rank || !mainState.rank.summer || !mainState.rank.summer[mainState.rank.summer.length - 1]) ? 'n/a' : String(mainState.rank.summer[mainState.rank.summer.length -1]) + '/' + String(mainState.opYears)}</h6>{/*<a href={DEMO.BLANK_LINK} className="label theme-bg2 text-white f-12">Reject</a><a href={DEMO.BLANK_LINK} className="label theme-bg text-white f-12">Approve</a>*/}</td>
                                    </tr>
                                    <tr className="unread">
                                        {/*<td><img className="rounded-circle" style={{width: '40px'}} src={avatar1} alt="activity-user"/></td>*/}
                                        <td>
                                            <h6 className="mb-1">{`Autumn ${mainState.yearClosed}`}</h6>
                                            {/*<p className="m-0">Lorem Ipsum is simply dummy text of…</p>*/}
                                        </td>
                                        <td>
                                            <h6 className="text-muted">{/*<i className="fa fa-circle text-c-green f-10 m-r-15"/>*/}{mainState.autumn === 'n/a' ? mainState.autumn : Number(mainState.autumn).toFixed(1)}</h6>
                                        </td>
                                        <td><h6 className="text-muted">{(!mainState || !mainState.rank || !mainState.rank.autumn || !mainState.rank.autumn[mainState.rank.autumn.length - 1]) ? 'n/a' : String(mainState.rank.autumn[mainState.rank.autumn.length -1]) + '/' + String(mainState.opYears)}</h6>{/*<a href={DEMO.BLANK_LINK} className="label theme-bg2 text-white f-12">Reject</a><a href={DEMO.BLANK_LINK} className="label theme-bg text-white f-12">Approve</a>*/}</td>
                                    </tr>
                                    <tr className="unread">
                                        {/*<td><img className="rounded-circle" style={{width: '40px'}} src={avatar1} alt="activity-user"/></td>*/}
                                        <td>
                                            <h6 className="mb-1">{`Winter ${mainState.yearClosed}`}</h6>
                                            {/*<p className="m-0">Lorem Ipsum is simply dummy text of…</p>*/}
                                        </td>
                                        <td>
                                            <h6 className="text-muted">{/*<i className="fa fa-circle text-c-green f-10 m-r-15"/>*/}{mainState.winter === 'n/a' ? mainState.winter : Number(mainState.winter).toFixed(1)}</h6>
                                        </td>
                                        <td><h6 className="text-muted">{(!mainState || !mainState.rank || !mainState.rank.mar || !mainState.rank.winter[mainState.rank.winter.length - 1]) ? 'n/a' : String(mainState.rank.winter[mainState.rank.winter.length -1]) + '/' + String(mainState.opYears)}</h6>{/*<a href={DEMO.BLANK_LINK} className="label theme-bg2 text-white f-12">Reject</a><a href={DEMO.BLANK_LINK} className="label theme-bg text-white f-12">Approve</a>*/}</td>
                                    </tr>
                                    <tr className="unread">
                                        {/*<td><img className="rounded-circle" style={{width: '40px'}} src={avatar1} alt="activity-user"/></td>*/}
                                        <td>
                                            <h6 className="mb-1">{`Spring ${mainState.yearClosed}`}</h6>
                                            {/*<p className="m-0">Lorem Ipsum is simply dummy text of…</p>*/}
                                        </td>
                                        <td>
                                            <h6 className="text-muted">{/*<i className="fa fa-circle text-c-green f-10 m-r-15"/>*/}{mainState.spring === 'n/a' ? mainState.spring : Number(mainState.spring).toFixed(1)}</h6>
                                        </td>
                                        <td><h6 className="text-muted">{(!mainState || !mainState.rank || !mainState.rank.spring || !mainState.rank.spring[mainState.rank.spring.length - 1]) ? 'n/a' : String(mainState.rank.spring[mainState.rank.spring.length -1]) + '/' + String(mainState.opYears)}</h6>{/*<a href={DEMO.BLANK_LINK} className="label theme-bg2 text-white f-12">Reject</a><a href={DEMO.BLANK_LINK} className="label theme-bg text-white f-12">Approve</a>*/}</td>
                                    </tr>
                                    {/*<tr className="unread">
                                        <td><img className="rounded-circle" style={{width: '40px'}} src={avatar2} alt="activity-user"/></td>
                                        <td>
                                            <h6 className="mb-1">Mathilde Andersen</h6>
                                            <p className="m-0">Lorem Ipsum is simply dummy text of…</p>
                                        </td>
                                        <td>
                                            <h6 className="text-muted"><i className="fa fa-circle text-c-red f-10 m-r-15"/>11 MAY 10:35</h6>
                                        </td>
                                        <td><a href={DEMO.BLANK_LINK} className="label theme-bg2 text-white f-12">Reject</a><a href={DEMO.BLANK_LINK} className="label theme-bg text-white f-12">Approve</a></td>
                                    </tr>
                                    <tr className="unread">
                                        <td><img className="rounded-circle" style={{width: '40px'}} src={avatar3} alt="activity-user"/></td>
                                        <td>
                                            <h6 className="mb-1">Karla Sorensen</h6>
                                            <p className="m-0">Lorem Ipsum is simply dummy text of…</p>
                                        </td>
                                        <td>
                                            <h6 className="text-muted"><i className="fa fa-circle text-c-green f-10 m-r-15"/>9 MAY 17:38</h6>
                                        </td>
                                        <td><a href={DEMO.BLANK_LINK} className="label theme-bg2 text-white f-12">Reject</a><a href={DEMO.BLANK_LINK} className="label theme-bg text-white f-12">Approve</a></td>
                                    </tr>
                                    <tr className="unread">
                                        <td><img className="rounded-circle" style={{width: '40px'}} src={avatar1} alt="activity-user"/></td>
                                        <td>
                                            <h6 className="mb-1">Ida Jorgensen</h6>
                                            <p className="m-0">Lorem Ipsum is simply dummy text of…</p>
                                        </td>
                                        <td>
                                            <h6 className="text-muted f-w-300"><i className="fa fa-circle text-c-red f-10 m-r-15"/>19 MAY 12:56</h6>
                                        </td>
                                        <td><a href={DEMO.BLANK_LINK} className="label theme-bg2 text-white f-12">Reject</a><a href={DEMO.BLANK_LINK} className="label theme-bg text-white f-12">Approve</a></td>
                                    </tr>
                                    <tr className="unread">
                                        <td><img className="rounded-circle" style={{width: '40px'}} src={avatar2} alt="activity-user"/></td>
                                        <td>
                                            <h6 className="mb-1">Albert Andersen</h6>
                                            <p className="m-0">Lorem Ipsum is simply dummy text of…</p>
                                        </td>
                                        <td>
                                            <h6 className="text-muted"><i className="fa fa-circle text-c-green f-10 m-r-15"/>21 July 12:56</h6>
                                        </td>
                                        <td><a href={DEMO.BLANK_LINK} className="label theme-bg2 text-white f-12">Reject</a><a href={DEMO.BLANK_LINK} className="label theme-bg text-white f-12">Approve</a></td>
                                    </tr>*/}
                                    </tbody>
                                </Table>
                            </Card.Body>
                        </Card>
                    </Col>
                    <Col md={12} xl={5}>
                        <Card>
                                <Card.Header>
                                    <Card.Title as="h5">Line Chart</Card.Title>
                                </Card.Header>
                                <Card.Body>
                                    <LineChart data={mainState.lineChartData} m={'Annual'} />
                                </Card.Body>
                        </Card>                    
                    </Col>
                    {/*<Col md={6} xl={8}>                        
                    </Col>
                    <Col md={6} xl={4}>
                        <Card className='card-event'>
                            <Card.Body>
                                <div className="row align-items-center justify-content-center">
                                    <div className="col">
                                        <h5 className="m-0">Upcoming Event</h5>
                                    </div>
                                    <div className="col-auto">
                                        <label className="label theme-bg2 text-white f-14 f-w-400 float-right">34%</label>
                                    </div>
                                </div>
                                <h2 className="mt-2 f-w-300">45<sub className="text-muted f-14">Competitors</sub></h2>
                                <h6 className="text-muted mt-3 mb-0">You can participate in event </h6>
                                <i className="fa fa-angellist text-c-purple f-50"/>
                            </Card.Body>
                        </Card>
                        <Card>
                            <Card.Body className='border-bottom'>
                                <div className="row d-flex align-items-center">
                                    <div className="col-auto">
                                        <i className="feather icon-zap f-30 text-c-green"/>
                                    </div>
                                    <div className="col">
                                        <h3 className="f-w-300">235</h3>
                                        <span className="d-block text-uppercase">total ideas</span>
                                    </div>
                                </div>
                            </Card.Body>
                            <Card.Body>
                                <div className="row d-flex align-items-center">
                                    <div className="col-auto">
                                        <i className="feather icon-map-pin f-30 text-c-blue"/>
                                    </div>
                                    <div className="col">
                                        <h3 className="f-w-300">26</h3>
                                        <span className="d-block text-uppercase">total locations</span>
                                    </div>
                                </div>
                            </Card.Body>
                        </Card>
                    </Col>
                    <Col md={6} xl={4}>
                        <Card className='card-social'>
                            <Card.Body className='border-bottom'>
                                <div className="row align-items-center justify-content-center">
                                    <div className="col-auto">
                                        <i className="fa fa-facebook text-primary f-36"/>
                                    </div>
                                    <div className="col text-right">
                                        <h3>12,281</h3>
                                        <h5 className="text-c-green mb-0">+7.2% <span className="text-muted">Total Likes</span></h5>
                                    </div>
                                </div>
                            </Card.Body>
                            <Card.Body>
                                <div className="row align-items-center justify-content-center card-active">
                                    <div className="col-6">
                                        <h6 className="text-center m-b-10"><span className="text-muted m-r-5">Target:</span>35,098</h6>
                                        <div className="progress">
                                            <div className="progress-bar progress-c-theme" role="progressbar" style={{width: '60%', height: '6px'}} aria-valuenow="60" aria-valuemin="0" aria-valuemax="100"/>
                                        </div>
                                    </div>
                                    <div className="col-6">
                                        <h6 className="text-center  m-b-10"><span className="text-muted m-r-5">Duration:</span>350</h6>
                                        <div className="progress">
                                            <div className="progress-bar progress-c-theme2" role="progressbar" style={{width: '45%', height: '6px'}} aria-valuenow="45" aria-valuemin="0" aria-valuemax="100"/>
                                        </div>
                                    </div>
                                </div>
                            </Card.Body>
                        </Card>
                    </Col>
                    <Col md={6} xl={4}>
                        <Card className='card-social'>
                            <Card.Body className='border-bottom'>
                                <div className="row align-items-center justify-content-center">
                                    <div className="col-auto">
                                        <i className="fa fa-twitter text-c-blue f-36"/>
                                    </div>
                                    <div className="col text-right">
                                        <h3>11,200</h3>
                                        <h5 className="text-c-purple mb-0">+6.2% <span className="text-muted">Total Likes</span></h5>
                                    </div>
                                </div>
                            </Card.Body>
                            <Card.Body>
                                <div className="row align-items-center justify-content-center card-active">
                                    <div className="col-6">
                                        <h6 className="text-center m-b-10"><span className="text-muted m-r-5">Target:</span>34,185</h6>
                                        <div className="progress">
                                            <div className="progress-bar progress-c-green" role="progressbar" style={{width: '40%', height: '6px'}} aria-valuenow="40" aria-valuemin="0" aria-valuemax="100"/>
                                        </div>
                                    </div>
                                    <div className="col-6">
                                        <h6 className="text-center  m-b-10"><span className="text-muted m-r-5">Duration:</span>800</h6>
                                        <div className="progress">
                                            <div className="progress-bar progress-c-blue" role="progressbar" style={{width: '70%', height: '6px'}} aria-valuenow="70" aria-valuemin="0" aria-valuemax="100"/>
                                        </div>
                                    </div>
                                </div>
                            </Card.Body>
                        </Card>
                    </Col>
                    <Col xl={4}>
                        <Card className='card-social'>
                            <Card.Body className='border-bottom'>
                                <div className="row align-items-center justify-content-center">
                                    <div className="col-auto">
                                        <i className="fa fa-google-plus text-c-red f-36"/>
                                    </div>
                                    <div className="col text-right">
                                        <h3>10,500</h3>
                                        <h5 className="text-c-blue mb-0">+5.9% <span className="text-muted">Total Likes</span></h5>
                                    </div>
                                </div>
                            </Card.Body>
                            <Card.Body>
                                <div className="row align-items-center justify-content-center card-active">
                                    <div className="col-6">
                                        <h6 className="text-center m-b-10"><span className="text-muted m-r-5">Target:</span>25,998</h6>
                                        <div className="progress">
                                            <div className="progress-bar progress-c-theme" role="progressbar" style={{width: '80%', height: '6px'}} aria-valuenow="80" aria-valuemin="0" aria-valuemax="100"/>
                                        </div>
                                    </div>
                                    <div className="col-6">
                                        <h6 className="text-center  m-b-10"><span className="text-muted m-r-5">Duration:</span>900</h6>
                                        <div className="progress">
                                            <div className="progress-bar progress-c-theme2" role="progressbar" style={{width: '50%', height: '6px'}} aria-valuenow="50" aria-valuemin="0" aria-valuemax="100"/>
                                        </div>
                                    </div>
                                </div>
                            </Card.Body>
                        </Card>
                    </Col>
                    <Col md={6} xl={4}>
                        <Card>
                            <Card.Header>
                                <Card.Title as='h5'>Rating</Card.Title>
                            </Card.Header>
                            <Card.Body>
                                <div className="row align-items-center justify-content-center m-b-20">
                                    <div className="col-6">
                                        <h2 className="f-w-300 d-flex align-items-center float-left m-0">4.7 <i className="fa fa-star f-10 m-l-10 text-c-yellow"/></h2>
                                    </div>
                                    <div className="col-6">
                                        <h6 className="d-flex  align-items-center float-right m-0">0.4 <i className="fa fa-caret-up text-c-green f-22 m-l-10"/></h6>
                                    </div>
                                </div>

                                <div className="row">
                                    <div className="col-xl-12">
                                        <h6 className="align-items-center float-left"><i className="fa fa-star f-10 m-r-10 text-c-yellow"/>5</h6>
                                        <h6 className="align-items-center float-right">384</h6>
                                        <div className="progress m-t-30 m-b-20" style={{height: '6px'}}>
                                            <div className="progress-bar progress-c-theme" role="progressbar" style={{width: '70%'}} aria-valuenow="70" aria-valuemin="0" aria-valuemax="100"/>
                                        </div>
                                    </div>

                                    <div className="col-xl-12">
                                        <h6 className="align-items-center float-left"><i className="fa fa-star f-10 m-r-10 text-c-yellow"/>4</h6>
                                        <h6 className="align-items-center float-right">145</h6>
                                        <div className="progress m-t-30  m-b-20" style={{height: '6px'}}>
                                            <div className="progress-bar progress-c-theme" role="progressbar" style={{width: '35%'}} aria-valuenow="35" aria-valuemin="0" aria-valuemax="100"/>
                                        </div>
                                    </div>

                                    <div className="col-xl-12">
                                        <h6 className="align-items-center float-left"><i className="fa fa-star f-10 m-r-10 text-c-yellow"/>3</h6>
                                        <h6 className="align-items-center float-right">24</h6>
                                        <div className="progress m-t-30  m-b-20" style={{height: '6px'}}>
                                            <div className="progress-bar progress-c-theme" role="progressbar" style={{width: '25%'}} aria-valuenow="25" aria-valuemin="0" aria-valuemax="100"/>
                                        </div>
                                    </div>

                                    <div className="col-xl-12">
                                        <h6 className="align-items-center float-left"><i className="fa fa-star f-10 m-r-10 text-c-yellow"/>2</h6>
                                        <h6 className="align-items-center float-right">1</h6>
                                        <div className="progress m-t-30  m-b-20" style={{height: '6px'}}>
                                            <div className="progress-bar progress-c-theme" role="progressbar" style={{width: '10%'}} aria-valuenow="10" aria-valuemin="0" aria-valuemax="100"/>
                                        </div>
                                    </div>
                                    <div className="col-xl-12">
                                        <h6 className="align-items-center float-left"><i className="fa fa-star f-10 m-r-10 text-c-yellow"/>1</h6>
                                        <h6 className="align-items-center float-right">0</h6>
                                        <div className="progress m-t-30  m-b-5" style={{height: '6px'}}>
                                            <div className="progress-bar" role="progressbar" style={{width: '0%'}} aria-valuenow="0" aria-valuemin="0" aria-valuemax="100"/>
                                        </div>
                                    </div>
                                </div>
                            </Card.Body>
                        </Card>
                    </Col>
                    <Col md={6} xl={8} className='m-b-30'>
                        <Tabs defaultActiveKey="today" id="uncontrolled-tab-example">
                            <Tab eventKey="today" title="Today">
                                {tabContent}
                            </Tab>
                            <Tab eventKey="week" title="This Week">
                                {tabContent}
                            </Tab>
                            <Tab eventKey="all" title="All">
                                {tabContent}
                            </Tab>
                        </Tabs>
                    </Col>*/} 
                </Row>             
            </Aux>            
    );
}

const mapStateToProps = state => {
    return {
        weatherType: state.weatherType,
        isComputing: state.isComputing,
        isFetching: state.isFetching
    }
};

const mapDispatchToProps = dispatch => {
    return {
        setIsFetching: (isFetchingStatus) => {            
            dispatch({type: actionTypes.SET_IS_FETCHING, isFetchingStatus});
        },
        setIsComputing: (isComputingStatus) => {
            dispatch({type: actionTypes.SET_IS_COMPUTING, isComputingStatus});
        }
    }
}

export default memo(connect(mapStateToProps, mapDispatchToProps)(Dashboard));
//withRouter(connect(mapStateToProps, mapDispatchToProps) (windowSize(NavItem)));