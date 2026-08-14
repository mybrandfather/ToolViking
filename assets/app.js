
const D=window.TV_DATA||{};const $=s=>document.querySelector(s);const money=n=>new Intl.NumberFormat('en-US',{style:'currency',currency:'USD',maximumFractionDigits:2}).format(isFinite(n)?n:0);const num=(id,d=0)=>Number(document.getElementById(id)?.value)||d;
function fields(slug){const maps={
'missed-call-revenue-calculator':[['Calls per month',100],['Percent missed',25],['Lead-to-customer conversion %',35],['Average customer/job value',500]],
'automation-roi-calculator':[['Hours saved monthly',40],['Hourly labor cost',35],['Monthly automation cost',250],['One-time setup cost',1000]],
'employee-hours-saved-calculator':[['Employees affected',5],['Hours saved per employee weekly',2],['Loaded hourly cost',35],['Weeks per year',52]],
'ai-receptionist-cost-calculator':[['Current monthly call cost',1800],['Proposed monthly service cost',500],['Monthly revenue recovered',1200],['One-time setup cost',300]],
'lead-response-time-calculator':[['Total response minutes',600],['Leads measured',50],['Target response minutes',5],['Workdays per month',22]],
'lead-conversion-calculator':[['Leads',200],['Customers won',30]],'cost-per-lead-calculator':[['Marketing spend',2500],['Leads generated',125]],'lead-value-calculator':[['Average sale value',900],['Gross margin %',55],['Lead conversion %',20]],
'word-counter':[['Text','Paste or type your text here.']], 'reading-time-calculator':[['Text','Paste or type your text here.'],['Reading speed (words/minute)',225]],
'utm-builder':[['Destination URL','https://example.com'],['Campaign source','newsletter'],['Campaign medium','email'],['Campaign name','launch']],
'business-name-generator':[['Core keyword','forge'],['Industry or audience','business']], 'slogan-generator':[['Brand name','ToolViking'],['Customer promise','work smarter']], 'email-subject-checker':[['Subject line','A practical guide for your next launch']], 'invoice-number-generator':[['Prefix','INV'],['Starting number',1001]],
};if(maps[slug])return maps[slug];return [['Primary value',1000],['Secondary value',100],['Rate or percentage',20],['Time or quantity',12]]}
function compute(slug,a){let x=a.map(v=>typeof v==='string'?v:Number(v)||0),r='';switch(slug){
case'missed-call-revenue-calculator':{let m=x[0]*x[1]/100*x[2]/100*x[3];r=`<strong>${money(m)} / month</strong><p>${money(m*12)} estimated annual opportunity.</p>`;break}
case'lead-conversion-calculator':r=`<strong>${x[0]?((x[1]/x[0])*100).toFixed(2):0}%</strong><p>${x[1]} customers from ${x[0]} leads.</p>`;break;
case'cost-per-lead-calculator':r=`<strong>${money(x[0]/(x[1]||1))} per lead</strong><p>Based on ${money(x[0])} spend and ${x[1]} leads.</p>`;break;
case'lead-value-calculator':{let v=x[0]*x[1]/100*x[2]/100;r=`<strong>${money(v)} per lead</strong><p>Expected gross-profit value.</p>`;break}
case'lead-response-time-calculator':r=`<strong>${(x[0]/(x[1]||1)).toFixed(1)} minutes average</strong><p>${Math.max(0,x[0]/(x[1]||1)-x[2]).toFixed(1)} minutes above target.</p>`;break;
case'automation-roi-calculator':{let save=x[0]*x[1],net=save-x[2],roi=(net*12-x[3])/(x[2]*12+x[3]||1)*100;r=`<strong>${money(net)} monthly net savings</strong><p>${roi.toFixed(1)}% first-year ROI.</p>`;break}
case'employee-hours-saved-calculator':{let h=x[0]*x[1]*x[3],v=h*x[2];r=`<strong>${h.toFixed(0)} hours/year</strong><p>${money(v)} estimated annual capacity value.</p>`;break}
case'ai-receptionist-cost-calculator':{let n=x[0]-x[1]+x[2];r=`<strong>${money(n)} monthly opportunity</strong><p>${x[3]&&n>0?(x[3]/n).toFixed(1):'0'} month estimated setup payback.</p>`;break}
case'word-counter':{let w=(x[0].trim().match(/\S+/g)||[]).length;r=`<strong>${w} words</strong><p>${x[0].length} characters · ${Math.ceil(w/225)} min read.</p>`;break}
case'reading-time-calculator':{let w=(x[0].trim().match(/\S+/g)||[]).length;r=`<strong>${Math.max(1,Math.ceil(w/(x[1]||225)))} minutes</strong><p>${w} words at ${x[1]||225} words/minute.</p>`;break}
case'utm-builder':{try{let u=new URL(x[0]);['source','medium','campaign'].forEach((k,i)=>u.searchParams.set('utm_'+k,x[i+1]));r=`<strong>Campaign URL</strong><p style="word-break:break-all">${u}</p>`}catch{r='<strong>Enter a valid URL</strong>'}break}
case'invoice-number-generator':r=`<strong>${String(x[0]).toUpperCase()}-${new Date().getFullYear()}-${String(x[1]).padStart(5,'0')}</strong><p>Generated locally; confirm uniqueness in your records.</p>`;break;
case'business-name-generator':r=`<strong>${x[0]} ${x[1]} ideas</strong><p>${x[0]} Works · ${x[0]} Harbor · North ${x[0]} · ${x[1]} Forge · ${x[0]} & Co.</p>`;break;
case'slogan-generator':r=`<strong>${x[0]}</strong><p>${x[1]}, made simpler. · Built to ${x[1]}. · A better way to ${x[1]}.</p>`;break;
case'email-subject-checker':{let n=x[0].length,score=Math.max(30,100-Math.abs(45-n)*2-(/free|urgent|guarantee/gi.test(x[0])?20:0));r=`<strong>${score}/100 clarity check</strong><p>${n} characters. Aim for a specific, truthful subject around 35–55 characters.</p>`;break}
default:{let s=x.filter(v=>typeof v==='number').reduce((p,c)=>p+c,0),ratio=x[1]?x[0]/x[1]*100:0;r=`<strong>${money(s)}</strong><p>Combined value · ${ratio.toFixed(2)}% primary-to-secondary ratio. Adjust inputs for a quick scenario estimate.</p>`}}
return r}
function initTool(){const root=$('#tool-app');if(!root)return;let slug=root.dataset.slug,fs=fields(slug);root.innerHTML=`<div class="fields">${fs.map((f,i)=>`<label>${f[0]}${typeof f[1]==='string'&&f[0].toLowerCase().includes('text')?`<textarea id="f${i}" rows="7">${f[1]}</textarea>`:`<input id="f${i}" value="${f[1]}">`}</label>`).join('')}<button class="btn" id="calc">Calculate</button></div><div class="result" id="result"><span class="muted">Enter your scenario and calculate. Your data stays in this browser.</span></div>`;let go=()=>$('#result').innerHTML=compute(slug,fs.map((_,i)=>document.getElementById('f'+i).value));$('#calc').onclick=go;go()}
function filter(){let q=($('#catalog-search')?.value||'').toLowerCase();document.querySelectorAll('[data-search]').forEach(x=>x.style.display=x.dataset.search.includes(q)?'block':'none')}
document.addEventListener('DOMContentLoaded',()=>{initTool();$('#catalog-search')?.addEventListener('input',filter)})
