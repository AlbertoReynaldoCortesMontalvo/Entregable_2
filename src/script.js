new p5(function(p) {

  const W = 1240, H = 600;
  let t = 0, sceneT = 0, scene = 0;
  let fadeAlpha = 0, fading = false, nextScene = 0;
  let waveOff = 0;

  let cloudGray = 0;
  let talloH = 0;
  let flowerBloom = 0;
  let rainDrops = [];
  let butterflies = [];
  let sparkles = [];
  let greenAmt = 0;
  let labelEl;

  const SCENE_NAMES = [
    "Escena 1 — Introducción",
    "Escena 2 — El Cambio",
    "Escena 3 — El Riego",
    "Escena 4 — Crecimiento Rápido",
    "Escena 5 — La Floración",
    "Escena 6 — Felicidad"
  ];
  const SCENE_DURATION = [200, 200, 200, 200, 200, 9999];

  // ─── SETUP ───────────────────────────────────────────────────────
  p.setup = function() {
    let cnv = p.createCanvas(W, H);
    cnv.parent('canvasHolder');
    p.frameRate(30);
    labelEl = document.getElementById('sceneLabel');
    document.getElementById('btnNext').addEventListener('click', () => { if (!fading) goTo((scene+1)%6); });
    document.getElementById('btnPrev').addEventListener('click', () => { if (!fading) goTo((scene+5)%6); });
    document.getElementById('btnRestart').addEventListener('click', () => resetAll());
    initButterflies();
  };

  function initButterflies() {
    butterflies = [];
    let colors = ['#FF9ECD','#FFC857','#A8E6CF','#FF7BAC','#FFD700'];
    for (let i = 0; i < 5; i++) {
      butterflies.push({
        x: p.random(W), y: p.random(80, 200),
        vx: p.random(-0.7, 0.7), vy: p.random(-0.35, 0.35),
        wingAngle: p.random(p.TWO_PI),
        color: colors[i % colors.length],
        size: p.random(0.6, 1.0),
        alpha: 0
      });
    }
  }

  function resetAll() {
    t = 0; sceneT = 0; scene = 0;
    cloudGray = 0; talloH = 0; flowerBloom = 0;
    rainDrops = []; sparkles = []; greenAmt = 0;
    fading = false; fadeAlpha = 0;
    initButterflies();
    if (labelEl) labelEl.textContent = SCENE_NAMES[0];
  }

  function goTo(s) {
    if (fading) return;
    fading = true; nextScene = s % 6; fadeAlpha = 0;
  }

  // ─── DRAW LOOP ───────────────────────────────────────────────────
  p.draw = function() {
    t++; 
    sceneT++; 
    waveOff += 0.025;

    if (sceneT > SCENE_DURATION[scene] && !fading) goTo(scene + 1);

    if (fading) {
      fadeAlpha += 9;
      if (fadeAlpha >= 255) {
        scene = nextScene % 6;
        sceneT = 0; fading = false;
        if (labelEl) labelEl.textContent = SCENE_NAMES[scene];
        if (scene === 0) resetAll();
      }
    } else {
      fadeAlpha = p.max(0, fadeAlpha - 12);
    }

    renderScene(scene);

    if (fadeAlpha > 0) {
      p.noStroke(); p.fill(15, 15, 30, fadeAlpha);
      p.rect(0, 0, W, H);
    }
  };

  function renderScene(s) {
    if      (s === 0) scena_intro();
    else if (s === 1) scena_cambio();
    else if (s === 2) scena_riego();
    else if (s === 3) scena_crecimiento();
    else if (s === 4) scena_floracion();
    else              scena_resolucion();
  }

  // ─── ESCENAS ─────────────────────────────────────────────────────

  // Escena de intro
  function scena_intro() {
    drawSky(p.color(135,206,250), p.color(200,235,255));
    drawNubesFondo();
    drawMontanasFondo(p.color(80,160,60), p.color(100,180,75));
    drawHills(p.color(80,160,60), p.color(100,180,75));
    drawGround(0);
    drawSun(W*0.85, 60, 1.0, 0.65);

    let nx = p.map(p.min(sceneT, 60), 0, 60, -70, W*0.5);

    drawNube(nx, 108 + p.sin(waveOff)*12, 0, 0);
    drawSemilla(W*0.5, H-72, 0.3, 0, false);


    /// texto de la historia
    drawSubtitle("Nubecita flota suavemente ,  Semillita espera en la tierra");
  }

  // Escena de cambio
  function scena_cambio() {
    let prog = p.map(p.min(sceneT,60), 0, 60, 0, 1);
    let skyTop = p.lerpColor(p.color(135,206,250), p.color(130,140,160), prog);
    let skyBot = p.lerpColor(p.color(200,235,255), p.color(180,185,200), prog);
    drawSky(skyTop, skyBot);
    drawNubesFondo();
    drawMontanasFondo(p.color(75,152,56), p.color(95,172,70));
    drawHills(p.color(75,152,56), p.color(95,172,70));
    drawGround(0);
    cloudGray = p.min(cloudGray + 0.013, 1.0);
    drawNube(W*0.5, 112 + p.sin(waveOff)*8, cloudGray, 0);
    drawSemilla(W*0.5, H-72, 0.2, 0, false);
    if (sceneT > 50 && p.frameCount % 4 === 0)
      rainDrops.push({x: W*0.5 + p.random(-40,40), y: 162, vy: p.random(3,5), alpha: 190});
    drawRain();
    drawSubtitle("Nubecita cambia de color · Comienza la lluvia suave");
  }

  // Escena de riego
  function scena_riego() {
    drawSky(p.color(120,130,162), p.color(170,175,198));
    drawNubesFondo();
    drawMontanasFondo(p.color(70,145,54), p.color(90,165,67));
    drawHills(p.color(70,145,54), p.color(90,165,67));
    greenAmt = p.min(greenAmt + 0.005, 0.45);
    drawGround(greenAmt);
    if (p.frameCount % 3 === 0)
      rainDrops.push({x: W*0.5 + p.random(-55,55), y: 158, vy: p.random(4,7), alpha: 215});
    drawRain();
    talloH = p.min(talloH + 0.005, 0.44);
    if (talloH > 0.05) drawTallo(W*0.5, H-72, talloH, 0, false);
    let shk = sceneT > 70 ? p.sin(t*0.3)*1.5 : 0;
    drawNubeConRegadera(W*0.5 + shk, 116 + p.sin(waveOff)*6, 1.0);
    drawSemilla(W*0.5, H-72, 0.6, talloH, false);
    drawSubtitle("Nubecita Gris riega a Semillita · Tallo comienza a emerger");
  }


  // Escena de crecimiento
  function scena_crecimiento() {
    let pr = p.map(p.min(sceneT,80), 0, 80, 0, 1);
    let skyTop = p.lerpColor(p.color(120,130,162), p.color(135,200,245), pr);
    let skyBot = p.lerpColor(p.color(170,175,198), p.color(195,230,255), pr);
    drawSky(skyTop, skyBot);
    drawNubesFondo();
    drawMontanasFondo(p.color(72,155,56), p.color(92,175,70));
    drawHills(p.color(72,155,56), p.color(92,175,70));
    greenAmt = p.min(greenAmt + 0.008, 0.72);
    drawGround(greenAmt);
    talloH = p.min(talloH + 0.013, 0.95);
    if (sceneT < 45 && p.frameCount % 4 === 0)
      rainDrops.push({x: W*0.5 + p.random(-40,40), y: 155, vy: p.random(3,6), alpha: 175});
    drawRain();
    drawTallo(W*0.5, H-72, talloH, 0, false);
    drawSemilla(W*0.5, H-72, 0.8, talloH, false);
    cloudGray = p.max(cloudGray - 0.009, 0.25);
    let happy = p.map(p.min(sceneT,80), 0, 80, 0, 0.75);
    drawNube(W*0.5, 115 + p.sin(waveOff)*9, cloudGray, happy);
    drawSun(W*0.85, 65, pr, 0.85);


    drawSubtitle("Tallo crece rápido · Nubecita se siente útil");
  }

  // Escena de floración
  function scena_floracion() {
    drawSky(p.color(135,210,250), p.color(200,235,255));
    drawNubesFondo();
    drawMontanasFondo(p.color(75,165,58), p.color(95,185,72));
    drawHills(p.color(75,165,58), p.color(95,185,72));
    greenAmt = p.min(greenAmt + 0.005, 1.0);
    drawGround(greenAmt);
    drawSun(W*0.85, 60, 1.0, 1.0);
    flowerBloom = p.min(flowerBloom + 0.008, 1.0);
    drawTallo(W*0.5, H-72, 1.0, flowerBloom, false);
    cloudGray = p.max(cloudGray - 0.01, 0);
    let nh = p.map(p.min(sceneT,80), 20, 80, 0, 1);
    drawNube(W*0.5 + p.sin(waveOff*0.5)*22, 113 + p.sin(waveOff)*9, cloudGray, nh);
    if (flowerBloom < 0.55) drawSemilla(W*0.5, H-72, 1.0, talloH, false);
    if (flowerBloom > 0.7 && p.frameCount % 3 === 0)
      sparkles.push({x: W*0.5+p.random(-32,32), y: H-72-95+p.random(-22,5), life:25});
    drawSparkles();
    drawSubtitle("La flor se abre · Nubecita vuelve a su estado feliz");

  }

  // Escena de felicidad
  function scena_resolucion() {
    drawSky(p.color(140,215,255), p.color(210,240,255));
    drawNubesFondo();
    drawMontanasFondo(p.color(78,172,60), p.color(98,192,76));
    drawHills(p.color(78,172,60), p.color(98,192,76));
    drawGround(1.0);
    drawSun(W*0.85, 58, 1.0, 1.0 + p.sin(waveOff*0.5)*0.08);
    drawFlorcitasFondo();
    butterflies.forEach(b => { b.alpha = p.min(b.alpha + 2, 200); });
    updateButterflies();
    drawButterflies();
    drawTallo(W*0.5, H-72, 1.0, 1.0, true);
    drawNube(W*0.4 + p.sin(waveOff*0.65)*28, 108 + p.sin(waveOff)*11, 0, 1);
    drawSemilla(W*0.62, H-72, 1.0, 0, true);
    if (p.frameCount % 5 === 0)
      sparkles.push({x: p.random(W*0.28, W*0.72), y: p.random(H*0.3, H*0.62), life:28});
    drawSparkles();

    drawSubtitle("Ambas sonriendo · El sol brilla · Las mariposas vuelan");

  }

  // ─── ENTORNO ─────────────────────────────────────────────────────

  function drawSky(topC, botC) {
    p.noStroke();
    for (let y = 0; y < H; y++) {
      p.stroke(p.lerpColor(topC, botC, y/H));
      p.line(0, y, W, y);
    }
    p.noStroke();
  }

  function drawHills(c1, c2) {
    p.noStroke();
    p.fill(c1);
    p.beginShape();
    p.vertex(0, H-60);
    p.bezierVertex(50, H-60, 80, H-152, 165, H-142);
    p.bezierVertex(225, H-132, 255, H-60, 310, H-60);
    p.vertex(0, H-60);
    p.endShape(p.CLOSE);
    p.fill(c2);
    p.beginShape();
    p.vertex(345, H-60);
    p.bezierVertex(380, H-60, 425, H-148, 498, H-158);
    p.bezierVertex(568, H-148, 606, H-60, W, H-60);
    p.vertex(W, H-60);
    p.endShape(p.CLOSE);
  }

  function drawMontanasFondo(c1, c2) {
    p.noStroke();
    let mc1 = p.lerpColor(c1, p.color(195, 235, 195), 0.48);
    let mc2 = p.lerpColor(c2, p.color(180, 225, 185), 0.42);
    // Montaña 1
    p.fill(mc1);
    p.beginShape();
    p.vertex(-10, H-60);
    p.bezierVertex(40, H-60, 80, H-240, 145, H-240);
    p.bezierVertex(210, H-240, 260, H-60, 310, H-60);
    p.vertex(-10, H-60);
    p.endShape(p.CLOSE);
    // Montaña 2
    p.fill(mc2);
    p.beginShape();
    p.vertex(275, H-60);
    p.bezierVertex(325, H-60, 365, H-255, 430, H-255);
    p.bezierVertex(495, H-255, 540, H-60, 590, H-60);
    p.vertex(275, H-60);
    p.endShape(p.CLOSE);
    // Montaña 3
    p.fill(mc1);
    p.beginShape();
    p.vertex(555, H-60);
    p.bezierVertex(605, H-60, 645, H-245, 710, H-245);
    p.bezierVertex(775, H-245, 820, H-60, 870, H-60);
    p.vertex(555, H-60);
    p.endShape(p.CLOSE);
    // Montaña 4
    p.fill(mc2);
    p.beginShape();
    p.vertex(845, H-60);
    p.bezierVertex(895, H-60, 935, H-250, 1000, H-250);
    p.bezierVertex(1065, H-250, 1200, H-60, W+10, H-60);
    p.vertex(845, H-60);
    p.endShape(p.CLOSE);
  }

  function drawNubesFondo() {
    drawNubeFondo(148 + p.sin(waveOff * 0.32) * 16, 74, 0.72, 178);
    drawNubeFondo(440 + p.sin(waveOff * 0.24 + 1.3) * 20, 58, 0.90, 158);
    drawNubeFondo(740 + p.sin(waveOff * 0.27 + 2.1) * 15, 80, 0.65, 172);
    drawNubeFondo(1020 + p.sin(waveOff * 0.20 + 0.7) * 18, 66, 0.82, 162);
  }

  function drawNubeFondo(x, y, escala, alpha) {
    p.push(); p.translate(x, y); p.scale(escala);
    p.noStroke();
    p.fill(255, 255, 255, alpha * 0.1);
    p.ellipse(4, 13, 90, 24);
    p.fill(255, 255, 255, alpha);
    p.ellipse(0, 0, 78, 44);
    p.ellipse(-25, -10, 50, 40);
    p.ellipse(25, -9, 46, 36);
    p.ellipse(0, -19, 54, 36);
    p.pop();
  }

  function drawGround(gAmt) {
    p.noStroke();
    let r = p.lerp(115, 52, gAmt);
    let g = p.lerp(82, 138, gAmt);
    let b = p.lerp(46, 46, gAmt);
    p.fill(r, g, b);
    p.rect(0, H-60, W, 60);
    if (gAmt > 0.05) {
      let patches = [{x:55,w:115},{x:195,w:82},{x:325,w:135},{x:475,w:95},{x:592,w:72}];
      for (let pt of patches) {
        p.fill(48, 158, 48, p.map(gAmt,0,1,0,200));
        p.noStroke();
        p.ellipse(pt.x, H-60, pt.w, 24);
      }
      p.strokeWeight(2);
      for (let gx = 12; gx < W; gx += 14) {
        let gh = 7 + p.sin(gx*0.38 + waveOff)*3;
        p.stroke(62, 175, 55, p.map(gAmt,0,1,0,225));
        p.line(gx, H-60, gx + p.sin(gx+waveOff)*2, H-60-gh);
      }
    }
    p.noStroke();
  }

  function drawSun(x, y, intensity, size) {
    if (intensity <= 0) return;
    p.push(); p.translate(x, y);
    p.strokeWeight(2.5);
    for (let i = 0; i < 12; i++) {
      let angle = (i/12)*p.TWO_PI + waveOff*0.28;
      let r1 = 28*size, r2 = 46*size;
      p.stroke(255, 225, 80, 160*intensity);
      p.line(p.cos(angle)*r1, p.sin(angle)*r1, p.cos(angle)*r2, p.sin(angle)*r2);
    }
    p.noStroke();
    p.fill(255, 230, 60, 238*intensity);
    p.ellipse(0, 0, 48*size, 48*size);
    p.fill(255, 248, 130, 200*intensity);
    p.ellipse(-4, -5, 18*size, 16*size);
    p.fill(200, 152, 22, 215*intensity);
    p.ellipse(-7, 2, 5, 5);
    p.ellipse(7, 2, 5, 5);
    p.noFill(); p.stroke(200, 152, 22, 215*intensity); p.strokeWeight(2);
    p.arc(0, 8, 14, 9, 0, p.PI);
    p.pop();
  }

  function drawFlorcitasFondo() {
    let flores = [{x:105,y:H-64},{x:195,y:H-62},{x:415,y:H-65},{x:515,y:H-63},{x:595,y:H-64},
                  {x:805,y:H-64},{x:895,y:H-50},{x:1015,y:H-65},{x:1115,y:H-50},{x:1195,y:H-64}
    ];
    for (let f of flores) {
      p.push(); p.translate(f.x, f.y); p.scale(0.48);
      p.stroke(55,148,48); p.strokeWeight(3); p.line(0,0,0,-42);
      p.noStroke();
      for (let i = 0; i < 6; i++) {
        let a = (i/6)*p.TWO_PI;
        p.fill(255, 185, 52, 205);
        p.ellipse(p.cos(a)*14, p.sin(a)*14-42, 15, 11);
      }
      p.fill(205, 45, 45); p.ellipse(0,-42,15,15);
      p.fill(255,105,105,180); p.ellipse(-3,-45,7,7);
      p.pop();
    }
  }

  // ─── PERSONAJES ──────────────────────────────────────────────────

  function drawNube(x, y, gray, happy) {
    p.push(); p.translate(x, y);
    let br = p.lerp(255, 82, gray);
    let bg = p.lerp(255, 92, gray);
    let bb = p.lerp(255, 112, gray);
    p.noStroke(); p.fill(br-50, bg-50, bb-40, 32);
    p.ellipse(5, 15, 105, 30);
    p.fill(br, bg, bb);
    p.ellipse(0, 0, 88, 52);
    p.ellipse(-26, -11, 52, 44);
    p.ellipse(26, -10, 50, 42);
    p.ellipse(0, -19, 57, 40);
    if (happy > 0.3) {
      p.fill(255, 178, 178, p.map(happy,0.3,1,0,145));
      p.ellipse(-19, 5, 15, 10); p.ellipse(19, 5, 15, 10);
    }
    let ey = -5;
    p.fill(40,40,62);
    p.ellipse(-13,ey,11,11); p.ellipse(13,ey,11,11);
    p.fill(255,255,255,215);
    p.ellipse(-11,ey-2,4,4); p.ellipse(15,ey-2,4,4);
    p.noFill(); p.stroke(40,40,62); p.strokeWeight(2.2);
    if (happy > 0.5)       p.arc(0,ey+9,22,14,0,p.PI);
    else if (gray > 0.6)   p.arc(0,ey+14,18,10,p.PI,p.TWO_PI);
    else                   p.line(-8,ey+11,8,ey+11);
    p.stroke(br-50,bg-50,bb-40); p.strokeWeight(3.5); p.strokeCap(p.ROUND);
    if (happy > 0.5) { p.line(-39,8,-50,-9); p.line(39,8,50,-9); }
    else             { p.line(-39,8,-48,22); p.line(39,8,48,22); }
    if (gray > 0.72) {
      p.stroke(105,175,255,192); p.strokeWeight(2);
      for (let i=-1; i<=1; i++) {
        let dy = ((t*0.15 + i*10) % 15);
        p.line(i*16, 23+dy, i*15, 32+dy);
      }
    }
    p.pop();
  }

  function drawNubeConRegadera(x, y, gray) {
    p.push(); p.translate(x, y);
    let br = p.lerp(255, 82, gray);
    let bg = p.lerp(255, 92, gray);
    let bb = p.lerp(255, 112, gray);
    p.noStroke(); p.fill(br-50,bg-50,bb-40,28);
    p.ellipse(5,15,105,30);
    p.fill(br,bg,bb);
    p.ellipse(0,0,88,52); p.ellipse(-26,-11,52,44);
    p.ellipse(26,-10,50,42); p.ellipse(0,-19,57,40);
    let ey = -5;
    p.fill(40,40,62); p.ellipse(-13,ey,11,11); p.ellipse(13,ey,11,11);
    p.fill(255,255,255,215); p.ellipse(-11,ey-2,4,4); p.ellipse(15,ey-2,4,4);
    p.noFill(); p.stroke(40,40,62); p.strokeWeight(2.2);
    p.line(-8,ey+11,8,ey+11);
    p.stroke(br-50,bg-50,bb-40); p.strokeWeight(3.5); p.strokeCap(p.ROUND);
    p.line(-39,8,-48,22);
    p.line(39,8,54,24);
    // Regadera
    p.push(); p.translate(62, 30);
    p.fill(88,150,195); p.noStroke();
    p.rect(-13,-9,26,20,5);
    p.rect(11,-13,7,11,2);
    p.rect(11,-4,22,5,2);
    p.fill(68,130,175); p.ellipse(32,-2,9,16);
    p.fill(52,110,158);
    for (let i=0;i<4;i++) p.ellipse(30+p.sin(i*0.85)*3, -5+i*3.5, 2.5,2.5);
    p.pop();
    // Agua de la regadera
    p.stroke(105,185,255,205); p.strokeWeight(1.8);
    for (let i=0;i<6;i++) {
      let dy = ((t*0.22 + i*6) % 42);
      let dx = i*3.5 - 9;
      p.line(62+dx,42+dy,61+dx,50+dy);
    }
    p.pop();
  }

  function drawSemilla(x, y, happy, growStage, isFinal) {
    if (growStage > 0.62) return;
    let alpha = growStage > 0.32 ? p.map(growStage,0.32,0.62,255,0) : 255;

    let sway  = p.sin(t * 0.038) * 0.055;
    let bob   = (happy > 0.5) ? p.sin(t * 0.10) * 2.5 : 0;
    let blinkH = (p.frameCount % 90 < 5) ? p.map(p.frameCount % 90, 0, 5, 11, 1) : 11;

    p.push(); p.translate(x, y + bob);
    p.rotate(sway);
    if (growStage < 0.1) {
      p.stroke(100,70,35,alpha); p.strokeWeight(1.6); p.strokeCap(p.ROUND);
      p.line(-6,25,-13,37); p.line(0,27,0,40); p.line(6,25,11,37);
    }
    p.noStroke();
    p.fill(140,90,50,alpha); p.ellipse(4,7,52,15);
    p.fill(158,102,56,alpha); p.ellipse(0,0,50,60);
    p.fill(198,148,92,alpha*0.5); p.ellipse(-7,-10,18,22);
    p.fill(40,30,20,alpha);
    p.ellipse(-10,-4,10,blinkH); p.ellipse(10,-4,10,blinkH);
    p.fill(255,255,255, p.map(blinkH,1,11,0,alpha*0.85));
    p.ellipse(-8,-6,4,4); p.ellipse(12,-6,4,4);
    if (happy > 0.5) {
      p.fill(230,132,102,alpha*0.58);
      p.ellipse(-15,3,13,8); p.ellipse(15,3,13,8);
    }
    p.noFill(); p.stroke(40,30,20,alpha); p.strokeWeight(2);
    if (happy > 0.5) p.arc(0,9,19,13,0,p.PI);
    else             p.line(-7,10,7,10);
    p.stroke(122,82,46,alpha); p.strokeWeight(3.5); p.strokeCap(p.ROUND);
    if (happy > 0.7 || isFinal) {
      let wave = p.abs(p.sin(t * 0.11)) * 6;
      p.line(-22,4,-31,-16 - wave); p.line(22,4,31,-16 - wave);
    } else {
      let dangle = p.sin(t * 0.07) * 3;
      p.line(-22,4,-29,19 + dangle); p.line(22,4,29,19 + dangle);
    }
    p.pop();
  }

  function drawTallo(x, groundY, progress, bloom, vibrant) {
    if (progress <= 0) return;
    let maxH = 108;
    let h = maxH * progress;
    p.push(); p.translate(x, groundY);
    p.stroke(48,140,54); p.strokeWeight(5); p.strokeCap(p.ROUND);
    p.line(0,0,0,-h);
    if (progress > 0.3) {
      let ls = p.map(progress,0.3,0.7,0,1);
      p.push(); p.translate(-2,-h*0.55); p.rotate(-p.PI*0.22);
      p.fill(62,168,58,222); p.noStroke(); p.scale(ls);
      p.ellipse(-17,-10,36,17);
      p.pop();
    }
    if (progress > 0.5) {
      let ls = p.map(progress,0.5,0.85,0,1);
      p.push(); p.translate(2,-h*0.35); p.rotate(p.PI*0.22);
      p.fill(58,162,54,212); p.noStroke(); p.scale(ls);
      p.ellipse(17,-8,32,15);
      p.pop();
    }
    if (bloom > 0) {
      let fy = -h;
      let numP = 8;
      for (let i=0;i<numP;i++) {
        let angle = (i/numP)*p.TWO_PI + waveOff*0.14;
        let pr = p.map(bloom,0,1,0,23);
        p.fill(vibrant?255:p.lerp(198,255,bloom), vibrant?198:p.lerp(148,198,bloom), 18, bloom*255);
        p.noStroke();
        p.ellipse(p.cos(angle)*pr, fy+p.sin(angle)*pr, 19*bloom, 13*bloom);
      }
      p.fill(vibrant?222:p.lerp(158,222,bloom), 38, 38, bloom*255);
      p.ellipse(0,fy,23*bloom,23*bloom);
      p.fill(vibrant?255:p.lerp(198,255,bloom),102,102,bloom*200);
      p.ellipse(-3,fy-3,10*bloom,10*bloom);
      if (bloom > 0.8) {
        p.fill(118,18,18,220*bloom);
        p.ellipse(-5,fy,4,4); p.ellipse(5,fy,4,4);
        p.noFill(); p.stroke(118,18,18,220*bloom); p.strokeWeight(1.5);
        p.arc(0,fy+4,10,7,0,p.PI);
      }
    }
    p.pop();
  }

  // ─── EFECTOS ─────────────────────────────────────────────────────

  function drawRain() {
    for (let i=rainDrops.length-1;i>=0;i--) {
      let d = rainDrops[i];
      d.y += d.vy; d.alpha -= 4;
      p.stroke(118,188,255,d.alpha); p.strokeWeight(1.5);
      p.line(d.x,d.y,d.x-1,d.y+9);
      if (d.y > H-65 || d.alpha<=0) rainDrops.splice(i,1);
    }
  }

  function drawSparkles() {
    for (let i=sparkles.length-1;i>=0;i--) {
      let s=sparkles[i]; s.life--;
      let a = p.map(s.life,0,30,0,255);
      let sz = p.map(s.life,0,30,0,5.5);
      p.noStroke(); p.fill(255,232,82,a);
      p.ellipse(s.x,s.y,sz,sz);
      p.fill(255,255,255,a*0.6);
      p.ellipse(s.x+2,s.y-2,sz*0.5,sz*0.5);
      if (s.life<=0) sparkles.splice(i,1);
    }
  }

  function updateButterflies() {
    for (let b of butterflies) {
      b.x += b.vx + p.sin(waveOff + b.wingAngle)*0.45;
      b.y += b.vy + p.cos(waveOff*0.7 + b.wingAngle)*0.28;
      b.wingAngle += 0.19;
      if (b.x < -22) b.x = W+22;
      if (b.x > W+22) b.x = -22;
      b.y = p.constrain(b.y, 58, H-82);
    }
  }

  function drawButterflies() {
    for (let b of butterflies) {
      if (b.alpha <= 0) continue;
      p.push(); p.translate(b.x, b.y); p.scale(b.size);
      let wf = p.abs(p.sin(b.wingAngle*3))*19;
      let rgb = hexToRgb(b.color);
      p.noStroke();
      p.fill(rgb[0],rgb[1],rgb[2],b.alpha);
      p.ellipse(-wf*0.5,-2,wf,11); p.ellipse(-wf*0.4,5,wf*0.6,7.5);
      p.ellipse(wf*0.5,-2,wf,11);  p.ellipse(wf*0.4,5,wf*0.6,7.5);
      p.fill(38,28,18,b.alpha); p.ellipse(0,0,4,13);
      p.pop();
    }
  }

  // ─── UI ──────────────────────────────────────────────────────────

  function drawSubtitle(txt) {
    p.noStroke(); p.fill(0,0,0,115);
    p.rect(0,H-38,W,38,0,0,14,14);
    p.fill(255,255,255,278);
    p.textAlign(p.CENTER,p.CENTER); p.textSize(14);
    p.text(txt, W/2, H-18);
  }

  function drawSceneTag(title, tag) {
    p.noStroke(); p.fill(0,0,0,118);
    p.textSize(12);
    p.rect(8,8,p.textWidth(title)+22,25,7);
    p.fill(255,255,255,228);
    p.textAlign(p.LEFT,p.CENTER); p.text(title,14,21);
    let tw = p.textWidth(tag)+22;
    p.fill(0,0,0,118); p.rect(W-tw-8,8,tw,25,7);
    p.fill(200,232,255,218);
    p.textAlign(p.RIGHT,p.CENTER); p.text(tag,W-14,21);
  }

  // ─── HELPERS ─────────────────────────────────────────────────────

  function hexToRgb(hex) {
    return [parseInt(hex.slice(1,3),16), parseInt(hex.slice(3,5),16), parseInt(hex.slice(5,7),16)];
  }

});