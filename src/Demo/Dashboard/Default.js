import React, { useState, useEffect } from 'react';
import { Row, Col, Card, Table, Form } from 'react-bootstrap' // Tabs, Tab, Form } from 'react-bootstrap';

import UserService from "../services/user.service.js"
import { decimalToFraction } from "../services/decimalToFraction.js"
import FastService from "../services/fast.service.js"

import Loader from '../../App/layout/Loader'
import LineChart from "../Charts/Nvd3Chart/LineChart";
import MultiBarChart from "../Charts/Nvd3Chart/MultiBarChart";
import Aux from "../../hoc/_Aux";
//import DEMO from "../../store/constant";
//import avatar1 from '../../assets/images/user/avatar-1.jpg';
//import avatar2 from '../../assets/images/user/avatar-2.jpg';
//import avatar3 from '../../assets/images/user/avatar-3.jpg';
import RawDataTable from '../Tables/BootstrapTable';
//import { setObservableConfig } from 'recompose';
//import { Slide } from '../slider/index.js';
//import { data } from 'jquery';

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

const Dashboard = (props) => {  
        
    const [ weatherType, setWeatherType ] = useState('Rainfall');
    const [ queryCode, setQueryCode ] = useState('68005');
    const [ isFetching, setIsFetching ] = useState(true);
    const [ mainState, setMainState ] = useState({});     
    const [ filterControl, setFilterControl ] = useState('Overview');
    const [ seasonControl, setSeasonControl ] = useState('Summer');
    const [ monthlyControl, setMonthlyControl ] = useState('February');
    const [ ojiControl, setOjiControl ] = useState('OJ');

    const onChange = (e) => {
        e.stopPropagation();
        setIsFetching(true);
        if (e.target.name === 'queryCode') {
            setQueryCode(e.target.value);
        } else if (e.target.name === 'weatherType') {
            setWeatherType(e.target.value); 
        } else if (e.target.name === 'seasonControl') {
            setSeasonControl(e.target.value); 
        } else if (e.target.name === 'monthlyControl') {
            setMonthlyControl(e.target.value); 
        } else if (e.target.name === 'ojiControl') {
            setOjiControl(e.target.value); 
        } else {
            setFilterControl(e.target.value);
        }
    }

 

    useEffect(() => {        
        async function fetchData() {            
            await UserService.getUserBoard().then(async () => {                                
                let mainData = {};
                //get station codes and weather data from api
                let codes = '';
                let data = '';
                await FastService.getStationCodes().then((response) => {
                    codes = response;
                }, (e) => {
                    console.log(e);
                });                        
                await FastService.getWeatherContent(weatherType, queryCode).then((response) => {
                    data = response;
                }, (e) => {
                    console.log(e);
                }); 
                
                mainData.category = "Renewables";               
                
                if (codes && data) {
                    mainData.data = data;
                    //set station codes for form render
                    mainData.stationCodes = codes;                                  

                    //set location
                    let location = codes.find((a) => {                        
                        return a.code === queryCode;
                    });                               
                    mainData.location = location.station;
                                       
                    //set station state
                    let stationState = codes.find((a) => {
                        return a.state === queryCode;
                    });
                    if (stationState) {mainData.stationState = stationState;} else {mainData.stationState = 'n/a';}

                    //set year opened
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
                    //let yearMonthAndFreq = {};
                    
                    //counter for arrOfYear
                    let counter = 1;
                    //counter for arrOfYearAndMonth
                    //let counter2 = 1;
                    for (let i = 0; i < arrOfYear.length; i++) {
                        if (arrOfYear[i] === arrOfYear[i + 1]) {
                            counter++;                        
                        } else {
                            yearsAndNumYears[arrOfYear[i]] = counter;
                            counter = 1;
                        }                                                 
                    }

                    //calculate maximum rainfall for each year.                                        
                    let year1 = Object.keys(yearsAndNumYears);
                    let freq = Object.values(yearsAndNumYears);

                    //calculate maximum rainfall for each year and then month. Also on five years basis.
                    let sumOfRainfallPerYear = {}, sumOfRainfallPerMonth = {}, sumOfRainfallPerFiveYears = {};
                    
                    let forMonthlyTable = [], forAnnualTable = [], forMonthlyFilterTable = [], forAveragesFilterTable = [], forOJIndexTable = [];
                    let forAveragesLineChart = [];

                    //five year basis array.
                    let fiveYearsArr = [];
                    let basis = 5;
                    let fiveYearStart = year1[0];                    

                    //seasonal data for last year
                    let winter = [], spring = [], summer = [], autumn = [];                    

                    //consec dry days                    
                    let dryDaysMaxConsec = {};
                    let dryDaysConsec = [];

                    //last year info data:
                    let daysWithRain = [], daysOfRainGreaterThan10 = [], daysOfRainGreaterThan25 = [], dryDays = [];

                    //array to hold lineChart data
                    let lineChartData = [];                    
                    
                    let h1 = [], h2 = [], q1 = [], q2 = [], q3 = [], q4 = [];

                    let h_1 = [], h_2 = [], q_1 = [], q_2 = [], q_3 = [], q_4 = [], winter_1 = [], spring_1 = [], summer_1 = [], autumn_1 = [];

                    //for each year (overall)
                    let winter2 = [], spring2 = [], summer2 = [], autumn2 = [], winter_cc = [], winterStartDecRain = [];

                    //for each month per year. g means graph (for monthly filter contents)
                    let g_jan = [], g_feb = [], g_mar = [], g_apr = [], g_may = [], g_jun = [], g_jul = [], g_aug = [], g_sep = [], g_oct = [], g_nov = [], g_dec = [];

                    //for oji line chart
                    let oji = [], sji = [], aji = [];

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
                        
                        let janDecRainPerYear = [];
                        let janDecRainPerYearAvg = [];

                        //for aj, sj and oj
                        let ad = [], sd = [], od = [];

                        for (let k = start; k <= end - 1; k++) {
                            //calculate yearly
                            arr.push(arrOfRainfall[k]);                            

                            //calculate five years interval/basis.
                            fiveYearsArr.push(Number(arrOfRainfall[k]));
                            if (i === basis) {
                                let fiveYearEnd = year1[basis - 1];
                                let fiveYearStartAndEnd = fiveYearStart + '-' + fiveYearEnd;
                                sumOfRainfallPerFiveYears[fiveYearStartAndEnd] = fiveYearsArr.reduce(function(a, b) {
                                    return a + b;
                                }, 0);
                                fiveYearsArr = [];
                                fiveYearsArr.push(Number(arrOfRainfall[k]));
                                fiveYearStart = year1[basis];
                                basis += 5;                                
                            }                                                                                    

                            //consec dry days
                            if (arrOfRainfall[k] === 0) {                               
                                if (arrOfRainfall[k] === arrOfRainfall[k + 1]) {
                                    dryDaysConsec.push(arrOfRainfall[k]);
                                } else {                                    
                                    dryDaysMaxConsec[k] = dryDaysConsec.length;
                                    dryDaysConsec = [];
                                }
                            }

                            //calculate monthly           
                            let y = arrOfYearAndMonth[k].split('-');                 
                                                        
                            //last year daily data
                            if (String(data[k].year) === year1[year1.length - 1]) {
                                //last year data info.                            
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

                            //---------------------------------------------
                            
                            //seasonal
                            //season data for each other year including last
                            if (y[1] === '1' || y[1] === '2') {
                                winter2.push(Number(arrOfRainfall[k]));
                            }                                                                
                            if (y[1] === '3' || y[1] === '4' || y[1] === '5') {
                                spring2.push(Number(arrOfRainfall[k]));
                            }         
                            if (y[1] === '6' || y[1] === '7' || y[1] === '8') {
                                summer2.push(Number(arrOfRainfall[k]));
                            }         
                            if (y[1] === '9' || y[1] === '10' || y[1] === '11') {
                                autumn2.push(Number(arrOfRainfall[k]));
                            }
                            //next year's winter begins
                            if (y[1] === '12') {
                                winter_cc.push(Number(arrOfRainfall[k]));
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
                                od.push(Number(arrOfRainfall[k]));
                            }
                            //for sj
                            if (y[1] === '9' || y[1] === '10' || y[1] === '11' || y[1] === '12') {
                                sd.push(Number(arrOfRainfall[k]));
                            }
                            //for aj
                            if (y[1] === '8' || y[1] === '9' || y[1] === '10' || y[1] === '11' || y[1] === '12') {
                                ad.push(Number(arrOfRainfall[k]));
                            }                            

                            //--------------------------------------------

                            //monthly continues...                    
                            if (y[0] === String(data[k].year) && y[1] === String(data[k].month)) {                                                                                
                                if (arrOfYearAndMonth[k] === arrOfYearAndMonth[k + 1]) {                                    
                                    monthArray.push(Number(arrOfRainfall[k]));                                    
                                } else {
                                    monthArray.push(Number(arrOfRainfall[k]));
                                    //add up month rainfall data
                                    let sumOfMonthlyRain = monthArray.reduce(function(a, b) {
                                        return a + b;
                                    }, 0);
                                    sumOfRainfallPerMonth[arrOfYearAndMonth[k]] = sumOfMonthlyRain;

                                    //preparing monthly filter
                                    janDecRainPerYear.push(sumOfMonthlyRain);
                                    janDecRainPerYearAvg.push(sumOfMonthlyRain/monthArray.length);
                                                                        
                                    //array to hold monthly data for monthly component
                                    forMonthlyTable.push({ 
                                        product_code: data[k].product_code,
                                        station_number: data[k].station_number,
                                        year: data[k].year,
                                        month: data[k].month,                                        
                                        rainfall_amount: sumOfMonthlyRain,
                                        quality: data[k].quality
                                    });

                                    //for monthly line and bar chart. g means for graph (in monthly filter)
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

                                    //all months of the last year.
                                    if (String(data[k].year) === year1[year1.length - 1]) {                                        
                                        if (sumOfMonthlyRain) {                                            
                                            mainData[getMonthlyMaxMonth(Number(y[1]))] = sumOfMonthlyRain;
                                        } else {                                            
                                            mainData[getMonthlyMaxMonth(Number(y[1]))] = 'n/a';
                                        }
                                    }

                                    //reset
                                    monthArray = [];
                                }
                            }
                        }

                        //sum of rainfall data by year;
                        let sumOfRainfall = arr.reduce(function(a, b) {
                            return a + b;
                        }, 0);

                        sumOfRainfallPerYear[year1[i]] = sumOfRainfall;

                        //lineChart Data
                        lineChartData.push({x: year1[i], y: sumOfRainfall});                                            

                        forAnnualTable.push({year: year1[i], rainfall_amount: sumOfRainfall});
                        
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
                        let winterLength = '';
                        if (winterStartDecRain[-2]) {
                            sumOfWinterPerYear += winterStartDecRain[-2];
                            winterLength = winter2.length + winter_cc.length;
                        } else {
                            winterLength = winter2.length;
                        }

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
                        
                        //set season start
                        let from = '';
                        if (year1[i] === year1[0]) {
                            from = year1[i];
                        } else {
                            from = Number(year1[i]) - 1
                        }

                        //for averages filter table
                        forAveragesFilterTable.push({
                            year: [year1[i]], 
                            jan: janDecRainPerYearAvg[0] || -1, 
                            feb: janDecRainPerYearAvg[1] || -1,
                            mar: janDecRainPerYearAvg[2] || -1, 
                            apr: janDecRainPerYearAvg[3] || -1,
                            may: janDecRainPerYearAvg[4] || -1,
                            jun: janDecRainPerYearAvg[5] || -1,
                            jul: janDecRainPerYearAvg[6] || -1,
                            aug: janDecRainPerYearAvg[7] || -1,
                            sep: janDecRainPerYearAvg[8] || -1,
                            oct: janDecRainPerYearAvg[9] || -1,
                            nov: janDecRainPerYearAvg[10] || -1,
                            dec: janDecRainPerYearAvg[11] || -1,
                            annual: sumOfRainfall/arr.length || -1,
                            q1: sumOfQ1PerYear/q1.length || -1,
                            q2: sumOfQ2PerYear/q2.length || -1,
                            q3: sumOfQ3PerYear/q3.length || -1,
                            q4: sumOfQ4PerYear/q4.length || -1,
                            h1: sumOfH1PerYear/h1.length || -1,
                            h2: sumOfH2PerYear/h2.length || -1,
                            winter: sumOfWinterPerYear/winterLength || -1,
                            spring: sumOfSpringPerYear/spring2.length || -1,
                            summer: sumOfSummerPerYear/summer2.length || -1,
                            autumn: sumOfAutumnPerYear/autumn2.length || -1,
                            from,
                            to: year1[i]
                        });

                        //for averages line chart
                        forAveragesLineChart.push({x: year1[i], y: sumOfRainfall/arr.length || 0});

                        //for monthly, seasonal and H1H2Q1Q4 filter table
                        forMonthlyFilterTable.push({
                            year: [year1[i]], 
                            jan: janDecRainPerYear[0] || -1, 
                            feb: janDecRainPerYear[1] || -1,
                            mar: janDecRainPerYear[2] || -1, 
                            apr: janDecRainPerYear[3] || -1,
                            may: janDecRainPerYear[4] || -1,
                            jun: janDecRainPerYear[5] || -1,
                            jul: janDecRainPerYear[6] || -1,
                            aug: janDecRainPerYear[7] || -1,
                            sep: janDecRainPerYear[8] || -1,
                            oct: janDecRainPerYear[9] || -1,
                            nov: janDecRainPerYear[10] || -1,
                            dec: janDecRainPerYear[11] || -1,
                            annual: sumOfRainfall || -1,
                            from,
                            to: year1[i],
                            q1: sumOfQ1PerYear || -1,
                            q2: sumOfQ2PerYear || -1, 
                            q3: sumOfQ3PerYear || -1, 
                            q4: sumOfQ4PerYear || -1,
                            h1: sumOfH1PerYear || -1,
                            h2: sumOfH2PerYear || -1,
                            winter: sumOfWinterPerYear || -1,
                            spring: sumOfSpringPerYear || -1,
                            summer: sumOfSummerPerYear || -1,
                            autumn: sumOfAutumnPerYear || -1
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

                        if (forOJIndexTable[-2]) {
                            oji[-2] = {...oji[-2], y: oji[-2] + janDecRainPerYear[0]};
                            sji[-2] = {...sji[-2], y: sji[-2] + janDecRainPerYear[0]};
                            aji[-2] = {...aji[-2], y: aji[-2] + janDecRainPerYear[0]};

                            if (Number(year1[i]) === forOJIndexTable[-2].yearTo) {
                                forOJIndexTable[-2] = {
                                    ...forOJIndexTable[-2], 
                                    aj: forOJIndexTable[-2].aj + janDecRainPerYear[0],
                                    sj: forOJIndexTable[-2].sj + janDecRainPerYear[0],
                                    oj: forOJIndexTable[-2].oj + janDecRainPerYear[0]
                                };
                            } 
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
                    
                    //remove last element of forOJIndexTable because it has no January
                    forOJIndexTable.pop();                     
                    oji.pop();
                    sji.pop();
                    aji.pop();

                    //comit oji, sji and aji
                    mainData = {...mainData, oji, sji, aji};                    

                    //commit jan - dec per year for monthly graphs
                    mainData = {...mainData, monthlyGraphs: {g_jan, g_feb, g_mar, g_apr, g_may, g_jun, g_jul, g_aug, g_sep, g_oct, g_nov, g_dec}};                    
                    
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

                        //overall year average
                        mainData.annualAvg = sumOfRain.reduce(function(a, b) {
                            return Math.max(a, b)/sumOfRain.length;
                        }, 0);

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
                        monthlyMaxDate = monthlyMaxDate.split('-');
                        
                        mainData.monthlyMax = monthlyMaxOverall
                        mainData.monthlyMaxYear = monthlyMaxDate[0];
                        mainData.monthlyMaxMonth = getMonthlyMaxMonth(Number(monthlyMaxDate[1]));
                    }
                    
                    mainData.forMonthlyTable = forMonthlyTable;
                    mainData.forAnnualTable = forAnnualTable;                    
                                        
                    //Five years Average.
                    let annualFiveYearAvg = '';
                    if (Object.keys(sumOfRainfallPerFiveYears).length) {
                        let perFiveValues = Object.values(sumOfRainfallPerFiveYears);
                        annualFiveYearAvg = perFiveValues.reduce(function(a, b) {
                            return Math.max(a, b);
                        }, 0)/perFiveValues.length                         
                    }       
                    mainData.annualFiveYearAvg = annualFiveYearAvg || 'n/a';                        

                    //autumn 
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

                    //lineChart data continues
                    mainData.lineChartData = lineChartData;                    

                    console.log(mainData);
                    
                    //set Main state
                    setMainState(mainData);                    
                    
                    setIsFetching(false);
                }
            }, () => {
                props.history.push("/auth/signin-1");
                window.location.reload();
            });      
        }
        fetchData();               
    }, [ props, queryCode, weatherType, isFetching ]);    

    
    const UserChoiceInput = () => (
        <Row>            
            <Col md={12} xl={12}>
                <h5>Choose weather type and station number to get started.</h5>
            </Col>
            <Col md={4}>
                <Form.Control size="lg" as="select" className="mb-3" name='weatherType' value={weatherType} onChange={(e) => {onChange(e)}}>
                    <option>Rainfall</option>
                    <option>Minimum Temperature</option>
                    <option>Maximum Temperature</option>
                    <option>Solar Exposure</option>                               
                </Form.Control> 
            </Col>
            <Col md={4}>
                <Form.Control size="lg" as="select" className="mb-3" name='queryCode' value={queryCode} onChange={(e) => {onChange(e)}}>
                    {Object.keys(mainState).length &&
                        mainState.stationCodes.map((c, i) => (<option key={i}>{c.code}</option>))}                            
                </Form.Control>                                        
            </Col>
            <Col md={4}>
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
        isFetching ? <Loader /> 
        : (filterControl === 'OJ Index Sort') ?
        <Aux>
            <UserChoiceInput />            
            <Row>
                <RawDataTable oj={mainState.forOJIndexTable} />
            </Row>
            <Row>
                <Col xl={12} md={12}>
                    {ojiControl === 'OJ' && <LineChart data={mainState.oji} m={'OJ'} />}
                    {ojiControl === 'SJ' && <LineChart data={mainState.sji} m={'SJ'} />}
                    {ojiControl === 'AJ' && <LineChart data={mainState.aji} m={'AJ'}  />}
                </Col>
            </Row>
        </Aux> 
        : (filterControl === 'OJ Index') ?
        <Aux>
            <UserChoiceInput />            
            <Row>
                <RawDataTable oj={mainState.forOJIndexTable} cutOff={true} />
            </Row>
            <Row>
                <Col xl={12} md={12}>
                    <LineChart oji={mainState.oji} sji={mainState.sji} aji={mainState.aji}  />
                </Col>
            </Row>
        </Aux> 
        : (filterControl === 'Averages') ?
        <Aux>
            <UserChoiceInput />            
            <Row>
                <Col xl={7}>
                <RawDataTable averages={mainState.forAveragesFilterTable} />
                </Col>
                <Col xl={3}>
                <Card>
                        <Card.Header>
                            <Card.Title as="h5">Line Chart</Card.Title>
                        </Card.Header>
                        <Card.Body>
                            <LineChart data={mainState.forAveragesLineChart}/>
                        </Card.Body>
                    </Card>                    
                </Col>
            </Row>
        </Aux> 
        : (filterControl === 'Monthly') ?
        <Aux>
            <UserChoiceInput />            
            <Row>
                <RawDataTable mon={mainState.forMonthlyFilterTable} />
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
        : (filterControl === 'Monthly Sort') ?
        <Aux>
            <UserChoiceInput />            
            <Row>
                <RawDataTable mon={mainState.forMonthlyFilterTable} />
            </Row>            
            <Row>
                <Col xl={12} md={12}>
                    {monthlyControl === 'January' && <MultiBarChart data={mainState.monthlyGraphs.g_jan} m={'Jan'} />}
                    {monthlyControl === 'February' && <MultiBarChart data={mainState.monthlyGraphs.g_feb} m={'Feb'} />}
                    {monthlyControl === 'March' && <MultiBarChart data={mainState.monthlyGraphs.g_mar} m={'Mar'} />}
                    {monthlyControl === 'April' && <MultiBarChart data={mainState.monthlyGraphs.g_apr} m={'Apr'} />}
                    {monthlyControl === 'May' && <MultiBarChart data={mainState.monthlyGraphs.g_may} m={'May'} />}
                    {monthlyControl === 'June' && <MultiBarChart data={mainState.monthlyGraphs.g_jun} m={'Jun'} />}
                    {monthlyControl === 'July' && <MultiBarChart data={mainState.monthlyGraphs.g_jul} m={'Jul'} />}
                    {monthlyControl === 'August' && <MultiBarChart data={mainState.monthlyGraphs.g_aug} m={'Aug'} />}
                    {monthlyControl === 'September' && <MultiBarChart data={mainState.monthlyGraphs.g_sep} m={'Sep'} />}
                    {monthlyControl === 'October' && <MultiBarChart data={mainState.monthlyGraphs.g_oct} m={'Oct'} />}
                    {monthlyControl === 'November' && <MultiBarChart data={mainState.monthlyGraphs.g_nov} m={'Nov'} />}
                    {monthlyControl === 'December' && <MultiBarChart data={mainState.monthlyGraphs.g_dec} m={'Dec'} />}
                </Col>
            </Row>
        </Aux>  
        : (filterControl === 'Seasonal') ?
        <Aux>        
            <UserChoiceInput />            
            <Row>                
                <Col xl={6}>
                    <RawDataTable seasonal={mainState.forMonthlyFilterTable} />
                </Col>            
                <Col xl={4}>                    
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
                <Col xl={6}>
                    <RawDataTable seasonalSort={mainState.forMonthlyFilterTable} />
                </Col>            
                <Col xl={4}>
                    {seasonControl === 'Winter' && <MultiBarChart winter={mainState.winterPerYear} />}
                    {seasonControl === 'Spring' && <MultiBarChart spring={mainState.springPerYear} />}
                    {seasonControl === 'Summer' && <MultiBarChart summer={mainState.summerPerYear} />}
                    {seasonControl === 'Autumn' && <MultiBarChart autumn={mainState.autumnPerYear} />}                    
                </Col>
            </Row>           
        </Aux>
        : (filterControl === 'H1H2Q1Q4 Sort') ?
        <Aux>        
            <UserChoiceInput />   
            <Row>
                <RawDataTable hqSort={mainState.forMonthlyFilterTable} />
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
            <UserChoiceInput />
            <Row>
                {/* For slider */}
            </Row>       
            <Row>
                <Col md={7} xl={7}>
                    <RawDataTable annualSort={mainState.forAnnualTable} annualAvg={mainState.annualAvg} />
                </Col>
                <Col md={5} xl={5}>
                    <LineChart data={mainState.lineChartData} />
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
                    <LineChart data={mainState.lineChartData} />
                </Col>
            </Row>
        </Aux>  
        : (filterControl === 'Monthly Raw Data') ?
        <Aux>
            <UserChoiceInput />            
            <Row>
                <RawDataTable monthly={mainState.forMonthlyTable} />
            </Row>
        </Aux>  
        : (filterControl === 'Daily Raw Data') ?
        <Aux>   
            <UserChoiceInput />                     
            <Row>
                <RawDataTable data={mainState.data} />
            </Row>
        </Aux>
        : (filterControl === 'Location Tool') ? 
        <Aux>
            <UserChoiceInput />           
            <Row>            
                <Col md={12} xl={12}>
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
            </Row>
        </Aux> : (filterControl === 'Overview') &&
        <Aux> 
            <UserChoiceInput />                                 
            <Row>
                <Col md={6} xl={4}>
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
                                    <p className="m-b-0">{Object.keys(mainState).length ? mainState.stationState : 'n/a'}</p>
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
                <Col md={6} xl={5}>
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
                                    <td><h6 className="text-muted">{(!mainState.annualRainForLastYear || mainState.annualRainForLastYear === 'n/a') ? 'n/a' : decimalToFraction(mainState.annualRainForLastYear / mainState.overallStationRainfall).display}</h6>{/*<a href={DEMO.BLANK_LINK} className="label theme-bg2 text-white f-12">Reject</a><a href={DEMO.BLANK_LINK} className="label theme-bg text-white f-12">Approve</a>*/}</td>
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
                                    <td><h6 className="text-muted">{(!mainState.Jan || mainState.Jan === 'n/a') ? 'n/a' : decimalToFraction(mainState.Jan / mainState.annualRainForLastYear).display}</h6>{/*<a href={DEMO.BLANK_LINK} className="label theme-bg2 text-white f-12">Reject</a><a href={DEMO.BLANK_LINK} className="label theme-bg text-white f-12">Approve</a>*/}</td>
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
                                    <td><h6 className="text-muted">{(!mainState.Feb || mainState.Feb === 'n/a') ? 'n/a' : decimalToFraction(mainState.Feb / mainState.annualRainForLastYear).display}</h6>{/*<a href={DEMO.BLANK_LINK} className="label theme-bg2 text-white f-12">Reject</a><a href={DEMO.BLANK_LINK} className="label theme-bg text-white f-12">Approve</a>*/}</td>
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
                                    <td><h6 className="text-muted">{(!mainState.Mar || mainState.Mar === 'n/a') ? 'n/a' : decimalToFraction(mainState.Feb / mainState.annualRainForLastYear).display}</h6>{/*<a href={DEMO.BLANK_LINK} className="label theme-bg2 text-white f-12">Reject</a><a href={DEMO.BLANK_LINK} className="label theme-bg text-white f-12">Approve</a>*/}</td>
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
                                    <td><h6 className="text-muted">{(!mainState.Apr || mainState.Apr === 'n/a') ? 'n/a' : decimalToFraction(mainState.Apr / mainState.annualRainForLastYear).display}</h6>{/*<a href={DEMO.BLANK_LINK} className="label theme-bg2 text-white f-12">Reject</a><a href={DEMO.BLANK_LINK} className="label theme-bg text-white f-12">Approve</a>*/}</td>
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
                                    <td><h6 className="text-muted">{(!mainState.May || mainState.May === 'n/a') ? 'n/a' : decimalToFraction(mainState.May / mainState.annualRainForLastYear).display}</h6>{/*<a href={DEMO.BLANK_LINK} className="label theme-bg2 text-white f-12">Reject</a><a href={DEMO.BLANK_LINK} className="label theme-bg text-white f-12">Approve</a>*/}</td>
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
                                    <td><h6 className="text-muted">{(!mainState.Jun || mainState.Jun === 'n/a') ? 'n/a' : decimalToFraction(mainState.Jun / mainState.annualRainForLastYear).display}</h6>{/*<a href={DEMO.BLANK_LINK} className="label theme-bg2 text-white f-12">Reject</a><a href={DEMO.BLANK_LINK} className="label theme-bg text-white f-12">Approve</a>*/}</td>
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
                                    <td><h6 className="text-muted">{(!mainState.Jul || mainState.Jul === 'n/a') ? 'n/a' : decimalToFraction(mainState.Jul / mainState.annualRainForLastYear).display}</h6>{/*<a href={DEMO.BLANK_LINK} className="label theme-bg2 text-white f-12">Reject</a><a href={DEMO.BLANK_LINK} className="label theme-bg text-white f-12">Approve</a>*/}</td>
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
                                    <td><h6 className="text-muted">{(!mainState.Aug || mainState.Aug === 'n/a') ? 'n/a' : decimalToFraction(mainState.Aug / mainState.annualRainForLastYear).display}</h6>{/*<a href={DEMO.BLANK_LINK} className="label theme-bg2 text-white f-12">Reject</a><a href={DEMO.BLANK_LINK} className="label theme-bg text-white f-12">Approve</a>*/}</td>
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
                                    <td><h6 className="text-muted">{(!mainState.Sep || mainState.Sep === 'n/a') ? 'n/a' : decimalToFraction(mainState.Sep / mainState.annualRainForLastYear).display}</h6>{/*<a href={DEMO.BLANK_LINK} className="label theme-bg2 text-white f-12">Reject</a><a href={DEMO.BLANK_LINK} className="label theme-bg text-white f-12">Approve</a>*/}</td>
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
                                    <td><h6 className="text-muted">{(!mainState.Oct || mainState.Oct === 'n/a') ? 'n/a' : decimalToFraction(mainState.Oct / mainState.annualRainForLastYear).display}</h6>{/*<a href={DEMO.BLANK_LINK} className="label theme-bg2 text-white f-12">Reject</a><a href={DEMO.BLANK_LINK} className="label theme-bg text-white f-12">Approve</a>*/}</td>
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
                                    <td><h6 className="text-muted">{(!mainState.Nov || mainState.Nov === 'n/a') ? 'n/a' : decimalToFraction(mainState.Nov / mainState.annualRainForLastYear).display}</h6>{/*<a href={DEMO.BLANK_LINK} className="label theme-bg2 text-white f-12">Reject</a><a href={DEMO.BLANK_LINK} className="label theme-bg text-white f-12">Approve</a>*/}</td>
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
                                    <td><h6 className="text-muted">{(!mainState.Dec || mainState.Dec === 'n/a') ? 'n/a' : decimalToFraction(mainState.Dec / mainState.annualRainForLastYear).display}</h6>{/*<a href={DEMO.BLANK_LINK} className="label theme-bg2 text-white f-12">Reject</a><a href={DEMO.BLANK_LINK} className="label theme-bg text-white f-12">Approve</a>*/}</td>
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
                                    <td><h6 className="text-muted">{mainState.summer === 'n/a' ? 'n/a' : decimalToFraction(mainState.summer / mainState.annualRainForLastYear).display}</h6>{/*<a href={DEMO.BLANK_LINK} className="label theme-bg2 text-white f-12">Reject</a><a href={DEMO.BLANK_LINK} className="label theme-bg text-white f-12">Approve</a>*/}</td>
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
                                    <td><h6 className="text-muted">{mainState.autumn === 'n/a' ? 'n/a' : decimalToFraction(mainState.autumn / mainState.annualRainForLastYear).display}</h6>{/*<a href={DEMO.BLANK_LINK} className="label theme-bg2 text-white f-12">Reject</a><a href={DEMO.BLANK_LINK} className="label theme-bg text-white f-12">Approve</a>*/}</td>
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
                                    <td><h6 className="text-muted">{mainState.winter === 'n/a' ? 'n/a' : decimalToFraction(mainState.winter / mainState.annualRainForLastYear).display}</h6>{/*<a href={DEMO.BLANK_LINK} className="label theme-bg2 text-white f-12">Reject</a><a href={DEMO.BLANK_LINK} className="label theme-bg text-white f-12">Approve</a>*/}</td>
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
                                    <td><h6 className="text-muted">{mainState.spring === 'n/a' ? 'n/a' : decimalToFraction(mainState.spring / mainState.annualRainForLastYear).display}</h6>{/*<a href={DEMO.BLANK_LINK} className="label theme-bg2 text-white f-12">Reject</a><a href={DEMO.BLANK_LINK} className="label theme-bg text-white f-12">Approve</a>*/}</td>
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
                <Col xl={3}>
                <Card>
                        <Card.Header>
                            <Card.Title as="h5">Line Chart</Card.Title>
                        </Card.Header>
                        <Card.Body>
                            <LineChart data={mainState.lineChartData}/>
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


export default Dashboard;