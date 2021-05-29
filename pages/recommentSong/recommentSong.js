// pages/recommentSong/recommentSong.js
import request from '../../utils/request'
import clock from '../../utils/clock'
import PubSub from 'pubsub-js'

Page({

  /**
   * 页面的初始数据
   */
  data: {
    recommentSongList: [],
    day: clock().day,
    month: clock().month,
    // 保存当前点击的index
    currentMusicIndex: 0,
    // 音乐的总数
    musicLength: 0
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    wx.showLoading({
      title: '正在加载数据',
    })
    this.getRecommentSongList()
  },
  // 请求推荐歌曲
  async getRecommentSongList() {
    const {recommend, code} = await request({
      url: '/recommend/songs',
      method: 'get'
    })
    if(code === 200) {
      this.setData({
        recommentSongList: recommend,
        musicLength: recommend.length
      })
    }
    wx.hideLoading()

    // let {currentMusicIndex} = this.data;
    // 接受musicDetail页面传递的数据
    PubSub.subscribe("musicChange", (msg, data) => {
      let {recommentSongList, musicLength, currentMusicIndex} = this.data;
      if(data === 'pre') {
        // 切换到上一首
        if(currentMusicIndex <= 0) {
          currentMusicIndex = musicLength - 1;
        }else {
          currentMusicIndex -= 1;
        }
      }else{
        // console.log("播放完毕，自动切换到下一首")
        // 切换到下一首
        if(currentMusicIndex >= musicLength - 1) {
          currentMusicIndex = 0
        }else {
          console.log("currentMusicIndex前", currentMusicIndex)
          currentMusicIndex += 1;
          console.log("currentMusicIndex后", currentMusicIndex)
        }
      }
      this.setData({
        currentMusicIndex
      })
      // 取出musicId,传递给musicDetail
      const musicId = recommentSongList[currentMusicIndex].id;
      PubSub.publish("currentMusicId", musicId)
    })
  },

  // 接收musicList组件传递的数据
  getMusicIndex(params) {
    this.setData({
      currentMusicIndex: params.detail
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

  // 页面的下拉刷新和上拉到达底部并不能用于加载更多。
  onPullDownRefresh: function() {
    // 触发下拉刷新时执行
    // console.log("页面下拉刷新了")
  },
  onReachBottom: function() {
    // 页面触底时执行
    // console.log("页面已经到达底部")
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})