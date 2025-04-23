import { s as subscribe } from "../../chunks/utils.js";
import { c as create_ssr_component, v as validate_component, o as onDestroy, a as add_styles, e as escape, m as missing_component, b as spread, d as escape_object, f as merge_ssr_styles, g as add_attribute, h as each } from "../../chunks/ssr.js";
import { p as page } from "../../chunks/stores.js";
import "../../chunks/cart.service.js";
import { i as isAuthenticated } from "../../chunks/userStore.js";
import "../../chunks/client.js";
import { u as useToasterStore, t as toast, a as update, e as endPause, s as startPause, p as prefersReducedMotion } from "../../chunks/Toaster.svelte_svelte_type_style_lang.js";
import { S as Search } from "../../chunks/search.js";
import { U as User } from "../../chunks/user.js";
import { I as Icon } from "../../chunks/Icon.js";
import { C as Chevron_down, S as Shopping_cart } from "../../chunks/shopping-cart.js";
import { w as writable } from "../../chunks/index2.js";
const Facebook = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  const iconNode = [
    [
      "path",
      {
        "d": "M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"
      }
    ]
  ];
  return `${validate_component(Icon, "Icon").$$render($$result, Object.assign({}, { name: "facebook" }, $$props, { iconNode }), {}, {
    default: () => {
      return `${slots.default ? slots.default({}) : ``}`;
    }
  })}`;
});
const Instagram = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  const iconNode = [
    [
      "rect",
      {
        "width": "20",
        "height": "20",
        "x": "2",
        "y": "2",
        "rx": "5",
        "ry": "5"
      }
    ],
    [
      "path",
      {
        "d": "M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"
      }
    ],
    [
      "line",
      {
        "x1": "17.5",
        "x2": "17.51",
        "y1": "6.5",
        "y2": "6.5"
      }
    ]
  ];
  return `${validate_component(Icon, "Icon").$$render($$result, Object.assign({}, { name: "instagram" }, $$props, { iconNode }), {}, {
    default: () => {
      return `${slots.default ? slots.default({}) : ``}`;
    }
  })}`;
});
const Mail = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  const iconNode = [
    [
      "rect",
      {
        "width": "20",
        "height": "16",
        "x": "2",
        "y": "4",
        "rx": "2"
      }
    ],
    [
      "path",
      {
        "d": "m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"
      }
    ]
  ];
  return `${validate_component(Icon, "Icon").$$render($$result, Object.assign({}, { name: "mail" }, $$props, { iconNode }), {}, {
    default: () => {
      return `${slots.default ? slots.default({}) : ``}`;
    }
  })}`;
});
const Menu = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  const iconNode = [
    [
      "line",
      {
        "x1": "4",
        "x2": "20",
        "y1": "12",
        "y2": "12"
      }
    ],
    [
      "line",
      {
        "x1": "4",
        "x2": "20",
        "y1": "6",
        "y2": "6"
      }
    ],
    [
      "line",
      {
        "x1": "4",
        "x2": "20",
        "y1": "18",
        "y2": "18"
      }
    ]
  ];
  return `${validate_component(Icon, "Icon").$$render($$result, Object.assign({}, { name: "menu" }, $$props, { iconNode }), {}, {
    default: () => {
      return `${slots.default ? slots.default({}) : ``}`;
    }
  })}`;
});
const Twitter = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  const iconNode = [
    [
      "path",
      {
        "d": "M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z"
      }
    ]
  ];
  return `${validate_component(Icon, "Icon").$$render($$result, Object.assign({}, { name: "twitter" }, $$props, { iconNode }), {}, {
    default: () => {
      return `${slots.default ? slots.default({}) : ``}`;
    }
  })}`;
});
function calculateOffset(toast2, $toasts, opts) {
  const { reverseOrder, gutter = 8, defaultPosition } = opts || {};
  const relevantToasts = $toasts.filter((t) => (t.position || defaultPosition) === (toast2.position || defaultPosition) && t.height);
  const toastIndex = relevantToasts.findIndex((t) => t.id === toast2.id);
  const toastsBefore = relevantToasts.filter((toast3, i) => i < toastIndex && toast3.visible).length;
  const offset = relevantToasts.filter((t) => t.visible).slice(...reverseOrder ? [toastsBefore + 1] : [0, toastsBefore]).reduce((acc, t) => acc + (t.height || 0) + gutter, 0);
  return offset;
}
const handlers = {
  startPause() {
    startPause(Date.now());
  },
  endPause() {
    endPause(Date.now());
  },
  updateHeight: (toastId, height) => {
    update({ id: toastId, height });
  },
  calculateOffset
};
function useToaster(toastOptions) {
  const { toasts, pausedAt } = useToasterStore(toastOptions);
  const timeouts = /* @__PURE__ */ new Map();
  let _pausedAt;
  const unsubscribes = [
    pausedAt.subscribe(($pausedAt) => {
      if ($pausedAt) {
        for (const [, timeoutId] of timeouts) {
          clearTimeout(timeoutId);
        }
        timeouts.clear();
      }
      _pausedAt = $pausedAt;
    }),
    toasts.subscribe(($toasts) => {
      if (_pausedAt) {
        return;
      }
      const now = Date.now();
      for (const t of $toasts) {
        if (timeouts.has(t.id)) {
          continue;
        }
        if (t.duration === Infinity) {
          continue;
        }
        const durationLeft = (t.duration || 0) + t.pauseDuration - (now - t.createdAt);
        if (durationLeft < 0) {
          if (t.visible) {
            toast.dismiss(t.id);
          }
          return null;
        }
        timeouts.set(t.id, setTimeout(() => toast.dismiss(t.id), durationLeft));
      }
    })
  ];
  onDestroy(() => {
    for (const unsubscribe of unsubscribes) {
      unsubscribe();
    }
  });
  return { toasts, handlers };
}
const css$8 = {
  code: "div.svelte-11kvm4p{width:20px;opacity:0;height:20px;border-radius:10px;background:var(--primary, #61d345);position:relative;transform:rotate(45deg);animation:svelte-11kvm4p-circleAnimation 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275) forwards;animation-delay:100ms}div.svelte-11kvm4p::after{content:'';box-sizing:border-box;animation:svelte-11kvm4p-checkmarkAnimation 0.2s ease-out forwards;opacity:0;animation-delay:200ms;position:absolute;border-right:2px solid;border-bottom:2px solid;border-color:var(--secondary, #fff);bottom:6px;left:6px;height:10px;width:6px}@keyframes svelte-11kvm4p-circleAnimation{from{transform:scale(0) rotate(45deg);opacity:0}to{transform:scale(1) rotate(45deg);opacity:1}}@keyframes svelte-11kvm4p-checkmarkAnimation{0%{height:0;width:0;opacity:0}40%{height:0;width:6px;opacity:1}100%{opacity:1;height:10px}}",
  map: `{"version":3,"file":"CheckmarkIcon.svelte","sources":["CheckmarkIcon.svelte"],"sourcesContent":["<!-- Adapted from https://github.com/timolins/react-hot-toast -->\\n<script>export let primary = \\"#61d345\\";\\nexport let secondary = \\"#fff\\";\\n<\/script>\\n\\n<div style:--primary={primary} style:--secondary={secondary} />\\n\\n<style>\\n\\tdiv {\\n\\t\\twidth: 20px;\\n\\t\\topacity: 0;\\n\\t\\theight: 20px;\\n\\t\\tborder-radius: 10px;\\n\\t\\tbackground: var(--primary, #61d345);\\n\\t\\tposition: relative;\\n\\t\\ttransform: rotate(45deg);\\n\\t\\tanimation: circleAnimation 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275) forwards;\\n\\t\\tanimation-delay: 100ms;\\n\\t}\\n\\n\\tdiv::after {\\n\\t\\tcontent: '';\\n\\t\\tbox-sizing: border-box;\\n\\t\\tanimation: checkmarkAnimation 0.2s ease-out forwards;\\n\\t\\topacity: 0;\\n\\t\\tanimation-delay: 200ms;\\n\\t\\tposition: absolute;\\n\\t\\tborder-right: 2px solid;\\n\\t\\tborder-bottom: 2px solid;\\n\\t\\tborder-color: var(--secondary, #fff);\\n\\t\\tbottom: 6px;\\n\\t\\tleft: 6px;\\n\\t\\theight: 10px;\\n\\t\\twidth: 6px;\\n\\t}\\n\\n\\t@keyframes circleAnimation {\\n\\t\\tfrom {\\n\\t\\t\\ttransform: scale(0) rotate(45deg);\\n\\t\\t\\topacity: 0;\\n\\t\\t}\\n\\t\\tto {\\n\\t\\t\\ttransform: scale(1) rotate(45deg);\\n\\t\\t\\topacity: 1;\\n\\t\\t}\\n\\t}\\n\\n\\t@keyframes checkmarkAnimation {\\n\\t\\t0% {\\n\\t\\t\\theight: 0;\\n\\t\\t\\twidth: 0;\\n\\t\\t\\topacity: 0;\\n\\t\\t}\\n\\t\\t40% {\\n\\t\\t\\theight: 0;\\n\\t\\t\\twidth: 6px;\\n\\t\\t\\topacity: 1;\\n\\t\\t}\\n\\t\\t100% {\\n\\t\\t\\topacity: 1;\\n\\t\\t\\theight: 10px;\\n\\t\\t}\\n\\t}\\n</style>\\n"],"names":[],"mappings":"AAQC,kBAAI,CACH,KAAK,CAAE,IAAI,CACX,OAAO,CAAE,CAAC,CACV,MAAM,CAAE,IAAI,CACZ,aAAa,CAAE,IAAI,CACnB,UAAU,CAAE,IAAI,SAAS,CAAC,QAAQ,CAAC,CACnC,QAAQ,CAAE,QAAQ,CAClB,SAAS,CAAE,OAAO,KAAK,CAAC,CACxB,SAAS,CAAE,8BAAe,CAAC,IAAI,CAAC,aAAa,KAAK,CAAC,CAAC,KAAK,CAAC,CAAC,IAAI,CAAC,CAAC,KAAK,CAAC,CAAC,QAAQ,CAChF,eAAe,CAAE,KAClB,CAEA,kBAAG,OAAQ,CACV,OAAO,CAAE,EAAE,CACX,UAAU,CAAE,UAAU,CACtB,SAAS,CAAE,iCAAkB,CAAC,IAAI,CAAC,QAAQ,CAAC,QAAQ,CACpD,OAAO,CAAE,CAAC,CACV,eAAe,CAAE,KAAK,CACtB,QAAQ,CAAE,QAAQ,CAClB,YAAY,CAAE,GAAG,CAAC,KAAK,CACvB,aAAa,CAAE,GAAG,CAAC,KAAK,CACxB,YAAY,CAAE,IAAI,WAAW,CAAC,KAAK,CAAC,CACpC,MAAM,CAAE,GAAG,CACX,IAAI,CAAE,GAAG,CACT,MAAM,CAAE,IAAI,CACZ,KAAK,CAAE,GACR,CAEA,WAAW,8BAAgB,CAC1B,IAAK,CACJ,SAAS,CAAE,MAAM,CAAC,CAAC,CAAC,OAAO,KAAK,CAAC,CACjC,OAAO,CAAE,CACV,CACA,EAAG,CACF,SAAS,CAAE,MAAM,CAAC,CAAC,CAAC,OAAO,KAAK,CAAC,CACjC,OAAO,CAAE,CACV,CACD,CAEA,WAAW,iCAAmB,CAC7B,EAAG,CACF,MAAM,CAAE,CAAC,CACT,KAAK,CAAE,CAAC,CACR,OAAO,CAAE,CACV,CACA,GAAI,CACH,MAAM,CAAE,CAAC,CACT,KAAK,CAAE,GAAG,CACV,OAAO,CAAE,CACV,CACA,IAAK,CACJ,OAAO,CAAE,CAAC,CACV,MAAM,CAAE,IACT,CACD"}`
};
const CheckmarkIcon = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let { primary = "#61d345" } = $$props;
  let { secondary = "#fff" } = $$props;
  if ($$props.primary === void 0 && $$bindings.primary && primary !== void 0) $$bindings.primary(primary);
  if ($$props.secondary === void 0 && $$bindings.secondary && secondary !== void 0) $$bindings.secondary(secondary);
  $$result.css.add(css$8);
  return `  <div class="svelte-11kvm4p"${add_styles({
    "--primary": primary,
    "--secondary": secondary
  })}></div>`;
});
const css$7 = {
  code: "div.svelte-1ee93ns{width:20px;opacity:0;height:20px;border-radius:10px;background:var(--primary, #ff4b4b);position:relative;transform:rotate(45deg);animation:svelte-1ee93ns-circleAnimation 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275) forwards;animation-delay:100ms}div.svelte-1ee93ns::after,div.svelte-1ee93ns::before{content:'';animation:svelte-1ee93ns-firstLineAnimation 0.15s ease-out forwards;animation-delay:150ms;position:absolute;border-radius:3px;opacity:0;background:var(--secondary, #fff);bottom:9px;left:4px;height:2px;width:12px}div.svelte-1ee93ns:before{animation:svelte-1ee93ns-secondLineAnimation 0.15s ease-out forwards;animation-delay:180ms;transform:rotate(90deg)}@keyframes svelte-1ee93ns-circleAnimation{from{transform:scale(0) rotate(45deg);opacity:0}to{transform:scale(1) rotate(45deg);opacity:1}}@keyframes svelte-1ee93ns-firstLineAnimation{from{transform:scale(0);opacity:0}to{transform:scale(1);opacity:1}}@keyframes svelte-1ee93ns-secondLineAnimation{from{transform:scale(0) rotate(90deg);opacity:0}to{transform:scale(1) rotate(90deg);opacity:1}}",
  map: `{"version":3,"file":"ErrorIcon.svelte","sources":["ErrorIcon.svelte"],"sourcesContent":["<!-- Adapted from https://github.com/timolins/react-hot-toast -->\\n<script>export let primary = \\"#ff4b4b\\";\\nexport let secondary = \\"#fff\\";\\n<\/script>\\n\\n<div style:--primary={primary} style:--secondary={secondary} />\\n\\n<style>\\n\\tdiv {\\n\\t\\twidth: 20px;\\n\\t\\topacity: 0;\\n\\t\\theight: 20px;\\n\\t\\tborder-radius: 10px;\\n\\t\\tbackground: var(--primary, #ff4b4b);\\n\\t\\tposition: relative;\\n\\t\\ttransform: rotate(45deg);\\n\\t\\tanimation: circleAnimation 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275) forwards;\\n\\t\\tanimation-delay: 100ms;\\n\\t}\\n\\n\\tdiv::after,\\n\\tdiv::before {\\n\\t\\tcontent: '';\\n\\t\\tanimation: firstLineAnimation 0.15s ease-out forwards;\\n\\t\\tanimation-delay: 150ms;\\n\\t\\tposition: absolute;\\n\\t\\tborder-radius: 3px;\\n\\t\\topacity: 0;\\n\\t\\tbackground: var(--secondary, #fff);\\n\\t\\tbottom: 9px;\\n\\t\\tleft: 4px;\\n\\t\\theight: 2px;\\n\\t\\twidth: 12px;\\n\\t}\\n\\n\\tdiv:before {\\n\\t\\tanimation: secondLineAnimation 0.15s ease-out forwards;\\n\\t\\tanimation-delay: 180ms;\\n\\t\\ttransform: rotate(90deg);\\n\\t}\\n\\n\\t@keyframes circleAnimation {\\n\\t\\tfrom {\\n\\t\\t\\ttransform: scale(0) rotate(45deg);\\n\\t\\t\\topacity: 0;\\n\\t\\t}\\n\\t\\tto {\\n\\t\\t\\ttransform: scale(1) rotate(45deg);\\n\\t\\t\\topacity: 1;\\n\\t\\t}\\n\\t}\\n\\n\\t@keyframes firstLineAnimation {\\n\\t\\tfrom {\\n\\t\\t\\ttransform: scale(0);\\n\\t\\t\\topacity: 0;\\n\\t\\t}\\n\\t\\tto {\\n\\t\\t\\ttransform: scale(1);\\n\\t\\t\\topacity: 1;\\n\\t\\t}\\n\\t}\\n\\n\\t@keyframes secondLineAnimation {\\n\\t\\tfrom {\\n\\t\\t\\ttransform: scale(0) rotate(90deg);\\n\\t\\t\\topacity: 0;\\n\\t\\t}\\n\\t\\tto {\\n\\t\\t\\ttransform: scale(1) rotate(90deg);\\n\\t\\t\\topacity: 1;\\n\\t\\t}\\n\\t}\\n</style>\\n"],"names":[],"mappings":"AAQC,kBAAI,CACH,KAAK,CAAE,IAAI,CACX,OAAO,CAAE,CAAC,CACV,MAAM,CAAE,IAAI,CACZ,aAAa,CAAE,IAAI,CACnB,UAAU,CAAE,IAAI,SAAS,CAAC,QAAQ,CAAC,CACnC,QAAQ,CAAE,QAAQ,CAClB,SAAS,CAAE,OAAO,KAAK,CAAC,CACxB,SAAS,CAAE,8BAAe,CAAC,IAAI,CAAC,aAAa,KAAK,CAAC,CAAC,KAAK,CAAC,CAAC,IAAI,CAAC,CAAC,KAAK,CAAC,CAAC,QAAQ,CAChF,eAAe,CAAE,KAClB,CAEA,kBAAG,OAAO,CACV,kBAAG,QAAS,CACX,OAAO,CAAE,EAAE,CACX,SAAS,CAAE,iCAAkB,CAAC,KAAK,CAAC,QAAQ,CAAC,QAAQ,CACrD,eAAe,CAAE,KAAK,CACtB,QAAQ,CAAE,QAAQ,CAClB,aAAa,CAAE,GAAG,CAClB,OAAO,CAAE,CAAC,CACV,UAAU,CAAE,IAAI,WAAW,CAAC,KAAK,CAAC,CAClC,MAAM,CAAE,GAAG,CACX,IAAI,CAAE,GAAG,CACT,MAAM,CAAE,GAAG,CACX,KAAK,CAAE,IACR,CAEA,kBAAG,OAAQ,CACV,SAAS,CAAE,kCAAmB,CAAC,KAAK,CAAC,QAAQ,CAAC,QAAQ,CACtD,eAAe,CAAE,KAAK,CACtB,SAAS,CAAE,OAAO,KAAK,CACxB,CAEA,WAAW,8BAAgB,CAC1B,IAAK,CACJ,SAAS,CAAE,MAAM,CAAC,CAAC,CAAC,OAAO,KAAK,CAAC,CACjC,OAAO,CAAE,CACV,CACA,EAAG,CACF,SAAS,CAAE,MAAM,CAAC,CAAC,CAAC,OAAO,KAAK,CAAC,CACjC,OAAO,CAAE,CACV,CACD,CAEA,WAAW,iCAAmB,CAC7B,IAAK,CACJ,SAAS,CAAE,MAAM,CAAC,CAAC,CACnB,OAAO,CAAE,CACV,CACA,EAAG,CACF,SAAS,CAAE,MAAM,CAAC,CAAC,CACnB,OAAO,CAAE,CACV,CACD,CAEA,WAAW,kCAAoB,CAC9B,IAAK,CACJ,SAAS,CAAE,MAAM,CAAC,CAAC,CAAC,OAAO,KAAK,CAAC,CACjC,OAAO,CAAE,CACV,CACA,EAAG,CACF,SAAS,CAAE,MAAM,CAAC,CAAC,CAAC,OAAO,KAAK,CAAC,CACjC,OAAO,CAAE,CACV,CACD"}`
};
const ErrorIcon = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let { primary = "#ff4b4b" } = $$props;
  let { secondary = "#fff" } = $$props;
  if ($$props.primary === void 0 && $$bindings.primary && primary !== void 0) $$bindings.primary(primary);
  if ($$props.secondary === void 0 && $$bindings.secondary && secondary !== void 0) $$bindings.secondary(secondary);
  $$result.css.add(css$7);
  return `  <div class="svelte-1ee93ns"${add_styles({
    "--primary": primary,
    "--secondary": secondary
  })}></div>`;
});
const css$6 = {
  code: "div.svelte-1j7dflg{width:12px;height:12px;box-sizing:border-box;border:2px solid;border-radius:100%;border-color:var(--secondary, #e0e0e0);border-right-color:var(--primary, #616161);animation:svelte-1j7dflg-rotate 1s linear infinite}@keyframes svelte-1j7dflg-rotate{from{transform:rotate(0deg)}to{transform:rotate(360deg)}}",
  map: '{"version":3,"file":"LoaderIcon.svelte","sources":["LoaderIcon.svelte"],"sourcesContent":["<!-- Adapted from https://github.com/timolins/react-hot-toast -->\\n<script>export let primary = \\"#616161\\";\\nexport let secondary = \\"#e0e0e0\\";\\n<\/script>\\n\\n<div style:--primary={primary} style:--secondary={secondary} />\\n\\n<style>\\n\\tdiv {\\n\\t\\twidth: 12px;\\n\\t\\theight: 12px;\\n\\t\\tbox-sizing: border-box;\\n\\t\\tborder: 2px solid;\\n\\t\\tborder-radius: 100%;\\n\\t\\tborder-color: var(--secondary, #e0e0e0);\\n\\t\\tborder-right-color: var(--primary, #616161);\\n\\t\\tanimation: rotate 1s linear infinite;\\n\\t}\\n\\n\\t@keyframes rotate {\\n\\t\\tfrom {\\n\\t\\t\\ttransform: rotate(0deg);\\n\\t\\t}\\n\\t\\tto {\\n\\t\\t\\ttransform: rotate(360deg);\\n\\t\\t}\\n\\t}\\n</style>\\n"],"names":[],"mappings":"AAQC,kBAAI,CACH,KAAK,CAAE,IAAI,CACX,MAAM,CAAE,IAAI,CACZ,UAAU,CAAE,UAAU,CACtB,MAAM,CAAE,GAAG,CAAC,KAAK,CACjB,aAAa,CAAE,IAAI,CACnB,YAAY,CAAE,IAAI,WAAW,CAAC,QAAQ,CAAC,CACvC,kBAAkB,CAAE,IAAI,SAAS,CAAC,QAAQ,CAAC,CAC3C,SAAS,CAAE,qBAAM,CAAC,EAAE,CAAC,MAAM,CAAC,QAC7B,CAEA,WAAW,qBAAO,CACjB,IAAK,CACJ,SAAS,CAAE,OAAO,IAAI,CACvB,CACA,EAAG,CACF,SAAS,CAAE,OAAO,MAAM,CACzB,CACD"}'
};
const LoaderIcon = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let { primary = "#616161" } = $$props;
  let { secondary = "#e0e0e0" } = $$props;
  if ($$props.primary === void 0 && $$bindings.primary && primary !== void 0) $$bindings.primary(primary);
  if ($$props.secondary === void 0 && $$bindings.secondary && secondary !== void 0) $$bindings.secondary(secondary);
  $$result.css.add(css$6);
  return `  <div class="svelte-1j7dflg"${add_styles({
    "--primary": primary,
    "--secondary": secondary
  })}></div>`;
});
const css$5 = {
  code: ".indicator.svelte-1kgeier{position:relative;display:flex;justify-content:center;align-items:center;min-width:20px;min-height:20px}.status.svelte-1kgeier{position:absolute}.animated.svelte-1kgeier{position:relative;transform:scale(0.6);opacity:0.4;min-width:20px;animation:svelte-1kgeier-enter 0.3s 0.12s cubic-bezier(0.175, 0.885, 0.32, 1.275) forwards}@keyframes svelte-1kgeier-enter{from{transform:scale(0.6);opacity:0.4}to{transform:scale(1);opacity:1}}",
  map: `{"version":3,"file":"ToastIcon.svelte","sources":["ToastIcon.svelte"],"sourcesContent":["<script>import CheckmarkIcon from \\"./CheckmarkIcon.svelte\\";\\nimport ErrorIcon from \\"./ErrorIcon.svelte\\";\\nimport LoaderIcon from \\"./LoaderIcon.svelte\\";\\nexport let toast;\\n$:\\n  ({ type, icon, iconTheme } = toast);\\n<\/script>\\n\\n{#if typeof icon === 'string'}\\n\\t<div class=\\"animated\\">{icon}</div>\\n{:else if typeof icon !== 'undefined'}\\n\\t<svelte:component this={icon} />\\n{:else if type !== 'blank'}\\n\\t<div class=\\"indicator\\">\\n\\t\\t<LoaderIcon {...iconTheme} />\\n\\t\\t{#if type !== 'loading'}\\n\\t\\t\\t<div class=\\"status\\">\\n\\t\\t\\t\\t{#if type === 'error'}\\n\\t\\t\\t\\t\\t<ErrorIcon {...iconTheme} />\\n\\t\\t\\t\\t{:else}\\n\\t\\t\\t\\t\\t<CheckmarkIcon {...iconTheme} />\\n\\t\\t\\t\\t{/if}\\n\\t\\t\\t</div>\\n\\t\\t{/if}\\n\\t</div>\\n{/if}\\n\\n<style>\\n\\t.indicator {\\n\\t\\tposition: relative;\\n\\t\\tdisplay: flex;\\n\\t\\tjustify-content: center;\\n\\t\\talign-items: center;\\n\\t\\tmin-width: 20px;\\n\\t\\tmin-height: 20px;\\n\\t}\\n\\n\\t.status {\\n\\t\\tposition: absolute;\\n\\t}\\n\\n\\t.animated {\\n\\t\\tposition: relative;\\n\\t\\ttransform: scale(0.6);\\n\\t\\topacity: 0.4;\\n\\t\\tmin-width: 20px;\\n\\t\\tanimation: enter 0.3s 0.12s cubic-bezier(0.175, 0.885, 0.32, 1.275) forwards;\\n\\t}\\n\\n\\t@keyframes enter {\\n\\t\\tfrom {\\n\\t\\t\\ttransform: scale(0.6);\\n\\t\\t\\topacity: 0.4;\\n\\t\\t}\\n\\t\\tto {\\n\\t\\t\\ttransform: scale(1);\\n\\t\\t\\topacity: 1;\\n\\t\\t}\\n\\t}\\n</style>\\n"],"names":[],"mappings":"AA4BC,yBAAW,CACV,QAAQ,CAAE,QAAQ,CAClB,OAAO,CAAE,IAAI,CACb,eAAe,CAAE,MAAM,CACvB,WAAW,CAAE,MAAM,CACnB,SAAS,CAAE,IAAI,CACf,UAAU,CAAE,IACb,CAEA,sBAAQ,CACP,QAAQ,CAAE,QACX,CAEA,wBAAU,CACT,QAAQ,CAAE,QAAQ,CAClB,SAAS,CAAE,MAAM,GAAG,CAAC,CACrB,OAAO,CAAE,GAAG,CACZ,SAAS,CAAE,IAAI,CACf,SAAS,CAAE,oBAAK,CAAC,IAAI,CAAC,KAAK,CAAC,aAAa,KAAK,CAAC,CAAC,KAAK,CAAC,CAAC,IAAI,CAAC,CAAC,KAAK,CAAC,CAAC,QACrE,CAEA,WAAW,oBAAM,CAChB,IAAK,CACJ,SAAS,CAAE,MAAM,GAAG,CAAC,CACrB,OAAO,CAAE,GACV,CACA,EAAG,CACF,SAAS,CAAE,MAAM,CAAC,CAAC,CACnB,OAAO,CAAE,CACV,CACD"}`
};
const ToastIcon = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let type;
  let icon;
  let iconTheme;
  let { toast: toast2 } = $$props;
  if ($$props.toast === void 0 && $$bindings.toast && toast2 !== void 0) $$bindings.toast(toast2);
  $$result.css.add(css$5);
  ({ type, icon, iconTheme } = toast2);
  return `${typeof icon === "string" ? `<div class="animated svelte-1kgeier">${escape(icon)}</div>` : `${typeof icon !== "undefined" ? `${validate_component(icon || missing_component, "svelte:component").$$render($$result, {}, {}, {})}` : `${type !== "blank" ? `<div class="indicator svelte-1kgeier">${validate_component(LoaderIcon, "LoaderIcon").$$render($$result, Object.assign({}, iconTheme), {}, {})} ${type !== "loading" ? `<div class="status svelte-1kgeier">${type === "error" ? `${validate_component(ErrorIcon, "ErrorIcon").$$render($$result, Object.assign({}, iconTheme), {}, {})}` : `${validate_component(CheckmarkIcon, "CheckmarkIcon").$$render($$result, Object.assign({}, iconTheme), {}, {})}`}</div>` : ``}</div>` : ``}`}`}`;
});
const css$4 = {
  code: ".message.svelte-1nauejd{display:flex;justify-content:center;margin:4px 10px;color:inherit;flex:1 1 auto;white-space:pre-line}",
  map: `{"version":3,"file":"ToastMessage.svelte","sources":["ToastMessage.svelte"],"sourcesContent":["<script>export let toast;\\n<\/script>\\n\\n<div class=\\"message\\" {...toast.ariaProps}>\\n\\t{#if typeof toast.message === 'string'}\\n\\t\\t{toast.message}\\n\\t{:else}\\n\\t\\t<svelte:component this={toast.message} {toast} />\\n\\t{/if}\\n</div>\\n\\n<style>\\n\\t.message {\\n\\t\\tdisplay: flex;\\n\\t\\tjustify-content: center;\\n\\t\\tmargin: 4px 10px;\\n\\t\\tcolor: inherit;\\n\\t\\tflex: 1 1 auto;\\n\\t\\twhite-space: pre-line;\\n\\t}\\n</style>\\n"],"names":[],"mappings":"AAYC,uBAAS,CACR,OAAO,CAAE,IAAI,CACb,eAAe,CAAE,MAAM,CACvB,MAAM,CAAE,GAAG,CAAC,IAAI,CAChB,KAAK,CAAE,OAAO,CACd,IAAI,CAAE,CAAC,CAAC,CAAC,CAAC,IAAI,CACd,WAAW,CAAE,QACd"}`
};
const ToastMessage = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let { toast: toast2 } = $$props;
  if ($$props.toast === void 0 && $$bindings.toast && toast2 !== void 0) $$bindings.toast(toast2);
  $$result.css.add(css$4);
  return `<div${spread([{ class: "message" }, escape_object(toast2.ariaProps)], { classes: "svelte-1nauejd" })}>${typeof toast2.message === "string" ? `${escape(toast2.message)}` : `${validate_component(toast2.message || missing_component, "svelte:component").$$render($$result, { toast: toast2 }, {}, {})}`} </div>`;
});
const css$3 = {
  code: "@keyframes svelte-ug60r4-enterAnimation{0%{transform:translate3d(0, calc(var(--factor) * -200%), 0) scale(0.6);opacity:0.5}100%{transform:translate3d(0, 0, 0) scale(1);opacity:1}}@keyframes svelte-ug60r4-exitAnimation{0%{transform:translate3d(0, 0, -1px) scale(1);opacity:1}100%{transform:translate3d(0, calc(var(--factor) * -150%), -1px) scale(0.6);opacity:0}}@keyframes svelte-ug60r4-fadeInAnimation{0%{opacity:0}100%{opacity:1}}@keyframes svelte-ug60r4-fadeOutAnimation{0%{opacity:1}100%{opacity:0}}.base.svelte-ug60r4{display:flex;align-items:center;background:#fff;color:#363636;line-height:1.3;will-change:transform;box-shadow:0 3px 10px rgba(0, 0, 0, 0.1), 0 3px 3px rgba(0, 0, 0, 0.05);max-width:350px;pointer-events:auto;padding:8px 10px;border-radius:8px}.transparent.svelte-ug60r4{opacity:0}.enter.svelte-ug60r4{animation:svelte-ug60r4-enterAnimation 0.35s cubic-bezier(0.21, 1.02, 0.73, 1) forwards}.exit.svelte-ug60r4{animation:svelte-ug60r4-exitAnimation 0.4s cubic-bezier(0.06, 0.71, 0.55, 1) forwards}.fadeIn.svelte-ug60r4{animation:svelte-ug60r4-fadeInAnimation 0.35s cubic-bezier(0.21, 1.02, 0.73, 1) forwards}.fadeOut.svelte-ug60r4{animation:svelte-ug60r4-fadeOutAnimation 0.4s cubic-bezier(0.06, 0.71, 0.55, 1) forwards}",
  map: `{"version":3,"file":"ToastBar.svelte","sources":["ToastBar.svelte"],"sourcesContent":["<script>import ToastIcon from \\"./ToastIcon.svelte\\";\\nimport { prefersReducedMotion } from \\"../core/utils\\";\\nimport ToastMessage from \\"./ToastMessage.svelte\\";\\nexport let toast;\\nexport let position = void 0;\\nexport let style = \\"\\";\\nexport let Component = void 0;\\nlet factor;\\nlet animation;\\n$: {\\n  const top = (toast.position || position || \\"top-center\\").includes(\\"top\\");\\n  factor = top ? 1 : -1;\\n  const [enter, exit] = prefersReducedMotion() ? [\\"fadeIn\\", \\"fadeOut\\"] : [\\"enter\\", \\"exit\\"];\\n  animation = toast.visible ? enter : exit;\\n}\\n<\/script>\\n\\n<div\\n\\tclass=\\"base {toast.height ? animation : 'transparent'} {toast.className || ''}\\"\\n\\tstyle=\\"{style}; {toast.style}\\"\\n\\tstyle:--factor={factor}\\n>\\n\\t{#if Component}\\n\\t\\t<svelte:component this={Component}>\\n\\t\\t\\t<ToastIcon {toast} slot=\\"icon\\" />\\n\\t\\t\\t<ToastMessage {toast} slot=\\"message\\" />\\n\\t\\t</svelte:component>\\n\\t{:else}\\n\\t\\t<slot {ToastIcon} {ToastMessage} {toast}>\\n\\t\\t\\t<ToastIcon {toast} />\\n\\t\\t\\t<ToastMessage {toast} />\\n\\t\\t</slot>\\n\\t{/if}\\n</div>\\n\\n<style>\\n\\t@keyframes enterAnimation {\\n\\t\\t0% {\\n\\t\\t\\ttransform: translate3d(0, calc(var(--factor) * -200%), 0) scale(0.6);\\n\\t\\t\\topacity: 0.5;\\n\\t\\t}\\n\\t\\t100% {\\n\\t\\t\\ttransform: translate3d(0, 0, 0) scale(1);\\n\\t\\t\\topacity: 1;\\n\\t\\t}\\n\\t}\\n\\n\\t@keyframes exitAnimation {\\n\\t\\t0% {\\n\\t\\t\\ttransform: translate3d(0, 0, -1px) scale(1);\\n\\t\\t\\topacity: 1;\\n\\t\\t}\\n\\t\\t100% {\\n\\t\\t\\ttransform: translate3d(0, calc(var(--factor) * -150%), -1px) scale(0.6);\\n\\t\\t\\topacity: 0;\\n\\t\\t}\\n\\t}\\n\\n\\t@keyframes fadeInAnimation {\\n\\t\\t0% {\\n\\t\\t\\topacity: 0;\\n\\t\\t}\\n\\t\\t100% {\\n\\t\\t\\topacity: 1;\\n\\t\\t}\\n\\t}\\n\\n\\t@keyframes fadeOutAnimation {\\n\\t\\t0% {\\n\\t\\t\\topacity: 1;\\n\\t\\t}\\n\\t\\t100% {\\n\\t\\t\\topacity: 0;\\n\\t\\t}\\n\\t}\\n\\n\\t.base {\\n\\t\\tdisplay: flex;\\n\\t\\talign-items: center;\\n\\t\\tbackground: #fff;\\n\\t\\tcolor: #363636;\\n\\t\\tline-height: 1.3;\\n\\t\\twill-change: transform;\\n\\t\\tbox-shadow: 0 3px 10px rgba(0, 0, 0, 0.1), 0 3px 3px rgba(0, 0, 0, 0.05);\\n\\t\\tmax-width: 350px;\\n\\t\\tpointer-events: auto;\\n\\t\\tpadding: 8px 10px;\\n\\t\\tborder-radius: 8px;\\n\\t}\\n\\n\\t.transparent {\\n\\t\\topacity: 0;\\n\\t}\\n\\n\\t.enter {\\n\\t\\tanimation: enterAnimation 0.35s cubic-bezier(0.21, 1.02, 0.73, 1) forwards;\\n\\t}\\n\\n\\t.exit {\\n\\t\\tanimation: exitAnimation 0.4s cubic-bezier(0.06, 0.71, 0.55, 1) forwards;\\n\\t}\\n\\n\\t.fadeIn {\\n\\t\\tanimation: fadeInAnimation 0.35s cubic-bezier(0.21, 1.02, 0.73, 1) forwards;\\n\\t}\\n\\n\\t.fadeOut {\\n\\t\\tanimation: fadeOutAnimation 0.4s cubic-bezier(0.06, 0.71, 0.55, 1) forwards;\\n\\t}\\n</style>\\n"],"names":[],"mappings":"AAoCC,WAAW,4BAAe,CACzB,EAAG,CACF,SAAS,CAAE,YAAY,CAAC,CAAC,CAAC,KAAK,IAAI,QAAQ,CAAC,CAAC,CAAC,CAAC,KAAK,CAAC,CAAC,CAAC,CAAC,CAAC,CAAC,MAAM,GAAG,CAAC,CACpE,OAAO,CAAE,GACV,CACA,IAAK,CACJ,SAAS,CAAE,YAAY,CAAC,CAAC,CAAC,CAAC,CAAC,CAAC,CAAC,CAAC,CAAC,MAAM,CAAC,CAAC,CACxC,OAAO,CAAE,CACV,CACD,CAEA,WAAW,2BAAc,CACxB,EAAG,CACF,SAAS,CAAE,YAAY,CAAC,CAAC,CAAC,CAAC,CAAC,CAAC,IAAI,CAAC,CAAC,MAAM,CAAC,CAAC,CAC3C,OAAO,CAAE,CACV,CACA,IAAK,CACJ,SAAS,CAAE,YAAY,CAAC,CAAC,CAAC,KAAK,IAAI,QAAQ,CAAC,CAAC,CAAC,CAAC,KAAK,CAAC,CAAC,CAAC,IAAI,CAAC,CAAC,MAAM,GAAG,CAAC,CACvE,OAAO,CAAE,CACV,CACD,CAEA,WAAW,6BAAgB,CAC1B,EAAG,CACF,OAAO,CAAE,CACV,CACA,IAAK,CACJ,OAAO,CAAE,CACV,CACD,CAEA,WAAW,8BAAiB,CAC3B,EAAG,CACF,OAAO,CAAE,CACV,CACA,IAAK,CACJ,OAAO,CAAE,CACV,CACD,CAEA,mBAAM,CACL,OAAO,CAAE,IAAI,CACb,WAAW,CAAE,MAAM,CACnB,UAAU,CAAE,IAAI,CAChB,KAAK,CAAE,OAAO,CACd,WAAW,CAAE,GAAG,CAChB,WAAW,CAAE,SAAS,CACtB,UAAU,CAAE,CAAC,CAAC,GAAG,CAAC,IAAI,CAAC,KAAK,CAAC,CAAC,CAAC,CAAC,CAAC,CAAC,CAAC,CAAC,CAAC,GAAG,CAAC,CAAC,CAAC,CAAC,CAAC,GAAG,CAAC,GAAG,CAAC,KAAK,CAAC,CAAC,CAAC,CAAC,CAAC,CAAC,CAAC,CAAC,CAAC,IAAI,CAAC,CACxE,SAAS,CAAE,KAAK,CAChB,cAAc,CAAE,IAAI,CACpB,OAAO,CAAE,GAAG,CAAC,IAAI,CACjB,aAAa,CAAE,GAChB,CAEA,0BAAa,CACZ,OAAO,CAAE,CACV,CAEA,oBAAO,CACN,SAAS,CAAE,4BAAc,CAAC,KAAK,CAAC,aAAa,IAAI,CAAC,CAAC,IAAI,CAAC,CAAC,IAAI,CAAC,CAAC,CAAC,CAAC,CAAC,QACnE,CAEA,mBAAM,CACL,SAAS,CAAE,2BAAa,CAAC,IAAI,CAAC,aAAa,IAAI,CAAC,CAAC,IAAI,CAAC,CAAC,IAAI,CAAC,CAAC,CAAC,CAAC,CAAC,QACjE,CAEA,qBAAQ,CACP,SAAS,CAAE,6BAAe,CAAC,KAAK,CAAC,aAAa,IAAI,CAAC,CAAC,IAAI,CAAC,CAAC,IAAI,CAAC,CAAC,CAAC,CAAC,CAAC,QACpE,CAEA,sBAAS,CACR,SAAS,CAAE,8BAAgB,CAAC,IAAI,CAAC,aAAa,IAAI,CAAC,CAAC,IAAI,CAAC,CAAC,IAAI,CAAC,CAAC,CAAC,CAAC,CAAC,QACpE"}`
};
const ToastBar = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let { toast: toast2 } = $$props;
  let { position = void 0 } = $$props;
  let { style = "" } = $$props;
  let { Component = void 0 } = $$props;
  let factor;
  let animation;
  if ($$props.toast === void 0 && $$bindings.toast && toast2 !== void 0) $$bindings.toast(toast2);
  if ($$props.position === void 0 && $$bindings.position && position !== void 0) $$bindings.position(position);
  if ($$props.style === void 0 && $$bindings.style && style !== void 0) $$bindings.style(style);
  if ($$props.Component === void 0 && $$bindings.Component && Component !== void 0) $$bindings.Component(Component);
  $$result.css.add(css$3);
  {
    {
      const top = (toast2.position || position || "top-center").includes("top");
      factor = top ? 1 : -1;
      const [enter, exit] = prefersReducedMotion() ? ["fadeIn", "fadeOut"] : ["enter", "exit"];
      animation = toast2.visible ? enter : exit;
    }
  }
  return `<div class="${"base " + escape(toast2.height ? animation : "transparent", true) + " " + escape(toast2.className || "", true) + " svelte-ug60r4"}"${add_styles(merge_ssr_styles(escape(style, true) + "; " + escape(toast2.style, true), { "--factor": factor }))}>${Component ? `${validate_component(Component || missing_component, "svelte:component").$$render($$result, {}, {}, {
    message: () => {
      return `${validate_component(ToastMessage, "ToastMessage").$$render($$result, { toast: toast2, slot: "message" }, {}, {})}`;
    },
    icon: () => {
      return `${validate_component(ToastIcon, "ToastIcon").$$render($$result, { toast: toast2, slot: "icon" }, {}, {})}`;
    }
  })}` : `${slots.default ? slots.default({ ToastIcon, ToastMessage, toast: toast2 }) : ` ${validate_component(ToastIcon, "ToastIcon").$$render($$result, { toast: toast2 }, {}, {})} ${validate_component(ToastMessage, "ToastMessage").$$render($$result, { toast: toast2 }, {}, {})} `}`} </div>`;
});
const css$2 = {
  code: ".wrapper.svelte-v01oml{left:0;right:0;display:flex;position:absolute;transform:translateY(calc(var(--offset, 16px) * var(--factor) * 1px))}.transition.svelte-v01oml{transition:all 230ms cubic-bezier(0.21, 1.02, 0.73, 1)}.active.svelte-v01oml{z-index:9999}.active.svelte-v01oml>*{pointer-events:auto}",
  map: `{"version":3,"file":"ToastWrapper.svelte","sources":["ToastWrapper.svelte"],"sourcesContent":["<script>import { onMount } from \\"svelte\\";\\nimport { prefersReducedMotion } from \\"../core/utils\\";\\nimport ToastBar from \\"./ToastBar.svelte\\";\\nimport ToastMessage from \\"./ToastMessage.svelte\\";\\nexport let toast;\\nexport let setHeight;\\nlet wrapperEl;\\nonMount(() => {\\n  setHeight(wrapperEl.getBoundingClientRect().height);\\n});\\n$:\\n  top = toast.position?.includes(\\"top\\") ? 0 : null;\\n$:\\n  bottom = toast.position?.includes(\\"bottom\\") ? 0 : null;\\n$:\\n  factor = toast.position?.includes(\\"top\\") ? 1 : -1;\\n$:\\n  justifyContent = toast.position?.includes(\\"center\\") && \\"center\\" || (toast.position?.includes(\\"right\\") || toast.position?.includes(\\"end\\")) && \\"flex-end\\" || null;\\n<\/script>\\n\\n<div\\n\\tbind:this={wrapperEl}\\n\\tclass=\\"wrapper\\"\\n\\tclass:active={toast.visible}\\n\\tclass:transition={!prefersReducedMotion()}\\n\\tstyle:--factor={factor}\\n\\tstyle:--offset={toast.offset}\\n\\tstyle:top\\n\\tstyle:bottom\\n\\tstyle:justify-content={justifyContent}\\n>\\n\\t{#if toast.type === 'custom'}\\n\\t\\t<ToastMessage {toast} />\\n\\t{:else}\\n\\t\\t<slot {toast}>\\n\\t\\t\\t<ToastBar {toast} position={toast.position} />\\n\\t\\t</slot>\\n\\t{/if}\\n</div>\\n\\n<style>\\n\\t.wrapper {\\n\\t\\tleft: 0;\\n\\t\\tright: 0;\\n\\t\\tdisplay: flex;\\n\\t\\tposition: absolute;\\n\\t\\ttransform: translateY(calc(var(--offset, 16px) * var(--factor) * 1px));\\n\\t}\\n\\n\\t.transition {\\n\\t\\ttransition: all 230ms cubic-bezier(0.21, 1.02, 0.73, 1);\\n\\t}\\n\\n\\t.active {\\n\\t\\tz-index: 9999;\\n\\t}\\n\\n\\t.active > :global(*) {\\n\\t\\tpointer-events: auto;\\n\\t}\\n</style>\\n"],"names":[],"mappings":"AAyCC,sBAAS,CACR,IAAI,CAAE,CAAC,CACP,KAAK,CAAE,CAAC,CACR,OAAO,CAAE,IAAI,CACb,QAAQ,CAAE,QAAQ,CAClB,SAAS,CAAE,WAAW,KAAK,IAAI,QAAQ,CAAC,KAAK,CAAC,CAAC,CAAC,CAAC,IAAI,QAAQ,CAAC,CAAC,CAAC,CAAC,GAAG,CAAC,CACtE,CAEA,yBAAY,CACX,UAAU,CAAE,GAAG,CAAC,KAAK,CAAC,aAAa,IAAI,CAAC,CAAC,IAAI,CAAC,CAAC,IAAI,CAAC,CAAC,CAAC,CACvD,CAEA,qBAAQ,CACP,OAAO,CAAE,IACV,CAEA,qBAAO,CAAW,CAAG,CACpB,cAAc,CAAE,IACjB"}`
};
const ToastWrapper = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let top;
  let bottom;
  let factor;
  let justifyContent;
  let { toast: toast2 } = $$props;
  let { setHeight } = $$props;
  let wrapperEl;
  if ($$props.toast === void 0 && $$bindings.toast && toast2 !== void 0) $$bindings.toast(toast2);
  if ($$props.setHeight === void 0 && $$bindings.setHeight && setHeight !== void 0) $$bindings.setHeight(setHeight);
  $$result.css.add(css$2);
  top = toast2.position?.includes("top") ? 0 : null;
  bottom = toast2.position?.includes("bottom") ? 0 : null;
  factor = toast2.position?.includes("top") ? 1 : -1;
  justifyContent = toast2.position?.includes("center") && "center" || (toast2.position?.includes("right") || toast2.position?.includes("end")) && "flex-end" || null;
  return `<div class="${[
    "wrapper svelte-v01oml",
    (toast2.visible ? "active" : "") + " " + (!prefersReducedMotion() ? "transition" : "")
  ].join(" ").trim()}"${add_styles({
    "--factor": factor,
    "--offset": toast2.offset,
    top,
    bottom,
    "justify-content": justifyContent
  })}${add_attribute("this", wrapperEl, 0)}>${toast2.type === "custom" ? `${validate_component(ToastMessage, "ToastMessage").$$render($$result, { toast: toast2 }, {}, {})}` : `${slots.default ? slots.default({ toast: toast2 }) : ` ${validate_component(ToastBar, "ToastBar").$$render($$result, { toast: toast2, position: toast2.position }, {}, {})} `}`} </div>`;
});
const css$1 = {
  code: ".toaster.svelte-1phplh9{--default-offset:16px;position:fixed;z-index:9999;top:var(--default-offset);left:var(--default-offset);right:var(--default-offset);bottom:var(--default-offset);pointer-events:none}",
  map: `{"version":3,"file":"Toaster.svelte","sources":["Toaster.svelte"],"sourcesContent":["<script>import useToaster from \\"../core/use-toaster\\";\\nimport ToastWrapper from \\"./ToastWrapper.svelte\\";\\nexport let reverseOrder = false;\\nexport let position = \\"top-center\\";\\nexport let toastOptions = void 0;\\nexport let gutter = 8;\\nexport let containerStyle = void 0;\\nexport let containerClassName = void 0;\\nconst { toasts, handlers } = useToaster(toastOptions);\\nlet _toasts;\\n$:\\n  _toasts = $toasts.map((toast) => ({\\n    ...toast,\\n    position: toast.position || position,\\n    offset: handlers.calculateOffset(toast, $toasts, {\\n      reverseOrder,\\n      gutter,\\n      defaultPosition: position\\n    })\\n  }));\\n<\/script>\\n\\n<div\\n\\tclass=\\"toaster {containerClassName || ''}\\"\\n\\tstyle={containerStyle}\\n\\ton:mouseenter={handlers.startPause}\\n\\ton:mouseleave={handlers.endPause}\\n\\trole=\\"alert\\"\\n>\\n\\t{#each _toasts as toast (toast.id)}\\n\\t\\t<ToastWrapper {toast} setHeight={(height) => handlers.updateHeight(toast.id, height)} />\\n\\t{/each}\\n</div>\\n\\n<style>\\n\\t.toaster {\\n\\t\\t--default-offset: 16px;\\n\\n\\t\\tposition: fixed;\\n\\t\\tz-index: 9999;\\n\\t\\ttop: var(--default-offset);\\n\\t\\tleft: var(--default-offset);\\n\\t\\tright: var(--default-offset);\\n\\t\\tbottom: var(--default-offset);\\n\\t\\tpointer-events: none;\\n\\t}\\n</style>\\n"],"names":[],"mappings":"AAmCC,uBAAS,CACR,gBAAgB,CAAE,IAAI,CAEtB,QAAQ,CAAE,KAAK,CACf,OAAO,CAAE,IAAI,CACb,GAAG,CAAE,IAAI,gBAAgB,CAAC,CAC1B,IAAI,CAAE,IAAI,gBAAgB,CAAC,CAC3B,KAAK,CAAE,IAAI,gBAAgB,CAAC,CAC5B,MAAM,CAAE,IAAI,gBAAgB,CAAC,CAC7B,cAAc,CAAE,IACjB"}`
};
const Toaster = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let $toasts, $$unsubscribe_toasts;
  let { reverseOrder = false } = $$props;
  let { position = "top-center" } = $$props;
  let { toastOptions = void 0 } = $$props;
  let { gutter = 8 } = $$props;
  let { containerStyle = void 0 } = $$props;
  let { containerClassName = void 0 } = $$props;
  const { toasts, handlers: handlers2 } = useToaster(toastOptions);
  $$unsubscribe_toasts = subscribe(toasts, (value) => $toasts = value);
  let _toasts;
  if ($$props.reverseOrder === void 0 && $$bindings.reverseOrder && reverseOrder !== void 0) $$bindings.reverseOrder(reverseOrder);
  if ($$props.position === void 0 && $$bindings.position && position !== void 0) $$bindings.position(position);
  if ($$props.toastOptions === void 0 && $$bindings.toastOptions && toastOptions !== void 0) $$bindings.toastOptions(toastOptions);
  if ($$props.gutter === void 0 && $$bindings.gutter && gutter !== void 0) $$bindings.gutter(gutter);
  if ($$props.containerStyle === void 0 && $$bindings.containerStyle && containerStyle !== void 0) $$bindings.containerStyle(containerStyle);
  if ($$props.containerClassName === void 0 && $$bindings.containerClassName && containerClassName !== void 0) $$bindings.containerClassName(containerClassName);
  $$result.css.add(css$1);
  _toasts = $toasts.map((toast2) => ({
    ...toast2,
    position: toast2.position || position,
    offset: handlers2.calculateOffset(toast2, $toasts, {
      reverseOrder,
      gutter,
      defaultPosition: position
    })
  }));
  $$unsubscribe_toasts();
  return `<div class="${"toaster " + escape(containerClassName || "", true) + " svelte-1phplh9"}"${add_attribute("style", containerStyle, 0)} role="alert">${each(_toasts, (toast2) => {
    return `${validate_component(ToastWrapper, "ToastWrapper").$$render(
      $$result,
      {
        toast: toast2,
        setHeight: (height) => handlers2.updateHeight(toast2.id, height)
      },
      {},
      {}
    )}`;
  })} </div>`;
});
const initialCart = [
  {
    product: {
      id: 1,
      name: "Djinn XL Titanium",
      slug: "djinn-xl-titanium",
      description: "The Djinn XL is our flagship folding knife, featuring a premium titanium handle and a high-performance CPM-S35VN blade.",
      price: 249.99,
      salePrice: 199.99,
      image: "/images/products/djinn-xl.jpg",
      category: "knives"
    },
    quantity: 1,
    variation: {
      id: "djinn-xl-stonewash",
      name: "Stonewashed",
      price: 249.99,
      salePrice: 199.99,
      inStock: true,
      attributes: {
        finish: "Stonewashed",
        blade: "CPM-S35VN"
      },
      image: "/images/products/djinn-xl-stonewash.jpg"
    }
  }
];
const cart = writable(initialCart);
const css = {
  code: "svg.svelte-19i819d{color:currentColor}",
  map: `{"version":3,"file":"Header.svelte","sources":["Header.svelte"],"sourcesContent":["<!--\\n  @notice CRITICAL COMPONENT - DO NOT MODIFY WITHOUT EXPLICIT PERMISSION\\n  This component is locked and requires explicit consent for any changes.\\n  Header color and styling must remain as specified below.\\n-->\\n\\n<script lang=\\"ts\\">import { Menu, X, Search, User, ChevronDown } from \\"lucide-svelte\\";\\nimport { page } from \\"$app/stores\\";\\nimport { onMount } from \\"svelte\\";\\nimport { fly } from \\"svelte/transition\\";\\nimport CartPopup from \\"$lib/components/cart/CartPopup.svelte\\";\\nimport SearchPopup from \\"$lib/components/search/SearchPopup.svelte\\";\\nimport { user, isAuthenticated } from \\"$lib/stores/userStore\\";\\nlet isMenuOpen = false;\\nlet isScrolled = false;\\nlet isSearchOpen = false;\\nlet isContactDropdownOpen = false;\\nlet dropdownTimeout;\\nlet dropdownContainer;\\n$: currentPath = $page.url.pathname;\\nfunction toggleMenu() {\\n  isMenuOpen = !isMenuOpen;\\n}\\nfunction closeMenu() {\\n  isMenuOpen = false;\\n  isContactDropdownOpen = false;\\n}\\nfunction toggleSearch() {\\n  isSearchOpen = !isSearchOpen;\\n}\\nfunction handleKeyDown(event) {\\n  if (event.key === \\"Escape\\") {\\n    if (isSearchOpen) {\\n      isSearchOpen = false;\\n    }\\n    if (isMenuOpen) {\\n      closeMenu();\\n    }\\n  }\\n}\\nfunction handleMouseEnter() {\\n  clearTimeout(dropdownTimeout);\\n  dropdownTimeout = setTimeout(() => {\\n    isContactDropdownOpen = true;\\n  }, 100);\\n}\\nfunction handleMouseLeave() {\\n  clearTimeout(dropdownTimeout);\\n  dropdownTimeout = setTimeout(() => {\\n    isContactDropdownOpen = false;\\n  }, 150);\\n}\\nonMount(() => {\\n  const handleScroll = () => {\\n    isScrolled = window.scrollY > 10;\\n  };\\n  window.addEventListener(\\"scroll\\", handleScroll);\\n  return () => {\\n    window.removeEventListener(\\"scroll\\", handleScroll);\\n    clearTimeout(dropdownTimeout);\\n  };\\n});\\nconst navItems = [\\n  { label: \\"Shop\\", href: \\"/products\\" },\\n  {\\n    label: \\"Contact\\",\\n    children: [\\n      { label: \\"About Us\\", href: \\"/about\\" },\\n      { label: \\"Support\\", href: \\"/help\\" }\\n    ]\\n  }\\n];\\n<\/script>\\n\\n<svelte:window on:keydown={handleKeyDown} />\\n\\n<header class={\`sticky top-0 z-50 w-full transition-all duration-300 \${isScrolled ? 'bg-white shadow-md' : 'bg-cream'}\`}>\\n  <div class=\\"container-wide\\">\\n    <div class=\\"flex items-center justify-between h-14\\">\\n      <!-- Logo -->\\n      <a href=\\"/\\" class=\\"flex-shrink-0 flex items-center\\">\\n        <div class=\\"h-8 flex items-center\\">\\n          <svg class=\\"h-full w-auto svelte-19i819d\\" viewBox=\\"0 0 223.72 154.51\\" fill=\\"currentColor\\">\\n            <g>\\n              <path d=\\"M108.67,146.96c-4.3,3.09-8.1,5.71-11.49,7.55l-4.23-6.48c2.25-1.97,4.88-4.2,7.86-6.62,2.79,1.91,5.42,3.79,7.86,5.54Z\\"/>\\n              <path d=\\"M171.49,90.61c-.44,2.6-1.1,5.13-1.96,7.57-1.73,4.86-4.43,9.32-7.7,13.32l-7.78,9.5c-5.52,6.41-10.91,12.51-16.02,18.16l-10.82-3.47-1.63-.52c-.84.56-1.67,1.1-2.48,1.64-2.53-2.02-5.27-4.17-8.2-6.43,1.12-.85,2.26-1.7,3.42-2.58,7.76-5.84,16.51-12.18,25.83-18.71,4.75-3.32,9.4-6.53,13.9-9.55,4.67-3.17,9.17-6.15,13.44-8.92Z\\"/>\\n              <path d=\\"M130.77,148.03l-4.23,6.48c-4.22-2.28-9.03-5.78-14.67-9.84-2.51-1.79-5.18-3.71-8.03-5.69-1.81-1.25-3.71-2.53-5.69-3.83l-1.63.52-10.82,3.47c-5.11-5.64-10.5-11.75-16.02-18.16l-7.78-9.5c-3.27-4-5.97-8.45-7.7-13.32-.86-2.43-1.52-4.96-1.96-7.57,4.27,2.78,8.78,5.75,13.44,8.92,4.49,3.02,9.15,6.23,13.9,9.55,9.32,6.53,18.07,12.87,25.83,18.71,2.23,1.68,4.39,3.32,6.47,4.91,2.86,2.2,5.54,4.3,8.03,6.28,4.25,3.38,7.9,6.43,10.87,9.05Z\\"/>\\n              <path d=\\"M124.23,61.66c.07.2.15.39.24.57,7.3,11.77,18.94,20.25,32.58,23.52,5.78-18.18,17.11-34.41,32.34-46.03.13-.13.31-.24.46-.35v-.07l2.14-1.57c.37-.26.76-.54,1.16-.78,8.63-5.99,18.11-10.46,28.25-13.27h.02c-1.74-8.74-5.69-16.89-11.42-23.65C209.18,0,208.33,0,207.5,0c-4.51,0-9,.37-13.38,1.05l-8.15,1.7c-4.9,1.26-9.68,2.94-14.23,5.01-3.75,1.7-7.32,3.77-10.79,5.99l-3.53,2.24c-1.87,1.31-3.7,2.7-5.47,4.14-6.12,5.08-11.35,11.14-15.87,17.7l-.37.54c-4.88,7.13-8.89,14.84-11.42,23.08l-.07.2Z\\"/>\\n              <path d=\\"M188.19,66.45c0,10.64,2.94,20.77,8.52,29.62.89,1.42,1.83,2.79,2.86,4.12,2.22,2.9,4.73,5.6,7.45,8.02-.5-3.03-.74-6.15-.74-9.31,0-4.03.41-7.95,1.18-11.75,2.22-11.05,7.56-20.94,15.08-28.81.76-3.79,1.18-7.72,1.18-11.75,0-5.69-.81-11.18-2.33-16.39-10.13,2.81-19.61,7.28-28.25,13.27-3.25,7.15-4.95,15.02-4.95,22.97Z\\"/>\\n              <path d=\\"M99.49,61.66c-.07.2-.15.39-.24.57-7.3,11.77-18.94,20.25-32.58,23.52-5.78-18.18-17.11-34.41-32.34-46.03-.13-.13-.31-.24-.46-.35v-.07l-2.14-1.57c-.37-.26-.76-.54-1.16-.78-8.63-5.99-18.11-10.46-28.25-13.27h-.02C4.05,14.93,8,6.78,13.73.02c.81-.02,1.66-.02,2.48-.02,4.51,0,9,.37,13.38,1.05l8.15,1.7c4.9,1.26,9.68,2.94,14.23,5.01,3.75,1.7,7.32,3.77,10.79,5.99l3.53,2.24c1.87,1.31,3.7,2.7,5.47,4.14,6.12,5.08,11.35,11.14,15.87,17.7l.37.54c4.88,7.13,8.89,14.84,11.42,23.08l.07.2Z\\"/>\\n              <path d=\\"M35.52,66.45c0,10.64-2.94,20.77-8.52,29.62-.89,1.42-1.83,2.79-2.86,4.12-2.22,2.9-4.73,5.6-7.45,8.02.5-3.03.74-6.15.74-9.31,0-4.03-.41-7.95-1.18-11.75-2.22-11.05-7.56-20.94-15.08-28.81-.76-3.79-1.18-7.72-1.18-11.75,0-5.69.81-11.18,2.33-16.39,10.13,2.81,19.61,7.28,28.25,13.27,3.25,7.15,4.95,15.02,4.95,22.97Z\\"/>\\n            </g>\\n          </svg>\\n        </div>\\n      </a>\\n      \\n      <!-- Desktop Navigation -->\\n      <nav class=\\"hidden md:flex space-x-8\\">\\n        {#each navItems as item}\\n          {#if item.children}\\n            <div \\n              class=\\"relative\\"\\n              bind:this={dropdownContainer}\\n              on:mouseenter={handleMouseEnter}\\n              on:mouseleave={handleMouseLeave}\\n            >\\n              <button \\n                class=\\"text-xl font-bold text-primary hover:text-gray-600 transition-colors flex items-center\\"\\n              >\\n                {item.label}\\n                <ChevronDown size={20} class=\\"ml-1\\" />\\n              </button>\\n              \\n              {#if isContactDropdownOpen}\\n                <div \\n                  class=\\"absolute top-full left-0 mt-2 w-48 bg-white rounded-md shadow-lg py-2\\"\\n                  transition:fly={{ y: -10, duration: 200 }}\\n                >\\n                  {#each item.children as child}\\n                    <a \\n                      href={child.href}\\n                      class=\\"block px-4 py-2 text-lg font-bold text-primary hover:bg-gray-100\\"\\n                    >\\n                      {child.label}\\n                    </a>\\n                  {/each}\\n                </div>\\n              {/if}\\n            </div>\\n          {:else}\\n            <a \\n              href={item.href} \\n              class=\\"text-xl font-bold text-primary hover:text-gray-600 transition-colors\\"\\n            >\\n              {item.label}\\n            </a>\\n          {/if}\\n        {/each}\\n      </nav>\\n      \\n      <!-- Desktop Right Icons -->\\n      <div class=\\"hidden md:flex items-center space-x-6\\">\\n        <button \\n          class=\\"text-primary hover:text-gray-600 transition-colors\\"\\n          on:click={toggleSearch}\\n          aria-label=\\"Search\\"\\n        >\\n          <Search size={20} />\\n        </button>\\n        <a href={$isAuthenticated ? \\"/account\\" : \\"/login\\"} class=\\"text-primary hover:text-gray-600 transition-colors\\">\\n          <User size={20} />\\n        </a>\\n      </div>\\n      \\n      <!-- Mobile Menu Button -->\\n      <div class=\\"md:hidden flex items-center space-x-4\\">\\n        <button \\n          type=\\"button\\" \\n          class=\\"text-primary p-2\\"\\n          on:click={toggleMenu}\\n          on:keydown={(e) => e.key === 'Enter' && toggleMenu()}\\n          aria-label={isMenuOpen ? \\"Close menu\\" : \\"Open menu\\"}\\n          aria-expanded={isMenuOpen}\\n          aria-controls=\\"mobile-menu\\"\\n        >\\n          {#if isMenuOpen}\\n            <X size={24} />\\n          {:else}\\n            <Menu size={24} />\\n          {/if}\\n        </button>\\n      </div>\\n    </div>\\n  </div>\\n  \\n  <!-- Mobile Menu -->\\n  {#if isMenuOpen}\\n    <div\\n      id=\\"mobile-menu\\" \\n      class=\\"md:hidden bg-white absolute top-14 inset-x-0 z-50 shadow-lg pointer-events-auto\\"\\n      transition:fly={{ y: -20, duration: 300 }}\\n      role=\\"navigation\\"\\n      aria-label=\\"Mobile navigation\\"\\n    >\\n      <div class=\\"container mx-auto px-4 py-4\\">\\n        <nav class=\\"flex flex-col space-y-4\\">\\n          {#each navItems as item}\\n            {#if item.children}\\n              {#each item.children as child}\\n                <a \\n                  href={child.href} \\n                  class=\\"text-xl font-bold py-2 text-primary hover:text-gray-600 transition-colors\\"\\n                  on:click={closeMenu}\\n                  on:keydown={(e) => e.key === 'Enter' && closeMenu()}\\n                >\\n                  {child.label}\\n                </a>\\n              {/each}\\n            {:else}\\n              <a \\n                href={item.href} \\n                class=\\"text-xl font-bold py-2 text-primary hover:text-gray-600 transition-colors\\"\\n                on:click={closeMenu}\\n                on:keydown={(e) => e.key === 'Enter' && closeMenu()}\\n              >\\n                {item.label}\\n              </a>\\n            {/if}\\n          {/each}\\n          <div class=\\"pt-4 border-t border-gray-200 flex space-x-6\\">\\n            <button \\n              class=\\"text-primary hover:text-gray-600 transition-colors\\"\\n              on:click={() => {\\n                toggleSearch();\\n                closeMenu();\\n              }}\\n              on:keydown={(e) => {\\n                if (e.key === 'Enter') {\\n                  toggleSearch();\\n                  closeMenu();\\n                }\\n              }}\\n              aria-label=\\"Search\\"\\n            >\\n              <Search size={20} />\\n            </button>\\n            <a \\n              href={$isAuthenticated ? \\"/account\\" : \\"/login\\"} \\n              class=\\"text-primary hover:text-gray-600 transition-colors\\"\\n              on:click={closeMenu}\\n              on:keydown={(e) => e.key === 'Enter' && closeMenu()}\\n              aria-label={$isAuthenticated ? \\"My Account\\" : \\"Login\\"}\\n            >\\n              <User size={20} />\\n            </a>\\n          </div>\\n        </nav>\\n      </div>\\n    </div>\\n  {/if}\\n  \\n  <!-- Search Popup -->\\n  {#if isSearchOpen}\\n    <div class=\\"fixed inset-0 z-50 overflow-hidden pointer-events-auto\\" transition:fly={{ duration: 300, y: -300 }}>\\n      <div class=\\"absolute inset-0 overflow-hidden\\">\\n        <div \\n          class=\\"absolute inset-0 bg-gray-500 bg-opacity-75 transition-opacity pointer-events-auto\\" \\n          on:click={toggleSearch}\\n          on:keydown={(e) => e.key === 'Enter' && toggleSearch()}\\n          tabindex=\\"0\\"\\n          role=\\"button\\"\\n          aria-label=\\"Close search\\"\\n        ></div>\\n        <div class=\\"fixed inset-x-0 top-0 pb-10 max-h-full flex\\">\\n          <SearchPopup onClose={toggleSearch} />\\n        </div>\\n      </div>\\n    </div>\\n  {/if}\\n</header>\\n\\n<style>\\n  svg {\\n    color: currentColor;\\n  }\\n</style>"],"names":[],"mappings":"AAsQE,kBAAI,CACF,KAAK,CAAE,YACT"}`
};
const Header = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let $page, $$unsubscribe_page;
  let $isAuthenticated, $$unsubscribe_isAuthenticated;
  $$unsubscribe_page = subscribe(page, (value) => $page = value);
  $$unsubscribe_isAuthenticated = subscribe(isAuthenticated, (value) => $isAuthenticated = value);
  let isMenuOpen = false;
  let dropdownContainer;
  const navItems = [
    { label: "Shop", href: "/products" },
    {
      label: "Contact",
      children: [{ label: "About Us", href: "/about" }, { label: "Support", href: "/help" }]
    }
  ];
  $$result.css.add(css);
  $page.url.pathname;
  $$unsubscribe_page();
  $$unsubscribe_isAuthenticated();
  return `   <header${add_attribute("class", `sticky top-0 z-50 w-full transition-all duration-300 ${"bg-cream"}`, 0)}><div class="container-wide"><div class="flex items-center justify-between h-14"> <a href="/" class="flex-shrink-0 flex items-center" data-svelte-h="svelte-rxgkqh"><div class="h-8 flex items-center"><svg class="h-full w-auto svelte-19i819d svelte-19i819d" viewBox="0 0 223.72 154.51" fill="currentColor"><g><path d="M108.67,146.96c-4.3,3.09-8.1,5.71-11.49,7.55l-4.23-6.48c2.25-1.97,4.88-4.2,7.86-6.62,2.79,1.91,5.42,3.79,7.86,5.54Z"></path><path d="M171.49,90.61c-.44,2.6-1.1,5.13-1.96,7.57-1.73,4.86-4.43,9.32-7.7,13.32l-7.78,9.5c-5.52,6.41-10.91,12.51-16.02,18.16l-10.82-3.47-1.63-.52c-.84.56-1.67,1.1-2.48,1.64-2.53-2.02-5.27-4.17-8.2-6.43,1.12-.85,2.26-1.7,3.42-2.58,7.76-5.84,16.51-12.18,25.83-18.71,4.75-3.32,9.4-6.53,13.9-9.55,4.67-3.17,9.17-6.15,13.44-8.92Z"></path><path d="M130.77,148.03l-4.23,6.48c-4.22-2.28-9.03-5.78-14.67-9.84-2.51-1.79-5.18-3.71-8.03-5.69-1.81-1.25-3.71-2.53-5.69-3.83l-1.63.52-10.82,3.47c-5.11-5.64-10.5-11.75-16.02-18.16l-7.78-9.5c-3.27-4-5.97-8.45-7.7-13.32-.86-2.43-1.52-4.96-1.96-7.57,4.27,2.78,8.78,5.75,13.44,8.92,4.49,3.02,9.15,6.23,13.9,9.55,9.32,6.53,18.07,12.87,25.83,18.71,2.23,1.68,4.39,3.32,6.47,4.91,2.86,2.2,5.54,4.3,8.03,6.28,4.25,3.38,7.9,6.43,10.87,9.05Z"></path><path d="M124.23,61.66c.07.2.15.39.24.57,7.3,11.77,18.94,20.25,32.58,23.52,5.78-18.18,17.11-34.41,32.34-46.03.13-.13.31-.24.46-.35v-.07l2.14-1.57c.37-.26.76-.54,1.16-.78,8.63-5.99,18.11-10.46,28.25-13.27h.02c-1.74-8.74-5.69-16.89-11.42-23.65C209.18,0,208.33,0,207.5,0c-4.51,0-9,.37-13.38,1.05l-8.15,1.7c-4.9,1.26-9.68,2.94-14.23,5.01-3.75,1.7-7.32,3.77-10.79,5.99l-3.53,2.24c-1.87,1.31-3.7,2.7-5.47,4.14-6.12,5.08-11.35,11.14-15.87,17.7l-.37.54c-4.88,7.13-8.89,14.84-11.42,23.08l-.07.2Z"></path><path d="M188.19,66.45c0,10.64,2.94,20.77,8.52,29.62.89,1.42,1.83,2.79,2.86,4.12,2.22,2.9,4.73,5.6,7.45,8.02-.5-3.03-.74-6.15-.74-9.31,0-4.03.41-7.95,1.18-11.75,2.22-11.05,7.56-20.94,15.08-28.81.76-3.79,1.18-7.72,1.18-11.75,0-5.69-.81-11.18-2.33-16.39-10.13,2.81-19.61,7.28-28.25,13.27-3.25,7.15-4.95,15.02-4.95,22.97Z"></path><path d="M99.49,61.66c-.07.2-.15.39-.24.57-7.3,11.77-18.94,20.25-32.58,23.52-5.78-18.18-17.11-34.41-32.34-46.03-.13-.13-.31-.24-.46-.35v-.07l-2.14-1.57c-.37-.26-.76-.54-1.16-.78-8.63-5.99-18.11-10.46-28.25-13.27h-.02C4.05,14.93,8,6.78,13.73.02c.81-.02,1.66-.02,2.48-.02,4.51,0,9,.37,13.38,1.05l8.15,1.7c4.9,1.26,9.68,2.94,14.23,5.01,3.75,1.7,7.32,3.77,10.79,5.99l3.53,2.24c1.87,1.31,3.7,2.7,5.47,4.14,6.12,5.08,11.35,11.14,15.87,17.7l.37.54c4.88,7.13,8.89,14.84,11.42,23.08l.07.2Z"></path><path d="M35.52,66.45c0,10.64-2.94,20.77-8.52,29.62-.89,1.42-1.83,2.79-2.86,4.12-2.22,2.9-4.73,5.6-7.45,8.02.5-3.03.74-6.15.74-9.31,0-4.03-.41-7.95-1.18-11.75-2.22-11.05-7.56-20.94-15.08-28.81-.76-3.79-1.18-7.72-1.18-11.75,0-5.69.81-11.18,2.33-16.39,10.13,2.81,19.61,7.28,28.25,13.27,3.25,7.15,4.95,15.02,4.95,22.97Z"></path></g></svg></div></a>  <nav class="hidden md:flex space-x-8">${each(navItems, (item) => {
    return `${item.children ? `<div class="relative"${add_attribute("this", dropdownContainer, 0)}><button class="text-xl font-bold text-primary hover:text-gray-600 transition-colors flex items-center">${escape(item.label)} ${validate_component(Chevron_down, "ChevronDown").$$render($$result, { size: 20, class: "ml-1" }, {}, {})}</button> ${``} </div>` : `<a${add_attribute("href", item.href, 0)} class="text-xl font-bold text-primary hover:text-gray-600 transition-colors">${escape(item.label)} </a>`}`;
  })}</nav>  <div class="hidden md:flex items-center space-x-6"><button class="text-primary hover:text-gray-600 transition-colors" aria-label="Search">${validate_component(Search, "Search").$$render($$result, { size: 20 }, {}, {})}</button> <a${add_attribute("href", $isAuthenticated ? "/account" : "/login", 0)} class="text-primary hover:text-gray-600 transition-colors">${validate_component(User, "User").$$render($$result, { size: 20 }, {}, {})}</a></div>  <div class="md:hidden flex items-center space-x-4"><button type="button" class="text-primary p-2"${add_attribute("aria-label", "Open menu", 0)}${add_attribute("aria-expanded", isMenuOpen, 0)} aria-controls="mobile-menu">${`${validate_component(Menu, "Menu").$$render($$result, { size: 24 }, {}, {})}`}</button></div></div></div>  ${``}  ${``} </header>`;
});
const Footer = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  const currentYear = (/* @__PURE__ */ new Date()).getFullYear();
  return `<footer class="bg-cream pt-12 pb-6"><div class="container-wide"><div class="grid grid-cols-1 md:grid-cols-4 gap-8 mb-12"><div><h3 class="font-bold text-lg mb-4" data-svelte-h="svelte-jfqd1h">Damned Designs</h3> <p class="text-gray-700 mb-4" data-svelte-h="svelte-v7r0ou">Premium knives and EDC gear designed with passion and precision.</p> <div class="flex space-x-4"><a href="https://instagram.com/damneddesigns" class="text-primary hover:text-gray-700" aria-label="Instagram">${validate_component(Instagram, "Instagram").$$render($$result, { size: 20 }, {}, {})}</a> <a href="https://facebook.com/damneddesigns" class="text-primary hover:text-gray-700" aria-label="Facebook">${validate_component(Facebook, "Facebook").$$render($$result, { size: 20 }, {}, {})}</a> <a href="https://twitter.com/damneddesigns" class="text-primary hover:text-gray-700" aria-label="Twitter">${validate_component(Twitter, "Twitter").$$render($$result, { size: 20 }, {}, {})}</a> <a href="mailto:contact@damneddesigns.com" class="text-primary hover:text-gray-700" aria-label="Email">${validate_component(Mail, "Mail").$$render($$result, { size: 20 }, {}, {})}</a></div></div> <div data-svelte-h="svelte-1k2bwqh"><h3 class="font-bold text-lg mb-4">Shop</h3> <ul class="space-y-2"><li><a href="/products" class="text-gray-700 hover:text-primary">All Products</a></li> <li><a href="/products?category=knives" class="text-gray-700 hover:text-primary">Knives</a></li> <li><a href="/products?category=tools" class="text-gray-700 hover:text-primary">Tools</a></li> <li><a href="/products?category=accessories" class="text-gray-700 hover:text-primary">Accessories</a></li> <li><a href="/products?category=new" class="text-gray-700 hover:text-primary">New Arrivals</a></li></ul></div> <div data-svelte-h="svelte-21ontm"><h3 class="font-bold text-lg mb-4">Company</h3> <ul class="space-y-2"><li><a href="/about" class="text-gray-700 hover:text-primary">About Us</a></li> <li><a href="/contact" class="text-gray-700 hover:text-primary">Contact</a></li> <li><a href="/blog" class="text-gray-700 hover:text-primary">Blog</a></li> <li><a href="/reviews" class="text-gray-700 hover:text-primary">Reviews</a></li></ul></div> <div data-svelte-h="svelte-rdxoif"><h3 class="font-bold text-lg mb-4">Customer Service</h3> <ul class="space-y-2"><li><a href="/shipping-returns" class="text-gray-700 hover:text-primary">Shipping &amp; Returns</a></li> <li><a href="/faq" class="text-gray-700 hover:text-primary">FAQ</a></li> <li><a href="/warranty" class="text-gray-700 hover:text-primary">Warranty</a></li> <li><a href="/privacy-policy" class="text-gray-700 hover:text-primary">Privacy Policy</a></li> <li><a href="/terms-of-service" class="text-gray-700 hover:text-primary">Terms of Service</a></li></ul></div></div> <div class="border-t border-gray-200 pt-6 text-center text-gray-600 text-sm"><p>© ${escape(currentYear)} Damned Designs. All rights reserved.</p></div></div></footer>`;
});
const FloatingCart = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let $cart, $$unsubscribe_cart;
  $$unsubscribe_cart = subscribe(cart, (value) => $cart = value);
  let isCartOpen = false;
  let cartCount = 0;
  cartCount = $cart.reduce((sum, item) => sum + item.quantity, 0);
  $$unsubscribe_cart();
  return ` <div class="fixed right-0 top-50vh transform -translate-y-1/2 z-40"><button class="bg-primary p-3 rounded-l-lg shadow-lg flex items-center justify-center relative" aria-label="Cart"${add_attribute("aria-expanded", isCartOpen, 0)} aria-haspopup="dialog">${validate_component(Shopping_cart, "ShoppingCart").$$render($$result, { size: 24, class: "text-white" }, {}, {})} ${cartCount > 0 ? `<span class="absolute bottom-0 left-0 -ml-1 -mb-1 bg-accent text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center"${add_attribute("aria-label", `${cartCount} items in cart`, 0)}>${escape(cartCount)}</span>` : ``}</button></div>  ${``}`;
});
const Layout = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let $page, $$unsubscribe_page;
  $$unsubscribe_page = subscribe(page, (value) => $page = value);
  $page.url.pathname === "/";
  $$unsubscribe_page();
  return `${validate_component(Toaster, "Toaster").$$render($$result, {}, {}, {})} <div class="flex flex-col min-h-screen bg-white">${validate_component(Header, "Header").$$render($$result, {}, {}, {})} <main class="flex-grow">${slots.default ? slots.default({}) : ``}</main> ${validate_component(Footer, "Footer").$$render($$result, {}, {}, {})} ${validate_component(FloatingCart, "FloatingCart").$$render($$result, {}, {}, {})}</div>`;
});
export {
  Layout as default
};
