// components/MusicList/MusicList.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    musicList: {
      type: Array
    },
    // scroll-view的高度
    musicListWrapperHeight: {
      type: Number || String,
      default: 402
    }
  },

  /**
   * 组件的初始数据
   */
  data: {

  },

  /**
   * 组件的方法列表
   */
  methods: {
    // 跳转到音乐详细页面
    toMusicDetail(e) {
      const id = e.currentTarget.id
      const musicIndex = e.currentTarget.dataset.musicindex;
      // 传递数据到recommentSong页面
      this.triggerEvent("getMusicIndex", musicIndex)
      wx.navigateTo({
        url: `/pages/musicDetail/musicDetail?id=${id}`,
      })
    },

    // 上拉加载更多
    handleToLower() {
      // 将请求数据的指令传送到recentPlayMusic页面
      this.triggerEvent("loadingMore", true)
    }
  }
})
