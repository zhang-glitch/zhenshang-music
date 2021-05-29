
import request from '../../utils/request'
let isSend = false; // 函数节流使用
let _historyList = []
Page({

  /**
   * 页面的初始数据
   */
  data: {
    defaultWord: '',
    // 热门歌曲
    hotMusicList: [],
    // 搜索记录列表
    historyList: [],
    // 搜索歌曲
    searchList: [],
    // 搜索框输入的内容
    searchContent: ''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.getDefaultWord()
    this.getHotMusicList()
  },

  // 获取默认搜索文字
  async getDefaultWord() {
    let { data, code } = await request({
      url: '/search/default',
      method: 'get'
    })

    if (code === 200) {
      this.setData({
        defaultWord: data.showKeyword
      })
    }
  },

  // 获取热搜歌曲
  async getHotMusicList() {
    const { code, data } = await request({
      url: '/search/hot/detail',
      method: 'get'
    })
    if (code === 200) {
      this.setData({
        hotMusicList: data
      })
    }
  },

  // 请求搜索接口
  async getSearchList() {
    const {searchContent, historyList} = this.data
    if (!searchContent) {
      this.setData({
        searchList: []
      })
      return;
    }
    const { code, result } = await request({
      url: '/search',
      method: 'get',
      data: {
        keywords: searchContent,
        limit: 10
      }
    })

    if (code === 200) {
      this.setData({
        searchList: result.songs
      })
    }
    // 将搜索的关键字添加到搜索历史记录中
    if(historyList.indexOf(searchContent) !== -1){
      historyList.splice(historyList.indexOf(searchContent), 1)
    }
    historyList.unshift(searchContent);
    this.setData({
      historyList
    })
  },
  // 数据改变
  changeWord(e) {
    const word = e.detail.value.trim();
    this.setData({
      searchContent: word
    })

    if(!word) {
      this.setData({
        searchList: []
      })
    }

    if(isSend){
      return
    }
    isSend = true;
    this.getSearchList();
    // 函数节流
   setTimeout( () => {
     isSend = false;
   }, 300)
  },

  // 删除历史记录
  deleteHistoryList() {
    wx.showModal({
      content: '确定清空全部历史记录吗?',
      success: ({confirm}) => {
        if(confirm) {
          this.setData({
            historyList: []
          })
        }
      }
    })
  },

  // 清除搜索框的内容
  clearInputValue() {
    this.setData({
      searchContent: '',
      searchList: []
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