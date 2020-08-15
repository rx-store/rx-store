(window.webpackJsonp=window.webpackJsonp||[]).push([[12],{67:function(e,t,n){"use strict";n.r(t),n.d(t,"frontMatter",(function(){return c})),n.d(t,"metadata",(function(){return i})),n.d(t,"rightToc",(function(){return s})),n.d(t,"default",(function(){return p}));var r=n(2),o=n(6),a=(n(0),n(99)),c={id:"manager",title:"<Manager />"},i={unversionedId:"react/api-reference/manager",id:"version-0.0.4/react/api-reference/manager",isDocsHomePage:!1,title:"<Manager />",description:"Wraps the children in the context provider, supplying",source:"@site/versioned_docs/version-0.0.4/react/api-reference/manager.md",permalink:"/rx-store/docs/react/api-reference/manager",editUrl:"https://github.com/rx-store/rx-store/tree/master/apps/rx-store-website/versioned_docs/version-0.0.4/react/api-reference/manager.md",version:"0.0.4",sidebar:"version-0.0.4/someSidebar",previous:{title:"store()",permalink:"/rx-store/docs/react/api-reference/store"},next:{title:"useStore()",permalink:"/rx-store/docs/react/api-reference/use-store"}},s=[{value:"Example 1 - A single Store",id:"example-1---a-single-store",children:[]},{value:"Example 2 - Dynamic / Multiple Child Stores",id:"example-2---dynamic--multiple-child-stores",children:[]}],l={rightToc:s};function p(e){var t=e.components,n=Object(o.a)(e,["components"]);return Object(a.b)("wrapper",Object(r.a)({},l,n,{components:t,mdxType:"MDXLayout"}),Object(a.b)("p",null,"Wraps the children in the context provider, supplying\nthe Rx store value, manages the root effect."),Object(a.b)("hr",null),Object(a.b)("p",null,"The ",Object(a.b)("inlineCode",{parentName:"p"},"<Manager />")," is returned from ",Object(a.b)("a",Object(r.a)({parentName:"p"},{href:"./store"}),"the store() factory"),". Wrap your app at the top level, or wrap the part of your app where you want the store to run & be available."),Object(a.b)("p",null,"If the ",Object(a.b)("inlineCode",{parentName:"p"},"Manager")," unmounts, the store's effect's will all be unsubscribed (torn down). To start out, it's recommended to use the ",Object(a.b)("inlineCode",{parentName:"p"},"Manager"),", at the top level of your app and re-export the context as ",Object(a.b)("inlineCode",{parentName:"p"},"rootContext"),"."),Object(a.b)("p",null,"This Manager must be mounted at most once per store instance. If your app tries to mount a second ",Object(a.b)("inlineCode",{parentName:"p"},"<Manager />")," for the same store instance, an error will be thrown. You can create stores dynamically as shown below in Example 2."),Object(a.b)("p",null,"When the Manager mounts, it subscribes to it's store's root effect, and provides a context\nallowing children components to subscribe to the streams in the\ncontext value, and emit onto the subjects. It also does some runtime validation checks that the effect you passed in returns a proper cleanup function."),Object(a.b)("p",null,Object(a.b)("strong",{parentName:"p"},"Props"),":"),Object(a.b)("p",null,"None."),Object(a.b)("h3",{id:"example-1---a-single-store"},"Example 1 - A single Store"),Object(a.b)("pre",null,Object(a.b)("code",Object(r.a)({parentName:"pre"},{className:"language-jsx"}),'import { Provider } from "@rx-store/react-rx-store";\nconst storeValue = { $foo: new Subject() };\nconst { Manager, context } = store(storeValue);\nexport const rootContext = context;\n\n<Manager>\n  <ComponentThatUsesRxStore />\n</Manager>;\n')),Object(a.b)("h3",{id:"example-2---dynamic--multiple-child-stores"},"Example 2 - Dynamic / Multiple Child Stores"),Object(a.b)("pre",null,Object(a.b)("code",Object(r.a)({parentName:"pre"},{className:"language-jsx"}),"const childEffect = (i) => (value) => {\n  const subscription = value.child$.subscribe((value) =>\n    console.log(`child ${i} received child value ${value}`)\n  );\n  const subscription = value.parent$.subscribe((value) =>\n    console.log(`child ${i} received parent value ${value}`)\n  );\n  return () => subscription.unsubscribe();\n};\n\nconst childValue = (parentStore, i) => ({\n  parent$: parentStore.count$,\n  foo$: interval(1000 * (i + 1)),\n});\n\nconst Child = ({ i }) => {\n  // use the parent store\n  const rootStore = useStore(parentContext);\n\n  // create a child store, which knows its index & has a\n  // access to a subject provided by the parent store\n  const { Manager } = useMemo(\n    () => store(childValue(rootStore, i), childEffect(i)),\n    [i, rootStore]\n  );\n\n  // Each child must mount its [dynamically created]\n  // Manager exactly once!\n  return (\n    <Manager>\n      child {i}\n      <hr />\n    </Manager>\n  );\n};\n")))}p.isMDXComponent=!0},99:function(e,t,n){"use strict";n.d(t,"a",(function(){return u})),n.d(t,"b",(function(){return m}));var r=n(0),o=n.n(r);function a(e,t,n){return t in e?Object.defineProperty(e,t,{value:n,enumerable:!0,configurable:!0,writable:!0}):e[t]=n,e}function c(e,t){var n=Object.keys(e);if(Object.getOwnPropertySymbols){var r=Object.getOwnPropertySymbols(e);t&&(r=r.filter((function(t){return Object.getOwnPropertyDescriptor(e,t).enumerable}))),n.push.apply(n,r)}return n}function i(e){for(var t=1;t<arguments.length;t++){var n=null!=arguments[t]?arguments[t]:{};t%2?c(Object(n),!0).forEach((function(t){a(e,t,n[t])})):Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(n)):c(Object(n)).forEach((function(t){Object.defineProperty(e,t,Object.getOwnPropertyDescriptor(n,t))}))}return e}function s(e,t){if(null==e)return{};var n,r,o=function(e,t){if(null==e)return{};var n,r,o={},a=Object.keys(e);for(r=0;r<a.length;r++)n=a[r],t.indexOf(n)>=0||(o[n]=e[n]);return o}(e,t);if(Object.getOwnPropertySymbols){var a=Object.getOwnPropertySymbols(e);for(r=0;r<a.length;r++)n=a[r],t.indexOf(n)>=0||Object.prototype.propertyIsEnumerable.call(e,n)&&(o[n]=e[n])}return o}var l=o.a.createContext({}),p=function(e){var t=o.a.useContext(l),n=t;return e&&(n="function"==typeof e?e(t):i(i({},t),e)),n},u=function(e){var t=p(e.components);return o.a.createElement(l.Provider,{value:t},e.children)},b={inlineCode:"code",wrapper:function(e){var t=e.children;return o.a.createElement(o.a.Fragment,{},t)}},d=o.a.forwardRef((function(e,t){var n=e.components,r=e.mdxType,a=e.originalType,c=e.parentName,l=s(e,["components","mdxType","originalType","parentName"]),u=p(n),d=r,m=u["".concat(c,".").concat(d)]||u[d]||b[d]||a;return n?o.a.createElement(m,i(i({ref:t},l),{},{components:n})):o.a.createElement(m,i({ref:t},l))}));function m(e,t){var n=arguments,r=t&&t.mdxType;if("string"==typeof e||r){var a=n.length,c=new Array(a);c[0]=d;var i={};for(var s in t)hasOwnProperty.call(t,s)&&(i[s]=t[s]);i.originalType=e,i.mdxType="string"==typeof e?e:r,c[1]=i;for(var l=2;l<a;l++)c[l]=n[l];return o.a.createElement.apply(null,c)}return o.a.createElement.apply(null,n)}d.displayName="MDXCreateElement"}}]);