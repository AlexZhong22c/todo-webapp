function addClass(e,r){hasClass(e,r)||(e.className=e.className?[e.className,r].join(" "):r)}function hasClass(e,r){var a=e.className;if(!a)return!1;for(var c=0,t=(a=a.split(/\s+/)).length;c<t;c++)if(a[c]===r)return!0;return!1}function isArray(e){return"object"==typeof e&&"[object Array]"===Object.prototype.toString.call(e)}function deleteInArray(e,r){if(isArray(e)&&r<e.length)return e.slice(0,r).concat(e.slice(r+1));console.error("not a arr or index error")}function compareNumbers(e,r){return e-r}function changeCode(e){return e=e.replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/"/g,"&quot;").replace(/'/g,"&#x27;").replace(/\//g,"&#x2f;")}function changeCode2(e){return e=e.replace(/&amp;/g,"&").replace(/&lt;/g,"<").replace(/&gt;/g,">").replace(/&quot;/g,'"').replace(/&#x27;/g,"'").replace(/&#x2f;/g,"/")}