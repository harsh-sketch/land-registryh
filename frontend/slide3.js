const contractAddress = "0xd9145CCE52D386f254917e481eB44e9943F39138";
async function loadABI() {
    const response = await fetch('/build/contracts/LandRegistry.json');
    const data = await response.json();
    return data.abi; // Return only the ABI part
}
const contractABI =  await loadABI();
let web3;
let contract;

function showPopup(message, type) {
    const popup = document.createElement("div");
    popup.className = `popup ${type}`;
    popup.innerText = message;

    document.body.appendChild(popup);

    setTimeout(() => {
        popup.remove();
    }, 4000);
}

async function transferOwnership() {
    const landId = document.getElementById('transferLandId').value;
    const newOwner = document.getElementById('newOwnerAddress').value;
    const paymentAmount = document.getElementById('paymentAmount').value;

    try {
        const accounts = await web3.eth.getAccounts();
        await contract.methods.transferOwnership(landId, newOwner)
            .send({ from: accounts[0], value: web3.utils.toWei(paymentAmount, "ether") });

        alert("Ownership Transferred!");
    } catch (error) {
        alert("Error: " + error.message);
    }
}
