// [category, question, options, correct index, explanation]
const BANK=[
["HTML","Which HTML tag is used for the largest heading?",["<h1>","<head>","<heading>","<h6>"],0,"Headings run from <h1> (largest) to <h6> (smallest)."],
["HTML","Which attribute makes an image accessible to screen readers?",["title","src","alt","name"],2,"The alt attribute describes the image and is also shown if it fails to load."],
["HTML","Which HTML5 element holds the main navigation links?",["<nav>","<menu-bar>","<links>","<header-nav>"],0,"<nav> is the semantic element for major navigation blocks."],
["HTML","Which HTML5 element represents independent, self-contained content such as a blog post?",["<div>","<article>","<aside>","<span>"],1,"<article> is meant for content that makes sense on its own."],
["HTML","Which attribute makes a form input mandatory?",["needed","validate","required","must"],2,"required stops the form from submitting until the field is filled."],
["HTML","What is the correct doctype declaration for HTML5?",["<!DOCTYPE html>","<!DOCTYPE HTML5>","<html5>","<!HTML version=5>"],0,"HTML5 uses the short <!DOCTYPE html>."],

["CSS","Which CSS property changes the text color?",["font-color","color","text-color","fg"],1,"color sets the foreground (text) color."],
["CSS","What does CSS stand for?",["Creative Style Sheets","Cascading Style Sheets","Computer Style Sheets","Colorful Style Sheets"],1,"Cascading refers to how rules combine and override each other."],
["CSS","Which CSS layout module is built for one-dimensional layouts?",["Grid","Float","Flexbox","Table"],2,"Flexbox lays items out along one axis (row or column); Grid handles two."],
["CSS","Which CSS feature applies styles at specific screen widths?",["@import","@keyframes","@media","@font-face"],2,"@media queries are the base of responsive design."],
["CSS","Which property controls the space inside an element's border?",["margin","padding","gap","spacing"],1,"padding is inside the border; margin is outside."],
["CSS","Which unit is relative to the viewport width?",["px","em","vw","pt"],2,"1vw equals 1% of the viewport width."],

["JavaScript","Which keyword declares a block-scoped variable?",["var","int","let","dim"],2,"let (and const) are block-scoped; var is function-scoped."],
["JavaScript","Which method adds an element to the end of an array?",["push()","pop()","shift()","append()"],0,"push() appends; pop() removes the last item."],
["JavaScript","What does the === operator check?",["Value only","Type only","Value and type","Reference only"],2,"Strict equality compares both value and type, with no coercion."],
["JavaScript","Which method selects an element by its id?",["getElementByClass()","querySelectorAll()","getElementById()","findId()"],2,"document.getElementById('x') returns the element with that id."],
["JavaScript","Which method converts a JSON string into a JavaScript object?",["JSON.stringify()","JSON.parse()","JSON.object()","JSON.decode()"],1,"JSON.parse() reads JSON text; JSON.stringify() does the reverse."],
["JavaScript","What does typeof null return?",["null","undefined","object","number"],2,"A famous legacy quirk: typeof null is \"object\"."],
];

const $=id=>document.getElementById(id),TIME=20,TOTAL=5;
let qs,i,score,log,tm,secs,locked,used,player,cat="HTML";

const shuffle=a=>{a=[...a];
  for(let k=a.length-1;
    k>0;k--){const j=Math.floor(Math.random()*(k+1));[a[k],a[j]]=[a[j],a[k]]}return a};

const show=id=>["start","quiz","result"].forEach(s=>$(s).classList.toggle("d-none",s!==id));

const esc=s=>String(s).replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;");

const best=()=>{try{return +localStorage.getItem("best")||0}catch(e){return 0}};
function showBest(){$("best").textContent=best()?`Best score: ${best()}/${TOTAL}`:""}

$("cats").onclick=e=>{
  const b=e.target.closest(".pill");if(!b)return;
  
  cat=b.dataset.cat;
  [...$("cats").children].forEach(p=>p.classList.toggle("on",p===b));
};

function start(){
  player=$("name").value.trim()||"Student";
  const pool=BANK.filter(b=>b[0]===cat);
  qs=shuffle(pool).slice(0,TOTAL).map(([c,q,o,a,e])=>({q,e,o:shuffle(o.map((t,n)=>({t,c:n===a})))}));
  i=0;score=0;log=[];used=false;
  $("fifty").disabled=false;
  show("quiz");load();
}
function bar(el,done){
  el.innerHTML=qs.map((_,n)=>`<i class="${done[n]||(n===i&&el.id==="seg"?"now":"")}"></i>`).join("");
}
function load(){
  locked=false;const q=qs[i];
  bar($("seg"),log.map(l=>l.s));
  $("count").textContent=`Question ${i+1}/${TOTAL}`;
  $("live").textContent=`Score: ${score}`;
  $("q").textContent=q.q;
  $("opts").innerHTML="";
  q.o.forEach((o,n)=>{
    const b=document.createElement("button");
    b.className="opt";
    const k=document.createElement("span");k.className="k";k.textContent=n+1;
    b.append(k,document.createTextNode(o.t));
    b.onclick=()=>pick(n);
    $("opts").append(b);
  });
  $("fb").className="fb d-none";
  $("next").classList.add("d-none");
  secs=TIME;tick(true);clearInterval(tm);
  tm=setInterval(()=>{secs--;tick();if(secs<=0)pick(-1)},1000);
}
function tick(reset){
  $("left").textContent=`${secs}s`;
  const t=$("timer");t.classList.toggle("low",secs<=5);
  const b=t.firstElementChild;
  if(reset){b.style.transition="none";b.style.width="100%";b.offsetWidth;b.style.transition=""}
  b.style.width=(secs/TIME*100)+"%";
}
function fifty(){
  if(locked||used)return;
  used=true;$("fifty").disabled=true;
  const q=qs[i];
  shuffle(q.o.map((o,k)=>k).filter(k=>!q.o[k].c)).slice(0,2).forEach(k=>{
    const b=$("opts").children[k];b.disabled=true;b.classList.add("gone");
  });
}
function pick(n){
  if(locked)return;locked=true;clearInterval(tm);
  const q=qs[i],btns=[...$("opts").children];
  btns.forEach((b,k)=>{b.disabled=true;if(q.o[k].c)b.classList.add("ok")});
  let s="late",head="Time's up!";
  if(n>=0){
    if(q.o[n].c){score++;s="ok";head="Correct!"}
    else{s="bad";head="Wrong.";btns[n].classList.add("bad")}
  }
  log.push({q:q.q,mine:n>=0?q.o[n].t:"No answer (time out)",right:q.o.find(o=>o.c).t,s,time:n>=0?TIME-secs:TIME,e:q.e});
  bar($("seg"),log.map(l=>l.s));
  $("live").textContent=`Score: ${score}`;
  $("fb").className=`fb ${s}`;
  $("fb").innerHTML=`<strong>${head}</strong> ${esc(q.e)}`;
  $("fifty").disabled=true;
  $("next").textContent=i===TOTAL-1?"See results":"Next";
  $("next").classList.remove("d-none");
}
function grade(){
  const p=score/TOTAL;
  return p===1?"Excellent":p>=.8?"Great":p>=.6?"Good":p>=.4?"Fair":"Needs practice";
}
function finish(){
  show("result");
  const old=best();
  if(score>old){try{localStorage.setItem("best",score)}catch(e){}}
  $("sc").textContent=`${score}/${TOTAL}`;
  $("grade").textContent=grade();
  $("msg").textContent=`${player}, ${score>old&&old?"new best score!":"best so far: "+Math.max(old,score)+"/"+TOTAL}`;
  bar($("seg2"),log.map(l=>l.s));
  $("rev").innerHTML=log.map((l,n)=>`<div class="rev ${l.s}"><strong>${n+1}. ${esc(l.q)}</strong><br>Your answer: ${esc(l.mine)} (${l.time}s)${l.s==="ok"?"":`<br>Correct answer: ${esc(l.right)}`}</div>`).join("");
}
function makePdf(){
  const d=new jspdf.jsPDF(),W=180;let y=20;
  d.setFontSize(18);d.text("Web Tech Quiz Results",15,y);y+=10;
  d.setFontSize(12);
  d.text(`Name: ${player}`,15,y);y+=7;
  d.text(`Score: ${score}/${TOTAL} (${grade()})`,15,y);y+=7;
  d.text(`Date: ${new Date().toLocaleDateString()}`,15,y);y+=12;
  d.setFontSize(11);
  log.forEach((l,n)=>{
    const t=d.splitTextToSize(`${n+1}. ${l.q}`,W);
    const m=d.splitTextToSize(`Your answer: ${l.mine} (${l.time}s)`,W);
    const r=d.splitTextToSize(`Correct answer: ${l.right}`,W);
    if(y+(t.length+m.length+r.length)*6+8>280){d.addPage();y=20}
    d.setFont(undefined,"bold");d.text(t,15,y);y+=t.length*6;
    d.setFont(undefined,"normal");d.text(m,15,y);y+=m.length*6;d.text(r,15,y);y+=r.length*6+6;
  });
  d.save("quiz-results.pdf");
}

$("go").onclick=start;
$("again").onclick=()=>{show("start");showBest()};
$("next").onclick=()=>{i++;i<TOTAL?load():finish()};
$("fifty").onclick=fifty;
$("pdf").onclick=makePdf;
$("theme").onclick=()=>{
  const h=document.documentElement,dark=h.dataset.bsTheme!=="dark";
  h.dataset.bsTheme=dark?"dark":"light";
  $("theme").textContent=dark?"Light mode":"Dark mode";
  try{localStorage.setItem("theme",h.dataset.bsTheme)}catch(e){}
};
document.addEventListener("keydown",e=>{
  if($("quiz").classList.contains("d-none"))return;
  if(/^[1-4]$/.test(e.key)&&!locked){
    const b=$("opts").children[e.key-1];
    if(b&&!b.disabled)pick(e.key-1);
  }else if(e.key==="Enter"&&locked&&!$("next").classList.contains("d-none")){
    e.preventDefault();$("next").click();
  }
});
try{if(localStorage.getItem("theme")==="dark")$("theme").click()}catch(e){}
showBest();
