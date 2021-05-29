
import request from '../../utils/request'
import PubSub from 'pubsub-js'
import moment from 'moment'
// 获取当前应用的实例
const appInstance = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    isPlay: false,
    musicId: '',
    musicDetailData: {},
    playInfo: {},
    // 实际播放
    currentTime: "00: 00",
    // 总时长
    totalTime: "00: 00",
    bgcWidth: 0
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    if(options.id) {
      this.setData({
        musicId: options?.id
      })
    }
    this.getMusicDetail(this.data.musicId);
    this.getPlayInfo(this.data.musicId)

    // 如果点击的音乐上次是在播放，退出后，再次点击的时候，我们需要设置为正在播放。
    if(appInstance.globalData.isPlay && appInstance.globalData.musicId === this.data.musicId) {
      this.setData({
        isPlay: true
      })
    }
    // 监听音乐的播放，暂停，关闭
    this.backgroundAudioManager = wx.getBackgroundAudioManager();
    this.backgroundAudioManager.onPlay(() => {
      this.setData({
        isPlay: true
      })
      // 修改app中的isPlay的状态和musicId
      appInstance.globalData.isPlay = true
      appInstance.globalData.musicId = this.data.musicId
    })
    this.backgroundAudioManager.onPause(() => {
      this.setData({
        isPlay: false
      })
      appInstance.globalData.isPlay = false
    })
    this.backgroundAudioManager.onStop(() => {
      this.setData({
        isPlay: false
      })
      appInstance.globalData.isPlay = false
    })

    // 音乐自动播放完毕，跳转到下一首音乐
    this.backgroundAudioManager.onEnded(() => {
      // 清除上一次请求的音乐详情
      this.setData({
        playInfo: {},
        // musicDetailData: {}
      })
      // 传递id到recommentSong页面，让其找到musicId传递回来
      PubSub.publish("musicChange", 'next')
      // 这里一定需要在调用一次。
      this.switchMusic()
    })

    // 监听音乐时长变化
    this.backgroundAudioManager.onTimeUpdate(() => {
      let _currentTime = this.backgroundAudioManager.currentTime;
      let currentTime = moment(_currentTime * 1000).format("mm: ss");
      let _bgcWidth = (_currentTime * 1000 * 430) / (this.data.musicDetailData.dt)
      this.setData({
        currentTime,
        bgcWidth: _bgcWidth
      })
    })
  },

  // 获取页面详情数据
  async getMusicDetail(id) {
    const {code, songs} = await request({
      url: '/song/detail',
      method: 'get',
      data: {
        ids: id
      }
    })
    if(code == 200) {
      this.setData({
        musicDetailData: songs[0], 
      // 获取总时长
        totalTime: moment(songs[0].dt).format('mm:ss')
      })
      // 动态设置标题
      wx.setNavigationBarTitle({
        title: this.data.musicDetailData.name
      })
    }
    // console.log("result", songs)
  },

  // 获取播放数据
  async getPlayInfo(id) {
    const {code, data} = await request({
      url: '/song/url',
      method: 'get',
      data: {
        id
      }
    })

    if(code === 200) {
      this.setData({
        playInfo: data[0]
      })
      // 点击播放
      if(this.data.musicDetailData && this.data.playInfo) {
        this.playControl(true)
      }
    }
  },

  // 点击播放暂停
  handlePlay() {
    let _isPlay = !this.data.isPlay
    this.playControl(_isPlay)
  },

  // 播放歌曲
  async playControl(isPlay) {
    // const {playInfo} = this.data
    // if(!playInfo) {
    //   await this.getPlayInfo(id)
    // }
    this.backgroundAudioManager.src = this.data.playInfo.url
    this.backgroundAudioManager.title = this.data.musicDetailData.name;
    
    if(isPlay) {
      this.backgroundAudioManager.play()
    }else {
      this.backgroundAudioManager.pause()
    }
  },

  // 切换歌曲
  handleMusicChange(e) {
    // 关闭前一首音乐
    this.backgroundAudioManager.stop()
    // 清除上一次请求的音乐详情
    this.setData({
      playInfo: {},
      // musicDetailData: {}
    })
    
    const type = e.currentTarget.id;
    // 传递id到recommentSong页面，让其找到musicId传递回来
    PubSub.publish("musicChange", type)
    // 接受音乐id，再次发送请求
    this.switchMusic()
  },

  // 切换音乐播放
  switchMusic() {
    PubSub.subscribe("currentMusicId", async (msg, id) => {
      console.log("id", id)
      this.setData({
        musicId: id
      })
      await this.getMusicDetail(id)
      await this.getPlayInfo(id)
      // 自动播放
      this.playControl(true)
      // 没请求一次，取消订阅
      PubSub.unsubscribe("currentMusicId")
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