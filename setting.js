/* setting界面相关
 *   在main ui加载完毕后才requre,所以main中的已加载的方法可用(bad?)
 *
 */

$ui.inflate(
    <vertical>
        <linear gravity="center|left" h="100" bg="#2B2B2B" id="_setting_title" layout_weight="1">
            <img src="@drawable/setting2" h="100" padding="10 10 0 10" tint="#FF0000" />
            <img src="@drawable/setting_title" tint="#FF0408"/>
            <!--text text="Setting" textSize="28sp" textStyle="bold" color="#FF0000" padding="10"></text-->
        </linear>
        <View h="2" w="*" margin="20 0 20 0" bg="#565B5B" />
        <!-- 警告弹窗 -->
        <linear padding="15 20 0 0" gravity="center|left">
            <img src="@drawable/warning" tint="#FF8800" h="18sp" />
            <text text="警告弹窗触发行为" textSize="18sp" textStyle="bold" color="#FFFFFF">
            </text>
        </linear>
        
        <vertical id="setting_content" margin="20 5 20 30" padding="10">
            <radiogroup id="set_rule_action">
                <radio text="等待返回" color="#FFFFFF" />
                <radio  text="直接返回" color="#FFFFFF" checked="true" />
                <radio text="直接跳转至指定白名单应用" color="#FFFFFF" />
                <spinner id="return_act_spinner" textSize="13sp" marginLeft="16sp" textColor="#33FF66" />
            </radiogroup>
        </vertical>
        <!-- 惩罚策略 -->
        <linear paddingLeft="15" gravity="center|left">
            <img src="@drawable/pushpin" tint="#FF8800" h="18sp" />
            <Switch id="switch_punish" w="*" textSize="18sp" textStyle="bold" color="#FFFFFF" theme="@style/Theme.MyTheme" text="惩罚策略" marginRight="20" clickable="true" trackTint="#FFFFFF" thumbTint="#FF8800" />
        </linear>
        <vertical id="setting_punish" margin="20 5 20 30" padding="10">
            <linear gravity="center">
                <text text="警告值:" color="#FFFFFF" />
                <text id="alertValue" text="0" textSize="20sp" textStyle="bold" color="#FF3333" />
            </linear>
            <View h="2" w="*" margin="20 0 20 0" bg="#565B5B" />
            
            <linear>
                <text text="惩罚时间:" color="#FFFFFF" margin="20 0" />
                <input id="punishTime" text="100" inputType="number" focusable="true" color="#FF0509" enabled="false"/>
                <text text="秒" color="#FFFFFF" />
            </linear>
            <Switch id="punishTimeSuperposition" color="#FFFFFF" text="叠加惩罚时间"  margin="20 10 20 10" enabled="false"/>
            
            <linear>
                <text text="触发惩罚警告值:" color="#FFFFFF" margin="20 0" />
                <input id="punishBindAlertValue" text="10" inputType="number"  color="#FF0509" enabled="false"/>
            </linear>
            <!--Switch color="#FFFFFF" text="惩罚后重置次数" clickable="false"/-->
            <View h="2" w="*" margin="20 0 20 0" bg="#565B5B" />
            <text text="次数重置规则" margin="20 10" textStyle="bold" color="#FFFFFF" />
            <radiogroup id="alertValueResetRule">
                <radio text="惩罚后重置" color="#FFFFFF" checked="true" enabled="false"/>
                <radio text="零点重置" color="#FFFFFF"  enabled="false"/>
                <radio text="不重置" color="#FFFFFF"  enabled="false"/>
            </radiogroup>
        </vertical>
        
        <linear padding="15 20 0 5" gravity="center|left"  w="*">
            <img src="@drawable/leaf" tint="#FF8800" h="18sp" />
            <text text="关于律已" textSize="18sp" textStyle="bold" color="#FFFFFF">
            </text>
            <text text="{{config.version}}" textSize="12sp" textStyle="bold" color="#FFFFFF"  gravity="bottom" marginLeft="5" h="*">
            </text>
        </linear>
        <vertical id="setting_info" margin="20 5 20 30" padding="15">
            <linear layout_gravity="left|center" paddingBottom="9">
                <img src="@drawable/logo" />               
                <img src="@drawable/and" tint="#FFFFFF" layout_gravity="center"/>
              <img src="@drawable/pro"w="60" h="60"/>
                <text text=":."/>
            </linear>
            <linear h="18sp">
                <img src="@drawable/mug" tint="white"  />
                <text id="info_mypage"  textColor="white" gravity="center">  |  zzerX (0x7A7A6572)</text>
            </linear>
            <View h="2" w="*" margin="15" bg="#565B5B" />
            <linear h="18sp" >
                <img src="@drawable/github" tint="white" />
                <text id="info_open" textColor="white" gravity="center">  | 开源项目地址
                </text>
            </linear>
            <View h="2" w="*" margin="15" bg="#565B5B" />
            <linear h="18sp">
                <img src="@drawable/mail" tint="white" />
                <text id="info_mail" textColor="white" gravity="center">  | zzerx@qq.com
                </text>
            </linear>
            <View h="2" w="*" margin="15" bg="#565B5B" />
            <linear h="18sp">
                <img src="@drawable/bubbles2" tint="white" />
                <text id="info_group" textColor="white" gravity="center">  | 782523813
                </text>
            </linear>
            <text autoLink="all" color="grey" marginTop="25" w="*" gravity="center"> .:       逃离时间的黑洞！    :.</text>
            
            
        </vertical>
    </vertical>, $ui.setting_layout, true);


function settingDataInit() {
    //设置界面数据初始化
    whitelistForSpinner = activityListToSpinnerList(whitelistActivity);
    changeSpinnerList(ui.return_act_spinner, whitelistForSpinner);
    $ui.return_act_spinner.setSelection(getSpinnerIndex(whitelistForSpinner, config.jumpActivity));
    AutojsUtil.setRadioGroupChecked($ui.set_rule_action, config.rulerAction);

    $ui.punishTime.setText(config.punishTime.toString());
    $ui.punishTimeSuperposition.setChecked(config.punishTimeSuperposition);
    $ui.punishBindAlertValue.setText(config.punishBindAlertValue.toString());
    AutojsUtil.setRadioGroupChecked($ui.alertValueResetRule, config.alertValueResetRule);
    $ui.alertValue.setText(config.alertValue.toString());

    $ui.switch_punish.setChecked(config.punishOptions);

}


function settingUiInit() {
    //设置界面ui初始化
    /* main@setBackgroundRoundGradientCornerRadii */

    if (config.rulerAction != 2) { //2 == is jumpActivity
        $ui.return_act_spinner.setEnabled(false);
    }
    setBackgroundRoundGradientCornerRadii(ui.setting_content, "#FF8800", "#232B2B");
    setBackgroundRoundGradientCornerRadii(ui.setting_punish, "#FF8800", "#232B2B");
    setBackgroundRoundGradientCornerRadii($ui.setting_info, "#FF8800", "#232B2B");
}


//设置界面事件初始化

AutojsUtil.RadioGroupCheckedListener(ui.set_rule_action, (index, radio, checkedId) => {
    //config.rulerAction = index;
    $ui.return_act_spinner.setEnabled(index == 2);
    //radio.setTextColor(activity.resources.getColor($ui.R.color.mainColorAccent));
    config.notifyConfigChange("rulerAction", index);
})


$ui.return_act_spinner.setOnItemSelectedListener(new android.widget.AdapterView.OnItemSelectedListener({
    onItemSelected: function(parent, view, position, id) {
        // config.jumpActivity = whitelistForSpinner[id];
        config.notifyConfigChange("jumpActivity", whitelistForSpinner[id]);
    }
}))

$ui.switch_punish.on("check", (checked) => {
    if (checked) {
        $ui.punishTime.setEnabled(true);
        $ui.punishTimeSuperposition.setEnabled(true);
        $ui.punishBindAlertValue.setEnabled(true);
        AutojsUtil.setRadioGroupEnable($ui.alertValueResetRule, true);
        //$ui.alertValueResetRule.setEnabled(true);
        /* toast("敬请期待");
         setTimeout(() => {
             $ui.switch_punish.setChecked(false);
         }, 500);*/
    } else {
        $ui.punishTime.setEnabled(false);
        $ui.punishTimeSuperposition.setEnabled(false);
        $ui.punishBindAlertValue.setEnabled(false);
        // $ui.alertValueResetRule.setEnabled(false);
        AutojsUtil.setRadioGroupEnable($ui.alertValueResetRule, false);

    }
    //config.punishOptions = checked;
    config.notifyConfigChange("punishOptions", checked);
});

$ui.punishTime.addTextChangedListener(new android.text.TextWatcher({
    afterTextChanged: function(s) {
        config.notifyConfigChange("punishTime", Number(s))
    }
}));

$ui.punishTimeSuperposition.on("check", (checked) => {
    config.notifyConfigChange("punishTimeSuperposition", checked);
});

$ui.punishBindAlertValue.addTextChangedListener(new android.text.TextWatcher({
    afterTextChanged: function(s) {
        config.notifyConfigChange("punishBindAlertValue", Number(s))
    }
}));

AutojsUtil.RadioGroupCheckedListener($ui.alertValueResetRule, (index, radio, checkedId) => {
    config.notifyConfigChange("alertValueResetRule", index);
})

$ui.info_mypage.on('click', () => {
    app.openUrl("https://zzerx.cn");
});
$ui.info_open.on('click', () => {
    app.openUrl("https://github.com/0x7A7A6572");
});
$ui.info_mail.on('click', () => {

});
$ui.info_group.on('click', () => {
    app.openUrl("https://jq.qq.com/?_wv=1027&k=EtBifiAs");
});




function activityListToSpinnerList(actlist) {
    let splist = [];
    for (let k in actlist) {
        // toast(JSON.stringify(actlist[i]));
        splist.push(actlist[k].appname);
    }
    return splist;
}

function changeSpinnerList(spinner, mCountries) {
    adapter = new android.widget.ArrayAdapter(context, android.R.layout.simple_spinner_dropdown_item, mCountries);
    //adapter.setDropDownViewResource($ui.R.layout.spinner_dropdown);
    spinner.setAdapter(adapter);
    //spinner.setTextColor(0x33FF66)
}

function getSpinnerIndex(splist, txt) {
    console.log(splist, txt)
    for (let i = 0; i < splist.length; i++) {
        if (splist[i] == txt)
            return i;
    }
    return -1;
}



let whitelistForSpinner = [];
settingDataInit();
settingUiInit();