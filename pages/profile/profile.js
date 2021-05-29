import request from '../../utils/request'
let startY = 0;
let endY = 0;
let finalY = 0;

Page({

  /**
   * 页面的初始数据
   */
  data: {
    moveTranslateY: 'translateY(0)',
    // 过度效果
    moveTransition: '',
    user: {
      avatarUrl: '/static/images/personal/missing-face.png',
      nickname: '游客'
    },
    songList: []
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    // 取出user数据
    const user = wx.getStorageSync("user");
    if(user) {
      this.setData({
        user: JSON.parse(user)
      })
      this.getSongList(this.data.user.userId)
    }
  },

  async getSongList(userId) {
    // 获取最近播放记录
    const {weekData, code} = await request({
      url: '/user/record',
      method: 'get',
      data: {
        uid: userId,
        type: 1
      }
    })
    if(code === 200) {
      const _songList = []
      weekData.slice(0, 10).forEach((item, index) => {
        _songList[index] = item.song
      });
      this.setData({
        songList: _songList
      })
    }
  },
  // 手接触时
  handleTouchStart(e) {
    // 清除过度效果
    this.setData({
      moveTransition: ''
    })
    // 获取手指接触时的y坐标
    startY = e.touches[0].clientY;
  },
  // 手指移动时
  handleTouchMove(e) {
    endY = e.touches[0].clientY;
    finalY = endY - startY;
    if(finalY <= 0) {
      return
    }
    if(finalY > 80) {
      finalY = 80
    }
    this.setData({
      moveTranslateY: `translateY(${finalY}rpx)`
    })
  },
  // 手指离开时
  handleTouchEnd() {
    this.setData({
      moveTranslateY: 'translateY(0)',
      moveTransition: 'transform 0.5s linear'
    })
  },

  // 跳转到登录页面
  toLogin() {
    wx.navigateTo({
      url: '/pages/login/login',
    })
  },

  // 跳转到最近播放页面
  toRecentPlayMusic() {
    wx.navigateTo({
      url: '/pages/recentPlayMusic/recentPlayMusic'
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