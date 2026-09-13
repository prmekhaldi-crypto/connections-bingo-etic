/**
 * Mini-jeu autonome, sans React ni import externe.
 * Développement : ouvrir /Version/ avec le serveur Vite du projet.
 * TypeScript doit être compilé avant une distribution sans Vite.
 * Intégration bingo : importer miniGame, puis miniGame.mount(container, onFinish).
 * Le parent reçoit un score /100 et conserve le meilleur résultat par gameId.
 */
import { reportGameResult } from '@game-platform/game-sdk';
export type Trait = 'petit'|'grand'|'bavard'|'calme'|'sérieux'|'distrait';
export interface Student { id:string; name:string; traits:Trait[]; bio:string; avatar:number }
type Target = {student:string}|{trait:Trait};
export type Rule = {id:string; description:string} & (
 {type:'rows'; target:Target; rows:number[]} | {type:'neighbor'; trait:Trait; needs:Trait} |
 {type:'together'|'apart'; students:[string,string]} | {type:'relative'; students:[string,string]; relation:'rowGap'|'sameColumn'|'differentColumn'; gap?:number} | {type:'seat'; student:string; seat:number});
export interface Level {id:number; title:string; intro:string; students:Student[]; rules:Rule[]; solution:string[]}
export type Board = (string|null)[];
export interface Result {id:string; status:'satisfied'|'violated'|'pending'; message:string; students:string[]; seats:number[]}

export const rowOf = (seat:number) => Math.floor(seat/4)+1;
export const mateOf = (seat:number) => seat ^ 1;
export function validateRule(level:Level, board:Board, rule:Rule):Result {
 const result:Result={id:rule.id,status:'satisfied',message:'Consigne respectée.',students:[],seats:[]};
 const pending=(msg:string)=>{if(result.status!=='violated'){result.status='pending';result.message=msg;}};
 const fail=(ids:string[],msg:string)=>{result.status='violated';result.message=result.students.length?`${result.message} ${msg}`:msg;result.students.push(...ids);result.seats.push(...ids.map(id=>board.indexOf(id)).filter(i=>i>=0));};
 const name=(id:string)=>level.students.find(s=>s.id===id)!.name;
 if(rule.type==='rows'||rule.type==='seat'){
 const targets=level.students.filter(s=>rule.type==='seat'?s.id===rule.student:('student' in rule.target?s.id===rule.target.student:s.traits.includes(rule.target.trait)));
 for(const s of targets){const pos=board.indexOf(s.id);if(pos<0)pending(`${s.name} reste à placer.`);else if(rule.type==='seat'?pos!==rule.seat:!rule.rows.includes(rowOf(pos)))fail([s.id],rule.type==='seat'?`${s.name} doit occuper la place ${rule.seat+1}.`:`${s.name} doit être en rangée ${rule.rows.join(' ou ')}.`);}
 }else if(rule.type==='neighbor'){
 for(const s of level.students.filter(s=>s.traits.includes(rule.trait))){const pos=board.indexOf(s.id);if(pos<0){pending(`${s.name} reste à placer.`);continue;}const neighbor=board[mateOf(pos)];if(!neighbor){pending(`La place voisine de ${s.name} est encore vide.`);continue;}if(!level.students.find(s=>s.id===neighbor)!.traits.includes(rule.needs))fail([s.id,neighbor],`${s.name} a le badge « ${rule.trait} » : son voisin de table doit avoir le badge « ${rule.needs} ».`);}
 }else if(rule.type==='relative'){const [a,b]=rule.students.map(id=>board.indexOf(id));if(a<0||b<0)pending('Placez les deux élèves pour vérifier leur position relative.');else{const ca=Math.floor(a/2)%2,cb=Math.floor(b/2)%2;const valid=rule.relation==='rowGap'?rowOf(b)-rowOf(a)===rule.gap:rule.relation==='sameColumn'?ca===cb:ca!==cb;if(!valid)fail(rule.students,rule.description);}}else{const [a,b]=rule.students.map(id=>board.indexOf(id));if(a<0||b<0)pending('Les deux élèves doivent être placés pour vérifier cette consigne.');else {const same=Math.floor(a/2)===Math.floor(b/2);if(rule.type==='together'?!same:same)fail(rule.students,`${name(rule.students[0])} et ${name(rule.students[1])} doivent ${rule.type==='together'?'partager une table.':'être à des tables différentes.'}`);}}
 return result;
}
export const validate=(level:Level,board:Board)=>level.rules.map(r=>validateRule(level,board,r));
export const isVictory=(level:Level,board:Board)=>board.length===level.students.length&&level.students.every(s=>board.filter(id=>id===s.id).length===1)&&validate(level,board).every(r=>r.status==='satisfied');
export function place(board:Board,id:string,destination:number|null):Board {const next=[...board];const from=next.indexOf(id);if(destination===null){if(from>=0)next[from]=null;return next;}if(destination<0||destination>=board.length)return next;const displaced=next[destination];if(from>=0)next[from]=displaced;next[destination]=id;return next;}
export interface History {past:Board[];present:Board;future:Board[]}
export function history(h:History, action:{type:'move';board:Board}|{type:'undo'|'redo'}):History {
 if(action.type==='move')return JSON.stringify(h.present)===JSON.stringify(action.board)?h:{past:[...h.past,h.present],present:action.board,future:[]};
 if(action.type==='undo'&&h.past.length)return {past:h.past.slice(0,-1),present:h.past.at(-1)!,future:[h.present,...h.future]};
 if(action.type==='redo'&&h.future.length)return {past:[...h.past,h.present],present:h.future[0],future:h.future.slice(1)};return h;
}

const names=['Lina','Adam','Inès','Noé','Maya','Sami','Jade','Hugo','Zoé','Amir','Lou','Émile','Nora','Léo','Aya','Oscar'];
const bios=['Collectionne les jolies feuilles.','Imagine des fusées en papier.','Dessine des mondes minuscules.','Connaît mille histoires de dragons.','Aime les énigmes et les abricots.','Fabrique des cabanes imaginaires.','Observe les nuages à la récré.','Rêve de rencontrer une baleine.','Invente des noms aux étoiles.','Adore les livres d’aventures.','Sait faire des oiseaux en papier.','Dessine des cartes au trésor.','Aime les petites bêtes du jardin.','Trouve toujours une nouvelle rime.','Imagine des villes dans les arbres.','Collectionne les mots amusants.'];
const profiles:Trait[][]=[
 ['bavard','sérieux'],['calme','distrait','grand'],['bavard','sérieux','grand'],['calme','sérieux'],
 ['bavard','sérieux'],['calme','distrait','petit'],['bavard','sérieux','petit'],['calme','sérieux'],
 ['bavard','sérieux'],['calme','distrait','petit'],['bavard','distrait','petit'],['calme','distrait','grand'],
 ['bavard','distrait','grand'],['calme','distrait'],['bavard','sérieux'],['calme','distrait']
];
const relative=(id:string,a:number,b:number,relation:'rowGap'|'sameColumn'|'differentColumn',description:string,gap?:number):Rule=>({id,type:'relative',students:[`s${a}`,`s${b}`],relation,description,gap});
export const levels:Level[]=[{
 id:1,title:'La classe idéale · Défi extrême',
 intro:'16 élèves, 12 contraintes croisées. Les colonnes désignent les tables de gauche (A, C, E, G) ou de droite (B, D, F, H), vues depuis le fond de la classe. Aucun ordre dans la réserve ne donne la solution.',
 students:names.map((name,i):Student=>({id:`s${i}`,name,traits:profiles[i],bio:bios[i],avatar:i})),
 rules:[
 {id:'small',type:'rows',target:{trait:'petit'},rows:[1,2],description:'Les petits occupent les rangées 1 ou 2.'},
 {id:'tall',type:'rows',target:{trait:'grand'},rows:[3,4],description:'Les grands occupent les rangées 3 ou 4.'},
 {id:'talk',type:'neighbor',trait:'bavard',needs:'calme',description:'Chaque bavard a un voisin de table calme.'},
 {id:'focus',type:'neighbor',trait:'distrait',needs:'sérieux',description:'Chaque distrait a un voisin de table sérieux.'},
 relative('r1',10,0,'rowGap','Lina est exactement une rangée derrière Lou.',1),
 relative('r3',0,4,'rowGap','Maya est exactement deux rangées derrière Lina.',2),
 relative('r5',6,2,'rowGap','Inès est exactement deux rangées derrière Jade.',2),
 relative('r7',13,9,'rowGap','Amir est exactement une rangée derrière Léo.',1),
 relative('r9',9,1,'rowGap','Adam est exactement deux rangées derrière Amir.',2),
 relative('c4',13,9,'differentColumn','Léo et Amir sont dans des colonnes de tables différentes.'),
 {id:'apart',type:'apart',students:['s14','s9'],description:'Aya et Amir ne partagent pas leur table.'},
 {id:'together',type:'together',students:['s12','s7'],description:'Nora et Hugo doivent partager une table.'}
 ],
 solution:[10,3,6,13,0,9,14,5,12,7,2,15,4,11,8,1].map(i=>`s${i}`)
}];
/** Fisher–Yates: independent of names, traits and the solution. Stable between moves. */
export function shuffleStudents(students:Student[]):Student[]{
 const result=[...students];
 for(let i=result.length-1;i>0;i--){const j=Math.floor(Math.random()*(i+1));[result[i],result[j]]=[result[j],result[i]];}
 return result;
}

export type SolveResult={status:'solved';board:Board;nodes:number}|{status:'unsatisfiable'|'timeout';nodes:number};
export function solve(level:Level,initial:Board,budget=200000):SolveResult {
 const board=[...initial];let nodes=0,expired=false;
 if(board.length!==level.students.length||board.some(id=>id!==null&&!level.students.some(s=>s.id===id))||new Set(board.filter(Boolean)).size!==board.filter(Boolean).length)return {status:'unsatisfiable',nodes};
 const visit=():Board|null=>{if(++nodes>budget){expired=true;return null;}if(validate(level,board).some(r=>r.status==='violated'))return null;
 if(board.every(Boolean))return isVictory(level,board)?[...board]:null;
 let bestId='',bestSeats:number[]=[];
 for(const student of level.students.filter(s=>!board.includes(s.id))){const options:number[]=[];for(let seat=0;seat<board.length;seat++){if(board[seat])continue;board[seat]=student.id;const valid=!validate(level,board).some(r=>r.status==='violated');board[seat]=null;if(valid)options.push(seat);}if(!options.length)return null;if(!bestId||options.length<bestSeats.length){bestId=student.id;bestSeats=options;}}
 for(const seat of bestSeats){board[seat]=bestId;const answer=visit();board[seat]=null;if(answer)return answer;if(expired)return null;}return null;};
 const answer=visit();return answer?{status:'solved',board:answer,nodes}:{status:expired?'timeout':'unsatisfiable',nodes};
}
export type Hint={status:'hint';student:string;seat:number|null;repair:boolean;message:string}|{status:'complete'|'timeout'|'unsatisfiable';message:string};
export function getHint(level:Level,board:Board,budget=200000):Hint {
 if(isVictory(level,board))return {status:'complete',message:'Tout semble en ordre. Cliquez sur Vérifier !'};
 const compatible=solve(level,board,budget);if(compatible.status==='timeout')return {status:'timeout',message:'La recherche a atteint sa limite. Essayez de libérer une place, puis redemandez un indice.'};
 let solution=compatible;const repair=compatible.status==='unsatisfiable';if(repair)solution=solve(level,Array(board.length).fill(null),budget);
 if(solution.status!=='solved')return {status:solution.status,message:solution.status==='timeout'?'La recherche a atteint sa limite. Réessayez après un déplacement.':'Aucune solution trouvée pour ce niveau.'};
 if(repair){const seat=board.findIndex((id,i)=>id&&id!==solution.board[i]);const id=board[seat]!;return {status:'hint',student:id,seat:null,repair:true,message:`Un placement doit être revu. Remettez ${level.students.find(s=>s.id===id)!.name} dans la réserve : sa place diffère d’un plan valide.`};}
 const seat=board.findIndex(id=>!id);const id=solution.board[seat]!;return {status:'hint',student:id,seat,repair:false,message:`Essayez ${level.students.find(s=>s.id===id)!.name} à la place ${seat+1}, en rangée ${Math.floor(seat/4)+1}. Une solution reste possible avec ce placement.`};
}

export interface GameResult {
 gameId: 'plan-de-classe';
 completed: boolean;
 score: number;
 challengesCompleted: string[];
}
export interface MiniGame {
 mount(container: HTMLElement, onFinish: (result: GameResult) => void): void;
 destroy(): void;
}
interface LocalState {
 version: 1;
 board: Board;
 hints: number;
 checks: number;
 best: number;
 won: boolean;
}
const level=levels[0];
// Local URLs are resolved by Vite in both standalone and bingo integrations.
const eticLogo=new URL('../../../etic-ui-kit/etic-ui/assets/logos/etic-color.svg',import.meta.url).href;
const eticResultRibbon=new URL('../../../etic-ui-kit/etic-ui/assets/stickers/stickers-03.svg',import.meta.url).href;
const eticGameRibbon=new URL('../../../etic-ui-kit/etic-ui/assets/ribbons/warm/ribbon-warm-oversized.webp',import.meta.url).href;

const SAVE_KEY='bingo-plan-de-classe-3files-v1';
const traitIcons:Record<Trait,string>={petit:'↧',grand:'↥',bavard:'☏',calme:'❧',sérieux:'✎',distrait:'☁'};
const escapeHTML=(value:string)=>value.replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]!));
function avatar(i:number):string {
 const skin=['#efbb91','#bc805b','#dfaa80','#86573f'][i%4];
 const shirt=['#dc8568','#719baf','#d2b64b','#82986d'][i%4];
 const hair=['#483b32','#604230','#ad7040','#292d2c'][i%4];
 return `<svg viewBox="0 0 80 80" aria-hidden="true"><circle cx="40" cy="40" r="38" fill="#eee4d1"/><path d="M12 80Q12 56 40 56Q68 56 68 80" fill="${shirt}"/><path d="M34 52h12v13q-6 7-12 0" fill="${skin}"/><ellipse cx="40" cy="35" rx="21" ry="25" fill="${skin}"/><path d="${i%2?'M19 31Q10 6 39 7Q65 5 62 32L53 21L44 25L32 19Z':'M19 32Q12 7 36 8Q60 1 63 30Q50 28 44 18Q36 32 19 32'}" fill="${hair}"/><circle cx="32" cy="36" r="2" fill="#34352e"/><circle cx="48" cy="36" r="2" fill="#34352e"/><path d="M34 47q6 5 12 0" fill="none" stroke="#8f503f" stroke-width="2" stroke-linecap="round"/>${i%4===2?'<g fill="none" stroke="#474f49" stroke-width="2"><circle cx="31" cy="36" r="7"/><circle cx="49" cy="36" r="7"/><path d="M38 36h4"/></g>':''}${i%3===0?'<path d="m58 17 9-6v15l-9-5-7 5V11Z" fill="#d7785d"/>':''}</svg>`;
}
function readState():LocalState|null {
 try {
  const raw=localStorage.getItem(SAVE_KEY);if(!raw)return null;
  const s=JSON.parse(raw) as LocalState;
  if(s.version!==1||!Array.isArray(s.board)||s.board.length!==16||s.board.some(id=>id!==null&&!level.students.some(p=>p.id===id))||new Set(s.board.filter(Boolean)).size!==s.board.filter(Boolean).length)return null;
  if(![s.hints,s.checks,s.best].every(n=>Number.isInteger(n)&&n>=0)||s.best>100||typeof s.won!=='boolean'||(s.won&&!isVictory(level,s.board)))return null;
  return s;
 } catch {return null;}
}
function scoreFor(s:LocalState):number {return 60+Math.max(0,30-s.hints*5)+(s.checks===1?10:0);}

/** A Worker uses this same source file: no fourth source file is needed. */
if(typeof document==='undefined') {
 const context=globalThis as unknown as {onmessage:((e:MessageEvent<Board>)=>void)|null;postMessage:(data:Hint)=>void};
 context.onmessage=e=>{try{context.postMessage(getHint(level,e.data));}catch{context.postMessage({status:'timeout',message:'La recherche a été interrompue. Réessayez.'});}};
}

let teardown:(()=>void)|null=null;
export const miniGame:MiniGame={
 destroy(){teardown?.();teardown=null;},
 mount(container,onFinish){
  miniGame.destroy();
  const root=document.createElement('div');root.className='plan-game etic-theme';container.append(root);
  const controller=new AbortController();const options={signal:controller.signal};
  let state:LocalState=readState()??{version:1,board:Array(16).fill(null),hints:0,checks:0,best:0,won:false};
  let h:History={past:[],present:state.board,future:[]};
  let order=shuffleStudents(level.students),selected:string|null=null;
  let results:Result[]|null=null,message='',hint:Hint|null=null,worker:Worker|null=null,busy=false;
  let storageOK=true,workerTimeout:ReturnType<typeof setTimeout>|null=null,modalFocus:HTMLElement|null=null;
  function stopWorker(){worker?.terminate();worker=null;busy=false;if(workerTimeout!==null)clearTimeout(workerTimeout);workerTimeout=null;}
  function save(){state.board=[...h.present];try{localStorage.setItem(SAVE_KEY,JSON.stringify(state));storageOK=true;}catch{storageOK=false;}}
  function clear(){stopWorker();results=null;hint=null;message='';}
  function restoreFocus(key:string|null){if(!key)return;root.querySelectorAll<HTMLElement>('[data-key]').forEach(el=>{if(el.dataset.key===key)el.focus({preventScroll:true});});}
  function move(id:string,to:number|null){
   if(!level.students.some(s=>s.id===id)||state.won)return;
   h=history(h,{type:'move',board:place(h.present,id,to)});selected=null;clear();save();render();
   restoreFocus(to===null?`student-${id}`:`seat-${to}`);
  }
  function startNew(){clear();state={version:1,board:Array(16).fill(null),hints:0,checks:0,best:state.best,won:false};h={past:[],present:state.board,future:[]};order=shuffleStudents(level.students);selected=null;save();render();restoreFocus('restart');}
  function studentCard(s:Student,seat?:number){
   const bad=results?.some(r=>r.status==='violated'&&r.students.includes(s.id));
   return `<button class="student etic-brand-card etic-brand-card--caption ${seat!==undefined?'seated':''} ${selected===s.id?'selected':''} ${bad?'error':''}" data-student="${s.id}" data-key="${seat===undefined?'student-'+s.id:'seat-'+seat}" ${seat===undefined?'':`data-destination="${seat}"`} draggable="${!state.won}" aria-pressed="${selected===s.id}" aria-label="${escapeHTML(`${s.name}, ${s.traits.join(', ')}. ${s.bio}${seat===undefined?' Dans la réserve.':` Place ${seat+1}.`}`)}">${avatar(s.avatar)}<span class="student-info"><strong>${s.name}</strong><span class="badges">${s.traits.map(t=>`<span class="badge etic-badge ${t}">${traitIcons[t]} ${t}</span>`).join('')}</span></span>${seat===undefined?'<span class="grip" aria-hidden="true">⠿</span>':''}</button>`;
  }
  function render(){
   const active=document.activeElement as HTMLElement|null;const focusKey=root.contains(active)?active?.dataset.key??null:null;
   const rosterScroll=root.querySelector('.student-list');const scrollTop=rosterScroll?.scrollTop??0,scrollLeft=rosterScroll?.scrollLeft??0;
   const remaining=order.filter(s=>!h.present.includes(s.id));
   const selectedStudent=level.students.find(s=>s.id===selected);
   root.innerHTML=`<header class="topbar"><div class="brand"><span class="etic-logo" style="--etic-logo-width:64px"><img class="etic-logo__image" src="${eticLogo}" alt="ETIC"></span><span>Le Plan de Classe<small>BINGO DU CLUB</small></span></div><nav><button data-action="help" data-key="help">Comment jouer</button><button data-action="score" data-key="score">★ ${state.best}/100</button></nav></header>
   <main class="game"><section class="level-heading"><div class="game-heading-copy"><span class="eyebrow">BINGO ETIC / DÉFI EXTRÊME</span><h1 class="etic-brand-heading">LE PLAN DE CLASSE</h1><span class="etic-brand-heading__accent game-heading-accent">À chaque élève, sa place.</span></div><div class="game-heading-art" aria-hidden="true"><img class="etic-brand-artwork" src="${eticGameRibbon}" width="1335" height="1600" alt=""></div></section><p class="game-intro">${level.intro}</p><div class="game-layout">
   <aside class="roster"><div class="panel-title"><h2>Les élèves</h2><span class="count">${remaining.length} à placer</span></div><p class="muted">L’ordre de la réserve est mélangé.</p><div class="student-list">${remaining.map(s=>studentCard(s)).join('')||'<div class="empty"><strong>✓ Tout le monde est assis !</strong><span>Vérifiez votre plan.</span></div>'}</div><button class="reserve ${selected?'ready':''}" data-action="reserve" data-key="reserve" data-reserve="true" ${!selected||!h.present.includes(selected)||state.won?'disabled':''}>↶ Remettre dans la réserve</button><div class="profile">${selectedStudent?`<strong>${selectedStudent.name}</strong><p>${selectedStudent.bio}</p><span>Choisissez une place, même occupée, pour déplacer ou échanger.</span>`:'Sélectionnez un élève pour découvrir son portrait.'}</div></aside>
   <section class="classroom" aria-label="Plan de la classe"><div class="room-top"><span class="room-label">NOTRE CLASSE</span><div class="etic-progress placed-count"><label class="etic-progress__label" for="plan-seated">${16-remaining.length} / 16 élèves installés</label><progress id="plan-seated" class="etic-progress__track" value="${16-remaining.length}" max="16"></progress></div></div><div class="blackboard"><span>Chaque place compte !</span><small>À vous de composer la classe.</small><span class="board-doodle">✧</span><span class="chalk"></span></div><div class="teacher"><span class="book"></span><span>Bureau du professeur</span><span>✎</span></div><div class="orientation">↑ DEVANT · CÔTÉ TABLEAU</div><div class="rows">${[0,1,2,3].map(r=>`<div class="class-row"><div class="row-label">RANGÉE ${r+1}</div><div class="tables">${[0,1].map(t=>`<div class="desk"><div class="desk-title">TABLE ${String.fromCharCode(65+r*2+t)} · ${t===0?'GAUCHE':'DROITE'}</div><div class="seats">${[0,1].map(side=>{
    const pos=r*4+t*2+side;const student=level.students.find(s=>s.id===h.present[pos]);
    return `<div class="seat ${selected?'destination':''} ${hint?.status==='hint'&&hint.seat===pos?'hint-target':''}" data-drop="${pos}">${student?studentCard(student,pos)+`<span class="seat-number" aria-hidden="true">${pos+1}</span>`:`<button class="empty-seat" data-destination="${pos}" data-key="seat-${pos}" aria-label="Place ${pos+1}, table ${String.fromCharCode(65+r*2+t)}, rangée ${r+1}"><span class="seat-plus">+</span><small>Place ${pos+1}</small></button>`}</div>`;
   }).join('')}</div></div>`).join('')}</div></div>`).join('')}</div><div class="orientation back">DERRIÈRE ↓</div><div class="room-tip">${selectedStudent?`${selectedStudent.name} est sélectionné(e). Choisissez une place.`:'Glissez un élève ou sélectionnez-le, puis choisissez une place.'}</div></section>
   <aside class="instructions"><div class="paper etic-brand-card etic-brand-card--paper"><div class="panel-title"><h2>Les 12 contraintes</h2><span>✎</span></div><p class="memo-subtitle">Chaque détail compte.</p><div class="rule-list">${level.rules.map((rule,i)=>{const result=results?.find(r=>r.id===rule.id);return `<div class="rule ${result?.status??''}"><span class="rule-marker">${result?result.status==='satisfied'?'✓':result.status==='violated'?'!':'…':i+1}</span><div><p>${rule.description}</p>${result?`<small>${result.status==='pending'?'En attente · ':''}${escapeHTML(result.message)}</small>`:''}</div></div>`;}).join('')}</div><div class="memo-note">Un voisin est uniquement l’autre élève de la même table. Les badges sont fictifs et n’imposent que les contraintes indiquées.</div></div></aside></div>
   <div class="action-bar"><div class="history-actions"><button data-action="undo" data-key="undo" ${!h.past.length||state.won?'disabled':''}>↶ Annuler</button><button data-action="redo" data-key="redo" ${!h.future.length||state.won?'disabled':''}>↷ Refaire</button><button data-action="restart" data-key="restart">⟳ Recommencer</button></div><div><button class="hint-button etic-button etic-button--secondary" data-action="hint" data-key="hint" aria-busy="${busy}" ${busy||state.won?'disabled':''}>${busy?'Recherche…':'☀ Indice'}</button><button class="primary etic-button" data-action="verify" data-key="verify">✓ ${state.won?'Voir le résultat':'Vérifier le plan'}</button></div></div>
   <div class="feedback" role="status" aria-live="polite" aria-atomic="true"></div><footer class="game-footer"><span>${state.hints} indice(s) · ${state.checks} vérification(s) · Meilleur score ${state.best}/100</span><span>${storageOK?'Progression enregistrée sur cet appareil':'Sauvegarde indisponible ; partie conservée dans cet onglet.'}</span></footer></main>`;
   root.querySelectorAll<HTMLButtonElement>('[data-action]').forEach(button=>{if(!button.classList.contains('brand')&&!button.classList.contains('reserve')&&!button.classList.contains('etic-button'))button.classList.add('etic-button','etic-button--quiet');});
   const list=root.querySelector('.student-list');if(list){list.scrollTop=scrollTop;list.scrollLeft=scrollLeft;}
   const live=root.querySelector('.feedback');if(live){const text=[message,hint?.message].filter(Boolean).join(' ');queueMicrotask(()=>{if(live.isConnected)live.innerHTML=text?`<p class="etic-status">${escapeHTML(text)}</p>`:'';});}
   restoreFocus(focusKey);
  }
  function openDialog(title:string,body:string,actions='<button class="primary etic-button" data-action="close">Compris</button>'){
   root.querySelector('dialog')?.remove();modalFocus=document.activeElement as HTMLElement;
   const dialog=document.createElement('dialog');dialog.className='etic-brand-card etic-brand-card--paper';dialog.setAttribute('aria-labelledby','plan-dialog-title');
   dialog.innerHTML=`<button class="close" data-action="close" aria-label="Fermer la fenêtre">×</button><h2 id="plan-dialog-title">${title}</h2>${body}<div class="dialog-actions">${actions}</div>`;
   dialog.addEventListener('close',()=>{dialog.remove();if(modalFocus?.isConnected)modalFocus.focus();},{once:true});
   dialog.addEventListener('click',event=>{if(event.target===dialog)dialog.close();});dialog.querySelectorAll('button').forEach(button=>{if(!button.classList.contains('etic-button'))button.classList.add('etic-button','etic-button--quiet');});root.append(dialog);dialog.showModal();
  }
  function showWin(){openDialog('Tout le monde a sa place !',`<img class="etic-brand-artwork result-art" src="${eticResultRibbon}" width="304" height="216" alt="" aria-hidden="true"><p>Les 12 contraintes sont respectées. Défi extrême réussi !</p><div class="win-score">${scoreFor(state)} / 100 points</div><p>60 points de réussite + ${Math.max(0,30-state.hints*5)} points d’indices économisés + ${state.checks===1?10:0} points de première vérification.</p><p>Meilleur score : ${state.best}/100.</p>`,'<button class="primary etic-button" data-action="new">Rejouer le défi</button><button data-action="close">Voir ma classe</button>');}
  function verifyPlan(){
   if(state.won){showWin();return;}
   clear();state.checks++;results=validate(level,h.present);
   const remaining=h.present.filter(id=>!id).length;
   if(isVictory(level,h.present)){
    state.won=true;const score=scoreFor(state);state.best=Math.max(state.best,score);save();render();showWin();
    const result:GameResult={gameId:'plan-de-classe',completed:true,score,challengesCompleted:[...level.rules.map(r=>r.id),...(state.hints===0?['sans-indice']:[]),...(state.checks===1?['premiere-verification']:[])]};
    onFinish(result);
   }else{message=`${remaining} élève(s) à placer. ${results.filter(r=>r.status==='violated').length} contrainte(s) à revoir. ${results.filter(r=>r.status==='pending').length} en attente.`;save();render();}
  }
  function requestHint(){
   if(busy||state.won)return;
   stopWorker();hint=null;
   try {
    worker=new Worker(new URL('./main.ts',import.meta.url),{type:'module'});busy=true;render();
    const fail=()=>{stopWorker();hint={status:'timeout',message:'Recherche indisponible ou trop longue. Aucun point retiré ; réessayez après un déplacement.'};render();};
    worker.onerror=fail;workerTimeout=setTimeout(fail,10000);
    worker.onmessage=(event:MessageEvent<Hint>)=>{const answer=event.data;stopWorker();hint=answer;if(answer.status==='hint'){state.hints++;save();}render();};
    worker.postMessage(h.present);
   }catch{stopWorker();hint={status:'timeout',message:'Le moteur d’indices est indisponible. Aucun point retiré.'};render();}
  }
  root.addEventListener('click',event=>{
   const target=(event.target as Element).closest<HTMLElement>('button');if(!target||target.hasAttribute('disabled'))return;
   const action=target.dataset.action;
   if(action){
    if(action==='close'){root.querySelector('dialog')?.close();return;}
    if(action==='help'){openDialog('Bienvenue, professeur !','<p>Sélectionnez un élève puis une place, ou glissez-le à la souris. Une place occupée échange les élèves. Sélectionnez un élève assis puis « Remettre dans la réserve » pour le retirer.</p><p>Au clavier : Tab pour naviguer, Entrée ou Espace pour choisir. Échap ferme cette fenêtre. Annuler et Refaire permettent d’expérimenter.</p><p>Les erreurs apparaissent uniquement après Vérifier : ✓ respectée, ! violée, … en attente. Le plan doit être complet pour gagner. Les indices donnent une piste sans la jouer.</p><p>Score : 60 points pour réussir, 30 points moins 5 par indice utile (minimum 0), et 10 points si la toute première vérification réussit. Aucun bonus de vitesse.</p>');return;}
    if(action==='score'){openDialog('Les points du bingo',`<p>Meilleur score local : <strong>${state.best}/100</strong>.</p><p>Réussite : 60 points. Réserve d’indices : 30 points, moins 5 par indice fourni. Première vérification réussie : 10 points.</p><p>Rejouer démarre une nouvelle tentative. Le meilleur score est conservé. Les déplacements, Annuler et Refaire ne coûtent aucun point.</p>`);return;}
    if(action==='new'){startNew();return;}
    if(action==='restart'){openDialog('Recommencer le défi ?','<p>Le plan sera vidé, la réserve mélangée et le score de cette tentative remis à zéro. Votre meilleur score sera conservé.</p>','<button class="primary etic-button" data-action="new">Recommencer</button><button data-action="close">Continuer ma partie</button>');return;}
    if(action==='reserve'){if(selected)move(selected,null);return;}
    if(action==='verify'){verifyPlan();return;}
    if(action==='hint'){requestHint();return;}
    if((action==='undo'||action==='redo')&&!state.won){h=history(h,{type:action});selected=null;clear();save();render();return;}
   }
   if(state.won)return;
   const student=target.dataset.student,destination=target.dataset.destination;
   if(destination!==undefined&&selected&&selected!==student){move(selected,Number(destination));return;}
   if(student){selected=selected===student?null:student;render();return;}
   if(destination!==undefined){message='Sélectionnez d’abord un élève.';render();}
  },options);
  root.addEventListener('dragstart',event=>{
   const e=event as DragEvent;const button=(e.target as Element).closest<HTMLElement>('[data-student]');
   if(!button||state.won){e.preventDefault();return;}selected=button.dataset.student!;e.dataTransfer?.setData('text/plain',selected);if(e.dataTransfer)e.dataTransfer.effectAllowed='move';
   root.querySelectorAll('.student.selected').forEach(el=>el.classList.remove('selected'));button.classList.add('selected');
   root.querySelectorAll('.seat').forEach(el=>el.classList.add('destination'));
  },options);
  root.addEventListener('dragover',event=>{if((event.target as Element).closest('[data-drop],[data-reserve]')&&!state.won)event.preventDefault();},options);
  root.addEventListener('drop',event=>{
   const e=event as DragEvent;const target=(e.target as Element).closest<HTMLElement>('[data-drop],[data-reserve]');if(!target)return;
   e.preventDefault();const id=e.dataTransfer?.getData('text/plain');if(id)move(id,target.dataset.drop!==undefined?Number(target.dataset.drop):null);
  },options);
  root.addEventListener('dragend',()=>{render();},options);
  teardown=()=>{stopWorker();save();controller.abort();root.querySelector('dialog')?.close();root.remove();};
  render();
 }
};

// Auto-mount only the standalone page. Importing this module in a bingo has no UI side effects.
if(typeof document!=='undefined'){
 const host=document.getElementById('plan-de-classe');
 if(host)miniGame.mount(host,result=>{reportGameResult(result);host.dispatchEvent(new CustomEvent<GameResult>('minigame:finish',{detail:result,bubbles:true,composed:true}));});
}
