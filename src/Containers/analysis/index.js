import React from 'react';
import FileUploader from '../../Components/fileUploader';
import SelectComp from '../../Components/select';
import {Line} from 'react-chartjs-2';
import axios from 'axios';
let _ = require('lodash');

const chartdata ={
    0:[{x:2,y:3},{
    x: 10,
    y: 20
}, {
    x: 15,
    y: 10
}],
1:[{x:9,y:10},{
    x: 12,
    y: 20
}, {
    x: 15,
    y: 10
}] };

class ANALYSIS extends React.Component{
    constructor(props){
        super(props);
        this.state = {
            selectOptions:[]
        };
        this.uploadFile = this.uploadFile.bind(this);
        this.createDownloadableLink = this.createDownloadableLink.bind(this);
        this.convertToCSV = this.convertToCSV.bind(this);
        this.exportCSVFile = this.exportCSVFile.bind(this);
        this.scrollIntoView = this.scrollIntoView.bind(this);
    }

    uploadFile(url){
        url = `${'https://cors-anywhere.herokuapp.com/'}`+url;
        axios.get(url).then((response) => {
            let result = response.data[0];
            let formattedResult = [];
            let optionList = [];
            let uniqueAreaValues = [];
            Object.keys(result).map((key)=>{
                let opt = {
                    value:key,
                    label:key
                };
                optionList.push(opt);
                result[key].map((obj,index)=>{
                    let totalAreaValues = (Object.keys(obj).length - 1);
                    if(uniqueAreaValues.indexOf(totalAreaValues) < 0){
                        uniqueAreaValues.push(totalAreaValues);
                    }
                    let areasum = 0;
                    _.mapKeys(obj,(value, key) =>{
                        if(key !== 'concentration'){
                            areasum += value;
                        }
                    });
                    obj.average_area = _.round((areasum/totalAreaValues),2);
                    obj.metabolite = key;
                    formattedResult.push(obj);
                });
            });
            this.setState({selectOptions:optionList});
            let maxAreaValues = _.max(uniqueAreaValues);
            this.createDownloadableLink(formattedResult,maxAreaValues);
        }).catch((err)=>{
            console.log(err);
        });
    }

    //function to create downloadable link
    createDownloadableLink(data,maxAreaValues){
        // preparing csv headers
        let headers = {
            concentration: "Concentration"
        };
        let i;
        for(i = 1; i <= maxAreaValues;i++){
            let key = 'area_'+i;
            headers[key] = 'Area_'+i;
        }
        headers.average_area =  "Average_area";
        headers.metabolite = 'Metabolite';
        let fileTitle = 'metabolites';

        this.exportCSVFile(headers, data, fileTitle);
    }

    convertToCSV(objArray) {
        let array = typeof objArray != 'object' ? JSON.parse(objArray) : objArray;
        let str = '';
        for (let i = 0; i < array.length; i++) {
            let line = '';
            for (let index in array[i]) {
                if (line != '') line += ',';
                line += array[i][index];
            }

            str += line + '\r\n';
        }

        return str;
    }

    exportCSVFile(headers, items, fileTitle) {
        if (headers) {
            items.unshift(headers);
        }

        // Convert Object to JSON
        let jsonObject = JSON.stringify(items);

        let csv = this.convertToCSV(jsonObject);

        let exportedFilenmae = fileTitle + '.csv' || 'export.csv';

        let blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
        if (navigator.msSaveBlob) { // IE 10+
            navigator.msSaveBlob(blob, exportedFilenmae);
        } else {
            let link = document.createElement("a");
            if (link.download !== undefined) { // feature detection
                // Browsers that support HTML5 download attribute
                let url = URL.createObjectURL(blob);
                link.setAttribute("href", url);
                link.setAttribute("download", exportedFilenmae);
                link.style.visibility = 'hidden';
                document.body.appendChild(link);
                link.click();
                document.body.removeChild(link);
            }
        }
    }

    scrollIntoView(selectedOption){
        document.getElementById(selectedOption.value).scrollIntoView();
    }

    render(){
        return(
            <div>
                <FileUploader handleDrop={this.uploadFile} allowMultiple={false}/>
                <SelectComp options={this.state.selectOptions} handlechange={this.scrollIntoView} />
                <ul>
                    {this.state.selectOptions.map((option,index)=><li id={option.value} key={index}>
                        {option.value}
                        <Line data={chartdata} />
                    </li>
                    )}
                </ul>
            </div>
        );
    }
}

export default ANALYSIS;
