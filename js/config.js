var config = {
    timeFormat: 'analogue', // Select the time format for the Clock on the homepage
    weather: {
        weatherAPIKey: 'ea3f8ebe279a4e080459a706e2133180', // API key taken from Openweathermap.org
        units: 'metric', // Units to display the weather information
        id: '2640729' // The default is Oxford, to change go to Openweathermap.org to find your City ID
    },
    news: {
        numberOfBbcArticles: 15, // Number of articles to take from the BBC RSS Feed
        numberOfDoverbroecksArticles: 5, // Number of articles to pull from the Doverbroecks website
        bbcUrl: "https://api.rss2json.com/v1/api.json?rss_url=http%3A%2F%2Ffeeds.bbci.co.uk%2Fnews%2Frss.xml",
        delay: 1200, // time in miliseconds for each headline to display on the dashboard (1000 = 1 second)
        scrollRate: 100, // Less time equals quicker scroll speed
        doverbroecksUrl:'https://www.doverbroecks.com/category/doverbroecks/' // Url to the D'overbroecks website

    },
    mail: {
        clientid: "338294178289-fdhuk9lqmgaatll67u30j9675t7mtpto.apps.googleusercontent.com", // API key for Gmail API
        whichInboxCount: 'INBOX', // Which email inbox should the email counter be taken from
        howManyEmails: 20, // How many emails should be shown on the mail page
    },
    calendar:{
      clientid:'338294178289-da0aqg7iipk7no86urg7udc5akghdpfg.apps.googleusercontent.com', // API key for Calendar API
        howManyEvents: 8, // How many events should be shown on the calendar page
    }

};
