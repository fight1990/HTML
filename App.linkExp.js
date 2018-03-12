linkAnalysis = function(url){
    var urlExp = {
        thread_exp: /\/\/(\w+.\w+.com)\/(wap\/)?forum-([1-9][0-9]*)-thread-([1-9][0-9]*)-([1-9][0-9]*)-([1-9][0-9]*).html(#([1-9][0-9]*))?([\?&amp;](.*))?$/i,
        owner_exp: /\/\/(\w+.\w+.com)\/(wap\/)?forum-([1-9][0-9]*)-thread-([1-9][0-9]*)-showthread-([1-9][0-9]*)-puid-([1-9][0-9]*)-([1-9][0-9]*)-([1-9][0-9]*).html(#([1-9][0-9]*))?([\?&amp;](.*))?$/i,
        forumList_exp: /\/\/(\w+.\w+.com)\/(wap\/)?forum-([1-9][0-9]*)-([1-9][0-9]*).html([\?&amp;](.*))?$/i,
        boardList: /\/r\/([1-9][0-9]*)\/(\w+).html([\?&amp;](.*))?$/i,
        wapBoardList: /\/\/\w+.\w+.com\/(wap\/)?board-([1-9][0-9]*)-([1-9][0-9]*).html([\?&amp;](.*))?$/i,
        board_exp: /\/\/(\w+.\w+.com)\/(wap\/)?board-([1-9][0-9]*)-thread-([1-9][0-9]*)-([1-9][0-9]*).html([\?&amp;](.*))?$/i,
        board_replay_exp: /\/r\/([1-9][0-9]*)\/(\w+).html\?fid=([1-9][0-9]*)&tid=([1-9][0-9]*)&bid=([1-9][0-9]*)&source=[0-9](&page=([1-9][0-9]*))*(&pid=([1-9][0-9]*))*/i,
        post_exp : /(\/\/(\w+.\w+.com))?(\/board)?\/redirect\/post\?fid=([1-9][0-9]*)&tid=([1-9][0-9]*)&pid=([1-9][0-9]*)/i,
        usrHome_exp : /\/\/(\w+.\w+.com)\/user\/(profile|thread)-([1-9][0-9]*)-([1-9][0-9]*).html/i,
        private_exp:/\/u\/msg\/send\?toUid=([0-9]+)/i,
        local_exp:/nineteenlou:\/\/(\w+)(-(\w+))*/i,
        suport_exp:/\/\/(\w+.\w+.com)\/support*/i,
        publish_exp:/\/\/(\w+.\w+.com)(\/wap)?\/(thread\/category\/normal|board)\/publish\?(fid|bid)=([1-9][0-9]*)/i
    }
    var ua = navigator.userAgent;
    var appVersion = [];
    var r = ua.match(/nineteenlou\/([0-9]+)\.([0-9]+)\.*([0-9]*)/);
    if(r != null){
        appVersion[0] = parseInt(r[1]);
        appVersion[1] = parseInt(r[2]);
        appVersion[2] = parseInt(r[3]);
    }
    var m = 0;
    for(var e in urlExp){
        var r = url.match(urlExp[e]);
        if(r != null){
            m = 1
            switch (e){
                case "thread_exp": bridgeGoToThread(r);
                    break;
                case "owner_exp": bridgeGoToLouzhu(r);
                    break;
                case "forumList_exp": bridgeGoToForum(r);
                    break;
                case "boardList": bridgeGoToBoardList(r);
                    break;
                case "wapBoardList": bridgeGoToBoardList(r);
                    break;
                case "board_exp": bridgeGotoBoard(r);
                    break;
                case "usrHome_exp":bridgeGotoUser(r);
                    break;
                case "post_exp": bridgeGoToPostThread(r);
                    break;
                case "board_replay_exp": bridgeGoToBoardThread(r);
                    break;
                case "private_exp": bridgeGoToPrivateLetter(r);
                    break;
                case "local_exp": bridgeGoToLocal(r);
                    break;
                case "suport_exp":bridge("gotoAdvice","null");
                    break;
                case "publish_exp":bridgeGoToPublish(r);
                    break;
            }
        }
    }
    if(m == 0){
        if(url.indexOf("m.19lou.com/d") > -1){
            var option = {
                showType : "",//showType :0 启动客户端 1(帖子详情页) 2（论坛页面） 3（生活馆页）4（小说详情页）6(跳转到我家)  7兴趣圈 8 圈子 9 创建兴趣圈 10 消息列表 12二维码他家
                threadUrl : "",
                cityName : "",
                bdName:"",
                fid:"",
                tid:"",
                pid:0,
                page:1
            }
            for(var p in option){
                var value = getQueryString(p,url)
                if(value != "")
                    option[p] = value;
            }
            if(option.threadUrl != ""){
                if(option.showType == "12"){
                    var rJson = {};
                    rJson.url = option.threadUrl;
                    bridge("gotoUser",rJson);
                }else{
                    bridge("gotoWebPage",{"title":"","url":unescape(option.threadUrl)});
                }
            }else{
                if(option.showType == "1"){
                    var rJson = {};
                    rJson.domain =getDomainByCityName(option.cityName);
                    rJson.fid = option.fid;
                    rJson.tid = option.tid;
                    rJson.page = option.page;
                    rJson.pid = option.pid;
                    bridge("threadInJump",rJson);
                }else if(option.showType == "2"){
                    var rJson = {};
                    rJson.domain = getDomainByCityName(option.cityName);
                    rJson.fid = option.fid;
                    rJson.forumName = "";
                    bridge("gotoForum",rJson);
                }else if(option.showType == "7"){
                    bridge("gotoBoardList",option.fid)
                }else{
                    bridge("gotoWebPage",{"title":"","url":url});
                }
            }
        }else if(url.indexOf("javascript") == -1){
            bridge("gotoWebPage",{"title":"","url":url});
        }
    }
    function getDomainByCityName(cityname){
        var cityList = new Array();
        cityList["hangzhou"] = "www.19lou.com";
        cityList["chongqing"] = "go.cqmmgo.com";
        cityList["taizhou"] = "taizhou.19lou.com";
        cityList["jiaxing"] = "jiaxing.19lou.com";
        cityList["ningbo"] = "ningbo.19lou.com";
        cityList["shaoxing"] = "shaoxing.19lou.com";
        cityList["huzhou"] = "huzhou.19lou.com";
        cityList["wenzhou"] = "wenzhou.19lou.com";
        cityList["jinhua"] = "jinhua.19lou.com";
        cityList["zhoushan"] = "zhoushan.19lou.com";
        cityList["quzhou"] = "quzhou.19lou.com";
        cityList["lishui"] = "lishui.19lou.com";
        cityList["xiaoshan"] = "xiaoshan.19lou.com";
        cityList["yuhang"] = "yuhang.19lou.com";
        cityList["linan"] = "linan.19lou.com";
        cityList["fuyang"] = "fuyang.19lou.com";
        cityList["tonglu"] = "tonglu.19lou.com";
        cityList["jiande"] = "jiande.19lou.com";
        cityList["ssh"] = "www.shanghaining.com";
        cityList["suzhou"] = "suzhou.19lou.com";
        cityList["fz"] = "www.ihome99.com";
        cityList["qz"] = "www.0595bbs.cn";
        cityList["jiaju"] = "home.19lou.com";
        return cityList[cityname];
    }
    function getQueryString(name,url) {
        var reg = new RegExp(name + "=([^&]*)(&|$)", "i");
        var r = url.match(reg);
        if (r != null) return unescape(r[1]); return "";
    }
    function bridgeGoToLocal(r){
        switch (r[1]){
            case "activity": bridge("activity","null");
                break;
            case "square": bridge("square","null");
                break;
            case "sign": bridge("sign","null");
                break;
            case "goldTask": bridge("goldTask","null");
                break;
            case "novel": bridge("novel","null");
                break;
            case "homeBottomTab": bridge("homeBottomTab",JSON.stringify({"position":r[3]}));
                break;
            case "homeTab":
                if(r[3] != undefined)bridge("homeTab",r[3]);
                break;
            case "createCircle":bridge("createCircle",JSON.stringify({}));
                break;
            case "experienceList":bridge("experienceList","null");
                break;
            case "findWelfare":
                if(r[3] != undefined)bridge("findWelfare",r[3]);
                break;
            default:
                if(r[3] != undefined)
                    bridge("gotoLocalPage",JSON.stringify({type:r[1],param:{id:r[3]}}));
                else
                    bridge("gotoLocalPage",JSON.stringify({type:r[1],param:{}}));
        }
    }
    function bridgeGoToPrivateLetter(r){
        bridge("gotoPrivateLetter",r[1]);
    }
    function bridgeGoToThread(r) {
        var rJson = {};
        rJson.domain = r[1];
        rJson.fid = r[3];
        rJson.tid = r[4];
        rJson.page = r[5];
        rJson.pid = 0;
        if(r[8] != undefined) rJson.pid = r[8];
        bridge("threadInJump",rJson);
    }
    function bridgeGoToBoardThread(r) {
        var rJson = {};
        rJson.domain = "www.19lou.com";
        rJson.fid = r[3];
        rJson.tid = r[4];
        rJson.page = 1;
        rJson.pid = r[9] != undefined?r[9]:0;
        bridge("threadInJump",rJson);
    }
    function bridgeGoToLouzhu(r) {
        var rJson={};
        rJson.domain = r[1];
        rJson.fid= r[3];
        rJson.tid = r[4];
        rJson.puid = r[5];
        rJson.page= r[7];
        rJson.pid = 0;
        if(r[10] != undefined) rJson.pid = r[10];
        bridge("threadInJump",rJson);
    }

    function bridgeGotoBoard(r) {
        var rJson={};
        rJson.domain = r[1];
        rJson.fid= r[3];
        rJson.tid = r[4];
        rJson.page= r[5];
        rJson.pid = 0;
        bridge("threadInJump",rJson);
    }
    function bridgeGoToForum (r) {
        var rJson = {};
        rJson.forumName = "";
        rJson.domain = r[1];
        rJson.fid = r[3];
        bridge("gotoForum",rJson);
    }
    function bridgeGoToBoardList (r) {
        var data = {};
        var bid = r[2];
        if(!isNaN(bid))
            data.bid = bid;
        else{
            data.domain = bid;
            bid = "https://www.19lou.com"+r[0];
        }
        connectWebViewJavascriptBridge(function(bridge){
            var apiKey = eval('('+bridge.getClientkey()+')');
            apiKey.sign = 1;
            data = $.extend(data,apiKey)
        });
        $.ajax({
            contentType:"application/json",
            type :"GET",
            url : "https://www.19lou.com/api/board/getBoardByDomain",
            data : data,
            dataType: 'jsonp',
            jsonp: "clientjsonp",
            success: function(res){
                if(res.code == "1" ){
                    if(res.board.is_pic_show)
                        bridge("gotoBlueprintSquare",bid)
                    else if(res.board.board_type == "8")
                        bridge("gotoBusinessCircle",bid)
                    else
                        bridge("gotoBoardList",bid)
                }else{
                    bridge("gotoBoardList",bid)
                }
            },
            error: function(e){
                bridge("gotoBoardList",bid)
            }
        })
    }

    function bridgeGoToPostThread(r){
        var rJson = {};
        rJson.domain = r[2];
        rJson.fid = r[4];
        rJson.tid = r[5];
        rJson.page = 1;
        rJson.pid = r[6];
        if(rJson.domain == undefined)rJson.domain="www.19lou.com";
        bridge("threadInJump",rJson);
    }

    function bridgeGotoUser(r){
        var rJson = {};
        rJson.domain = r[1];
        rJson.uid = r[3]
        bridge("gotoUser",rJson);
    }

    function bridgeGoToPublish(r){
        var rJson = {};
        rJson.domain = r[1];
        rJson.fid = r[5]
        bridge("gotoPostThread",rJson);
    }
    function bridge(type,data){
        if(data !="" && data !={}){
            connectWebViewJavascriptBridge(function(bridge){
                switch (type){
                    case 'threadInJump':bridge.threadInJump(JSON.stringify(data));
                        break;
                    case 'gotoForum': bridge.gotoForum(JSON.stringify(data));
                        break;
                    case 'gotoBoardList': bridge.gotoInterestGroupList(data);
                        break;
                    case 'gotoWebPage': bridge.createWebPage(data.title,data.url.replace(/(^\s*)|(\s*$)/g, ""));
                        break;
                    case 'gotoUser' :
                        if(appVersion[0]>=6){
                            bridge.gotoUserForJson(JSON.stringify(data));
                        }else{
                            bridge.gotoUser(data.uid);
                        }
                        break;
                    case 'gotoPrivateLetter' : bridge.gotoPrivateLetter(data);
                        break;
                    case "sign": bridge.jumpHtmlFile("签到", "sign.html",{isLogin:true});
                        break;
                    case "square":bridge.gotoSquare();
                        break;
                    case "activity":bridge.gotoActivity();
                        break;
                    case "goldTask": bridge.gotoGoldTask();
                        break;
                    case "novel": bridge.gotoNovel();
                        break;
                    case "homeBottomTab": bridge.gotoHomeBottomTab(data);
                        break;
                    case "homeTab":bridge.gotoHomeTab(data);
                        break;
                    case "createCircle":bridge.createCircle(data);
                        break;
                    case "gotoBusinessCircle":bridge.gotoBusinessCircle(data);
                        break;
                    case "gotoBlueprintSquare" : bridge.gotoBlueprintSquare(data);
                        break;
                    case "gotoAdvice" : bridge.gotoAdvice();
                        break;
                    case "experienceList" : bridge.jumpHtmlFile("19楼体验活动", "experience_list.html",JSON.stringify({isLogin:false}));
                        break;
                    case "gotoPostThread":bridge.gotoPostThread(data)
                        break;
                    case "gotoLocalPage" :bridge.gotoLocalPage(data)
                        break;
                    case "findWelfare" :bridge.jumpHtmlFile("抢福利", "find_welfare.html",JSON.stringify({categoryParentId:data,isLogin:false}));
                        break;
                }
            });
        }
    }
}
