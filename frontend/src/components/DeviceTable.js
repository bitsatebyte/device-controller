import React, { Component } from 'react';

export default class DeviceTable extends Component {

  constructor(props) {
    super(props);
    this.state = {
      data: [],
    }
  }

  render() {
    if (0 === this.props.deviceData.length) return null;
    console.log(this.props.deviceData);
    let tableRows = this.props.deviceData.map(element => {
      return (
        <tr key={element._id}>
          <td>{element.device_name}</td>
          <td>{element._id}</td>
          <td>{element.pwr_action ? 'On' : 'Off'}</td>
        </tr>
      );
    })
    // Main return
    return (
      <div>
        <table>
          <tbody>
            <tr>
              <th>Device Name</th>
              <th>Device ID</th>
              <th>Power Status</th>
            </tr>
            {tableRows}
          </tbody>
        </table>
      </div>
    );
  }
}
