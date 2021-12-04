const sheetData = {
  id: "",
  dataSheetName: "シート1",
};

/**
 * Qiitaからデータをスクレイピングして整形
 * @return {Object} - スクレピングデータ
 */
function getQiitaData() {
  const url = "https://qiita.com/";
  const content = UrlFetchApp.fetch(url).getContentText();
  const $ = Cheerio.load(content);
  const trendData = [];
  $("div[id^='HomeArticleTrendFeed-react-component'] article").each((i,v)=>{
    if(i===0) return;
    const _$ = Cheerio.load(v);
    const scraping_data = {
      name: _$("header div p a").text(),
      /* 原因わからんのでスルー */
      postDate: _$("header div p time").attr("datetime"),
      title: _$("h2 a").text(),
      lgtm: _$("footer div div:nth-child(2) *:nth-child(2)").text(),
    };
    trendData.push(scraping_data);
  });
  return trendData;
}
/**
 * 引数のデータを書き込み
 * @params {Object} data - スクレイピングしたデータ
 */
function writeQiitaData(data){
  const sheets = SpreadsheetApp.openById(sheetData.id);
  const sheet = sheets.getSheetByName(sheetData.dataSheetName);
  const startRow = 2;
  const endRow = data.length + startRow - 1;
  const writeData = data.map(item=>{
    const {postDate,title,name,lgtm} = item;
    return [formatDate(new Date(postDate)),title,name.substr(1),lgtm];
  });
  console.log(writeData);
  sheet.getRange(`A${startRow}:D${endRow}`).setValues(writeData)
}
/**
 * 定期実行とか用
 */
function qiitaCall(){
  const data = getQiitaData();
  console.log(data);
  writeQiitaData(data);
}
/**
 * スプレッドシートからデータを取得
 * @return {Object} - シートデータをJSON型で返す
 */
function getSheetData(){

  const sheets = SpreadsheetApp.openById(sheetData.id);
  const sheet = sheets.getSheetByName(sheetData.dataSheetName);
  const getRawData = sheet.getDataRange().getValues();

  const returnDataJSON = {};
  returnDataJSON.data = getRawData.slice(1).map(item=>{
    return {
      postDate: formatDate(item[0]),
      title: item[1],
      name: item[2],
      lgtm: item[3]
    }
  });
  return {returnDataJSON};
}

/**
 * doGet関数 - Webアクセス時のトリガー
 * urlの後に"?dev=true"であればdeveloper用のHTMLが呼び出される
 * @params {Object} e - doGetのrequest
 */
const doGet = (e) => HtmlService.createTemplateFromFile(e.parameter.dev === "true" ? "develop" : "product").evaluate();

/**
 * 別のhtmlを呼び出す際に使用する呼び出し関数
 * 例：<?!= include("footer"); ?>
 * 例：<?!= include("script.js"); ?>
 *
 * @params {String} filename - ファイル名
 */
const include = (filename) => HtmlService.createHtmlOutputFromFile(filename).getContent();

/**
 * スプレッドシートのデータを整形してJSONで返す
 *
 * @return {Object} - 任意に整形したデータ（json）
 */
const getData = () => {
  const sheetData = {
    id: "",
    dataSheetName: "",
  };
  const sheets = SpreadsheetApp.openById(sheetData.id);
  const sheet = sheets.getSheetByName(sheetData.dataSheetName);
  const data = sheet.getDataRange().getValues();
  return {data};
}

/**
 * Date型のオブジェクトをフォーマットする
 * google提供のUtilitiesを用いる
 * https://developers.google.com/apps-script/reference/utilities/utilities#formatdatedate,-timezone,-format
 *
 * @params {Object} date - Date型のオブジェクト
 * @params {String} format - SimpleDateFormatで定義されている(https://docs.oracle.com/javase/7/docs/api/java/text/SimpleDateFormat.html)任意のフォーマット形式
 * @return {String} - フォーマット後の日付
 */
const formatDate = (date,format="yyyy/MM/dd HH:mm") => Utilities.formatDate(date,"JST",format);
