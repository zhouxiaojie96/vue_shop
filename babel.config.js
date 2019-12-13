/*
 * @Author: your name
 * @Date: 2019-11-20 11:22:45
 * @LastEditTime: 2019-12-12 14:48:17
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \vue_shop\babel.config.js
 */
//用于项目发布阶段用到的 babel 插件
const prodPlugins = []
//判断当前项目阶段是否是发布阶段
if(process.env.NODE_ENV === "production"){
  //transform-remove-console 功能是把项目中的console代码都去掉
  prodPlugins.push("transform-remove-console")
}

module.exports = {
  'presets': [
    '@vue/cli-plugin-babel/preset'
  ],
  'plugins': [
    [
      'component',
      {
        'libraryName': 'element-ui',
        'styleLibraryName': 'theme-chalk'
      }
    ],
    //发布产品时候的插件数组
    ...prodPlugins//... 是展开运算符，是把 数组中的每一项都展开了放到另一个数组中
  ]

}
