
wx.config({
    debug: false,
    appId: '@ViewBag.WechatSignature.AppId',
    timestamp: '@ViewBag.WechatSignature.Timestamp',
    nonceStr: '@ViewBag.WechatSignature.Noncestr',
    signature: '@ViewBag.WechatSignature.Signature',
    jsApiList: [
        //'updateAppMessageShareData',
        //'updateTimelineShareData',
        'onMenuShareAppMessage',
        'onMenuShareTimeline',
    ],
});



wx.ready(function () {   //需在用户可能点击分享按钮前就先调用
    console.log("wx.ready");

    wx.onMenuShareAppMessage({
        title: '小黄鸭帮你算个税', // 分享标题
        desc: '一个计算2018新版个人所得税的小工具', // 分享描述
        link: '@ViewBag.WechatSignature.Url', // 分享链接，该链接域名或路径必须与当前页面对应的公众号JS安全域名一致
        imgUrl: 'http://www.cg-zhou.top/Content/Images/duck.jpg', // 分享图标
        type: 'link', // 分享类型,music、video或link，不填默认为link
        success: function () {
            // 用户点击了分享后执行的回调函数
            console.log("wx.onMenuShareAppMessage");
        }
    });

    wx.onMenuShareTimeline({
        title: '小黄鸭帮你算个税', // 分享标题
        link: '@ViewBag.WechatSignature.Url', // 分享链接，该链接域名或路径必须与当前页面对应的公众号JS安全域名一致
        imgUrl: 'http://www.cg-zhou.top/Content/Images/duck.jpg', // 分享图标
        success: function () {
            // 用户点击了分享后执行的回调函数
            console.log("wx.onMenuShareTimeline");
        },
    });

    @* wx.updateAppMessageShareData({
        title: '小黄鸭帮你算个税', // 分享标题
        desc: '一个计算2018新版个人所得税的小工具', // 分享描述
        link: '@ViewBag.WechatSignature.Url', // 分享链接，该链接域名或路径必须与当前页面对应的公众号JS安全域名一致
        imgUrl: 'http://www.cg-zhou.top/Content/Images/duck.jpg', // 分享图标
    }, function (res) {
        console.log("wx.updateAppMessageShareData");
        console.log(res);
    });

    wx.updateTimelineShareData({
        title: '小黄鸭帮你算个税', // 分享标题
        link: '@ViewBag.WechatSignature.Url', // 分享链接，该链接域名或路径必须与当前页面对应的公众号JS安全域名一致
        imgUrl: 'http://www.cg-zhou.top/Content/Images/duck.jpg', // 分享图标
    }, function (res) {
        console.log("wx.updateTimelineShareData");
        console.log(res);
    });*@
    });
wx.error(function (res) {
    console.log("wx.error");
    console.log(res);
});
