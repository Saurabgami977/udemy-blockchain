const cryptoHash = require('./crypto-hash')

describe('cryptoHash()', () => {
    it('generates a SHA-256 hashed output', () => {
        expect(cryptoHash('saurab')).toEqual('925f24891fda66dafa132acebcfdc02f4411c4dd4def6582e2d11649f434b284')
    })


    it('produces the same hash with the same input arguments in any order', () => {
        expect(cryptoHash('one', 'two', 'three')).toEqual(cryptoHash('one', 'two', 'three'))
    })
})