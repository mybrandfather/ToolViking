
const D=window.TV_DATA||{};const $=s=>document.querySelector(s);const money=n=>new Intl.NumberFormat('en-US',{style:'currency',currency:'USD',maximumFractionDigits:2}).format(isFinite(n)?n:0);const num=(id,d=0)=>Number(document.getElementById(id)?.value)||d;
function fields(slug){const maps={
'mrr-calculator':[['Active customers',250],['Average monthly revenue per customer',49]],
'arr-calculator':[['Monthly recurring revenue',12000]],
'churn-rate-calculator':[['Customers at start of period',500],['Customers lost during period',18]],
'customer-lifetime-value-calculator':[['Average monthly revenue per customer',75],['Gross margin %',70],['Monthly churn rate %',4]],
'customer-acquisition-cost-calculator':[['Sales and marketing spend',15000],['New customers acquired',60]],
'break-even-calculator':[['Fixed costs',10000],['Selling price per unit',80],['Variable cost per unit',35]],
'profit-margin-calculator':[['Revenue',25000],['Total costs',17000]],
'markup-calculator':[['Unit cost',40],['Markup %',50]],
'roi-calculator':[['Amount gained',18000],['Amount invested',12000]],
'cash-runway-calculator':[['Cash available',150000],['Average monthly net burn',18000]],
'burn-rate-calculator':[['Starting cash balance',220000],['Ending cash balance',160000],['Number of months',3]],
'sales-tax-calculator':[['Price before tax',120],['Sales tax rate %',7.5]],
'discount-calculator':[['Original price',150],['Discount %',20]],
'shipping-profit-calculator':[['Selling price',65],['Product cost',24],['Shipping cost',8],['Platform/payment fees',5]],
'etsy-fee-calculator':[['Sale price',50],['Shipping charged to buyer',6],['Fee rate %',9.5],['Fixed fees',0.20]],
'average-order-value-calculator':[['Total revenue',28000],['Number of orders',620]],
'cart-abandonment-loss-calculator':[['Initiated carts',1000],['Completed orders',320],['Average order value',58]],
'conversion-rate-calculator':[['Visitors or opportunities',15000],['Conversions',525]],
'roas-calculator':[['Revenue attributed to ads',24000],['Advertising spend',6000]],
'cpm-calculator':[['Advertising spend',2500],['Impressions',400000]],
'cpc-calculator':[['Advertising spend',2500],['Clicks',4200]],
'email-open-rate-calculator':[['Emails delivered',12000],['Unique opens',4680]],
'email-click-rate-calculator':[['Emails delivered',12000],['Unique clicks',840]],
'social-engagement-rate-calculator':[['Total engagements',1800],['Reach or followers',45000]],
'inventory-turnover-calculator':[['Cost of goods sold',240000],['Average inventory value',60000]],
'reorder-point-calculator':[['Average units sold per day',18],['Supplier lead time in days',12],['Safety stock units',80]],
'hourly-rate-calculator':[['Desired annual take-home income',80000],['Annual business costs and taxes',30000],['Billable weeks per year',46],['Billable hours per week',25]],
'freelance-project-rate-calculator':[['Estimated project hours',60],['Target hourly rate',95],['Direct project costs',500],['Contingency %',15]],
'salary-to-hourly-calculator':[['Annual salary',72000],['Hours per week',40],['Working weeks per year',52]],
'startup-cost-calculator':[['One-time setup costs',18000],['Monthly operating costs',6500],['Months of runway desired',6],['Contingency %',10]],
'meeting-cost-calculator':[['Number of attendees',8],['Average loaded hourly cost',55],['Meeting duration in minutes',60],['Meetings per month',4]],
'employee-cost-calculator':[['Annual base salary',70000],['Payroll taxes and benefits %',25],['Annual equipment and overhead',8000]],
'contractor-estimate-calculator':[['Labor hours',80],['Labor rate per hour',75],['Material cost',4200],['Overhead and profit %',25]],
'job-profit-calculator':[['Job revenue',18000],['Labor cost',6200],['Material cost',4800],['Other job costs',900]],
'material-waste-calculator':[['Required material quantity',500],['Waste allowance %',10]],
'square-footage-calculator':[['Length in feet',24],['Width in feet',18],['Number of equal areas',1]],
'paint-calculator':[['Paintable area in square feet',1800],['Coverage per gallon',350],['Number of coats',2],['Waste allowance %',10]],
'loan-payment-calculator':[['Loan principal',100000],['Annual interest rate %',8],['Loan term in years',5]],
'simple-interest-calculator':[['Principal',10000],['Annual interest rate %',6],['Time in years',3]],
'compound-growth-calculator':[['Starting amount',25000],['Annual growth rate %',8],['Years',10],['Compounds per year',12]],
'capacity-planner':[['Team members',6],['Hours per person weekly',40],['Utilization %',75],['Weeks',4]],
'project-timeline-calculator':[['Total work hours',600],['Team members',4],['Productive hours per person weekly',25],['Contingency %',15]],
'support-staffing-calculator':[['Tickets per month',3000],['Average handling minutes',18],['Productive hours per agent monthly',120],['Occupancy target %',80]],
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
function compute(slug,a){const textTools=new Set(['word-counter','reading-time-calculator','utm-builder','invoice-number-generator','business-name-generator','slogan-generator','email-subject-checker']);let x=a.map(v=>textTools.has(slug)?String(v).replace(/[<>&"']/g,''):Number(v)||0),r='';switch(slug){
case'mrr-calculator':{let v=x[0]*x[1];r=`<strong>${money(v)} MRR</strong><p>${money(v*12)} annualized recurring revenue.</p>`;break}
case'arr-calculator':{let v=x[0]*12;r=`<strong>${money(v)} ARR</strong><p>Based on ${money(x[0])} monthly recurring revenue.</p>`;break}
case'churn-rate-calculator':{let v=x[0]?x[1]/x[0]*100:0;r=`<strong>${v.toFixed(2)}% churn</strong><p>${Math.max(0,x[0]-x[1])} customers remain before additions.</p>`;break}
case'customer-lifetime-value-calculator':{let monthly=x[0]*x[1]/100,v=x[2]>0?monthly/(x[2]/100):0;r=`<strong>${money(v)} estimated LTV</strong><p>${money(monthly)} monthly gross profit per customer. Churn-based estimate.</p>`;break}
case'customer-acquisition-cost-calculator':{let v=x[1]?x[0]/x[1]:0;r=`<strong>${money(v)} CAC</strong><p>${money(x[0])} spent to acquire ${x[1]} customers.</p>`;break}
case'break-even-calculator':{let contribution=x[1]-x[2],units=contribution>0?Math.ceil(x[0]/contribution):0;r=`<strong>${units.toLocaleString()} units</strong><p>${money(units*x[1])} break-even revenue at ${money(contribution)} contribution per unit.</p>`;break}
case'profit-margin-calculator':{let profit=x[0]-x[1],margin=x[0]?profit/x[0]*100:0;r=`<strong>${money(profit)} profit</strong><p>${margin.toFixed(2)}% profit margin.</p>`;break}
case'markup-calculator':{let price=x[0]*(1+x[1]/100);r=`<strong>${money(price)} selling price</strong><p>${money(price-x[0])} markup amount.</p>`;break}
case'roi-calculator':{let net=x[0]-x[1],roi=x[1]?net/x[1]*100:0;r=`<strong>${roi.toFixed(2)}% ROI</strong><p>${money(net)} net return.</p>`;break}
case'cash-runway-calculator':{let months=x[1]>0?x[0]/x[1]:0;r=`<strong>${months.toFixed(1)} months</strong><p>Estimated runway at ${money(x[1])} net burn per month.</p>`;break}
case'burn-rate-calculator':{let burn=x[2]>0?(x[0]-x[1])/x[2]:0;r=`<strong>${money(burn)} monthly burn</strong><p>${money(Math.max(0,x[0]-x[1]))} used across ${x[2]} months.</p>`;break}
case'sales-tax-calculator':{let tax=x[0]*x[1]/100;r=`<strong>${money(x[0]+tax)} total</strong><p>${money(tax)} sales tax on ${money(x[0])}.</p>`;break}
case'discount-calculator':{let save=x[0]*x[1]/100;r=`<strong>${money(x[0]-save)} final price</strong><p>You save ${money(save)}.</p>`;break}
case'shipping-profit-calculator':{let profit=x[0]-x[1]-x[2]-x[3],margin=x[0]?profit/x[0]*100:0;r=`<strong>${money(profit)} order profit</strong><p>${margin.toFixed(2)}% margin after product, shipping, and fees.</p>`;break}
case'etsy-fee-calculator':{let gross=x[0]+x[1],fees=gross*x[2]/100+x[3];r=`<strong>${money(gross-fees)} net proceeds</strong><p>${money(fees)} estimated total fees. Enter your marketplace's actual combined fee rate.</p>`;break}
case'average-order-value-calculator':{let v=x[1]?x[0]/x[1]:0;r=`<strong>${money(v)} AOV</strong><p>${money(x[0])} revenue across ${x[1]} orders.</p>`;break}
case'cart-abandonment-loss-calculator':{let abandoned=Math.max(0,x[0]-x[1]),value=abandoned*x[2];r=`<strong>${money(value)} abandoned cart value</strong><p>${abandoned} incomplete carts · ${x[0]?((abandoned/x[0])*100).toFixed(2):0}% abandonment rate.</p>`;break}
case'conversion-rate-calculator':{let v=x[0]?x[1]/x[0]*100:0;r=`<strong>${v.toFixed(2)}% conversion rate</strong><p>${x[1]} conversions from ${x[0]} opportunities.</p>`;break}
case'roas-calculator':{let v=x[1]?x[0]/x[1]:0;r=`<strong>${v.toFixed(2)}× ROAS</strong><p>${money(v)} revenue returned per advertising dollar.</p>`;break}
case'cpm-calculator':{let v=x[1]?x[0]/x[1]*1000:0;r=`<strong>${money(v)} CPM</strong><p>Cost per 1,000 impressions.</p>`;break}
case'cpc-calculator':{let v=x[1]?x[0]/x[1]:0;r=`<strong>${money(v)} CPC</strong><p>Average cost for each click.</p>`;break}
case'email-open-rate-calculator':{let v=x[0]?x[1]/x[0]*100:0;r=`<strong>${v.toFixed(2)}% open rate</strong><p>${x[1]} unique opens from ${x[0]} delivered emails.</p>`;break}
case'email-click-rate-calculator':{let v=x[0]?x[1]/x[0]*100:0;r=`<strong>${v.toFixed(2)}% click rate</strong><p>${x[1]} unique clicks from ${x[0]} delivered emails.</p>`;break}
case'social-engagement-rate-calculator':{let v=x[1]?x[0]/x[1]*100:0;r=`<strong>${v.toFixed(2)}% engagement rate</strong><p>${x[0]} engagements against an audience/reach of ${x[1]}.</p>`;break}
case'inventory-turnover-calculator':{let v=x[1]?x[0]/x[1]:0;r=`<strong>${v.toFixed(2)}× turnover</strong><p>${v>0?(365/v).toFixed(1):0} average days of inventory.</p>`;break}
case'reorder-point-calculator':{let v=x[0]*x[1]+x[2];r=`<strong>${Math.ceil(v)} units</strong><p>Reorder when stock reaches this level, including ${x[2]} safety-stock units.</p>`;break}
case'hourly-rate-calculator':{let h=x[2]*x[3],v=h?(x[0]+x[1])/h:0;r=`<strong>${money(v)} per billable hour</strong><p>Based on ${h.toFixed(0)} billable hours per year.</p>`;break}
case'freelance-project-rate-calculator':{let base=x[0]*x[1]+x[2],v=base*(1+x[3]/100);r=`<strong>${money(v)} project price</strong><p>${money(base)} base estimate plus ${x[3]}% contingency.</p>`;break}
case'salary-to-hourly-calculator':{let h=x[1]*x[2],v=h?x[0]/h:0;r=`<strong>${money(v)} per hour</strong><p>Based on ${h.toFixed(0)} working hours annually.</p>`;break}
case'startup-cost-calculator':{let base=x[0]+x[1]*x[2],v=base*(1+x[3]/100);r=`<strong>${money(v)} funding target</strong><p>${money(base)} core costs plus ${x[3]}% contingency.</p>`;break}
case'meeting-cost-calculator':{let each=x[0]*x[1]*x[2]/60;r=`<strong>${money(each)} per meeting</strong><p>${money(each*x[3])} estimated monthly meeting cost.</p>`;break}
case'employee-cost-calculator':{let loaded=x[0]*(1+x[1]/100)+x[2];r=`<strong>${money(loaded)} annual loaded cost</strong><p>${money(loaded/12)} estimated monthly cost.</p>`;break}
case'contractor-estimate-calculator':{let base=x[0]*x[1]+x[2],v=base*(1+x[3]/100);r=`<strong>${money(v)} estimate</strong><p>${money(base)} direct cost plus ${money(v-base)} overhead and profit.</p>`;break}
case'job-profit-calculator':{let p=x[0]-x[1]-x[2]-x[3],m=x[0]?p/x[0]*100:0;r=`<strong>${money(p)} job profit</strong><p>${m.toFixed(2)}% job margin.</p>`;break}
case'material-waste-calculator':{let extra=x[0]*x[1]/100;r=`<strong>${(x[0]+extra).toFixed(2)} total units</strong><p>${extra.toFixed(2)} units added for waste.</p>`;break}
case'square-footage-calculator':{let v=x[0]*x[1]*x[2];r=`<strong>${v.toFixed(2)} sq ft</strong><p>${x[2]} area(s) measuring ${x[0]} × ${x[1]} feet.</p>`;break}
case'paint-calculator':{let raw=x[1]>0?x[0]*x[2]/x[1]:0,v=raw*(1+x[3]/100);r=`<strong>${Math.ceil(v)} gallons</strong><p>${v.toFixed(2)} calculated gallons including waste; round up for purchasing.</p>`;break}
case'loan-payment-calculator':{let n=x[2]*12,rate=x[1]/1200,p=rate&&n?x[0]*rate*Math.pow(1+rate,n)/(Math.pow(1+rate,n)-1):(n?x[0]/n:0);r=`<strong>${money(p)} monthly payment</strong><p>${money(p*n)} estimated total repayment.</p>`;break}
case'simple-interest-calculator':{let i=x[0]*x[1]/100*x[2];r=`<strong>${money(i)} interest</strong><p>${money(x[0]+i)} final balance.</p>`;break}
case'compound-growth-calculator':{let n=Math.max(1,x[3]),v=x[0]*Math.pow(1+x[1]/100/n,n*x[2]);r=`<strong>${money(v)} future value</strong><p>${money(v-x[0])} estimated growth.</p>`;break}
case'capacity-planner':{let gross=x[0]*x[1]*x[3],usable=gross*x[2]/100;r=`<strong>${usable.toFixed(1)} usable hours</strong><p>${gross.toFixed(1)} gross hours across ${x[3]} weeks at ${x[2]}% utilization.</p>`;break}
case'project-timeline-calculator':{let weekly=x[1]*x[2],hours=x[0]*(1+x[3]/100),weeks=weekly?hours/weekly:0;r=`<strong>${weeks.toFixed(1)} weeks</strong><p>${hours.toFixed(0)} planned hours including contingency.</p>`;break}
case'support-staffing-calculator':{let hours=x[0]*x[1]/60,capacity=x[2]*x[3]/100,agents=capacity?hours/capacity:0;r=`<strong>${Math.ceil(agents)} agents</strong><p>${agents.toFixed(2)} full-time equivalents for ${hours.toFixed(1)} monthly workload hours.</p>`;break}
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
function initTool(){const root=$('#tool-app');if(!root)return;let slug=root.dataset.slug,fs=fields(slug);root.innerHTML=`<div class="fields">${fs.map((f,i)=>`<label>${f[0]}${typeof f[1]==='string'&&f[0].toLowerCase().includes('text')?`<textarea id="f${i}" rows="7">${f[1]}</textarea>`:`<input id="f${i}" value="${f[1]}" inputmode="decimal">`}</label>`).join('')}<div class="actions"><button class="btn" id="calc">Calculate</button><button class="btn secondary" id="copy-result" type="button">Copy result</button></div></div><div class="result" id="result" aria-live="polite"><span class="muted">Enter your scenario and calculate. Your data stays in this browser.</span></div>`;let go=()=>$('#result').innerHTML=compute(slug,fs.map((_,i)=>document.getElementById('f'+i).value));$('#calc').onclick=go;$('#copy-result').onclick=async()=>{let text=$('#result').innerText;try{await navigator.clipboard.writeText(text);$('#copy-result').textContent='Copied'}catch{$('#copy-result').textContent='Select and copy result'}setTimeout(()=>$('#copy-result').textContent='Copy result',1800)};go()}
function filter(){let q=($('#catalog-search')?.value||'').toLowerCase();document.querySelectorAll('[data-search]').forEach(x=>x.style.display=x.dataset.search.includes(q)?'block':'none')}
document.addEventListener('DOMContentLoaded',()=>{initTool();$('#catalog-search')?.addEventListener('input',filter)})
