let RULE_RESET = {
   AFTER_PUNISHED: 0,
   AFTER_ZERO_CLOCK: 1,
   DONT_RESE: 2
}
let RULE_TIGGER = {
   RETURN_WAIT: 0,
   RETURN_NOW: 1,
   JUMP_TO_ACTIVITY: 2
}
let config = {
   SERVICE_EXTRA_KEY: "SELF_RULER_SERVICE_STATU",
   SERVICE_SCRIPT_PATH: "./service.js",
   ACTION_STOP: "STOP_RULER_SERVICE",
   ACTION_MENU: "OPEN_RULER_MENU",
   NotifyID: 0X7A7A6572,
   rulerStorage: null,
   evilActivity: null,
   whitelistActivity: null,
   alertTipsText: "",
   //defaultAlertTipsText: "想要有空余时间，就不要浪费时间。",
   startupTaskId: null,
   //setting
   triggerOnAlertTipsShow: RULE_TIGGER.RETURN_NOW, //[0,1,2] => [等待返回，直接返回，跳转Act]
   JumpActivity: "cn.zzerx.selfruler",
   punishOptions: false,
   alertValue: 0,
   punishTime: 100,
   punishTimeSuperposition: false,
   superpositionedCount: 0,
   punishBindAlertValue: 10,
   alertValueResetRule: RULE_RESET.AFTER_PUNISHED, 
   init: function(){
    this.rulerStorage = storages.create("ruler:activityLists");
    this.evilActivity = this.rulerStorage.get("evilActivity");
    this.whitelistActivity = this.rulerStorage.get("whitelistActivity");
    this.alertTipsText = this.rulerStorage.get("alertTipsText");
    
    console.info("初始化配置结束->");
    console.verbose(JSON.stringify(this, null, 2));
   }


}
module.exports = config;