
import React, {Component} from 'react'
import getWeb3 from './utils/getWeb3'
import Web3 from 'web3'
import _ from 'lodash';
import variablestore from './variablestore'

import {Link} from "react-router"



class NewTransactionRS extends Component {
	
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
				gasLimit: 300000,
				
				withdrawText: "Withdraw Funds",
				addressBalance: 0,
				balance: 0,

				chkSeller: null,
				chkEscrow: null,
				sellerName: "",
				sellerInfo: "",
				escrowName: "",
				escrowInfo: "",
				escrowFee: "",
				sellerAddress: "",
				escrowAddress: "",
				amount: null,
				sellerNumTransactions: null,
				confirmText: "Proceed to Confirmation",
				escrowNumTransactions: null,
				note: "",
				callback: "",
				popup: false,
				sellerInputInfo: "",
				escrowInputInfo: "",
				amountInfo: "",
				showAdvanced: false,
				gasInfo: <p className="small"><font className="green">Tx will use up to 300000 gas.</font></p>,
				addressBlockie: "",
				minGas: 285000
			

			}



		
			this.generateTransaction = this.generateTransaction.bind(this);

			this.handleNotesInput= this.handleNotesInput.bind(this);
			this.handleToAddressInput = this.handleToAddressInput.bind(this);
			this.handleEscrowAddressInput = this.handleEscrowAddressInput.bind(this);
			this.handleAmountInput = this.handleAmountInput.bind(this);
			this.handleGasInput = this.handleGasInput.bind(this);
			


		
			this.getSellerFullInfo = this.getSellerFullInfo.bind(this);
			this.getEscrowFullInfo = this.getEscrowFullInfo.bind(this);
			
			this.clearState = this.clearState.bind(this);
			this.resetButtonText = this.resetButtonText.bind(this);
			this.showAdvanced = this.showAdvanced.bind(this);
			
		}

		closePopup() {
			this.setState({				
				popup: false			
			});

		}
		handleNotesInput(e) {
			var gl = 300000 + e.target.value.length*2000
			var min = gl*0.95
			this.setState({				
				note: e.target.value,	
				gasLimit: gl,
				minGas: min,
				gasInfo: <p className="small"><font className="green">Tx will use up to {gl} gas.</font></p>
			});

		}

		clearState() {
			this.resetButtonText()
			this.setState({				
				popup: false,
				addressBalance: 0,
				balance: 0,
				tableRows: [],
				buyerName: "",
				buyerInfo: "",
				fromAddress: "",
				addressBlockie: ""

			});

		}

	
		getSellerFullInfo(e){
			this.state.entitydb.getSellerFullInfo(e, function(error, result){
				if(!error)
				{
				if (result[0].length == 0)
					{this.setState({
						//sellerName: result[0],
						//sellerInfo: result[1],
						sellerInputInfo: <p className="small"><font className="green">Valid Address.</font> <font className="orange">Unregistered Seller</font></p>
					});
				}
				else
					{this.setState({
					//sellerName: result[0],
					//sellerInfo: result[1],
					sellerInputInfo: <p className="small"><font className="green">Valid Address. Seller Name: {result[0]}</font></p>
				});
				}
				}
				else
					{
						console.log(error)
					}
		
		
			}.bind(this))

		}

		getEscrowFullInfo(e){
			this.state.entitydb.getEscrowFullInfo(e, function(error, result){

				
				if(!error)
					{
						if (result[0].length == 0)
							{this.setState({
								//sellerName: result[0],
								//sellerInfo: result[1],
								escrowInputInfo: <font><font className="green">Valid Address.</font> <font className="orange">Unregistered Escrow</font></font>
							});
						}
						else
							{this.setState({
							//sellerName: result[0],
							//sellerInfo: result[1],
							escrowInputInfo: <font className="green">Valid Address. Escrow Name: {result[0]}</font>
						});
						}
					}
				else
					{
						console.log(error)
					}
					
		
			}.bind(this))

			this.state.mee.getEscrowFee(e, function(error, result){
				if(!error)
					{
					this.setState({
						escrowFee: <font className="green">Fee: {parseInt(result)/10.0}%</font>
						
					});
					}
				else
					{
						console.log(error)
					}
			}.bind(this))
		}

		handleToAddressInput(e) {
			if (!this.state.ETH_CLIENT.isAddress(e.target.value))
			{


			
			this.setState({
				sellerAddress: e.target.value,     
							
				confirmText: "Proceed to Confirmation",
				sellerInputInfo: <p className="small"><font className="red">Invalid Address</font></p>
			});
				return false
			}
			this.getSellerFullInfo(e.target.value)
			this.setState({
				sellerAddress: e.target.value,
				
				//sellerName: entitydb.getSellerFullInfo(e.target.value),
				//sellerNumTransactions: (mee.escrowSellerHistory(e.target.value, 0))[0].length,
				confirmText: "Proceed to Confirmation",
				
	
			});
					
		}

		handleEscrowAddressInput(e) {
			
	
		if (!this.state.ETH_CLIENT.isAddress(e.target.value))
		{
		this.setState({
			escrowAddress: e.target.value,     
			
			escrowName: "",
			escrowNumTransactions: null,
			escrowFee: null,
			confirmText: "Proceed to Confirmation",
			escrowInputInfo: <font className="red">Invalid Address</font>
		});
			return false
		}
		this.getEscrowFullInfo(e.target.value)
		this.setState({
			escrowAddress: e.target.value,
			
			//escrowName: entitydb.getEscrowFullInfo(e.target.value),
			//escrowNumTransactions: (mee.escrowSellerHistory(e.target.value, 1))[0].length,
	
			confirmText: "Proceed to Confirmation",
			escrowInputInfo: <font className="green">Valid Address</font>
		});

	}

		handleAmountInput(e) {
			if (!isNaN(e.target.value))
			{
				if (e.target.value != 0 && e.target.value > 0)
				{this.setState({amount: e.target.value,
				confirmText: "Proceed to Confirmation",
				amountInfo: <p className="small"><font className="green">You will send {e.target.value} ETH.</font></p>});
				}

				else
				{
					this.setState({amount: e.target.value,
					confirmText: "Proceed to Confirmation",
					amountInfo: <p className="small"><font className="red">Amount must be greater than zero</font></p>});
				}
			}

			else
			{
				this.setState({amount: e.target.value,
					amountInfo: <p className="small"><font className="red">Invalid input</font></p>});
			}
		}

		handleGasInput(e) {
			if (!isNaN(e.target.value))
			{
				if (e.target.value != 0 && e.target.value >= this.state.minGas)
				{this.setState({gasLimit: e.target.value,
				gasInfo: <p className="small"><font className="green">Tx will use up to {e.target.value} gas.</font></p>});
				}


				else if (e.target.value <= 0)
				{
					this.setState({gasLimit: e.target.value,
					gasInfo: <p className="small"><font className="red">Amount must be greater than zero</font></p>});
				}

				else{
					this.setState({gasLimit: e.target.value,
						gasInfo: <p className="small"><font className="orange">Low gas limit. At least {this.state.minGas} gas is recommended.</font></p>});
				}
			}

			else
			{
				this.setState({gasLimit: e.target.value,
					gasInfo: <p className="small"><font className="red">Invalid input</font></p>});
			}
		}

	

	  generateTransaction(){
			
			this.state.mee.newEscrow(this.state.sellerAddress,this.state.escrowAddress, this.state.note,
			{from: this.props.fromAddress, value: this.state.amount*(10**18), gas: this.state.gasLimit}, function(error, result){
				if(!error)
					{
						this.props.newTxCallback(result)
						
					}		
				else
					console.log(error)
			
				}.bind(this))

		}
	
		resetButtonText(){
			this.setState({
		
				withdrawText: "Withdraw Funds"
				
			});

		}
		showAdvanced(){
			var state = true
			if (this.state.showAdvanced === true)
				state = false
			this.setState({
		
				showAdvanced: state
				
			});

		}

		
  render() {

	
	var normalTable = 
	(
		<table>
			<tbody>
		<tr>
			<td><p className="left">Your Address: {this.props.fromAddress}</p></td>
			
		
			
		</tr>
		<tr>
			<td><p className="left">Seller Address</p></td>
			
		
			
		</tr>
		<tr>
			<td><input className="left input-address input-pad" type="text" placeholder="" onChange={this.handleToAddressInput} value={this.state.toAddress}/>
			<br/>
			
		{this.state.sellerInputInfo}</td>
			
		</tr>

		<tr>
			<td><p className="left">Escrow Agent Address</p></td>
			
		</tr>
		<tr>
			<td><input className="left input-address input-pad" type="text" placeholder="" onChange={this.handleEscrowAddressInput} value={this.state.escrowAddress}/>
			<br/>
			
		<p className="small">{this.state.escrowInputInfo}<br/>{this.state.escrowFee}</p></td>
		</tr>

		<tr>
			<td><p className="left">Amount to Send [ETH]</p></td>
		</tr>
		<tr>
			<td><input className="left input-amount input-pad" type="text" placeholder="" onChange={this.handleAmountInput} value={this.state.amount}/>
			<br/>
			
		{this.state.amountInfo}
		</td>
			
		</tr>

		<tr><td><p className="small linkfont" onClick={this.showAdvanced}>Show advanced options</p></td></tr>

		<tr>
		<td colSpan="2"><br/><button className="mainButton" onClick={this.generateTransaction}><h2>{this.state.confirmText}</h2></button><br/><br/></td>
		</tr>
		</tbody>
		</table>
	)

	var table
	var advancedTable = 
	(
		<table>
		<tbody>
	<tr>
		<td><p className="left">Your Address: {this.props.fromAddress}</p></td>
		
	
		
	</tr>
	<tr>
		<td><p className="left">Seller Address</p></td>
		
	
		
	</tr>
	<tr>
		<td><input className="left input-address input-pad" type="text" placeholder="" onChange={this.handleToAddressInput} value={this.state.toAddress}/>
		<br/>
		
	{this.state.sellerInputInfo}</td>
		
	</tr>

	<tr>
		<td><p className="left">Escrow Agent Address</p></td>
		
	</tr>
	<tr>
		<td><input className="left input-address input-pad" type="text" placeholder="" onChange={this.handleEscrowAddressInput} value={this.state.escrowAddress}/>
		<br/>
		
	<p className="small">{this.state.escrowInputInfo}<br/>{this.state.escrowFee}</p></td>
	</tr>

	<tr>
		<td><p className="left">Amount to Send [ETH]</p></td>
	</tr>
	<tr>
		<td><input className="left input-amount input-pad" type="text" placeholder="" onChange={this.handleAmountInput} value={this.state.amount}/>
		<br/>
		
	{this.state.amountInfo}
	</td>
		
	</tr>
	<tr>
		<td><p className="left">Notes for Seller (optional)</p></td>
	</tr>
	<tr>
		<td><input className="left input-amount input-pad" type="text" placeholder="" onChange={this.handleNotesInput} value={this.state.notes}/>
		<br/>
		

	</td>
		
	</tr>
	<tr>
		<td><p className="left">Gas Limit</p></td>
	</tr>
	<tr>
		<td><input className="left input-amount input-pad" type="text" placeholder="" onChange={this.handleGasInput} value={this.state.gasLimit}/>
		<br/>
		{this.state.gasInfo}
		

	</td>
		
	</tr>

	<tr><td><p className="small linkfont" onClick={this.showAdvanced}>Hide advanced options</p></td></tr>

	<tr>
	<td colSpan="2"><br/><button className="mainButton" onClick={this.generateTransaction}><h2>{this.state.confirmText}</h2></button><br/><br/></td>
	</tr>
	</tbody>
	</table>
	)
	var advanced = ""
	if (this.state.showAdvanced == false)
		{
			table = normalTable
		}

	else
		{
			table = advancedTable
		}


    return (
    
      
		<div>
			
		<h2>Send Escrow Payment</h2>
		<p className="align-left">Your payment will be locked in the smart contract until you approve fund release.
		Make sure to choose a trusted Escrow Agent for your protection.
		<br/>
		</p>
		{table}
		
		</div>
		


    )
  }
}

export default NewTransactionRS;

