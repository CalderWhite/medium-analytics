const zlib = require("zlib");

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
    constructor(firebase){
        this.firebase = firebase
    }
    /**
     * Adds a user the sign in info to /users in the realtime database
     */
    newProviderUser(userData,callback){
      console.log(userData)
      let saveData = {
        uid : userData.uid,
        provider: userData.providerData[0].providerId,
        displayName: userData.providerData[0].displayName,
        phoneNumber : userData.providerData[0].phoneNumber,
        email: userData.providerData[0].email,
        photoURL : userData.providerData[0].photoURL,
        providerUID: userData.providerData[0].uid
      }
      console.log(saveData)
      this.firebase
        .database()
        .ref('/users')
        .child(saveData.uid)
        .child('firebase-account')
        .update(saveData)
        .then(callback)
    }
    newMediumCredentials(uid,userData,callback){
      console.log("SAVING USER DATA")
      this.firebase
        .database()
        .ref('/users')
        .child(uid)
        .child('medium-account')
        .update(userData)
        .then(callback)
    }
    /**
     * Returns all the snapshot available for the given user session.
     */
    getData(callback){
      this.firebase.database().ref('/snapshots/' + this.firebase.auth().currentUser.uid).once('value').then(function(snapshot) {
          callback(snapshot.val());
      });
    }
    /**
     * Returns the latest snapshot out of all the snapshot data returned from `firebaseUtils.getData`.
     */
    getLatestSnapshot(data,callback){
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
    getLatestMonth(data,callback){
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
