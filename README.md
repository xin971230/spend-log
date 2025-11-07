<!doctype html>
<html lang="zh-Hant">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1" />
  <title>收支快記｜手機版（快送＋各帳戶餘額）</title>
  <style>
    body{margin:0;font-family:system-ui,sans-serif;background:#0f172a;color:#f1f5f9}
    .wrap{max-width:520px;margin:auto;padding:12px}
    .card{background:#1e293b;border-radius:14px;padding:16px;margin-bottom:14px}
    h1{font-size:20px;margin:0 0 10px}
    label{font-size:14px;display:block;margin:8px 0 4px}
    input,select{width:100%;padding:12px;border-radius:10px;border:1px solid #334155;background:#0f172a;color:#f1f5f9;font-size:16px}
    .btn{display:block;width:100%;padding:14px;margin-top:12px;border:none;border-radius:10px;font-size:16px;font-weight:600;background:#3b82f6;color:#fff}
    .btn.secondary{background:#475569}.btn.row{width:auto;display:inline-block;margin-right:8px}
    .rowbtns{display:flex;gap:8px;flex-wrap:wrap;margin-top:8px}
    .toast{position:fixed;bottom:20px;left:50%;transform:translateX(-50%);background:#0f172a;padding:12px 16px;border-radius:10px;border:1px solid #334155;display:none}
    .toast.show{display:block}
    .mono{font-family:ui-monospace,SFMono-Regular,Menlo,Monaco,Consolas,monospace}
    .log{max-height:360px;overflow:auto;border:1px solid #334155;border-radius:10px}
    .log table{width:100%;border-collapse:collapse;font-size:14px}
    .log th,.log td{border-bottom:1px solid #334155;padding:8px;text-align:left}
    .neg{color:#fca5a5}.pos{color:#86efac}.muted{color:#93a5bf;font-size:12px}
    .table{width:100%;border-collapse:collapse;margin-top:8px}
    .table th,.table td{padding:8px;border-bottom:1px solid #334155;text-align:left}
    .right{text-align:right}
  </style>
</head>
<body>
  <div class="wrap">

    <div class="card">
      <h1>收支快記</h1>
      <form id="form" autocomplete="off">
        <label>日期</label>
        <input type="date" id="date" required>

        <label>登記人</label>
        <select id="owner">
          <option value="欣宜" selected>欣宜</option>
          <option value="喬猷">喬猷</option>
        </select>

        <label>方向</label>
        <select id="direction">
          <option value="支出" selected>支出</option>
          <option value="收入">收入</option>
        </select>

        <label>金額</label>
        <input type="number" id="amount" min="0.01" step="0.01" required>

        <label>分類</label>
        <select id="category">
          <option>共用</option>
          <option>黃支出</option>
          <option>蕭支出</option>
          <option>信用卡</option>
          <option>收入</option>
          <option>負債</option>
          <option>平衡</option>
          <option>公司代墊</option>
          <option>其他</option>
        </select>

        <label>帳戶（轉出帳戶）</label>
        <select id="account">
          <option>合作金庫</option><option>刷卡</option><option>國泰世華</option><option>華南銀行</option>
          <option>黃中信</option><option>黃現金</option><option>黃郵局</option><option>黃LINE</option>
          <option>彰化銀行</option><option>蕭現金</option><option>蕭郵局</option><option>蕭LINE</option>
        </select>

        <label>項目</label>
        <input id="item" placeholder="">

        <label>備註</label>
        <input id="note" placeholder="">

        <label>
          <input type="checkbox" id="isTransfer"> 互轉（自動：分類=平衡、項目=內控互轉）
        </label>

        <div id="transferFields" style="display:none;">
          <label>轉入帳戶</label>
          <select id="accountIn">
            <option>合作金庫</option><option>刷卡</option><option>國泰世華</option><option>華南銀行</option>
            <option>黃中信</option><option>黃現金</option><option>黃郵局</option><option>黃LINE</option>
            <option>彰化銀行</option><option>蕭現金</option><option>蕭郵局</option><option>蕭LINE</option>
          </select>
        </div>

        <button class="btn" type="submit">送出</button>
      </form>
    </div>

    <div class="card" id="settings">
      <h1>設定</h1>
      <label>Endpoint URL</label>
      <input id="endpoint" value="https://script.google.com/macros/s/AKfycbzjpwoEGtRpX9FnQ0i-rSjvgaUB40gG44tBAcd_tI30R1X9HydICtdlSiooJXViatJZ/exec">
      <label>API Key（可留空）</label>
      <input id="apiKey">
      <div class="rowbtns">
        <button class="btn secondary row" id="btnTest" type="button">連線測試</button>
        <button class="btn secondary row" id="btnSaveCfg" type="button">儲存設定</button>
      </div>
      <p class="muted mono" id="cfgHint"></p>
    </div>

    <div class="card">
      <h1>發送紀錄</h1>
      <div class="rowbtns">
        <button class="btn secondary row" id="btnExport" type="button">匯出 CSV</button>
        <button class="btn secondary row" id="btnClear" type="button">清除紀錄</button>
      </div>
      <p class="muted">僅儲存在此裝置（本機）。最多保留 50 筆最新紀錄。</p>
      <div class="log" id="log"></div>
    </div>

    <div class="card">
      <h1>餘額查詢</h1>
      <label>月份（yyyy-MM，可留空）</label>
      <input id="qMonth" placeholder="例如 2025-09">
      <label>登記人（可留空）</label>
      <select id="qOwner">
        <option value="">（全部）</option>
        <option>欣宜</option>
        <option>喬猷</option>
      </select>
      <div class="rowbtns">
        <button class="btn secondary row" id="btnBalance" type="button">查詢各帳戶餘額</button>
      </div>
      <div id="balanceArea">
        <p class="muted mono" id="balanceResult">—</p>
        <table class="table" id="balanceTable" style="display:none">
          <thead><tr><th>帳戶</th><th class="right">餘額</th></tr></thead>
          <tbody></tbody>
          <tfoot><tr><th>總計</th><th class="right" id="balanceTotal">0.00</th></tr></tfoot>
        </table>
      </div>
    </div>

  </div>

  <div id="toast" class="toast"></div>

  <script>
    const $ = id => document.getElementById(id);
    const toast = (msg) => { const t=$('toast'); t.textContent=msg; t.classList.add('show'); setTimeout(()=>t.classList.remove('show'),2000); };
    
    let isSubmitting = false; // <-- ⭐ 修改：新增提交旗標，防止重複提交

    // 統一帳戶清單（也用於餘額表順序）
    const ACCOUNTS = ['合作金庫','刷卡','國泰世華','華南銀行','黃中信','黃現金','黃郵局','黃LINE','彰化銀行','蕭現金','蕭郵局','蕭LINE'];

    // 初始日期（手機時區）
    $('date').value = new Date(Date.now() - new Date().getTimezoneOffset()*60000).toISOString().slice(0,10);

    // 登記人→帳戶預設（喬猷→黃現金）
    $('owner').onchange = () => { if ($('owner').value === '喬猷') $('account').value = '黃現金'; };

    // 互轉：帶入並鎖定 分類/項目
    $('isTransfer').onchange = () => {
      const on = $('isTransfer').checked;
      $('transferFields').style.display = on ? 'block' : 'none';
      if (on) {
        $('category').value = '平衡';
        $('category').disabled = true;
        $('item').value = '內控互轉';
        $('item').disabled = true;
      } else {
        $('category').disabled = false;
        $('item').disabled = false;
      }
    };

    // 發送紀錄（localStorage）
    const SENT_KEY = 'spend.sent.v7';
    function loadSent(){ try{ return JSON.parse(localStorage.getItem(SENT_KEY) || '[]'); }catch{ return []; } }
    function saveSent(list){ localStorage.setItem(SENT_KEY, JSON.stringify(list.slice(-50))); }
    function addSent(rec){ const list = loadSent(); list.push(rec); saveSent(list); }
    function renderLog(){
      const list = loadSent().slice().reverse();
      if (!list.length){ $('log').innerHTML = '<div class="muted">尚無紀錄</div>'; return; }
      let html = '<table><thead><tr><th>時間</th><th>方向/金額</th><th>分類/帳戶</th><th>項目/備註</th><th>登記人</th></tr></thead><tbody>';
      for (const r of list){
        const cls = r.direction==='支出' ? 'neg' : 'pos';
        const amt = Number(r.amount || 0);
        html += `<tr>
          <td class="muted">${r.ts||''}</td>
          <td class="${cls}">${r.direction} ${r.direction==='支出'?'-':''}${amt.toFixed(2)}</td>
          <td>${r.category}｜${r.account}</td>
          <td>${r.item||''}｜${r.note||''}</td>
          <td>${r.owner||''}</td>
        </tr>`;
      }
      html += '</tbody></table>';
      $('log').innerHTML = html;
    }
    function csvEscape(s){ if(s==null) return ''; const t=String(s).replace(/"/g,'""'); return /[",\n]/.test(t) ? `"${t}"` : t; }
    function exportCSV(){
      const list = loadSent();
      const header = ['日期','時間戳','方向','金額','分類','帳戶','項目','備註','登記人'];
      const rows = [header.join(',')];
      for (const r of list){
        rows.push([r.date||'', r.ts||'', r.direction||'', r.amount||'', r.category||'', r.account||'', r.item||'', r.note||'', r.owner||''].map(csvEscape).join(','));
      }
      const blob = new Blob([rows.join('\n')], {type:'text/csv;charset=utf-8;'});
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a'); a.href = url; a.download = 'spend-log.csv'; a.click();
      URL.revokeObjectURL(url);
    }
    $('btnExport').onclick = exportCSV;
    $('btnClear').onclick = ()=>{ if(confirm('清除本機發送紀錄？')){ localStorage.removeItem(SENT_KEY); renderLog(); } };

    // 背景送出：sendBeacon 優先，其次 fetch keepalive
    function backgroundSend(url, payloadObj){
      const body = new URLSearchParams(payloadObj).toString();
      const mime = 'application/x-www-form-urlencoded;charset=UTF-8';
      if (navigator.sendBeacon) {
        navigator.sendBeacon(url, new Blob([body], {type: mime}));
      } else {
        fetch(url, { method:'POST', headers:{'Content-Type': mime}, body, keepalive:true }).catch(()=>{});
      }
    }

    // 送出（不等待回應，且送出後不再自動聚焦到金額）
    $('form').onsubmit = (e)=>{
      e.preventDefault();

      if (isSubmitting) return; // <-- ⭐ 修改：如果正在提交，直接跳出
      isSubmitting = true;     // <-- ⭐ 修改：標記為正在提交

      const date = $('date').value;
      const owner = $('owner').value;
      const direction = $('direction').value;
      const amount = $('amount').value;
      const isXfer = $('isTransfer').checked;
      const category = isXfer ? '平衡' : $('category').value;
      const account = $('account').value;
      const item = isXfer ? '內控互轉' : $('item').value.trim();
      const note = $('note').value.trim();
      const accountIn = $('accountIn').value;

      if (!date || !amount || Number(amount) <= 0 || !category || !account || !item) {
        toast('請完整填寫資料');
        isSubmitting = false; // <-- ⭐ 修改：驗證失敗，重置旗標
        return;
      }
      if (isXfer && !accountIn){
        toast('請填入「轉入帳戶」');
        isSubmitting = false; // <-- ⭐ 修改：驗證失敗，重置旗標
        return;
      }

      const endpoint = $('endpoint').value.trim();
      const apiKey = $('apiKey').value.trim();

      // 樂觀 UI：本機紀錄 + 清空
      const d = new Date(); const pad=n=>String(n).padStart(2,'0');
      const ts = `${d.getFullYear()}-${pad(d.getMonth()+1)}-${pad(d.getDate())} ${pad(d.getHours())}:${pad(d.getMinutes())}:${pad(d.getSeconds())}`;
      const norm = s=>s.replace(/^合作$/,'合作金庫').replace(/^蕭賴$/,'蕭LINE');

      if (isXfer){
        addSent({ ts, date, owner, direction:'支出', amount:Number(amount), category, account:norm(account), item, note });
        addSent({ ts, date, owner, direction:'收入', amount:Number(amount), category, account:norm(accountIn), item, note });
      } else {
        addSent({ ts, date, owner, direction, amount:Number(amount), category, account:norm(account), item, note });
      }
      renderLog();

      // 清空/復原互轉鎖定（不再自動 focus 到金額）
      $('amount').value=''; $('item').value=''; $('note').value='';
      if (isXfer) {
        $('isTransfer').checked=false;
        $('transferFields').style.display='none';
        $('category').disabled=false;
        $('item').disabled=false;
      }
      toast(isXfer ? '已送出（背景處理：互轉×2）' : '已送出（背景處理）');

      // 實際送出（單次請求；互轉後端拆兩筆）
      const payload = { date, owner, amount, category, account:norm(account), item, note, apiKey };
      if (isXfer){ payload.isTransfer='true'; payload.accountIn=norm(accountIn); }
      else { payload.direction = direction; }
      backgroundSend(endpoint, payload);

      // <-- ⭐ 修改：1秒後才允許下次提交，防止網路延遲或雙擊造成的重複記帳
      setTimeout(() => { isSubmitting = false; }, 1000); 
    };

    // 餘額查詢（各帳戶）
    $('btnBalance').onclick = async () => {
      const endpoint = $('endpoint').value.trim();
      if (!endpoint) { toast('請先在「設定」填入 Endpoint'); return; }
      const params = new URLSearchParams({ balance: '1', by: 'account' });
      const m = $('qMonth').value.trim();
      const own = $('qOwner').value.trim();
      if (m) params.set('month', m);
      if (own) params.set('owner', own);

      $('balanceResult').textContent = '查詢中…';
      $('balanceTable').style.display = 'none';
      try {
        const res = await fetch(`${endpoint}?${params.toString()}`);
        if (!res.ok) throw 0;
        const data = await res.json();
        if (!data.ok || !Array.isArray(data.breakdown)) throw 0;

        // 以固定帳戶清單為主，缺的補 0，順序一致
        const map = new Map(data.breakdown.map(x => [x.account, Number(x.balance || 0)]));
        const rows = ACCOUNTS.map(a => ({ account:a, balance: map.has(a)? map.get(a): 0 }));
        const tbody = document.querySelector('#balanceTable tbody');
        tbody.innerHTML = rows.map(r => `<tr><td>${r.account}</td><td class="right">${r.balance.toFixed(2)}</td></tr>`).join('');
        const total = rows.reduce((s,r)=>s+r.balance,0);
        $('balanceTotal').textContent = total.toFixed(2);
        $('balanceResult').textContent = `來源：${data.source || 'detail.byAccount'}${m?`｜月份：${m}`:''}${own?`｜登記人：${own}`:''}`;
        $('balanceTable').style.display = '';
      } catch {
        $('balanceResult').textContent = '查詢失敗，請檢查 Endpoint/權限';
      }
    };

    // 設定與預熱
    function loadCfg(){ $('cfgHint').textContent = $('endpoint').value ? '已設定 Endpoint' : '尚未設定 Endpoint'; }
    $('btnTest').onclick = async ()=>{
      try { const r = await fetch($('endpoint').value.trim() + '?ping=1'); toast(r.ok ? '連線正常' : '連線失敗'); }
      catch { toast('連線失敗'); }
    };
    $('btnSaveCfg').onclick = ()=>{ loadCfg(); toast('設定已儲存'); };

    (function init(){
      loadCfg(); renderLog();
      if ($('owner').value === '喬猷') $('account').value = '黃現金';
      fetch($('endpoint').value.trim() + '?ping=1').catch(()=>{});
    })();
  </script>
</body>
</html>
