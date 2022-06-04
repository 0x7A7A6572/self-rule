
let _alert_layout  = $ui.inflate(<vertical layout_gravity="center" gravity="center">
    <img id="imgLock" src="file://./images/lock_200.png" w="150" h="150" />
    <text color="white" textSize="40" textStyle="bold" text="律已" w="*">
    </text>
    <ScrollView layout_weight="1">
    <text id="floatTextAlertText" color="white" textSize="18" textStyle="bold" text="要想有空余时间，就不要浪费时间">
    </text>
    </ScrollView>
    <vertical >
    <View w="*" h="2" bg="#ffffff" margin="10 0 10 0"/>
    <img id="floatImgBack" marginTop="10" w="50" h="50" src="@drawable/ic_keyboard_return_black_48dp" tint="white" layout_gravity="center" gravity="center">
    </img>
    </vertical>

</vertical>);

let _info_layout = "";
module.exports = {infoLayout:_info_layout , alertLayout:_alert_layout}