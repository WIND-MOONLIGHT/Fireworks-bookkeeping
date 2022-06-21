// pages/category/category.js
// const db = wx.cloud.database()
// const _=db.command;
const app = getApp()
const db = wx.cloud.database()
var util=require("../../utils/util")
Page({
  /**
   * 页面的初始数据
   */
  data: {
    img1:  'cloud://cloud1-7gko5ynq797bcfa6.636c-cloud1-7gko5ynq797bcfa6-1305669469/图表库/canying.png',
    img2:'cloud://cloud1-7gko5ynq797bcfa6.636c-cloud1-7gko5ynq797bcfa6-1305669469/图表库/交通.png',
    img3:'cloud://cloud1-7gko5ynq797bcfa6.636c-cloud1-7gko5ynq797bcfa6-1305669469/图表库/通讯.png',
    img4:'cloud://cloud1-7gko5ynq797bcfa6.636c-cloud1-7gko5ynq797bcfa6-1305669469/图表库/购物.png',
    img5:'cloud://cloud1-7gko5ynq797bcfa6.636c-cloud1-7gko5ynq797bcfa6-1305669469/图表库/其他.png',
    // {
    //   '餐饮': 'cloud://cloud1-7gko5ynq797bcfa6.636c-cloud1-7gko5ynq797bcfa6-1305669469/餐饮.jpg',
    //   '交通': 'cloud://cloud1-7gko5ynq797bcfa6.636c-cloud1-7gko5ynq797bcfa6-1305669469/交通.jpg',
    //   '通讯': 'cloud://cloud1-7gko5ynq797bcfa6.636c-cloud1-7gko5ynq797bcfa6-1305669469/通讯.jpg',
    //   '购物': 'cloud://cloud1-7gko5ynq797bcfa6.636c-cloud1-7gko5ynq797bcfa6-1305669469/购物.jpg'
    // },
    fl: [
      { text: '餐饮', value: 0 },
      { text: '交通', value: 1 },
      { text: '通讯', value: 2 },
      { text: '购物', value: 3 },
    ],
    dataList:[],
    openid:'',
    datee:'',
    dayprice:'请选择日期',
    date:''
  },
  onLoad: function (options) {
    this.getData()
   //获取当前时间
    var DATE = util.formDate(new Date());
     this.setData({
     date: DATE,
});
  },
  getData(){
    // this.setData({
    //   dataList:[]
    // })
    wx.cloud.callFunction({
      name:"getallcost",
      data:{
        openid: app.globalData.openid,
      }
    }).then(res=>{
      var Data=res.result.data
      // var newData=oldData.concat(res.result.data)
      // console.log(res.result.data)
      this.setData({
        dataList:Data
      })
    //   var DATE = util.formDate(new Date());
    //   let Clist=[]
    //   var Cprice=0
    // for(var i in this.data.dataList){
    //   if(this.data.dataList[i].rq==DATE){
    //     Clist.push(this.data.dataList[i])
    //     Cprice= Cprice+parseInt(this.data.dataList[i].hf)
    //   }
    //   }
    //   this.setData({
    //     // CYlist:Clist,
    //     dayprice:Cprice,
    //   })
    //   console.log(Cprice)
      // console.log(this.data.CYlist)
      // console.log(this.data.JTList)
    })
    },
   bindDateChange: function (e) {
    this.setData({
      dataList:[]
    })
    console.log('picker发送选择改变，携带值为', e.detail.value)
    this.setData({
      date: e.detail.value
    })
    var num=this.data.Number
    var that=this
    db.collection('allCost').count().then(res=>{
      num=res.total
      this.setData({
        Number:num,
        date: e.detail.value
      })
    const batchTimes = Math.ceil(this.data.Number / 20)//计算需要获取几次  比如你有36条数据就要获取两次 第一次20条第二次16条
    let arraypro = [] // 定义空数组 用来存储每一次获取到的记录 
    let x = 0 //这是一个标识每次循环就+1 当x等于batchTimes 说明已经到了最后一次获取数据的时候
    for (let i = 0; i < batchTimes; i++) {
      db.collection('allCost').where({
        rq: e.detail.value,
        _openid: 'o_Pdt5OVHSp9Z2nFMQTAGwwPP4J4'}).skip(i*20).get().then(res=>{
        x+=1
        for(let j=0;j<res.data.length;j++){
          arraypro.push(res.data[j])
        }
        // if(arraypro)
        if(x==batchTimes){
          that.setData({
            dataList: arraypro
          })
          console.log(that.data.dataList)
        }
    let Clist=[]
    var Cprice=0
    for(var i in this.data.dataList){
      if(this.data.dataList[i].rq==e.detail.value){
        Clist.push(this.data.dataList[i])
        Cprice= Cprice+parseFloat(this.data.dataList[i].hf)
        
      }
      // that.setData({
      //     dayprice: Cprice
      //   })
      //   console.log(Cprice)
      }
      that.setData({
        // CYlist:Clist,
        dayprice:Cprice,
      })
      console.log(Cprice)
      // console.log(this.data.CYlist)
      // console.log(this.data.JTList)
      })
    }
    })
  },
  
  delete: function(e) {
    wx.showModal({
      title: '提示',
      content: '是否删除这条记录',
      success (res) {
        if (res.confirm) {
          console.log("_id=" + e.currentTarget.id)
          wx.cloud.callFunction({
            name:"delete",
            data:{
              id: e.currentTarget.id,
            }
          }).then(res=>{
          })
          
        } else if (res.cancel) {
          console.log('取消')
        }
        // this.getData()
      }
    })
    console.log("_id=" + e.currentTarget.id)
    wx.cloud.callFunction({
      name:"delete",
      data:{
        id: e.currentTarget.id,
      }
    }).then(res=>{
      this.getData()
    })

  },

  


    // wx.cloud.callFunction({
    //   name:"getantime",
    //   data:{
    //     num:num,
    //     page:page,
    //     openid: app.globalData.openid,
    //     date:e.detail.value,
    //   }
    // }).then(res=>{
    //   var oldData=this.data.dataList
    //   var newData=oldData.concat(res.result.data)
    //   // console.log(res.result.data)
    //   this.setData({
    //     dataList:newData
    //   })
    //   })
  // formSubmit: function (e,num=5,page=0) {
  // // // anshijian(res,num=5,page=0){
  //   // var  resValue=res.detail.date
  //   // console.log(resValue)
  //   wx.showLoading({
  //     title: '查询中...',
  //     mask:true
  //   })
  //   wx.cloud.callFunction({
  //     name:"getantime",
  //     data:{
  //       num:num,
  //       page:page,
  //       openid: app.globalData.openid,
  //       date:resValue,
  //     }
  //   }).then(res=>{
  //     var oldData=this.data.dataList
  //     var newData=oldData.concat(res.result.data)
  //     // console.log(res.result.data)
  //     this.setData({
  //       dataList:newData
  //     })
  //     })
  // },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    this.getData()
    var DATE = util.formDate(new Date());
     this.setData({
     date: DATE,
     })

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  // onReachBottom: function () {
  //   var page=this.data.dataList.length
  //   this.getData(5,page)
  //   // console.log(123)
  // },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})



// formSubmit: function (e) {
  //     console.log('form发生了submit事件，携带数据为：', e.detail.value)
  //   },
  /**
   * 生命周期函数--监听页面加载
   */
//   onLoad: function (options) {
//     // var TIME = util.formatTime(new Date());
//     // this.setData({
//     // time: TIME,
//     // });
//     this.getData()
// //     //获取当前时间
//     var DATE = util.formDate(new Date());
//      this.setData({
//      date: DATE,
// });
//   },
  // formsubmit: function (res) {
  //   var  resValue=res.detail.value
  //   console.log(resValue)
  //   },

  //z最早的本地调用的输出
//   getData(){
//     db.collection("allCost")
//     .get()
//    .then(res=>{
//     this.setData({
//       dataList:res.data
//     })
// })
//   },