const Transaction = require("./transaction");
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

	createTransaction({ recipient, amount }) {
		if (amount > this.balance) {
			throw new Error("Amount exceeds balance");
		}

		return new Transaction({ senderWallet: this, recipient, amount });
	}

	static calculateBalance({ chain, address }) {
		let outputsTotal = 0;

		for (let i = 1; i < chain.length; i++) {
			const block = chain[i];

			for (let transaction of block.data) {
				const addressOutput = transaction.outputMap[address];

				if (addressOutput) {
					outputsTotal = outputsTotal + addressOutput;
				}
			}
		}

		return STARTING_BALANCE + outputsTotal;
	}
}

module.exports = Wallet;
