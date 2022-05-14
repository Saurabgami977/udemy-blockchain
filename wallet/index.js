const { STARTING_BALANCE } = require("../config");
const { ec, cryptoHash } = require("../utils");

class Wallet {
	constructor() {
		this.balance = STARTING_BALANCE;

		this.keypair = ec.genKeyPair();

		this.publicKey = this.keypair.getPublic().encode("hex");
	}

	sign(data) {
		return this.keypair.sign(cryptoHash(data));
	}
}

module.exports = Wallet;
