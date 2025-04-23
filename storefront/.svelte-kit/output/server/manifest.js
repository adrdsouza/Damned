export const manifest = (() => {
function __memo(fn) {
	let value;
	return () => value ??= (value = fn());
}

return {
	appDir: "_app",
	appPath: "_app",
	assets: new Set(["apple-touch-icon.png","favicon.ico","favicon.svg","hero.webp","images/about-hero.jpg","images/about-section.jpg","images/categories/accessories-banner.jpg","images/categories/accessories.jpg","images/categories/knives-banner.jpg","images/categories/knives.jpg","images/categories/tools-banner.jpg","images/categories/tools.jpg","images/hero.webp","images/logo.png","images/paypal-logo.png","images/products/banshee.jpg","images/products/beads.jpg","images/products/cerberus.jpg","images/products/djinn-xl-black.jpg","images/products/djinn-xl-damascus.jpg","images/products/djinn-xl-stonewash.jpg","images/products/djinn-xl.jpg","images/products/kraken.jpg","images/products/leather-case.jpg","images/products/maintenance-kit.jpg","images/products/oni-compact-black.jpg","images/products/oni-compact-green.jpg","images/products/oni-compact-titanium.jpg","images/products/oni-compact.jpg","images/products/pocket-tool.jpg","images/products/pouch.jpg","images/products/pry-bar.jpg","images/products/wendigo-black.jpg","images/products/wendigo-green.jpg","images/products/wendigo-magnacut.jpg","images/products/wendigo.jpg"]),
	mimeTypes: {".png":"image/png",".svg":"image/svg+xml",".webp":"image/webp",".jpg":"image/jpeg"},
	_: {
		client: {start:"_app/immutable/entry/start.B8lm0Tbx.js",app:"_app/immutable/entry/app.Dz2KQcwg.js",imports:["_app/immutable/entry/start.B8lm0Tbx.js","_app/immutable/chunks/CfqzmGcx.js","_app/immutable/chunks/CtARYoZa.js","_app/immutable/chunks/CsLHPPUA.js","_app/immutable/entry/app.Dz2KQcwg.js","_app/immutable/chunks/C1FmrZbK.js","_app/immutable/chunks/CtARYoZa.js","_app/immutable/chunks/CJBvT94Z.js"],stylesheets:[],fonts:[],uses_env_dynamic_public:false},
		nodes: [
			__memo(() => import('./nodes/0.js')),
			__memo(() => import('./nodes/1.js')),
			__memo(() => import('./nodes/2.js')),
			__memo(() => import('./nodes/3.js')),
			__memo(() => import('./nodes/4.js')),
			__memo(() => import('./nodes/5.js')),
			__memo(() => import('./nodes/6.js')),
			__memo(() => import('./nodes/7.js')),
			__memo(() => import('./nodes/8.js')),
			__memo(() => import('./nodes/9.js')),
			__memo(() => import('./nodes/10.js')),
			__memo(() => import('./nodes/11.js')),
			__memo(() => import('./nodes/12.js')),
			__memo(() => import('./nodes/13.js')),
			__memo(() => import('./nodes/14.js')),
			__memo(() => import('./nodes/15.js')),
			__memo(() => import('./nodes/16.js')),
			__memo(() => import('./nodes/17.js')),
			__memo(() => import('./nodes/18.js'))
		],
		routes: [
			{
				id: "/",
				pattern: /^\/$/,
				params: [],
				page: { layouts: [0,], errors: [1,], leaf: 2 },
				endpoint: null
			},
			{
				id: "/about",
				pattern: /^\/about\/?$/,
				params: [],
				page: { layouts: [0,], errors: [1,], leaf: 3 },
				endpoint: null
			},
			{
				id: "/account",
				pattern: /^\/account\/?$/,
				params: [],
				page: { layouts: [0,], errors: [1,], leaf: 4 },
				endpoint: null
			},
			{
				id: "/account/orders/[id]",
				pattern: /^\/account\/orders\/([^/]+?)\/?$/,
				params: [{"name":"id","optional":false,"rest":false,"chained":false}],
				page: { layouts: [0,], errors: [1,], leaf: 5 },
				endpoint: null
			},
			{
				id: "/api/reviews",
				pattern: /^\/api\/reviews\/?$/,
				params: [],
				page: null,
				endpoint: __memo(() => import('./entries/endpoints/api/reviews/_server.ts.js'))
			},
			{
				id: "/api/tickets",
				pattern: /^\/api\/tickets\/?$/,
				params: [],
				page: null,
				endpoint: __memo(() => import('./entries/endpoints/api/tickets/_server.ts.js'))
			},
			{
				id: "/api/tickets/[id]",
				pattern: /^\/api\/tickets\/([^/]+?)\/?$/,
				params: [{"name":"id","optional":false,"rest":false,"chained":false}],
				page: null,
				endpoint: __memo(() => import('./entries/endpoints/api/tickets/_id_/_server.ts.js'))
			},
			{
				id: "/api/tickets/[id]/messages",
				pattern: /^\/api\/tickets\/([^/]+?)\/messages\/?$/,
				params: [{"name":"id","optional":false,"rest":false,"chained":false}],
				page: null,
				endpoint: __memo(() => import('./entries/endpoints/api/tickets/_id_/messages/_server.ts.js'))
			},
			{
				id: "/cart",
				pattern: /^\/cart\/?$/,
				params: [],
				page: { layouts: [0,], errors: [1,], leaf: 6 },
				endpoint: null
			},
			{
				id: "/checkout",
				pattern: /^\/checkout\/?$/,
				params: [],
				page: { layouts: [0,], errors: [1,], leaf: 7 },
				endpoint: null
			},
			{
				id: "/checkout/confirmation",
				pattern: /^\/checkout\/confirmation\/?$/,
				params: [],
				page: { layouts: [0,], errors: [1,], leaf: 8 },
				endpoint: null
			},
			{
				id: "/contact",
				pattern: /^\/contact\/?$/,
				params: [],
				page: { layouts: [0,], errors: [1,], leaf: 9 },
				endpoint: null
			},
			{
				id: "/help",
				pattern: /^\/help\/?$/,
				params: [],
				page: { layouts: [0,], errors: [1,], leaf: 10 },
				endpoint: null
			},
			{
				id: "/help/tickets",
				pattern: /^\/help\/tickets\/?$/,
				params: [],
				page: { layouts: [0,], errors: [1,], leaf: 11 },
				endpoint: null
			},
			{
				id: "/help/tickets/new",
				pattern: /^\/help\/tickets\/new\/?$/,
				params: [],
				page: { layouts: [0,], errors: [1,], leaf: 13 },
				endpoint: null
			},
			{
				id: "/help/tickets/[id]",
				pattern: /^\/help\/tickets\/([^/]+?)\/?$/,
				params: [{"name":"id","optional":false,"rest":false,"chained":false}],
				page: { layouts: [0,], errors: [1,], leaf: 12 },
				endpoint: null
			},
			{
				id: "/login",
				pattern: /^\/login\/?$/,
				params: [],
				page: { layouts: [0,], errors: [1,], leaf: 14 },
				endpoint: null
			},
			{
				id: "/products",
				pattern: /^\/products\/?$/,
				params: [],
				page: { layouts: [0,], errors: [1,], leaf: 15 },
				endpoint: null
			},
			{
				id: "/products/[slug]",
				pattern: /^\/products\/([^/]+?)\/?$/,
				params: [{"name":"slug","optional":false,"rest":false,"chained":false}],
				page: { layouts: [0,], errors: [1,], leaf: 16 },
				endpoint: null
			},
			{
				id: "/shop",
				pattern: /^\/shop\/?$/,
				params: [],
				page: { layouts: [0,], errors: [1,], leaf: 17 },
				endpoint: null
			},
			{
				id: "/shop/[category]",
				pattern: /^\/shop\/([^/]+?)\/?$/,
				params: [{"name":"category","optional":false,"rest":false,"chained":false}],
				page: { layouts: [0,], errors: [1,], leaf: 18 },
				endpoint: null
			}
		],
		prerendered_routes: new Set([]),
		matchers: async () => {
			
			return {  };
		},
		server_assets: {}
	}
}
})();
