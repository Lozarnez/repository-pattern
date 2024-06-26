const AddressRepository = require('@repository/address.repository');
const { closeDBLogger } = require('@lib');
const { describe, it, expect, beforeAll, afterAll } = require('@jest/globals');
const { MySQLConnection, closeMySQLConnection } = require('@db/connection');

// jest.mock('@repository/address.repository');

beforeAll(async () => {
  await MySQLConnection('mysql');
});

afterAll(async () => {
  await closeMySQLConnection('mysql');
  await closeDBLogger();
});

describe('Address Repository', () => {
  describe('findAddress', () => {
    it('should return a list of addresses', async () => {
      const query = { status: 1 };
      const projection = { id: 1, zip: 1, street: 1 };
      const options = { page: 1, limit: 10 };
      const address = await AddressRepository.find(query, projection, options);
      expect(address).toEqual(
        expect.objectContaining({
          count: expect.any(Number),
          // result: expect.any(Array),
          result: expect.arrayContaining([
            expect.objectContaining({
              id: expect.any(Number),
              zip: expect.any(String),
              street: expect.any(String),
            }),
          ]),
          totalPages: expect.any(Number),
        }),
      );
    });
  });
  describe('createAddress', () => {
    it('should create a new address', async () => {
      const address = {
        instanceId: 1,
        locationCode: '000101009',
        stateCode: '25',
        municipalityCode: '01825',
        zip: '12345',
        street: 'Main St',
        exteriorNumber: '123',
        interiorNumber: 'A',
        status: 1,
        // lat: '19.123456',
      };
      const newAddress = await AddressRepository.create(address);
      expect(newAddress).toEqual(expect.any(Number));
    });
  });
});
