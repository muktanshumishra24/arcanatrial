import { AuthProvider, CHAIN } from '@arcana/auth';

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
                to: "0xZABABF507273311197d4D14de33C8C9F833C873B",
                value: 0,
            },],
          })
          console.log({ hash })
        }

      }
    }

  };