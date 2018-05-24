const config = {
	questionTime: 180,   // 每个题库倒计时时间,s
	lessTime: 10,       // 剩时不多,s
	nextQuestionTime: 1500,  // 每条题目间隔时间, ms
  route:'https://haotaitai.hengdikeji.com/nw/public/index.php/',
  token:'ioeryuqw;flasdfqpweru5432()*&(3u',
  share_msg:'灯火学堂',
  share_image:''
}

const api = {
  WXlogin: 'index/Weixin/index',//登录
  WXopens: 'index/Weixin/opens',//昵称头像
  mySore: 'index/Index/mySore',//个人积分
  getExplain:'index/Index/getExplain',//活动说明
  getPrize: 'index/Index/getPrize',//礼品
  getUser: 'index/Index/getUser',//查看是否填写信息、兑奖
  addUser: 'index/Index/add_user',//提交个人信息
  testType: 'index/Index/testType',//题库类型
  testTypeError: 'index/Index/testTypeError',//错题题库类型
  testNumber: 'index/Index/testNumber',//试题套数
  getTest: 'index/Index/getTest',//试题
  addSore: 'index/Index/addSore',//保存积分
  addErroe: 'index/Index/addErroe',//保存错题
  wrongNumber:'index/Index/wrongNumber',//错题套数
  wrongTest: 'index/Index/wrongTest',//错题套数
  delErroe: 'index/Index/delErroe',//删除错题
  record: 'index/Index/record',//删除错题
  myGift: 'index/Index/myGift', 
  formId: 'index/Index/putFormId', //去提交一下 formId 
  score_rank: 'index/Rank/score_rank', //积分排行
  user_test: 'index/Rank/user_test', //上传试题
  test_score: 'index/Rank/test_score', //上传试题获得的积分
  my_test_score: 'index/Rank/my_upload', //我的上传试题
  myTest: 'index/Rank/myTest', //我的上传试题
  click: 'index/Rank/click', //点赞
  sign: 'index/Rank/sign', //签到
  share: 'index/Fater/share_rank', //分享者排名
  share_click: 'index/Fater/share_click', //点赞功能
  // sort_click_zan: 'index/Fater/sort_click_zan', //积分排行榜点赞功能
}

const path = {
	topicListPage: '../topic-list/topic-list',
	topicPage: '../topic/topic',
	questionPage: '../question/question',
	indexPage: '../index/index',
	indexPage: '../index/index',
	giftPage: '../gift/gift',
	myDataPage: '../myData/myData',
	wrongPage: '../wrong/wrong',
	descPage: '../desc/desc',
  wrongListPage:'../wrong-list/wrong-list',
  wrongQuestionPage:'../wrong-question/wrong-question',
  reviewListPage: '../review-list/review-list',
  rankPage: '../rank/rank',
  reviewPage: '../review/review',
  uploadDecPage: '../upload-dec/upload-dec',
  uploadPage: '../upload/upload',
  uploadListPage: '../upload-list/upload-list',
  partyPage: '../party/party'
}

module.exports = {
	config,
	api,
	path
}