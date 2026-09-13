/**
 * WORDLE ALGÉRIEN — module de bingo autonome, sans framework.
 * Intégration : miniGame.mount(container, onFinish), puis miniGame.destroy().
 * Charger style.css une seule fois. Le parent garde le meilleur score par gameId.
 * Données provisoires : remplacer WORDS, compléter ACCEPTED_GUESSES,
 * activer STRICT_DICTIONARY et changer DATA_REVISION lors de la validation éditoriale.
 * Les transcriptions ci-dessous sont des exemples de test, pas un lexique validé.
 */
import { reportGameResult } from '@game-platform/game-sdk';
export interface WordEntry { id:string; word:string; explanation:string }
export const DATA_REVISION='mock-v1';
export const WORDS:WordEntry[]=[
 {id:'darja',word:'DARJA',explanation:'Une transcription de « darija », l’arabe parlé au quotidien.'},
 {id:'alger',word:'ALGER',explanation:'La capitale, entre la Casbah et la Méditerranée.'},
 {id:'khobz',word:'KHOBZ',explanation:'Le pain, dans une transcription latine provisoire.'},
 {id:'blida',word:'BLIDA',explanation:'Un nom de ville au pied de l’Atlas blidéen.'},
 {id:'sahha',word:'SAHHA',explanation:'Une expression du quotidien, ici dans une transcription de test.'},
 {id:'setif',word:'SETIF',explanation:'Sétif, écrit sans accent pour la grille.'},
 {id:'makla',word:'MAKLA',explanation:'La nourriture, dans une transcription latine provisoire.'},
 {id:'batna',word:'BATNA',explanation:'Un nom de ville associé aux Aurès.'},
 {id:'houma',word:'HOUMA',explanation:'Le quartier, dans une transcription latine provisoire.'},
 {id:'adrar',word:'ADRAR',explanation:'Un nom de ville du Sahara algérien.'},
 {id:'chwia',word:'CHWIA',explanation:'« Un peu », dans une transcription latine de test.'},
 {id:'leben',word:'LEBEN',explanation:'Un exemple provisoire autour du lait fermenté.'}
];
export const ACCEPTED_GUESSES:string[]=[];
export const STRICT_DICTIONARY=false;
export const SIZE=5, MAX_ATTEMPTS=6;
export type Mark='correct'|'present'|'absent';
export const normalize=(word:string)=>word.normalize('NFD').replace(/[\u0300-\u036f]/g,'').toUpperCase();
const canonical=(word:string)=>/^[A-Z]{5}$/.test(word);
export function evaluateGuess(guess:string,answer:string):Mark[]{
 if(!canonical(guess)||!canonical(answer))throw new Error('Cinq lettres latines sont requises.');
 const marks:Mark[]=Array(SIZE).fill('absent');const remaining=new Map<string,number>();
 for(let i=0;i<SIZE;i++){if(guess[i]===answer[i])marks[i]='correct';else remaining.set(answer[i],(remaining.get(answer[i])??0)+1);}
 for(let i=0;i<SIZE;i++){if(marks[i]!=='correct'&&(remaining.get(guess[i])??0)>0){marks[i]='present';remaining.set(guess[i],remaining.get(guess[i])!-1);}}
 return marks;
}
export function validateGuess(guess:string,guesses:string[]):string|null {
 if(!canonical(guess))return 'Il faut 5 lettres pour proposer un mot.';
 if(guesses.includes(guess))return 'Vous avez déjà essayé ce mot. Tentez une autre piste.';
 if(STRICT_DICTIONARY&&!WORDS.some(w=>w.word===guess)&&!ACCEPTED_GUESSES.includes(guess))return 'Ce mot ne fait pas partie du dictionnaire.';
 return null;
}
export const points=(attempts:number,won:boolean)=>won?Math.max(25,115-15*attempts):0;
export interface GameResult {gameId:'wordle-algerien';completed:boolean;score:number;challengesCompleted:string[]}
export interface MiniGame {mount(container:HTMLElement,onFinish:(result:GameResult)=>void):void;destroy():void}
interface Saved {version:1;revision:string;wordId:string;guesses:string[];draft:string;recorded:boolean;stats:{played:number;won:number;best:number;distribution:number[]}}
export const SAVE_KEY='etic-wordle-algerien-v1';
export const statusOf=(save:Saved):'playing'|'won'|'lost'=>save.guesses.includes(WORDS.find(w=>w.id===save.wordId)!.word)?'won':save.guesses.length>=MAX_ATTEMPTS?'lost':'playing';
export function parseSave(raw:string|null):Saved|null {
 try {
  if(!raw)return null;const s=JSON.parse(raw) as Saved;
  if(s.version!==1||s.revision!==DATA_REVISION||!WORDS.some(w=>w.id===s.wordId)||!Array.isArray(s.guesses)||s.guesses.length>6||s.guesses.some(g=>typeof g!=='string'||!canonical(g))||new Set(s.guesses).size!==s.guesses.length||typeof s.draft!=='string'||!/^[A-Z]{0,5}$/.test(s.draft)||typeof s.recorded!=='boolean')return null;
  const answer=WORDS.find(w=>w.id===s.wordId)!.word;const winning=s.guesses.indexOf(answer);if(winning>=0&&winning!==s.guesses.length-1)return null;
  const ended=statusOf(s)!=='playing';if(s.recorded!==ended||(ended&&s.draft))return null;
  const stats=s.stats;if(!stats||![stats.played,stats.won,stats.best].every(n=>Number.isInteger(n)&&n>=0)||stats.won>stats.played||stats.best>100||!Array.isArray(stats.distribution)||stats.distribution.length!==6||!stats.distribution.every(n=>Number.isInteger(n)&&n>=0)||stats.distribution.reduce((a,b)=>a+b,0)!==stats.won)return null;
  return s;
 }catch{return null;}
}
function load():Saved|null {try{return parseSave(localStorage.getItem(SAVE_KEY));}catch{return null;}}
function chooseWord(previous?:string):string {const pool=WORDS.filter(w=>w.id!==previous);return (pool.length?pool:WORDS)[Math.floor(Math.random()*(pool.length||WORDS.length))].id;}
const asset={
 logo:new URL('../../../etic-ui-kit/etic-ui/assets/logos/etic-color.svg',import.meta.url).href,
  ribbon:new URL('../../../etic-ui-kit/etic-ui/assets/ribbons/warm/ribbon-warm-loop-01.webp',import.meta.url).href,
 geometry:new URL('../../../etic-ui-kit/etic-ui/assets/geometric/modules/module-warm-square.svg',import.meta.url).href
};
const icon=(name:'help'|'chart'|'refresh'|'backspace'|'arrow')=>{
 const paths={help:'<circle cx="12" cy="12" r="9"/><path d="M9.5 8.5a2.5 2.5 0 0 1 5 0c0 2-2.5 2-2.5 4M12 16h.01"/>',chart:'<path d="M4 20V12h4v8M10 20V4h4v16M16 20V8h4v12"/>',refresh:'<path d="M20 7v5h-5M4 17v-5h5M6 7a7 7 0 0 1 12-1l2 6M4 12l2 6a7 7 0 0 0 12-1"/>',backspace:'<path d="M8 5h13v14H8l-7-7 7-7Z M12 9l6 6m0-6-6 6"/>',arrow:'<path d="M4 12h16m-6-6 6 6-6 6"/>'};
 return `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${paths[name]}</svg>`;
};
const labels:Record<Mark,string>={correct:'bien placée',present:'mal placée',absent:'absente'};
const symbol:Record<Mark,string>={correct:'✓',present:'↔',absent:'–'};
const escape=(s:string)=>s.replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]!));
let cleanup:(()=>void)|null=null;
export const miniGame:MiniGame={
 destroy(){cleanup?.();cleanup=null;},
 mount(container,onFinish){
  miniGame.destroy();
  let state:Saved=load()??{version:1,revision:DATA_REVISION,wordId:chooseWord(),guesses:[],draft:'',recorded:false,stats:{played:0,won:0,best:0,distribution:Array(6).fill(0)}};
  let revealing=false;
  const flipTimers=new Set<ReturnType<typeof setTimeout>>();
  const flipAnimations=new Set<Animation>();
  let storageOK=true,liveTimer:ReturnType<typeof setTimeout>|null=null,dialog:HTMLDialogElement|null=null;
  const abort=new AbortController(),options={signal:abort.signal};
  const root=document.createElement('div');root.className='wa etic-theme';container.append(root);
  const answer=()=>WORDS.find(w=>w.id===state.wordId)!;
  function save(){try{localStorage.setItem(SAVE_KEY,JSON.stringify(state));storageOK=true;}catch{storageOK=false;}}
  root.innerHTML=`<header class="wa-header"><a class="wa-brand" href="../wordle-algerien/" aria-label="Wordle algérien, accueil"><span class="etic-logo" style="--etic-logo-width:46px"><img class="etic-logo__image" src="${asset.logo}" width="266" height="211" alt="ETIC"></span><span class="wa-brand-label">BINGO<span>Les mini-jeux du club</span></span></a><nav aria-label="Navigation du jeu"><a class="wa-other" href="../sitting%20placement/">Le Plan de Classe ${icon('arrow')}</a><span class="wa-nav-divider"></span><button class="wa-icon" data-action="stats" aria-label="Mes statistiques">${icon('chart')}</button><button class="wa-icon" data-action="help" aria-label="Comment jouer">${icon('help')}</button></nav></header>
   <main class="wa-main"><section class="wa-intro" aria-labelledby="wa-title"><div class="wa-intro-copy"><div class="wa-eyebrow"><span></span> LES MOTS DE CHEZ NOUS</div><h1 id="wa-title" class="etic-brand-heading">WORDLE<span>ALGÉRIEN<span class="wa-period">.</span></span></h1><p class="wa-tagline">Un mot. Six essais. <span class="etic-brand-heading__accent">À toi de jouer.</span></p></div><div class="wa-intro-art" aria-hidden="true"><img class="etic-brand-artwork" src="${asset.ribbon}" width="521" height="368" alt=""></div></section>
   <div class="wa-layout"><section class="wa-play etic-brand-card etic-brand-card--wide" aria-label="Grille de jeu"><div class="wa-play-heading"><div><span class="wa-section-label">LE MOT À TROUVER</span><h2>5 lettres, à vous de voir.</h2></div><span class="wa-attempt" id="wa-attempt">ESSAI 01 / 06</span></div>
    <div id="wa-grid" class="wa-grid" role="group" aria-label="Six propositions de cinq lettres"></div>
    <div id="wa-message" class="wa-message" role="status" aria-live="polite" aria-atomic="true">Écrivez votre premier mot.</div>
    <div class="wa-keyboard" aria-label="Clavier virtuel">${['AZERTYUIOP','QSDFGHJKLM','⌫WXCVBN↵'].map(row=>`<div class="wa-key-row">${Array.from(row).map(k=>`<button class="wa-key ${k==='⌫'||k==='↵'?'wa-key-wide':''} ${k==='↵'?'wa-key-enter':''}" data-key="${k}" aria-label="${k==='⌫'?'Effacer une lettre':k==='↵'?'Valider le mot':k}">${k==='⌫'?icon('backspace'):k==='↵'?'Entrée':k}</button>`).join('')}</div>`).join('')}</div>
    <div id="wa-end" class="wa-end" hidden></div><div class="wa-play-footer"><span>${icon('help')} Clavier physique ou à l’écran</span><button class="wa-new" data-action="new">${icon('refresh')} Autre mot</button></div></section>
    <aside class="wa-sidebar"><section class="wa-guide etic-brand-card etic-brand-card--paper"><span class="wa-section-label">LE PETIT COUP DE POUCE</span><h2>Suivez les lettres.</h2><p>Après chaque essai, les cases vous indiquent la bonne direction.</p><div class="wa-legend"><div><span class="wa-sample correct">A<small>✓</small></span><span><strong>Bien placée</strong><small>La bonne lettre, au bon endroit.</small></span></div><div><span class="wa-sample present">B<small>↔</small></span><span><strong>Mal placée</strong><small>Dans le mot, mais ailleurs.</small></span></div><div><span class="wa-sample absent">C<small>–</small></span><span><strong>Absente</strong><small>Pas d’autre occurrence à trouver.</small></span></div></div><p class="wa-guide-note">Une lettre peut apparaître plusieurs fois. Chaque occurrence compte.</p><button class="wa-rules-link" data-action="help">Toutes les règles ${icon('arrow')}</button></section>
    <section class="wa-score-card"><img src="${asset.geometry}" width="641" height="641" alt="" aria-hidden="true" class="etic-brand-artwork"><div><span class="wa-section-label">CHAQUE ESSAI COMPTE</span><h2>Le bon mot. <br>Le meilleur score.</h2><p>Jusqu’à 100 points pour le bingo. Moins d’essais, plus de points.</p><button data-action="stats" class="wa-score-link">Mon meilleur score <strong id="wa-best">0 / 100</strong></button></div></section>
    <div class="wa-prototype"><span>VERSION TEST</span><p>Mots et transcriptions provisoires. Le lexique du club arrive bientôt.</p></div></aside></div>
   <footer class="wa-footer"><span>Un jeu de lettres, à notre façon.</span><span id="wa-save-note">Progression enregistrée sur cet appareil</span></footer></main>`;
  const $=<T extends HTMLElement=HTMLElement>(selector:string)=>root.querySelector<T>(selector)!;
  function announce(text:string,error=false){
   if(liveTimer)clearTimeout(liveTimer);const message=$('#wa-message');message.textContent='';message.classList.toggle('wa-message-error',error);
   liveTimer=setTimeout(()=>{message.textContent=text;liveTimer=null;},20);
  }
  function render(){
   const phase=statusOf(state);const current=state.guesses.length;
   $('#wa-grid').innerHTML=Array.from({length:6},(_,r)=>{
    const guess=state.guesses[r];const marks=guess?evaluateGuess(guess,answer().word):null;
    const letters=guess??(r===current?state.draft:'');
    return `<div class="wa-grid-row ${r===current&&phase==='playing'?'wa-row-active':''}" role="group" aria-label="Essai ${r+1}${guess?', '+guess:''}">${Array.from({length:5},(_,i)=>`<span class="wa-cell ${marks?marks[i]:letters[i]?'filled':''} ${!marks&&r===current&&i===state.draft.length?'wa-caret':''}" aria-label="${letters[i]?`${letters[i]}${marks?', '+labels[marks[i]]:''}`:`Lettre ${i+1}, vide`}"><span aria-hidden="true">${letters[i]??''}</span>${marks?`<small aria-hidden="true">${symbol[marks[i]]}</small>`:''}</span>`).join('')}</div>`;
   }).join('');
   $('#wa-attempt').textContent=phase==='playing'?`ESSAI ${String(current+1).padStart(2,'0')} / 06`:phase==='won'?'MOT TROUVÉ ✓':'PARTIE TERMINÉE';
   const keyMarks=new Map<string,Mark>();const rank={absent:0,present:1,correct:2};
   state.guesses.forEach(g=>evaluateGuess(g,answer().word).forEach((mark,i)=>{const old=keyMarks.get(g[i]);if(!old||rank[mark]>rank[old])keyMarks.set(g[i],mark);}));
   root.querySelectorAll<HTMLButtonElement>('[data-key]').forEach(button=>{
    const key=button.dataset.key!;const mark=keyMarks.get(key);button.classList.remove('correct','present','absent');if(mark)button.classList.add(mark);
    if(/^[A-Z]$/.test(key))button.setAttribute('aria-label',`${key}${mark?', '+labels[mark]:''}`);
    button.disabled=phase!=='playing';
   });
   $('#wa-best').textContent=`${state.stats.best} / 100`;
   $('#wa-save-note').textContent=storageOK?'Progression enregistrée sur cet appareil':'Sauvegarde indisponible : la partie reste dans cet onglet.';
   const end=$('#wa-end');end.hidden=phase==='playing';
   if(phase!=='playing')end.innerHTML=`<strong>${phase==='won'?'Bien joué !':'Le mot était'} ${answer().word}${phase==='won'?` · ${points(current,true)} points`:''}</strong><button class="etic-button" data-action="result">Voir le résultat ${icon('arrow')}</button>`;
  }
  function openDialog(title:string,html:string){
   if(dialog)dialog.close();const previous=document.activeElement as HTMLElement|null;const d=document.createElement('dialog');dialog=d;d.className='wa-dialog etic-brand-card etic-brand-card--paper';d.setAttribute('aria-labelledby','wa-dialog-title');
   d.innerHTML=`<button class="wa-dialog-close wa-icon" data-action="close" aria-label="Fermer la fenêtre">×</button><h2 id="wa-dialog-title">${title}</h2>${html}`;
   d.addEventListener('close',()=>{d.remove();if(dialog===d)dialog=null;if(previous?.isConnected&&previous.matches('button,a[href],[tabindex]')&&!previous.hasAttribute('disabled'))previous.focus();else $('[data-action="new"]').focus();},{once:true});
   d.addEventListener('click',e=>{if(e.target===d)d.close();});root.append(d);d.showModal();
  }
  function showHelp(){openDialog('Cinq lettres. Six chances.',`<p>Retrouvez le mot caché en six propositions maximum. Validez avec <strong>Entrée</strong>, corrigez avec <strong>Retour arrière</strong>.</p><ol class="etic-instructions"><li><strong>✓ Bien placée :</strong> gardez cette lettre à cet endroit.</li><li><strong>↔ Mal placée :</strong> essayez cette lettre ailleurs.</li><li><strong>– Absente :</strong> cette occurrence ne figure pas dans le mot.</li></ol><p>Les lettres répétées sont comptées : deux lettres identiques ne sont pas toutes deux signalées si le mot n’en contient qu’une.</p><p>Utilisez les lettres latines. Les accents sont retirés automatiquement. ${STRICT_DICTIONARY?'Les mots sont vérifiés dans le lexique.':'Dans ce prototype, toute proposition de cinq lettres est acceptée.'}</p><div class="wa-help-score">Score selon le nombre d’essais :<br><strong>100 · 85 · 70 · 55 · 40 · 25 points</strong><br>Aucun chronomètre. Une partie perdue vaut 0 point.</div><button class="etic-button" data-action="close">J’ai compris ${icon('arrow')}</button>`);}
  function showStats(){const s=state.stats;openDialog('Vos mots, vos progrès.',`<div class="wa-stats"><div><strong>${s.played}</strong><span>parties finies</span></div><div><strong>${s.played?Math.round(s.won/s.played*100):0}%</strong><span>de réussite</span></div><div><strong>${s.best}</strong><span>meilleur score</span></div></div><h3>Réussites par nombre d’essais</h3><div class="wa-distribution">${s.distribution.map((n,i)=>`<div><span>${i+1}</span><progress max="${Math.max(1,...s.distribution)}" value="${n}" aria-label="${n} victoire(s) en ${i+1} essai(s)"></progress><strong>${n}</strong></div>`).join('')}</div><p>Statistiques locales à cet appareil. Le bingo peut conserver votre meilleur score pour ce jeu.</p><button class="etic-button" data-action="close">Retour au mot</button>`);}
  function showResult(){const won=statusOf(state)==='won';openDialog(won?'Sahha, bien joué !':'On retente le coup ?',`<span class="wa-result-label">${won?'VOUS AVEZ TROUVÉ':'LE MOT À TROUVER ÉTAIT'}</span><div class="wa-result-word">${answer().word}</div><p>${escape(answer().explanation)}</p><div class="wa-result-score"><strong>${points(state.guesses.length,won)}<small> / 100</small></strong><span>${won?`${state.guesses.length} essai${state.guesses.length>1?'s':''} sur 6`:'6 essais sur 6'} · Bingo ETIC</span></div><p class="wa-result-note">Mot de démonstration, à valider par l’équipe conception.</p><div class="wa-dialog-actions"><button class="etic-button" data-action="next">Un autre mot ${icon('arrow')}</button><button class="etic-button etic-button--quiet" data-action="close">Revoir ma grille</button></div>`);}
  function next(){dialog?.close();const prev=state.wordId;state={...state,wordId:chooseWord(prev),guesses:[],draft:'',recorded:false};save();render();announce('Nouveau mot. À vous de jouer !');$<HTMLButtonElement>('[data-key="A"]').focus({preventScroll:true});}
  function requestNext(){if(statusOf(state)==='playing'&&(state.guesses.length||state.draft.length)){openDialog('Passer à un autre mot ?',`<p>La grille en cours sera abandonnée. Vos statistiques et votre meilleur score restent conservés.</p><div class="wa-dialog-actions"><button class="etic-button" data-action="next">Changer de mot</button><button class="etic-button etic-button--quiet" data-action="close">Continuer cette grille</button></div>`);}else next();}
  function revealRow(guess:string,finished:()=>void){
   const grid=$('#wa-grid');
   const row=grid.children[state.guesses.length-1] as HTMLElement;
   const cells=Array.from(row.querySelectorAll<HTMLElement>('.wa-cell'));
   const marks=evaluateGuess(guess,answer().word);
   const finish=()=>{
    if(abort.signal.aborted)return;
    revealing=false;grid.removeAttribute('aria-busy');
    root.querySelectorAll<HTMLButtonElement>('[data-action="new"]').forEach(button=>button.disabled=false);
    render();finished();
   };
   if(window.matchMedia('(prefers-reduced-motion: reduce)').matches||!cells.length||typeof cells[0].animate!=='function'){finish();return;}
   revealing=true;grid.setAttribute('aria-busy','true');row.classList.add('wa-row-revealing');
   root.querySelectorAll<HTMLButtonElement>('[data-key],[data-action="new"]').forEach(button=>button.disabled=true);
   cells.forEach(cell=>cell.classList.remove('wa-caret'));
   announce('Révélation du mot…');
   const turn=async(cell:HTMLElement,i:number)=>{
    try {
     if(abort.signal.aborted)return;
     cell.classList.add('wa-flipping');
     const close=cell.animate([{transform:'rotateX(0deg)'},{transform:'rotateX(-90deg)'}],{duration:250,easing:'ease-in',fill:'forwards'});
     flipAnimations.add(close);await close.finished;flipAnimations.delete(close);
     if(abort.signal.aborted)return;
     // Change the face only when the tile is edge-on, before opening it again.
     cell.style.transform='rotateX(-90deg)';close.cancel();
     cell.classList.remove('filled');cell.classList.add(marks[i]);
     cell.setAttribute('aria-label',`${guess[i]}, ${labels[marks[i]]}`);
     cell.innerHTML=`<span aria-hidden="true">${guess[i]}</span><small aria-hidden="true">${symbol[marks[i]]}</small>`;
     const open=cell.animate([{transform:'rotateX(-90deg)'},{transform:'rotateX(0deg)'}],{duration:250,easing:'ease-out',fill:'forwards'});
     flipAnimations.add(open);await open.finished;flipAnimations.delete(open);
     if(abort.signal.aborted)return;
     cell.style.removeProperty('transform');open.cancel();cell.classList.remove('wa-flipping');
     if(i===cells.length-1)finish();
    }catch{
     // Cancellation is expected when the host unmounts the mini-game.
     if(!abort.signal.aborted&&i===cells.length-1)finish();
    }
   };
   cells.forEach((cell,i)=>{
    const timer=setTimeout(()=>{flipTimers.delete(timer);void turn(cell,i);},i*300);
    flipTimers.add(timer);
   });
  }
  function submit(){
   if(revealing)return;
   const error=validateGuess(state.draft,state.guesses);if(error){announce(error,true);return;}
   const guess=state.draft;state.guesses.push(guess);state.draft='';const phase=statusOf(state);
   let result:GameResult|null=null;
   if(phase!=='playing'&&!state.recorded){const won=phase==='won';state.recorded=true;state.stats.played++;if(won){state.stats.won++;state.stats.distribution[state.guesses.length-1]++;}const score=points(state.guesses.length,won);state.stats.best=Math.max(score,state.stats.best);result={gameId:'wordle-algerien',completed:won,score,challengesCompleted:won?['mot-trouve',...(state.guesses.length<=3?['en-trois-essais']:[])]:[]};}
   save();
   // Keep the submitted letters visible; keyboard colors and result wait for all five flips.
   revealRow(guess,()=>{
    if(phase==='playing'){announce(`${guess}. ${evaluateGuess(guess,answer().word).map((m,i)=>`${guess[i]} ${labels[m]}`).join(', ')}. Essai ${state.guesses.length+1} sur 6.`);}
    else {announce(phase==='won'?`Mot trouvé : ${answer().word}. ${points(state.guesses.length,true)} points.`:`Le mot était ${answer().word}.`);showResult();if(result)onFinish(result);}
   });
  }
  function keypress(key:string){if(revealing)return;if(statusOf(state)!=='playing'||dialog)return;if(key==='↵'){submit();return;}if(key==='⌫')state.draft=state.draft.slice(0,-1);else if(/^[A-Z]$/.test(key)&&state.draft.length<5)state.draft+=key;else return;save();render();}
  root.addEventListener('click',e=>{const button=(e.target as Element).closest<HTMLButtonElement>('button');if(!button||button.disabled||revealing)return;if(button.dataset.key){if(e.detail>0)button.blur();keypress(button.dataset.key);return;}switch(button.dataset.action){case 'help':showHelp();break;case 'stats':showStats();break;case 'new':requestNext();break;case 'next':next();break;case 'result':showResult();break;case 'close':dialog?.close();}},options);
  document.addEventListener('keydown',e=>{
   if(revealing||dialog||e.ctrlKey||e.metaKey||e.altKey||e.isComposing||statusOf(state)!=='playing')return;
   const focused=e.target as HTMLElement;if(focused.closest('input,textarea,select,[contenteditable="true"]')||(!root.contains(focused)&&focused!==document.body))return;
   if((e.key==='Enter'||e.key===' ')&&focused.closest('button,a'))return;
   if(e.key==='Enter'){e.preventDefault();keypress('↵');}else if(e.key==='Backspace'){e.preventDefault();keypress('⌫');}else if(e.key.length===1&&/^[A-Z]$/.test(normalize(e.key))){e.preventDefault();if(focused.closest('button'))focused.blur();keypress(normalize(e.key));}
  },options);
  cleanup=()=>{if(liveTimer)clearTimeout(liveTimer);abort.abort();flipTimers.forEach(timer=>clearTimeout(timer));flipTimers.clear();flipAnimations.forEach(animation=>animation.cancel());flipAnimations.clear();revealing=false;dialog?.close();save();root.remove();};
  save();render();if(statusOf(state)!=='playing')announce(`Partie terminée. Le mot était ${answer().word}.`);
 }
};
if(typeof document!=='undefined'){
 const host=document.getElementById('wordle-algerien');
 if(host)miniGame.mount(host,result=>{reportGameResult(result);host.dispatchEvent(new CustomEvent<GameResult>('minigame:finish',{detail:result,bubbles:true,composed:true}));});
}
