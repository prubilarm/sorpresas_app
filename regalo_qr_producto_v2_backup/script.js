(() => {
  const c = window.REGALO || {};
  const $ = id => document.getElementById(id);
  const text = (id, value='') => { const el=$(id); if(el) el.textContent=value; };
  const safeDate = value => {
    const d = new Date(`${value || '2026-01-01'}T12:00:00`);
    return Number.isNaN(d.getTime()) ? new Date() : d;
  };
  const startDate=safeDate(c.fechaInicio);
  const dateLabel=startDate.toLocaleDateString('es-CL',{day:'2-digit',month:'long',year:'numeric'}).replace(' de ',' ').replace(' de ',' ');
  document.title=c.producto || 'Nuestra historia';
  text('startTitle',c.producto || 'Nuestra historia');
  text('startNames',`${c.persona1 || 'NOMBRE 1'} & ${c.persona2 || 'NOMBRE 2'}`);
  ['brand1','final1'].forEach(id=>text(id,c.persona1));
  ['brand2','final2'].forEach(id=>text(id,c.persona2));
  text('displayDate',dateLabel);
  text('heroTitle',c.tituloInicio || 'El comienzo de nuestra historia');
  text('heroSubtitle',c.subtituloInicio || 'El comienzo de una relación que ha ido creciendo poco a poco.');
  const cover=$('coverPhoto'); cover.src=c.portada || 'assets/fotos/portada.svg';
  cover.onerror=()=>{cover.src='assets/fotos/portada.svg'};
  text('letterHeading',c.cartaEncabezado || 'Te amo');
  text('letterTitle',c.cartaTitulo || 'Para ti');
  const body=$('letterBody');
  (c.carta || []).forEach(paragraph=>{const p=document.createElement('p');p.textContent=paragraph;body.appendChild(p)});
  text('signature',c.firma || 'Con todo mi amor');
  text('videoHeading',c.videoTitulo || 'Nuestros recuerdos especiales');
  text('videoIntro',c.videoIntroduccion || 'Haz clic abajo para volver a vivir uno de nuestros mejores momentos.');
  text('videoCaption',c.videoPie || 'Un pedacito de nuestra historia, guardado para siempre.');
  text('finalMessage',c.mensajeFinal || 'Volvería a elegirte una y otra vez.');
  text('finalTitle',c.tituloFinal || 'Siempre tú');

  const totalMs = Math.max(0, Date.now()-startDate.getTime());
  const totalDays = Math.floor(totalMs/86400000);
  let years=new Date().getFullYear()-startDate.getFullYear();
  let anniversary=new Date(startDate); anniversary.setFullYear(startDate.getFullYear()+years);
  if(anniversary>new Date()){years--;anniversary.setFullYear(anniversary.getFullYear()-1)}
  let months=0; const cursor=new Date(anniversary);
  while(months<11){const next=new Date(cursor);next.setMonth(next.getMonth()+1);if(next>new Date())break;cursor.setMonth(cursor.getMonth()+1);months++}
  const days=Math.max(0,Math.floor((Date.now()-cursor.getTime())/86400000));
  text('years',years);text('months',months);text('days',days);

  const gallery=$('photoGallery');
  const photos=(c.fotos || []).filter(p=>p && p.src);
  if(!photos.length){$('fotos').style.display='none'}
  photos.forEach((p,i)=>{
    const fig=document.createElement('figure');fig.className='memory-card reveal';
    const img=document.createElement('img');img.src=p.src;img.alt=`Recuerdo ${i+1}`;img.loading='lazy';
    img.onerror=()=>{fig.remove()};
    const cap=document.createElement('figcaption');cap.textContent=p.texto || '';
    fig.append(img,cap);gallery.appendChild(fig);
  });

  const video=$('specialVideo'), empty=$('videoEmpty');
  if(c.video && c.video.src){video.src=c.video.src; video.poster=c.video.poster || c.portada || ''; empty.style.display='none'} else {video.style.display='none'}
  const reveal=$('revealVideo'), videoCard=$('videoCard');
  reveal.addEventListener('click',()=>{
    const opening=videoCard.classList.contains('is-collapsed');
    videoCard.classList.toggle('is-collapsed',!opening);videoCard.setAttribute('aria-hidden',String(!opening));
    reveal.innerHTML=opening?'<span>♥</span> Ocultar video':'<span>♥</span> Pulsa aquí ✨';
    if(opening)setTimeout(()=>videoCard.scrollIntoView({behavior:'smooth',block:'center'}),250); else video.pause();
  });

  const showSite=()=>{$('startScreen').classList.add('is-hidden');$('site').classList.remove('is-hidden');document.body.style.overflow='';setTimeout(observe,30)};
  $('startScreen').addEventListener('click',showSite);$('startScreen').addEventListener('keydown',e=>{if(e.key==='Enter'||e.key===' '){e.preventDefault();showSite()}});
  $('restart').addEventListener('click',()=>{window.scrollTo({top:0,behavior:'smooth'});setTimeout(()=>{$('site').classList.add('is-hidden');$('startScreen').classList.remove('is-hidden')},500)});

  function observe(){
    const io=new IntersectionObserver(entries=>entries.forEach(e=>{if(e.isIntersecting)e.target.classList.add('is-visible')}),{threshold:.12});
    document.querySelectorAll('.reveal').forEach(el=>io.observe(el));
  }
  setInterval(()=>{
    if($('site').classList.contains('is-hidden'))return;
    const h=document.createElement('span');h.className='floating-heart';h.textContent=Math.random()>.35?'♥':'❤';h.style.left=`${Math.random()*100}%`;h.style.fontSize=`${10+Math.random()*15}px`;h.style.animationDuration=`${6+Math.random()*5}s`;$('floatingHearts').appendChild(h);setTimeout(()=>h.remove(),11500)
  },850);
})();
