import { useState, useRef, useEffect } from "react";

/* ─── STYLES ─── */
const CSS = `
@import url('https://fonts.googleapis.com/css2?family=Cinzel:wght@400;600;700&family=Lora:ital,wght@0,400;0,600;1,400;1,600&family=Share+Tech+Mono&display=swap');

*{box-sizing:border-box;margin:0;padding:0;}
:root{
  --bg:#06080a;--panel:#0b0f14;
  --border:#161e16;--border2:#1e2a1e;
  --gold:#c9a84c;--gold2:#8a6d2a;--gold3:#3a2d10;
  --text:#a8b8a4;--dim:#3a4a38;--bright:#d0e0cc;
  --hp1:#8a1818;--hp2:#d94040;
  --mp1:#162060;--mp2:#3a7ad9;
  --xp1:#1a5a1a;--xp2:#4aaa4a;
  --red:#c03030;--grn:#2a8a2a;
  --pur:#6030a0;--pur2:#b060ff;
}
html,body,#root{height:100%;overflow:hidden;}
.app{height:100vh;width:100vw;background:var(--bg);
  background-image:radial-gradient(ellipse at 15% 15%,rgba(30,50,20,.25) 0%,transparent 55%),
    radial-gradient(ellipse at 85% 85%,rgba(50,20,10,.3) 0%,transparent 55%);
  font-family:'Share Tech Mono',monospace;color:var(--text);
  display:flex;flex-direction:column;position:relative;overflow:hidden;}
.app::after{content:'';pointer-events:none;position:fixed;inset:0;z-index:990;
  background:repeating-linear-gradient(0deg,transparent,transparent 3px,rgba(0,0,0,.06) 3px,rgba(0,0,0,.06) 4px);}

/* SETUP */
.setup{flex:1;display:flex;align-items:center;justify-content:center;padding:16px;overflow-y:auto;}
.setup-card{width:100%;max-width:600px;border:1px solid var(--gold2);background:rgba(11,15,20,.97);
  padding:28px 24px;position:relative;animation:rise .6s ease both;}
.setup-card::before,.setup-card::after{content:'';position:absolute;width:18px;height:18px;border-color:var(--gold);border-style:solid;}
.setup-card::before{top:-1px;left:-1px;border-width:2px 0 0 2px;}
.setup-card::after{bottom:-1px;right:-1px;border-width:0 2px 2px 0;}
@keyframes rise{from{opacity:0;transform:translateY(16px);}to{opacity:1;transform:none;}}

.logo{font-family:'Cinzel',serif;font-size:clamp(1.4rem,4.5vw,2rem);color:var(--gold);
  text-align:center;letter-spacing:.12em;text-shadow:0 0 40px rgba(201,168,76,.35);margin-bottom:2px;}
.tagline{text-align:center;font-size:.7rem;color:var(--dim);letter-spacing:.25em;margin-bottom:6px;}
.story-hook{font-family:'Lora',serif;font-style:italic;color:#6a8060;font-size:.82rem;
  text-align:center;max-width:460px;margin:0 auto 22px;line-height:1.6;
  border-left:2px solid var(--gold3);border-right:2px solid var(--gold3);padding:8px 14px;}

.s-row{display:grid;grid-template-columns:1fr 1fr;gap:12px;margin-bottom:16px;}
.s-col{display:flex;flex-direction:column;gap:10px;}
.s-label{font-size:.65rem;letter-spacing:.2em;color:var(--gold2);margin-bottom:4px;display:block;}
.s-input{width:100%;background:rgba(255,255,255,.03);border:1px solid #1a2a1a;border-radius:2px;
  color:var(--text);font-family:'Share Tech Mono',monospace;font-size:.9rem;padding:8px 11px;outline:none;transition:border-color .2s;}
.s-input:focus{border-color:var(--gold2);}
.s-input::placeholder{color:#2a3a2a;}

.class-grid{display:grid;grid-template-columns:repeat(3,1fr);gap:6px;}
.class-btn,.race-btn{background:rgba(255,255,255,.02);border:1px solid #1a2a1a;border-radius:2px;
  color:#5a7055;font-family:'Share Tech Mono',monospace;cursor:pointer;text-align:center;transition:all .15s;}
.class-btn{font-size:.78rem;padding:8px 4px;display:flex;flex-direction:column;gap:2px;align-items:center;}
.class-btn:hover,.race-btn:hover{border-color:var(--gold2);color:var(--text);}
.class-btn.sel,.race-btn.sel{border-color:var(--gold);color:var(--gold);background:rgba(201,168,76,.07);}
.class-icon{font-size:1.2rem;}.class-stats{font-size:.6rem;color:var(--dim);}
.race-grid{display:grid;grid-template-columns:repeat(3,1fr);gap:5px;}
.race-btn{font-size:.75rem;padding:6px;}

.begin-btn{width:100%;margin-top:20px;padding:13px;
  background:linear-gradient(135deg,#2a1800,#5a3a08,#2a1800);
  border:1px solid var(--gold);border-radius:2px;color:var(--gold);
  font-family:'Cinzel',serif;font-size:.95rem;letter-spacing:.18em;
  cursor:pointer;transition:all .25s;box-shadow:0 0 20px rgba(201,168,76,.12);}
.begin-btn:hover:not(:disabled){box-shadow:0 0 40px rgba(201,168,76,.28);letter-spacing:.22em;}
.begin-btn:disabled{opacity:.3;cursor:not-allowed;}

/* GAME */
.game{flex:1;display:flex;flex-direction:column;height:100vh;overflow:hidden;}

.topbar{display:flex;align-items:center;justify-content:space-between;
  padding:7px 14px;border-bottom:1px solid var(--border);background:rgba(11,15,20,.92);flex-shrink:0;}
.tb-l{display:flex;align-items:center;gap:10px;min-width:0;}
.tb-logo{font-family:'Cinzel',serif;font-size:.85rem;color:var(--gold);letter-spacing:.1em;flex-shrink:0;}
.tb-sep{color:var(--dim);}
.tb-loc{font-size:.7rem;color:#5a8055;letter-spacing:.06em;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;max-width:200px;}
.seals-bar{display:flex;align-items:center;gap:6px;flex-shrink:0;}
.seal-pip{width:20px;height:20px;border-radius:50%;border:2px solid #2a1a50;
  display:flex;align-items:center;justify-content:center;font-size:.72rem;
  transition:all .4s;background:#0d0a18;}
.seal-pip.found{border-color:var(--pur2);background:rgba(176,96,255,.15);
  box-shadow:0 0 12px rgba(176,96,255,.5);animation:sealPulse 2s infinite;}
@keyframes sealPulse{0%,100%{box-shadow:0 0 8px rgba(176,96,255,.4);}50%{box-shadow:0 0 20px rgba(176,96,255,.7);}}
.seal-label{font-size:.62rem;color:#5a4a80;letter-spacing:.1em;}
.new-btn{background:none;border:1px solid #1e2e1e;border-radius:2px;color:var(--dim);
  font-family:'Share Tech Mono',monospace;font-size:.68rem;padding:4px 9px;cursor:pointer;transition:all .15s;letter-spacing:.06em;}
.new-btn:hover{border-color:var(--red);color:var(--red);}

.main{flex:1;display:flex;overflow:hidden;}

/* SIDEBAR */
.sidebar{width:210px;flex-shrink:0;border-right:1px solid var(--border);
  background:var(--panel);display:flex;flex-direction:column;overflow-y:auto;scrollbar-width:none;}
.sidebar::-webkit-scrollbar{display:none;}
.char-head{padding:12px 11px 10px;border-bottom:1px solid var(--border);text-align:center;}
.char-portrait{width:46px;height:46px;border:2px solid var(--gold2);border-radius:2px;
  display:flex;align-items:center;justify-content:center;font-size:1.6rem;margin:0 auto 7px;background:rgba(201,168,76,.04);}
.char-name-d{font-size:.88rem;color:var(--gold);letter-spacing:.07em;}
.char-sub{font-size:.65rem;color:var(--dim);margin-top:1px;letter-spacing:.05em;}
.lvl-badge{display:inline-block;margin-top:5px;background:rgba(201,168,76,.08);
  border:1px solid var(--gold2);border-radius:2px;padding:2px 8px;font-size:.68rem;color:var(--gold);letter-spacing:.1em;}

.stat-block{padding:9px 11px;border-bottom:1px solid var(--border);}
.stat-title{font-size:.62rem;letter-spacing:.2em;color:var(--dim);margin-bottom:7px;}
.bar-row{margin-bottom:6px;}
.bar-label{display:flex;justify-content:space-between;font-size:.65rem;margin-bottom:3px;}
.bar-track{height:5px;background:#080c08;border-radius:1px;overflow:hidden;}
.bar-fill{height:100%;border-radius:1px;transition:width .7s ease;}
.hp-fill{background:linear-gradient(90deg,var(--hp1),var(--hp2));}
.mp-fill{background:linear-gradient(90deg,var(--mp1),var(--mp2));}
.xp-fill{background:linear-gradient(90deg,var(--xp1),var(--xp2));}
.hp-val{color:#d94040;}.mp-val{color:#3a7ad9;}.xp-val{color:#4aaa4a;}

.attrs{display:grid;grid-template-columns:1fr 1fr;gap:4px;padding:8px 11px;border-bottom:1px solid var(--border);}
.attr{background:rgba(255,255,255,.02);border:1px solid #141e14;border-radius:2px;padding:4px 6px;}
.attr-k{font-size:.58rem;color:var(--dim);letter-spacing:.1em;}
.attr-v{font-size:.85rem;color:var(--gold);margin-top:1px;}
.gold-row{display:flex;align-items:center;gap:5px;padding:7px 11px;border-bottom:1px solid var(--border);font-size:.75rem;color:var(--gold);}

.companions-block{padding:9px 11px;border-bottom:1px solid var(--border);}
.comp-empty{font-size:.68rem;color:var(--dim);font-style:italic;}
.comp-card{background:rgba(255,255,255,.02);border:1px solid #141e14;border-radius:2px;
  padding:7px 8px;margin-bottom:6px;transition:border-color .3s;}
.comp-card.speaking{border-color:#2a4a3a;box-shadow:0 0 10px rgba(60,140,80,.2);}
.comp-head{display:flex;align-items:center;gap:6px;margin-bottom:3px;}
.comp-icon{font-size:1rem;}.comp-name{font-size:.75rem;color:#80c090;letter-spacing:.05em;}
.comp-class{font-size:.62rem;color:var(--dim);}
.comp-hp-bar{height:3px;background:#080c08;border-radius:1px;overflow:hidden;margin-top:4px;}
.comp-hp-fill{height:100%;background:linear-gradient(90deg,var(--hp1),var(--hp2));transition:width .6s;}

.inv-block{padding:9px 11px;flex:1;}
.inv-title{font-size:.62rem;letter-spacing:.2em;color:var(--dim);margin-bottom:7px;}
.inv-list{display:flex;flex-direction:column;gap:3px;}
.inv-item{background:rgba(255,255,255,.02);border:1px solid #141e14;border-radius:2px;padding:3px 7px;font-size:.68rem;color:var(--text);}
.inv-item.special{border-color:var(--pur2);color:var(--pur2);background:rgba(176,96,255,.06);}
.inv-empty{font-size:.68rem;color:var(--dim);font-style:italic;}

/* NARRATIVE */
.narrative{flex:1;display:flex;flex-direction:column;overflow:hidden;min-width:0;}
.scroll{flex:1;overflow-y:auto;padding:18px 20px;display:flex;flex-direction:column;gap:0;
  scrollbar-width:thin;scrollbar-color:#1a2a1a transparent;}
.entry{margin-bottom:18px;animation:msgIn .4s ease both;}
@keyframes msgIn{from{opacity:0;transform:translateY(8px);}to{opacity:1;transform:none;}}
.entry-label{font-size:.6rem;letter-spacing:.2em;text-transform:uppercase;margin-bottom:5px;}
.entry.gm .entry-label{color:#3a5a3a;}
.entry.player .entry-label{color:var(--gold2);text-align:right;}
.entry.sys .entry-label{color:#3a3a6a;text-align:center;}
.entry-text{font-family:'Lora',serif;font-size:.92rem;line-height:1.8;padding:12px 15px;border-radius:2px;}
.entry.gm .entry-text{background:rgba(255,255,255,.022);border-left:2px solid #2a4a28;color:#98b094;}
.entry.player .entry-text{background:rgba(201,168,76,.05);border-right:2px solid var(--gold2);
  color:#c0a860;text-align:right;font-style:italic;}
.entry.sys .entry-text{background:rgba(50,40,90,.25);border:1px solid #2a2a50;color:#8878c0;
  text-align:center;font-family:'Share Tech Mono',monospace;font-style:normal;font-size:.76rem;letter-spacing:.05em;}

.comp-speech{display:flex;flex-direction:column;gap:6px;margin-top:10px;}
.speech-bubble{display:flex;align-items:flex-start;gap:8px;
  background:rgba(30,60,40,.2);border:1px solid #1e3a28;border-radius:2px;padding:8px 10px;}
.speech-icon{font-size:1.1rem;flex-shrink:0;margin-top:1px;}
.speech-body{flex:1;}
.speech-name{font-size:.65rem;color:#60b070;letter-spacing:.1em;margin-bottom:3px;}
.speech-line{font-family:'Lora',serif;font-style:italic;font-size:.88rem;color:#88b890;line-height:1.6;}

.dice-row{display:flex;align-items:center;gap:8px;margin-bottom:8px;}
.dice{width:36px;height:36px;border:2px solid var(--gold2);border-radius:4px;
  display:flex;align-items:center;justify-content:center;font-family:'Cinzel',serif;
  font-size:1rem;color:var(--gold);background:rgba(201,168,76,.06);transition:all .3s;}
.dice.crit{border-color:#60c060;color:#60c060;background:rgba(96,192,96,.1);box-shadow:0 0 14px rgba(96,192,96,.3);}
.dice.fail{border-color:#c06060;color:#c06060;background:rgba(192,96,96,.1);box-shadow:0 0 14px rgba(192,96,96,.3);}
.dice.rolling{animation:spinDie .5s ease;}
@keyframes spinDie{0%{transform:rotate(0)scale(.8);}50%{transform:rotate(180deg)scale(1.2);}100%{transform:rotate(360deg)scale(1);}}
.dice-label{font-size:.68rem;color:var(--dim);}

.tags{display:flex;gap:5px;flex-wrap:wrap;margin-bottom:6px;}
.tag{font-family:'Share Tech Mono',monospace;font-size:.64rem;padding:2px 7px;border-radius:2px;letter-spacing:.08em;}
.tag-dmg{background:rgba(140,20,20,.2);border:1px solid #a03030;color:#e06060;}
.tag-heal{background:rgba(20,100,20,.2);border:1px solid #308030;color:#60c060;}
.tag-xp{background:rgba(20,90,20,.15);border:1px solid var(--xp2);color:var(--xp2);}
.tag-item{background:rgba(90,70,10,.2);border:1px solid var(--gold2);color:var(--gold);}
.tag-gold{background:rgba(100,80,10,.2);border:1px solid var(--gold2);color:var(--gold);}
.tag-seal{background:rgba(80,30,160,.25);border:1px solid var(--pur2);color:var(--pur2);animation:flash .7s 4;}
.tag-lvl{background:rgba(100,70,0,.4);border:1px solid var(--gold);color:var(--gold);animation:flash .7s 4;}
@keyframes flash{0%,100%{opacity:1;}50%{opacity:.3;}}

.choices{display:flex;flex-direction:column;gap:5px;margin-top:10px;}
.choice-btn{background:rgba(255,255,255,.02);border:1px solid #1a2e1a;border-radius:2px;
  color:#6a9065;font-family:'Share Tech Mono',monospace;font-size:.75rem;padding:8px 12px;
  cursor:pointer;text-align:left;transition:all .15s;letter-spacing:.04em;display:flex;align-items:center;gap:8px;}
.choice-btn:hover:not(:disabled){border-color:var(--gold2);color:var(--gold);background:rgba(201,168,76,.06);}
.choice-btn:disabled{opacity:.3;cursor:not-allowed;}
.choice-num{color:var(--gold2);font-size:.7rem;flex-shrink:0;}

.typing{display:flex;gap:5px;align-items:center;padding:12px 15px;
  border-left:2px solid #2a4a28;background:rgba(255,255,255,.022);margin-bottom:16px;width:64px;}
.dot{width:5px;height:5px;border-radius:50%;background:#4a8a4a;animation:pulse 1.1s infinite ease-in-out;}
.dot:nth-child(2){animation-delay:.2s;}.dot:nth-child(3){animation-delay:.4s;}
@keyframes pulse{0%,80%,100%{transform:scale(.5);opacity:.3;}40%{transform:scale(1);opacity:1;}}

.inputbar{border-top:1px solid var(--border);background:var(--panel);padding:10px 14px;
  display:flex;gap:9px;align-items:flex-end;flex-shrink:0;}
.in-wrap{flex:1;position:relative;}
.cmd-input{width:100%;background:rgba(255,255,255,.03);border:1px solid #1a2e1a;border-radius:2px;
  color:var(--text);font-family:'Lora',serif;font-size:.9rem;padding:9px 13px;outline:none;
  resize:none;max-height:90px;line-height:1.5;transition:border-color .2s;}
.cmd-input:focus{border-color:#2a4a2a;}
.cmd-input::placeholder{color:#2a3a2a;font-style:italic;}
.cmd-hint{font-size:.6rem;color:#2a3a2a;margin-top:3px;letter-spacing:.06em;}
.send-btn{background:rgba(201,168,76,.07);border:1px solid var(--gold2);border-radius:2px;
  color:var(--gold);font-family:'Share Tech Mono',monospace;font-size:.7rem;letter-spacing:.1em;
  padding:9px 12px;height:40px;cursor:pointer;transition:all .15s;white-space:nowrap;flex-shrink:0;}
.send-btn:hover:not(:disabled){background:rgba(201,168,76,.14);box-shadow:0 0 12px rgba(201,168,76,.2);}
.send-btn:disabled{opacity:.2;cursor:not-allowed;}

/* OVERLAYS */
.overlay{position:fixed;inset:0;z-index:1000;display:flex;align-items:center;justify-content:center;
  background:rgba(0,0,0,.88);animation:fadeIn .3s ease;}
@keyframes fadeIn{from{opacity:0;}to{opacity:1;}}
.overlay-card{border:2px solid var(--gold);background:var(--panel);padding:36px;text-align:center;
  max-width:360px;width:90%;animation:zoomIn .4s cubic-bezier(.34,1.56,.64,1);}
@keyframes zoomIn{from{opacity:0;transform:scale(.7);}to{opacity:1;transform:scale(1);}}
.ov-title{font-family:'Cinzel',serif;font-size:1.8rem;color:var(--gold);text-shadow:0 0 30px rgba(201,168,76,.5);margin-bottom:6px;}
.ov-sub{color:var(--dim);font-size:.75rem;letter-spacing:.18em;margin-bottom:16px;}
.ov-text{font-family:'Lora',serif;font-style:italic;color:#8a9a84;font-size:.9rem;line-height:1.7;margin-bottom:20px;}
.ov-grid{display:grid;grid-template-columns:1fr 1fr;gap:7px;margin-bottom:20px;}
.ov-stat{border:1px solid var(--gold2);padding:8px;font-size:.75rem;}
.ov-stat span{display:block;color:var(--gold);font-size:1rem;margin-top:2px;}
.ov-seal{font-size:.75rem;color:var(--pur2);margin-bottom:16px;letter-spacing:.1em;}
.ov-btn{background:linear-gradient(135deg,#2a1800,#5a3a08);border:1px solid var(--gold);border-radius:2px;
  color:var(--gold);font-family:'Cinzel',serif;font-size:.88rem;letter-spacing:.14em;
  padding:10px 26px;cursor:pointer;transition:all .2s;}
.ov-btn:hover{box-shadow:0 0 20px rgba(201,168,76,.3);}
.win-card{border-color:var(--pur2);}
.win-title{color:var(--pur2) !important;text-shadow:0 0 30px rgba(176,96,255,.5) !important;}

.error-banner{background:rgba(140,20,20,.2);border:1px solid #a03030;border-radius:2px;
  padding:8px 14px;font-size:.75rem;color:#e06060;letter-spacing:.05em;margin-bottom:12px;}

@media(max-width:600px){
  .sidebar{display:none;}
  .class-grid{grid-template-columns:repeat(2,1fr);}
}
`;

/* ─── CONSTANTS ─── */
const CLASSES = [
  {id:"warrior",label:"Warrior",icon:"⚔️",hint:"STR·TANK",   hp:120,mp:20, str:16,dex:10,int:8, wis:10},
  {id:"mage",   label:"Mage",   icon:"🔮",hint:"INT·MAGIC",  hp:60, mp:120,str:6, dex:10,int:18,wis:14},
  {id:"rogue",  label:"Rogue",  icon:"🗡️",hint:"DEX·STEALTH",hp:80, mp:40, str:10,dex:18,int:12,wis:8 },
  {id:"cleric", label:"Cleric", icon:"✨",hint:"WIS·HEAL",   hp:90, mp:90, str:12,dex:8, int:12,wis:18},
  {id:"ranger", label:"Ranger", icon:"🏹",hint:"DEX·RANGE",  hp:100,mp:50, str:12,dex:16,int:10,wis:14},
  {id:"bard",   label:"Bard",   icon:"🎵",hint:"CHA·SUPPORT",hp:70, mp:70, str:8, dex:14,int:14,wis:12},
];
const RACES = ["Human","Elf","Dwarf","Half-Orc","Gnome","Tiefling","Halfling","Dragonborn","Aasimar"];
const CLASS_ICON = {warrior:"⚔️",mage:"🔮",rogue:"🗡️",cleric:"✨",ranger:"🏹",bard:"🎵"};

const COMPANIONS = [
  {id:"lyra",   name:"Lyra Swiftarrow",  icon:"🏹",cls:"Elf Ranger",     personality:"witty, sarcastic, secretly warm-hearted"},
  {id:"thorne", name:"Thorne Ironhide",  icon:"🪓",cls:"Dwarf Fighter",   personality:"gruff, fiercely loyal, loves ale and battle"},
  {id:"mirabel",name:"Mirabel Ash",      icon:"🌟",cls:"Apprentice Mage", personality:"eager, nervous, surprisingly powerful when pushed"},
  {id:"rook",   name:"Rook",             icon:"🌑",cls:"Mysterious Rogue", personality:"laconic, dark past, ruthlessly efficient"},
];

const SEALS = [
  {name:"Seal of Shadow", location:"The Ashwood",          icon:"🌑"},
  {name:"Seal of Tides",  location:"The Sunken Ruins",     icon:"🌊"},
  {name:"Seal of Flame",  location:"The Citadel of Flame", icon:"🔥"},
];

const XP_LEVELS = [0,100,250,450,700,1000,1350,1750,2200,2700];

/* ─── HELPERS ─── */
function Bar({pct,cls,label,val}){
  return(
    <div className="bar-row">
      <div className="bar-label"><span>{label}</span><span className={cls+"-val"}>{val}</span></div>
      <div className="bar-track"><div className={`bar-fill ${cls}-fill`} style={{width:Math.max(0,Math.min(100,pct))+"%"}}/></div>
    </div>
  );
}

function roll20(){return Math.floor(Math.random()*20)+1;}

/* ─── APP ─── */
export default function App(){
  const [phase,setPhase]   = useState("setup");
  const [charName,setCharName] = useState("");
  const [selClass,setSelClass] = useState("warrior");
  const [selRace,setSelRace]   = useState("Human");
  const [gs,setGs]         = useState(()=>mkGs("warrior"));
  const [entries,setEntries]   = useState([]);
  const [input,setInput]   = useState("");
  const [loading,setLoading]   = useState(false);
  const [overlay,setOverlay]   = useState(null);
  const [diceRoll,setDiceRoll] = useState(null);
  const [suggestions,setSuggestions] = useState([]);
  const [speakingComp,setSpeakingComp] = useState(null);
  const [apiError,setApiError] = useState(null);
  const scrollRef  = useRef(null);
  const convRef    = useRef([]);

  useEffect(()=>{
    scrollRef.current?.scrollTo({top:scrollRef.current.scrollHeight,behavior:"smooth"});
  },[entries,loading]);

  function mkGs(cls){
    const c=CLASSES.find(x=>x.id===cls)||CLASSES[0];
    return{hp:c.hp,maxHp:c.hp,mp:c.mp,maxMp:c.mp,xp:0,level:1,gold:15,
      str:c.str,dex:c.dex,int:c.int,wis:c.wis,
      inventory:["Worn Satchel","Rations ×3"],
      seals:[],companions:[],location:"Village of Ashenmere",quest:"Seek the Oracle in the Ashwood"};
  }

  function buildSystem(state){
    const c=CLASSES.find(x=>x.id===selClass)||CLASSES[0];
    const comps=state.companions.map(id=>COMPANIONS.find(c=>c.id===id)).filter(Boolean);
    const foundSeals=state.seals.map(i=>SEALS[i]?.name).join(", ")||"None";
    return `You are a master RPG Game Master for "The Eclipse Prophecy." Be literary, vivid, and immersive.

THE ECLIPSE PROPHECY: The ancient god Malachar is rising. Three Eclipse Seals must be claimed before his cult does. Once all three are found, confront Malachar at the Eclipse Spire. Seals collected so far: ${foundSeals}.

SEALS STATUS:
${SEALS.map((s,i)=>state.seals.includes(i)?`✓ ${s.name} — CLAIMED`:`✗ ${s.name} — hidden at ${s.location}`).join("\n")}

PLAYER: ${charName} | ${selRace} ${c.label} | Level ${state.level}
HP: ${state.hp}/${state.maxHp} | MP: ${state.mp}/${state.maxMp}
STR:${state.str} DEX:${state.dex} INT:${state.int} WIS:${state.wis}
Gold: ${state.gold}g | Inventory: ${state.inventory.join(", ")}
Location: ${state.location} | Quest: ${state.quest}

ACTIVE COMPANIONS:
${comps.length?comps.map(co=>`- ${co.name} (${co.cls}): ${co.personality}`).join("\n"):"None yet — companions may be encountered and recruited."}
AVAILABLE TO RECRUIT: ${["lyra","thorne","mirabel","rook"].filter(id=>!state.companions.includes(id)).join(", ")||"none remaining"}

RESPOND ONLY IN VALID JSON — no markdown, no backticks:
{
  "narrative": "4-6 paragraphs of vivid narration. Rich sensory detail. NPC dialogue in quotes. Companions react with their own voice. Make it feel like a novel. End with a dramatic hook.",
  "companionLines": [{"name":"CompanionName","line":"What they say in character"}],
  "suggestedActions": ["Action 1","Action 2","Action 3","Action 4"],
  "stateUpdate": {
    "hpChange": 0,
    "mpChange": 0,
    "xpGain": 0,
    "goldChange": 0,
    "itemsGained": [],
    "itemsLost": [],
    "location": "${state.location}",
    "quest": "${state.quest}",
    "sealFound": -1,
    "companionJoined": "",
    "gameWon": false
  }
}

RULES:
- Combat: 8-30 hp damage; companions each reduce damage by 5; give 30-100 xp for victories
- Magic: costs 15-35 mp
- Healing: potions/spells restore 25-50 hp
- sealFound: set to seal INDEX (0, 1, or 2) when a seal is obtained; -1 otherwise
- companionJoined: the companion's id (lyra/thorne/mirabel/rook) when they join; empty string otherwise
- gameWon: true ONLY when player defeats Malachar after collecting all 3 seals
- hp never drops to 0 — always keep at 1 minimum
- Companions have distinct voices; use their personality every response
- The world has memory — reference past events, let choices have consequences
- Dice roll result is included — high rolls (15+) = clear success; low (1-5) = complication`;
  }

  /* Call our Cloudflare Pages Function at /api/chat */
  async function callApi(system, messages){
    const res = await fetch("/api/chat", {
      method: "POST",
      headers: {"Content-Type":"application/json"},
      body: JSON.stringify({system, messages}),
    });
    if(!res.ok){
      const err = await res.json().catch(()=>({}));
      throw new Error(err.error || `HTTP ${res.status}`);
    }
    const data = await res.json();
    return data.content || "";
  }

  function parseContent(text){
    try{
      const clean = text.replace(/```json|```/g,"").trim();
      return JSON.parse(clean);
    }catch{
      return {narrative:text.slice(0,800),stateUpdate:{},companionLines:[],suggestedActions:[]};
    }
  }

  function applyUpdate(prev, upd){
    const next={...prev};
    if(upd.hpChange)     next.hp    = Math.max(1,Math.min(next.maxHp,next.hp+upd.hpChange));
    if(upd.mpChange)     next.mp    = Math.max(0,Math.min(next.maxMp,next.mp+upd.mpChange));
    if(upd.xpGain)       next.xp   += upd.xpGain;
    if(upd.goldChange)   next.gold  = Math.max(0,next.gold+upd.goldChange);
    if(upd.itemsGained?.length) next.inventory=[...next.inventory,...upd.itemsGained];
    if(upd.itemsLost?.length)   next.inventory=next.inventory.filter(i=>!upd.itemsLost.includes(i));
    if(upd.location)     next.location = upd.location;
    if(upd.quest)        next.quest    = upd.quest;
    if(typeof upd.sealFound==="number"&&upd.sealFound>=0&&!next.seals.includes(upd.sealFound))
      next.seals=[...next.seals,upd.sealFound];
    if(upd.companionJoined&&!next.companions.includes(upd.companionJoined))
      next.companions=[...next.companions,upd.companionJoined];
    if(next.xp>=(XP_LEVELS[next.level]||9999)){
      next.level++;next.maxHp=Math.floor(next.maxHp*1.15);next.hp=next.maxHp;
      next.maxMp=Math.floor(next.maxMp*1.1);next.mp=next.maxMp;
      next.str++;next.dex++;next.int++;next.wis++;
    }
    return next;
  }

  function buildTags(upd, prevGs, nextGs){
    const tags=[];
    if(upd.hpChange<0)   tags.push({cls:"tag-dmg", txt:`${Math.abs(upd.hpChange)} DMG`});
    if(upd.hpChange>0)   tags.push({cls:"tag-heal",txt:`+${upd.hpChange} HP`});
    if(upd.mpChange<0)   tags.push({cls:"tag-dmg", txt:`${Math.abs(upd.mpChange)} MP USED`});
    if(upd.xpGain>0)     tags.push({cls:"tag-xp",  txt:`+${upd.xpGain} XP`});
    if(upd.goldChange>0) tags.push({cls:"tag-gold", txt:`+${upd.goldChange}g`});
    if(upd.goldChange<0) tags.push({cls:"tag-gold", txt:`${upd.goldChange}g`});
    (upd.itemsGained||[]).forEach(i=>tags.push({cls:"tag-item",txt:`FOUND: ${i}`}));
    if(typeof upd.sealFound==="number"&&upd.sealFound>=0)
      tags.push({cls:"tag-seal",txt:`⬡ SEAL: ${SEALS[upd.sealFound]?.name}`});
    if(nextGs.level>prevGs.level)
      tags.push({cls:"tag-lvl",txt:`LEVEL UP → LV ${nextGs.level}`});
    if(upd.companionJoined){
      const co=COMPANIONS.find(c=>c.id===upd.companionJoined);
      if(co) tags.push({cls:"tag-item",txt:`${co.name} JOINS`});
    }
    return tags;
  }

  async function doTurn(userText){
    const r=roll20();
    setDiceRoll({val:r,rolling:true});
    setTimeout(()=>setDiceRoll(v=>v?{...v,rolling:false}:v),550);
    setApiError(null);

    const msgWithRoll=`${userText}\n\n[D20 ROLL: ${r} — ${r>=15?"SUCCESS":r>=8?"PARTIAL":"COMPLICATION"}]`;
    convRef.current=[...convRef.current,{role:"user",content:msgWithRoll}];
    setLoading(true);

    try{
      const currentGs=gs;
      const sys=buildSystem(currentGs);
      const text=await callApi(sys,convRef.current);
      const {narrative="",companionLines=[],suggestedActions=[],stateUpdate={}}=parseContent(text);

      convRef.current=[...convRef.current,{role:"assistant",content:text}];

      let prevGs=currentGs, nextGs=currentGs;
      setGs(prev=>{prevGs=prev;nextGs=applyUpdate(prev,stateUpdate);return nextGs;});

      await new Promise(r=>setTimeout(r,30));
      const tags=buildTags(stateUpdate,prevGs,nextGs);
      setSuggestions(suggestedActions.slice(0,4));

      if(stateUpdate.gameWon)       setOverlay({type:"win",  data:{level:nextGs.level}});
      else if(nextGs.level>prevGs.level) setOverlay({type:"lvlup",data:{level:nextGs.level}});
      else if(typeof stateUpdate.sealFound==="number"&&stateUpdate.sealFound>=0)
        setOverlay({type:"seal",data:{seal:SEALS[stateUpdate.sealFound]}});

      if(companionLines?.length>0){
        setSpeakingComp(companionLines[0].name);
        setTimeout(()=>setSpeakingComp(null),2800);
      }

      setEntries(prev=>[...prev,{type:"gm",text:narrative,tags,companionLines:companionLines||[],dice:r}]);
    }catch(e){
      setApiError(e.message);
      setEntries(prev=>[...prev,{type:"gm",text:"The world holds its breath... a moment of silence falls.",tags:[],companionLines:[],dice:r}]);
    }
    setLoading(false);
  }

  async function startGame(){
    const c=CLASSES.find(x=>x.id===selClass)||CLASSES[0];
    const state=mkGs(selClass);
    setGs(state);convRef.current=[];setEntries([]);setSuggestions([]);setApiError(null);
    setPhase("game");setLoading(true);

    const opening=`I am ${charName}, a ${selRace} ${c.label}. I stand at the edge of ${state.location} as a storm gathers on the horizon. The Oracle has called for me. Begin The Eclipse Prophecy — set the opening scene with vivid atmosphere. Introduce one companion naturally if the scene allows.`;
    convRef.current=[{role:"user",content:opening}];

    try{
      const sys=buildSystem(state);
      const text=await callApi(sys,convRef.current);
      const {narrative="",companionLines=[],suggestedActions=[],stateUpdate={}}=parseContent(text);
      convRef.current=[...convRef.current,{role:"assistant",content:text}];
      setGs(prev=>applyUpdate(prev,stateUpdate));
      setSuggestions(suggestedActions.slice(0,4));
      if(stateUpdate.companionJoined){setSpeakingComp(companionLines[0]?.name);setTimeout(()=>setSpeakingComp(null),2800);}
      setEntries([{type:"gm",text:narrative,tags:[],companionLines:companionLines||[],dice:null}]);
    }catch(e){
      setApiError(e.message);
      setEntries([{type:"gm",text:"The Eclipse Prophecy begins in shadow... (could not connect to Game Master — check GROQ_API_KEY in Cloudflare)",tags:[],companionLines:[],dice:null}]);
    }
    setLoading(false);
  }

  function handleSend(){
    const t=input.trim();if(!t||loading)return;
    setInput("");
    setEntries(prev=>[...prev,{type:"player",text:t,tags:[],companionLines:[]}]);
    setSuggestions([]);
    doTurn(t);
  }
  function handleChoice(c){
    setEntries(prev=>[...prev,{type:"player",text:c,tags:[],companionLines:[]}]);
    setSuggestions([]);
    doTurn(c);
  }
  function handleKey(e){if(e.key==="Enter"&&!e.shiftKey){e.preventDefault();handleSend();}}
  function resetGame(){setPhase("setup");setEntries([]);convRef.current=[];setSuggestions([]);setApiError(null);}

  const cls = CLASSES.find(c=>c.id===selClass)||CLASSES[0];
  const xpPrev = XP_LEVELS[gs.level-1]||0;
  const xpNext = XP_LEVELS[gs.level]||9999;
  const xpPct  = ((gs.xp-xpPrev)/(xpNext-xpPrev))*100;
  const partyComps = gs.companions.map(id=>COMPANIONS.find(c=>c.id===id)).filter(Boolean);

  /* ── SETUP SCREEN ── */
  if(phase==="setup") return(
    <>
      <style>{CSS}</style>
      <div className="app">
        <div className="setup">
          <div className="setup-card">
            <div className="logo">⬡ THE ECLIPSE PROPHECY CODEX ⬡</div>
            <div className="tagline">AN IMMERSIVE RPG ADVENTURE</div>
            <div className="story-hook">
              Three Eclipse Seals. An ancient god rising. A world on the brink of eternal night.
              Gather your companions and stop Malachar — before it is too late.
            </div>
            <div className="s-row">
              <div className="s-col">
                <div>
                  <span className="s-label">YOUR NAME</span>
                  <input className="s-input" value={charName}
                    onChange={e=>setCharName(e.target.value)}
                    placeholder="Enter your name..." autoFocus/>
                </div>
                <div>
                  <span className="s-label">RACE</span>
                  <div className="race-grid">
                    {RACES.map(r=>(
                      <button key={r} className={`race-btn${selRace===r?" sel":""}`} onClick={()=>setSelRace(r)}>{r}</button>
                    ))}
                  </div>
                </div>
              </div>
              <div className="s-col">
                <span className="s-label">CLASS</span>
                <div className="class-grid">
                  {CLASSES.map(c=>(
                    <button key={c.id} className={`class-btn${selClass===c.id?" sel":""}`}
                      onClick={()=>{setSelClass(c.id);setGs(mkGs(c.id));}}>
                      <span className="class-icon">{c.icon}</span>
                      <span>{c.label}</span>
                      <span className="class-stats">{c.hint}</span>
                    </button>
                  ))}
                </div>
              </div>
            </div>
            <button className="begin-btn" onClick={startGame} disabled={!charName.trim()}>
              BEGIN THE PROPHECY
            </button>
          </div>
        </div>
      </div>
    </>
  );

  /* ── GAME SCREEN ── */
  return(
    <>
      <style>{CSS}</style>
      <div className="app">

        {/* LEVEL UP */}
        {overlay?.type==="lvlup"&&(
          <div className="overlay" onClick={()=>setOverlay(null)}>
            <div className="overlay-card" onClick={e=>e.stopPropagation()}>
              <div className="ov-title">LEVEL UP!</div>
              <div className="ov-sub">NOW LEVEL {overlay.data.level}</div>
              <div className="ov-text">Power surges through you. Your body adapts to the trials you have faced. You feel stronger, wiser — ready for the darkness ahead.</div>
              <div className="ov-grid">
                <div className="ov-stat">MAX HP<span>+{Math.floor(gs.maxHp*0.13)}</span></div>
                <div className="ov-stat">ALL STATS<span>+1 each</span></div>
              </div>
              <button className="ov-btn" onClick={()=>setOverlay(null)}>CONTINUE ▶</button>
            </div>
          </div>
        )}

        {/* SEAL FOUND */}
        {overlay?.type==="seal"&&(
          <div className="overlay" onClick={()=>setOverlay(null)}>
            <div className="overlay-card" onClick={e=>e.stopPropagation()}>
              <div className="ov-title">{overlay.data.seal?.icon} SEAL CLAIMED</div>
              <div className="ov-sub">ECLIPSE SEAL SECURED</div>
              <div className="ov-text">The {overlay.data.seal?.name} hums with dark power in your hands. Malachar's cult will know what you have done. The hunt is on.</div>
              <div className="ov-seal">SEALS: {gs.seals.length} / 3 {gs.seals.length===3?"— SEEK THE ECLIPSE SPIRE!":""}</div>
              <button className="ov-btn" onClick={()=>setOverlay(null)}>PRESS ON ▶</button>
            </div>
          </div>
        )}

        {/* VICTORY */}
        {overlay?.type==="win"&&(
          <div className="overlay">
            <div className="overlay-card win-card">
              <div className="ov-title win-title">⬡ VICTORY ⬡</div>
              <div className="ov-sub">THE ECLIPSE PROPHECY ENDS</div>
              <div className="ov-text">Malachar falls. The darkness recedes. Songs will be sung of {charName} for a thousand years — the one who stood between the world and eternal night.</div>
              <div className="ov-grid">
                <div className="ov-stat">LEVEL<span>{overlay.data.level}</span></div>
                <div className="ov-stat">SEALS<span>3 / 3</span></div>
                <div className="ov-stat">ALLIES<span>{partyComps.length}</span></div>
                <div className="ov-stat">GOLD<span>{gs.gold}g</span></div>
              </div>
              <button className="ov-btn" onClick={resetGame}>PLAY AGAIN</button>
            </div>
          </div>
        )}

        {/* ── TOP BAR ── */}
        <div className="topbar">
          <div className="tb-l">
            <span className="tb-logo">⬡ ECLIPSE</span>
            <span className="tb-sep">|</span>
            <span className="tb-loc">📍 {gs.location}</span>
          </div>
          <div className="seals-bar">
            <span className="seal-label">SEALS</span>
            {SEALS.map((s,i)=>(
              <div key={i} className={`seal-pip${gs.seals.includes(i)?" found":""}`} title={s.name}>
                {gs.seals.includes(i)?s.icon:"○"}
              </div>
            ))}
          </div>
          <button className="new-btn" onClick={resetGame}>◀ NEW</button>
        </div>

        <div className="main">
          {/* ── SIDEBAR ── */}
          <div className="sidebar">
            <div className="char-head">
              <div className="char-portrait">{CLASS_ICON[selClass]}</div>
              <div className="char-name-d">{charName}</div>
              <div className="char-sub">{selRace} {cls.label}</div>
              <div className="lvl-badge">LV {gs.level}</div>
            </div>
            <div className="stat-block">
              <div className="stat-title">VITALS</div>
              <Bar pct={(gs.hp/gs.maxHp)*100} cls="hp" label="HP" val={`${gs.hp}/${gs.maxHp}`}/>
              <Bar pct={(gs.mp/gs.maxMp)*100} cls="mp" label="MP" val={`${gs.mp}/${gs.maxMp}`}/>
              <Bar pct={xpPct} cls="xp" label="XP" val={`${gs.xp}/${xpNext}`}/>
            </div>
            <div className="attrs">
              <div className="attr"><div className="attr-k">STR</div><div className="attr-v">{gs.str}</div></div>
              <div className="attr"><div className="attr-k">DEX</div><div className="attr-v">{gs.dex}</div></div>
              <div className="attr"><div className="attr-k">INT</div><div className="attr-v">{gs.int}</div></div>
              <div className="attr"><div className="attr-k">WIS</div><div className="attr-v">{gs.wis}</div></div>
            </div>
            <div className="gold-row">🪙 {gs.gold} Gold</div>
            <div className="companions-block">
              <div className="stat-title">PARTY</div>
              {partyComps.length===0
                ? <div className="comp-empty">No allies yet...</div>
                : partyComps.map(co=>(
                  <div key={co.id} className={`comp-card${speakingComp===co.name?" speaking":""}`}>
                    <div className="comp-head">
                      <span className="comp-icon">{co.icon}</span>
                      <div><div className="comp-name">{co.name}</div><div className="comp-class">{co.cls}</div></div>
                    </div>
                    <div className="comp-hp-bar"><div className="comp-hp-fill" style={{width:"100%"}}/></div>
                  </div>
                ))
              }
            </div>
            <div className="inv-block">
              <div className="inv-title">INVENTORY</div>
              <div className="inv-list">
                {gs.inventory.length===0
                  ? <div className="inv-empty">Nothing carried</div>
                  : gs.inventory.map((item,i)=>{
                    const special=SEALS.some(s=>item.includes("Seal"));
                    return <div key={i} className={`inv-item${special?" special":""}`}>{special?"⬡ ":"▸ "}{item}</div>;
                  })
                }
              </div>
            </div>
          </div>

          {/* ── NARRATIVE ── */}
          <div className="narrative">
            <div className="scroll" ref={scrollRef}>
              {apiError&&<div className="error-banner">⚠ API ERROR: {apiError} — check GROQ_API_KEY in Cloudflare Pages settings</div>}

              {entries.map((e,i)=>(
                <div key={i} className={`entry ${e.type}`}>
                  <div className="entry-label">
                    {e.type==="gm"?"◈ GAME MASTER":e.type==="player"?`${charName} ◈`:"◈ WORLD"}
                  </div>

                  {e.type==="gm"&&e.dice!=null&&(
                    <div className="dice-row">
                      <div className={`dice${e.dice>=15?" crit":e.dice<=4?" fail":""}`}>{e.dice}</div>
                      <span className="dice-label">
                        {e.dice>=15?"CRITICAL SUCCESS":e.dice>=8?"PARTIAL SUCCESS":e.dice>=5?"CLOSE CALL":"COMPLICATION"}
                      </span>
                    </div>
                  )}

                  {e.tags?.length>0&&(
                    <div className="tags">{e.tags.map((t,j)=><span key={j} className={`tag ${t.cls}`}>{t.txt}</span>)}</div>
                  )}

                  <div className="entry-text">{e.text}</div>

                  {e.companionLines?.length>0&&(
                    <div className="comp-speech">
                      {e.companionLines.map((cl,j)=>{
                        const co=COMPANIONS.find(c=>c.name===cl.name)||{icon:"💬"};
                        return(
                          <div key={j} className="speech-bubble">
                            <span className="speech-icon">{co.icon}</span>
                            <div className="speech-body">
                              <div className="speech-name">{cl.name}</div>
                              <div className="speech-line">"{cl.line}"</div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  )}

                  {e.type==="gm"&&i===entries.length-1&&suggestions.length>0&&!loading&&(
                    <div className="choices">
                      {suggestions.map((s,j)=>(
                        <button key={j} className="choice-btn" onClick={()=>handleChoice(s)} disabled={loading}>
                          <span className="choice-num">[{j+1}]</span>{s}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              ))}

              {loading&&(
                <div className="entry gm">
                  <div className="entry-label">◈ GAME MASTER</div>
                  <div className="typing"><div className="dot"/><div className="dot"/><div className="dot"/></div>
                </div>
              )}
            </div>

            <div className="inputbar">
              {diceRoll&&(
                <div className={`dice${diceRoll.rolling?" rolling":diceRoll.val>=15?" crit":diceRoll.val<=4?" fail":""}`}
                  style={{flexShrink:0,width:36,height:36,fontSize:"1rem"}}>
                  {diceRoll.rolling?"?":diceRoll.val}
                </div>
              )}
              <div className="in-wrap">
                <textarea className="cmd-input" rows={1} value={input}
                  onChange={e=>setInput(e.target.value)} onKeyDown={handleKey}
                  disabled={loading}
                  placeholder="What do you do? Speak, fight, explore, persuade..."/>
                <div className="cmd-hint">ENTER to send · SHIFT+ENTER new line · or click a choice above</div>
              </div>
              <button className="send-btn" onClick={handleSend} disabled={loading||!input.trim()}>ACT ▶</button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
