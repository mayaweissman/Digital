//Search : 1220460, 

//Taboola - lead
_tfa.push({notify: 'event', name: 'lead', id: 1220460});
<img src='https://trc.taboola.com/1220460/log/3/unip?en=lead'
width='0' height='0' style='display:none'/>

//Taboola - convert
  window._tfa = window._tfa || [];
  window._tfa.push({notify: 'event', name: 'page_view', id: 1220460});
  !function (t, f, a, x) {
         if (!document.getElementById(x)) {
            t.async = 1;t.src = a;t.id=x;f.parentNode.insertBefore(t, f);
         }
  }(document.createElement('script'),
  document.getElementsByTagName('script')[0],
  '//cdn.taboola.com/libtrc/unip/1220460/tfa.js',
  'tb_tfa_script');
  <img src='https://trc.taboola.com/1220460/log/3/unip?en=page_view'
      width='0' height='0' style='display:none'/>

      //Google lead 
      gtag('event', 'conversion', {'send_to': 'AW-937029628/wUo6CPC21NsBEPzf574D'});

      //Google paint

  window.dataLayer = window.dataLayer || [];
  function gtag(){dataLayer.push(arguments);}
  gtag('js', new Date());

  gtag('config', 'AW-937029628');



  !function(_window, _document) {
    var OB_ADV_ID='00d398e3d185015db6788a9f7b179b6d94';
    if (_window.obApi) {var toArray = function(object) {return Object.prototype.toString.call(object) === '[object Array]' ? object : [object];};_window.obApi.marketerId = toArray(_window.obApi.marketerId).concat(toArray(OB_ADV_ID));return;}
    var api = _window.obApi = function() {api.dispatch ? api.dispatch.apply(api, arguments) : api.queue.push(arguments);};api.version = '1.1';api.loaded = true;api.marketerId = OB_ADV_ID;api.queue = [];var tag = _document.createElement('script');tag.async = true;tag.src = '//amplify.outbrain.com/cp/obtp.js';tag.type = 'text/javascript';var script = _document.getElementsByTagName('script')[0];script.parentNode.insertBefore(tag, script);}(window, document);
obApi('track', 'PAGE_VIEW');



!function(f,b,e,v,n,t,s)
{if(f.fbq)return;n=f.fbq=function(){n.callMethod?
n.callMethod.apply(n,arguments):n.queue.push(arguments)};
if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
n.queue=[];t=b.createElement(e);t.async=!0;
t.src=v;s=b.getElementsByTagName(e)[0];
s.parentNode.insertBefore(t,s)}(window, document,'script',
'https://connect.facebook.net/en_US/fbevents.js');
fbq('init', '1297788910418635');
fbq('track', 'PageView');
