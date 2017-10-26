
import React, {Component} from 'react'
import getWeb3 from './utils/getWeb3'
import Web3 from 'web3'
import _ from 'lodash';
import variablestore from './variablestore'


const blockies = require('ethereum-blockies-png')
class SpecificTx extends Component {

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


    }
    this.getBuyerFullInfo(this.props.specificTx[0])
    this.getSellerFullInfo(this.props.specificTx[1])
    this.getEscrowFullInfo(this.props.specificTx[2])

    this.getBuyerFullInfo = this.getBuyerFullInfo.bind(this);
    this.getSellerFullInfo = this.getSellerFullInfo.bind(this);
    this.getEscrowFullInfo = this.getEscrowFullInfo.bind(this);

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

  getEscrowFullInfo(e){
    this.state.entitydb.getEscrowFullInfo(e, function(error, result){
      if(!error)
        {
        this.setState({
          escrowName: result[0],
          escrowInfo: result[1]
        });
        }
      else
        {
          console.log(error)
        }
        
  
    }.bind(this))
  }

  render() {

    var buyerBlockie =  blockies.createDataURL({seed: this.props.specificTx[0]})
    var sellerBlockie = blockies.createDataURL({seed: this.props.specificTx[1]})
    var escrowBlockie = blockies.createDataURL({seed: this.props.specificTx[2]})
    var total = +(400/399*(parseInt(this.props.specificTx[3]) + parseInt(this.props.specificTx[5]))/(10**18)).toFixed(6)
    var escrow_fee = +((this.props.specificTx[5])/(10**18)).toFixed(6)
    var notes = this.state.ETH_CLIENT.toAscii(this.props.specificTx[6])
    var escrow_fee_pct = +(escrow_fee/total*100).toFixed(1)
    var net = +((this.props.specificTx[3])/(10**18)).toFixed(6)
    var dev_fee = +(total/400).toFixed(6)
    
    return (
    
		
		<div className="padding15">
		<h2>Transaction #{this.props.selectedID}</h2>
		

		<table className="tx2">
		<tr><td>Payment Status:</td><td>{this.props.specificTx[4]}</td>
		<td rowSpan="3">
		{this.props.button1}
		<div className="spacer"></div>
		
		{this.props.button2}
		</td></tr>
		<tr><td>Total amount:</td><td>{total} ETH</td></tr>
		<tr><td>Escrow fee:</td><td>-{escrow_fee} ETH ({escrow_fee_pct} %)</td>
		<td rowSpan="2"></td></tr>
		<tr><td>Dev fee:</td><td>-{dev_fee} ETH (0.25%)</td></tr>
		<tr><td>Net amount:</td><td>{net} ETH</td></tr>
    <tr><td>Notes:</td><td>{notes}</td></tr>
		</table>
		<h3>Payment from <img className="icon" src={buyerBlockie}/></h3><hr/>
		
		<table className="tx">
			<tr>
			<td>Buyer name:</td><td>{this.state.buyerName}</td>
		
			</tr>
			<tr>
			<td>Buyer info:</td><td>{this.state.buyerInfo}</td>
			</tr>
			<tr>
			<td>Buyer address:</td><td>{this.props.specificTx[0]}</td>
			</tr>
		</table>

	

		<h3>Payment to <img className="img-circle" src={sellerBlockie}/></h3><hr/>
		<table className="tx">
			<tr>
			<td>Seller name:</td><td>{this.state.sellerName}</td>
			
			</tr>
			<tr>
			<td>Seller info:</td><td>{this.state.sellerInfo}</td>
			</tr>
			<tr>
			<td>Seller address:</td><td>{this.props.specificTx[1]}</td>
			</tr>
		</table>

	

		<h3>Escrowed by <img className="img-circle" src={escrowBlockie}/></h3><hr/>
		<table className="tx">
			<tr>
			<td>Escrow name:</td><td>{this.state.escrowName}</td>
			
			</tr>
			<tr>
			<td>Escrow info:</td><td>{this.state.escrowInfo}</td>
			</tr>
			<tr>
			<td>Escrow address:</td><td>{this.props.specificTx[2]}</td>
			</tr>
		</table>

  </div>

  
)

    
    
  }
}

export default SpecificTx;