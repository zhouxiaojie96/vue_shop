/*
 * @Author: your name
 * @Date: 2019-11-20 19:36:15
 * @LastEditTime: 2019-12-13 09:14:28
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

module.exports = {
  //注意：代码中的 add 方法里的路径是项目 src 文件下的 main.js，是把 main.js 复制出两份名字不同的文件。
  //生成一个配置节点，指向的值是function处理函数，通过config接受默认的webpack配置对象
  chainWebpack: config => {

    
    //通过when 判断当前是什么阶段的编译模式。通过 process.env.NODE_ENV 可以拿到当前的编译模式
    //通过 entry 得到默认的打包入口，然后再通过 clear() 清空掉，然后再通过add新增一个自己的打包入口
    //产品发布阶段如何自定义打包入口
    config.when(process.env.NODE_ENV === 'production', config => {
      config.entry('app').clear().add('./src/main-prod.js')

      //解决单文件体积过大问题
      config.set('externals',{
          vue : 'vue',
          'vue-router' : 'VueRouter',
          axios : 'axios',
          lodash : '_',
          echarts : 'echarts',
          nprogress : 'NProgress',
          'vue-quill-editor' : 'vueQuillEditor'
      })  
      //自定义首页内容
      //通过 config.plugin() 函数找到html插件，通过 .tap 这个链式操作来修改这个插件里面的一些相关参数，里面是一个回调函数，
      //args 就是当前插件的里面的一些参数项，然后为 args 新增一个参数 通过 args[0] 为它追加一个自定义参数 isProd，然后再把这个参数 return 出去。//然后在首页中根据 isProd 的值来决定标题的名称。
      //htmlWebpackPlugin 是这个插件的具体名称，htmlWebpackPlugin.options 是所有的参数项，然后在页面上通过 .isProd 拿到 isProd 参数 。
      // config.plugin('html').tap(args =>{
      //   args[0].isProd = true
      //   return args
      // })
    })

    
    //产品开发阶段如何自定义打包入口
    config.when(process.env.NODE_ENV === 'development', config => {
      config.entry('app').clear().add('./src/main-dev.js')
      //自定义首页内容
      // config.plugin('html').tap(args =>{
      //   args[0].isProd = false
      //   return args
      // })
    })
  }
}
