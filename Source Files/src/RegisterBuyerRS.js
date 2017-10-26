
import React, {Component} from 'react'
import getWeb3 from './utils/getWeb3'
import Web3 from 'web3'
import _ from 'lodash';
import variablestore from './variablestore'

import {Link} from "react-router"


const gasLimit = 300000
class RegisterBuyerRS extends Component {
	
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

				profileText: "Update Profile",
				callback: "",
				name: "",
				info: ""


			}



			
			this.generateTransaction = this.generateTransaction.bind(this);
			
			this.handleNameInput = this.handleNameInput.bind(this);
			this.handleInfoInput = this.handleInfoInput.bind(this);

			this.closePopup = this.closePopup.bind(this);
			this.resetButtonText = this.resetButtonText.bind(this);
			this.clearState = this.clearState.bind(this);
			
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
				tableRows: [],
				buyerName: "",
				buyerInfo: "",
				fromAddress: "",
				addressBlockie: ""

			});

		}
		handleNotesInput(e) {
			this.setState({				
				note: e.target.value,			
			});

		}



  
    handleNameInput(e) {
      this.setState({name: e.target.value});
    }
    handleInfoInput(e) {
      this.setState({info: e.target.value});
    }
  

  
    generateTransaction(){
	
		this.state.entitydb.registerBuyer(this.state.name,this.state.info ,{from: this.props.fromAddress, gas: gasLimit}, function(error, result){
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

		
  render() {

	



    return (
    
      
  		<div>
			
		<h2>Update Buyer Profile</h2>
		<p className="align-left">Add information to your Ethereum Address that Sellers and Escrow Agents can view. 

		<br/>
		</p>
		<table>
		<tr>
		<td><p className="left">Your Address: {this.props.fromAddress}</p></td>



		</tr>
		<tr>
		<td><p className="left">Name:</p></td>


		</tr>
		<tr>
		<td><input className="left input-address input-pad" type="text" placeholder="" onChange={this.handleNameInput} value={this.state.name}/></td>

		</tr>

		<tr>
		<td><p className="left">Info:</p></td>

		</tr>
		<tr>
		<td><input className="left input-address input-pad" type="text" placeholder="" onChange={this.handleInfoInput} value={this.state.info}/></td>
		</tr>

		<tr>
		<td colSpan="2"><br/><button className="mainButton" onClick={this.generateTransaction}><h2>{this.state.profileText}</h2></button><br/><br/></td>
		</tr>
		</table>
		
		</div>
	
    )
  }
}

export default RegisterBuyerRS;
