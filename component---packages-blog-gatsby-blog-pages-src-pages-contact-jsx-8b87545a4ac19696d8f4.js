"use strict";(self.webpackChunk_elegantstack_gatsby_starter_flexiblog_personal=self.webpackChunk_elegantstack_gatsby_starter_flexiblog_personal||[]).push([[117],{14968:function(e,t,a){a.d(t,{A:function(){return i}});a(63696);var n=a(82938),r=a(36474);const o={count:{fontSize:4},subheader:{fontWeight:"body",color:"omegaDark"},runninghead:{fontWeight:"body",color:"omegaDark",mb:0}};var i=e=>{let{header:t,subheader:a,running:i,totalCount:s}=e;return(0,r.Y)("div",null,(0,r.Y)(n.DZ,{variant:"h1",as:"h1"},t," ",s&&(0,r.Y)(n.Ex,{variant:"tag-white",sx:o.count}," ",s)),a&&(0,r.Y)(n.EY,{variant:"h3",sx:o.subheader},a),i&&(0,r.Y)(n.EY,{variant:"h4",sx:o.runninghead},i))}},24343:function(e,t,a){a.r(t),a.d(t,{default:function(){return g}});var n=a(63696),r=a(25846),o=a(14968),i=a(17564),s=a(55772),l=a(82938),m=a(36474);var u=e=>{let{handleSubmit:t,submitting:a,success:n}=e;return(0,m.Y)("form",{onSubmit:t,method:"POST",action:"YOUR_ACTION_END_POINT",demo:"demo"},!0===n&&(0,m.Y)(l.QB,{variant:"success"},"Thank you for contacting us. We'll get back to you soon!"),!1===n&&(0,m.Y)(l.QB,{variant:"error"},"Something went wrong. Please try again later!"),(0,m.Y)(l.az,{variant:"forms.row"},(0,m.Y)(l.az,{variant:"forms.column"},(0,m.Y)(l.JU,{htmlFor:"contact-form-name"},"Name"),(0,m.Y)(l.pd,{type:"text",id:"contact-form-name",name:"name",required:!0})),(0,m.Y)(l.az,{variant:"forms.column"},(0,m.Y)(l.JU,{htmlFor:"contact-form-company"},"Company Name"),(0,m.Y)(l.pd,{type:"text",id:"contact-form-company",name:"company"}))),(0,m.Y)(l.az,{variant:"forms.row"},(0,m.Y)(l.az,{variant:"forms.column"},(0,m.Y)(l.JU,{htmlFor:"contact-form-email"},"Email"),(0,m.Y)(l.pd,{type:"email",placeholder:"email@example.com",id:"contact-form-email",name:"email",required:!0})),(0,m.Y)(l.az,{variant:"forms.column"},(0,m.Y)(l.JU,{htmlFor:"contact-form-phone"},"Phone Number"),(0,m.Y)(l.pd,{type:"tel",placeholder:"(xxx) xxx-xxxx",id:"contact-form-phone",name:"phone"}))),(0,m.Y)(l.az,{variant:"forms.row"},(0,m.Y)(l.JU,{htmlFor:"contact-form-subject"},"Subject"),(0,m.Y)(l.pd,{type:"text",id:"contact-form-subject",name:"subject",required:!0})),(0,m.Y)(l.az,{variant:"forms.row"},(0,m.Y)(l.JU,{htmlFor:"contact-form-message"},"Your Message"),(0,m.Y)(l.TM,{name:"message",id:"contact-form-message"})),(0,m.Y)(l.$n,{variant:n||a?"disabled":"primary",disabled:n||a,type:"submit",required:!0},"Submit ",a&&(0,m.Y)(l.y$,{size:"20"})))};var c=()=>{const{0:e,1:t}=(0,n.useState)(!1),{0:a,1:r}=(0,n.useState)({}),{0:o,1:i}=(0,n.useState)(),{0:s,1:l}=(0,n.useState)(),{0:m,1:u}=(0,n.useState)(),c=(0,n.useCallback)((()=>{const e=new FormData(a),n=new URLSearchParams(s||e).toString();a.getAttribute("demo")?setTimeout((()=>{i(!0),t(!1)}),1500):fetch(m||a.action,{method:a.method||"POST",headers:{"Content-Type":"application/x-www-form-urlencoded",Accept:"application/json"},body:n}).then((()=>{a.reset(),i(!0)})).catch((e=>{i(!1)})).finally((()=>{t(!1)}))}),[a]);(0,n.useEffect)((()=>{e&&c()}),[e,c]);const Y=(0,n.useCallback)((()=>{t(!1),i(void 0),l(void 0),u(void 0)}),[]);return{handleSubmit:function(e,a){let{values:n,action:o}=void 0===a?{}:a;e.preventDefault(),n&&l(n),o&&u(o),r(e.target),t(!0)},submitting:e,success:o,reset:Y}};var Y=()=>{const{handleSubmit:e,submitting:t,success:a}=c();return(0,m.Y)(l.Zp,{variant:"paper"},(0,m.Y)(u,{handleSubmit:e,submitting:t,success:a}))},d=a(99304),p=a(74626),h=a(71888);var f=()=>{const{phone:e,address:t,email:a}=(0,h.A)();return(0,m.Y)(p.A,{aside:!0,title:"Advertise With Us"},(0,m.Y)(l.Zp,{variant:"paper"},(0,m.Y)(l.EY,{variant:"p"},"Interested in working together?"),(0,m.Y)(l.EY,{variant:"p"},"Suspendisse potenti. Mauris mollis diam tempus ut."),e&&(0,m.Y)(l.EY,null,(0,m.Y)(l.K0,{variant:"simple",role:"presentation"},(0,m.Y)(d.Cab,null)),e),a&&(0,m.Y)(l.EY,null,(0,m.Y)(l.K0,{variant:"simple",role:"presentation"},(0,m.Y)(d.maD,null)),a),t&&(0,m.Y)(l.EY,null,(0,m.Y)(l.K0,{variant:"simple",role:"presentation"},(0,m.Y)(d.meu,null)),t)))},v=a(68102);var b=e=>(0,m.Y)(p.A,(0,v.A)({aside:!0,title:"Our Commitment"},e),(0,m.Y)(l.Zp,{variant:"paper"},(0,m.Y)(l.EY,{variant:"p"},"We take our commitment to our users seriously. If you need our help with your project, have questions about how to use the site or are experiencing any technical difficulties, please do not hesitate to contact us.")));var g=e=>(0,m.Y)(r.PE,e,(0,m.Y)(s.A,{title:"Contact"}),(0,m.Y)(i.A,null),(0,m.Y)(r.BJ,null,(0,m.Y)(r.gZ,null,(0,m.Y)(o.A,{header:"Let's Connect",subheader:"FlexiBlog theme comes with a pre-made contact form component. You can integrate this form with serverless services such as Formspree, Getform, FormKeep and others to receive form submissions via email."}),(0,m.Y)(i.A,null),(0,m.Y)(Y,null)),(0,m.Y)(r.Bx,null,(0,m.Y)(b,null),(0,m.Y)(i.A,null),(0,m.Y)(f,null))))}}]);
//# sourceMappingURL=component---packages-blog-gatsby-blog-pages-src-pages-contact-jsx-8b87545a4ac19696d8f4.js.map