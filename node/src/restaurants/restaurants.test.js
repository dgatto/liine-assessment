const { getByDate } = require('./restaurants.service.js');

test('returns expected list when given date in format of Day1-Day2 Time1 - Time2', async () => {
  const data = [
    {
      'Restaurant Name': 'Morgan St Food Hall',
      Hours: 'Mon-Sun 11 am - 9:30 pm',
    },
  ];

  expect(await getByDate(new Date('***'), data)).toBe([]);
});

test('returns expected list when given date in format of Day1-Day2, Day3 Time1 - Time2', async () => {
  const data = [
    {
      'Restaurant Name': 'Morgan St Food Hall',
      Hours: 'Mon-Sun 11 am - 9:30 pm',
    },
  ];

  expect(await getByDate(new Date('***'), data)).toBe([]);
});

test('returns expected list when given date in format of Day1-Day2, Day3 Time1 - Time2 / Day4 Time1 - Time2', async () => {
  const data = [
    {
      'Restaurant Name': "Beasley's Chicken + Honey",
      Hours: 'Mon-Fri, Sat 11 am - 12 pm  / Sun 11 am - 10 pm',
    },
  ];

  expect(await getByDate(new Date('***'), data)).toBe([]);
});

test('returns expected list when given date in format of Day1-Day2, Day3 Time1 - Time2 / Day-Day5 Time1 - Time2', async () => {
  const data = [
    {
      'Restaurant Name': 'Garland',
      Hours: 'Tues-Fri, Sun 11:30 am - 10 pm  / Sat 5:30 pm - 11 pm',
    },
  ];

  expect(await getByDate(new Date('***'), data)).toBe([]);
});

// ...and more at larger datasets
