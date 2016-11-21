var pageSession = new ReactiveDict();

Template.Charts.rendered = function() {
  Session.set('activePage', 'charts');
};


Template.tvWidget.onRendered(function() {

  $.getScript('https://d33t3vvu2t2yu5.cloudfront.net/tv.js', function() {
    
      var div = document.getElementById("tvChart");
      var h = (div.offsetWidth * 0.6) + "px";

      div.setAttribute("style","display:block;height:" + h);
      div.style.height = h;

      var c = new TradingView.widget({
        "autosize": true,
        "symbol": "KRAKEN:XBTEUR",
        "interval": "D",
        "timezone": "Etc/UTC",
        "theme": "White",
        "style": "1",
        "locale": "en",
        "toolbar_bg": "#f1f3f6",
        "enable_publishing": false,
        "allow_symbol_change": true,
        "hideideas": true,
        "container_id": "tvChart"
      });
    })
});
