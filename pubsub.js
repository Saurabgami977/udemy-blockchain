const redis = require("redis");

const CHANNEL = {
	TEST: "TEST",
	BLOCKCHAIN: "BLOCKCHAIN",
};

class PubSub {
	constructor({ blockchain }) {
		this.blockchain = blockchain;

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

		if (channel === CHANNEL.BLOCKCHAIN) {
			this.blockchain.replaceChain(parsedMessage);
		}
	};

	subscribeToChannels() {
		Object.values(CHANNEL).forEach((channel) => {
			this.subscriber.subscribe(channel);
		});
	}

	publish({ channel, message }) {
		this.publisher.publish(channel, message);
	}

	broadcastChain() {
		this.publish({
			channel: CHANNEL.BLOCKCHAIN,
			message: JSON.stringify(this.blockchain.chain),
		});
	}
}

module.exports = PubSub;
