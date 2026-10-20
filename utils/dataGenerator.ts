export type Member = {
  firstName: string
  lastName: string
  email: string
  phone: string
}

const randomDigits = (length: number): string =>
  Array.from({ length }, () => Math.floor(Math.random() * 10)).join('')

export class DataGenerator {
  generateMember(): Member {
    const suffix = `${Date.now()}${randomDigits(4)}`
    return {
      firstName: 'Avery',
      lastName: `Tester${randomDigits(3)}`,
      email: `qa+${suffix}@example.com`,
      phone: `555${randomDigits(7)}`,
    }
  }
}
