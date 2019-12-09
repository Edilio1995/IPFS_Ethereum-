import React, { Component } from 'react';
import logo from '../logo.png';
import './App.css';
import Web3 from 'web3'
import UploadHash from '../abis/UploadHash.json'

const ipfsClient = require('ipfs-http-client')
const ipfs = ipfsClient({host:'ipfs.infura.io', port:'5001', protocol: 'https'})
var ProgressBar = require('progressbar.js')

class App extends Component {


  constructor(props){
    super(props);
    this.state = {
      account : '',
      buffer : null,
      contract: null,
      actualFile: 'QmaXjyvMqk7th9Bqu5iXxjLn4qAfgzJv8EDBWMrcPzsaTz',
      list : [],
      plainText: '',
    };
  }

  async componentWillMount(){
    await this.loadWeb3()
    await this.loadBlockchainData()
    await this.loadNetworkProperties()
    await this.loadEternityList()
  }

  //Blockchain function

  //Carica accounts

  //Carica networks
 async loadEternityList(){
   let size = await this.state.contract.methods.getSize().call()
   var array = []
   for(var i = 1; i <= size; i++){
     let a = await this.state.contract.methods.getFile(i).call()
     console.log(a)
     array.push({
       Hash : a[0],
       PlainText : a[1],
       Sender : a[2]
     })
   }
   array.reverse()
  let tmp = array.map((data) => {
    return (
        <tr>
          <td>{data.Hash} </td>
          <td> {data.PlainText} </td>
          <td> {data.Sender} </td>
        </tr>
    );
  });
  this.setState({list : tmp})
 }

  async loadBlockchainData(){
    const web3 = window.web3
    const accounts = await web3.eth.getAccounts()
    this.setState({account : accounts[0]})
    console.log(accounts)
  }

  async loadNetworkProperties(){
    const web3 = window.web3
    const netId = await web3.eth.net.getId()
    const netData = UploadHash.networks[netId]
    if(netData){
      const abi = UploadHash.abi
      const address = netData.address
      const contract = web3.eth.Contract(UploadHash.abi, netData.address)
      this.setState({contract: contract})
      const hash = await contract.methods.get().call()
      this.setState({actualFile : hash})
    }else{
      window.alert('Smart contract non presente')
    }
  }

  async loadSmartContract(){

  }




  async loadWeb3(){
    if(window.ethereum){
      window.web3 = new Web3(window.ethereum)
      await window.ethereum.enable()
    }if(window.web3){
      window.web3 = new Web3(window.web3.currentProvider)
    }else{
      window.alert('Necessario utilizzo di metamask')
    }
  }

  captureFile = (event) =>{
    event.preventDefault()
    console.log('File preso')
    //Processare file per IPFS ()
    const file = event.target.files[0]
    //Serve a convertire il file in un buffer
    const reader = new window.FileReader()
    reader.readAsArrayBuffer(file)
    this.setState({plainText : file.name})
    reader.onloadend = () => {
      this.setState({buffer: Buffer(reader.result)})
    }
  }

  //ESEMPIO: QmaXjyvMqk7th9Bqu5iXxjLn4qAfgzJv8EDBWMrcPzsaTz
  onSubmit = (event) =>{
    event.preventDefault()
    console.log("Invio dati verso IPFS")
    ipfs.add(this.state.buffer, (error, result) => {
      if(error){
        console.error(error)
        return
      }
      console.log('ipfs result', result)
      const actualFile = result[0].hash
      console.log(result[0].hash)
      this.setState({ actualFile: actualFile})
      this.state.contract.methods.addNewFile(this.state.plainText, actualFile).send({from: this.state.account}).then((r) =>{
        console.log("ciao")
        window.log("Caricamento effettuato con successo")
      })
    })

  }

  //<img src={`https://ipfs.infura.io/ipfs/${this.state.actualFile}`} />


  render() {

    return (
      <div>
        <nav className="navbar navbar-dark fixed-top bg-dark flex-md-nowrap p-0 shadow">
          <a
            className="navbar-brand col-sm-3 col-md-2 mr-0"
            href="https://www.cl.cam.ac.uk/~rja14/eternity/eternity.html"
            target="_blank"
            rel="noopener noreferrer"
          >
            Eternity Service
          </a>
          <ul className="navbar-nav px-3">
            <li className="nav-item text-nowrap d-none d-sm-nome d-sm-block">
              <small className="text-white">{this.state.account} </small>
            </li>
          </ul>
        </nav>
        <div className="container-fluid mt-5">

          <div className="row">

            <main role="main" className="col-lg-12 d-flex text-center">


              <div className="content mr-auto ml-auto">


              <form onSubmit={this.onSubmit}>
                <input type='file' onChange={this.captureFile} />
                <input type='submit'  />
              </form>

              </div>

              <div>
                <h2> Utilizzare Infura URL. Ex: "https://ipfs.infura.io/ipfs/QmcZnGMVUvxKYiopjxFnuuTHurRpjuytwNqaM5zAwZqYbP" </h2>
              </div>

            </main>

            <table class="container">
              <thead>
                  <tr>
                      <th>Hash</th>
                      <th>PlainText</th>
                      <th>Sender</th>
                  </tr>
                </thead>
                <tbody>
                  {this.state.list}
                </tbody>
            </table>
          </div>
        </div>
      </div>
    );
  }
}

export default App;
