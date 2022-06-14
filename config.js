let BroadcastUtil = require('./util/BroadcastUtil.js');
let myBroadcast;
let RULE_RESET = {
    AFTER_PUNISHED: 0,
    AFTER_ZERO_CLOCK: 1,
    DONT_RESE: 2
}
let RULE_ACTION = {
    RETURN_WAIT: 0,
    RETURN_NOW: 1,
    JUMP_TO_ACTIVITY: 2
}
let _config = {punishOptions: false}

let needlog = ["evilActivity","whitelistActivity","alertTipsText","startupTaskId","rulerAction","jumpActivity","punishOptions","alertValueResetRule","punishBindAlertValue","superpositionedCount","punishTimeSuperposition","punishTime","alertValue"];
let config = {
    version: getPackageName(),
    SERVICE_EXTRA_KEY: "SELF_RULER_SERVICE_STATU",
    SERVICE_SCRIPT_PATH: "./service.js",
    ACTION_STOP: "STOP_RULER_SERVICE",
    ACTION_MENU: "OPEN_RULER_MENU",
    NotifyID: 0X7A7A6572,
    dateChangedRegister: null,
    rulerStorage: null,
    evilActivity: null,
    whitelistActivity: null,
    alertTipsText: "",
    //defaultAlertTipsText: "想要有空余时间，就不要浪费时间。",
    startupTaskId: null,
    //setting
    rulerAction: RULE_ACTION.RETURN_NOW,
    jumpActivity: "微信", //原意使用acrivity 但是对于一般用户较为复杂 且不是所有Activity都可以成功跳转
    punishOptions: false,
    alertValue: 0,
    punishTime: 100,
    punishTimeSuperposition: false,
    superpositionedCount: 0,
    punishBindAlertValue: 10,
    alertValueResetRule: RULE_RESET.AFTER_PUNISHED,
    lastResetTime: 0,
    
    storage: storages.create("SELF-RULE-SETTING"),
    /* configChangeTrigger: () => {},*/
    init: function(nolog) {
        if (this.dateChangedRegister == null) {
            //threads = 
            this.dateChangedRegister = BroadcastUtil.register((context, intent) => {
                let status = intent.getStringExtra("ConfigChanged");
                if (status) {
                    this.init(true);
                    //console.info("Broadcas ConfigChanged")
                }
                let close = intent.getStringExtra("ConfigMasterClosed");
                if (close) {
                    //console.info("Broadcast get ConfigMasterClosed:", close)
                    this.release();
                }
            });
            //调用着退出时释放广播
            events.on("exit", () => {
                this.release();
            });

        }
        this.rulerStorage = storages.create("ruler:activityLists");
        this.evilActivity = this.rulerStorage.get("evilActivity");
        this.whitelistActivity = this.rulerStorage.get("whitelistActivity");
        this.alertTipsText = this.rulerStorage.get("alertTipsText");
        
        //设置界面配置
        this.rulerAction = this.storage.get("rulerAction",1);
        this.jumpActivity = this.storage.get("jumpActivity","律已");
        this.punishOptions = this.storage.get("punishOptions",false);
        this.punishTime = this.storage.get("punishTime",99);
        this.punishTimeSuperposition = this.storage.get("punishTimeSuperposition",false);
        this.punishBindAlertValue = this.storage.get("punishBindAlertValue",10);
        this.alertValueResetRule = this.storage.get("alertValueResetRule",RULE_RESET.AFTER_PUNISHED);
        this.alertValue = this.storage.get("alertValue",0);
        if(this.alertValueResetRule == RULE_RESET.AFTER_ZERO_CLOCK
           && getZeroClock - lastResetTime > 0){
              this.notifyConfigChange("alertValue", 0);
           }
        
        if (!nolog) {
            console.info("初始化配置结束->");
            console.verbose(JSON.stringify(this, needlog, 2));
        } else {
            console.verbose("配置变更<-->");
            //toast("配置变更" + files.cwd())
        }
    },
    /*
     * 跨脚本通知(ui配置变更通知)
     */
    notifyConfigChange: function(key,value) {
     /* 处理一些需要自己存储的 */
       // this.storage.put("rulerAction",this.rulerAction);
        //this.storage.put("jumpActivity",this.jumpActivity);
       // this.storage.put("punishOptions",this.punishOptions);
        this.storage.put(key, value);
        this[key] = value;
        //this.init(true);
        /*this.configChangeTrigger();*/
    },
    release: function() {
        if (this.dateChangedRegister != null) {
            BroadcastUtil.destroy(this.dateChangedRegister);
            this.dateChangedRegister = null;
            console.info("Broadcast-selfruler 销毁广播 ");
        } 
    },

    /*  addOnConfigChangeListen: function(listenFunc) {
        this.configChangeTrigger = listenFunc;
    }
*/
     /* 每次更改都init no 后面有空改为 */
     setConfig: function(k,v){
         _config[k] = v;
         this.storage.put(k,v);
         //sendBroadcast
         // other
     },
     getConfig: function(k){
         return _config[k];
     }

}

function getPackageName() {
    let manager = context.getPackageManager();
    let name = null;
    try {
        let info = manager.getPackageInfo(context.getPackageName(), 0);
        name = info.versionName;
    } catch (e) {
        e.printStackTrace();
    }
    return name;
}


function getZeroClock(){
        let today = new Date();
        return new Date(today.toDateString()).getTime();
    }
module.exports = config;