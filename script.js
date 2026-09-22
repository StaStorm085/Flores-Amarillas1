(function(){

  /* ======= PERSONALIZA AQUÍ ======= */
  const NOMBRE = "MI PRINCESA"; // cámbialo por su nombre si quieres, ej: "Ana"
  const MENSAJE = `Hoy es el día de las flores amarillas y aunque se me fue la hora, no se me fue la intención. Quería que supieras que pienso en ti más de lo que digo, y que cada día contigo se siente como uno bueno para regalarte algo, aunque sea tarde. Gracias por estar, por reírte de mis cosas y por dejarme quererte. Esta flor no se marchita, así que ábrela cada vez que quieras recordar esto: me importas mucho, ${NOMBRE}.`;
  /* ================================= */

  // Fecha bonita
  const fecha = new Date();
  const opciones = { day:'numeric', month:'long', year:'numeric' };
  document.getElementById('fecha').textContent =
    fecha.toLocaleDateString('es-ES', opciones);

  document.getElementById('footerNote').textContent =
    'Hecho con mucho amor y cariño por el amor de tu vida, conmigo nunca vas a ser espectadora,';

  /* ---------- Construir la flor principal (SVG) ---------- */
  const svgNS = "http://www.w3.org/2000/svg";
  const flowerSvg = document.getElementById('flowerSvg');
  const PETALS = 12;
  const cx = 100, cy = 100;

  for(let i=0;i<PETALS;i++){
    const angle = (360/PETALS)*i;
    const petal = document.createElementNS(svgNS,'ellipse');
    petal.setAttribute('cx', cx);
    petal.setAttribute('cy', cy - 62);
    petal.setAttribute('rx', 20);
    petal.setAttribute('ry', 42);
    petal.setAttribute('fill', i % 2 === 0 ? 'var(--petal)' : 'var(--petal-deep)');
    petal.setAttribute('class','petal');
    petal.style.setProperty('--petal-angle', angle + 'deg');
    petal.setAttribute('transform', `rotate(${angle} ${cx} ${cy})`);
    flowerSvg.appendChild(petal);
  }

  // sombra del centro
  const shadowCircle = document.createElementNS(svgNS,'circle');
  shadowCircle.setAttribute('cx', cx);
  shadowCircle.setAttribute('cy', cy+3);
  shadowCircle.setAttribute('r', 30);
  shadowCircle.setAttribute('fill', 'var(--petal-shadow)');
  shadowCircle.setAttribute('opacity', '0.35');
  flowerSvg.appendChild(shadowCircle);

  // centro
  const center = document.createElementNS(svgNS,'circle');
  center.setAttribute('cx', cx);
  center.setAttribute('cy', cy);
  center.setAttribute('r', 28);
  center.setAttribute('fill', 'var(--center)');
  center.setAttribute('class','center-circle');
  flowerSvg.appendChild(center);

  // textura de semillas
  for(let i=0;i<24;i++){
    const a = Math.random()*Math.PI*2;
    const r = Math.random()*20;
    const dot = document.createElementNS(svgNS,'circle');
    dot.setAttribute('cx', cx + Math.cos(a)*r);
    dot.setAttribute('cy', cy + Math.sin(a)*r);
    dot.setAttribute('r', 1.6);
    dot.setAttribute('fill', 'var(--center-dark)');
    dot.setAttribute('opacity', '0.55');
    flowerSvg.appendChild(dot);
  }

  /* ---------- Interacción: abrir flor + carta con máquina de escribir ---------- */
  const flowerWrap = document.getElementById('mainFlower');
  const note = document.getElementById('note');
  const letterBody = document.getElementById('letterBody');
  let opened = false;
  let typing = false;

  function typeWriter(text, el, speed){
    return new Promise((resolve)=>{
      let i = 0;
      el.textContent = '';
      const cursor = document.createElement('span');
      cursor.className = 'cursor';
      cursor.textContent = '\u00A0';
      el.appendChild(cursor);

      function step(){
        if(i < text.length){
          cursor.insertAdjacentText('beforebegin', text.charAt(i));
          i++;
          setTimeout(step, speed);
        } else {
          cursor.remove();
          resolve();
        }
      }
      step();
    });
  }

  async function openFlower(){
    if(opened || typing) return;
    opened = true;
    typing = true;
    flowerWrap.classList.add('bloomed');
    note.classList.add('open');
    await typeWriter(MENSAJE, letterBody, 22);
    typing = false;
  }

  flowerWrap.addEventListener('click', openFlower);
  flowerWrap.addEventListener('keydown', (e)=>{
    if(e.key === 'Enter' || e.key === ' '){
      e.preventDefault();
      openFlower();
    }
  });

  /* ---------- Jardín: sembrar flores al tocar ---------- */
  const garden = document.getElementById('garden');
  const MAX_FLOWERS = 45;
  let flowerCount = 0;

  function buildMiniFlowerSVG(){
    const s = document.createElementNS(svgNS,'svg');
    s.setAttribute('viewBox','0 0 60 120');
    s.style.width = '100%';
    s.style.height = '100%';

    const stem = document.createElementNS(svgNS,'rect');
    stem.setAttribute('x', 27);
    stem.setAttribute('y', 50);
    stem.setAttribute('width', 6);
    stem.setAttribute('height', 70);
    stem.setAttribute('fill', 'var(--leaf-dark)');
    s.appendChild(stem);

    const leaf = document.createElementNS(svgNS,'ellipse');
    leaf.setAttribute('cx', 20);
    leaf.setAttribute('cy', 85);
    leaf.setAttribute('rx', 12);
    leaf.setAttribute('ry', 6);
    leaf.setAttribute('fill', 'var(--leaf)');
    leaf.setAttribute('transform', 'rotate(-20 20 85)');
    s.appendChild(leaf);

    const gPetals = document.createElementNS(svgNS,'g');
    const n = 8;
    for(let i=0;i<n;i++){
      const angle = (360/n)*i;
      const p = document.createElementNS(svgNS,'ellipse');
      p.setAttribute('cx', 30);
      p.setAttribute('cy', 22);
      p.setAttribute('rx', 7);
      p.setAttribute('ry', 15);
      p.setAttribute('fill', i % 2 === 0 ? 'var(--petal)' : 'var(--petal-deep)');
      p.setAttribute('transform', `rotate(${angle} 30 38)`);
      gPetals.appendChild(p);
    }
    s.appendChild(gPetals);

    const c = document.createElementNS(svgNS,'circle');
    c.setAttribute('cx', 30);
    c.setAttribute('cy', 38);
    c.setAttribute('r', 9);
    c.setAttribute('fill', 'var(--center)');
    s.appendChild(c);

    return s;
  }

  function plantFlowerAt(xRatio){
    if(flowerCount >= MAX_FLOWERS) return;
    flowerCount++;
    const wrap = document.createElement('div');
    wrap.className = 'mini-flower';
    const size = 26 + Math.random()*22;
    wrap.style.width = size + 'px';
    wrap.style.height = (size*2) + 'px';
    wrap.style.left = (xRatio*100) + '%';
    wrap.style.animationDelay = (Math.random()*-4) + 's, ' + (Math.random()*0.1) + 's';
    wrap.appendChild(buildMiniFlowerSVG());
    garden.appendChild(wrap);
  }

  // algunas flores ya creciendo al cargar
  window.addEventListener('DOMContentLoaded', ()=>{
    [0.12, 0.28, 0.5, 0.7, 0.86].forEach((x,idx)=>{
      setTimeout(()=>plantFlowerAt(x), 300 + idx*150);
    });
  });

  garden.addEventListener('click', (e)=>{
    const rect = garden.getBoundingClientRect();
    const xRatio = (e.clientX - rect.left) / rect.width;
    plantFlowerAt(Math.min(Math.max(xRatio,0.03),0.97));
  });

})();