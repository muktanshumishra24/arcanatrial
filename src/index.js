import { AuthProvider, CHAIN } from "@arcana/auth";

let provider;
const clientId = "xar_test_54c8c5ea986181f7161ca4062dc96992f32b6c11";
const auth = new AuthProvider(`${clientId}`, {
  //required
  network: "testnet", //defaults to 'testnet'
  position: "right", //defaults to right
  theme: "light", //defaults to dark
  alwaysVisible: true, //defaults to true which is Full UI mode
  chainConfig: {
    chainId: CHAIN.POLYGON_MAINNET, //defaults to CHAIN.ETHEREUM_MAINNET
    rpcUrl: "https://polygon-rpc.com" //defaults to 'https://rpc.ankr.com/eth'
  }
});

const arcanaProvider = await auth.loginWithSocial('google')

const provider = new Web3(arcanaProvider)


async function logout() {
  console.log("Requesting logout");
  try {
    await auth.logout();
    document.querySelector("#result").innerHTML =
      "Logout: You are now logged out!";
  } catch (e) {
    console.log({ e });
  }
}

async function initAuth() {
  console.log("Intantiating Auth... ");
  document.querySelector("#result").innerHTML =
    "Initializing Auth. Please wait...";
  try {
    await auth.init();
    console.log("Init auth complete!");
    document.querySelector("#result").innerHTML =
      "Auth initialized. Now you can continue.";
    console.log({ provider });
  } catch (e) {
    console.log(e);
  }
}

export async function connect() {
  try {
    await auth.connect();
    document.querySelector("#result").innerHTML =
      "Connect: User logged in successfully!";
  } catch (e) {
    console.log(e);
  }
}

async function getAccounts() {
  console.log("Requesting accounts");
  try {
    const accounts = await auth.provider.request({ method: "eth_accounts" });
    console.log({ accounts });
    document.querySelector("#result").innerHTML = accounts[0];
  } catch (e) {
    console.log(e);
  }
}

async function addChain() {
  try {
    await auth.provider.request({
      method: "wallet_addEthereumChain",
      params: [
        {
          chainId: "8081",
          chainName: "Shardeum Liberty 2.X",
          blockExplorerUrls: ["https://explorer-liberty20.shardeum.org/"],
          rpcUrls: ["https://liberty20.shardeum.org/"],
          nativeCurrency: {
            symbol: "SHM"
          }
        }
      ]
    });
    document.querySelector("#result").innerHTML =
      "Shardeum chain added successfully!";
  } catch (e) {
    console.log({ e });
  }
}

async function switchChain() {
  try {
    await auth.provider.request({
      method: "wallet_switchEthereumChain",
      params: [
        {
          chainId: "8081"
        }
      ]
    });
    document.querySelector("#result").innerHTML =
      "Switched to the Shardeum chain successfully!";
  } catch (e) {
    console.log({ e });
  }
}
async function sendTransaction() {
const connectArcana = async () => {
    if(!arcanaProvider) {
      const auth = new AuthProvider(`${process.env.App_ARCANA_APP_ID}`, {
        position: 'right', // defaults to right
        theme: 'dark', // defaults to dark
        alwaysVisible: false,
        chainConfig: {
          chainId: CHAIN.POLYGON_MUMBAI_TESTNET,
          rpcUrl: 'https://rpc-mumbai.maticvigil.com/',
        }
      })

      try {
        await auth.init()
        await auth.connect()
      } catch (e) {
        console.log("Arcana Error: ", e);
      }
      arcanaProvider = auth;
      setIsArcanaLogin(true)
    } else {
      const connected = await arcanaProvider.isLoggedIn()
      if(connected) {
        const arcanaUserInfo = await arcanaProvider.getUser();
        if(arcanaUserInfo) {
          const arcanaPublicKey = arcanaUserInfo.publicKey;
          const hash = await arcanaProvider.provider.request({
            method: 'eth_sendTransaction',
              params: [{
                arcanaPublicKey,
                to: 0xZABABF507273311197d4D14de33C8C9F833C873B,
                value: 0,
            },],
          })
          console.log({ hash })
        }

      }
    }

  };
}


initAuth();

document.querySelector("#Btn-Init-Auth").addEventListener("click", connect);
document
  .querySelector("#Btn-GetAccount")
  .addEventListener("click", getAccounts);
document.querySelector("#Btn-AddChain").addEventListener("click", addChain);
document
  .querySelector("#Btn-SwitchChain")
  .addEventListener("click", switchChain);
document.querySelector("#Btn-Logout").addEventListener("click", logout);
document.querySelector("#Btn-SendT").addEventListener("click", sendTransaction);
