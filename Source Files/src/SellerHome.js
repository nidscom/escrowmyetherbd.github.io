
import React, {Component} from 'react'
import getWeb3 from './utils/getWeb3'
import Web3 from 'web3'
import _ from 'lodash';
import variablestore from './variablestore'
import {Link} from "react-router"
import NavLink from './NavLink'
import SpecificTx from './SpecificTx'
import RegisterSellerRS from './RegisterSellerRS'


const num_per_page = 10
const gasLimit = 100000
const dec = variablestore.dec_place
const full_dec = variablestore.full_dec
const blockies = require('ethereum-blockies-png')
class SellerHome extends Component {
	
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
				balance: 0,
				addressBalance: 0,
				balanceFull: 0,
				addressBalanceFull: 0,
				startID: null,
				
				
				withdrawText: "Withdraw Funds",
				refundText: "Refund Buyer",
				escrowHelptext: "Call Escrow Intervention",
			
				statusText: "",
	
				sellerName: "",
	
				sellerInfo: "",
				escrowName: "",
				sellerAddress: "",
				escrowAddress: "",
				amount: null,
				tableRows: [],
				error: [],
				callback: "",
				popup: false,
				showSpecificTx: false,
				addressBlockie: "",
				modifyProfile: false
			}



			this.handleFromAddressInput = this.handleFromAddressInput.bind(this);
			this.handleTableRowClick = this.handleTableRowClick.bind(this);
			this.handleWithdraw = this.handleWithdraw.bind(this);
			this.handleEscrowEscalation = this.handleEscrowEscalation.bind(this);
			this.handleTxInput = this.handleTxInput.bind(this);
			this.handleRefund = this.handleRefund.bind(this);
			this.handleNextPage = this.handleNextPage.bind(this);
			this.handlePrevPage = this.handlePrevPage.bind(this);

			this.getAddressBalance = this.getAddressBalance.bind(this);
			this.getContractBalance = this.getContractBalance.bind(this);
			this.getSellerFullInfo = this.getSellerFullInfo.bind(this);
			this.getSellerHistory = this.getSellerHistory.bind(this);
			this.resetButtonText = this.resetButtonText.bind(this);
			this.loadInitialHistory = this.loadInitialHistory.bind(this);
			this.closePopup = this.closePopup.bind(this);
			this.clearState = this.clearState.bind(this);
			this.ModifyProfile = this.ModifyProfile.bind(this);
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
				balance: 0,
				addressBalanceFull: 0,
				balanceFull: 0,
				tableRows: [],
				sellerName: "",
				sellerInfo: "",
				
				fromAddress: "",
				addressBlockie: ""

			});

		}


		handleFromAddressInput(e) {
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
			this.getSellerFullInfo(e.target.value)
			this.loadInitialHistory(e.target.value)	
			this.resetButtonText()	
		}

	
		handleNextPage(){
			if (this.state.num_transactions < num_per_page) return
			var newStartID = this.state.startID - num_per_page
			if (newStartID < 0) newStartID = 0
			this.getSellerHistory(this.state.fromAddress, newStartID)
			this.setState({startID: newStartID})
		}

		handlePrevPage(){
			var newStartID = this.state.startID + num_per_page
			var maxID = this.state.num_transactions - num_per_page
			if (maxID == this.state.startID) return
			if (newStartID > maxID) newStartID = maxID
			this.getSellerHistory(this.state.fromAddress, newStartID)
			this.setState({startID: newStartID})
		}

		getContractBalance(e){
			this.state.mee.CheckBalance(e, function(error, result){
				if(!error)
					{
					this.setState({
						balance: +(parseInt(result)/(10**18)).toFixed(dec),
						balanceFull: +(parseInt(result)/(10**18)).toFixed(full_dec)
					});
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
						addressBalanceFull: +(parseInt(result)/(10**18)).toFixed(full_dec)
					});
					}
					
				else
					console.log(error)
		
			}.bind(this))

		}

		getSellerFullInfo(e){
			this.state.entitydb.getSellerFullInfo(e, function(error, result){
				if(!error)
					{
					this.setState({
						sellerName: result[0],
						sellerInfo: result[1]
					});
					}
				else
					{
						console.log(error)
					}
		
		
			}.bind(this))

		}

		loadInitialHistory(e){
			var num_transactions
			var startID

			this.state.mee.getNumTransactions(e, 1, function(error, result){
				if(!error)
					{
						num_transactions = parseInt(result)
						if (num_transactions < num_per_page) startID = 0
						else startID = num_transactions - num_per_page		
						this.getSellerHistory(e, startID)	
						this.setState({
							startID: startID,
							num_transactions: num_transactions
						})		

					}
				else
					console.log(error)
		
			}.bind(this))
		}

		getSellerHistory(e, startID){
			
			var TableRows = []
			var callInfo
			var url = "https://etherscan.io/address/"
			this.state.mee.SellerHistory(e, startID, num_per_page, function(error, result){
				if(!error)
					{
					callInfo = result
					_.eachRight(callInfo[0], (value, index) => {
						if (callInfo[0][index] == 0) return
						TableRows.push(
					  
						<tr onClick={()=>this.getSpecificTransaction(this.state.startID + index)}>
									  
						<td key={String(this.state.fromAddress) + String(startID) + String(index) + "id"}><p className="txid">#{startID + index}</p></td>	  
						<td key={String(this.state.fromAddress) + String(startID) + String(index) + "buyeraddress"}><font className="small2">Payment from</font><br/>
						<font className="small linkfont"><a href={url + callInfo[0][index]} target="_blank">{callInfo[0][index]}</a></font></td>
							  
									  
						<td key={String(this.state.fromAddress) + String(startID) + String(index) + "amount"}>{+(parseFloat(callInfo[2][index])/(10**18)).toFixed(dec)} ETH</td>
						<td key={String(this.state.fromAddress) + String(startID) + String(index) + "status"}>{this.state.ETH_CLIENT.toAscii(callInfo[3][index])}</td>
						
						</tr>   
						)
					})

					this.setState({					
						tableRows: TableRows,
						error: result
					});

					}	
				else
					console.log(error)
			}.bind(this))

		}

		getSpecificTransaction(e)
		{

			this.state.mee.getSpecificTransaction(this.state.fromAddress,1,e, function(error, result){
				if(!error)
					{


					this.setState({
						specificTx: [result[0], result[1], result[2],result[3],this.state.ETH_CLIENT.toAscii(result[4]),result[5],result[6]],
						selectedID: e,
						showSpecificTx: true
					});
					}
				else
					{
						console.log(error)
					}
			}.bind(this))
			
		}

		resetButtonText(){
			this.setState({
		
				withdrawText: "Withdraw Funds",
				refundText: "Refund Buyer",
				escrowHelptext: "Call Escrow Intervention"
			});

		}
		handleWithdraw(){
			
				this.state.mee.WithdrawFunds({from: this.state.fromAddress, gas: gasLimit}, function(error, result){
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
			
			this.state.mee.EscrowEscalation(1, this.state.selectedID, {from: this.state.fromAddress, gas: gasLimit}, function(error, result){
				if(!error)
					this.setState({callback: result,
						popup: true,
						escrowHelptext: "Escrow Intervention will be active once transaction is mined."});				
				else
					
					console.log(error)

			}.bind(this))
		}

		handleRefund(){
			this.state.mee.sellerRefund(this.state.selectedID, {from: this.state.fromAddress, gas: gasLimit}, function(error, result){
				if(!error)
					this.setState({callback: result,
						popup: true,
						refundText: "Refund in Progress. Buyer will receive refund once transaction is mined."});				
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
				selectedID: e.target.value,
				refundText: "Refund Buyer",
				
				refundText: "Refund Buyer",
				escrowHelptext: "Call Escrow Intervention"
						
		});
		}
		ModifyProfile(e){
			this.setState({
				modifyProfile: true,
				showSpecificTx: false
						
		});
		}

		backToDashboard(e){
			this.setState({
				modifyProfile: false,
				showSpecificTx: false
				
		});
		}
		newTxCallback(e){
			this.setState({
				popup: true,
				callback: e
	
		});
		}
		
		
  render() {

	var dropdownAddress = []
	var escrowHelpButton = <button className="smallButton" onClick={this.handleEscrowEscalation}>Request Escrow Assistance</button>
	var refundButton = <button className="smallButton" onClick={this.handleRefund}>Refund Buyer</button>
	
	var header= (
		<tr className="no">
		<td><p className="small">Sale ID</p></td>
		<td>Buyer Info</td>
		<td>Amount</td>
		<td>Status</td>
		</tr>
	)
	
	//For dropdown address selection
    _.each(this.state.accounts, (value, index) => {
      dropdownAddress.push(
        <option className="dropdownColor" value ={this.state.accounts[index]}>{this.state.accounts[index]}</option>
      )
		})


	var url = ""
	var popup =  (<div></div>)
	if (this.state.popup == true)
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
		<SpecificTx specificTx={this.state.specificTx} button1={refundButton} button2={escrowHelpButton} selectedID={this.state.selectedID}/>
		
			
		<button className="smallButton" onClick={()=>this.setState({showSpecificTx: false})}>Back to Dashboard</button>
		</div>	
	)

	var returnToDashboard = ""
	var right_side
	if (this.state.showSpecificTx == true)
		right_side = specificTx
	else if (this.state.modifyProfile == true)
		{
			right_side = <RegisterSellerRS fromAddress={this.state.fromAddress} newTxCallback={this.newTxCallback}/>
			returnToDashboard = <div className="padding15"><button className="smallButton" onClick={this.backToDashboard}>Back to Seller Dashboard</button></div>
		}
	else 
		right_side = txHistory
		
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
		
		<br/>
		
		<div className="spacer"></div>
		
		
		<div className="white-bg padding15">	
	
		<div className="center nodeco"><h3>Address Balance</h3><h2><a href="#" title={this.state.addressBalanceFull}>{this.state.addressBalance}</a> ETH</h2></div>
		
		</div>
		
		<div className="spacer"></div>
		
		<div className="white-bg padding15">
		<div className="center"><h3>Contract Balance</h3><h2><a href="#" title={this.state.balanceFull}>{this.state.balance}</a> ETH</h2></div>
		
		<div className="center">
		<button className="smallButton" onClick={this.handleWithdraw}>{this.state.withdrawText}</button>
		
		</div>
		</div>
	
		
		
		<div className="spacer"></div>
		<div className="white-bg padding15">
		<div className="center nodeco">
			<h3>Your Seller Profile <img className="img-circle" src={this.state.addressBlockie}/></h3>
		<font className="small">{this.state.fromAddress}</font>

		</div>
		
			<p>Seller Name: {this.state.sellerName} 
				<br/>Seller Info: {this.state.sellerInfo}
						
		</p>
			<div className="spacer"></div>
			<button className="smallButton" onClick={this.ModifyProfile}>Modify Profile</button>
			
			
			
			
		
		</div>
		<div className="spacer"></div>
		{returnToDashboard}
		<br/>
		<br/>
		</div>

		
		<div id="col2-2">
		<div className="white-bg padding15 minheight">
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

export default SellerHome;
/*<div className="white-bg padding15">
		<div className="center nodeco">
			<h3>Transaction Details</h3>
		<input className="input-id" onChange={this.handleTxInput} value={this.state.selectedID} placeholder="Input Sale #"></input>

		</div>


			
		<div className="spacer"></div>
			<div className="spacer"></div>
			
			<button className="smallButton" onClick={this.handleRefund}>{this.state.refundText}</button>
			<div className="spacer"></div>
			<button className="smallButton" onClick={this.handleEscrowEscalation}>Request Escrow Assistance</button>

			
			
		
		</div>*/