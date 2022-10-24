/**
 * 唯品会签到脚本
 */

const WPH_COOKIE = $prefs.valueForKey('WPH_COOKIE');
const WPH_TOKEN = $prefs.valueForKey('WPH_TOKEN');
console.log('\n================================================\n');
console.log(`Cookie：${WPH_COOKIE}`);
console.log('\n================================================\n');

if (!WPH_COOKIE || !WPH_TOKEN) {
    $notify('唯品会', `Cookie读取失败！`, `请先打开重写，进入唯品会获取Cookie`);
    $done();
}

const method = 'POST';
const baseUrl = 'https://act-ug.vip.com/signIn';
const headers = {
    Connection: `keep-alive`,
    'Accept-Encoding': `gzip, deflate, br`,
    'Content-Type': `application/x-www-form-urlencoded; charset=UTF-8`,
    Origin: `https://mst.vip.com`,
    'User-Agent': `Mozilla/5.0 (iPhone; CPU iPhone OS 16_0_3 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Mobile/15E148 VIPSHOP/7.80.6 (iphone; 2.0.0; 4ebacdc8fa8581b4de693d82e5879e0f7aef9046)`,
    Authorization: WPH_TOKEN,
    Cookie: WPH_COOKIE,
    Host: `act-ug.vip.com`,
    Referer: `https://mst.vip.com/`,
    'Accept-Language': `zh-CN,zh-Hans;q=0.9`,
    Accept: `*/*`
};

getSigninInfo();

// 签到方法
async function getSignin() {
    const url = `${baseUrl}/exec`;
    const reqBody = `source_app=app&client_type=wap&app_name=shop_iphone&client=iphone&api_key=8cec5243ade04ed3a02c5972bcda0d3f&app_version=7.80.6&mobile_platform=3&mobile_channel=ng00010v%3Aal80ssgp%3A37u8zn0w%3Ang00010p&mars_cid=4ebacdc8fa8581b4de693d82e5879e0f7aef9046&warehouse=VIP_NH&fdc_area_id=104102101107&province_id=104102101107&wap_consumer=B-1&bussCode=app_sign_in&openid=&time=0&is_front=1`;

    const myRequest = {
        url,
        method,
        headers,
        body: JSON.stringify(reqBody)
    };
    await $task.fetch(myRequest).then(
        async response => {
            const { body } = response;

            console.log('\n================================================\n');
            console.log(body);
            console.log('\n================================================\n');

            const { code, msg } = JSON.parse(body);
            if (code === 1) {
                await getSigninInfo(true);
            } else {
                $notify('唯品会', `签到失败！`, `${msg}`);
                console.log(
                    '\n================================================\n'
                );
                console.log(`签到失败：${msg}`);
                console.log(
                    '\n================================================\n'
                );
            }

            $done();
        },
        reason => {
            console.log('\n================================================\n');
            console.log(reason.error);
            console.log('\n================================================\n');
            $done();
        }
    );
}

// 获取签到信息
async function getSigninInfo(success) {
    const url = `${baseUrl}/info`;
    const reqBody = `source_app=app&client_type=wap&app_name=shop_iphone&client=iphone&api_key=8cec5243ade04ed3a02c5972bcda0d3f&app_version=7.80.6&mobile_platform=3&mobile_channel=ng00010v%3Aal80ssgp%3A37u8zn0w%3Ang00010p&mars_cid=4ebacdc8fa8581b4de693d82e5879e0f7aef9046&warehouse=VIP_NH&fdc_area_id=104102101107&province_id=104102101107&wap_consumer=B-1&bussCode=app_sign_in&openid=&time=0&is_front=1`;

    const myRequest = {
        url,
        method,
        headers,
        body: JSON.stringify(reqBody)
    };
    await $task.fetch(myRequest).then(
        async response => {
            let { body } = response;

            console.log('\n================================================\n');
            console.log(body);
            console.log('\n================================================\n');

            const {
                data: {
                    signInInfo: { todaySinged, cycleDays }
                }
            } = JSON.parse(body);
            if (todaySinged !== 1) {
                await getSignin();
            } else {
                if (success) {
                    $notify('唯品会', `签到成功！`, `已连续签到${cycleDays}天`);
                    console.log(`已连续签到${cycleDays}天`);
                } else {
                    $notify(
                        '唯品会',
                        `今日已签到！`,
                        `已连续签到${cycleDays}天`
                    );
                    console.log(`今日已签到！已连续签到${cycleDays}天`);
                }

                console.log(
                    '\n================================================\n'
                );
            }

            $done();
        },
        reason => {
            console.log('\n================================================\n');
            console.log(reason.error);
            console.log('\n================================================\n');

            $done();
        }
    );
}