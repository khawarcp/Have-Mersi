!function(){try{var e="undefined"!=typeof window?window:"undefined"!=typeof global?global:"undefined"!=typeof self?self:{},t=(new Error).stack;t&&(e._sentryDebugIds=e._sentryDebugIds||{},e._sentryDebugIds[t]="12fd21e0-8680-4cc5-a844-8d939d3dafe7",e._sentryDebugIdIdentifier="sentry-dbid-12fd21e0-8680-4cc5-a844-8d939d3dafe7")}catch(e){}}();var _global="undefined"!=typeof window?window:"undefined"!=typeof global?global:"undefined"!=typeof self?self:{};_global.SENTRY_RELEASE={id:"78c7f18"},function(){"use strict";function e(e,t){(null==t||t>e.length)&&(t=e.length);for(var n=0,r=new Array(t);n<t;n++)r[n]=e[n];return r}function t(t,n){return function(e){if(Array.isArray(e))return e}(t)||function(e,t){var n=null==e?null:"undefined"!=typeof Symbol&&e[Symbol.iterator]||e["@@iterator"];if(null!=n){var r,o,a,c,l=[],d=!0,i=!1;try{if(a=(n=n.call(e)).next,0===t){if(Object(n)!==n)return;d=!1}else for(;!(d=(r=a.call(n)).done)&&(l.push(r.value),l.length!==t);d=!0);}catch(e){i=!0,o=e}finally{try{if(!d&&null!=n.return&&(c=n.return(),Object(c)!==c))return}finally{if(i)throw o}}return l}}(t,n)||function(t,n){if(t){if("string"==typeof t)return e(t,n);var r=Object.prototype.toString.call(t).slice(8,-1);return"Object"===r&&t.constructor&&(r=t.constructor.name),"Map"===r||"Set"===r?Array.from(t):"Arguments"===r||/^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(r)?e(t,n):void 0}}(t,n)||function(){throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.")}()}!function(){var e,n=document.currentScript||(e=document.getElementsByTagName("script"))[e.length-1],r=function(e,n){try{var r=n.replace(/[\\[]/,"\\[").replace(/[\]]/,"\\]"),o=t(new RegExp("[\\?&]".concat(r,"=([^&#]*)")).exec("".concat(e)),2)[1];return null===o||"undefined"===o?"":decodeURIComponent(o.replace(/\+/g," "))}catch(e){return null}}("?".concat(n.src.replace(/^[^\\?]+\??/,"")),"shopId"),o="ps-sdk-loader",a="".concat("https://sdk.postscript.io","/sdk.bundle.js?shopId=").concat(r);if(document.getElementById(o))return null;var c=document.createElement("script");c.type="text/javascript",c.id=o,c.src=a,document.getElementsByTagName("head")[0].appendChild(c)}()}();
//# sourceMappingURL=sdk-script-loader.bundle.js.map