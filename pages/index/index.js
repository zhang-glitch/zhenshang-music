import request from '../../utils/request';

Page({

  /**
   * 页面的初始数据
   */
  data: {
    bannerData: [],
    recommentData: [],
    rankData: {}
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: async function (options) {
    // banner数据
    const { banners } = await request({
      url: '/banner',
      data: {
        type: 2
      },
      method: 'get'
    })
    // 推荐歌曲数据
    const { result } = await request({
      url: '/personalized',
      method: 'get',
      data: {
        limit: 10
      }
    })

    this.setData({
      bannerData: banners,
      recommentData: result
    })
    // 歌曲排行数据
    // 我们之请求5个排行
    let index = 0;
    let rankArr = []
    while (index < 5) {
      const { playlist } = await request({
        url: '/top/list',
        method: 'get',
        data: {
          idx: index++
        }
      })
      rankArr.push({
        name: playlist.name,
        rankList: playlist.tracks.slice(0, 3)
      })

      this.setData({
        // 只取前三条
        rankData: rankArr
      })
    }

  },

  // 跳转到推荐歌曲页面
  toRecommentSong() {
    wx.navigateTo({
      url: '/pages/recommentSong/recommentSong'
    })
  },

  // 跳转到搜索页面
  toSearch() {
    wx.navigateTo({
      url: '/pages/search/search'
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