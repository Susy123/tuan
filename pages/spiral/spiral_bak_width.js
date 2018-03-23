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
    var width = 45;// 块的粗细
    var sectorRatio = 19/20;// 扇形/（扇形+间隙）
    var r1=145,r2=r1-d,r3=r2-d,r4=r3-d,r0=r1+d;
    var x1=150,y1=150;
    var x2 = x1, y2 = y1;
    // var x2 = x1 - (r1 - r2), y2=y1;

    //使用wx.createContext获取绘图上下文context
    var context = wx.createContext();
    
    context.drawImage('../assets/clock-icon.png', 115, 115, 70, 70);
    context.setLineWidth(width);
    // 设定扇形和间隙的大小
    var sectorBlock = 1 / 12 * Math.PI
    var sector = 1 / 12 * Math.PI * sectorRatio;
    var gap = 1 / 12 * Math.PI * (1 - sectorRatio);
    // 顺时针画螺旋圆
    context.moveTo(x1+r1, y1);
    for(var i=0;i<12;i++) {
      context.beginPath();
      context.setLineWidth(width - i * d / 48);
      context.setStrokeStyle("#BFEFFF");
      context.arc(x1, y1, r1 - i * d / 12, i * sectorBlock, i * sectorBlock + sector);
      context.stroke();
      context.beginPath();
      context.setStrokeStyle("#ffffff");
      context.arc(x1, y1, r1 - i * d / 12, i * sectorBlock + sector, (i + 1) * sectorBlock);
      context.stroke();
    }
    width = width - 11*d/48;
    for (var i = 0; i < 12; i++) {
      context.beginPath();
      context.setLineWidth(width - i * d / 48);
      context.setStrokeStyle("#BFEFFF");
      context.arc(x2, y2, r2 - i * d / 12, Math.PI + i * sectorBlock, Math.PI+(i * sectorBlock + sector));
      context.stroke();
      context.beginPath();
      context.setStrokeStyle("#ffffff");
      context.arc(x2, y2, r2 - i * d / 12, Math.PI + (i * sectorBlock + sector), Math.PI +(i + 1) * sectorBlock);
      context.stroke();
    }
    width = width - 11 * d / 48;
    for (var i = 0; i < 12; i++) {
      context.beginPath();
      context.setLineWidth(width - i * d / 48);
      context.setStrokeStyle("#BFEFFF");
      context.arc(x1, y1, r3 - i * d / 12, i * sectorBlock, i * sectorBlock + sector);
      context.stroke();
      context.beginPath();
      context.setStrokeStyle("#ffffff");
      context.arc(x1, y1, r3 - i * d / 12, i * sectorBlock + sector, (i + 1) * sectorBlock);
      context.stroke();
    }
    width = width - 11 * d / 48;
    for (var i = 0; i < 12; i++) {
      context.beginPath();
      context.setLineWidth(width - i * d / 48);
      context.setStrokeStyle("#BFEFFF");
      context.arc(x2, y2, r4 - i * d / 12, Math.PI + i * sectorBlock, Math.PI + (i * sectorBlock + sector));
      context.stroke();
      context.beginPath();
      context.setStrokeStyle("#ffffff");
      context.arc(x2, y2, r4, Math.PI + (i * sectorBlock + sector), Math.PI + (i + 1) * sectorBlock);
      context.stroke();
    }

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