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
    const key = event.target.innerHTML
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
}

function stepRotors() {
    // Always step the fast rotor
    currentRotorPositions[2] = (currentRotorPositions[2] + 1) % 26;
    document.getElementById("rotor-text-2").textContent = alphabet[currentRotorPositions[2]];

    // If middle rotor is at notch before moving, slow rotor should step
    let middleAtNotch = currentRotorPositions[1] === rotorList[1].notch;

    // Check double-stepping condition
    if (middleAtNotch || currentRotorPositions[2] === rotorList[2].notch) {
        currentRotorPositions[1] = (currentRotorPositions[1] + 1) % 26;
        document.getElementById("rotor-text-1").textContent = alphabet[currentRotorPositions[1]];
    }

    // If middle rotor was at notch, slow rotor steps
    if (middleAtNotch) {
        currentRotorPositions[0] = (currentRotorPositions[0] + 1) % 26;
        document.getElementById("rotor-text-0").textContent = alphabet[currentRotorPositions[0]];
    }
}

function usePlugboard(letter) {
    return plugboardConnections[letter] || letter;
}



asdadawd

function useRotor(rotorNumber, letter, reverse = false) {
    let rotorWiring = rotorList[rotorNumber].connections;
    let rotorOffset = currentRotorPositions[rotorNumber];
    let letterIndex = alphabet.indexOf(letter);

    if (reverse) {
        // Find the letter in the rotor's output mapping
        let adjustedIndex = (letterIndex - rotorOffset + 26) % 26;
        letter = alphabet[rotorWiring.indexOf(alphabet[adjustedIndex])];
        console.log("way back", rotorNumber,rotorOffset , rotorWiring, letter)
    } else {
        // Move forward through the rotor
        let adjustedIndex = (letterIndex + rotorOffset) % 26;
        letter = rotorWiring[adjustedIndex];
        console.log("way through", rotorNumber,rotorOffset, rotorWiring, letter)
    }
    return letter;
}

function useReflector(reflectorNumber, letter) {
    let reflectorWiring = reflectorList[reflectorNumber].connections;
    let letterIndex = alphabet.indexOf(letter);
    return reflectorWiring[letterIndex];
}

function handleKeyboardClick(event) {
    //TURN OFF ACTIVE LIGHT
    var activeLight = document.querySelector(".on")

    if (activeLight) {
        activeLight.classList.remove("on")
    }

    //STEP ROTORS
    stepRotors()
    //GET KEY PRESSED
    var letter = event.target.innerHTML
    //SEND THROUGH PLUGBOARD
    letter = usePlugboard(letter)
    //SEND THROUGH ROTORS
    for (let r = 2; r >= 0; r--) {
        letter = useRotor(r, letter)
    }
    //SEND THROUGH REFLECTOR
    letter = useReflector(0, letter)
    //SEND BACK THROUGH ROTORS
    for (let r = 0; r < 3; r++) {
        letter = useRotor(r, letter, true)
    }
    //SEND THROUGH PLUGBOARD
    letter = usePlugboard(letter)

    //SEND TO LIGHTBOARD
    activeLight = document.getElementById("light-" + letter)
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

function nextReflector() {

}

function prevReflector() {

}

function buildRotors() {
    const rotors = document.getElementById("rotors");

    //build reflector
    const reflector = document.createElement("div")

    //looks the same as the display of current position so uses same class
    reflector.className = "rotor-controls";

    const nextReflectorButton = document.createElement("div");
    nextReflectorButton.className = "rotor-btn";
    nextReflectorButton.textContent = "▲";
    nextReflectorButton.onclick = () => nextReflector()

    const defaultReflectorName = reflectorList[0].name
    const selectedReflectorText = document.createElement("div");
    selectedReflectorText.classList.add("selectedRotorText")
    selectedReflectorText.id = "reflector-name"
    selectedReflectorText.textContent = defaultReflectorName

    const prevReflectorButton = document.createElement("div");
    prevReflectorButton.className = "rotor-btn";
    prevReflectorButton.textContent = "▼";
    prevReflectorButton.onclick = () => prevReflector()

    reflector.appendChild(nextReflectorButton);
    reflector.appendChild(selectedReflectorText);
    reflector.appendChild(prevReflectorButton);

    rotors.appendChild(reflector)

    for (let i = 0; i < 3; i++) {
        //create the rotor div into which all parts will be placed
        const rotor = document.createElement("div");
        rotor.className = "rotor";

        //rotor display will show the current state and buttons to shift this up and down
        const rotorPositionDisplay = document.createElement("div");
        rotorPositionDisplay.className = "rotor-display";

        const nextRotorPositionButton = document.createElement("div");
        nextRotorPositionButton.className = "rotor-btn";
        nextRotorPositionButton.textContent = "▲";

        const defaultRotorText = alphabet[currentRotorPositions[i]]
        const rotorText = document.createElement("div");
        rotorText.id = "rotor-text-" + i
        rotorText.textContent = defaultRotorText

        const prevRotorPositionButton = document.createElement("div");
        prevRotorPositionButton.className = "rotor-btn";
        prevRotorPositionButton.textContent = "▼";

        rotorPositionDisplay.appendChild(nextRotorPositionButton);
        rotorPositionDisplay.appendChild(rotorText);
        rotorPositionDisplay.appendChild(prevRotorPositionButton);

        //Controls are naturally hidden and toggled on and off by botton
        const rotorControls = document.createElement("div");
        rotorControls.className = "rotor-controls";

        //Label containing rotor:
        const labelDiv = document.createElement("div");
        labelDiv.textContent = "Rotor:";

        //div will contain the current rotor being used and buttons to change it
        const selectedRotorDisplay = document.createElement("div");
        //looks the same as the display of current position so uses same class
        selectedRotorDisplay.className = "rotor-display";

        const nextRotorButton = document.createElement("div");
        nextRotorButton.className = "rotor-btn";
        nextRotorButton.textContent = "▲";
        nextRotorButton.onclick = () => nextRotor(i)

        const defaultRotorName = rotorList[i].name
        const selectedRotorText = document.createElement("div");
        selectedRotorText.classList.add("selectedRotorText")
        selectedRotorText.id = "rotor-name-" + i
        selectedRotorText.textContent = defaultRotorName

        const prevRotorButton = document.createElement("div");
        prevRotorButton.className = "rotor-btn";
        prevRotorButton.textContent = "▼";
        prevRotorButton.onclick = () => prevRotor(i)

        selectedRotorDisplay.appendChild(nextRotorButton);
        selectedRotorDisplay.appendChild(selectedRotorText);
        selectedRotorDisplay.appendChild(prevRotorButton);

        rotorControls.appendChild(labelDiv);
        rotorControls.appendChild(selectedRotorDisplay);

        rotor.appendChild(rotorPositionDisplay);
        rotor.appendChild(rotorControls);
        rotors.appendChild(rotor);
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

function moveRotorUp(rotorNumber){
    currentRotorPositions[rotorNumber]++;

}

function nextRotor(rotorNumber) {
    //checks to ensure it doesn't go into rotors that don't exist.
    if (selectedRotorPositions[rotorNumber] < Object.keys(rotorList).length - 1) {
        //move the rotor number on by one
        let newRotorNumber = selectedRotorPositions[rotorNumber] + 1
        //finds the name of the new rotor
        const newRotorName = rotorList[newRotorNumber].name
        //updates the text on the rotor text
        document.getElementById("rotor-name-" + rotorNumber).textContent = newRotorName
        //update the selected rotor position to the new position
        selectedRotorPositions[rotorNumber] = newRotorNumber
        //update rotor text
        //reset position back to 0
        currentRotorPositions[rotorNumber] = 0
        //find and update the matching text for the rotor position
        document.getElementById("rotor-text-" + rotorNumber).textContent = rotorList[newRotorNumber].connections[0]

    }
}

//opposite of next rotor function
function prevRotor(rotorNumber) {
    if (selectedRotorPositions[rotorNumber] > 0) {
        //move the rotor number on by one
        let newRotorNumber = selectedRotorPositions[rotorNumber] - 1
        //finds the name of the new rotor
        const newRotorName = rotorList[newRotorNumber].name
        //updates the text on the rotor text
        document.getElementById("rotor-name-" + rotorNumber).textContent = newRotorName
        //update the selected rotor position to the new position
        selectedRotorPositions[rotorNumber] = newRotorNumber
        //update rotor text
        //reset position back to 0
        currentRotorPositions[rotorNumber] = 0
        //find and update the matching text for the rotor position
        document.getElementById("rotor-text-" + rotorNumber).textContent = rotorList[newRotorNumber].connections[0]

    }
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

//all to do with plugboard
let connectionCount = 0
let connecting = false
let from = null

//stores which rotor has been picked for each rotor - NOT the position of the rotor
const selectedRotorPositions = [0, 1, 2]
//stores position of current rotors - to be ticked round
const currentRotorPositions = [0, 0, 0]


const alphabet = "ABCDEFGHIJKLMNOPQRSTUVWXYZ"

const rotorList = {
    0: { name: "I", connections: "JGDQOXUSCAMIFRVTPNEWKBLZYH", notch: alphabet.indexOf("Q") + 1 },
    1: { name: "II", connections: "NTZPSFBOKMWRCJDIVLAEYUXHGQ", notch: alphabet.indexOf("E") + 1},
    2: { name: "III", connections: "JVIUBHTCDYAKEQZPOSGXNRMWFL", notch: alphabet.indexOf("V") + 1 },
    3: { name: "IV", connections: "QYHOGNECVPUZTFDJAXWMKISRBL", notch: alphabet.indexOf("J") + 1},
    4: { name: "V", connections: "QWERTZUIOASDFGHJKPYXCVBNML", notch: (alphabet.indexOf("Z") + 1) % 26 }
}

const reflectorList = {
    0: { name: "A", connections: "EJMZALYXVBWFCRQUONTSPIKHGD" },
    1: { name: "B", connections: "YRUHQSLDPXNGOKMIEBFZCWVJAT" },
    2: { name: "C", connections: "FVPJIAOYEDRZXWGCTKUQSBNMHL" }
}

buildPlugboard()
buildLightboard()
buildKeyboard()
buildRotors()