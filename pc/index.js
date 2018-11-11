'use strict';
const noble = require('noble-mac');
const mongodb = require('mongodb')
const MongoClient = mongodb.MongoClient
const assert = require('assert')

let database;


const services_discovered = (services) => {
    console.log("service start")
    var deviceInformationService = services[0];
    deviceInformationService.discoverCharacteristics(null, (error, characteristics) => {
        console.log('discovered the following characteristics:');
        var manufacturerNameCharacteristic = characteristics[0];

        manufacturerNameCharacteristic.on('data', (data, isNotification) => {
            // console.log(data.readUInt8(0) + ' times detected');
            let reaction_number=data.readUInt8(0)
            console.log(reaction_number + ' times detected');

            database.collection('documents').insertOne({"count": reaction_number,"date":new Date()})
        });

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


MongoClient.connect('mongodb://localhost:27017', (err, client) => {
    if (err)
        throw err
    console.log("Connected successfully to server")
    database = client.db("ANSD");

    // database.collection('documents').insertOne({"count": 1000,"date":new Date()})
    // database.collection('documents').insertOne({"a": "test"})
})
