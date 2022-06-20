let DialogPlus = require("./DialogPlus.js");
let _alert_layout = $ui.inflate(
    <vertical >
        <vertical id="lock_layout" layout_gravity="center" gravity="center" layout_weight="1" h="*" >
            <!--img src="@drawable/key" layout_gravity="left"  gravity="left|top" tint="#CCccCC" w="*" h="*"/-->
            <img id="imgLock" src="file://./res/drawable/lock_200.png" w="150" h="150" />
            <text color="white" textSize="40" textStyle="bold" text="律已" w="*">
            </text>
            <ScrollView layout_weight="1">
                <text id="floatTextAlertText" color="white" textSize="18" textStyle="bold" text="要想有空余时间，就不要浪费时间">
                </text>
            </ScrollView>
            <vertical >
                <View w="*" h="2" bg="#ffffff" margin="10 0 10 0" />
                <img id="floatImgBack" marginTop="10" w="50" h="50" src="@drawable/ic_keyboard_return_black_48dp" tint="white" layout_gravity="center" gravity="center" >
                </img>
            </vertical>
        </vertical>
        
        <vertical id="punish_layout"  padding="10dp" margin="20dp" bg="#88ff0000" layout_gravity="center" gravity="center" visibility="gone">
            <View h="5dp" text=" 》》》》》》》》》》》》》》》》》》》》》》"  bg="#EEEEEE" textSize="20dp" textStyle="bold" gravity="center" margin="-20dp 0dp -20dp 0dp" />
            <linear gravity="center|left">
                <img  src="@drawable/ic_warning_black_48dp"  w="30dp" tint="#FFCC00"/>
                <text text="惩罚时间" color="#EEEEEE" textSize="20dp" textStyle="bold" gravity="center" />
            </linear>
            <text id="lockCountDown" text="120" textSize="50dp" gravity="center" color="#EFCC00" margin="10dp" textStyle="bold"/>
            <View h="5dp"  text="《《《《《《《《《《《《《《《《《《《《《《《《" bg="#EEEEEE" textSize="20dp" textStyle="bold" gravity="center" margin="-20dp 0dp -20dp 0dp" />
            
        </vertical>
        <!--View h="*" bg="#ff9900" layout_weight="1" ></View>
        <text text="com.zzerx.cjbk.hhgghgf.hhgffdfggfddfgffff" color="red" textStyle="bold" h="*" bg="#ffff00"/-->
    </vertical>);

let denyAlert = {
    dialog: null,
    lockvalue: 0, //临时计时
    keyword: {
        count_down: "倒计时",
        timing: "正计时",
        current_time: "当前时间",
    },
    emergencyData: {
        punishTimeRemain: 0,
        type: null
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
            console.warn("dialog is nill");
        }
    },
    close: () => {
        if (this.dialog != null) {
            this.dialog.dismiss();
        } else {
            console.warn("dialog is nill. dout use close");
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
        value = Number(value);
        if (enable) {
            /* 先显示再隐藏
             */
            _alert_layout.punish_layout.setVisibility(android.view.View.VISIBLE);
            _alert_layout.lock_layout.setVisibility(android.view.View.GONE)

            /*
            _alert_layout.imgLock.setColorFilter(android.graphics.Color.RED);
            _alert_layout.lockCountDown.setVisibility(android.view.View.VISIBLE);
            _alert_layout.lockCountDown.setText(value.toString());
            _alert_layout.floatImgBack.setVisibility(android.view.View.GONE);*/
            this.lockvalue = value;
            let lockTimer = setInterval(() => {
                /* 系统来电，暂时放过你*/
                /* .CALL_STATE_RINGING=1 响铃  */
                if (context.getSystemService(android.content.Context.TELEPHONY_SERVICE).getCallState() == 1) {
                    this.emergencyPauseControl(true);
                    console.info("收到系统来电，关闭警告窗")
                }
                this.lockvalue--;
                if (this.lockvalue < 0) {
                    clearInterval(lockTimer);
                    this.setLockEnable(false);
                }else{
                $ui.post(() => {
                    _alert_layout.lockCountDown.setText(this.lockvalue.toString());
                });
                }
            }, 1000);
        } else {
            _alert_layout.lock_layout.setVisibility(android.view.View.VISIBLE);
            _alert_layout.punish_layout.setVisibility(android.view.View.GONE);
            $ui.post(() => {
                    _alert_layout.lockCountDown.setText("*");
                });
            /* _alert_layout.lockCountDown.setVisibility(android.view.View.GONE);
             _alert_layout.floatImgBack.setVisibility(android.view.View.VISIBLE);
             _alert_layout.imgLock.setColorFilter(null);*/
        }
    },
    /*  正在进行的工作:
     *   监听来电接听挂机状态，并相应启动/暂停服务
     *   qq 微信 钉钉等电话监听功能未实现，考虑通过通知栏
     */
    emergencyPauseControl: function(pause) {
        if (pause) {
            this.emergencyData.punishTimeRemain = this.lockvalue;
            this.lockvalue = -1; //停止定时器
            this.setLockEnable(false);
            this.close();
        } else {
            this.lockvalue = this.emergencyData.punishTimeRemain;
            this.show();
            this.setLockEnable(true, this.lockvalue);
        }

    }

}

function formatKeyText(keytext) {
    let replace_text = "?";
    let split_keytext = keytext.split("\：");
    keytext = split_keytext[0];
    keytext_options = split_keytext[1];
    //console.verbose("formatKeyText:  keytext_options, keytext ->", keytext_options, keytext);
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