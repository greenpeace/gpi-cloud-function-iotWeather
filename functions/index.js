
/**
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *    http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

// Set the variables
const functions = require('firebase-functions');
const admin = require('firebase-admin');
const bigquery = require('@google-cloud/bigquery');

admin.initializeApp(functions.config().firebase);

const db = admin.database();

/**
 * Receive data from pubsub, then 
 * Write raw data to bigquery
 * Maintain last data on firebase realtime database
 */

exports.iotWeather = functions.pubsub
  .topic('iot-topic')
  .onPublish((message, context) => {
    const attributes = message.attributes;
    const payload = message.json;

    const deviceId = attributes['deviceId'];

    const data = {
      humidity: payload.hum,
      temp: payload.temp,
      deviceId: deviceId,
      timestamp: context.timestamp,
      free_ram: payload.free_ram,
      total_ram: payload.total_ram
    };

    if (
      payload.hum < 0 ||
      payload.hum > 100 ||
      payload.temp > 100 ||
      payload.temp < -50
    ) {
      // Validate and do nothing
        console.log("Wrong Temp or Humitidy value");
      return;
    }

    console.log("Updating Firebase & BigQuery Tables");

    return Promise.all([
      insertIntoBigquery(data),
      updateCurrentDataFirebase(data)
    ]);
  });

/** 
 * Maintain last status in firebase
*/
function updateCurrentDataFirebase(data) {
  return db.ref(`/devices/${data.deviceId}`).set({
    humidity: data.humidity,
    temp: data.temp,
    free_ram: data.free_ram,
    total_ram: data.total_ram,
    lastTimestamp: data.timestamp
  });
}

/**
 * Store all the raw data in bigquery
 */
function insertIntoBigquery(data) {
  const dataset = bigquery.dataset(functions.config().bigquery.datasetname);
  const table = dataset.table(functions.config().bigquery.tablename);
  return table.insert(data);
}
