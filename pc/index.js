'use strict';
const noble = require('noble-mac');


const services_discovered = (services) => {
    console.log("service start")
    var deviceInformationService = services[0];
    deviceInformationService.discoverCharacteristics(null, function (error, characteristics) {
        console.log('discovered the following characteristics:');
        var manufacturerNameCharacteristic = characteristics[0];

        manufacturerNameCharacteristic.on('data', function (data, isNotification) {
            console.log(data.readUInt8(0) + ' times detected');
        });

        // to enable notify
        manufacturerNameCharacteristic.subscribe(function (error) {
            console.log('enabled notify');
        });
    });
}

const discovered = (peripheral) => {

    if (peripheral.advertisement.localName != "ANSD")
        return

    noble.stopScanning();

    console.log("connect to " + peripheral.advertisement.localName)

    peripheral.on('disconnect', scanStart);
    peripheral.connect(error => {
        peripheral.once('servicesDiscover', services_discovered);
        peripheral.discoverServices();
    })
    let uuid = peripheral.uuid
    console.log(uuid)
}

//BLE scan start
const scanStart = () => {
    console.log("scan start")
    noble.startScanning();
    noble.on('discover', discovered);
}

if (noble.state === 'poweredOn') {
    scanStart();
} else {
    noble.on('stateChange', scanStart);
}
