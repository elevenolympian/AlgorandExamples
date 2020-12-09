## Algorand Testnet, Betanet and Mainnet Installation for Ubuntu Operating System (Version agnostic)

You should run your own node

### Installation

1. Get a free API Key at [https://example.com](https://example.com)
2. Type the following commands
   ```sudo apt-get update
        sudo apt-get install -y gnupg2 curl software-properties-common
        curl -O https://releases.algorand.com/key.pub
        sudo apt-key add key.pub
        sudo add-apt-repository "deb https://releases.algorand.com/deb/ stable main"
        sudo apt-get update

    sudo apt-get install -y algorand-devtools

    sudo apt-get install -y algorand

    algod -v
   ```

3. Then you should do the next steps

   ```mkdir ~/node
      cd ~/node  
   ```
4. Download your updater script

   ```
    wget https://raw.githubusercontent.com/algorand/go-algorand-doc/master/downloads/installers/update.sh
   ```

5. Give the writing access with the following command

   ```
    chmode 544 update.sh
   ```

6. To install mainnet, you need to type the following command

   ```
    ./update.sh -i -c stable -p ~/node -d ~/node/data -n
   ```

7. If you want to install the Betanet of Algorand, please insert the following command. (You are in the node folder, if not please give ~/node instead of .)
    The -n parameter is to stop automatic network running.

   ```
    ./update.sh -i -c beta -p . -d betanetdata -n -g betanet
   ```

8. If you want to install the Testnet of Algorand, please insert the following command.

      ```
     goal node stop -d data
   ```

   or 

      ```
    goal node stop -d betanetdata
   ```

   follow the instructions

         ```
    mkdir testnetdata
    cp ~/node/genesisfiles/testnet/genesis.json ~/node/testnetdata
   ```

### Starting Node
    To start the test network

    ```goal node start -d ~/node/testnetdata
    goal node status -d ~/node/testnetdata
   ```

    To start the betanet network

    ```
    goal node start -d ~/node/betanetdata
    goal node status -d ~/node/betanetdata
   ```

    To start the mainnet network

    ```
    goal node start -d ~/node/data
    goal node status -d ~/node/data
    ```

### Algorand System Architecture

[![Algorand Network Architecture Screenshot][network-screenshot]](img/Algorand_Networks.png)