// pages/spiral/spiral.js
Page({
  canvasIdErrorCallback: function (e) {
    console.error(e.detail.errMsg);
  },
  /**
   * 页面的初始数据
   */
  data: {
  
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
  
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function (e) {
    var d = 25;// 圆半径相差大小
    var sectorRatio = 9/10;// 扇形/（扇形+间隙）
    var r1=120,r2=r1-d,r3=r2-d,r4=r3-d,r0=r1+d;
    var x1=150,y1=150;
    var x2=x1,y2=y1-(r1-r2);

    //使用wx.createContext获取绘图上下文context
    var context = wx.createContext();
    context.beginPath();
    context.setStrokeStyle("#00ff00");
    context.setLineWidth(2);
    context.rect(0, 0, 300, 300);
    context.stroke()
    context.beginPath();
    context.drawImage('../assets/clock-icon.png', 125, 100, 50, 50)
    context.setStrokeStyle("#BFEFFF");
    context.setLineWidth(35)
    // 从里向外画螺旋圆
    context.moveTo(x2, y2+r4);
    var sectorBlock = 1 / 12 * Math.PI
    var sector = 1 / 12 * Math.PI * sectorRatio;
    var gap = 1 / 12 * Math.PI * (1-sectorRatio);
    // context.arc(x2, y2, r4, 0.5 * Math.PI, 5 * sectorBlock + gap, true);
    // context.arc(x2, y2, r4, 5 * sectorBlock + gap, 5 * sectorBlock, true);
    // context.arc(x2, y2, r4, 5 * sectorBlock, 4 * sectorBlock, true);
    context.arc(x2, y2, r4, 0.5 * Math.PI, 1.5 * Math.PI, true);
    context.arc(x1, y1, r3, 1.5 * Math.PI, 0.5 * Math.PI, true);
    context.arc(x2, y2, r2, 0.5 * Math.PI, 1.5 * Math.PI, true);
    context.arc(x1, y1, r1, 1.5 * Math.PI, 0.5 * Math.PI, true);
    context.arc(x2, y2, r0, 0.5 * Math.PI, 1/6 * Math.PI, true);
    
    context.stroke();

    //调用wx.drawCanvas，通过canvasId指定在哪张画布上绘制，通过actions指定绘制行为
    wx.drawCanvas({
      canvasId: "spiral",
      actions: context.getActions() //获取绘图动作数组
    });
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