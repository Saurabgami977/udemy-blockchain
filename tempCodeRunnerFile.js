expect(
	Block.adjustDifficulty({
		originalBlock: block,
		timestamp: block.timestamp + MINE_RATE - 100,
	}),
).toEqual(block.difficulty + 1);
