/* Shared demo interactions for the three screenshot reconstructions. */
(()=>{
  const dateKey='momcozy-date-range-v1';
  const trackDateKey='momcozy-user-date-range-v1';
  const trackEntryKey='momcozy-user-date-reset-on-entry';
  const noticeKey='momcozy-notices-read-v1';
  const byId=id=>document.getElementById(id);
  const q=(selector,root=document)=>root.querySelector(selector);
  const qa=(selector,root=document)=>[...root.querySelectorAll(selector)];
  const readRange=()=>{try{const saved=JSON.parse(sessionStorage.getItem(dateKey)||'null');return saved&&['all','last7','last30','custom'].includes(saved.kind)?saved:{kind:'all'}}catch{return {kind:'all'}}};
  let currentRange=readRange();
  const parseShownDate=value=>new Date(String(value).replace(' ','T').replace(/Z$/,''));
  const localInput=date=>{const pad=n=>String(n).padStart(2,'0');return `${date.getFullYear()}-${pad(date.getMonth()+1)}-${pad(date.getDate())}T${pad(date.getHours())}:${pad(date.getMinutes())}`};
  const prettyDateTime=value=>{const date=new Date(value);const month=date.toLocaleString('en-US',{month:'short'});return `${month} ${date.getDate()}, ${date.getFullYear()}@${date.getHours()}:${String(date.getMinutes()).padStart(2,'0')}`};
  const statusText=state=>state.kind==='last7'?'近七天':state.kind==='last30'?'近30天':state.kind==='custom'?`${prettyDateTime(state.start)}-${prettyDateTime(state.end)}`:'全部';
  const bounds=state=>{if(state.kind==='all')return null;if(state.kind==='custom')return [new Date(state.start),new Date(state.end)];const end=new Date(),start=new Date(end);start.setHours(0,0,0,0);start.setDate(start.getDate()-(state.kind==='last7'?6:29));return [start,end]};
  const defaultTrackRange=()=>({...currentRange});
  const readTrackRange=()=>{
    if(sessionStorage.getItem(trackEntryKey)==='1'){
      sessionStorage.removeItem(trackEntryKey);
      return defaultTrackRange();
    }
    try{const saved=JSON.parse(sessionStorage.getItem(trackDateKey)||'null');return saved&&['all','last7','last30','custom'].includes(saved.kind)?saved:defaultTrackRange()}catch{return defaultTrackRange()}
  };
  let trackRange=readTrackRange();
  function trackBounds(state=trackRange,parent=bounds(currentRange)){
    if(state.kind==='all')return parent;
    if(state.kind==='custom')return [new Date(state.start),new Date(state.end)];
    const end=parent?new Date(parent[1]):new Date(),start=new Date(end);
    start.setHours(0,0,0,0);start.setDate(start.getDate()-(state.kind==='last7'?6:29));
    return [start,end];
  }
  function trackAllowed(kind){
    if(kind==='custom')return true;
    if(kind==='all')return currentRange.kind==='all';
    if(currentRange.kind==='last7'&&kind==='last30')return false;
    const parent=bounds(currentRange),child=trackBounds({kind},parent);
    return !parent||(child[0]>=parent[0]&&child[1]<=parent[1]);
  }
  function trackContained(state=trackRange){
    if(state.kind==='all')return currentRange.kind==='all';
    if(!trackAllowed(state.kind))return false;
    const parent=bounds(currentRange),child=trackBounds(state,parent);
    return !!child&&child.every(date=>!Number.isNaN(date.getTime()))&&child[0]<=child[1]&&(!parent||(child[0]>=parent[0]&&child[1]<=parent[1]));
  }
  window.momcozyDateIncludes=value=>{const range=bounds(currentRange);if(!range)return true;const date=parseShownDate(value);return !Number.isNaN(date.getTime())&&date>=range[0]&&date<=range[1]};
  window.momcozyTrackDateIncludes=value=>{const range=trackBounds();if(!range)return true;const date=parseShownDate(value);return !Number.isNaN(date.getTime())&&date>=range[0]&&date<=range[1]};
  window.momcozyDateRange=()=>({...currentRange});
  window.momcozyTrackDateRange=()=>({...trackRange});
  function setRange(state){currentRange=state;sessionStorage.setItem(dateKey,JSON.stringify(state));updateDateUI();window.dispatchEvent(new CustomEvent('date-range-change',{detail:{...state}}))}
  window.momcozySetDateRange=setRange;
  function initDateControl(){const old=byId('global-date');if(!old)return;const wrapper=document.createElement('div');wrapper.className='date-control';wrapper.innerHTML=`<button id="global-date" class="date-icon-button" type="button" aria-label="选择时间范围" aria-expanded="false" aria-controls="date-popover"><svg viewBox="0 0 24 24" aria-hidden="true"><rect x="3" y="5" width="18" height="16" rx="2" fill="none" stroke="currentColor" stroke-width="1.8"/><path d="M7 3v4M17 3v4M3 10h18" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/><path d="M9 14h3v3H9z" fill="currentColor"/></svg></button><button class="date-current" type="button" aria-label="展开时间筛选"><span class="date-status">全部</span><span class="date-chevron">⌄</span></button><div class="date-popover hidden" id="date-popover" role="dialog" aria-label="时间筛选"><div class="date-menu-title">时间范围</div><button class="date-option" type="button" data-date-kind="all"><span>全部</span><span class="option-check">✓</span></button><button class="date-option" type="button" data-date-kind="last7"><span>近七天</span><span class="option-check">✓</span></button><button class="date-option" type="button" data-date-kind="last30"><span>近30天</span><span class="option-check">✓</span></button><button class="date-option" type="button" data-date-kind="custom"><span>自定义时间筛选</span><span class="option-check">✓</span></button><div class="date-custom hidden" id="date-custom"><label>开始时间<input id="date-start" type="datetime-local"></label><label>结束时间<input id="date-end" type="datetime-local"></label><p class="date-error hidden" id="date-error" role="alert"></p><div class="date-custom-actions"><button type="button" class="outline-btn" id="date-cancel">取消</button><button type="button" class="primary-btn" id="date-apply">应用</button></div></div></div>`;old.replaceWith(wrapper);
    const pop=byId('date-popover'),trigger=byId('global-date');
    const open=()=>{pop.classList.remove('hidden');trigger.setAttribute('aria-expanded','true');updateDateUI()};
    const close=()=>{pop.classList.add('hidden');trigger.setAttribute('aria-expanded','false');byId('date-error').classList.add('hidden')};
    const toggle=()=>pop.classList.contains('hidden')?open():close();
    trigger.addEventListener('click',toggle);q('.date-current',wrapper).addEventListener('click',toggle);
    qa('[data-date-kind]',wrapper).forEach(button=>button.addEventListener('click',()=>{const kind=button.dataset.dateKind;if(kind==='custom'){const now=new Date(),week=new Date(now);week.setDate(week.getDate()-7);byId('date-start').value=currentRange.kind==='custom'?currentRange.start:localInput(week);byId('date-end').value=currentRange.kind==='custom'?currentRange.end:localInput(now);byId('date-custom').classList.remove('hidden');byId('date-start').focus();return}byId('date-custom').classList.add('hidden');setRange({kind});close()}));
    byId('date-cancel').addEventListener('click',()=>byId('date-custom').classList.add('hidden'));
    byId('date-apply').addEventListener('click',()=>{const start=byId('date-start').value,end=byId('date-end').value,error=byId('date-error');if(!start||!end){error.textContent='请选择开始时间和结束时间';error.classList.remove('hidden');return}if(new Date(start)>new Date(end)){error.textContent='结束时间不能早于开始时间';error.classList.remove('hidden');return}error.classList.add('hidden');setRange({kind:'custom',start,end});close()});
    document.addEventListener('pointerdown',event=>{if(!wrapper.contains(event.target))close()});document.addEventListener('keydown',event=>{if(event.key==='Escape')close()});updateDateUI();window.dispatchEvent(new CustomEvent('date-range-change',{detail:{...currentRange}}));
  }
  function updateDateUI(){const status=q('.date-status'),wrapper=q('.date-control');if(!status)return;status.textContent=statusText(currentRange);wrapper.classList.toggle('is-custom',currentRange.kind==='custom');qa('[data-date-kind]',wrapper).forEach(button=>{const active=button.dataset.dateKind===currentRange.kind;button.classList.toggle('selected',active);button.setAttribute('aria-pressed',String(active))});const custom=byId('date-custom');if(custom&&currentRange.kind!=='custom'&&q('#date-popover').classList.contains('hidden'))custom.classList.add('hidden');syncTrackDate()}
  function trackStatus(){
    if(trackRange.kind==='all')return '全部时间';
    if(trackRange.kind==='last7')return '近七天';
    if(trackRange.kind==='last30')return '近30天';
    const short=value=>value.slice(0,10);
    const full=value=>`${value.slice(0,10)} ${value.slice(11,16)}`;
    const datesOnly=trackRange.start.endsWith('T00:00')&&trackRange.end.endsWith('T23:59');
    return datesOnly?`${short(trackRange.start)} ～ ${short(trackRange.end)}`:`${full(trackRange.start)} ～ ${full(trackRange.end)}`;
  }
  function syncTrackDate(){
    if(!trackContained())trackRange=defaultTrackRange();
    sessionStorage.setItem(trackDateKey,JSON.stringify(trackRange));
    qa('.chart-range option[value="scope"]').forEach(option=>{
      option.textContent=trackRange.kind==='custom'?'自定义时间':trackStatus();
      option.parentElement.title=`当前用户时间范围：${trackStatus()}`;
    });
    const control=q('.track-date-control');
    if(control){
      q('.track-date-status',control).textContent=trackStatus();
      q('#track-date',control).title=trackStatus();
      qa('[data-track-kind]',control).forEach(option=>{const allowed=trackAllowed(option.dataset.trackKind);option.classList.toggle('hidden',!allowed);option.classList.toggle('selected',option.dataset.trackKind===trackRange.kind);option.setAttribute('aria-pressed',String(option.dataset.trackKind===trackRange.kind))});
      q('.track-parent-note',control).textContent=currentRange.kind==='all'?'可自由选择用户时间范围':`仅可选择上方「${statusText(currentRange)}」包含的时间`;
    }
    window.dispatchEvent(new CustomEvent('track-date-change',{detail:{...trackRange}}));
  }
  function initTrackDate(){
    const old=byId('track-date');if(!old)return;
    const control=document.createElement('div');control.className='track-date-control';
    control.innerHTML=`<button id="track-date" class="track-date-button" type="button" aria-label="选择当前用户时间范围" aria-expanded="false"><span class="track-date-calendar">▦</span><span class="track-date-status"></span><span class="track-date-arrow">⌄</span></button><div class="track-date-popover hidden" role="dialog" aria-label="用户时间范围"><div class="date-menu-title">用户时间范围</div><p class="track-parent-note"></p><button type="button" class="date-option" data-track-kind="all">全部时间<span class="option-check">✓</span></button><button type="button" class="date-option" data-track-kind="last7">近七天<span class="option-check">✓</span></button><button type="button" class="date-option" data-track-kind="last30">近30天<span class="option-check">✓</span></button><button type="button" class="date-option" data-track-kind="custom">自定义时间<span class="option-check">✓</span></button><div class="track-custom hidden"><label>开始时间<input class="track-start" type="datetime-local"></label><label>结束时间<input class="track-end" type="datetime-local"></label><p class="date-error hidden" role="alert"></p><div class="date-custom-actions"><button type="button" class="outline-btn track-cancel">取消</button><button type="button" class="primary-btn track-apply">应用</button></div></div></div>`;
    old.replaceWith(control);
    const button=q('#track-date',control),pop=q('.track-date-popover',control),custom=q('.track-custom',control);
    const close=()=>{pop.classList.add('hidden');button.setAttribute('aria-expanded','false');q('.date-error',control).classList.add('hidden')};
    const toggle=()=>{const opening=pop.classList.contains('hidden');pop.classList.toggle('hidden',!opening);button.setAttribute('aria-expanded',String(opening));if(opening)syncTrackDate()};
    button.addEventListener('click',toggle);
    qa('[data-track-kind]',control).forEach(option=>option.addEventListener('click',()=>{
      const kind=option.dataset.trackKind;if(!trackAllowed(kind))return;
      if(kind==='custom'){
        const parent=bounds(currentRange),current=trackBounds(),start=q('.track-start',control),end=q('.track-end',control);
        start.value=trackRange.kind==='custom'?trackRange.start:localInput(current?.[0]||parent?.[0]||new Date());
        end.value=trackRange.kind==='custom'?trackRange.end:localInput(current?.[1]||parent?.[1]||new Date());
        for(const input of [start,end]){input.min=parent?localInput(parent[0]):'';input.max=parent?localInput(parent[1]):''}
        custom.classList.remove('hidden');start.focus();return;
      }
      trackRange={kind};custom.classList.add('hidden');syncTrackDate();close();
    }));
    q('.track-cancel',control).addEventListener('click',()=>custom.classList.add('hidden'));
    q('.track-apply',control).addEventListener('click',()=>{
      const start=q('.track-start',control).value,end=q('.track-end',control).value,error=q('.date-error',control);
      const invalid=!start||!end?'请选择开始和结束时间':new Date(start)>new Date(end)?'结束时间不能早于开始时间':!trackContained({kind:'custom',start,end})?'所选时间不能超出上方时间范围':'';
      if(invalid){error.textContent=invalid;error.classList.remove('hidden');return}
      trackRange={kind:'custom',start,end};error.classList.add('hidden');syncTrackDate();close();
    });
    document.addEventListener('pointerdown',event=>{if(!control.contains(event.target))close()});
    document.addEventListener('keydown',event=>{if(event.key==='Escape')close()});
    syncTrackDate();
  }
  function initNotices(){const button=byId('notice');if(!button)return;const update=()=>{const read=sessionStorage.getItem(noticeKey)==='1';const badge=q('b',button);badge.textContent=read?'0':'2';badge.classList.toggle('hidden',read)};button.onclick=()=>{const read=sessionStorage.getItem(noticeKey)==='1';modal(`<h2>通知</h2><div class="notice-list"><div><strong>数据同步已完成</strong><p>示例用户轨迹数据已更新至 2026-10-26。</p><a href="user-track.html">查看用户轨迹 →</a></div><div><strong>异常 Session 需关注</strong><p>发现 3 条异常记录，可查看单次行为分析。</p><a href="session-analysis.html">查看分析 →</a></div></div><button class="outline-btn" id="notice-read">${read?'已全部标记为已读':'全部标记为已读'}</button>`);byId('notice-read').onclick=()=>{sessionStorage.setItem(noticeKey,'1');update();byId('notice-read').textContent='已全部标记为已读'}};update()}
  function initTrackCharts(){
    if(document.body.dataset.page!=='track')return;
    const panels=qa('.chart-grid .chart-panel');
    const refresh=()=>{
      const visible=window.momcozyVisibleSessions?.()||sessions;
      panels.forEach(panel=>{
        const type=q('svg[data-mini]',panel)?.dataset.mini||panel.dataset.chartType;
        panel.dataset.chartType=type;
        const selectedRange=q('.chart-range',panel).value;
        const rows=selectedRange==='scope'?visible:visible.slice(0,Number(selectedRange)||14);
        panel.chartRows=rows;
        q('svg[data-mini]',panel).outerHTML=drawMini(type,rows,q('[data-milk].selected',panel)?.dataset.milk||'total');
        q('.chart-range',panel).title=`当前显示 ${rows.length} 条 Session`;
        q('.sync-crosshair',panel)?.classList.add('hidden');
        q('.sync-chart-tip',panel)?.classList.add('hidden');
        qa('.sync-point',panel).forEach(point=>point.classList.add('hidden'));
      });
    };
    window.momcozyRefreshTrackCharts=refresh;
    panels.forEach(panel=>q('.chart-range',panel).addEventListener('change',refresh));
    qa('[data-milk]',q('#milk-tabs')).forEach(button=>button.addEventListener('click',()=>{
      qa('[data-milk]',q('#milk-tabs')).forEach(item=>item.classList.toggle('selected',item===button));
      refresh();
    }));
    refresh();
  }
  function initMilkLegend(){
    if(document.body.dataset.page!=='track')return;
    const panel=q('.chart-panel'),tabs=q('#milk-tabs');
    if(!panel||!tabs)return;
    const legend=document.createElement('div');
    legend.className='milk-legend';
    legend.setAttribute('aria-label','奶量曲线图例');
    legend.innerHTML='<span data-series="left"><i></i>左侧奶量</span><span data-series="right"><i></i>右侧奶量</span><span data-series="total"><i></i>总奶量</span>';
    panel.append(legend);
    const update=()=>{const selected=q('[data-milk].selected',tabs)?.dataset.milk||'total';qa('[data-series]',legend).forEach(item=>item.classList.toggle('muted',selected!=='total'&&item.dataset.series!==selected))};
    qa('[data-milk]',tabs).forEach(button=>button.addEventListener('click',update));
    update();
  }
  function drawMini(type,rows,side){
    const W=460,H=180,L=43,R=10,T=18,B=31,plotW=W-L-R,plotH=H-T-B;
    const duration=row=>{const [,minutes,seconds]=row[4].match(/(\d+)m\s+(\d+)s/)||[];return Number(minutes||0)+Number(seconds||0)/60};
    const series=type==='milk'?[rows.map(row=>row[3]),rows.map(row=>row[1]),rows.map(row=>row[2])]:type==='duration'?[rows.map(duration)]:[rows.map(row=>row[6]),rows.map(row=>row[8])];
    const values=series.flat(),peak=Math.max(0,...values);
    const step=type==='milk'?100:type==='duration'?10:5;
    const max=Math.max(type==='milk'?200:type==='duration'?30:15,Math.ceil(peak/step)*step);
    const x=index=>rows.length<2?L+plotW/2:L+index*plotW/(rows.length-1);
    const y=value=>T+plotH-value/max*plotH;
    let svg=`<svg class="mini-chart" viewBox="0 0 ${W} ${H}" preserveAspectRatio="none" data-mini="${type}" data-points="${rows.length}" data-max="${max}">`;
    for(let i=0;i<5;i++){const gridY=T+i*plotH/4;svg+=`<line x1="${L}" y1="${gridY}" x2="${W-R}" y2="${gridY}" stroke="#eaf0fb"/><text x="${L-12}" y="${gridY+4}" text-anchor="end" fill="#6680b1" font-size="10">${Math.round(max-i*max/4)}</text>`}
    if(!rows.length)return svg+`<text x="${W/2}" y="${T+plotH/2}" text-anchor="middle" fill="#8294b5" font-size="14">当前时间范围暂无 Session</text></svg>`;
    const labelStep=Math.max(1,Math.ceil(rows.length/7));
    rows.forEach((row,index)=>{if(index%labelStep)return;const started=row[0];svg+=`<text x="${x(index)}" y="${H-17}" text-anchor="middle" fill="#5874aa" font-size="9"><tspan x="${x(index)}">${started.slice(5,10).replace('-', '/')}</tspan><tspan x="${x(index)}" dy="10">${started.slice(11,16)}</tspan></text>`});
    const line=(values,color)=>{
      const points=values.map((value,index)=>({x:x(index),y:y(value)}));
      let path=`M ${points[0].x} ${points[0].y}`;
      if(points.length>1){
        const slopes=points.slice(1).map((point,index)=>(point.y-points[index].y)/(point.x-points[index].x));
        const tangents=points.map((_,index)=>{
          if(index===0)return slopes[0];
          if(index===points.length-1)return slopes.at(-1);
          const before=slopes[index-1],after=slopes[index];
          return before*after<=0?0:2*before*after/(before+after);
        });
        points.slice(1).forEach((point,index)=>{
          const previous=points[index],third=(point.x-previous.x)/3;
          path+=` C ${previous.x+third} ${previous.y+tangents[index]*third} ${point.x-third} ${point.y-tangents[index+1]*third} ${point.x} ${point.y}`;
        });
      }
      svg+=`<path d="${path}" fill="none" stroke="${color}" stroke-width="1.4" stroke-linecap="round" stroke-linejoin="round"/>`;
      if(rows.length<=20)points.forEach(point=>svg+=`<circle cx="${point.x}" cy="${point.y}" r="1.8" fill="${color}" stroke="white" stroke-width=".5"/>`);
    };
    if(type==='milk'){if(side==='total'||side==='left')line(series[1],'#0756ff');if(side==='total'||side==='right')line(series[2],'#6c23ff');if(side==='total')line(series[0],'#f52ed5')}
    else if(type==='duration')line(series[0],'#6a23ff');
    else{const barWidth=Math.min(14,Math.max(4,plotW/rows.length*.42));series[0].forEach((value,index)=>svg+=`<rect x="${x(index)-barWidth/2}" y="${y(value)}" width="${barWidth}" height="${T+plotH-y(value)}" rx="3" fill="#85b6ff"/>`);line(series[1],'#7425ff')}
    return svg+'</svg>';
  }
  function initDetailTimeMode(){
    if(document.body.dataset.page!=='session')return;
    const start=new Date(document.body.dataset.sessionStartTime||'2026-10-26T07:48:00');
    const axes=qa('.detail-svg').map(svg=>({svg,nodes:qa('text[y="29"]',svg)}));
    axes.forEach(axis=>axis.relative=axis.nodes.map(node=>node.textContent));
    const pad=value=>String(value).padStart(2,'0');
    qa('.time-mode').forEach(select=>select.onchange=()=>{
      const useAbsolute=select.value==='绝对时间';qa('.time-mode').forEach(other=>other.value=select.value);
      axes.forEach(axis=>axis.nodes.forEach((node,index)=>{
        const label=axis.relative[index];if(!useAbsolute){node.textContent=label;return}
        const [minutes,seconds]=label.split(':').map(Number),at=new Date(start.getTime()+(minutes*60+seconds)*1000);
        node.textContent=`${pad(at.getHours())}:${pad(at.getMinutes())}`;
      }));
    });
  }
  function initDetailPanel(){if(document.body.dataset.page!=='session')return;qa('.chart-hit').forEach(hit=>hit.addEventListener('click',()=>{const pane=byId('event-pane');if(pane.classList.contains('hidden')){pane.classList.remove('hidden');q('.analysis-layout').style.gridTemplateColumns='minmax(0,1fr) 268px'}pane.classList.add('event-selected');setTimeout(()=>pane.classList.remove('event-selected'),1200)}))}
  function initSyncedChartHover(){
    if(document.body.dataset.page!=='track')return;
    const panels=qa('.chart-grid .chart-panel');
    panels.forEach(panel=>{const cross=document.createElement('div'),tip=document.createElement('div');cross.className='sync-crosshair hidden';tip.className='sync-chart-tip hidden';tip.setAttribute('role','status');panel.append(cross,tip);for(let i=0;i<3;i++){const point=document.createElement('span');point.className='sync-point hidden';panel.append(point)}});
    const hide=()=>panels.forEach(panel=>{q('.sync-crosshair',panel).classList.add('hidden');q('.sync-chart-tip',panel).classList.add('hidden');qa('.sync-point',panel).forEach(point=>point.classList.add('hidden'))});
    const tipRows=items=>items.map(([color,label,value])=>`<div class="sync-tip-row"><i style="background:${color}"></i><span>${label}</span><b>${value}</b></div>`).join('');
    function pointIndex(event,panel){
      const svg=event.target.closest?.('svg[data-mini]'),rows=panel.chartRows||[];
      if(!svg||!rows.length)return null;
      const rect=svg.getBoundingClientRect(),viewX=(event.clientX-rect.left)/rect.width*460;
      if(viewX<39||viewX>455)return null;
      const local=rows.length===1?0:Math.max(0,Math.min(rows.length-1,Math.round((viewX-43)/407*(rows.length-1))));
      return sessions.indexOf(rows[local]);
    }
    function show(sessionIndex){
      const row=sessions[sessionIndex];
      panels.forEach(panel=>{
        const svg=q('svg[data-mini]',panel),type=svg?.dataset.mini,tip=q('.sync-chart-tip',panel),cross=q('.sync-crosshair',panel);
        const rows=panel.chartRows||[],local=rows.indexOf(row);
        if(!svg||local<0){tip.classList.add('hidden');cross.classList.add('hidden');qa('.sync-point',panel).forEach(point=>point.classList.add('hidden'));return}
        const svgRect=svg.getBoundingClientRect(),panelRect=panel.getBoundingClientRect();
        const plotX=rows.length===1?43+407/2:43+local/(rows.length-1)*407;
        const x=svgRect.left-panelRect.left+plotX/460*svgRect.width;
        cross.style.left=`${x}px`;cross.style.top=`${svgRect.top-panelRect.top+18/180*svgRect.height}px`;cross.style.height=`${131/180*svgRect.height}px`;cross.classList.remove('hidden');
        const durationMatch=row[4].match(/(\d+)m\s+(\d+)s/);
        const durationValue=durationMatch?Number(durationMatch[1])+Number(durationMatch[2])/60:0;
        const side=q('[data-milk].selected',panel)?.dataset.milk||'total';
        const intersections=type==='milk'?(side==='left'?[['#0756ff',row[1]]]:side==='right'?[['#6c23ff',row[2]]]:[['#f52ed5',row[3]],['#0756ff',row[1]],['#6c23ff',row[2]]]):type==='duration'?[['#6a23ff',durationValue]]:[['#7425ff',row[8]]];
        const max=Number(svg.dataset.max)||1;
        qa('.sync-point',panel).forEach((point,index)=>{
          const current=intersections[index];
          if(!current){point.classList.add('hidden');return}
          point.style.left=`${x}px`;
          point.style.top=`${svgRect.top-panelRect.top+(18+131-current[1]/max*131)/180*svgRect.height}px`;
          point.style.backgroundColor=current[0];
          point.classList.remove('hidden');
        });
        let content='';
        if(type==='milk'){
          const parts=side==='left'?[['#0756ff','左侧奶量',`${row[1]} ml`]]:side==='right'?[['#6c23ff','右侧奶量',`${row[2]} ml`]]:[['#ef2fd5','总奶量',`${row[3]} ml`],['#0756ff','左侧奶量',`${row[1]} ml`],['#6c23ff','右侧奶量',`${row[2]} ml`]];
          content=tipRows(parts);
        }else if(type==='duration')content=tipRows([['#6a23ff','时长',row[4]]]);
        else content=tipRows([['#0756ff','调档次数',row[6]],['#7425ff','模式切换次数',row[8]]]);
        tip.innerHTML=`<strong>${row[0]}</strong>${content}<small>点击查看详情 →</small>`;
        const width=180;
        tip.style.width=`${width}px`;
        tip.style.left=`${x+16+width<=panel.clientWidth-8?x+16:Math.max(8,x-width-16)}px`;
        tip.style.top=type==='bars'?'48px':type==='duration'?'76px':'78px';tip.classList.remove('hidden');
      });
    }
    panels.forEach(panel=>{
      panel.addEventListener('pointermove',event=>{const index=pointIndex(event,panel);if(index===null){hide();return}show(index)});
      panel.addEventListener('click',event=>{
        const index=pointIndex(event,panel);if(index===null)return;
        const row=sessions[index];
        sessionStorage.setItem('selectedChartSession',JSON.stringify({index,total:row[3],left:row[1],right:row[2],duration:row[4],adjust:row[6],mode:row[8]}));
        location.href=`session-analysis.html?session=${String(index+1).padStart(2,'0')}`;
      });
      panel.addEventListener('pointerleave',hide);
    });
    qa('.chart-range').forEach(select=>select.addEventListener('change',hide));
    qa('[data-milk]').forEach(button=>button.addEventListener('click',hide));
  }
  function initChartSessionDetail(){
    if(document.body.dataset.page!=='session')return;
    const number=Number(new URLSearchParams(location.search).get('session'));
    if(!Number.isInteger(number)||number<1||number>sessions.length)return;
    const index=number-1,row=sessions[index];
    const detail={total:row[3],left:row[1],right:row[2],adjust:row[6],mode:row[8]};
    const start=row[0];
    const [,minutes,seconds]=row[4].match(/(\d+)m\s+(\d+)s/)||[];
    const endDate=new Date(start.replace(' ','T'));
    endDate.setSeconds(endDate.getSeconds()+Number(minutes||0)*60+Number(seconds||0));
    const pad=n=>String(n).padStart(2,'0');const end=`${endDate.getFullYear()}-${pad(endDate.getMonth()+1)}-${pad(endDate.getDate())} ${pad(endDate.getHours())}:${pad(endDate.getMinutes())}:${pad(endDate.getSeconds())}`;
    const sessionName=`Session ${String(number).padStart(2,'0')}`;
    const id=`S${start.slice(0,10).replaceAll('-','')}-${start.slice(11).replaceAll(':','')}`;
    q('.session-top h1 em').textContent=`${sessionName} · 示意数据`;
    q('.session-top .session-id').textContent=`Session ID: ${id}`;q('.session-header-user-id').textContent=q('.session-user strong').textContent;q('.session-header-email').textContent=q('.session-user small').textContent;
    const meta=qa('.session-meta .meta-cell');q('strong',meta[2]).textContent=start;q('strong',meta[3]).textContent=end;
    const metric=qa('.metric-strip .metric');
    [['left',detail.left],['right',detail.right],['total',detail.total]].forEach(([side,ml])=>{q(`[data-volume="${side}"]`,metric[0]).textContent=ml});
    q('strong',metric[1]).textContent=row[4];q('strong',metric[5]).textContent=detail.adjust;q('strong',metric[6]).textContent=detail.mode;
    document.body.dataset.sessionStartTime=start.replace(' ','T');
    document.title=`${sessionName} - 单次吸奶行为分析 - Momcozy 用户数据平台`;
  }
  function initSyncedDetailHover(){
    if(document.body.dataset.page!=='session')return;
    const panels=qa('.detail-chart'),data=window.momcozyDetailData;
    if(panels.length!==2||!data)return;
    const powerSvg=q('svg.detail-svg',panels[0]),flowSvg=q('svg.detail-svg',panels[1]);
    const duration=data.durationSeconds,plotLeft=120,plotWidth=856;
    const start=new Date(document.body.dataset.sessionStartTime||'2026-10-26T07:48:00');
    const pad=value=>String(value).padStart(2,'0');
    const relative=seconds=>`${pad(Math.floor(seconds/60))}:${pad(seconds%60)}`;
    const absolute=seconds=>{const date=new Date(start.getTime()+seconds*1000);return `${date.getFullYear()}-${pad(date.getMonth()+1)}-${pad(date.getDate())} ${pad(date.getHours())}:${pad(date.getMinutes())}:${pad(date.getSeconds())}`};
    const interpolate=(values,fraction)=>window.momcozySmoothSeriesValueAt(values,fraction);
    const level=(values,fraction)=>values[Math.min(values.length-1,Math.floor(fraction*(values.length-1)+.00001))];
    const modeAt=x=>x<320?'刺激模式':x<568?'吸乳模式':x<788?'混合模式':'吸乳模式';
    const speedAt=x=>x<260?'slow':x<470?'regular':x<680?'fast':x<820?'regular':'slow';
    const events=data.events||[],anomalies=data.anomalies||[];
    powerSvg.insertAdjacentHTML('beforeend',`<g class="detail-hover-layer" style="display:none"><line class="detail-hover-guide" data-guide x1="570" y1="36" x2="570" y2="256"/><rect data-badge-box y="11" width="48" height="22" rx="5" fill="#60718c"/><text data-badge-text y="26" text-anchor="middle" fill="white" font-size="9" font-weight="700"></text><circle data-left-dot r="3.5" fill="#ff271a"/><circle data-right-dot r="3.5" fill="#ff8500"/><g data-tip><rect width="190" height="114" rx="8" fill="white" filter="drop-shadow(0px 4px 8px #9ba9bf88)"/><text x="12" y="18" data-field="time" font-size="10" font-weight="700"></text><text x="12" y="35" data-field="rhythm" font-size="9"></text><text x="12" y="52" data-field="mode" font-size="9"></text><text x="12" y="69" data-field="speed" font-size="9"></text><circle cx="15" cy="84" r="4" fill="#ff271a"/><text x="25" y="88" data-field="left" font-size="9"></text><circle cx="15" cy="101" r="4" fill="#ff8500"/><text x="25" y="105" data-field="right" font-size="9"></text></g></g>`);
    flowSvg.insertAdjacentHTML('beforeend',`<g class="detail-hover-layer" style="display:none"><line class="detail-hover-guide" data-guide x1="570" y1="36" x2="570" y2="290"/><rect data-badge-box y="11" width="48" height="22" rx="5" fill="#60718c"/><text data-badge-text y="26" text-anchor="middle" fill="white" font-size="9" font-weight="700"></text><circle data-flow-left-dot r="3.5" fill="#00bd65"/><circle data-flow-right-dot r="3.5" fill="#0756ff"/><circle data-volume-dot r="3.5" fill="#9225fa"/><g data-combined-tip><rect data-tip-box width="190" height="164" rx="8" fill="white" filter="drop-shadow(0px 4px 8px #9ba9bf88)"/><text x="12" y="18" data-field="time" font-size="10" font-weight="700"></text><text x="12" y="36" fill="#536994" font-size="9" font-weight="700">奶液流速</text><circle cx="15" cy="51" r="4" fill="#00bd65"/><text x="25" y="55" data-field="flow-left" font-size="9"></text><circle cx="15" cy="69" r="4" fill="#0756ff"/><text x="25" y="73" data-field="flow-right" font-size="9"></text><line x1="12" x2="178" y1="83" y2="83" stroke="#e5edfa"/><text x="12" y="99" fill="#536994" font-size="9" font-weight="700">累计奶量</text><circle cx="15" cy="114" r="4" fill="#00bd65"/><text x="25" y="118" data-field="volume-left" font-size="9"></text><circle cx="15" cy="132" r="4" fill="#0756ff"/><text x="25" y="136" data-field="volume-right" font-size="9"></text><circle cx="15" cy="150" r="4" fill="#9225fa"/><text x="25" y="154" data-field="volume-total" font-size="9"></text><g data-letdown-detail style="display:none"><line x1="12" x2="178" y1="164" y2="164" stroke="#e5edfa"/><text x="12" y="182" data-field="letdown-number" fill="#3767bd" font-size="9" font-weight="700"></text><text x="12" y="199" data-field="letdown-start" font-size="9"></text><text x="12" y="216" data-field="letdown-end" font-size="9"></text></g><g data-operation-detail style="display:none"><line x1="12" x2="178" y1="0" y2="0" stroke="#e5edfa"/><text x="12" y="15" fill="#536994" font-size="9" font-weight="700">操作事件</text><text x="12" y="31" data-field="operation" font-size="9"></text></g><g data-anomaly-detail style="display:none"><line x1="12" x2="178" y1="0" y2="0" stroke="#e5edfa"/><text x="12" y="15" data-field="anomaly" fill="#e33440" font-size="9" font-weight="700"></text><text x="12" y="31" data-field="anomaly-time" font-size="9"></text></g></g></g>`);
    const groups=[q('.detail-hover-layer',powerSvg),q('.detail-hover-layer',flowSvg)];
    const infoLists=qa('#event-pane .event-info');
    const fields=infoLists.map(list=>new Map(qa('dt',list).map(dt=>[dt.textContent.trim(),dt.nextElementSibling])));
    const setField=(list,label,value)=>{const node=fields[list].get(label);if(node)node.textContent=value};
    for(const label of ['左侧流速','右侧流速','累计奶量','奶阵区间','奶阵开始','奶阵结束','异常状态','异常侧','异常开始','异常结束']){
      const dt=document.createElement('dt'),dd=document.createElement('dd');dt.textContent=label;dd.textContent={'左侧流速':'0.23 oz/min','右侧流速':'0.21 oz/min','累计奶量':'4.1 oz'}[label]??'—';infoLists[1].append(dt,dd);fields[1].set(label,dd);
    }
    const setText=(root,field,value)=>{const node=q(`[data-field="${field}"]`,root);if(node)node.textContent=value};
    const setCircle=(root,selector,x,y)=>{const node=q(selector,root);node.setAttribute('cx',String(x));node.setAttribute('cy',String(y))};
    const timeFromX=x=>(x-plotLeft)/plotWidth*duration;
    let lastX=null;
    const hide=()=>groups.forEach(group=>group.style.display='none');
    function show(unitX){
      const x=Math.max(plotLeft,Math.min(plotLeft+plotWidth,unitX));
      if(x===lastX&&groups.every(group=>group.style.display!=='none'))return;
      lastX=x;
      const seconds=Math.max(0,Math.min(duration,Math.round(timeFromX(x))));
      const fraction=(x-plotLeft)/plotWidth;
      const mode=modeAt(x),speed=speedAt(x),rhythm='Milk Boost（高效泌乳）';
      const left=level(data.powerL,fraction),right=level(data.powerR,fraction);
      const flowL=interpolate(data.flowL,fraction),flowR=interpolate(data.flowR,fraction);
      const volumeL=interpolate(data.volumeL,fraction),volumeR=interpolate(data.volumeR,fraction),volumeTotal=volumeL+volumeR;
      const stamp=relative(seconds),dateTime=absolute(seconds),letdown=data.letdowns.find(item=>seconds>=item.start&&seconds<=item.end);
      const operation=events.find(item=>Math.abs(seconds-item.at)<=Math.max(15,Math.round(duration*24/1463)));
      const anomaly=anomalies.find(item=>seconds>=item.start&&seconds<=item.end);
      const timeMode=q('.time-mode')?.value==='绝对时间'?dateTime.slice(11,16):stamp;
      groups.forEach((group,index)=>{
        group.style.display='';
        const guide=q('[data-guide]',group);guide.setAttribute('x1',String(x));guide.setAttribute('x2',String(x));
        q('[data-badge-box]',group).setAttribute('x',String(x-24));
        const badge=q('[data-badge-text]',group);badge.setAttribute('x',String(x));badge.textContent=timeMode;
        qa('[data-field="time"]',group).forEach(node=>node.textContent=timeMode);
      });
      const tipX=width=>x+18+width>976?Math.max(120,x-width-18):x+18;
      const power=groups[0],flow=groups[1],powerTipX=tipX(190),flowTipX=tipX(190);
      q('[data-tip]',power).setAttribute('transform',`translate(${powerTipX},160)`);
      setText(power,'mode',`模式　${mode}`);setText(power,'rhythm',`韵律　${rhythm}`);setText(power,'speed',`速度档位　${speed}（左右同步）`);
      setText(power,'left',`L 左侧档位　${left}`);setText(power,'right',`R 右侧档位　${right}`);
      setCircle(power,'[data-left-dot]',x,180+73-(left-1)/11*73);setCircle(power,'[data-right-dot]',x,180+73-(right-1)/11*73);
      const baseTipHeight=letdown?224:164;
      const tipHeight=baseTipHeight+(operation?38:0)+(anomaly?38:0);
      q('[data-combined-tip]',flow).setAttribute('transform',`translate(${flowTipX},${Math.min(65,312-tipHeight)})`);
      q('[data-letdown-detail]',flow).style.display=letdown?'':'none';
      q('[data-tip-box]',flow).setAttribute('height',String(tipHeight));
      if(letdown){setText(flow,'letdown-number',`第 ${letdown.index} / ${data.letdowns.length} 次奶阵`);setText(flow,'letdown-start',`奶阵开始　${relative(letdown.start)}`);setText(flow,'letdown-end',`奶阵结束　${relative(letdown.end)}`)}
      const operationDetail=q('[data-operation-detail]',flow),anomalyDetail=q('[data-anomaly-detail]',flow);
      operationDetail.style.display=operation?'':'none';
      anomalyDetail.style.display=anomaly?'':'none';
      if(operation){operationDetail.setAttribute('transform',`translate(0,${baseTipHeight})`);setText(flow,'operation',`${operation.label}　${relative(operation.at)}`)}
      if(anomaly){anomalyDetail.setAttribute('transform',`translate(0,${baseTipHeight+(operation?38:0)})`);setText(flow,'anomaly',`异常状态　${anomaly.side}${anomaly.severity}`);setText(flow,'anomaly-time',`${relative(anomaly.start)}–${relative(anomaly.end)}`)}
      setText(flow,'flow-left',`左侧流速　${flowL.toFixed(2)} oz/min`);setText(flow,'flow-right',`右侧流速　${flowR.toFixed(2)} oz/min`);
      setText(flow,'volume-left',`左侧奶量　${volumeL.toFixed(1)} oz`);setText(flow,'volume-right',`右侧奶量　${volumeR.toFixed(1)} oz`);setText(flow,'volume-total',`总奶量　${volumeTotal.toFixed(1)} oz`);
      setCircle(flow,'[data-flow-left-dot]',x,105-flowL/data.flowMax*55);setCircle(flow,'[data-flow-right-dot]',x,105-flowR/data.flowMax*55);setCircle(flow,'[data-volume-dot]',x,223-volumeTotal/data.volumeMax*78);
      const event=anomaly?{...anomaly,at:anomaly.start}:operation||events.filter(item=>item.at<=seconds).at(-1)||events[0];
      const eventType=q('#event-pane .event-type');eventType.textContent=anomaly?'异常事件':'操作事件';eventType.classList.toggle('is-anomaly',Boolean(anomaly));
      setField(0,'相对时间',stamp);setField(0,'绝对时间',dateTime);setField(0,'事件 ID',anomaly?`evt_leak_${relative(anomaly.start).replace(':','')}`:`evt_${pad(Math.floor(event.at/60))}${pad(event.at%60)}`);
      setField(0,'事件类型',event.type);setField(0,'设备时间戳',`${dateTime}.123`);
      setField(1,'事件',event.type);setField(1,'事件类型',event.field);
      setField(1,'动作摘要',anomaly?`${anomaly.side}${anomaly.severity} · L${left}/R${right}`:`${event.label} · L${left}/R${right}`);
      setField(1,'模式',mode);setField(1,'韵律选择',rhythm);setField(1,'速度档位',`${speed}（左右同步）`);
      setField(1,'左侧流速',`${flowL.toFixed(2)} oz/min`);setField(1,'右侧流速',`${flowR.toFixed(2)} oz/min`);setField(1,'累计奶量',`${volumeTotal.toFixed(1)} oz`);
      setField(1,'奶阵区间',letdown?`第 ${letdown.index} / ${data.letdowns.length} 次`:'—');
      setField(1,'奶阵开始',letdown?absolute(letdown.start):'—');setField(1,'奶阵结束',letdown?absolute(letdown.end):'—');
      setField(1,'异常状态',anomaly?anomaly.severity:'正常');setField(1,'异常侧',anomaly?anomaly.side:'—');
      setField(1,'异常开始',anomaly?absolute(anomaly.start):'—');setField(1,'异常结束',anomaly?absolute(anomaly.end):'—');
      const sideCards=qa('#event-pane .event-side');
      sideCards.forEach((card,index)=>{
        const rows=qa(':scope > div',card),currentLevel=index?right:left;
        rows[0].innerHTML=`<span>模式</span>${mode}`;
        const levelRow=index?rows[1]:rows[2];
        levelRow.innerHTML=`<span>吸力档位</span>${currentLevel}`;
        const leak=rows[index?2:1],active=anomaly&&(index?anomaly.side==='右侧':anomaly.side==='左侧');
        leak.innerHTML=`<span>漏气状态</span><mark${active?' class="leak-severe"':''}>${active?anomaly.severity:'正常'}</mark>`;
      });
    }
    [powerSvg,flowSvg].forEach(svg=>{
      q('.chart-hit',svg).addEventListener('pointermove',event=>{
        const rect=svg.getBoundingClientRect(),unitX=(event.clientX-rect.left)/rect.width*1000;
        show(unitX);
      });
      q('.chart-hit',svg).addEventListener('pointerleave',hide);
    });
    qa('.time-mode').forEach(select=>select.addEventListener('change',()=>{if(lastX!==null){const x=lastX;lastX=null;show(x)}}));
    show(plotLeft+plotWidth*750/1463);hide();lastX=null;
  }
  initDateControl();initTrackDate();initNotices();initTrackCharts();initMilkLegend();initSyncedChartHover();initChartSessionDetail();initDetailTimeMode();initDetailPanel();initSyncedDetailHover();
})();
