/* setting界面相关
*   在main ui加载完毕后才requre,所以main中的已加载的方法可用(bad?)
*
*/

$ui.inflate(
    <vertical>
        <linear gravity="center|left" h="100" bg="#2B2B2B" id="_setting_title" layout_weight="1">
            <img src="@drawable/setting2" h="100" padding="10 10 0 10" tint="#FF0000" />
            <text text="Setting" textSize="28sp" textStyle="bold" color="#FF0000" padding="10">
            </text>
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
            <Switch w="*" textSize="18sp" textStyle="bold" color="#FFFFFF" theme="@style/Theme.MyTheme" text="惩罚策略(待开发)" marginRight="20" clickable="true" trackTint="#FFFFFF" thumbTint="#FF8800" />
        </linear>
        <vertical id="setting_punish" margin="20 5 20 30" padding="10">
            <linear gravity="center">
                <text text="警告值:" color="#FFFFFF" />
                <text text="0" textSize="20sp" textStyle="bold" color="#FF3333" />
            </linear>
            <View h="2" w="*" margin="20 0 20 0" bg="#565B5B" />
            
            <linear>
                <text text="惩罚时间:" color="#FFFFFF" margin="20 0" />
                <input text="100" inputType="number" focusable="false" color="#FFFFFF" />
                <text text="秒" color="#FFFFFF" />
            </linear>
            <Switch color="#FFFFFF" text="叠加惩罚时间" clickable="false" margin="20 10 20 10" />
            
            <linear>
                <text text="触发惩罚警告值:" color="#FFFFFF" margin="20 0" />
                <input text="10" inputType="number" focusable="false" color="#FFFFFF" />
            </linear>
            <!--Switch color="#FFFFFF" text="惩罚后重置次数" clickable="false"/-->
            <View h="2" w="*" margin="20 0 20 0" bg="#565B5B" />
            <text text="次数重置规则" margin="20 10" textStyle="bold" color="#FFFFFF" />
            <radiogroup>
                <radio text="惩罚后重置" color="#FFFFFF" clickable="false" checked="true" />
                <radio text="零点重置" color="#FFFFFF" clickable="false" />
                <radio text="不重置" color="#FFFFFF" clickable="false" />
            </radiogroup>
        </vertical>
        <linear padding="15 20 0 20" gravity="center|left" id="imgInfo" w="*">
            <img src="@drawable/leaf" tint="#FF8800" h="18sp" />
            <text text="关于律已" textSize="18sp" textStyle="bold" color="#FFFFFF">
            </text>
        </linear>
    </vertical>, $ui.setting_layout, true);

//设置界面数据初始化
let whitelistForSpinner = activityListToSpinnerList(whitelistActivity);
changeSpinnerList(ui.return_act_spinner, whitelistForSpinner);

//设置界面ui初始化
/* main@setBackgroundRoundGradientCornerRadii */
setBackgroundRoundGradientCornerRadii(ui.setting_content, "#FF8800", "#232B2B");
setBackgroundRoundGradientCornerRadii(ui.setting_punish, "#FF8800", "#232B2B");

//设置界面事件初始化
AutojsUtil.setRadioGroupChecked(ui.set_rule_action, config.rulerAction);

AutojsUtil.RadioGroupCheckedListener(ui.set_rule_action,(index,radio,checkedId)=>{
    config.rulerAction = index;
    config.notifyConfigChange();
})





function activityListToSpinnerList(actlist) {
    let splist = [];
    for (let k in actlist) {
        // toast(JSON.stringify(actlist[i]));
        splist.push(actlist[k].appname);
    }
    return splist;
}

function changeSpinnerList(spinner, mCountries) {

    sp = spinner

    adapter = new android.widget.ArrayAdapter(context, android.R.layout.simple_spinner_dropdown_item, mCountries);
    //adapter.setDropDownViewResource($ui.R.layout.spinner_dropdown);
    sp.setAdapter(adapter);
    //sp.setTextColor(0x33FF66)
}