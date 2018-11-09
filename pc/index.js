// 'use strict';

// const noble = require('noble');
const noble = require('noble-mac');
const knownDevices = [];

noble.on('scanStart', function () {
    console.log('*** scanStart');
});

noble.on('scanStop', function () {
    console.log('on -> scanStop');
});

//discovered BLE device
const discovered = (peripheral) => {
    if (peripheral.advertisement.localName == "") {
        return
    }
    // console.log('on -> discover: ' + peripheral);
    const device = {
        name: peripheral.advertisement.localName,
        uuid: peripheral.uuid,
        rssi: peripheral.rssi
    };
    knownDevices.push(device);
    console.log(`${knownDevices.length}:${device.name}(${device.uuid}) RSSI${device.rssi}`);
}

//BLE scan start
const scanStart = () => {
    noble.startScanning();
    noble.on('discover', discovered);
}

if (noble.state === 'poweredOn') {
    scanStart();
} else {
    noble.on('stateChange', scanStart);
}