var pageSession = new ReactiveDict();

Template.Charts.rendered = function() {
  Session.set('activePage', 'charts');
};


Template.tvWidget.onRendered(function() {
  $.getScript('https://d33t3vvu2t2yu5.cloudfront.net/tv.js', function() {
      var cont = document.getElementById("tvChart");
      var hei = (cont.offsetWidth * 0.6) + "px";

      cont.setAttribute("style","display:block;height:" + hei);
      cont.style.height=hei;

      var c = new TradingView.widget({
        "autosize": true,
        "symbol": "NASDAQ:AAPL",
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
