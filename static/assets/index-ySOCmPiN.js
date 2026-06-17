(function(){const t=document.createElement("link").relList;if(t&&t.supports&&t.supports("modulepreload"))return;for(const s of document.querySelectorAll('link[rel="modulepreload"]'))i(s);new MutationObserver(s=>{for(const n of s)if(n.type==="childList")for(const o of n.addedNodes)o.tagName==="LINK"&&o.rel==="modulepreload"&&i(o)}).observe(document,{childList:!0,subtree:!0});function e(s){const n={};return s.integrity&&(n.integrity=s.integrity),s.referrerPolicy&&(n.referrerPolicy=s.referrerPolicy),s.crossOrigin==="use-credentials"?n.credentials="include":s.crossOrigin==="anonymous"?n.credentials="omit":n.credentials="same-origin",n}function i(s){if(s.ep)return;s.ep=!0;const n=e(s);fetch(s.href,n)}})();let lt=class extends HTMLElement{static formAssociated=!0;static get observedAttributes(){return["width","height","label","variant","required"]}constructor(){super(),this._internals=this.attachInternals(),this.attachShadow({mode:"open"})}connectedCallback(){this._render(),this._applyDimensions(),this._bindEvents()}attributeChangedCallback(t,e,i){e!==i&&(t==="width"||t==="height"?this._applyDimensions():(this._render(),this._bindEvents()))}_getVariant(){return this.getAttribute("variant")||"outlined"}_render(){const t=this.getAttribute("label")||"",e=this.hasAttribute("required"),i=this._getVariant(),s={outlined:`
        .field-wrapper {
          position: relative;
          border-radius: 4px;
        }
        fieldset {
          position: absolute;
          inset: -5px 0 0 0;
          border: 1px solid rgba(0,0,0,0.23);
          border-radius: inherit;
          margin: 0;
          padding: 0 8px;
          pointer-events: none;
          transition: border-color 0.2s ease;
        }
        .field-wrapper:hover fieldset {
          border-color: rgba(0,0,0,0.87);
        }
        .field-wrapper:focus-within fieldset {
          border: 2px solid #1976d2;
        }
        legend {
          display: block;
          visibility: hidden;
          height: 11px;
          font-size: 0.75em;
          max-width: 0.01px;
          white-space: nowrap;
          padding: 0;
          transition: max-width 100ms cubic-bezier(0,0,0.2,1) 50ms;
          overflow: hidden;
        }
        legend span { padding: 0 5px; }
        .field-wrapper:focus-within legend,
        .field-wrapper.has-value legend {
          max-width: 100%;
        }
        input {
          padding: 16.5px 14px;
          background: transparent;
        }
        .floating-label {
          left: 14px;
          transform: translate(0, 16px) scale(1);
        }
        .field-wrapper:focus-within .floating-label,
        .field-wrapper.has-value .floating-label {
          transform: translate(0, -9px) scale(0.75);
          color: #1976d2;
          background: transparent;
          padding: 0 5px;
          left: 9px;
        }
      `,filled:`
        .field-wrapper {
          position: relative;
          border-radius: 4px 4px 0 0;
          background: rgba(0,0,0,0.06);
          transition: background 0.2s;
        }
        .field-wrapper:hover {
          background: rgba(0,0,0,0.09);
        }
        .field-wrapper:focus-within {
          background: rgba(0,0,0,0.09);
        }
        fieldset { display: none; }
        .underline {
          position: absolute;
          bottom: 0; left: 0; right: 0;
          height: 1px;
          background: rgba(0,0,0,0.42);
        }
        .underline::after {
          content: '';
          position: absolute;
          bottom: 0; left: 50%; right: 50%;
          height: 2px;
          background: #1976d2;
          transition: left 0.2s ease, right 0.2s ease;
        }
        .field-wrapper:focus-within .underline::after {
          left: 0; right: 0;
        }
        input {
          padding: 25px 12px 8px;
          background: transparent;
        }
        .floating-label {
          left: 12px;
          transform: translate(0, 16px) scale(1);
        }
        .field-wrapper:focus-within .floating-label,
        .field-wrapper.has-value .floating-label {
          transform: translate(0, 8px) scale(0.75);
          color: #1976d2;
        }
      `,standard:`
        .field-wrapper {
          position: relative;
        }
        fieldset { display: none; }
        .underline {
          position: absolute;
          bottom: 0; left: 0; right: 0;
          height: 1px;
          background: rgba(0,0,0,0.42);
        }
        .underline::after {
          content: '';
          position: absolute;
          bottom: 0; left: 50%; right: 50%;
          height: 2px;
          background: #1976d2;
          transition: left 0.2s ease, right 0.2s ease;
        }
        .field-wrapper:focus-within .underline::after {
          left: 0; right: 0;
        }
        input {
          padding: 4px 0 5px;
          background: transparent;
        }
        .floating-label {
          left: 0;
          transform: translate(0, 0px) scale(1);
        }
        .field-wrapper:focus-within .floating-label,
        .field-wrapper.has-value .floating-label {
          transform: translate(0, -15px) scale(0.75);
          color: #1976d2;
        }
      `};this.shadowRoot.innerHTML=`
      <style>
        :host {
          display: inline-flex;
          flex-direction: column;
          min-width: 200px;
          vertical-align: top;
          margin-top: 8px;
        }

        /* ── Reset base ── */
        *, *::before, *::after { box-sizing: border-box; }

        .field-wrapper {
          position: relative;
          cursor: text;
        }

        fieldset {
          margin: 0;
          padding: 0;
          border: none;
        }

        input {
          width: 100%;
          border: none;
          outline: none;
          font-size: 1rem;
          line-height: 1.4375em;
          letter-spacing: 0.00938em;
          color: rgba(0,0,0,0.87);
          display: block;
        }

        /* ── Label flotante ── */
        .floating-label {
          position: absolute;
          top: 0;
          transform-origin: left top;
          font-size: 1rem;
          line-height: 1.4375em;
          letter-spacing: 0.00938em;
          color: rgba(0,0,0,0.6);
          pointer-events: none;
          transition: color 200ms cubic-bezier(0,0,0.2,1) 0ms,
                      transform 200ms cubic-bezier(0,0,0.2,1) 0ms,
                      max-width 200ms cubic-bezier(0,0,0.2,1) 0ms;
          z-index: 1;
          white-space: nowrap;
        }

        .field-wrapper:hover .floating-label { color: rgba(0,0,0,0.87); }
        .field-wrapper:focus-within .floating-label { color: #1976d2; }

        ${s[i]||s.outlined}
      </style>

      <div class="field-wrapper">
        <fieldset aria-hidden="true">
          <legend><span>${t}${e?" *":""}</span></legend>
        </fieldset>
        <span class="floating-label">${t}${e?" *":""}</span>
        <input type="text" placeholder="" />
        ${i!=="outlined"?'<div class="underline"></div>':""}
      </div>
    `}_bindEvents(){const t=this.shadowRoot.querySelector(".field-wrapper"),e=this.shadowRoot.querySelector("input");if(!t||!e)return;const i=()=>{t.classList.toggle("has-value",!!e.value)};e.addEventListener("input",()=>{this._internals.setFormValue(e.value),i()}),i()}_applyDimensions(){this.style.width=this.getAttribute("width")||"",this.style.height=this.getAttribute("height")||""}get value(){return this.shadowRoot.querySelector("input")?.value??""}set value(t){const e=this.shadowRoot.querySelector("input");e&&(e.value=t,this._internals.setFormValue(t),this.shadowRoot.querySelector(".field-wrapper")?.classList.toggle("has-value",!!t))}};customElements.define("mui-text",lt);const R=globalThis,D=R.ShadowRoot&&(R.ShadyCSS===void 0||R.ShadyCSS.nativeShadow)&&"adoptedStyleSheets"in Document.prototype&&"replace"in CSSStyleSheet.prototype,j=Symbol(),W=new WeakMap;let st=class{constructor(t,e,i){if(this._$cssResult$=!0,i!==j)throw Error("CSSResult is not constructable. Use `unsafeCSS` or `css` instead.");this.cssText=t,this.t=e}get styleSheet(){let t=this.o;const e=this.t;if(D&&t===void 0){const i=e!==void 0&&e.length===1;i&&(t=W.get(e)),t===void 0&&((this.o=t=new CSSStyleSheet).replaceSync(this.cssText),i&&W.set(e,t))}return t}toString(){return this.cssText}};const ht=r=>new st(typeof r=="string"?r:r+"",void 0,j),dt=(r,...t)=>{const e=r.length===1?r[0]:t.reduce((i,s,n)=>i+(o=>{if(o._$cssResult$===!0)return o.cssText;if(typeof o=="number")return o;throw Error("Value passed to 'css' function must be a 'css' function result: "+o+". Use 'unsafeCSS' to pass non-literal values, but take care to ensure page security.")})(s)+r[n+1],r[0]);return new st(e,r,j)},pt=(r,t)=>{if(D)r.adoptedStyleSheets=t.map(e=>e instanceof CSSStyleSheet?e:e.styleSheet);else for(const e of t){const i=document.createElement("style"),s=R.litNonce;s!==void 0&&i.setAttribute("nonce",s),i.textContent=e.cssText,r.appendChild(i)}},F=D?r=>r:r=>r instanceof CSSStyleSheet?(t=>{let e="";for(const i of t.cssRules)e+=i.cssText;return ht(e)})(r):r;const{is:ct,defineProperty:ut,getOwnPropertyDescriptor:ft,getOwnPropertyNames:gt,getOwnPropertySymbols:$t,getPrototypeOf:bt}=Object,N=globalThis,K=N.trustedTypes,mt=K?K.emptyScript:"",_t=N.reactiveElementPolyfillSupport,S=(r,t)=>r,k={toAttribute(r,t){switch(t){case Boolean:r=r?mt:null;break;case Object:case Array:r=r==null?r:JSON.stringify(r)}return r},fromAttribute(r,t){let e=r;switch(t){case Boolean:e=r!==null;break;case Number:e=r===null?null:Number(r);break;case Object:case Array:try{e=JSON.parse(r)}catch{e=null}}return e}},q=(r,t)=>!ct(r,t),Z={attribute:!0,type:String,converter:k,reflect:!1,useDefault:!1,hasChanged:q};Symbol.metadata??=Symbol("metadata"),N.litPropertyMetadata??=new WeakMap;let w=class extends HTMLElement{static addInitializer(t){this._$Ei(),(this.l??=[]).push(t)}static get observedAttributes(){return this.finalize(),this._$Eh&&[...this._$Eh.keys()]}static createProperty(t,e=Z){if(e.state&&(e.attribute=!1),this._$Ei(),this.prototype.hasOwnProperty(t)&&((e=Object.create(e)).wrapped=!0),this.elementProperties.set(t,e),!e.noAccessor){const i=Symbol(),s=this.getPropertyDescriptor(t,i,e);s!==void 0&&ut(this.prototype,t,s)}}static getPropertyDescriptor(t,e,i){const{get:s,set:n}=ft(this.prototype,t)??{get(){return this[e]},set(o){this[e]=o}};return{get:s,set(o){const l=s?.call(this);n?.call(this,o),this.requestUpdate(t,l,i)},configurable:!0,enumerable:!0}}static getPropertyOptions(t){return this.elementProperties.get(t)??Z}static _$Ei(){if(this.hasOwnProperty(S("elementProperties")))return;const t=bt(this);t.finalize(),t.l!==void 0&&(this.l=[...t.l]),this.elementProperties=new Map(t.elementProperties)}static finalize(){if(this.hasOwnProperty(S("finalized")))return;if(this.finalized=!0,this._$Ei(),this.hasOwnProperty(S("properties"))){const e=this.properties,i=[...gt(e),...$t(e)];for(const s of i)this.createProperty(s,e[s])}const t=this[Symbol.metadata];if(t!==null){const e=litPropertyMetadata.get(t);if(e!==void 0)for(const[i,s]of e)this.elementProperties.set(i,s)}this._$Eh=new Map;for(const[e,i]of this.elementProperties){const s=this._$Eu(e,i);s!==void 0&&this._$Eh.set(s,e)}this.elementStyles=this.finalizeStyles(this.styles)}static finalizeStyles(t){const e=[];if(Array.isArray(t)){const i=new Set(t.flat(1/0).reverse());for(const s of i)e.unshift(F(s))}else t!==void 0&&e.push(F(t));return e}static _$Eu(t,e){const i=e.attribute;return i===!1?void 0:typeof i=="string"?i:typeof t=="string"?t.toLowerCase():void 0}constructor(){super(),this._$Ep=void 0,this.isUpdatePending=!1,this.hasUpdated=!1,this._$Em=null,this._$Ev()}_$Ev(){this._$ES=new Promise(t=>this.enableUpdating=t),this._$AL=new Map,this._$E_(),this.requestUpdate(),this.constructor.l?.forEach(t=>t(this))}addController(t){(this._$EO??=new Set).add(t),this.renderRoot!==void 0&&this.isConnected&&t.hostConnected?.()}removeController(t){this._$EO?.delete(t)}_$E_(){const t=new Map,e=this.constructor.elementProperties;for(const i of e.keys())this.hasOwnProperty(i)&&(t.set(i,this[i]),delete this[i]);t.size>0&&(this._$Ep=t)}createRenderRoot(){const t=this.shadowRoot??this.attachShadow(this.constructor.shadowRootOptions);return pt(t,this.constructor.elementStyles),t}connectedCallback(){this.renderRoot??=this.createRenderRoot(),this.enableUpdating(!0),this._$EO?.forEach(t=>t.hostConnected?.())}enableUpdating(t){}disconnectedCallback(){this._$EO?.forEach(t=>t.hostDisconnected?.())}attributeChangedCallback(t,e,i){this._$AK(t,i)}_$ET(t,e){const i=this.constructor.elementProperties.get(t),s=this.constructor._$Eu(t,i);if(s!==void 0&&i.reflect===!0){const n=(i.converter?.toAttribute!==void 0?i.converter:k).toAttribute(e,i.type);this._$Em=t,n==null?this.removeAttribute(s):this.setAttribute(s,n),this._$Em=null}}_$AK(t,e){const i=this.constructor,s=i._$Eh.get(t);if(s!==void 0&&this._$Em!==s){const n=i.getPropertyOptions(s),o=typeof n.converter=="function"?{fromAttribute:n.converter}:n.converter?.fromAttribute!==void 0?n.converter:k;this._$Em=s;const l=o.fromAttribute(e,n.type);this[s]=l??this._$Ej?.get(s)??l,this._$Em=null}}requestUpdate(t,e,i,s=!1,n){if(t!==void 0){const o=this.constructor;if(s===!1&&(n=this[t]),i??=o.getPropertyOptions(t),!((i.hasChanged??q)(n,e)||i.useDefault&&i.reflect&&n===this._$Ej?.get(t)&&!this.hasAttribute(o._$Eu(t,i))))return;this.C(t,e,i)}this.isUpdatePending===!1&&(this._$ES=this._$EP())}C(t,e,{useDefault:i,reflect:s,wrapped:n},o){i&&!(this._$Ej??=new Map).has(t)&&(this._$Ej.set(t,o??e??this[t]),n!==!0||o!==void 0)||(this._$AL.has(t)||(this.hasUpdated||i||(e=void 0),this._$AL.set(t,e)),s===!0&&this._$Em!==t&&(this._$Eq??=new Set).add(t))}async _$EP(){this.isUpdatePending=!0;try{await this._$ES}catch(e){Promise.reject(e)}const t=this.scheduleUpdate();return t!=null&&await t,!this.isUpdatePending}scheduleUpdate(){return this.performUpdate()}performUpdate(){if(!this.isUpdatePending)return;if(!this.hasUpdated){if(this.renderRoot??=this.createRenderRoot(),this._$Ep){for(const[s,n]of this._$Ep)this[s]=n;this._$Ep=void 0}const i=this.constructor.elementProperties;if(i.size>0)for(const[s,n]of i){const{wrapped:o}=n,l=this[s];o!==!0||this._$AL.has(s)||l===void 0||this.C(s,void 0,n,l)}}let t=!1;const e=this._$AL;try{t=this.shouldUpdate(e),t?(this.willUpdate(e),this._$EO?.forEach(i=>i.hostUpdate?.()),this.update(e)):this._$EM()}catch(i){throw t=!1,this._$EM(),i}t&&this._$AE(e)}willUpdate(t){}_$AE(t){this._$EO?.forEach(e=>e.hostUpdated?.()),this.hasUpdated||(this.hasUpdated=!0,this.firstUpdated(t)),this.updated(t)}_$EM(){this._$AL=new Map,this.isUpdatePending=!1}get updateComplete(){return this.getUpdateComplete()}getUpdateComplete(){return this._$ES}shouldUpdate(t){return!0}update(t){this._$Eq&&=this._$Eq.forEach(e=>this._$ET(e,this[e])),this._$EM()}updated(t){}firstUpdated(t){}};w.elementStyles=[],w.shadowRootOptions={mode:"open"},w[S("elementProperties")]=new Map,w[S("finalized")]=new Map,_t?.({ReactiveElement:w}),(N.reactiveElementVersions??=[]).push("2.1.2");const I=globalThis,J=r=>r,H=I.trustedTypes,G=H?H.createPolicy("lit-html",{createHTML:r=>r}):void 0,rt="$lit$",$=`lit$${Math.random().toFixed(9).slice(2)}$`,nt="?"+$,vt=`<${nt}>`,_=document,P=()=>_.createComment(""),O=r=>r===null||typeof r!="object"&&typeof r!="function",V=Array.isArray,yt=r=>V(r)||typeof r?.[Symbol.iterator]=="function",L=`[ 	
\f\r]`,E=/<(?:(!--|\/[^a-zA-Z])|(\/?[a-zA-Z][^>\s]*)|(\/?$))/g,Q=/-->/g,X=/>/g,b=RegExp(`>|${L}(?:([^\\s"'>=/]+)(${L}*=${L}*(?:[^ 	
\f\r"'\`<>=]|("|')|))|$)`,"g"),Y=/'/g,tt=/"/g,ot=/^(?:script|style|textarea|title)$/i,wt=r=>(t,...e)=>({_$litType$:r,strings:t,values:e}),et=wt(1),v=Symbol.for("lit-noChange"),p=Symbol.for("lit-nothing"),it=new WeakMap,m=_.createTreeWalker(_,129);function at(r,t){if(!V(r)||!r.hasOwnProperty("raw"))throw Error("invalid template strings array");return G!==void 0?G.createHTML(t):t}const At=(r,t)=>{const e=r.length-1,i=[];let s,n=t===2?"<svg>":t===3?"<math>":"",o=E;for(let l=0;l<e;l++){const a=r[l];let d,c,h=-1,f=0;for(;f<a.length&&(o.lastIndex=f,c=o.exec(a),c!==null);)f=o.lastIndex,o===E?c[1]==="!--"?o=Q:c[1]!==void 0?o=X:c[2]!==void 0?(ot.test(c[2])&&(s=RegExp("</"+c[2],"g")),o=b):c[3]!==void 0&&(o=b):o===b?c[0]===">"?(o=s??E,h=-1):c[1]===void 0?h=-2:(h=o.lastIndex-c[2].length,d=c[1],o=c[3]===void 0?b:c[3]==='"'?tt:Y):o===tt||o===Y?o=b:o===Q||o===X?o=E:(o=b,s=void 0);const g=o===b&&r[l+1].startsWith("/>")?" ":"";n+=o===E?a+vt:h>=0?(i.push(d),a.slice(0,h)+rt+a.slice(h)+$+g):a+$+(h===-2?l:g)}return[at(r,n+(r[e]||"<?>")+(t===2?"</svg>":t===3?"</math>":"")),i]};class U{constructor({strings:t,_$litType$:e},i){let s;this.parts=[];let n=0,o=0;const l=t.length-1,a=this.parts,[d,c]=At(t,e);if(this.el=U.createElement(d,i),m.currentNode=this.el.content,e===2||e===3){const h=this.el.content.firstChild;h.replaceWith(...h.childNodes)}for(;(s=m.nextNode())!==null&&a.length<l;){if(s.nodeType===1){if(s.hasAttributes())for(const h of s.getAttributeNames())if(h.endsWith(rt)){const f=c[o++],g=s.getAttribute(h).split($),M=/([.?@])?(.*)/.exec(f);a.push({type:1,index:n,name:M[2],strings:g,ctor:M[1]==="."?Et:M[1]==="?"?St:M[1]==="@"?Ct:z}),s.removeAttribute(h)}else h.startsWith($)&&(a.push({type:6,index:n}),s.removeAttribute(h));if(ot.test(s.tagName)){const h=s.textContent.split($),f=h.length-1;if(f>0){s.textContent=H?H.emptyScript:"";for(let g=0;g<f;g++)s.append(h[g],P()),m.nextNode(),a.push({type:2,index:++n});s.append(h[f],P())}}}else if(s.nodeType===8)if(s.data===nt)a.push({type:2,index:n});else{let h=-1;for(;(h=s.data.indexOf($,h+1))!==-1;)a.push({type:7,index:n}),h+=$.length-1}n++}}static createElement(t,e){const i=_.createElement("template");return i.innerHTML=t,i}}function A(r,t,e=r,i){if(t===v)return t;let s=i!==void 0?e._$Co?.[i]:e._$Cl;const n=O(t)?void 0:t._$litDirective$;return s?.constructor!==n&&(s?._$AO?.(!1),n===void 0?s=void 0:(s=new n(r),s._$AT(r,e,i)),i!==void 0?(e._$Co??=[])[i]=s:e._$Cl=s),s!==void 0&&(t=A(r,s._$AS(r,t.values),s,i)),t}class xt{constructor(t,e){this._$AV=[],this._$AN=void 0,this._$AD=t,this._$AM=e}get parentNode(){return this._$AM.parentNode}get _$AU(){return this._$AM._$AU}u(t){const{el:{content:e},parts:i}=this._$AD,s=(t?.creationScope??_).importNode(e,!0);m.currentNode=s;let n=m.nextNode(),o=0,l=0,a=i[0];for(;a!==void 0;){if(o===a.index){let d;a.type===2?d=new T(n,n.nextSibling,this,t):a.type===1?d=new a.ctor(n,a.name,a.strings,this,t):a.type===6&&(d=new Pt(n,this,t)),this._$AV.push(d),a=i[++l]}o!==a?.index&&(n=m.nextNode(),o++)}return m.currentNode=_,s}p(t){let e=0;for(const i of this._$AV)i!==void 0&&(i.strings!==void 0?(i._$AI(t,i,e),e+=i.strings.length-2):i._$AI(t[e])),e++}}class T{get _$AU(){return this._$AM?._$AU??this._$Cv}constructor(t,e,i,s){this.type=2,this._$AH=p,this._$AN=void 0,this._$AA=t,this._$AB=e,this._$AM=i,this.options=s,this._$Cv=s?.isConnected??!0}get parentNode(){let t=this._$AA.parentNode;const e=this._$AM;return e!==void 0&&t?.nodeType===11&&(t=e.parentNode),t}get startNode(){return this._$AA}get endNode(){return this._$AB}_$AI(t,e=this){t=A(this,t,e),O(t)?t===p||t==null||t===""?(this._$AH!==p&&this._$AR(),this._$AH=p):t!==this._$AH&&t!==v&&this._(t):t._$litType$!==void 0?this.$(t):t.nodeType!==void 0?this.T(t):yt(t)?this.k(t):this._(t)}O(t){return this._$AA.parentNode.insertBefore(t,this._$AB)}T(t){this._$AH!==t&&(this._$AR(),this._$AH=this.O(t))}_(t){this._$AH!==p&&O(this._$AH)?this._$AA.nextSibling.data=t:this.T(_.createTextNode(t)),this._$AH=t}$(t){const{values:e,_$litType$:i}=t,s=typeof i=="number"?this._$AC(t):(i.el===void 0&&(i.el=U.createElement(at(i.h,i.h[0]),this.options)),i);if(this._$AH?._$AD===s)this._$AH.p(e);else{const n=new xt(s,this),o=n.u(this.options);n.p(e),this.T(o),this._$AH=n}}_$AC(t){let e=it.get(t.strings);return e===void 0&&it.set(t.strings,e=new U(t)),e}k(t){V(this._$AH)||(this._$AH=[],this._$AR());const e=this._$AH;let i,s=0;for(const n of t)s===e.length?e.push(i=new T(this.O(P()),this.O(P()),this,this.options)):i=e[s],i._$AI(n),s++;s<e.length&&(this._$AR(i&&i._$AB.nextSibling,s),e.length=s)}_$AR(t=this._$AA.nextSibling,e){for(this._$AP?.(!1,!0,e);t!==this._$AB;){const i=J(t).nextSibling;J(t).remove(),t=i}}setConnected(t){this._$AM===void 0&&(this._$Cv=t,this._$AP?.(t))}}class z{get tagName(){return this.element.tagName}get _$AU(){return this._$AM._$AU}constructor(t,e,i,s,n){this.type=1,this._$AH=p,this._$AN=void 0,this.element=t,this.name=e,this._$AM=s,this.options=n,i.length>2||i[0]!==""||i[1]!==""?(this._$AH=Array(i.length-1).fill(new String),this.strings=i):this._$AH=p}_$AI(t,e=this,i,s){const n=this.strings;let o=!1;if(n===void 0)t=A(this,t,e,0),o=!O(t)||t!==this._$AH&&t!==v,o&&(this._$AH=t);else{const l=t;let a,d;for(t=n[0],a=0;a<n.length-1;a++)d=A(this,l[i+a],e,a),d===v&&(d=this._$AH[a]),o||=!O(d)||d!==this._$AH[a],d===p?t=p:t!==p&&(t+=(d??"")+n[a+1]),this._$AH[a]=d}o&&!s&&this.j(t)}j(t){t===p?this.element.removeAttribute(this.name):this.element.setAttribute(this.name,t??"")}}class Et extends z{constructor(){super(...arguments),this.type=3}j(t){this.element[this.name]=t===p?void 0:t}}class St extends z{constructor(){super(...arguments),this.type=4}j(t){this.element.toggleAttribute(this.name,!!t&&t!==p)}}class Ct extends z{constructor(t,e,i,s,n){super(t,e,i,s,n),this.type=5}_$AI(t,e=this){if((t=A(this,t,e,0)??p)===v)return;const i=this._$AH,s=t===p&&i!==p||t.capture!==i.capture||t.once!==i.once||t.passive!==i.passive,n=t!==p&&(i===p||s);s&&this.element.removeEventListener(this.name,this,i),n&&this.element.addEventListener(this.name,this,t),this._$AH=t}handleEvent(t){typeof this._$AH=="function"?this._$AH.call(this.options?.host??this.element,t):this._$AH.handleEvent(t)}}class Pt{constructor(t,e,i){this.element=t,this.type=6,this._$AN=void 0,this._$AM=e,this.options=i}get _$AU(){return this._$AM._$AU}_$AI(t){A(this,t)}}const Ot=I.litHtmlPolyfillSupport;Ot?.(U,T),(I.litHtmlVersions??=[]).push("3.3.2");const Ut=(r,t,e)=>{const i=e?.renderBefore??t;let s=i._$litPart$;if(s===void 0){const n=e?.renderBefore??null;i._$litPart$=s=new T(t.insertBefore(P(),n),n,void 0,e??{})}return s._$AI(r),s};const B=globalThis;let C=class extends w{constructor(){super(...arguments),this.renderOptions={host:this},this._$Do=void 0}createRenderRoot(){const t=super.createRenderRoot();return this.renderOptions.renderBefore??=t.firstChild,t}update(t){const e=this.render();this.hasUpdated||(this.renderOptions.isConnected=this.isConnected),super.update(t),this._$Do=Ut(e,this.renderRoot,this.renderOptions)}connectedCallback(){super.connectedCallback(),this._$Do?.setConnected(!0)}disconnectedCallback(){super.disconnectedCallback(),this._$Do?.setConnected(!1)}render(){return v}};C._$litElement$=!0,C.finalized=!0,B.litElementHydrateSupport?.({LitElement:C});const Tt=B.litElementPolyfillSupport;Tt?.({LitElement:C});(B.litElementVersions??=[]).push("4.2.2");const Mt=r=>(t,e)=>{e!==void 0?e.addInitializer(()=>{customElements.define(r,t)}):customElements.define(r,t)};const Rt={attribute:!0,type:String,converter:k,reflect:!1,hasChanged:q},kt=(r=Rt,t,e)=>{const{kind:i,metadata:s}=e;let n=globalThis.litPropertyMetadata.get(s);if(n===void 0&&globalThis.litPropertyMetadata.set(s,n=new Map),i==="setter"&&((r=Object.create(r)).wrapped=!0),n.set(e.name,r),i==="accessor"){const{name:o}=e;return{set(l){const a=t.get.call(this);t.set.call(this,l),this.requestUpdate(o,a,r,!0,l)},init(l){return l!==void 0&&this.C(o,void 0,r,l),l}}}if(i==="setter"){const{name:o}=e;return function(l){const a=this[o];t.call(this,l),this.requestUpdate(o,a,r,!0,l)}}throw Error("Unsupported decorator location: "+i)};function x(r){return(t,e)=>typeof e=="object"?kt(r,t,e):((i,s,n)=>{const o=s.hasOwnProperty(n);return s.constructor.createProperty(n,i),o?Object.getOwnPropertyDescriptor(s,n):void 0})(r,t,e)}function Ht(r){return x({...r,state:!0,attribute:!1})}const Nt={ATTRIBUTE:1},zt=r=>(...t)=>({_$litDirective$:r,values:t});class Lt{constructor(t){}get _$AU(){return this._$AM._$AU}_$AT(t,e,i){this._$Ct=t,this._$AM=e,this._$Ci=i}_$AS(t,e){return this.update(t,e)}update(t,e){return this.render(...e)}}const Dt=zt(class extends Lt{constructor(r){if(super(r),r.type!==Nt.ATTRIBUTE||r.name!=="class"||r.strings?.length>2)throw Error("`classMap()` can only be used in the `class` attribute and must be the only part in the attribute.")}render(r){return" "+Object.keys(r).filter(t=>r[t]).join(" ")+" "}update(r,[t]){if(this.st===void 0){this.st=new Set,r.strings!==void 0&&(this.nt=new Set(r.strings.join(" ").split(/\s/).filter(i=>i!=="")));for(const i in t)t[i]&&!this.nt?.has(i)&&this.st.add(i);return this.render(t)}const e=r.element.classList;for(const i of this.st)i in t||(e.remove(i),this.st.delete(i));for(const i in t){const s=!!t[i];s===this.st.has(i)||this.nt?.has(i)||(s?(e.add(i),this.st.add(i)):(e.remove(i),this.st.delete(i)))}return v}});var jt=Object.defineProperty,qt=Object.getOwnPropertyDescriptor,y=(r,t,e,i)=>{for(var s=i>1?void 0:i?qt(t,e):t,n=r.length-1,o;n>=0;n--)(o=r[n])&&(s=(i?o(t,e,s):o(s))||s);return i&&s&&jt(t,e,s),s};let u=class extends C{constructor(){super(),this.label="",this.variant="outlined",this.required=!1,this._hasValue=!1,this._internals=this.attachInternals()}updated(r){r.has("width")&&(this.style.width=this.width??""),r.has("height")&&(this.style.height=this.height??"")}_onInput(r){const t=r.target.value;this._internals.setFormValue(t),this._hasValue=!!t}get value(){return this.shadowRoot?.querySelector("input")?.value??""}set value(r){const t=this.shadowRoot?.querySelector("input");t&&(t.value=r,this._internals.setFormValue(r),this._hasValue=!!r)}render(){const r=`${this.label}${this.required?" *":""}`,t=this.variant!=="outlined",e={"field-wrapper":!0,[`variant-${this.variant}`]:!0,"has-value":this._hasValue};return et`
      <div class=${Dt(e)}>
        <fieldset aria-hidden="true">
          <legend><span>${r}</span></legend>
        </fieldset>

        <span class="floating-label">${r}</span>

        <input type="text" placeholder="" @input=${this._onInput} />

        ${t?et`<div class="underline"></div>`:""}
      </div>
    `}};u.formAssociated=!0;u.styles=dt`
    :host {
      display: inline-flex;
      flex-direction: column;
      min-width: 200px;
      vertical-align: top;
      margin-top: 8px;
    }

    *,
    *::before,
    *::after {
      box-sizing: border-box;
    }

    .field-wrapper {
      position: relative;
      cursor: text;
    }

    fieldset {
      margin: 0;
      padding: 0;
      border: none;
    }

    input {
      width: 100%;
      border: none;
      outline: none;
      font-size: 1rem;
      line-height: 1.4375em;
      letter-spacing: 0.00938em;
      color: rgba(0, 0, 0, 0.87);
      display: block;
    }

    .floating-label {
      position: absolute;
      top: 0;
      transform-origin: left top;
      font-size: 1rem;
      line-height: 1.4375em;
      letter-spacing: 0.00938em;
      color: rgba(0, 0, 0, 0.6);
      pointer-events: none;
      transition:
        color 200ms cubic-bezier(0, 0, 0.2, 1) 0ms,
        transform 200ms cubic-bezier(0, 0, 0.2, 1) 0ms,
        max-width 200ms cubic-bezier(0, 0, 0.2, 1) 0ms;
      z-index: 1;
      white-space: nowrap;
    }

    .field-wrapper:hover .floating-label {
      color: rgba(0, 0, 0, 0.87);
    }
    .field-wrapper:focus-within .floating-label {
      color: #1976d2;
    }

    .variant-outlined {
      border-radius: 4px;
    }

    .variant-outlined fieldset {
      position: absolute;
      inset: -5px 0 0 0;
      border: 1px solid rgba(0, 0, 0, 0.23);
      border-radius: inherit;
      margin: 0;
      padding: 0 8px;
      pointer-events: none;
      transition: border-color 0.2s ease;
    }

    .variant-outlined:hover fieldset {
      border-color: rgba(0, 0, 0, 0.87);
    }
    .variant-outlined:focus-within fieldset {
      border: 2px solid #1976d2;
    }

    .variant-outlined legend {
      display: block;
      visibility: hidden;
      height: 11px;
      font-size: 0.75em;
      max-width: 0.01px;
      white-space: nowrap;
      padding: 0;
      transition: max-width 100ms cubic-bezier(0, 0, 0.2, 1) 50ms;
      overflow: hidden;
    }

    .variant-outlined legend span {
      padding: 0 5px;
    }

    .variant-outlined:focus-within legend,
    .variant-outlined.has-value legend {
      max-width: 100%;
    }

    .variant-outlined input {
      padding: 16.5px 14px;
      background: transparent;
    }

    .variant-outlined .floating-label {
      left: 14px;
      transform: translate(0, 16px) scale(1);
    }

    .variant-outlined:focus-within .floating-label,
    .variant-outlined.has-value .floating-label {
      transform: translate(0, -9px) scale(0.75);
      color: #1976d2;
      padding: 0 5px;
      left: 9px;
    }

    .variant-filled {
      border-radius: 4px 4px 0 0;
      background: rgba(0, 0, 0, 0.06);
      transition: background 0.2s;
    }

    .variant-filled:hover {
      background: rgba(0, 0, 0, 0.09);
    }
    .variant-filled:focus-within {
      background: rgba(0, 0, 0, 0.09);
    }
    .variant-filled fieldset {
      display: none;
    }

    .variant-filled input {
      padding: 25px 12px 8px;
      background: transparent;
    }

    .variant-filled .floating-label {
      left: 12px;
      transform: translate(0, 16px) scale(1);
    }

    .variant-filled:focus-within .floating-label,
    .variant-filled.has-value .floating-label {
      transform: translate(0, 8px) scale(0.75);
      color: #1976d2;
    }

    .variant-standard {
      position: relative;
    }

    .variant-standard fieldset {
      display: none;
    }

    .variant-standard input {
      padding: 4px 0 5px;
      background: transparent;
    }

    .variant-standard .floating-label {
      left: 0;
      transform: translate(0, 0px) scale(1);
    }

    .variant-standard:focus-within .floating-label,
    .variant-standard.has-value .floating-label {
      transform: translate(0, -15px) scale(0.75);
      color: #1976d2;
    }

    .underline {
      position: absolute;
      bottom: 0;
      left: 0;
      right: 0;
      height: 1px;
      background: rgba(0, 0, 0, 0.42);
    }

    .underline::after {
      content: "";
      position: absolute;
      bottom: 0;
      left: 50%;
      right: 50%;
      height: 2px;
      background: #1976d2;
      transition:
        left 0.2s ease,
        right 0.2s ease;
    }

    .field-wrapper:focus-within .underline::after {
      left: 0;
      right: 0;
    }
  `;y([x({type:String,reflect:!0})],u.prototype,"width",2);y([x({type:String,reflect:!0})],u.prototype,"height",2);y([x({type:String,reflect:!0})],u.prototype,"label",2);y([x({type:String,reflect:!0})],u.prototype,"variant",2);y([x({type:Boolean,reflect:!0})],u.prototype,"required",2);y([Ht()],u.prototype,"_hasValue",2);u=y([Mt("mui-text-lit")],u);
