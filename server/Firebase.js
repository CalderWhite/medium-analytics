const admin = require("firebase-admin");
const zlib = require("zlib");
const USER_PATH = "users";
const SNAPSHOT_PATH = "snapshots";

class Database{
    constructor(secretFileName){
        let serviceAccount = require(secretFileName);
        admin.initializeApp({
          credential: admin.credential.cert(serviceAccount),
          databaseURL: "https://medium-analytics.firebaseio.com"
        });
        this.database = admin.database();
        this.users = this.database.ref(USER_PATH);
        this.snapshots = this.database.ref(SNAPSHOT_PATH);
    }
    newUser(userInfo){
        let buff = new Buffer(sessionId);  
        // add them to the meta data section
        let userRef = this.users.child(username)
        userRef.set(userInfo)
    }
    addSnapshot(uid,snapshot,callback){
        let d = new Date();
        let snapshotRef = this.snapshots
        .child(uid)
        .child(d.getFullYear())
        .child(d.getMonth())
        .child(d.getDate())
        // compress the data, hosting ain't free! ...after 1GB ;)
        zlib.gzip(JSON.stringify(snapshot), function(err, buf) {
            let b64 = new Buffer(buf).toString('base64');
            let setData = {};
            setData[d.getTime().toString()] = b64;
            snapshotRef.update(setData)
            .then(callback,()=>{console.log("Error adding snapshot @ update")})
        });
    }
    getUser(uid,callback){
        let ref = this.users.child(uid)
        ref.on("value", function(snapshot) {
          callback(snapshot.val());
        }, function (errorObject) {
          console.log("The read failed: " + errorObject.code);
        });
    }
    getUsers(callback){
        this.users.once("value", function(snapshot) {
          callback(snapshot.val());
        }, function (errorObject) {
          console.log("The read failed: " + errorObject.code);
        });
    }
    getSnapshots(uid,path,callback){
        let ref = this.snapshots.child(uid).child(path);
        ref.on("value", function(snapshot) {
          callback(snapshot.val());
        }, function (errorObject) {
          console.log("The read failed: " + errorObject.code);
        });
    }
}
module.exports = Database;