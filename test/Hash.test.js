//Classe di test da usare con Truffle, permette di testare i comandi di uno smart contracts

const UploadHash = artifacts.require("UploadHash");

//Chai è una libreria per effettuare uguaglianze o verificare valori di variabili
require('chai')
      .use(require("chai-as-promised"))
      .should()

contract('UploadHash', (accounts) => {
    let tmpHash

    before(async() =>{
      tmpHash = await UploadHash.deployed()
    })

    //Describe serve per organizzare il test
    describe('deployment', async() =>{
      it('deploy completato', async() =>{
          const address = tmpHash.address
          assert.notEqual(address, 0x0)
          assert.notEqual(address, null)
          assert.notEqual(address,'')
          assert.notEqual(address, null)
          assert.notEqual(address,'')
          assert.notEqual(address, undefined)
          console.log(address)
        })
    })

    describe('storage', async() => {
      it("Valore caricato con successo", async() => {
        let hash
        hash = 'hash di prova'
        await tmpHash.set(hash)
        const result = await tmpHash.get()
        assert.equal(result, hash)
      })
    })
})
