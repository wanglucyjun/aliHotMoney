/**
 * 小程序配置文件,chang name
 */

var host = "https://wx.c4chem.com"

var config = {

    // host地址
    host,

    // 初始化接口
    initUrl: `${host}/site/init`,

    // 登录地址，用于建立会话
    loginUrl: `${host}/user/do-login`,

    //
    updateUrl: `${host}/user/info-update`,
   
    // 用code换取openId
    openIdUrl: `${host}/openid`,

    // 生成红包接口
    hongbaoCreateUrl: `${host}/hongbao/create`,

    // 上传文件接口
    uploadUrl: `${host}/file/upfile`,

    // 查询红包接口
    hongbaoDetailUrl: `${host}/hongbao/detail`,

    // 领取红包接口
    hongbaoGetVoiceUrl: `${host}/hongbao/draw`,

    // 领取红包接口
    hongbaoGetUrl: `${host}/hongbao/draw`,

    // 查询我的余额接口
    hongbaoGetBalanceUrl: `${host}/withdraw/get-money`,

    // 查询我发出的红包记录接口
    hongbaoSendedUrl: `${host}/user/send-list`,

    // 查询我收到的红包记录接口
    hongbaoReceivedUrl: `${host}/user/receive-list`,

    // 查询提现记录接口
    drawListUrl: `${host}/withdraw/get-list`,

    // 提现我的余额接口
    hongbaoDrawUrl: `${host}/withdraw/submit`,

    // 查询问题帮助列表的接口
    hongbaoHelpUrl: `${host}/help/list`,

    //获取用户信息接口
    userinfoUrl: `${host}/user/info`,
    //获取用户信息接口
    accuseUrl: `${host}/help/feed-back`,
    publicHongbaoUrl: `${host}/hongbao/public-list`
};

module.exports = config
