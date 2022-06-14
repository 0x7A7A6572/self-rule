let DialogPlus = require("./DialogPlus.js");
let JavaUtil = require("../util/JavaUtil.js");
let _explan_layout = $ui.inflate(
    <vertical layout_gravity="center" gravity="center">
        <text id="floatTextAlertText" color="white" textSize="20dp" textStyle="bold" text="关键词">
        </text>
        <View w="*" h="2" bg="#ffffff" margin="10 8 10 8" />
        <text id="explan_text" textIsSelectable="true" text="" color="#FFFFFF" textSize="15dp" />
        <View w="*" h="2" bg="#ffffff" margin="10 0 10 0" />
        <img src="@drawable/true" id="floatImgBack" w="*" gravity="center" marginTop="10" />
        <!--text text=".: 知道了 :." id="floatImgBack" w="*" gravity="center" marginTop="10" color="#FF6666" textSize="20" /-->
    </vertical>
);
_explan_layout.explan_text.setText(`你可以使用以下关键词进行自定义你的警告词：
{{倒计时：2023/06/02}}
      表示需要倒计时的时间，弹窗显示时会自动换算成剩余天数。
{{正计时：2022/06/02}}
       表示需要正计时的时间，弹窗显示时会自动换算成已过天数。
{{当前时间：YY/MM/DD hh:mm:ss}}
      表示当前时间，：右边为显示的时间格式。

     ：为中文符号(hh:mm:ss为英文符号)
     / 为英文符号 
    `);
_explan_layout.floatImgBack.on("click", () => {
    explanAlert.dialog.dismiss();

});
let explanAlert = {
    dialog: null,
    keyword: {
        count_down: "倒计时",
        timing: "正计时",
        current_time: "当前时间",

    },
    init: function() {
        this.dialog = DialogPlus.setView(_explan_layout)
            .setTitle(null)
            .setEmptyMode(true)
            .build()
        //去除dialog白色背景         
        this.dialog.getDialog()
            .getWindow()
            .getDecorView()
            .setBackground(null)
    },
    show: function() {
        if (this.dialog != null) {
            this.dialog.show();
        }
    }
}

module.exports = explanAlert;