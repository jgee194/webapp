import React from 'react';
import Axios from 'axios';


 
export default class UploadPhotos extends React.Component {
 
    constructor(props) {
        super(props);
         this.state = { 
             pictures: null,
             name: null
         };
         this.onDrop = this.onDrop.bind(this);
       
    }


    handleChange = (event) => {
        console.log(event.target.files[0].name)
        const {value} = event.target.files[0].name
        this.setState({
            name: value
        })
        console.log(this.state.name);
        const file = event.target.files[0];
        this.setState({
            pictures: file
        })
        console.log(event);

    }

   
 
    onDrop = picture => {
        picture.preventDefault();

        var file = new FormData();
        console.log(this.state.pictures);
        file.append("name", this.state.name);
        file.append('file', this.state.pictures);
        console.log(file);


        Axios.post("http://localhost:3030/api/imageUploader/upload", file ,{
            headers: {
            'Content-Type': 'multipart/form-data',
            }
        })

            .then(res => {
                console.log(res);

                
            })
            .catch(err => {
                console.log(err);
 

            })

        
    }
 
    render() {
        return (
        <div>
            <form onSubmit={this.onDrop}>
                <input type="file" id="myFile" name="filename" onChange={this.handleChange} />
                <button onClick ={this.onDrop}> Upload Photos</button>
                <input type = "submit"></input>    
            </form>
        
        </div>

            

        );
    }
}