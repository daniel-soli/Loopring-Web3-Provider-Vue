<template>
    <div>
      <v-dialog max-width="400px" v-model="show"
        :dialog="dialog"
      >
        <v-card v-if="!isLoggedIn">
          <v-card-title>Log in</v-card-title>
          
          <div class="flex">
            <div class="flex">
              <button @click="walletConnect">
                <img
                  src="https://static.loopring.io/assets/svg/wallet-connect.svg"
                  alt="walletConnect"
                  height="36"
                />
              </button>
              <button @click="gamestop" >
                <img
                  src="https://static.loopring.io/assets/svg/gs.svg"
                  alt="Gamestop"
                  height="36"
                />
              </button>
              <button @click="metaMask">
                <img
                  src="https://static.loopring.io/assets/svg/meta-mask.svg"
                  alt="MetaMask"
                  height="36"
                />
              </button>
            </div>
            
          </div>
          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn color="primary" flat @click.stop="show=false, showQr=false">Close</v-btn>
          </v-card-actions>
        </v-card>
        <v-card v-if="isLoggedIn">
          <v-card-text>
            Logged in as: {{ getUserName }}
          </v-card-text>
          <!-- <v-card-text>
            <v-btn color="primary" flat @click="unlock">Unlock</v-btn>
          </v-card-text> -->
          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn color="primary" flat @click="disconnect">Disconnect</v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>
      <v-snackbar
        v-model="snackBar"
        :timeout="2000" :color="snackBarColor"
        >
        {{ snackBarText }}
  
            <template v-slot:actions>
                <v-btn
                color="blue"
                variant="text"
                @click="snackBar = false"
                >
                Close
                </v-btn>
            </template>
        </v-snackbar>
    </div>
  </template>
  
  <script lang="ts">
  import { walletServices, connectProvides, ConnectProvides } from "@loopring-web/web3-provider";
  import { Subscription } from "rxjs";
  import {defineComponent} from 'vue'
  //import { web3modal } from "./WalletConnectConfig";
  
  
  export default defineComponent ({
    name: "WalletProvider",
    props: {
      dialog: {type: Boolean, default: false}
    },
    data() {
      return {
        subscription: new Subscription,
        showQr: false,
        snackBar: false,
        snackBarText: '',
        snackBarColor: '',
        isLoggedIn: false,
      };
    },
    methods: {
      handleError: (data: any) => {
        console.log("handleError", data);
      },
      handleProcessing(data: any) {
        this.showQr = true;
      },
      async handleAccountDisconnect() {
        console.log("handleAccountDisconnect");
        this.$emit("loginEvent", false)
        sessionStorage.removeItem("address");
        this.isLoggedIn = false;
      },
      async handleConnect({accounts, provider, chainId}){
        try {
          this.snackBarColor = 'green';
          this.snackBarText = 'Logged in';
          this.snackBar = true;
          this.show = false;
          this.$emit("loginEvent", true)
          this.isLoggedIn = true;
          sessionStorage.setItem("address", accounts[0]);
          await this.$router.push("/");
        }
        catch (error){
          this.snackBarColor = 'red';
          this.snackBarText = "Could not log in";
          this.snackBar = true;
          this.show = false;
          this.isLoggedIn = false;
        }
      },
      async walletConnect() {
        walletServices.sendDisconnect("", "set new provider");
        ConnectProvides.APP_FRAMEWORK = "VUE_APP_";
        await connectProvides.WalletConnect({ account: undefined, darkMode: true });
      },
      metaMask: async () => {
        walletServices.sendDisconnect("", "should new provider");
        await connectProvides.MetaMask({darkMode: true});
      },
      gamestop: async () => {
        walletServices.sendDisconnect("", "set new provider");
        await connectProvides.GameStop({darkMode: true});
      },
      async disconnect() {
        await walletServices.sendDisconnect("", "disconnect");
        this.show = false;
        window.location.href = '/';
        //await this.$router.push("/");
      },
      checkIsLoggedIn(){
        var token = sessionStorage.getItem("token");
        if (token === "" || token === null){
          this.isLoggedIn = false;
        }
        else{
          this.isLoggedIn = true;
        }
      }
    },
    computed: {
      getUserName() {
        var user = sessionStorage.getItem("address");
  
        return user;
      },
      show: {
        get() { 
          return this.dialog;
        }, 
        set(val: Boolean) {
          this.$emit('updateDialog', false);
        }
      }
    },
    async beforeMount() {
      this.checkIsLoggedIn();
      const subject = walletServices.onSocket();
      this.subscription = subject.subscribe(({ data, status }) => {
        switch (status) {
          case "Error":
            this.handleError(data);
            break;
          case "Processing":
            this.handleProcessing(data);
            break;
          case "ConnectWallet": {// provider, accounts, chainId, networkId
            const { accounts, provider, chainId } = data
              ? data
              : {
                  accounts: undefined,
                  provider: undefined,
                  chainId: 1,
                };
            this.handleConnect({ accounts, provider, chainId });
            break;}
          case "DisConnect":
            this.handleAccountDisconnect();
            break;
          default:
        }
      });
    },
    async onBeforeUnmount() {
      this.subscription.unsubscribe();
    },
  });
  </script>
    
    <!-- Add "scoped" attribute to limit CSS to this component only -->
    <style scoped>
    h3 {
      margin: 40px 0 0;
    }
    ul {
      list-style-type: none;
      padding: 0;
    }
    li {
      display: inline-block;
      margin: 0 10px;
    }
    a {
      color: #42b983;
    }
    .flex {
      display: flex;
      flex-direction: column;
    }
    button {
      margin-top: 10px;
    }
    </style>
    
  