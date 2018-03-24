// pages/shalou/shalou.js
Page({
  canvasIdErrorCallback: function (e) {
    console.error(e.detail.errMsg);
  },

  /**
   * 页面的初始数据
   */
  data: {
    minuteSet:0.5,
    timesNum:0
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
  
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    this.redrawTimeSlot = 40;// 每40ms重画一次，比较流程
    var timesTotal = this.data.minuteSet * 60 * 1000 / this.redrawTimeSlot;
    this.timeSlot = 100 / timesTotal;
    this.drawShalou();
    this.interval = setInterval(this.drawShalou, this.redrawTimeSlot);
    
  },

  drawShalou: function () {
    //使用wx.createContext获取绘图上下文context
    var context = wx.createContext();
    context.scale(1,1.3);
    context.setFillStyle("#1a1a1a");
    context.fillRect(0, 0, 350, 600);
    context.translate(200, 200);
    var timesNum = this.data.timesNum;
    console.log(timesNum);
    if (timesNum >= 100) {
      clearInterval(this.interval);
    }
    this.setData({
      timesNum: timesNum+this.timeSlot
    })
    this.drawSha(context,timesNum);
    this.drawFrame(context);
    //调用wx.drawCanvas，通过canvasId指定在哪张画布上绘制，通过actions指定绘制行为
    wx.drawCanvas({
      canvasId: "shalou-canvas",
      actions: context.getActions() //获取绘图动作数组
    });
  },
  drawFrame: function (context) {
    var sideLenth = 100+5;
    var gapWidth = 10;
    context.beginPath();
    context.setStrokeStyle("#3f6b9d")
    context.setLineWidth(15)
    context.setLineCap('round');
    context.setLineJoin('round');

    context.moveTo(gapWidth,0)
    context.lineTo(sideLenth,sideLenth);
    context.lineTo(0-sideLenth, sideLenth);
    context.lineTo(0-gapWidth,0);
    context.lineTo(0 - sideLenth, 0 - sideLenth);
    context.lineTo(sideLenth, 0-sideLenth);
    context.lineTo(gapWidth, 0);
    context.closePath();
    context.stroke();
  },
  drawSha: function (context,i) {
    var sideLenth = 100;
    var curSide = 100-i;
    var dig = Math.PI/4;
    context.moveTo(0,0);
    context.beginPath();
    context.setLineWidth(5)
    context.setFillStyle('#e08f24');
    context.setStrokeStyle('#e08f24');
    // console.log(Math.tan(dig));
    context.lineTo(curSide,0-curSide/Math.tan(dig));
    context.lineTo(0 - curSide,  0 - curSide / Math.tan(dig));
    context.lineTo(0,0);
    context.lineTo(0,curSide);
    context.lineTo(sideLenth, sideLenth);
    context.lineTo(0 - sideLenth, sideLenth);
    context.lineTo(0, curSide);
    context.lineTo(0, 0);
    context.closePath();
    context.fill();
    context.stroke();
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