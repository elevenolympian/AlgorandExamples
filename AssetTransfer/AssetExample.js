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
//var account1_mnemonic = configAsset.development.algorand_mainnet_mnemonic
var testnetalgosigner_mnemonic = configAsset.development.algorand_testnetalgosigner_mnemonic
var testnetsecondaccount_mnemonic = configAsset.development.algorand_testnetsecondaccount_mnemonic
//var mainnnetAccount = algosdk.mnemonicToSecretKey(account1_mnemonic);
var testnetalgosigner = algosdk.mnemonicToSecretKey(testnetalgosigner_mnemonic);
var testnetsecondaccount = algosdk.mnemonicToSecretKey(testnetsecondaccount_mnemonic);

//console.log("recover account address: " + recoverAccount.addr);
console.log("testnetalgosigner account address: " + testnetalgosigner.addr)
console.log("testnetsecondaccount account address: " + testnetsecondaccount.addr);

//Instantiate algod wrapper
let algodclient = new algosdk.Algodv2(token, server, port);

//Create transaction function 
//1) Configure fields for creating the asset.
//2) Account 1 creates an asset called latinum and sets Account 2 as the manager, reserve, freeze and clawback address 

(async ()=> {
    //Asset Creation
    //First transaction is to create an asset and then we should use the latest round and tx fees
    //These parameters will be required before every Transaction

    let params = await algodclient.getTransactionParams().do();

    params.fee = 1000;
    params.flatFee = true;
    console.log(params);
    let note = undefined; //data to be stored in the transaction; here, none is stored

    let addr = testnetalgosigner.addr;

    // Selection is not to be frozen
    let defaultFrozen = false;

    // Integer number of decimals for asset unit calculation
    let decimals = 0;

    // Total number of this asset available for circulation
    let totalIssuance = 1000;

    // Used to display asset units to user
    let unitName = "LATINUM"; 

    // Friendly name of the asset
    let assetName = "latinum";

    // Optional string pointing to a URL relating to the asset
    let assetURL = "http://localhost";

    // Optional hash commitment of some sort relating to the asset. 32 character length.
    let assetMetadataHash = "16efaa3924a6fd9d3a4824799a4ac65d";

    // The following parameters are the only ones that can be changed, and they have to be changed by the current manager.
    // Specified address can change reserve, freeze, clawback, and manager -- The following account is the account second

    let manager = testnetsecondaccount.addr;
    // Specified address is considered the asset reserve (it has no special privileges, this is only informational. )
    let reserve = testnetsecondaccount.addr;
    //Specified address can freeze or unfreeze user asset holdings
    let freeze = testnetsecondaccount.addr;
    //Specified address can revoke user asset holdings and send them to other addresses
    let clawback = testnetsecondaccount.addr;  

    //signing and sending "txn" allows "addr" to create an asset
    let txn = algosdk.makeAssetDestroyTxnWithSuggestedParams(addr, note, totalIssuance, decimals, defaultFrozen, manager, reserve, freeze, 
        clawback, unitName, assetName, assetURL, assetMetadataHash, params);

    let rawSignedTxn = txn.signTxn(testnetalgosigner.sk)
    let tx = (await algodclient.sendRawTransaction(rawSignedTxn).do());
    console.log("Transaction: " + tx.txId);
    let assetID = null;
    //wait for transaction to be confirmed
    await waitForConfirmation(algodclient, tx.txId);
    // get the asset info
    let ptx = await algodclient.pendingTransactionInformation(tx.txId).do();
    assetID = ptx["asset-index"];
    console.log("Show me the assetID: " + assetID);

    await printCreatedAsset(algodclient, testnetalgosigner.addr, assetID);
    await printAssetHolding(algodclient, testnetalgosigner.addr, assetID);

    //Change Asset Configuration
    //Change the manager using an asset configuration transaction

    // First update changing transaction parameters
    // We will account for changing transaction parameters 
    // before every transaction in this example

    params = await algodclient.getTransactionParams().do();
    //comment out the next two lines to use suggested fee
    params.fee = 1000;
    params.flatFee = true; 

    //Asset configuration specific parameters
    manager = testnetalgosigner.addr;

    let ctxn = algosdk.makeAssetConfigTxnWithSuggestedParams(testnetsecondaccount.addr, note, assetID, manager, reserve, freeze, clawback, params);

    //This transaction must be signed by the current manager
    rawSignedTxn = ctxn.signTxn(testnetsecondaccount.sk);
    let ctx = (await algodclient.sendRawTransaction(rawSignedTxn.do()));
    console.log("Transaction: " + ctx.txId);
    await waitForConfirmation(algodclient, ctx.txId);

    //Get the asset information for the newly changed asset using indexer of utility function of Account info
    //The manager should be the same as the creator
    await printCreatedAsset(algodclient, testnetalgosigner.addr, assetID);


})().catch(e => {
    console.log(e);
    console.trace();
});
