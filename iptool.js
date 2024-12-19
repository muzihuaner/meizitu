const instance = require('./axios.js');
const { getIpTool } = require('./request.js')


let ipList = []

async function getIpList() {
  const res = await getIpTool()
  console.log(res.data)
}

getIpList()