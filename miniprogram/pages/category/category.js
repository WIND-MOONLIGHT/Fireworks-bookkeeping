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
    fl: [
      { text: '餐饮', value: 0 },
      { text: '交通', value: 1 },
      { text: '通讯', value: 2 },
      { text: '购物', value: 3 },
    ],
    dataList:[],
    openid:'',
    datee:'',
    dayprice:'查询日期',
    date:'',
    dateee:''
   
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
  
    })
    },

   bindDateChange: function (e) {
    this.globalData = {
    },
     this.globalData.date= e.detail.value
    //  console.log("XXX:"+this.globalData.date)
    this.setData({
      dataList:[]
    })
    console.log('picker发送选择改变，携带值为',e.detail.value)
    this.setData({
      dateee: e.detail.value
    })
    var num=this.data.Number
    var that=this
    db.collection('allCost').count().then(res=>{
      num=res.total
      this.setData({
        Number:num,
        dateee: e.detail.value,
        date:e.detail.value
      })
    const batchTimes = Math.ceil(this.data.Number / 20)
    let arraypro = [] 
    let x = 0 
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
      }
      that.setData({
        dayprice:Cprice,
      })
      console.log(Cprice)
      })
    }
    })
  },
  
 

shanchusuanxin(){
  // var ccc=this.data.dateee
  var bbb=this.data.dateee
  console.log("VVV:"+bbb )
  if(bbb==""){
   this.getData()
  }
  else{
    this.setData({
      dataList:[]
    })  
    var num=this.data.Number
    var that=this
    db.collection('allCost').count().then(res=>{
      num=res.total
      this.setData({
        Number:num,
        date: bbb
      })
    const batchTimes = Math.ceil(this.data.Number / 20)
    let arraypro = [] 
    let x = 0 
    for (let i = 0; i < batchTimes; i++) {
      db.collection('allCost').where({
        rq: bbb,
        _openid: 'o_Pdt5OVHSp9Z2nFMQTAGwwPP4J4'}).skip(i*20).get().then(res=>{
        x+=1
        for(let j=0;j<res.data.length;j++){
          arraypro.push(res.data[j])
        }
        if(arraypro)
        if(x==batchTimes){
          that.setData({
            dataList: arraypro
          })
          console.log(that.data.dataList)
        }
    let Clist=[]
    var Cprice=0
    for(var i in this.data.dataList){
      if(this.data.dataList[i].rq==bbb){
        // list.push(this.data.dataList[i])
        Clist.push(this.data.dataList[i])
        Cprice= Cprice+parseFloat(this.data.dataList[i].hf)
      }
      }
      that.setData({
        dayprice:Cprice,
        dataList:Clist,
        date:this.data.date,
        bbb:"",
        dateee:""
      })
      console.log(Cprice)
      })
    }
    })
  }
  this.setData({
    dateee:""
  })
  },
  delete: function(e){
    var _this=this
    wx.showModal({
          title: '提示',
          content: '是否删除这条记录',
          success (res) {
            if (res.confirm) {
              wx.cloud.callFunction({
                name:"delete",
                data:{
                  id: e.currentTarget.id,
                }
              }).then(res=>{
              _this.shanchusuanxin()
              })
             
                    } else if (res.cancel) {
                      console.log('用户点击取消')
                    }
                  }
                })

    
  },


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
     dayprice:'请选择日期',
     dateee:""
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

  
  onShareAppMessage: function () {

  }
})



