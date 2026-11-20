import type { Cleanup } from "./types";

const PAD = 14;

const VERT = `attribute vec2 a;void main(){gl_Position=vec4(a,0.,1.);}`;
const FRAG = `precision highp float;
uniform vec2 uRes;uniform float uDpr;uniform float uTime;uniform vec4 uPill;
uniform vec4 uBlob[6];uniform float uSy[6];uniform vec4 uRip[6];uniform vec3 uMouse;uniform float uDark;uniform float uAmb;
float sdRB(vec2 p,vec2 b,float r){vec2 q=abs(p)-b+r;return length(max(q,0.))+min(max(q.x,q.y),0.)-r;}
float sdCap(vec2 p,vec4 B,float sy){p-=B.xy;p.y/=sy;p.x=max(abs(p.x)-B.z,0.);return(length(p)-B.w)*min(1.,sy);}
float smin(float a,float b,float k){float h=clamp(.5+.5*(b-a)/k,0.,1.);return mix(b,a,h)-k*h*(1.-h);}
float dropD(vec2 p){float d=1e4;for(int i=0;i<6;i++){if(uBlob[i].w>.5){d=smin(d,sdCap(p,uBlob[i],uSy[i]),13.);}}return d;}
float pillD(vec2 p){vec2 h=uPill.zw*.5;return sdRB(p-uPill.xy-h,h,h.y);}
float lens(float d,float w){float t=clamp(-d/w,0.,1.);return sqrt(1.-(1.-t)*(1.-t));}
float waves(vec2 p){float w=0.;
 for(int i=0;i<6;i++){vec4 R=uRip[i];if(R.w>0.){float x=length(p-R.xy)-R.z*240.;w+=R.w*exp(-R.z*1.7)*sin(x*.3)*exp(-x*x/700.);}}
 vec2 m=p-uMouse.xy;w+=uMouse.z*3.6*exp(-dot(m,m)/1000.);
 w+=uAmb*(sin(p.x*.05+uTime*1.2)*.45+sin(p.x*.13-uTime*.85+p.y*.2)*.25);return w;}
float H(vec2 p){float dp=pillD(p);return lens(dp,uPill.w*.36)*2.4+lens(dropD(p),11.)*7.5+waves(p)*smoothstep(0.,7.,-dp);}
float caus(vec2 p,float t){vec2 q=p;float c=0.;for(int i=0;i<3;i++){q+=vec2(sin(q.y*1.1+t),cos(q.x*1.3-t*.7))*.6;c+=1./(1.+16.*abs(sin(q.x)*sin(q.y)));}return c/3.;}
void main(){
 vec2 p=vec2(gl_FragCoord.x,uRes.y*uDpr-gl_FragCoord.y)/uDpr;
 float dp=pillD(p);float dd=dropD(p);
 float h0=H(p);vec3 n=normalize(vec3(h0-H(p+vec2(1.,0.)),h0-H(p+vec2(0.,1.)),1.));
 vec3 V=vec3(0.,0.,1.);
 float spec=pow(max(dot(reflect(-normalize(vec3(-.45,-.8,.85)),n),V),0.),70.);
 float spec2=pow(max(dot(reflect(-normalize(vec3(.6,.75,.7)),n),V),0.),22.)*.3;
 float fres=clamp((1.-n.z)*4.,0.,1.);
 vec3 irid=.5+.5*cos(6.2831*(vec3(0.,.33,.67)+fres*.85+p.x*.0028+uTime*.035));
 float pm=smoothstep(1.,-1.,dp);float dm=smoothstep(1.,-1.,dd)*smoothstep(1.,-2.,dp);
 float sh=smoothstep(9.,-9.,dropD(p-vec2(0.,5.)))*(1.-dm)*pm*(.11+.07*uDark);
 vec3 c=vec3(0.,.14,.36)*sh;float a=sh;
 float pa=clamp(pm*(fres*.5+spec*.9+spec2),0.,1.);
 c=mix(vec3(1.),irid,.5*fres)*pa+c*(1.-pa);a=pa+a*(1.-pa);
 float th=lens(dd,11.);
 float cs=caus((p+n.xy*th*18.)*.085,uTime*.9);
 vec3 tint=mix(vec3(.80,.95,1.),vec3(.55,.82,1.),uDark);
 float rim=dm*(1.-smoothstep(0.,8.,-dd));
 float cres=dm*smoothstep(.12,.55,dot(n.xy,normalize(vec2(.55,.85))))*smoothstep(0.,3.,-dd);
 float body=.5+.5*clamp(-n.y*3.,-1.,1.);
 float da=dm*(.26+.14*body)*(1.-.35*uDark);vec3 dc=mix(tint,vec3(1.),body*.6);
 float la=rim*.22;vec3 lc=mix(vec3(0.,.42,.78),vec3(.1,.55,.95),uDark);dc=lc*la+dc*da*(1.-la);da=la+da*(1.-la);
 la=clamp(cres*.7+smoothstep(.6,1.,cs)*.28*th*dm,0.,1.);dc=vec3(1.)*la+dc*(1.-la);da=la+da*(1.-la);
 la=clamp(dm*(spec*1.2+spec2*.5),0.,1.);dc=vec3(1.)*la+dc*(1.-la);da=la+da*(1.-la);
 la=dm*smoothstep(-2.,0.,dd)*.4;dc=mix(vec3(1.),irid,.35)*la+dc*(1.-la);da=la+da*(1.-la);
 c=dc+c*(1.-da);a=da+a*(1.-da);
 gl_FragColor=vec4(c,a);
}`;

const UNIFORMS = ["uRes", "uDpr", "uTime", "uPill", "uBlob", "uSy", "uRip", "uMouse", "uDark", "uAmb"] as const;
type UniformName = (typeof UNIFORMS)[number];
type GLContext = { gl: WebGLRenderingContext; u: Record<UniformName, WebGLUniformLocation | null> };

type Body = { x: number; v: number };
type Satellite = { x: number; y: number; vx: number; vy: number; r: number; k: number };
type Ripple = { x: number; y: number; age: number; amp: number };
type AudioWindow = Window & { webkitAudioContext?: typeof AudioContext };

function initGL(canvas: HTMLCanvasElement): GLContext | null {
  const gl = canvas.getContext("webgl", { premultipliedAlpha: true, alpha: true, antialias: false });
  if (!gl) return null;

  const compile = (type: number, source: string) => {
    const shader = gl.createShader(type);
    if (!shader) return null;
    gl.shaderSource(shader, source);
    gl.compileShader(shader);
    return gl.getShaderParameter(shader, gl.COMPILE_STATUS) ? shader : null;
  };

  const vertex = compile(gl.VERTEX_SHADER, VERT);
  const fragment = compile(gl.FRAGMENT_SHADER, FRAG);
  const program = gl.createProgram();
  if (!vertex || !fragment || !program) return null;

  gl.attachShader(program, vertex);
  gl.attachShader(program, fragment);
  gl.linkProgram(program);
  if (!gl.getProgramParameter(program, gl.LINK_STATUS)) return null;

  gl.useProgram(program);
  gl.bindBuffer(gl.ARRAY_BUFFER, gl.createBuffer());
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 3, -1, -1, 3]), gl.STATIC_DRAW);

  const location = gl.getAttribLocation(program, "a");
  gl.enableVertexAttribArray(location);
  gl.vertexAttribPointer(location, 2, gl.FLOAT, false, 0, 0);

  const u = Object.fromEntries(UNIFORMS.map((name) => [name, gl.getUniformLocation(program, name)])) as GLContext["u"];
  return { gl, u };
}

function supportsRefraction() {
  const ua = navigator.userAgent;
  return /Chrome\/|Chromium\/|Edg\//.test(ua) && !/Firefox\//.test(ua) && CSS.supports("backdrop-filter", "url(#a)");
}

export function mountLiquidNavbar(navEl: HTMLElement): Cleanup {
  const canvas = navEl.querySelector<HTMLCanvasElement>(".nimbus-water");
  const drop = navEl.querySelector<HTMLElement>(".nimbus-drop");
  const items = [...navEl.querySelectorAll<HTMLElement>(".nimbus-item")];
  const actionOnly = navEl.hasAttribute("data-liquid-action");
  const controller = new AbortController();
  const options = { signal: controller.signal };
  const timers = new Set<number>();

  let current = Math.max(
    0,
    items.findIndex((el) => el.getAttribute("aria-current") === "page")
  );

  const dark = (navEl.getAttribute("data-tone") || "dark") === "dark" ? 1 : 0;
  const soundEnabled = navEl.getAttribute("data-sound") === "true";
  let audioCtx: AudioContext | null = null;

  if (supportsRefraction()) navEl.setAttribute("data-refract", "on");

  const st = {
    a: { x: 0, v: 0 } as Body,
    b: { x: 0, v: 0 } as Body,
    sy: { s: 1, v: 0 },
    lead: 0,
    lagFrom: 0,
    sats: [] as Satellite[],
    rips: [] as Ripple[],
    t: { x: 0, cy: 0, q: 0, r: 21 },
    q: 0,
    mouse: { x: 0, y: 0, s: 0, on: false },
    moving: false,
    split: false,
    ready: false,
    w: 0,
    h: 0,
    active: !actionOnly,
    reduce: window.matchMedia("(prefers-reduced-motion: reduce)").matches,
    raf: 0,
    last: 0,
    time: 0,
    glc: canvas ? initGL(canvas) : null
  };

  if (!st.glc) navEl.setAttribute("data-gl", "off");

  const later = (callback: () => void, ms: number) => {
    const id = window.setTimeout(() => {
      timers.delete(id);
      callback();
    }, ms);
    timers.add(id);
  };

  const playSound = () => {
    if (!soundEnabled) return;
    try {
      const AudioClass = window.AudioContext || (window as AudioWindow).webkitAudioContext;
      if (!AudioClass) return;
      audioCtx ??= new AudioClass();
      const t = audioCtx.currentTime;
      const osc = audioCtx.createOscillator();
      const gain = audioCtx.createGain();
      osc.type = "sine";
      osc.frequency.setValueAtTime(420 + Math.random() * 80, t);
      osc.frequency.exponentialRampToValueAtTime(1500, t + 0.07);
      gain.gain.setValueAtTime(0.0001, t);
      gain.gain.exponentialRampToValueAtTime(0.16, t + 0.008);
      gain.gain.exponentialRampToValueAtTime(0.0001, t + 0.16);
      osc.connect(gain).connect(audioCtx.destination);
      osc.start(t);
      osc.stop(t + 0.18);
    } catch {
      audioCtx = null;
    }
  };

  const draw = () => {
    const T = st.t;
    const sep = Math.abs(st.a.x - st.b.x);
    const thin = Math.min(sep / (2 * (st.q + T.r) || 1), 1);
    const r = T.r * (1 - 0.3 * thin);

    if (st.glc) {
      const { gl: g, u } = st.glc;
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      g.viewport(0, 0, g.drawingBufferWidth, g.drawingBufferHeight);
      g.uniform2f(u.uRes, st.w + PAD * 2, st.h + PAD * 2);
      g.uniform1f(u.uDpr, dpr);
      g.uniform1f(u.uTime, st.time);
      g.uniform4f(u.uPill, PAD, PAD, st.w, st.h);

      const blobs = new Float32Array(24);
      const sy = new Float32Array(6).fill(1);
      const head = st.lead === 0 ? st.a : st.b;
      const tail = st.lead === 0 ? st.b : st.a;
      blobs.set(
        [
          head.x,
          T.cy,
          st.q * (1 - 0.25 * thin),
          T.r * (1 - 0.12 * thin),
          tail.x,
          T.cy,
          st.q * (1 - 0.8 * thin),
          T.r * (1 - 0.5 * thin)
        ],
        0
      );
      sy[0] = sy[1] = st.sy.s;
      st.sats.slice(0, 4).forEach((d, i) => blobs.set([d.x, d.y, 0, d.r], 8 + i * 4));
      g.uniform4fv(u.uBlob, blobs);
      g.uniform1fv(u.uSy, sy);

      const rips = new Float32Array(24);
      st.rips.slice(-6).forEach((p, i) => rips.set([p.x, p.y, p.age, p.amp], i * 4));
      g.uniform4fv(u.uRip, rips);
      g.uniform3f(u.uMouse, st.mouse.x, st.mouse.y, st.mouse.s);
      g.uniform1f(u.uDark, dark);
      g.uniform1f(u.uAmb, st.reduce ? 0 : 1);
      g.clearColor(0, 0, 0, 0);
      g.clear(g.COLOR_BUFFER_BIT);
      g.drawArrays(g.TRIANGLES, 0, 3);
    } else if (drop) {
      const left = Math.min(st.a.x, st.b.x) - st.q - r - PAD;
      const width = sep + 2 * (st.q + r);
      drop.style.width = `${width}px`;
      drop.style.transform = `translateX(${left}px) scaleY(${st.sy.s})`;
    }
  };

  const step = (dt: number, now: number) => {
    const T = st.t;
    st.time += dt;
    st.q += (T.q - st.q) * Math.min(1, dt * 12);
    const bodies = [st.a, st.b];
    let still = true;

    if (st.reduce) {
      st.a.x = st.b.x = T.x;
      st.a.v = st.b.v = 0;
      st.sy.s = 1;
      st.sats = [];
    } else {
      bodies.forEach((B, i) => {
        const lead = i === st.lead;
        const k = lead ? 210 : 72;
        const c = lead ? 25 : 13;
        const f = !lead && now < st.lagFrom ? 0.08 : 1;
        B.v += (k * (T.x - B.x) - c * B.v) * dt * f;
        B.x += B.v * dt;
        const lo = PAD + 6 + st.q + T.r - 3;
        const hi = PAD + st.w - 6 - st.q - T.r + 3;
        if (B.x < lo || B.x > hi) {
          st.sy.v -= Math.min(Math.abs(B.v), 900) * 0.0016;
          B.x = Math.max(lo, Math.min(hi, B.x));
          B.v *= -0.25;
        }
        if (Math.abs(T.x - B.x) > 0.3 || Math.abs(B.v) > 3) still = false;
      });

      const L = bodies[st.lead];
      const syT = 1 - 0.2 * Math.min(Math.abs(L.v) / 1500, 1);
      st.sy.v += (280 * (syT - st.sy.s) - 9 * st.sy.v) * dt;
      st.sy.s += st.sy.v * dt;
      if (Math.abs(st.sy.s - 1) > 0.002 || Math.abs(st.sy.v) > 0.02) still = false;

      const sep = Math.abs(st.a.x - st.b.x);
      const r = T.r * (1 - 0.3 * Math.min(sep / (2 * (T.q + T.r) || 1), 1));
      if (!st.split && st.moving && sep - 2 * T.q - 2 * r > -6) {
        st.split = true;
        const lo = bodies[1 - st.lead];
        const hi = bodies[st.lead];
        [0.3, 0.5, 0.72].forEach((t, j) => {
          st.sats.push({
            x: lo.x + (hi.x - lo.x) * t + (Math.random() - 0.5) * 6,
            y: T.cy + (Math.random() - 0.5) * 10,
            vx: (lo.v + hi.v) * 0.45,
            vy: (Math.random() - 0.5) * 60,
            r: 5 + Math.random() * 3 - j * 0.5,
            k: 70 + Math.random() * 90
          });
        });
      }

      st.sats = st.sats.filter((d) => {
        d.vx += (d.k * (T.x - d.x) - 9 * d.vx) * dt;
        d.vy += (90 * (T.cy - d.y) - 7 * d.vy) * dt;
        d.x += d.vx * dt;
        d.y += d.vy * dt;
        d.x = Math.max(PAD + 8 + d.r, Math.min(PAD + st.w - 8 - d.r, d.x));
        d.y = Math.max(T.cy - T.r + d.r, Math.min(T.cy + T.r - d.r, d.y));
        if (Math.abs(T.x - d.x) < T.q + T.r * 0.5) d.r -= dt * 26;
        return d.r > 0.6;
      });

      if (st.sats.length) still = false;
    }

    if (st.moving && still) {
      st.moving = false;
      if (st.split || !st.reduce) st.rips.push({ x: T.x, y: T.cy, age: 0, amp: st.split ? 1.2 : 0.7 });
    }

    st.rips.forEach((p) => (p.age += dt));
    st.rips = st.rips.filter((p) => p.age < 2.4);

    const target = st.mouse.on ? 1 : 0;
    st.mouse.s += (target - st.mouse.s) * Math.min(1, dt * 7);
  };

  const loop = () => {
    if (st.raf || controller.signal.aborted) return;
    st.last = performance.now();
    const tick = (now: number) => {
      const dt = Math.min((now - st.last) / 1000, 1 / 30);
      st.last = now;
      step(dt, now);
      draw();
      const busy = st.moving || st.rips.length || st.sats.length || st.mouse.s > 0.01;
      st.raf = st.active && (!st.reduce || busy) ? requestAnimationFrame(tick) : 0;
    };
    st.raf = requestAnimationFrame(tick);
  };

  const measure = () => {
    const el = items[current];
    if (!el) return;
    st.w = navEl.offsetWidth;
    st.h = navEl.offsetHeight;

    const T = st.t;
    T.r = el.offsetHeight / 2;
    T.q = Math.max(0, el.offsetWidth / 2 - T.r);
    T.cy = PAD + el.offsetTop + el.offsetHeight / 2;
    const nx = PAD + el.offsetLeft + el.offsetWidth / 2;

    if (!st.ready) {
      st.a.x = st.b.x = nx;
      st.q = T.q;
      st.ready = true;
    } else if (Math.abs(nx - T.x) > 0.5) {
      st.lead = Math.abs(nx - st.a.x) <= Math.abs(nx - st.b.x) ? 0 : 1;
      st.lagFrom = performance.now() + 70;
      st.moving = true;
      st.split = false;
    }
    T.x = nx;

    if (canvas) {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      const W = st.w + PAD * 2;
      const H = st.h + PAD * 2;
      if (canvas.width !== Math.round(W * dpr) || canvas.height !== Math.round(H * dpr)) {
        canvas.width = Math.round(W * dpr);
        canvas.height = Math.round(H * dpr);
        canvas.style.width = `${W}px`;
        canvas.style.height = `${H}px`;
      }
    }
    loop();
  };

  const localCoords = (clientX: number, clientY: number) => {
    const rect = navEl.getBoundingClientRect();
    return { x: clientX - rect.left + PAD, y: clientY - rect.top + PAD };
  };

  const ripple = (x: number, y: number, amp: number) => {
    if (st.reduce) return;
    st.rips.push({ x, y, age: 0, amp });
    loop();
  };

  const select = (index: number) => {
    current = index;
    items.forEach((it, i) => {
      const ico = it.querySelector<HTMLElement>(".nv-ico");
      if (i === current) {
        if (!actionOnly) it.setAttribute("aria-current", "page");
        if (ico) {
          ico.setAttribute("data-fx", it.getAttribute("data-fx") || "pop");
          ico.style.animation = "none";
          void ico.offsetHeight;
          ico.style.animation = "";
        }
      } else {
        it.removeAttribute("aria-current");
        ico?.removeAttribute("data-fx");
      }
    });

    playSound();
    measure();

    const el = items[index];
    const box = el.getBoundingClientRect();
    const center = localCoords(box.left + box.width / 2, box.top + box.height / 2);
    const fx = el.getAttribute("data-fx") || "pop";
    if (fx === "drop") later(() => ripple(center.x, st.t.cy, 1.4), 430);
    else if (fx === "plane") ripple(center.x, center.y, 0.6);
  };

  items.forEach((item, i) => item.addEventListener("click", () => select(i), options));

  if (actionOnly) {
    const wake = () => {
      st.active = true;
      loop();
    };
    navEl.addEventListener("pointerenter", wake, options);
    navEl.addEventListener("focusin", wake, options);
    navEl.addEventListener(
      "pointerleave",
      () => {
        st.active = navEl.contains(document.activeElement);
      },
      options
    );
    navEl.addEventListener(
      "focusout",
      () => {
        st.active = navEl.matches(":hover");
      },
      options
    );
  }

  navEl.addEventListener(
    "pointermove",
    (event) => {
      if (event.pointerType !== "mouse") return;
      const p = localCoords(event.clientX, event.clientY);
      st.mouse.x = p.x;
      st.mouse.y = p.y;
      st.mouse.on = true;
      loop();
    },
    options
  );
  navEl.addEventListener(
    "pointerleave",
    () => {
      st.mouse.on = false;
      loop();
    },
    options
  );
  navEl.addEventListener(
    "pointerdown",
    (event) => {
      const p = localCoords(event.clientX, event.clientY);
      ripple(p.x, p.y, 0.8);
    },
    options
  );

  const resizeObserver = new ResizeObserver(() => {
    st.ready = false;
    measure();
  });
  resizeObserver.observe(navEl);
  later(measure, 50);

  return () => {
    controller.abort();
    resizeObserver.disconnect();
    timers.forEach((id) => window.clearTimeout(id));
    cancelAnimationFrame(st.raf);
    st.raf = 0;
    void audioCtx?.close();
  };
}
