// pages/login/login.js
import request from '../../utils/request'
Page({

  /**
   * 页面的初始数据
   */
  data: {
    phone: '',
    password: ''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

  },
  
  handleValue(e) {
    const type = e.target.id;
    this.setData({
      [type]: e.detail.value
    })
  },

  // 确定登录
  async handleLogin() {
    const {phone, password} = this.data;
    // 登录验证
    if(!phone) {
      wx.showToast({
        title: '手机号不能为空!',
        icon: 'error'
      })
      return;
    }

    const reg = /^1(3|4|5|6|7|8|9)\d{9}$/;
    if(!reg.test(phone)){
      wx.showToast({
        title: '手机号格式错误!',
        icon: 'error'
      })
      return;
    }
    
    // 验证密码
    if(!password) {
      wx.showToast({
        title: '密码不能为空',
        icon: 'error'
      })
    }

    const res = await request({
      url: '/login/cellphone',
      method: 'get',
      data: {
        phone: phone,
        password: password,
        isLogin: true
      }
    })
    if(res.code == 200) {
      // 将数据存储到localhost中，供我的页面使用
      wx.setStorageSync('user', JSON.stringify(res.profile))
      // 跳转到我的页面
      wx.reLaunch({
        url: '/pages/profile/profile'
      })
      wx.showToast({
        title: '登陆成功',
        icon: 'success'
      })
    }else if(res.code == 400) {
      wx.showToast({
        title: "手机号错误!",
        icon: 'error'
      })
    }else if(res.code == 502) {
      wx.showToast({
        title: '密码错误!',
        icon: 'error'
      })
    }else {
      wx.showToast({
        title: '登录失败，请重新登录!',
        icon: 'error'
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