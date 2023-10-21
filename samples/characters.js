var readline = require('readline');
var fs = require('fs');
 
var ld = require('..');
var CharCrypto = ld.CharCrypto;
var PWDGen = ld.PWDGen;
var pad = require('pad');
 
process.stdout.write('\u001B[2J\u001B[0;0f');
 
const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});
 
rl.question("Enter NFC's UID: ", (uid) => {
    rl.question("Enter character or vehicle ID ( [Character or Vehicle ID] or [C] for all Characters or [V] for all Vehicles ): ", (cvid) => {
        if (uid == "") {
            console.log("");
            console.log("No valid NFC's UID");
        }
        else if (cvid == "") {
            console.log("");
            console.log("No valid character or vehicle ID");
        }
        else {
            var cc = new CharCrypto();
            var pwd = pad(8, PWDGen(uid).toString(16), '0');
            
            var characters = JSON.parse(fs.readFileSync('C:\Users\Familie Alles\Documents\GitHub\node-ld\data/list_of_characters.json.txt', 'utf8'));
            var vehicles = JSON.parse(fs.readFileSync('C:\Users\Familie Alles\Documents\GitHub\node-ld\datalist_of_vehicles.json.txt', 'utf8'));
            
            var vehicle_page38 = '00010000';
            
            console.log("");
            console.log("");
            
            if (cvid == "C") {
                console.log("... [Page  36] [Page  37] ... [Page  43]");
                console.log("... [    0x24] [    0x25] ... [    0x2B]");
                
                for (character in characters) {
                    var characterCode = pad(16, cc.encrypt(uid, characters[character].id).toString("hex"), '0');
                    
                    console.log(
                        "... [" + characterCode.substring(0, 8).toUpperCase()  + "] [" + characterCode.substring(8, 16).toUpperCase()  + "] ... [" + pwd.toUpperCase() + "] " + characters[character].name);
                }
            }
            else if (cvid == "V") {
                console.log("... [Page  36] [Page  38] ... [Page  43]");
                console.log("... [    0x24] [    0x26] ... [    0x2B]");
                
                for (vehicle in vehicles) {
                    var vehicleCode = vehicles[vehicle].line36.toString("hex");
                    
                    console.log(
                        "... [" + vehicleCode  + "] [" + vehicle_page38 + "] ... [" + pwd.toUpperCase() + "] " + vehicles[vehicle].name);
                }
            }
            else {
                var characterCode = pad(16, cc.encrypt(uid, cvid).toString("hex"), '0');
                
                if (cvid.length == 4) {
                    console.log("... [Page  36] [Page  38] ... [Page  43]");
                    console.log("... [    0x24] [    0x26] ... [    0x2B]");
                    
                    for (vehicle in vehicles) {
                        var vehicleId = vehicles[vehicle].id;
                        var vehicleCode = vehicles[vehicle].line36.toString("hex");
                        
                        if (vehicleId == cvid) {
                            console.log(
                                "... [" + vehicleCode  + "] [" + vehicle_page38 + "] ... [" + pwd.toUpperCase() + "] " + vehicles[vehicle].name);
                        }
                    }
                }
                else {
                    console.log("... [Page  36] [Page  37] ... [Page  43]");
                    console.log("... [    0x24] [    0x25] ... [    0x2B]");
                    
                    console.log(
                        "... [" + characterCode.substring(0, 8).toUpperCase()  + "] [" + characterCode.substring(8, 16).toUpperCase()  + "] ... [" + pwd.toUpperCase() + "] ");
                }
            }
            
            console.log("");
            console.log("");
        }
        
        rl.close();
    });
});