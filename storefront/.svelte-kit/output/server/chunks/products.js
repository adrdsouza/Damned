const products = [
  {
    id: 1,
    name: "Djinn XL Titanium",
    slug: "djinn-xl-titanium",
    description: "The Djinn XL is our flagship folding knife, featuring a premium titanium handle and a high-performance CPM-S35VN blade. The ergonomic design ensures comfortable use for extended periods, while the smooth action and solid lockup provide reliability you can count on.",
    price: 249.99,
    salePrice: 199.99,
    onSale: true,
    image: "/images/products/djinn-xl.jpg",
    category: "knives",
    featured: true,
    new: true,
    specs: {
      material: "CPM-S35VN steel",
      length: "8.5 inches (overall)",
      weight: "4.2 oz",
      handle: "Titanium"
    },
    variations: [
      {
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
      },
      {
        id: "djinn-xl-blackout",
        name: "Blackout Edition",
        price: 269.99,
        salePrice: 219.99,
        inStock: true,
        attributes: {
          finish: "DLC Black",
          blade: "CPM-S35VN"
        },
        image: "/images/products/djinn-xl-black.jpg"
      },
      {
        id: "djinn-xl-damascus",
        name: "Damascus Limited",
        price: 399.99,
        inStock: false,
        attributes: {
          finish: "Polished",
          blade: "Damascus Steel"
        },
        image: "/images/products/djinn-xl-damascus.jpg"
      }
    ]
  },
  {
    id: 2,
    name: "Oni Compact",
    slug: "oni-compact",
    description: "The Oni Compact is a smaller, more pocket-friendly version of our popular Oni design. Don't let its size fool you – this knife packs a punch with its D2 tool steel blade and G10 handle scales. Perfect for everyday carry when you need a reliable cutting tool without the bulk.",
    price: 129.99,
    image: "/images/products/oni-compact.jpg",
    category: "knives",
    featured: true,
    specs: {
      material: "D2 tool steel",
      length: "6.75 inches (overall)",
      weight: "3.1 oz",
      handle: "G10"
    },
    variations: [
      {
        id: "oni-compact-green",
        name: "OD Green G10",
        price: 129.99,
        inStock: true,
        attributes: {
          handle: "OD Green G10",
          blade: "Stonewashed D2"
        },
        image: "/images/products/oni-compact-green.jpg"
      },
      {
        id: "oni-compact-black",
        name: "Black G10",
        price: 129.99,
        inStock: true,
        attributes: {
          handle: "Black G10",
          blade: "Stonewashed D2"
        },
        image: "/images/products/oni-compact-black.jpg"
      },
      {
        id: "oni-compact-titanium",
        name: "Titanium Edition",
        price: 199.99,
        inStock: true,
        attributes: {
          handle: "Bead Blasted Titanium",
          blade: "M390"
        },
        image: "/images/products/oni-compact-titanium.jpg"
      }
    ]
  },
  {
    id: 3,
    name: "Wendigo Fixed Blade",
    slug: "wendigo-fixed-blade",
    description: "The Wendigo is a versatile fixed blade designed for outdoor enthusiasts. With its full-tang construction and premium steel, this knife is ready for any adventure. The ergonomic handle provides a secure grip in all conditions, while the included Kydex sheath offers safe and convenient carry options.",
    price: 179.99,
    salePrice: 149.99,
    onSale: true,
    image: "/images/products/wendigo.jpg",
    category: "knives",
    featured: true,
    specs: {
      material: "CPM-3V steel",
      length: "9.25 inches (overall)",
      weight: "5.8 oz",
      handle: "Micarta"
    },
    variations: [
      {
        id: "wendigo-green",
        name: "Green Canvas Micarta",
        price: 179.99,
        salePrice: 149.99,
        inStock: true,
        attributes: {
          handle: "Green Canvas Micarta",
          blade: "CPM-3V"
        },
        image: "/images/products/wendigo-green.jpg"
      },
      {
        id: "wendigo-black",
        name: "Black Linen Micarta",
        price: 179.99,
        salePrice: 149.99,
        inStock: true,
        attributes: {
          handle: "Black Linen Micarta",
          blade: "CPM-3V"
        },
        image: "/images/products/wendigo-black.jpg"
      },
      {
        id: "wendigo-magnacut",
        name: "Premium Magnacut",
        price: 249.99,
        inStock: false,
        attributes: {
          handle: "Carbon Fiber",
          blade: "Magnacut"
        },
        image: "/images/products/wendigo-magnacut.jpg"
      }
    ]
  },
  {
    id: 4,
    name: "Titanium Pocket Tool",
    slug: "titanium-pocket-tool",
    description: "Our Titanium Pocket Tool is the perfect companion for your everyday carry. This multi-functional tool includes a pry bar, bottle opener, hex wrench set, and more – all in a compact, lightweight package that fits easily in your pocket or on your keychain.",
    price: 49.99,
    image: "/images/products/pocket-tool.jpg",
    category: "tools",
    featured: true,
    specs: {
      material: "Grade 5 Titanium",
      length: "3.5 inches",
      weight: "0.9 oz",
      features: "Pry bar, bottle opener, hex wrenches"
    }
  },
  {
    id: 5,
    name: "Kraken Slipjoint",
    slug: "kraken-slipjoint",
    description: "The Kraken Slipjoint is our modern take on a classic design. Legal in most areas due to its non-locking mechanism, this knife features premium materials and our signature attention to detail. The N690 steel blade offers excellent edge retention, while the contoured handle ensures comfortable use.",
    price: 119.99,
    image: "/images/products/kraken.jpg",
    category: "knives",
    specs: {
      material: "N690 steel",
      length: "7.0 inches (overall)",
      weight: "2.8 oz",
      handle: "Carbon fiber"
    }
  },
  {
    id: 6,
    name: "Cerberus Button Lock",
    slug: "cerberus-button-lock",
    description: "The Cerberus features our smooth button lock mechanism for easy one-handed operation. The premium blade steel and contoured handle scales make this an exceptional everyday carry option for those who appreciate quality and performance.",
    price: 189.99,
    salePrice: 159.99,
    onSale: true,
    image: "/images/products/cerberus.jpg",
    category: "knives",
    new: true,
    specs: {
      material: "M390 steel",
      length: "7.8 inches (overall)",
      weight: "3.9 oz",
      handle: "G10 with titanium liners"
    }
  },
  {
    id: 7,
    name: "Titanium Bead Set",
    slug: "titanium-bead-set",
    description: "Add a touch of style to your gear with our Titanium Bead Set. Each set includes three precision-machined titanium beads in different finishes. Perfect for lanyards, zipper pulls, or as decorative elements for your favorite EDC items.",
    price: 29.99,
    image: "/images/products/beads.jpg",
    category: "accessories",
    specs: {
      material: "Grade 5 Titanium",
      size: "0.5 inch diameter",
      weight: "0.3 oz (each)",
      includes: "3 beads (stonewashed, flamed, and anodized)"
    }
  },
  {
    id: 8,
    name: "EDC Organizer Pouch",
    slug: "edc-organizer-pouch",
    description: "Keep your everyday carry items organized and protected with our EDC Organizer Pouch. Made from durable Cordura fabric with a water-resistant coating, this pouch features multiple elastic loops and pockets to securely hold your knives, tools, flashlights, and more.",
    price: 39.99,
    salePrice: 29.99,
    onSale: true,
    image: "/images/products/pouch.jpg",
    category: "accessories",
    specs: {
      material: "1000D Cordura",
      dimensions: '8" x 5" x 1.5"',
      weight: "3.2 oz",
      features: "YKK zipper, MOLLE compatible"
    }
  },
  {
    id: 9,
    name: "Precision Maintenance Kit",
    slug: "precision-maintenance-kit",
    description: "Keep your knives in peak condition with our Precision Maintenance Kit. This comprehensive set includes everything you need to clean, lubricate, and maintain your folding knives, ensuring smooth operation and long-lasting performance.",
    price: 59.99,
    image: "/images/products/maintenance-kit.jpg",
    category: "tools",
    specs: {
      includes: "Lubricant, cleaning cloth, torx bits, tweezers",
      case: "Zippered EVA case",
      weight: "7.5 oz",
      compatibility: "Works with all Damned Designs knives"
    }
  },
  {
    id: 10,
    name: "Banshee Framelock",
    slug: "banshee-framelock",
    description: "The Banshee is a sleek, minimalist framelock folder that combines elegant design with robust performance. The titanium frame provides strength without excess weight, while the premium blade steel ensures exceptional cutting ability and edge retention.",
    price: 219.99,
    image: "/images/products/banshee.jpg",
    category: "knives",
    specs: {
      material: "CPM-20CV steel",
      length: "7.5 inches (overall)",
      weight: "3.7 oz",
      handle: "Titanium framelock"
    }
  },
  {
    id: 11,
    name: "Leather Slip Case",
    slug: "leather-slip-case",
    description: "Protect your favorite knife in style with our handcrafted Leather Slip Case. Made from premium full-grain leather, each case is carefully stitched and burnished for a perfect finish. The soft interior lining prevents scratches, while the durable exterior provides protection during transport.",
    price: 34.99,
    image: "/images/products/leather-case.jpg",
    category: "accessories",
    specs: {
      material: "Full-grain leather",
      dimensions: '5.5" x 1.75"',
      lining: "Microfiber",
      fits: 'Knives up to 5" closed length'
    }
  },
  {
    id: 12,
    name: "Titanium Pry Bar",
    slug: "titanium-pry-bar",
    description: "Our Titanium Pry Bar is the perfect tool for tasks that would damage your knife blade. Machined from solid titanium, this compact tool includes multiple functions including a pry tip, scraper edge, and bottle opener. The pocket clip allows for convenient carry.",
    price: 45.99,
    image: "/images/products/pry-bar.jpg",
    category: "tools",
    specs: {
      material: "Grade 5 Titanium",
      length: "4.0 inches",
      weight: "1.2 oz",
      features: "Pry tip, scraper, bottle opener, pocket clip"
    }
  }
];
export {
  products
};
