var util=require("../../../utils/util")
const db = wx.cloud.database()
Page({

	/**
	 * 页面的初始数据
	 */
	data: {
    day:'',
    Number:0,
    List:'',//总的List
    list:'',//最早日期list
    allcost:0,
    time:''//最早日期
  },


	/**
	 * 生命周期函数--监听页面加载
	 */
	onLoad: function (options) {
		wx.setNavigationBarTitle({
			title: '您与花火'
    })
    
    var d=util.formDate(new Date())
    this.setData({
      day:d
    })
    console.log(this.data.day)

    this.getUseDay()
  },
  getUseDay(){

    db.collection('allCost').count().then(res=>{
      var num=0
      num=res.total
      this.setData({
        Number:num
      })

    //获取所有数组
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

       

        

        var time = new Date(this.data.List[0].rq.replace(/-/g, "/"))
        // var time1 = new Date(this.data.List[0].rq.replace(/-/g, "/"))
       
        for(var i in this.data.List){
          var t = new Date(this.data.List[i].rq.replace(/-/g, "/"))
          let value=time.getTime()-t.getTime()
          if(value>0){
            time=t
          }
          
        }
      
        console.log(time)
        var d=time
        d=d.getFullYear() + '-' + (d.getMonth() + 1) + '-' + d.getDate() 
       
        //  for(var i in this.data.List){
        //   if(this.data.List[i].rq==d){
        //     list.push(this.data.List[i])
        //   }
        // }
        console.log(d)
        
        // var list=[]
         //计算所有花费
         var allcoat=0
         for(var i in this.data.List){
           allcoat=parseFloat(this.data.List[i].hf)+allcoat
         }
         allcoat=allcoat.toFixed(3)
        
        // console.log(this.data.List)
       
        this.setData({
          allcost:allcoat,
          time:d
          
        })

      })
    }

    
  })
  },


	
})