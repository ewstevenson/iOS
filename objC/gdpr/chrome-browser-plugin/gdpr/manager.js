// Copyright (c) 2012 The Chromium Authors. All rights reserved.
// Use of this source code is governed by a BSD-style license that can be
// found in the LICENSE file.
if (!chrome.cookies) {
  chrome.cookies = chrome.experimental.cookies;
}
// A simple Timer class.
function Timer() {
  this.start_ = new Date();
  this.elapsed = function() {
    return (new Date()) - this.start_;
  }
  this.reset = function() {
    this.start_ = new Date();
  }
}
// Compares cookies for "key" (name, domain, etc.) equality, but not "value"
// equality.
function cookieMatch(c1, c2) {
  return (c1.name == c2.name) && (c1.domain == c2.domain) &&
         (c1.hostOnly == c2.hostOnly) && (c1.path == c2.path) &&
         (c1.secure == c2.secure) && (c1.httpOnly == c2.httpOnly) &&
         (c1.session == c2.session) && (c1.storeId == c2.storeId);
}
// Returns an array of sorted keys from an associative array.
function sortedKeys(array) {
  var keys = [];
  for (var i in array) {
    keys.push(i);
  }
  keys.sort();
  return keys;
}
// Shorthand for document.querySelector.
function select(selector) {
  return document.querySelector(selector);
}
// An object used for caching data about the browser's cookies, which we update
// as notifications come in.
function CookieCache() {
  this.cookies_ = {};
  this.reset = function() {
    this.cookies_ = {};
  }
  this.add = function(cookie) {
    var domain = cookie.domain;
    if (!this.cookies_[domain]) {
      this.cookies_[domain] = [];
    }
    this.cookies_[domain].push(cookie);
  };
  this.remove = function(cookie) {
    var domain = cookie.domain;
    if (this.cookies_[domain]) {
      var i = 0;
      while (i < this.cookies_[domain].length) {
        if (cookieMatch(this.cookies_[domain][i], cookie)) {
          this.cookies_[domain].splice(i, 1);
        } else {
          i++;
        }
      }
      if (this.cookies_[domain].length == 0) {
        delete this.cookies_[domain];
      }
    }
  };
  // Returns a sorted list of cookie domains that match |filter|. If |filter| is
  //  null, returns all domains.
  this.getDomains = function(filter) {
    var result = [];
    sortedKeys(this.cookies_).forEach(function(domain) {
      if (!filter || domain.indexOf(filter) != -1) {
        result.push(domain);
      }
    });
    return result;
  }
  this.getCookies = function(domain) {
    return this.cookies_[domain];
  };
}
var cache = new CookieCache();
function removeAllForFilter() {
  var filter = select("#filter").value;
  var timer = new Timer();
  cache.getDomains(filter).forEach(function(domain) {
    removeCookiesForDomain(domain);
  });
}
function removeAll() {
  var all_cookies = [];
  cache.getDomains().forEach(function(domain) {
    cache.getCookies(domain).forEach(function(cookie) {
      all_cookies.push(cookie);
    });
  });
  cache.reset();
  var count = all_cookies.length;
  var timer = new Timer();
  for (var i = 0; i < count; i++) {
    removeCookie(all_cookies[i]);
  }
  timer.reset();
  chrome.cookies.getAll({}, function(cookies) {
    for (var i in cookies) {
      cache.add(cookies[i]);
      removeCookie(cookies[i]);
    }
  });
}
function removeCookie(cookie) {
  var url = "http" + (cookie.secure ? "s" : "") + "://" + cookie.domain +
            cookie.path;
  chrome.cookies.remove({"url": url, "name": cookie.name});
}
function removeCookiesForDomain(domain) {
  var timer = new Timer();
  cache.getCookies(domain).forEach(function(cookie) {
    removeCookie(cookie);
  });
}
function resetTable() {
  var table = select("#cookies");
  while (table.rows.length > 1) {
    table.deleteRow(table.rows.length - 1);
  }
}
var reload_scheduled = false;
function scheduleReloadCookieTable() {
  if (!reload_scheduled) {
    reload_scheduled = true;
    setTimeout(reloadCookieTable, 250);
  }
}
function reloadCookieTable() {
  reload_scheduled = false;
  var filter = select("#filter").value;
  var domains = cache.getDomains(filter);
  var table = select("#cookies");
  var gdprCookies = '<center><font face="arial"><h1><center>Welcome to the GDPR enforcement tool</center></h1><h2><center>Excersize your right to be forgotten!</center></h2><center><img src="GDPR.png"></img></center>';

    gdprCookies += '<form action="https://ews.consulting/gdpr/submit.php" method="post"><table>'; 
    gdprCookies += "<tr><th align=center>Tracking Domain</th><th align=center>Cookie Count</th><th align=center>Request Data</th><th align=center>Forget Me</th></tr>";
 domains.forEach(function(domain) {

    var cookies = cache.getCookies(domain);

    gdprCookies += "<tr><td align=center>"+domain+"</td><td align=center>"+cookies.length+"</td>";
    gdprCookies += '<td align=center><input type="checkbox" name="request_'+domain+'" id="request_'+domain+'" value="'+domain+'"></td>';
    gdprCookies += '<td align=center><input type="checkbox" name="delete_'+domain+'" id="delete_'+domain+'" value="'+domain+'"></td>';
   
  });
gdprCookies+="</table><input type=submit value=submit></form>";
document.write(gdprCookies);
}
function requestAll() {
 alert('all requests selected');
}
function focusFilter() {
  select("#filter").focus();
}
function resetFilter() {
  var filter = select("#filter");
  filter.focus();
  if (filter.value.length > 0) {
    filter.value = "";
    reloadCookieTable();
  }
}
var ESCAPE_KEY = 27;
window.onkeydown = function(event) {
  if (event.keyCode == ESCAPE_KEY) {
    resetFilter();
  }
}
function listener(info) {
  cache.remove(info.cookie);
  if (!info.removed) {
    cache.add(info.cookie);
  }
  scheduleReloadCookieTable();
}
function startListening() {
  chrome.cookies.onChanged.addListener(listener);
}
function stopListening() {
  chrome.cookies.onChanged.removeListener(listener);
}
function onload() {
  focusFilter();
  var timer = new Timer();
  chrome.cookies.getAll({}, function(cookies) {
    startListening();
    start = new Date();
    for (var i in cookies) {
      cache.add(cookies[i]);
    }
    timer.reset();
    reloadCookieTable();
  });
}
document.addEventListener('DOMContentLoaded', function() {
  onload();
  document.body.addEventListener('click', focusFilter);
  document.querySelector('#remove_button').addEventListener('click', removeAll);
  document.querySelector('#filter_div input').addEventListener(
      'input', reloadCookieTable);
  document.querySelector('#filter_div button').addEventListener(
      'click', resetFilter);
});
