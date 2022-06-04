let loadLayouts = require('./dialogplus_alert.js')
let DialogPlus = require("./DialogPlus.js");
loadLayouts.alertLayout.floatImgBack.on("click", () => {
    denyAlert.dialog.dismiss();
});
let denyAlert = {
    dialog: null,
    keyword: {
        count_down: "倒计时",
        timing: "正计时",
        current_time: "当前时间",

    },
    init: function () {
        this.dialog = DialogPlus.setView(loadLayouts.alertLayout)
            .setTitle(null)
            .setEmptyMode(true)
            .build()
        //去除dialog白色背景         
        this.dialog.getDialog()
            .getWindow()
            .getDecorView()
            .setBackground(null);
    },
    show: function () {
        if (this.dialog != null) {
            this.dialog.show();
        }
    },
    setText: function (text) {
        text = text.toString();
        let match_array = findKeytext(text);
        match_array.forEach(function (e) {
            text = text.replace("{{"+e+"}}", formatKeyText(e));
        });
        loadLayouts.alertLayout.floatTextAlertText.setText(text);
    },
    // setText: function(text) {
    //     loadLayouts.alertLayout.floatTextAlertText.setText(text);
    // }
}

function formatKeyText(keytext) {
    let replace_text = "?";
    let split_keytext = keytext.split("\：");
    keytext = split_keytext[0];
    keytext_options = split_keytext[1];
    console.verbose("formatKeyText:  keytext_options, keytext ->", keytext_options, keytext);
    switch (keytext) {
        case denyAlert.keyword.count_down:
            replace_text = new Date(keytext_options) - new Date();
            replace_text = (replace_text / 60 / 60 / 24 / 1000).toFixed(1);
            break;
        case denyAlert.keyword.timing:
            replace_text = new Date() - new Date(keytext_options) ;
            replace_text = (replace_text / 60 / 60 / 24 / 1000).toFixed(1);
            break;
        case denyAlert.keyword.current_time:
            replace_text = formatDate(new Date(),keytext_options);
            // new Date().format(keytext_options);
            break;
    }
    return replace_text;
}
function findKeytext(text) {
    let keytext_arry = [];
    let [key_start_count, key_end_count] = [0, 0];
    let [key_start_index, key_end_index] = [0, 0];
    for (let i = 0; i < text.length; i++) {
        if (text[i] == "\{") {
            key_start_count++;
        }
        if (text[i] == "\}") {
            key_end_count++;
        }
        if (key_start_count == 2) {
            key_start_index = i;
            key_start_count = 0;
        }
        if (key_end_count == 2) {
            key_end_index = i;
            keytext_arry.push(text.substring(key_start_index + 1, key_end_index - 1));
            [key_start_count, key_end_count] = [0, 0];
            [key_start_index, key_end_index] = [0, 0];
        }
    }
    return keytext_arry;
}


    function formatDate(time,format){
        var date = new Date(time);
    
        var year = date.getFullYear(),
            month = date.getMonth()+1,//月份是从0开始的
            day = date.getDate(),
            hour = date.getHours(),
            min = date.getMinutes(),
            sec = date.getSeconds();
        var preArr = ["00","01","02","03","04","05","06","07","08","09"];
        // new Array.apply(null,Array(10)).map(function(elem, index) {
        //     return '0'+index;
        // });
    
        var newTime = format.replace(/YY/g,year)
                            .replace(/MM/g,preArr[month]||month)
                            .replace(/DD/g,preArr[day]||day)
                            .replace(/hh/g,preArr[hour]||hour)
                            .replace(/mm/g,preArr[min]||min)
                            .replace(/ss/g,preArr[sec]||sec);
    
        return newTime;			
    }
    // formatDate(new Date().getTime());//2017-05-12 10:05:44
    // formatDate(new Date().getTime(),'YY年MM月DD日');//2017年05月12日
    // formatDate(new Date().getTime(),'今天是YY/MM/DD hh:mm:ss');//今天是2017/05/12 10:07:45
    
module.exports = denyAlert;