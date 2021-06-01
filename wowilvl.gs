var apikey = "----";


function wowilvl(toonName,realmName)
{
    var key = realmName+","+toonName
    
    var cache = CacheService.getPublicCache();
    var cached = cache.get(key);
    if (cached != null) {
      var result = [ JSON.parse("["+cached+"]") ];
      return result[0][1];
    }
  
    if (!toonName || !realmName)
    {
        return " ";
    }


    Utilities.sleep(Math.floor((Math.random() * 1000) + 0)); 

    toonName = toonName.replace(/[\u200B-\u200D\uFEFF]/g, "");
    realmName = realmName.replace(/[\u200B-\u200D\uFEFF]/g, "");

    var options = { muteHttpExceptions:true };
    var toonJSON = UrlFetchApp.fetch("https://eu.api.battle.net/wow/character/"+realmName+"/"+toonName+"?fields=reputation,statistics,items,quests,achievements,audit,progression,feed,professions,talents&?locale=en_US&apikey="+apikey+"", options);
    if(toonJSON.getResponseCode() == 200){
      var toon = JSON.parse(toonJSON.getContentText());
      var toonInfo = new Array([
        toon.items.averageItemLevel,
        toon.items.averageItemLevelEquipped,
      ])
      
      cache.put(key, toonInfo, 600); // 10 min
      
      return toonInfo[0][1];  
    }
return 'x';
}

function refreshLastUpdate() {
  SpreadsheetApp.getActiveSpreadsheet().getRange('A1').setValue(new Date().toTimeString());
   }
