// modules/Buyer.js
import React, {Component} from 'react'

import {Link} from "react-router"

import BuyerHome from "./BuyerHome"
import variablestore from './variablestore'
import _ from 'lodash';


class App extends Component {

  render() {

    
    return (
      <div>

      {this.props.children || <BuyerHome/>}
      </div>
    )

  }
}

export default App;