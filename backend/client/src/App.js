import React, { Component } from 'react'
import axios from 'axios';
import io from 'socket.io-client';
import DeviceTable from './components/DeviceTable';
import Modal from './components/Modal';

export default class App extends Component {

  constructor(props) {
    super(props);
    this.state = {
      data: [],
      show: false
    };
  }

  options = {
    socketUrl: '/',
    socket: null,
  }

  connect = () => {
    this.options.socket = io(this.options.socketUrl)
    this.send('fetch devices');
  }

  fetchDevices = () => {
    axios.get('/devices/return')
      .then(response => {
        if (Array.isArray(response.data)) {
          this.setState({ data: response.data });
          this.send('fetch devices');
        }
      }).catch(err => {
        console.log(err);
      });
  }

  // Toggles device power
  togglePowerClickHandler = (event) => {
    const isFa = event.target.className.substring(0, 2) === 'fa';
    const isOn = event.target.getAttribute('data-boolean') === 'true';
    if (isFa) {
      axios.put('/devices/update/' + event.target.id,
        { pwr_action: !isOn }, //body payload
        { headers: { "Content-Type": "application/json" } })
        .then(response => {
          this.send('toggled power');
          this.fetchDevices();
        })
        .catch(e => console.log(e))
    }
  }

  // deletes device
  deleteDevice = (event) => {
    const isFa = event.target.className.substring(0, 2) === 'fa';
    if (isFa) {
      axios.delete('/devices/delete/' + event.target.id)
        .then(response => {
          this.send('delete device');
          this.fetchDevices();
        });
    }
  }

  showModal = () => {
    this.setState({ show: true });
  }

  hideModal = () => {
    this.setState({ show: false });
  }

  componentDidMount() {
    this.fetchDevices();
    this.connect();
  }

  send = (message) => {
    this.options.socket.emit(message, this.state.data);
  }

  handleSubmit = (event) => {
    event.preventDefault();
    const data = new FormData(event.target);
    // access FormData field with `data.get(fieldName)`  
    const name = data.get('devname');
    axios.post('/devices/add', { device_name: name })
      .then(response => {
        this.send('add device');
        this.fetchDevices();
      });
  }

  render() {
    return (
      <div className="main-wrapper">
        <div className="heading">
          <h2 className="device-controller">Admin Controller</h2>
          <Modal show={this.state.show} handleClose={this.hideModal} >
            <form onSubmit={this.handleSubmit}>
              <label htmlFor="devname">Device Name</label>
              <input id="devname" name="devname" type="text" />
              <button onClick={this.hideModal}>Send data!</button>
            </form>
          </Modal>
          <span><button type="button" className="add-device" onClick={this.showModal}>
            Add Devices
        </button></span>
        </div>

        <div>
          {this.state.data ? <DeviceTable
            deviceData={this.state.data}
            clickHandling={this.togglePowerClickHandler}
            deleteDeviceHandler={this.deleteDevice} />
            : ''}
        </div>
      </div>
    )
  }
}
