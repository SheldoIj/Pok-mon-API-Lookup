/*
 * FINAL EXAM ASSIGNMENT
 * Author: Isaac Sheldon
 * Date: 12/5/22
 * Description: A program that requests and organizes JSON data to an html file for easy access and readability 
 * JSON data includes Pokemon name requested, Pokemon ID, Pokemon Type(s), Entire Pokemon move list, and all Pokemon games it can be encountered in.
 * 
 */

function getInfo(name) {
    let pokeName = document.getElementById("name").value.toLowerCase(); // API always accepts only lower case.
    let pokeId = document.getElementById("pokeID").value;
    let pokeType = document.getElementById("pokeType").value;
    var client = new XMLHttpRequest();

    // Data validation
    client.onerror = validate();
    function validate() {
        console.log("Validating:")
        pokeID.value = "Invalid Name/ID Entered";
        document.getElementById("pokeType").value = "Invalid Name/ID Entered";
    }

    document.getElementById("otherDiv").style.display = "inline";

    // Define and call the web api.
    client.open("GET", "https://pokeapi.co/api/v2/pokemon/" + pokeName, true);

    // Call API via Ajax "onreadystatechange"
    client.onreadystatechange = function () {
        if (client.readyState == 4) {
            const obj = JSON.parse(client.responseText);

            //Hides Tables
            document.getElementById("tblMoves").style.display = "none";
            document.getElementById("tblGames").style.display = "none";

            //Console Info
            console.log("CLIENT RESPONSE: " + client.responseText);
            console.log(Object.getOwnPropertyNames(obj));
            console.log("Pokemon Name: " + obj.name);
            console.log("Pokemon ID: " + obj.id);
            console.log("Pokemon Type: " + obj.types[0]["type"]["name"]);

            let pokeName1 = obj.name;
            let pokeName2 = pokeName1.charAt(0).toUpperCase() + pokeName1.slice(1);
            document.getElementById("name").value = pokeName2;

            //Displays selected pokemon's type
            if ('1' in obj.types) {
                document.getElementById("pokeType").value = (obj.types[0]["type"]["name"]) + "," + (obj.types[1]["type"]["name"]);
            }
            else {
                document.getElementById("pokeType").value = obj.types[0]["type"]["name"];
            }

            //Pokemon Moves Reset
            const tblMoves = document.getElementById("tblMoves");
            tblMoves.innerHTML = "<table id='tblMoves'><thead><tr><td>Name</td><td>Level</td></tr></thead></table>"

            //Pokemon Games Reset
            const tblGames = document.getElementById("tblGames");
            tblGames.innerHTML = "<table id='tblGames'><thead><tr><td>Name</td><td>Game #</td></tr></thead></table>"

            //Pokemon Move Set
            let i = 0;
            while (i in obj.moves) {
                console.log("Parsing Moves List...");

                // Output to a table...
                const tr = document.createElement("tr");
                const link = document.createElement("a");
                const col1 = document.createElement("td");
                const col2 = document.createElement("td");

                link.href = "https://pokeapi.co/api/v2/move/" + obj.moves[i]["move"]["name"];
                link.appendChild(document.createTextNode(obj.moves[i]["move"]["name"]));
                col1.appendChild(link);
                col2.appendChild(document.createTextNode(obj.moves[i]["version_group_details"][0]["level_learned_at"]));
                tr.appendChild(col1);
                tr.appendChild(col2);
                tblMoves.appendChild(tr);
                i++;
            }

            //Pokemon Game List
            i = 0;
            while (i in obj.game_indices) {
                console.log("Parsing Games List...");

                // Output to a table...
                const tr = document.createElement("tr");
                const link = document.createElement("a");
                const col1 = document.createElement("td");
                const col2 = document.createElement("td");
                let gameNumber = removeEndSlash(obj.game_indices[i]["version"]["url"]).slice(-2);
                gameNumber = removeStartingSlash(gameNumber);
                
                link.href = "https://pokeapi.co/api/v2/version/" + obj.game_indices[i]["version"]["name"];
                link.appendChild(document.createTextNode(obj.game_indices[i]["version"]["name"]));
                col1.appendChild(link);
                col2.appendChild(document.createTextNode(gameNumber));
                tr.appendChild(col1);
                tr.appendChild(col2);
                tblGames.appendChild(tr);
                i++;
            }
            //Removes slashes from game number
            function removeEndSlash(str) {
                if (str.endsWith('/')) {
                    return str.slice(1,-1);
                }
                return str;
            }
            function removeStartingSlash(str) {
                if (str.startsWith('/')) {
                    str = str.slice(1)
                }
                return str;
            }

            //Sets ID of pokemon and Img
            document.getElementById("pokeID").value = obj.id;
            document.getElementById("pokeImg").src = "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/" + obj.id + ".png";

            //Sets Selectors to Default
            document.getElementById("gameBtn").checked = false;
            document.getElementById("moveBtn").checked = false;
            document.getElementById("moveBtn").style.display = "inline";
            document.getElementById("gameBtn").style.display = "inline";

        };
    };
    client.send();
}

function displayData(value) {
    console.log("Entered displayData()...");
    console.log("Value = " + value);

    if (value == 'games') {
        document.getElementById("gameBtn").checked = true;
        document.getElementById("moveBtn").checked = false;
        document.getElementById("tblGames").style.display = "inline";
        document.getElementById("tblMoves").style.display = "none";
    }
    else //moves
    {
        document.getElementById("moveBtn").checked = true;
        document.getElementById("gameBtn").checked = false;
        document.getElementById("tblMoves").style.display = "inline";
        document.getElementById("tblGames").style.display = "none";
    }

};