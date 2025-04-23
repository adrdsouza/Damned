import { c as create_ssr_component, v as validate_component } from "./ssr.js";
import { I as Icon } from "./Icon.js";
const Truck = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  const iconNode = [
    [
      "path",
      {
        "d": "M5 18H3c-.6 0-1-.4-1-1V7c0-.6.4-1 1-1h10c.6 0 1 .4 1 1v11"
      }
    ],
    ["path", { "d": "M14 9h4l4 4v4c0 .6-.4 1-1 1h-2" }],
    ["circle", { "cx": "7", "cy": "18", "r": "2" }],
    ["path", { "d": "M15 18H9" }],
    ["circle", { "cx": "17", "cy": "18", "r": "2" }]
  ];
  return `${validate_component(Icon, "Icon").$$render($$result, Object.assign({}, { name: "truck" }, $$props, { iconNode }), {}, {
    default: () => {
      return `${slots.default ? slots.default({}) : ``}`;
    }
  })}`;
});
export {
  Truck as T
};
