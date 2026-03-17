const memories = [
  { date: "2026-01-02", text: "海边的风像一首慢歌，时间被浪花推远。", image: "https://picsum.photos/id/1018/1400/900" },
  { date: "2026-01-05", text: "夜色刚落下，灯光让城市看起来很温柔。", image: "https://picsum.photos/id/1011/1400/900" },
  { date: "2026-01-09", text: "午后阳光斜照进窗，连灰尘都在发光。", image: "https://picsum.photos/id/1025/1400/900" },
  { date: "2026-01-13", text: "山路蜿蜒，抬头时云像刚洗过一样。", image: "https://picsum.photos/id/1036/1400/900" },
  { date: "2026-01-17", text: "街角咖啡馆的木香，让人想把脚步放慢。", image: "https://picsum.photos/id/1040/1400/900" },
  { date: "2026-01-21", text: "那天的晚霞像打翻的颜料，热烈又克制。", image: "https://picsum.photos/id/1067/1400/900" },
  { date: "2026-01-24", text: "路过湖边时起了风，水面像折叠的绸缎。", image: "https://picsum.photos/id/1074/1400/900" },
  { date: "2026-01-27", text: "雨后街道很安静，霓虹把地面照得像镜子。", image: "https://picsum.photos/id/1084/1400/900" },
  { date: "2026-02-02", text: "清晨的雾慢慢散开，远山一点点显影。", image: "https://picsum.photos/id/1056/1400/900" },
  { date: "2026-02-07", text: "在天桥上看车流，像看一条发光的河。", image: "https://picsum.photos/id/1015/1400/900" },
  { date: "2026-02-12", text: "旧相机拍下的颗粒感，反而更像真实记忆。", image: "https://picsum.photos/id/1012/1400/900" },
  { date: "2026-02-18", text: "傍晚长椅上坐了一会儿，风里有树叶味道。", image: "https://picsum.photos/id/1027/1400/900" },
  { date: "2026-02-21", text: "穿过林间小径，潮湿空气里有泥土和松针。", image: "https://picsum.photos/id/1043/1400/900" },
  { date: "2026-02-26", text: "列车驶过高架桥，窗外的云层像被压低。", image: "https://picsum.photos/id/1049/1400/900" },
  { date: "2026-03-01", text: "夜里散步时，街灯把影子拉得很长。", image: "https://picsum.photos/id/1050/1400/900" },
  { date: "2026-03-05", text: "在河畔停下，听见风掠过护栏的细响。", image: "https://picsum.photos/id/1060/1400/900" }
];

const corridorEl = document.getElementById("corridor");
const canvas = document.getElementById("cosmos");
const ctx = canvas.getContext("2d");
const frontCanvas = document.getElementById("cosmos-front");
const frontCtx = frontCanvas ? frontCanvas.getContext("2d") : null;
const controls = {
  density: document.getElementById("ctl-density"),
  size: document.getElementById("ctl-size"),
  alpha: document.getElementById("ctl-alpha"),
  speed: document.getElementById("ctl-speed"),
  fill: document.getElementById("ctl-fill"),
  ambient: document.getElementById("ctl-ambient"),
  cardMax: document.getElementById("ctl-cardmax"),
  fadeStart: document.getElementById("ctl-fadestart"),
  fadeRate: document.getElementById("ctl-faderate"),
  glowBorder: document.getElementById("ctl-glowborder"),
  cursorRange: document.getElementById("ctl-cursorrange"),
  cursorPull: document.getElementById("ctl-cursorpull"),
  cursorIn: document.getElementById("ctl-cursorin"),
  cursorOut: document.getElementById("ctl-cursorout")
};

const controlValues = {
  density: document.getElementById("val-density"),
  size: document.getElementById("val-size"),
  alpha: document.getElementById("val-alpha"),
  speed: document.getElementById("val-speed"),
  fill: document.getElementById("val-fill"),
  ambient: document.getElementById("val-ambient"),
  cardMax: document.getElementById("val-cardmax"),
  fadeStart: document.getElementById("val-fadestart"),
  fadeRate: document.getElementById("val-faderate"),
  glowBorder: document.getElementById("val-glowborder"),
  cursorRange: document.getElementById("val-cursorrange"),
  cursorPull: document.getElementById("val-cursorpull"),
  cursorIn: document.getElementById("val-cursorin"),
  cursorOut: document.getElementById("val-cursorout")
};

const stars = [];
const nebula = [];
const flowParticles = [];
const ambientParticles = [];
const foregroundParticles = [];
const activeCards = new Map();

const state = {
  width: window.innerWidth,
  height: window.innerHeight,
  centerX: window.innerWidth * 0.5,
  horizonY: window.innerHeight * 0.5,
  focal: 980,
  spacing: 760,
  baseZ: 1120,
  photoFarZ: 5600,
  photoNearZ: 220,
  nearClipZ: -880,
  spawnHalfW: window.innerWidth * 0.52,
  spawnHalfH: window.innerHeight * 0.72,
  laneBase: Math.min(560, window.innerWidth * 0.45),
  targetTravel: 0,
  travel: 0,
  scrollVelocity: 0,
  flowDirection: 1,
  particleLoad: 1,
  userDensity: 1,
  userSize: 1,
  userAlpha: 1,
  userSpeed: 1,
  userFill: 1.1,
  userAmbient: 1,
  userCardMax: 2200,
  userFadeStart: 1200,
  userFadeRate: 1.4,
  userGlowBorder: 20,
  userCursorRange: 1,
  userCursorPull: 0.55,
  userCursorIn: 1,
  userCursorOut: 1,
  maxTravel: 0,
  pointerX: 0,
  pointerY: 0,
  pointerScreenX: window.innerWidth * 0.5,
  pointerScreenY: window.innerHeight * 0.5,
  pointerActive: false,
  cursorRadiusFlow: 220,
  cursorRadiusAmbient: 170,
  cursorRadiusFront: 180,
  cursorPullFlow: 26,
  cursorPullAmbient: 14,
  cursorPullFront: 18
};

const perf = {
  sampleFrames: 0,
  sampleTime: 0,
  lastTuneAt: 0
};

function rand(min, max) {
  return Math.random() * (max - min) + min;
}

function clamp(value, min, max) {
  return Math.min(max, Math.max(min, value));
}

function easeOutCubic(t) {
  const c = clamp(t, 0, 1);
  return 1 - Math.pow(1 - c, 3);
}

function fract(x) {
  return x - Math.floor(x);
}

function seeded(seed) {
  return fract(Math.sin(seed * 91.3458 + 17.1234) * 43758.5453);
}

function seededRange(seed, min, max) {
  return min + (max - min) * seeded(seed);
}

function projectWorld(x, y, z) {
  const scale = state.focal / (state.focal + z);
  return {
    x: state.centerX + x * scale,
    y: state.horizonY - y * scale,
    scale
  };
}

function sampleRectCoord(power) {
  const sign = Math.random() < 0.5 ? -1 : 1;
  return sign * Math.pow(Math.random(), power);
}

const memoryMeta = memories.map((memory, index) => ({
  ...memory,
  index,
  row: Math.floor(index / 2),
  side: index % 2 === 0 ? -1 : 1,
  laneClass: seeded(Math.floor(index / 2) + 4.8) > 0.5
    ? (index % 2 === 0 ? "inner" : "outer")
    : (index % 2 === 0 ? "outer" : "inner"),
  laneScale: 1,
  xRelax: seededRange(index + 8.7, -0.26, 0.26),
  xJitter: seededRange(index + 11.2, -22, 22),
  yNorm: seededRange(index + 14.1, -1.05, 1.05),
  yJitter: seededRange(index + 16.8, -36, 36),
  depthShift: 0,
  sizeScale: seededRange(index + 31.8, 0.9, 1.12),
  tilt: seededRange(index + 49.1, -1.2, 1.2)
}));

const rowDepthShift = {};
memoryMeta.forEach((meta, index) => {
  if (rowDepthShift[meta.row] === undefined) {
    rowDepthShift[meta.row] = seededRange(meta.row + 22.4, -24, 24);
  }
  meta.depthShift = rowDepthShift[meta.row];
  if (meta.laneClass === "inner") {
    meta.laneScale = seededRange(index + 62.2, 0.22, 0.54);
  } else {
    meta.laneScale = seededRange(index + 62.2, 0.62, 1.02);
  }
});

function createCard(meta) {
  const figure = document.createElement("figure");
  figure.className = "memory-card";
  figure.style.willChange = "transform,width,opacity";
  figure.innerHTML = `
    <div class="memory-photo">
      <img loading="lazy" src="${meta.image}" alt="记忆照片 ${meta.index + 1}">
    </div>
    <figcaption>
      <time>${meta.date}</time>
      <p>${meta.text}</p>
    </figcaption>
  `;
  const photoEl = figure.querySelector(".memory-photo");
  if (photoEl) {
    photoEl.addEventListener("pointerenter", () => {
      figure.classList.add("is-hovered");
    });
    photoEl.addEventListener("pointerleave", () => {
      figure.classList.remove("is-hovered");
    });
  }
  corridorEl.appendChild(figure);
  return { meta, element: figure };
}

function photoZ(meta) {
  return meta.row * state.spacing + meta.depthShift - state.travel + state.baseZ;
}

function syncVisibleCards() {
  const minZ = state.nearClipZ;
  const maxZ = state.photoFarZ + 420;

  memoryMeta.forEach((meta, index) => {
    const z = photoZ(meta);
    if (z > minZ && z < maxZ) {
      if (!activeCards.has(index)) {
        activeCards.set(index, createCard(meta));
      }
    } else if (activeCards.has(index)) {
      const card = activeCards.get(index);
      if (card) card.element.remove();
      activeCards.delete(index);
    }
  });
}

function spawnFlowParticle(p, mode) {
  const band = Math.random();
  if (band < 0.68) {
    p.rx = sampleRectCoord(0.65) * 0.92;
    p.ry = sampleRectCoord(0.74) * 0.86;
  } else {
    p.rx = sampleRectCoord(0.9) * 1.45;
    p.ry = sampleRectCoord(0.9) * 1.2;
  }
  const nx = Math.min(1.6, Math.abs(p.rx) / 0.9);
  const ny = Math.min(1.6, Math.abs(p.ry) / 0.95);
  p.core = Math.exp(-(nx * 1.2 + ny * 0.9) * 1.8);
  p.phase = rand(0, Math.PI * 2);
  p.curveX = rand(-36, 36);
  p.curveY = rand(-24, 24);
  p.driftX = rand(-0.22, 0.22);
  p.driftY = rand(-0.18, 0.18);
  p.alpha = rand(0.2, 0.74);
  p.size = rand(0.28, 1.22);
  p.hue = rand(192, 320);
  p.fillColor = `hsl(${p.hue} 92% 79%)`;
  p.strokeColor = `hsl(${p.hue} 88% 72%)`;
  p.farJitterX = rand(-state.spawnHalfW * 0.2, state.spawnHalfW * 0.2);
  p.farJitterY = rand(-state.spawnHalfH * 0.26, state.spawnHalfH * 0.26);
  const edge = rand(0, 0.03);

  if (mode === "far") p.depth = 1 - edge;
  else if (mode === "near") p.depth = edge;
  else p.depth = Math.random();

  p.prevX = Number.NaN;
  p.prevY = Number.NaN;
  p.cursorOffsetX = 0;
  p.cursorOffsetY = 0;
  return p;
}

function spawnAmbientParticle(p) {
  p.x = Math.random() * state.width;
  p.y = Math.random() * state.height;
  p.vx = rand(-18, 18);
  p.vy = rand(-14, 14);
  p.alpha = rand(0.12, 0.42);
  p.size = rand(0.34, 1.5);
  p.twinkle = rand(0.35, 1.6);
  p.phase = rand(0, Math.PI * 2);
  p.color = `hsl(${rand(194, 300)} 88% 75%)`;
  p.cursorOffsetX = 0;
  p.cursorOffsetY = 0;
  return p;
}

function spawnForegroundParticle(p, mode) {
  p.rx = sampleRectCoord(0.8) * 1.22;
  p.ry = sampleRectCoord(0.84) * 1.15;
  p.depth = mode === "near" ? rand(0.0, 0.08) : rand(0.14, 0.6);
  p.alpha = rand(0.07, 0.24);
  p.size = rand(0.5, 1.65);
  p.phase = rand(0, Math.PI * 2);
  p.hue = rand(190, 320);
  p.color = `hsl(${p.hue} 90% 78%)`;
  p.cursorOffsetX = 0;
  p.cursorOffsetY = 0;
  return p;
}

function applyCursorPull(p, baseX, baseY, dt, radius, maxPull, pullSpeed, releaseSpeed) {
  const tunedRadius = radius * state.userCursorRange;
  const tunedMaxPull = maxPull * state.userCursorPull;
  const tunedPullSpeed = pullSpeed * state.userCursorIn;
  const tunedReleaseSpeed = releaseSpeed * state.userCursorOut;
  let targetX = 0;
  let targetY = 0;

  if (state.pointerActive && tunedRadius > 0.0001 && tunedMaxPull > 0.0001) {
    const dx = state.pointerScreenX - baseX;
    const dy = state.pointerScreenY - baseY;
    const distanceSq = dx * dx + dy * dy;
    const radiusSq = tunedRadius * tunedRadius;

    if (distanceSq < radiusSq) {
      const distance = Math.sqrt(Math.max(distanceSq, 0.0001));
      const t = 1 - distance / tunedRadius;
      const falloff = t * t * (3 - 2 * t);
      const pull = tunedMaxPull * falloff;
      targetX = dx / distance * pull;
      targetY = dy / distance * pull;
    }
  }

  const hasPull = targetX !== 0 || targetY !== 0;
  const blend = 1 - Math.exp(-(hasPull ? tunedPullSpeed : tunedReleaseSpeed) * dt);
  p.cursorOffsetX += (targetX - p.cursorOffsetX) * blend;
  p.cursorOffsetY += (targetY - p.cursorOffsetY) * blend;
  p.renderX = baseX + p.cursorOffsetX;
  p.renderY = baseY + p.cursorOffsetY;
}

function initParticles() {
  stars.length = 0;
  nebula.length = 0;
  flowParticles.length = 0;
  ambientParticles.length = 0;
  foregroundParticles.length = 0;

  const starCount = Math.round((state.width * state.height) / 3800);
  for (let i = 0; i < starCount; i += 1) {
    stars.push({
      x: Math.random(),
      y: Math.random(),
      r: rand(0.16, 0.95),
      twinkle: rand(0.3, 1.2),
      phase: rand(0, Math.PI * 2)
    });
  }

  for (let i = 0; i < 7; i += 1) {
    nebula.push({
      x: rand(0.1, 0.9),
      y: rand(0.06, 0.94),
      radius: rand(320, 620),
      hue: rand(195, 288),
      alpha: rand(0.025, 0.09)
    });
  }

  const baseFlowCount = Math.round((state.width * state.height) / 92);
  const flowCount = clamp(Math.round(baseFlowCount * state.particleLoad * state.userDensity), 3600, 16000);
  for (let i = 0; i < flowCount; i += 1) {
    flowParticles.push(spawnFlowParticle({}, "random"));
  }

  const ambientCount = clamp(
    Math.round((state.width * state.height) / 1400 * state.particleLoad * state.userDensity * state.userAmbient),
    900,
    6200
  );
  for (let i = 0; i < ambientCount; i += 1) {
    ambientParticles.push(spawnAmbientParticle({}));
  }

  const frontCount = clamp(
    Math.round((state.width * state.height) / 8600 * state.particleLoad * state.userDensity),
    120,
    800
  );
  for (let i = 0; i < frontCount; i += 1) {
    foregroundParticles.push(spawnForegroundParticle({}, "random"));
  }
}

function resize() {
  state.width = window.innerWidth;
  state.height = window.innerHeight;
  state.centerX = state.width * 0.5;
  state.horizonY = state.height * 0.5;
  state.focal = state.width < 900 ? 760 : 980;
  state.nearClipZ = -state.focal + 60;
  if (state.width >= 900) {
    const regionH = Math.min(state.height * 0.94, state.width * (9 / 16));
    const regionW = regionH * (16 / 9);
    state.spawnHalfW = regionW * 0.5;
    state.spawnHalfH = regionH * 0.5;
  } else {
    state.spawnHalfW = state.width * 0.6;
    state.spawnHalfH = state.height * 0.82;
  }
  state.laneBase = Math.min(state.width * (state.width < 900 ? 0.36 : 0.45), state.width < 900 ? 390 : 560);
  state.spacing = state.width < 900 ? 660 : 760;
  state.baseZ = state.width < 900 ? 980 : 1120;
  state.photoFarZ = state.width < 900 ? 5000 : 5600;
  state.photoNearZ = state.width < 900 ? 180 : 220;
  const shortSide = Math.min(state.width, state.height);
  state.cursorRadiusFlow = clamp(shortSide * 0.25, 130, 280);
  state.cursorRadiusAmbient = clamp(shortSide * 0.19, 100, 210);
  state.cursorRadiusFront = clamp(shortSide * 0.22, 115, 235);
  state.cursorPullFlow = clamp(shortSide * 0.02, 8, 18);
  state.cursorPullAmbient = clamp(shortSide * 0.011, 4, 10);
  state.cursorPullFront = clamp(shortSide * 0.014, 5, 13);

  canvas.width = state.width;
  canvas.height = state.height;
  if (frontCanvas) {
    frontCanvas.width = state.width;
    frontCanvas.height = state.height;
  }

  const maxRow = Math.floor((memoryMeta.length - 1) / 2);
  state.maxTravel = Math.max(0, maxRow * state.spacing + 2600);
  state.targetTravel = Math.min(state.targetTravel, state.maxTravel);
  state.travel = Math.min(state.travel, state.maxTravel);
  if (!state.pointerActive) {
    state.pointerScreenX = state.centerX;
    state.pointerScreenY = state.horizonY;
    state.pointerX = 0;
    state.pointerY = 0;
  }
  initParticles();
}

function drawGalaxy(time) {
  ctx.clearRect(0, 0, state.width, state.height);

  const gradient = ctx.createLinearGradient(0, 0, 0, state.height);
  gradient.addColorStop(0, "#000105");
  gradient.addColorStop(0.5, "#01030b");
  gradient.addColorStop(1, "#020611");
  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, state.width, state.height);

  nebula.forEach((blob) => {
    const x = state.width * blob.x + state.pointerX * 8;
    const y = state.height * blob.y + state.pointerY * 6;
    const g = ctx.createRadialGradient(x, y, 0, x, y, blob.radius);
    g.addColorStop(0, `hsla(${blob.hue}, 88%, 62%, ${blob.alpha})`);
    g.addColorStop(1, "transparent");
    ctx.fillStyle = g;
    ctx.beginPath();
    ctx.arc(x, y, blob.radius, 0, Math.PI * 2);
    ctx.fill();
  });

  stars.forEach((star) => {
    const x = star.x * state.width + state.pointerX * star.r * 6;
    const y = star.y * state.height + state.pointerY * star.r * 4;
    const alpha = 0.26 + Math.sin(time * 0.00045 * star.twinkle + star.phase) * 0.24;
    ctx.fillStyle = `rgba(226,236,255,${alpha})`;
    ctx.beginPath();
    ctx.arc(x, y, star.r, 0, Math.PI * 2);
    ctx.fill();
  });

  const deepMask = ctx.createLinearGradient(0, 0, 0, state.height);
  deepMask.addColorStop(0, "rgba(0,0,0,0.22)");
  deepMask.addColorStop(0.45, "rgba(0,0,0,0.14)");
  deepMask.addColorStop(1, "rgba(0,0,0,0.36)");
  ctx.fillStyle = deepMask;
  ctx.fillRect(0, 0, state.width, state.height);
}

function drawAmbientParticles(dt, time) {
  const scrollInfluence = clamp(Math.abs(state.scrollVelocity) * 0.0002, 0, 0.24);
  ctx.globalCompositeOperation = "lighter";
  for (let i = 0; i < ambientParticles.length; i += 1) {
    const p = ambientParticles[i];
    p.x += (p.vx + state.pointerX * 4) * dt;
    p.y += (p.vy + state.pointerY * 3 + state.flowDirection * scrollInfluence * 22) * dt;

    if (p.x < -4) p.x = state.width + 3;
    else if (p.x > state.width + 4) p.x = -3;
    if (p.y < -4) p.y = state.height + 3;
    else if (p.y > state.height + 4) p.y = -3;

    const tw = 0.74 + Math.sin(time * 0.00065 * p.twinkle + p.phase) * 0.26;
    applyCursorPull(p, p.x, p.y, dt, state.cursorRadiusAmbient, state.cursorPullAmbient, 14, 8);
    ctx.globalAlpha = p.alpha * tw * state.userAmbient;
    ctx.fillStyle = p.color;
    const d = p.size < 0.75 ? 0.85 : p.size;
    ctx.fillRect(p.renderX - d * 0.5, p.renderY - d * 0.5, d, d);
  }
  ctx.globalAlpha = 1;
  ctx.globalCompositeOperation = "source-over";
}

function drawFlowParticles(dt) {
  const impulse = Math.min(0.06, Math.abs(state.scrollVelocity) * 0.000032 * state.userSpeed);
  const base = 0.03 * state.userSpeed;
  const direction = state.flowDirection;
  const respawnMode = direction > 0 ? "far" : "near";

  ctx.globalCompositeOperation = "lighter";

  for (let i = 0; i < flowParticles.length; i += 1) {
    const p = flowParticles[i];
    const speed = dt * (base * (0.85 + p.core * 0.35) + impulse * (0.35 + p.core * 1.2));
    p.depth += direction > 0 ? -speed : speed;

    if (p.depth < 0 || p.depth > 1) {
      spawnFlowParticle(p, respawnMode);
    }

    const progress = 1 - p.depth;
    const z = state.photoNearZ + (state.photoFarZ - state.photoNearZ) * p.depth;
    const wx = p.rx * state.spawnHalfW
      + p.curveX * Math.sin(progress * 5.8 + p.phase) * progress
      + p.driftX * state.spawnHalfW * progress;
    const wy = p.ry * state.spawnHalfH
      + p.curveY * Math.cos(progress * 5.1 + p.phase) * progress
      + p.driftY * state.spawnHalfH * progress;
    const fillSpread = 1 + state.userFill * (0.38 + Math.pow(progress, 1.18) * 1.12);

    const farWeight = Math.pow(p.depth, 2.2);
    const proj = projectWorld(
      (wx + p.farJitterX * farWeight) * fillSpread,
      (wy + p.farJitterY * farWeight) * fillSpread,
      z
    );

    const edgeBoost = Math.abs(p.rx) > 0.72 ? 1.14 : 1;
    const farAppear = easeOutCubic(clamp(progress / 0.18, 0, 1));
    const alpha = p.alpha * (0.52 + progress * 0.58) * (0.9 + p.core * 0.26) * edgeBoost * (0.12 + 0.88 * farAppear) * state.userAlpha;
    const size = (p.size + Math.pow(progress, 1.2) * (0.42 + p.core * 0.35)) * state.userSize;

    applyCursorPull(p, proj.x, proj.y, dt, state.cursorRadiusFlow, state.cursorPullFlow, 12, 7);
    const renderX = p.renderX;
    const renderY = p.renderY;

    if (!Number.isFinite(p.prevX) || !Number.isFinite(p.prevY)) {
      p.prevX = renderX;
      p.prevY = renderY;
    }

    if (p.core > 0.58 && i % 6 === 0) {
      ctx.globalAlpha = alpha * 0.34;
      ctx.strokeStyle = p.strokeColor;
      ctx.lineWidth = Math.max(0.08, size * 0.34);
      ctx.beginPath();
      ctx.moveTo(p.prevX, p.prevY);
      ctx.lineTo(renderX, renderY);
      ctx.stroke();
    }

    ctx.globalAlpha = Math.min(1, alpha * 0.9);
    ctx.fillStyle = p.fillColor;
    if (size < 1.16) {
      const d = Math.max(0.56, size * 1.22);
      ctx.fillRect(renderX - d * 0.5, renderY - d * 0.5, d, d);
    } else {
      ctx.beginPath();
      ctx.arc(renderX, renderY, size, 0, Math.PI * 2);
      ctx.fill();
    }

    p.prevX = renderX;
    p.prevY = renderY;
  }

  ctx.globalAlpha = 1;
  ctx.globalCompositeOperation = "source-over";
}

function renderCards() {
  syncVisibleCards();

  let focusCard = null;
  let focusScore = Infinity;

  activeCards.forEach((card) => {
    const meta = card.meta;
    const z = photoZ(meta);

    if (z < state.nearClipZ || z > state.photoFarZ + 120) {
      card.element.style.opacity = "0";
      card.element.style.pointerEvents = "none";
      card.element.classList.remove("is-hovered");
      return;
    }

    const wx = meta.side * state.laneBase * meta.laneScale
      + meta.xRelax * state.laneBase * 0.42
      + meta.xJitter;
    const wy = meta.yNorm * state.spawnHalfH * 1.35 + meta.yJitter;
    const proj = projectWorld(wx, wy, z);
    const width = clamp(108, state.userCardMax, 334 * proj.scale * 1.18 * meta.sizeScale);
    const angle = meta.tilt;

    const farT = clamp((state.photoFarZ - 260 - z) / 3500, 0, 1);
    const farFade = 0.08 + 0.92 * easeOutCubic(farT);
    let opacity = clamp(farFade, 0, 1);

    const fadeStartZ = state.nearClipZ + state.userFadeStart;
    if (z < fadeStartZ) {
      const fadeSpan = Math.max(36, state.userFadeStart / Math.max(0.2, state.userFadeRate));
      const t = clamp((fadeStartZ - z) / fadeSpan, 0, 1);
      const nearFade = 1 - Math.pow(t, 1.15);
      opacity *= clamp(nearFade, 0, 1);
    }

    const approxHeight = width / 1.45 + 26;
    const fullOut = (
      proj.x + width * 0.5 < 0 ||
      proj.x - width * 0.5 > state.width ||
      proj.y + approxHeight * 0.5 < 0 ||
      proj.y - approxHeight * 0.5 > state.height
    );
    if (fullOut) {
      opacity = 0;
    }

    // Keep strict monotonic stacking by depth; avoid near-end clamp saturation.
    const zIndex = Math.round(200000 - z * 100) + meta.index;

    card.element.style.width = `${width}px`;
    card.element.style.opacity = `${opacity}`;
    card.element.style.zIndex = `${zIndex}`;
    card.element.style.transform = `translate3d(${proj.x}px, ${proj.y}px, 0) translate(-50%, -50%) rotate(${angle}deg)`;
    card.element.style.pointerEvents = opacity < 0.42 ? "none" : "auto";
    if (opacity < 0.42) {
      card.element.classList.remove("is-hovered");
    }

    const score = Math.abs(z - 920);
    if (score < focusScore && z > state.photoNearZ + 120 && z < 3000 && opacity > 0.6) {
      focusScore = score;
      focusCard = card;
    }
  });

  activeCards.forEach((card) => {
    card.element.classList.toggle("is-focus", card === focusCard);
  });
}

function drawForegroundParticles(dt) {
  if (!frontCtx || !frontCanvas) return;
  frontCtx.clearRect(0, 0, state.width, state.height);
  frontCtx.globalCompositeOperation = "lighter";

  const impulse = clamp(Math.abs(state.scrollVelocity) * 0.000025, 0, 0.03);
  for (let i = 0; i < foregroundParticles.length; i += 1) {
    const p = foregroundParticles[i];
    p.depth += state.flowDirection > 0 ? -dt * (0.052 + impulse) : dt * (0.052 + impulse);

    if (p.depth < 0 || p.depth > 1) {
      spawnForegroundParticle(p, state.flowDirection > 0 ? "far" : "near");
    }

    const z = 90 + 1150 * p.depth;
    const wx = p.rx * state.spawnHalfW * 1.55 + Math.sin((1 - p.depth) * 4.8 + p.phase) * 18;
    const wy = p.ry * state.spawnHalfH * 1.45 + Math.cos((1 - p.depth) * 4.2 + p.phase) * 14;
    const fillSpread = 1 + state.userFill * Math.pow(1 - p.depth, 1.15);
    const proj = projectWorld(wx * fillSpread, wy * fillSpread, z);

    const progress = 1 - p.depth;
    const alpha = p.alpha * (0.28 + progress * 0.7) * state.userAlpha;
    const size = (p.size + progress * 0.95) * state.userSize;
    applyCursorPull(p, proj.x, proj.y, dt, state.cursorRadiusFront, state.cursorPullFront, 13, 8);
    frontCtx.globalAlpha = alpha;
    frontCtx.fillStyle = p.color;
    frontCtx.fillRect(p.renderX - size * 0.5, p.renderY - size * 0.5, size, size);
  }

  frontCtx.globalAlpha = 1;
  frontCtx.globalCompositeOperation = "source-over";
}

function onWheel(event) {
  event.preventDefault();
  state.targetTravel += event.deltaY * 1.08;
  state.targetTravel = clamp(state.targetTravel, 0, state.maxTravel);
}

function onKeydown(event) {
  if (event.key === "ArrowDown" || event.key === "PageDown") {
    state.targetTravel = clamp(state.targetTravel + 190, 0, state.maxTravel);
  } else if (event.key === "ArrowUp" || event.key === "PageUp") {
    state.targetTravel = clamp(state.targetTravel - 190, 0, state.maxTravel);
  }
}

function onPointerMove(event) {
  state.pointerX = event.clientX / state.width - 0.5;
  state.pointerY = event.clientY / state.height - 0.5;
  state.pointerScreenX = event.clientX;
  state.pointerScreenY = event.clientY;
  state.pointerActive = true;
}

function onPointerLeave() {
  state.pointerActive = false;
}

function bindControls() {
  if (!controls.density) return;
  const updateLabels = () => {
    controlValues.density.textContent = Number(controls.density.value).toFixed(2);
    controlValues.size.textContent = Number(controls.size.value).toFixed(2);
    controlValues.alpha.textContent = Number(controls.alpha.value).toFixed(2);
    controlValues.speed.textContent = Number(controls.speed.value).toFixed(2);
    controlValues.fill.textContent = Number(controls.fill.value).toFixed(2);
    controlValues.ambient.textContent = Number(controls.ambient.value).toFixed(2);
    controlValues.cardMax.textContent = `${Math.round(Number(controls.cardMax.value))}`;
    controlValues.fadeStart.textContent = `${Math.round(Number(controls.fadeStart.value))}`;
    controlValues.fadeRate.textContent = Number(controls.fadeRate.value).toFixed(2);
    controlValues.glowBorder.textContent = `${Math.round(Number(controls.glowBorder.value))}`;
    controlValues.cursorRange.textContent = Number(controls.cursorRange.value).toFixed(2);
    controlValues.cursorPull.textContent = Number(controls.cursorPull.value).toFixed(2);
    controlValues.cursorIn.textContent = Number(controls.cursorIn.value).toFixed(2);
    controlValues.cursorOut.textContent = Number(controls.cursorOut.value).toFixed(2);
  };
  const apply = () => {
    state.userDensity = Number(controls.density.value);
    state.userSize = Number(controls.size.value);
    state.userAlpha = Number(controls.alpha.value);
    state.userSpeed = Number(controls.speed.value);
    state.userFill = Number(controls.fill.value);
    state.userAmbient = Number(controls.ambient.value);
    state.userCardMax = Number(controls.cardMax.value);
    state.userFadeStart = Number(controls.fadeStart.value);
    state.userFadeRate = Number(controls.fadeRate.value);
    state.userGlowBorder = Number(controls.glowBorder.value);
    state.userCursorRange = Number(controls.cursorRange.value);
    state.userCursorPull = Number(controls.cursorPull.value);
    state.userCursorIn = Number(controls.cursorIn.value);
    state.userCursorOut = Number(controls.cursorOut.value);
    corridorEl.style.setProperty("--hover-glow-border", `${state.userGlowBorder}px`);
    updateLabels();
    initParticles();
  };
  Object.values(controls).forEach((el) => {
    el.addEventListener("input", apply);
  });
  apply();
}

let last = performance.now();
function tick(now) {
  const dt = Math.min((now - last) / 1000, 0.04);
  last = now;

  const prevTravel = state.travel;
  const smooth = state.width < 900 ? 0.11 : 0.09;
  state.travel += (state.targetTravel - state.travel) * smooth;
  state.scrollVelocity = (state.travel - prevTravel) / Math.max(dt, 0.001);

  if (Math.abs(state.scrollVelocity) > 1.4) {
    state.flowDirection = state.scrollVelocity > 0 ? 1 : -1;
  }

  drawGalaxy(now);
  drawAmbientParticles(dt, now);
  drawFlowParticles(dt);
  renderCards();
  drawForegroundParticles(dt);

  perf.sampleFrames += 1;
  perf.sampleTime += dt;
  if (perf.sampleTime > 1.4 && now - perf.lastTuneAt > 1600) {
    const fps = perf.sampleFrames / perf.sampleTime;
    if (fps < 44 && state.particleLoad > 0.52) {
      state.particleLoad = Math.max(0.52, state.particleLoad - 0.16);
      initParticles();
      perf.lastTuneAt = now;
    } else if (fps > 57 && state.particleLoad < 1) {
      state.particleLoad = Math.min(1, state.particleLoad + 0.08);
      initParticles();
      perf.lastTuneAt = now;
    }
    perf.sampleFrames = 0;
    perf.sampleTime = 0;
  }

  requestAnimationFrame(tick);
}

resize();
bindControls();
renderCards();

window.addEventListener("resize", resize);
window.addEventListener("wheel", onWheel, { passive: false });
window.addEventListener("keydown", onKeydown);
window.addEventListener("pointermove", onPointerMove);
window.addEventListener("pointerleave", onPointerLeave);
window.addEventListener("pointercancel", onPointerLeave);
window.addEventListener("blur", onPointerLeave);

requestAnimationFrame(tick);
