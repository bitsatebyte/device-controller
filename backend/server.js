const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const path = require('path');
const Device = require('./models/devices.model');
const PORT = process.env.PORT || 4000;
const app = express();
const deviceRoutes = express.Router();

app.use(cors());
app.use(express.json());
const server = app.listen(PORT, () => {
  console.log("Server is running on Port: " + PORT);
});
const io = require('socket.io')(server);

mongoose.connect('mongodb://ubfjiv3wfffa1wvvxsyt:yx2Di8lOgmQqqJPNZkpz@bpy1x3f6tj7ufjo-mongodb.services.clever-cloud.com:27017/bpy1x3f6tj7ufjo', { useNewUrlParser: true });
const connection = mongoose.connection;
connection.once('open', () => {
  console.log("MongoDB database connection established successfully");
})

// returns the available devices
deviceRoutes.route('/return').get((req, res) => {
  Device.find({}, (err, device) => {
    if (err) {
      console.log(err);
    } else {
      a = device;
      res.json(device);
    }
  });
});

// Add a new device
deviceRoutes.route('/add').post((req, res) => {
  console.log(req.body);
  const addedObject = req.body;
  ('pwr_action' in addedObject) ? null : (addedObject.pwr_action = false);
  let device = new Device(addedObject);
  device.save()
    .then(device => {
      res.status(200).json({ 'device': 'device added successfully' });
    })
    .catch(err => {
      res.status(400).send('adding new device failed');
    });
});

// Update device status
deviceRoutes.route('/update/:id').put((req, res) => {
  Device.findById(req.params.id, (err, device) => {
    if (!device) {
      res.status(404).send("data is not found");
    }
    else {
      Device.updateOne({ _id: req.params.id }, req.body, (err, result) => {
        res.send((err === null) ? { msg: result } : { msg: err });
      })
        .catch(err => {
          res.status(400).send("Update not possible");
        });
    }
  });
});

// delete device
deviceRoutes.route('/delete/:id').delete((req, res) => {
  Device.findByIdAndDelete(req.params.id, (err, data) => {
    if (err) {
      console.log("error in deleting!");
      throw err;
    } else {
      console.log('all deleted');
      res.send(data);
    }
  });
});

app.use('/devices', deviceRoutes);

if (process.env.NODE_ENV === 'production') {
  // Express will serve up production assets
  app.use(express.static('client/build'));

  // Express serve up index.html file if it doesn't recognize route
  app.get('/*', (req, res) => {
    res.sendFile(path.resolve(__dirname, 'client', 'build', 'index.html'));
  });
}

io.on('connection', socket => {
  console.log(`New user connected - ${socket.id} (Socket ID)`);

  socket.on('fetch devices', (data) => {
    console.log('devices fetched');
    io.sockets.emit('fetch devices', data);
  })
  socket.on('add device', (data) => {
    console.log('device added');
    io.sockets.emit('add device', data);
  })
  socket.on('toggled power', (data) => {
    console.log('power toggled');
    io.sockets.emit('toggled power', data)
  })
  socket.on('delete device', (data) => {
    console.log('device deleted');
    io.sockets.emit('delete device', data);
  })
  socket.on('disconnect', (reason) => {
    console.log(`user disconnected: ${reason}`);
  })
})
