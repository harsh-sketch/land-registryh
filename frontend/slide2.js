const contractAddress = "0xd9145CCE52D386f254917e481eB44e9943F39138";

let web3;
let contract;

async function loadABI() {
    const response = await fetch('land-registry\build\contracts\LandRegistry.json');
    const data = await response.json();
    return data.abi;
}

async function initContract() {
    if (window.ethereum) {
        web3 = new Web3(window.ethereum);
        await window.ethereum.request({ method: "eth_requestAccounts" });
    } else {
        alert("Please install MetaMask!");
        return;
    }

    const contractABI = await loadABI();
    contract = new web3.eth.Contract(contractABI, contractAddress);
}

function showPopup(message, type) {
    const popup = document.createElement("div");
    popup.className = `popup ${type}`;
    popup.innerText = message;

    document.body.appendChild(popup);

    setTimeout(() => {
        popup.remove();
    }, 4000);
}

async function getLandOwner() {
    const landId = document.getElementById('checkLandId').value;

    if (!contract) {
        alert("Contract not initialized. Please refresh the page.");
        return;
    }

    try {
        const landDetails = await contract.methods.getLand(landId).call();
        document.getElementById('ownerAddress').innerText = `Owner: ${landDetails[3]}`;
    } catch (error) {
        alert("Error: " + error.message);
    }
}

// Initialize contract when the page loads
window.onload = initContract;
