import React, { useEffect, useState } from 'react';
import './styles/App.css';
import twitterLogo from './assets/twitter-logo.svg';

// Constants
const TWITTER_HANDLE = 'johnguestdev';
const TWITTER_LINK = `https://twitter.com/${TWITTER_HANDLE}`;
const tld = '.emoji'
const CONTRACT_ADDRESS = 'YOUR_CONTRACT_ADDRESS_HERE';

const App = () => {
	const [currentAccount, setCurrentAccount] = useState('');
	const [domain, setDomain] = useState('');
  	const [record, setRecord] = useState('');

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
	};


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

	const renderInputForm = () =>{
		return (
			<div className="form-container">
				<div className="first-row">
					<input
						type="text"
						value={domain}
						placeholder='domain'
						onChange={e => setDomain(e.target.value)}
					/>
					<p className='tld'> {tld} </p>
				</div>

				<input
					type="text"
					value={record}
					placeholder='whats ur ninja power'
					onChange={e => setRecord(e.target.value)}
				/>

				<div className="button-container">
					<button className='cta-button mint-button' disabled={null} onClick={null}>
						Mint
					</button>  
					<button className='cta-button mint-button' disabled={null} onClick={null}>
						Set data
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
						{/* <p className="subtitle">Your immortal API on the blockchain!</p> */}
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
