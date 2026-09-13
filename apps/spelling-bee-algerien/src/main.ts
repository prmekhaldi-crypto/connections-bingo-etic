/**
 * Spelling Bee algérien, mini-jeu autonome sans framework.
 * Lexique provisoire : remplacer WORDS après validation éditoriale du club.
 */
import { reportGameResult } from '@game-platform/game-sdk';

export interface GameResult {
  gameId:'game-06';
  completed:boolean;
  score:number;
  challengesCompleted:string[];
}
export interface MiniGame {mount(container:HTMLElement,onFinish:(result:GameResult)=>void):void;destroy():void}

export const CENTER='E';
export const LETTERS=['E','A','L','G','R','I','N'] as const;
export const WORDS=[
  'AGILE','AIGLE','AIRE','ALGER','ALGERIE','ALGERIEN','ALGERIENNE','ALLER','ANNEE','ARGILE',
  'ENERGIE','ERIGER','GAGNER','GARE','GELER','GENIE','GENERER','GRAINE','GRELE','LAINE',
  'LARGE','LIEN','LIER','LIGNE','LIRE','RAGE','RANGER','REEL','REGAL','REGNE','REGNER','REINE','RELIER'
] as const;

const allowed=new Set<string>(LETTERS),dictionary=new Set<string>(WORDS);
export const isPangram=(word:string)=>LETTERS.every(letter=>word.includes(letter));
export const wordPoints=(word:string)=>word.length===4?1:word.length+(isPangram(word)?7:0);
export const MAX_POINTS=WORDS.reduce((sum,word)=>sum+wordPoints(word),0);
export const normalizedScore=(points:number)=>Math.min(100,Math.round(points/MAX_POINTS*100));
export function validateWord(word:string,found:string[]):string|null {
  if(word.length<4)return 'Les mots doivent contenir au moins 4 lettres.';
  if(!word.includes(CENTER))return `La lettre centrale ${CENTER} est obligatoire.`;
  if(Array.from(word).some(letter=>!allowed.has(letter)))return 'Utilisez uniquement les sept lettres de la ruche.';
  if(found.includes(word))return 'Ce mot a déjà été trouvé.';
  if(!dictionary.has(word as typeof WORDS[number]))return 'Ce mot ne fait pas partie du lexique provisoire.';
  return null;
}

interface Save {version:1;revision:'mock-v1';found:string[];best:number;awarded:boolean}
const SAVE_KEY='etic-spelling-bee-algerien-v1';
const fresh=(best=0):Save=>({version:1,revision:'mock-v1',found:[],best,awarded:false});
export function parseSave(raw:string|null):Save|null {
  try{
    if(!raw)return null;const save=JSON.parse(raw) as Save;
    if(save.version!==1||save.revision!=='mock-v1'||!Array.isArray(save.found)||new Set(save.found).size!==save.found.length||save.found.some(word=>!dictionary.has(word as typeof WORDS[number]))||!Number.isInteger(save.best)||save.best<0||save.best>100||typeof save.awarded!=='boolean')return null;
    if(save.awarded!==(save.found.length===WORDS.length))return null;
    return save;
  }catch{return null;}
}

const logo=new URL('../../../etic-ui-kit/etic-ui/assets/logos/etic-color.svg',import.meta.url).href;
const icon=(name:'help'|'stats'|'delete'|'shuffle')=>{
  const paths={help:'<circle cx="12" cy="12" r="9"/><path d="M9.5 9a2.5 2.5 0 1 1 3.5 2.3c-.8.4-1 1-1 1.7M12 17h.01"/>',stats:'<path d="M4 20v-7h4v7M10 20V5h4v15M16 20v-10h4v10"/>',delete:'<path d="M8 5h13v14H8l-7-7 7-7Zm4 4 6 6m0-6-6 6"/>',shuffle:'<path d="M16 3h5v5M4 7h3c5 0 5 10 10 10h4M16 21h5v-5M4 17h3c2 0 3-1 4-3m2-4c1-2 2-3 4-3h4"/>'};
  return `<svg width="19" height="19" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${paths[name]}</svg>`;
};

const ranks=[
  {at:0,name:'Départ'},{at:.02,name:'Bonne piste'},{at:.08,name:'Ça chauffe'},{at:.15,name:'Solide'},
  {at:.25,name:'Super'},{at:.4,name:'Excellent'},{at:.55,name:'Incroyable'},{at:.7,name:'Génial'},{at:1,name:'Reine des mots'}
];
const rankFor=(points:number)=>[...ranks].reverse().find(rank=>points/MAX_POINTS>=rank.at)??ranks[0];

let teardown:(()=>void)|null=null;
export const miniGame:MiniGame={
  destroy(){teardown?.();teardown=null;},
  mount(container,onFinish){
    miniGame.destroy();
    const root=document.createElement('div');root.className='sb etic-theme';container.append(root);
    const controller=new AbortController(),options={signal:controller.signal};
    let state=(()=>{try{return parseSave(localStorage.getItem(SAVE_KEY))??fresh();}catch{return fresh();}})();
    let draft='',outer=LETTERS.slice(1),dialog:HTMLDialogElement|null=null,storageOK=true,message='La lettre centrale est obligatoire.',tone='';
    const points=()=>state.found.reduce((sum,word)=>sum+wordPoints(word),0);
    const persist=()=>{try{localStorage.setItem(SAVE_KEY,JSON.stringify(state));storageOK=true;}catch{storageOK=false;}};

    root.innerHTML=`<header class="sb-header"><div class="sb-brand"><span class="etic-logo" style="--etic-logo-width:40px"><img class="etic-logo__image" src="${logo}" width="266" height="211" alt="ETIC"></span><span class="sb-brand-copy">SPELLING BEE ALGÉRIEN<span>Les mots de chez nous</span></span></div><div class="sb-header-actions"><button class="sb-icon" data-action="stats" aria-label="Statistiques">${icon('stats')}</button><button class="sb-icon" data-action="help" aria-label="Comment jouer">${icon('help')}</button></div></header><main class="sb-main"><section class="sb-heading"><h1 class="etic-brand-heading">SPELLING BEE<span>Version algérienne</span></h1><p>Composez le plus de mots possible avec sept lettres. La lettre du centre doit toujours être utilisée.</p></section><div class="sb-layout"><section class="sb-play etic-brand-card etic-brand-card--wide" aria-label="Ruche de lettres"><div class="sb-prompt"><div id="sb-word" class="sb-word" aria-live="polite"></div><div id="sb-message" class="sb-message" role="status" aria-live="polite" aria-atomic="true"></div></div><div id="sb-hive" class="sb-hive" aria-label="Sept lettres disponibles"></div><div class="sb-controls"><button class="etic-button etic-button--secondary" data-action="delete">${icon('delete')} Effacer</button><button class="etic-button etic-button--secondary sb-shuffle" data-action="shuffle" aria-label="Mélanger les lettres">${icon('shuffle')}</button><button class="etic-button" data-action="submit">Valider</button></div><p class="sb-play-note">Mots de 4 lettres minimum · E obligatoire · Les lettres peuvent être répétées.<br>Lexique provisoire pour tester le mini-jeu.</p></section><section class="sb-results"><div class="sb-progress"><div class="sb-rank-line"><span>VOTRE PROGRESSION</span><strong id="sb-rank"></strong></div><div class="sb-score-line"><span id="sb-points" class="sb-score-disc">0</span><div class="sb-score-copy"><strong id="sb-normalized">0 / 100 pour le bingo</strong><span id="sb-next"></span></div></div><progress id="sb-progress" class="sb-progress-track" max="${MAX_POINTS}" value="0" aria-label="Progression"></progress><div class="sb-ranks"><span>Départ</span><span>Super</span><span>Génial</span><span>Reine</span></div></div><div class="sb-list-head"><h2>Vos mots</h2><span id="sb-count">0 mot</span></div><div id="sb-found" class="sb-found-list"></div></section></div><footer class="sb-footer"><span>Le lexique sera remplacé après validation par l’équipe conception.</span><span id="sb-save"></span></footer></main>`;
    const $=<T extends HTMLElement=HTMLElement>(selector:string)=>root.querySelector<T>(selector)!;

    function announce(text:string,newTone:''|'error'|'success'=''){message=text;tone=newTone;const node=$('#sb-message');node.textContent='';node.className=`sb-message ${tone}`;queueMicrotask(()=>{if(node.isConnected)node.textContent=text;});}
    function renderWord(){
      $('#sb-word').innerHTML=draft?Array.from(draft).map(letter=>`<span class="${letter===CENTER?'center':''}">${letter}</span>`).join(''):'<span style="color:var(--etic-muted);font-size:15px;letter-spacing:0">Votre mot</span>';
    }
    function renderHive(){
      $('#sb-hive').innerHTML=`<button class="sb-letter center" data-letter="${CENTER}" aria-label="${CENTER}, lettre centrale obligatoire">${CENTER}</button>${outer.map((letter,index)=>`<button class="sb-letter p${index}" data-letter="${letter}" aria-label="Lettre ${letter}">${letter}</button>`).join('')}`;
    }
    function render(){
      renderWord();renderHive();
      const total=points(),rank=rankFor(total),percent=normalizedScore(total);
      $('#sb-rank').textContent=rank.name;$('#sb-points').textContent=String(total);$('#sb-normalized').textContent=`${percent} / 100 pour le bingo`;$('#sb-progress').setAttribute('value',String(total));
      const next=ranks.find(item=>item.at>total/MAX_POINTS);$('#sb-next').textContent=next?`${Math.max(1,Math.ceil(next.at*MAX_POINTS)-total)} point(s) avant « ${next.name} »`:'Tous les mots ont été trouvés.';
      $('#sb-count').textContent=`${state.found.length} mot${state.found.length>1?'s':''}`;
      $('#sb-found').innerHTML=state.found.length?`<div class="sb-words">${[...state.found].sort((a,b)=>a.localeCompare(b,'fr')).map(word=>`<span class="sb-found ${isPangram(word)?'pangram':''}"><span>${word}</span><small>+${wordPoints(word)}${isPangram(word)?' · pangramme':''}</small></span>`).join('')}</div>`:`<div class="sb-empty"><strong>Votre liste est vide</strong><p>Commencez par un mot de quatre lettres contenant ${CENTER}.</p></div>`;
      const status=$('#sb-message');status.textContent=message;status.className=`sb-message ${tone}`;$('#sb-save').textContent=storageOK?'Progression enregistrée sur cet appareil':'Sauvegarde indisponible, partie conservée dans cet onglet.';
    }

    function type(letter:string){if(state.awarded)return;draft+=letter;renderWord();announce('');}
    function erase(){if(state.awarded)return;draft=draft.slice(0,-1);renderWord();if(!draft)announce('La lettre centrale est obligatoire.');}
    function shuffle(){
      if(state.awarded)return;const next=[...outer];for(let i=next.length-1;i>0;i--){const j=Math.floor(Math.random()*(i+1));[next[i],next[j]]=[next[j],next[i]];}outer=next;renderHive();announce('Les lettres extérieures ont été mélangées.');
    }
    function submit(){
      if(state.awarded)return;const word=draft,error=validateWord(word,state.found);draft='';renderWord();
      if(error){announce(error,'error');return;}
      state.found.push(word);const gained=wordPoints(word),pangram=isPangram(word);persist();render();announce(`${word} : +${gained} point${gained>1?'s':''}${pangram?' et pangramme !':''}`,'success');
      if(state.found.length===WORDS.length)finish();
    }
    function finish(){
      const final=normalizedScore(points());state.awarded=true;state.best=Math.max(state.best,final);persist();
      openDialog('Reine des mots !',`<p>Vous avez retrouvé les ${WORDS.length} mots du lexique provisoire.</p><div class="sb-result-score">${final} / 100</div><div class="sb-result-word">Pangrammes : ${WORDS.filter(isPangram).join(', ')}</div>`,`<button class="etic-button" data-action="restart">Rejouer</button><button class="etic-button etic-button--quiet" data-action="close">Voir mes mots</button>`);
      onFinish({gameId:'game-06',completed:true,score:final,challengesCompleted:['tous-les-mots','pangramme',...(state.found.length===WORDS.length?['reine-des-mots']:[])]});
    }
    function restart(){dialog?.close();state=fresh(state.best);draft='';outer=LETTERS.slice(1);persist();render();announce('Nouvelle partie. La lettre centrale est obligatoire.');}

    function openDialog(title:string,body:string,actions='<button class="etic-button" data-action="close">J’ai compris</button>'){
      dialog?.close();const previous=document.activeElement as HTMLElement|null,node=document.createElement('dialog');dialog=node;node.className='sb-dialog etic-brand-card etic-brand-card--paper';node.setAttribute('aria-labelledby','sb-dialog-title');node.innerHTML=`<button class="sb-close" data-action="close" aria-label="Fermer">×</button><h2 id="sb-dialog-title">${title}</h2>${body}<div class="sb-dialog-actions">${actions}</div>`;
      node.addEventListener('close',()=>{node.remove();if(dialog===node)dialog=null;if(previous?.isConnected)previous.focus();},{once:true});node.addEventListener('click',event=>{if(event.target===node)node.close();});root.append(node);node.showModal();
    }
    function help(){openDialog('Comment jouer',`<p>Créez des mots avec les sept lettres de la ruche.</p><ol class="etic-instructions"><li>Chaque mot contient au moins quatre lettres.</li><li>La lettre centrale <strong>${CENTER}</strong> est obligatoire.</li><li>Une lettre peut être utilisée plusieurs fois.</li><li>Un mot utilisant les sept lettres est un pangramme et rapporte 7 points bonus.</li></ol><h3>Points</h3><p>Un mot de 4 lettres rapporte 1 point. Un mot plus long rapporte 1 point par lettre. Le lexique actuel est provisoire.</p>`);}
    function stats(){openDialog('Votre progression',`<div class="sb-result-score">${normalizedScore(points())} / 100</div><p>${state.found.length} mot(s) trouvé(s) sur ${WORDS.length}. ${points()} points de jeu sur ${MAX_POINTS}.</p><div class="sb-result-word">Meilleur score local : ${state.best}/100</div>`,`<button class="etic-button" data-action="close">Continuer</button><button class="etic-button etic-button--quiet" data-action="restart">Recommencer</button>`);}

    root.addEventListener('click',event=>{
      const button=(event.target as Element).closest<HTMLButtonElement>('button');if(!button||button.disabled)return;
      if(button.dataset.letter)type(button.dataset.letter);else if(button.dataset.action==='delete')erase();else if(button.dataset.action==='shuffle')shuffle();else if(button.dataset.action==='submit')submit();else if(button.dataset.action==='help')help();else if(button.dataset.action==='stats')stats();else if(button.dataset.action==='close')dialog?.close();else if(button.dataset.action==='restart')restart();
    },options);
    document.addEventListener('keydown',event=>{
      if(dialog||event.ctrlKey||event.metaKey||event.altKey||event.isComposing)return;
      const focused=event.target as HTMLElement;if(focused.closest('input,textarea,select,[contenteditable="true"]')||(!root.contains(focused)&&focused!==document.body))return;
      if((event.key==='Enter'||event.key===' ')&&focused.closest('button'))return;
      const letter=event.key.toUpperCase();if(allowed.has(letter)){event.preventDefault();type(letter);}else if(event.key==='Backspace'){event.preventDefault();erase();}else if(event.key==='Enter'){event.preventDefault();submit();}
    },options);

    teardown=()=>{controller.abort();dialog?.close();persist();root.remove();};
    persist();render();if(state.awarded)announce(`Tous les mots ont été trouvés. Meilleur score : ${state.best}/100.`,'success');
  }
};

if(typeof document!=='undefined'){
  const host=document.getElementById('spelling-bee-algerien');
  if(host)miniGame.mount(host,result=>{
    reportGameResult({gameId:result.gameId,score:result.score,completed:result.completed,metadata:{challengesCompleted:result.challengesCompleted}});
    host.dispatchEvent(new CustomEvent<GameResult>('minigame:finish',{detail:result,bubbles:true,composed:true}));
  });
}
