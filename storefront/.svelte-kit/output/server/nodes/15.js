import * as universal from '../entries/pages/products/_page.js';

export const index = 15;
let component_cache;
export const component = async () => component_cache ??= (await import('../entries/pages/products/_page.svelte.js')).default;
export { universal };
export const universal_id = "src/routes/products/+page.js";
export const imports = ["_app/immutable/nodes/15.BmzXlN9G.js","_app/immutable/chunks/C1FmrZbK.js","_app/immutable/chunks/CEWqOmfF.js","_app/immutable/chunks/DMI_bSna.js","_app/immutable/chunks/BosuxZz1.js","_app/immutable/chunks/CtARYoZa.js","_app/immutable/chunks/CJBvT94Z.js","_app/immutable/chunks/CCLH35N-.js","_app/immutable/chunks/DVdDg2k-.js","_app/immutable/chunks/CO9Vqxxf.js","_app/immutable/chunks/CsLHPPUA.js","_app/immutable/chunks/DcmIUciy.js","_app/immutable/chunks/3IqKhqHc.js"];
export const stylesheets = ["_app/immutable/assets/Toaster.B9JcwM7w.css"];
export const fonts = [];
