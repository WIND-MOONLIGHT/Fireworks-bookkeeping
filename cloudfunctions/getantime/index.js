// 云函数入口文件

const cloud = require('wx-server-sdk')
cloud.init()
const db = cloud.database()
const MAX_LIMIT = 100
exports.main = async (event, context) => {
  // 先取出集合记录总数
  const countResult = await db.collection('allCost').count()
  const total = countResult.total
  // 计算需分几次取
  const batchTimes = Math.ceil(total / 100)
  // 承载所有读操作的 promise 的数组
  const tasks = []
  for (let i = 0; i < batchTimes; i++) {
    const promise = db.collection('allCost').where(
      { _openid: event.openid,
        rq:event.date
      }
    ).orderBy('rq', 'desc').skip(i * MAX_LIMIT).limit(MAX_LIMIT).get()
    tasks.push(promise)
  }
  // 等待所有
  return (await Promise.all(tasks)).reduce((acc, cur) => {
    return {
      data: acc.data.concat(cur.data),
      errMsg: acc.errMsg,
    }
  })
}

// const cloud = require('wx-server-sdk')

// cloud.init()
// const  db=cloud.database();

// // 云函数入口函数
// exports.main = async (event, context) => {
//   const wxContext = cloud.getWXContext()
//   var num=event.num;
//   var page=event.page;
//   // var openid=event.openid;
//   // collection 上的 get 方法会返回一个 Promise，因此云函数会在数据库异步取完数据后返回结果
//   // return db.collection(event.collect).where({ _openid: event.openid}).get()
//   return await db.collection("allCost").where({
//     _openid: event.openid,
//     rq: event.date
//   }).get()
// }


