import React from 'react';
import classNames from 'classnames';
import Dropzone from 'react-dropzone';
import axios, { post } from 'axios';
import {NotificationManager} from 'react-notifications';


class FileUploader extends React.Component{
    constructor(props){
        super(props);
        this.state ={
            handleDrop:props.handleDrop
        };
        this.onDrop = this.onDrop.bind(this);
    }

    onDrop(acceptedFiles, rejectedFiles){
        const url = 'https://fe-assignment.herokuapp.com/metabolite_info/';
        const formData = new FormData();
        formData.append('file',acceptedFiles[0]);
        const config = {
            headers: {
                'content-type': 'multipart/form-data'
            }
        };
        post(url, formData,config).then((response)=>{
            if(response.data.metabolite_info){
                this.props.handleDrop(response.data.metabolite_info);
            }else if(response.data.error){
                NotificationManager.error(response.data.error);
            }
        }).catch((err)=>{
            console.log(err);
        });
    }
    render(){
        return(
            <Dropzone
                onDrop={this.onDrop}
                //accept={props.acceptableFileTypes
                // multiple={this.props.allowMultiple}
                //maxSize={props.sizeLimit
            >
                {({getRootProps, getInputProps, isDragActive}) => {
                    return (
                        <div
                        {...getRootProps()}
                        className={classNames('dropzone', {'dropzone--isActive': isDragActive})}
                        >
                        <input {...getInputProps()} />
                        {
                            isDragActive ?
                            <p>Drop files here...</p> :
                            <p>Try dropping some files here, or click to select files to upload.</p>
                        }
                        </div>
                    );
                }}
            </Dropzone>
        );
    }
}

export default FileUploader;
