export const DEMO_BRANDS = [
  {
    id: "b1000000-0000-0000-0000-000000000001",
    name: "Zinc Lifestyle",
    slug: "zinc-lifestyle",
    logoUrl: "https://images.unsplash.com/photo-1599305090598-fe179d501227?w=200&h=200&fit=crop",
    primaryColor: "#A22C29",
    googlePlaceId: "ChIJN1t_tDeuEmsRUsoyG83frY4",
    websiteType: "shopify",
    shopifyStoreUrl: "zinclifestyle.myshopify.com",
    reviewMessageTemplate: "Hi {{name}}, thanks for your order #{{orderId}} with Zinc Lifestyle! We'd love your feedback: {{link}}",
    createdAt: new Date().toISOString()
  },
  {
    id: "b2000000-0000-0000-0000-000000000002",
    name: "Apex Fitness & Gear",
    slug: "apex-fitness",
    logoUrl: "https://images.unsplash.com/photo-1517838277536-f5f99be501cd?w=200&h=200&fit=crop",
    primaryColor: "#2563eb",
    googlePlaceId: "ChIJL6QyAzeuEmsR_dummyPlace2",
    websiteType: "woocommerce",
    reviewMessageTemplate: "Hello {{name}}, how was your recent workout gear from Apex? Rate us here: {{link}}",
    createdAt: new Date().toISOString()
  },
  {
    id: "b3000000-0000-0000-0000-000000000003",
    name: "Lumina Skincare",
    slug: "lumina-skincare",
    logoUrl: "https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?w=200&h=200&fit=crop",
    primaryColor: "#ec4899",
    googlePlaceId: "ChIJR7TzBzeuEmsR_dummyPlace3",
    websiteType: "shopify",
    reviewMessageTemplate: "Hi {{name}}, how is your skin loving Lumina? Share your review: {{link}}",
    createdAt: new Date().toISOString()
  }
];

export const DEMO_CUSTOMERS = [
  {
    id: "c1000000-0000-0000-0000-000000000001",
    brandId: "b1000000-0000-0000-0000-000000000001",
    name: "Alice Smith",
    email: "alice.smith@example.com",
    phone: "+91 98765 43210",
    orderId: "ORD-1001",
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString(),
    link: {
      id: "l1000000-0000-0000-0000-000000000001",
      token: "tok_alice1001",
      whatsappSent: true,
      emailSent: true,
      isUsed: true
    },
    review: {
      rating: 5,
      feedback: "Exceptional quality and fast shipping! Will order again."
    }
  },
  {
    id: "c2000000-0000-0000-0000-000000000002",
    brandId: "b1000000-0000-0000-0000-000000000001",
    name: "Bob Johnson",
    email: "bob.j@example.com",
    phone: "+91 98765 43211",
    orderId: "ORD-1002",
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 5).toISOString(),
    link: {
      id: "l2000000-0000-0000-0000-000000000002",
      token: "tok_bob1002",
      whatsappSent: true,
      emailSent: false,
      isUsed: false
    }
  },
  {
    id: "c3000000-0000-0000-0000-000000000003",
    brandId: "b1000000-0000-0000-0000-000000000001",
    name: "Charlie Davis",
    email: "charlie.d@example.com",
    phone: "+91 98765 43212",
    orderId: "ORD-1003",
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 12).toISOString(),
    link: {
      id: "l3000000-0000-0000-0000-000000000003",
      token: "tok_charlie1003",
      whatsappSent: false,
      emailSent: true,
      isUsed: true
    },
    review: {
      rating: 5,
      feedback: "Best brand experience so far. Highly recommend!"
    }
  },
  {
    id: "c4000000-0000-0000-0000-000000000004",
    brandId: "b2000000-0000-0000-0000-000000000002",
    name: "Diana Prince",
    email: "diana.p@example.com",
    phone: "+91 98765 43213",
    orderId: "ORD-2001",
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString(),
    link: null
  },
  {
    id: "c5000000-0000-0000-0000-000000000005",
    brandId: "b2000000-0000-0000-0000-000000000002",
    name: "Ethan Hunt",
    email: "ethan.h@example.com",
    phone: "+91 98765 43214",
    orderId: "ORD-2002",
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 36).toISOString(),
    link: {
      id: "l5000000-0000-0000-0000-000000000005",
      token: "tok_ethan2002",
      whatsappSent: true,
      emailSent: true,
      isUsed: false
    }
  },
  {
    id: "c6000000-0000-0000-0000-000000000006",
    brandId: "b3000000-0000-0000-0000-000000000003",
    name: "Fiona Gallagher",
    email: "fiona.g@example.com",
    phone: "+91 98765 43215",
    orderId: "ORD-3001",
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 48).toISOString(),
    link: null
  }
];

export const DEMO_REVIEWS = [
  {
    id: "r1000000-0000-0000-0000-000000000001",
    brandId: "b1000000-0000-0000-0000-000000000001",
    customerId: "c1000000-0000-0000-0000-000000000001",
    orderId: "ORD-1001",
    rating: 5,
    feedback: "Exceptional quality and fast shipping! Will order again.",
    isPublic: true,
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString(),
    customer: {
      id: "c1000000-0000-0000-0000-000000000001",
      name: "Alice Smith",
      email: "alice.smith@example.com",
      phone: "+91 98765 43210",
      orderId: "ORD-1001"
    }
  },
  {
    id: "r2000000-0000-0000-0000-000000000002",
    brandId: "b1000000-0000-0000-0000-000000000001",
    customerId: "c3000000-0000-0000-0000-000000000003",
    orderId: "ORD-1003",
    rating: 5,
    feedback: "Best brand experience so far. Highly recommend!",
    isPublic: true,
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 12).toISOString(),
    customer: {
      id: "c3000000-0000-0000-0000-000000000003",
      name: "Charlie Davis",
      email: "charlie.d@example.com",
      phone: "+91 98765 43212",
      orderId: "ORD-1003"
    }
  },
  {
    id: "r3000000-0000-0000-0000-000000000003",
    brandId: "b2000000-0000-0000-0000-000000000002",
    customerId: null,
    orderId: "ORD-2005",
    rating: 4,
    feedback: "Great gym wear, fits true to size. Will buy other colors.",
    isPublic: true,
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 20).toISOString(),
    customer: null
  },
  {
    id: "r4000000-0000-0000-0000-000000000004",
    brandId: "b3000000-0000-0000-0000-000000000003",
    customerId: null,
    orderId: "ORD-3004",
    rating: 5,
    feedback: "The serum worked wonders in just one week! 5 stars.",
    isPublic: true,
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 30).toISOString(),
    customer: null
  }
];
