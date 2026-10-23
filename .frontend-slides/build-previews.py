from pathlib import Path

root = Path(__file__).resolve().parent.parent
base = (root / '.agents/skills/frontend-slides/viewport-base.css').read_text(encoding='utf-8')
out = root / '.frontend-slides/slide-previews'
out.mkdir(parents=True, exist_ok=True)
common = '''*{box-sizing:border-box}body{font-family:Manrope,sans-serif}.slide{padding:90px}header{font-size:26px;letter-spacing:4px;text-transform:uppercase}h1{font-size:145px;line-height:1.03;letter-spacing:-7px;max-width:1320px;margin:135px 0 45px}p{font-size:38px;max-width:1120px;line-height:1.5}footer{position:absolute;bottom:80px;left:90px;font-size:24px;letter-spacing:3px}h1,p{animation:enter .8s both}p{animation-delay:.16s}@keyframes enter{from{opacity:0;transform:translateY(25px)}to{opacity:1;transform:none}}'''
styles = {
'a': ('Electric Studio', ':root{--slide-bg:#fff;--stage-bg:#111}h1{font-weight:800}.slide:after{content:"";position:absolute;inset:760px 0 0;background:#4361ee;z-index:-1}footer{color:white}p{margin-top:0}'),
'b': ('BlockFrame', ':root{--slide-bg:#FFFDF5;--stage-bg:#111}.slide{border:16px solid #000}h1{font-family:Inter,sans-serif;font-weight:900;text-transform:uppercase;font-size:130px;background:#F7CB46;border:4px solid #000;box-shadow:12px 12px #000;padding:45px;margin-top:80px}p{background:#C0F7FE;border:4px solid #000;padding:24px}footer{background:#99E885;padding:15px;transform:rotate(-2deg)}'),
'c': ('Signal Red', ':root{--slide-bg:#171a19;--stage-bg:#101211}.slide{color:#f3f0e6;background:radial-gradient(circle at 95% 10%,#333c35 0,transparent 43%),#171a19}h1{font-family:Manrope,sans-serif;font-weight:800;font-size:155px;max-width:1400px}h1 em{color:#ff6755;font-style:normal}header{color:#e2e8b5}.slide:after{content:"03";position:absolute;right:95px;bottom:40px;color:#313831;font-size:280px;font-weight:800;z-index:-1}footer{border-top:2px solid #78826e;padding-top:26px;width:1400px;color:#d7dac9}')}
for key,(name,css) in styles.items():
    title = 'Vibe code your<br><em>first dApp.</em>' if key=='c' else 'Vibe code your<br>first dApp.'
    html = '<!doctype html><html lang="en"><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>Vibe Code Your First dApp</title><link href="https://fonts.googleapis.com/css2?family=Manrope:wght@400;600;800&family=Inter:wght@800;900&display=swap" rel="stylesheet"><style>'+base+common+css+'</style><main class="deck-viewport"><div class="deck-stage"><section class="slide active"><header>A hands-on workshop · Avalanche Fuji</header><h1>'+title+'</h1><p>My AI journey. A little Web3.<br>Something you can actually build.</p><footer>01 / AI AGENTS &nbsp;&nbsp; 02 / WEB3 &nbsp;&nbsp; 03 / BUILD</footer></section></div></main><script>function fit(){const s=Math.min(innerWidth/1920,innerHeight/1080);document.querySelector(".deck-stage").style.transform=`translate(${(innerWidth-1920*s)/2}px,${(innerHeight-1080*s)/2}px) scale(${s})`}addEventListener("resize",fit);fit();</script></html>'
    (out/f'style-{key}.html').write_text(html,encoding='utf-8')
print('Created three title-slide previews.')
