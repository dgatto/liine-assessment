const { getByDate } = require('./restaurants.service.js');

test('returns empty list when no criteria are met', async () => {
  const data = [
    {
      'Restaurant Name': 'Empty List',
      Hours: 'Mon-Thu 11 am - 9:30 pm',
    },
  ];

  expect(await getByDate(new Date('2024-11-10T06:30:00'), data)).toStrictEqual(
    []
  );
});

test('returns expected list when the restaurant is open the entire week (Mon-Sun)', async () => {
  const data = [
    {
      'Restaurant Name': 'Open All Week',
      Hours: 'Mon-Sun 11 am - 9:30 pm',
    },
  ];

  expect(await getByDate(new Date('2024-11-10T06:30:00'), data)).toStrictEqual([
    'Open All Week',
  ]);
});

test('does not return data point if not within time range', async () => {
  const data = [
    {
      'Restaurant Name': 'Morgan St Food Hall',
      Hours: 'Mon-Thu 11 am - 9:30 pm',
    },
  ];

  expect(await getByDate(new Date('2024-11-12T10:30:00'), data)).toStrictEqual(
    []
  );
});

test('returns expected list when given date in format of Day1-Day2 Time1 - Time2', async () => {
  const data = [
    {
      'Restaurant Name': 'Morgan St Food Hall',
      Hours: 'Mon-Thu 11 am - 9:30 pm',
    },
  ];

  expect(await getByDate(new Date('2024-11-12T11:30:00'), data)).toStrictEqual([
    'Morgan St Food Hall',
  ]);
});

test('returns expected list when given date in format of Day1-Day2, Day3 Time1 - Time2', async () => {
  const data = [
    {
      'Restaurant Name': 'Morgan St Food Hall',
      Hours: 'Mon-Thu, Sat 11 am - 9:30 pm',
    },
  ];

  expect(await getByDate(new Date('2024-11-09T11:30:00'), data)).toStrictEqual([
    'Morgan St Food Hall',
  ]);
});

test('returns expected list when given date in format of Day1-Day2, Day3 Time1 - Time2 / Day4 Time1 - Time2', async () => {
  const data = [
    {
      'Restaurant Name': "Beasley's Chicken + Honey",
      Hours: 'Mon-Fri, Sat 11 am - 12 pm  / Sun 11 am - 10 pm',
    },
  ];

  expect(await getByDate(new Date('2024-11-10T11:30:00'), data)).toStrictEqual([
    "Beasley's Chicken + Honey",
  ]);
});

test('returns expected list when given date in format of Day1-Day2, Day3 Time1 - Time2 / Day-Day5 Time1 - Time2', async () => {
  const data = [
    {
      'Restaurant Name': 'Garland',
      Hours: 'Tues-Fri, Sun 11:30 am - 10 pm  / Sat 5:30 pm - 11 pm',
    },
  ];

  expect(await getByDate(new Date('2024-11-10T11:30:00'), data)).toStrictEqual([
    'Garland',
  ]);
});

// ...and more at larger datasets, likely integration tests
