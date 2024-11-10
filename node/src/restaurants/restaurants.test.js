const { getByDate } = require('./restaurants.service.js');

test('adds 1 + 2 to equal 3', async () => {
  expect(await getByDate(new Date('2024-11-09T05:51:39Z'))).toBe(true);
});
