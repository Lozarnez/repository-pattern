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

let addressId;

describe('Address Repository', () => {
  describe('createAddress', () => {
    it('should create a new row in Address table', async () => {
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
      addressId = newAddress;
      expect(newAddress).toEqual(expect.any(Number));
    });
  });
  describe('findAddress', () => {
    it('should return a list of addresses', async () => {
      const query = { id: addressId, status: 1 };
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
  describe('updateAddress', () => {
    it('should update an address', async () => {
      const query = { id: addressId };
      const address = {
        status: 2,
        zip: '80127',
      };
      const updatedAddress = await AddressRepository.update(query, address);
      expect(updatedAddress).toEqual(true);
    });
  });
  describe('deleteAddress', () => {
    it('should delete an address', async () => {
      const query = { id: addressId };
      const deletedAddress = await AddressRepository.delete(query);
      expect(deletedAddress).toEqual(true);
    });
  });
});
