function showPopup(message, type) {
    const popup = document.createElement("div");
    popup.className = `popup ${type}`;
    popup.innerText = message;

    document.body.appendChild(popup);

    setTimeout(() => {
        popup.remove();
    }, 4000);
}
const contractAddress = "0xd9145CCE52D386f254917e481eB44e9943F39138";
async function loadABI() {
    const response = await fetch('/build/contracts/LandRegistry.json');
    const data = await response.json();
    return data.abi; // Return only the ABI part
}
const contractABI =  await loadABI();
let web3;
let contract;

async function init() {
    if (typeof window.ethereum !== "undefined") {
        try {
            web3 = new Web3(window.ethereum);
            await window.ethereum.request({ method: "eth_requestAccounts" });

            contract = new web3.eth.Contract(contractABI, contractAddress);
            console.log("Contract Initialized:", contract);
        } catch (error) {
            console.error("Error connecting to MetaMask:", error);
            alert("Error connecting to MetaMask. Please try again.");
        }
    } else {
        alert("MetaMask not detected. Please install MetaMask.");
    }
}


async function registerLand() {
    const location = document.getElementById('landLocation').value;
    const acreage = document.getElementById('landAcreage').value;
    const price = document.getElementById('landPrice').value;
    
    try {
        const accounts = await web3.eth.getAccounts();
        await contract.methods.registerLand(location, acreage, price)
            .send({ from: accounts[0] });

        showPopup("Land registered successfully!", "success");

    } catch (error) {
        showPopup("Error registering land: " + error.message, "error");

    }
}

window.onload = init;
