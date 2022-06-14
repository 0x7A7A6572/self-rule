let DialogPlus = require("./DialogPlus.js");
let _alert_layout = $ui.inflate(
    <vertical layout_gravity="center" gravity="center">
    <!--img src="@drawable/key" layout_gravity="left"  gravity="left|top" tint="#CCccCC" w="*" h="*"/-->
        <img id="imgLock" src="file://./images/lock_200.png" w="150" h="150" />
        <text color="white" textSize="40" textStyle="bold" text="律已" w="*">
        </text>
        <ScrollView layout_weight="1">
            <text id="floatTextAlertText" color="white" textSize="18" textStyle="bold" text="要想有空余时间，就不要浪费时间">
            </text>
        </ScrollView>
        <vertical >
            <View w="*" h="2" bg="#ffffff" margin="10 0 10 0" />
            <text id="lockCountDown" text="120" textSize="40dp" gravity="center" color="red" visibility="gone"/>
            <img id="floatImgBack" marginTop="10" w="50" h="50" src="@drawable/ic_keyboard_return_black_48dp" tint="white" layout_gravity="center" gravity="center" >
            </img>
            
        </vertical>
        
    </vertical>);

let denyAlert = {
    dialog: null,
    keyword: {
        count_down: "倒计时",
        timing: "正计时",
        current_time: "当前时间",

    },
    init: (bindImgBackFunc) => {
        this.dialog = DialogPlus.setView(_alert_layout)
            .setTitle(null)
            .setEmptyMode(true)
            .build()
        //去除dialog白色背景         
        this.dialog.getDialog()
            .getWindow()
            .getDecorView()
            .setBackground(null);
        _alert_layout.floatImgBack.on("click", () => {
            this.dialog.dismiss();
            bindImgBackFunc();
        });
        return this;
    },
    show: () => {
        if (this.dialog != null) {
            this.dialog.show();
        } else {
            console.warn("dialog = nill");
        }
    },
    setText: function(text) {
        text = text.toString();
        let match_array = findKeytext(text);
        match_array.forEach(function(e) {
            text = text.replace("{{" + e + "}}", formatKeyText(e));
        });
        _alert_layout.floatTextAlertText.setText(text);
        return this;
    },
    setLockEnable: function(enable, value) {
        if (enable) {
            _alert_layout.imgLock.setColorFilter(android.graphics.Color.RED);
            _alert_layout.lockCountDown.setVisibility(View.VISIBLE);
            _alert_layout.lockCountDown.setText(value.toString());
            _alert_layout.floatImgBack.setVisibility(View.GONE);
            let lockvalue = value;
            let lockTimer = setInterval(()=> {
                lockvalue--;
                if (lockvalue < 0) {
                    this.setLockEnable(false);
                    clearInterval(lockTimer);
                }
                $ui.post(()=>{
                    _alert_layout.lockCountDown.setText(lockvalue.toString());
                });
            }, 1000);
        } else {
            _alert_layout.lockCountDown.setVisibility(View.GONE);
            _alert_layout.floatImgBack.setVisibility(View.VISIBLE);
            _alert_layout.imgLock.setColorFilter(null);
        }
    }

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
            replace_text = new Date() - new Date(keytext_options);
            replace_text = (replace_text / 60 / 60 / 24 / 1000).toFixed(1);
            break;
        case denyAlert.keyword.current_time:
            replace_text = formatDate(new Date(), keytext_options);
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


function formatDate(time, format) {
    var date = new Date(time);

    var year = date.getFullYear(),
        month = date.getMonth() + 1, //月份是从0开始的
        day = date.getDate(),
        hour = date.getHours(),
        min = date.getMinutes(),
        sec = date.getSeconds();
    var preArr = ["00", "01", "02", "03", "04", "05", "06", "07", "08", "09"];
    // new Array.apply(null,Array(10)).map(function(elem, index) {
    //     return '0'+index;
    // });

    var newTime = format.replace(/YY/g, year)
        .replace(/MM/g, preArr[month] || month)
        .replace(/DD/g, preArr[day] || day)
        .replace(/hh/g, preArr[hour] || hour)
        .replace(/mm/g, preArr[min] || min)
        .replace(/ss/g, preArr[sec] || sec);

    return newTime;
}
// formatDate(new Date().getTime());//2017-05-12 10:05:44
// formatDate(new Date().getTime(),'YY年MM月DD日');//2017年05月12日
// formatDate(new Date().getTime(),'今天是YY/MM/DD hh:mm:ss');//今天是2017/05/12 10:07:45

module.exports = denyAlert;