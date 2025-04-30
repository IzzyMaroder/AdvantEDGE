import axios from "axios";

let myip = process.env.NCSVC_SERVICE_HOST;

let body = {
  userTrackingSubscription: {
    clientCorrelator: "001",
    callbackReference: {
      notifyURL: `http://${myip}/location_notifications/1`
    },
    address: "ue1",
    userEventCriteria: [ Transferring ]
  }
}

axios.post('http://192.168.0.217/test3/location/v2/subscriptions/userTracking', body);
