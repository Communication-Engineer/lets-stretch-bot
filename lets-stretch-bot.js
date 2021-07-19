/* 参考
    * https://qiita.com/saba_can00/items/ae753995955a57e7b41b
*/
function letsStretchBot() {
    const webhookUrl = getWebhookURL();
    const stretch = getStretchMenu();

    postToSlack(stretch, webhookUrl);
}

function getWebhookURL() {
    return "" //ここにSlack ワークフローのウェブリクエストURL を記載
}

function getStretchMenu() {
    const spreadSheet = SpreadsheetApp.openById("11gVauC2W5g6W_3devWltEJC6xh5bCHfDK1OtRdRLS9Y");
    const sheet = spreadSheet.getSheetByName("Stretch");

    const firstRow = 2;
    const lastRow = sheet.getLastRow();

    const rowIndex = getRandomIntInclusive(firstRow, lastRow);

    const colIndex = 1;

    return sheet.getRange(rowIndex, colIndex).getValue();
}

/* 参考
    * https://developer.mozilla.org/ja/docs/Web/JavaScript/Reference/Global_Objects/Math/random
*/
function getRandomInt(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);

    return Math.floor(Math.random() * (max - min) + min); //The maximum is exclusive and the minimum is inclusive
}

function postToSlack(stretch, webhookUrl) {

    let body = {
        "stretch": stretch
    };

    let params = {
        method: "post",
        contentType: "application/json",
        payload: JSON.stringify(body)
    };

    return UrlFetchApp.fetch(webhookUrl, params);
}

function setTrigger() {
    const today = new Date();
    var day_of_today = today.getDay(); // Sunday - Saturday : 0 - 6

    //24h
    const start_trigger = 8;
    const end_trigger = 22;
    const trigger_interval = 2;

    //平日だけ実行したい
    if (day_of_today == 0 || day_of_today == 6) {

        return console.log("休日なので処理を終了します。");

    } else {

        delTrigger("letsStretchBot");

        for (let time_counter = start_trigger + trigger_interval; time_counter < end_trigger; time_counter + trigger_interval) {

        today.setHours(time_counter);
        today.setMinutes(00);

        ScriptApp.newTrigger("letsStretchBot").timeBased().at(today).create();
        time_counter = time_counter + trigger_interval;
        }

        return console.log("トリガーセット完了しました。");
    }
}

function delTrigger(function_name) {

    const triggers = ScriptApp.getProjectTriggers();

    for (const trigger of triggers) {
        if (trigger.getHandlerFunction() == function_name) {

        ScriptApp.deleteTrigger(trigger);
        }
    }

    return;
}

function setup() {
    const today = new Date();

    delTrigger("setTrigger");

    today.setHours(01);
    today.setMinutes(00);

    ScriptApp.newTrigger("letsStretchBot").timeBased().everyDay().create();

    return console.log("セットアップが完了しました。");
}