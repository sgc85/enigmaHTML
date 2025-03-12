//functions
function togglePlugboard() {
    let plugboard = document.getElementById("plugboard");

    // Check computed style in case display is not set inline
    if (window.getComputedStyle(plugboard).display === "none") {
        plugboard.style.display = "flex";
    } else {
        plugboard.style.display = "none";
    }
}


function handlePlugboardClick(event) {
    //get the key that has been pressed
    const key = event.target.innerHTML.toUpperCase()

    //remove connections if they already exist on the button clicked
    if (plugboardConnections[key]) { //values are default to null which will be false here
        //take away from the connection count
        connectionCount--;
        //set the value the clicked button is connected to back to null
        plugboardConnections[key] = null
        //get the corresponding label - set the inner html back to a -
        document.getElementById(`cl-${key}`).innerHTML = "-"
        //remove the clicke button from the opposite connection
        //gets all the keys from the connections e.g. a,b,c etc as a list and goes through each in turn
        Object.keys(plugboardConnections).forEach(
            //k is each of the keys we have found
            k => {
                //checks to see if the value stored in each location in the connections object is equal to the key initialy clicked
                if (plugboardConnections[k] === key) {
                    //if it is then set its label back to -
                    document.getElementById(`cl-${k}`).innerHTML = "-"
                    //reset the value to null too
                    plugboardConnections[k] = null
                }
            }
        )
        //set connecting and from to false it connecting from the button clicked again straight away
        connecting = false;
        from = null;
        //if the button clicked isn't already connected
        //check if we are already in the connecting process - i.e. a button has already been clicke
    } else if (!connecting) {
        //if not then start the connecting process and store the key that has been clicked
        connecting = true;
        from = key;
    } else {
        if (from !== key && connectionCount < 10) {
            //make connection
            connecting = false;
            plugboardConnections[from] = key
            plugboardConnections[key] = from
            document.getElementById(`cl-${key}`).innerHTML = from
            document.getElementById(`cl-${from}`).innerHTML = key
            from = null
            connectionCount++
        }
    }
    console.log(plugboardConnections)
}

function handleKeyboardClick(event) {
    //turn off currently active light
    var activeLight = document.querySelector(".on")
    if (activeLight) {
        activeLight.classList.remove("on")
    }


    var key = event.target.innerHTML
    if (plugboardConnections[key]) {
        key = plugboardConnections[key]
    }

    activeLight = document.getElementById("light-" + key)
    activeLight.classList.add("on")

}


function buildLightboard() {
    const lightboard = document.getElementById("lightboard")
    for (let row of keyboardLayout) {
        let newRow = document.createElement("div")
        newRow.classList.add("panel-row")
        for (let key of row) {
            let newLight = document.createElement("div")
            newLight.classList.add("light")
            newLight.innerHTML = key
            newLight.id = "light-" + key
            newRow.appendChild(newLight)
        }
        lightboard.appendChild(newRow)
    }
}

function buildKeyboard() {
    const keyboard = document.getElementById("keyboard")
    for (let row of keyboardLayout) {
        let newRow = document.createElement("div")
        newRow.classList.add("panel-row")
        for (let key of row) {
            let newLight = document.createElement("div")
            newLight.classList.add("key")
            newLight.innerHTML = key
            newLight.id = "key-" + key
            newLight.onclick = (event) => handleKeyboardClick(event)
            newRow.appendChild(newLight)
        }
        keyboard.appendChild(newRow)
    }
}

function toggleRotors() {
    const rotorControls = document.querySelectorAll(".rotor-controls");
    rotorControls.forEach(rotorControl => {
        // Check computed style in case visibility is not set inline
        if (window.getComputedStyle(rotorControl).visibility === "hidden") {
            rotorControl.style.visibility = "visible";
        } else {
            rotorControl.style.visibility = "hidden";
        }
    });
}




function buildRotors() {
    const rotorsContainer = document.getElementById("rotors");
    
    
    for (let i = 0; i < 3; i++) {
        const rotor = document.createElement("div");
        rotor.className = "rotor";
        
        const rotorDisplay1 = document.createElement("div");
        rotorDisplay1.className = "rotor-display";
        
        const upButton1 = document.createElement("div");
        upButton1.className = "rotor-btn";
        upButton1.textContent = "▲";
        
        const rotorText1 = document.createTextNode("A");
        
        const downButton1 = document.createElement("div");
        downButton1.className = "rotor-btn";
        downButton1.textContent = "▼";
        
        rotorDisplay1.appendChild(upButton1);
        rotorDisplay1.appendChild(rotorText1);
        rotorDisplay1.appendChild(downButton1);
        
        const rotorControls = document.createElement("div");
        rotorControls.className = "rotor-controls";
        
        const labelDiv = document.createElement("div");
        labelDiv.textContent = "Rotor:";
        
        const rotorDisplay2 = document.createElement("div");
        rotorDisplay2.className = "rotor-display";
        
        const upButton2 = document.createElement("div");
        upButton2.className = "rotor-btn";
        upButton2.textContent = "▲";
        upButton2.onclick = () => nextRotor(i)
        

        const defaultRotorName = rotorLookup[i]
        const rotorText2 = document.createTextNode(defaultRotorName);
        rotorText2.id = "rotor-name-" + i
        
        const downButton2 = document.createElement("div");
        downButton2.className = "rotor-btn";
        downButton2.textContent = "▼";
        downButton2.onclick = () => prevRotor(i)
        
        rotorDisplay2.appendChild(upButton2);
        rotorDisplay2.appendChild(rotorText2);
        rotorDisplay2.appendChild(downButton2);
        
        rotorControls.appendChild(labelDiv);
        rotorControls.appendChild(rotorDisplay2);
        
        rotor.appendChild(rotorDisplay1);
        rotor.appendChild(rotorControls);
        
        rotorsContainer.appendChild(rotor);
    }
}

function buildPlugboard() {
    const plugboard = document.getElementById("plugboard")
    for (let row of keyboardLayout) {
        let newRow = document.createElement("div")
        newRow.classList.add("panel-row")
        for (let key of row) {
            let newKey = document.createElement("div")
            newKey.class = "plug"
            let plugButton = document.createElement("button")
            plugButton.classList.add("plug-btn")
            plugButton.onclick = (event) => handlePlugboardClick(event)
            plugButton.innerHTML = key
            let connectionLabel = document.createElement("p")
            connectionLabel.classList.add("connection-label")
            connectionLabel.id = "cl-" + key
            connectionLabel.innerHTML = "-"

            newKey.appendChild(plugButton)
            newKey.appendChild(connectionLabel)
            newRow.appendChild(newKey)
        }
        plugboard.appendChild(newRow)
    }
}


function nextRotor(rotorNumber){
    selectedRotorPositions[rotorNumber]++
    console.log("rotor-name-" + rotorNumber)
    const rotor = document.getElementById("rotor-name-" + rotorNumber )
    console.log(rotor)
    const newRotorName = rotorLookup[selectedRotorPositions[rotorNumber]]
    rotor.nodeValue = newRotorName
}

function prevRotor(rotorNumber){
    selectedRotorPositions[rotorNumber]++
}

//program code
const keyboardLayout = [
    ["Q", "W", "E", "R", "T", "Z", "U", "I", "O"],
    ["A", "S", "D", "F", "G", "H", "J", "K"],
    ["P", "Y", "X", "C", "V", "B", "N", "M", "L"]
]


const plugboardConnections = {
    A: null,
    B: null,
    C: null,
    D: null,
    E: null,
    F: null,
    G: null,
    H: null,
    I: null,
    J: null,
    K: null,
    L: null,
    M: null,
    N: null,
    O: null,
    P: null,
    Q: null,
    R: null,
    S: null,
    T: null,
    U: null,
    V: null,
    W: null,
    X: null,
    Y: null,
    Z: null,
}


let connecting = false
let connectionCount = 0
let from = null

const allRotors = {
    I: {},
    II: {},
    III: {},
    IV: {},
    V: {}
}


//stores which rotor has been picked for each rotor - NOT the position of the rotor
const selectedRotorPositions = [0,0,0]

const rotorLookup = {
    0:"I",
    1:"II",
    2:"III",
    3:"IV",
    4:"V"
}

const selectedRotors = {

}

buildPlugboard()
buildLightboard()
buildKeyboard()
buildRotors()