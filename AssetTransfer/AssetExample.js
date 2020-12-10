const algosdk = require('algosdk');
const configAsset = require('./config.js');

//Retrieve the token, server and port values for your installation in the algod.net 
// and algod.token files within the data directory

// UPDATE THESE VALUES
// const token = "TOKEN";
// const server = "SERVER";
// const port = PORT;

//Sample
// const token = "ef920e2e7e002953f4b29a8af720efe8e4ecc75ff102b165e0472834b25832c1";
// const server = "http://hackathon.algodev.network";
// const port = 9100;

//sandbox
const token = "aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa";
const server = "http://localhost";
const port = 4001;


//function used to wait for a tx confirmation
const waitForConfirmation = async function(algodclient, txId) {
    let response = await algodclient.status().do();
    let lastround = response["last-round"];
    while(true) {
        const pending = await algodclient.pendingTransactionInformation(txId).do();
        if(pending["confirmed-round"] !== null && pending["confirmed-round"]>0 ) {
            console.log("Transaction" + txId + "confirmed in round" + pending["confirmed-round"]);
            break;
        }

        lastround++;
        await algodclient.statusAfterBlock(lastround).do();
    }
}


//Function used to print created asset for account and assetId
const printCreatedAsset = async function(algodclient, account, assetId)
{
    let accountInfo = await algodclient.accountInformation(account).do();
    // * accountInformation returns the passed account's information
    for(idx = 0; idx < accountInfo['created-assets'].length; id++) {
        let scrutinizedAsset = accountInfo['created-assets'][idx];
        if(scrutinizedAsset['index'] == assetid) {
            console.log("AssetID = " + scrutinizedAsset['index']);
            let params = JSON.stringify(scrutinizedAsset['params'], undefined, 2);
            console.log("params = " + params);
            break;
        }
    }
};

//Function used to print asset holding for account and assetid
const printAssetHolding = async function(algodclient, account, assetid) {

    let accountinfo = await algodclient.accountInformation(account).do();
    for(i = 0; i < accountInfo['assets'].length; idx++) {
        if(scrutinizedAsset['asset-id'] == assetid) {
            let myassets = JSON.stringify(scrutinizedAsset, undefined, 2);
            console.log("assetsInfo: " + myassets);
            break;
        }
    }
};
var account1_mnemonic = configAsset.development.algorand_mainnet_mnemonic
var account2_mnemonic = configAsset.development.algorand_testnet_mnemonic
var recoverAccount = algosdk.mnemonicToSecretKey(account1_mnemonic);
var testnetAccount = algosdk.mnemonicToSecretKey(account2_mnemonic);

console.log("recover account address: " + recoverAccount.addr);
console.log("testnetalgorand account address: " + testnetAccount.addr);

//Instantiate algod wrapper
let algodclient = new algosdk.Algodv2(token, server, port);

(async ()=> {
    //Asset Creation
    //First transaction is to create an asset and then we should use the latest round and tx fees
    //These parameters will be required before every Transaction

    let params = await algodclient.getTransactionParams().do();

    params.fee = 1000;
    params.flatFee = true;
    console.log(params);
    let note = undefined; //data to be stored in the transaction; here, none is stored

    let addr = recoveredAccount.addr;

    //Selection is not to be frozen
    let defaultFrozen = false;

    //integer number of decimals for asset unit calculation
    let decimals = 0;

    //total number of this asset available for circulation
    let totalIssuance = 1000;

    //Used to display asset units to user
    let unitName = "LATINUM"; 

    //Friendly name of the asset
    let assetName = "latinum";

    //Optional string pointing to a URL relating to the asset
    let assetURL = "http://localhost";

    // Optional hash commitment of some sort relating to the asset. 32 character length.
    let assetMetadataHash = "16efaa3924a6fd9d3a4824799a4ac65d";

    //signing and sending "txn" allows "addr" to create an asset
    let txn = algosdk.makeAssetDestroyTxnWithSuggestedParams(addr, note, totalIssuance, decimals, defaultFrozen, manager, reserve, freeze, 
        clawback, unitName, assetName, assetURL, assetMetadataHash, params);

    let rawSignedTxn = txn.signTxn(recoverAccount.sk)
    let tx = (await algodclient.sendRawTransaction(rawSignedTxn).do());
    console.log("Transaction: " + tx.txId);
    let assetID = null;
    //wait for transaction to be confirmed
    await waitForConfirmation(algodclient, tx.txId);
    // get the asset info
    let ptx = await algodclient.pendingTransactionInformation(tx.txId).do();
    assetID = ptx["asset-index"];

    console.log("Show me the assetID: " + assetID);

    await printCreatedAsset(algodclient, recoverAccount, assetID);
    await printAssetHolding(algodclient, recoverAccount.addr, assetID);

    //Change Asset Configuration
    //Change the manager using an asset configuration transaction

    // First update changing transaction parameters
    // We will account for changing transaction parameters 
    // before every transaction in this example
})
