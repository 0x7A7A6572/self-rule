$debug.setMemoryLeakDetectionEnabled(true);
importClass(android.content.ContextWrapper);
importClass(android.app.PendingIntent);
//importClass(android.content.BroadcastReceiver);
importClass(android.content.IntentFilter);
importClass(android.widget.Button);
let BroadcastUtil = require('./util/BroadcastUtil.js');
//let loadLayouts = require('./components/dialogplus_alert.js')
//DialogPlus = require("./components/DialogPlus.js");
let denyAlert = require("./components/denyAlert.js");
let config = require("./config.js");
//注册接收广播start
let ExtraKey = "SELF_RULER_SERVICE_STATU";
let serviceStatu;
let isAlertWindowShow = false;
let broadcastResigner = null;
let NotifyID = 0X7A7A6572;
let ACTION_STOP = "STOP_RULER_SERVICE";
let ACTION_MENU = "OPEN_RULER_MENU";
let filter = new IntentFilter();
let alertTipsText;
let isPunishTime = false;
let _rvilActivity, _whitelistActivity;
let liveInterval;
config.init();
broadcastResigner = BroadcastUtil.register(function(context, intent) {
    let getletServiceStatu = intent.getStringExtra(ExtraKey);
    if (getletServiceStatu == "STOP_SERVICE") {
        toastLog("律已服务停止..")
        removeNotify();
        exit();
    }
    let notifyFunc = intent.getStringExtra("action");
    if (notifyFunc != null)
        doBroadcastSignal(notifyFunc);
});


/*filter.addAction("BroadcastReceiver");
new ContextWrapper(context)
    .registerReceiver(clear = new BroadcastReceiver({
        onReceive: function (context, intent) {
            // toastLog(intent)
            let BroadcastData = intent.getStringExtra("action");
            // let BroadcastDataStopService = intent.getStringExtra("action_stop");
            //console.log(BroadcastDataMenuService,BroadcastDataStopService);
            doBroadcastSignal(BroadcastData); //obj -> string
            // doBroadcastSignal(BroadcastDataStopService);
        }
    }), filter);*/

//退出脚本时清理线程 ，广播和通知已在@removeNotify清理
events.on("exit", function() {
    if (ruler_thread != null) {
        ruler_thread.interrupt();
    }
    /* 蜜汁保险 */
    threads.shutDownAll();
     removeNotify();
     if(liveInterval != null){
        clearInterval(liveInterval);
        liveInterval = null;
     }
});

//end

//接受到广播之后的行为
function doBroadcastSignal(signal) {
    signal = signal + ""; //string -> number
    switch (signal) {
        case ACTION_MENU:
            toUishowMenu();
            break;
        case ACTION_STOP:
            // console.log("////")
            removeNotify();
            exit();
            break;
    }
}

var stopIntent = new Intent();
stopIntent.setAction("BroadcastReceiver");
stopIntent.putExtra("action", ACTION_STOP);

var snoozeIntent = new Intent();
snoozeIntent.setAction("BroadcastReceiver"); //通知权限设置
snoozeIntent.putExtra("action", ACTION_MENU);

var stopServiceIntent = PendingIntent.getBroadcast(context, 0, stopIntent, PendingIntent.FLAG_UPDATE_CURRENT)
var snoozePendingIntent = PendingIntent.getBroadcast(context, 1, snoozeIntent, PendingIntent.FLAG_UPDATE_CURRENT)

// 创建通知
function sendNotify(notifyTitle, contentText, subText) {
    let notifyTicker = "";
    var manager = context.getSystemService(android.app.Service.NOTIFICATION_SERVICE);
    var notification;
    if (device.sdkInt >= 26) {
        var channel = new android.app.NotificationChannel("channel_ruler", "律者状态显示与控制", android.app.NotificationManager.IMPORTANCE_DEFAULT);
        channel.enableLights(true);
        channel.setLightColor(0xff0000);
        channel.setShowBadge(false);
        manager.createNotificationChannel(channel);
        notification = new android.app.Notification.Builder(context, "channel_ruler")
            // .setTicker(contentText)
            .setContentTitle(notifyTitle)
            .setContentText(contentText)
            // .setSubText(subText)
            .setWhen(new Date()
                .getTime())
            .setSmallIcon(-1) //org.autojs.autojs.R.drawable.autojs_material)
            .setOngoing(true)
            .setAutoCancel(false)
            .setContentIntent(snoozePendingIntent) //点击跳转activity
            .addAction(-1, "设置", snoozePendingIntent) //图标，文字，点击事件 //
            .addAction(-1, "停止服务", stopServiceIntent) //图标，文字，点击事件 // 

            .build();
    } else {
        notification = new android.app.Notification.Builder(context)
            .setContentTitle(notifyTitle)
            .setContentText(notifyText)
            .setWhen(new Date()
                .getTime())
            .setSmallIcon(-1)
            .setTicker(notifyTicker)
            .setOngoing(false)
            .build();
    }

    manager.notify(NotifyID, notification);

}

function removeNotify() {
    denyAlert.emergencyPauseControl(true);
    var manager = context.getSystemService(android.app.Service.NOTIFICATION_SERVICE);
    manager.cancel(NotifyID);

    BroadcastUtil.send(ExtraKey, "STOP_SERVICE");
    BroadcastUtil.destroy(broadcastResigner);
    
}

function toUishowMenu() {
    launch("cn.zzerx.selfruler");
    /* //运行脚本
 let e = engines.execScriptFile("./main.js");
 setTimeout(function() {
     e.getEngine().emit("msg", "launch_window");
 }, 2000);
 //向该脚本发送事件*/
}

/*function stopService(){
if(window != null){
window.close();
exit();
}
}*/
sendNotify("律已", "服务已启动", );

console.info("注册广播成功")
BroadcastUtil.send(ExtraKey, "SERVICE_RUNNING");
//初始化弹窗
denyAlert.init(() => {
    if (config.rulerAction == 0) { //等待返回
        back();
    }
    if (config.alertValueResetRule == 0 && isPunishTime) {
        //config.notifyConfigChange("superpositionedCount",0); 
        config.notifyConfigChange("alertValue", 0);
        BroadcastUtil.send("DataChangeToUi", "alertValue");

    }
    //延迟解锁服务 back返回需要时间     
    setTimeout(function() {
        isAlertWindowShow = false;
    }, 800);

});

//监听Activity
let ruler_thread = threads.start(function() {
    //在子线程执行的定时器 
    setInterval(function() {
        let current_activity = currentActivity();

        if (isEvilActivitys(current_activity) && isAlertWindowShow == false) {
            switch (config.rulerAction) {
                case 0:

                    break;
                case 1:
                    back();
                    break;

                case 2:
                    launchApp(config.jumpActivity);
                    break;
            }
            //back();
            alertTipsText = config.alertTipsText;
            // alert(alertTipsText);
            ui.run(() => {
                config.notifyConfigChange("alertValue", config.alertValue + 1);
                BroadcastUtil.send("DataChangeToUi", "alertValue");
                if (config.punishOptions && config.alertValue >= config.punishBindAlertValue) {
                    toastLog("已达到警告值，将限制使用");
                    if (config.punishTimeSuperposition) { //叠加时间
                        config.superpositionedCount = config.superpositionedCount + 1;
                        config.notifyConfigChange("superpositionedCount", config.superpositionedCount);
                        BroadcastUtil.send("DataChangeToUi", "superposition");

                    }
                    let _superpositionValue = config.superpositionedCount == 0 ? 1 : config.superpositionedCount;
                    isPunishTime = true;
                    //denyAlert.setText("触发了惩罚")
                    denyAlert.show();
                    denyAlert.setLockEnable(true, config.punishTime * _superpositionValue);
                } else {
                    denyAlert.setText(alertTipsText).show();
                }
                isAlertWindowShow = true;
            });

        }
    }, 800);
});
/*
弃用格式
let EvilActivity = ["com.tencent.mm.plugin.finder.ui.FinderHomeAffinityUI",
                  "com.taobao.android.interactive.timeline.TransparentVideoListActivity",
                  "com.taobao.idlefish.fun.detail.post.FunPostDetailActivity",
                  "io.flutter.plugin.platform.SingleViewPresentation",
                  "com.taobao.idlefish.fun.detail.video.VideoUgcFeedsActivity",
                  "com.taobao.android.layoutmanager.container.CommonContainerTransActivity",
                  "com.taobao.tao.TBMainActivity,com.ss.android.ugc.aweme.main.MainActivity"];
*/

//本地配置
//var rulerStorage = storages.create("ruler:activityLists");

_evilActivity = config.evilActivity;
_whitelistActivity = config.whitelistActivity;
if (_evilActivity == null) {
    _evilActivity = [{
        activity: "com.tencent.mm.plugin.finder.ui.FinderHomeAffinityUI",
        pckage: "com.tencent.mm",
        name: "微信",
        summary: "微信视频号"
    }]

}

function isEvilActivitys(activity) {
    let is_evil = false;
    //重新获取EvilActivity
    _evilActivity = config.evilActivity;
    try {
        _evilActivity.forEach(function(value, key) {
            //console. log(activityName,value, key, list);
            if (value.activity == activity) {
                console.log(" is Evil:", activity);
                is_evil = true;
                return;
            }
        });
    } catch (e) {
        console.log('EvilActivity.length:', _evilActivity.length, '\n', _evilActivity);
        console.log(e)
    }
    return is_evil;
}

function isWhiteListActivitys(activity) {
    let is_white_list = false;
    //重新获取whitelistActivity
    _whitelistActivity = config._whitelistActivity;
    try {
        _whitelistActivity.forEach(function(value, key) {
            //console. log(activityName,value, key, list);
            if (value.activity == activity) {
                console.log(" is white Activity");
                is_white_list = true;
                return;
            }
        });
    } catch (e) {
        console.log('whitelistActivity.length:', _whitelistActivity.length, '\n', _whitelistActivity);
        console.log(e)
    }
    return is_white_list;
}



//保活
liveInterval = setInterval(function() {
    /*  为了以下情况
     *  service启动后关闭ui界面，再次打开，开启服务按钮显示未开启，实际服务为开启状态
     */
    
    BroadcastUtil.send(ExtraKey, "SERVICE_RUNNING");
}, 3000);