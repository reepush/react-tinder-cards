import React from "react";
import Deck from "./components/Deck";

class App extends React.Component {
  constructor(props) {
    super(props)
    
    this.state = {
      products: [],
      likes: 0,
      dislikes: 0,
    }
  }
  
  componentWillMount() {
    fetch('https://ycl641scac.execute-api.us-west-2.amazonaws.com/staging/products')
      .then(response => response.json())
      .then(response => {
        this.setState({
          products: response.hits
        })
      })
  }
  
  onReset() {
    this.setState({
      likes: 0,
      dislikes: 0,
    })
  }
  
  onLike() {
    this.setState({
      likes: this.state.likes + 1
    })
  }
  
  onDislike() {
    this.setState({
      dislikes: this.state.dislikes + 1
    })
  }
  
  render() {
    return (
      <div className="container">
        <div className="likes">
          <span>{this.state.dislikes} 👎</span>
          <span>{this.state.likes} 👍</span>
        </div>
        
        {this.state.products.length != 0 &&
          <Deck
            products={this.state.products}
            onReset={this.onReset.bind(this)}
            onLike={this.onLike.bind(this)}
            onDislike={this.onDislike.bind(this)}
          />
        }
      </div>
    )
  }
}

export default App;
