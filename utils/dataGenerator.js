const randomDigits = (length) =>
  Array.from({ length }, () => Math.floor(Math.random() * 10)).join('')

export class DataGenerator {
  // Unique per call, so parallel runs never share an identity
  generateMember() {
    const suffix = `${Date.now()}${randomDigits(4)}`
    return {
      firstName: 'Avery',
      lastName: `Tester${randomDigits(3)}`,
      email: `qa+${suffix}@example.com`,
      phone: `555${randomDigits(7)}`,
    }
  }
}
