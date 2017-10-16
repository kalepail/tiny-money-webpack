import Vue from 'vue/dist/vue.esm';

const Plaid = window.Plaid;

export default function($Vue) {
  const connect_handler = Plaid.create({
    env: 'development',
    key: 'a9ff30905d0f92def83a5b491b5897',
    product: ['transactions'],
    webhook: 'https://tiny.money/webhooks/plaid',
    clientName: 'Tiny Money',
    selectAccount: false,
    apiVersion: 'v2',
    onSuccess(public_token, metadata) {
      $Vue.$http.post(`${$Vue.tmUser}/banks/exchange`, {
        public_token: public_token,
        name: metadata.institution.name
      })
      .then((res) => {
        console.log(res.data);
        $Vue.refresh();
      })
      .catch((err) => {
        console.error(err.data);
        $Vue.logout();
      });
    }
  });
  
  $Vue.connectPlaid = () => {
    connect_handler.open();
  }
  
  $Vue.reconnectPlaid = (bank) => {
    Vue.set(bank, 'loading', true);
  
    $Vue.$http.get(`banks/${bank._id}/exchange`)
      .then((res) => {
        const reconnect_handler = Plaid.create({
          env: 'development',
          key: 'a9ff30905d0f92def83a5b491b5897',
          product: ['transactions'],
          clientName: 'Tiny Money',
          apiVersion: 'v2',
          token: res.data.public_token,
          onSuccess(public_token, metadata) {
            console.log(public_token, metadata);

            $Vue.$http.get('ping')
              .then((res) => {
                bank.loading = false;
                console.log(res.data);
                $Vue.refresh();
              })
              .catch((err) => {
                bank.loading = false;
                console.error(err.data);
                $Vue.logout();
              });
          },
          onExit(err, metadata) {
            console.error(err);
            console.log(metadata);
            bank.loading = false;
          }
        });
  
        reconnect_handler.open();
      })
      .catch((err) => {
        bank.loading = false;
        console.error(err.data);
        $Vue.logout();
      });
  }
}