# Weather Function

Receive data from pubsub, then 
Write telemetry raw data to bigquery
Maintain last data on firebase realtime database

## Functions Code

See file [functions/index.js](functions/index.js) for the code.

The dependencies are listed in [functions/package.json](functions/package.json).

## Trigger rules

The function triggers on upload of any file to Firebase project.

## Setting up

 1. Create a Firebase project on the [Firebase Console](https://console.firebase.google.com).
 2. In the Google Cloud Console [enable the **Google Cloud Vision API**](https://console.cloud.google.com/apis/api/vision.googleapis.com/overview?project=_). Note: Billing is required to enable the Cloud Vision API so enable Billing on your Firebase project by switching to the Blaze or Flame plans.
 3. Clone or download this repo and open the `weatherdata` directory.
 4. You must have the Firebase CLI installed. If you don't have it install it with `npm install -g firebase-tools` and then configure it with `firebase login`.
 5. Configure the CLI locally by using `firebase use --add` and select your project in the list.
 6. Install dependencies locally by running: `cd functions; npm install; cd -` 

## Deploy and test

1. Deploy your Cloud Functions using `firebase deploy --only functions:iotWeather`
