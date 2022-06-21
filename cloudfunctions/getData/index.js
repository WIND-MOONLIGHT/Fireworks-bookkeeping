// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init()
const  db=cloud.database();
// 云函数入口函数
exports.main = async (event, context) => {
  var num=event.num;
  var page=event.page;
  // collection 上的 get 方法会返回一个 Promise，因此云函数会在数据库异步取完数据后返回结果
  // return db.collection(event.collect).where({ _openid: event.openid}).get()
  return await db.collection("allCost").skip(page).limit(num).get()
}