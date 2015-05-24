var successURL = 'https://www.facebook.com/connect/login_success.html';
function onFacebookLogin() {
    console.log('on facebook login...')
    if (!localStorage.accessToken) {
        chrome.tabs.getAllInWindow(null, function(tabs) {
            for (var i = 0; i < tabs.length; i++) {
                if (tabs[i].url.indexOf(successURL) == 0) {
                    var params = tabs[i].url.split('#')[1];
                	access = params.split('&')[0].split('=')[1];
                    console.log(access);
                    localStorage.accessToken = access;
                    chrome.tabs.onUpdated.removeListener(onFacebookLogin);
                    chrome.tabs.remove(tabs[i].id, function (){
                        console.log(good);
                    });
                    return;
                }
            }
        });
    }
}
chrome.tabs.onUpdated.addListener(onFacebookLogin);



