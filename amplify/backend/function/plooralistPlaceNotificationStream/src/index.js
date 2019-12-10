

const AWS = require("aws-sdk");
const https = require('https');

const api_secret = "org_test_sk_c7270c934d79c56dde1483219bd40973ec5ee7a5";
const host = 'www.onradar.com';

const createGeofence = (place, tag) => {
    const geofence = {
        description: place.name,
        type: 'circle',
        coordinates: [place.longitude, place.latitude],
        radius: place.radius,
    };

    const dataEncoded = JSON.stringify(geofence);

    const headers = {
       'Accept': 'application/json',
       'Content-Type': 'application/json',
       'Content-Length': Buffer.byteLength(dataEncoded),
       'Authorization': api_secret
    };

    const path = '/api/v1/geofences/' + tag + '/' + place.placeID;
    const method = 'PUT';

    return new Promise((resolve, reject) => {

        const req = https.request({host, path, method, headers}, (res) => {
            let buffers = [];
            res.on('error', reject);
            res.on('data', buffer => buffers.push(buffer));
            res.on('end', () => {
                //console.log('createGeofence statusCode', JSON.stringify(res.statusCode));
                (res.statusCode === 200) ? resolve(Buffer.concat(buffers)) : reject(Buffer.concat(buffers));
              }
            );
        });

        // send the request
        req.write(dataEncoded);
        req.end();
    });
};

const deleteGeofence = (place, tag) => {
    const headers = {
       'Accept': 'application/json',
       'Content-Type': 'application/json',
       'Authorization': api_secret
    };

    const path = '/api/v1/geofences/' + tag + '/' + place.placeID;
    const method = 'DELETE';

    return new Promise((resolve, reject) => {

        const req = https.request({host, path, method, headers}, (res) => {
            let buffers = [];
            res.on('error', reject);
            res.on('data', buffer => buffers.push(buffer));
            res.on('end', () => {
                //console.log('createGeofence statusCode', JSON.stringify(res.statusCode));
                (res.statusCode === 200 || res.statusCode === 404) ? resolve(Buffer.concat(buffers)) : reject(Buffer.concat(buffers));
              }
            );
        });

        // send the request
        req.write('');
        req.end();
    });
};

exports.handler = async (event, context) => {

    let upsertItems = [];
    let removeItems = [];

    const records = event.Records.map(record => ({
      eventName: record.eventName,
      new: AWS.DynamoDB.Converter.unmarshall(record.dynamodb.NewImage),
      old: AWS.DynamoDB.Converter.unmarshall(record.dynamodb.OldImage)
    }));

    records.forEach((record) => {

      console.log('Stream record: ', JSON.stringify(record));

      if (record.eventName == 'INSERT') {
          upsertItems.push(record.new);
      }
      else if (record.eventName == 'MODIFY') {
          const newPlaceID = record.new.placeID;
          const oldPlaceID = record.old.placeID;
          upsertItems.push(record.new);
          if(newPlaceID != oldPlaceID) {
              removeItems.push(record.old);
          }
      }
      else if (record.eventName == 'REMOVE') {
          removeItems.push(record.old);
      }
    });

    const cretaeGeofancePromises = upsertItems.map(item => {
        const { placeID, name, latitude, longitude, when, radius } = item;
        try {
            const data = createGeofence({ placeID, name, latitude, longitude, when, radius }, item.id);
            return data;
        } catch (error) {
            return error;
        }
    });

    const cretaeGeofanceAlldata = await Promise.all(cretaeGeofancePromises);
    console.log('cretaeGeofanceAlldata', JSON.stringify(cretaeGeofanceAlldata));

    const deleteGeofancePromises = removeItems.map(item => {
        const { placeID, name, latitude, longitude, when, radius } = item;
        try {
            const data = deleteGeofence({ placeID, name, latitude, longitude, when, radius }, item.id);
            return data;
        } catch (error) {
            return error;
        }
    });

    const deleteGeofanceAlldata = await Promise.all(deleteGeofancePromises);
    console.log('deleteGeofanceAlldata', JSON.stringify(deleteGeofanceAlldata));

    return;
};
