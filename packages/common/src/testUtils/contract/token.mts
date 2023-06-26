export const testAccount = {
  id: '12D3KooWNgrDJDVXRgmYa3wksK3PFYd1EF2v8NV7c5M7vfcVGqaA',
  privKey:
    'CAESQJ+bYcPsY9FGds42a1ECyzarNxgJ1b847OTFHuURTZFivzr+ODGm7cuaTF8oI4wCNYWefnZLMMc8rZGVEgFhWTs=',
  pubKey: 'CAESIL86/jgxpu3LmkxfKCOMAjWFnn52SzDHPK2RlRIBYVk7',
};

export const code = `
class __contract_class_name__ extends BaseContract {
  constructor(){
      super();
  }
  send = (receiver, amount)=>{
      if (this.balances[this.msg.sender.did] < amount) {
          return false;
      }
      if (!this.balances[receiver.did]) {
          this.balances[receiver.did] = 0n;
      }
      this.balances[receiver.did] += amount;
      this.balances[this.msg.sender.did] -= amount;
      return true;
  };
  getBalance = (address)=>{
      return this.balances[address.did] || 0n;
  };
  __constructor__ = ()=>{
      this.balances = {
          '${testAccount.id}': 10000n
      };
  };
}
`;
