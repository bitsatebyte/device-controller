import React, { Component } from 'react';
import eventSubscriber from './api';
import toaster from 'toasted-notes';
import 'toasted-notes/src/styles.css';
import DeviceTable from './components/DeviceTable';

class App extends Component {

  constructor(props) {
    super(props);
    this.state = {
      data: []
    }
  }
  componentWillMount() {
    fetch('https://alpha-admin.herokuapp.com/devices/return')
      .then(response => response.json())
      .then(data => this.setState({ data }));
  }
  componentDidMount() {
    eventSubscriber((err, data) => {
      if ('string' === typeof (data)) {
        toaster.notify(data, {
          position: 'bottom-right',
          duration: 5000,
        });
      } else {
        this.setState({ data });
      }
    });
  }

  render() {
    return (
      <div>
        <h1 className="device-controller">Dev!ce C0ntr0||er</h1>
        <DeviceTable deviceData={this.state.data} />
      </div>
    )
  }
}

export default App;