"ui";
unfreeze();
//关闭音量上退出脚本
$settings.setEnabled("stop_all_on_volume_up", false);

importClass(android.text.TextWatcher);
importClass(android.view.View);
importClass(android.view.WindowManager)
importClass(android.graphics.Color);
importClass(android.graphics.drawable.GradientDrawable);
importClass(android.text.Spannable);
importClass(android.text.SpannableStringBuilder);
importClass(android.text.style.ForegroundColorSpan);
importClass(android.graphics.LinearGradient);
importClass(android.graphics.Shader);
importClass(android.graphics.Bitmap);
importClass(android.graphics.BitmapFactory);
importClass(android.graphics.BitmapShader);
let BroadcastUtil = require('util/BroadcastUtil.js');
let DialogPlus = require("DialogPlus.js");
let icon_base64 = require("images/icon_bese64.js");
let loadLayouts = require('./dialogplus_alert.js')
let SERVICE_EXTRA_KEY = "SELF_RULER_SERVICE_STATU";
let SERVICE_SCRIPT_PATH = "./service.js";
let serviceStatu;
let imgRunServiceStatu = false;
let floatWindowStatu = false;
let window_thread, menuWindow;
let rulerStorage = storages.create("ruler:activityLists");
let evilActivity, whitelistActivity, alertTipsText;
let defaultAlertTipsText = "想要有空余时间，就不要浪费时间。"


ui.layout(
    <relative h="*" >
        <ScrollView layout_below="@id/toolbar">
            <relative h="*">

                <vertical padding="30px" layout_gravity="center" h="*" >
                 <linear margin="0 0 0 10">
                    <img  src="@drawable/ic_flash_on_black_48dp" tint="#ff8800"/>   <text id="_textPromissTitle" text="Promiss权限" textSize="18sp" textStyle="bold" h="*" gravity="center"/>
                </linear>

               <linear id="permission_status" w="*" margin="0 0 0 0" padding="12" bg="#2b2b2b">
                <text id="ps_accessibility" layout_weight="1" text="●无障碍" textSize="12sp" color="red" textStyle="bold"/>
                <text id="ps_floatwindow" layout_weight="1" text="●悬浮窗" textSize="12sp" color="green" textStyle="bold"/>
                <text id="ps_startauto" layout_weight="1" text="●开机自启" textSize="12sp" color="yellow" textStyle="bold"/>
                <text id="ps_battery_opt" layout_weight="1" text="●电池优化" textSize="12sp" color="red" textStyle="bold"/>
               </linear>
                    <linear margin="0 20 0 0">
                        <img src="@drawable/ic_security_black_48dp" tint="#ff8888"/> <text text="Activity黑名单" textSize="18sp" h="*" gravity="center"  textStyle="bold"/>
                    </linear>
                    <list id="blacklist" h="300" padding="10" margin="0 10 0 10" bg="#23ff0000">
                        <card w="*" h="70" margin="0 5" cardCornerRadius="10"
                        cardElevation="1dp" foreground="?selectableItemBackground" gravity="right">
                        <linear padding="5">
                            <vertical layout_weight="1">
                                <text id="activity" textSize="12sp" textColor="#FF5555" text="{{activity}}" textStyle="bold|italic" paddingRight="50"/>
                                <text id="pckage" textSize="10sp" textColor="#000000" text="所属包名: {{pckage}}（{{appname}}）"/>
                            </vertical>
                            
                        </linear>
                        <View bg="#f44336"  h="*" w="46" layout_gravity="right"/>
                        <img id="deleteItem"  src="@drawable/ic_delete_black_48dp" layout_gravity="right|center" w="34" tint="#ffffff" paddingRight="10"/>
                    </card>
                </list>
                <text id="blacklist_empty" w="*" text="空" gravity="center" padding="50"/>
                <linear marginTop="15">
                    <img  src="@drawable/ic_verified_user_black_48dp" tint="#88ff88"/>   <text text="Activity白名单" textSize="18sp" textStyle="bold" h="*" gravity="center"/>
                </linear>
                <list id="whitelist">
                    <vertical>      <text id="activity" textSize="12sp" textColor="#FF5555" text="{{activity}}" textStyle="bold|italic" paddingRight="50"/>
                        <text id="pckage" textSize="10sp" textColor="#000000" text="所属包名: {{pckage}}({{appname}})"/>
                        <button id="deleteItem" text="删除"/>
                    </vertical>
                </list>
                <text id="whitelist_empty" w="*" text="空" gravity="center" padding="50"  margin="0 10 0 10" bg="#2300ff00"/>
                <linear margin="0 15 0 10">
                    <img  src="@drawable/ic_report_black_48dp" tint="#8888ff"/>   <text text="Alert警告词" textSize="18sp" textStyle="bold" h="*" gravity="center" marginLeft="5"/>
                </linear>
                <input id="tips_input" hint="当前Activity为黑名单时，弹窗显示的文字内容。" padding="10" color="#ffffffff" textStyle="bold|italic" textSize="14sp" marginBottom="20"/>
                
              
            </vertical>
         </relative>
    </ScrollView>
    
    <relative id="toolbar" clipChildren="false" bg="#ffffff" padding="30px 30px 30px 0px" >
        <relative h="30" gravity="right" id="title_button" layout_alignParentRight="true" clipChildren="false" bg="#ffffff">
            <img id="imgRunService" src="{{icon_base64.runing_90}}" w="60dp" paddingLeft="5"/><text  text="开启" textSize="10sp"  layout_toRightOf="@id/imgRunService" /> 
            <img id="showfloatwindow" src="{{icon_base64.add_list_90}}" paddingLeft="25" w="60dp" layout_toRightOf="@id/imgRunService"/> <text  text="添加" textSize="10sp"  layout_toRightOf="@id/showfloatwindow" />
            <img id="imgSyncCloud" src="{{icon_base64.cloud_90}}" paddingLeft="25" w="60dp" layout_toRightOf="@id/showfloatwindow"/><text  text="同步" textSize="10sp" layout_toRightOf="@id/imgSyncCloud" />
            <img id="imgInfo" src="@drawable/ic_import_contacts_black_48dp" w="60dp" paddingLeft="25" layout_toRightOf="@id/imgSyncCloud"/> <text  text="关于" textSize="10sp"  layout_toRightOf="@id/imgInfo" />
        </relative>
        
        <View bg="#a666a6"  h="5" w="120" margin="10 10 0 0" layout_below="@id/title_button" layout_alignParentRight="true"/>
        <View bg="#55cccc"  h="5" w="60" margin="10 10 0 0" layout_below="@id/title_button" layout_alignParentRight="true"/>
    </relative>
    
    
    <relative id="cardInfoLayout" visibility="gone" w="*" h="*" bg="#99000000" layout_centerInparent="true">
        <card w="*" layout_centerHrizontal="true" layout_centerVertical="true" margin="30 30 30 30"  cardCornerRadius="10"
        cardElevation="1dp" foreground="?selectableItemBackground" >
        
        <ScrollView  padding="5">
            <vertical layout_weight="1" padding="30">
                <!--text textSize="23sp" textColor="#000000" text="律已" textStyle="bold|italic" />
                <text textSize="16sp" textColor="#000000" text="开发者: zzerX"/-->
                    <text textSize="40sp" textColor="#f4a386" textStyle="bold">律已</text>
                    <text textSize="12sp">v1.0.0</text>
                    <text textStyle="bold|italic" textColor="black">开发者: zzerX</text>
                    <text textStyle="italic">最后更新时间: 2022-05-15 </text>
                    <text textColor="#f4a386" >BUG/建议反馈: zzerx@qq.com</text>
                    <text padding="8" marginTop="10" bg="#dbdbdb">你可能有过这样的体验：本来只想刷一小会儿短视频放松下，结果一刷就是一晚上，根本无法停下来。虽然短视频本身没有绝对的好坏，但如果自己无法控制，就会掉进时间的黑洞而对生活造成负面影响。<br/>
                        <br/>             「律已」意在帮助需要的人在一定程度上减少「短视频」类造成负面影响，让短视频回归快节奏的减压器、生活的调剂品，让自己做回时间的主人吧！</text>
                        <text autoLink="all">如果你觉得它对你有所帮助</text>
                    </vertical>
                    
                </ScrollView>
                <View bg="#f4a386"  h="5" w="*" layout_gravity="top"/>
                <img id="imgCloseInfo"  src="@drawable/ic_clear_black_48dp" layout_gravity="top|right" w="44" h="44" tint="#f4a386" paddingRight="10"/>
            </card>
            
        </relative>
        <!--card id="permission_status" w="100" cardCornerRadius="10"  layout_alignParentLeft="true" margin="30 0 30 0">
            
            <linear padding="5" bg="#2b2b2b">
                <text id="ps_accessibility" layout_weight="1" text="●无障碍" textSize="12sp" color="red" textStyle="bold"/>
                <text id="ps_floatwindow" layout_weight="1" text="●悬浮窗" textSize="12sp" color="green" textStyle="bold"/>
                <text id="ps_startauto" layout_weight="1" text="●开机自启" textSize="12sp" color="yellow" textStyle="bold"/>
                <text id="ps_battery_opt" layout_weight="1" text="●电池优化" textSize="12sp" color="red" textStyle="bold"/>
            </linear>
        </card-->
    </relative>
);

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
   if( t.scriptPath == files.path(SERVICE_SCRIPT_PATH)){
      taskIsExist = true;
   }
});
if(!taskIsExist){
  $timers.addIntentTask({
    path: SERVICE_SCRIPT_PATH,
    action: Intent.ACTION_BOOT_COMPLETED
})
console.verbose("创建开机启动任务")
}else{
 console.verbose("开机启动任务已存在")
}
    //注册广播监听服务状态
    BroadcastUtil.register(function(context, intent) {
        serviceStatu = intent.getStringExtra(SERVICE_EXTRA_KEY);
        switch(serviceStatu){
         case "STOP_SERVICE":
           updateImageButton(ui.imgRunService, "#000000", false);
         break;
         case "SERVICE_RUNNING":
           if (imgRunServiceStatu == false) {
            updateImageButton(ui.imgRunService, "#6969ff", true);
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
      updatePermissionStatusView(ui.ps_battery_opt, $power_manager.isIgnoringBatteryOptimizations() );
     
     if(auto.service == null){
       updatePermissionStatusView(ui.ps_accessibility, false);
     }else{
       updatePermissionStatusView(ui.ps_accessibility, true);
     }
      

    }, 2000);
}
/*
 UI初始化
*/
function initUi() {
    // ---修改状态栏颜色 
    ui.statusBarColor("#ffffff");
    //键盘布局锁定
    activity.window.setSoftInputMode(WindowManager.LayoutParams.SOFT_INPUT_ADJUST_PAN);
    //Activity黑白名单显示
    updateActivityListView();
    //提示文本显示
    if (alertTipsText == null) {
        alertTipsText = "想要有空余时间，就不要浪费时间。";
    }
    ui.tips_input.setText(alertTipsText);
    //setBackgroundRoundGradientCornerRadii(loadLayouts.alertLayout, "#ffcc9944", "#ffeccc", 20);
    //黑白名单数据绑定
    ui.blacklist.setDataSource(evilActivity);
    //其他ui初始化
    setBackgroundRoundGradientCornerRadii(ui.blacklist_empty, "#63ff0000", "#23ff0000");
    setBackgroundRoundGradientCornerRadii(ui.blacklist, "#63ff0000", "#23ff0000");
    setBackgroundRoundGradientCornerRadii(ui.whitelist_empty, "#6300ff00", "#2300ff00");
    setBackgroundRoundGradientCornerRadii(ui.tips_input, "#8888ff", "#bbbbff");
    setBackgroundRoundGradientCornerRadii(ui.permission_status, "#ff8800","#2b3b2b");

}

ui.cardInfoLayout.setOnClickListener(null);
ui.ps_accessibility.on("click", function() {
if(auto.service == null){
    app.startActivity({
        action: "android.settings.ACCESSIBILITY_SETTINGS"
    });
    toast("在「已下载应用」中找到「律已」并授权");
  }else{
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
        updateImageButton(ui.imgRunService, "#6969ff", true);
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

ui.imgCloseInfo.on("click", function() {
    ui.cardInfoLayout.visibility = View.GONE
    //ui.cardInfoLayout
});
let mv = null;
ui.imgSyncCloud.on("click", function() {
evilActivity.forEach(function(v, k){
 mv = mv + v.activity +" " +v.package + v.appname +"\n";
 setClip(mv);
})
   
});
/*let myDialog;
 myDialog = DialogPlus.setView(loadLayouts.alertLayout)
              .setTitle(null)
              .setEmptyMode(true)
              .build()
   //去除dialog白色背景
//myDialog.getDialog().getWindow().getDecorView().setBackground(null);
           */
ui.imgInfo.on("click", function(e) {
    //myDialog.show();
    ui.cardInfoLayout.visibility = View.VISIBLE;
    //ui.cardInfoLayout
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
        if(evilActivity.length == 0){
          updateActivityListView();
        }
    });
})

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
                menuWindow = floaty.window( //<vertical id="floatw" gravity="center" visiable="false"></vertical>);
                    <vertical id="floatlayout" gravity="center" bg="#CC000000" padding="20px">
                                <linear>
                                    <img src="@drawable/ic_touch_app_black_48dp" h="15" w="15" tint="#FFB8B8FF" layout_gravity="center" />
                                    <text id="appname"  textSize="10sp" text="appName" layout_gravity="center" color="#ffffff" padding="1 0 1 0" bg="#8888ff" marginRight="2" />
                                    <text id="activityText" textSize="10sp" textColor="#FF8888FF" text="currentActivity..."/>
                                </linear>
                                <View bg="#FFB8B8FF" w="*" h="1"/>
                                <horizontal padding="5">
                                    <text id="saveActivityButton" textSize="12sp" color="#FF3400" text="+黑名单" marginRight="30px" textStyle="bold"> 加入黑名单</text>
                                    <text id="rmActivityButton" textSize="12sp"  color="#33ff00" text="+白名单" textStyle="bold"> 加入白名单</text>
                                    
                                </horizontal>
                            </vertical>);
                //menuWindow.exitOnClose();
                menuWindow.saveActivityButton.click(function() {
                    let cactInfo = getCurrentActivityInfo();
                    //检查是否重复
                    if (!isRepeatActivity(cactInfo.activity, evilActivity)) {
                        evilActivity.push(cactInfo);
                        toast(" 当前Activity已加入黑名单");
                        updatesRulerStorage("evilActivity", evilActivity)
                    } else {
                        toast("当前Activity已在黑名单列表，无需重复添加");
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
            log("not to do updata " + s)
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

function updateActivityListView(){
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

function updatePermissionStatusView(view, statu){
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
        filter: function (info) {
            return true;
        }
    }));
}


