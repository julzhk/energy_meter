import React, {Component} from 'react'
import {Button, Form, Grid, Segment} from 'semantic-ui-react'

import {render} from "react-dom";
import axios from 'axios';
import Cookies from 'js-cookie'
import {LoaderSpinner} from "./UI/LoaderSpinner";
import {ErrorHandler} from "./UI/ErrorHandler";
import {TimeSeries} from "pondjs";
import {BandChart, ChartContainer, ChartRow, Charts, LineChart, Resizable, styler, YAxis} from "react-timeseries-charts";

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
        stage: 1,
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
        formData.append("stage", this.state.stage);
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

class DataRender extends Component {
    render() {
        const data = this.props.data
        if (data.length > 0) {
            return this.render_chart(data)
        } else {
            return null
        }
    }

    render_chart(data) {
        const series = new TimeSeries({
            name: "series",
            columns: ["index", "t", "median"],
            points: data.map(({date, val}) => [
                date, [val * 0.85, val, val * 1.15], val
            ])
        });
        let vals = data.map((date, val)=>{return(date['val'])})
        console.log(vals)
        const max_val = Math.max( ...vals )
        const style = styler([
            {key: "t", color: "steelblue", width: 1, opacity: 1},
            {key: "median", color: "#333", width: 1}
        ]);
        return (
            <Resizable>
                <ChartContainer timeRange={series.range()}>
                    <ChartRow height="500">
                        <YAxis
                            id="t-axis"
                            label="consumption"
                            min={0}
                            max={max_val}
                            format="d"
                            width="70"
                            type="linear"
                        />
                        <Charts>
                            <BandChart
                                axis="t-axis"
                                style={style}
                                spacing={1}
                                column="t"
                                interpolation="curveBasis"
                                series={series}
                            />
                            <LineChart
                                axis="t-axis"
                                style={style}
                                spacing={1}
                                columns={["median"]}
                                interpolation="curveBasis"
                                series={series}
                            />
                        </Charts>
                    </ChartRow>
                </ChartContainer>
            </Resizable>
        )
    }
};

class Results extends Component {
    state = {
        data: [],
        chart_data: [],
        upddating: false,
        uploaderror: false
    }

    componentDidMount() {
        axios.get(
            "/data_api"
        ).then(res => {
            this.setState({
                data: res.data,
                updating: false
            })
        }).catch((error) => {
            this.setState({uploaderror: true, updating: false, data: []})
            console.log(error)
        })
    }

    buttonClicked(ele) {
        console.log(ele)
        axios.get(
            "/data_api?id=" + ele
        ).then(res => {
            console.log(res)
            this.setState({
                chart_data: res.data,
                updating: false
            })
        }).catch((error) => {
            this.setState({uploaderror: true, updating: false, chart_data: []})
            console.log(error)
        })

    }

    render() {
        const data = this.state.data
        const chart_data = this.state.chart_data
        return (
            <div>
                <Grid columns={4} divided>
                    <Grid.Row>
                        {data.map((ele, indx) => {
                            return (
                                <Grid.Column key={indx}>
                                    <Button onClick={() => {
                                        this.buttonClicked(ele[0])
                                    }} content={ele[1]}/>
                                </Grid.Column>
                            )
                        })}
                    </Grid.Row>
                </Grid>
                <Grid columns={1} divided>
                    <Grid.Row>
                        <Grid.Column>
                            <DataRender data={chart_data}/>
                        </Grid.Column>
                    </Grid.Row>
                </Grid>
            </div>


        );
    }
}

try {
    render(<App/>, document.getElementById('app'));
} catch (Err) {
    console.log(Err)
}
try {
    render(<Results/>, document.getElementById('results'));
} catch (Err) {
    console.log(Err)
}

