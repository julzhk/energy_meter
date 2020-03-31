import React, {Component} from 'react'
import {Button, Form, Segment} from 'semantic-ui-react'

import {render} from "react-dom";
import axios from 'axios';
import 'chart.js'
import Cookies from 'js-cookie'
import {LoaderSpinner} from "./UI/LoaderSpinner";
import {ErrorHandler} from "./UI/ErrorHandler";

axios.defaults.xsrfCookieName = 'csrftoken';
axios.defaults.xsrfHeaderName = 'X-CSRFToken';


class ShowUploadForm extends Component {

    generate_header(n) {
        const headers = {
            1: 'Upload Building Data',
            2: 'Upload Half Hourly Data',
            3: 'Upload Meter Data',
            4: 'Process',
        }
        return headers[n];

    }

    render() {
        const csrftoken = this.props.csrftoken;
        if (this.props.stage < 4) {
            return (
                <Form>
                    <Segment>
                        <h1>{this.props.stage} - {this.generate_header(this.props.stage)}</h1>
                        <Button as="label" htmlFor="file" type="button">
                            Choose data file to upload
                        </Button>
                        <input type="hidden"
                               name="csrfmiddlewaretoken"
                               value={csrftoken}/>
                        <input hidden
                               type="file"
                               id="file"
                               style={{display: "hidden"}}
                               onChange={(e) => {
                                   this.props.uploadHandler(e)
                               }}/>
                    </Segment>
                </Form>
            )
        } else {
            return (
                <div>
                    <h1>Process Data</h1>
                    <p>Now the data is ingested, proceed to analysis stage</p>
                    <a href='/process'>
                        <Button color='green'>Process Data</Button>
                    </a>
                </div>
            )
        }
    }
}


class App extends Component {
    state = {
        stage: 4,
        count: 0
    }

    uploadHandler = (event) => {
        this.setState({
            updating: true,
        })
        const file = event.target.files[0]
        const formData = new FormData();
        let csrftoken = Cookies.get('csrftoken');
        formData.append("file", file);
        axios.post(
            "/api",
            formData, { // receive two parameter endpoint url ,form data
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                    'X-CSRFToken': csrftoken
                }
            }
        ).then(res => {
            this.setState({
                count: res.data.count,
                updating: false
            })
            this.nextStage()
        }).catch((error) => {
            this.setState({uploaderror: true, updating: false})
            console.log(error)
        })
    }

    backButtonClicked() {
        {
            this.setState(prevState => (
                {stage: this.state.stage - 1}))
        }
    }

    nextStage() {
        console.log('stage update')
        this.setState(prevState => (
            {stage: this.state.stage + 1}))
    }

    render() {
        let csrftoken = Cookies.get('csrftoken');
        return (<div>
            <ErrorHandler uploaderror={this.state.uploaderror}/>
            <ShowUploadForm
                stage={this.state.stage}
                uploadHandler={this.uploadHandler}
                csrftoken={csrftoken}
            />
            <LoaderSpinner loading={this.state.updating}/>
            {(this.state.count ? <Segment>{'Items uploaded:' + this.state.count}</Segment> : null)}
            <span onClick={() => {
                if (this.state.stage > 1) this.backButtonClicked();
            }}> {this.state.stage > 1 ? <Button>Back</Button> : null}</span>
        </div>)
    }

}

render(<App/>, document.getElementById('app'));
