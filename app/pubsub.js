const redis = require("redis");

const CHANNEL = {
	TEST: "TEST",
	BLOCKCHAIN: "BLOCKCHAIN",
	TRANSACTION: "TRANSACTION",
};

class PubSub {
	constructor({ blockchain, transactionPool }) {
		this.blockchain = blockchain;
		this.transactionPool = transactionPool;

		this.publisher = redis.createClient();
		this.subscriber = redis.createClient();

		this.subscribeToChannels();

		this.subscriber.on("message", (channel, message) =>
			this.handleMessage(channel, message),
		);
	}

	handleMessage = (channel, message) => {
		console.log(`Message received. Channel: ${channel}, message: ${message}`);

		const parsedMessage = JSON.parse(message);

		switch (channel) {
			case CHANNEL.BLOCKCHAIN:
				this.blockchain.replaceChain(parsedMessage);
				break;
			case CHANNEL.TRANSACTION:
				this.transactionPool.setTransaction(parsedMessage);
				break;
			default:
				return;
		}
	};

	subscribeToChannels() {
		Object.values(CHANNEL).forEach((channel) => {
			this.subscriber.subscribe(channel);
		});
	}

	publish({ channel, message }) {
		this.subscriber.unsubscribe(channel, () => {
			this.publisher.publish(channel, message, () => {
				this.subscriber.subscribe(channel);
			});
		});
	}

	broadcastChain() {
		this.publish({
			channel: CHANNEL.BLOCKCHAIN,
			message: JSON.stringify(this.blockchain.chain),
		});
	}

	broadcastTransaction(transaction) {
		this.publish({
			channel: CHANNEL.TRANSACTION,
			message: JSON.stringify(transaction),
		});
	}
}

module.exports = PubSub;
