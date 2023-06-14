export const testDid = '12D3KooWHdhPrGCqsjD8j6yiHfumdzxfRxyYNPxJKN99RfgtoRuq';

export const code = `
class __contract_class_name__ extends BaseContract {
  constructor(){
      super();
  }
  send = (receiver, amount)=>{
      if (this.balances[this.msg.sender.did] < amount) {
          return;
      }
      if (!this.balances[receiver.did]) {
          this.balances[receiver.did] = 0n;
      }
      this.balances[receiver.did] += amount;
      this.balances[this.msg.sender.did] -= amount;
  };
  getBalance = (address)=>{
      return this.balances[address.did];
  };
  __constructor__ = ()=>{
      this.balances = {
          '12D3KooWHdhPrGCqsjD8j6yiHfumdzxfRxyYNPxJKN99RfgtoRuq': 10000n
      };
  };
}
`;
