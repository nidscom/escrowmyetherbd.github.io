
import React, {Component} from 'react'
import getWeb3 from './utils/getWeb3'
import Web3 from 'web3'
import _ from 'lodash';
import variablestore from './variablestore'
import SpecificTx from './SpecificTx'
import {Link} from "react-router"

import RegisterBuyerRS from './RegisterBuyerRS'
import NewTransactionRS from './NewTransactionRS'

const actionGas = 100000
const num_per_page = 10
const dec = variablestore.dec_place
const full_dec = variablestore.full_dec
const blockies = require('ethereum-blockies-png')



class BuyerHome extends Component {
	
		constructor(props){
			super(props)
			// eslint-disable-next-line no-undef
			var ETH_CLIENT = new Web3(web3.currentProvider)
			var EscrowMyEtherEntityDB_ABI = variablestore.EscrowMyEtherEntityDB_ABI
			var EscrowMyEtherEntityDB_address = variablestore.EscrowMyEtherEntityDB_address
			var myetherescrowABI = variablestore.myetherescrowABI
			var myetherescrowAddress = variablestore.myetherescrowAddress

			this.state = {
				ETH_CLIENT: ETH_CLIENT,
				mee: ETH_CLIENT.eth.contract(myetherescrowABI).at(myetherescrowAddress),
				entitydb: ETH_CLIENT.eth.contract(EscrowMyEtherEntityDB_ABI).at(EscrowMyEtherEntityDB_address),
				accounts: ETH_CLIENT.eth.accounts,
				fromAddress: "",
				
				
				
				withdrawText: "Withdraw Funds",
				releaseText: "Release Funds",
				escrowHelptext: "Call Escrow Intervention",
				startID: null,
				statusText: "",
				num_transactions: 0,
				addressBalance: 0,
				addressBalanceFull: 0,
				balance: 0,
				balanceFull: 0,
				buyerName: "",
				buyerInfo: "",
				
				escrowName: "",
				escrowInfo: "",
				escrowFee: 0,
				sellerAddress: "",
				sellerName: "",
				sellerInfo: "",
				escrowAddress: "",
				
				tableRows: [],
				callback: "",
				popup: false,
				callInfo: [],
				temp: [],
				specificTx: [0,0,0,0,0,0,0],
				showSpecificTx: false,
				number: 0,
				addressBlockie: "",
				modifyProfile: false,
				newTx: false

			}



			this.handleFromAddressInput = this.handleFromAddressInput.bind(this);
			this.handleTableRowClick = this.handleTableRowClick.bind(this);
			this.handleWithdraw = this.handleWithdraw.bind(this);
			this.handleEscrowEscalation = this.handleEscrowEscalation.bind(this);
			this.handleTxInput = this.handleTxInput.bind(this);
			this.handleReleaseFunds = this.handleReleaseFunds.bind(this);
			this.handleGetTransaction = this.handleGetTransaction.bind(this);
			this.handleNextPage = this.handleNextPage.bind(this);
			this.handlePrevPage = this.handlePrevPage.bind(this);

		

			this.getAddressBalance = this.getAddressBalance.bind(this);
			this.getContractBalance = this.getContractBalance.bind(this);
			this.getBuyerFullInfo = this.getBuyerFullInfo.bind(this);
			this.getBuyerHistory = this.getBuyerHistory.bind(this);
			this.resetButtonText = this.resetButtonText.bind(this);
			this.loadInitialHistory = this.loadInitialHistory.bind(this);
			this.closePopup = this.closePopup.bind(this);

			this.getSellerNameArray = this.getSellerNameArray.bind(this);
			this.setSellerNameArray = this.setSellerNameArray.bind(this);

			
			this.clearState = this.clearState.bind(this);
			this.getSpecificTransaction = this.getSpecificTransaction.bind(this);
			this.ModifyProfile = this.ModifyProfile.bind(this);
			this.createTx = this.createTx.bind(this);
			this.backToDashboard = this.backToDashboard.bind(this);
			this.newTxCallback = this.newTxCallback.bind(this);
		}

		closePopup() {
			this.setState({				
				popup: false			
			});

		}

		clearState() {
			this.resetButtonText()
			this.setState({				
				popup: false,
				addressBalance: 0,
				addressBalanceFull: 0,
				balance: 0,
				balanceFull: 0,
				tableRows: [],
				buyerName: "",
				buyerInfo: "",
				fromAddress: "",
				addressBlockie: ""
				

			});

		}

		resetTxHistory()
		{
			this.setState({tableRows: []});
		}

		handleFromAddressInput(e) {
			//this.setState({tableRows: []});
			if (!this.state.ETH_CLIENT.isAddress(e.target.value))
				{
					this.clearState()
					return false
				}

			var blockieData = blockies.createDataURL({seed: e.target.value})
			this.setState({fromAddress: e.target.value,
				addressBlockie: blockieData});
			this.getAddressBalance(e.target.value)
			this.getContractBalance(e.target.value)
			this.getBuyerFullInfo(e.target.value)
			this.loadInitialHistory(e.target.value)	
			this.resetButtonText()	
		}

		handleNextPage(){
			
			if (this.state.num_transactions < num_per_page) return
			if (this.state.startID == 0) return
			var newStartID = this.state.startID - num_per_page
			if (newStartID < 0) newStartID = 0
			
			//this.setState({tableRows: []});
			this.getBuyerHistory(this.state.fromAddress, newStartID)
			this.setState({startID: newStartID})
		}

		handlePrevPage(){
			
			var newStartID = this.state.startID + num_per_page
			var maxID = this.state.num_transactions - num_per_page
			if (maxID === this.state.startID) return
			//this.setState({tableRows: []});
			if (newStartID > maxID) newStartID = maxID
			this.getBuyerHistory(this.state.fromAddress, newStartID)
			this.setState({startID: newStartID})
		}


		loadInitialHistory(e){
			var num_transactions
			var startID

			this.state.mee.getNumTransactions(e, 0, function(error, result){
				if(!error)
					{
						num_transactions = parseInt(result)
						if (num_transactions < num_per_page) startID = 0
						else startID = num_transactions - num_per_page	
						this.getBuyerHistory(e, startID)	
						this.setState({
							startID: startID,
							num_transactions: num_transactions
						})		

					}
				else
					console.log(error)
		
			}.bind(this))
		}

		resetButtonText(){
			this.setState({
		
				withdrawText: "Withdraw Funds",
				releaseText: "Release Funds",
				escrowHelptext: "Call Escrow Intervention"
			});

		}

		getContractBalance(e){
			this.state.mee.CheckBalance(e, function(error, result){
				if(!error)
					{
					this.setState({
						balance: +(parseInt(result)/(10**18)).toFixed(dec),
						balanceFull: +(parseInt(result)/(10**18)).toFixed(full_dec)});
					}
				else
					console.log(error)
		
			}.bind(this))

		}

		getAddressBalance(e){
			this.state.ETH_CLIENT.eth.getBalance(e, function(error, result){
				if(!error)
					{
					this.setState({
						addressBalance: +(parseInt(result)/(10**18)).toFixed(dec),
						addressBalanceFull: +(parseInt(result)/(10**18)).toFixed(full_dec),
					});
					}
					
				else
					console.log(error)
		
			}.bind(this))

		}

		setSellerNameArray(sellerNameArray, successCount, TxCount){
			if (successCount === TxCount)
				{
				this.makeTxTable(sellerNameArray)
			}
		}


		getSellerNameArray(e){
			e.length //num of sellers
			var tempArray = []
			var i
			var successCount = 0
			for (i = 0; i < e.length; i++) { 
				this.state.entitydb.getSellerFullInfo(e[i], function(error, result){
					if(!error)
						{
							tempArray[i] = result[0]
							successCount += 1
							this.setState({temp: tempArray});
							this.setSellerNameArray(tempArray, successCount, e.length)
						}
					else
						{
							console.log(error)
						}
				}.bind(this))
			}
		}

		getBuyerFullInfo(e){
			this.state.entitydb.getBuyerFullInfo(e, function(error, result){
				if(!error)
					{
					this.setState({
						buyerName: result[0],
						buyerInfo: result[1]
					});
					}
				else
					{
						console.log(error)
					}
		
		
			}.bind(this))

		}


		getSpecificTransaction(e)
		{

			this.state.mee.getSpecificTransaction(this.state.fromAddress,0,e, function(error, result){
				if(!error)
					{


					this.setState({
						specificTx: [result[0], result[1], result[2],result[3],this.state.ETH_CLIENT.toAscii(result[4]),result[5],result[6]],
						selectedID: e,
						showSpecificTx: true,
						modifyProfile: false,
						newTx: false
					});
					}
				else
					{
						console.log(error)
					}
			}.bind(this))
			
		}

		getBuyerHistory(e, startID){
			
			var TableRows = []
			var callInfo
			var url = "https://etherscan.io/address/"
			this.state.mee.buyerHistory(e, startID, num_per_page,function(error, result){
				if(!error)
					{

					callInfo = result
					_.eachRight(callInfo[0], (value, index) => {
						TableRows.push(
						
						<tr onClick={()=>this.getSpecificTransaction(this.state.startID + index)}>
										
						<td key={String(this.state.fromAddress) + String(startID) + String(index) + "id"}><p className="txid">#{this.state.startID + index}</p></td>	  
						<td key={String(this.state.fromAddress) + String(startID) + String(index) + "selleraddress"}><font className="small2">Purchase from</font><br/>
						<font className="small linkfont"><a href={url + callInfo[0][index]} target="_blank">{callInfo[0][index]}</a></font></td>	

						<td key={String(this.state.fromAddress) + String(startID) + String(index) + "amount"}>{+(parseFloat(callInfo[2][index])/(10**18)).toFixed(dec)} ETH</td>
						<td key={String(this.state.fromAddress) + String(startID) + String(index) + "status"}>{this.state.ETH_CLIENT.toAscii(callInfo[3][index])}</td>
						
						</tr>   
						)
					})

					this.setState({					
						tableRows: TableRows
					});
					}	
				else
					console.log(error)
			}.bind(this))

		}


		handleWithdraw(){
			
				this.state.mee.WithdrawFunds({from: this.state.fromAddress, gas: actionGas}, function(error, result){
					if(!error)
						this.setState({callback: result,
							popup: true,
							withdrawText: "Withdraw In Progress. Funds will arrive in your address once transaction is mined."});				
					else
						this.setState({withdrawText: "Withdraw Funds"});
						console.log(error)
	
				}.bind(this))
	
		}

		handleEscrowEscalation(){		
		
			this.state.mee.EscrowEscalation(0, this.state.selectedID, {from: this.state.fromAddress, gas: actionGas}, function(error, result){
				if(!error)
					this.setState({callback: result,
						popup: true,
						escrowHelptext: "Escrow Intervention will be active once your message is accepted by the Blockchain."});				
				else
					console.log(error)

			}.bind(this))

				
		
		
		}
		handleReleaseFunds(){
			
			this.state.mee.buyerFundRelease(this.state.selectedID, {from: this.state.fromAddress, gas: actionGas}, function(error, result){
				if(!error)
					this.setState({callback: result,
						popup: true,
						releaseText: "Release Funds in Progress. Seller will receive payment once transaction is mined. Thanks for using our Dapp! :)"});				
				else
					console.log(error)

			}.bind(this))

		}
		
		handleTableRowClick(e){
			this.setState({
				selectedID: e.target.value
						
		});
		}

		handleTxInput(e){
			this.setState({
				selectedID: e.target.value
						
		});
		}

		handleGetTransaction(e){
			this.setState({
				selectedID: this.state.tempID
						
		});
		}

		ModifyProfile(e){
			this.setState({
				modifyProfile: true,
				showSpecificTx: false,
				newTx: false		
		});
		}

		createTx(e){
			this.setState({
				modifyProfile: false,
				showSpecificTx: false,
				newTx: true		
		});
		}

		backToDashboard(e){
		this.setState({
			modifyProfile: false,
			showSpecificTx: false,
			newTx: false		
	});
	}

	newTxCallback(e){
		this.setState({
			popup: true,
			callback: e

	});
	}



	//{entitydb.getSellerFullInfo(this.state.callInfo[0][index])[0]}
		
  render() {

	var dropdownAddress = []
	

	_.each(this.state.accounts, (value, index) => {
		dropdownAddress.push(
		  <option className="dropdownColor" value={this.state.accounts[index]}>{this.state.accounts[index]}</option>
		)
		  })

	//For dropdown address selection
	
	var releaseButton = <button className="smallButton" onClick={this.handleReleaseFunds}>Release Funds</button>
	var escrowHelpButton = <button className="smallButton" onClick={this.handleEscrowEscalation}>Request Escrow Assistance</button>



	var header = 	
	(
	<tr className="no">
		<td><p className="small">Tx ID</p></td>
		<td>Seller Info</td>
		<td>Amount</td>
		<td>Status</td>
	</tr>
	)

	var url = ""
	var popup =  (<div></div>)
	if (this.state.popup === true)
		{
			url = "https://etherscan.io/tx/" + this.state.callback
			popup = (
				<div className="callback_wrapper">
				<div className="callback">
					
				<h3>
				Your transaction has been broadcasted to the network. Txhash: <u><a target="_blank" href={url}>{this.state.callback}</a></u>
				</h3>
				</div>
				<div className="callback_right">
				<button className="closeButton" onClick={this.closePopup}>X</button>
				</div>
				</div>
			)
		}

	var txHistory = (
		<div>
		<h2>Recent Purchases</h2>
			
			<table className="fixed">
			
			
			<tbody>
			{header}
			
			{this.state.tableRows}
			</tbody>
		
			</table>
			<br/>
			<div className="center"><button className="pageButton" onClick={this.handlePrevPage}>Prev</button> | <button className="pageButton" onClick={this.handleNextPage}>Next</button>
			</div>
		</div>
	)	

	  


	var specificTx = (
		<div>
		<SpecificTx specificTx={this.state.specificTx} button1={releaseButton} button2={escrowHelpButton} selectedID={this.state.selectedID}/>
		
		 
		<button className="smallButton" onClick={()=>this.setState({showSpecificTx: false})}>Back to Dashboard</button>
		</div>	
	)

	var right_side
	var returnToDashboard = ""
	if (this.state.showSpecificTx == true)
		right_side = specificTx
	else if (this.state.modifyProfile == true)
		{
			right_side = <RegisterBuyerRS fromAddress={this.state.fromAddress} newTxCallback={this.newTxCallback}/>
			returnToDashboard = <div className="padding15"><button className="smallButton" onClick={this.backToDashboard}>Back to Buyer Dashboard</button></div>
		}
	else if (this.state.newTx == true)
		{
			right_side = <NewTransactionRS fromAddress={this.state.fromAddress} newTxCallback={this.newTxCallback}/>
			returnToDashboard = <div className="padding15"><button className="smallButton" onClick={this.backToDashboard}>Back to Buyer Dashboard</button></div>
		}	
	else
		right_side = txHistory

	

	var buyerProfile = 
	(
	<div className="white-bg padding15">
	<div className="center nodeco">
	<h3>Your Buyer Profile <img className="img-circle" src={this.state.addressBlockie}/></h3>
	<font className="small">{this.state.fromAddress}</font>

	</div>

	<p>Buyer Name: {this.state.buyerName}
	<br/>
	Buyer Info: {this.state.buyerInfo}</p>


	<button className="smallButton" onClick={this.ModifyProfile}>Modify Profile</button>




	</div>
	)
    return (
    
      
     
  <div className="bg-lb height100">

  <div className="overview_wrapper">
			<br/><br/>
	
		<div id="container2col2">
		<div id="container2col1">
		<div id="col2-1">
			
		
		<select className="selectbox" onChange={this.handleFromAddressInput} value={this.state.value}>
		<option value="0">Select Address</option>
		{dropdownAddress}
		</select>	

		
		<div className="spacer"></div>
		
		
		<div className="white-bg padding15">	
	
		<div className="center nodeco"><h3>Address Balance</h3><h2><a href="#" title={this.state.addressBalanceFull}>{this.state.addressBalance}</a> ETH</h2></div>
		<button className="smallButton" onClick={this.createTx}>Initialize New Transaction</button>
		</div>
		
		<div className="spacer"></div>
		
		<div className="white-bg padding15">
		<div className="center"><h3>Contract Balance</h3><h2><a href="#" title={this.state.balanceFull}>{this.state.balance}</a> ETH</h2></div>
		
		<div className="center">
		<button className="smallButton" onClick={this.handleWithdraw}>{this.state.withdrawText}</button>
		
		</div>
		</div>
		<div className="spacer"></div>

	
		{buyerProfile}
		<div className="spacer"></div>
		{returnToDashboard}
		<br/>
	
			
		
		</div>

		
		<div id="col2-2">
		<div className="white-bg padding15 min-height">
		{right_side}
		

		</div>
		
		</div>
	</div>
	</div>
	</div>
	{popup}
  </div>  
      

    )
  }
}

export default BuyerHome;
