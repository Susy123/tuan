// pages/tetris/tetris.js
var blockItemWidth = 24;
var mainContext = null;
var nextContext = null;
var block_now, block_next; //当前，下一方块对象
var start;//计时器
var speed = 1000;//方块下落速度（ms）
var rn1, rn2, rm1, rm2;//随机数
var high;//最高分
var z_index = new Array();//存储所有块的z-index
for (var i = 0; i < 16; i++) {
  z_index[i] = new Array();
  for (var j = 0; j < 10; j++) {
    z_index[i][j] = 0;// 初始情况下都为0
  }
}

var beforeBlock = new Array();//16*10的方块 方块上一时刻的位置，用于擦除上一秒
for (var i = 0; i < 16; i++) {
  beforeBlock[i] = new Array();
}
var allBlock = new Array();//16*10的方块 已完成方块
for (var i = 0; i < 16; i++) {
  allBlock[i] = new Array();
}

//-------------方块类--------------------------------
function Block() {
  this.dir = 40;
  this.end = 0;
  this.shape = new Array();//4*4的方块
  for (var i = 0; i < 4; i++) {
    this.shape[i] = new Array();
  }
  this.pos = [0, 3];//所在行，列
  this.color = ["#FFAEC9", "#B5E61D", "#99D9EA", "#C8BFE7", "#B97A57"];
  this.changeAngle = 0;
}
Block.prototype = {
  printBlock: function () {
    //判断是否超出边界
    //右
    var q;
    loop1:
    for (var i = 3; i >= 0; i--) {
      for (var j = 0; j < 4; j++) {
        if (this.shape[j][i]) {
          q = i + 1;
          break loop1;
        }
      }
    }
    if ((this.pos[1] + q - 10) >= 0) {
      this.pos[1] = 10 - q;
    }
    //下
    var p;
    loop2:
    for (var i = 3; i >= 0; i--) {
      for (var j = 0; j < 4; j++) {
        if (this.shape[i][j]) {
          p = i + 1;
          break loop2;
        }
      }
    }
    if (this.pos[0] > 16 - p) {
      this.end = 1;
      clear(beforeBlock);
      return;
    }
    clearBefore();
    //判断左右是否有方块
    for (var i = 0; i < 4; i++) {
      for (var j = 0; j < 4; j++) {
        if (this.shape[i][j] == 1) {
          if (z_index[i + this.pos[0]][j + this.pos[1]] == 1 && this.dir == 39) {
            this.pos[1]--;
          } else if (z_index[i + this.pos[0]][j + this.pos[1]] == 1 && this.dir == 37) {
            this.pos[1]++;
          }
        }
      }
    }
    //绘制方块
    for (var i = 0; i < 4; i++) {
      for (var j = 0; j < 4; j++) {
        // if(this.shape[i][j] == 1) {
        if (this.shape[i][j]) {
          var x = i + this.pos[0];
          var y = j + this.pos[1];
          if (x < 15) {
            if (z_index[x + 1][y] == 1) {
              this.end = 1;
            }
          } else {
            this.end = 1;
          }
          z_index[x][y] = 1;
          drawBlockImg(this.shape[i][j], x, y);
          // clearCanvasBlock(x - 1, y);
          beforeBlock[x][y] = this.shape[i][j];
        }
      }
    }
    // mainContext.draw();
    //若方块下落完毕，将方块加入到已下落方块矩阵中
    if (this.end == 1) {
      for (var i = 0; i < 4; i++) {
        for (var j = 0; j < 4; j++) {
          if (this.shape[i][j]) {
            allBlock[i + this.pos[0]][j + this.pos[1]] = this.shape[i][j];
          }
        }
      }
    }
  },
  //顺时针旋转方块90度
  changeBlock: function () {
    var tmp = new Array();
    for (var i = 0; i < 4; i++) {
      tmp[i] = new Array();
    }
    //顺时针旋转矩阵90度 
    for (var i = 0, dst = 3; i < 4; i++ , dst--) {
      for (var j = 0; j < 4; j++)
        tmp[j][dst] = this.shape[i][j];
    }
    //将旋转后的图像移到矩阵左上角
    for (var i = 0; i < 4; i++) {
      var flag = 1;
      for (var j = 0; j < 4; j++) {
        if (tmp[j][0]) {
          flag = 0;
        }
      }
      if (flag) {
        for (var j = 0; j < 4; j++) {
          tmp[j].shift();
          tmp[j].push(0);
        }
      }
      // console.log(flag)
    }
    //将旋转后的矩阵保存回原来的矩阵 
    var changeIndex = 4;
    if (this.changeAngle == 360) {
      changeIndex = -12;
      this.changeAngle = 0;
    }
    for (var i = 0; i < 4; i++) {
      for (var j = 0; j < 4; j++) {
        this.shape[i][j] = 0;
        if (tmp[i][j]) {
          this.shape[i][j] = tmp[i][j] + changeIndex;
        }
      }

    }


  },
  //移动方块
  // 左(37) 上(38) 右(39) 下(40)
  moveBlock: function (keyCode) {
    if (!this.end) {
      switch (keyCode) {
        case 38: {
          this.dir = 38;
          this.changeAngle = this.changeAngle + 90;
          this.changeBlock();
          this.printBlock();
          break;
        }
        case 37: {
          this.dir = 37;
          if (this.pos[1] > 0) {
            this.pos[1]--;
            this.printBlock();
          }
          break;
        }
        case 39: {
          this.dir = 39;
          this.pos[1]++;
          this.printBlock();
          break;
        }
        case 40: {
          this.dir = 40;
          this.goToEnd();
          // this.pos[0]++;
          this.printBlock();
          break;
        }
      }
    }
  },
  //速降
  goToEnd: function () {
    if (!this.end) {
      var l, b, y1;
      //得出方块的右边界
      loop5:
      for (var i = 3; i >= 0; i--) {
        for (var j = 0; j < 4; j++) {
          if (this.shape[j][i]) {
            l = i;
            break loop5;
          }
        }
      }
      //得出方块的下边界及最下的部分的列数
      loop6:
      for (var i = 3; i >= 0; i--) {
        for (var j = 0; j < 4; j++) {
          if (this.shape[i][j]) {
            b = i;
            y1 = j;
            break loop6;
          }
        }
      }
      var x1 = this.pos[1];
      var x2 = l + this.pos[1];
      var x3 = -1;
      var x4;
      // test();
      loop7:
      //下方有方块时，下方方块最顶的块的行列
      for (var i = 0; i < 16; i++) {
        for (var j = x1; j <= x2; j++) {
          if (allBlock[i][j]) {
            x3 = i;//第几行已有方块
            x2 = j;
            break loop7;
          }
        }
      }
      //下方有方块时，上方块最底的块对应下方的块的行列
      for (var i = 0; i < 16; i++) {
        if (allBlock[i][y1 + this.pos[1]]) {
          x4 = i;
          break;
        } else {
          x4 = 16;
        }
      }
      console.log("y1:" + y1, "x4:" + x4, "b:" + b, this.pos[0], this.pos[1])
      //方块下方没有方块时
      if (x3 == -1) {
        this.pos[0] = 15 - b;
        this.end = 1;
        return;
      }
      //算出下方最顶方块距离上方块对应位置距离
      for (var i = 3; i >= 0; i--) {
        if (this.shape[i][x2 - this.pos[1]]) {
          x2 = x3 - i - this.pos[0] - 1;
          break;
        }
      }
      //取较小距离，后者为上方方块最底距离下方对应方块距离
      var x5 = Math.min(x2, (x4 - b - 1 - this.pos[0]))
      // this.pos[0] = x2+this.pos[0];
      // console.log(x4,b,x4-b-1-this.pos[0],x5)
      //将方块移动至该位置
      this.pos[0] = x5 + this.pos[0];
      this.end = 1;
    }
  }
}
//--7种形状的方块继承Block----------------
function Block_i() {//1-16
  Block.call(this);
  this.shape = [
    [1, 0, 0, 0],
    [2, 0, 0, 0],
    [3, 0, 0, 0],
    [4, 0, 0, 0]
  ];
}
Block_i.prototype = new Block();
function Block_s() {//17-32
  Block.call(this);
  this.shape = [
    [17, 0, 0, 0],
    [18, 19, 0, 0],
    [0, 20, 0, 0],
    [0, 0, 0, 0]
  ];
}
Block_s.prototype = new Block();
function Block_j() {//33-48
  Block.call(this);
  this.shape = [
    [33, 34, 35, 0],
    [0, 0, 36, 0],
    [0, 0, 0, 0],
    [0, 0, 0, 0]
  ];
}
Block_j.prototype = new Block();
function Block_o() {//49-64
  Block.call(this);
  this.shape = [
    [49, 50, 0, 0],
    [52, 51, 0, 0],
    [0, 0, 0, 0],
    [0, 0, 0, 0]
  ];
}
Block_o.prototype = new Block();
function Block_z() {//65-80
  Block.call(this);
  this.shape = [
    [0, 68, 0, 0],
    [66, 67, 0, 0],
    [65, 0, 0, 0],
    [0, 0, 0, 0]
  ];
}
Block_z.prototype = new Block();
function Block_t() {//81-96
  Block.call(this);
  this.shape = [
    [0, 81, 0, 0],
    [82, 83, 84, 0],
    [0, 0, 0, 0],
    [0, 0, 0, 0]
  ];
}
Block_t.prototype = new Block();
function Block_l() {//97-112
  Block.call(this);
  this.shape = [
    [97, 0, 0, 0],
    [98, 0, 0, 0],
    [99, 100, 0, 0],
    [0, 0, 0, 0]
  ];
}
Block_l.prototype = new Block();

//产生一个方块
function createBlock(r1, r2) {
  var block_new;
  // var r = 0;
  switch (r1) {
    case 0: block_new = new Block_i(); break;
    case 1: block_new = new Block_j(); break;
    case 2: block_new = new Block_l(); break;
    case 3: block_new = new Block_o(); break;
    case 4: block_new = new Block_s(); break;
    case 5: block_new = new Block_t(); break;
    case 6: block_new = new Block_z(); break;
  }
  block_new.color = block_new.color[r2];
  return block_new;
}
//用于清零16*10的矩阵（beforeBlock和allBlock）
function clear(clearBlock) {
  for (var i = 0; i < 16; i++) {
    for (var j = 0; j < 10; j++) {
      clearBlock[i][j] = 0;
    }
  }
}
//擦除上一时刻方块
function clearBefore() {
  for (var i = 0; i < 16; i++) {
    for (var j = 0; j < 10; j++) {
      if (beforeBlock[i][j]) {
        z_index[i][j] = 0;
        clearCanvasBlock(i, j);
        beforeBlock[i][j] = 0;
      }
    }
  }
}

// -----canvas function-----------------
function clearCanvasBlock(x, y) {
  mainContext.clearRect(y * blockItemWidth, x * blockItemWidth, blockItemWidth, blockItemWidth);
  mainContext.draw();
  console.log('mainContext clear:', 'x=',x,'y=',y);
}
function clearNextContext() {
  nextContext.clearRect(0, 0, 138, 138);
  nextContext.draw();
  console.log('nextContext clear');
}
function drawBlockImgNext(imgNum, x, y) {
  var imgSrc = '../imgs/' + imgNum + '.jpg';
  nextContext.drawImage(imgSrc, y * blockItemWidth, x * blockItemWidth, blockItemWidth, blockItemWidth);
  // nextContext.draw();
  console.log('nextContext draw:', 'imgNum=', imgNum, 'x=', x, 'y=', y);
}
function drawBlockImg(imgNum, x, y) {
  var imgSrc = '../imgs/' + imgNum + '.jpg';
  mainContext.drawImage(imgSrc, y * blockItemWidth, x * blockItemWidth, blockItemWidth, blockItemWidth);
  // mainContext.draw();
  console.log('mainContext draw:', 'imgNum=', imgNum, 'x=', x, 'y=', y);
}
//显示下一块方块nextCanvas
function printNext() {
  clearNextContext();

  for (var i = 0; i < 4; i++) {
    for (var j = 0; j < 4; j++) {
      if (block_next.shape[i][j]) {
        drawBlockImgNext(block_next.shape[i][j], i, j)
      }
    }
  }
  // nextContext.draw();
}

Page({

  /**
   * 页面的初始数据
   */
  data: {
    score: 0, //得分
    startOrpause:'开始'
  },

  //得到分数，并判断是否为历史最高分并写入缓存
  getScore: function () {
    var s;
    for(var i = 0; i< 16; i++) {
      s = 0;
      for (var j = 0; j < 10; j++) {
        if (allBlock[i][j]) {
          s++;
        }
      }
      if (s == 10) {
        this.data.score = this.data.score + 1;
        allBlock.splice(i, 1);
        allBlock.unshift([0, 0, 0, 0, 0, 0, 0, 0, 0, 0]);
        clearBefore();
        for (var k = i; k > 0; k--) {
          for (var l = 0; l < 10; l++) {
            clearCanvasBlock(k, l);
            drawBlockImg(allBlock[k][l], k, l);
            z_index[k][l] = z_index[k - 1][l];
          }
        }
        // mainContext.draw();
      }
    }
  },

  // 主程序
  init: function () {
    clear(allBlock);
    rn1 = Math.round(Math.random() * 6);
    rn2 = Math.round(Math.random() * 4);
  },
  play: function () {
    clear(beforeBlock);
    rm1 = rn1;
    rm2 = rn2;
    block_now = createBlock(rm1, rm2);
    block_now.printBlock();
    rn1 = Math.round(Math.random() * 6);
    rn2 = Math.round(Math.random() * 4);
    block_next = createBlock(rn1, rn2);
    printNext();
    start = setInterval(function () {
      block_now.printBlock();
      if (block_now.end) {
        clearInterval(start);
        if (block_now.pos[0] == 1) {
          wx.showToast({
            title: 'Game Over !!',
          })
          this.onLoad();
        } else {
          this.play();
        }
      }
      this.getScore();
      block_now.pos[0]++;
      // 只在定时器里每分钟画一次，以免小程序里draw会覆盖
      mainContext.draw();
      nextContext.draw();
    }.bind(this), speed);
  },

  // 按钮操作
  rotateClick: function() {
    block_now.moveBlock(38);
  },
  leftClick: function() {
    block_now.moveBlock(37);
  },
  rightClick: function () {
    block_now.moveBlock(39);
  },
  downClick: function () {
    block_now.moveBlock(40);
  },
  startOrpause: function(){
    if (this.data.startOrpause == '开始'){
      this.init();
      this.play();
      this.setData({
        startOrpause: '暂停'
      });
    }
    else if (this.data.startOrpause == '暂停'){
      clearInterval(start);
      this.setData({
        startOrpause: '继续'
      });
    }
    else if (this.data.startOrpause == '继续'){
      start = setInterval(function () {
        block_now.printBlock();
        if (block_now.end) {
          clearInterval(start);
          if (block_now.pos[0] == 1) {
            wx.showToast({
              title: 'Game Over !!',
            });
            // location.reload();
            this.onLoad();
          } else {
            this.play();
          }
        }
        this.getScore();
        block_now.pos[0]++;
        // 只在定时器里每分钟画一次，以免小程序里draw会覆盖
        mainContext.draw();
        nextContext.draw();
      }.bind(this), speed);
      this.setData({
        startOrpause: '暂停'
      });
    }
    
  },
  restart: function(){
    this.onLoad();
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    mainContext = wx.createCanvasContext('mainCanvas', this);
    nextContext = wx.createCanvasContext('nextCanvas', this);
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