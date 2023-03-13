export class Address {
  constructor(address: string) {
    this.did = address;
  }
  did: string;

  toParam(): string {
    return `{did: '${this.did}'}`;
  }
}
