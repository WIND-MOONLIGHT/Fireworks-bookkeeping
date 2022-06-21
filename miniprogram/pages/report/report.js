// pages/report/report.js
// const db=wx.cloud.database()//链接数据库 用var可覆盖
var util=require("../../utils/util")
const db = wx.cloud.database()
var wxCharts = require('../../utils/wxcharts-min.js');
var app = getApp();
var columnChart = null;
// var categoryPrice=250
// var chartData = {
//   main: {
//     title: '月消费报表',
//     // data: [15, 20, 45, 37],
//     // categories: ['1日', '2日', '3日', '4日']
//   }
// };
Page({
  data: {
    img1:'cloud://cloud1-7gko5ynq797bcfa6.636c-cloud1-7gko5ynq797bcfa6-1305669469/canying.png',
    array1:['','01','02','03','04','05','06','07','08','09','10','11','12','13','14','15','16','17','18','19','20','21','22','23','24'
      ,'25','26','27','28','29','30','31'],
    array2:['','01','02','03','04','05','06','07','08','09','10','11','12','13','14','15','16','17','18','19','20','21','22','23','24'
      ,'25','26','27','28','29','30'],
    array3:['','01','02','03','04','05','06','07','08','09','10','11','12','13','14','15','16','17','18','19','20','21','22','23','24'
    ,'25','26','27','28','29'],
    array4:['','01','02','03','04','05','06','07','08','09','10','11','12','13','14','15','16','17','18','19','20','21','22','23','24'
      ,'25','26','27','28'],
    chartTitle: '月消费报表',
    chartQTtitle:'七日支出',
    head0: 'head_item head_itemActive',//两个样式
    head1: 'head_item',
    Number:0,//查询到的数据库总数
    CYlist:'',
    Cprice:0, 
    JTList:"",
    TXList:"",
    ShoppingList:"",
    QTList:"",
    ShoppingPrice:0,
    JTPrice:0,
    QTPrice:0,
    TXPrice:0,
    Fmax:0,
    List:'',//查询到的所有信息列表
    // dataList:[],
    date:'',//当前月份
    allcost:0,
    day:'',//当天日期
    dayList:[],//七天数组
    dayCost:[],//七天花费
    flagcolumn:false,//是否画柱状图
    flagpie:false,//是否画饼图
    dd:'',//当天天数 例如26号
    month:'',//当前月份 例如05
    year:''//当前年份
  },


  
  onLoad: function (e) {
    
    
     //获取当前月份
    var DATE = util.formMonth(new Date());
    //获取当前时间
    var d=util.formDate(new Date())
    var dd=d.slice(8,11)
    var month=DATE.slice(5,7)
    var year=DATE.slice(0,4)

    if( (parseInt(year) % 400 == 0) || (parseInt(year) % 4 == 0 && parseInt(year) % 100 != 0))
    {
      year='r'
    }
    else{
      year='p'
    }
   
    console.log(this.data.date)
    console.log(this.data.dd)
    console.log(this.data.month)
    console.log(this.data.year)

    

    this.setData({
      date: DATE,
      day:d,
      dd:dd,//当前天数例如23号
      month:month,
      year:year
    })

  
    this.getallData()
    // this.Canying()
    // this.Canyingdata()
    // this.JTData()
    // this.QTData()
    // this.ShoppingData()
    // this.TXData()
    // this.Num()
    // this.Paint()
    
  },

/**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

    //从别的页面跳转过来后又是当前月份和当天，不然就是你之前选择后的日期和月份。
    
     //获取当前月份
     var DATE = util.formMonth(new Date());
     //获取当前时间
     var d=util.formDate(new Date())

     var dd=d.slice(8,11)
    var month=DATE.slice(5,7)
    var year=DATE.slice(0,4)
    if( (parseInt(year) % 400 == 0) || (parseInt(year) % 4 == 0 && parseInt(year) % 100 != 0))
    {
      year='r'
    }
    else{
      year='p'
    }
   
     this.setData({
       date: DATE,
       day:d,
       dd:dd,//当前天数例如23号
      month:month,
      year:year,
      flagcolumn:false
     })
    
    this.getallData()

    
  },

  paintcolumn(){
    var windowWidth = 320;
    try {
      var res = wx.getSystemInfoSync();//小程序API获取系统信息
      windowWidth = res.windowWidth;
    } catch (e) {
      console.error('getSystemInfoSync failed!');
    }
    new wxCharts({
      canvasId: 'columnCanvas',
      type: 'column',
      animation: true,
      categories: this.data.dayList,
      series: [{
          name: '每日消费',
          data: this.data.dayCost,
          format: function (val, name) {
              return val.toFixed(2) + '元';
          }
      }],
      yAxis: {
          format: function (val) {
              return val + '元';
          },
          title: '花费（元）',
          min: 0
      },
      xAxis: {
          disableGrid: false,
          type: 'calibration'
      },
      extra: {
          column: {
              width: 15
          }
      },
      width: windowWidth,
      height: 300,
  });
  
  },

  Paint(){
   
    var windowWidth = 320;
    try {
      var res = wx.getSystemInfoSync();//小程序API获取系统信息
      windowWidth = res.windowWidth;
    } catch (e) {
      console.error('getSystemInfoSync failed!');
    }
    new wxCharts({
      animation: true, //是否有动画
      canvasId: 'pieCanvas',
      type:'pie',
      series:[{
        name:'购物',
        data:this.data.ShoppingPrice,},{
          name:'餐饮',
          data:this.data.Cprice,
        },{
          name:'交通',
          data:this.data.JTPrice,
        },{
          name:'通讯',
          data:this.data.TXPrice,
        },{
          name:'其他',
          data:this.data.QTPrice,
        }
      ],
      width: windowWidth,
      height: 300,
      dataLabel: true,
    });
  },
 
  //进行当月的图表输出
  getallData(){
 
    var num=this.data.Number
    var that=this
    db.collection('allCost').count().then(res=>{
      num=res.total
      this.setData({
        Number:num
      })

    const batchTimes = Math.ceil(this.data.Number / 20)//计算需要获取几次  比如你有36条数据就要获取两次 第一次20条第二次16条
    let arraypro = [] // 定义空数组 用来存储每一次获取到的记录 
    let x = 0 //这是一个标识每次循环就+1 当x等于batchTimes 说明已经到了最后一次获取数据的时候
    for (let i = 0; i < batchTimes; i++) {
      db.collection('allCost').skip(i*20).get().then(res=>{
        x+=1
        for(let j=0;j<res.data.length;j++){
          arraypro.push(res.data[j])
        }
        if(x==batchTimes){
          that.setData({
            List: arraypro
          })
          console.log(that.data.List)
        }

    //分类
    let Clist=[],JList=[],TList=[],SList=[],QList=[],list=[]
    var Cprice=0,Jprice=0,Tprice=0,Sprice=0,Qprice=0
    for(var i in this.data.List){
      //功能：arrayObject.slice(start,end)start:必需。规定从何处开始选取。如果是负数，那么它规定从数组尾部开始算起的位置。也就是说，-1 指最后一个元素，-2 指倒数第二个元素，以此类推。end:可选。规定从何处结束选取。该参数是数组片断结束处的数组下标。如果没有指定该参数，那么切分的数组包含从 start 到数组结束的所有元素。如果这个参数是负数，那么它规定的是从数组尾部开始算起的元素。

      if(this.data.List[i].rq.slice(0,7)==this.data.date){
        list.push(this.data.List[i])
        if(this.data.List[i].fl=='0'){
          Clist.push(this.data.List[i])
          Cprice= Cprice+parseFloat(this.data.List[i].hf)
        }
        if(this.data.List[i].fl=='1'){
          JList.push(this.data.List[i])
          Jprice=Jprice+parseFloat(this.data.List[i].hf)
        }
        if(this.data.List[i].fl=='2'){
          TList.push(this.data.List[i])
          Tprice=Tprice+parseFloat(this.data.List[i].hf)
        }
        if(this.data.List[i].fl=='3'){
          SList.push(this.data.List[i])
          Sprice=Sprice+parseFloat(this.data.List[i].hf)
        }
        if(this.data.List[i].fl=='4'){
          QList.push(this.data.List[i])
          Qprice=Qprice+parseFloat(this.data.List[i].hf)
        }
      }
      
    }
    var allcost=0
    Cprice=parseFloat(Cprice.toFixed(2))
    Tprice=parseFloat(Tprice.toFixed(2))
    Qprice=parseFloat(Qprice.toFixed(2))
    Jprice=parseFloat(Jprice.toFixed(2))
    Sprice=parseFloat(Sprice.toFixed(2))
    
    allcost=parseFloat(Cprice)+parseFloat(Tprice)+parseFloat(Qprice)+parseFloat(Jprice)+parseFloat(Sprice)
    
    
    that.setData({
      List:list,
      CYlist:Clist,
      Cprice:Cprice,
      JTList:JList,
      JTPrice:Jprice,
      TXList:TList,
      TXPrice:Tprice,
      ShoppingList:SList,
      ShoppingPrice:Sprice,
      QTList:QList,
      QTPrice:Qprice,
      allcost:allcost,
      flagpie:true
    })
    console.log(this.data.CYlist)
    console.log(this.data.JTList)
    console.log(this.data.TXList)
    console.log(this.data.ShoppingList)
    console.log(this.data.QTList)

    this.Paint()
      })
    }
    })
  },

  //更改月份之后的图表输出
  bindDateChange:function(e){
    
    var that=this
    var num=0
    db.collection('allCost').count().then(res=>{
      num=res.total
      this.setData({
        Number:num
      })

      console.log('picker发送选择改变，携带值为', e.detail.value)
      
      var Hmonth=this.data.month
      Hmonth=e.detail.value.slice(5,8)//要将修改了的月份也一并修改了 不然七日支出的天数可能就有问题

    const batchTimes = Math.ceil(this.data.Number / 20)//计算需要获取几次  比如你有36条数据就要获取两次 第一次20条第二次16条
    let arraypro = [] // 定义空数组 用来存储每一次获取到的记录 
    let x = 0 //这是一个标识每次循环就+1 当x等于batchTimes 说明已经到了最后一次获取数据的时候
    for (let i = 0; i < batchTimes; i++) {
      db.collection('allCost').skip(i*20).get().then(res=>{
        x+=1
        for(let j=0;j<res.data.length;j++){
          arraypro.push(res.data[j])
        }
        if(x==batchTimes){
          that.setData({
            List: arraypro
          })
          console.log(that.data.List)
        }

    //月份选择
    let Clist=[],JList=[],TList=[],SList=[],QList=[],list=[]
    var Cprice=0,Jprice=0,Tprice=0,Sprice=0,Qprice=0
    for(var i in this.data.List){
      console.log(this.data.List[i].rq.slice(0,7))
      var month=this.data.List[i].rq.slice(0,7)
      if(month==e.detail.value){
        list.push(this.data.List[i])
        if(this.data.List[i].fl=='0'){
          Clist.push(this.data.List[i])
          Cprice= Cprice+parseFloat(this.data.List[i].hf)
        }
        if(this.data.List[i].fl=='1'){
          JList.push(this.data.List[i])
          Jprice=Jprice+parseFloat(this.data.List[i].hf)
        }
        if(this.data.List[i].fl=='2'){
          TList.push(this.data.List[i])
          Tprice=Tprice+parseFloat(this.data.List[i].hf)
        }
        if(this.data.List[i].fl=='3'){
          SList.push(this.data.List[i])
          Sprice=Sprice+parseFloat(this.data.List[i].hf)
        }
        if(this.data.List[i].fl=='4'){
          QList.push(this.data.List[i])
          Qprice=Qprice+parseFloat(this.data.List[i].hf)
        }
      }
     
    }
    var allcost=0
    Cprice=parseFloat(Cprice.toFixed(2))
    Tprice=parseFloat(Tprice.toFixed(2))
    Qprice=parseFloat(Qprice.toFixed(2))
    Jprice=parseFloat(Jprice.toFixed(2))
    Sprice=parseFloat(Sprice.toFixed(2))
    
    allcost=parseFloat(Cprice)+parseFloat(Tprice)+parseFloat(Qprice)+parseFloat(Jprice)+parseFloat(Sprice)
    that.setData({
      date:e.detail.value,
      List:list,
      CYlist:Clist,
      Cprice:Cprice,
      JTList:JList,
      JTPrice:Jprice,
      TXList:TList,
      TXPrice:Tprice,
      ShoppingList:SList,
      ShoppingPrice:Sprice,
      QTList:QList,
      QTPrice:Qprice,
      allcost:allcost,
      flagpie:true,
      flagcolumn:false,
      month:Hmonth
    })
    console.log(this.data.CYlist)
    console.log(this.data.JTList)
    console.log(this.data.TXList)
    console.log(this.data.ShoppingList)
    console.log(this.data.QTList)

    this.Paint()
      })
    }
    })
  },

  //七日支出
  bindDayChange:function(e){
    
    db.collection('allCost').count().then(res=>{
      var num=0
      num=res.total
    
      this.setData({
        Number:num
      })
      console.log('picker发送选择改变，携带值为', e.detail.value)
    const batchTimes = Math.ceil(this.data.Number / 20)//计算需要获取几次  比如你有36条数据就要获取两次 第一次20条第二次16条
    let arraypro = [] // 定义空数组 用来存储每一次获取到的记录 
    let x = 0 //这是一个标识每次循环就+1 当x等于batchTimes 说明已经到了最后一次获取数据的时候
    for (let i = 0; i < batchTimes; i++) {
      db.collection('allCost').skip(i*20).get().then(res=>{
        x+=1
        for(let j=0;j<res.data.length;j++){
          arraypro.push(res.data[j])
        }
        if(x==batchTimes){
          this.setData({
            List: arraypro
          })
        }


    //默认是当天，picker选择后就不一样了
    if(e.detail.value!=null){
      var day=parseInt(e.detail.value)
    }
    else{
      var day=parseInt(this.data.day.slice(8,11))
    }
   
    console.log(day)
    
    var daylist=[]
    var dayCost=[0,0,0,0,0,0,0]
    if(day>=7){
      
      var daylist=[String(day),String(day-1),String(day-2),String(day-3),String(day-4),String(day-5),String(day-6)]

      if(day>=7&&day<10){
        for(var i in this.data.List){
          for(let j=0;j<this.data.dayList.length;j++){
            if(this.data.List[i].rq.slice(0,11)==this.data.date+'-'+'0'+this.data.dayList[j]){
              dayCost[j]= dayCost[j]+parseFloat(this.data.List[i].hf)
            }
          }
        }
      }
      else{
        for(var i in this.data.List){
          for(let j=0;j<this.data.dayList.length;j++){
            if(this.data.List[i].rq.slice(0,11)==this.data.date+'-'+this.data.dayList[j]){
              dayCost[j]= dayCost[j]+parseFloat(this.data.List[i].hf)
            }
          }
        }
      }
      

      this.setData({
        dayList:daylist,
        dayCost:dayCost,
        flagcolumn:true,
        dd:day,
        flagpie:false
       })
       this.paintcolumn()
    }
    if(day<7&&day>0){
      // var dayCost=[0,0,0,0,0,0,0]
      var daycost=[]
      for(let i=1;i<=day;i++){
        daylist.push((String(i)))
        daycost.push(0)
      }

      console.log(daylist)
      for(var i in this.data.List){
        for(let j=0;j<this.data.dayList.length;j++){
          if(this.data.List[i].rq.slice(0,11)==this.data.date+'-'+'0'+this.data.dayList[j]){
            daycost[j]= daycost[j]+parseFloat(this.data.List[i].hf)
            
          }
        }
      }

      this.setData({
        dayList:daylist,
        dayCost:daycost,
        flagcolumn:true,
        dd:day,
        flagpie:false
       })
       this.paintcolumn()
    }

    this.setData({
     dayList:daylist,
     dayCost:dayCost,
     flagcolumn:true,
     day:this.data.date+'-'+day,
     flagpie:false
    })
    console.log(this.data.dayList)
    console.log(this.data.dayCost)

    
    })

      
    }

  })
  
},





  Num(){
    var num=this.data.Number
    db.collection('allCost').count().then(res=>{
      // num=res
      console.log(res.total)
      num=res.total
      // console.log(num)
      console.log('++++'+num)

      this.setData({
        Number:num
        
      })
    })
    
  },

  Canyingdata() {
    db.collection("allCost").where({
      fl:"0"
    })
    .get()
    .then(res=>{
      console.log(res.data)
      this.setData({
        CanyingList:res.data
      })

    var IcategoryPrice=this.data.categoryPrice
    for(var i in this.data.CanyingList){
     console.log(this.data.CanyingList[i].hf)
     IcategoryPrice= IcategoryPrice+parseInt(this.data.CanyingList[i].hf)
    }
    // that.data.categoryPrice=IcategoryPrice
      this.setData({
        
        categoryPrice:IcategoryPrice
      })
      
      this.Paint()
    })
  
  },

  JTData(){
    db.collection("allCost").where({
      fl:"1"
    })
    .get()
    .then(res=>{
      console.log(res.data)
      this.setData({
        JTList:res.data
      })

    var IJTPrice=this.data.JTPrice
    for(var i in this.data.JTList){
     console.log(this.data.JTList[i].hf)
     IJTPrice= IJTPrice+parseInt(this.data.JTList[i].hf)
    }
    // that.data.categoryPrice=IcategoryPrice
      this.setData({
        
        JTPrice:IJTPrice
      })
      
      this.Paint()
    })
  },
 
  TXData(){
    db.collection("allCost").where({
      fl:"2"
    })
    .get()
    .then(res=>{
      console.log(res.data)
      this.setData({
        TXList:res.data
      })

    var ITXPrice=this.data.TXPrice
    for(var i in this.data.TXList){
     console.log(this.data.TXList[i].hf)
     ITXPrice= ITXPrice+parseInt(this.data.TXList[i].hf)
    }
    // that.data.categoryPrice=IcategoryPrice
      this.setData({
        
        TXPrice:ITXPrice
      })
      
      this.Paint()
    })
  },
 
  ShoppingData(){
    db.collection("allCost").where({
      fl:"3"
    })
    .get()
    .then(res=>{
      console.log(res.data)
      this.setData({
        ShoppingList:res.data
      })

    var IShoppingPrice=this.data.ShoppingPrice
    for(var i in this.data.ShoppingList){
     console.log(this.data.ShoppingList[i].hf)
     IShoppingPrice= IShoppingPrice+parseInt(this.data.ShoppingList[i].hf)
    }
    // that.data.categoryPrice=IcategoryPrice
      this.setData({
        
        ShoppingPrice:IShoppingPrice
      })
      
      this.Paint()
    })
  },
  
  QTData(){
    db.collection("allCost").where({
      fl:"4"
    })
    .get()
    .then(res=>{
      console.log(res.data)
      this.setData({
        QTList:res.data
      })

    var IQTPrice=this.data.QTPrice
    for(var i in this.data.QTList){
     console.log(this.data.QTList[i].hf)
     IQTPrice= IQTPrice+parseInt(this.data.QTList[i].hf)
    }
    // that.data.categoryPrice=IcategoryPrice
      this.setData({
        
        QTPrice:IQTPrice
      })
      
      this.Paint()
    })
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  // onReachBottom: function () {
  
  // },




  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function (e) {
    
  }
  
  

});
