/**
 * memo-calendar — browser half.
 *
 * A sticky-note memo board on the left and a nature-toned month calendar on the
 * right, rendered as a sidebar panel of the Harness Web UI. Notes live in the
 * Host's memo-calendar data file with a localStorage copy as cache/fallback,
 * and can be exported/imported as a backup file.
 *
 * Hand-written ModuleLoader bundle: no build step, no JSX.
 */
window.__ModuleLoader__.load({
  id: 'dsh-sticky-notes',
  factory(require) {
    var module = { exports: {} };
    var exports = module.exports;
    Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });

    var React = require('react');
    var h = React.createElement;

    var NS = 'memo-calendar';
    var STORAGE_KEY = 'dsh.memo-calendar.v1';
    var HOST_STATE = '/memo-calendar/state';

    var zh = {
      nav: '便利贴日历',
      title: '便利贴备忘录',
      subtitle: '把日程写进便签，让每一天都有迹可循',
      today: '今天',
      newNote: '新建便利贴',
      notesTitle: '我的便利贴',
      filterAll: '全部',
      filterDay: '当天',
      allDay: '全天',
      untitled: '未命名便利贴',
      toggleDone: '标记完成',
      edit: '编辑',
      delete: '删除',
      save: '保存',
      cancel: '取消',
      placeholder: '写下这一天的安排…',
      date: '日期',
      time: '时间',
      color: '颜色',
      saveHint: 'Ctrl + Enter 保存 · Esc 取消',
      colorPink: '陶土',
      colorMint: '苔绿',
      colorLemon: '麦黄',
      colorSky: '溪蓝',
      colorLilac: '石灰',
      emptyNotes: '还没有便利贴，点「新建便利贴」写下第一张吧。',
      emptyDone: '没有未完成的便利贴，已完成的可以在「已完成」里查看。',
      emptyDoneWall: '还没有已完成的便签。',
      dayEmptyDone: '这一天没有已完成的便签。',
      doneHint: '已完成的 {n} 条可在「已完成」里查看',
      doneFlash: '已完成，记录已保存',
      tabOpen: '未完成 {n}',
      tabDone: '已完成 {n}',
      backToOpen: '返回未完成',
      completedAt: '{d} 完成',
      doneLabel: '已完成',
      moreNotes: '还有 {n} 条',
      restore: '标记未完成',
      nowLabel: '现在',
      todayStat: '今日 {n} 条',
      monthStat: '本月 {n} 条',
      doneStat: '已完成 {n}',
      dayEmpty: '这一天还没有安排，加一张便利贴吧。',
      addForDay: '加一张',
      calendarSub: '每一格，都是一天的记录',
      prevMonth: '上个月',
      nextMonth: '下个月',
      calendarGrid: '月历',
      jumpToDate: '跳到这一天',
      wd0: '日',
      wd1: '一',
      wd2: '二',
      wd3: '三',
      wd4: '四',
      wd5: '五',
      wd6: '六',
      dateLabel: '{m}月{d}日 · 周{w}',
      exportJson: '导出备份',
      importJson: '导入',
      importDone: '已导入 {n} 条便利贴',
      importFailed: '导入失败，请检查文件格式',
      seedToday: '今天：给窗边的绿植浇水',
      seedSoon: '周末：泡一壶茶，去公园走走',
      storageHint: '数据保存在本浏览器',
      storageHost: '已保存到本机，重启后仍在',
      agendaTitle: '当日日程',
      noteCount: '{n} 张',
      crash: '便利贴面板渲染出错了，刷新页面后再试一次。'
    };

    var en = {
      nav: 'Sticky Calendar',
      title: 'Sticky Note Memo',
      subtitle: 'Schedules on notes, days on the calendar',
      today: 'Today',
      newNote: 'New note',
      notesTitle: 'My notes',
      filterAll: 'All',
      filterDay: 'This day',
      allDay: 'All day',
      untitled: 'Untitled note',
      toggleDone: 'Mark done',
      edit: 'Edit',
      delete: 'Delete',
      save: 'Save',
      cancel: 'Cancel',
      placeholder: 'What is happening on this day…',
      date: 'Date',
      time: 'Time',
      color: 'Color',
      saveHint: 'Ctrl + Enter saves · Esc cancels',
      colorPink: 'Clay',
      colorMint: 'Moss',
      colorLemon: 'Wheat',
      colorSky: 'Creek',
      colorLilac: 'Stone',
      emptyNotes: 'No notes yet — tap “New note” to write your first one.',
      emptyDone: 'No open notes — completed ones are kept in the Done tab.',
      emptyDoneWall: 'No completed notes yet.',
      dayEmptyDone: 'No completed notes on this day.',
      doneHint: '{n} completed notes are kept in the Done tab',
      doneFlash: 'Completed and recorded',
      tabOpen: 'Open {n}',
      tabDone: 'Done {n}',
      backToOpen: 'Back to open',
      completedAt: 'done {d}',
      doneLabel: 'Done',
      moreNotes: '{n} more',
      restore: 'Mark as not done',
      nowLabel: 'Now',
      todayStat: '{n} today',
      monthStat: '{n} this month',
      doneStat: '{n} done',
      dayEmpty: 'Nothing planned yet — add a sticky note.',
      addForDay: 'Add',
      calendarSub: 'Each square is a day',
      prevMonth: 'Previous month',
      nextMonth: 'Next month',
      calendarGrid: 'Month calendar',
      jumpToDate: 'Jump to this date',
      wd0: 'Sun',
      wd1: 'Mon',
      wd2: 'Tue',
      wd3: 'Wed',
      wd4: 'Thu',
      wd5: 'Fri',
      wd6: 'Sat',
      dateLabel: '{w}, {m}/{d}',
      exportJson: 'Export',
      importJson: 'Import',
      importDone: 'Imported {n} notes',
      importFailed: 'Import failed — check the file format',
      seedToday: 'Today: water the plants by the window',
      seedSoon: 'Weekend: brew tea, walk in the park',
      storageHint: 'Saved in this browser',
      storageHost: 'Saved on this machine — survives restarts',
      agendaTitle: 'Day schedule',
      noteCount: '{n} notes',
      crash: 'The memo board failed to render. Reload the page and try again.'
    };

    var CSS = `
.mc-root{
  --mc-ink:var(--dsw-alias-label-primary);
  --mc-muted:var(--dsw-alias-label-secondary);
  --mc-line:var(--dsw-alias-border-l1);
  --mc-line2:var(--dsw-alias-border-l2);
  --mc-panel:var(--dsw-alias-bg-layer-1);
  --mc-panel2:var(--dsw-alias-bg-layer-2);
  --mc-accent:var(--dsw-alias-brand-primary);
  --mc-moss:#5f7f52;
  --mc-moss-deep:#47613f;
  --mc-leaf:#8fae72;
  --mc-sand:#d8c9a6;
  --mc-bark:#6d5a45;
  --mc-clay:#b97b5a;
  display:flex;flex-direction:column;gap:18px;height:100%;min-height:0;overflow:auto;
  padding:22px 26px 26px;box-sizing:border-box;color:var(--mc-ink);background:var(--dsw-alias-bg-base);
  font-family:"Segoe UI","PingFang SC","Hiragino Sans GB","Microsoft YaHei",system-ui,-apple-system,sans-serif;
}
.mc-root *{box-sizing:border-box}
.mc-root h1,.mc-root h2,.mc-root p{margin:0}
.mc-root button{font:inherit;color:inherit;background:none;border:0;padding:0;cursor:pointer}
.mc-root :is(button,input,textarea):focus-visible{outline:2px solid var(--mc-moss);outline-offset:2px}

.mc-top{display:flex;flex:none;align-items:flex-start;justify-content:space-between;gap:18px;flex-wrap:wrap}
.mc-brand{display:flex;align-items:center;gap:14px;min-width:0}
.mc-brandMark{
  width:52px;height:52px;flex:none;border-radius:14px;display:grid;place-items:center;color:#f3f6ec;
  background:linear-gradient(150deg,#78994f,#3f5c3a);
  box-shadow:0 5px 14px rgba(55,75,45,.24);
}
.mc-brandText h1{font-size:24px;font-weight:700;letter-spacing:.01em;line-height:1.2}
.mc-brandText p{margin-top:4px;font-size:13px;line-height:1.5;color:var(--mc-muted)}
.mc-topActions{display:flex;align-items:center;gap:10px;padding-top:8px}

.mc-primary{
  border-radius:9px;padding:10px 18px;font-size:14px;font-weight:600;color:#f6f8f1;
  background:linear-gradient(140deg,var(--mc-moss),var(--mc-moss-deep));
  box-shadow:0 3px 10px rgba(55,75,45,.24);
  transition:transform .15s,box-shadow .15s;
}
.mc-primary:hover{transform:translateY(-1px);box-shadow:0 5px 14px rgba(55,75,45,.32)}
.mc-primary:active{transform:translateY(0)}
.mc-ghost{
  border-radius:9px;padding:9px 15px;font-size:13.5px;color:var(--mc-ink);
  border:1px solid var(--mc-line2);background:var(--mc-panel);
  transition:border-color .15s,background .15s;
}
.mc-ghost:hover{border-color:var(--mc-moss);background:var(--mc-panel2)}

.mc-columns{display:grid;flex:none;align-items:start;gap:20px;grid-template-columns:minmax(320px,.92fr) minmax(400px,1.08fr)}
.mc-left{display:flex;flex-direction:column;gap:16px;min-width:0}
.mc-right{display:flex;flex-direction:column;gap:16px;min-width:0;min-height:0}

/* ── sticky notes ───────────────────────────────────────────────────── */
.mc-notes{
  display:flex;flex-direction:column;gap:14px;min-width:0;padding:16px;
  border:1px solid var(--mc-line);border-radius:14px;background:var(--mc-panel);
  box-shadow:0 2px 8px rgba(40,50,35,.05);
}
.mc-notesHead{display:flex;flex:none;flex-direction:column;align-items:stretch;gap:9px}
.mc-notesTools{display:flex;align-items:center;justify-content:space-between;gap:8px;flex-wrap:wrap}
.mc-tabs{display:flex;align-items:center;gap:14px}
.mc-tab{
  position:relative;font-size:12.5px;font-weight:600;color:var(--mc-muted);
  padding:2px 0 3px;border-bottom:2px solid transparent;
  transition:color .15s,border-color .15s;
}
.mc-tab:hover{color:var(--mc-ink)}
.mc-tab.isOn{color:var(--mc-ink);border-bottom-color:var(--mc-moss)}
.mc-notesTitle{display:flex;align-items:center;gap:8px;font-size:15px;font-weight:600}
.mc-notesIcon{display:grid;place-items:center;width:18px;height:18px;color:var(--mc-moss)}
.mc-count{
  font-size:12px;font-weight:600;color:var(--mc-muted);
  background:var(--mc-panel2);border:1px solid var(--mc-line);border-radius:999px;padding:1px 8px;
}
.mc-filters{display:flex;gap:3px;background:var(--mc-panel2);border:1px solid var(--mc-line);border-radius:999px;padding:2px}
.mc-filter{font-size:13px;padding:4px 12px;border-radius:999px;color:var(--mc-muted);transition:background .15s,color .15s}
.mc-filter:hover{color:var(--mc-ink)}
.mc-filter.isOn{background:var(--mc-panel);color:var(--mc-ink);box-shadow:0 1px 3px rgba(0,0,0,.10)}
.mc-hintLine{flex:none;font-size:12.5px;line-height:1.5;color:var(--mc-muted)}
.mc-noteGrid{
  display:grid;align-content:start;gap:14px;padding:6px 4px 2px;
  grid-template-columns:repeat(auto-fill,minmax(152px,1fr));
}

.mc-note{
  position:relative;display:flex;flex-direction:column;gap:8px;min-height:124px;padding:13px 14px 12px;
  border:1px solid rgba(255,255,255,.5);border-radius:10px;
  transform:rotate(var(--mc-tilt,0deg));
  box-shadow:0 3px 10px rgba(45,35,25,.16);
  transition:transform .18s,box-shadow .18s;
}
.mc-note:hover{transform:rotate(0deg) translateY(-2px);box-shadow:0 8px 18px rgba(45,35,25,.22);z-index:2}
.mc-note::after{
  content:'';position:absolute;right:0;bottom:0;width:0;height:0;
  border-style:solid;border-width:0 0 13px 13px;
  border-color:transparent transparent rgba(0,0,0,.06) transparent;
  border-radius:0 0 10px 0;pointer-events:none;
}
.mc-tape{
  position:absolute;left:50%;top:-6px;width:48px;height:12px;transform:translateX(-50%) rotate(-1.5deg);
  background:rgba(255,255,255,.4);border:1px solid rgba(255,255,255,.55);border-radius:2px;
  box-shadow:0 1px 2px rgba(0,0,0,.08);pointer-events:none;
}
.mc-noteTop{display:flex;align-items:center;justify-content:space-between;gap:6px}
.mc-noteDate{font-size:12px;font-weight:700;letter-spacing:.01em;opacity:.72;text-align:left}
.mc-noteDate:hover{text-decoration:underline dotted}
.mc-noteText{flex:1;font-size:14px;line-height:1.55;white-space:pre-wrap;word-break:break-word}
.mc-note.mc-done .mc-noteText{opacity:.62;text-decoration:line-through}
.mc-noteFoot{display:flex;align-items:center;justify-content:space-between;gap:6px;margin-top:2px}
.mc-time{font-size:12px;font-weight:600;opacity:.66;font-variant-numeric:tabular-nums}
.mc-noteActions{display:flex;gap:3px;opacity:0;transition:opacity .15s}
.mc-note:hover .mc-noteActions,.mc-note:focus-within .mc-noteActions{opacity:1}
.mc-mini{
  width:24px;height:24px;border-radius:6px;display:grid;place-items:center;
  font-size:13px;line-height:1;background:rgba(255,255,255,.45);color:inherit;
}
.mc-mini:hover{background:rgba(255,255,255,.85)}
.mc-check{
  width:26px;height:26px;flex:none;border:1.5px solid rgba(0,0,0,.28);border-radius:50%;
  display:grid;place-items:center;color:var(--mc-ink);background:rgba(255,255,255,.25);
  transition:background .15s,border-color .15s,color .15s;
}
.mc-check svg{opacity:.32;transition:opacity .15s}
.mc-check:hover{background:rgba(255,255,255,.85);border-color:var(--mc-moss);color:var(--mc-moss)}
.mc-check:hover svg,.mc-check:focus-visible svg{opacity:1}
.mc-check.isOn{background:var(--mc-moss);border-color:var(--mc-moss);color:#f6f8f1}
.mc-check.isOn svg{opacity:1}

.mc-editor{
  grid-column:1/-1;display:flex;flex-direction:column;gap:9px;padding:13px;border-radius:12px;
  border:1px solid rgba(255,255,255,.55);box-shadow:0 6px 18px rgba(45,35,25,.18);
}
.mc-editorText{
  width:100%;min-height:86px;padding:9px 10px;border:1px solid rgba(0,0,0,.08);border-radius:8px;
  font:inherit;font-size:13.5px;line-height:1.55;resize:vertical;outline:none;
  background:rgba(255,255,255,.8);color:#33291f;
}
.mc-editorText:focus{border-color:rgba(95,127,82,.55);box-shadow:0 0 0 3px rgba(143,174,114,.18)}
.mc-editorRow{display:flex;align-items:flex-end;gap:8px;flex-wrap:wrap}
.mc-field{display:flex;flex:1;flex-direction:column;gap:3px;min-width:98px;font-size:11.5px;font-weight:600;opacity:.85}
.mc-field input{
  width:100%;min-height:30px;padding:4px 7px;border:1px solid rgba(0,0,0,.1);border-radius:7px;
  background:rgba(255,255,255,.85);color:#33291f;font:inherit;font-size:12.5px;
}
.mc-fieldLabel{font-size:11.5px;font-weight:600;opacity:.85}
.mc-colors{align-items:center}
.mc-swatches{display:flex;gap:6px}
.mc-swatch{
  width:24px;height:24px;border:1.5px solid rgba(255,255,255,.75);border-radius:7px;
  display:grid;place-items:center;font-size:11px;line-height:1;box-shadow:0 1px 3px rgba(0,0,0,.12);
}
.mc-swatch.isOn{outline:2px solid rgba(71,97,63,.6);outline-offset:1px}
.mc-editorActions{display:flex;align-items:center;justify-content:space-between;gap:8px;flex-wrap:wrap}
.mc-hintTxt{font-size:11px;opacity:.6}
.mc-editorBtns{display:flex;align-items:center;gap:6px}
.mc-editorBtns .mc-primary{padding:6px 13px;font-size:12.5px}
.mc-editorBtns .mc-ghost{padding:6px 11px;font-size:12.5px;background:rgba(255,255,255,.5);border-color:rgba(0,0,0,.12)}
.mc-dangerTxt{font-size:12px;padding:4px 6px;border-radius:7px;color:#9c4b32}
.mc-dangerTxt:hover{background:rgba(255,255,255,.6)}

.mc-empty{
  display:flex;flex-direction:column;align-items:center;justify-content:center;gap:10px;
  padding:30px 16px;text-align:center;border:1.5px dashed var(--mc-line2);border-radius:12px;color:var(--mc-muted);
}
.mc-emptyArt{display:grid;place-items:center;color:var(--mc-moss);opacity:.85}
.mc-empty p{font-size:13.5px;line-height:1.6}
.mc-notesFoot{
  display:flex;flex:none;align-items:center;justify-content:space-between;gap:8px;flex-wrap:wrap;
  padding-top:10px;border-top:1px dashed var(--mc-line);
}
.mc-linkBtn{font-size:12px;color:var(--mc-muted)}
.mc-linkBtn:hover{color:var(--mc-moss);text-decoration:underline}
.mc-notice{font-size:12px;font-weight:600;color:var(--mc-moss)}

/* ── now card (digital + analog clock) ────────────────────────────── */
.mc-now{
  position:relative;overflow:hidden;display:flex;flex-direction:column;gap:6px;min-width:0;
  padding:16px 18px 18px;border:1px solid var(--mc-line);border-radius:14px;
  background:linear-gradient(135deg,rgba(143,174,114,.12),rgba(216,201,166,.12));
}
.mc-nowMain{position:relative;z-index:1;display:flex;align-items:center;justify-content:space-between;gap:16px}
.mc-nowInfo{display:flex;flex:1;flex-direction:column;gap:5px;min-width:0}
.mc-nowHead{display:flex;align-items:baseline;justify-content:space-between;gap:10px}
.mc-nowLabel{font-size:11.5px;font-weight:700;letter-spacing:.16em;color:var(--mc-muted)}
.mc-nowDate{font-size:13px;color:var(--mc-muted)}
.mc-nowTime{
  display:flex;align-items:baseline;gap:2px;font-size:36px;font-weight:700;line-height:1.05;
  font-variant-numeric:tabular-nums;letter-spacing:.01em;
}
.mc-nowSec{font-size:15px;font-weight:600;color:var(--mc-muted)}
.mc-nowStats{font-size:12.5px;line-height:1.5;color:var(--mc-muted)}
.mc-nowArt{
  position:absolute;left:-10px;bottom:-16px;width:120px;height:90px;
  color:var(--mc-moss);opacity:.15;pointer-events:none;
}
.mc-clock{width:104px;height:104px;flex:none}
.mc-clock-face{fill:var(--mc-panel);stroke:var(--mc-line2);stroke-width:2}
.mc-clock-tick{stroke:var(--mc-muted);stroke-width:2;stroke-linecap:round;opacity:.65}
.mc-clock-tick.major{stroke-width:2.6;opacity:.9}
.mc-clock-hour{stroke:var(--mc-ink);stroke-width:3.6;stroke-linecap:round}
.mc-clock-minute{stroke:var(--mc-ink);stroke-width:2.3;stroke-linecap:round}
.mc-clock-second{stroke:#d9433a;stroke-width:1.3;stroke-linecap:round}
.mc-clock-center{fill:var(--mc-ink)}
.mc-clock-dot{fill:#d9433a}

/* ── natural calendar (compact) ───────────────────────────────────── */
.mc-cal{
  position:relative;display:flex;flex:none;flex-direction:column;min-width:0;overflow:hidden;
  border:1px solid var(--mc-line);border-radius:16px;background:var(--mc-panel);
  box-shadow:0 2px 10px rgba(40,55,35,.06);
}
.mc-sky{
  position:relative;flex:none;overflow:hidden;padding:14px 18px 12px;
  background:linear-gradient(115deg,rgba(120,160,105,.18),rgba(214,196,150,.16) 55%,rgba(126,166,155,.16));
  border-bottom:1px solid var(--mc-line);
}
.mc-sky::after{
  content:'';position:absolute;inset:0;pointer-events:none;
  background:radial-gradient(70% 130% at 84% -20%,rgba(255,236,180,.38),transparent 62%);
}
.mc-leaf{
  position:absolute;top:-12px;width:10px;height:7px;border-radius:60% 0 60% 0;
  background:linear-gradient(135deg,#a9c189,#6f8f5f);opacity:0;pointer-events:none;z-index:1;
  animation:mc-leaf-fall 14s linear infinite;
}
.mc-leaf:nth-child(1){left:9%;animation-duration:13s}
.mc-leaf:nth-child(2){left:32%;width:8px;height:6px;animation-duration:17s;animation-delay:-5s}
.mc-leaf:nth-child(3){left:55%;animation-duration:15s;animation-delay:-9s}
.mc-leaf:nth-child(4){left:74%;width:9px;height:6px;animation-duration:19s;animation-delay:-3s}
.mc-leaf:nth-child(5){left:90%;width:7px;height:5px;animation-duration:16s;animation-delay:-12s}
@keyframes mc-leaf-fall{
  0%{transform:translateY(-14px) rotate(0deg);opacity:0}
  14%{opacity:.75}
  100%{transform:translateY(200px) translateX(24px) rotate(240deg);opacity:0}
}
.mc-calHead{
  position:relative;z-index:2;display:flex;align-items:center;justify-content:space-between;
  gap:10px;flex-wrap:wrap;padding-right:58px;
}
.mc-calTitle{display:flex;align-items:center;gap:8px;font-size:18px;font-weight:700;letter-spacing:.01em}
.mc-titleLeaf{display:grid;place-items:center;color:var(--mc-moss)}
.mc-calSub{margin-top:3px;font-size:12px;color:var(--mc-muted)}
.mc-calNav{
  display:flex;align-items:center;gap:2px;padding:2px;border-radius:999px;
  background:var(--mc-panel2);border:1px solid var(--mc-line);
}
.mc-navBtn{width:27px;height:27px;border-radius:50%;display:grid;place-items:center;font-size:16px;line-height:1}
.mc-navBtn:hover{background:var(--mc-panel)}
.mc-todayBtn{font-size:12.5px;padding:3px 10px;border-radius:999px}
.mc-todayBtn:hover{background:var(--mc-panel)}
.mc-sprig{
  position:absolute;right:14px;top:10px;width:48px;height:48px;z-index:3;pointer-events:none;
  filter:drop-shadow(0 3px 6px rgba(60,80,50,.18));
}
.mc-calBody{display:flex;flex:none;flex-direction:column;gap:6px;padding:10px 12px 12px}
.mc-wdRow,.mc-grid{display:grid;grid-template-columns:repeat(7,minmax(0,1fr));gap:5px}
.mc-wd{
  padding:1px 0;text-align:center;font-size:12px;font-weight:700;letter-spacing:.02em;color:var(--mc-muted);
}
.mc-wd.isSun{color:#a6664b}
.mc-wd.isSat{color:#4e7b74}
.mc-grid{grid-auto-rows:62px}
.mc-cell{
  position:relative;display:flex;align-items:center;justify-content:center;min-height:0;overflow:hidden;
  padding:4px;text-align:center;border:1px solid var(--mc-line);border-radius:10px;
  background:var(--mc-panel2);
  transition:border-color .15s;
}
.mc-cell:hover{border-color:var(--mc-leaf)}
.mc-cell.mc-out{opacity:.4}
.mc-cell.mc-selected{border-color:var(--mc-moss);box-shadow:inset 0 0 0 1px var(--mc-moss)}
.mc-cell.mc-today{background:linear-gradient(160deg,rgba(224,65,58,.05),var(--mc-panel2) 72%)}
.mc-cellNum{
  position:relative;z-index:1;font-size:22px;font-weight:600;line-height:1;letter-spacing:-.02em;
  font-variant-numeric:tabular-nums;
}
.mc-sun .mc-cellNum{color:#a6664b}
.mc-sat .mc-cellNum{color:#4e7b74}
.mc-squares{position:absolute;inset:0;z-index:1;pointer-events:none}
.mc-sq{
  position:absolute;width:7px;height:7px;border-radius:2px;pointer-events:auto;cursor:pointer;
  box-shadow:0 0 0 1.5px var(--mc-panel2);
}
.mc-sq.p0{left:9px;top:8px}
.mc-sq.p1{right:9px;top:8px}
.mc-sq.p2{left:9px;bottom:8px}
.mc-sq.p3{right:9px;bottom:8px}
.mc-sqMore{
  position:absolute;right:6px;bottom:5px;font-size:9px;font-weight:700;color:var(--mc-muted);
  pointer-events:auto;
}
.mc-todayRing{
  position:absolute;inset:3px;pointer-events:none;color:#d9433a;opacity:.88;
}
.mc-todayRing svg{display:block;width:100%;height:100%;overflow:visible}
.mc-todayRing path{
  stroke-dasharray:380;stroke-dashoffset:380;
  animation:mc-pen .8s ease-out forwards;
}
.mc-todayRing path:nth-child(2){animation-delay:.16s;animation-duration:.95s}
@keyframes mc-pen{to{stroke-dashoffset:0}}

/* ── day agenda ────────────────────────────────────────────────────── */
.mc-agenda{
  display:flex;flex:none;flex-direction:column;gap:8px;min-width:0;
  padding:14px 16px;border:1px solid var(--mc-line);border-radius:14px;background:var(--mc-panel);
}
.mc-agendaHead{display:flex;flex:none;align-items:center;justify-content:space-between;gap:8px;flex-wrap:wrap}
.mc-agendaTitle{display:flex;align-items:center;gap:8px;font-size:14px;font-weight:600}
.mc-dotMark{
  width:8px;height:8px;flex:none;border-radius:2px 60% 2px 60%;
  background:linear-gradient(135deg,var(--mc-leaf),var(--mc-moss));
}
.mc-addBtn{
  padding:4px 11px;border:1px dashed var(--mc-line2);border-radius:999px;
  font-size:12.5px;font-weight:600;color:var(--mc-muted);
}
.mc-addBtn:hover{color:var(--mc-moss);border-color:var(--mc-moss)}
.mc-agendaList{
  display:flex;flex-direction:column;gap:6px;margin:0;padding:0;overflow-y:auto;max-height:240px;list-style:none;
}
.mc-agendaRow{
  display:flex;align-items:stretch;width:100%;overflow:hidden;
  border:1px solid var(--mc-line);border-radius:9px;background:var(--mc-panel2);
  transition:border-color .15s;
}
.mc-agendaRow:hover{border-color:var(--mc-leaf)}
.mc-agendaMain{
  display:flex;flex:1;align-items:center;gap:10px;min-width:0;padding:9px 10px;text-align:left;
}
.mc-agendaBar{width:4px;align-self:stretch;flex:none;border-radius:999px;background:var(--mc-leaf)}
.mc-agendaTime{
  min-width:44px;flex:none;font-size:12.5px;font-weight:700;color:var(--mc-muted);
  font-variant-numeric:tabular-nums;
}
.mc-agendaText{flex:1;min-width:0;font-size:13.5px;line-height:1.45;word-break:break-word}
.mc-agendaText.isDone{opacity:.6;text-decoration:line-through}
.mc-agendaCheck{
  width:36px;flex:none;display:grid;place-items:center;border-left:1px dashed var(--mc-line);
  color:var(--mc-muted);transition:background .15s,color .15s;
}
.mc-agendaCheck:hover{background:var(--mc-panel);color:var(--mc-moss)}
.mc-agendaCheck.isOn{background:rgba(143,174,114,.22);color:var(--mc-moss)}
.mc-agendaEmpty{padding:2px;font-size:13px;line-height:1.6;color:var(--mc-muted)}

.mc-foot{display:flex;flex:none;align-items:center;gap:12px;margin-top:auto;padding:6px 2px 0;color:var(--mc-muted)}
.mc-footLine{height:1px;flex:1;background:linear-gradient(90deg,transparent,var(--mc-line),transparent)}
.mc-footLeaf{display:grid;place-items:center;color:var(--mc-moss);opacity:.55}

@media (max-width:980px){
  .mc-root{height:auto;min-height:100%;padding:18px 16px 22px}
  .mc-columns{display:flex;flex-direction:column;gap:16px;flex:none}
  .mc-right{width:100%}
  .mc-nowTime{font-size:32px}
  .mc-clock{width:92px;height:92px}
}
@media (hover:none){
  .mc-noteActions{opacity:1}
  .mc-check svg{opacity:.55}
}
@media (prefers-reduced-motion:reduce){
  .mc-leaf{display:none}
  .mc-todayRing path{animation:none;stroke-dashoffset:0}
  .mc-note,.mc-cell,.mc-primary,.mc-ghost,.mc-agendaRow{transition:none}
  .mc-note:hover{transform:none}
}

`;

    // ── date helpers ────────────────────────────────────────────────────
    function pad2(n) {
      return n < 10 ? '0' + n : String(n);
    }
    function ymdOf(date) {
      return date.getFullYear() + '-' + pad2(date.getMonth() + 1) + '-' + pad2(date.getDate());
    }
    function parseYmd(value) {
      var parts = String(value).split('-');
      return new Date(Number(parts[0]), Number(parts[1]) - 1, Number(parts[2]));
    }
    function todayStr() {
      return ymdOf(new Date());
    }
    function addDays(value, days) {
      var date = parseYmd(value);
      date.setDate(date.getDate() + days);
      return ymdOf(date);
    }
    function isValidYmd(value) {
      return typeof value === 'string' && /^\d{4}-\d{2}-\d{2}$/.test(value);
    }
    function isValidTime(value) {
      return typeof value === 'string' && (/^\d{2}:\d{2}$/.test(value) || value === '');
    }
    function buildMonthCells(year, month) {
      var first = new Date(year, month, 1);
      var start = new Date(year, month, 1 - first.getDay());
      var cells = [];
      for (var i = 0; i < 42; i += 1) {
        var date = new Date(start.getFullYear(), start.getMonth(), start.getDate() + i);
        cells.push({
          key: ymdOf(date),
          day: date.getDate(),
          weekday: date.getDay(),
          inMonth: date.getMonth() === month
        });
      }
      return cells;
    }
    function shortDateTime(ms) {
      var date = new Date(ms);
      return pad2(date.getMonth() + 1) + '-' + pad2(date.getDate()) + ' ' + pad2(date.getHours()) + ':' + pad2(date.getMinutes());
    }
    function compareNotes(a, b) {
      if (a.date !== b.date) return a.date < b.date ? -1 : 1;
      var at = a.time || '';
      var bt = b.time || '';
      if (at !== bt) {
        if (!at) return -1;
        if (!bt) return 1;
        return at < bt ? -1 : 1;
      }
      return (a.createdAt || 0) - (b.createdAt || 0);
    }

    // ── sticky-note palette (artwork colors: light paper, dark ink) ─────
    var PALETTE = {
      pink: { bg: '#e7cbb8', ink: '#3f2f24', dot: '#c08a68' },
      mint: { bg: '#cfdcc2', ink: '#2e3c29', dot: '#7f9f66' },
      lemon: { bg: '#e8dcb2', ink: '#41381f', dot: '#c2a24a' },
      sky: { bg: '#cfdedf', ink: '#26393b', dot: '#74a3a6' },
      lilac: { bg: '#dcd6c9', ink: '#3a342c', dot: '#a89a84' }
    };
    var COLOR_KEYS = ['pink', 'mint', 'lemon', 'sky', 'lilac'];
    var TILTS = ['-0.9deg', '0.7deg', '-0.5deg', '0.8deg', '-0.7deg', '0.4deg'];

    // ── persistence ─────────────────────────────────────────────────────
    function uid() {
      return 'n' + Date.now().toString(36) + Math.random().toString(36).slice(2, 7);
    }
    function normalizeNotes(input) {
      if (!Array.isArray(input)) return [];
      var out = [];
      var seen = {};
      input.forEach(function (raw) {
        if (!raw || typeof raw !== 'object') return;
        var id = typeof raw.id === 'string' && raw.id ? raw.id : uid();
        if (seen[id]) return;
        seen[id] = true;
        out.push({
          id: id,
          date: isValidYmd(raw.date) ? raw.date : todayStr(),
          time: isValidTime(raw.time) ? raw.time : '',
          text: typeof raw.text === 'string' ? raw.text.slice(0, 2000) : '',
          color: PALETTE[raw.color] ? raw.color : 'pink',
          done: raw.done === true,
          completedAt: typeof raw.completedAt === 'number' && raw.completedAt > 0 ? raw.completedAt : 0,
          createdAt: typeof raw.createdAt === 'number' ? raw.createdAt : Date.now()
        });
      });
      return out;
    }
    function readStore() {
      try {
        var raw = window.localStorage.getItem(STORAGE_KEY);
        if (!raw) return null;
        var parsed = JSON.parse(raw);
        if (!parsed || !Array.isArray(parsed.notes)) return null;
        return {
          notes: normalizeNotes(parsed.notes),
          /* A pre-sync document has no stamp: a non-empty one still outranks an empty Host. */
          updatedAt: typeof parsed.updatedAt === 'number'
            ? parsed.updatedAt
            : (Array.isArray(parsed.notes) && parsed.notes.length > 0 ? 1 : 0)
        };
      } catch (error) {
        return null;
      }
    }
    function writeStore(notes, updatedAt) {
      try {
        window.localStorage.setItem(STORAGE_KEY, JSON.stringify({
          v: 1,
          updatedAt: updatedAt,
          notes: notes
        }));
      } catch (error) {
        /* storage full or disabled: keep the board usable for this page */
      }
    }
    function seedNotes(t) {
      var today = todayStr();
      return [
        {
          id: uid(), date: today, time: '09:30', text: t('seedToday'),
          color: 'pink', done: false, createdAt: Date.now()
        },
        {
          id: uid(), date: addDays(today, 2), time: '', text: t('seedSoon'),
          color: 'mint', done: false, createdAt: Date.now() + 1
        }
      ];
    }

    // ── components ──────────────────────────────────────────────────────
    function LeafMark(props) {
      var size = props && typeof props.size === 'number' ? props.size : 16;
      return h('svg', {
        width: size, height: size, viewBox: '0 0 24 24', fill: 'none',
        'aria-hidden': true, focusable: 'false', style: { display: 'block' }
      },
        h('path', {
          d: 'M19.5 4.5C11 4.5 4.5 9.5 4.5 17c0 1.4.3 2.5.8 3.5 1-.4 2-.6 3-.6 7.5 0 11.2-6.5 11.2-15.4Z',
          fill: 'currentColor'
        }),
        h('path', {
          d: 'M6.5 19.5C9.5 14.5 13 10.5 18 7',
          stroke: 'rgba(255,255,255,.5)', strokeWidth: 1.1, strokeLinecap: 'round'
        })
      );
    }

    function Sprig() {
      return h('svg', {
        className: 'mc-sprig', viewBox: '0 0 64 64', 'aria-hidden': true, focusable: 'false'
      },
        h('defs', null,
          h('linearGradient', { id: 'mcSprigBg', x1: '0', y1: '0', x2: '1', y2: '1' },
            h('stop', { offset: '0%', stopColor: '#f2f0e2' }),
            h('stop', { offset: '100%', stopColor: '#dde7cd' })
          )
        ),
        h('circle', { cx: 32, cy: 32, r: 29, fill: 'url(#mcSprigBg)', stroke: '#ffffff', strokeWidth: 2.2, strokeOpacity: 0.85 }),
        h('path', { d: 'M31 49 C31 40 32 32 33 23', fill: 'none', stroke: '#6d8a52', strokeWidth: 2.2, strokeLinecap: 'round' }),
        h('path', { d: 'M33 24 C25 24 19 19 19 12 C27 12 33 17 33 24 Z', fill: '#8fae72' }),
        h('path', { d: 'M33 32 C41 32 47 27 47 20 C39 20 33 25 33 32 Z', fill: '#a9c189' }),
        h('path', { d: 'M32 40 C24 40 18 35 18 28 C26 28 32 33 32 40 Z', fill: '#7c9a60' }),
        h('path', { d: 'M31 49 C37 49 42 45 42 39 C35 39 31 43 31 49 Z', fill: '#b7c98f' })
      );
    }

    function CheckIcon(props) {
      var size = props && typeof props.size === 'number' ? props.size : 14;
      return h('svg', {
        width: size, height: size, viewBox: '0 0 24 24', 'aria-hidden': true, focusable: 'false'
      }, h('path', {
        d: 'M5 12.5l4.4 4.4L19 7.4', fill: 'none', stroke: 'currentColor',
        strokeWidth: 2.6, strokeLinecap: 'round', strokeLinejoin: 'round'
      }));
    }

    function BranchArt() {
      return h('svg', {
        className: 'mc-nowArt', viewBox: '0 0 128 96', 'aria-hidden': true, focusable: 'false'
      },
        h('path', { d: 'M10 88 C40 74 66 52 84 18', fill: 'none', stroke: 'currentColor', strokeWidth: 2.2, strokeLinecap: 'round' }),
        h('path', { d: 'M52 64 C40 62 30 54 28 42 C40 44 50 52 52 64 Z', fill: 'currentColor' }),
        h('path', { d: 'M72 44 C62 40 56 31 56 20 C66 24 72 33 72 44 Z', fill: 'currentColor', opacity: 0.85 }),
        h('path', { d: 'M40 78 C30 76 22 69 20 59 C30 60 38 68 40 78 Z', fill: 'currentColor', opacity: 0.75 }),
        h('path', { d: 'M86 26 C86 16 92 8 102 5 C103 15 97 24 86 26 Z', fill: 'currentColor', opacity: 0.9 }),
        h('path', { d: 'M62 54 C70 54 78 49 82 41 C72 40 64 45 62 54 Z', fill: 'currentColor', opacity: 0.7 })
      );
    }

    /** Analog clock: 12 ticks, hour/minute/second hands tied to the live time. */
    function ClockFace(props) {
      var now = props.now;
      var seconds = now.getSeconds();
      var minutes = now.getMinutes() + seconds / 60;
      var hours = (now.getHours() % 12) + minutes / 60;
      var ticks = [];
      for (var i = 0; i < 12; i += 1) {
        var angle = (i * 30) * Math.PI / 180;
        var major = i % 3 === 0;
        var inner = major ? 34 : 37;
        ticks.push(h('line', {
          key: i,
          className: 'mc-clock-tick' + (major ? ' major' : ''),
          x1: 50 + Math.sin(angle) * inner,
          y1: 50 - Math.cos(angle) * inner,
          x2: 50 + Math.sin(angle) * 41,
          y2: 50 - Math.cos(angle) * 41
        }));
      }
      return h('svg', {
        className: 'mc-clock', viewBox: '0 0 100 100', role: 'img', 'aria-label': props.label
      },
        h('circle', { className: 'mc-clock-face', cx: 50, cy: 50, r: 46 }),
        ticks,
        h('line', {
          className: 'mc-clock-hour',
          x1: 50, y1: 56, x2: 50, y2: 27,
          transform: 'rotate(' + (hours * 30) + ' 50 50)'
        }),
        h('line', {
          className: 'mc-clock-minute',
          x1: 50, y1: 58, x2: 50, y2: 18,
          transform: 'rotate(' + (minutes * 6) + ' 50 50)'
        }),
        h('line', {
          className: 'mc-clock-second',
          x1: 50, y1: 62, x2: 50, y2: 14,
          transform: 'rotate(' + (seconds * 6) + ' 50 50)'
        }),
        h('circle', { className: 'mc-clock-center', cx: 50, cy: 50, r: 3.2 }),
        h('circle', { className: 'mc-clock-dot', cx: 50, cy: 50, r: 1.3 })
      );
    }

    function NowCard(props) {
      var t = props.t;
      var stats = props.stats;
      var tick = React.useState(function () { return new Date(); });
      var now = tick[0];
      var setNow = tick[1];

      React.useEffect(function () {
        var timer = window.setInterval(function () { setNow(new Date()); }, 1000);
        return function () { window.clearInterval(timer); };
      }, []);

      return h('section', { className: 'mc-now', 'aria-label': t('nowLabel') },
        h(BranchArt),
        h('div', { className: 'mc-nowMain' },
          h('div', { className: 'mc-nowInfo' },
            h('div', { className: 'mc-nowHead' },
              h('span', { className: 'mc-nowLabel' }, t('nowLabel')),
              h('span', { className: 'mc-nowDate' }, props.dateLabel(ymdOf(now)))
            ),
            h('div', { className: 'mc-nowTime' },
              h('span', null, pad2(now.getHours()) + ':' + pad2(now.getMinutes())),
              h('span', { className: 'mc-nowSec' }, ':' + pad2(now.getSeconds()))
            ),
            h('div', { className: 'mc-nowStats' },
              t('todayStat').replace('{n}', String(stats.today)),
              ' · ',
              t('monthStat').replace('{n}', String(stats.month)),
              ' · ',
              t('doneStat').replace('{n}', String(stats.done))
            )
          ),
          h(ClockFace, { now: now, label: t('nowLabel') })
        )
      );
    }

    function PanelIcon(props) {
      var size = props && typeof props.size === 'number' ? props.size : 20;
      var active = !!(props && props.active);
      return h('svg', {
        width: size, height: size, viewBox: '0 0 24 24', fill: 'none',
        'aria-hidden': true, focusable: 'false', style: { display: 'block' }
      },
        h('path', {
          d: 'M4 6.5A2.5 2.5 0 0 1 6.5 4h11A2.5 2.5 0 0 1 20 6.5v7.2L14.7 20H6.5A2.5 2.5 0 0 1 4 17.5z',
          fill: 'currentColor', fillOpacity: active ? 0.18 : 0, stroke: 'currentColor',
          strokeWidth: 1.5, strokeLinejoin: 'round'
        }),
        h('path', {
          d: 'M20 13.5h-3.3a2.2 2.2 0 0 0-2.2 2.2V20',
          stroke: 'currentColor', strokeWidth: 1.5, strokeLinejoin: 'round'
        }),
        h('path', {
          d: 'M8 9h8M8 12.5h5.5',
          stroke: 'currentColor', strokeWidth: 1.4, strokeLinecap: 'round'
        })
      );
    }

    function NoteEditor(props) {
      var t = props.t;
      var draft = props.draft;
      var onChange = props.onChange;
      var palette = PALETTE[draft.color] || PALETTE.pink;
      var ref = React.useRef(null);

      React.useEffect(function () {
        var node = ref.current;
        if (!node) return;
        node.focus();
        var end = node.value.length;
        try {
          node.setSelectionRange(end, end);
        } catch (error) {
          /* some browsers refuse selection on textarea resize */
        }
      }, []);

      return h('div', {
        className: 'mc-editor',
        style: { background: palette.bg, color: palette.ink }
      },
        h('textarea', {
          ref: ref,
          className: 'mc-editorText',
          value: draft.text,
          placeholder: t('placeholder'),
          rows: 3,
          'aria-label': t('placeholder'),
          onChange: function (event) { onChange({ text: event.target.value }); },
          onKeyDown: function (event) {
            if ((event.ctrlKey || event.metaKey) && event.key === 'Enter') {
              event.preventDefault();
              props.onSave();
            } else if (event.key === 'Escape') {
              event.preventDefault();
              props.onCancel();
            }
          }
        }),
        h('div', { className: 'mc-editorRow' },
          h('label', { className: 'mc-field' },
            h('span', null, t('date')),
            h('input', {
              type: 'date',
              value: draft.date,
              onChange: function (event) {
                if (isValidYmd(event.target.value)) onChange({ date: event.target.value });
              }
            })
          ),
          h('label', { className: 'mc-field' },
            h('span', null, t('time')),
            h('input', {
              type: 'time',
              value: draft.time,
              onChange: function (event) { onChange({ time: event.target.value }); }
            })
          )
        ),
        h('div', { className: 'mc-editorRow mc-colors' },
          h('span', { className: 'mc-fieldLabel' }, t('color')),
          h('div', { className: 'mc-swatches' },
            COLOR_KEYS.map(function (key) {
              var swatch = PALETTE[key];
              var on = draft.color === key;
              return h('button', {
                key: key,
                type: 'button',
                className: 'mc-swatch' + (on ? ' isOn' : ''),
                style: { background: swatch.bg, color: swatch.ink },
                'aria-label': t('color' + key.charAt(0).toUpperCase() + key.slice(1)),
                'aria-pressed': on,
                onClick: function () { onChange({ color: key }); }
              }, on ? '✓' : '');
            })
          )
        ),
        h('div', { className: 'mc-editorActions' },
          h('span', { className: 'mc-hintTxt' }, t('saveHint')),
          h('div', { className: 'mc-editorBtns' },
            draft.id
              ? h('button', {
                type: 'button',
                className: 'mc-dangerTxt',
                onClick: function () { props.onDelete(draft.id); }
              }, t('delete'))
              : null,
            h('button', { type: 'button', className: 'mc-ghost', onClick: props.onCancel }, t('cancel')),
            h('button', { type: 'button', className: 'mc-primary', onClick: props.onSave }, t('save'))
          )
        )
      );
    }

    function MemoBoard(props) {
      var t = props.t;
      var locale = props.locale;

      var revision = React.useState(0);
      var bump = revision[1];
      React.useEffect(function () {
        if (!locale || typeof locale.subscribe !== 'function') return undefined;
        return locale.subscribe(function () { bump(function (value) { return value + 1; }); });
      }, [locale]);

      var storedRef = React.useRef(null);
      var notesState = React.useState(function () {
        var stored = readStore();
        storedRef.current = stored;
        return stored === null ? seedNotes(t) : stored.notes;
      });
      var notes = notesState[0];
      var setNotes = notesState[1];
      var notesRef = React.useRef(notes);
      notesRef.current = notes;

      var now = new Date();
      var today = ymdOf(now);

      var cursorState = React.useState(function () { return { y: now.getFullYear(), m: now.getMonth() }; });
      var cursor = cursorState[0];
      var setCursor = cursorState[1];

      var selectedState = React.useState(today);
      var selectedDate = selectedState[0];
      var setSelectedDate = selectedState[1];

      var filterState = React.useState('all');
      var filter = filterState[0];
      var setFilter = filterState[1];

      var wallState = React.useState('open');
      var wall = wallState[0];
      var setWall = wallState[1];

      var editingState = React.useState(null);
      var editing = editingState[0];
      var setEditing = editingState[1];

      var noticeState = React.useState('');
      var notice = noticeState[0];
      var setNotice = noticeState[1];

      var noticeTimer = React.useRef(0);
      var importRef = React.useRef(null);
      var localAtRef = React.useRef(storedRef.current ? storedRef.current.updatedAt : 0);
      var dirtyRef = React.useRef(false);
      var pushTimer = React.useRef(0);
      var mountedRef = React.useRef(true);
      var syncState = React.useState('pending');
      var sync = syncState[0];
      var setSync = syncState[1];

      React.useEffect(function () {
        var alive = true;
        if (typeof fetch !== 'function') {
          setSync('local');
          return undefined;
        }
        var controller = typeof AbortController === 'function' ? new AbortController() : null;
        function pushLocal() {
          pushState(notesRef.current, localAtRef.current);
        }
        fetch(HOST_STATE, { cache: 'no-store', signal: controller ? controller.signal : undefined })
          .then(function (response) { return response.ok ? response.json() : null; })
          .then(function (payload) {
            if (!alive) return;
            if (!payload) {
              setSync('local');
              return;
            }
            setSync('host');
            var remoteAt = typeof payload.updatedAt === 'number' ? payload.updatedAt : 0;
            var remoteNotes = Array.isArray(payload.notes) ? normalizeNotes(payload.notes) : null;
            if (!remoteNotes) {
              /* The Host has no document yet; only an edited board is worth writing. */
              if (localAtRef.current > 0) pushLocal();
              return;
            }
            if (dirtyRef.current) {
              if (localAtRef.current > remoteAt) pushLocal();
              return;
            }
            if (remoteAt > localAtRef.current) {
              localAtRef.current = remoteAt;
              writeStore(remoteNotes, remoteAt);
              setNotes(remoteNotes);
              setEditing(null);
            } else if (localAtRef.current > remoteAt) {
              pushLocal();
            }
          })
          .catch(function () { if (alive) setSync('local'); });
        return function () {
          alive = false;
          if (controller) controller.abort();
        };
      }, []);

      React.useEffect(function () {
        return function () {
          mountedRef.current = false;
          if (noticeTimer.current) window.clearTimeout(noticeTimer.current);
          if (pushTimer.current) window.clearTimeout(pushTimer.current);
        };
      }, []);

      function pushState(list, at) {
        try {
          fetch(HOST_STATE, {
            method: 'PUT',
            headers: { 'content-type': 'application/json' },
            body: JSON.stringify({ v: 1, updatedAt: at, notes: list })
          }).catch(function () {
            if (mountedRef.current) setSync('local');
          });
        } catch (error) {
          if (mountedRef.current) setSync('local');
        }
      }
      /** The single write path: update state, the local cache, and the Host copy. */
      function commitNotes(next) {
        var at = Date.now();
        dirtyRef.current = true;
        localAtRef.current = at;
        setNotes(next);
        writeStore(next, at);
        if (pushTimer.current) window.clearTimeout(pushTimer.current);
        pushTimer.current = window.setTimeout(function () {
          pushTimer.current = 0;
          pushState(next, at);
        }, 500);
      }

      function flash(message) {
        setNotice(message);
        if (noticeTimer.current) window.clearTimeout(noticeTimer.current);
        noticeTimer.current = window.setTimeout(function () { setNotice(''); }, 2800);
      }

      function dateLabel(value) {
        var date = parseYmd(value);
        return t('dateLabel')
          .replace('{m}', String(date.getMonth() + 1))
          .replace('{d}', String(date.getDate()))
          .replace('{w}', t('wd' + date.getDay()));
      }
      function timeLabel(note) {
        return note.time ? note.time : t('allDay');
      }
      function noteText(note) {
        return note.text && note.text.trim() ? note.text : t('untitled');
      }
      function monthLabel() {
        var date = new Date(cursor.y, cursor.m, 1);
        try {
          return date.toLocaleDateString(undefined, { year: 'numeric', month: 'long' });
        } catch (error) {
          return cursor.y + ' / ' + (cursor.m + 1);
        }
      }

      var byDate = React.useMemo(function () {
        var map = {};
        notes.forEach(function (note) {
          if (!map[note.date]) map[note.date] = [];
          map[note.date].push(note);
        });
        Object.keys(map).forEach(function (key) { map[key].sort(compareNotes); });
        return map;
      }, [notes]);

      var ordered = React.useMemo(function () {
        var open = notes.filter(function (note) { return !note.done; });
        return open.sort(function (a, b) {
          var aPast = a.date < today;
          var bPast = b.date < today;
          if (aPast !== bPast) return aPast ? 1 : -1;
          return aPast ? compareNotes(b, a) : compareNotes(a, b);
        });
      }, [notes, today]);

      var openNotes = React.useMemo(function () {
        return notes.filter(function (note) { return !note.done; });
      }, [notes]);
      /* Completed notes are kept as records, newest completion first. */
      var doneNotes = React.useMemo(function () {
        return notes.filter(function (note) { return note.done; }).sort(function (a, b) {
          return (b.completedAt || 0) - (a.completedAt || 0);
        });
      }, [notes]);
      var doneCount = doneNotes.length;
      var monthKey = cursor.y + '-' + pad2(cursor.m + 1);
      var stats = {
        today: notes.filter(function (note) { return note.date === today; }).length,
        month: notes.filter(function (note) { return note.date.slice(0, 7) === monthKey; }).length,
        done: doneCount
      };

      var selectedNotes = byDate[selectedDate] || [];

      function nextColor() {
        return COLOR_KEYS[notes.length % COLOR_KEYS.length];
      }
      function updateNote(id, patch) {
        commitNotes(notes.map(function (note) {
          return note.id === id ? Object.assign({}, note, patch) : note;
        }));
      }
      function removeNote(id) {
        commitNotes(notes.filter(function (note) { return note.id !== id; }));
        if (editing && editing.id === id) setEditing(null);
      }
      /**
       * Completing a note removes it from the sticky-note column; the calendar
       * and the day agenda keep showing it, where it can be restored.
       */
      function toggleDone(note) {
        var nextDone = !note.done;
        updateNote(note.id, nextDone
          ? { done: true, completedAt: Date.now() }
          : { done: false, completedAt: 0 });
        if (nextDone) {
          if (editing && editing.id === note.id) setEditing(null);
          flash(t('doneFlash'));
        }
      }
      function goToDate(value) {
        var date = parseYmd(value);
        setSelectedDate(value);
        setCursor({ y: date.getFullYear(), m: date.getMonth() });
      }
      function goToday() {
        var date = new Date();
        setSelectedDate(ymdOf(date));
        setCursor({ y: date.getFullYear(), m: date.getMonth() });
      }
      function shiftMonth(delta) {
        var next = new Date(cursor.y, cursor.m + delta, 1);
        setCursor({ y: next.getFullYear(), m: next.getMonth() });
      }
      function openNew(date) {
        var target = date || selectedDate || today;
        setEditing({
          id: null,
          date: target,
          time: '',
          text: '',
          color: nextColor(),
          done: false
        });
      }
      function openEdit(note) {
        setEditing({
          id: note.id,
          date: note.date,
          time: note.time || '',
          text: note.text || '',
          color: note.color || 'pink',
          done: !!note.done
        });
      }
      function patchEditing(patch) {
        setEditing(function (prev) { return prev ? Object.assign({}, prev, patch) : prev; });
      }
      function saveEditing() {
        var draft = editing;
        if (!draft) return;
        var text = String(draft.text || '').trim();
        if (!text) {
          if (draft.id) removeNote(draft.id);
          setEditing(null);
          return;
        }
        if (draft.id) {
          updateNote(draft.id, { text: text, time: draft.time || '', color: draft.color, date: draft.date });
        } else {
          var note = {
            id: uid(),
            date: draft.date,
            time: draft.time || '',
            text: text,
            color: draft.color || 'pink',
            done: false,
            completedAt: 0,
            createdAt: Date.now()
          };
          commitNotes(notes.concat(note));
        }
        goToDate(draft.date);
        setEditing(null);
      }
      function exportNotes() {
        try {
          var payload = JSON.stringify({ v: 1, exportedAt: new Date().toISOString(), notes: notes }, null, 2);
          var blob = new Blob([payload], { type: 'application/json' });
          var url = URL.createObjectURL(blob);
          var link = document.createElement('a');
          link.href = url;
          link.download = 'memo-calendar-' + today + '.json';
          link.style.display = 'none';
          document.body.appendChild(link);
          link.click();
          document.body.removeChild(link);
          window.setTimeout(function () { URL.revokeObjectURL(url); }, 1500);
        } catch (error) {
          flash(t('importFailed'));
        }
      }
      function importNotes(event) {
        var file = event.target.files && event.target.files[0];
        event.target.value = '';
        if (!file) return;
        var reader = new FileReader();
        reader.onload = function () {
          try {
            var parsed = JSON.parse(String(reader.result || ''));
            var incoming = normalizeNotes(parsed && parsed.notes ? parsed.notes : parsed);
            if (!incoming.length) {
              flash(t('importFailed'));
              return;
            }
            var seen = {};
            notes.forEach(function (note) { seen[note.id] = true; });
            var merged = notes.slice();
            incoming.forEach(function (note) {
              if (seen[note.id]) return;
              seen[note.id] = true;
              merged.push(note);
            });
            commitNotes(merged);
            flash(t('importDone').replace('{n}', String(incoming.length)));
          } catch (error) {
            flash(t('importFailed'));
          }
        };
        reader.readAsText(file);
      }

      var wallNotes = wall === 'done' ? doneNotes : ordered;
      var visible = filter === 'day'
        ? wallNotes.filter(function (note) { return note.date === selectedDate; })
        : wallNotes;

      var draftNew = editing && !editing.id ? editing : null;
      /* Editing a completed (or filtered-out) note from the agenda: show the editor
         above the wall, because the note itself has no card in this list. */
      var detachedEdit = editing && editing.id && !visible.some(function (note) {
        return note.id === editing.id;
      }) ? editing : null;
      var cells = buildMonthCells(cursor.y, cursor.m);
      var emptyText;
      if (wall === 'done') {
        emptyText = (filter === 'day' && doneCount > 0) ? t('dayEmptyDone') : t('emptyDoneWall');
      } else if (notes.length === 0) {
        emptyText = t('emptyNotes');
      } else if (openNotes.length === 0) {
        emptyText = t('emptyDone');
      } else {
        emptyText = filter === 'day' ? t('dayEmpty') : t('emptyNotes');
      }

      function renderEditor() {
        return h(NoteEditor, {
          t: t,
          draft: editing,
          onChange: patchEditing,
          onSave: saveEditing,
          onCancel: function () { setEditing(null); },
          onDelete: function (id) { removeNote(id); setEditing(null); }
        });
      }

      function renderCard(note) {
        if (editing && editing.id === note.id) {
          return h('div', { key: note.id, style: { display: 'contents' } }, renderEditor());
        }
        var palette = PALETTE[note.color] || PALETTE.pink;
        var index = wallNotes.indexOf(note);
        if (index < 0) index = 0;
        return h('article', {
          key: note.id,
          className: 'mc-note' + (note.done ? ' mc-done' : ''),
          style: {
            background: palette.bg,
            color: palette.ink,
            '--mc-tilt': TILTS[index % TILTS.length]
          }
        },
          h('span', { className: 'mc-tape', 'aria-hidden': true }),
          h('div', { className: 'mc-noteTop' },
            h('button', {
              type: 'button',
              className: 'mc-noteDate',
              title: t('jumpToDate'),
              onClick: function () { goToDate(note.date); }
            }, dateLabel(note.date)),
            h('button', {
              type: 'button',
              className: 'mc-check' + (note.done ? ' isOn' : ''),
              'aria-pressed': !!note.done,
              'aria-label': note.done ? t('restore') : t('toggleDone'),
              title: note.done ? t('restore') : t('toggleDone'),
              onClick: function () { toggleDone(note); }
            }, h(CheckIcon, { size: 15 }))
          ),
          h('p', { className: 'mc-noteText' }, noteText(note)),
          h('div', { className: 'mc-noteFoot' },
            h('span', { className: 'mc-time' }, note.done
              ? (note.completedAt
                ? t('completedAt').replace('{d}', shortDateTime(note.completedAt))
                : t('doneLabel'))
              : timeLabel(note)),
            h('div', { className: 'mc-noteActions' },
              h('button', {
                type: 'button',
                className: 'mc-mini',
                'aria-label': t('edit'),
                title: t('edit'),
                onClick: function () { openEdit(note); }
              }, '✎'),
              h('button', {
                type: 'button',
                className: 'mc-mini',
                'aria-label': t('delete'),
                title: t('delete'),
                onClick: function () { removeNote(note.id); }
              }, '✕')
            )
          )
        );
      }

      function renderCell(cell) {
        var dayNotes = byDate[cell.key] || [];
        var classes = ['mc-cell'];
        if (!cell.inMonth) classes.push('mc-out');
        if (cell.key === today) classes.push('mc-today');
        if (cell.key === selectedDate) classes.push('mc-selected');
        if (cell.weekday === 0) classes.push('mc-sun');
        if (cell.weekday === 6) classes.push('mc-sat');

        return h('button', {
          key: cell.key,
          type: 'button',
          className: classes.join(' '),
          'aria-label': dateLabel(cell.key) + (dayNotes.length ? ' · ' + dayNotes.length : ''),
          'aria-pressed': cell.key === selectedDate,
          onClick: function () { goToDate(cell.key); }
        },
          cell.key === today
            ? h('span', { className: 'mc-todayRing', 'aria-hidden': true },
              h('svg', { viewBox: '0 0 100 90', preserveAspectRatio: 'none', fill: 'none' },
                h('path', {
                  d: 'M92 17C83 7 60 3 37 7C18 10 8 23 9 45C10 67 25 81 50 84C75 87 93 73 94 50C95 29 82 11 58 7C40 4 23 10 15 22',
                  stroke: 'currentColor',
                  strokeWidth: 2.2,
                  strokeLinecap: 'round',
                  strokeLinejoin: 'round',
                  vectorEffect: 'non-scaling-stroke'
                }),
                h('path', {
                  d: 'M90 21C81 11 60 7 39 11C21 14 12 26 13 46C14 66 27 77 50 80C73 83 90 70 91 51C92 32 79 15 58 12C42 9 28 15 20 24',
                  stroke: 'currentColor',
                  strokeWidth: 1.3,
                  strokeLinecap: 'round',
                  strokeLinejoin: 'round',
                  opacity: 0.45,
                  vectorEffect: 'non-scaling-stroke'
                })
              )
            )
            : null,
          h('span', { className: 'mc-cellNum' }, cell.day),
          dayNotes.length
            ? h('span', { className: 'mc-squares' },
              dayNotes.slice(0, dayNotes.length > 4 ? 3 : 4).map(function (note, index) {
                var palette = PALETTE[note.color] || PALETTE.pink;
                var tip = (note.time ? note.time + ' ' : '') + noteText(note) + (note.done ? ' ✓' : '');
                return h('span', {
                  key: note.id,
                  className: 'mc-sq p' + index,
                  style: { background: palette.dot, opacity: note.done ? 0.45 : 1 },
                  title: tip
                });
              }),
              dayNotes.length > 4
                ? h('span', {
                  className: 'mc-sqMore',
                  title: t('moreNotes').replace('{n}', String(dayNotes.length - 3))
                }, '+' + (dayNotes.length - 3))
                : null
            )
            : null
        );
      }

      return h('div', { className: 'mc-root' },
        h('header', { className: 'mc-top' },
          h('div', { className: 'mc-brand' },
            h('div', { className: 'mc-brandMark', 'aria-hidden': true }, h(LeafMark, { size: 24 })),
            h('div', { className: 'mc-brandText' },
              h('h1', null, t('title')),
              h('p', null, t('subtitle'))
            )
          ),
          h('div', { className: 'mc-topActions' },
            h('button', { type: 'button', className: 'mc-ghost', onClick: goToday }, t('today')),
            h('button', { type: 'button', className: 'mc-primary', onClick: function () { openNew(selectedDate); } }, '+ ' + t('newNote'))
          )
        ),
        h('div', { className: 'mc-columns' },
          h('div', { className: 'mc-left' },
            h('section', { className: 'mc-notes', 'aria-label': t('notesTitle') },
              h('div', { className: 'mc-notesHead' },
                h('div', { className: 'mc-notesTitle' },
                  h('span', { className: 'mc-notesIcon', 'aria-hidden': true }, h(LeafMark, { size: 16 })),
                  h('span', null, t('notesTitle')),
                  h('span', { className: 'mc-count' }, String(wall === 'done' ? doneCount : openNotes.length))
                ),
                h('div', { className: 'mc-notesTools' },
                  h('div', { className: 'mc-tabs', role: 'tablist', 'aria-label': t('notesTitle') },
                    h('button', {
                      type: 'button',
                      role: 'tab',
                      className: 'mc-tab' + (wall === 'open' ? ' isOn' : ''),
                      'aria-selected': wall === 'open',
                      onClick: function () { setWall('open'); setEditing(null); }
                    }, t('tabOpen').replace('{n}', String(openNotes.length))),
                    h('button', {
                      type: 'button',
                      role: 'tab',
                      className: 'mc-tab' + (wall === 'done' ? ' isOn' : ''),
                      'aria-selected': wall === 'done',
                      onClick: function () { setWall('done'); setEditing(null); }
                    }, t('tabDone').replace('{n}', String(doneCount)))
                  ),
                  h('div', { className: 'mc-filters', role: 'group', 'aria-label': t('notesTitle') },
                    h('button', {
                      type: 'button',
                      className: 'mc-filter' + (filter === 'all' ? ' isOn' : ''),
                      'aria-pressed': filter === 'all',
                      onClick: function () { setFilter('all'); }
                    }, t('filterAll')),
                    h('button', {
                      type: 'button',
                      className: 'mc-filter' + (filter === 'day' ? ' isOn' : ''),
                      'aria-pressed': filter === 'day',
                      onClick: function () { setFilter('day'); }
                    }, t('filterDay'))
                  )
                )
              ),
              wall === 'open' && doneCount > 0
                ? h('p', { className: 'mc-hintLine' }, t('doneHint').replace('{n}', String(doneCount)))
                : null,
              draftNew || detachedEdit
                ? h('div', { className: 'mc-editorWrap' }, renderEditor())
                : null,
              visible.length === 0 && !draftNew && !detachedEdit
                ? h('div', { className: 'mc-empty' },
                  h('div', { className: 'mc-emptyArt', 'aria-hidden': true }, h(LeafMark, { size: 34 })),
                  h('p', null, emptyText),
                  wall === 'open'
                    ? h('button', { type: 'button', className: 'mc-primary', onClick: function () { openNew(selectedDate); } }, t('newNote'))
                    : h('button', { type: 'button', className: 'mc-ghost', onClick: function () { setWall('open'); } }, t('backToOpen'))
                )
                : null,
              visible.length
                ? h('div', { className: 'mc-noteGrid' }, visible.map(renderCard))
                : null,
              h('div', { className: 'mc-notesFoot' },
                h('div', { className: 'mc-editorBtns' },
                  h('button', { type: 'button', className: 'mc-linkBtn', onClick: exportNotes }, t('exportJson')),
                  h('span', { style: { opacity: 0.4 } }, '·'),
                  h('button', { type: 'button', className: 'mc-linkBtn', onClick: function () { if (importRef.current) importRef.current.click(); } }, t('importJson')),
                  h('input', {
                    ref: importRef,
                    type: 'file',
                    accept: 'application/json,.json',
                    style: { display: 'none' },
                    onChange: importNotes,
                    tabIndex: -1,
                    'aria-hidden': true
                  })
                ),
                notice
                  ? h('span', { className: 'mc-notice', role: 'status' }, notice)
                  : h('span', { className: 'mc-linkBtn', style: { cursor: 'default' } }, t(sync === 'host' ? 'storageHost' : 'storageHint'))
              )
            )
          ),
          h('div', { className: 'mc-right' },
            h(NowCard, { t: t, dateLabel: dateLabel, stats: stats }),
            h('section', { className: 'mc-cal', 'aria-label': t('calendarGrid') },
              h('div', { className: 'mc-sky' },
                h('span', { className: 'mc-leaf', 'aria-hidden': true }),
                h('span', { className: 'mc-leaf', 'aria-hidden': true }),
                h('span', { className: 'mc-leaf', 'aria-hidden': true }),
                h('span', { className: 'mc-leaf', 'aria-hidden': true }),
                h('span', { className: 'mc-leaf', 'aria-hidden': true }),
                h(Sprig),
                h('div', { className: 'mc-calHead' },
                  h('div', null,
                    h('div', { className: 'mc-calTitle' },
                      h('span', { className: 'mc-titleLeaf', 'aria-hidden': true }, h(LeafMark, { size: 18 })),
                      monthLabel()
                    ),
                    h('div', { className: 'mc-calSub' }, t('calendarSub'))
                  ),
                  h('div', { className: 'mc-calNav' },
                    h('button', {
                      type: 'button',
                      className: 'mc-navBtn',
                      'aria-label': t('prevMonth'),
                      title: t('prevMonth'),
                      onClick: function () { shiftMonth(-1); }
                    }, '‹'),
                    h('button', { type: 'button', className: 'mc-todayBtn', onClick: goToday }, t('today')),
                    h('button', {
                      type: 'button',
                      className: 'mc-navBtn',
                      'aria-label': t('nextMonth'),
                      title: t('nextMonth'),
                      onClick: function () { shiftMonth(1); }
                    }, '›')
                  )
                )
              ),
              h('div', { className: 'mc-calBody' },
                h('div', { className: 'mc-wdRow' },
                  [0, 1, 2, 3, 4, 5, 6].map(function (index) {
                    var classes = ['mc-wd'];
                    if (index === 0) classes.push('isSun');
                    if (index === 6) classes.push('isSat');
                    return h('div', { key: index, className: classes.join(' ') }, t('wd' + index));
                  })
                ),
                h('div', { className: 'mc-grid' }, cells.map(renderCell))
              )
            ),
            h('section', { className: 'mc-agenda', 'aria-label': t('agendaTitle') },
              h('div', { className: 'mc-agendaHead' },
                h('div', { className: 'mc-agendaTitle' },
                  h('span', { className: 'mc-dotMark', 'aria-hidden': true }),
                  h('span', null, dateLabel(selectedDate)),
                  selectedNotes.length
                    ? h('span', { className: 'mc-count' }, t('noteCount').replace('{n}', String(selectedNotes.length)))
                    : null
                ),
                h('button', {
                  type: 'button',
                  className: 'mc-addBtn',
                  onClick: function () { openNew(selectedDate); }
                }, '+ ' + t('addForDay'))
              ),
              selectedNotes.length
                ? h('ul', { className: 'mc-agendaList' },
                  selectedNotes.map(function (note) {
                    var palette = PALETTE[note.color] || PALETTE.pink;
                    return h('li', { key: note.id },
                      h('div', { className: 'mc-agendaRow' },
                        h('button', {
                          type: 'button',
                          className: 'mc-agendaMain',
                          title: t('edit'),
                          onClick: function () { openEdit(note); }
                        },
                          h('span', { className: 'mc-agendaBar', style: { background: palette.dot }, 'aria-hidden': true }),
                          h('span', { className: 'mc-agendaTime' }, timeLabel(note)),
                          h('span', { className: 'mc-agendaText' + (note.done ? ' isDone' : '') }, noteText(note))
                        ),
                        h('button', {
                          type: 'button',
                          className: 'mc-agendaCheck' + (note.done ? ' isOn' : ''),
                          'aria-pressed': !!note.done,
                          'aria-label': note.done ? t('restore') : t('toggleDone'),
                          title: note.done ? t('restore') : t('toggleDone'),
                          onClick: function () { toggleDone(note); }
                        }, h(CheckIcon, { size: 15 }))
                      )
                    );
                  })
                )
                : h('p', { className: 'mc-agendaEmpty' }, t('dayEmpty'))
            )
          )
        ),
        h('footer', { className: 'mc-foot', 'aria-hidden': true },
          h('span', { className: 'mc-footLine' }),
          h('span', { className: 'mc-footLeaf' }, h(LeafMark, { size: 14 })),
          h('span', { className: 'mc-footLine' })
        )
      );
    }

    /**
     * Keeps a render failure inside the panel instead of blanking the slot, and
     * surfaces the message so the user can report it.
     */
    class BoardBoundary extends React.Component {
      constructor(props) {
        super(props);
        this.state = { error: null };
      }
      static getDerivedStateFromError(error) {
        return { error: error || new Error('unknown error') };
      }
      componentDidCatch(error) {
        if (typeof window !== 'undefined' && window.console && window.console.error) {
          window.console.error('[memo-calendar] board render failed', error);
        }
      }
      render() {
        if (!this.state.error) return this.props.children;
        var message = this.state.error && this.state.error.message
          ? String(this.state.error.message)
          : String(this.state.error);
        return h('div', { className: 'mc-root' },
          h('div', { className: 'mc-empty', style: { margin: '32px auto', maxWidth: 560 } },
            h('div', { className: 'mc-emptyArt', 'aria-hidden': true }, '⚠'),
            h('p', null, this.props.t('crash')),
            h('p', { style: { fontSize: 11, opacity: 0.7, wordBreak: 'break-word' } }, message)
          )
        );
      }
    }

    function insertStyles() {
      if (typeof document === 'undefined') return function () {};
      var selector = 'style[data-mc-css="memo-calendar"]';
      if (document.querySelector(selector)) return function () {};
      var tag = document.createElement('style');
      tag.setAttribute('data-mc-css', 'memo-calendar');
      tag.textContent = CSS;
      document.head.appendChild(tag);
      return function () {
        if (tag.parentNode) tag.parentNode.removeChild(tag);
      };
    }

    function apply(ctx) {
      var t = ctx.locale.bind(NS);
      ctx.effect(function () { return ctx.locale.register(NS, { zh: zh, en: en }); }, 'memo-calendar: dictionaries');
      ctx.effect(insertStyles, 'memo-calendar: styles');

      ctx.slots.inject('sidebar.panellist', function () {
        return ctx.slots.register({
          name: 'sidebar.panellist',
          id: 'memo-calendar',
          order: 36,
          label: function () { return t('nav'); }
        }, PanelIcon);
      });

      ctx.slots.inject('main', function () {
        return ctx.slots.register({
          name: 'main',
          key: 'memo-calendar'
        }, function (panelProps) {
          return h(BoardBoundary, { t: t },
            h(MemoBoard, {
              t: t,
              locale: ctx.locale,
              usePanelInfo: panelProps && panelProps.usePanelInfo
            })
          );
        });
      });
    }

    exports.apply = apply;
    exports.inject = ['slots', 'locale'];
    return module.exports;
  }
});
