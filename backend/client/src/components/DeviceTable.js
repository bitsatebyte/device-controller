import React from 'react'

export default function DeviceTable(props) {
  if (0 === props.deviceData.length) return '';
  const off = {
    color: "red",
    cursor: "pointer"
  }
  const deleteButton = {
    color: "red",
    cursor: "pointer",
    margin: "0 0 0 10px"
  }
  const on = {
    color: "green",
    cursor: "pointer"
  }

  let tableRows = props.deviceData.map(element => {
    return (
      <tr key={element._id}>
        <td>{element.device_name}</td>
        <td>{element._id}</td>
        <td>{element.pwr_action ? 'On' : 'Off'}</td>
        <td>{element.pwr_action ?
          <i className="fa fa-power-off" id={element._id} data-boolean="true"
            onClick={props.clickHandling} aria-hidden="true"
            style={on}></i>
          : <i className="fa fa-power-off" id={element._id} data-boolean="false"
            onClick={props.clickHandling} aria-hidden="true"
            style={off}></i>}
          <i className="fa fa-trash-o" aria-hidden="true"
            id={element._id} onClick={props.deleteDeviceHandler} style={deleteButton}></i>
        </td>
      </tr>
    )
  })

  return (
    <table>
      <tbody>
        <tr>
          <th>Device Name</th>
          <th>Device ID</th>
          <th>Status</th>
          <th>Actions</th>
        </tr>
        {tableRows}
      </tbody>
    </table>
  )
}
