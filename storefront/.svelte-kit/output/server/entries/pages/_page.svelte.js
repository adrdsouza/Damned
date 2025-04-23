import { c as create_ssr_component, v as validate_component, g as add_attribute, e as escape } from "../../chunks/ssr.js";
import { T as Truck } from "../../chunks/truck.js";
import { I as Icon } from "../../chunks/Icon.js";
import { C as Credit_card } from "../../chunks/credit-card.js";
import { products } from "../../chunks/products.js";
import "easy-reactive";
import { s as subscribe, a as set_store_value } from "../../chunks/utils.js";
import { z } from "zod";
import { s as superForm } from "../../chunks/index3.js";
import { t as toast } from "../../chunks/Toaster.svelte_svelte_type_style_lang.js";
const Award = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  const iconNode = [
    ["circle", { "cx": "12", "cy": "8", "r": "6" }],
    [
      "path",
      {
        "d": "M15.477 12.89 17 22l-5-3-5 3 1.523-9.11"
      }
    ]
  ];
  return `${validate_component(Icon, "Icon").$$render($$result, Object.assign({}, { name: "award" }, $$props, { iconNode }), {}, {
    default: () => {
      return `${slots.default ? slots.default({}) : ``}`;
    }
  })}`;
});
const Shield = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  const iconNode = [
    [
      "path",
      {
        "d": "M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10"
      }
    ]
  ];
  return `${validate_component(Icon, "Icon").$$render($$result, Object.assign({}, { name: "shield" }, $$props, { iconNode }), {}, {
    default: () => {
      return `${slots.default ? slots.default({}) : ``}`;
    }
  })}`;
});
const Hero = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  return `  <section class="relative bg-cream min-h-[600px] flex items-center" data-svelte-h="svelte-178vlk4"><div class="container"><div class="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center"><div class="lg:pr-12 -mt-6"><h1 class="text-4xl md:text-5xl font-bold leading-tight mb-4">Precision Crafted Knives for the Discerning Collector</h1> <p class="text-lg text-gray-700 mb-6 max-w-xl">Discover our premium collection of EDC knives, designed with meticulous attention to detail and crafted from the finest materials.</p> <div class="flex flex-col sm:flex-row gap-4"><a href="/products" class="btn btn-primary">Shop Collection</a> <a href="/about" class="btn btn-secondary">About Us</a></div></div> <div class="relative h-full"><div class="w-full h-full min-h-[400px] relative flex justify-center items-center"><img src="/hero.webp" alt="Premium knife from Damned Designs" class="max-w-full max-h-full object-contain rounded-lg"></div></div></div></div></section>`;
});
const css$1 = {
  code: ".sticky-trust-bar.svelte-z75dfy{position:relative;z-index:10}@media(max-height: 800px){.sticky-trust-bar.svelte-z75dfy{position:sticky;bottom:0}}",
  map: '{"version":3,"file":"TrustBar.svelte","sources":["TrustBar.svelte"],"sourcesContent":["<!--\\n  @notice CRITICAL COMPONENT - DO NOT MODIFY WITHOUT EXPLICIT PERMISSION\\n  This component is locked and requires explicit consent for any changes.\\n-->\\n\\n<script lang=\\"ts\\">import { Truck, Shield, CreditCard, Award } from \\"lucide-svelte\\";\\n<\/script>\\n\\n<section class=\\"bg-white py-3 border-y border-gray-200 sticky-trust-bar\\">\\n  <div class=\\"container\\">\\n    <div class=\\"grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6 justify-items-center\\">\\n      <!-- Free Shipping -->\\n      <div class=\\"flex flex-col items-center text-center\\">\\n        <div class=\\"w-10 h-10 flex items-center justify-center bg-cream rounded-full mb-2\\">\\n          <Truck size={20} />\\n        </div>\\n        <div>\\n          <p class=\\"font-bold text-sm\\">Free Shipping</p>\\n          <p class=\\"text-xs text-gray-600\\">On orders over $100</p>\\n        </div>\\n      </div>\\n\\n      <!-- SheerID Verification -->\\n      <div class=\\"flex flex-col items-center text-center\\">\\n        <div class=\\"w-10 h-10 flex items-center justify-center bg-cream rounded-full mb-2\\">\\n          <Shield size={20} />\\n        </div>\\n        <div>\\n          <p class=\\"font-bold text-sm\\">Military & First Responder</p>\\n          <p class=\\"text-xs text-gray-600\\">Verified 10% discount</p>\\n        </div>\\n      </div>\\n\\n      <!-- Sezzle Payments -->\\n      <div class=\\"flex flex-col items-center text-center\\">\\n        <div class=\\"w-10 h-10 flex items-center justify-center bg-cream rounded-full mb-2\\">\\n          <CreditCard size={20} />\\n        </div>\\n        <div>\\n          <p class=\\"font-bold text-sm\\">Buy Now, Pay Later</p>\\n          <p class=\\"text-xs text-gray-600\\">4 interest-free payments</p>\\n        </div>\\n      </div>\\n\\n      <!-- Trustpilot -->\\n      <div class=\\"flex flex-col items-center text-center\\">\\n        <div class=\\"w-10 h-10 flex items-center justify-center bg-cream rounded-full mb-2\\">\\n          <Award size={20} />\\n        </div>\\n        <div>\\n          <p class=\\"font-bold text-sm\\">Trusted by Customers</p>\\n          <p class=\\"text-xs text-gray-600\\">4.8/5 on Trustpilot</p>\\n        </div>\\n      </div>\\n    </div>\\n  </div>\\n</section>\\n\\n<style>\\n  .sticky-trust-bar {\\n    position: relative;\\n    z-index: 10;\\n  }\\n  \\n  @media (max-height: 800px) {\\n    .sticky-trust-bar {\\n      position: sticky;\\n      bottom: 0;\\n    }\\n  }\\n</style>"],"names":[],"mappings":"AA2DE,+BAAkB,CAChB,QAAQ,CAAE,QAAQ,CAClB,OAAO,CAAE,EACX,CAEA,MAAO,aAAa,KAAK,CAAE,CACzB,+BAAkB,CAChB,QAAQ,CAAE,MAAM,CAChB,MAAM,CAAE,CACV,CACF"}'
};
const TrustBar = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  $$result.css.add(css$1);
  return `  <section class="bg-white py-3 border-y border-gray-200 sticky-trust-bar svelte-z75dfy"><div class="container"><div class="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6 justify-items-center"> <div class="flex flex-col items-center text-center"><div class="w-10 h-10 flex items-center justify-center bg-cream rounded-full mb-2">${validate_component(Truck, "Truck").$$render($$result, { size: 20 }, {}, {})}</div> <div data-svelte-h="svelte-1sd0y3j"><p class="font-bold text-sm">Free Shipping</p> <p class="text-xs text-gray-600">On orders over $100</p></div></div>  <div class="flex flex-col items-center text-center"><div class="w-10 h-10 flex items-center justify-center bg-cream rounded-full mb-2">${validate_component(Shield, "Shield").$$render($$result, { size: 20 }, {}, {})}</div> <div data-svelte-h="svelte-gkarzc"><p class="font-bold text-sm">Military &amp; First Responder</p> <p class="text-xs text-gray-600">Verified 10% discount</p></div></div>  <div class="flex flex-col items-center text-center"><div class="w-10 h-10 flex items-center justify-center bg-cream rounded-full mb-2">${validate_component(Credit_card, "CreditCard").$$render($$result, { size: 20 }, {}, {})}</div> <div data-svelte-h="svelte-2ndqsi"><p class="font-bold text-sm">Buy Now, Pay Later</p> <p class="text-xs text-gray-600">4 interest-free payments</p></div></div>  <div class="flex flex-col items-center text-center"><div class="w-10 h-10 flex items-center justify-center bg-cream rounded-full mb-2">${validate_component(Award, "Award").$$render($$result, { size: 20 }, {}, {})}</div> <div data-svelte-h="svelte-198qium"><p class="font-bold text-sm">Trusted by Customers</p> <p class="text-xs text-gray-600">4.8/5 on Trustpilot</p></div></div></div></div> </section>`;
});
const css = {
  code: ".sc-carousel__dots-wrapper{display:none !important}",
  map: '{"version":3,"file":"FeaturedProducts.svelte","sources":["FeaturedProducts.svelte"],"sourcesContent":["<!--\\n  @notice CRITICAL COMPONENT - DO NOT MODIFY WITHOUT EXPLICIT PERMISSION\\n  This component is locked and requires explicit consent for any changes.\\n-->\\n\\n<script lang=\\"ts\\">import { products } from \\"$lib/data/products\\";\\nimport { ArrowRight, ArrowLeft } from \\"lucide-svelte\\";\\nimport { browser } from \\"$app/environment\\";\\nimport Carousel from \\"svelte-carousel\\";\\nconst featuredProducts = products.filter((product) => product.featured).slice(0, 4);\\nlet currentIndex = 0;\\n<\/script>\\n\\n<section class=\\"relative bg-white\\">\\n  <div class=\\"w-full h-[800px] relative\\">\\n    {#if browser}\\n      <Carousel \\n        autoplay \\n        autoplayDuration={5000}\\n        pauseOnFocus\\n        arrows={false}\\n        dots={false}\\n        on:pageChange={({ detail }) => currentIndex = detail}\\n      >\\n        {#each featuredProducts as product, i}\\n          <div class=\\"relative h-[800px] w-full\\">\\n            <img \\n              src={product.image} \\n              alt={product.name}\\n              class=\\"w-full h-full object-cover\\"\\n            />\\n            <!-- Gradient Overlay -->\\n            <div class=\\"absolute inset-0 bg-gradient-to-r from-black/70 to-transparent\\"></div>\\n            \\n            <!-- Content -->\\n            <div class=\\"absolute inset-0 container flex items-center\\">\\n              <div class=\\"max-w-2xl text-white\\">\\n                <div class=\\"mb-4\\">\\n                  {#if i === 0}\\n                    <span class=\\"bg-accent px-3 py-1 text-sm font-medium rounded-full\\">Best Seller</span>\\n                  {:else if i === 1}\\n                    <span class=\\"bg-primary px-3 py-1 text-sm font-medium rounded-full\\">Featured</span>\\n                  {:else if i === 2}\\n                    <span class=\\"bg-green-500 px-3 py-1 text-sm font-medium rounded-full\\">New Launch</span>\\n                  {/if}\\n                </div>\\n                <h2 class=\\"text-5xl font-bold mb-4\\">{product.name}</h2>\\n                <p class=\\"text-lg text-gray-200 mb-6 line-clamp-3\\">{product.description}</p>\\n                <div class=\\"flex gap-4\\">\\n                  <a \\n                    href={`/products/${product.slug}`} \\n                    class=\\"btn bg-white text-primary hover:bg-gray-100\\"\\n                  >\\n                    View Details\\n                  </a>\\n                  <button \\n                    class=\\"btn bg-primary text-white hover:bg-gray-800\\"\\n                  >\\n                    Add to Cart\\n                  </button>\\n                </div>\\n              </div>\\n            </div>\\n          </div>\\n        {/each}\\n      </Carousel>\\n\\n      <!-- Custom Navigation -->\\n      <div class=\\"container absolute inset-0 flex items-center justify-between pointer-events-none\\">\\n        <button \\n          class=\\"p-2 rounded-full bg-white/10 backdrop-blur-sm text-white hover:bg-white/20 transition-colors pointer-events-auto\\"\\n          on:click={() => {\\n            const carousel = document.querySelector(\'.sc-carousel\');\\n            if (carousel) {\\n              // @ts-ignore\\n              carousel.prev();\\n            }\\n          }}\\n        >\\n          <ArrowLeft size={24} />\\n        </button>\\n        <button \\n          class=\\"p-2 rounded-full bg-white/10 backdrop-blur-sm text-white hover:bg-white/20 transition-colors pointer-events-auto\\"\\n          on:click={() => {\\n            const carousel = document.querySelector(\'.sc-carousel\');\\n            if (carousel) {\\n              // @ts-ignore\\n              carousel.next();\\n            }\\n          }}\\n        >\\n          <ArrowRight size={24} />\\n        </button>\\n      </div>\\n    {:else}\\n      <!-- SSR Fallback -->\\n      <div class=\\"relative h-[800px] w-full\\">\\n        <img \\n          src={featuredProducts[0].image} \\n          alt={featuredProducts[0].name}\\n          class=\\"w-full h-full object-cover\\"\\n        />\\n        <div class=\\"absolute inset-0 bg-gradient-to-r from-black/70 to-transparent\\"></div>\\n        <div class=\\"absolute inset-0 container flex items-center\\">\\n          <div class=\\"max-w-2xl text-white\\">\\n            <div class=\\"mb-4\\">\\n              <span class=\\"bg-accent px-3 py-1 text-sm font-medium rounded-full\\">Best Seller</span>\\n            </div>\\n            <h2 class=\\"text-5xl font-bold mb-4\\">{featuredProducts[0].name}</h2>\\n            <p class=\\"text-lg text-gray-200 mb-6 line-clamp-3\\">{featuredProducts[0].description}</p>\\n            <div class=\\"flex gap-4\\">\\n              <a \\n                href={`/products/${featuredProducts[0].slug}`} \\n                class=\\"btn bg-white text-primary hover:bg-gray-100\\"\\n              >\\n                View Details\\n              </a>\\n              <button \\n                class=\\"btn bg-primary text-white hover:bg-gray-800\\"\\n              >\\n                Add to Cart\\n              </button>\\n            </div>\\n          </div>\\n        </div>\\n      </div>\\n    {/if}\\n  </div>\\n</section>\\n\\n<style>\\n  :global(.sc-carousel__dots-wrapper) {\\n    display: none !important;\\n  }\\n</style>"],"names":[],"mappings":"AAmIU,0BAA4B,CAClC,OAAO,CAAE,IAAI,CAAC,UAChB"}'
};
const FeaturedProducts = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  const featuredProducts = products.filter((product) => product.featured).slice(0, 4);
  $$result.css.add(css);
  return `  <section class="relative bg-white"><div class="w-full h-[800px] relative">${` <div class="relative h-[800px] w-full"><img${add_attribute("src", featuredProducts[0].image, 0)}${add_attribute("alt", featuredProducts[0].name, 0)} class="w-full h-full object-cover"> <div class="absolute inset-0 bg-gradient-to-r from-black/70 to-transparent"></div> <div class="absolute inset-0 container flex items-center"><div class="max-w-2xl text-white"><div class="mb-4" data-svelte-h="svelte-7p6823"><span class="bg-accent px-3 py-1 text-sm font-medium rounded-full">Best Seller</span></div> <h2 class="text-5xl font-bold mb-4">${escape(featuredProducts[0].name)}</h2> <p class="text-lg text-gray-200 mb-6 line-clamp-3">${escape(featuredProducts[0].description)}</p> <div class="flex gap-4"><a${add_attribute("href", `/products/${featuredProducts[0].slug}`, 0)} class="btn bg-white text-primary hover:bg-gray-100">View Details</a> <button class="btn bg-primary text-white hover:bg-gray-800" data-svelte-h="svelte-4eitus">Add to Cart</button></div></div></div></div>`}</div> </section>`;
});
const AboutSection = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  return `  <section class="py-16 bg-cream" data-svelte-h="svelte-rlxaii"><div class="container"> <div class="grid grid-cols-1 lg:grid-cols-2 gap-12"><div><h2 class="text-3xl font-bold mb-6">Crafted with Passion</h2> <p class="text-gray-700 mb-4">At Damned Designs, we&#39;re passionate about creating exceptional everyday carry tools that combine innovative design, premium materials, and superior craftsmanship.</p> <p class="text-gray-700 mb-6">Each knife we create is a perfect balance of form and function, designed to be used and appreciated for years to come. We take pride in our attention to detail, our innovative approach to design, and our unwavering commitment to quality.</p> <a href="/about" class="btn btn-primary">Learn More</a></div> <div class="aspect-video bg-gray-100 rounded-lg overflow-hidden"><img src="/images/about-section.jpg" alt="Damned Designs workshop" class="w-full h-full object-cover"></div></div></div></section>`;
});
const Newsletter = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let $form, $$unsubscribe_form;
  let $errors, $$unsubscribe_errors;
  const formSchema = z.object({
    email: z.string().email({
      message: "Please enter a valid email address"
    })
  });
  const { form, errors } = superForm(formSchema, {
    id: "newsletter",
    dataType: "json",
    onSubmit: () => {
      return { success: true };
    },
    onResult: ({ result }) => {
      if (result.type === "success") {
        toast.success("Thank you for subscribing to our newsletter!");
        set_store_value(form, $form.email = "", $form);
      }
    }
  });
  $$unsubscribe_form = subscribe(form, (value) => $form = value);
  $$unsubscribe_errors = subscribe(errors, (value) => $errors = value);
  $$unsubscribe_form();
  $$unsubscribe_errors();
  return `  <section class="py-16 bg-cream"><div class="container"><div class="max-w-3xl mx-auto text-center"><h2 class="text-3xl font-bold mb-4" data-svelte-h="svelte-es7olw">Join Our Newsletter</h2> <p class="mb-8 text-gray-700" data-svelte-h="svelte-jjrbvv">Subscribe to receive updates on new products, special offers, and exclusive content.</p> <form method="POST" class="flex flex-col sm:flex-row gap-4 max-w-lg mx-auto"><div class="flex-grow"><input type="email" id="email" placeholder="Your email address" aria-label="Email address for newsletter" class="w-full px-4 py-3 rounded-md border border-gray-300 text-primary focus:outline-none focus:ring-2 focus:ring-primary"${add_attribute("value", $form.email, 0)}> ${$errors.email ? `<p class="text-red-500 text-sm mt-1 text-left">${escape($errors.email)}</p>` : ``}</div> <button type="submit" class="bg-primary text-white px-6 py-3 rounded-md font-medium hover:bg-gray-800 transition-colors" aria-label="Subscribe to newsletter" data-svelte-h="svelte-i2ser2">Subscribe</button></form></div></div></section>`;
});
const Page = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  return `  ${$$result.head += `<!-- HEAD_svelte-u56bef_START -->${$$result.title = `<title>Damned Designs - Premium Knives &amp; EDC Gear</title>`, ""}<meta name="description" content="Discover premium knives and EDC gear at Damned Designs. Exceptional craftsmanship, innovative designs, and superior materials for enthusiasts and collectors."><!-- HEAD_svelte-u56bef_END -->`, ""} ${validate_component(Hero, "Hero").$$render($$result, {}, {}, {})} ${validate_component(TrustBar, "TrustBar").$$render($$result, {}, {}, {})} ${validate_component(FeaturedProducts, "FeaturedProducts").$$render($$result, {}, {}, {})} ${validate_component(AboutSection, "AboutSection").$$render($$result, {}, {}, {})} ${validate_component(Newsletter, "Newsletter").$$render($$result, {}, {}, {})}`;
});
export {
  Page as default
};
