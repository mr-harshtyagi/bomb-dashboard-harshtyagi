Moralis.Cloud.beforeSaveFile((request) => {
  throw "Not Allowed";
});

Moralis.Cloud.define("nodeLotteryLeaderboard", async (request) => {
  let start = new Date(request.params.start).toISOString();
  let end = new Date(request.params.end).toISOString();
  let limit = request.params.limit;
  let table = request.params.table;

  const pfilter = {
    match: {
      $expr: {
        $and: [
          { $gte: ["$_created_at", { "$toDate": start }] },
          { $lte: ["$_created_at", { "$toDate": end }] }
        ]
      }
    }
  };
  const pgroup = { group: { objectId: "$account", total: { $sum: {$toLong : '$num' } } } };
  const psort = { sort : { total: -1 } };
  const plimit = { limit: limit };
  const pipeline = [pfilter, pgroup, psort, plimit];

  const query = new Moralis.Query(table);
  return await query.aggregate(pipeline, { useMasterKey: true });
});
