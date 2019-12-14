/*
 * @Author: your name
 * @Date: 2019-11-20 19:36:15
 * @LastEditTime: 2019-12-13 10:28:32
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \vue_shop\vue.config.js
 */
module.exports = {
  devServer: {
    //自动打开浏览器
    open: true
  }
}

//项目优化分环境打包

module.exports = {
  //生成一个配置节点，指向的值是function处理函数，通过config接受默认的webpack配置对象
  chainWebpack: config => {
    //通过when 判断当前是什么阶段的编译模式。
    //通过 entry 得到默认的打包入口，然后再通过 clear() 清空掉，然后再通过add新增一个自己的打包入口
    //产品发布阶段如何自定义打包入口
    config.when(process.env.NODE_ENV === 'production', config => {
      //这里面都是项目的依赖包
      config.set('externals', {
        vue: 'vue',
        'vue-router': 'VueRouter',
        axios: 'axios',
        lodash: '_',
        echarts: 'echarts',
        nprogress: 'NProgress',
        'vue-quill-editor': 'vueQuillEditor'
      })

      config.entry('app').clear().add('./src/main-prod.js')
    })
    //产品开发阶段如何自定义打包入口
    config.when(process.env.NODE_ENV === 'development', config => {
      config.entry('app').clear().add('./src/main-dev.js')
    })
  }
}
