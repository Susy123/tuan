// pages/spiral/spiral.js
Page({
  canvasIdErrorCallback: function (e) {
    console.error(e.detail.errMsg);
  },
  createSector: function (context, i, ratio = 0.98) {
    context.beginPath();
    context.setFillStyle('rgba(255,0,0,0.5)');
    var sectorBlock = 1 / 12 * Math.PI;
    var sectorRatio = 19 / 20;// 扇形/（扇形+间隙）
    var sector = sectorBlock * sectorRatio;
    var xOffset = 5, yOffset = 5;// 时钟数字的中心偏移
    context.arc(0, 0, 150, 0, sector);
    context.arc(0, 0, 110, sector, 0, true);

    if(i%2 == 0) {
      var rNum = 160 * (ratio ** i);
      var clockNum = i / 2 + 3 > 24 ? i / 2 + 3 - 24 : i / 2 + 3;
      context.save();
      context.scale((1 / ratio) ** i, (1 / ratio) ** i);
      context.rotate(0 - sectorBlock * i);
      context.translate(0 - xOffset - rNum * (1 - Math.cos(sectorBlock * i)), yOffset + rNum * Math.sin(sectorBlock * i));
      context.font = "10px sans-serif";
      context.setFillStyle("black");
      context.fillText(clockNum, rNum, 0);
      context.restore();
    }
    context.closePath();

  },
  drawSpiral: function (context) {
    var sectorBlock = 1 / 12 * Math.PI;
    var ratio = 0.98;

    context.setFillStyle("#EEEEFF");
    context.fillRect(0, 0, 350, 300);
    context.drawImage('../assets/clock-icon.png', 108, 110, 80, 80);
    //图形绘制
    context.translate(150, 150);
    for(var i = 0; i< 48; i++) {
      this.createSector(context, i, ratio);
      context.fill();
      context.scale(ratio, ratio);
      context.rotate(sectorBlock);
    }
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
    //使用wx.createContext获取绘图上下文context
    var context = wx.createContext();
    
    this.drawSpiral(context);

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