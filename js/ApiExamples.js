//进行Api测试
export class ApiExamples {
    getUserInfo() {
        wx.getUserProfile({
            success: function (res) {
                console.log('ss');
            }
        });
    }
}