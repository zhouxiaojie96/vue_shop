import Vue from 'vue'
//第一个参数是过滤器名字，第二个是过滤器处理函数，函数里面的参数就是要处理的数据
Vue.filter('dateFormat',function(originVal){
  const dt = new Date(originVal)//创建一个date对象
  const y = dt.getFullYear()//获取到年份
  //获取到月份
  //获取到的月份是从0开始的，所以要加1，
  //如果不足两位前面补充0 需要调用padStart 字符串方法，第一个参数是总长度是多少，第二个参数是入过不足前面就用什么补充。
  const m = (dt.getMonth() + 1 + '').padStart(2,"0")
  const d = (dt.getDate() + '').padStart(2,"0")//获取天数
  const hh = (dt.getHours() + '').padStart(2,"0")//获取小时
  const mm = (dt.getMinutes() + '').padStart(2,"0")//获取分钟数
  const ss = (dt.getSeconds() + '').padStart(2,"0")//获取秒数
  return `${y}-${m}-${d} ${hh}:${mm}:${ss}`//返回时间格式
})