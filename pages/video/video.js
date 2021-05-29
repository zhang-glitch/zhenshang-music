
import request from '../../utils/request'

Page({

  /**
   * 页面的初始数据
   */
  data: {
    tabList: [],
    activeIndex: 0,
    videoList: [],
    // 视频id
    vidId: '',
    // 保存时长和vid的数组，用来记录每条·视频的播放时长
    currentVidAndTimeList: [],
    // 是否下拉
    isLowerFresh: false
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.getTabList();
  },

  // 获取tab数据
  async getTabList() {
    const {data} = await request({
      url: '/video/group/list',
      method: 'get'
    })
    this.setData({
      tabList: data.slice(0, 10),
      activeIndex: data[0].id
    })
    // 请求视频列表
    this.getVideoList(this.data.activeIndex)
  },

  // 高亮标签
  handleChangeIndex(e) {
    // 显示正在加载
    wx.showLoading({
      title: '正在加载',
    })
    this.setData({
      activeIndex: e.currentTarget.dataset.videoid,
      // 每次请求都清空前一次的数据
      videoList: []
    })
    // 请求切换后的视频列表
    this.getVideoList(this.data.activeIndex)
  },

  // 获取视频列表
  async getVideoList(id) {
    const {datas, code} = await request({
      url: '/video/group',
      method: 'get',
      data: {
        id
      }
    })
    if(code === 200) {
      const _videoList = []
      datas.forEach((item, index) => {
        _videoList[index] = item.data
      });
      this.setData({
        videoList: _videoList,
        // 关闭下拉刷新
        isLowerFresh: false
      })
      // 关闭加载更多
      wx.hideLoading()
    }
  },

  // 控制视频的停止相互干扰
  handlePlay(e) {
    let vid = e.currentTarget.id;
    // this.vid != vid && this.videoObj?.stop()
    // this.vid = vid
    // 这里是为了判断显示还是隐藏video组件的
    this.setData({
      vidId: vid
    })
    this.videoObj = wx.createVideoContext(vid)
    const isExit = this.data.currentVidAndTimeList.find(item => {
      return item.vid == vid
    })
    if(isExit) {
      // 存在，跳转到原来播放的位置
      this.videoObj.seek(isExit.currentTime)
    }else {
      this.videoObj?.play();
    }
  },

  // 获取视频的播放时长和id
  handleTimeUpdate(e) {
    const {currentVidAndTimeList} = this.data
    const currentTime = e.detail.currentTime;
    const videoId = e.currentTarget.id;
    const isExit = currentVidAndTimeList.find(item => {
      return item.vid == videoId
    })
    if(isExit) {
      // 表示原来已经存在,只需要修改currentTtime即可
      isExit.currentTime = e.detail.currentTime;
    }else {
      // 以前不存在，将该条数据加入到数组中
      currentVidAndTimeList.push({
        vid: videoId,
        currentTime
      })
    }
    this.setData({
      currentVidAndTimeList
    })
  },

  // 当视频播放完毕
  handleEnded(e) {
    const {currentVidAndTimeList} = this.data
    // 清除currentVidAndTime对应的数据
    const startIndex = currentVidAndTimeList.findIndex(item => {
      item.vid == e.currentTarget.id
    })
    currentVidAndTimeList.splice(startIndex, 1);
    this.setData({
      currentVidAndTimeList
    })
  },

  // 下拉刷新
  handleLowerFresh() {
    const {activeIndex} = this.data
    // 再次发送请求
    this.getVideoList(activeIndex)
  },

  // 上拉加载更多
  async handleToLower() {
    const _videoList = [];
    const {videoList, activeIndex} = this.data;
    _videoList.push(...videoList);
    // 发送请求
    const {datas, code} = await request({
      url: '/video/group',
      method: 'get',
      data: {
        id: activeIndex
      }
    })
    if(code === 200) {
      const _videoData = []
      datas.forEach((item, index) => {
        _videoData[index] = item.data
      });
      _videoList.push(..._videoData);
      this.setData({
        videoList: _videoList
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
  onShareAppMessage: function (e) {
    const {videoList} = this.data
    const videoId = e.target.id
    const isShareId = videoList.find(item => {
      return item.vid == videoId
    })
    return {
      title: isShareId?.title,
      path: '/pages/video/video',
      imageUrl: isShareId?.coverUrl
    }
  }
})