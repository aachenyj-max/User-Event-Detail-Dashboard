const $=(s,root=document)=>root.querySelector(s), $$=(s,root=document)=>[...root.querySelectorAll(s)];
const page=document.body.dataset.page;
const icons={home:'⌂',users:'♧',track:'＋',portrait:'◉',group:'☷',insight:'♧',tags:'⬡',settings:'⚙'};
const navItems=[['home','概览'],['users','用户数据'],['track','单用户轨迹'],['portrait','用户画像'],['group','人群分组'],['insight','数据洞察'],['tags','标签管理'],['settings','系统设置']];
function sidebar(){return `<aside class="sidebar"><div class="sidebar-art"></div><div class="brand"><img class="brand-logo" src="assets/logo.svg" alt="Momcozy"><div><strong>Momcozy</strong><small>用户数据平台</small></div></div><nav class="nav">${navItems.map(([id,title])=>`<a class="${id==='track'?'active':''}" href="${id==='track'?'index.html':'#'}" data-nav="${id}"><span class="nav-icon">${icons[id]}</span><span>${title}</span></a>`).join('')}</nav><div class="profile"><span class="avatar-admin">A</span><span><strong>admin</strong><small>管理员</small></span><span class="caret">⌄</span></div></aside>`}
function shell(content){$('#app').innerHTML=`<div class="app-shell">${sidebar()}<main class="workspace">${content}</main></div><div id="toast" class="toast hidden"></div><div id="modal" class="modal-backdrop hidden"><div class="modal"><button class="modal-close" id="modal-close">×</button><div id="modal-body"></div></div></div>`;$$('[data-nav]').forEach(a=>{if(a.getAttribute('href')==='#')a.onclick=e=>{e.preventDefault();toast('该导航为界面演示，当前可查看单用户轨迹流程')}});$('#modal-close').onclick=()=>$('#modal').classList.add('hidden');$('#modal').onclick=e=>{if(e.target.id==='modal')$('#modal').classList.add('hidden')}}
function toast(message){let t=$('#toast');t.textContent=message;t.classList.remove('hidden');clearTimeout(window.toastTimer);window.toastTimer=setTimeout(()=>t.classList.add('hidden'),2600)}
function modal(html){$('#modal-body').innerHTML=html;$('#modal').classList.remove('hidden')}
const users=[
['D','df737c09...45ae','user1@example.com','Android','google','Pixel 10','Air1','3.6.0','3c12b79c...9e8c','5624','2026-10-26T22:29:52Z','#2e63ff'],
['6','68da6cc5...6f12','user2@example.com','iOS','Apple','iPhone17,3','M9','3.5.1','27d454a0...1af3','6194','2026-10-26T22:29:46Z','#6426ef'],
['4','4a7b213e...c672','user3@example.com','iOS','Apple','iPhone18,1','Air1','3.6.0','756ac827...a5fe','356','2026-10-26T22:27:59Z','#fd368f'],
['9','946aac44...e5a8','user4@example.com','iOS','Apple','iPhone17,3','Air1','3.3.1','d5ef243a...b67c','7576','2026-10-26T22:26:55Z','#00b84b'],
['7','7c665ef5...699c','user5@example.com','iOS','Apple','iPhone17,5','M5P0','3.5.1','7697f5b8...03ed','932','2026-10-26T22:24:34Z','#ff8800'],
['6','65fc9b62...5e87','user6@example.com','iOS','Apple','iPhone17,2','M9','3.5.1','c4e434e7...9a05','1507','2026-10-26T22:23:01Z','#05b7d1'],
['5','54c27895...fdd4','user7@example.com','iOS','Apple','iPhone18,2','M5P0','3.6.0','54a4a697...7d17','4167','2026-10-26T22:22:05Z','#315dff'],
['2','2859ad05...d46b','user8@example.com','iOS','Apple','iPhone18,1','M5P0','3.5.1','aaa6e0e1...42c5','3339','2026-10-26T22:21:48Z','#6426ef'],
['A','a64b911e...d60d','user9@example.com','iOS','Apple','iPhone17,3','M9','3.4.1','dc6d48eb...b816','4967','2026-10-26T22:21:37Z','#fd368f'],
['2','29c04138...8af1','user10@example.com','Android','samsung','SM-S931U1','M5P0','3.6.0','9143a2a1...6556','410','2026-10-26T22:20:33Z','#00b84b']
];
const totalDemoUsers=57261;
users.forEach((user,index)=>{user[12]=index%2?'国外':'中国';user[13]=index});
for(let index=users.length;index<totalDemoUsers;index++){
  const number=index+1,seed=(Math.imul(number,2654435761)>>>0).toString(16).padStart(8,'0');
  const platform=index%5===0?'Android':'iOS';
  const brand=platform==='Android'?(index%3===0?'google':'samsung'):'Apple';
  const phone=brand==='google'?'Pixel 10':brand==='samsung'?'SM-S931U1':`iPhone${17+index%2},${1+index%5}`;
  const activeAt=new Date(Date.UTC(2026,9,26,22,20)-(index-10)*40000).toISOString();
  users.push([seed[0].toUpperCase(),`${seed}...${seed.slice(4)}`,`user${number}@example.com`,platform,brand,phone,['Air1','M9','M5P0'][index%3],['3.6.0','3.5.1','3.4.1','3.3.1'][index%4],`${seed.slice(0,6)}...${seed.slice(2)}`,String(350+(index*73)%7300),activeAt,['#315dff','#6426ef','#fd368f','#00b84b','#ff8800'][index%5],index%2?'国外':'中国',index]);
}
function topbar(){return `<header class="topbar"><div><h1>你好，欢迎回来 👋</h1><p>单用户轨迹 - 吸奶器用户数据观测</p></div><div class="top-actions"><button class="top-select" id="global-date"><span class="calendar-ico">▦</span> 全部 <span class="down">⌄</span></button><button class="icon-notice" id="notice" aria-label="通知"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M18 8a6 6 0 0 0-12 0c0 7-3 7-3 9h18c0-2-3-2-3-9M10 21h4" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/></svg><b>2</b></button></div></header>`}
function userRows(data){return data.map((u,i)=>`<tr><td><div class="user-ident"><span class="user-avatar" style="background:${u[11]}">${u[0]}</span><div><div class="idline">${u[1]}</div><small>${u[2]}</small></div></div></td><td><span class="platform-pill ${u[3].toLowerCase()}">${u[3]}</span></td><td class="brand-model">${u[4]}<small>${u[5]}</small></td><td>${u[6]}</td><td>${u[7]}</td><td>${u[8]}</td><td><span class="event-count">${u[9]}</span></td><td>${u[10]}</td><td><button class="row-btn" data-user="${u[13]}">查看轨迹</button></td></tr>`).join('')}
function usersPage(){
  const pageSize=100;
  let pageNumber=1;
  shell(`${topbar()}<section class="panel filter-panel"><div class="search-row"><div class="search-box"><span class="search-lens">⌕</span><input class="search-input" id="user-search" placeholder="搜索 用户ID / 邮箱 / 设备 ID"><span class="search-example">例如：user@email.com</span></div><button class="primary-btn search-submit" id="search-btn">⌕ &nbsp; 搜索用户</button></div><div class="filter-row"><select class="filter-select" id="platform"><option value="">平台</option><option>iOS</option><option>Android</option></select><select class="filter-select" id="model"><option value="">设备型号</option><option>Air1</option><option>M9</option><option>M5P0</option></select><select class="filter-select" id="brand"><option value="">品牌</option><option>Apple</option><option>google</option><option>samsung</option></select><select class="filter-select" id="region" aria-label="区域"><option value="placeholder" selected disabled>区域</option><option value="">全部</option><option value="中国">中国</option><option value="国外">国外</option></select><select class="filter-select" id="version"><option value="">App 版本</option><option>3.6.0</option><option>3.5.1</option><option>3.4.1</option><option>3.3.1</option></select><button class="more-filter" id="more-filter" type="button" aria-expanded="false">更多筛选 <svg class="more-filter-chevron" width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true"><path d="m3.5 6 4.5 4 4.5-4" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"/></svg></button></div><div class="extra-filters" id="extra-filters"><label>事件数 ≥ <input type="number" min="0" id="event-min" placeholder="最小值"></label><label>最近活跃 <input type="date" id="active-date"></label><button class="outline-btn" id="clear-filter">清空筛选</button></div></section><section class="panel users-panel"><div class="panel-heading users-heading"><div class="users-heading-copy"><h2>用户列表</h2><span id="user-count">全部 · 用户总数 57261 · 第 1 页 100 条</span></div><div class="users-heading-actions"><button class="outline-btn" id="page-prev" type="button" disabled>上一页</button><button class="outline-btn" id="page-next" type="button">下一页</button><button class="outline-btn refresh-users" id="page-refresh" type="button">⟳ 刷新</button></div></div><div class="table-wrap"><table class="data-table users-table"><colgroup><col style="width:15%"><col style="width:8%"><col style="width:12%"><col style="width:11%"><col style="width:9%"><col style="width:14%"><col style="width:7%"><col style="width:15%"><col style="width:9%"></colgroup><thead><tr><th>用户 ID</th><th>平台</th><th>品牌 / 机型</th><th>设备型号</th><th>App 版本</th><th>设备 ID</th><th>事件数</th><th>最近活跃</th><th>操作</th></tr></thead><tbody id="user-rows"></tbody></table></div></section>`);
  const render=({resetPage=false}={})=>{
    if(resetPage)pageNumber=1;
    const query=$('#user-search').value.trim().toLowerCase();
    const platform=$('#platform').value,model=$('#model').value,brand=$('#brand').value;
    const region=$('#region').value==='placeholder'?'':$('#region').value;
    const version=$('#version').value,min=Number($('#event-min').value||0),activeDate=$('#active-date').value;
    const filtered=users.filter(user=>(!query||[user[1],user[2],user[8]].some(value=>value.toLowerCase().includes(query)))&&(!platform||user[3]===platform)&&(!model||user[6]===model)&&(!brand||user[4]===brand)&&(!region||user[12]===region)&&(!version||user[7]===version)&&Number(user[9])>=min&&(!activeDate||user[10].slice(0,10)>=activeDate)&&(!window.momcozyDateIncludes||window.momcozyDateIncludes(user[10])));
    const pageCount=Math.max(1,Math.ceil(filtered.length/pageSize));
    pageNumber=Math.min(pageNumber,pageCount);
    const pageRows=filtered.slice((pageNumber-1)*pageSize,pageNumber*pageSize);
    $('#user-rows').innerHTML=pageRows.length?userRows(pageRows):'<tr><td colspan="9" class="empty">没有找到符合条件的用户</td></tr>';
    const rangeLabel=$('.date-status')?.textContent||'全部';
    $('#user-count').textContent=`${rangeLabel} · 用户总数 ${filtered.length} · 第 ${pageNumber} 页 ${pageRows.length} 条`;
    $('#user-count').title=$('#user-count').textContent;
    $('#page-prev').disabled=pageNumber===1;
    $('#page-next').disabled=pageNumber>=pageCount;
    bindUserButtons();
  };
  ['platform','model','brand','region','version','event-min','active-date'].forEach(id=>$('#'+id).onchange=()=>render({resetPage:true}));
  $('#search-btn').onclick=()=>render({resetPage:true});
  $('#user-search').onkeydown=event=>{if(event.key==='Enter')render({resetPage:true})};
  $('#more-filter').onclick=()=>{
    const open=$('#extra-filters').classList.toggle('open');
    $('#more-filter').setAttribute('aria-expanded',String(open));
  };
  $('#clear-filter').onclick=()=>{['platform','model','brand','region','version','event-min','active-date','user-search'].forEach(id=>{$('#'+id).value=id==='region'?'placeholder':''});render({resetPage:true})};
  window.addEventListener('date-range-change',()=>render({resetPage:true}));
  $('#page-prev').onclick=()=>{if(pageNumber>1){pageNumber--;render()}};
  $('#page-next').onclick=()=>{pageNumber++;render()};
  $('#page-refresh').onclick=()=>{render();toast('用户列表已刷新')};
  $('#notice').onclick=()=>modal('<h2>通知</h2><p>有 2 条未读通知（界面演示）。</p>');
  render();
}
function bindUserButtons(){$$('[data-user]').forEach(b=>b.onclick=()=>{sessionStorage.setItem('selectedUser',b.dataset.user);sessionStorage.setItem('momcozy-user-date-reset-on-entry','1');location.href='user-track.html'})}
const sessions=[['2026-10-26 21:27:12',160,145,305,'22m 16s','吸吮',8,0,3,'用户手动结束','正常','完整'],['2026-10-26 16:03:45',120,98,218,'18m 42s','按摩',6,1,2,'达到目标','正常','完整'],['2026-10-26 11:12:30',210,186,356,'25m 11s','吸吮',12,0,4,'用户手动结束','预奶检测','完整'],['2026-10-25 20:45:18',95,102,197,'16m 20s','混合',4,2,1,'用户手动结束','正常','完整'],['2026-10-25 08:30:54',180,172,352,'28m 36s','吸吮',10,1,3,'长时间无流量','流量过低','完整'],['2026-10-24 22:18:03',140,132,272,'20m 18s','按摩',7,0,2,'用户手动结束','正常','部分缺失']];
const extraSessionStarts=[
  '2026-10-24 07:48:00','2026-10-23 19:35:42','2026-10-23 08:10:16','2026-10-22 20:14:08',
  '2026-10-22 09:06:31','2026-10-21 21:40:20','2026-10-21 08:25:13','2026-10-20 19:50:06'
];
for(let day=20;day>=1;day--){
  if(day===20)extraSessionStarts.push('2026-10-20 08:16:23');
  else if(day>=12){
    extraSessionStarts.push(`2026-10-${String(day).padStart(2,'0')} 20:${String((day*7)%60).padStart(2,'0')}:12`);
    extraSessionStarts.push(`2026-10-${String(day).padStart(2,'0')} 08:${String((day*11)%60).padStart(2,'0')}:35`);
  }else extraSessionStarts.push(`2026-10-${String(day).padStart(2,'0')} 19:${String((day*9)%60).padStart(2,'0')}:24`);
}
extraSessionStarts.forEach((started,index)=>{
  const mode=['吸吮','按摩','混合'][index%3];
  const status=index===11?'预奶检测':index===25?'流量过低':'正常';
  sessions.push([started,0,0,0,'0m 00s',mode,0,index%5===0?1:0,0,index%9===0?'达到目标':'用户手动结束',status,index%13===0?'部分缺失':'完整']);
});
// Keep the 42 example Sessions aligned with the charts while giving their trends
// uneven, broad rises and falls instead of a repeated modulo pattern.
function organicSeries(anchors,index){
  let segment=anchors.findIndex((point,i)=>i<anchors.length-1&&index<=anchors[i+1][0]);
  if(segment<0)segment=anchors.length-2;
  const [start,value]=anchors[segment],[end,next]=anchors[segment+1];
  const t=Math.max(0,Math.min(1,(index-start)/(end-start)));
  const eased=t*t*(3-2*t);
  return value+(next-value)*eased;
}
const milkTrend=[[0,305],[4,266],[9,318],[15,241],[20,267],[24,226],[30,306],[34,284],[38,365],[41,326]];
const sideTrend=[[0,.525],[8,.54],[15,.51],[23,.56],[30,.52],[38,.55],[41,.53]];
const durationTrend=[[0,22+16/60],[5,18.8],[11,24.5],[17,20.2],[23,26.1],[29,22.7],[36,28.2],[41,24.4]];
const adjustTrend=[[0,8],[6,5],[13,10],[19,7],[24,11],[31,6],[37,10],[41,8]];
const modeTrend=[[0,3],[7,2],[14,4],[21,3],[28,5],[35,2],[41,4]];
sessions.forEach((row,index)=>{
  const total=Math.round(organicSeries(milkTrend,index));
  const left=Math.round(total*organicSeries(sideTrend,index));
  const seconds=Math.round(organicSeries(durationTrend,index)*60);
  row[1]=left;row[2]=total-left;row[3]=total;
  row[4]=`${Math.floor(seconds/60)}m ${String(seconds%60).padStart(2,'0')}s`;
  row[6]=Math.round(organicSeries(adjustTrend,index));
  row[8]=Math.round(organicSeries(modeTrend,index));
});
const chartSessionStarts=sessions.slice(0,14).map(session=>session[0]);
function kpi(icon,label,val,change,good=false){return `<div class="kpi"><span class="kpi-icon">${icon}</span><div><label>${label} ⓘ</label><strong>${val}</strong><small>较上周期 &nbsp;<b class="${good?'fall':'rise'}">${change} ${good?'↓':'↑'}</b></small></div></div>`}
function sessionRows(rows){return rows.map((s,i)=>`<tr data-session-row="${sessions.indexOf(s)}"><td class="session-select-cell"><input class="session-check" type="checkbox" value="${sessions.indexOf(s)}" aria-label="选择 ${s[0]} 的 Session"></td><td>${s[0]}</td><td>${s[1]}</td><td>${s[2]}</td><td>${s[3]}</td><td>${s[4]}</td><td>${s[5]}</td><td>${s[6]}</td><td>${s[7]}</td><td>${s[8]}</td><td>${s[9]}</td><td><span class="status-pill ${s[10]==='正常'?'good':s[10]==='流量过低'?'bad':'warn'}">${s[10]}</span></td><td><span class="status-pill ${s[11]==='完整'?'good':'warn'}">${s[11]}</span></td><td><button class="row-btn" data-session="${sessions.indexOf(s)}">查看详情</button></td></tr>`).join('')}
function updateTrackKpis(rows){
  const cards=$$('.kpi-grid .kpi');
  if(!cards.length)return;
  const total=rows.reduce((sum,row)=>sum+row[3],0);
  const durations=rows.map(row=>{const match=row[4].match(/(\d+)m\s+(\d+)s/);return match?Number(match[1])*60+Number(match[2]):0});
  const seconds=durations.reduce((sum,value)=>sum+value,0);
  const averageSeconds=rows.length?Math.round(seconds/rows.length):0;
  const values=[`${rows.length} 次`,`${total.toLocaleString('en-US')} ml`,`${rows.length?Math.round(total/rows.length):0} ml`,`${Math.floor(averageSeconds/60)}m ${String(averageSeconds%60).padStart(2,'0')}s`,`${seconds?(total/(seconds/60)).toFixed(1):'0.0'} ml/min`,String(rows.filter(row=>row[10]!=='正常').length)];
  cards.forEach((card,index)=>{
    card.querySelector('strong').textContent=values[index];
    const note=card.querySelector('small');
    if(!note.dataset.original)note.dataset.original=note.innerHTML;
    note.innerHTML=rows.length===sessions.length?note.dataset.original:'按当前筛选结果统计';
  });
}
function miniChart(type){let W=460,H=180,L=43,R=10,T=18,B=31, plotW=W-L-R,plotH=H-T-B;let grid=[0,1,2,3,4].map(i=>`<line x1="${L}" y1="${T+i*plotH/4}" x2="${W-R}" y2="${T+i*plotH/4}" stroke="#eaf0fb"/><text x="${L-12}" y="${T+i*plotH/4+4}" text-anchor="end" fill="#6680b1" font-size="10">${type==='bars'?20-i*5:type==='duration'?40-i*10:800-i*200}</text>`).join('');let xs=Array.from({length:14},(_,i)=>L+i*plotW/13);let xlabel=xs.filter((_,i)=>i%2===0).map((x,j)=>{const started=chartSessionStarts[j*2];return `<text x="${x}" y="${H-17}" text-anchor="middle" fill="#5874aa" font-size="9"><tspan x="${x}">${started.slice(5,10).replace('-', '/')}</tspan><tspan x="${x}" dy="10">${started.slice(11,16)}</tspan></text>`}).join('');let out=`<svg class="mini-chart" viewBox="0 0 ${W} ${H}" preserveAspectRatio="none" data-mini="${type}">${grid}<line x1="${L}" y1="${T+plotH}" x2="${W-R}" y2="${T+plotH}" stroke="#eaf0fb"/>${xlabel}`;if(type==='bars'){let vals=[8,13,9,13,9,12,12,8,8,11,7,10,8,10],line=[2.5,5.8,3.8,1.7,2,6.5,6,2.7,4.7,1.7,4.1,1.5,3.9,3.5];out+=vals.map((v,i)=>`<rect x="${xs[i]-7}" y="${T+plotH-v/20*plotH}" width="14" height="${v/20*plotH}" rx="4" fill="url(#barGrad)"/>`).join('');out+=poly(line,'#7425ff',20);out+=`<defs><linearGradient id="barGrad" x1="0" y1="0" x2="0" y2="1"><stop stop-color="#6aa6ff"/><stop offset="1" stop-color="#dcecff"/></linearGradient></defs>`}else if(type==='duration'){out+=poly([18,25,19,18,14,14,22,18,16,17,14,20,15,17],'#6a23ff',40)}else{out+=poly([400,560,450,310,340,210,320,550,330,290,510,450,550,400],'#f52ed5',800);out+=poly([220,320,190,160,170,120,180,310,170,200,270,220,320,290],'#0756ff',800);out+=poly([140,240,130,100,80,150,140,210,110,140,120,100,200,140],'#6c23ff',800)}out+=type==='milk'?`<g class="static-tip"><rect x="210" y="31" width="125" height="83" rx="8" fill="white" filter="drop-shadow(0px 3px 7px #9aacc666)"/><text x="221" y="49" font-size="11" font-weight="700">Session 07</text><text x="221" y="68" font-size="10" fill="#e528d0">■ 总奶量 320 ml</text><text x="221" y="85" font-size="10" fill="#0756ff">■ 左侧奶量 180 ml</text><text x="221" y="102" font-size="10" fill="#6524ef">■ 右侧奶量 140 ml</text></g>`:type==='duration'?`<g class="static-tip"><rect x="205" y="35" width="102" height="50" rx="8" fill="white" filter="drop-shadow(0px 3px 7px #9aacc666)"/><text x="215" y="54" font-size="11" font-weight="700">Session 07</text><text x="215" y="72" font-size="10">时长 22 min</text></g>`:`<g class="static-tip"><rect x="200" y="4" width="118" height="58" rx="8" fill="white" filter="drop-shadow(0px 3px 7px #9aacc666)"/><text x="211" y="22" font-size="11" font-weight="700">Session 07</text><text x="211" y="39" font-size="10" fill="#0756ff">■ 调档次数 12</text><text x="211" y="55" font-size="10" fill="#7425ff">■ 模式切换次数 6</text></g>`;return out+'</svg>';function poly(vals,color,max){let pts=vals.map((v,i)=>[xs[i],T+plotH-v/max*plotH]);return `<polyline points="${pts.map(p=>p.join(',')).join(' ')}" fill="none" stroke="${color}" stroke-width="2"/>${pts.map((p,i)=>`<circle cx="${p[0]}" cy="${p[1]}" r="3" fill="${color}" stroke="white" stroke-width="1" data-tip="Session ${String(i+1).padStart(2,'0')}<br>${type==='duration'?'时长 '+vals[i]+' min':type==='bars'?'次数 '+vals[i]: '奶量 '+vals[i]+' mL'}"/>`).join('')}`}}
function chartCard(title,type,tabs=false){return `<section class="panel chart-panel"><div class="chart-title"><h3>${title} ⓘ</h3>${tabs?'<div class="tabs" id="milk-tabs"><button data-milk="left">左</button><button data-milk="right">右</button><button class="selected" data-milk="total">总量</button></div>':''}<select class="chart-range" aria-label="图表显示范围"><option value="scope">当前时间范围</option><option value="7">近 7 次</option><option value="14">近 14 次</option><option value="30">近 30 次</option></select></div>${miniChart(type)}</section>`}
function trackPage(){shell(`${topbar()}<section class="panel track-summary"><div class="summary-field"><label>用户ID</label><div class="summary-user"><span class="user-avatar" style="background:#315dff">D</span><span><strong>df737c09...45ae</strong><small>user@email.com</small></span></div></div><div class="summary-field"><label>平台</label><span class="platform-pill android">Android</span></div><div class="summary-field"><label>App 版本</label><strong>3.6.0</strong></div><div class="summary-field"><label>设备ID</label><strong>3c12b79c...9e8c</strong></div><div class="summary-field"><label>设备型号</label><strong>Air1</strong></div><div class="summary-field"><label>时间范围</label><select class="summary-date" id="track-date"><option>▦　2026-10-01 ～ 2026-10-26</option><option>▦　最近 7 天</option><option>▦　最近 30 天</option></select></div><div class="summary-field"><a class="link-blue" href="index.html">←　返回用户列表</a></div></section><div class="kpi-grid">${kpi('♧','吸奶次数','42 次','+16%')}${kpi('♙','总奶量','9,860 ml','+12%')}${kpi('▥','单次平均奶量','235 ml','+8%')}${kpi('◷','平均吸奶时长','18m 24s','−6%',true)}${kpi('∿','平均流速','12.8 ml/min','+5%')}${kpi('⚠','异常 Session 数量','3','−40%',true)}</div><div class="chart-grid">${chartCard('奶量变化','milk',true)}${chartCard('吸奶时长变化','duration')}${chartCard('调档及模式切换次数变化','bars')}</div><section class="panel session-list"><div class="section-bar"><h2>Session 列表 <small id="session-count">（共 42 条）</small></h2><div class="session-filters"><span>奶量</span><select id="milk-filter"><option value="">请选择</option><option value="high">≥300 ml</option><option value="low">＜300 ml</option></select><span>时长</span><select id="duration-filter"><option value="">请选择</option><option value="long">≥20 分钟</option><option value="short">＜20 分钟</option></select><span>异常状态</span><select id="status-filter"><option value="">请选择</option><option>正常</option><option>预奶检测</option><option>流量过低</option></select><button class="outline-btn" id="reset-session">重置</button><button class="primary-btn session-export" id="export-sessions" type="button">导出列表</button></div></div><div class="table-wrap session-scroll"><table class="data-table session-table"><colgroup><col style="width:3%"><col style="width:11%"><col style="width:6%"><col style="width:6%"><col style="width:7%"><col style="width:7%"><col style="width:7%"><col style="width:6%"><col style="width:7%"><col style="width:8%"><col style="width:9%"><col style="width:8%"><col style="width:8%"><col style="width:7%"></colgroup><thead><tr><th class="session-select-cell"><input id="select-all-sessions" type="checkbox" aria-label="全选当前列表"></th>${['开始时间','左奶量 (ml)','右奶量 (ml)','总奶量 (ml)','吸奶时长','开始模式','调档次数','漏气事件数量','模式调节数量','结束原因','异常情况','数据完整性','操作'].map(x=>`<th>${x}</th>`).join('')}</tr></thead><tbody id="session-rows">${sessionRows(sessions)}</tbody></table></div><div class="session-pager"><span id="session-page-caption">第 1 页 · 显示 1–42 / 共 42 条</span><span>每页 50 条</span></div></section>`);const selectedSessions=new Set();let visibleSessions=sessions;const refreshSessionSelection=()=>{const boxes=$$('#session-rows .session-check');boxes.forEach(box=>{box.checked=selectedSessions.has(Number(box.value));box.closest('tr').classList.toggle('is-selected',box.checked)});const all=$('#select-all-sessions');all.checked=boxes.length>0&&boxes.every(box=>box.checked);all.indeterminate=boxes.some(box=>box.checked)&&!all.checked;$('#export-sessions').textContent=selectedSessions.size?`导出已选 (${selectedSessions.size})`:'导出列表'};const apply=()=>{let milk=$('#milk-filter').value,dur=$('#duration-filter').value,status=$('#status-filter').value;let rows=sessions.filter(s=>(!milk||(milk==='high'?s[3]>=300:s[3]<300))&&(!dur||(dur==='long'?parseInt(s[4])>=20:parseInt(s[4])<20))&&(!status||s[10]===status)&&(!window.momcozyDateIncludes||window.momcozyDateIncludes(s[0]))&&(!window.momcozyTrackDateIncludes||window.momcozyTrackDateIncludes(s[0])));visibleSessions=rows;window.momcozyVisibleSessions=()=>rows;selectedSessions.clear();$('#session-rows').innerHTML=rows.length?sessionRows(rows):'<tr><td colspan="14" class="empty">没有匹配的 Session</td></tr>';$('#session-count').textContent=`（共 ${rows.length} 条）`;$('#session-page-caption').textContent=rows.length?`第 1 页 · 显示 1–${rows.length} / 共 ${rows.length} 条`:'第 1 页 · 显示 0 / 共 0 条';bindSessionButtons();refreshSessionSelection();updateTrackKpis(rows);window.momcozyRefreshTrackCharts?.()};['milk-filter','duration-filter','status-filter'].forEach(id=>$('#'+id).onchange=apply);window.addEventListener('date-range-change',apply);window.addEventListener('track-date-change',apply);$('#reset-session').onclick=()=>{['milk-filter','duration-filter','status-filter'].forEach(id=>$('#'+id).value='');apply()};$('#session-rows').addEventListener('change',event=>{const box=event.target.closest('.session-check');if(!box)return;const index=Number(box.value);if(box.checked)selectedSessions.add(index);else selectedSessions.delete(index);refreshSessionSelection()});$('#select-all-sessions').onchange=event=>{visibleSessions.forEach(row=>{const index=sessions.indexOf(row);if(event.target.checked)selectedSessions.add(index);else selectedSessions.delete(index)});refreshSessionSelection()};$('#export-sessions').onclick=()=>{const rows=selectedSessions.size?[...selectedSessions].sort((a,b)=>a-b).map(index=>sessions[index]):visibleSessions;if(!rows.length){toast('当前没有可导出的 Session');return}const columns=['开始时间','左奶量 (ml)','右奶量 (ml)','总奶量 (ml)','吸奶时长','开始模式','调档次数','漏气事件数量','模式调节数量','结束原因','异常情况','数据完整性'];const csv=[columns,...rows].map(cells=>cells.map(value=>'"'+String(value).replaceAll('"','""')+'"').join(',')).join('\r\n');const blob=new Blob(['\ufeff',csv],{type:'text/csv;charset=utf-8'}),url=URL.createObjectURL(blob),link=document.createElement('a');link.href=url;link.download=selectedSessions.size?'sessions-selected.csv':'sessions-filtered.csv';link.click();setTimeout(()=>URL.revokeObjectURL(url),1000);toast(`已导出 ${rows.length} 条 Session`)};$$('.chart-range').forEach(s=>s.onchange=()=>toast('图表范围已切换（当前显示示例数据）'));$$('[data-milk]').forEach(b=>b.onclick=()=>{$$('[data-milk]').forEach(x=>x.classList.remove('selected'));b.classList.add('selected');toast('已切换到'+b.textContent+'奶量视图')});bindSessionButtons();let u=users[Number(sessionStorage.getItem('selectedUser')||0)]||users[0];if(u!==users[0]){let fields=$$('.summary-field');fields[0].querySelector('.user-avatar').textContent=u[0];fields[0].querySelector('.user-avatar').style.background=u[11];fields[0].querySelector('strong').textContent=u[1];fields[0].querySelector('small').textContent=u[2];fields[1].querySelector('.platform-pill').textContent=u[3];fields[1].querySelector('.platform-pill').className='platform-pill '+u[3].toLowerCase();fields[2].querySelector('strong').textContent=u[7];fields[3].querySelector('strong').textContent=u[8];fields[4].querySelector('strong').textContent=u[6]}}
function bindSessionButtons(){$$('[data-session]').forEach(b=>b.onclick=()=>{sessionStorage.removeItem('selectedChartSession');sessionStorage.setItem('selectedSession',b.dataset.session);location.href='session-analysis.html'})}
function bindMiniTips(){let tip=document.createElement('div');tip.className='chart-tooltip';document.body.append(tip);$$('[data-tip]').forEach(n=>{n.style.cursor='pointer';n.addEventListener('mouseenter',e=>{tip.innerHTML=n.dataset.tip;tip.classList.add('show')});n.addEventListener('mousemove',e=>{tip.style.left=e.pageX+12+'px';tip.style.top=e.pageY-25+'px'});n.addEventListener('mouseleave',()=>tip.classList.remove('show'))})}
function metric(icon,label,value,unit='',sub=''){return `<div class="metric"><span class="metric-icon">${icon}</span><span><label>${label}</label><strong>${value}</strong> <small>${unit}</small>${sub?`<div class="metric-sub">${sub}</div>`:''}</span></div>`}
const mlToOz=ml=>(Number(ml)/29.5735295625).toFixed(1);
const flowToOz=mlPerMin=>(Number(mlPerMin)/29.5735295625).toFixed(2);
function volumeMetric(left,right,total){return `<div class="metric metric-volume"><span class="metric-icon">♙</span><span class="metric-content"><label>左 / 右 / 本次累积奶量</label><span class="metric-values"><span>左 <strong data-volume="left">${left}</strong><small>ml</small></span><i></i><span>右 <strong data-volume="right">${right}</strong><small>ml</small></span><i></i><span>累积 <strong data-volume="total">${total}</strong><small>ml</small></span></span></span></div>`}
function selectedSessionRow(){const query=Number(new URLSearchParams(location.search).get('session'));if(Number.isInteger(query)&&query>=1&&sessions[query-1])return sessions[query-1];const stored=sessionStorage.getItem('selectedSession');return stored!==null?sessions[Number(stored)]||null:null}
function flowMetric(side,average,peak){return `<div class="metric metric-flow"><span class="metric-icon">♧</span><span class="metric-content"><label>${side}平均流速 / 峰值流速</label><span class="metric-values"><span><strong>${Number(average).toFixed(1)}</strong><small>ml/min</small></span><i></i><span><strong>${Number(peak).toFixed(1)}</strong><small>ml/min</small></span></span></span></div>`}

const letdownTemplate=[{start:70,end:175,strength:.65},{start:230,end:375,strength:1.5},{start:625,end:800,strength:1.05},{start:1030,end:1250,strength:1.35}];
function sessionDurationSeconds(){const match=selectedSessionRow()?.[4]?.match(/(\d+)m\s*(\d+)s/);return match?Number(match[1])*60+Number(match[2]):24*60+23}
function sessionLetdowns(){const ratio=sessionDurationSeconds()/(24*60+23);return letdownTemplate.map((item,index)=>({...item,index:index+1,start:Math.round(item.start*ratio),end:Math.round(item.end*ratio)}))}
const sessionTimeLabel=seconds=>`${String(Math.floor(seconds/60)).padStart(2,'0')}:${String(seconds%60).padStart(2,'0')}`;
function detailAxis(y1,y2){const duration=sessionDurationSeconds(),ticks=[];for(let seconds=0;seconds<duration-60;seconds+=120)ticks.push(seconds);ticks.push(duration);return ticks.map(seconds=>{const x=120+seconds/duration*856;return `<line x1="${x}" y1="${y1}" x2="${x}" y2="${y2}" stroke="#eef2fa"/><text x="${x}" y="29" text-anchor="middle" fill="#1e376e" font-size="9">${sessionTimeLabel(seconds)}</text>`}).join('')}
function stepPoints(vals,x0,y0,width,height,min,max){return vals.map((v,i)=>`${x0+(i/(vals.length-1))*width},${y0+height-(v-min)/(max-min)*height}`).join(' ')}
function smoothSeriesTangents(values){
  const slopes=values.slice(1).map((value,index)=>value-values[index]);
  return values.map((_,index)=>{
    if(index===0)return slopes[0]||0;
    if(index===values.length-1)return slopes.at(-1)||0;
    const previous=slopes[index-1],next=slopes[index];
    return previous*next<=0?0:2*previous*next/(previous+next);
  });
}
function smoothSeriesValueAt(values,fraction){
  if(values.length<2)return values[0]??0;
  const position=Math.max(0,Math.min(1,fraction))*(values.length-1);
  const index=Math.min(values.length-2,Math.floor(position)),t=position-index;
  const tangents=smoothSeriesTangents(values),a=values[index],b=values[index+1];
  return (2*t*t*t-3*t*t+1)*a+(t*t*t-2*t*t+t)*tangents[index]+(-2*t*t*t+3*t*t)*b+(t*t*t-t*t)*tangents[index+1];
}
window.momcozySmoothSeriesValueAt=smoothSeriesValueAt;
function smoothSeriesPath(values,x0,y0,width,height,max){
  if(!values.length)return '';
  const x=index=>x0+index/(values.length-1)*width;
  const y=value=>y0+height-value/max*height;
  if(values.length===1)return `M ${x0} ${y(values[0])}`;
  const tangents=smoothSeriesTangents(values),step=width/(values.length-1);
  return `M ${x0} ${y(values[0])} `+values.slice(0,-1).map((value,index)=>`C ${x(index)+step/3} ${y(value+tangents[index]/3)} ${x(index+1)-step/3} ${y(values[index+1]-tangents[index+1]/3)} ${x(index+1)} ${y(values[index+1])}`).join(' ');
}
function powerAdjustmentDots(vals,color){return vals.map((value,index)=>index===0||value!==vals[index-1]?`<circle class="power-adjustment-dot" cx="${120+index/(vals.length-1)*856}" cy="${180+73-(value-1)/11*73}" r="3" fill="${color}" stroke="white" stroke-width="1"/>`:'').join('')}
function detailPower(){let a=[3,4,4,5,6,7,6,6,6,7,8,9,9,9,9,8,8,8,8,8,5,5,3,3,3,4,5,6,7,8,9,8,8,8,7,6,6,6,6,7,7,5,5,5,5,6,6,7,7,7,6,6,8,8,8,6,6,6,6,6],b=[2,3,3,3,4,4,4,4,4,4,5,5,5,5,6,6,6,6,6,5,5,3,3,3,3,3,4,4,5,6,6,6,6,6,5,5,5,5,5,4,4,4,4,4,5,5,5,5,5,5,5,3,3,3,4,4,4,4,4,4];window.momcozyDetailData={powerL:a,powerR:b};return `<svg class="detail-svg interactive-detail" viewBox="0 0 1000 280" preserveAspectRatio="xMinYMin meet"><defs><linearGradient id="bandBlue"><stop stop-color="#cfe5ff"/><stop offset="1" stop-color="#dbeafe"/></linearGradient><linearGradient id="bandPurple"><stop stop-color="#e3d8ff"/><stop offset="1" stop-color="#e7d8fd"/></linearGradient></defs>${detailAxis(32,257)}<rect x="120" y="52" width="856" height="28" fill="#d5e8ff"/><text x="548" y="71" text-anchor="middle" fill="#0a1b32" font-weight="700" font-size="10">Milk Boost（高效泌乳）</text><rect x="120" y="92" width="200" height="28" rx="4" fill="url(#bandBlue)"/><rect x="320" y="92" width="248" height="28" rx="4" fill="url(#bandPurple)"/><rect x="568" y="92" width="220" height="28" rx="4" fill="url(#bandBlue)"/><rect x="788" y="92" width="188" height="28" rx="4" fill="url(#bandPurple)"/><text x="220" y="111" text-anchor="middle" fill="#0756ff" font-weight="700" font-size="10">刺激模式</text><text x="444" y="111" text-anchor="middle" fill="#6925ec" font-weight="700" font-size="10">吸乳模式</text><text x="678" y="111" text-anchor="middle" fill="#0756ff" font-weight="700" font-size="10">混合模式</text><text x="882" y="111" text-anchor="middle" fill="#6925ec" font-weight="700" font-size="10">吸乳模式</text>${[
  [120,140,'slow','#dcecff','#1458d3'],[260,210,'regular','#e8e1ff','#6428dc'],
  [470,210,'fast','#d9ecff','#0756ff'],[680,140,'regular','#e8e1ff','#6428dc'],
  [820,156,'slow','#dcecff','#1458d3']
].map(([x,width,label,fill,color])=>`<rect x="${x}" y="130" width="${width}" height="28" rx="4" fill="${fill}"/><text x="${x+width/2}" y="148" text-anchor="middle" fill="${color}" font-weight="700" font-size="10">${label}</text>`).join('')}<text x="10" y="74" font-size="10" font-weight="700">韵律程序　ⓘ</text><text x="10" y="111" font-size="10" font-weight="700">模式　ⓘ</text><text x="10" y="148" font-size="10" font-weight="700">速度档位 ⓘ</text><text x="10" y="163" font-size="9" fill="#5b6f9d">左右同步</text><text x="10" y="204" font-size="10" font-weight="700">左右吸力 ⓘ</text><text x="10" y="222" font-size="10" font-weight="700">档位</text><text x="10" y="240" font-size="10">(1–12档)</text>${[1,6,12].map((n,i)=>`<text x="100" y="${248-i*31}" fill="#314d8f" font-size="9">${n}</text>`).join('')}<line x1="120" y1="253" x2="976" y2="253" stroke="#e1e9f5"/><line x1="120" y1="219" x2="976" y2="219" stroke="#e1e9f5"/><line x1="120" y1="185" x2="976" y2="185" stroke="#e1e9f5"/>${powerAdjustmentDots(b,"#ff8500")}${powerAdjustmentDots(a,"#ff271a")}<g class="static-detail-hover"><line x1="570" y1="37" x2="570" y2="256" stroke="#506993" stroke-dasharray="5 3"/><rect x="548" y="11" width="45" height="22" rx="5" fill="#60718c"/><text x="570" y="26" text-anchor="middle" fill="white" font-size="9" font-weight="700">12:30</text><circle cx="570" cy="213" r="4" fill="#ff271a"/><rect x="588" y="160" width="190" height="114" rx="8" fill="white" filter="drop-shadow(0px 4px 8px #9ba9bf88)"/><text x="600" y="178" font-weight="700" font-size="10">12:30</text><text x="600" y="195" font-size="9">模式　混合模式</text><text x="600" y="212" font-size="9">韵律　Milk Boost（高效泌乳）</text><text x="600" y="229" font-size="9">速度档位　fast（左右同步）</text><circle cx="603" cy="244" r="4" fill="#ff271a"/><text x="613" y="248" font-size="9">L 左侧档位　8</text><circle cx="603" cy="261" r="4" fill="#ff8500"/><text x="613" y="265" font-size="9">R 右侧档位　6</text></g><rect x="120" y="32" width="856" height="222" fill="transparent" class="chart-hit"/></svg>`}
function detailFlow(){
  const durationSeconds=sessionDurationSeconds(),letdowns=sessionLetdowns();
  const source=[5,5,6,6.5,7.2,8,6.5,5.4,7.4,8.4,8.8,8.2,5.3,5.8,6.9,7.5,7.2,8.1,6.5,6.1,5.9,6.1,6.6,7.8,8.1,8,7.5,6.5,6.1,6.5,7.8,6.9,6.4,5.8,6.4,7.5,8.1,7.8,7,6.2,6.4,7.1,7.2,7.8,7.5,6.3,6.1,6.5,6.2];
  const rightSource=source.map((value,index)=>Math.max(2,value+Math.sin(index*1.4)*.7-.6));
  const sample=selectedSessionRow(),finalLeft=(sample?.[1]??68)/29.5735295625,finalRight=(sample?.[2]??52)/29.5735295625;
  const bump=(index,center,width)=>Math.exp(-Math.pow((index-center)/width,2));
  // Variable collection periods and a short pause make the cumulative lines rise at realistic, uneven rates.
  const rawL=[0],rawR=[0];
  for(let index=1;index<source.length;index++){
    const elapsed=index/(source.length-1)*durationSeconds;
    const pulse=elapsed<durationSeconds*68/1463?0:.12+letdowns.reduce((sum,item)=>{const center=(item.start+item.end)/2/durationSeconds*(source.length-1),width=(item.end-item.start)/durationSeconds*(source.length-1)*.58;return sum+item.strength*bump(index,center,width)},0);
    const pause=index>=28&&index<=31?.06:1;
    rawL.push(rawL.at(-1)+source[index]*pulse*pause*(.86+.14*Math.sin(index*.72)));
    rawR.push(rawR.at(-1)+rightSource[index]*pulse*pause*(.85+.15*Math.cos(index*.58)));
  }
  const sampleMinutes=durationSeconds/60/(source.length-1);
  const smoothRates=values=>{
    const firstActive=values.findIndex(value=>value>0);
    const sigma=1.8,radius=Math.ceil(sigma*3);
    return values.map((_,index)=>{
      if(index<firstActive)return 0;
      let weighted=0,weightTotal=0;
      for(let sampleIndex=Math.max(0,index-radius);sampleIndex<=Math.min(values.length-1,index+radius);sampleIndex++){
        const distance=(index-sampleIndex)/sigma,weight=Math.exp(-.5*distance*distance);
        weighted+=values[sampleIndex]*weight;weightTotal+=weight;
      }
      return weighted/weightTotal;
    });
  };
  const buildSeries=(raw,finalVolume)=>{
    const rawRates=raw.map((value,index)=>index?value-raw[index-1]:0);
    const rates=smoothRates(rawRates),totalRate=rates.reduce((sum,value)=>sum+value,0);
    const scale=finalVolume/totalRate,volume=[0];
    for(let index=1;index<rates.length;index++)volume.push(volume.at(-1)+rates[index]*scale);
    return {volume,flow:rates.map(value=>value*scale/sampleMinutes)};
  };
  const leftSeries=buildSeries(rawL,finalLeft),rightSeries=buildSeries(rawR,finalRight);
  const volumeL=leftSeries.volume,volumeR=rightSeries.volume;
  const volumeTotal=volumeL.map((value,index)=>value+volumeR[index]);
  const flowL=leftSeries.flow,flowR=rightSeries.flow;
  const flowMax=Math.max(.4,Math.ceil(Math.max(...flowL,...flowR)*10)/10),volumeMax=Math.ceil((finalLeft+finalRight)*1.12*2)/2;
  const x0=120,width=856;
  const line=(values,y,height,max,color)=>`<path d="${smoothSeriesPath(values,x0,y,width,height,max)}" fill="none" stroke="${color}" stroke-width="2" stroke-linecap="round"/>`;
  const areas=letdowns.map(item=>{const startX=120+item.start/durationSeconds*856,endX=120+item.end/durationSeconds*856;return `<rect class="letdown-band" data-letdown="${item.index}" x="${startX}" y="50" width="${endX-startX}" height="55" fill="#ddecff" opacity=".75"/>`}).join('');
  const eventSpecs=[
    {at:0,label:'佩戴确认',color:'#64799d',type:'device_wear_confirm_evt',field:'device'},
    {at:68,label:'开始吸奶',color:'#0756ff',type:'pump_start_evt',field:'session'},
    {at:405,label:'调档',color:'#ff8000',type:'pump_manual_adjust_evt',field:'suction_level'},
    {at:573,label:'切换模式',color:'#7a1efa',type:'pump_mode_change_evt',field:'pump_mode'},
    {at:891,label:'暂停',color:'#0756ff',type:'pump_pause_evt',field:'session'},
    {at:1058,label:'调档',color:'#ff8000',type:'pump_manual_adjust_evt',field:'suction_level'},
    {at:1463,label:'结束吸奶',color:'#0756ff',type:'pump_end_evt',field:'session'}
  ];
  const eventItems=eventSpecs.map(item=>({...item,at:Math.round(item.at/1463*durationSeconds)}));
  const events=eventItems.map(item=>{const x=120+item.at/durationSeconds*856;return `<circle cx="${x}" cy="240" r="3.5" fill="${item.color}" class="event-dot" data-event="${item.label}"/><text x="${x}" y="263" text-anchor="middle" fill="#304d86" font-size="9">${item.label}</text>`}).join('');
  const anomaly={start:Math.round(1050/1463*durationSeconds),end:Math.round(1160/1463*durationSeconds),side:'右侧',severity:'强漏',label:'右侧强漏',type:'pump_air_leak_evt',field:'air_leak'};
  const anomalyX=120+(anomaly.start+anomaly.end)/2/durationSeconds*856;
  const anomalyMark=`<rect x="${anomalyX-38}" y="275" width="76" height="17" rx="4" fill="#fff0f0"/><text x="${anomalyX}" y="287" text-anchor="middle" font-size="10" font-weight="700" fill="#f43b3b">⚠ 右侧强漏</text>`;
  Object.assign(window.momcozyDetailData,{flowL,flowR,volumeL,volumeR,volumeTotal,flowMax,volumeMax,letdowns,durationSeconds,events:eventItems,anomalies:[anomaly]});
  return `<svg class="detail-svg interactive-detail" viewBox="0 0 1000 320" preserveAspectRatio="xMinYMin meet"><defs><linearGradient id="flowFill" x1="0" y1="0" x2="0" y2="1"><stop stop-color="#c5f6eb" stop-opacity=".9"/><stop offset="1" stop-color="#f0fffb" stop-opacity=".2"/></linearGradient></defs>${detailAxis(32,315)}<text x="10" y="73" font-size="10" font-weight="700">奶液流速　ⓘ</text><text x="10" y="92" font-size="10">(oz/min)</text><text x="10" y="195" font-size="10" font-weight="700">累计奶量　ⓘ</text><text x="10" y="214" font-size="10">(oz)</text><text x="10" y="255" font-size="10" font-weight="700">操作事件　ⓘ</text><text x="10" y="287" font-size="10" font-weight="700">异常状态　ⓘ</text>${areas}<path d="${smoothSeriesPath(flowL,120,50,856,55,flowMax)} L 976 105 L 120 105 Z" fill="url(#flowFill)"/>${[0,1,2].map(index=>`<text x="100" y="${106-index*26}" fill="#314d8f" font-size="9">${(flowMax*index/2).toFixed(1)}</text>`).join('')}${line(flowL,50,55,flowMax,'#00bd65')}${line(flowR,50,55,flowMax,'#0b5fff')}<line x1="120" y1="105" x2="976" y2="105" stroke="#dfe9f6"/>${[0,1,2,3].map(index=>`<text x="100" y="${222-index*23}" fill="#314d8f" font-size="9">${(volumeMax*index/3).toFixed(1)}</text>`).join('')}${line(volumeL,145,78,volumeMax,'#00be75')}${line(volumeR,145,78,volumeMax,'#115dff')}${line(volumeTotal,145,78,volumeMax,'#9225fa')}<line x1="120" y1="223" x2="976" y2="223" stroke="#dfe9f6"/>${events}${anomalyMark}<rect x="120" y="32" width="856" height="270" fill="transparent" class="chart-hit"/></svg>`;
}
function detailPanel(){return `<aside class="panel event-pane" id="event-pane"><h2>原始事件详情 <button id="close-event">×</button></h2><span class="event-type">操作事件</span><dl class="event-info"><dt>相对时间</dt><dd>12:30</dd><dt>绝对时间</dt><dd>2026-10-26 08:00:30</dd><dt>事件 ID</dt><dd>evt_8a7d3c2e9f1</dd><dt>事件类型</dt><dd>pump_manual_adjust_evt</dd><dt>设备时间戳</dt><dd>2026-10-26 08:00:30.123</dd><dt>设备 ID</dt><dd>24590bf1...538b</dd><dt>来源</dt><dd>App</dd></dl><dl class="event-info"><dt>事件</dt><dd>pump_manual_adjust_evt</dd><dt>事件来源</dt><dd>local_device</dd><dt>事件类型</dt><dd>suction_level</dd><dt>动作摘要</dt><dd>吸力 L2/R2 → L3/R3</dd><dt>模式</dt><dd>混合模式</dd><dt>韵律选择</dt><dd>Milk Boost（高效泌乳）</dd><dt>速度档位</dt><dd>fast（左右同步）</dd></dl><div class="event-side"><h3>左侧 L</h3><div><span>模式</span>混合模式</div><div><span>漏气状态</span><mark>正常</mark></div><div><span>吸力档位值</span>iDelta_pwm　+2</div></div><div class="event-side right"><h3>右侧 R</h3><div><span>模式</span>混合模式</div><div><span>档位</span>3</div><div><span>漏气状态</span><mark>正常</mark></div><div><span>吸力档位值</span>iDelta_pwm　+1</div></div><button class="full-log" id="full-log">▣　查看完整日志 →</button></aside>`}
function sessionEventLog(){
  const start=new Date(document.body.dataset.sessionStartTime||'2026-10-26T07:48:00');
  const pad=n=>String(n).padStart(2,'0');
  const entries=[...(window.momcozyDetailData?.events||[]).map(item=>({at:item.at,type:item.type,label:item.label}))];
  for(const anomaly of window.momcozyDetailData?.anomalies||[]){
    entries.push({at:anomaly.start,type:anomaly.type,label:`${anomaly.side}${anomaly.severity}开始`});
    entries.push({at:anomaly.end,type:'pump_air_leak_recovered_evt',label:`${anomaly.side}${anomaly.severity}结束`});
  }
  return entries.sort((a,b)=>a.at-b.at).map(item=>{const date=new Date(start.getTime()+item.at*1000);return `${pad(date.getHours())}:${pad(date.getMinutes())}:${pad(date.getSeconds())}  ${item.type.padEnd(28)} ${item.label}`}).join('\n');
}
function sessionPage(){shell(`<header class="session-top"><div><h1>单次吸奶行为分析 <em>示意数据</em></h1><p class="session-identity"><span class="session-id">Session ID: S20261026-074800</span><span>用户 ID: <b class="session-header-user-id">df737c09...45ae</b></span><span>用户邮箱: <b class="session-header-email">user@email.com</b></span></p></div><div class="session-user"><span><label>用户ID</label><strong>df737c09...45ae</strong><small>user@email.com</small></span><span class="user-avatar" style="background:#0756ff">D</span></div></header><section class="panel session-meta"><div class="meta-cell"><label>设备型号</label><strong class="blue-text">Air 2</strong></div><div class="meta-cell"><label>左右侧</label><strong style="color:#7222eb">双侧</strong></div><div class="meta-cell"><label>开始时间</label><strong>2026-10-26 07:48:00</strong></div><div class="meta-cell"><label>结束时间</label><strong>2026-10-26 08:12:23</strong></div><div class="meta-cell"><label>App 版本</label><strong>3.6.0</strong></div><div class="meta-cell"><label>固件版本</label><strong>1.8.2</strong></div><div class="meta-cell"><label>数据完整性　ⓘ</label><span class="status-pill good">完整</span></div><div class="meta-actions"><a class="outline-btn" style="display:grid;place-items:center" href="user-track.html">←　返回Session列表</a><button class="primary-btn" id="export-analysis">♧　导出分析</button></div></section><section class="panel metric-strip">${volumeMetric(68,52,120)}${metric('◷','吸奶时间','24m 23s')}${flowMetric('左侧',5.4,9.2)}${flowMetric('右侧',6.8,9.2)}${metric('✦','奶阵数量',String(sessionLetdowns().length),'次')}${metric('⚙','档位调整次数','5','次')}${metric('⌘','模式切换次数','2','次')}${metric('◉','异常事件次数','1','次')}</section><div class="analysis-layout"><div class="analysis-main"><section class="panel detail-chart"><div class="detail-header"><h2>韵律 / 模式 / 速度档位 / 左右吸力档位（示意数据）　ⓘ</h2><div class="detail-legend"><span><i class="legend-dot" style="background:#0756ff"></i>模式区间</span><span><i class="legend-dot" style="background:#8129f8"></i>档位区间</span><span><i class="legend-dot" style="background:#ff341d"></i>左右侧档位</span><span><i class="legend-dot" style="background:#ff8500"></i>右侧档位</span></div><div class="detail-tools"><select class="time-mode"><option>相对时间</option><option>绝对时间</option></select></div></div>${detailPower()}</section><section class="panel detail-chart lower"><div class="detail-header"><h2>奶液流速与累计奶量（示意数据）　ⓘ</h2><div class="detail-legend"><span><i class="legend-dot" style="background:#00bd65"></i>左侧流速</span><span><i class="legend-dot" style="background:#6c24ff"></i>右侧流速</span><span>⌄ 总奶量</span><span><i class="legend-range"></i>奶阵区间</span></div><div class="detail-tools"><select class="time-mode"><option>相对时间</option><option>绝对时间</option></select></div></div>${detailFlow()}</section></div>${detailPanel()}</div>`);$('#full-log').onclick=()=>modal(`<h2>原始事件</h2><p>当前 Session 的示例事件流</p><pre>${sessionEventLog()}</pre>`);$('#export-analysis').onclick=()=>{let blob=new Blob([`Session ID,S20261026-074800\n开始时间,2026-10-26 07:48:00\n结束时间,2026-10-26 08:12:23\n累计奶量,${mlToOz(selectedSessionRow()?.[3]??120)} oz\n档位调整次数,5\n模式切换次数,2`],{type:'text/csv;charset=utf-8'}),a=document.createElement('a');a.href=URL.createObjectURL(blob);a.download='session-analysis.csv';a.click();URL.revokeObjectURL(a.href);toast('分析 CSV 已导出')};$('#close-event').onclick=()=>{$('#event-pane').classList.add('hidden');$('.analysis-layout').style.gridTemplateColumns='1fr'};$$('.time-mode').forEach(s=>s.onchange=()=>toast('时间轴已切换为'+s.value));$$('.event-dot').forEach(dot=>dot.addEventListener('click',()=>{$('#event-pane').classList.remove('hidden');$('.analysis-layout').style.gridTemplateColumns='minmax(0,1fr) 268px';toast('已选中事件：'+dot.dataset.event)}));$$('.chart-hit').forEach(hit=>hit.addEventListener('click',()=>toast('当前时间点的详细数据已显示在右侧面板')));let u=users[Number(sessionStorage.getItem('selectedUser')||0)]||users[0];if(u!==users[0]){let card=$('.session-user');card.querySelector('strong').textContent=u[1];card.querySelector('small').textContent=u[2];card.querySelector('.user-avatar').textContent=u[0];card.querySelector('.user-avatar').style.background=u[11]}$('.session-header-user-id').textContent=$('.session-user strong').textContent;$('.session-header-email').textContent=$('.session-user small').textContent;let i=Number(sessionStorage.getItem('selectedSession')||0);if(sessionStorage.getItem('selectedSession')!==null&&!location.search&&sessions[i]){let s=sessions[i],start=s[0].replace(' ','T'),id='S'+start.replace(/[-:T]/g,'').slice(0,12);$('.session-top .session-id').textContent=`Session ID: ${id}`;$$('.session-meta .meta-cell strong')[2].textContent=s[0];const end=new Date(start);end.setSeconds(end.getSeconds()+sessionDurationSeconds());const pad=n=>String(n).padStart(2,'0');$$('.session-meta .meta-cell strong')[3].textContent=`${end.getFullYear()}-${pad(end.getMonth()+1)}-${pad(end.getDate())} ${pad(end.getHours())}:${pad(end.getMinutes())}:${pad(end.getSeconds())}`;document.body.dataset.sessionStartTime=start;[['left',s[1]],['right',s[2]],['total',s[3]]].forEach(([side,ml])=>{$(`[data-volume="${side}"]`).textContent=ml});$('.metric-strip .metric:nth-child(2) strong').textContent=s[4];$('.metric-strip .metric:nth-child(6) strong').textContent=s[6];$('.metric-strip .metric:nth-child(7) strong').textContent=s[8]}}
if(page==='users')usersPage();else if(page==='track')trackPage();else {
  sessionPage();
  const chart=window.momcozyDetailData;
  if(chart){
    const minutes=chart.durationSeconds/60;
    const values=[
      [chart.volumeL.at(-1)/minutes,Math.max(...chart.flowL)],
      [chart.volumeR.at(-1)/minutes,Math.max(...chart.flowR)]
    ];
    $$('.metric-flow').forEach((card,index)=>{
      const numbers=card.querySelectorAll('.metric-values strong');
      numbers[0].textContent=(values[index][0]*29.5735295625).toFixed(1);
      numbers[1].textContent=(values[index][1]*29.5735295625).toFixed(1);
    });
  }
}
