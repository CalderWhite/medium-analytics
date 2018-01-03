const zlib = require("zlib");
// firebase
const firebase = require("firebase/app");
//require("firebase/auth");
require("firebase/database");

// Initialize Firebase
var config = {
  apiKey: "AIzaSyAPNUxOVPUOABbeFkqbDice-tK3sTr9dds",
  authDomain: "medium-analytics.firebaseapp.com",
  databaseURL: "https://medium-analytics.firebaseio.com",
  projectId: "medium-analytics",
  storageBucket: "medium-analytics.appspot.com",
  messagingSenderId: "815409834711"
};
firebase.initializeApp(config);

// Get a reference to the database service
const database = firebase.database();
// testing code
var userRef = firebase.database().ref('users');
const sessionId = 'MTp5ZW9kOTFqbktkZndmbmFBRmc2bEdRN05XY1hRTjM1Uk9KWFJ4RnRPbnR5UDhPOG5Iby9EK3A2djVjQzdPcUU3';
class Utils{
    static getMaxKey(obj){
         return Object.keys(obj).map((key,value)=>(Number(key))).reduce(function(a, b) {
            return Math.max(a, b);
        });
    }
    static goToMax(obj,key){
        if(typeof(obj) == 'string'){
            return [key,obj]
        } else{
            let maxKey = Utils.getMaxKey(obj)
            return Utils.goToMax(obj[maxKey],maxKey)
        }
    }
    static findLatest(obj){
        return Utils.goToMax(obj,obj[Utils.getMaxKey(obj)])
    }
}

export default class firebaseUtils{
    constructor(){
        
    }
    /**
     * Returns all the snapshot available for the given user session.
     */
    static getData(username,callback){
        firebase.database().ref('/snapshots/' + username).once('value').then(function(snapshot) {
            callback(snapshot.val());
        });
    }
    /**
     * Returns the latest snapshot out of all the snapshot data returned from `firebaseUtils.getData`.
     */
    static getLatestSnapshot(data,callback){
        // recurisvely go to the highest key, until there 
        let [timestamp,compressed] = Utils.findLatest(data);
        zlib.gunzip(new Buffer(compressed, 'base64'), function(err, buf) {
            //TODO: handle the `err`
            let data = {
                stories:JSON.parse(buf.toString()),
                snapshotTimestamp:timestamp
            }
            callback(data)
        });
    }
    /**
     * Decompresses the latest month's snapshots and puts them into a list
     */
    static getLatestMonth(data,callback){
      let latestMonth = data[Utils.getMaxKey(data)];
      latestMonth = latestMonth[Utils.getMaxKey(latestMonth)];
      let done = 0;
      //TODO: create a list of all the keys' properties
      let keys = Object.keys(latestMonth);
      let snapshots = [];
      for(let i=0;i<keys.length;i++){
         let s = Object.keys(latestMonth[keys[i]])
         for(let j=0;j<s.length;j++){
            zlib.gunzip(new Buffer(latestMonth[keys[i]][s[j]], 'base64'), function(err, buf) {
                //TODO: handle the `err`
                let data = JSON.parse(buf.toString());
                data = {
                    stories:data,
                    snapshotTimestamp:Number(s[j])
                }
                snapshots.push(data);
                if(i == keys.length-1 && j == s.length-1){
                    callback(snapshots)
                }
            });
         }
      }
    }
}