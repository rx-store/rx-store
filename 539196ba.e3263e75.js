(window.webpackJsonp=window.webpackJsonp||[]).push([[6],{158:function(e,t,n){"use strict";n.r(t),n.d(t,"frontMatter",(function(){return a})),n.d(t,"metadata",(function(){return c})),n.d(t,"rightToc",(function(){return i})),n.d(t,"default",(function(){return b}));var r=n(2),o=n(11),s=(n(0),n(177)),a={id:"effects",title:"Effects"},c={id:"basics/effects",isDocsHomePage:!1,title:"Effects",description:"Rx Store effects are simply functions that subscribe to RxJs subscriptions, and return functions to unsubscribe.",source:"@site/docs/basics/effects.md",permalink:"/rx-store/docs/basics/effects",editUrl:"https://github.com/rx-store/rx-store/edit/master/website/docs/basics/effects.md",sidebar:"someSidebar",previous:{title:"Observables",permalink:"/rx-store/docs/basics/observables"},next:{title:"Installation",permalink:"/rx-store/docs/react/react-installation"}},i=[{value:"Processing a stream of changes, and creating a stream of state",id:"processing-a-stream-of-changes-and-creating-a-stream-of-state",children:[]},{value:"Effects that manipulate time",id:"effects-that-manipulate-time",children:[]},{value:"Recursive effects",id:"recursive-effects",children:[]},{value:"Combining data producers in complex ways",id:"combining-data-producers-in-complex-ways",children:[]},{value:"Nesting multiple effects",id:"nesting-multiple-effects",children:[]},{value:"Other Examples",id:"other-examples",children:[{value:"Example 1",id:"example-1",children:[]},{value:"Example 2",id:"example-2",children:[]},{value:"Example 3",id:"example-3",children:[]}]}],l={rightToc:i};function b(e){var t=e.components,n=Object(o.a)(e,["components"]);return Object(s.b)("wrapper",Object(r.a)({},l,n,{components:t,mdxType:"MDXLayout"}),Object(s.b)("p",null,Object(s.b)("inlineCode",{parentName:"p"},"Rx Store")," effects are simply functions that subscribe to ",Object(s.b)("a",Object(r.a)({parentName:"p"},{href:"https://rxjs-dev.firebaseapp.com/guide/subscription"}),"RxJs subscriptions"),", and return functions to unsubscribe."),Object(s.b)("hr",null),Object(s.b)("p",null,"Each store has one root effect, and you may nest them, building a directed cyclic graph your data flows through, triggering side effects as they go!"),Object(s.b)("p",null,"Effects will normally produce side effects, or handle some cross cutting concern. Effects are long lived, until your store is torn down & disposed of. You can use filtering operators in RxJS such as ",Object(s.b)("inlineCode",{parentName:"p"},"skipWhile()"),", ",Object(s.b)("inlineCode",{parentName:"p"},"takeUntil()")," to use other streams in the store to control & limit when & how your effect does work."),Object(s.b)("h2",{id:"processing-a-stream-of-changes-and-creating-a-stream-of-state"},"Processing a stream of changes, and creating a stream of state"),Object(s.b)("p",null,"Here is an effect that subscribes to the ",Object(s.b)("inlineCode",{parentName:"p"},"counterChange$"),", each time it emits ",Object(s.b)("inlineCode",{parentName:"p"},"1")," or ",Object(s.b)("inlineCode",{parentName:"p"},"-1"),", it'll add that to an accumulator with a ",Object(s.b)("inlineCode",{parentName:"p"},"scan()")," operator, and emit the running total onto the ",Object(s.b)("inlineCode",{parentName:"p"},"count$")," subject. It returns a function that calls unsubscribe on the subscription:"),Object(s.b)("pre",null,Object(s.b)("code",Object(r.a)({parentName:"pre"},{className:"language-tsx"}),"export const effect = (store) => {\n  const subscription = store.counterChange$\n    .pipe(scan((acc, val) => acc + val, 0))\n    .subscribe((count) => store.count$.next(count));\n  return () => subscription.unsubscribe();\n};\n")),Object(s.b)("h2",{id:"effects-that-manipulate-time"},"Effects that manipulate time"),Object(s.b)("p",null,"Here is an effect that subscribes to the ",Object(s.b)("inlineCode",{parentName:"p"},"count$")," stream, it delays each value by one second, and logs them to console."),Object(s.b)("pre",null,Object(s.b)("code",Object(r.a)({parentName:"pre"},{className:"language-tsx"}),"export const effect = (store) => {\n  const subscription = store.count$.pipe(delay(1000)).subscribe((count) => {\n    console.log({ count });\n  });\n  return () => subscription.unsubscribe();\n};\n")),Object(s.b)("h2",{id:"recursive-effects"},"Recursive effects"),Object(s.b)("p",null,"Here is an effect that resets the count back to 1 with a 50% probability anytime it emits. Be careful not to create an infinite loop by having a stream recursively emit back onto itself with 100% probability, with no base case to stop it!"),Object(s.b)("pre",null,Object(s.b)("code",Object(r.a)({parentName:"pre"},{className:"language-tsx"}),"export const effect = (store) => {\n  const subscription = store.count$.subscribe((count) => {\n    if (Math.random() > 0.5 && count !== 1) {\n      store.count$.next(1);\n    }\n  });\n  return () => subscription.unsubscribe();\n};\n")),Object(s.b)("h2",{id:"combining-data-producers-in-complex-ways"},"Combining data producers in complex ways"),Object(s.b)("p",null,"We can subscribe directly to subjects, observables, or create combos and higher order streams by combining them and using creation operators such as ",Object(s.b)("inlineCode",{parentName:"p"},"merge()"),", ",Object(s.b)("inlineCode",{parentName:"p"},"combineLatest()"),", and higher order operators such as ",Object(s.b)("inlineCode",{parentName:"p"},"bufferWhen()"),":"),Object(s.b)("pre",null,Object(s.b)("code",Object(r.a)({parentName:"pre"},{className:"language-tsx"}),"export const effect = (store) => {\n  const subscription = merge(store.myClick$, store.yourClick$).subscribe(\n    (clickEvent) => {\n      console.log({ clickEvent });\n    }\n  );\n  return () => subscription.unsubscribe();\n};\n")),Object(s.b)("h2",{id:"nesting-multiple-effects"},"Nesting multiple effects"),Object(s.b)("p",null,"If you want multiple effects & subscriptions, it is up to you to nest them like so:"),Object(s.b)("pre",null,Object(s.b)("code",Object(r.a)({parentName:"pre"},{className:"language-tsx"}),"export const effect = (store) => {\n  const subscriptions = []\n  subscriptions.push(\n    store.count$.subscribe((count) => console.log({ count })),\n    store.count$.subscribe((count) => console.log({ count })),\n    store.count$.subscribe((count) => console.log({ count })),\n  });\n  return () => subscriptions.forEach(s => s.unsubscribe());\n};\n")),Object(s.b)("p",null,"Although you can also choose to do this declaratively, with RxJs!"),Object(s.b)("pre",null,Object(s.b)("code",Object(r.a)({parentName:"pre"},{className:"language-tsx"}),"export const effect = (store) => {\n  const subscription = merge(\n    ...new Array(3).fill(store.count$)\n  ).subscribe((count) => console.log({ count }));\n  return () => subscription.unsubscribe());\n};\n")),Object(s.b)("h2",{id:"other-examples"},"Other Examples"),Object(s.b)("h3",{id:"example-1"},"Example 1"),Object(s.b)("p",null,"Your effect will more commonly emit onto some other subject, for example you might often subscribe to a ",Object(s.b)("inlineCode",{parentName:"p"},"request$")," subject in your effect, and for each value emitted on that ",Object(s.b)("inlineCode",{parentName:"p"},"subject")," you might start a network request, and you might emit the responses onto a ",Object(s.b)("inlineCode",{parentName:"p"},"response$")," subject."),Object(s.b)("h3",{id:"example-2"},"Example 2"),Object(s.b)("p",null,'In a social network app you may have "trigger" effect, for example a ',Object(s.b)("inlineCode",{parentName:"p"},"refetchNewsFeed$")," subject, when the user scrolls up a value is emitted on this subject, which triggers an effect to fetch the latest news feed posts & emit them onto a ",Object(s.b)("inlineCode",{parentName:"p"},"newsFeedPost$")," subject, a stream of the latest news feed posts."),Object(s.b)("h3",{id:"example-3"},"Example 3"),Object(s.b)("p",null,'In a video game, you might have a "game loop" effect wherein you subscribe to the latest ',Object(s.b)("inlineCode",{parentName:"p"},"x$"),", ",Object(s.b)("inlineCode",{parentName:"p"},"y$")," mouse position, and a stream of the latest ",Object(s.b)("inlineCode",{parentName:"p"},"click$"),". You might emit onto a stream of ",Object(s.b)("inlineCode",{parentName:"p"},"hit$")," & ",Object(s.b)("inlineCode",{parentName:"p"},"miss$")," depending on if the latest values on the ",Object(s.b)("inlineCode",{parentName:"p"},"x$"),", ",Object(s.b)("inlineCode",{parentName:"p"},"y$")," streams collide with any enemy positions at the points in time that the ",Object(s.b)("inlineCode",{parentName:"p"},"click$")," stream emitted values. Furthermore you might skip emitting these values while the ",Object(s.b)("inlineCode",{parentName:"p"},"ammo$")," stream has 0 values, by using RxJs control flow operators such as ",Object(s.b)("a",Object(r.a)({parentName:"p"},{href:"https://rxjs-dev.firebaseapp.com/api/operators/takeUntil"}),"takeUntil")))}b.isMDXComponent=!0},177:function(e,t,n){"use strict";n.d(t,"a",(function(){return u})),n.d(t,"b",(function(){return f}));var r=n(0),o=n.n(r);function s(e,t,n){return t in e?Object.defineProperty(e,t,{value:n,enumerable:!0,configurable:!0,writable:!0}):e[t]=n,e}function a(e,t){var n=Object.keys(e);if(Object.getOwnPropertySymbols){var r=Object.getOwnPropertySymbols(e);t&&(r=r.filter((function(t){return Object.getOwnPropertyDescriptor(e,t).enumerable}))),n.push.apply(n,r)}return n}function c(e){for(var t=1;t<arguments.length;t++){var n=null!=arguments[t]?arguments[t]:{};t%2?a(Object(n),!0).forEach((function(t){s(e,t,n[t])})):Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(n)):a(Object(n)).forEach((function(t){Object.defineProperty(e,t,Object.getOwnPropertyDescriptor(n,t))}))}return e}function i(e,t){if(null==e)return{};var n,r,o=function(e,t){if(null==e)return{};var n,r,o={},s=Object.keys(e);for(r=0;r<s.length;r++)n=s[r],t.indexOf(n)>=0||(o[n]=e[n]);return o}(e,t);if(Object.getOwnPropertySymbols){var s=Object.getOwnPropertySymbols(e);for(r=0;r<s.length;r++)n=s[r],t.indexOf(n)>=0||Object.prototype.propertyIsEnumerable.call(e,n)&&(o[n]=e[n])}return o}var l=o.a.createContext({}),b=function(e){var t=o.a.useContext(l),n=t;return e&&(n="function"==typeof e?e(t):c(c({},t),e)),n},u=function(e){var t=b(e.components);return o.a.createElement(l.Provider,{value:t},e.children)},p={inlineCode:"code",wrapper:function(e){var t=e.children;return o.a.createElement(o.a.Fragment,{},t)}},m=o.a.forwardRef((function(e,t){var n=e.components,r=e.mdxType,s=e.originalType,a=e.parentName,l=i(e,["components","mdxType","originalType","parentName"]),u=b(n),m=r,f=u["".concat(a,".").concat(m)]||u[m]||p[m]||s;return n?o.a.createElement(f,c(c({ref:t},l),{},{components:n})):o.a.createElement(f,c({ref:t},l))}));function f(e,t){var n=arguments,r=t&&t.mdxType;if("string"==typeof e||r){var s=n.length,a=new Array(s);a[0]=m;var c={};for(var i in t)hasOwnProperty.call(t,i)&&(c[i]=t[i]);c.originalType=e,c.mdxType="string"==typeof e?e:r,a[1]=c;for(var l=2;l<s;l++)a[l]=n[l];return o.a.createElement.apply(null,a)}return o.a.createElement.apply(null,n)}m.displayName="MDXCreateElement"}}]);