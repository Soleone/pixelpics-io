expect.extend({
  toBe64BitHex (received) {
    const [prefix, bytes] = received.split('x')
    return {
      message: () => `expected ${received} to be 32 characters long hex string starting with 0x`,
      pass: (prefix === '0') && (bytes.length === 32)
    }
  }
})
