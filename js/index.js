// IEajax跨域
$.support.cors = true;

/**
 * hash实现路由跳转
 *
 */

$(function () {
    // hash实现路由跳转
    var hashArr = [
        '#video',
        '#tuopu',
        '#position',
        '#device',
        '#personal',
        '#system',
        '#file',
        '#language'
    ]
    var length = hashArr.length
    for (var i = 0; i < length; i++) {
        $(hashArr[i]).hide()
    }
    $('#video').show()
    $(window).on('hashchange', function (e) {
        console.log(window.location.hash)
        var hash = window.location.hash
        for (var i = 0; i < length; i++) {
            $(hashArr[i]).hide()
        }
        $(hash).show()
    })
})

/**
 * vedio块的逻辑
 */
$(function () {
    fnInitSelect()
    function fnInitSelect() {
        $.ajax({
            url: baseUrl + 'device/list/camera',
            type: 'get',
            cache: false,
            success: function (data) {
                // console.log(data.data[0])
                var result = data.data
                var contentBox = $('#video .right ul')
                var strIP = '';

                for (var i = 0; i < result.length; i++) {
                    strIP += '<li title="' + result[i].ip + '">' + result[i].name + '</li>'
                }
                contentBox.html(strIP)
            }
        })
    }

    var Handler = {};
    Handler = {
        // 播放某个ID的摄像头
        fnPlayDev: function (ocxId, devIp) {
            if (devIp == 0) {
                SERVICE
                    .ocx
                    .fnStopFixedOcx(ocxId);
                return;
            }
            SERVICE
                .ocx
                .fnPlayFixedOcx(ocxId, devIp);
        }
    }
    var $videoFrame = $('.content .video-frame')
    $videoFrame.on('click', function (e) {
        console.log(e.target)
        // 点击的时候给点击的盒子添加标记
        $videoFrame.removeClass('select')
        $(this).addClass('select')

        //点击的时候获取该区域的object的id
        var ocxId = $(this)
            .find('object')
            .attr('id')
        // 开始/结束录像，开始/结束声音功能实现
        if (e.target.innerText == '开始录像') {
            // SERVICE.ocx.fnStartRecord(ocxId)
            startRecord(ocxId)

            e.target.innerText = '结束录像'
        } else if (e.target.innerText == '结束录像') {
            SERVICE
                .ocx
                .fnEndRecord(ocxId)

            e.target.innerText = '开始录像'
        } else if (e.target.innerText == '开始声音') {
            SERVICE
                .ocx
                .fnOpenChannelSound(ocxId)

            e.target.innerText = '结束声音'
        } else if (e.target.innerText == '结束声音') {
            SERVICE
                .ocx
                .fnCloseChannelSound(ocxId)

            e.target.innerText = '开始声音'
        } else if (e.target.innerText == '抓图') {
            SERVICE
                .ocx
                .fnStartCapturePicture(ocxId)
        } else if (e.target.innerText == '开启全屏') {
            SERVICE
                .ocx
                .fnFullscreen(ocxId)
        }
    })
    // 点击左侧IP列表，获取要播放的设备IP
    $('#video .right ul').on('click', 'li', function () {
        // console.log($videoFrame)
        var devIp = $(this).attr('title')
        // console.log(devIp)
        var ocxId = ''
        $videoFrame.each(function (index, val) {
            if ($(val).hasClass('select')) {
                ocxId = $(val).attr('data-ocxid')
                $(val)
                    .find('.video-header button')
                    .removeClass('hide')
            }
        })
        Handler.fnPlayDev(ocxId, devIp)
    })
    // 监控键盘事件
    $(document).on('keyup', function () {
        console.log('按下了键盘')
        $videoFrame.each(function (index, val) {
            if ($(val).hasClass('select')) {
                ocxId = $(val).attr('data-ocxid')
            }
        })
        SERVICE
            .ocx
            .fnCloseFullscreen(ocxId);
    })

    // 开始录像 获取路径, http://172.20.104.80:8088/cameraMgr/api/device/query/path
    function startRecord(ocxId) {
        $.ajax({
            url: baseUrl + 'device/query/path',
            type: 'get',
            success: function (data) {
                console.log(data)
                if (data.status == '200') {
                    SERVICE
                        .ocx
                        .fnStartRecord(ocxId, data.data.path)
                }
            }
        })
    }
})

/**
 * tuopu逻辑
 */
$(function () {
    fnInitDeviceList()
    function fnInitDeviceList() {
        var CaArr = '';
        var MaArr = '';
        var $CaArrBox = $('.tuopu .CA-list ul')
        var $MaArrBox = $('.tuopu .MA-list ul')

        $.ajax({
            url: baseUrl + 'device/list',
            type: 'get',
            cache: false,
            success: function (data) {
                var result = data.data
                // console.log(result)
                for (var i = 0; i < result.length; i++) {
                    if (result[i].type == 'camera') {
                        CaArr += '<li><span>ID:' + result[i].id + '</span><span>IP:' + result[i].ip + '</span></li>'
                    } else {
                        MaArr += '<li><span>ID:' + result[i].id + '</span><span>IP:' + result[i].ip + '</span></li>'
                    }
                }
                $CaArrBox.html(CaArr)
                $MaArrBox.html(MaArr)
            }
        })
    };
})
/**
 * device
 */
$(function () {
    getCamerasIp()
    // 初始化模态框
    var $changebtn = $('.device .usermanager .change .userchange')
    var $delbtn = $('.device .usermanager .change .userdel')
    var $content = $('.device .usermanager .modal .modal-content')
    var $modal = $('.device .usermanager .changemodal')
    // 添加用户按钮
    var $adduser = $('.device .adduser .btn')
    var $addusermodal = $('.device .usermanager .addmodal')
    $adduser.on('click', function () {
        $addusermodal.modal('show')
    })
    function initModel() {
        // console.log($changebtn)
        $changebtn
            .on('click', function () {
                console.log('点击了')
                $tr = $(this).parents('tr')
                var name = $tr
                    .find('.name')
                    .html()
                var ip = $tr
                    .find('.ip')
                    .html()
                var id = $tr
                    .find('.id')
                    .html()
                // console.log(name, ip, id)

                var HTML = '<div class="modal-header"><button type="button" class="close" data-dismiss="moda' +
                        'l" aria-label="Close"><span aria-hidden="true">&times;</span></button><h4 class=' +
                        '"modal-title" id="exampleModalLabel">修改用户名</h4></div><div class="modal-body"><fo' +
                        'rm><div class="form-group"><label for="recipient-name" class="control-label" dis' +
                        'abled>原用户名：</label><input type="text" class="form-control" disabled="disabled" i' +
                        'd="recipient-name" value=' + name + '></div><input type="hidden" class="id" value=' + id + '><div class="form-group"><label for="message-text" class="control-label">新用户名：</' +
                        'label><input type="text" class="form-control newName" id="newName"></div></form>' +
                        '</div><div class="modal-footer"><button type="button" class="btn btn-default" da' +
                        'ta-dismiss="modal">关闭</button><button type="button" onclick="changesubmit()" cla' +
                        'ss="btn btn-primary">提交</button></div>';
                $content.html(HTML)
                $modal.modal('show')
            })
    }
    // 删除摄像头
    function deluser() {}
    // 添加摄像头
    function addCamera() {
        var $name = $('.device .addmodal .username')
        var $ip = $('.device .addmodal .usernameIp')
        var $id = $('.device .addmodal .usernameId')
        if ($name.val() == '' || $ip.val() == '' || $id.val() == '') {
            alert('内容不能为空!')
            return false
        }
        $.ajax({
            url: baseUrl + 'device/add/camera',
            type: 'post',
            data: {
                'name': $name.val(),
                'ip': $ip.val(),
                'id': $id.val()
            },
            success: function (data) {
                // console.log(data)
                if (data.status == '200') {
                    $name.val('')
                    $ip.val('')
                    $id.val('')
                }
                getCamerasIp()
            },
            error: function (data) {
                console.log(data)
            }
        })
    }
    // 获取摄像头IP列表,用于修改
    function getCamerasIp() {
        // console.log(221312)
        $.ajax({
            url: baseUrl + 'device/list/camera',
            type: 'get',
            cache: false,
            success: function (data) {
                var result = data.data
                var contentBox = $('.device .usermanager .change tbody')
                var strIP = '';
                for (var i = 0; i < result.length; i++) {
                    strIP += '<tr><td class="name">' + result[i].name + '</td><td class="ip">' + result[i].ip + '</td><td class="id hidden">' + result[i].id + '</td><td><button type="button" class="btn btn-warning btn-xs userchange">修改用户名</' +
                            'button></td></tr>'
                }
                contentBox.html(strIP)
                initModel()
            },
            complete: function (data) {
                // 在异步获取数据后,初始化模态框 console.log(1111, data)
            },
            error: function (data) {
                initModel()
                // console.log('error', data)
            }
        })
    }
    //修改摄像头名 获取用户的id和新的用户名,并提交到后台
    function changesubmit() {
        var id = $('.device .usermanager .modal .id').val()
        var newName = $('.device .usermanager .modal .newName').val()
        var $modal = $('.device .usermanager .modal')
        // console.log(newName)
        if (newName == '') {
            return false
        }
        $.ajax({
            url: baseUrl + 'device/update/camera',
            type: 'post',
            data: {
                'id': id,
                'name': newName
            },
            success: function (data) {
                console.log(data)
                if (data.status == '200') {
                    $modal.modal('hide')
                }
                getCamerasIp()
            },
            complete: function () {

                // getCamerasIp()
            },
            error: function (data) {
                console.log('失败了', data)
            }

        })
    }
})

/**
 * 文件存储位置
 */
$(function () {
    var $filebtn = $('.file .save .btn')
    $filebtn.on('click',function(){
        savePathSubmit()
    })
    function savePathSubmit() {
        // console.log('savePathSubmit')
        var newPath = $('.file .save .savePath')
        // console.log(newPath)
        $.ajax({
            url: baseUrl + 'device/update/path',
            type: 'post',
            data: {
                'path': newPath.val()
            },
            success: function (data) {
                if (data.status == '200') {
                    newPath.val('')
                }
            }
        })
    }
})