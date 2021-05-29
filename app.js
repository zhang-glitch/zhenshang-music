// app.js
App({
  // 设置全局变量，用于保存当页面销毁时的状态
  globalData: {
    // 是否播放
    isPlay: false,
    musicId: ''
  },
  // 获取小程序的场景值。如何进入小程序的。
  onLaunch(option) {
    console.log("option", option)
  }
})
