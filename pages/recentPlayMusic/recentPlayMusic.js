
import request from '../../utils/request'
import PubSub from 'pubsub-js'

Page({

  /**
   * 页面的初始数据
   */
  data: {
    allMusicList: [],
    currentMusicList: [],
    user: {}, 
    musicLength: 0, 
    currentMusicIndex: 0,
    allMusicListNum: 0,
    // 规定currentMusicList的数据总数
    currentMusicListNum: 0
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
      this.getAllMusicList(this.data.user.userId)
    }
  },

  async getAllMusicList(userId) {
    let _allMusicList = []
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
      weekData.forEach((item, index) => {
        _allMusicList[index] = item.song
      })
      this.setData({
        allMusicList: _allMusicList,
        allMusicListNum: _allMusicList.length
      })
    }
    this.setData({
      // 一次展示十条数据
      currentMusicList: this.data.allMusicList.splice(0, 10),
      // 更新currentMusicList数据数
      currentMusicListNum: 10
    });

    this.setData({
      musicLength: this.data.currentMusicList.length
    })

    // 接受musicDetail页面传递的数据
    PubSub.subscribe("musicChange", (msg, data) => {
      let {currentMusicList, musicLength, currentMusicIndex} = this.data;
      if(data === 'pre') {
        // 切换到上一首
        if(currentMusicIndex <= 0) {
          currentMusicIndex = musicLength - 1;
        }else {
          currentMusicIndex -= 1;
        }
      }else{
        // 切换到下一首
        if(currentMusicIndex >= musicLength - 1) {
          console.log("播放完毕，自动切换到下一首")
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
      const musicId = currentMusicList[currentMusicIndex].id;
      PubSub.publish("currentMusicId", musicId)
    })
  },

  // 接收musicList组件传递的数据
  getMusicIndex(params) {
    this.setData({
      currentMusicIndex: params.detail
    })
  },

  // 下拉加载更多
  loadingMore(params) {
    const {currentMusicList, allMusicList, currentMusicListNum, allMusicListNum} = this.data
    const _allMusicList = allMusicList;
    const _currentMusicList = [];
    if(params.detail && currentMusicListNum <= allMusicListNum) {
      this.setData({
        currentMusicListNum: currentMusicListNum + 10
      })
      _currentMusicList.push(...currentMusicList, ..._allMusicList.splice(this.data.currentMusicListNum - 10, this.data.currentMusicListNum))
      this.setData({
        currentMusicList: _currentMusicList
      })
    }
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