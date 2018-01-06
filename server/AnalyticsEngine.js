const request = require('request');
const zlib = require("zlib");

// my own firebase modules
const Firebase = require("./Firebase.js");

class AnalyticsEngine{
    constructor(secretsFileName){
        this.firebase = new Firebase(secretsFileName);
    }
    /**
     * Add a user to our firebase database.
     */
    newSavedUser(username,userId,sessionId){
        this.firebase.newUser(username,userId,sessionId);
    }
    addSnapshot(uid,username,userId,sessionId,callback){
        this.getDataSnapshot(username,userId,sessionId,(err,snapshot) =>{
            if(err != null){
                console.error(err);
            }
            this.firebase.addSnapshot(uid,snapshot,callback);
        })
    }
    getSnapshots(username,path,callback){
        this.firebase.getSnapshots(username,path,(data) => {
            // recursively decompress all the snapshots
            function decodeAll(o,_callback){
                var keys = Object.keys(o)
                var done = 0;
                for(let i=0;i<keys.length;i++){
                    if(keys[i].search("snapshot") > -1){
                      zlib.gunzip(new Buffer(o[keys[i]], 'base64'), function(err, buf) {
                          o[keys[i]] = buf.toString();
                          done++
                          if(done == keys.length){
                              _callback(o)
                          }
                      });
                    } else{
                        decodeAll(o[keys[i]],(data)=>{
                            o[keys[i]] = data;
                            done++
                            if(done == keys.length){
                                _callback(o)
                            }
                        })
                    }
                }
            }
            decodeAll(data,(snapshots)=>{
                callback(snapshots)
            });
        })
    }
    /**
     * Get all of a user's analytic data at the current time.
     * Data put into :
     * Callback(error,data)
     */
    getDataSnapshot(username,userId,sessionId,callback){
        // setting this because of scoping issue
        var ae = this;
        // getting all stats except referrals
        this.getStats(username,userId,sessionId,(err,data) =>{
            if(err == null){
                var done = 0;
                var snapshot = data;
                // loop through each story, and asynchronously grab their referrers.
                // ** The last one to grab its referrers calls the callback as well
                for(let i=0;i<snapshot.payload.value.length;i++){
                    ae.getReferrals(
                        snapshot.payload.value[i].postId,
                        userId,sessionId,
                        (_err,referrers) =>{
                            if(_err == null){
                                // add to the count (which ultimately checks which thread is done last.)
                                done++;
                                snapshot.payload.value[i].referrers = referrers;
                                if(done == snapshot.payload.value.length){
                                    // ** last one to get referrers, so call callback
                                    callback(null,snapshot.payload.value);
                                }
                            } else{
                                callback(_err,null);
                            }
                    });
                }
            } else{
                callback(err,null);
            }
        });
    }
    /**
     * Get all analytics about a give use excluding referral data.
     */
    getStats(username,userId,sessionId,callback){
        // if we have the 3 pieces of information above, we can talk to medium's in-house api
        var headers = {
            'cookie': 'uid='+userId+'; sid='+sessionId+';',
            'accept-language': 'en-US,en;q=0.9,zh-CN;q=0.8,zh;q=0.7',
            'user-agent': 'Mozilla/5.0 (X11; CrOS x86_64 9901.77.0) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/62.0.3202.97 Safari/537.36',
            'content-type': 'application/json',
            'accept': 'application/json',
            'referer': 'https://medium.com/me/stats',
            'authority': 'medium.com',
            'accept-encoding': 'utf-8',
            'x-obvious-cid': 'web'
        };
        
        var options = {
            url: 'https://medium.com/@'+username+'/stats?filter=not-response',
            headers: headers
        };
        // for some reason, this string is always in front of the api json payloads.
        const garbageString = "])}while(1);</x>";
        
        request(options, (error, response, body) =>{
            if (!error && response.statusCode == 200) {
                // remove the garbage at the front of the body, and then parse the rest as JSON
                let data = JSON.parse(body.substring(garbageString.length));
                callback(null,data)
            } else{
                // if there are errors, call the callback with the error that occurred
                callback(error,body);
            }
        });
    }
    /**
     * Return all the referrals for a given story
     */
    getReferrals(postId,userId,sessionId,callback){
        var headers = {
            'accept-encoding': 'utf-8',
            'accept-language': 'en-US,en;q=0.9,zh-CN;q=0.8,zh;q=0.7',
            'upgrade-insecure-requests': '1',
            'user-agent': 'Mozilla/5.0 (X11; CrOS x86_64 9901.77.0) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/62.0.3202.97 Safari/537.36',
            'accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,image/apng,*/*;q=0.8',
            'cache-control': 'max-age=0',
            'authority': 'medium.com',
            'cookie': 'uid='+userId+'; sid='+sessionId+';'
        };
        
        var options = {
            url: 'https://medium.com/p/'+postId+'/referrers',
            headers: headers
        };
        
        function getReferrersFromResponse(error, response, body) {
            var referrers = [];
            if (!error && response.statusCode == 200) {
                const jsdom = require("jsdom");
                const { window } = new jsdom.JSDOM(body);
                var $ = require("jquery")(window);
                let rows = $('.table-row');
                for(let i=0;i<rows.length;i++){
                    let [referrer,views] = rows[i].children;
                    referrer = referrer.textContent;
                    views = Number(views.textContent);
                    referrers.push({
                        "name" : referrer,
                        "views" : views
                    });
                }
                callback(null,referrers);
            } else{
                callback({error:error,statusCode : response.statusCode},null);
            }
        }
        
        request(options, getReferrersFromResponse);

    }
}
module.exports = AnalyticsEngine;