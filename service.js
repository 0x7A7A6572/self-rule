importClass(android.content.ContextWrapper);
importClass(android.app.PendingIntent);
//importClass(android.content.BroadcastReceiver);
importClass(android.content.IntentFilter);
importClass(android.widget.Button);
let BroadcastUtil = require('./util/BroadcastUtil.js');
//let loadLayouts = require('./components/dialogplus_alert.js')
//DialogPlus = require("./components/DialogPlus.js");
let denyAlert = require("./components/denyAlert.js");
//注册接收广播start
let ExtraKey = "SELF_RULER_SERVICE_STATU";
let serviceStatu;
let isAlertWindowShow = false;
let BroadcastData, clear;
let NotifyID = 0X7A7A6572;
let ACTION_STOP = "STOP_RULER_SERVICE";
let ACTION_MENU = "OPEN_RULER_MENU";
let filter = new IntentFilter();
let alertTipsText;
BroadcastUtil.register(function(context, intent) {
    let getletServiceStatu = intent.getStringExtra(ExtraKey);
    if (getletServiceStatu == "STOP_SERVICE") {
        removeNotify();
    }
});


filter.addAction("BroadcastReceiver");
new ContextWrapper(context)
    .registerReceiver(clear = new BroadcastReceiver({
    onReceive: function(context, intent) {
        // toastLog(intent)
        let BroadcastData = intent.getStringExtra("action");
        // let BroadcastDataStopService = intent.getStringExtra("action_stop");
        //console.log(BroadcastDataMenuService,BroadcastDataStopService);
        doBroadcastSignal(BroadcastData); //obj -> string
        // doBroadcastSignal(BroadcastDataStopService);
    }
}), filter);

//退出脚本时清理广播  
events.on("exit", function() {
    if (clear != null) {
        new ContextWrapper(context)
            .unregisterReceiver(clear);
        BroadcastUtil.send(ExtraKey, "STOP_SERVICE");
        toastLog("service stop...");
        removeNotify();
        console.log("清理完毕");
    }
    clear = null;
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
        var manager = context.getSystemService(android.app.Service.NOTIFICATION_SERVICE);
        //应该选择自己的通知进行remove
        manager.cancel(NotifyID);
        //manager.cancelAll();
        exit();
        //engines.stopAll();
        //sendNotify("律者","服务已被关闭")
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
    sendNotify("律者", "服务已启动", );

toastLog("注册广播成功")
BroadcastUtil.send(ExtraKey, "SERVICE_RUNNING");
/*let Evils = {
{
 evilActivity:["com.tencent.mm.plugin.finder.ui.FinderHomeAffinityUI"]
 },
{packageName:"com.taobao.taobao",evilActivity:["com.taobao.android.interactive.timeline.TransparentVideoListActivity"]},
{packageName:"com.taobao.idlefish",evilActivity:["com.taobao.idlefish.fun.detail.post.FunPostDetailActivity"]},
};*/

/*let myDialog = DialogPlus.setView(loadLayouts.alertLayout)
    .setTitle(null)
    .setEmptyMode(true)
    .build()
//去除dialog白色背景         
myDialog.getDialog()
    .getWindow()
    .getDecorView()
    .setBackground(null);
loadLayouts.alertLayout.floatImgBack.on("click", function() {

    myDialog.dismiss();
    back();
    //延迟解锁服务 back返回需要时间     
    setTimeout(function() {
        isAlertWindowShow = false;
    }, 800);


});*/
denyAlert.init();

var ruler_thread = threads.start(function() {
    //在子线程执行的定时器 
    setInterval(function() {
        let current_activity = currentActivity();
        if (isEvilActivitys(current_activity) && isAlertWindowShow == false) {
            //back();
            alertTipsText = rulerStorage.get("alertTipsText");
            // alert(alertTipsText);
            ui.run(() => {
                denyAlert.setText(alertTipsText);
                denyAlert.show();
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
var rulerStorage = storages.create("ruler:activityLists");
var EvilActivity, whitelistActivity;
EvilActivity = rulerStorage.get("evilActivity");
whitelistActivity = rulerStorage.get("whitelistActivity");
if (EvilActivity == null) {
    EvilActivity = [{
        activity: "com.tencent.mm.plugin.finder.ui.FinderHomeAffinityUI",
        pckage: "com.tencent.mm",
        name: "微信"
    }]
    rulerStorage.put("evilActivity", EvilActivity);
    EvilActivity = rulerStorage.get("evilActivity");
}

function isEvilActivitys(activity) {
    let is_evil = false;
    //重新获取EvilActivity
    EvilActivity = rulerStorage.get("evilActivity");
    try {
        EvilActivity.forEach(function(value, key) {
            //console. log(activityName,value, key, list);
            if (value.activity == activity) {
                console.log(" is Evil:", activity);
                is_evil = true;
                return;
            }
        });
    } catch (e) {
        console.log('EvilActivity.length:', EvilActivity.length, '\n', EvilActivity);
        console.log(e)
    }
    return is_evil;
}

function isWhiteListActivitys(activity) {
    let is_white_list = false;
    //重新获取whitelistActivity
    whitelistActivity = rulerStorage.get("whitelistActivity");
    try {
        whitelistActivity.forEach(function(value, key) {
            //console. log(activityName,value, key, list);
            if (value.activity == activity) {
                console.log(" is white Activity");
                is_white_list = true;
                return;
            }
        });
    } catch (e) {
        console.log('whitelistActivity.length:', whitelistActivity.length, '\n', whitelistActivity);
        console.log(e)
    }
    return is_white_list;
}



//保活
setInterval(function() {
    BroadcastUtil.send(ExtraKey, "SERVICE_RUNNING");
}, 5000);