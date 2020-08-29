(window.webpackJsonp=window.webpackJsonp||[]).push([[19],{74:function(e,t,n){"use strict";n.r(t),n.d(t,"frontMatter",(function(){return i})),n.d(t,"metadata",(function(){return c})),n.d(t,"rightToc",(function(){return s})),n.d(t,"default",(function(){return l}));var r=n(2),o=n(6),a=(n(0),n(92)),i={id:"control-when-effects-run",title:"Control when effects run"},c={unversionedId:"core/guides/control-when-effects-run",id:"core/guides/control-when-effects-run",isDocsHomePage:!1,title:"Control when effects run",description:"Effects are just functions which return observables. Rx Store subscribes to your effects in the store's manager. The logic in your observable will not run until the manager subscribes, just like a function does not do any work until called, and a component does nothing until rendered in a UI library.",source:"@site/docs/core/guides/control-when-effects-run.md",permalink:"/rx-store/docs/core/guides/control-when-effects-run",editUrl:"https://github.com/rx-store/rx-store/tree/master/apps/rx-store-website/docs/core/guides/control-when-effects-run.md",sidebar:"core",previous:{title:"Trigger subjects",permalink:"/rx-store/docs/core/guides/trigger-subjects"}},s=[],u={rightToc:s};function l(e){var t=e.components,n=Object(o.a)(e,["components"]);return Object(a.b)("wrapper",Object(r.a)({},u,n,{components:t,mdxType:"MDXLayout"}),Object(a.b)("p",null,"Effects are just functions which return observables. Rx Store ",Object(a.b)("a",Object(r.a)({parentName:"p"},{href:"https://rxjs-dev.firebaseapp.com/guide/subscription"}),"subscribes")," to your effects in the ",Object(a.b)("a",Object(r.a)({parentName:"p"},{href:"/rx-store/docs/core/basic-concepts/manager"}),"store's manager.")," The logic in your observable will not run until the ",Object(a.b)("a",Object(r.a)({parentName:"p"},{href:"/rx-store/docs/core/basic-concepts/manager"}),"manager")," subscribes, just like a function does not do any work until called, and a component does nothing until rendered in a UI library."),Object(a.b)("p",null,"Effects are long lived, until your store is torn down & disposed of. You can use filtering operators in RxJS such as ",Object(a.b)("inlineCode",{parentName:"p"},"skipWhile()"),", ",Object(a.b)("inlineCode",{parentName:"p"},"takeUntil()")," to use other streams in the store to control & limit when & how your effect does work."),Object(a.b)("p",null,'In a video game, you might have a "game loop" effect wherein you subscribe to the latest ',Object(a.b)("inlineCode",{parentName:"p"},"x$"),", ",Object(a.b)("inlineCode",{parentName:"p"},"y$")," mouse position, and a stream of the latest ",Object(a.b)("inlineCode",{parentName:"p"},"click$"),". You might emit onto a stream of ",Object(a.b)("inlineCode",{parentName:"p"},"hit$")," & ",Object(a.b)("inlineCode",{parentName:"p"},"miss$")," depending on if the latest values on the ",Object(a.b)("inlineCode",{parentName:"p"},"x$"),", ",Object(a.b)("inlineCode",{parentName:"p"},"y$")," streams collide with any enemy positions at the points in time that the ",Object(a.b)("inlineCode",{parentName:"p"},"click$")," stream emitted values. Furthermore you might skip emitting these values while the ",Object(a.b)("inlineCode",{parentName:"p"},"ammo$")," stream has 0 values, by using RxJs operators such as ",Object(a.b)("a",Object(r.a)({parentName:"p"},{href:"https://rxjs-dev.firebaseapp.com/api/operators/takeUntil"}),"takeUntil")))}l.isMDXComponent=!0},92:function(e,t,n){"use strict";n.d(t,"a",(function(){return p})),n.d(t,"b",(function(){return d}));var r=n(0),o=n.n(r);function a(e,t,n){return t in e?Object.defineProperty(e,t,{value:n,enumerable:!0,configurable:!0,writable:!0}):e[t]=n,e}function i(e,t){var n=Object.keys(e);if(Object.getOwnPropertySymbols){var r=Object.getOwnPropertySymbols(e);t&&(r=r.filter((function(t){return Object.getOwnPropertyDescriptor(e,t).enumerable}))),n.push.apply(n,r)}return n}function c(e){for(var t=1;t<arguments.length;t++){var n=null!=arguments[t]?arguments[t]:{};t%2?i(Object(n),!0).forEach((function(t){a(e,t,n[t])})):Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(n)):i(Object(n)).forEach((function(t){Object.defineProperty(e,t,Object.getOwnPropertyDescriptor(n,t))}))}return e}function s(e,t){if(null==e)return{};var n,r,o=function(e,t){if(null==e)return{};var n,r,o={},a=Object.keys(e);for(r=0;r<a.length;r++)n=a[r],t.indexOf(n)>=0||(o[n]=e[n]);return o}(e,t);if(Object.getOwnPropertySymbols){var a=Object.getOwnPropertySymbols(e);for(r=0;r<a.length;r++)n=a[r],t.indexOf(n)>=0||Object.prototype.propertyIsEnumerable.call(e,n)&&(o[n]=e[n])}return o}var u=o.a.createContext({}),l=function(e){var t=o.a.useContext(u),n=t;return e&&(n="function"==typeof e?e(t):c(c({},t),e)),n},p=function(e){var t=l(e.components);return o.a.createElement(u.Provider,{value:t},e.children)},b={inlineCode:"code",wrapper:function(e){var t=e.children;return o.a.createElement(o.a.Fragment,{},t)}},f=o.a.forwardRef((function(e,t){var n=e.components,r=e.mdxType,a=e.originalType,i=e.parentName,u=s(e,["components","mdxType","originalType","parentName"]),p=l(n),f=r,d=p["".concat(i,".").concat(f)]||p[f]||b[f]||a;return n?o.a.createElement(d,c(c({ref:t},u),{},{components:n})):o.a.createElement(d,c({ref:t},u))}));function d(e,t){var n=arguments,r=t&&t.mdxType;if("string"==typeof e||r){var a=n.length,i=new Array(a);i[0]=f;var c={};for(var s in t)hasOwnProperty.call(t,s)&&(c[s]=t[s]);c.originalType=e,c.mdxType="string"==typeof e?e:r,i[1]=c;for(var u=2;u<a;u++)i[u]=n[u];return o.a.createElement.apply(null,i)}return o.a.createElement.apply(null,n)}f.displayName="MDXCreateElement"}}]);