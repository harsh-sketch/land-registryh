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
            const accounts = await web3.eth.getAccounts();
            console.log("Connected Account:", accounts[0]);

            contract = new web3.eth.Contract(contractABI, contractAddress);
            console.log("Contract Initialized:", contract);
        } catch (error) {
            console.error("Error connecting to MetaMask:", error);
            alert("Error connecting to MetaMask. Please try again.");
        }
    } else {
        alert("MetaMask not found! Please install it.");
    }
}



async function registerLand() {
    try {
        const location = document.getElementById('landLocation').value;
        const acreage = document.getElementById('landAcreage').value;
        const price = document.getElementById('landPrice').value;

        const accounts = await web3.eth.getAccounts();
        const sender = accounts[0];

        await contract.methods.registerLand(location, acreage, price).send({ from: sender });

        showPopup("Land Registered Successfully!", "success");
    } catch (error) {
        showPopup("Error Registering Land: " + error.message, "error");
    }
}

async function getLandOwner() {
    const landId = document.getElementById('checkLandId').value;

    if (!contract) {
        alert("Contract is not initialized. Please connect MetaMask.");
        return;
    }

    try {
        const landDetails = await contract.methods.getLand(landId).call();
        document.getElementById('ownerAddress').innerText = `Owner Address: ${landDetails[3]}`;
    } catch (error) {
        console.error("Error fetching land owner:", error);
        alert("Error fetching land owner. Please check console for details.");
    }
}

async function transferOwnership() {
    try {
        const landId = document.getElementById('transferLandId').value;
        const newOwner = document.getElementById('newOwnerAddress').value;
        const sellerName = document.getElementById('sellerName').value;
        const buyerName = document.getElementById('buyerName').value;
        const paymentAmount = document.getElementById('paymentAmount').value;

        const accounts = await web3.eth.getAccounts();
        const sender = accounts[0];

        await contract.methods.transferOwnership(landId, newOwner, sellerName, buyerName)
            .send({ from: sender, value: web3.utils.toWei(paymentAmount, "ether") });

        showPopup(`Ownership Transferred! Land ID: ${landId}`, "success");
    } catch (error) {
        showPopup("Error Transferring Ownership: " + error.message, "error");
    }
}

// ✅ Pop-up Function
function showPopup(message, type) {
    const popup = document.createElement("div");
    popup.className = `popup ${type}`;
    popup.innerText = message;

    document.body.appendChild(popup);
    setTimeout(() => {
        popup.remove();
    }, 4000);
}

window.onload = init;
