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

const pow = createPow({ host, authToken: token });

(async function() {
  // const hp=await pow.health.check()
  // console.log('health',hp);
  // const { status, messagesList } = await pow.health.check();

  // console.log("Status: ",status, "messagesList: ",messagesList);

  // pow.setToken(token);

  // const { info } = await pow.ffs.info();

  // console.log('Info ', info);
  // console.log('Info ', info.balancesList[0].addr);

  // const { addrsList } = await pow.ffs.addrs()

  // console.log("addrsList",addrsList);

  // const balance = await pow.wallet.balance(addr);
  // const balance=await pow.wallet.balance(addrsList[0].addr)

  // console.log('balance', balance);

  //create new address
  // try {
  //   const o = await pow.wallet.newAddress();
  //   console.log('NEW ADDRESS', o);
  // } catch (error) {
  //   console.log('ERR newaddr', error.message);
  // }

  // const list=await pow.wallet.list()
  // const balance=await pow.wallet.balance('f3wggaqy4jaelrh3n3s3l6znqpxcv3aa4zuwigysha5c5linfzgh54fwysjxan2jrc53lddsfj2tmetofmun4a')

  // console.log('list',balance);

  //our address
  // f3vxhjb2x4w3q4g6hdbrb3mat5k6jiv64ktrlxem7zor5fzr5dswu3r3wipp7fbrqq2nnf46ntsvlzqjaeeeoa
  // const from =
  // 't3qcgfku4iy275sfnnsz7xuwk2ehawhrbocx5vjfq4xfnrgig4475okevoszubkul6sxoiiqiap3gwrxq5akkq';
  // // 'f3vxhjb2x4w3q4g6hdbrb3mat5k6jiv64ktrlxem7zor5fzr5dswu3r3wipp7fbrqq2nnf46ntsvlzqjaeeeoa';
  // const to =
  //   'f3w24ysoyilwhsjttz7ern5n2ilqjxzpcqbd7jsj7rq4czpf4ogavicfoyeetkcgyaitqidajgux5xf7pb4olq';
  // const amount_sent = 1;

  // try {
  //   const x=await pow.wallet.sendFil(from, to, amount_sent);
  // } catch (error) {
  //   console.log('error: ', error.message);
  // }

  const buffer = fs.readFileSync(asksbids)
  const { cid } = await pow.ffs.stage(buffer)

  console.log("cid",cid)

  const { jobId } = await pow.ffs.pushStorageConfig(cid)

  console.log("jobId",jobId)

  const jobsCancel = pow.ffs.watchJobs((job) => {
    if (job.status === JobStatus.JOB_STATUS_CANCELED) {
      console.log("job canceled")
    } else if (job.status === JobStatus.JOB_STATUS_FAILED) {
      console.log("job failed")
    } else if (job.status === JobStatus.JOB_STATUS_SUCCESS) {
      console.log("job success!")
    }
  }, jobId)

  // const curr_cid = 'Qmc3SHZs5HMTw4GTpPgzQWch6MdH7cY9XZAZ73r7a9HzHf';
  // const binary = await pow.ffs.get(curr_cid);
  // console.log('BINARYU', binary);
})();

// cid Qmc3SHZs5HMTw4GTpPgzQWch6MdH7cY9XZAZ73r7a9HzHf
// jobId d6fa7a99-27c0-41be-91c3-08eb1e10a427

// Info  {
//   id: '31f9c6c6-28be-4a2f-8ac7-b1d4fea919ae',
//   defaultStorageConfig: {
//     hot: { enabled: true, allowUnfreeze: false, ipfs: undefined },
//     cold: { enabled: true, filecoin: [Object] },
//     repairable: false
//   },
//   balancesList: [ { addr: [Object], balance: 4000011111111122 } ],
//   pinsList: [
//     'QmNyNDDk5bxCRQdB5Wuau74sFFC7Sk1Ebttrf4QTiMJp2B',
//     'Qmb6RsFSHzjvdLSSY9yeNjEim1UaBMd2FrsXsJbfs96d1D',
//     'Qmc3SHZs5HMTw4GTpPgzQWch6MdH7cY9XZAZ73r7a9HzHf'
//   ]
// }

// addrsList [
//   {
//     name: 'Initial Address',
//     addr: 't3qcgfku4iy275sfnnsz7xuwk2ehawhrbocx5vjfq4xfnrgig4475okevoszubkul6sxoiiqiap3gwrxq5akkq',
//     type: 'bls'
//   }
// ]

// list {
//   addressesList: [
//     'f122oundgemxqg72m3vot6bcllrrpsdyubt24ti5y',
//     'f13duwcltty4dgyjcnmlecgtds7dwbwfwqujvajlq',
//     'f3qcgfku4iy275sfnnsz7xuwk2ehawhrbocx5vjfq4xfnrgig4475okevoszubkul6sxoiiqiap3gwrxq5akkq',
//     'f3qquc43jfnzxerjb2brmi3qslgrreje2xd3dhro4m4rhjavq6dl3qbl45dzascamceyhuan6etscgihov557a',
//     'f3qwrh4fm2ea3jyhpumi3bluqw2hp6qofc3hkmwz6ngksyybcxwavjt45hi3owz33uax5hqee646enaussqshq',
//     'f3r3tj5cqa6dnte5xsyxbu4l4gpyrjpn3n3z2oujn4ts73op4ysl5wdqhh2hjbyngxvy75z3jyhl5mw6ffbl3a',
//     'f3rjna3ec36z5g3yqkysiivqdz7gdbfuzqlvkv4liqj533ycpxve766rcilxs7dl2xf6jafcztvfkernspkrna',
//     'f3rwsk74o2tan2ksnecxqsgdslyupyt7ffswvncsmr4frqksuloefmofqcng2oixwz5kmz7qqsvliwpppvu2zq',
//     'f3ssel7oikpf23qpoirs4wy57kq35vz47ltnwaa5n3npbglqtonwgfnqgizysmnrnl4kxmfo7j26xswspzysga',
//     'f3unjle5yzlwse3m4npbdtuarmlptmwps6odrtgnzpuwqrrhm4miedwaqcs5ynu4c7ybgbwxtxfml7c57xq5ya',
//     'f3uo5whjnex5x4c3bx3yz3u72gihpi54yuzfcp36neax7dpcdu2hjn2z3lmmvx66npyeojhg7i7tqhtv67umyq',
//     'f3vicp4wh5wjro7gvfd7hlpnmwk5zdxzrqbjapofwzunrlf6qngiw7mqfhliypstjbkvlyddwzxwstkqmnb2uq',
//     'f3vvckwxswhheghckt2cy5zqpsi3mmwolluzjxypzqhz4om5b2rh2qmr2p7uoxhrd6vkazrzaijqrntprobbeq',
//     'f3vxhjb2x4w3q4g6hdbrb3mat5k6jiv64ktrlxem7zor5fzr5dswu3r3wipp7fbrqq2nnf46ntsvlzqjaeeeoa',
//     'f3w24ysoyilwhsjttz7ern5n2ilqjxzpcqbd7jsj7rq4czpf4ogavicfoyeetkcgyaitqidajgux5xf7pb4olq',
//     'f3w6trhnakqmrgafjbbh2bz4sodjhw5u22pueseo2r7l4kdjfpn3yif66ogfy6xbl55temwl3xwzg3urpvqwma',
//     'f3wggaqy4jaelrh3n3s3l6znqpxcv3aa4zuwigysha5c5linfzgh54fwysjxan2jrc53lddsfj2tmetofmun4a',
//     'f3whgkpfmcqsvlrivjuefztsydy7arhgohnmlzbjpwvyd3qhzpaff5evnmc4rjojyucldqk2ii4vr2ml7a3g6a'
//   ]
// }
