(window.webpackJsonp=window.webpackJsonp||[]).push([[17],{72:function(e,t,r){"use strict";r.r(t),r.d(t,"frontMatter",(function(){return i})),r.d(t,"metadata",(function(){return c})),r.d(t,"rightToc",(function(){return s})),r.d(t,"default",(function(){return u}));var a=r(2),n=r(6),o=(r(0),r(92)),i={id:"getting-started",title:"Getting Started"},c={unversionedId:"core/introduction/getting-started",id:"core/introduction/getting-started",isDocsHomePage:!1,title:"Getting Started",description:"Rx Store is a reactive state management solution for frontend component libraries such as React &amp; Angular, allowing you to build your application's logic using RxJs. If you are not yet familiar with RxJs, the Fireship Youtube video is a great introduction!",source:"@site/docs/core/introduction/getting-started.md",permalink:"/rx-store/docs/core/introduction/getting-started",editUrl:"https://github.com/rx-store/rx-store/tree/master/apps/rx-store-website/docs/core/introduction/getting-started.md",sidebar:"core",previous:{title:"Installation",permalink:"/rx-store/docs/core/introduction/installation"},next:{title:"Store Value",permalink:"/rx-store/docs/core/basic-concepts/store-value"}},s=[],l={rightToc:s};function u(e){var t=e.components,r=Object(n.a)(e,["components"]);return Object(o.b)("wrapper",Object(a.a)({},l,r,{components:t,mdxType:"MDXLayout"}),Object(o.b)("p",null,"Rx Store is a reactive state management solution for frontend component libraries such as ",Object(o.b)("a",Object(a.a)({parentName:"p"},{href:"/rx-store/docs/react/react-installation"}),"React")," ","&"," ",Object(o.b)("a",Object(a.a)({parentName:"p"},{href:"/rx-store/docs/angular/angular"}),"Angular"),", allowing you to build your application's logic using ",Object(o.b)("a",Object(a.a)({parentName:"p"},{href:"https://rxjs.dev/"}),"RxJs"),". If you are not yet familiar with RxJs, ",Object(o.b)("a",Object(a.a)({parentName:"p"},{href:"https://www.youtube.com/watch?v=ewcoEYS85Co"}),"the Fireship Youtube video")," is a great introduction!"),Object(o.b)("hr",null),Object(o.b)("p",null,"Compared with most state management libraries, Rx Store:"),Object(o.b)("ul",null,Object(o.b)("li",{parentName:"ul"},"Is well suited to managing data that changes frequently or in complex ways over time."),Object(o.b)("li",{parentName:"ul"},"Is purpose built for real-time, modern event driven applications."),Object(o.b)("li",{parentName:"ul"},"Allows writing boilerplate free logic with pure functions ",Object(o.b)("a",Object(a.a)({parentName:"li"},{href:"https://rxjs.dev/guide/testing/marble-testing"}),"that are easily tested"),"."),Object(o.b)("li",{parentName:"ul"},"Introduces very few new concepts to learn beyond RxJS itself."),Object(o.b)("li",{parentName:"ul"},"Plays nicely with code splitting."),Object(o.b)("li",{parentName:"ul"},"Has dev tools allowing to visualize at a glance the high level data flow in your application.")),Object(o.b)("h1",{id:"basic-concepts"},"Basic Concepts"),Object(o.b)("p",null,"These are the key basic concepts in Rx Store, learning these concepts will give you a high level overview of how Rx Store works."),Object(o.b)("ul",null,Object(o.b)("li",{parentName:"ul"},"The ",Object(o.b)("a",Object(a.a)({parentName:"li"},{href:"../basic-concepts/store-value"}),"Store Value")," is an object where you define ",Object(o.b)("a",Object(a.a)({parentName:"li"},{href:"https://rxjs-dev.firebaseapp.com/guide/subject"}),"RxJS subjects")," for your application's events."),Object(o.b)("li",{parentName:"ul"},Object(o.b)("a",Object(a.a)({parentName:"li"},{href:"/rx-store/docs/core/basic-concepts/root-effect"}),"Effects")," are functions that encapsulate some unit of logic as an ",Object(o.b)("a",Object(a.a)({parentName:"li"},{href:"https://rxjs.dev/guide/observable"}),"observable"),", effects react to and emit events onto the subjects in your store value."),Object(o.b)("li",{parentName:"ul"},"The ",Object(o.b)("a",Object(a.a)({parentName:"li"},{href:"/rx-store/docs/core/basic-concepts/manager"}),"Store Manager")," manages the lifecycle of the effects and provide the store value to your components."),Object(o.b)("li",{parentName:"ul"},Object(o.b)("a",Object(a.a)({parentName:"li"},{href:"/rx-store/docs/core/basic-concepts/components"}),"Components")," can subscribe to, react to, and emit events onto the subjects in your store value.")),Object(o.b)("h1",{id:"additional-reading"},"Additional Reading"),Object(o.b)("ul",null,Object(o.b)("li",{parentName:"ul"},"Read up on ",Object(o.b)("a",Object(a.a)({parentName:"li"},{href:"/rx-store/docs/react/react"}),"basic usage of Rx Store with React")),Object(o.b)("li",{parentName:"ul"},"Read a ",Object(o.b)("a",Object(a.a)({parentName:"li"},{href:"/rx-store/docs/react/guides/counter"}),"tutorial on making a counter app with RxStore and React")),Object(o.b)("li",{parentName:"ul"},"Read up on ",Object(o.b)("a",Object(a.a)({parentName:"li"},{href:"/rx-store/docs/angular/angular"}),"using Rx Store with Angular")),Object(o.b)("li",{parentName:"ul"},"Read the ",Object(o.b)("a",Object(a.a)({parentName:"li"},{href:"/rx-store/docs/faq"}),'"frequently asked questions"')),Object(o.b)("li",{parentName:"ul"},"View the ",Object(o.b)("a",Object(a.a)({parentName:"li"},{href:"https://github.com/rx-store/rx-store"}),"source code and contribute"))))}u.isMDXComponent=!0},92:function(e,t,r){"use strict";r.d(t,"a",(function(){return b})),r.d(t,"b",(function(){return m}));var a=r(0),n=r.n(a);function o(e,t,r){return t in e?Object.defineProperty(e,t,{value:r,enumerable:!0,configurable:!0,writable:!0}):e[t]=r,e}function i(e,t){var r=Object.keys(e);if(Object.getOwnPropertySymbols){var a=Object.getOwnPropertySymbols(e);t&&(a=a.filter((function(t){return Object.getOwnPropertyDescriptor(e,t).enumerable}))),r.push.apply(r,a)}return r}function c(e){for(var t=1;t<arguments.length;t++){var r=null!=arguments[t]?arguments[t]:{};t%2?i(Object(r),!0).forEach((function(t){o(e,t,r[t])})):Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(r)):i(Object(r)).forEach((function(t){Object.defineProperty(e,t,Object.getOwnPropertyDescriptor(r,t))}))}return e}function s(e,t){if(null==e)return{};var r,a,n=function(e,t){if(null==e)return{};var r,a,n={},o=Object.keys(e);for(a=0;a<o.length;a++)r=o[a],t.indexOf(r)>=0||(n[r]=e[r]);return n}(e,t);if(Object.getOwnPropertySymbols){var o=Object.getOwnPropertySymbols(e);for(a=0;a<o.length;a++)r=o[a],t.indexOf(r)>=0||Object.prototype.propertyIsEnumerable.call(e,r)&&(n[r]=e[r])}return n}var l=n.a.createContext({}),u=function(e){var t=n.a.useContext(l),r=t;return e&&(r="function"==typeof e?e(t):c(c({},t),e)),r},b=function(e){var t=u(e.components);return n.a.createElement(l.Provider,{value:t},e.children)},p={inlineCode:"code",wrapper:function(e){var t=e.children;return n.a.createElement(n.a.Fragment,{},t)}},d=n.a.forwardRef((function(e,t){var r=e.components,a=e.mdxType,o=e.originalType,i=e.parentName,l=s(e,["components","mdxType","originalType","parentName"]),b=u(r),d=a,m=b["".concat(i,".").concat(d)]||b[d]||p[d]||o;return r?n.a.createElement(m,c(c({ref:t},l),{},{components:r})):n.a.createElement(m,c({ref:t},l))}));function m(e,t){var r=arguments,a=t&&t.mdxType;if("string"==typeof e||a){var o=r.length,i=new Array(o);i[0]=d;var c={};for(var s in t)hasOwnProperty.call(t,s)&&(c[s]=t[s]);c.originalType=e,c.mdxType="string"==typeof e?e:a,i[1]=c;for(var l=2;l<o;l++)i[l]=r[l];return n.a.createElement.apply(null,i)}return n.a.createElement.apply(null,r)}d.displayName="MDXCreateElement"}}]);