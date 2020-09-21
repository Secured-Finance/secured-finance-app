const { createPow } = require('@textile/powergate-client');
const fs = require('fs');
const {
  JobStatus,
} = require('@textile/grpc-powergate-client/dist/ffs/rpc/rpc_pb');
require('dotenv').config();

const host = process.env.HOST;
const token = process.env.TOKEN;
const addr = process.env.WALLET_ADDRESS;
const asksbids = process.env.ASKBIDS;

const pow = createPow({ host });

(async function(){
  const { status, messagesList } = await pow.health.check();

  console.log("Status: ",status, "messagesList: ",messagesList);

  pow.setToken(token)

  // const { info } = await pow.ffs.info()

  // console.log("Info ",info);

  // const { addrsList } = await pow.ffs.addrs()

  // console.log("addrsList",addrsList);

  const balance=await pow.wallet.balance(addr)

  console.log('balance', balance);

  // const buffer = fs.readFileSync(asksbids)
  // const { cid } = await pow.ffs.stage(buffer)

  // console.log("cid",cid)

  // const { jobId } = await pow.ffs.pushStorageConfig(cid)

  // console.log("jobId",jobId)

  // const jobsCancel = pow.ffs.watchJobs((job) => {
  //   if (job.status === JobStatus.JOB_STATUS_CANCELED) {
  //     console.log("job canceled")
  //   } else if (job.status === JobStatus.JOB_STATUS_FAILED) {
  //     console.log("job failed")
  //   } else if (job.status === JobStatus.JOB_STATUS_SUCCESS) {
  //     console.log("job success!")
  //   }
  // }, jobId)
})()

// cid Qmc3SHZs5HMTw4GTpPgzQWch6MdH7cY9XZAZ73r7a9HzHf
// jobId d6fa7a99-27c0-41be-91c3-08eb1e10a427

// Info  {
//   id: '31f9c6c6-28be-4a2f-8ac7-b1d4fea919ae',
//   defaultStorageConfig: {
//     hot: { enabled: true, allowUnfreeze: false, ipfs: undefined },
//     cold: { enabled: true, filecoin: [Object] },
//     repairable: false
//   },
//   balancesList: [ { addr: [Object], balance: 4000000000000000 } ],
//   pinsList: [
//     'QmNyNDDk5bxCRQdB5Wuau74sFFC7Sk1Ebttrf4QTiMJp2B',
//     'Qmb6RsFSHzjvdLSSY9yeNjEim1UaBMd2FrsXsJbfs96d1D'
//   ]
// }

// addrsList [
//   {
//     name: 'Initial Address',
//     addr: 't3qcgfku4iy275sfnnsz7xuwk2ehawhrbocx5vjfq4xfnrgig4475okevoszubkul6sxoiiqiap3gwrxq5akkq',
//     type: 'bls'
//   }
// ]