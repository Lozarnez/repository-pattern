const AddressService = require('@service/address.service');
const { closeDBLogger } = require('@lib');
const { describe, it, expect, beforeAll, afterAll } = require('@jest/globals');
const { MySQLConnection, closeMySQLConnection } = require('@db/connection');

beforeAll(async () => {
  await MySQLConnection('mysql');
});

afterAll(async () => {
  await closeMySQLConnection('mysql');
  closeDBLogger();
});

describe('AddressService', () => {
  describe('getAddress', () => {
    it('should return a list of addresses', async () => {
      const page = 1;
      const limit = 10;
      const address = await AddressService.getAddress({ page, limit });
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
});
