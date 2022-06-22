import Moralis from 'moralis/node';

export const getLeaderboardTotal = async (lotteries, from, to) => {
  const combinedEntries = {};
  for (var i = 0; i < lotteries.length; i++) {
    let start = from.toDate().toISOString();
    let end = to.toDate().toISOString();
    let limit = 50;

    const events = await Moralis.Cloud.run("nodeLotteryLeaderboard", {
      start: start,
      end: end,
      limit: limit,
      table: lotteries[i].table,
      entries: lotteries[i].entries,
    });

    events.forEach(event => {
      if (!combinedEntries[event.objectId]) {
        combinedEntries[event.objectId] = {
          wallet: event.objectId,
          entries0: 0,
          entries1: 0,
          entries: 0,
        }
      }
      combinedEntries[event.objectId]['entries' + i] = combinedEntries[event.objectId]['entries' + i] + (event.total * lotteries[i].entries);
      combinedEntries[event.objectId].entries = combinedEntries[event.objectId].entries + (event.total * lotteries[i].entries);
    });
  }

  return Object.values(combinedEntries).sort((a, b) => {
    if (a.entries > b.entries) {
      return -1;
    }
    if (a.entries < b.entries) {
      return 1;
    }
    // a must be equal to b
    return 0;
  });
}
