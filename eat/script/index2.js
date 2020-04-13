"use strict";

function _instanceof(left, right) { if (right != null && typeof Symbol !== "undefined" && right[Symbol.hasInstance]) { return !!right[Symbol.hasInstance](left); } else { return left instanceof right; } }

function remInit(doc, win) {
  var docEl = doc.documentElement,
      resizeEvt = 'orientationchange' in window ? 'orientationchange' : 'resize',
      recalc = function recalc() {
    var clientWidth = docEl.clientWidth;

    if (!clientWidth) {
      return;
    }

    docEl.style.fontSize = 50 * (clientWidth / 750) + 'px';
  };

  if (!doc.addEventListener) {
    return;
  }

  win.addEventListener(resizeEvt, recalc, false);
  doc.addEventListener('DOMContentLoaded', recalc, false);
  recalc();
} // 时间比较


function compareTime(startTime, stopTime) {
  var intStartTime = 0;

  if (typeof startTime == 'string' && startTime.constructor == String) {
    var startTimeArray = startTime.split(":");

    if (startTimeArray.length == 3) {
      intStartTime = startTimeArray[0] * 3600 + startTimeArray[1] * 60 + startTimeArray[2];
    } else {
      console.log('开始时间格式错误');
      return false;
    }
  } else {
    console.log('开始时间格式错误');
    return false;
  }

  var intStopTime = 0;

  if (typeof stopTime == 'string' && stopTime.constructor == String) {
    var stopTimeArray = stopTime.split(":");

    if (stopTimeArray.length == 3) {
      intStopTime = stopTimeArray[0] * 3600 + stopTimeArray[1] * 60 + stopTimeArray[2];
    } else {
      console.log('结束时间格式错误');
      return false;
    }
  } else {
    console.log('结束时间格式错误');
    return false;
  }

  if (intStopTime < intStartTime) {
    return false;
  }

  return true;
} // 午餐晚餐判断


function lunchOrDinner(curTime) {
  return compareTime('15:00:00', curTime);
}
/****判断版本*****/


setTimeout(function () {
  try {
    if (!jsVanish) {
      vm.alertModal("您的版本不支持web扫码，请升级新的版本！");
      return true;
    }
  } catch (err) {}
}, 300);
/****axios 部分*****/

var qs = Qs;
var service = axios.create({
  timeout: 8000,
  transformRequest: [function (data) {
    if (_instanceof(data, FormData)) {
      return data;
    } else {
      return decodeURIComponent(qs.stringify(data));
    }
  }]
}); //请求封装

service.interceptors.request.use(function (config) {
  config.headers.post['Content-Type'] = 'application/x-www-form-urlencoded';
  return config;
}, function (error) {
  return Promise.reject(error);
}); // 返回拦截

service.interceptors.response.use(function (response) {
  return response.data;
}, function (error) {
  return Promise.reject(error);
});
var api = {
  get: function get(url, params, requestOptions) {
    var opts = {
      params: params
    };

    if (requestOptions && _instanceof(requestOptions.cancel, Function)) {
      opts.cancelToken = new CancelToken(function (cancelFun) {
        requestOptions.cancel(cancelFun);
      });
    }

    return service.get("".concat(url), opts);
  },
  post: function post(url, params, requestOptions) {
    var opts = {
      params: params
    };

    if (requestOptions && _instanceof(requestOptions.cancel, Function)) {
      opts.cancelToken = new CancelToken(function (cancelFun) {
        requestOptions.cancel(cancelFun);
      });
    }

    return service.post("".concat(url), params);
  }
};
/****前端配置部分*****/

var CONFIG = {
  mode: 'NOMAL',
  // DEBUG模式  NORMAL模式
  startTime: '11:30:00',
  // 午餐开始时间
  startTime2: '17:30:00',
  // 晚餐开始时间
  loginUUID: '0afb2bc6-7521-4436-a4f5-8a3beafd6ce1',
  // 进餐厅UUID
  logoutUUID: 'eac28e56-147a-4362-85d1-e864f68bc9b', // 出餐厅UUID
  // 各楼层用餐时间
  floor: {
    '1':  {startTime: '11:30:00', startTime2: '17:30:00'},
    '8':  {startTime: '11:30:00', startTime2: '17:30:00'},
    '9':  {startTime: '11:30:00', startTime2: '17:30:00'},
    '10':  {startTime: '11:45:00', startTime2: '17:45:00'},
    '11':  {startTime: '11:45:00', startTime2: '17:45:00'},
    '2':  {startTime: '12:00:00', startTime2: '18:00:00'},
    '3':  {startTime: '12:00:00', startTime2: '18:00:00'},
    '4':  {startTime: '12:15:00', startTime2: '18:15:00'},
    '5':  {startTime: '12:30:00', startTime2: '18:30:00'},
    '6': {startTime: '12:45:00', startTime2: '18:45:00'},
    '7': {startTime: '12:45:00', startTime2: '18:45:00'}
  }
}; // 进餐厅扫码回调
setTimeout(function () {
  var json = JSON.parse(jsVanish.getVanishUserInfo());
  var roomCode = json.RoomCode;
  var floorWord = '';
  var floorWordArr = ['午餐11:30 晚餐17:30 8/9楼',
                   '午餐11:45 晚餐17:45 10/11楼',
                   '午餐12:00 晚餐18:00 2/3楼',
                   '午餐12:15 晚餐18:15 4楼',
                   '午餐12:30 晚餐18:30 5楼',
                   '午餐12:45 晚餐18:45 6/7楼'];
  var floorNum = getfloor(roomCode);
  switch(floorNum) {
    case '2':floorWord=floorWordArr[2];break;
    case '3':floorWord=floorWordArr[2];break;
    case '4':floorWord=floorWordArr[3];break;
    case '5':floorWord=floorWordArr[4];break;
    case '6':floorWord=floorWordArr[5];break;
    case '7':floorWord=floorWordArr[5];break;
    case '8':floorWord=floorWordArr[0];break;
    case '9':floorWord=floorWordArr[0];break;
    case '10':floorWord=floorWordArr[1];break;
    case '11':floorWord=floorWordArr[1];break;
  }
  if (floorWord == '') {
    // 未判断到楼层
    document.getElementById('allfloor').style.display='block';
  } else {
    document.getElementById('myfloor').innerHTML = floorWord;
  }
}, 200)

function loginSCAN(scanstring) {
  console.log(scanstring);

  if (scanstring !== CONFIG.loginUUID) {
    vm.alertModal('请扫描正确二维码');
    return;
  }

  var params = {
    email: vm.$data.userEmail
  }; // 发送http请求

  api.post('/canteennew/addOne', params).then(function (res) {
    if (res.status_code == 0) {
      /*
          0添加成功 1添加失败 2email格式错误 3用户不存在（提示未订餐） 4用户存在但未订午餐
          5用户存在但未订晚餐  6未到用餐时间
      */
      switch (res.data.addStatus) {
        case 0:
          vm.alertModal('扫码成功');
          break;

        case 1:
          return Promise.reject('请勿重复扫码');
          break;

        case 2:
          return Promise.reject('用户邮箱格式错误');
          break;

        case 3:
          return Promise.reject('您未订餐');
          break;

        case 4:
          return Promise.reject('您未订午餐');
          break;

        case 5:
          return Promise.reject('您未订晚餐');
          break;

        case 6:
          return Promise.reject('未到用餐时间');
          break;
      }
    } else {
      return Promise.reject('请求失败，请刷新页面后重试');
    }
  }).catch(function (err) {
    vm.alertModal(err); // vm.refeshPage();
  });
} // 出餐厅扫码回调


function logoutSCAN(scanstring) {
  console.log(scanstring);

  if (scanstring !== CONFIG.logoutUUID) {
    vm.alertModal('请扫描正确二维码');
    return;
  }

  var params = {
    email: vm.$data.userEmail
  }; // 发送http请求

  api.post('/canteennew/moveOne', params).then(function (res) {
    if (res.status_code == 0) {
      if (res.data.move == 1) {
        vm.alertModal('就餐完毕');
        vm.refeshPage();
      } else {
        return Promise.reject('未就餐 或 已就餐结束');
      }
    } else {
      return Promise.reject('请求失败，请刷新页面后重试');
    }
  }).catch(function (err) {
    vm.alertModal(err);
    vm.refeshPage();
  }); // vm.openModal();
} // 扫码


function SCAN(scanstring) {
  console.log(scanstring);

  if (scanstring.indexOf(CONFIG.loginUUID) >= 0) {
    // 进餐厅
    if (lunchOrDinner(vm.$data.curTime)) {
      // 晚餐
      if (compareTime(CONFIG.startTime2, vm.$data.curTime)) {// 在晚餐时间
        // 判断对应楼层是否到用餐时间
        var json = JSON.parse(jsVanish.getVanishUserInfo());
        var roomCode = json.RoomCode;
        if (checkFloorTime(getfloor(roomCode), vm.$data.curTime, '2')) { // 获取楼层并验证该楼层是否到用餐时间
        } else {
          // 还没到对应楼层的用餐时间
          vm.alertModal('您所在的楼层用餐时间是'+CONFIG.floor[getfloor(roomCode)]['startTime2'])+'  现在尚未到您的用餐时间，请稍后再来~';
          return;
        }
      } else {
        vm.alertModal('还不到晚餐时间哦！');
        return;
      }
    } else {
      // 午餐
      if (compareTime(CONFIG.startTime, vm.$data.curTime)) {// 在午餐时间
        // 判断对应楼层是否到用餐时间
        var json = JSON.parse(jsVanish.getVanishUserInfo());
        var roomCode = json.RoomCode;
        if (checkFloorTime(getfloor(roomCode), vm.$data.curTime, '1')) { // 获取楼层并验证该楼层是否到用餐时间
        } else {
          // 还没到对应楼层的用餐时间
          vm.alertModal('您所在的楼层用餐时间是'+CONFIG.floor[getfloor(roomCode)]['startTime'])+'  现在尚未到您的用餐时间，请稍后再来~';
          return;
        }
      } else {
        vm.alertModal('还不到午餐时间哦！');
        return;
      }
    }

    var params = {
      email: vm.$data.userEmail
    }; // 发送http请求

    api.post('/canteennew/addOne', params).then(function (res) {
      if (res.status_code == 0) {
        /*
            0添加成功 1添加失败 2email格式错误 3用户不存在（提示未订餐） 4用户存在但未订午餐
            5用户存在但未订晚餐  6未到用餐时间
        */
        switch (res.data.addStatus) {
          case 0:
            vm.alertModal('扫码成功', true);
            vm.refeshPage();
            break;

          case 1:
            return Promise.reject('请勿重复扫码');
            break;

          case 2:
            return Promise.reject('用户邮箱格式错误');
            break;

          case 3:
            return Promise.reject('您未订餐');
            break;

          case 4:
            return Promise.reject('您未订午餐');
            break;

          case 5:
            return Promise.reject('您未订晚餐');
            break;

          case 6:
            return Promise.reject('未到用餐时间');
            break;
        }
      } else {
        return Promise.reject('请求失败，请刷新页面后重试');
      }
    }).catch(function (err) {
      // vm.alertModal(err);
      vm.setFailFlag(err);
      vm.refeshPage();
    });
  } else if (scanstring.indexOf(CONFIG.logoutUUID) >= 0) {
    // 出餐厅
    var _params = {
      email: vm.$data.userEmail
    }; // 发送http请求

    api.post('/canteennew/moveOne', _params).then(function (res) {
      if (res.status_code == 0) {
        if (res.data.move == 1) {
          vm.alertModal('就餐完毕,记得要洗手或消毒哦!');
          vm.refeshPage();
        } else {
          return Promise.reject('未就餐 或 已就餐结束');
        }
      } else {
        return Promise.reject('请求失败，请刷新页面后重试');
      }
    }).catch(function (err) {
      vm.alertModal(err);
      vm.refeshPage();
    });
  } else {
    // 错误码
    vm.alertModal('请扫描正确的二维码');
    vm.refeshPage();
  }
}
// 解析楼层号
function getfloor (data) {
  try {
    // data的格式为：W_B1003
    if (!data || data.indexOf('W_B') < 0) {
      return 1;
    }
    var room = data.replace('W_B', '');
    var floor = -1;
    if (room.length > 3) {
      // 楼层是两位数
      floor = room.substr(0, 2);
    } else {
      floor = room.substr(0, 1);
    }
    if (floor == 2 ||
        floor == 3 ||
        floor == 4 ||
        floor == 5 ||
        floor == 6 ||
        floor == 7 ||
        floor == 8 ||
        floor == 9 ||
        floor == 10 ||
        floor == 11
        ) {
      return floor;
    }
    return 1
    
  } catch (e) {
    return 1;
  }
}
/*
 * floor 楼层
 * time 当前时间
 * type 类型（1：午餐；2：晚餐）
 */ 
function checkFloorTime (floor, time, type) {
  var timeType = '';
  if (type == 1) {
    timeType = 'startTime';
  } else {
    timeType = 'startTime2';
  }
  return compareTime(CONFIG.floor[floor][timeType], time);
}
/****VUE 部分****/


function getCurTime() {
  function convert(s) {
    return s < 10 ? '0' + s : s;
  }

  var myDate = new Date();
  var h = convert(myDate.getHours());
  var m = convert(myDate.getMinutes());
  var s = convert(myDate.getSeconds());
  return h + ':' + m + ':' + s;
}

var vm = new Vue({
  el: '#app',
  data: {
    curTime: getCurTime(),
    // 当前时间
    curNum: 0,
    // 当前用餐人数
    curWait: 0,
    // 当前等待人数
    userEmail: '',
    // 唯一标识号
    userName: '',
    // 楼层
    roomCode: 'W_B101',
    modalShow: false,
    //确认框
    modalAlert: false,
    //提示框
    alertMsg: '',
    //提示信息
    failFlag: false,
    //失败页
    failMsg: '',
    //失败信息
    typeFlag: false //提示框是否加icon

  },
  created: function created() {
    var _this = this;

    remInit(document, window);

    if (CONFIG.mode === 'DEBUG') {
      new VConsole();
    } // 获取用户信息


    this.getVanishUserInfo(function () {
      var openid = _this.checkDirectOpen('id');

      if (openid) {
        // 扫码进入
        SCAN(openid);
      } else {
        // 非扫码进入
        _this.alertModal('请扫码  进入或离开   餐厅');

        _this.refeshPage();
      }
    });
    setInterval(this.getCurrentTime, 1000);
  },
  methods: {
    //alert弹框
    alertModal: function alertModal(msg, type) {
      this.typeFlag = type ? type : false;
      this.modalAlert = true;
      this.alertMsg = msg;
    },
    //设置失败标志failFlag
    setFailFlag: function setFailFlag(msg) {
      this.failFlag = true;
      this.failMsg = msg;
    },
    // 更新时间
    getCurrentTime: function getCurrentTime() {
      this.curTime = getCurTime();
    },
    // 扫码用餐
    scanLogin: function scanLogin() {
      try {
        if (lunchOrDinner(this.curTime)) {
          // 晚餐
          if (compareTime(CONFIG.startTime2, this.curTime)) {// 在晚餐时间
            // 判断对应楼层是否到用餐时间
            var json = JSON.parse(jsVanish.getVanishUserInfo());
            var roomCode = json.RoomCode;
            if (checkFloorTime(getfloor(roomCode), vm.$data.curTime, '2')) { // 获取楼层并验证该楼层是否到用餐时间
            } else {
              // 还没到对应楼层的用餐时间
              vm.alertModal('您所在的楼层用餐时间是'+CONFIG.floor[getfloor(roomCode)]['startTime2'])+'  现在尚未到您的用餐时间，请稍后再来~';
              return;
            }
          } else {
            this.alertModal('还不到晚餐时间哦！');
            return;
          }
        } else {
          // 午餐
          if (compareTime(CONFIG.startTime, this.curTime)) {// 在午餐时间
            // 判断对应楼层是否到用餐时间
            var json = JSON.parse(jsVanish.getVanishUserInfo());
            var roomCode = json.RoomCode;
            if (checkFloorTime(getfloor(roomCode), vm.$data.curTime, '1')) { // 获取楼层并验证该楼层是否到用餐时间
            } else {
              // 还没到对应楼层的用餐时间
              vm.alertModal('您所在的楼层用餐时间是'+CONFIG.floor[getfloor(roomCode)]['startTime'])+'  现在尚未到您的用餐时间，请稍后再来~';
              return;
            }
          } else {
            this.alertModal('还不到午餐时间哦！');
            return;
          }
        }

        if (!this.userEmail) {
          this.alertModal('未获取到用户信息，请刷新重试');
          return;
        }

        jsVanish.startScan('loginSCAN'); // loginSCAN();
      } catch (err) {
        console.error(err);
      }
    },
    // 获取用户信息
    getVanishUserInfo: function getVanishUserInfo(callback) {
      var _this2 = this;

      setTimeout(function () {
        try {
          var json = JSON.parse(jsVanish.getVanishUserInfo());
          _this2.userEmail = "cc@myhexin.com";
          _this2.userName = "CC";
          _this2.roomCode = "9";
          callback && callback();
        } catch (e) {}
      }, 500);
    },
    // 打开模态框
    openModal: function openModal() {
      this.modalShow = true;
    },
    // 关闭模态框
    closeModal: function closeModal() {
      this.modalShow = false;
      this.modalAlert = false;
    },
    // 查询当前总数
    searchCurNum: function searchCurNum() {
      var _this3 = this;

      var params = {
        email: this.userEmail
      };
      api.get('/canteennew/getCount', params).then(function (res) {
        if (res.status_code == 0) {
          _this3.curNum = res.data.count || 0;
        } else {
          return Promise.reject('参数错误，请刷新页面重试');
        }
      }).catch(function (err) {
        _this3.alertModal(err);
      });
    },
    // 查询当前排队
    searchCurWait: function searchCurWait() {
      var _this4 = this;

      var params = {
        email: this.userEmail
      };
      api.get('/canteennew/getOne', params).then(function (res) {
        if (res.status_code == 0) {
          _this4.curWait = res.data.index || 0;
        } else {
          return Promise.reject('参数错误，请刷新页面重试');
        }
      }).catch(function (err) {
        _this4.alertModal(err);
      });
    },
    // 刷新页面
    refeshPage: function refeshPage() {
      this.searchCurWait();
      this.searchCurNum();
    },
    // 扫码登出
    scanLogout: function scanLogout() {
      try {
        if (!this.userEmail) {
          this.alertModal('未获取到用户信息，请刷新重试');
          return;
        }

        jsVanish.startScan('logoutSCAN');
      } catch (err) {}
    },
    // 直接登出
    logout: function logout() {
      var _this5 = this;

      var params = {
        email: this.userEmail
      }; // 发送请求

      api.post('/canteennew/moveOne', params).then(function (res) {
        if (res.status_code == 0) {
          if (res.data.move == 1) {
            _this5.alertModal('就餐完毕'); // 关闭模态框


            _this5.closeModal(); // 刷新页面


            _this5.refeshPage();
          } else {
            return Promise.reject('未就餐 或 已就餐结束');
          }
        } else {
          return Promise.reject('请求失败，请刷新页面后重试');
        }
      }).catch(function (err) {
        _this5.closeModal();

        _this5.alertModal(err);
      });
    },
    // 扫码
    scan: function scan() {
      try {
        if (!this.userEmail) {
          this.alertModal('未获取到用户信息，请刷新重试');
          return;
        }

        jsVanish.startScan('SCAN');
      } catch (err) {}
    },
    // 判断是否直接扫码打开页面
    checkDirectOpen: function checkDirectOpen(key) {
      var query = window.location.search.substring(1);
      var vars = query.split("&");

      for (var i = 0; i < vars.length; i++) {
        var pair = vars[i].split("=");

        if (pair[0] == key) {
          return pair[1];
        }
      }

      return false;
    }
  }
});