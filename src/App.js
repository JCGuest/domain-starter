import React, { useEffect, useState } from 'react';
import { ethers } from 'ethers';
import './styles/App.css';
import twitterLogo from './assets/twitter-logo.svg';
import contractAbi from './utils/contractAbi.json';
import polygonLogo from './assets/polygonlogo.png';
import ethLogo from './assets/ethlogo.png';
import { networks } from './utils/networks';

// Constants
const TWITTER_HANDLE = 'johnguestdev';
const TWITTER_LINK = `https://twitter.com/${TWITTER_HANDLE}`;
const tld = '.emoji'
const CONTRACT_ADDRESS = '0x91b235B0da97b2215ADe051C4411BA5443ab1D1f';

const App = () => {
	const [currentAccount, setCurrentAccount] = useState('');
	const [domain, setDomain] = useState('');
  	const [record, setRecord] = useState('');
	const [network, setNetwork] = useState('');

	  const connectWallet = async () => {
		try {
		  const { ethereum } = window;
	
		  if (!ethereum) {
			alert("Get MetaMask -> https://metamask.io/");
			return;
		  }
				
		  const accounts = await ethereum.request({ method: "eth_requestAccounts" });
		  
		  console.log("Connected", accounts[0]);
		  setCurrentAccount(accounts[0]);
		} catch (error) {
		  console.log(error)
		}
	  }

	  const checkIfWalletIsConnected = async () => {
		const { ethereum } = window;

		if (!ethereum) {
			console.log('Make sure you have metamask!');
			return;
		} else {
			console.log('We have the ethereum object', ethereum);
		}
		
		const accounts = await ethereum.request({ method: 'eth_accounts' });

		if (accounts.length !== 0) {
			const account = accounts[0];
			console.log('Found an authorized account:', account);
			setCurrentAccount(account);
		} else {
			console.log('No authorized account found');
		}
		
		const chainId = await ethereum.request({ method: 'eth_chainId' });
		setNetwork(networks[chainId]);

		ethereum.on('chainChanged', handleChainChanged);
		
		function handleChainChanged(_chainId) {
			window.location.reload();
		}
	};

	const switchNetwork = async () => {
		if (window.ethereum) {
			try {
				await window.ethereum.request({
					method: 'wallet_switchEthereumChain',
					params: [{ chainId: '0x13881' }],
				});
			} catch (error) {
				if (error.code === 4902) {
					try {
						await window.ethereum.request({
							method: 'wallet_addEthereumChain',
							params: [
								{	
									chainId: '0x13881',
									chainName: 'Polygon Mumbai Testnet',
									rpcUrls: ['https://rpc-mumbai.maticvigil.com/'],
									nativeCurrency: {
											name: "Mumbai Matic",
											symbol: "MATIC",
											decimals: 18
									},
									blockExplorerUrls: ["https://mumbai.polygonscan.com/"]
								},
							],
						});
					} catch (error) {
						console.log(error);
					}
				}
				console.log(error);
			}
		} else {
			alert('MetaMask is not installed. Please install it to use this app: https://metamask.io/download.html');
		} 
	}

	const mintDomain = async () => {
		if (!domain) { return }
		if (domain.length < 3) {
			alert('Domain must be at least 3 characters long');
			return;
		}
		// Calculate price based on length of domain (change this to match your contract)	
		// 3 chars = 0.5 MATIC, 4 chars = 0.3 MATIC, 5 or more = 0.1 MATIC
		const price = domain.length === 3 ? '0.5' : domain.length === 4 ? '0.3' : '0.1';
		console.log("Minting domain", domain, "with price", price);
	  try {
		const { ethereum } = window;
		if (ethereum) {
		  const provider = new ethers.providers.Web3Provider(ethereum);
		  const signer = provider.getSigner();
		  const contract = new ethers.Contract(CONTRACT_ADDRESS, contractAbi.abi, signer);
	
				console.log("paying gas...")
		  let tx = await contract.register(domain, {value: ethers.utils.parseEther(price)});
				const receipt = await tx.wait();
	
				if (receipt.status === 1) {
					console.log("domain minted! https://mumbai.polygonscan.com/tx/"+tx.hash);
					
					tx = await contract.setRecord(domain, record);
					await tx.wait();
	
					console.log("record set! https://mumbai.polygonscan.com/tx/"+tx.hash);
					
					setRecord('');
					setDomain('');
				}
				else {
					alert("rransaction failed! please try again");
				}
		}
	  }
	  catch(error){
		console.log(error);
	  }
	}

	const renderNotConnectedContainer = () => (
		<div className="connect-wallet-container">
			<img src="https://media.giphy.com/media/hXcEHA7zYRr4dUNQP8/giphy.gif" alt="gif" />
			<button onClick={connectWallet} className="cta-button connect-wallet-button">
				connect wallet
			</button>
		</div>
	);

	useEffect(() => {
		checkIfWalletIsConnected();
	})

	const renderInputForm = () => {
		if (network !== 'Polygon Mumbai Testnet') {
			return (
				<div className="connect-wallet-container">
					<h2>Please switch to Polygon Mumbai Testnet</h2>
					<button className='cta-button mint-button' onClick={switchNetwork}>Click here to switch</button>
				</div>
			);
		}

		return (
			<div className="form-container">
				<div className="first-row">
					<input
						type="text"
						value={domain}
						placeholder="domain"
						onChange={e => setDomain(e.target.value)}
					/>
					<p className='tld'> {tld} </p>
				</div>
	
				<input
					type="text"
					value={record}
					placeholder='whats ur fave emoji?'
					onChange={e => setRecord(e.target.value)}
				/>
	
				<div className="button-container">
					<button className='cta-button mint-button' onClick={mintDomain}>
						mint
					</button> 
				</div>
	
			</div>
		);
	}

	return (
		<div className="App">
			<div className="container">

				<div className="header-container">
				<header>
					<div className="left">
							<p className="title">💣😜 emoji name service 🌼👋</p>
					</div>
					<div className="right">
							<img alt="Network logo" className="logo" src={ network.includes("Polygon") ? polygonLogo : ethLogo} />
								{ currentAccount ? 
								<p> Wallet: {currentAccount.slice(0, 6)}...{currentAccount.slice(-4)} </p> 
								: <p> Not connected </p> }
					</div>
				</header>
			</div>
				
				
				
				{!currentAccount && renderNotConnectedContainer()}
				{currentAccount && renderInputForm()}

		<div className="footer-container">
					<img alt="Twitter Logo" className="twitter-logo" src={twitterLogo} />
					<a
						className="footer-text"
						href={TWITTER_LINK}
						target="_blank"
						rel="noreferrer"
					>{`@${TWITTER_HANDLE}`}</a>
				</div>
			</div>
		</div>
		);
}

export default App;
