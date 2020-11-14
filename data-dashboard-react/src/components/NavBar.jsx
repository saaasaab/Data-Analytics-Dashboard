import React, { Component } from 'react';
class NavBar extends Component {
    state = {  }
    render( ) { 
        return (<h1>{this.props.clientName}</h1>);
    }
}
 
export default NavBar;