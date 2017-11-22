var newsInterval = null;
var newsData = [];
var bbcNewsData = null;
var counter = null;
var bbcDone = false;
var dovDone = false;
var dictOfDoverbroecksItems = {};
var doverCount = 0;

function getContent(counter) {
    return newsData[counter][1];
}

/**
* Fades in and out the news headlines
* for the homepage and cycles through
* all the headlines.
*/

function changeNewsContent() {
    if( newsData == null){
      return;
    }
    $('#newsHeadlines').fadeOut(() => {
        $("#newsHeadlines").html(getContent(counter));
        $("#newsHeadlines").fadeIn(() => {
            counter++;
        });
    });
    if (counter >= config.news.numberOfBbcArticles+config.news.numberOfDoverbroecksArticles) {
        getNews();
        counter = 0;
    }
}

/**
* Ajax call runs to fetch bbc news rss
* feed using rss2json API then runs
*/

function getBbcNewsData(callback){
  $.ajax({
      type: 'GET',
      url: config.news.bbcUrl,
      success: function(data) {
          bbcNewsData = data.items.slice(0,config.news.numberOfBbcArticles);
          bbcDone = true;
          callback();
          }
  });
}

/**
* Main function that runs to get all
* news data and runs callback when
* all the data has been received.
*/

function getNews(callback) {
  getBbcNewsData(callback);
  getDoverbroecksNewsData(callback);
}

/**
* Sorts the news data from both sources into
* time order and appends it to a new array.
* The standard order is [[headline],[content],[time]].
*/

function populateNewsData(){
  for(i=0;i<bbcNewsData.length;i++){
    item = bbcNewsData[i];
    newsData.push([new Date(item.pubDate),item.title,item.content]);
  }
  for(key in dictOfDoverbroecksItems){
    item = dictOfDoverbroecksItems[key];
    newsData.push([item[1], item[0], item[2]]);
  }
  newsData = mergeSort(newsData);
}

/**
* Function which strings together all the Functions
* required to get the mainpage functioning.
*/

function newsMainPage(){
  if(!dovDone || !bbcDone){
    return;
  }
  populateNewsData();
  counter = 0;
  changeNewsContent();
  if(newsInterval==null){
    changeNewsContent()
    newsInterval = setInterval(changeNewsContent,1000*6);
  }
}

/**
* Function that strings together all the functions
* required to get the news detailed page to work.
* if the news is not finished being received then it exits.
*/

function newsDetailPage(){
  if(!dovDone || !bbcDone){
    return;
  }
  populateNewsData();
  var table = document.getElementById('newsTable');
  for(i=0; i < config.news.numberOfBbcArticles + config.news.numberOfDoverbroecksArticles;i++){
    var item = "item" + i.toString();
    var newsHeadline = table.insertRow();
    var headline = newsHeadline.insertCell();
    headline.id = item;
    document.getElementById(headline.id).className = 'HeadlineRow';
    var newsContent = table.insertRow();
    var content = newsContent.insertCell();
    content.id = item+"content";
    document.getElementById(content.id).className = 'ContentRow';
    newsHeadlineVar = newsData[i][1];
    newsContentVar = newsData[i][2];
    $("#"+item).html(newsHeadlineVar);
    $("#"+item+"content").html(newsContentVar);
  }
}

/**
* Gets the doverbroecks news data
* and scrapes it from the website.
*/


function getDoverbroecksNewsData(callback){
$.ajax({
  type:'GET',
  url:config.news.doverbroecksUrl,
  success: function(data){
    scrapeDoverbroecksNews(data,callback);
  }
});
}

/**
* Runs ajax call to get doverbroecks data
* and sorts the data into the standard format.
*/

function addDoverbroecksTimestamp(url,callback){
  function sortContent(data){
    parser = new DOMParser()
    htmlDoc = parser.parseFromString(data,'text/html')
    list = htmlDoc.getElementsByTagName('head')[0].getElementsByTagName('meta')
    for(i=0;i<list.length;i++){
      if( list[i].getAttribute('property') == 'article:published_time'){
        dictOfDoverbroecksItems[url][1] = new Date(list[i].getAttribute('content'));
        doverCount += 1
      }
      if( list[i].getAttribute('name') == 'twitter:description'){
        dictOfDoverbroecksItems[url][2] = list[i].getAttribute('content');
      }
    }
    if(doverCount == config.news.numberOfDoverbroecksArticles){
      dovDone = true;
      callback()
    }
  }
  $.ajax({
    type:'GET',
    url:url,
    success: sortContent
  });

}

/**
* Scrapes the data from the HTML to use put into the array
*/

function scrapeDoverbroecksNews(data,callback){

  parser = new DOMParser();
  htmlDoc = parser.parseFromString(data,'text/html');
  list = htmlDoc.getElementById('category-posts-7-internal');
  items = list.getElementsByTagName('li');
  for(i=0;i<config.news.numberOfDoverbroecksArticles;i++){
    atag = items[i].getElementsByTagName('a')[0]
    dictOfDoverbroecksItems[atag.href]= [atag.text, null, null ];
    addDoverbroecksTimestamp(atag.href,callback)
  }
}
