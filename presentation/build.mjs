// Build the portable HTML deck. Run: node presentation/build.mjs
import { readFileSync, writeFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import path from 'node:path';
const dir = path.dirname(fileURLToPath(import.meta.url));
const read = name => readFileSync(path.join(dir, name), 'utf8');
const slides = JSON.parse(read('slides.json'));
const esc = value => String(value ?? '').replace(/[&<>"']/g, ch => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[ch]));
const fontCSS = [['Inter','inter',100,900],['Space Grotesk','spacegrotesk',300,700]].map(([name,file,min,max]) => `/* ${read(`fonts/${file}-OFL.txt`).replaceAll('*/','* /')} */\n@font-face{font-family:'${name}';src:url(data:font/ttf;base64,${readFileSync(path.join(dir,`fonts/${file}.ttf`)).toString('base64')}) format('truetype');font-weight:${min} ${max};font-style:normal;font-display:swap}`).join('\n');
const art = [1,2,3].map(n => 'data:image/svg+xml;base64,' + readFileSync(path.join(dir, `../app/public/art/art${n}.svg`)).toString('base64'));
const sourceURL = source => source.startsWith('../') ? 'https://github.com/Poom5741/vibe-dapp-workshop/blob/master/' + source.slice(3) : source;
let editIndex = 0;
const editable = (tag, text, cls='') => `<${tag} class="${cls}" data-edit="text-${editIndex++}">${esc(text)}</${tag}>`;
const steps = (items, cls='') => `<div class="steps ${cls}">${items.map((item,i) => `<div class="step" data-step="${i}"><span class="step-number">${String(i+1).padStart(2,'0')}</span>${editable('h3',item[0],item[0].includes('/')?'literal':'')}${editable('p',item[1])}</div>`).join('')}</div>`;
function body(slide) {
  const items = slide.items || [];
  switch(slide.type) {
    case 'cover': return `<div class="cover-mark" aria-hidden="true"><i></i><i></i><i></i></div>${editable('p',slide.label,'eyebrow')}${editable('h1',slide.title)}${editable('p',slide.subtitle,'subtitle')}<div class="cover-bottom"><span>01 / AI AGENTS</span><span>02 / WEB3</span><span>03 / BUILD</span></div>`;
    case 'section': return `<span class="chapter-number" aria-hidden="true">${esc(slide.number)}</span>${editable('h2',slide.title)}${editable('p',slide.subtitle,'subtitle')}`;
    case 'statement': return `${editable('h2',slide.title)}${editable('p',slide.subtitle,'subtitle')}`;
    case 'agenda': case 'timeline': case 'exercise': return `<div class="rows ${slide.type}">${items.map((item,i)=>`<div class="row" data-step="${i}"><span class="row-index">${esc(item[0])}</span><div>${editable('h3',item[1])}${editable('p',item[2])}</div></div>`).join('')}</div>`;
    case 'split': return `<div class="split"><div>${editable('h3',slide.leftTitle,'column-title')}${slide.left.map(text=>editable('p',text,'point')).join('')}</div><div data-step="1">${editable('h3',slide.rightTitle,'column-title')}${slide.right.map(text=>editable('p',text,'point')).join('')}</div></div>`;
    case 'flow': case 'loop': case 'mintflow': case 'compare3': return steps(items,slide.type);
    case 'ledger': return `${editable('p',slide.subtitle,'subtitle')}${steps(items,'ledger')}<div class="copies" data-step="3"><span>Node A · same rules</span><span>Node B · same rules</span><span>Node C · same rules</span></div>`;
    case 'rules': case 'network': return `${slide.subtitle ? editable('p',slide.subtitle,'subtitle') : ''}<div class="metrics">${items.map((item,i)=>`<div data-step="${i}">${editable('h3',item[0],item[0].includes('/')?'literal':'')}${editable('p',item[1])}</div>`).join('')}</div>`;
    case 'consensus': return `${editable('p',slide.subtitle,'subtitle')}<div class="consensus-visual"><div class="validator central">Validator</div><div class="samples" data-step="1"><div class="validator">Peer A</div><div class="validator">Peer B</div><div class="validator">Peer C</div></div><div class="decision" data-step="2">Sample again<br><strong>Build confidence</strong></div><div class="decision final" data-step="3">Threshold reached<br><strong>Accept block</strong></div></div>`;
    case 'math': return `<div class="price">${items.map((item,i)=>`<div data-step="${i}">${editable('h3',item[0],item[0].includes('/')?'literal':'')}${editable('p',item[1])}</div>`).join('')}</div>`;
    case 'product': return `<div class="product-layout"><div>${editable('p',slide.subtitle,'subtitle')}${items.map(item=>`<div class="product-point">${editable('h3',item[0])}${editable('p',item[1])}</div>`).join('')}</div><div class="mock-app"><div class="mock-header">Vibe Pioneers <span>Fuji</span></div><div class="art-strip">${art.map((src,i)=>`<figure><img src="${src}" alt="Workshop fallback artwork ${i+1}"><figcaption>#00${i+1}</figcaption></figure>`).join('')}</div><div class="mock-mint"><span>Quantity: 1</span><span>0.01 test AVAX</span></div><div class="mock-button">Connect Wallet → Mint</div><p class="mock-caption">Conceptual preview · not connected</p></div></div>`;
    case 'tokens': return `${editable('p',slide.subtitle,'subtitle')}<div class="coin-row" aria-hidden="true">${[0,1,2,3,4].map(i=>`<span class="coin" data-step="${i > 1 ? 1 : 0}">WT</span>`).join('')}</div>${steps(items,'token-values')}`;
    case 'nfts': return `${editable('p',slide.subtitle,'subtitle')}<div class="nft-row">${items.map((item,i)=>`<figure data-step="${i}"><img src="${art[i]}" alt="Illustrative NFT ${esc(item[0])}"><figcaption>${editable('h3',item[0])}${editable('p',item[1])}</figcaption></figure>`).join('')}</div>`;
    case 'prompt': return editable('blockquote',slide.quote);
    case 'commands': return `<div class="commands">${slide.commands.map(item=>`<div>${editable('p',item[0],'command-label')}${editable('pre',item[1])}</div>`).join('')}</div>${items.length ? steps(items,'checks') : ''}`;
    case 'troubleshoot': case 'appendix': case 'sources': return `<div class="reference-rows">${items.map(item=>`<div>${editable('h3',item[0],item[0].includes('/')?'literal':'')}${editable('p',item[1])}</div>`).join('')}</div>`;
    default: throw new Error(`Unknown slide type: ${slide.type}`);
  }
}
const htmlSlides = slides.map((slide,i)=>`<!-- === SLIDE ${i+1}: ${esc(slide.title.replaceAll('\n',' '))} === -->
<section class="slide ${slide.type}${i===0?' active':''}" data-title="${esc(slide.title.replaceAll('\n',' '))}" aria-label="${i+1}. ${esc(slide.title.replaceAll('\n',' '))}" aria-hidden="${i!==0}"${i?' inert':''}>
${slide.type==='cover'?'':`<header><span>${esc(slide.chapter)}</span><span>VIBE CODE YOUR FIRST DAPP</span></header>`}
<div class="slide-content">${['cover','section','statement'].includes(slide.type)?'':editable('h2',slide.title)}${body(slide)}</div>
${slide.type==='cover'?'':`<footer><span>${esc(slide.footer || 'Vibe Code Your First dApp · Avalanche Fuji')}</span><span>${String(i+1).padStart(2,'0')}</span></footer>`}
<template><h2>${esc(slide.title.replaceAll('\n',' '))}</h2><p>${esc(slide.notes)}</p>${slide.sources?.length?`<h3>Sources</h3><ul>${slide.sources.map(source=>`<li><a href="${esc(sourceURL(source))}" target="_blank" rel="noopener noreferrer">${esc(source)}</a></li>`).join('')}</ul>`:''}</template>
</section>`).join('\n');
const html = `<!doctype html>
<!-- ${read('THIRD_PARTY_NOTICES.md').replaceAll('--','—')} -->
<html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><meta name="description" content="A beginner workshop: personal AI journey, Web3 foundations and building an NFT dApp on Avalanche Fuji."><meta name="color-scheme" content="light"><title>Vibe Code Your First dApp — Workshop</title>
<style>/* === EMBEDDED OPEN FONTS: SIL OPEN FONT LICENSE === */
${fontCSS}
${read('viewport-base.css')}
${read('styles.css')}
</style></head><body>
<main class="deck-viewport" aria-label="Workshop slides"><div class="deck-stage">${htmlSlides}</div></main>
<div id="progress" aria-hidden="true"></div>
<nav class="deck-controls" aria-label="Presentation controls">
<button id="previous" title="Previous step (Left arrow)" aria-label="Previous step">←</button>
<span id="counter"></span><button id="next" title="Next step (Right arrow or Space)" aria-label="Next step">→</button>
<label class="sr-only" for="slideSelect">Jump to slide</label><select id="slideSelect" title="Jump to slide"></select>
<button id="notesToggle" aria-expanded="false" aria-controls="notes" title="Notes are visible on this screen (N)">Notes</button>
<button id="fullscreen" title="Fullscreen (F)">⛶</button><span id="stepLabel"></span>
</nav>
<aside id="notes" hidden aria-label="Speaker notes"><button id="closeNotes" aria-label="Close notes">×</button><p class="notes-warning">Speaker notes · visible on this screen</p><div id="notesContent"></div></aside>
<div class="edit-hotzone" aria-hidden="true"></div><button id="editToggle" class="edit-toggle" aria-pressed="false" title="Edit slide text (E)">Edit</button><button id="save" hidden>Export HTML</button>
<p id="status" role="status"></p><p id="announcement" class="sr-only" aria-live="polite"></p>
<noscript>This presentation needs JavaScript enabled for navigation.</noscript>
<script>${read('runtime.js')}</script></body></html>`;
writeFileSync(path.join(dir,'index.html'),html);
console.log(`Built ${slides.length} slides in presentation/index.html (${Math.round(Buffer.byteLength(html)/1024)} KB).`);
