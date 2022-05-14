const crypto = require("crypto");

const cryptoHash = (...props) => {
	const hash = crypto.createHash("sha256");

	hash.update(props.sort().join(" "));

	return hash.digest("hex");
};

module.exports = cryptoHash;
