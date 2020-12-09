const algosdk = require('algosdk');
const fs = require('fs');
const templates = require('algosdk/src/logicTemplates/templates');

//Some information regarding TEAL

// Current design and implementation limitations to be aware of.

//     TEAL cannot create or change a transaction, only approve or reject.
//     Stateless TEAL cannot lookup balances of Algos or other assets. (Standard transaction accounting will apply after TEAL has run and authorized a transaction. A TEAL-approved transaction could still be invalid by other accounting rules just as a standard signed transaction could be invalid. e.g. I can't give away money I don't have.)
//     TEAL cannot access information in previous blocks. TEAL cannot access most information in other transactions in the current block. (TEAL can access fields of the transaction it is attached to and the transactions in an atomic transaction group.)
//     TEAL cannot know exactly what round the current transaction will commit in (but it is somewhere in FirstValid through LastValid).
//     TEAL cannot know exactly what time its transaction is committed.
//     TEAL cannot loop. Its branch instructions bnz "branch if not zero", bz "branch if zero" and b "branch" can only branch forward so as to skip some code.
//     TEAL cannot recurse. There is no subroutine jump operation.


function recoverUserAccount() {
    //FEEYFVY7T4M742U3PUJ2JOMCGOABZOENTEDFFWTK6XIG3WJHWMY3Y543LA -- address on testnet
    const mnemonic = "prison decade action cancel accuse dinosaur shell flip onion guess pause edit dutch improve shoulder loud violin either leisure globe vehicle train aerobic able until";
    let myAccount = algosdk.mnemonicToSecretKey(mnemonic);
    return myAccount;
}

function recoverOracleAccount() {
	// ZA2Z7WK2YZXM37J475CNOMA452ATJTPZQR35TXBDH7KDGTVZUGMHEW4HDE
	const passphrase = "cherry gap field hope prevent orange worth embrace require bench shallow credit end ill arch rule upset soldier defense artist corn rack embark abstract pulp";
	let myAccount = algosdk.mnemonicToSecretKey(passphrase);
	return myAccount;
}

function recoverSubmitterAccount() {
    // FPW4ZTTXZQ4KEATXWZC2LOQZ4UHCGRJD76A6W23ZMQUGAOGPVKRYLHXKPE
    const passphrase = "chef jaguar symptom dilemma letter puppy dismiss evolve ship marine female repair differ dash popular fortune sock slogan ramp course excite grit work abandon relief";
    let myAccount = algosdk.mnemonicToSecretKey(passphrase);
    return myAccount;
}

var client = null;
var algodClient;
let price = 1154;
let priceExpiration = 20;
let priceDecimals = 10000;
let assetAmount = 5954000;

// Testnet
let assetID = 10295717;
let oracleAccount = recoverOracleAccount();
let subitterAccount = recoverSubmitterAccount();


//Testnet address
let exchangeProgram = new Uint8Array(Buffer.from("ASAGBAIBCKWz9ASQTiYCICFkn8x6bwiE3yb+ZFRuEiYT8zVRwtOSDIqxn92F2FaCIMg1n9laxm7N/Tz/RNcwHO6BNM35hHfZ3CM/1DNOuaGYMgQiEjEWIxIQMRAiEhAzAxAkEhAxATIAEhAzAwcoEhAxCTIDEhAzAQApEhAzAQUVJRIQMREhBBIQMwMIIQULMwEFFwoxEg8Q", "base64"));

async function setupClient() {
    if(client == null) {
        const token = {

        }

        //put the server name
        const server = "https://api.testnet.algoexplorer.io";
        const port = ""; 
        algodClient = new algosdk.Algod(token, server, port);
        client = algodClient;
    } else {
        return client;
    }

    return client;
}

function getInt64Bytes( x, len ){
	if (!len) {
		len = 8;
	}
	var bytes = new Uint8Array(len); // represents an array unsigned 8-byte integers
	do {
		bytes[--len] = x & (255);
		x = x>>8;
	} while ( len )
    return bytes;
}


//Two important functions

var lastPriceRound;
async function priceSubmitter() {

}

async function submitOracleTransaction() {
// The Oracle, a real-world trusted entity, must create a pre-signed
//  transaction with the data included in that transaction,
//   in this case, the price information, and make it available to everyone
}



// setTimeout allows us to run a function once after the interval of time.
// setInterval allows us to run a function repeatedly, starting after the interval of time, then repeating continuously at that interval.
setInterval(submitOracleTransaction);
setTimeout(priceSubmitter);