/**
 * Kalimat algérien, puzzle de proverbes autonome sans framework.
 * Les données V1 sont provisoires. Chaque entrée définit sa largeur de grille,
 * ses lettres et le chemin témoin de chaque segment du proverbe.
 */
import { reportGameResult } from '@game-platform/game-sdk';

export interface GameResult {
  gameId: 'game-05';
  completed: boolean;
  score: number;
  challengesCompleted: string[];
}

export interface MiniGame {
  mount(container: HTMLElement, onFinish: (result: GameResult) => void): void;
  destroy(): void;
}

interface Segment { id:string; word:string; path:number[] }
interface Proverb {
  id:string;
  emojis:string[];
  phrase:string;
  explanation:string;
  columns:number;
  grid:string;
  segments:Segment[];
}

export const PROVERBS:Proverb[]=[{
  id:'drabni-wa-bka',
  emojis:['👊','😢','⏩','😭'],
  phrase:'Drabni wa bka, sbaqni wa chtka',
  explanation:'Il me frappe puis pleure, il me devance puis se plaint.',
  columns:6,
  grid:'DRABNISAKBAWBAQNIWAKTHCA',
  segments:[
    {id:'drabni',word:'DRABNI',path:[0,1,2,3,4,5]},
    {id:'wa-1',word:'WA',path:[11,10]},
    {id:'bka',word:'BKA',path:[9,8,7]},
    {id:'sbaqni',word:'SBAQNI',path:[6,12,13,14,15,16]},
    {id:'wa-2',word:'WA',path:[17,23]},
    {id:'chtka',word:'CHTKA',path:[22,21,20,19,18]}
  ]
}];

interface Save {
  version:1;
  revision:'proverbs-v1';
  proverb:number;
  found:string[];
  hints:string[];
  finished:boolean;
  awarded:boolean;
  best:number;
}

const SAVE_KEY='etic-kalimat-proverbes-v1';
const fresh=(best=0):Save=>({version:1,revision:'proverbs-v1',proverb:0,found:[],hints:[],finished:false,awarded:false,best});
const logo=new URL('../../../etic-ui-kit/etic-ui/assets/logos/etic-color.svg',import.meta.url).href;
const palette=['red','orange','teal','green','pink','yellow'] as const;

export const adjacent=(a:number,b:number,columns:number)=>{
  const ar=Math.floor(a/columns),ac=a%columns,br=Math.floor(b/columns),bc=b%columns;
  return a!==b&&Math.abs(ar-br)<=1&&Math.abs(ac-bc)<=1;
};
export const pathIsValid=(path:number[],columns:number,size:number)=>path.length>0&&new Set(path).size===path.length&&path.every((cell,index)=>cell>=0&&cell<size&&(index===0||adjacent(path[index-1],cell,columns)));
export const textFromPath=(grid:string,path:number[])=>path.map(index=>grid[index]).join('');
export const scoreFor=(hints:number)=>Math.max(0,100-hints*5);

export function parseSave(raw:string|null):Save|null {
  try {
    if(!raw)return null;
    const save=JSON.parse(raw) as Save,proverb=PROVERBS[save.proverb];
    if(save.version!==1||save.revision!=='proverbs-v1'||!proverb||typeof save.finished!=='boolean'||typeof save.awarded!=='boolean'||!Number.isInteger(save.best)||save.best<0||save.best>100)return null;
    if(!Array.isArray(save.found)||new Set(save.found).size!==save.found.length||save.found.some(id=>!proverb.segments.some(segment=>segment.id===id)))return null;
    if(!Array.isArray(save.hints)||new Set(save.hints).size!==save.hints.length||save.hints.some(id=>!proverb.segments.some(segment=>segment.id===id)))return null;
    const complete=save.found.length===proverb.segments.length;
    if(save.finished!==complete||save.awarded&&!save.finished)return null;
    return save;
  }catch{return null;}
}

const icon=(name:'help'|'bulb'|'erase'|'check')=>{
  const paths={help:'<circle cx="12" cy="12" r="9"/><path d="M9.5 9a2.5 2.5 0 1 1 3.5 2.3c-.8.4-1 1-1 1.7M12 17h.01"/>',bulb:'<path d="M9 18h6M10 22h4M8.5 14.5a6 6 0 1 1 7 0c-1 .8-1.5 1.7-1.5 3.5h-4c0-1.8-.5-2.7-1.5-3.5Z"/>',erase:'<path d="m3 15 8-9 9 8-6 7H8l-5-6ZM8 21l8-9"/>',check:'<path d="m5 12 4 4L19 6"/>'};
  return `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${paths[name]}</svg>`;
};

let teardown:(()=>void)|null=null;

export const miniGame:MiniGame={
  destroy(){teardown?.();teardown=null;},
  mount(container,onFinish){
    miniGame.destroy();
    const root=document.createElement('div');root.className='ka etic-theme';container.append(root);
    const controller=new AbortController(),options={signal:controller.signal};
    let state=(()=>{try{return parseSave(localStorage.getItem(SAVE_KEY))??fresh();}catch{return fresh();}})();
    let selection:number[]=[],hintCell:number|null=null,justFound:string|null=null,dialog:HTMLDialogElement|null=null,storageOK=true;
    let drag:null|{pointer:number;start:number;moved:boolean;matched:boolean;x:number;y:number}=null;
    let statusText='Reliez les lettres pour reconstituer le proverbe.',statusTone='';
    const proverb=()=>PROVERBS[state.proverb];
    const score=()=>scoreFor(state.hints.length);
    const persist=()=>{try{localStorage.setItem(SAVE_KEY,JSON.stringify(state));storageOK=true;}catch{storageOK=false;}};

    root.innerHTML=`<header class="ka-header"><div class="ka-brand"><span class="etic-logo" style="--etic-logo-width:40px"><img class="etic-logo__image" src="${logo}" width="266" height="211" alt="ETIC"></span><span class="ka-brand-copy">KALIMAT<span> ALGÉRIEN</span><small>Les proverbes de chez nous</small></span></div><div class="ka-meta"><span class="ka-pill">V1</span><span class="ka-pill">SCORE <strong id="ka-score">100</strong></span><button class="ka-icon" data-action="help" aria-label="Comment jouer">${icon('help')}</button></div></header><main class="ka-main"><section class="ka-clue etic-brand-card etic-brand-card--wide"><span class="ka-kicker">DEVINEZ LE PROVERBE</span><div id="ka-emojis" class="ka-emojis" aria-label="Indices en emojis"></div><p>Ces emojis représentent un proverbe algérien. Retrouvez ses mots dans la grille.</p></section><section class="ka-words"><div class="ka-section-head"><h2>Le proverbe à compléter</h2><span id="ka-progress"></span></div><div id="ka-words" class="ka-word-list"></div></section><section class="ka-board-card etic-brand-card etic-brand-card--wide"><div id="ka-current" class="ka-current" aria-live="polite"></div><div id="ka-board" class="ka-board"><svg class="ka-trace" viewBox="0 0 100 100" preserveAspectRatio="none" aria-hidden="true"><polyline id="ka-line" points=""></polyline></svg><div id="ka-grid" class="ka-grid" role="grid" aria-label="Grille de lettres"></div></div><div class="ka-actions"><button class="etic-button etic-button--secondary" data-action="hint">${icon('bulb')} Indice</button><button class="etic-button etic-button--quiet" data-action="clear">${icon('erase')} Effacer</button><button class="etic-button" data-action="validate">${icon('check')} Valider</button></div><div id="ka-status" class="ka-status" role="status" aria-live="polite" aria-atomic="true"></div></section><footer class="ka-footer"><span>Glissez, touchez ou utilisez le clavier.</span><span id="ka-save"></span></footer></main>`;

    const $=<T extends HTMLElement=HTMLElement>(selector:string)=>root.querySelector<T>(selector)!;

    function render(){
      const current=proverb(),rows=Math.ceil(current.grid.length/current.columns);
      $('#ka-score').textContent=String(score());
      $('#ka-emojis').innerHTML=current.emojis.map(emoji=>`<span aria-hidden="true">${emoji}</span>`).join('<i aria-hidden="true">+</i>');
      $('#ka-progress').textContent=`${state.found.length} / ${current.segments.length} segments`;
      $('#ka-words').innerHTML=current.segments.map((segment,index)=>{
        const done=state.found.includes(segment.id),color=palette[index%palette.length];
        return `<span class="ka-word color-${color} ${done?'found':''} ${justFound===segment.id?'new':''}" aria-label="${done?`${segment.word}, trouvé`:`Segment de ${segment.word.length} lettres à trouver`}">${done?`${icon('check')} ${segment.word}`:'•'.repeat(segment.word.length)}</span>`;
      }).join('<span class="ka-separator" aria-hidden="true">·</span>');
      const board=$('#ka-board');board.style.setProperty('--ka-cols',String(current.columns));board.style.setProperty('--ka-rows',String(rows));
      $('#ka-grid').innerHTML=Array.from(current.grid).map((letter,index)=>{
        const foundIndex=current.segments.findIndex(segment=>state.found.includes(segment.id)&&segment.path.includes(index));
        const color=foundIndex>=0?palette[foundIndex%palette.length]:null;
        return `<button class="ka-letter ${selection.includes(index)?'selected':''} ${hintCell===index?'hint':''} ${color?`found-cell color-${color}`:''}" data-cell="${index}" role="gridcell" aria-selected="${selection.includes(index)}" aria-label="${letter}, ligne ${Math.floor(index/current.columns)+1}, colonne ${index%current.columns+1}">${letter}</button>`;
      }).join('');
      syncSelection();
      const status=$('#ka-status');status.textContent=statusText;status.className=`ka-status ${statusTone}`;
      $('#ka-save').textContent=storageOK?'Progression enregistrée sur cet appareil':'Sauvegarde indisponible, partie conservée dans cet onglet.';
    }

    function syncSelection(){
      const current=selection.length?textFromPath(proverb().grid,selection):'';
      $('#ka-current').innerHTML=current?`<strong>${current}</strong>`:'<span>Sélectionnez votre première lettre</span>';
      root.querySelectorAll<HTMLButtonElement>('[data-cell]').forEach(cell=>{const active=selection.includes(Number(cell.dataset.cell));cell.classList.toggle('selected',active);cell.setAttribute('aria-selected',String(active));});
      const cols=proverb().columns,rows=Math.ceil(proverb().grid.length/cols);
      $('#ka-line').setAttribute('points',selection.map(index=>`${((index%cols)+.5)/cols*100},${(Math.floor(index/cols)+.5)/rows*100}`).join(' '));
    }

    function setStatus(text:string,tone:''|'error'|'success'=''){statusText=text;statusTone=tone;const node=$('#ka-status');node.textContent='';node.className=`ka-status ${tone}`;queueMicrotask(()=>{if(node.isConnected)node.textContent=text;});}
    function unfinishedMatch(text:string,path:number[]){
      return proverb().segments.find(segment=>segment.word===text&&!state.found.includes(segment.id)&&segment.path.length===path.length&&segment.path.every((cell,index)=>cell===path[index]));
    }

    function addCell(index:number){
      hintCell=null;const columns=proverb().columns;
      if(!selection.length)selection=[index];
      else {
        const last=selection.at(-1)!;
        if(index===last)return false;
        if(selection.length>1&&index===selection.at(-2))selection.pop();
        else if(selection.includes(index)){setStatus('Une case ne peut servir qu’une fois dans le même segment.','error');return false;}
        else if(!adjacent(last,index,columns)){selection=[index];setStatus('Nouvelle sélection : les lettres doivent se toucher.');}
        else selection.push(index);
      }
      syncSelection();const match=unfinishedMatch(textFromPath(proverb().grid,selection),selection);
      if(match){accept(match);return true;}return false;
    }

    function accept(segment:Segment){
      state.found.push(segment.id);justFound=segment.id;selection=[];persist();render();setStatus(`${segment.word} trouvé et validé automatiquement !`,'success');
      window.setTimeout(()=>{justFound=null;if(state.found.length===proverb().segments.length)finish();},360);
    }

    function validateSelection(){
      if(!selection.length){setStatus('Sélectionnez des lettres dans la grille.','error');return;}
      const candidate=textFromPath(proverb().grid,selection),match=unfinishedMatch(candidate,selection);
      if(match){accept(match);return;}
      const already=proverb().segments.find(segment=>segment.word===candidate&&state.found.includes(segment.id));
      selection=[];syncSelection();setStatus(already?`${candidate} a déjà été trouvé.`:`${candidate} ne complète pas le proverbe.`,'error');
    }

    function hint(){
      const target=proverb().segments.find(segment=>!state.found.includes(segment.id)&&!state.hints.includes(segment.id));
      if(!target){setStatus('Tous les indices disponibles ont déjà été utilisés.');return;}
      state.hints.push(target.id);hintCell=target.path[0];persist();render();setStatus(`Le prochain segment commence par ${target.word[0]} et contient ${target.word.length} lettres.`);
      $<HTMLButtonElement>(`[data-cell="${hintCell}"]`).focus({preventScroll:true});
    }

    function clearSelection(){selection=[];hintCell=null;syncSelection();setStatus('Sélection effacée.');}

    function finish(){
      state.finished=true;state.awarded=true;const finalScore=score();state.best=Math.max(state.best,finalScore);persist();
      openDialog('Sahha, proverbe trouvé !',`<div class="ka-result-emoji">${proverb().emojis.join(' ')}</div><blockquote>${proverb().phrase}</blockquote><p>${proverb().explanation}</p><div class="ka-result-score">${finalScore} / 100</div><p>${state.hints.length?`${state.hints.length} indice(s) utilisé(s), soit ${state.hints.length*5} points retirés.`:'Aucun indice utilisé. Score parfait !'}</p>`,`<button class="etic-button" data-action="restart">Rejouer</button><button class="etic-button etic-button--quiet" data-action="close">Voir la grille</button>`);
      onFinish({gameId:'game-05',completed:true,score:finalScore,challengesCompleted:['proverbe-trouve','six-segments',...(state.hints.length===0?['sans-indice']:[])]});
    }

    function openDialog(title:string,body:string,actions='<button class="etic-button" data-action="close">J’ai compris</button>'){
      dialog?.close();const previous=document.activeElement as HTMLElement|null,node=document.createElement('dialog');dialog=node;node.className='ka-dialog etic-brand-card etic-brand-card--paper';node.setAttribute('aria-labelledby','ka-dialog-title');node.innerHTML=`<button class="ka-close" data-action="close" aria-label="Fermer">×</button><h2 id="ka-dialog-title">${title}</h2>${body}<div class="ka-dialog-actions">${actions}</div>`;
      node.addEventListener('close',()=>{node.remove();if(dialog===node)dialog=null;if(previous?.isConnected)previous.focus();},{once:true});node.addEventListener('click',event=>{if(event.target===node)node.close();});root.append(node);node.showModal();
    }

    function showHelp(){openDialog('Devinez le proverbe.',`<p>Les emojis donnent le sens général. Retrouvez ensuite chaque segment du proverbe dans la grille.</p><ol class="etic-instructions"><li>Reliez des lettres voisines, horizontalement, verticalement ou en diagonale.</li><li>Un segment correct est validé automatiquement dès sa dernière lettre.</li><li>Vous pouvez aussi cliquer les lettres une à une et utiliser <strong>Valider</strong>.</li><li>Revenir sur la lettre précédente l’annule. Une case ne peut être utilisée deux fois dans la même sélection.</li></ol><p>Un indice révèle la première case d’un segment et retire 5 points. Une erreur ne retire aucun point.</p>`);}
    function restart(){dialog?.close();state=fresh(state.best);selection=[];hintCell=null;justFound=null;persist();render();setStatus('Nouvelle partie. Devinez le proverbe !');}

    root.addEventListener('click',event=>{
      const button=(event.target as Element).closest<HTMLButtonElement>('button');if(!button||button.disabled)return;const action=button.dataset.action;
      if(action==='help')showHelp();else if(action==='hint')hint();else if(action==='clear')clearSelection();else if(action==='validate')validateSelection();else if(action==='close')dialog?.close();else if(action==='restart')restart();
    },options);

    root.addEventListener('pointerdown',event=>{
      if(dialog)return;const cell=(event.target as Element).closest<HTMLButtonElement>('[data-cell]');if(!cell||event.button!==0)return;
      event.preventDefault();drag={pointer:event.pointerId,start:Number(cell.dataset.cell),moved:false,matched:false,x:event.clientX,y:event.clientY};
    },options);
    document.addEventListener('pointermove',event=>{
      if(!drag||event.pointerId!==drag.pointer||drag.matched)return;
      if(!drag.moved&&Math.hypot(event.clientX-drag.x,event.clientY-drag.y)>5){drag.moved=true;selection=[];drag.matched=addCell(drag.start);}
      if(!drag.moved||drag.matched)return;const cell=document.elementFromPoint(event.clientX,event.clientY)?.closest<HTMLElement>('[data-cell]');if(cell&&root.contains(cell))drag.matched=addCell(Number(cell.dataset.cell));
    },options);
    document.addEventListener('pointerup',event=>{
      if(!drag||event.pointerId!==drag.pointer)return;const {moved,matched,start}=drag;drag=null;if(!moved)addCell(start);else if(!matched)validateSelection();
    },options);
    document.addEventListener('pointercancel',()=>{drag=null;selection=[];syncSelection();},options);

    root.addEventListener('keydown',event=>{
      if(dialog)return;const cell=(event.target as Element).closest<HTMLButtonElement>('[data-cell]');
      if(cell&&['ArrowUp','ArrowDown','ArrowLeft','ArrowRight'].includes(event.key)){
        event.preventDefault();const columns=proverb().columns,index=Number(cell.dataset.cell),delta=event.key==='ArrowUp'?-columns:event.key==='ArrowDown'?columns:event.key==='ArrowLeft'?-1:1,next=index+delta;
        const sameRow=event.key==='ArrowUp'||event.key==='ArrowDown'||Math.floor(next/columns)===Math.floor(index/columns);if(next>=0&&next<proverb().grid.length&&sameRow)$<HTMLButtonElement>(`[data-cell="${next}"]`).focus();return;
      }
      if(cell&&(event.key==='Enter'||event.key===' ')){event.preventDefault();addCell(Number(cell.dataset.cell));}
      else if(event.key==='Backspace'&&selection.length){event.preventDefault();selection.pop();syncSelection();}
      else if(event.key==='Escape'&&selection.length){event.preventDefault();clearSelection();}
    },options);

    teardown=()=>{controller.abort();dialog?.close();persist();root.remove();};
    render();persist();if(state.finished)setStatus(`Proverbe terminé. Meilleur score : ${state.best}/100.`,'success');
  }
};

if(typeof document!=='undefined'){
  const host=document.getElementById('kalimat-algerien');
  if(host)miniGame.mount(host,result=>{
    reportGameResult({gameId:result.gameId,score:result.score,completed:result.completed,metadata:{challengesCompleted:result.challengesCompleted}});
    host.dispatchEvent(new CustomEvent<GameResult>('minigame:finish',{detail:result,bubbles:true,composed:true}));
  });
}
