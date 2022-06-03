let loadLayouts = require('./dialogplus_alert.js')
let DialogPlus = require("./DialogPlus.js");
let denyAlert = {
    dialog: null,
    keyword: {
        count_down: "倒计时:",
        timing: "正计时:",
        current_time: "当前时间",

    },
    init: function() {
        this.dialog = DialogPlus.setView(loadLayouts.alertLayout)
            .setTitle(null)
            .setEmptyMode(true)
            .build()
        //去除dialog白色背景         
        this.dialog.getDialog()
            .getWindow()
            .getDecorView()
            .setBackground(null);
        loadLayouts.alertLayout.floatImgBack.on("click", ()=> {
            this.dialog.dismiss();
        });
    },
    show: function() {
        if (this.dialog != null) {
            this.dialog.show();
        }
    },
     setText: function(text) {
     let match_array = text.match(/{{([^《|》]*?)}}/g);
       match_array.forEach(function(e){
         text = text.replace(keytext, formatKeyText(keytext));
       });
        loadLayouts.alertLayout.floatTextAlertText.setText(alertTipsText);
    },
    setText: function(text) {
        loadLayouts.alertLayout.floatTextAlertText.setText(text);
    }
}

function formatKeyText(keytext){

 switch(keytext){
  case denyAlert.keyword.count_down:
  break;
 }
  //[\u4e00-\u9fa5]
  return 
}
module.exports = denyAlert;