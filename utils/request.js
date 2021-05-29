
const baseUrl = "https://zhenshang.cn.utools.club";

export default function request({url, method, data={}}) {
  return new Promise((resolve, reject) => {
    wx.request({
      url: baseUrl + url,
      method,
      data,
      header: {
        cookie: wx.getStorageSync('cookies') || ''
      },
      success: (res) => {
        // 如果登录了，就将cookies设置到本地
        if(data?.isLogin) {
          wx.setStorageSync('cookies', res.cookies.find(item => item.includes("MUSIC_U")))
        }
        resolve(res.data)
      },
      fail: err => {
        reject(err)
      }
    })
  })
}