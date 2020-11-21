const { createPow } = require("@textile/powergate-client");
const fs = require("fs");
// const {
//   JobStatus,
// } = require('@textile/grpc-powergate-client/dist/ffs/rpc/rpc_pb');
require("dotenv").config();
const getData = require("../misc");

const host = process.env.HOST;
const token = process.env.TOKEN;
const addr = process.env.WALLET_ADDRESS;
const asksbids = process.env.ASKBIDS;

const pow = createPow({ host, authToken: token });

(async function () {
  const data = getData();
  console.log("Data: ", data);

  const addrs = await pow.wallet.addresses();

  console.log(
    "Address Information: ",
    addrs.addressesList[0].address,
    addrs.addressesList[0].balance
  );

  const storageRes = await pow.data.stage(data);

  const { jobId } = await pow.storageConfig.apply(storageRes.cid);
  console.log("jobId: ", jobId);
  console.log("CID: ", storageRes.cid);

  // const s=await pow.storageJobs.storageJob('49053663-c08b-4eb0-932d-26ef47e39f97')
  //   jobId 49053663-c08b-4eb0-932d-26ef47e39f97
  // CID QmUnA4BiLAPgyanocutijhUjFKc8sfP59GsSKRjp9xJwZ1

  const strgJobRes = await pow.storageJobs.storageJob(jobId);
  console.log("stat", strgJobRes);
  console.log("stat", strgJobRes.storageJob.dealInfoList);
  console.log("stat", strgJobRes.storageJob.dealErrorsList);

  await pow.buildInfo();
})();
