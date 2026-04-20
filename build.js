const fs = require('fs');
const { marked } = require('marked');
const hljs = require('highlight.js');

// Configure marked with syntax highlighting
marked.setOptions({
  highlight: function(code, lang) {
    if (lang && hljs.getLanguage(lang)) {
      return hljs.highlight(code, { language: lang }).value;
    }
    return hljs.highlightAuto(code).value;
  },
  gfm: true,
  breaks: false
});

// Read the lab file
const markdown = fs.readFileSync('./Hands on Lab', 'utf-8');

// Read practice exam questions
const examQuestions = JSON.parse(fs.readFileSync('./practice-exam-data.json', 'utf-8'));

// ── Pre-process: Smart conversion of comment-style headers ──
// The source uses # for both real headings AND metadata comments.
// We need to convert metadata lines to styled HTML, not headings.

let processed = markdown
  // Remove decorative ════ lines
  .replace(/^# ═+$/gm, '')
  // Convert □ checkbox items
  .replace(/^□ /gm, '- [ ] ')
  // Convert metadata comment lines to HTML badges (these are NOT headings)
  // Domain + exam weight line → badge
  .replace(/^# (Domain \d+ — \d+% of exam)$/gm, '<div class="lab-meta"><span class="badge badge-domain">$1</span></div>')
  // Task Statements line → badge
  .replace(/^# (Task Statements? .+)$/gm, '<div class="lab-meta"><span class="badge badge-tasks">$1</span></div>')
  // Per-lab metadata comment lines (domain / concept / time / difficulty) are
  // intentionally stripped — they duplicate the H1 title and the first body
  // section, and the pills were visual noise at the top of every lab.
  .replace(/^# Domain \d+ — Task Statement .+\r?\n/gm, '')
  .replace(/^# Concept: .+\r?\n/gm, '')
  .replace(/^# Time: .+\r?\n/gm, '')
  // "Covers all 30..." subtitle
  .replace(/^# (Covers all .+)$/gm, '<p class="subtitle">$1</p>')
  // "Model: claude-sonnet..." subtitle
  .replace(/^# (Model: .+)$/gm, '<p class="subtitle model-tag">$1</p>')
  // "HANDS-ON LAB GUIDE" or "STUDY GUIDE" → subtitle (not a separate H1)
  .replace(/^# (HANDS-ON LAB GUIDE.+|STUDY GUIDE.*)$/gm, '<p class="hero-subtitle">$1</p>')
  // "Powered by Claude Code" → subtitle (not a separate H1)
  .replace(/^# (Powered by .+)$/gm, '<p class="subtitle">$1</p>')
  // Domain 5 — Task Statement 5.x → combined patterns
  .replace(/^# (Domains? reinforced:.+)$/gm, '<div class="lab-meta"><span class="badge badge-domain">$1</span></div>')
  // Final scenario metadata
  .replace(/^# (Combines:.+)$/gm, '<div class="lab-meta"><span class="badge badge-concept">$1</span></div>');

// Convert to HTML
const content = marked.parse(processed);

// ── Post-process: Add copy buttons, fix IDs ──
let finalContent = content
  // Merge consecutive lab-meta divs into single container
  .replace(/(<\/div>\n?<div class="lab-meta">)/g, ' ')
  // Inject stable H1 ids at build time so cross-lab anchor links resolve in
  // the static HTML (the sidebar JS also sets ids client-side but by then
  // links have already been clicked). Uses the same slug rule as the client JS.
  .replace(/<h1>([\s\S]+?)<\/h1>/g, (m, inner) => {
    const plain = inner.replace(/<[^>]+>/g, '').trim();
    if (!plain) return m;
    const slug = plain.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '').substring(0, 60);
    return `<h1 id="${slug}">${inner}</h1>`;
  });

// ── Inject interactive practice exam section ──
const examJSON = JSON.stringify(examQuestions);
finalContent += `
<h1 id="practice-exam--full-assessment">PRACTICE EXAM</h1>
<div id="exam-app">
<style>
#exam-app { font-family: var(--font-sans); }
#exam-app .exam-screen { display: none; }
#exam-app .exam-screen.exam-active { display: block; }
#exam-app .exam-title { text-align: center; margin-top: 2rem; font-family: var(--font-serif); font-size: 1.75rem; font-weight: 600; letter-spacing: -0.025em; }
#exam-app .exam-desc { text-align: center; color: var(--text-muted); margin: 0.75rem auto 1.5rem; max-width: 560px; font-size: 0.95rem; }
#exam-app .exam-mode-toggle { display: flex; justify-content: center; gap: 0; margin: 1.25rem 0; }
#exam-app .exam-mode-toggle button { border-radius: 0; border: 1px solid var(--border-medium); padding: 0.5rem 1.25rem; font-size: 0.85rem; font-family: var(--font-sans); background: var(--surface); color: var(--text-muted); cursor: pointer; transition: all 0.15s; }
#exam-app .exam-mode-toggle button:first-child { border-radius: 6px 0 0 6px; }
#exam-app .exam-mode-toggle button:last-child { border-radius: 0 6px 6px 0; }
#exam-app .exam-mode-toggle button.esel { background: var(--text); color: var(--bg); border-color: var(--text); }
#exam-app .exam-metrics { display: flex; justify-content: center; gap: 1rem; margin: 1.5rem 0; flex-wrap: wrap; }
#exam-app .em-card { background: var(--surface); border: 1px solid var(--border); border-radius: 8px; padding: 1rem 1.5rem; text-align: center; min-width: 120px; }
#exam-app .em-card .em-val { font-size: 1.5rem; font-weight: 700; color: var(--brand); }
#exam-app .em-card .em-lbl { font-size: 0.68rem; color: var(--text-muted); text-transform: uppercase; letter-spacing: 0.06em; margin-top: 0.15rem; }
#exam-app .exam-start { display: block; margin: 2rem auto; padding: 0.65rem 2.5rem; font-size: 1rem; font-weight: 600; background: var(--text); color: var(--bg); border: 1px solid var(--text); border-radius: 6px; cursor: pointer; font-family: var(--font-sans); transition: background 0.15s; }
#exam-app .exam-start:hover { background: var(--accent-dim); border-color: var(--accent-dim); }
#exam-app .exam-timer { text-align: right; font-size: 0.95rem; font-weight: 600; color: var(--text-muted); margin-bottom: 0.5rem; }
#exam-app .exam-timer.ewarn { color: var(--red); }
#exam-app .exam-prog-wrap { background: var(--border); border-radius: 100vw; height: 4px; margin-bottom: 1rem; }
#exam-app .exam-prog-fill { background: var(--text); height: 4px; border-radius: 100vw; transition: width 0.3s; }
#exam-app .eq-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 0.75rem; }
#exam-app .eq-num { font-size: 0.85rem; color: var(--text-muted); }
#exam-app .eq-badge { display: inline-block; padding: 0.15rem 0.6rem; border-radius: 4px; font-size: 0.72rem; font-weight: 600; background: #eef4f9; color: var(--blue); }
#exam-app .eq-text { font-family: var(--font-serif); font-size: 1.05rem; line-height: 1.7; margin-bottom: 1.25rem; }
#exam-app .eq-choices { list-style: none; padding: 0; display: flex; flex-direction: column; gap: 0.6rem; margin-bottom: 1.5rem; }
#exam-app .eq-choice { border: 2px solid var(--border); border-radius: 8px; padding: 0.75rem 1rem; cursor: pointer; transition: border-color 0.15s, background 0.15s; font-size: 0.95rem; }
#exam-app .eq-choice:hover { border-color: var(--text-light); background: var(--surface); }
#exam-app .eq-choice:focus-visible { outline: 2px solid var(--text); outline-offset: 2px; }
#exam-app .eq-choice.esel { border-color: var(--text); background: var(--surface); }
#exam-app .eq-choice.ecorrect { border-color: var(--green); background: var(--surface); border-left: 4px solid var(--green); }
#exam-app .eq-choice.ewrong { border-color: var(--red); background: var(--surface); border-left: 4px solid var(--red); }
#exam-app .eq-choice .eq-letter { font-weight: 700; margin-right: 0.5rem; }
#exam-app .eq-expl { background: var(--surface); border-radius: 12px; padding: 1rem 1.25rem; margin-bottom: 1.25rem; font-size: 0.9rem; line-height: 1.7; }
#exam-app .eq-expl .eq-labref { display: block; margin-top: 0.5rem; font-size: 0.72rem; color: var(--text-light); }
#exam-app .eq-nav { display: flex; justify-content: space-between; align-items: center; gap: 0.5rem; flex-wrap: wrap; }
#exam-app .eq-nav button { border: 1px solid var(--border-medium); border-radius: 6px; padding: 0.45rem 1rem; font-size: 0.85rem; font-family: var(--font-sans); background: var(--surface); color: var(--text); cursor: pointer; transition: all 0.15s; }
#exam-app .eq-nav button:hover { background: var(--surface-raised); }
#exam-app .eq-nav button:disabled { opacity: 0.35; cursor: default; }
#exam-app .eq-nav-mid { display: flex; gap: 0.5rem; flex-wrap: wrap; justify-content: center; }
#exam-app .ebtn-flag.eflagged { background: #fceee9; color: var(--red); border-color: var(--red); }
#exam-app .ebtn-jump { color: var(--brand); border-color: var(--brand); }
#exam-app .ebtn-jump:hover { background: #fdf1ea; }
#exam-app .eq-kb-hint { margin-top: 0.75rem; text-align: center; font-size: 0.7rem; color: var(--text-light); font-family: var(--font-sans); }
#exam-app .eq-kb-hint kbd { font-family: var(--font-mono); background: var(--surface-raised); border: 1px solid var(--border); border-radius: 3px; padding: 0.05rem 0.3rem; font-size: 0.7rem; color: var(--text-muted); }
#exam-app .eq-revlink { display: inline-block; margin-top: 0.4rem; background: none; border: none; color: var(--text-muted); font-family: var(--font-sans); font-size: 0.78rem; cursor: pointer; text-decoration: underline; text-decoration-color: var(--border-medium); text-underline-offset: 3px; transition: color 0.15s, text-decoration-color 0.15s; padding: 0.25rem 0.5rem; }
#exam-app .eq-revlink:hover { color: var(--text); text-decoration-color: var(--text); }
#exam-app .eq-revlink-wrap { text-align: center; margin-top: 0.25rem; }
#exam-app .egrid-cell.eflagged { position: relative; }
#exam-app .egrid-cell.eflagged::after { content: ""; position: absolute; top: 3px; right: 3px; width: 6px; height: 6px; border-radius: 50%; background: var(--red); }
#exam-app .el-flag { background: var(--bg); border: 1px solid var(--red); position: relative; }
#exam-app .el-flag::after { content: ""; position: absolute; top: 1px; right: 1px; width: 4px; height: 4px; border-radius: 50%; background: var(--red); }
#exam-app .egrid { display: grid; grid-template-columns: repeat(10, 1fr); gap: 5px; margin: 1rem 0; }
#exam-app .egrid-cell { aspect-ratio: 1; display: flex; align-items: center; justify-content: center; border-radius: 6px; font-size: 0.75rem; font-weight: 600; cursor: pointer; border: 2px solid transparent; transition: transform 0.1s; }
#exam-app .egrid-cell:hover { transform: scale(1.1); }
#exam-app .egrid-cell.eans { background: #eef4f9; color: var(--blue); border-color: var(--blue); }
#exam-app .egrid-cell.eunans { background: var(--surface-raised); color: var(--text-light); }
#exam-app .egrid-cell.eok { background: #eef3e8; color: var(--green); border-color: var(--green); }
#exam-app .egrid-cell.eko { background: #fceee9; color: var(--red); border-color: var(--red); }
#exam-app .egrid-legend { display: flex; gap: 1rem; justify-content: center; margin: 0.75rem 0; font-size: 0.72rem; color: var(--text-muted); }
#exam-app .egrid-legend span { display: flex; align-items: center; gap: 0.3rem; }
#exam-app .egrid-legend .el-dot { width: 10px; height: 10px; border-radius: 3px; }
#exam-app .el-ans { background: #eef4f9; border: 1px solid var(--blue); }
#exam-app .el-unans { background: var(--surface-raised); border: 1px solid var(--text-light); }
#exam-app .el-ok { background: #eef3e8; border: 1px solid var(--green); }
#exam-app .el-ko { background: #fceee9; border: 1px solid var(--red); }
#exam-app .esubmit { text-align: center; margin-top: 1.5rem; }
#exam-app .esubmit button { margin: 0 0.5rem; }
#exam-app .ewarn-txt { color: var(--yellow); font-size: 0.85rem; margin-bottom: 0.75rem; text-align: center; }
#exam-app .eres-badge { text-align: center; padding: 1.25rem; border-radius: 12px; margin: 1.25rem 0; font-size: 1.3rem; font-weight: 700; font-family: var(--font-serif); }
#exam-app .eres-badge.epass { background: #eef3e8; color: var(--green); }
#exam-app .eres-badge.efail { background: #fceee9; color: var(--red); }
#exam-app .eres-time { text-align: center; color: var(--text-muted); font-size: 0.85rem; margin-bottom: 1rem; }
#exam-app .edom-row { display: flex; align-items: center; gap: 0.75rem; padding: 0.5rem 0; border-bottom: 1px solid var(--border); }
#exam-app .edom-row .edom-name { flex: 1; font-size: 0.8rem; min-width: 180px; }
#exam-app .edom-row .edom-bar-w { flex: 2; background: var(--border); border-radius: 100vw; height: 6px; }
#exam-app .edom-row .edom-bar { height: 6px; border-radius: 100vw; transition: width 0.5s; }
#exam-app .edom-row .edom-bar.ebgood { background: var(--green); }
#exam-app .edom-row .edom-bar.ebmid { background: var(--yellow); }
#exam-app .edom-row .edom-bar.eblow { background: var(--red); }
#exam-app .edom-row .edom-sc { font-size: 0.8rem; color: var(--text-muted); min-width: 70px; text-align: right; }
#exam-app .edetail { background: var(--surface); border: 1px solid var(--border); border-radius: 12px; padding: 1.25rem; margin-top: 1.25rem; }
#exam-app .edetail .eq-text { font-size: 0.95rem; }
#exam-app h2 { margin-top: 1.5rem; }
#exam-app h3 { margin-top: 1.25rem; }
@media (max-width: 600px) { #exam-app .egrid { grid-template-columns: repeat(6, 1fr); } #exam-app .exam-metrics { flex-direction: column; align-items: center; } #exam-app .edom-row { flex-wrap: wrap; } #exam-app .edom-row .edom-name { min-width: 100%; } }
</style>

<div id="exam-welcome" class="exam-screen exam-active">
  <p class="exam-desc">60 scenario-based questions across 5 domains. Simulates the real CCA Foundations certification exam.</p>
  <div class="exam-mode-toggle">
    <button id="ebtn-exam" class="esel" onclick="window._exam.setMode('exam')">Exam Mode</button>
    <button id="ebtn-study" onclick="window._exam.setMode('study')">Study Mode</button>
  </div>
  <div class="exam-metrics">
    <div class="em-card"><div class="em-val">60</div><div class="em-lbl">Questions</div></div>
    <div class="em-card"><div class="em-val">720</div><div class="em-lbl">Pass Score</div></div>
    <div class="em-card" id="etime-card"><div class="em-val">120m</div><div class="em-lbl">Time Limit</div></div>
  </div>
  <p class="exam-desc" style="font-size:0.82rem;margin-top:1.25rem;color:var(--text-light)">Score 900+ in Exam Mode before scheduling the real CCA Foundations exam. If a domain scores below 80%, re-read those module labs and focus on the <strong>Exam tips</strong> sections.</p>
  <button class="exam-start" onclick="window._exam.start()">Start Exam</button>
</div>

<div id="exam-question" class="exam-screen">
  <div class="exam-timer" id="etimer"></div>
  <div class="exam-prog-wrap"><div class="exam-prog-fill" id="eprog"></div></div>
  <div class="eq-header"><span class="eq-num" id="eqnum"></span><span class="eq-badge" id="eqdom"></span></div>
  <div class="eq-text" id="eqtext"></div>
  <ul class="eq-choices" id="eqchoices" role="radiogroup"></ul>
  <div id="eqexpl" class="eq-expl" style="display:none"></div>
  <div class="eq-nav">
    <button id="ebtn-prev" onclick="window._exam.prev()">&#8592; Previous</button>
    <div class="eq-nav-mid">
      <button id="ebtn-flag" class="ebtn-flag" onclick="window._exam.toggleFlag()" aria-pressed="false">\u2691 Flag for review</button>
      <button id="ebtn-jump" class="ebtn-jump" onclick="window._exam.jumpNextUnanswered()" style="display:none">Jump to next unanswered &#8594;</button>
    </div>
    <button id="ebtn-next" onclick="window._exam.next()">Next &#8594;</button>
  </div>
  <div class="eq-revlink-wrap"><button type="button" class="eq-revlink" onclick="window._exam.showReview()">Review all questions</button></div>
  <div class="eq-kb-hint">Keys: <kbd>A</kbd>\u2013<kbd>D</kbd> select \u00b7 <kbd>\u2190</kbd>/<kbd>\u2192</kbd> navigate \u00b7 <kbd>F</kbd> flag</div>
</div>

<div id="exam-review" class="exam-screen">
  <h2 style="text-transform:none;font-size:1.1rem;color:var(--text);letter-spacing:0">Review Questions</h2>
  <div class="egrid-legend"><span><span class="el-dot el-ans"></span>Answered</span><span><span class="el-dot el-unans"></span>Unanswered</span><span><span class="el-dot el-flag"></span>Flagged</span></div>
  <div class="egrid" id="erev-grid"></div>
  <div class="ewarn-txt" id="ewarn"></div>
  <div class="esubmit">
    <button onclick="window._exam.goQ(window._exam.cur)">Back to Questions</button>
    <button style="background:var(--text);color:var(--bg);border-color:var(--text)" onclick="window._exam.confirmSubmit()">Submit Exam</button>
  </div>
</div>

<div id="exam-results" class="exam-screen">
  <h2 style="text-align:center;text-transform:none;font-size:1.1rem;color:var(--text);letter-spacing:0">Exam Results</h2>
  <div class="eres-badge" id="eres-badge"></div>
  <div class="eres-time" id="eres-time"></div>
  <div class="exam-metrics" id="eres-metrics"></div>
  <h3>Domain Breakdown</h3>
  <div id="edom-bd"></div>
  <h3>Question Review</h3>
  <div class="egrid-legend"><span><span class="el-dot el-ok"></span>Correct</span><span><span class="el-dot el-ko"></span>Incorrect</span></div>
  <div class="egrid" id="eres-grid"></div>
  <div class="edetail" id="edetail" style="display:none"></div>
  <div style="text-align:center;margin-top:1.5rem"><button class="exam-start" onclick="window._exam.restart()">Restart</button></div>
</div>
</div>

<script>
(function(){
var Q=${examJSON};
var DOMS={D1:"Agentic Architecture & Orchestration",D2:"Tool Design & MCP Integration",D3:"Claude Code Configuration & Workflows",D4:"Prompt Engineering & Structured Output",D5:"Context Management & Reliability"};
var mode="exam",ans={},flags={},cur=0,startT=null,endT=null,tInt=null,submitted=false,pausedRemaining=null;
function esc(s){return s.replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/"/g,"&quot;");}
function fmt(t){return esc(t).replace(/\\*\\*(.+?)\\*\\*/g,"<strong>$1</strong>");}
function scr(id){document.querySelectorAll("#exam-app .exam-screen").forEach(function(s){s.classList.remove("exam-active")});document.getElementById(id).classList.add("exam-active");}
function setMode(m){mode=m;document.getElementById("ebtn-exam").classList.toggle("esel",m==="exam");document.getElementById("ebtn-study").classList.toggle("esel",m==="study");document.getElementById("etime-card").querySelector(".em-val").textContent=m==="exam"?"120m":"None";}
function isVisible(){var el=document.getElementById("exam-app");if(!el)return false;var sec=el.closest(".content-section");return sec&&sec.style.display!=="none";}
function startTimer(){var end=startT+120*60*1000;tInt=setInterval(function(){if(!isVisible()){if(!pausedRemaining){pausedRemaining=end-Date.now();}return;}if(pausedRemaining){end=Date.now()+pausedRemaining;pausedRemaining=null;}var rem=end-Date.now();if(rem<=0){clearInterval(tInt);submitExam();return;}var m=Math.floor(rem/60000),s=Math.floor((rem%60000)/1000);var el=document.getElementById("etimer");el.textContent=m+":"+(s<10?"0":"")+s;el.classList.toggle("ewarn",rem<300000);},500);}
function start(){ans={};flags={};cur=0;submitted=false;endT=null;pausedRemaining=null;startT=Date.now();if(mode==="exam")startTimer();scr("exam-question");renderQ();}
function toggleFlag(){if(submitted&&mode==="exam")return;flags[cur]=!flags[cur];renderQ();}
function jumpNextUnanswered(){for(var i=1;i<=60;i++){var idx=(cur+i)%60;if(!ans[idx]){cur=idx;renderQ();return;}}}
function renderQ(){var q=Q[cur];document.getElementById("eqnum").textContent="Question "+(cur+1)+" of 60";document.getElementById("eqdom").textContent=q.domain_code+" \\u2014 "+(DOMS[q.domain_code]||q.domain_name);document.getElementById("eqtext").textContent=q.question;document.getElementById("eprog").style.width=((cur+1)/60*100)+"%";document.getElementById("etimer").style.display=mode==="exam"&&!submitted?"block":"none";document.getElementById("ebtn-prev").disabled=cur===0;var nb=document.getElementById("ebtn-next");if(cur===59&&!submitted){nb.innerHTML="Review &amp; Submit &#8594;";nb.disabled=false;}else{nb.innerHTML="Next &#8594;";nb.disabled=cur===59;}
var fb=document.getElementById("ebtn-flag");if(fb){fb.classList.toggle("eflagged",!!flags[cur]);fb.setAttribute("aria-pressed",flags[cur]?"true":"false");fb.innerHTML=(flags[cur]?"\\u2691 Flagged":"\\u2691 Flag for review");fb.style.display=submitted?"none":"";}
var jb=document.getElementById("ebtn-jump");if(jb){var anyUnans=false;for(var i=0;i<60;i++){if(!ans[i]){anyUnans=true;break;}}jb.style.display=(anyUnans&&!submitted)?"":"none";}
var ul=document.getElementById("eqchoices");ul.innerHTML="";["A","B","C","D"].forEach(function(L){var li=document.createElement("li");li.className="eq-choice";li.setAttribute("tabindex","0");li.setAttribute("role","radio");li.innerHTML='<span class="eq-letter">'+L+")</span> "+esc(q.choices[L]);if(ans[cur]===L)li.classList.add("esel");if(mode==="study"&&ans[cur]){li.classList.remove("esel");if(L===q.correct_answer)li.classList.add("ecorrect");else if(L===ans[cur])li.classList.add("ewrong");}if(mode==="exam"&&submitted){li.classList.remove("esel");if(L===q.correct_answer)li.classList.add("ecorrect");else if(L===ans[cur]&&L!==q.correct_answer)li.classList.add("ewrong");}li.onclick=function(){selAns(L);};li.onkeydown=function(e){if(e.key==="Enter"||e.key===" "){e.preventDefault();selAns(L);}};ul.appendChild(li);});
var ex=document.getElementById("eqexpl");if((mode==="study"&&ans[cur])||(mode==="exam"&&submitted)){ex.innerHTML=fmt(q.explanation)+'<span class="eq-labref">Source: '+esc(q.lab_reference)+"</span>";ex.style.display="block";}else{ex.style.display="none";}}
function selAns(L){if(submitted&&mode==="exam")return;if(mode==="study"&&ans[cur])return;ans[cur]=L;renderQ();}
function prev(){if(cur>0){cur--;renderQ();}}
function next(){if(cur<59){cur++;renderQ();}else if(!submitted){showReview();}}
function goQ(i){cur=i;scr("exam-question");renderQ();}
function showReview(){var g=document.getElementById("erev-grid");g.innerHTML="";for(var i=0;i<60;i++){var c=document.createElement("div");c.className="egrid-cell";c.textContent=i+1;if(ans[i])c.classList.add("eans");else c.classList.add("eunans");if(flags[i])c.classList.add("eflagged");c.onclick=(function(idx){return function(){goQ(idx);};})(i);c.setAttribute("tabindex","0");g.appendChild(c);}var u=60-Object.keys(ans).length;var f=Object.keys(flags).filter(function(k){return flags[k];}).length;var msg=[];if(u>0)msg.push(u+" unanswered");if(f>0)msg.push(f+" flagged");document.getElementById("ewarn").textContent=msg.join(" \\u00b7 ");scr("exam-review");}
function confirmSubmit(){var u=60-Object.keys(ans).length;if(confirm(u>0?"You have "+u+" unanswered question(s). Submit anyway?":"Submit your exam?"))submitExam();}
function submitExam(){if(tInt)clearInterval(tInt);endT=Date.now();submitted=true;showResults();}
function showResults(){var correct=0;Q.forEach(function(q,i){if(ans[i]===q.correct_answer)correct++;});var pct=Math.round(correct/60*100),scaled=Math.round(correct/60*1000),passed=scaled>=720;var el=Math.round((endT-startT)/1000),em=Math.floor(el/60),es=el%60;
document.getElementById("eres-badge").className="eres-badge "+(passed?"epass":"efail");document.getElementById("eres-badge").textContent=passed?"PASSED":"NOT PASSED";document.getElementById("eres-time").textContent="Completed in "+em+"m "+es+"s";
document.getElementById("eres-metrics").innerHTML='<div class="em-card"><div class="em-val">'+correct+'/60</div><div class="em-lbl">Raw Score</div></div><div class="em-card"><div class="em-val">'+pct+'%</div><div class="em-lbl">Percentage</div></div><div class="em-card"><div class="em-val">'+scaled+'</div><div class="em-lbl">Scaled Score</div></div>';
var ds={};["D1","D2","D3","D4","D5"].forEach(function(d){ds[d]={t:0,c:0};});Q.forEach(function(q,i){ds[q.domain_code].t++;if(ans[i]===q.correct_answer)ds[q.domain_code].c++;});
var bd=document.getElementById("edom-bd");bd.innerHTML="";["D1","D2","D3","D4","D5"].forEach(function(d){var s=ds[d],dp=s.t>0?Math.round(s.c/s.t*100):0,cls=dp>=80?"ebgood":dp>=60?"ebmid":"eblow";bd.innerHTML+='<div class="edom-row"><span class="edom-name">'+d+" \\u2014 "+DOMS[d]+'</span><div class="edom-bar-w"><div class="edom-bar '+cls+'" style="width:'+dp+'%"></div></div><span class="edom-sc">'+s.c+"/"+s.t+" ("+dp+"%)</span></div>";});
var g=document.getElementById("eres-grid");g.innerHTML="";for(var i=0;i<60;i++){var c=document.createElement("div");c.className="egrid-cell";c.textContent=i+1;c.classList.add(ans[i]===Q[i].correct_answer?"eok":"eko");c.onclick=(function(idx){return function(){showDetail(idx);};})(i);c.setAttribute("tabindex","0");g.appendChild(c);}
document.getElementById("edetail").style.display="none";scr("exam-results");}
function showDetail(i){var q=Q[i],p=document.getElementById("edetail");var h='<div class="eq-header"><span class="eq-num">Question '+(i+1)+'</span><span class="eq-badge">'+q.domain_code+"</span></div>";h+='<div class="eq-text">'+esc(q.question)+"</div>";h+='<ul class="eq-choices" style="pointer-events:none">';["A","B","C","D"].forEach(function(L){var cls="eq-choice";if(L===q.correct_answer)cls+=" ecorrect";else if(L===ans[i]&&L!==q.correct_answer)cls+=" ewrong";h+='<li class="'+cls+'"><span class="eq-letter">'+L+")</span> "+esc(q.choices[L])+"</li>";});h+="</ul>";if(ans[i]&&ans[i]!==q.correct_answer)h+='<p style="color:var(--red);font-size:0.8rem;margin-bottom:0.5rem">Your answer: '+ans[i]+"</p>";h+='<div class="eq-expl">'+fmt(q.explanation)+'<span class="eq-labref">Source: '+esc(q.lab_reference)+"</span></div>";p.innerHTML=h;p.style.display="block";p.scrollIntoView({behavior:"smooth"});}
function restart(){if(tInt)clearInterval(tInt);pausedRemaining=null;scr("exam-welcome");}
document.addEventListener("keydown",function(e){if(!isVisible())return;var qs=document.getElementById("exam-question");if(qs&&qs.classList.contains("exam-active")&&!submitted){var k=e.key.toUpperCase();if(["A","B","C","D"].indexOf(k)>=0){selAns(k);e.preventDefault();}if(e.key==="ArrowRight"||e.key==="ArrowDown"){next();e.preventDefault();}if(e.key==="ArrowLeft"||e.key==="ArrowUp"){prev();e.preventDefault();}if(k==="F"){toggleFlag();e.preventDefault();}}});
window._exam={setMode:setMode,start:start,prev:prev,next:next,goQ:goQ,showReview:showReview,confirmSubmit:confirmSubmit,restart:restart,toggleFlag:toggleFlag,jumpNextUnanswered:jumpNextUnanswered,get cur(){return cur;}};
})();
</script>
`;

// Build the full HTML page
const html = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Claude Certified Architect — Foundations Study Guide</title>
  <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/highlight.js/11.9.0/styles/github.min.css">
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://cdn.prod.website-files.com" crossorigin>
  <link rel="preload" as="font" type="font/woff2" crossorigin href="https://cdn.prod.website-files.com/67ce28cfec624e2b733f8a52/69971a00a3295036497e1a28_AnthropicSans-Roman-Web.woff2">
  <link rel="preload" as="font" type="font/woff2" crossorigin href="https://cdn.prod.website-files.com/67ce28cfec624e2b733f8a52/69971a1551eb6cda0d656e8a_AnthropicSerif-Roman-Web.woff2">
  <link href="https://fonts.googleapis.com/css2?family=Source+Serif+4:ital,opsz,wght@0,8..60,400;0,8..60,500;0,8..60,600;1,8..60,400&family=Inter:wght@400;500;600;700&family=JetBrains+Mono:wght@400;500&display=swap" rel="stylesheet">
  <style>
    @font-face {
      font-family: 'Anthropic Sans';
      src: url('https://cdn.prod.website-files.com/67ce28cfec624e2b733f8a52/69971a00a3295036497e1a28_AnthropicSans-Roman-Web.woff2') format('woff2');
      font-weight: 300 800;
      font-style: normal;
      font-display: swap;
    }
    @font-face {
      font-family: 'Anthropic Sans';
      src: url('https://cdn.prod.website-files.com/67ce28cfec624e2b733f8a52/69971a016067bf14b9b8f48d_AnthropicSans-Italic-Web.woff2') format('woff2');
      font-weight: 300 800;
      font-style: italic;
      font-display: swap;
    }
    @font-face {
      font-family: 'Anthropic Serif';
      src: url('https://cdn.prod.website-files.com/67ce28cfec624e2b733f8a52/69971a1551eb6cda0d656e8a_AnthropicSerif-Roman-Web.woff2') format('woff2');
      font-weight: 300 800;
      font-style: normal;
      font-display: swap;
    }
    @font-face {
      font-family: 'Anthropic Serif';
      src: url('https://cdn.prod.website-files.com/67ce28cfec624e2b733f8a52/69971a15a9fb8c1107a3570e_AnthropicSerif-Italic-Web.woff2') format('woff2');
      font-weight: 300 800;
      font-style: italic;
      font-display: swap;
    }
    @font-face {
      font-family: 'Anthropic Mono';
      src: url('https://cdn.prod.website-files.com/67ce28cfec624e2b733f8a52/69971a2e55d24d61bc045b1a_AnthropicMono-Roman-Web.woff2') format('woff2');
      font-weight: 300 800;
      font-style: normal;
      font-display: swap;
    }

    :root {
      --bg: #faf9f5;
      --surface: #f0eee6;
      --surface-raised: #e8e5db;
      --surface-white: #ffffff;
      --border: #e5e2d9;
      --border-medium: #d1cfc5;
      --text: #141413;
      --text-muted: #7c7968;
      --text-light: #B0AEA5;
      --accent: #2c2b25;
      --accent-bright: #3d3c36;
      --accent-dim: #4a4840;
      --brand: #c6613f;
      --blue: #4a7ba8;
      --green: #5a7a42;
      --red: #b84c3a;
      --purple: #6b5b8a;
      --yellow: #96722e;
      --code-bg: #f7f5f1;
      --sidebar-width: 300px;
      --font-sans: 'Anthropic Sans', 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
      --font-serif: 'Anthropic Serif', 'Source Serif 4', Georgia, serif;
      --font-mono: 'Anthropic Mono', 'JetBrains Mono', 'Fira Code', monospace;
    }

    * { margin: 0; padding: 0; box-sizing: border-box; }

    html {
      scroll-behavior: smooth;
      scroll-padding-top: 1rem;
    }

    body {
      font-family: var(--font-serif);
      background: var(--bg);
      color: var(--text);
      line-height: 1.7;
      display: flex;
      -webkit-font-smoothing: antialiased;
      -moz-osx-font-smoothing: grayscale;
      font-size: 1.05rem;
    }

    /* ─── Sidebar ─── */
    .sidebar {
      position: fixed;
      top: 0;
      left: 0;
      width: var(--sidebar-width);
      height: 100vh;
      background: var(--surface);
      border-right: none;
      overflow-y: auto;
      padding: 0;
      z-index: 100;
      transition: transform 0.3s ease;
      display: flex;
      flex-direction: column;
    }

    .sidebar-header {
      padding: 1.5rem 1.25rem 1.25rem;
      border-bottom: 1px solid var(--border);
      flex-shrink: 0;
    }

    .sidebar-header h2 {
      font-size: 0.95rem;
      font-weight: 600;
      color: var(--text);
      font-family: var(--font-serif);
      letter-spacing: -0.02em;
    }

    .sidebar-header p {
      font-size: 0.72rem;
      color: var(--text-muted);
      margin-top: 0.2rem;
      font-family: var(--font-sans);
    }

    /* Search */
    .search-box {
      padding: 0.75rem 1rem;
      border-bottom: 1px solid var(--border);
      flex-shrink: 0;
    }

    .search-box input {
      width: 100%;
      background: var(--bg);
      border: 1px solid var(--border-medium);
      border-radius: 8px;
      padding: 0.5rem 0.75rem;
      color: var(--text);
      font-size: 0.8rem;
      font-family: var(--font-sans);
      outline: none;
      transition: border-color 0.15s;
    }

    .search-box input::placeholder { color: var(--text-light); }
    .search-box input:focus { border-color: var(--border-medium); box-shadow: 0 0 0 2px rgba(0, 0, 0, 0.04); }

    .nav-empty {
      padding: 1.25rem 1.25rem 1.5rem;
      font-family: var(--font-sans);
      font-size: 0.78rem;
      color: var(--text-muted);
      text-align: center;
      line-height: 1.5;
      display: none;
    }
    .nav-empty.is-visible { display: block; }
    .nav-empty strong { display: block; color: var(--text); font-weight: 600; margin-bottom: 0.2rem; }

    .sidebar nav {
      flex: 1;
      overflow-y: auto;
      padding: 0.5rem 0 2rem;
    }

    .sidebar nav ul { list-style: none; }

    /* Sidebar section divider (non-clickable, groups accordions) */
    .nav-divider {
      padding: 1rem 1.25rem 0.35rem;
      font-family: var(--font-sans);
      font-size: 0.62rem;
      font-weight: 700;
      text-transform: uppercase;
      letter-spacing: 0.1em;
      color: var(--text-light);
      border-top: 1px solid var(--border);
      margin-top: 0.25rem;
    }
    .nav-divider:first-child {
      border-top: none;
      margin-top: 0;
    }

    /* ─── Accordion Groups ─── */
    .nav-group { border-bottom: 1px solid var(--border); }
    .nav-group:last-child { border-bottom: none; }

    .nav-group-header {
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 0.7rem 1.25rem;
      font-size: 0.78rem;
      font-weight: 600;
      color: var(--text);
      text-decoration: none;
      cursor: pointer;
      font-family: var(--font-sans);
      transition: all 0.15s ease;
      user-select: none;
      letter-spacing: -0.005em;
    }

    .nav-group-header:hover { background: var(--surface-raised); }

    .nav-group-header.open {
      background: var(--surface-raised);
    }

    .nav-group-header .nav-chevron {
      font-size: 0.7rem;
      color: var(--text-light);
      transition: transform 0.2s ease;
      flex-shrink: 0;
      line-height: 1;
    }

    .nav-group-header.open .nav-chevron {
      transform: rotate(90deg);
      color: var(--text-muted);
    }

    .nav-group-children {
      max-height: 0;
      overflow: hidden;
      transition: max-height 0.25s ease;
    }

    .nav-group-children.open {
      max-height: 2000px;
    }

    /* Group types */
    .nav-group-header.type-section {
      font-size: 0.72rem;
      text-transform: uppercase;
      letter-spacing: 0.04em;
      color: var(--text-muted);
    }

    .nav-group-header.type-exam {
      font-size: 0.72rem;
      text-transform: uppercase;
      letter-spacing: 0.04em;
      color: var(--brand);
    }

    .nav-lab {
      display: flex;
      align-items: center;
      gap: 0.5rem;
      padding: 0.45rem 1.25rem 0.45rem 1.5rem;
      font-size: 0.8rem;
      color: var(--text-muted);
      text-decoration: none;
      transition: all 0.12s ease;
      font-family: var(--font-sans);
      border-left: 2px solid transparent;
    }

    .nav-lab:hover {
      color: var(--text);
      background: var(--surface-raised);
    }

    .nav-lab.active {
      color: var(--text);
      font-weight: 600;
      background: var(--surface-raised);
      border-left-color: var(--text);
    }

    .nav-lab:focus-visible {
      outline: 2px solid var(--text);
      outline-offset: -2px;
      background: var(--surface-raised);
    }
    .nav-group-header:focus-visible {
      outline: 2px solid var(--text);
      outline-offset: -2px;
    }

    /* Skip to content link (keyboard-only, visible on focus) */
    .skip-link {
      position: absolute;
      top: -40px;
      left: 0.5rem;
      z-index: 1000;
      background: var(--text);
      color: var(--bg);
      padding: 0.5rem 0.9rem;
      border-radius: 6px;
      font-family: var(--font-sans);
      font-size: 0.85rem;
      text-decoration: none;
      transition: top 0.15s;
    }
    .skip-link:focus { top: 0.5rem; outline: 2px solid var(--brand); outline-offset: 2px; }

    .nav-dot {
      width: 5px;
      height: 5px;
      border-radius: 50%;
      background: var(--text-light);
      flex-shrink: 0;
    }

    .nav-lab.active .nav-dot {
      background: var(--text);
    }

    /* Completed lab: filled green dot */
    .nav-lab.completed .nav-dot {
      background: var(--green);
      box-shadow: 0 0 0 1.5px var(--green);
    }

    /* Progress pill in sidebar header */
    .sidebar-progress-pill {
      display: inline-flex;
      align-items: center;
      gap: 0.35rem;
      margin-top: 0.5rem;
      padding: 0.2rem 0.55rem;
      border-radius: 100vw;
      background: var(--surface-raised);
      font-family: var(--font-sans);
      font-size: 0.68rem;
      color: var(--text-muted);
      line-height: 1.3;
    }
    .sidebar-progress-pill .sp-dot {
      width: 6px;
      height: 6px;
      border-radius: 50%;
      background: var(--green);
    }
    .sidebar-progress-pill.complete { background: #eef3e8; color: var(--green); }

    /* Per-lab "mark complete" button */
    .lab-complete-row {
      display: flex;
      align-items: center;
      gap: 0.75rem;
      margin: 3rem 0 0.5rem;
      padding: 1rem 1.25rem;
      background: var(--surface);
      border-radius: 12px;
      font-family: var(--font-sans);
    }
    .lab-complete-row label {
      display: flex;
      align-items: center;
      gap: 0.55rem;
      cursor: pointer;
      font-size: 0.88rem;
      color: var(--text);
      user-select: none;
    }
    .lab-complete-row input[type="checkbox"] {
      width: 1.1rem;
      height: 1.1rem;
      accent-color: var(--green);
      cursor: pointer;
    }
    .lab-complete-row .lab-complete-hint {
      font-size: 0.75rem;
      color: var(--text-muted);
      margin-left: auto;
    }
    .lab-complete-row.is-complete {
      background: #eef3e8;
    }
    .lab-complete-row.is-complete label { color: var(--green); font-weight: 600; }

    .nav-hidden { display: none; }

    /* ─── Main Content ─── */
    .main {
      margin-left: var(--sidebar-width);
      flex: 1;
      min-height: 100vh;
      transition: margin-left 0.3s ease;
    }

    .main {
      background: var(--surface-white);
    }

    .content {
      max-width: 720px;
      margin: 0 auto;
      padding: 2.5rem 2.5rem 6rem;
      position: relative;
    }

    /* ─── On-this-page sub-TOC (right rail) ─── */
    .page-toc {
      position: fixed;
      top: 2.5rem;
      right: 2rem;
      width: 220px;
      max-height: calc(100vh - 5rem);
      overflow-y: auto;
      font-family: var(--font-sans);
      font-size: 0.78rem;
      display: none;
      padding-left: 0.9rem;
      border-left: 1px solid var(--border);
      z-index: 50;
    }
    .page-toc-label {
      font-size: 0.62rem;
      font-weight: 700;
      text-transform: uppercase;
      letter-spacing: 0.1em;
      color: var(--text-light);
      margin-bottom: 0.55rem;
    }
    /* Close button: only shown in mobile/tablet drawer mode. Hidden on desktop
       since the right-rail TOC is always visible. */
    .page-toc-close { display: none; }
    .page-toc-list {
      list-style: none;
      padding: 0;
      margin: 0;
      display: flex;
      flex-direction: column;
      gap: 0.15rem;
    }
    .page-toc a {
      display: block;
      padding: 0.3rem 0;
      color: var(--text-muted);
      text-decoration: none;
      line-height: 1.35;
      border-left: 2px solid transparent;
      padding-left: 0.65rem;
      margin-left: -0.9rem;
      transition: color 0.12s, border-color 0.12s;
    }
    .page-toc a:hover { color: var(--text); }
    .page-toc a.active {
      color: var(--text);
      border-left-color: var(--text);
      font-weight: 600;
    }
    @media (min-width: 1200px) {
      .page-toc { display: block; }
    }
    /* When sidebar is collapsed we can still show the TOC comfortably */
    .sidebar-collapsed .page-toc { right: 2rem; }

    /* Mobile/tablet (<1200px): TOC becomes a bottom-sheet drawer */
    @media (max-width: 1199px) {
      .page-toc {
        position: fixed;
        top: auto;
        left: 0;
        right: 0;
        bottom: 0;
        width: 100%;
        max-height: 60vh;
        padding: 1.25rem 1.25rem 1.5rem;
        background: var(--surface-white);
        border-left: none;
        border-top: 1px solid var(--border);
        border-radius: 16px 16px 0 0;
        box-shadow: 0 -8px 24px rgba(0,0,0,0.08);
        transform: translateY(100%);
        transition: transform 0.25s ease;
        display: block;
        z-index: 220;
      }
      .page-toc.open { transform: translateY(0); }
      .page-toc a { padding-left: 0.75rem; margin-left: 0; }
      .page-toc-handle {
        width: 36px;
        height: 4px;
        background: var(--border-medium);
        border-radius: 100vw;
        margin: -0.3rem auto 0.8rem;
      }
      .page-toc-close {
        display: block;
        position: absolute;
        top: 0.75rem;
        right: 0.9rem;
        border: none;
        background: transparent;
        color: var(--text-muted);
        font-size: 1.2rem;
        line-height: 1;
        cursor: pointer;
        padding: 0.3rem;
      }
      .page-toc-close:hover { color: var(--text); }
    }

    /* Floating TOC trigger button (mobile/tablet only) */
    .page-toc-fab {
      display: none;
      position: fixed;
      bottom: 2rem;
      right: 4.5rem;
      background: var(--text);
      color: var(--bg);
      border: none;
      border-radius: 100vw;
      padding: 0.55rem 0.9rem;
      font-family: var(--font-sans);
      font-size: 0.78rem;
      font-weight: 500;
      cursor: pointer;
      z-index: 100;
      box-shadow: 0 2px 8px rgba(0,0,0,0.1);
      transition: background 0.15s, opacity 0.3s;
      opacity: 0;
      pointer-events: none;
    }
    .page-toc-fab.visible { opacity: 1; pointer-events: auto; }
    .page-toc-fab:hover { background: var(--accent-dim); }
    @media (max-width: 1199px) {
      .page-toc-fab.available { display: inline-flex; align-items: center; gap: 0.35rem; }
    }

    /* TOC scrim (mobile) */
    .page-toc-scrim {
      display: none;
      position: fixed;
      inset: 0;
      background: rgba(0,0,0,0.25);
      z-index: 210;
      opacity: 0;
      transition: opacity 0.2s;
    }
    .page-toc-scrim.open { display: block; opacity: 1; }

    /* ─── Hero ─── */
    .hero-subtitle {
      font-size: 0.85rem;
      font-weight: 500;
      color: var(--text-light);
      letter-spacing: 0.06em;
      text-transform: uppercase;
      margin: -0.25rem 0 0.25rem;
      font-family: var(--font-sans);
    }

    .subtitle {
      font-size: 0.88rem;
      color: var(--text-muted);
      margin: 0.15rem 0;
      font-family: var(--font-sans);
    }

    .model-tag {
      display: inline-block;
      background: var(--surface-raised);
      padding: 0.25rem 0.6rem;
      border-radius: 4px;
      font-family: var(--font-mono);
      font-size: 0.78rem;
      color: var(--text-muted);
      margin: 0.5rem 0;
      border: 1px solid var(--border);
    }

    /* ─── Get Started / Share Buttons ─── */
    .hero-actions {
      display: flex;
      align-items: center;
      gap: 0.75rem;
      margin: 1.25rem 0 0.5rem;
      flex-wrap: wrap;
    }

    .btn-start {
      display: inline-flex;
      align-items: center;
      padding: 0.6rem 1.5rem;
      background: var(--text);
      color: var(--bg);
      border: 1px solid var(--text);
      border-radius: 6px;
      font-family: var(--font-sans);
      font-size: 0.88rem;
      font-weight: 600;
      cursor: pointer;
      transition: all 0.15s;
      text-decoration: none;
    }

    .btn-start:hover { background: var(--accent-dim); border-color: var(--accent-dim); }

    .btn-share {
      display: inline-flex;
      align-items: center;
      gap: 0.35rem;
      padding: 0.5rem 0.9rem;
      background: transparent;
      color: var(--text-muted);
      border: 1px solid var(--border-medium);
      border-radius: 6px;
      font-family: var(--font-sans);
      font-size: 0.8rem;
      font-weight: 500;
      cursor: pointer;
      transition: all 0.15s;
      text-decoration: none;
    }

    .btn-share:hover { background: var(--surface-raised); color: var(--text); border-color: var(--text-light); }
    .btn-share svg { width: 14px; height: 14px; }

    /* ─── Lab Metadata Badges ─── */
    .lab-meta {
      display: flex;
      flex-wrap: wrap;
      gap: 0.4rem;
      align-items: center;
      margin: 0.6rem 0 1.1rem;
      padding-bottom: 1.1rem;
      border-bottom: 1px solid var(--border);
    }
    /* When multiple lab-meta divs sit in a row after H1, remove extra bottom borders/margins */
    .lab-meta + .lab-meta {
      margin-top: -0.8rem;
      padding-bottom: 1.1rem;
      border-top: none;
    }

    .badge {
      display: inline-flex;
      align-items: center;
      padding: 0.22rem 0.6rem;
      border-radius: 100vw;
      font-size: 0.72rem;
      font-weight: 500;
      font-family: var(--font-sans);
      line-height: 1.2;
      letter-spacing: 0.005em;
    }

    .badge-domain {
      background: #eef4f9;
      color: var(--blue);
      border: none;
    }

    .badge-tasks {
      background: #f0edf5;
      color: var(--purple);
      border: none;
    }

    .badge-concept {
      background: #eef3e8;
      color: var(--green);
      border: none;
    }


    /* ─── Anti-patterns cheat sheet priority pills ─── */
    .ap-priority {
      display: inline-block;
      padding: 0.12rem 0.55rem;
      margin-left: 0.5rem;
      border-radius: 100vw;
      font-family: var(--font-sans);
      font-size: 0.62rem;
      font-weight: 600;
      text-transform: uppercase;
      letter-spacing: 0.08em;
      vertical-align: middle;
      line-height: 1.4;
    }
    .ap-priority.ap-critical { background: #fceee9; color: var(--red); }
    .ap-priority.ap-high     { background: #f5f0e6; color: var(--yellow); }
    .ap-priority.ap-medium   { background: var(--surface-raised); color: var(--text-muted); }

    /* ─── Module-intro task-statement tabs ─── */
    .module-tabs {
      display: flex;
      gap: 0.25rem;
      flex-wrap: wrap;
      margin: 1.75rem 0 1.5rem;
      padding: 0.35rem;
      background: var(--surface);
      border-radius: 100vw;
      font-family: var(--font-sans);
    }
    .mod-tab {
      padding: 0.4rem 0.85rem;
      border-radius: 100vw;
      font-size: 0.76rem;
      color: var(--text-muted);
      text-decoration: none;
      font-weight: 500;
      white-space: nowrap;
      transition: background 0.15s, color 0.15s;
    }
    .mod-tab:hover {
      background: var(--surface-white);
      color: var(--text);
    }
    .mod-tab .mod-tab-num {
      color: var(--text-light);
      font-variant-numeric: tabular-nums;
      margin-right: 0.35rem;
      font-weight: 600;
    }
    .mod-tab:hover .mod-tab-num { color: var(--text-muted); }
    .mod-tab:focus-visible {
      outline: 2px solid var(--text);
      outline-offset: 2px;
    }
    @media (max-width: 640px) {
      .module-tabs {
        border-radius: 14px;
        padding: 0.5rem;
      }
      .mod-tab { font-size: 0.72rem; padding: 0.35rem 0.7rem; }
    }

    /* Cheat-sheet entry styling: denser than a full lab */
    #anti-patterns-cheat-sheet ~ h3 {
      margin-top: 1.5rem;
      font-size: 1.05rem;
      padding-bottom: 0.35rem;
      border-bottom: 1px solid var(--border);
    }
    #anti-patterns-cheat-sheet ~ h3 + p,
    #anti-patterns-cheat-sheet ~ h3 + p + p,
    #anti-patterns-cheat-sheet ~ h3 + p + p + p {
      margin: 0.3rem 0;
      font-size: 0.92rem;
      line-height: 1.55;
    }

    /* ─── Details/Summary (Answer Reveals) ─── */
    details {
      background: var(--surface);
      border: none;
      border-radius: 12px;
      margin: 0.75rem 0;
      overflow: hidden;
    }

    details summary {
      padding: 0.6rem 1rem;
      cursor: pointer;
      color: var(--text);
      font-weight: 600;
      font-size: 0.88rem;
      user-select: none;
      transition: background 0.15s;
      font-family: var(--font-sans);
    }

    details summary:hover {
      background: var(--surface-raised);
    }

    details summary::marker {
      color: var(--text-light);
    }

    details[open] summary {
      border-bottom: 1px solid var(--border);
    }

    details > p, details > div {
      padding: 0.75rem 1rem;
    }

    details p {
      margin: 0.4rem 0;
    }

    details strong {
      color: var(--green);
    }

    /* ─── Typography ─── */
    h1 {
      font-family: var(--font-serif);
      font-size: 1.9rem;
      font-weight: 600;
      color: var(--text);
      margin: 2rem 0 0.5rem;
      padding-bottom: 0;
      border-bottom: none;
      letter-spacing: -0.028em;
      scroll-margin-top: 1rem;
      line-height: 1.15;
    }

    h1:first-child {
      margin-top: 0;
      font-size: 2.35rem;
      letter-spacing: -0.032em;
    }

    /* First paragraph after H1 acts as a muted deck/lead */
    h1 + p {
      font-size: 1.08rem;
      color: var(--text-muted);
      line-height: 1.6;
      margin-top: 0.2rem;
    }

    .content > h1 { position: relative; }

    h2 {
      font-family: var(--font-sans);
      font-size: 0.74rem;
      font-weight: 600;
      color: var(--text-muted);
      text-transform: uppercase;
      letter-spacing: 0.06em;
      margin: 2.5rem 0 0.75rem;
      padding-bottom: 0;
      border-bottom: none;
      scroll-margin-top: 1rem;
    }

    /* High-signal section headings: promote to serif and add accent bar */
    h2.h2-signal {
      font-family: var(--font-serif);
      font-size: 1.25rem;
      font-weight: 600;
      color: var(--text);
      text-transform: none;
      letter-spacing: -0.015em;
      margin: 2.75rem 0 0.9rem;
      padding: 0.1rem 0 0.1rem 0.85rem;
      border-left: 3px solid var(--border-medium);
      line-height: 1.25;
    }
    h2.h2-signal .h2-kicker {
      display: block;
      font-family: var(--font-sans);
      font-size: 0.65rem;
      font-weight: 600;
      text-transform: uppercase;
      letter-spacing: 0.08em;
      color: var(--text-light);
      margin-bottom: 0.2rem;
    }
    h2.h2-signal.h2-exam-tips { border-left-color: var(--brand); }
    h2.h2-signal.h2-exam-tips .h2-kicker { color: var(--brand); }
    h2.h2-signal.h2-check { border-left-color: var(--blue); }
    h2.h2-signal.h2-check .h2-kicker { color: var(--blue); }
    h2.h2-signal.h2-takeaways { border-left-color: var(--green); }
    h2.h2-signal.h2-takeaways .h2-kicker { color: var(--green); }
    h2.h2-signal.h2-exam-tests { border-left-color: var(--purple); }
    h2.h2-signal.h2-exam-tests .h2-kicker { color: var(--purple); }

    h3 {
      font-family: var(--font-sans);
      font-size: 0.95rem;
      font-weight: 600;
      color: var(--text);
      margin: 1.5rem 0 0.5rem;
    }

    p {
      margin: 0.75rem 0;
      color: var(--text);
      line-height: 1.7;
    }

    strong { color: var(--text); font-weight: 600; }
    em { color: var(--text-muted); font-style: italic; }

    a {
      color: var(--text);
      text-decoration: underline;
      text-decoration-color: var(--text-light);
      text-underline-offset: 2px;
      transition: text-decoration-color 0.15s;
    }
    a:hover { text-decoration-color: var(--text); }

    hr {
      border: none;
      border-top: 1px solid var(--border);
      margin: 2.5rem 0;
    }

    /* ─── Lists ─── */
    ul, ol {
      margin: 0.6rem 0;
      padding-left: 1.75rem;
    }

    li { margin: 0.35rem 0; }
    li::marker { color: var(--text-light); }

    li input[type="checkbox"] {
      margin-right: 0.5rem;
      accent-color: var(--accent);
      transform: scale(1.1);
    }

    /* ─── Code Blocks ─── */
    pre {
      background: var(--code-bg);
      border: 1px solid var(--border);
      border-radius: 8px;
      padding: 1rem 1.25rem;
      margin: 1rem 0;
      overflow-x: auto;
      font-size: 0.82rem;
      line-height: 1.55;
      position: relative;
    }

    .code-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      background: var(--surface-raised);
      border: 1px solid var(--border);
      border-bottom: none;
      border-radius: 8px 8px 0 0;
      padding: 0.35rem 0.75rem;
      margin-top: 1rem;
    }

    .code-header + pre {
      margin-top: 0;
      border-radius: 0 0 8px 8px;
    }

    .code-lang {
      font-size: 0.68rem;
      color: var(--text-light);
      text-transform: uppercase;
      letter-spacing: 0.05em;
      font-weight: 600;
      font-family: var(--font-sans);
    }

    .copy-btn {
      background: none;
      border: 1px solid var(--border);
      color: var(--text-light);
      padding: 0.15rem 0.45rem;
      border-radius: 4px;
      font-size: 0.68rem;
      cursor: pointer;
      font-family: var(--font-sans);
      transition: all 0.15s;
    }

    .copy-btn:hover {
      background: var(--surface);
      color: var(--text);
      border-color: var(--text-light);
    }

    .copy-btn.copied {
      color: var(--green);
      border-color: var(--green);
    }

    /* ─── Collapsible long code blocks ─── */
    .code-wrap.code-long pre {
      max-height: 28rem;
      overflow-y: hidden;
      position: relative;
    }
    .code-wrap.code-long.code-expanded pre {
      max-height: none;
      overflow-y: visible;
    }
    .code-wrap.code-long pre::after {
      content: "";
      position: absolute;
      left: 0; right: 0; bottom: 0;
      height: 4rem;
      background: linear-gradient(180deg, transparent, var(--code-bg));
      pointer-events: none;
      transition: opacity 0.2s;
    }
    .code-wrap.code-long.code-expanded pre::after { opacity: 0; }
    .code-wrap.code-anti.code-long pre::after { background: linear-gradient(180deg, transparent, #fdf6f3); }
    .code-wrap.code-correct.code-long pre::after { background: linear-gradient(180deg, transparent, #f6f9f2); }
    .code-wrap.code-long .code-expand {
      display: block;
      width: 100%;
      border: 1px solid var(--border);
      border-top: none;
      background: var(--surface);
      color: var(--text-muted);
      padding: 0.45rem;
      font-family: var(--font-sans);
      font-size: 0.78rem;
      cursor: pointer;
      border-radius: 0 0 8px 8px;
      transition: background 0.15s, color 0.15s;
    }
    .code-wrap.code-long .code-expand:hover {
      background: var(--surface-raised);
      color: var(--text);
    }
    .code-wrap.code-long.code-expanded .code-expand::before { content: "Collapse"; }
    .code-wrap.code-long:not(.code-expanded) .code-expand::before { content: attr(data-show-label); }

    /* ─── Anti-pattern / correct-pattern code blocks ─── */
    .code-wrap { margin: 1rem 0; }
    .code-wrap .code-header { margin-top: 0; }
    .code-wrap pre { margin-top: 0; margin-bottom: 0; }

    .code-wrap.code-anti .code-header {
      background: #fceee9;
      border-color: #f0d6cd;
      color: var(--red);
    }
    .code-wrap.code-anti .code-lang { color: var(--red); }
    .code-wrap.code-anti pre {
      border-color: #f0d6cd;
      border-left: 3px solid var(--red);
      background: #fdf6f3;
    }
    .code-wrap.code-anti .code-header::before {
      content: "\u2717";
      color: var(--red);
      font-weight: 700;
      margin-right: 0.4rem;
      font-size: 0.85rem;
      line-height: 1;
    }

    .code-wrap.code-correct .code-header {
      background: #eef3e8;
      border-color: #d7e0cc;
      color: var(--green);
    }
    .code-wrap.code-correct .code-lang { color: var(--green); }
    .code-wrap.code-correct pre {
      border-color: #d7e0cc;
      border-left: 3px solid var(--green);
      background: #f6f9f2;
    }
    .code-wrap.code-correct .code-header::before {
      content: "\u2713";
      color: var(--green);
      font-weight: 700;
      margin-right: 0.4rem;
      font-size: 0.85rem;
      line-height: 1;
    }

    code {
      font-family: var(--font-mono);
      font-size: 0.84em;
    }

    :not(pre) > code {
      background: var(--surface-raised);
      padding: 0.1em 0.35em;
      border-radius: 3px;
      color: var(--text);
      font-size: 0.82em;
    }

    /* ─── Tables ─── */
    .table-wrapper {
      overflow-x: auto;
      margin: 1rem 0;
      border-radius: 8px;
      border: 1px solid var(--border);
    }

    table {
      width: 100%;
      border-collapse: collapse;
      font-size: 0.85rem;
    }

    thead { background: var(--surface-raised); }

    th {
      padding: 0.55rem 0.75rem;
      text-align: left;
      font-weight: 600;
      color: var(--text-muted);
      border-bottom: 1px solid var(--border-medium);
      font-size: 0.72rem;
      text-transform: uppercase;
      letter-spacing: 0.04em;
      font-family: var(--font-sans);
    }

    td {
      padding: 0.5rem 0.75rem;
      border-bottom: 1px solid var(--border);
    }

    tr:last-child td { border-bottom: none; }
    tr:hover td { background: var(--surface-raised); }

    /* ─── Blockquotes ─── */
    blockquote {
      border-left: none;
      background: var(--surface);
      padding: 1rem 1.25rem;
      margin: 1.25rem 0;
      border-radius: 12px;
    }

    blockquote p {
      color: var(--text);
      margin: 0.3rem 0;
      font-size: 0.95rem;
    }

    /* ─── Callout boxes ─── */
    .callout-output {
      background: var(--surface);
      border: none;
      border-left: 3px solid var(--green);
      border-radius: 0 12px 12px 0;
      padding: 1rem 1.25rem;
      margin: 1.25rem 0;
    }

    .callout-exam {
      background: var(--surface);
      border: none;
      border-left: 3px solid var(--blue);
      border-radius: 0 12px 12px 0;
      padding: 1rem 1.25rem;
      margin: 1.25rem 0;
    }

    .callout-warning {
      background: var(--surface);
      border: none;
      border-left: 3px solid var(--red);
      border-radius: 0 12px 12px 0;
      padding: 1rem 1.25rem;
      margin: 1.25rem 0;
    }

    /* ─── Practice Questions ─── */
    .question-block {
      background: var(--surface);
      border: none;
      border-radius: 12px;
      padding: 1.5rem;
      margin: 1.25rem 0;
    }

    .answer-reveal {
      background: var(--surface);
      border-left: 3px solid var(--green);
      padding: 0.75rem 1rem;
      border-radius: 0 8px 8px 0;
      margin-top: 0.75rem;
    }

    /* ─── Interactive Quiz Cards ─── */
    .quiz-card {
      background: var(--surface-white);
      border: 1px solid var(--border);
      border-radius: 12px;
      padding: 1.5rem;
      margin: 1.5rem 0;
    }

    .quiz-card + .quiz-card { margin-top: 1rem; }

    .quiz-stem {
      font-family: var(--font-serif);
      font-size: 1rem;
      line-height: 1.7;
      margin-bottom: 1rem;
      color: var(--text);
    }

    .quiz-stem strong:first-child {
      font-family: var(--font-sans);
      font-size: 0.72rem;
      text-transform: uppercase;
      letter-spacing: 0.04em;
      color: var(--text-muted);
      display: block;
      margin-bottom: 0.35rem;
    }

    .quiz-choices {
      display: flex;
      flex-direction: column;
      gap: 0.5rem;
      margin-bottom: 0.5rem;
    }

    .quiz-choice {
      display: flex;
      align-items: flex-start;
      gap: 0.75rem;
      padding: 0.75rem 1rem;
      background: var(--surface);
      border: 2px solid var(--border);
      border-radius: 8px;
      cursor: pointer;
      font-family: var(--font-serif);
      font-size: 0.95rem;
      line-height: 1.6;
      color: var(--text);
      text-align: left;
      transition: border-color 0.15s, background 0.15s;
    }

    .quiz-choice:hover:not(.correct):not(.incorrect) {
      border-color: var(--text-light);
      background: var(--surface-raised);
    }

    .quiz-choice .quiz-letter {
      font-family: var(--font-sans);
      font-weight: 700;
      font-size: 0.85rem;
      color: var(--text-muted);
      flex-shrink: 0;
      width: 1.5rem;
      padding-top: 0.05rem;
    }

    .quiz-choice.correct {
      border-color: var(--green);
      background: #eef3e8;
      cursor: default;
    }

    .quiz-choice.correct .quiz-letter { color: var(--green); }

    .quiz-choice.incorrect {
      border-color: var(--red);
      background: #fceee9;
      cursor: default;
    }

    .quiz-choice.incorrect .quiz-letter { color: var(--red); }

    .quiz-answered .quiz-choice:not(.correct):not(.incorrect) {
      opacity: 0.5;
      cursor: default;
    }

    .quiz-result {
      font-family: var(--font-sans);
      font-size: 0.85rem;
      font-weight: 600;
      padding: 0.5rem 0.75rem;
      border-radius: 6px;
      margin: 0.75rem 0;
      text-align: center;
    }

    .quiz-result.quiz-correct {
      background: #eef3e8;
      color: var(--green);
    }

    .quiz-result.quiz-incorrect {
      background: #fceee9;
      color: var(--red);
    }

    .quiz-explanation {
      background: var(--surface);
      border-radius: 8px;
      padding: 1rem 1.25rem;
      font-size: 0.9rem;
      line-height: 1.7;
      color: var(--text);
      border-left: 3px solid var(--green);
    }

    .quiz-explanation strong { color: var(--text); }

    .quiz-reset {
      display: inline-flex;
      align-items: center;
      gap: 0.3rem;
      margin-top: 0.85rem;
      padding: 0.4rem 0.85rem;
      background: transparent;
      border: 1px solid var(--border-medium);
      border-radius: 6px;
      font-family: var(--font-sans);
      font-size: 0.78rem;
      color: var(--text-muted);
      cursor: pointer;
      transition: all 0.15s;
    }
    .quiz-reset:hover {
      background: var(--surface);
      color: var(--text);
      border-color: var(--text-light);
    }

    /* ─── Exam Pattern Cards ─── */
    .pattern-card {
      background: var(--surface);
      border: none;
      border-left: 3px solid var(--purple);
      border-radius: 0 12px 12px 0;
      padding: 1rem 1.25rem;
      margin: 0.75rem 0;
    }

    /* ─── Prev/Next Lesson Navigation ─── */
    .lesson-nav {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-top: 3rem;
      padding-top: 1.5rem;
      border-top: 1px solid var(--border);
      gap: 1rem;
    }

    .lesson-nav-btn {
      display: inline-flex;
      align-items: center;
      gap: 0.4rem;
      padding: 0.6rem 1.25rem;
      border-radius: 8px;
      font-family: var(--font-sans);
      font-size: 0.85rem;
      font-weight: 500;
      cursor: pointer;
      transition: all 0.15s;
      text-decoration: none;
      border: none;
    }

    .lesson-nav-prev {
      background: transparent;
      color: var(--text-muted);
      border: 1px solid var(--border);
    }

    .lesson-nav-prev:hover {
      background: var(--surface);
      color: var(--text);
      border-color: var(--border-medium);
    }

    .lesson-nav-next {
      background: var(--accent);
      color: var(--surface-white);
      margin-left: auto;
    }

    .lesson-nav-next:hover {
      background: var(--accent-bright);
    }

    .lesson-nav-label {
      font-size: 0.72rem;
      color: var(--text-light);
      font-family: var(--font-sans);
      display: block;
      margin-bottom: 0.1rem;
    }

    /* ─── Sidebar toggle (all screen sizes) ─── */
    .menu-toggle {
      display: block;
      position: fixed;
      top: 0.75rem;
      z-index: 200;
      background: var(--surface);
      border: 1px solid var(--border-medium);
      color: var(--text-light);
      width: 28px;
      height: 28px;
      padding: 0;
      border-radius: 6px;
      cursor: pointer;
      font-size: 0.85rem;
      line-height: 28px;
      text-align: center;
      transition: left 0.3s ease, color 0.15s;
      left: calc(var(--sidebar-width) - 40px);
    }
    .menu-toggle:hover { color: var(--text); border-color: var(--text-light); }

    /* Icon flips direction with sidebar state */
    .menu-toggle .toggle-icon { display: inline-block; transition: transform 0.3s ease; }
    .sidebar-collapsed .menu-toggle .toggle-icon { transform: rotate(180deg); }

    /* Desktop: sidebar open by default, collapses on toggle */
    .sidebar-collapsed .sidebar { transform: translateX(-100%); }
    .sidebar-collapsed .main { margin-left: 0; }
    .sidebar-collapsed .menu-toggle { left: 0.75rem; }

    @media (max-width: 900px) {
      .sidebar { transform: translateX(-100%); }
      .sidebar.open { transform: translateX(0); box-shadow: 4px 0 20px rgba(0,0,0,0.08); }
      .main { margin-left: 0; }
      .menu-toggle { left: 0.75rem !important; }
      .sidebar.open ~ .menu-toggle { left: calc(var(--sidebar-width) - 40px) !important; }
      .content { padding: 3rem 1rem 6rem; }
      h1:first-child { font-size: 1.7rem; }
      h2.h2-signal { font-size: 1.1rem; }
      pre { font-size: 0.8rem; padding: 0.75rem; }
    }

    /* ─── Scrollbar ─── */
    * {
      scrollbar-width: thin;
      scrollbar-color: #ddd transparent;
    }

    ::-webkit-scrollbar { width: 6px; height: 6px; }
    ::-webkit-scrollbar-track { background: transparent; }
    ::-webkit-scrollbar-thumb { background: #ddd; border-radius: 100vw; }
    ::-webkit-scrollbar-thumb:hover { background: #bbb; }

    .sidebar::-webkit-scrollbar { width: 4px; }
    .sidebar::-webkit-scrollbar-thumb { background: #e0e0e0; }

    pre::-webkit-scrollbar { height: 4px; }
    pre::-webkit-scrollbar-thumb { background: #ddd; }

    /* ─── Back to Top ─── */
    .back-to-top {
      position: fixed;
      bottom: 2rem;
      right: 2rem;
      background: var(--text);
      color: var(--bg);
      width: 36px;
      height: 36px;
      border-radius: 6px;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 1rem;
      opacity: 0;
      transition: opacity 0.3s;
      z-index: 100;
      border: none;
      cursor: pointer;
    }

    .back-to-top.visible { opacity: 1; }
    .back-to-top:hover { background: var(--accent-dim); }

    /* ─── Keyboard shortcut hint ─── */
    .kbd {
      display: inline-block;
      background: var(--surface-raised);
      border: 1px solid var(--border);
      border-radius: 3px;
      padding: 0.1em 0.35em;
      font-size: 0.72em;
      font-family: var(--font-sans);
      color: var(--text-muted);
    }

    /* ─── Search results highlight ─── */
    mark {
      background: rgba(0, 0, 0, 0.06);
      color: var(--text);
      padding: 0.1em 0;
      border-radius: 2px;
    }

    /* ─── Section transitions ─── */
    .content-section {
      animation: sectionIn 0.2s ease;
    }

    @keyframes sectionIn {
      from { opacity: 0; }
      to { opacity: 1; }
    }

    /* ─── Print ─── */
    @media print {
      .sidebar, .menu-toggle, .back-to-top, .copy-btn, .code-header, .search-box, .hero-actions, .skip-link { display: none !important; }
      .main { margin-left: 0; }
      .content-section { display: block !important; }
      body { background: white; color: #1a1a1a; }
      pre { border: 1px solid #ddd; background: #f8f8f8; }
      h1 { color: #1a1a1a; page-break-after: avoid; }
      h2 { page-break-after: avoid; }
      pre, .question-block { page-break-inside: avoid; }
      .badge { color: #666; background: #f0f0f0; }
    }
  </style>
</head>
<body>
  <a href="#content" class="skip-link">Skip to content</a>
  <button class="menu-toggle" id="menuToggle" aria-label="Toggle sidebar"><span class="toggle-icon">\u2039</span></button>

  <aside class="sidebar" id="sidebar" role="navigation" aria-label="Lab navigation">
    <div class="sidebar-header">
      <h2>Claude Certified Architect</h2>
      <p>Foundations \u2014 Study Guide</p>
      <span id="sidebarProgressPill" class="sidebar-progress-pill" style="display:none"><span class="sp-dot"></span><span id="sidebarProgressText">0 of 0</span></span>
    </div>
    <div class="search-box">
      <input type="search" id="searchInput" placeholder="Search... (Ctrl+K)" aria-label="Search labs">
    </div>
    <nav id="nav"><ul id="navList"></ul><div class="nav-empty" id="navEmpty"><strong>No matches</strong>Try a different search term</div></nav>
  </aside>

  <div class="main" role="main">
    <div class="content" id="content">
      ${finalContent}
    </div>
  </div>

  <button class="back-to-top" id="backToTop" aria-label="Back to top">\u2191</button>
  <button class="page-toc-fab" id="pageTocFab" aria-label="Show on-page navigation" aria-expanded="false"><svg width="14" height="14" viewBox="0 0 14 14" aria-hidden="true" focusable="false"><path d="M2 3.5h10M2 7h10M2 10.5h10" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" fill="none"/></svg>On this page</button>
  <div class="page-toc-scrim" id="pageTocScrim" aria-hidden="true"></div>

  <script>
  (function() {
    // ── Build accordion sidebar from H1 headings ──
    const navList = document.getElementById('navList');
    const h1s = document.querySelectorAll('h1');
    const navItems = [];
    const groups = [];
    let currentGroup = null;

    h1s.forEach(h => {
      const text = h.textContent.trim();
      if (!text || text.match(/^[\\u2550\\u2500]+$/)) return;

      if (!h.id) {
        h.id = text.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '').substring(0, 60);
      }

      const isModule = /MODULE|SETUP/i.test(text);
      const isLab = /^LAB\\b/i.test(text);
      const isPracticeExam = /^PRACTICE EXAM/i.test(text);
      const isScenario = /^SCENARIO \\d/i.test(text);
      const isSection = /PRACTICE QUESTIONS|SCENARIO-BASED|EXAM READINESS|EXAM ANSWER|EXAM DAY|SCENARIO WALKTHROUGHS?/i.test(text);
      const isReference = /ANTI-PATTERNS CHEAT SHEET|^FAQ\\b/i.test(text);

      // Skip non-navigable headings except first (Overview) and reference entries (cheat sheet)
      if (!isModule && !isLab && !isPracticeExam && !isScenario && !isSection && !isReference) {
        if (h === h1s[0]) {
          const li = document.createElement('li');
          const a = document.createElement('a');
          a.className = 'nav-lab';
          a.href = '#' + h.id;
          a.textContent = 'Overview';
          a.dataset.search = text.toLowerCase();
          a.style.fontWeight = '600';
          a.style.paddingLeft = '1rem';
          li.appendChild(a);
          navList.appendChild(li);
          navItems.push({ el: li, text: text.toLowerCase(), heading: h, link: a });
        }
        return;
      }

      // Reference entries (cheat sheet, FAQ, etc.): flat top-level links, not groups
      if (isReference) {
        const li = document.createElement('li');
        li.dataset.navRole = 'reference';
        const a = document.createElement('a');
        a.className = 'nav-lab';
        a.href = '#' + h.id;
        let refLabel;
        if (/ANTI-PATTERNS CHEAT SHEET/i.test(text)) refLabel = 'Anti-Patterns Cheat Sheet';
        else if (/^FAQ\\b/i.test(text)) refLabel = 'FAQ';
        else refLabel = text.length > 40 ? text.substring(0, 38) + '\\u2026' : text;
        a.textContent = refLabel;
        a.dataset.search = text.toLowerCase();
        a.style.fontWeight = '600';
        a.style.paddingLeft = '1rem';
        li.appendChild(a);
        navList.appendChild(li);
        navItems.push({ el: li, text: text.toLowerCase(), heading: h, link: a });
        return;
      }

      // Group headers: modules, practice exam, section headings
      if (isModule || isPracticeExam || isSection) {
        const groupEl = document.createElement('li');
        groupEl.className = 'nav-group';

        const header = document.createElement('div');
        header.className = 'nav-group-header' + (isPracticeExam ? ' type-exam' : isSection ? ' type-section' : '');
        header.dataset.search = text.toLowerCase();
        header.setAttribute('role', 'button');
        header.setAttribute('tabindex', '0');
        header.setAttribute('aria-expanded', 'false');

        let label;
        if (isModule) {
          label = text.replace(/^MODULE\\s+\\d+:\\s*/i, function(m) { return m.match(/\\d+/)[0] + '. '; })
                      .replace(/SETUP.*$/i, 'Setup');
          if (label.length > 32) label = label.substring(0, 30) + '...';
        } else if (isPracticeExam) {
          label = 'Practice Exam (60 Qs)';
        } else {
          label = text.length > 32 ? text.substring(0, 30) + '...' : text;
        }

        header.innerHTML = '<span>' + label + '</span><span class="nav-chevron">\\u25B6</span>';
        header.title = text;

        const children = document.createElement('div');
        children.className = 'nav-group-children';

        // Add a link to the group header itself (skip for modules — header click navigates there)
        const headerLink = document.createElement('a');
        headerLink.className = 'nav-lab';
        headerLink.href = '#' + h.id;
        headerLink.dataset.search = text.toLowerCase();
        if (!isModule) {
          headerLink.textContent = label;
          headerLink.style.fontSize = '0.72rem';
          headerLink.style.color = 'var(--text-light)';
          children.appendChild(headerLink);
        }

        groupEl.appendChild(header);
        groupEl.appendChild(children);
        navList.appendChild(groupEl);

        currentGroup = { el: groupEl, header, children, items: [] };
        groups.push(currentGroup);
        navItems.push({ el: groupEl, text: text.toLowerCase(), heading: h, link: headerLink, group: currentGroup });
        return;
      }

      // Child items: labs, scenarios
      if (currentGroup && (isLab || isScenario)) {
        const a = document.createElement('a');
        a.className = 'nav-lab';

        let short;
        if (isLab) {
          short = text.replace(/^LAB\\s+([\\d.]+):\\s*/i, function(m, n) { return n + ' '; })
                      .replace(/^LAB\\s+FINAL:\\s*/i, 'Final: ');
          if (short.length > 36) short = short.substring(0, 34) + '...';
        } else {
          short = text.replace(/^SCENARIO\\s+(\\d+):\\s*/i, function(m, n) { return 'S' + n + ': '; });
          if (short.length > 36) short = short.substring(0, 34) + '...';
        }

        const dot = document.createElement('span');
        dot.className = 'nav-dot';
        a.appendChild(dot);
        const label = document.createElement('span');
        label.textContent = short;
        a.appendChild(label);
        a.href = '#' + h.id;
        a.dataset.search = text.toLowerCase();
        a.title = text;
        currentGroup.children.appendChild(a);
        currentGroup.items.push(a);
        navItems.push({ el: a, text: text.toLowerCase(), heading: h, link: a, group: currentGroup });
      }
    });

    // ── Sidebar section dividers: Course (modules) → Scenarios (walkthroughs) → Reference (cheat sheet, FAQ) → Assessments (practice exam) ──
    (function insertNavDividers() {
      const firstCourseGroup = groups.find(g => /setup|^module|^\\d+\\./i.test(g.header.textContent.trim()));
      const firstScenarioGroup = groups.find(g => /scenario walkthrough/i.test(g.header.textContent.trim()));
      const firstAssessmentGroup = groups.find(g => /practice exam/i.test(g.header.textContent.trim()));
      const firstReferenceItem = navList.querySelector('li[data-nav-role="reference"]');
      function makeDivider(text) {
        const li = document.createElement('li');
        li.className = 'nav-divider';
        li.setAttribute('role', 'presentation');
        li.textContent = text;
        return li;
      }
      if (firstCourseGroup) {
        navList.insertBefore(makeDivider('Course'), firstCourseGroup.el);
      }
      if (firstScenarioGroup) {
        navList.insertBefore(makeDivider('Scenarios'), firstScenarioGroup.el);
      }
      if (firstReferenceItem) {
        navList.insertBefore(makeDivider('Reference'), firstReferenceItem);
      }
      if (firstAssessmentGroup) {
        navList.insertBefore(makeDivider('Assessments'), firstAssessmentGroup.el);
      }
    })();

    // ── Lab completion tracking (localStorage) ──
    const COMPLETION_KEY = 'cca-foundations-completed-labs-v1';
    function loadCompleted() {
      try { return JSON.parse(localStorage.getItem(COMPLETION_KEY) || '{}') || {}; }
      catch (e) { return {}; }
    }
    function saveCompleted(map) {
      try { localStorage.setItem(COMPLETION_KEY, JSON.stringify(map)); } catch (e) {}
    }
    const completed = loadCompleted();

    // Identify lab-type sections (LAB X.Y and SCENARIO N)
    function isLabSection(id) {
      const h1 = document.getElementById(id);
      if (!h1) return false;
      const t = (h1.textContent || '').trim();
      return /^LAB\\s+[\\d.]+/i.test(t) || /^SCENARIO\\s+\\d/i.test(t) || /^LAB\\s+FINAL/i.test(t);
    }
    const totalLabs = Array.from(document.querySelectorAll('h1'))
      .filter(h => {
        const t = (h.textContent || '').trim();
        return /^LAB\\s+[\\d.]+/i.test(t) || /^SCENARIO\\s+\\d/i.test(t) || /^LAB\\s+FINAL/i.test(t);
      }).length;

    function updateCompletionUI() {
      // Sidebar pill
      const count = Object.keys(completed).filter(k => completed[k]).length;
      const pill = document.getElementById('sidebarProgressPill');
      const txt = document.getElementById('sidebarProgressText');
      if (pill && txt && totalLabs > 0) {
        pill.style.display = 'inline-flex';
        txt.textContent = count + ' of ' + totalLabs + ' complete';
        pill.classList.toggle('complete', count === totalLabs && totalLabs > 0);
      }
      // Sidebar nav dots
      navList.querySelectorAll('a.nav-lab').forEach(a => {
        const href = a.getAttribute('href') || '';
        const id = href.replace(/^#/, '');
        if (!id) return;
        a.classList.toggle('completed', !!completed[id]);
      });
    }

    function injectLabCompletionUI(section) {
      const id = section.dataset.sectionId;
      if (!isLabSection(id)) return;
      // Avoid duplicate injection
      if (section.querySelector('.lab-complete-row')) return;
      const row = document.createElement('div');
      row.className = 'lab-complete-row' + (completed[id] ? ' is-complete' : '');
      const labelId = 'lab-complete-' + id;
      row.innerHTML =
        '<label for="' + labelId + '">' +
          '<input type="checkbox" id="' + labelId + '"' + (completed[id] ? ' checked' : '') + '>' +
          '<span class="lab-complete-text">' + (completed[id] ? 'Lab complete' : 'Mark this lab complete') + '</span>' +
        '</label>' +
        '<span class="lab-complete-hint">Saved in your browser</span>';
      const cb = row.querySelector('input[type="checkbox"]');
      const textEl = row.querySelector('.lab-complete-text');
      cb.addEventListener('change', () => {
        completed[id] = cb.checked;
        if (!cb.checked) delete completed[id];
        saveCompleted(completed);
        row.classList.toggle('is-complete', cb.checked);
        textEl.textContent = cb.checked ? 'Lab complete' : 'Mark this lab complete';
        updateCompletionUI();
      });
      // Insert before the .lesson-nav if present, else append
      const lessonNav = section.querySelector('.lesson-nav');
      if (lessonNav) section.insertBefore(row, lessonNav);
      else section.appendChild(row);
    }

    // ── Accordion behavior: clicking an open group collapses it; clicking a closed
    // group expands it and navigates to its first lab (closing other groups). ──
    function toggleGroup(g) {
      const wasOpen = g.header.classList.contains('open');

      if (wasOpen) {
        // User clicked an already-open group — collapse it and stop here.
        g.header.classList.remove('open');
        g.children.classList.remove('open');
        g.header.setAttribute('aria-expanded', 'false');
        return;
      }

      // Close all other groups so only the clicked one is open.
      groups.forEach(other => {
        other.header.classList.remove('open');
        other.children.classList.remove('open');
        other.header.setAttribute('aria-expanded', 'false');
      });
      g.header.classList.add('open');
      g.children.classList.add('open');
      g.header.setAttribute('aria-expanded', 'true');

      // Show this group's content section (use the first link in the group).
      const firstLink = g.children.querySelector('a');
      if (firstLink) {
        const id = firstLink.getAttribute('href').substring(1);
        showSection(id);
        navList.querySelectorAll('a').forEach(a => { a.classList.remove('active'); a.removeAttribute('aria-current'); });
        firstLink.classList.add('active');
        firstLink.setAttribute('aria-current', 'page');
      }
    }
    groups.forEach(g => {
      g.header.addEventListener('click', () => toggleGroup(g));
      g.header.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          toggleGroup(g);
        }
      });
    });

    // ── Search ──
    const searchInput = document.getElementById('searchInput');
    const navEmpty = document.getElementById('navEmpty');
    searchInput.addEventListener('input', () => {
      const q = searchInput.value.toLowerCase().trim();
      if (q) {
        // Open all groups and show/hide items
        let anyGroupVisible = false;
        groups.forEach(g => {
          g.header.classList.add('open');
          g.children.classList.add('open');
          const headerMatch = g.header.dataset.search.includes(q);
          let hasMatch = headerMatch;
          g.children.querySelectorAll('a').forEach(a => {
            const match = a.dataset.search.includes(q) || headerMatch;
            a.style.display = match ? '' : 'none';
            if (match) hasMatch = true;
          });
          g.el.style.display = hasMatch ? '' : 'none';
          if (hasMatch) anyGroupVisible = true;
        });
        // Also check if the standalone Overview link (if present) matches
        navList.querySelectorAll(':scope > li:not(.nav-group):not(.nav-divider) a').forEach(a => {
          if (a.dataset.search && a.dataset.search.includes(q)) anyGroupVisible = true;
        });
        // Hide dividers while searching (they're category labels, not content)
        navList.querySelectorAll('.nav-divider').forEach(d => { d.style.display = 'none'; });
        if (navEmpty) navEmpty.classList.toggle('is-visible', !anyGroupVisible);
      } else {
        // Reset: show all groups, close all
        groups.forEach(g => {
          g.el.style.display = '';
          g.header.classList.remove('open');
          g.children.classList.remove('open');
          g.children.querySelectorAll('a').forEach(a => { a.style.display = ''; });
        });
        navList.querySelectorAll('.nav-divider').forEach(d => { d.style.display = ''; });
        if (navEmpty) navEmpty.classList.remove('is-visible');
      }
    });

    // Ctrl+K shortcut
    document.addEventListener('keydown', e => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault();
        searchInput.focus();
        searchInput.select();
      }
      if (e.key === 'Escape' && document.activeElement === searchInput) {
        searchInput.value = '';
        searchInput.dispatchEvent(new Event('input'));
        searchInput.blur();
      }
    });

    // ── Section-based view: wrap content between H1s into sections ──
    const content = document.getElementById('content');
    const allH1s = Array.from(content.querySelectorAll('h1'));
    const sections = [];

    allH1s.forEach((h1, i) => {
      const section = document.createElement('div');
      section.className = 'content-section';
      section.style.display = 'none';
      section.dataset.sectionId = h1.id;

      // Collect all elements from this H1 to the next H1
      h1.parentNode.insertBefore(section, h1);
      section.appendChild(h1);

      let next = section.nextSibling;
      while (next) {
        const following = next.nextSibling;
        if (next.tagName === 'H1') break;
        // Also stop if we hit another content-section wrapper
        if (next.classList && next.classList.contains('content-section')) break;
        section.appendChild(next);
        next = following;
      }

      sections.push(section);
    });

    // ── Module-intro task-statement tab strip ──
    // For each MODULE section, find its sibling LAB X.Y sections and inject a pill-group.
    (function injectModuleTabs() {
      sections.forEach(moduleSection => {
        const h1 = moduleSection.querySelector('h1');
        if (!h1) return;
        const moduleMatch = (h1.textContent || '').trim().match(/^MODULE\\s+(\\d+)\\b/i);
        if (!moduleMatch) return;
        const moduleNum = moduleMatch[1];

        // Find every section whose H1 starts with "LAB X.Y" for this module number
        const labPattern = new RegExp('^LAB\\\\s+' + moduleNum + '\\\\.(\\\\d+)\\\\b[:]?\\\\s*(.*)', 'i');
        const labs = sections.map(s => {
          const lh = s.querySelector('h1');
          if (!lh) return null;
          const m = (lh.textContent || '').trim().match(labPattern);
          if (!m) return null;
          return { section: s, id: s.dataset.sectionId, num: moduleNum + '.' + m[1], label: m[2].trim() };
        }).filter(Boolean);

        if (labs.length < 2) return; // nothing to tab

        const nav = document.createElement('nav');
        nav.className = 'module-tabs';
        nav.setAttribute('aria-label', 'Labs in this module');
        labs.forEach(lab => {
          const a = document.createElement('a');
          a.className = 'mod-tab';
          a.href = '#' + lab.id;
          // Truncate long labels for compact pill display
          const short = lab.label.length > 34 ? lab.label.substring(0, 32).replace(/\\s+\\S*$/, '') + '\\u2026' : lab.label;
          a.innerHTML = '<span class="mod-tab-num">' + lab.num + '</span>' + short.replace(/&/g, '&amp;').replace(/</g, '&lt;');
          a.title = 'LAB ' + lab.num + ': ' + lab.label;
          // Route through section router so the target section becomes visible
          a.addEventListener('click', (e) => {
            e.preventDefault();
            showSection(lab.id);
            activateNavLink(lab.id);
          });
          nav.appendChild(a);
        });

        // Insert after the first lab-meta badges if present, else after the H1
        const anchor = moduleSection.querySelector('.lab-meta');
        if (anchor && anchor.parentNode === moduleSection) {
          // Skip over any consecutive lab-meta siblings (multiple metadata rows)
          let last = anchor;
          while (last.nextElementSibling && last.nextElementSibling.classList && last.nextElementSibling.classList.contains('lab-meta')) {
            last = last.nextElementSibling;
          }
          last.parentNode.insertBefore(nav, last.nextSibling);
        } else {
          h1.parentNode.insertBefore(nav, h1.nextSibling);
        }
      });
    })();

    // Show initial section: honor URL hash if it points to a known section, else first section
    const initialHash = (location.hash || '').replace(/^#/, '');
    const initialSection = sections.find(s => s.dataset.sectionId === initialHash) || sections[0];
    if (initialSection) {
      sections.forEach(s => { s.style.display = 'none'; });
      initialSection.style.display = '';
      if (initialHash && initialHash === initialSection.dataset.sectionId) {
        history.replaceState({ sectionId: initialHash }, '', '#' + initialHash);
        // Run full showSection logic (nav bar + TOC + completion) by calling it once — replace avoids pushState
        setTimeout(() => showSection(initialHash, { replace: true }), 0);
      }
    }

    // Initialise completion UI (sidebar pill + dots) and inject into initial section if it's a lab
    updateCompletionUI();
    if (initialSection) injectLabCompletionUI(initialSection);

    // Sync sidebar active state for initial section
    if (initialSection) activateNavLink(initialSection.dataset.sectionId);

    // Build TOC for initial section (after a tick so DOM settles)
    setTimeout(() => { if (initialSection) buildPageToc(initialSection); }, 0);

    // Respond to browser back/forward
    window.addEventListener('popstate', (e) => {
      const hash = (location.hash || '').replace(/^#/, '');
      const target = sections.find(s => s.dataset.sectionId === hash) || sections[0];
      if (!target) return;
      showSection(target.dataset.sectionId, { fromPopstate: true });
      activateNavLink(target.dataset.sectionId);
    });

    const allNavLinks = Array.from(navList.querySelectorAll('a[href^="#"]'));

    // Build ordered list of section IDs for prev/next
    const sectionOrder = sections.map(s => s.dataset.sectionId);

    // Update sidebar active state and expand the target group
    function activateNavLink(sectionId) {
      navList.querySelectorAll('a').forEach(a => { a.classList.remove('active'); a.removeAttribute('aria-current'); });
      const link = navList.querySelector('a[href="#' + CSS.escape(sectionId) + '"]');
      if (link) {
        link.classList.add('active');
        link.setAttribute('aria-current', 'page');
        const pg = link.closest('.nav-group');
        if (pg) {
          groups.forEach(g => {
            g.header.classList.remove('open');
            g.children.classList.remove('open');
            g.header.setAttribute('aria-expanded', 'false');
          });
          const ph = pg.querySelector('.nav-group-header');
          ph.classList.add('open');
          pg.querySelector('.nav-group-children').classList.add('open');
          ph.setAttribute('aria-expanded', 'true');
        }
      }
      if (window.innerWidth <= 900) {
        document.getElementById('sidebar').classList.remove('open');
      }
    }

    // Function to show a specific section
    function showSection(sectionId, opts) {
      opts = opts || {};
      sections.forEach(s => { s.style.display = 'none'; });
      const target = sections.find(s => s.dataset.sectionId === sectionId);
      if (target) {
        target.style.display = '';
        window.scrollTo({ top: 0, behavior: 'instant' });

        // Sync URL hash without triggering native hash-scroll
        if (!opts.fromPopstate) {
          const newHash = '#' + sectionId;
          if (location.hash !== newHash) {
            if (opts.replace) history.replaceState({ sectionId }, '', newHash);
            else history.pushState({ sectionId }, '', newHash);
          }
        }

        // Remove old nav bar
        const oldNav = target.querySelector('.lesson-nav');
        if (oldNav) oldNav.remove();

        // Add prev/next navigation
        const idx = sectionOrder.indexOf(sectionId);
        const nav = document.createElement('div');
        nav.className = 'lesson-nav';

        if (idx > 0) {
          const prevId = sectionOrder[idx - 1];
          const prevSection = sections[idx - 1];
          const prevTitle = prevSection.querySelector('h1') ? prevSection.querySelector('h1').textContent.trim() : 'Previous';
          const prevShort = prevTitle.length > 30 ? prevTitle.substring(0, 28) + '...' : prevTitle;
          const prevBtn = document.createElement('button');
          prevBtn.className = 'lesson-nav-btn lesson-nav-prev';
          prevBtn.innerHTML = '\\u2190 ' + prevShort;
          prevBtn.addEventListener('click', () => {
            showSection(prevId);
            activateNavLink(prevId);
          });
          nav.appendChild(prevBtn);
        } else {
          nav.appendChild(document.createElement('div'));
        }

        if (idx < sectionOrder.length - 1) {
          const nextId = sectionOrder[idx + 1];
          const nextSection = sections[idx + 1];
          const nextTitle = nextSection.querySelector('h1') ? nextSection.querySelector('h1').textContent.trim() : 'Next';
          const nextShort = nextTitle.length > 30 ? nextTitle.substring(0, 28) + '...' : nextTitle;
          const nextBtn = document.createElement('button');
          nextBtn.className = 'lesson-nav-btn lesson-nav-next';
          nextBtn.innerHTML = nextShort + ' \\u2192';
          nextBtn.addEventListener('click', () => {
            showSection(nextId);
            activateNavLink(nextId);
          });
          nav.appendChild(nextBtn);
        }

        target.appendChild(nav);
        injectLabCompletionUI(target);
        buildPageToc(target);
      }
    }

    // ── On-this-page TOC (right-rail on wide screens, bottom-sheet drawer on narrow) ──
    const pageTocFab = document.getElementById('pageTocFab');
    const pageTocScrim = document.getElementById('pageTocScrim');
    let pageTocEl = null;
    let tocObserver = null;

    function closePageToc() {
      if (!pageTocEl) return;
      pageTocEl.classList.remove('open');
      pageTocScrim.classList.remove('open');
      pageTocScrim.setAttribute('aria-hidden', 'true');
      if (pageTocFab) pageTocFab.setAttribute('aria-expanded', 'false');
    }
    function openPageToc() {
      if (!pageTocEl) return;
      pageTocEl.classList.add('open');
      pageTocScrim.classList.add('open');
      pageTocScrim.setAttribute('aria-hidden', 'false');
      if (pageTocFab) pageTocFab.setAttribute('aria-expanded', 'true');
    }
    if (pageTocFab) {
      pageTocFab.addEventListener('click', () => {
        if (pageTocEl && pageTocEl.classList.contains('open')) closePageToc();
        else openPageToc();
      });
    }
    if (pageTocScrim) pageTocScrim.addEventListener('click', closePageToc);
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && pageTocEl && pageTocEl.classList.contains('open')) closePageToc();
    });

    function buildPageToc(section) {
      if (pageTocEl) { pageTocEl.remove(); pageTocEl = null; }
      if (tocObserver) { tocObserver.disconnect(); tocObserver = null; }
      if (pageTocFab) pageTocFab.classList.remove('available');
      closePageToc();

      const h2s = Array.from(section.querySelectorAll('h2'));
      if (h2s.length < 2) return; // not worth showing for short sections

      const toc = document.createElement('aside');
      toc.className = 'page-toc';
      toc.setAttribute('aria-label', 'On this page');
      toc.innerHTML =
        '<div class="page-toc-handle" aria-hidden="true"></div>' +
        '<button type="button" class="page-toc-close" aria-label="Close on-page navigation"><svg width="16" height="16" viewBox="0 0 16 16" aria-hidden="true" focusable="false"><path d="M3.5 3.5l9 9M12.5 3.5l-9 9" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" fill="none"/></svg></button>' +
        '<div class="page-toc-label">On this page</div>' +
        '<ul class="page-toc-list" id="pageTocList"></ul>';
      document.body.appendChild(toc);
      pageTocEl = toc;

      toc.querySelector('.page-toc-close').addEventListener('click', closePageToc);

      const list = toc.querySelector('#pageTocList');
      const tocLinks = [];
      h2s.forEach(h2 => {
        if (!h2.id) {
          h2.id = 'toc-' + (h2.textContent || '').toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '').substring(0, 60) + '-' + Math.random().toString(36).slice(2, 6);
        }
        // Use clean label (exclude kicker span)
        const kicker = h2.querySelector('.h2-kicker');
        const label = (kicker ? (h2.textContent.replace(kicker.textContent, '')) : h2.textContent).trim();
        const li = document.createElement('li');
        const a = document.createElement('a');
        a.href = '#' + h2.id;
        a.textContent = label;
        a.addEventListener('click', (e) => {
          e.preventDefault();
          const el = document.getElementById(h2.id);
          if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
          // On mobile, close drawer after selection
          if (window.innerWidth < 1200) closePageToc();
        });
        li.appendChild(a);
        list.appendChild(li);
        tocLinks.push({ a, h2 });
      });

      // Make FAB available now that we have a TOC to show
      if (pageTocFab) pageTocFab.classList.add('available');

      // Scroll-spy: observe which H2 is in view
      if ('IntersectionObserver' in window) {
        tocObserver = new IntersectionObserver((entries) => {
          entries.forEach(entry => {
            const match = tocLinks.find(l => l.h2 === entry.target);
            if (!match) return;
            if (entry.isIntersecting) {
              tocLinks.forEach(l => l.a.classList.remove('active'));
              match.a.classList.add('active');
            }
          });
        }, { rootMargin: '-10% 0px -70% 0px', threshold: 0 });
        h2s.forEach(h => tocObserver.observe(h));
      }
    }

    // Wire up ALL nav links to show their section
    allNavLinks.forEach(link => {
      link.addEventListener('click', (e) => {
        e.preventDefault();
        const id = link.getAttribute('href').substring(1);
        showSection(id);

        // Update active state + aria-current
        navList.querySelectorAll('a').forEach(a => { a.classList.remove('active'); a.removeAttribute('aria-current'); });
        link.classList.add('active');
        link.setAttribute('aria-current', 'page');

        // Close sidebar on mobile
        if (window.innerWidth <= 900) {
          document.getElementById('sidebar').classList.remove('open');
        }
      });
    });

    // ── Code block enhancements ──
    document.querySelectorAll('pre code').forEach(block => {
      const pre = block.parentElement;
      const langClass = Array.from(block.classList).find(c => c.startsWith('language-'));
      const lang = langClass ? langClass.replace('language-', '') : '';

      // Detect anti-pattern vs correct-pattern from first code comment line
      // Source uses '# \\u2717 ANTI-PATTERN:' and '# \\u2713 CORRECT:' markers
      const rawText = block.textContent || '';
      const firstLine = rawText.split(/\\r?\\n/, 1)[0] || '';
      let variant = '';
      let headerLabel = lang || 'code';
      if (/ANTI-?PATTERN|\\u2717/i.test(firstLine) && /^\\s*(#|\\/\\/|--)/.test(firstLine)) {
        variant = 'code-anti';
        headerLabel = 'Anti-pattern';
      } else if (/\\bCORRECT\\b|\\u2713/.test(firstLine) && /^\\s*(#|\\/\\/|--)/.test(firstLine)) {
        variant = 'code-correct';
        headerLabel = 'Correct pattern';
      }

      // Create header with language/variant label + copy button
      const header = document.createElement('div');
      header.className = 'code-header';
      header.innerHTML = '<span class="code-lang">' + headerLabel + '</span>' +
        '<button class="copy-btn" aria-label="Copy code">Copy</button>';

      // Wrap header + pre in a container so variant styling and left border stay aligned
      const wrap = document.createElement('div');
      wrap.className = 'code-wrap' + (variant ? ' ' + variant : '');
      pre.parentNode.insertBefore(wrap, pre);
      wrap.appendChild(header);
      wrap.appendChild(pre);

      // Copy functionality
      header.querySelector('.copy-btn').addEventListener('click', function() {
        navigator.clipboard.writeText(block.textContent).then(() => {
          this.textContent = 'Copied!';
          this.classList.add('copied');
          setTimeout(() => { this.textContent = 'Copy'; this.classList.remove('copied'); }, 2000);
        });
      });

      // Collapse long code blocks (>40 lines) behind an expand button
      const lineCount = (rawText.match(/\\n/g) || []).length + 1;
      if (lineCount > 40) {
        wrap.classList.add('code-long');
        const btn = document.createElement('button');
        btn.className = 'code-expand';
        btn.type = 'button';
        btn.setAttribute('data-show-label', 'Show all ' + lineCount + ' lines');
        btn.setAttribute('aria-expanded', 'false');
        btn.addEventListener('click', () => {
          const expanded = wrap.classList.toggle('code-expanded');
          btn.setAttribute('aria-expanded', expanded ? 'true' : 'false');
        });
        wrap.appendChild(btn);
      }
    });

    // ── Wrap tables ──
    document.querySelectorAll('table').forEach(table => {
      if (!table.parentElement.classList.contains('table-wrapper')) {
        const wrapper = document.createElement('div');
        wrapper.className = 'table-wrapper';
        table.parentNode.insertBefore(wrapper, table);
        wrapper.appendChild(table);
      }
    });

    // ── Promote high-signal H2s (exam tips / check understanding / takeaways / exam tests) ──
    const h2SignalMap = [
      { re: /^exam\\s+tips?$/i, cls: 'h2-exam-tips', kicker: 'Exam' },
      { re: /^check\\s+your\\s+understanding$/i, cls: 'h2-check', kicker: 'Practice' },
      { re: /^key\\s+takeaways?$/i, cls: 'h2-takeaways', kicker: 'Summary' },
      { re: /^what\\s+the\\s+exam\\s+tests$/i, cls: 'h2-exam-tests', kicker: 'Exam focus' }
    ];
    document.querySelectorAll('h2').forEach(h2 => {
      const txt = (h2.textContent || '').trim();
      const match = h2SignalMap.find(m => m.re.test(txt));
      if (!match) return;
      h2.classList.add('h2-signal', match.cls);
      const kicker = document.createElement('span');
      kicker.className = 'h2-kicker';
      kicker.textContent = match.kicker;
      h2.insertBefore(kicker, h2.firstChild);
    });

    // ── Auto-detect callout paragraphs ──
    document.querySelectorAll('p').forEach(p => {
      const text = p.textContent;
      if (p.querySelector('strong') && p.querySelector('strong').textContent.startsWith('What you should see')) {
        p.classList.add('callout-output');
      } else if (p.querySelector('strong') && /^(Key exam|Exam concept|The lesson:)/i.test(p.querySelector('strong').textContent)) {
        p.classList.add('callout-exam');
      } else if (p.querySelector('strong') && /^(Warning|ANTI-PATTERN|Break It)/i.test(p.querySelector('strong').textContent)) {
        p.classList.add('callout-warning');
      }
    });

    // ── Auto-style answer reveal paragraphs ──
    document.querySelectorAll('p').forEach(p => {
      const strong = p.querySelector('strong');
      if (strong && /^Correct:/.test(strong.textContent)) {
        p.classList.add('answer-reveal');
      }
    });

    // ── Interactive Quiz Questions ──
    document.querySelectorAll('h2').forEach(h2 => {
      if (!/check your understanding/i.test(h2.textContent)) return;

      // Collect elements between this h2 and the next h2
      const elements = [];
      let el = h2.nextElementSibling;
      while (el && el.tagName !== 'H2') {
        elements.push(el);
        el = el.nextElementSibling;
      }

      // Group into questions: stem (Q1.), choices (A-D in one <p>), answer (Correct:)
      const questions = [];
      let curQ = null;

      elements.forEach(el => {
        if (el.tagName === 'HR') return;
        const s = el.querySelector && el.querySelector('strong');

        if (s && /^Q\\d+\\./.test(s.textContent)) {
          // New question stem
          curQ = { stem: el, choiceEl: null, answer: null, all: [el] };
          questions.push(curQ);
        } else if (curQ && el.classList && el.classList.contains('answer-reveal')) {
          curQ.answer = el;
          curQ.all.push(el);
        } else if (curQ && !curQ.choiceEl && el.tagName === 'P' && /^A\\)/.test(el.textContent.trim())) {
          // The paragraph containing all choices A) ... B) ... C) ... D) ...
          curQ.choiceEl = el;
          curQ.all.push(el);
        }
      });

      questions.forEach(q => {
        if (!q.choiceEl) return;

        // Parse correct letter from answer
        const ansHTML = q.answer ? q.answer.innerHTML : '';
        const cm = ansHTML.match(/Correct:\\s*([A-D])/);
        const correct = cm ? cm[1] : '';

        // Split the single choice <p> into individual A/B/C/D choices
        // The innerHTML has choices separated by newlines: "A) text\\nB) text\\n..."
        const choiceHTML = q.choiceEl.innerHTML;
        const choiceParts = choiceHTML.split(/\\n(?=[A-D]\\))/);

        // Build card
        const card = document.createElement('div');
        card.className = 'quiz-card';

        // Stem
        const stem = document.createElement('div');
        stem.className = 'quiz-stem';
        stem.innerHTML = q.stem.innerHTML;
        card.appendChild(stem);

        // Choices
        const choiceBox = document.createElement('div');
        choiceBox.className = 'quiz-choices';

        choiceParts.forEach(part => {
          const trimmed = part.trim();
          if (!trimmed) return;
          const letterMatch = trimmed.match(/^([A-D])\\)/);
          if (!letterMatch) return;
          const letter = letterMatch[1];
          const text = trimmed.replace(/^[A-D]\\)\\s*/, '');

          const btn = document.createElement('button');
          btn.className = 'quiz-choice';
          btn.dataset.letter = letter;
          btn.innerHTML = '<span class="quiz-letter">' + letter + '</span><span>' + text + '</span>';

          btn.addEventListener('click', () => {
            if (card.classList.contains('quiz-answered')) return;
            card.classList.add('quiz-answered');

            const isRight = letter === correct;
            btn.classList.add(isRight ? 'correct' : 'incorrect');

            // Always highlight the correct choice
            choiceBox.querySelectorAll('.quiz-choice').forEach(c => {
              if (c.dataset.letter === correct) c.classList.add('correct');
            });

            // Show result banner
            const res = card.querySelector('.quiz-result');
            res.style.display = 'block';
            res.textContent = isRight ? 'Correct!' : 'Incorrect';
            res.className = 'quiz-result ' + (isRight ? 'quiz-correct' : 'quiz-incorrect');

            // Show explanation
            card.querySelector('.quiz-explanation').style.display = 'block';

            // Show reset affordance
            const resetBtn = card.querySelector('.quiz-reset');
            if (resetBtn) resetBtn.style.display = '';
          });

          choiceBox.appendChild(btn);
        });
        card.appendChild(choiceBox);

        // Result banner (hidden)
        const res = document.createElement('div');
        res.className = 'quiz-result';
        res.style.display = 'none';
        card.appendChild(res);

        // Explanation (hidden)
        const expl = document.createElement('div');
        expl.className = 'quiz-explanation';
        expl.style.display = 'none';
        if (q.answer) expl.innerHTML = q.answer.innerHTML;
        card.appendChild(expl);

        // Reset button (hidden until answered)
        const resetBtn = document.createElement('button');
        resetBtn.type = 'button';
        resetBtn.className = 'quiz-reset';
        resetBtn.textContent = '\\u21bb Try again';
        resetBtn.style.display = 'none';
        resetBtn.addEventListener('click', () => {
          card.classList.remove('quiz-answered');
          choiceBox.querySelectorAll('.quiz-choice').forEach(c => {
            c.classList.remove('correct', 'incorrect');
          });
          res.style.display = 'none';
          res.className = 'quiz-result';
          res.textContent = '';
          expl.style.display = 'none';
          resetBtn.style.display = 'none';
        });
        card.appendChild(resetBtn);

        // Replace originals
        q.stem.parentNode.insertBefore(card, q.stem);
        q.all.forEach(e => e.remove());
      });

      // Remove leftover hr separators between questions
      elements.forEach(el => {
        if (el.tagName === 'HR' && el.parentNode) el.remove();
      });
    });

    // ── Back to top + TOC FAB on scroll ──
    window.addEventListener('scroll', () => {
      const scrolled = window.scrollY > 600;
      document.getElementById('backToTop').classList.toggle('visible', scrolled);
      if (pageTocFab) pageTocFab.classList.toggle('visible', scrolled);
    }, { passive: true });

    document.getElementById('backToTop').addEventListener('click', () => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });

    // ── Sidebar toggle ──
    document.getElementById('menuToggle').addEventListener('click', () => {
      if (window.innerWidth <= 900) {
        document.getElementById('sidebar').classList.toggle('open');
      } else {
        document.body.classList.toggle('sidebar-collapsed');
      }
    });

    // Close on outside click (mobile)
    document.querySelector('.main').addEventListener('click', () => {
      if (window.innerWidth <= 900) {
        document.getElementById('sidebar').classList.remove('open');
      }
    });
  })();
  </script>
</body>
</html>`;

fs.writeFileSync('./lab-guide.html', html, 'utf-8');
console.log('Built lab-guide.html (' + (html.length / 1024).toFixed(0) + ' KB)');
