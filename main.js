"ui";

//unfreeze();
//关闭音量上退出脚本
$settings.setEnabled("stop_all_on_volume_up", false);
$ui.useAndroidResources();
importClass(android.text.TextWatcher);
importClass(android.view.View);
importClass(android.view.WindowManager)
importClass(android.graphics.Color);
importClass(android.graphics.drawable.GradientDrawable);
importClass(android.text.Spannable);
importClass(android.text.SpannableStringBuilder);
importClass(android.text.style.ForegroundColorSpan);
importClass(android.view.Gravity);
let BroadcastUtil = require('util/BroadcastUtil.js');
//let DialogPlus = require("./components/DialogPlus.js");
//let icon_base64 = require("images/icon_bese64.js");
//let loadLayouts = require('./components/dialogplus_alert.js');
let denyAlert = require("./components/denyAlert.js");
let explanAlert = require("./components/explanAlert.js");
let infoAlert = require("./components/infoAlert.js");
let SERVICE_EXTRA_KEY = "SELF_RULER_SERVICE_STATU";
let SERVICE_SCRIPT_PATH = "./service.js";
let serviceStatu;
let imgRunServiceStatu = false;
let floatWindowStatu = false;
let window_thread, menuWindow;
let rulerStorage = storages.create("ruler:activityLists");
let evilActivity, whitelistActivity, alertTipsText;
let defaultAlertTipsText = "想要有空余时间，就不要浪费时间。"

let expand_img_switch = {
    backlist: 0,
    whitelist: 0,
    preview: 0
}

$ui.layoutFile("./autolayout/main.xml");

initActivityDate();
initEvent();
initUi();

/*
 数据初始化
*/
function initActivityDate() {
    evilActivity = rulerStorage.get("evilActivity");
    whitelistActivity = rulerStorage.get("whitelistActivity");
    alertTipsText = rulerStorage.get("alertTipsText");
    if (evilActivity == null) {
        let EvilActivity = [{
            activity: "com.tencent.mm.plugin.finder.ui.FinderHomeAffinityUI",
            pckage: "com.tencent.mm",
            appname: "微信"
        }]
        rulerStorage.put("evilActivity", EvilActivity);
        evilActivity = rulerStorage.get("evilActivity");
    }
    if (whitelistActivity == null) {
        whitelistActivity = [];
        rulerStorage.put("whitelistActivity", whitelistActivity);
    }
    if (alertTipsText == null) {
        alertTipsText = defaultAlertTipsText;
        rulerStorage.put("alertTipsText", alertTipsText);
    }

}


/*
 事件初始化
*/
function initEvent() {
    //添加开机监听运行服务

    let tasks = $timers.queryIntentTasks(SERVICE_SCRIPT_PATH);
    let taskIsExist = false;
    tasks.forEach(t => {
        if (t.scriptPath == files.path(SERVICE_SCRIPT_PATH)) {
            taskIsExist = true;
        }
    });
    if (!taskIsExist) {
        $timers.addIntentTask({
            path: SERVICE_SCRIPT_PATH,
            action: Intent.ACTION_BOOT_COMPLETED
        })
        console.verbose("创建开机启动任务")
    } else {
        console.verbose("开机启动任务已存在")
    }
    //注册广播监听服务状态
    BroadcastUtil.register(function(context, intent) {
        serviceStatu = intent.getStringExtra(SERVICE_EXTRA_KEY);
        switch (serviceStatu) {
            case "STOP_SERVICE":
                updateImageButton(ui.imgRunService, "#000000", false);
                break;
            case "SERVICE_RUNNING":
                if (imgRunServiceStatu == false) {
                    updateImageButton(ui.imgRunService, "#ff8800", true);
                }
                break;
        }
    });

    //其他脚本传入信息时
    events.on("msg", function(words) {
        if (words == "launch_window") {
            shouFloatWindow();
        }
    });
    //脚本退出监听
    events.on("exit", function() {
        if (window_thread != null) {
            window_thread = null;
            float.closeAll();
            console.log("关闭window_thread");
        }
    });
    //包活&动态更新一些东西
    setInterval(function() {
        //检查悬浮状态并更新ui
        if (menuWindow != null) {
            try { //判断悬浮窗是否被其他方式关闭 而主界面按钮未更新
                menuWindow.getWidth();
            } catch (e) {
                updateImageButton(ui.showfloatwindow, "#000000");
            }
        }
        //检查权限状态并更新ui

        updatePermissionStatusView(ui.ps_floatwindow, $floaty.checkPermission());
        updatePermissionStatusView(ui.ps_battery_opt, $power_manager.isIgnoringBatteryOptimizations());

        if (auto.service == null) {
            updatePermissionStatusView(ui.ps_accessibility, false);
        } else {
            updatePermissionStatusView(ui.ps_accessibility, true);
        }


    }, 2000);
}
/*
 UI初始化
*/
function initUi() {
    // ---修改状态栏字体和背景颜色 
    ui.statusBarColor("#FFFFFF");
    let syswindow = activity.getWindow();
    syswindow.addFlags(WindowManager.LayoutParams.FLAG_DRAWS_SYSTEM_BAR_BACKGROUNDS);
    syswindow.clearFlags(WindowManager.LayoutParams.FLAG_TRANSLUCENT_STATUS);
    syswindow.getDecorView().setSystemUiVisibility(View.SYSTEM_UI_FLAG_LIGHT_STATUS_BAR);

    //键盘布局锁定
    activity.window.setSoftInputMode(WindowManager.LayoutParams.SOFT_INPUT_ADJUST_PAN);



    //提示文本显示
    if (alertTipsText == null) {
        alertTipsText = "想要有空余时间，就不要浪费时间。";
    }
    ui.tips_input.setText(alertTipsText);

    //其他ui初始化
    setBackgroundRoundGradientCornerRadii(ui.blacklist_empty, "#63ff0000", "#23ff0000");
    setBackgroundRoundGradientCornerRadii(ui.blacklist, "#63ff0000", "#23ff0000");
    setBackgroundRoundGradientCornerRadii(ui.whitelist_empty, "#6300ff00", "#2300ff00");
    setBackgroundRoundGradientCornerRadii(ui.whitelist, "#6300ff00", "#2300ff00");
    setBackgroundRoundGradientCornerRadii(ui.tips_input, "#8888ff", "#bbbbff");
    setBackgroundRoundGradientCornerRadii(ui.permission_status, "#ff8800", "#2b3b2b");
    setBackgroundRoundGradientCornerRadii(ui.setting_content, "#FF8800","#232B2B");
    setBackgroundRoundGradientCornerRadii(ui.setting_punish, "#FF8800","#232B2B");

    //Activity黑白名单显示
    updateActivityListView();
        //黑白名单数据绑定
    ui.blacklist.setDataSource(evilActivity);
    ui.whitelist.setDataSource(whitelistActivity);
}
/* 阻止点击穿透 防止误点 */
ui.setting_layout.setOnClickListener(null);

ui.setting.on("click", function(v) {
    if (ui.drawer.isDrawerOpen(Gravity.RIGHT)) {
        ui.drawer.closeDrawer(Gravity.RIGHT);
    } else {
        ui.drawer.openDrawer(Gravity.RIGHT);
    }
})
ui.ps_accessibility.on("click", function() {
    if (auto.service == null) {
        app.startActivity({
            action: "android.settings.ACCESSIBILITY_SETTINGS"
        });
        toast("在「已下载应用」中找到「律已」并授权");
    } else {
        toast("已授权无障碍权限");
    }

})

ui.ps_floatwindow.on("click", function() {
    if (!$floaty.checkPermission()) {
        // 没有悬浮窗权限，提示用户并跳转请求
        // toast("本脚本需要悬浮窗权限来显示悬浮窗，请在随后的界面中允许并重新运行本脚本。");
        $floaty.requestPermission();
        exit();
    } else {
        toast('已有悬浮窗权限');
    }
    //app.openAppSetting("cn.zzerx.selfruler")
    /*app.startActivity({action: "android.settings.action.MANAGE_OVERLAY_PERMISSION"});*/
    //toast("在「权限管理」中找到「显示悬浮窗」并授权");
})

ui.ps_startauto.on("click", function() {
    app.openAppSetting("cn.zzerx.selfruler");
    toast("在「自启动」中授权");
})

ui.ps_battery_opt.on("click", function() {

    if (!$power_manager.isIgnoringBatteryOptimizations()) {
        toast("未开启忽略电池优化");
        $power_manager.requestIgnoreBatteryOptimizations();
        /*app.startActivity({action: "android.settings.IGNORE_BATTERY_OPTIMIZATION_SETTINGS"});*/
        //app.openAppSetting("cn.zzerx.selfruler");
        //toast("在「省电策略」中授权「无限制」");
    } else {
        toast("已开启忽略电池优化");
    }
})




ui.showfloatwindow.on("click", function() {
    shouFloatWindow()
});

ui.imgRunService.on("click", function() {
    if (serviceStatu != 'SERVICE_RUNNING') {
        runService();
        device.vibrate(200);
        updateImageButton(ui.imgRunService, "#FF8800", true);
    } else {
        // toastLog("发送停止服务")
        BroadcastUtil.send(SERVICE_EXTRA_KEY, "STOP_SERVICE");
        updateImageButton(ui.imgRunService, "#000000", false);
    }
})

ui.tips_input.addTextChangedListener(new TextWatcher() {
    afterTextChanged: function(s, start, count, after) {
        alertTipsText = s;
        updatesRulerStorage("alertTipsText", alertTipsText)
    }
})


let mv = null;
ui.imgSyncCloud.on("click", function() {
    evilActivity.forEach(function(v, k) {
        mv = mv + v.activity + " " + v.package + v.appname + "\n";
        setClip(mv);
    })

});

ui.imgInfo.on("click", function(e) {
    infoAlert.init()
    infoAlert.show()
    setBackgroundRoundGradientCornerRadii(infoAlert.getDecorView(), "#FF8800","#232B2B");
});



/*ui.blacklist.on("item_click", function(item, i, itemView, listView){
    toast("被点击的人名字为: " + item.name + "，年龄为: " + item.age);
});
*/

ui.blacklist.on("item_bind", function(itemView, itemHolder) {
    itemView.deleteItem.on("click", function() {
        let item = itemHolder.item;
        evilActivity.splice(itemHolder.position, 1);
        updatesRulerStorage("evilActivity", evilActivity);
        if (evilActivity.length == 0) {
            updateActivityListView();
        }
    });
})

ui.whitelist.on("item_bind", function(itemView, itemHolder) {
    itemView.deleteItem.on("click", function() {
        let item = itemHolder.item;
        whitelistActivity.splice(itemHolder.position, 1);
        updatesRulerStorage("whitelistActivity", whitelistActivity);
        if (whitelistActivity.length == 0) {
            updateActivityListView();
        }
    });
})

$ui.expand_img_switch_backlist.on("click", (v) => {
    let vbl = $ui.blacklist;
    if (expand_img_switch.backlist == 1) {
        let vbl_pl = vbl.getLayoutParams();
        vbl_pl.height = 400;
        vbl.setLayoutParams(vbl_pl);
        v.setSource("@drawable/ic_unfold_more_black_48dp");
        expand_img_switch.backlist = 0;
    } else {
        let vbl_pl = vbl.getLayoutParams();
        vbl_pl.height = -1;
        vbl.setLayoutParams(vbl_pl);
        v.setSource("@drawable/ic_unfold_less_black_48dp");
        expand_img_switch.backlist = 1;
    }

})

$ui.expand_img_switch_whitelist.on("click", (v) => {
    let vbl = $ui.whitelist;
    if (expand_img_switch.whitelist == 1) {
        let vbl_pl = vbl.getLayoutParams();
        vbl_pl.height = 400;
        vbl.setLayoutParams(vbl_pl);
        v.setSource("@drawable/ic_unfold_more_black_48dp");
        expand_img_switch.whitelist = 0;
    } else {
        let vbl_pl = vbl.getLayoutParams();
        vbl_pl.height = -1;
        vbl.setLayoutParams(vbl_pl);
        v.setSource("@drawable/ic_unfold_less_black_48dp");
        expand_img_switch.whitelist = 1;
    }

});

$ui.preview_alert.on("click", () => {
    denyAlert.init()
    denyAlert.setText($ui.tips_input.getText())
    denyAlert.show()
});


function shouFloatWindow() {
    /*检查悬浮窗权限*/
    if (!floaty.checkPermission()) {
        // 没有悬浮窗权限，提示用户并跳转请求
        toast("需要悬浮窗权限来显示悬浮窗，请在找到[律已]并允许权限");
        floaty.requestPermission();
        return;
    } else {
        if (menuWindow == null) {
            window_thread = threads.start(function() {
                menuWindow = floaty.window($files.read("./autolayout/float_addlist.xml"));
                //menuWindow.exitOnClose();
                menuWindow.saveActivityButton.click(function() {
                    let cactInfo = getCurrentActivityInfo();
                    //检查是否重复
                    if (!isRepeatActivity(cactInfo.activity, evilActivity)) {
                        evilActivity.push(cactInfo);
                        toast(" 已将当前Activity加入黑名单");
                        updatesRulerStorage("evilActivity", evilActivity)
                    } else {
                        toast("当前Activity已在黑名单列表，无需重复添加");
                    }
                });
                menuWindow.rmActivityButton.click(function() {
                    let cactInfo = getCurrentActivityInfo();
                    //检查是否重复
                    if (!isRepeatActivity(cactInfo.activity, evilActivity)) {
                        if (!isRepeatActivity(cactInfo.activity, whitelistActivity)) {
                            whitelistActivity.push(cactInfo);
                            toast(" 已将当前Activity加入白名单");
                        } else {
                            toast("当前Activity已在白名单列表，无需重复添加")
                        }
                        updatesRulerStorage("whitelistActivity", whitelistActivity)
                    } else {
                        toast("当前Activity已在黑名单列表，无法直接添加到白名单");
                    }
                });
                menuWindow.floatlayout.click(function() {
                    menuWindow.setAdjustEnabled(!menuWindow.isAdjustEnabled());

                });

                menuWindow.setPosition(50, 120);
                setBackgroundRoundGradientCornerRadii(menuWindow.appname, "#8888ff", "#8888ff", 5);
                setBackgroundRoundGradientCornerRadii(menuWindow.floatlayout, "#63ff0000", "#a3000000");
                setInterval(function() {
                    let current_activity = currentActivity();
                    ui.run(function() {
                        menuWindow.activityText.setText(current_activity);
                        menuWindow.appname.setText(getAppName(currentPackage()));
                    });
                }, 800);


            });
            updateImageButton(ui.showfloatwindow, "#6969ff");
            floatWindowStatu = true;
        } else {
            menuWindow.close();
            menuWindow = null;
            updateImageButton(ui.showfloatwindow, "#000000");
            floatWindowStatu = false;
        }
    }
}

$ui.alert_explan.on("click", function(e) {
    /*检查悬浮窗权限*/
    if (!floaty.checkPermission()) {
        // 没有悬浮窗权限，提示用户并跳转请求
        toast("需要悬浮窗权限来显示悬浮窗，请在找到[律已]并允许权限");
        floaty.requestPermission();
        return;
    } else {
        explanAlert.init();
        explanAlert.show();
    }
});

function runService() {
    engines.execScriptFile(SERVICE_SCRIPT_PATH);
    updateImageButton(ui.imgRunService, "#6969ff", true);
}

function getCurrentActivityInfo() {
    return {
        activity: currentActivity(),
        pckage: currentPackage(),
        appname: getAppName(currentPackage())
    };
}

function updatesRulerStorage(name, mdata) {
    switch (name) {
        case "evilActivity":
            rulerStorage.put("evilActivity", mdata);
            evilActivity = mdata;
            updateActivityListView();
            break;
        case "whitelistActivity":
            rulerStorage.put(name, mdata);
            whitelistActivity = mdata;
            updateActivityListView();
            break;
        case "alertTipsText":
            rulerStorage.put(name, mdata);
            alertTipsText = mdata;
            break;
    }
}

/* 判断Activity是否重复 */
function isRepeatActivity(act, arry) {
    let IsRepeat = false;
    arry.forEach(function(value, key) {
        if (value.activity == act) {
            IsRepeat = true;
            return;
        }
    });
    return IsRepeat;
}

function _toastAt(msg, x, y) {
    importClass(android.widget.Toast);
    importClass(android.view.Gravity);
    var toast = Toast.makeText(context, msg, Toast.LENGTH_SHORT);
    toast.setGravity(Gravity.TOP | Gravity.LEFT, x, y);
    toast.show();
}

function toastAt(msg, x, y) {
    ui.run(() => _toastAt(msg, x, y));
}


function setBackgroundRoundGradientCornerRadii(view, borderColor, bgColor, borderRadius) {
    if (borderRadius == null) {
        borderRadius = 30;
    }
    gradientDrawable = new GradientDrawable();
    gradientDrawable.setShape(GradientDrawable.RECTANGLE);
    gradientDrawable.setColor(colors.parseColor(bgColor));
    gradientDrawable.setStroke(10, colors.parseColor(borderColor));
    // gradientDrawable.setCornerRadius(10);
    //1、2两个参数表示左上角，3、4表示右上角，5、6表示右下角，7、8表示左下角
    let radiusArr = util.java.array("float", 8);
    radiusArr[0] = borderRadius;
    radiusArr[1] = borderRadius;
    radiusArr[2] = borderRadius;
    radiusArr[3] = borderRadius;
    radiusArr[4] = borderRadius;
    radiusArr[5] = borderRadius;
    radiusArr[6] = borderRadius;
    radiusArr[7] = borderRadius;
    gradientDrawable.setCornerRadii(radiusArr);
    gradientDrawable.setSize(50, 50);
    view.setBackground(gradientDrawable);
}

function rndColor() {
    return colors.rgb(random(0, 255), random(0, 255), random(0, 255));
}

function rndNum(min, max) {
    return Math.floor(Math.random() * (max - min + 1) + min);
}

function updateImageButton(view, statuColor, statu) {
    view.setColorFilter(Color.parseColor(statuColor));
    //@statu 只在改变ui.imgRunService时有用
    if (statu != null) {
        imgRunServiceStatu = statu;
    }
}

function updateActivityListView() {
    if (evilActivity == null || evilActivity.length == 0) {
        ui.blacklist_empty.setVisibility(View.VISIBLE);
        ui.blacklist.setVisibility(View.GONE);
    } else {
        ui.blacklist_empty.setVisibility(View.GONE);
        ui.blacklist.setVisibility(View.VISIBLE);
    }
    if (whitelistActivity == null || whitelistActivity.length == 0) {
        ui.whitelist_empty.setVisibility(View.VISIBLE);
        ui.whitelist.setVisibility(View.GONE);
    } else {
        ui.whitelist_empty.setVisibility(View.GONE);
        ui.whitelist.setVisibility(View.VISIBLE);
    }
}

function updatePermissionStatusView(view, statu) {
    let ownColor = colors.parseColor("green");
    let notOwned = colors.parseColor("red");;
    // view.setTextColor(statu ? ownColor : notOwned);
    view.textColor = statu ? ownColor : notOwned;
}
/*解除限制*/
function unfreeze() {
    importClass(com.stardust.autojs.core.accessibility.AccessibilityBridge.WindowFilter);
    let bridge = runtime.accessibilityBridge;
    let bridgeField = runtime.getClass().getDeclaredField("accessibilityBridge");
    let configField = bridgeField.getType().getDeclaredField("mConfig");
    configField.setAccessible(true);
    configField.set(bridge, configField.getType().newInstance());
    bridge.setWindowFilter(new JavaAdapter(AccessibilityBridge$WindowFilter, {
        filter: function(info) {
            return true;
        }
    }));
}