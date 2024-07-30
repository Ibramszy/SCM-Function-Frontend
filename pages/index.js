import { useState, useEffect } from "react";
import { ethers } from "ethers";
import atm_abi from "../artifacts/contracts/Assessment.sol/Assessment.json";

export default function HomePage() {
  const [ethWallet, setEthWallet] = useState(undefined);
  const [account, setAccount] = useState(undefined);
  const [atm, setATM] = useState(undefined);
  const [balance, setBalance] = useState(undefined);
  const [owner, setOwner] = useState(undefined);
  const [newOwner, setNewOwner] = useState("");
  const [newBalance, setNewBalance] = useState("");

  const contractAddress = "0xCf7Ed3AccA5a467e9e704C703E8D87F634fB0Fc9";
  const atmABI = atm_abi.abi;

  const getWallet = async () => {
    if (window.ethereum) {
      setEthWallet(window.ethereum);
    }

    if (ethWallet) {
      const accounts = await ethWallet.request({ method: "eth_accounts" });
      handleAccount(accounts);
    }
  };

  const handleAccount = (accounts) => {
    if (accounts.length > 0) {
      console.log("Account connected: ", accounts[0]);
      setAccount(accounts[0]);
    } else {
      console.log("No account found");
    }
  };

  const connectAccount = async () => {
    if (!ethWallet) {
      alert("MetaMask wallet is required to connect");
      return;
    }

    const accounts = await ethWallet.request({ method: "eth_requestAccounts" });
    handleAccount(accounts);

    // once wallet is set we can get a reference to our deployed contract
    getATMContract();
  };

  const getATMContract = () => {
    const provider = new ethers.providers.Web3Provider(ethWallet);
    const signer = provider.getSigner();
    const atmContract = new ethers.Contract(contractAddress, atmABI, signer);

    setATM(atmContract);
  };

  const getBalance = async () => {
    if (atm) {
      setBalance(Number(await atm.balance()).toFixed());
    }
  };

  const deposit = async () => {
    if (atm) {
      let tx = await atm.deposit(1); // Deposit 1 unit
      await tx.wait();
      getBalance();
    }
  };

  const withdraw = async () => {
    if (atm) {
      let tx = await atm.withdraw(1); // Withdraw 1 unit
      await tx.wait();
      getBalance();
    }
  };

  const transferOwnership = async () => {
    if (atm && newOwner) {
      let tx = await atm.transferOwnership(newOwner);
      await tx.wait();
      getOwner(); // Refresh the owner info
    }
  };

  const getOwner = async () => {
    if (atm) {
      setOwner(await atm.owner());
      getBalance(); // Refresh balance info
    }
  };

  const updateBalance = async () => {
    if (atm && newBalance) {
      let tx = await atm.updateBalance(newBalance);
      await tx.wait();
      getBalance();
    }
  };

  const initUser = () => {
    if (!ethWallet) {
      return (
        <p className="warning">Please install MetaMask to use this ATM.</p>
      );
    }

    if (!account) {
      return (
        <button className="btn-primary" onClick={connectAccount}>
          Connect MetaMask
        </button>
      );
    }

    if (balance === undefined) {
      getBalance();
    }

    return (
      <div className="content">
        <p className="info">Your Account: {account}</p>
        <p className="info">Your Balance: {balance} ETH</p>
        <div className="actions">
          <button className="btn-primary" onClick={deposit}>
            Deposit 1 ETH
          </button>
          <button className="btn-primary" onClick={withdraw}>
            Withdraw 1 ETH
          </button>
          <div className="form-group">
            <input
              type="text"
              value={newOwner}
              onChange={(e) => setNewOwner(e.target.value)}
              placeholder="New Owner Address"
              className="input-field"
            />
            <button className="btn-secondary" onClick={transferOwnership}>
              Transfer Ownership
            </button>
          </div>
          <div className="form-group">
            <input
              type="text"
              value={newBalance}
              onChange={(e) => setNewBalance(e.target.value)}
              placeholder="New Balance (Units)"
              className="input-field"
            />
            <button className="btn-secondary" onClick={updateBalance}>
              Update Balance
            </button>
          </div>
          <div className="form-group">
            <button className="btn-secondary" onClick={getOwner}>
              Get Owner
            </button>
            {owner && <p className="info">Current Owner: {owner}</p>}
          </div>
        </div>

        <style jsx>{`
          .title {
            color: #343a40;
            margin-bottom: 30px;
            font-size: 2.5rem;
          }
          .content {
            background: #ffffff;
            border-radius: 12px;
            padding: 20px;
            box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
          }
          .info {
            color: #495057;
            font-size: 18px;
            margin: 10px 0;
          }
          .warning {
            color: #dc3545;
            font-size: 18px;
            margin: 20px 0;
          }
          .btn-primary,
          .btn-secondary {
            padding: 14px 24px;
            border-radius: 8px;
            border: none;
            color: #fff;
            cursor: pointer;
            font-size: 18px;
            font-weight: bold;
            transition: all 0.3s ease;
            margin: 10px;
          }
          .btn-primary {
            background: linear-gradient(90deg, #0070f3, #005bb5);
          }
          .btn-primary:hover {
            background: linear-gradient(90deg, #005bb5, #003d80);
            transform: translateY(-2px);
          }
          .btn-secondary {
            background: linear-gradient(90deg, #28a745, #218838);
          }
          .btn-secondary:hover {
            background: linear-gradient(90deg, #218838, #1e7e34);
            transform: translateY(-2px);
          }
          .input-field {
            padding: 12px;
            border-radius: 8px;
            border: 1px solid #ced4da;
            font-size: 16px;
            width: 100%;
            box-sizing: border-box;
            margin: 8px 0;
            transition: border-color 0.3s ease, box-shadow 0.3s ease;
          }
          .input-field:focus {
            border-color: #0070f3;
            box-shadow: 0 0 0 3px rgba(0, 112, 243, 0.2);
            outline: none;
          }
          .form-group {
            margin-top: 20px;
          }
        `}</style>
      </div>
    );
  };

  useEffect(() => {
    getWallet();
  }, []);

  return (
    <main className="container">
      <header>
        <h1 className="title">Welcome to the Metacrafters ATM!</h1>
      </header>
      {initUser()}
      <style jsx>{`
        .container {
          text-align: center;
          font-family: Arial, sans-serif;
          padding: 30px;
          max-width: 800px;
          margin: 0 auto;
          background: #f8f9fa;
          border-radius: 15px;
          box-shadow: 0 6px 12px rgba(0, 0, 0, 0.1);
        }
      `}</style>
    </main>
  );
}
