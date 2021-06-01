var apikey = "-----";

var CONST_EPICGEM_ILVL = 860;
var CONST_AUDIT_ILVL = 599;
var showTotalArtifactPower = true;

function relic(equippedRelic)
{
    var id = equippedRelic.itemId;
    var bonusLists = "";
    equippedRelic.bonusLists.forEach(function(bonusListNumber) 
    {
        bonusLists = bonusLists +  bonusListNumber + ",";
    });
    Utilities.sleep(500);
    var relicJSON = UrlFetchApp.fetch("https://us.api.battle.net/wow/item/"+id+"?bl="+bonusLists+"&locale=en_US&apikey="+apikey+"");
    var relicDat = JSON.parse(relicJSON.toString());
  
    var elementType = relicDat.gemInfo.type.type;
  
    if (elementType === "WIND") 
    {
        elementType = "STORM";
    }

    var ilvl = relicDat.itemLevel;
  
    {
        var spare = ilvl%10;
        if (spare<=3)
        {
            ilvl-=spare;
        }
        else
        {
            ilvl+=(5-spare);
        }

    }

    var relicIlvl = 0;
    if (ilvl<=690)
    {
        relicIlvl = 2; 
    }
    else
   {
        switch (ilvl)
       {
            case (695): relicIlvl="3"; break;
            case (700): relicIlvl="4"; break;
            case (705): relicIlvl="5"; break;
            case (710): relicIlvl="7"; break;
            case (715): relicIlvl="8"; break;
            case (720): relicIlvl="9"; break;
            case (725): relicIlvl="10"; break;
            case (730): relicIlvl="12"; break;
            case (735): relicIlvl="13"; break;
            case (740): relicIlvl="14"; break;
            case (745): relicIlvl="15"; break;
            case (750): relicIlvl="17"; break;
            case (755): relicIlvl="18"; break;
            case (760): relicIlvl="19"; break;
            case (765): relicIlvl="21"; break;
            case (770): relicIlvl="22"; break;
            case (775): relicIlvl="23"; break;
            case (780): relicIlvl="24"; break;
            case (785): relicIlvl="26"; break;
            case (790): relicIlvl="27"; break;
            case (795): relicIlvl="28"; break;
            case (800): relicIlvl="29"; break;
            case (805): relicIlvl="31"; break;
            case (810): relicIlvl="32"; break;
            case (815): relicIlvl="33"; break;
            case (820): relicIlvl="35"; break;
            case (825): relicIlvl="36"; break;
            case (830): relicIlvl="37"; break;
            case (835): relicIlvl="39"; break;
            case (840): relicIlvl="40"; break;
            case (845): relicIlvl="42"; break;
            case (850): relicIlvl="43"; break;
            case (855): relicIlvl="45"; break;
            case (860): relicIlvl="46"; break;
            case (865): relicIlvl="48"; break;
            case (870): relicIlvl="49"; break;
            case (875): relicIlvl="51"; break;
            case (880): relicIlvl="52"; break;
            case (885): relicIlvl="53"; break;
            case (890): relicIlvl="55"; break;
            case (895): relicIlvl="56"; break;
            case (900): relicIlvl="58"; break;
            case (905): relicIlvl="59"; break;
            case (910): relicIlvl="61"; break;
            case (915): relicIlvl="62"; break;
            case (920): relicIlvl="64"; break;
            case (925): relicIlvl="65"; break;
            default: relicIlvl="65+";
        }
    }
    return elementType+" +"+relicIlvl+" ilvls";
}

function wow(region,toonName,realmName)
{

    if (!toonName || !realmName)
    {
        return " ";
    }


    Utilities.sleep(Math.floor((Math.random() * 10000) + 1000)); 

    toonName = toonName.replace(/[\u200B-\u200D\uFEFF]/g, "");
    region = region.replace(/[\u200B-\u200D\uFEFF]/g, "");
    realmName = realmName.replace(/[\u200B-\u200D\uFEFF]/g, "");

    region = region.toLowerCase();

    var options={ muteHttpExceptions:true };
    var toonJSON = UrlFetchApp.fetch("https://"+region+".api.battle.net/wow/character/"+realmName+"/"+toonName+"?fields=reputation,statistics,items,quests,achievements,audit,progression,feed,professions,talents&?locale=en_US&apikey="+apikey+"", options);
    var toon = JSON.parse(toonJSON.toString());

    var mainspec = "none";
    for (var i = 0; i < 4; i++)
    {
        if (toon.talents[i].selected === true)
        {
            mainspec=toon.talents[i].spec.name;
        }
    }

    var toon_class = 0;

    switch (toon.class)
    {
        case 1:
            toon_class = "Warrior";
            break;
        case 2:
            toon_class = "Paladin";
            break;
        case 3:
            toon_class = "Hunter";
            break;
        case 4:
            toon_class = "Rogue";
            break;
        case 5:
            toon_class = "Priest";
            break;
        case 6:
            toon_class = "DeathKnight";
            break;
        case 7:
            toon_class = "Shaman";
            break;
        case 8:
            toon_class = "Mage";
            break;
        case 9:
            toon_class = "Warlock";
            break;
        case 10:
            toon_class = "Monk";
            break;
        case 11:
            toon_class = "Druid";
            break;
        case 12:
            toon_class = "Demon Hunter";
            break;
        default:
            toon_class = "?";
    }


    var auditInfo ="";

    var totalGems = [0, 0, 0];

    var gemAudit = [
        { bool: 0, issue: " Old:" },    
        { bool: 0, issue: " Cheap:" },
        { bool: 0, issue: " Non-Epic:" },    
        { bool: 0, issue: " Mixed Gems" }  
    ];

    var gemStats = [
        { value: 0, stat: "Crit" },
        { value: 0, stat: "Haste" },
        { value: 0, stat: "Vers" },
        { value: 0, stat: "Mast" },
        { value: 0, stat: "Str" },
        { value: 0, stat: "Agi" },
        { value: 0, stat: "Int" }
    ];

    var audit_lookup = {};

    //cheap enchants & gems

    //ring
    audit_lookup["5423"] = "Word +150C";
    audit_lookup["5424"] = "Word +150H";
    audit_lookup["5425"] = "Word +150M";
    audit_lookup["5426"] = "Word +150V";
    //cloak
    audit_lookup["5431"] = "Word +150S";
    audit_lookup["5432"] = "Word +150A";
    audit_lookup["5433"] = "Word +150I";
    //gems
    audit_lookup["130218"] =
        audit_lookup["130217"] =
        audit_lookup["130216"] =
        audit_lookup["130215"] = 0;

    //better enchants and gems

    //ring
    audit_lookup["5427"] = "Binding +200C";
    audit_lookup["5428"] = "Binding +200H";
    audit_lookup["5429"] = "Binding +200M";
    audit_lookup["5430"] = "Binding +200V";

        //cloak
    audit_lookup["5434"] = "Binding +200S";
    audit_lookup["5435"] = "Binding +200A";
    audit_lookup["5436"] = "Binding +200I";

        //gems
    audit_lookup["130219"] =
        audit_lookup["130220"] =
        audit_lookup["130221"] =
        audit_lookup["130222"] =1;

    //epic gems
    audit_lookup["130246"] =         //strengh
        audit_lookup["130247"] =     //agility
        audit_lookup["130248"] =  2; //Int

    //neck
    audit_lookup["5437"] = "Claw";
    audit_lookup["5438"] = "Army";
    audit_lookup["5439"] = "Satyr";
    audit_lookup["5889"] = "Hide";
    audit_lookup["5890"] = "Soldier";
    audit_lookup["5891"] = "Ancient";
  
  //shoulder
    audit_lookup["5440"] = "Scavenger (cloth)";
    audit_lookup["5441"] = "Gemfinder";
    audit_lookup["5442"] = "Harvester (herbs/fish)";
    audit_lookup["5443"] = "Butcher (leather/meat)";
    audit_lookup["5882"] = "Manaseeker (enchant)";
    audit_lookup["5881"] = "Salvager (ore/armor)";
    audit_lookup["5883"] = "Bloodhunter (Blood)";
  
  //gloves
    audit_lookup["5444"] = "Herb";
    audit_lookup["5445"] = "Mine";
    audit_lookup["5446"] = "Skin";
    audit_lookup["5447"] = "Survey";

    var thumbnail = "http://"+region+".battle.net/static-render/"+region+"/"+  toon.thumbnail;
    var armory = "http://"+region+".battle.net/wow/en/character/"+realmName+"/"+toonName+"/advanced";

    var tier = " ";
    var tier_pieces = [toon.items.head,toon.items.shoulder,toon.items.chest,toon.items.hands,toon.items.legs,toon.items.waist];

    var set1 = [];
    var set2 = [];

    var gemMatch = 0;

    for (i = 0; i < tier_pieces.length; i++)
    {
        if (tier_pieces[i] && tier_pieces[i].tooltipParams.set)
        {
            if (!set1.length)
            {
                set1 = tier_pieces[i].tooltipParams.set;
            }

            if (!set2.length && set1.indexOf(tier_pieces[i].id) ==-1)
            {
                set2 = tier_pieces[i].tooltipParams.set;
            }
        }
    }

    if (set2.length)
    {
        tier = set1.length + "/" + set2.length;
    }
    else
    {
        tier = set1.length;
    }

    var allItems={
        equippedItems:0,
        totalIlvl:0,
        upgrade: {
            total:0,
            current:0
        }
    };
    var enchantableItems=["neck","back","finger1","finger2","hands","shoulder"];
    var getItemInfo = function (item, slot)
    {
        allItems[slot] = {
            ilvl:"\u2063",
            upgrade:"-"
        };

        if (item)
        {
            if (item.tooltipParams.upgrade)
            {
                allItems[slot].upgrade= item.tooltipParams.upgrade.current + "/" + item.tooltipParams.upgrade.total;
                allItems.upgrade.total+=item.tooltipParams.upgrade.total;
                allItems.upgrade.current+=item.tooltipParams.upgrade.current;
            }
          
            
            var obliterum = 7; 
            var craftedUpgrade = -1;
                          
            for (var j = 0; j < item.bonusLists.length; j++)
            {
                switch (item.bonusLists[j])
                {
                    case 596:
                        craftedUpgrade = 0;
                        break;
                    case 597:
                        craftedUpgrade = 1;
                        break;
                    case 598:
                        craftedUpgrade = 2;
                        break;
                    case 599:
                        craftedUpgrade = 3;
                        break;
                    case 666:
                        craftedUpgrade = 4;
                        break;
                    case 667:
                        craftedUpgrade = 5;
                        break;
                    case 668:
                        craftedUpgrade = 6;
                        break;
                    case 669:
                        craftedUpgrade = 7;
                        break;
                    default:
                        craftedUpgrade = "-";

                }
            }
            
            if (craftedUpgrade > -1)
            {
                allItems[slot].upgrade= craftedUpgrade + "/" + obliterum;
                allItems.upgrade.total+=obliterum;
                allItems.upgrade.current+=craftedUpgrade;
            }
               
            allItems.equippedItems++;
            allItems[slot].ilvl = item.itemLevel;
            allItems.totalIlvl += item.itemLevel;

            if (item.itemLevel > CONST_AUDIT_ILVL)
            {
                if (item.tooltipParams.gem0&&slot!="mainHand"&&slot!="offHand")
                {
                    if (item.tooltipParams.gem0 > 130245)
                   {
                        gemStats[item.tooltipParams.gem0-130246+4].value = gemStats[item.tooltipParams.gem0-130246+4].value+200;
                    }
                    else if (item.tooltipParams.gem0 > 130218) //(rare)
                   {
                        gemStats[item.tooltipParams.gem0-130219].value = gemStats[item.tooltipParams.gem0-130219].value+150; 
                    }
                    else if (item.tooltipParams.gem0 > 130214) //(uncommon)
                   {
                        gemStats[item.tooltipParams.gem0-130215].value = gemStats [item.tooltipParams.gem0-130215].value+100; 
                    }

                    if (item.itemLevel>CONST_EPICGEM_ILVL)
                    {
                        if (audit_lookup[item.tooltipParams.gem0] != 2)
                        {
                            gemAudit[2].bool = 1;
                            gemAudit[2].issue += " "+ slot;
                        }
                    }
                    else if (audit_lookup[item.tooltipParams.gem0] === 0)
                    {
                        gemAudit[1].bool = 1;
                        gemAudit[1].issue += " " + slot;
                    }
                    else if (audit_lookup[item.tooltipParams.gem0] != 1)
                    {
                        gemAudit[0].bool = 1;
                        gemAudit[0].issue += " " + slot;
                      
                    }
                   
                   
                    if (audit_lookup[item.tooltipParams.gem0] != 2 && (gemMatch == 0 || gemMatch === item.tooltipParams.gem0 || gemMatch === item.tooltipParams.gem0+4 || gemMatch === item.tooltipParams.gem0-4))
                    {
                        gemMatch = item.tooltipParams.gem0;      
                    }
                    else if (audit_lookup[item.tooltipParams.gem0] != 2 && audit_lookup[item.tooltipParams.gem0] > -1)
                    {
                        gemAudit[3].bool = 1; 
                    }
                  
                    totalGems[audit_lookup[item.tooltipParams.gem0]]++;
                }

                if (enchantableItems.indexOf(slot)!=-1)
                {
                    allItems[slot].enchant= "None";
                    if (item.tooltipParams.enchant)
                    {
                        if (audit_lookup[item.tooltipParams.enchant])
                        {
                            allItems[slot].enchant = audit_lookup[item.tooltipParams.enchant];
                        }
                        else
                        {
                            allItems[slot].enchant = "Old";
                        }
                    }
                }
            }
        }
    };

    var sortOrder = [
        "head",
        "neck",
        "shoulder",
        "back",
        "chest",
        "wrist",
        "hands",
        "waist",
        "legs",
        "feet",
        "finger1",
        "finger2",
        "trinket1",
        "trinket2",
        "mainHand",
        "offHand"
    ];

    for (i = 0; i < sortOrder.length; i++)
    {
        getItemInfo(toon.items[sortOrder[i]],sortOrder[i]);
    }
   
    var bruksOCDswap = function (item1,item2)
    {
        if (allItems[item1].ilvl<allItems[item2].ilvl)
        {
            var swapValue = allItems[item1].ilvl;
            allItems[item1].ilvl = allItems[item2].ilvl;
            allItems[item2].ilvl = swapValue;
        }
    };

    bruksOCDswap("finger1","finger2");
    bruksOCDswap("trinket1","trinket2");
  
    if (allItems.offHand.ilvl == "\u2063" ) 
   { 
        allItems.totalIlvl += allItems.mainHand.ilvl; 
        allItems.equippedItems += 1; 
    }

    allItems.averageIlvl = allItems.totalIlvl / allItems.equippedItems;

    if (isNaN(allItems.averageIlvl))
    {
        allItems.averageIlvl = toon.items.averageItemLevel; 
    }

    if (toon.audit.emptySockets !== 0)
    {
        auditInfo = auditInfo + "Empty Gem Sockets: " + toon.audit.emptySockets;
    }


    if (totalGems[0]+totalGems[1]+totalGems[2]>0)
    {
        auditInfo = auditInfo + "Gems" ;
     
        if (totalGems[0] > 0) 
        {
            auditInfo = auditInfo + " UnCom:" + totalGems[0];
        }

        if (totalGems[1] > 0)
        {
            auditInfo = auditInfo + " Rare:" + totalGems[1];
        }
        if (totalGems[2] > 0)
        {
            auditInfo = auditInfo + " Epic:" + totalGems[2];   
        }

        for (i=0; i<gemStats.length; i++) 
        {
            if (gemStats[i].value > 0)
            {
                auditInfo = auditInfo + " +" + gemStats[i].value + gemStats[i].stat + " ";
            }
        }

    }

    for (i=0; i<gemAudit.length; i++) 
    {
        if (gemAudit[i].bool > 0)
        {
            auditInfo = auditInfo + gemAudit[i].issue;
        }
    }

    var profession1 = "none";
    if (toon.professions.primary[0])
    {
        profession1 = toon.professions.primary[0].rank + " " + toon.professions.primary[0].name;
    }
    var profession2 = "none";
    if (toon.professions.primary[1])
    {
        profession2 =  toon.professions.primary[1].rank + " " + toon.professions.primary[1].name;
    }


    var upgradePercent = "-";

    if (allItems.upgrade.total > 0)
    {
        upgradePercent = Math.round(allItems.upgrade.current/allItems.upgrade.total*100) + "%";
    }

    var artifactRank = "x";
    var artifactRelics = [];
    var relicItems = ["mainHand","offHand"];

    for (i = 0; i < relicItems.length; i++)
    {
        if (toon.items[relicItems[i]])
        {
            var relicItem = toon.items[relicItems[i]];
            if (relicItem.quality === 6)
            {
                artifactRank = 0;
                relicItem.relics.forEach(function(relicGem) 
                {
                    artifactRelics.push(relic(relicGem));
                });
            }
        }
    }


    for (i=0; i<toon.achievements.criteria.length; i++)
    {
        if (toon.achievements.criteria[i] == "29395")
        {
            artifactRank = toon.achievements.criteriaQuantity[i];
        }
    }

    if (showTotalArtifactPower)
    {
        for (i=0; i<toon.achievements.criteria.length; i++)
        {
            if (toon.achievements.criteria[i] === 30103)
            {
                artifactRank = artifactRank + " [" +  toon.achievements.criteriaQuantity[i] + "]";
            }
        }
    }
  
    for (i = artifactRelics.length; i < 3; i++)
    {
        artifactRelics.push("x");
    }

    var toonInfo = [
      
        toon_class,
        toon.level,
        mainspec,
        allItems.averageIlvl,
        tier,
        " ",
        artifactRank,
        auditInfo,
    ];

    var possision = 6;
    for (i = 0; i<sortOrder.length;i++)
    {
        toonInfo.splice(possision,0,allItems[sortOrder[i]].ilvl);
        possision++;
    }
    possision+=4;
    for (i = 0; i < enchantableItems.length-2;i++)
    {
        toonInfo.splice(possision,0,allItems[enchantableItems[i]].enchant);
        possision++;
    }
    return toonInfo;
}
