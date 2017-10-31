var SERVICE = {
    end: '0'
};

SERVICE.ocx = {
    fnStopFixedOcx: function(ocxId) {
        var ocx = document.getElementById(ocxId);
        if (ocx) {
            ocx.StopChannelRealPlay(0);
            STATUS.fixedOcx[ocxId] = "";
        }
    },

    fnPlayFixedOcx: function(ocxId, devIp) {
        // console.log( "paly ocx, id=" + ocxId + ", ip=" + devIp );

        if (!STATUS.fixedOcx[ocxId]) {
            STATUS.fixedOcx[ocxId] = "";
        }

        // 如果正在播放的是同一个设备
        if (devIp == STATUS.fixedOcx[ocxId]) {
            ocx.StartChannelRealPlay(0, 0, 0);
            return;
        }

        // 播放的不是同一个设备，关闭现有视频，重新登录播放
        STATUS.fixedOcx[ocxId] = devIp;
        var ocx = document.getElementById(ocxId);
        if (!ocx) {
            // console.log("ocx not found:" + ocxId );
            return;
        }

        ocx.StopChannelRealPlay(0);
        ocx.Logout();

        var loginCode = ocx.Login(devIp, 34567, "admin", "");
        if (loginCode > 0) {
            ocx.StartChannelRealPlay(0, 0, 0);
        }

    },

    fnPlayOcx: function(devId) {
        // console.log("play ocx, dev id=: " + devId );
        var ocx = document.getElementById("ocx-" + STATUS.currentDevId);
        if (ocx) {
            // 如果当前显示的是同一个ocx, 开始播放并返回
            if (devId == STATUS.currentDevId) {
                ocx.StartChannelRealPlay(0, 0, 0);
                return;
            }

            // 如果不是同一个ocx，停止播放当前ocx
            ocx.StopChannelRealPlay(0);
            // ocx.Logout();

        } // if

        STATUS.currentDevId = devId;
        var ocx1 = document.getElementById("ocx-" + STATUS.currentDevId);
        var ip = STATUS.deviceIpPrefix + devId;
        var loginCode = ocx1.Login(ip, 34567, "admin", "");
        if (loginCode > 0) {
            ocx1.StartChannelRealPlay(0, 0, 0);
        }


    },

    fnStopOcx: function() {
        var ocx = document.getElementById("ocx-" + STATUS.currentDevId);
        if (ocx) {
            ocx.StopChannelRealPlay(0);
        }
    },


    // mine-----------------


    //开始某个通道的录像
    fnStartRecord: function(ocxId, path) {
        var ocx = document.getElementById(ocxId)
            // ocx.StartChannelRecord(0, "D:/Program Files/NetSurveillance", 2)
        ocx.StartChannelRecord(0, path, 2)

    },
    //停止指定通道录像
    fnEndRecord: function(ocxId) {
        var ocx = document.getElementById(ocxId)
        if (ocx) {
            ocx.StopChannelRecord(0)
        }
    },
    //抓图
    fnStartCapturePicture: function(ocxId) {
        var ocx = document.getElementById(ocxId)
        if (ocx) {
            ocx.BMPChannelCapturePicture(0, '');
        }
    },
    //打开声音
    fnOpenChannelSound: function(ocxId) {
        //判断预览是否开启
        if (STATUS.fixedOcx[ocxId]) {
            var ocx = document.getElementById(ocxId)
            if (ocx) {
                ocx.OpenChannelSound(0, 2)
                    // console.log(111111111)
            }

        }
    },

    //关闭声音
    fnCloseChannelSound: function(ocxId) {
        //判断预览是否开启		
        if (STATUS.fixedOcx[ocxId]) {
            var ocx = document.getElementById(ocxId)
            if (ocx) {
                ocx.CloseChannelSound(0, 2)
                    // console.log(2222222)
            }

        }
    },
    //开始对讲
    fnStartTalk: function(ocxId) {
        var ocx = document.getElementById(ocxId)
        if (ocx) {
            ocx.StartTalk()
                // console.log(2222222)
        }
    },
    //停止对讲
    fnStopTalk: function(ocxId) {
        var ocx = document.getElementById(ocxId)
        if (ocx) {
            ocx.StopTalk()
                // console.log(2222222)
        }
    },
    // 开启全屏
    fnFullscreen: function(ocxId) {
        var ocx = document.getElementById(ocxId)
        ocx.Fullscreen(true)
    },
    // 关闭全屏
    fnCloseFullscreen: function(ocxId) {
        var ocx = document.getElementById(ocxId)
        ocx.Fullscreen(false)
    },
    end: '0'
}; // ocx