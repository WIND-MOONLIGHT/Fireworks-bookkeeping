// pages/User/User.js
var util=require("../../utils/util")
const db = wx.cloud.database()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    shows:false,
   
    day:'',
    Number:0,
    List:''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

    //获取当前时间
    var d=util.formDate(new Date())
    this.setData({
      day:d
    })
    console.log(this.data.day)

    

  },

  
  onShareAppMessage: function (res) {
    if(res.from=="button"){
      console.log(res.target,res)
    }
    return{
      title:'分享花火，一起记账',
      path:"pages/consume/consume",
      
    }
  },


  
  navigateToTuanzi:function(e){
    wx.navigateTo({
      url: './common/common'
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
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})