/**
 * This part inject main chrome app in dom
 */
function addScript(scriptURL, onload) {
   var script = document.createElement('script');
   script.setAttribute("type", "application/javascript");
   script.setAttribute("src", scriptURL);
   if (onload) script.onload = onload;
   document.documentElement.appendChild(script);
}
function addScriptCss(scriptURL, onload) {
    var script = document.createElement('link');
    script.setAttribute("type", "text/css");
    script.setAttribute("href", scriptURL);
    script.setAttribute("rel", "stylesheet");
    if (onload) script.onload = onload;
    document.documentElement.appendChild(script);
};
addScript(chrome.extension.getURL("js/sweetalert.js"), function () {
    addScriptCss(chrome.extension.getURL("sweetalert.css"), function () {
        addScript(chrome.extension.getURL("js/shifted.js"), function () {
        });
    });
});
