let DialogPlus = require("./DialogPlus.js");
let _info_layout = $ui.inflate(
    <card bg="#232B2B" 
            layout_centerHrizontal="true"
            layout_centerVertical="true"
            margin="30 30 30 30"
            cardCornerRadius="10"
            cardElevation="1dp">
            <!--ScrollView padding="5"-->
                <vertical
                    layout_weight="1"
                    padding="30">
                    <!--text textSize="23sp" textColor="#000000" text="律已" textStyle="bold|italic" />
    <text textSize="16sp" textColor="#000000" text="开发者: zzerX"/-->
                    <text
                        textSize="40sp"
                        textColor="#f4a386">律</text>
                    <text
                        margin="40sp -30sp"
                        textSize="40sp"
                        textColor="#f46677">已</text>
                    <text textSize="12sp" color="white">v1.0.0</text>
                    <View bg="#55cccc"
                        h="3"
                        w="40sp"
                        margin="0 0 0 0" />
                    <View
                        bg="#55cccc"
                        h="3"
                        w="260"
                        margin="10 10 0 0" />
                     <linear>
                     <img src="@drawable/setting" tint="white" h="14sp" marginTop="20"/>
                    <text id="info_mypage" marginTop="20" textColor="white">zzerX (0x7A7A6572)</text>
                    </linear>
                    
                      <linear>
                     <img src="@drawable/github" tint="white" h="14sp"/>
                    <text id="info_open" textColor="white">开源项目地址 -></text>
                    </linear>
                    
                      <linear>
                     <img src="@drawable/mail" tint="white" h="14sp"/>
                    <text id="info_mail" textColor="white">zzerx@qq.com -></text>
                    </linear>
                    
                      <linear>
                     <img src="@drawable/bubbles2" tint="white" h="14sp"/>
                     <text id="info_group" textColor="white">交流群: 782523813 -></text>
                       </linear>

                    <text
                        padding="8"
                        marginTop="10"
                        w="*"
                        textColor="white"
                        bg="#33dbdbdb">更多信息 -></text>
             <text autoLink="all" color="grey" marginTop="15" w="*" gravity="center"> .:       逃离时间的黑洞！    :.</text>
            <img
                id="imgCloseInfo"
                src="@drawable/ic_arrow_back_black_48dp"
                layout_gravity="center"
                w="54"
                h="54"
                tint="white"
                marginTop="30" />
                </vertical>

            <!--/ScrollView-->
        </card>);
 _info_layout.imgCloseInfo.on("click", () => {
        infoAlert.dialog.dismiss();
    });
  _info_layout.info_mypage.on('click', () => {
    app.openUrl("https://zzerx.cn");
});
_info_layout.info_open.on('click', () => {
    app.openUrl("https://github.com/0x7A7A6572");
});
_info_layout.info_mail.on('click', () => {

});
_info_layout.info_group.on('click', () => {
    app.openUrl("https://jq.qq.com/?_wv=1027&k=EtBifiAs");
});
  
let infoAlert = {
    dialog: null,
    init: function () {
        this.dialog = DialogPlus.setView(_info_layout)
            .setTitle(null)
            .setEmptyMode(true)
            .build()
        //去除dialog白色背景         
        this.dialog.getDialog()
            .getWindow()
            .getDecorView()
            .setBackground(null)
    },
    show: function () {
        if (this.dialog != null) {
            this.dialog.show();
        }
    },
    getDecorView: function(){
        return this.dialog.getDialog()
            .getWindow()
            .getDecorView();
    }
}

module.exports = infoAlert;