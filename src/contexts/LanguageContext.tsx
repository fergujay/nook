import { createContext, useContext, useState, ReactNode } from 'react'

export type Language = 'en' | 'sr'

interface LanguageContextType {
  language: Language
  setLanguage: (lang: Language) => void
  t: (key: string) => string
  tList: (key: string) => string[]
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined)

type TranslationValue = string | string[] | TranslationTree
interface TranslationTree {
  [key: string]: TranslationValue
}

const en: TranslationTree = {
  nav: {
    home: 'Home',
    products: 'Our Collection',
    aboutUs: 'About',
    ourStory: 'Our Story',
    textileCare: 'Textile Care',
    courier: 'Delivery & Payment',
    cart: 'Cart',
  },
  common: {
    back: 'Back',
    backToProducts: 'Back to Products',
    continueShopping: 'Continue Shopping',
    browseProducts: 'Browse Products',
    learnMore: 'Know More',
    aboutDelivery: 'About Delivery',
    viewAllProducts: 'View All Products',
    addToCart: 'Add to Cart',
    addedToCart: 'Added to cart',
    viewProduct: 'View Details',
    enlarge: 'Enlarge',
    outOfStock: 'Out of Stock',
    quantity: 'Quantity',
    item: 'item',
    items: 'items',
    size: 'Size',
    fabric: 'Fabric',
    shape: 'Shape',
    category: 'Category',
    email: 'Email',
    phone: 'Phone',
    address: 'Address',
    contact: 'Contact',
    language: 'Language',
    currency: 'RSD',
  },
  productFields: {
    tablecloth: 'Tablecloth',
    napkinsSet: 'Napkins, set of two',
    placematsRoundSet: 'Round placemats, set of two',
    placematsEmbroideredSet: 'Embroidered placemats, set of two',
    stripedTableRunner: 'Striped table runner',
    tableRunner: 'Table runner',
    round: 'round',
    rectangular: 'rectangular',
    fabric: {
      linen: 'Linen',
      linenPolyester: 'Linen with a small polyester blend',
      cottonViscose: 'Cotton with a small viscose blend',
    },
    categories: {
      Linen: 'Linen',
      Cotton: 'Cotton',
      All: 'All',
    },
  },
  home: {
    heroEyebrow: 'TABLE LINEN · BELGRADE',
    heroTitle: 'Textiles that feel like home',
    heroLead:
      'NOOK is a small table linen brand based in Belgrade. We create our pieces in small batches using natural fabrics, paying close attention to every detail.',
    heroCta: 'VIEW COLLECTION',
    heroOverlayTitle: 'SMALL BATCHES',
    heroOverlayText:
      'Handmade in Belgrade, with natural fabrics and quiet attention to detail.',
    collectionEyebrow: 'OUR COLLECTION',
    collectionTitle: 'Pieces you’ll want to return to',
    collectionLead:
      'Each collection is an attempt to capture a feeling of a moment – the first warm days, soft light, the calm of home.',
    cottonEyebrow: 'EVERYDAY EASE',
    cottonTitle: 'Cotton',
    cottonText:
      'Soft, breathable cotton in quiet, lived-in hues — made to feel at home from the very first dinner.',
    cottonCta: 'EXPLORE COTTON',
    linenEyebrow: 'QUIET ELEGANCE',
    linenTitle: 'Linen',
    linenText:
      'Natural linen with a gentle drape and an honest texture that only gets better with washing and use.',
    linenCta: 'EXPLORE LINEN',
    storyEyebrow: 'OUR STORY',
    storyTitle: 'Home as a\nplace with meaning',
    storyText:
      'We believe that home is a place where every object has meaning. We design textiles that don’t overwhelm a space, but quietly become part of it.',
    storyCta: 'OUR STORY',
    visitEyebrow: 'GET IN TOUCH',
    visitTitle: 'Say hello',
    visitText:
      'Questions, custom pieces, or a chat about linen — we’d love to hear from you.',
    locationTitle: 'Instagram',
    locationText: '@nook.belgrade',
    pickupTitle: 'Pickup partner',
    pickupText: 'MARFA Flower Shop, Belgrade\n(by arrangement after your order)',
    emailTitle: 'Email',
  },
  products: {
    eyebrow: 'OUR COLLECTION',
    title: 'Find your table’s new favorite',
    lead:
      'Each piece is designed and sewn in Belgrade, using natural fabrics. Stocks are intentionally limited — if something is gone, it may return in the next batch.',
    filterShowing: 'SHOWING',
    emptyTitle: 'Nothing in this category yet.',
    emptyLead: 'Try another category or view the full collection.',
  },
  productDetail: {
    recommended: 'You might also like',
    backToShop: 'Back to shop',
    lightboxZoomIn: 'Zoom in',
    lightboxZoomOut: 'Zoom out',
    lightboxZoomControls: 'Image zoom',
    lightboxClose: 'Close gallery',
  },
  cart: {
    title: 'Shopping Cart',
    empty: 'Your cart is empty',
    emptyHint: 'Start adding items to your cart',
    summary: 'Order Summary',
    itemsCount: 'Items',
    shipping: 'Shipping',
    shippingFromCheckout: 'Calculated at checkout',
    total: 'Total',
    subtotal: 'Subtotal',
    proceedToCheckout: 'Proceed to Checkout',
    remove: 'Remove',
    decreaseQuantity: 'Decrease quantity',
    increaseQuantity: 'Increase quantity',
    freeShippingNote: 'Free delivery on orders over 10 000 RSD',
  },
  checkout: {
    title: 'Checkout',
    shippingInformation: 'Shipping Information',
    paymentInformation: 'Payment',
    firstName: 'First Name',
    lastName: 'Last Name',
    email: 'Email',
    phone: 'Phone',
    address: 'Address',
    city: 'City',
    zipCode: 'Postal Code',
    country: 'Country',
    selectCountry: 'Select Country',
    serbia: 'Serbia',
    other: 'Other',
    deliveryMethod: 'Delivery method',
    deliveryCourierBelgrade: 'Courier in Belgrade (500 RSD)',
    deliveryCourierBelgradeHint: 'Delivered by courier to your door.',
    deliveryPost: 'Post of Serbia (300 RSD)',
    deliveryPostHint: 'Up to 7 business days anywhere in Serbia.',
    deliveryPickup: 'Pickup — MARFA Flower Shop, Belgrade (free)',
    deliveryPickupHint: 'We’ll share the details and arrange a convenient time.',
    paymentMethod: 'Payment method',
    paymentCard: 'Card payment on the website',
    paymentCashOnDelivery: 'Cash on delivery (Belgrade courier only)',
    paymentAtPickup: 'Cash or card at pickup (MARFA Flower Shop)',
    cardNumber: 'Card Number',
    cardName: 'Cardholder Name',
    expiryDate: 'Expiry Date',
    cvv: 'CVV',
    placeOrder: 'Place Order',
    notes: 'Order notes (optional)',
    termsAccept: 'By placing this order you agree to our',
    termsLink: 'Terms & Conditions',
    privacyLink: 'Privacy Policy',
    and: 'and',
  },
  order: {
    heroEyebrow: 'ORDER · CONFIRMED',
    confirmed: 'Order received!',
    thankYou:
      'Thank you for your order. We’ll be in touch shortly by email to confirm details and delivery.',
    detailsLead:
      'Save this reference — we’ll use it in your confirmation email and when your order ships.',
    orderDetails: 'Order Details',
    orderNumber: 'Order Number',
    orderDate: 'Order Date',
    estimatedDelivery: 'Estimated Delivery',
    whatsNext: 'What’s next?',
    whatsNextText:
      'You will receive a confirmation email with order details and tracking information once your order ships.',
    backToHome: 'Back to Home',
  },
  about: {
    title: 'About NOOK',
    storySectionLabel: 'On cloth and home',
    lead: 'A small table linen brand based in Belgrade.',
    p1:
      'We create our pieces in small batches using natural fabrics, allowing us to pay close attention to every detail. What matters to us is not only how an item looks, but how it lives – after washing, in everyday use, and in different homes.',
    p2:
      'We design textiles that don’t overwhelm a space, but quietly become part of it. Pieces you’ll want to return to. Each collection is an attempt to capture a feeling of a moment – the first warm days, soft light, the calm of home.',
    p3: 'We believe that home is a place where every object has meaning.',
    valuesTitle: 'What we care about',
    value1Title: 'Small batches',
    value1Text: 'Made thoughtfully, in limited quantities, in Belgrade.',
    value2Title: 'Natural fabrics',
    value2Text: 'Linen and cotton chosen for how they live after many washes.',
    value3Title: 'Quiet details',
    value3Text: 'Textiles that settle into a home, rather than compete with it.',
    contactTitle: 'Get in touch',
    contactLead:
      'We answer every message personally. For custom orders, questions about a piece or collaborations — please write to us.',
    basedIn: 'Instagram',
    basedInValue: '@nook.belgrade',
  },
  courier: {
    title: 'Delivery & Payment',
    heroEyebrow: 'SHIPPING · SERBIA',
    optionsTitle: 'How we deliver',
    detailsTitle: 'Terms & payment',
    lead: 'We offer delivery within Serbia.',
    optionBelgradeTitle: 'Courier delivery (Belgrade)',
    optionBelgradePrice: '500 RSD',
    optionBelgradeDesc:
      'Delivered by courier to your door. Delivery time is arranged individually and may be available the same day.',
    optionBelgradePayment: 'Card payment on the website or cash upon delivery.',
    optionPostTitle: 'Post of Serbia (other cities)',
    optionPostPrice: '300 RSD',
    optionPostDesc:
      'Delivery time typically takes up to 7 business days, anywhere in Serbia.',
    optionPostPayment: 'Card payment on the website.',
    optionPickupTitle: 'Pickup — MARFA Flower Shop (Belgrade)',
    optionPickupPrice: 'Free',
    optionPickupDesc:
      'Once your order is ready, we will share the details and arrange a convenient time for pickup.',
    optionPickupPayment: 'Cash or card in the studio.',
    freeShippingTitle: 'Free delivery over 10 000 RSD',
    freeShippingText:
      'All orders over 10 000 RSD ship for free, regardless of the chosen method.',
    paymentsTitle: 'Payment methods',
    paymentsItems: [
      'Card on the website (for all delivery methods)',
      'Cash upon delivery (courier in Belgrade)',
      'Cash or card at pickup (MARFA Flower Shop)',
    ],
    questionsTitle: 'Questions about delivery?',
    questionsText: 'Write to us — we’ll reply personally and arrange everything with you.',
  },
  textileCare: {
    title: 'How to care for your textiles',
    heroEyebrow: 'LINEN & COTTON · CARE',
    stepsTitle: 'A gentle routine',
    lead:
      'Linen and cotton get better with use. A few simple habits will keep your table linen looking quietly beautiful for years.',
    sections: {
      washing: {
        title: 'Washing',
        tips: [
          'Wash at 30–40°C on a gentle cycle.',
          'Use mild, liquid detergent — avoid bleach and softeners.',
          'Wash colours separately, especially the first few times.',
          'Close zippers and turn embroidered pieces inside out.',
          'Don’t overload the machine — linen likes room to move.',
        ],
      },
      drying: {
        title: 'Drying',
        tips: [
          'Air dry flat or on a line, away from direct sunlight.',
          'Smooth with your hands while damp to reduce wrinkles.',
          'Avoid tumble dryers when possible — they shorten the fabric’s life.',
          'Remove from the line while slightly damp for easier ironing.',
        ],
      },
      ironing: {
        title: 'Ironing',
        tips: [
          'Iron linen while still slightly damp, on the reverse side.',
          'Use a hot iron with steam for linen; medium heat for cotton.',
          'Leave soft creases — they are part of the fabric’s character.',
          'Let pieces cool fully before folding or storing.',
        ],
      },
      storage: {
        title: 'Storage',
        tips: [
          'Store in a cool, dry place with good airflow.',
          'Fold loosely; avoid plastic bags for long-term storage.',
          'Keep away from direct sunlight to preserve colour.',
          'Air rarely used pieces every few months.',
        ],
      },
    },
    notesTitle: 'A few honest notes',
    notesItems: [
      'Natural linen softens and relaxes with every wash — it is meant to.',
      'Slight shrinkage after the first wash is normal for natural fibres.',
      'Small slubs and colour variation are part of natural fabrics, not flaws.',
    ],
  },
  returns: {
    heroEyebrow: 'CUSTOMER CARE',
    title: 'Returns & Refunds',
    lead:
      'If for any reason you are not satisfied with your order, you have the right to return it within 14 days of delivery.',
    howTitle: 'How to request a return',
    howText:
      'Please contact us at {email} with your order details. We’ll guide you through the process.',
    conditionsTitle: 'Return conditions',
    conditionsItems: [
      'Items must be returned in their original condition — unused, unwashed, and in the original packaging.',
      'Unless the item is faulty or incorrect, return shipping costs are covered by the customer.',
    ],
    refundTitle: 'Refunds',
    refundText:
      'Once we receive and inspect the returned item, we will process your refund within 14 days. Refunds are issued using the original payment method. If your order was paid in cash, we will arrange the refund with you individually.',
    damagedTitle: 'Damaged or incorrect items',
    damagedText:
      'If you receive a damaged or incorrect item, please contact us within 48 hours of delivery so we can resolve the issue.',
  },
  terms: {
    title: 'Terms & Conditions',
    intro:
      'These Terms & Conditions apply to all orders placed through the NOOK website. By placing an order, you agree to the terms outlined below.',
    ordersTitle: 'Orders',
    ordersText:
      'All orders are subject to availability and confirmation. Once your order is placed, you will receive a confirmation via email or message. We reserve the right to refuse or cancel an order in case of incorrect pricing, availability issues, or other unforeseen circumstances.',
    pricingTitle: 'Pricing',
    pricingText:
      'All prices are listed in Serbian dinars (RSD). Delivery costs are calculated separately and clearly shown before checkout. We strive to ensure that all information on the website is accurate, but errors may occasionally occur.',
    paymentTitle: 'Payment',
    paymentIntro: 'Orders can be paid:',
    paymentItems: [
      'by card on the website',
      'in cash upon delivery (available for courier delivery in Belgrade)',
      'by card or cash at pickup (available at our partner location)',
    ],
    paymentOutro:
      'Orders are processed after payment is confirmed, or upon order confirmation for cash payments.',
    deliveryTitle: 'Delivery',
    deliveryText:
      'Delivery is carried out within Serbia according to the terms outlined in the Delivery & Payment section. Estimated delivery times are indicative and may vary.',
    returnsTitle: 'Returns',
    returnsText:
      'Returns and refunds are handled in accordance with our Returns & Refunds policy.',
    productTitle: 'Product information',
    productText:
      'We aim to display product colors and details as accurately as possible. However, slight variations may occur due to screen settings or the nature of the materials.',
    liabilityTitle: 'Liability',
    liabilityText:
      'NOOK is not responsible for delays or failures caused by circumstances beyond our control.',
    changesTitle: 'Changes',
    changesText:
      'We reserve the right to update these Terms & Conditions at any time. Any changes will be published on this page.',
    contactTitle: 'Contact',
    contactText: 'For any questions, please contact us at {email}.',
  },
  privacy: {
    title: 'Privacy Policy',
    intro:
      'We respect your privacy and are committed to protecting your personal data.',
    dataCollectTitle: 'What data we collect',
    dataCollectIntro:
      'When you place an order or contact us, we may collect:',
    dataCollectItems: [
      'name',
      'phone number',
      'email address',
      'delivery address',
      'payment information (processed securely via payment providers)',
    ],
    dataUseTitle: 'How we use your data',
    dataUseIntro: 'We use your data to:',
    dataUseItems: [
      'process and deliver your orders',
      'communicate with you about your order',
      'provide customer support',
      'comply with legal obligations',
    ],
    dataUseOutro:
      'With your consent, we may also use your data to send occasional updates about new products, collections, or offers.',
    marketingTitle: 'Marketing & consent',
    marketingText:
      'We only send marketing communications if you have given your explicit consent. You can withdraw your consent at any time by contacting us or using the unsubscribe option (if available). We may also use tools such as analytics or advertising services (e.g. Meta Pixel) to understand how visitors use our website and to improve our communication. These tools may use cookies and similar technologies.',
    sharingTitle: 'Data sharing',
    sharingIntro: 'We only share your data when necessary:',
    sharingItems: [
      'with delivery services to complete your order',
      'with payment providers to process payments',
      'with service providers for website analytics and advertising (where applicable)',
      'with authorities if required by law',
    ],
    sharingOutro: 'We do not sell your personal data.',
    storageTitle: 'Data storage',
    storageText:
      'We store your data only for as long as necessary to fulfill your order and comply with legal obligations.',
    rightsTitle: 'Your rights',
    rightsIntro: 'You have the right to:',
    rightsItems: [
      'access your personal data',
      'request correction or deletion',
      'withdraw consent',
    ],
    rightsOutro: 'To exercise your rights, please contact us at {email}.',
    cookiesTitle: 'Cookies',
    cookiesText:
      'We may use cookies to improve your browsing experience, analyze website traffic, and support marketing activities. You can manage cookie preferences in your browser settings.',
    contactTitle: 'Contact',
    contactText:
      'If you have any questions about this Privacy Policy, please contact us at {email}.',
  },
  ourStory: {
    heroEyebrow: 'OUR STORY',
    title: 'Things in your home matter',
    lead: 'A table linen brand from Belgrade, built on a quiet belief: the objects around you shape how you live.',
    sectionLabel: 'Why the table',
    preline: 'NOOK · BEOGRAD',
    p1: 'The most meaningful moments don\u2019t happen in remarkable places. They happen at the table \u2014 over a holiday dinner, a slow breakfast, a late conversation with someone you love. The table is where life gathers.',
    p2: 'That\u2019s why we make what we make. Not to decorate, but to give those moments a texture they deserve \u2014 something honest, something that becomes more yours with every use.',
    quote: 'Things in your home matter.',
    characterLabel: 'Quiet by design',
    characterP1: 'We design against noise. Against fast cycles and loud branding. Against objects that demand attention instead of earning it.',
    characterP2: 'Each piece is made to settle into a home, not compete with it. The colors follow seasons. The names hold onto moments \u2014 a patch of moss after rain, the first light of April, a bloom you almost missed. Our collections try to capture a feeling, not chase a trend.',
    craftLabel: 'How we make',
    craft1Title: 'Fifteen at a time',
    craft1Text: 'Each set is limited to fifteen pieces. Made in a Belgrade atelier, from Serbian linen and cotton, by people who check every seam.',
    craft2Title: 'Chosen for the tenth wash',
    craft2Text: 'We pick fabrics for how they live after many washes \u2014 softer, more honest, more yours. Natural linen and cotton that age well.',
    craft3Title: 'No plastic, no rush',
    craft3Text: 'Craft paper packaging. Natural materials. Small runs that let us care for every detail. We\u2019d rather make less and make it right.',
    customLabel: 'Custom pieces',
    customText: 'We make pieces to order \u2014 a specific size, a color for your table, a set for a special occasion. Write to us and we\u2019ll make it together.',
    contactLabel: 'Say hello',
    contactLead: 'Questions, custom orders, or a conversation about linen \u2014 we answer every message personally.',
  },
  footer: {
    tagline: 'Table linen, made in small batches in Belgrade.',
    sinceLine: '© {year} NOOK · Table linen',
    quickLinks: 'EXPLORE',
    linkCollection: 'Our Collection',
    linkAbout: 'About',
    linkStory: 'Our Story',
    linkCare: 'Textile Care',
    linkDelivery: 'Delivery & Payment',
    policies: 'INFORMATION',
    linkReturns: 'Returns & Refunds',
    linkTerms: 'Terms & Conditions',
    linkPrivacy: 'Privacy Policy',
    contact: 'CONTACT',
    legalTitle: 'Legal',
    legalName: 'Anna Kovtun PR Beograd',
    legalMb: 'Matični broj: 67827481',
    legalPib: 'PIB: 114751854',
    rights: 'All rights reserved.',
  },
}

const sr: TranslationTree = {
  nav: {
    home: 'Početna',
    products: 'Naša kolekcija',
    aboutUs: 'O nama',
    ourStory: 'Naša priča',
    textileCare: 'Nega tekstila',
    courier: 'Dostava i plaćanje',
    cart: 'Korpa',
  },
  common: {
    back: 'Nazad',
    backToProducts: 'Nazad na proizvode',
    continueShopping: 'Nastavi kupovinu',
    browseProducts: 'Pogledaj proizvode',
    learnMore: 'Saznaj više',
    aboutDelivery: 'O dostavi',
    viewAllProducts: 'Pogledaj sve proizvode',
    addToCart: 'Dodaj u korpu',
    addedToCart: 'Dodato u korpu',
    viewProduct: 'Pogledaj detalje',
    enlarge: 'Uvećaj',
    outOfStock: 'Nije na stanju',
    quantity: 'Količina',
    item: 'artikal',
    items: 'artikli',
    size: 'Dimenzija',
    fabric: 'Materijal',
    shape: 'Oblik',
    category: 'Kategorija',
    email: 'E-mail',
    phone: 'Telefon',
    address: 'Adresa',
    contact: 'Kontakt',
    language: 'Jezik',
    currency: 'RSD',
  },
  productFields: {
    tablecloth: 'Stolnjak',
    napkinsSet: 'Salvete, set od dva',
    placematsRoundSet: 'Okrugli plejsmeti, set od dva',
    placematsEmbroideredSet: 'Plejsmeti sa vezom, set od dva',
    stripedTableRunner: 'Prugasti ranner za sto',
    tableRunner: 'Ranner za sto',
    round: 'okrugli',
    rectangular: 'pravougaoni',
    fabric: {
      linen: 'Lan',
      linenPolyester: 'Lan sa malim udelom poliestera',
      cottonViscose: 'Pamuk sa malim udelom viskoze',
    },
    categories: {
      Linen: 'Lan',
      Cotton: 'Pamuk',
      All: 'Sve',
    },
  },
  home: {
    heroEyebrow: 'STOLNI TEKSTIL · BEOGRAD',
    heroTitle: 'Tekstili koji deluju kao kod kuće',
    heroLead:
      'NOOK je mali brend stolnog tekstila iz Beograda. Šijemo u malim serijama, od prirodnih materijala, posvećeni svakom detalju.',
    heroCta: 'POGLEDAJ KOLEKCIJU',
    heroOverlayTitle: 'MALE SERIJE',
    heroOverlayText:
      'Ručno rađeno u Beogradu, od prirodnih materijala, sa tihom pažnjom prema detalju.',
    collectionEyebrow: 'NAŠA KOLEKCIJA',
    collectionTitle: 'Komadi kojima se rado vraćate',
    collectionLead:
      'Svaka kolekcija je pokušaj da se uhvati osećaj trenutka – prvi topli dani, meka svetlost, mir doma.',
    cottonEyebrow: 'SVAKODNEVNA LAKOĆA',
    cottonTitle: 'Pamuk',
    cottonText:
      'Mek, prozračan pamuk u tihim, nošenim tonovima — kao da ga godinama imate.',
    cottonCta: 'POGLEDAJ PAMUK',
    linenEyebrow: 'TIHA ELEGANCIJA',
    linenTitle: 'Lan',
    linenText:
      'Prirodni lan sa nežnim padom i iskrenom teksturom koja se sa svakim pranjem samo popravlja.',
    linenCta: 'POGLEDAJ LAN',
    storyEyebrow: 'NAŠA PRIČA',
    storyTitle: 'Dom kao\nmesto sa značenjem',
    storyText:
      'Verujemo da je dom mesto u kome svaki predmet ima značenje. Tekstili koje pravimo ne dominiraju prostorom — tiho postaju njegov deo.',
    storyCta: 'NAŠA PRIČA',
    visitEyebrow: 'KONTAKT',
    visitTitle: 'Javite nam se',
    visitText:
      'Pitanja, narudžbine po meri ili samo kratak razgovor o lanu — rado ćemo vam odgovoriti.',
    locationTitle: 'Instagram',
    locationText: '@nook.belgrade',
    pickupTitle: 'Preuzimanje',
    pickupText: 'MARFA Flower Shop, Beograd\n(po dogovoru, nakon narudžbine)',
    emailTitle: 'E-mail',
  },
  products: {
    eyebrow: 'NAŠA KOLEKCIJA',
    title: 'Pronađite novi omiljeni komad za sto',
    lead:
      'Svaki komad je dizajniran i šiven u Beogradu, od prirodnih materijala. Zalihe su namerno male — ako nečega nema, moguće je da se vrati u sledećoj seriji.',
    filterShowing: 'PRIKAZANO',
    emptyTitle: 'U ovoj kategoriji trenutno nema proizvoda.',
    emptyLead: 'Pokušajte drugu kategoriju ili pogledajte celu kolekciju.',
  },
  productDetail: {
    recommended: 'Možda će vam se dopasti i ovo',
    backToShop: 'Nazad u prodavnicu',
    lightboxZoomIn: 'Uvećaj',
    lightboxZoomOut: 'Umanji',
    lightboxZoomControls: 'Uvećanje slike',
    lightboxClose: 'Zatvori galeriju',
  },
  cart: {
    title: 'Korpa',
    empty: 'Vaša korpa je prazna',
    emptyHint: 'Dodajte komade koje želite',
    summary: 'Sažetak narudžbine',
    itemsCount: 'Artikli',
    shipping: 'Dostava',
    shippingFromCheckout: 'Obračunava se na naplati',
    total: 'Ukupno',
    subtotal: 'Međuzbir',
    proceedToCheckout: 'Napred ka naplati',
    remove: 'Ukloni',
    decreaseQuantity: 'Smanji količinu',
    increaseQuantity: 'Povećaj količinu',
    freeShippingNote: 'Besplatna dostava za porudžbine preko 10 000 RSD',
  },
  checkout: {
    title: 'Naplata',
    shippingInformation: 'Podaci za dostavu',
    paymentInformation: 'Plaćanje',
    firstName: 'Ime',
    lastName: 'Prezime',
    email: 'E-mail',
    phone: 'Telefon',
    address: 'Adresa',
    city: 'Grad',
    zipCode: 'Poštanski broj',
    country: 'Država',
    selectCountry: 'Izaberite državu',
    serbia: 'Srbija',
    other: 'Ostalo',
    deliveryMethod: 'Način dostave',
    deliveryCourierBelgrade: 'Kurirska dostava u Beogradu (500 RSD)',
    deliveryCourierBelgradeHint: 'Kurir donosi porudžbinu do vaših vrata.',
    deliveryPost: 'Pošta Srbije (300 RSD)',
    deliveryPostHint: 'Do 7 radnih dana, bilo gde u Srbiji.',
    deliveryPickup: 'Preuzimanje — MARFA Flower Shop, Beograd (besplatno)',
    deliveryPickupHint: 'Kada porudžbina bude spremna, dogovaramo zgodno vreme.',
    paymentMethod: 'Način plaćanja',
    paymentCard: 'Plaćanje karticom na sajtu',
    paymentCashOnDelivery: 'Plaćanje pouzećem (samo za kurira u Beogradu)',
    paymentAtPickup: 'Gotovinom ili karticom prilikom preuzimanja (MARFA Flower Shop)',
    cardNumber: 'Broj kartice',
    cardName: 'Ime sa kartice',
    expiryDate: 'Datum isteka',
    cvv: 'CVV',
    placeOrder: 'Naruči',
    notes: 'Napomene uz porudžbinu (opciono)',
    termsAccept: 'Slanjem porudžbine prihvatate naše',
    termsLink: 'Uslove korišćenja',
    privacyLink: 'Politiku privatnosti',
    and: 'i',
  },
  order: {
    heroEyebrow: 'PORUDŽBINA · PRIMLJENA',
    confirmed: 'Porudžbina je primljena!',
    thankYou:
      'Hvala na porudžbini. Javljamo se uskoro putem e-maila da potvrdimo detalje i dostavu.',
    detailsLead:
      'Sačuvajte ovaj broj — koristićemo ga u mejlu za potvrdu i kada pošaljemo porudžbinu.',
    orderDetails: 'Detalji porudžbine',
    orderNumber: 'Broj porudžbine',
    orderDate: 'Datum',
    estimatedDelivery: 'Očekivana dostava',
    whatsNext: 'Šta sledi?',
    whatsNextText:
      'Dobićete e-mail sa potvrdom i detaljima porudžbine. Kada se pošalje, šaljemo i informacije za praćenje.',
    backToHome: 'Nazad na početnu',
  },
  about: {
    title: 'O NOOK-u',
    storySectionLabel: 'O tekstilu i domu',
    lead: 'Mali brend stolnog tekstila iz Beograda.',
    p1:
      'Naše komade pravimo u malim serijama, od prirodnih materijala, što nam omogućava da svakom detalju posvetimo pažnju. Nije nam važno samo kako komad izgleda, već i kako živi — nakon pranja, u svakodnevnoj upotrebi, u različitim domovima.',
    p2:
      'Dizajniramo tekstil koji ne preplavljuje prostor, već tiho postaje njegov deo. Komade kojima se rado vraćate. Svaka kolekcija je pokušaj da se uhvati osećaj trenutka — prvi topli dani, meka svetlost, mir doma.',
    p3: 'Verujemo da je dom mesto u kome svaki predmet ima značenje.',
    valuesTitle: 'Ono do čega nam je stalo',
    value1Title: 'Male serije',
    value1Text: 'Pažljivo izrađeno, u ograničenim količinama, u Beogradu.',
    value2Title: 'Prirodni materijali',
    value2Text: 'Lan i pamuk birani po tome kako žive nakon mnogo pranja.',
    value3Title: 'Tihi detalji',
    value3Text: 'Tekstili koji se smeštaju u dom, umesto da sa njim konkurišu.',
    contactTitle: 'Kontakt',
    contactLead:
      'Na svaku poruku odgovaramo lično. Za narudžbine po meri, pitanja o nekom komadu ili saradnje — pišite nam.',
    basedIn: 'Instagram',
    basedInValue: '@nook.belgrade',
  },
  courier: {
    title: 'Dostava i plaćanje',
    heroEyebrow: 'DOSTAVA · SRBIJA',
    optionsTitle: 'Načini dostave',
    detailsTitle: 'Uslovi i plaćanje',
    lead: 'Dostavljamo u celoj Srbiji.',
    optionBelgradeTitle: 'Kurirska dostava (Beograd)',
    optionBelgradePrice: '500 RSD',
    optionBelgradeDesc:
      'Kurir donosi porudžbinu do vaših vrata. Vreme dostave dogovaramo individualno i često je moguća istog dana.',
    optionBelgradePayment: 'Plaćanje karticom na sajtu ili gotovinom pouzećem.',
    optionPostTitle: 'Pošta Srbije (ostali gradovi)',
    optionPostPrice: '300 RSD',
    optionPostDesc: 'Dostava obično traje do 7 radnih dana, u celoj Srbiji.',
    optionPostPayment: 'Plaćanje karticom na sajtu.',
    optionPickupTitle: 'Preuzimanje — MARFA Flower Shop (Beograd)',
    optionPickupPrice: 'Besplatno',
    optionPickupDesc:
      'Kada porudžbina bude spremna, javljamo detalje i dogovaramo zgodno vreme za preuzimanje.',
    optionPickupPayment: 'Gotovinom ili karticom u studiju.',
    freeShippingTitle: 'Besplatna dostava preko 10 000 RSD',
    freeShippingText:
      'Sve porudžbine preko 10 000 RSD dostavljamo besplatno, bez obzira na izabrani način.',
    paymentsTitle: 'Načini plaćanja',
    paymentsItems: [
      'Karticom na sajtu (za sve vrste dostave)',
      'Gotovinom pouzećem (kurirska dostava u Beogradu)',
      'Gotovinom ili karticom pri preuzimanju (MARFA Flower Shop)',
    ],
    questionsTitle: 'Pitanja o dostavi?',
    questionsText:
      'Pišite nam — odgovaramo lično i sve dogovaramo zajedno sa vama.',
  },
  textileCare: {
    title: 'Kako brinuti o tekstilu',
    heroEyebrow: 'LAN I PAMUK · NEGA',
    stepsTitle: 'Blaga rutina',
    lead:
      'Lan i pamuk sa upotrebom postaju sve lepši. Nekoliko jednostavnih navika čuva vaš stolni tekstil godinama.',
    sections: {
      washing: {
        title: 'Pranje',
        tips: [
          'Perite na 30–40°C, na nežnom programu.',
          'Koristite blagi, tečni deterdžent — bez izbeljivača i omekšivača.',
          'Perite boje odvojeno, posebno prvih nekoliko puta.',
          'Zatvorite rajsferšluse; veze okrenite na naličje.',
          'Ne punite mašinu previše — lanu treba prostora.',
        ],
      },
      drying: {
        title: 'Sušenje',
        tips: [
          'Sušite na vazduhu, horizontalno ili na žici, zaštićeno od direktnog sunca.',
          'Dok je još vlažno, izravnajte rukom da smanjite bore.',
          'Izbegavajte sušilicu kad god je to moguće — skraćuje vek tkanine.',
          'Skinite dok je malo vlažno — lakše se pegla.',
        ],
      },
      ironing: {
        title: 'Peglanje',
        tips: [
          'Peglajte lan dok je još malo vlažan, sa naličja.',
          'Za lan koristite vruću peglu sa parom; za pamuk srednju temperaturu.',
          'Blage bore su deo karaktera tkanine — ne morate sve izravnati.',
          'Pustite komade da se potpuno ohlade pre savijanja.',
        ],
      },
      storage: {
        title: 'Čuvanje',
        tips: [
          'Čuvajte na hladnom, suvom mestu sa dobrom cirkulacijom vazduha.',
          'Savijajte labavo; izbegavajte plastične kese za dugotrajno čuvanje.',
          'Zaštićeno od direktnog sunca — boje tako duže traju.',
          'Komade koje retko koristite provetrite svakih nekoliko meseci.',
        ],
      },
    },
    notesTitle: 'Nekoliko iskrenih napomena',
    notesItems: [
      'Prirodni lan sa svakim pranjem postaje mekši — tako i treba.',
      'Malo skupljanje nakon prvog pranja normalno je za prirodna vlakna.',
      'Sitne neravnine u preplitaju i razlike u tonu su karakter prirodnog materijala, ne greška.',
    ],
  },
  returns: {
    heroEyebrow: 'POVRATI',
    title: 'Povraćaj i refundacija',
    lead:
      'Ukoliko iz bilo kog razloga niste zadovoljni porudžbinom, imate pravo da je vratite u roku od 14 dana od prijema.',
    howTitle: 'Kako zatražiti povraćaj',
    howText:
      'Kontaktirajte nas na {email} sa detaljima porudžbine. Provešćemo vas kroz ceo proces.',
    conditionsTitle: 'Uslovi povraćaja',
    conditionsItems: [
      'Artikli se vraćaju u originalnom stanju — neupotrebljeni, neoprani i u originalnom pakovanju.',
      'Osim u slučaju oštećenog ili pogrešno poslatog artikla, troškove povratne pošiljke snosi kupac.',
    ],
    refundTitle: 'Povraćaj novca',
    refundText:
      'Nakon što primimo i pregledamo vraćeni artikal, refundaciju obrađujemo u roku od 14 dana. Novac vraćamo istim načinom kojim je izvršeno plaćanje. Ako je porudžbina plaćena gotovinom, refundaciju dogovaramo sa vama individualno.',
    damagedTitle: 'Oštećeni ili pogrešni artikli',
    damagedText:
      'Ako primite oštećen ili pogrešan artikal, javite nam u roku od 48 sati od prijema kako bismo mogli da rešimo situaciju.',
  },
  terms: {
    title: 'Uslovi korišćenja',
    intro:
      'Ovi Uslovi korišćenja primenjuju se na sve porudžbine napravljene preko NOOK sajta. Slanjem porudžbine prihvatate uslove navedene u nastavku.',
    ordersTitle: 'Porudžbine',
    ordersText:
      'Sve porudžbine zavise od raspoloživosti i potvrde. Nakon slanja porudžbine dobićete potvrdu putem e-maila ili poruke. Zadržavamo pravo da odbijemo ili otkažemo porudžbinu u slučaju netačne cene, nedostupnosti ili drugih nepredviđenih okolnosti.',
    pricingTitle: 'Cene',
    pricingText:
      'Sve cene su izražene u srpskim dinarima (RSD). Troškovi dostave se obračunavaju odvojeno i jasno prikazuju pre završetka kupovine. Trudimo se da sve informacije na sajtu budu tačne, ali povremeno može doći do grešaka.',
    paymentTitle: 'Plaćanje',
    paymentIntro: 'Porudžbine se mogu platiti:',
    paymentItems: [
      'karticom na sajtu',
      'gotovinom pouzećem (dostupno za kurirsku dostavu u Beogradu)',
      'karticom ili gotovinom pri preuzimanju (kod partnerske lokacije)',
    ],
    paymentOutro:
      'Porudžbine se obrađuju nakon potvrđenog plaćanja, odnosno nakon potvrde porudžbine kod plaćanja gotovinom.',
    deliveryTitle: 'Dostava',
    deliveryText:
      'Dostava se vrši u Srbiji u skladu sa uslovima iz sekcije „Dostava i plaćanje“. Procenjeni rokovi dostave su informativni i mogu se razlikovati.',
    returnsTitle: 'Povraćaji',
    returnsText:
      'Povraćaji i refundacije se obrađuju u skladu sa našom politikom povraćaja i refundacije.',
    productTitle: 'Informacije o proizvodu',
    productText:
      'Trudimo se da boje i detalje proizvoda prikažemo što je moguće tačnije. Moguća su mala odstupanja zbog podešavanja ekrana ili prirode materijala.',
    liabilityTitle: 'Odgovornost',
    liabilityText:
      'NOOK ne odgovara za kašnjenja ili propuste nastale usled okolnosti van naše kontrole.',
    changesTitle: 'Izmene',
    changesText:
      'Zadržavamo pravo da u svakom trenutku ažuriramo ove Uslove korišćenja. Izmene će biti objavljene na ovoj stranici.',
    contactTitle: 'Kontakt',
    contactText: 'Za sva pitanja pišite nam na {email}.',
  },
  privacy: {
    title: 'Politika privatnosti',
    intro:
      'Poštujemo vašu privatnost i posvećeni smo zaštiti vaših ličnih podataka.',
    dataCollectTitle: 'Koje podatke prikupljamo',
    dataCollectIntro:
      'Kada naručite ili nas kontaktirate, možemo prikupiti:',
    dataCollectItems: [
      'ime i prezime',
      'broj telefona',
      'e-mail adresu',
      'adresu za dostavu',
      'podatke o plaćanju (obrađuju se bezbedno preko pružalaca platnih usluga)',
    ],
    dataUseTitle: 'Kako koristimo vaše podatke',
    dataUseIntro: 'Vaše podatke koristimo da:',
    dataUseItems: [
      'obradimo i isporučimo porudžbinu',
      'komuniciramo sa vama o porudžbini',
      'pružimo korisničku podršku',
      'ispunimo zakonske obaveze',
    ],
    dataUseOutro:
      'Uz vašu saglasnost, možemo vam povremeno slati obaveštenja o novim proizvodima, kolekcijama ili ponudama.',
    marketingTitle: 'Marketing i saglasnost',
    marketingText:
      'Marketinške poruke šaljemo samo uz vašu izričitu saglasnost. Saglasnost možete opozvati u svakom trenutku — kontaktiranjem nas ili preko opcije za odjavu (ako je dostupna). Možemo koristiti i alate poput analitike ili oglasnih servisa (npr. Meta Pixel) kako bismo razumeli kako se sajt koristi i unapredili komunikaciju. Ovi alati mogu koristiti kolačiće i slične tehnologije.',
    sharingTitle: 'Deljenje podataka',
    sharingIntro: 'Podatke delimo samo kada je to neophodno:',
    sharingItems: [
      'sa dostavnim službama radi isporuke porudžbine',
      'sa pružaocima platnih usluga radi obrade plaćanja',
      'sa pružaocima usluga analitike i oglašavanja (gde je primenljivo)',
      'sa nadležnim organima, kada to zakon zahteva',
    ],
    sharingOutro: 'Vaše lične podatke ne prodajemo.',
    storageTitle: 'Čuvanje podataka',
    storageText:
      'Vaše podatke čuvamo samo onoliko koliko je potrebno za realizaciju porudžbine i ispunjavanje zakonskih obaveza.',
    rightsTitle: 'Vaša prava',
    rightsIntro: 'Imate pravo da:',
    rightsItems: [
      'pristupite svojim ličnim podacima',
      'zatražite ispravku ili brisanje',
      'opozovete saglasnost',
    ],
    rightsOutro: 'Za ostvarivanje prava pišite nam na {email}.',
    cookiesTitle: 'Kolačići',
    cookiesText:
      'Koristimo kolačiće kako bismo unapredili iskustvo pregledanja, analizirali saobraćaj i podržali marketinške aktivnosti. Podešavanje kolačića možete menjati u svom pregledaču.',
    contactTitle: 'Kontakt',
    contactText:
      'Ako imate pitanja u vezi sa Politikom privatnosti, kontaktirajte nas na {email}.',
  },
  ourStory: {
    heroEyebrow: 'NA\u0160A PRI\u010cA',
    title: 'Stvari u va\u0161em domu su va\u017ene',
    lead: 'Brend stolnog tekstila iz Beograda, izgra\u0111en na tihom uverenju: predmeti oko vas oblikuju na\u010din na koji \u017eivite.',
    sectionLabel: 'Za\u0161to sto',
    preline: 'NOOK \xb7 BEOGRAD',
    p1: 'Najva\u017eniji trenuci se ne de\u0161avaju na neobi\u010dnim mestima. De\u0161avaju se za stolom \u2014 za praznikom, za sporim doru\u010dkom, u kasnom razgovoru sa nekim koga volite. Sto je mesto gde se \u017eivot okuplja.',
    p2: 'Zato pravimo to \u0161to pravimo. Ne da ukrasimo, ve\u0107 da tim trenucima damo teksturu koju zaslu\u017euju \u2014 ne\u0161to iskreno, ne\u0161to \u0161to sa svakom upotrebom postaje vi\u0161e va\u0161e.',
    quote: 'Stvari u va\u0161em domu su va\u017ene.',
    characterLabel: 'Tiho po dizajnu',
    characterP1: 'Dizajniramo protiv buke. Protiv brzih ciklusa i glasnog brendiranja. Protiv predmeta koji zahtevaju pa\u017enju umesto da je zaslu\u017ee.',
    characterP2: 'Svaki komad je napravljen da se smesti u dom, a ne da se takmi\u010di sa njim. Boje prate godi\u0161nja doba. Imena \u010duvaju trenutke \u2014 mahovina posle ki\u0161e, prva aprilska svetlost, cvet koji ste skoro propustili. Na\u0161e kolekcije poku\u0161avaju da uhvate ose\u0107aj, a ne da jure trend.',
    craftLabel: 'Kako pravimo',
    craft1Title: 'Petnaest po seriji',
    craft1Text: 'Svaka serija je ograni\u010dena na petnaest komada. Izra\u0111eno u beogradskom ateljeu, od srpskog lana i pamuka, od strane ljudi koji proveravaju svaki \u0161av.',
    craft2Title: 'Birano za deseto pranje',
    craft2Text: 'Biramo materijale po tome kako \u017eive nakon mnogo pranja \u2014 mek\u0161i, iskreniji, vi\u0161e va\u0161i. Prirodni lan i pamuk koji lepo stare.',
    craft3Title: 'Bez plastike, bez \u017eurbe',
    craft3Text: 'Pakovanje od kraft papira. Prirodni materijali. Male serije koje nam dozvoljavaju da brinemo o svakom detalju. Radije napravimo manje, ali kako treba.',
    customLabel: 'Komadi po meri',
    customText: 'Pravimo komade po porud\u017ebini \u2014 odre\u0111ena veli\u010dina, boja za va\u0161 sto, set za posebnu priliku. Pi\u0161ite nam i napravimo to zajedno.',
    contactLabel: 'Javite nam se',
    contactLead: 'Pitanja, narud\u017ebine po meri ili razgovor o lanu \u2014 na svaku poruku odgovaramo li\u010dno.',
  },
  footer: {
    tagline: 'Stolni tekstil u malim serijama, napravljen u Beogradu.',
    sinceLine: '© {year} NOOK · Stolni tekstil',
    quickLinks: 'POGLEDAJTE',
    linkCollection: 'Kolekcija',
    linkAbout: 'O nama',
    linkStory: 'Naša priča',
    linkCare: 'Nega tekstila',
    linkDelivery: 'Dostava i plaćanje',
    policies: 'INFORMACIJE',
    linkReturns: 'Povraćaj i refundacija',
    linkTerms: 'Uslovi korišćenja',
    linkPrivacy: 'Politika privatnosti',
    contact: 'KONTAKT',
    legalTitle: 'Pravni podaci',
    legalName: 'Anna Kovtun PR Beograd',
    legalMb: 'Matični broj: 67827481',
    legalPib: 'PIB: 114751854',
    rights: 'Sva prava zadržana.',
  },
}

const translations: Record<Language, TranslationTree> = { en, sr }

function resolveKey(tree: TranslationTree, key: string): TranslationValue | undefined {
  const parts = key.split('.')
  let current: TranslationValue = tree
  for (const part of parts) {
    if (current && typeof current === 'object' && !Array.isArray(current)) {
      current = (current as TranslationTree)[part]
    } else {
      return undefined
    }
  }
  return current
}

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [language, setLanguage] = useState<Language>(() => {
    const saved = typeof window !== 'undefined' ? localStorage.getItem('language') : null
    return saved === 'sr' || saved === 'en' ? (saved as Language) : 'en'
  })

  const handleSetLanguage = (lang: Language) => {
    setLanguage(lang)
    if (typeof window !== 'undefined') {
      localStorage.setItem('language', lang)
    }
  }

  const t = (key: string): string => {
    const value = resolveKey(translations[language], key)
    if (typeof value === 'string') return value
    const fallback = resolveKey(translations.en, key)
    return typeof fallback === 'string' ? fallback : key
  }

  const tList = (key: string): string[] => {
    const value = resolveKey(translations[language], key)
    if (Array.isArray(value)) return value
    const fallback = resolveKey(translations.en, key)
    return Array.isArray(fallback) ? fallback : []
  }

  return (
    <LanguageContext.Provider value={{ language, setLanguage: handleSetLanguage, t, tList }}>
      {children}
    </LanguageContext.Provider>
  )
}

export function useLanguage() {
  const context = useContext(LanguageContext)
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider')
  }
  return context
}
