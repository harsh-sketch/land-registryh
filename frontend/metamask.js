async function loadMetaMaskAccount() {
    if (typeof window.ethereum !== "undefined") {
        try {
            const web3 = new Web3(window.ethereum);
            await window.ethereum.request({ method: "eth_requestAccounts" });
            const accounts = await web3.eth.getAccounts();
            
            if (accounts.length > 0) {
                const account = accounts[0];
                document.getElementById("accountNumber").innerText = `Address: ${account}`;
                
                // Simulating a profile picture and name (MetaMask doesn't provide this directly)
                document.getElementById("accountName").innerText = "Holder: MetaMask User";
                document.getElementById("profilePic").src = `https://avatars.dicebear.com/api/identicon/${account}.svg`;
            }
        } catch (error) {
            console.error("Error fetching MetaMask account:", error);
        }
    } else {
        alert("MetaMask not found! Please install it.");
    }
}

// Load account details when the page loads
window.onload = loadMetaMaskAccount;
