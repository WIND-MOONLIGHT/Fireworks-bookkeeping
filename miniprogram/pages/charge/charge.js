// pages/charge/charge.js
const db = wx.cloud.database()
var util=require("../../utils/util")
import Dialog from '../../miniprogram_npm/@vant/weapp/dialog/dialog'
Page({
  /**
   * 页面的初始数据
   */
  data: {
    categroy: [
      { text: '餐饮', value: 0 },
      { text: '交通', value: 1 },
      { text: '通讯', value: 2 },
      { text: '购物', value: 3 },
    ],
    categroyIndex: 0,
    payment:[
      { text: '微信', value: 0 },
      { text: '支付宝', value: 1 },
      { text: '银行卡', value: 2 },
      { text: '校园卡', value: 3 },
    ],
    paymentIndex:0,
    array: ['餐饮', '交通', '通讯', '购物','其他'],
    index:0,
    date:"",
    form_info:""
  },
  onLoad: function (options) {
    // var TIME = util.formatTime(new Date());
    // this.setData({
    // time: TIME,
    // });
    //获取当前时间
    var DATE = util.formDate(new Date());
    this.setData({
    date: DATE,
});
  },
  bindPickerChange: function (e) {
    console.log('picker发送选择改变，携带值为', e.detail.value)
    this.setData({
      index: e.detail.value
    })
  },
    bindDateChange: function (e) {
    console.log('picker发送选择改变，携带值为', e.detail.value)
    this.setData({
      date: e.detail.value
    })
  },
  formSubmit: function (res) {
    this.setData({
      form_info:""
    })
    // this.data.cost=res.detail.value.hf
    //  this.data.bzcd=res.detail.value.bz
      let cost=res.detail.value.hf
      let bzcd=res.detail.value.bz
    if (cost == '') {
            Dialog.alert({
                  message: '请输入价格',
                }).then(() => {
                  // on close
                });
                return null
              }
    const exp = /(^[1-9]([0-9]+)?(\.[0-9]{1,2})?$)|(^(0){1}$)|(^[0-9]\.[0-9]([0-9])?$)/;
    exp.test(cost)
    console.log(exp.test(cost))
    if (!exp.test(cost)) {
      // wx.showModal({
      //   content: '请输入正确的金额',
      //   showCancel: true,
      // })
      Dialog.alert({
        message:'请输入正确的金额',
      }).then(() => {
        // on close
      });
      return null
    }
          if(bzcd.length>16){
            Dialog.alert({
              message: '备注太长啦！',
            }).then(() => {
              // on close
            });
            return null
          }
      else{
      var  resValue=res.detail.value
      console.log(resValue)
      wx.showLoading({
        title: '保存中...',
        mask:true
      })
      db.collection("allCost").add({
        data:resValue,
      }).then(res=>{
        wx.hideLoading()
       console.log('form发生了submit事件，携带数据为：', res.detail.value)
      //  that.setData({
      //   form_info:""
      // })
      })
    }
  }


})