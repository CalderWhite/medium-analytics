export class Utils{
    static componentToHex(c) {
        var hex = c.toString(16);
        return hex.length == 1 ? "0" + hex : hex;
    }
    
    static rgbToHex(r, g, b) {
        return "#" + Utils.componentToHex(r) + Utils.componentToHex(g) + Utils.componentToHex(b);
    }

}
export class analyticsFrontendEngine{
    /**
     * Format a list of objects to viable morris.js donut data.
     * @param key The name of the refferer
     * @param value The key that represents the portion of the donut that the given referrer takes up.
     */
    static formatToDonutData(referrals,key,value){
        for(let i=0;i<referrals.length;i++){
            referrals[i] = {
                label:referrals[i][key],
                value:referrals[i][value]
            }
        }
        return referrals;
    }
    /**
     * Removes excluded labels along with other utilities based on the parameters given.
     * @param minimumPortion Default:-1 The minimum percentage of `[valueName]` required to be an individual portion of the donut. Those will be clumped into an element called "other".
     */
    static cleanseReferralList(referrals,minimumPortion,keyName,valueName){
        if (referrals.length < 1){
            return [];
        }
        if(minimumPortion == undefined){
            // exclude none if minimumPortion is not set
            minimumPortion = -1;
        }
        if(keyName == undefined){
            keyName = "label"
        }
        if(valueName == undefined){
            valueName = "value"
        }
        let o = {}
        o[keyName] = 'Other';
        o[valueName] = 0
        referrals.push(o)
        // find total of all values
        let total = 0;
        for(let referrer of referrals){
            total+= referrer[valueName]
        }
        // create a pointer to shorten names
        let excludes = analyticsFrontendEngine.excludeReferrals;
        // subtract 2 so we don't loop over the 'Other' element
        for(let i=referrals.length-2;i>=0;i--){
            // if .[keyName] is in the excludes list then remove it from the array
            for(let j=0;j<excludes.length;j++){
                if(referrals[i][keyName].search(excludes[j]) > -1){
                    referrals.splice(i,1)
                }
            }
            // check that the value is above the minimum requirement
            if(referrals[i][valueName] / total < minimumPortion/100){
                // the last element is Other, so add the value to it
                referrals[referrals.length-1][valueName]+=referrals[i][valueName]
                // remove the item
                referrals.splice(i,1)
            }
        }
        // since the last element will always be the other element we appended at the beginning, we can check it by accesing
        // the last element of the array. Remove it if its value is zero
        if(referrals[referrals.length-1][valueName] == 0){
            referrals.splice(referrals.length-1,1)
        }
        // place the `other` item in sorted order, since this list is sorted
        let other = referrals.pop(referrals.length-1)
        let i = referrals.length-1;
        if (i<0){
            referrals.splice(i+1,0,other)
            return referrals;
        }
        while(i >=0 && other[valueName] > referrals[i][valueName]){
            i--
        }
        referrals.splice(i+1,0,other)
        return referrals;
    }
    
    static snapshotsToReferralChart(snapshots,detail){
        //TODO: insert referrer names if they aren't present in every snapshot
        return snapshots.filter(({snapshotTimestamp,referrers})=>{
            return referrers.length > 0
        }).map(({snapshotTimestamp,referrers})=>{
            let temp = analyticsFrontendEngine.cleanseReferralList(referrers,detail,'name','views')
            let r = {}
            for(let referrer of temp){
                r[referrer.name] = referrer.views
            }
            r.name = snapshotTimestamp.toString()
            return r;
        })
    }
    /*
     * Converts a list of line chart data into the deltas of each day
     * For example, if there was:
     * ```
     * [
     *     {claps:100},
     *     {claps:110},
     *     {claps:115}
     * ]
     * ```
     * turns into 
     * ```
     * [
     *     {claps:10},
     *     {claps:5}
     * ]
     * ```
     */
    static charDataToDeltas(snapshots){
        let deltas = []
        // start at 1 to avoid index errors
        for(let i=1;i<snapshots.length;i++){
            let prev = snapshots[i-1];
            let curr = snapshots[i];
            deltas.push({
                views: curr.views - prev.views,
                reads: curr.reads - prev.reads,
                claps: curr.claps - prev.claps,
                fans: curr.fans - prev.fans,
                name:curr.name
            })
        }
        return deltas;
    }
    static snapshotsToLineChart(snapshots){
        return snapshots.map(({views,reads,claps,upvotes,snapshotTimestamp})=>{
            return {
                views:views,
                reads:reads,
                claps:claps,
                fans:upvotes,
                name:snapshotTimestamp
            }
        })
    }
    static randomColorSet(n){
        if(n > analyticsFrontendEngine.colors.length){
            throw 'Cannot generate that many unique colors.'
        }
        let colors = [];
        for(let i=0;i<n;i++){
            colors.push(analyticsFrontendEngine.colors[i])
        }
        return colors
    }
    /**
     * Turns a normal a dataset with normal snapshots, which contains multiple stories into a dataset with
     * Objects like snapshots, except they represent all the stories.
     */
     static mergeStories(snapshots){
         for(let i=0;i<snapshots.length;i++){
             let snap = snapshots[i];
             // loop forwards through the array except for the last element, since the last element will have ever referrer that occurs
             // don't loop over the last so we don't double count its stats
             let lastStory = snap.stories[snap.stories.length-1];
             for(let s=0;s<snap.stories.length-1;s++){
                let story = snap.stories[s];
                // merge story stats
                lastStory.views += story.views;
                lastStory.reads += story.reads;
                lastStory.claps += story.claps;
                lastStory.upvotes += story.upvotes;
                // now merge the referrers
                for(let r=0;r<story.referrers.length;r++){
                    let found = false;
                    for(let re=0;re<lastStory.referrers.length;re++){
                        if(lastStory.referrers[re].name == story.referrers[r].name){
                            lastStory.referrers[re].views += story.referrers[r].views;
                            found=true;
                        }
                    }
                    if(!found){
                        lastStory.referrers.push(story.referrers[r]);
                    }
                }
            }
            // for some reason undefiend seems to turn up in the list of referrals. Easier to clean it out here rather than trace its source.
            lastStory.referrers = lastStory.referrers.map(item=>{if (item != undefined) return item})
            // set only the properties we want
            snapshots[i] = {
                views: lastStory.views,
                reads: lastStory.reads,
                claps: lastStory.claps,
                upvotes: lastStory.upvotes,
                referrers: lastStory.referrers,
                snapshotTimestamp: snap.snapshotTimestamp
            }
         }
         return snapshots
     }
     static getStoryTitles(snapshot){
         return snapshot.stories.map(({title})=>title)
     }
     static selectStory(snapshots,storyName){
         return snapshots.map(snapshot=>{
             for(let i=0;i<snapshot.stories.length;i++){
                 if(snapshot.stories[i].title == storyName){
                    snapshot.stories[i].snapshotTimestamp = snapshot.snapshotTimestamp;
                    return snapshot.stories[i];
                 }
             }
         })
     }
}
analyticsFrontendEngine.excludeReferrals = ['RSS readers']
// my own fork of jquery's color plugin
analyticsFrontendEngine.colors = ['red','green','orange','blue','indigo','cyan','purple','black']
