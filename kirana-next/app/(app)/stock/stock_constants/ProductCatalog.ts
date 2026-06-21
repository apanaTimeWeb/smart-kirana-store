// ProductCatalog.ts
// Hardcoded master catalog of ~130 products across all 16 kirana categories.
// Each entry links to a categoryId from CategoryMaster.ts.
// Brand is empty string for loose/generic items.
// This is the "central catalog" in Phase 1 — no DB, all client-side.

export type CatalogProduct = {
  id: string;
  name: string;                   // Full display name
  categoryId: string;             // Must match CategoryMaster.id
  brand: string;                  // Brand name; "" for loose/generic items
  mrp: number | null;             // MRP as per pack (null for loose items)
  tags: string[];                 // Search keywords
};

export const PRODUCT_CATALOG: CatalogProduct[] = [

  // ── Atta & Flour ────────────────────────────────────────────────────────────
  { id: "cat_atta_aashirvaad_1kg",   name: "Aashirvaad Atta 1kg",       categoryId: "atta_flour", brand: "Aashirvaad", mrp: 55,   tags: ["atta","wheat","aashirvaad"] },
  { id: "cat_atta_aashirvaad_5kg",   name: "Aashirvaad Atta 5kg",       categoryId: "atta_flour", brand: "Aashirvaad", mrp: 260,  tags: ["atta","wheat","aashirvaad"] },
  { id: "cat_atta_aashirvaad_10kg",  name: "Aashirvaad Atta 10kg",      categoryId: "atta_flour", brand: "Aashirvaad", mrp: 500,  tags: ["atta","wheat","aashirvaad"] },
  { id: "cat_atta_annapurna_1kg",    name: "Annapurna Atta 1kg",        categoryId: "atta_flour", brand: "Annapurna",  mrp: 52,   tags: ["atta","annapurna"] },
  { id: "cat_atta_shaktibhog_5kg",   name: "Shakti Bhog Atta 5kg",      categoryId: "atta_flour", brand: "Shakti Bhog",mrp: 240,  tags: ["atta","shaktibhog"] },
  { id: "cat_atta_pillsbury_1kg",    name: "Pillsbury Atta 1kg",        categoryId: "atta_flour", brand: "Pillsbury",  mrp: 58,   tags: ["atta","pillsbury"] },
  { id: "cat_maida_loose",           name: "Maida (Khula)",             categoryId: "atta_flour", brand: "",           mrp: null, tags: ["maida","flour","loose"] },
  { id: "cat_besan_loose",           name: "Besan (Khula)",             categoryId: "atta_flour", brand: "",           mrp: null, tags: ["besan","chickpea","loose"] },
  { id: "cat_sooji_loose",           name: "Sooji / Rawa (Khula)",      categoryId: "atta_flour", brand: "",           mrp: null, tags: ["sooji","rawa","semolina","loose"] },
  { id: "cat_gehu_atta_loose",       name: "Gehu Atta (Khula)",         categoryId: "atta_flour", brand: "",           mrp: null, tags: ["atta","gehu","wheat","loose"] },

  // ── Dal & Pulses ────────────────────────────────────────────────────────────
  { id: "cat_dal_toor_loose",        name: "Toor Dal (Khula)",          categoryId: "dal_pulses", brand: "",           mrp: null, tags: ["toor","arhar","dal","loose"] },
  { id: "cat_dal_moong_loose",       name: "Moong Dal (Khula)",         categoryId: "dal_pulses", brand: "",           mrp: null, tags: ["moong","dal","loose"] },
  { id: "cat_dal_chana_loose",       name: "Chana Dal (Khula)",         categoryId: "dal_pulses", brand: "",           mrp: null, tags: ["chana","dal","loose"] },
  { id: "cat_dal_masoor_loose",      name: "Masoor Dal (Khula)",        categoryId: "dal_pulses", brand: "",           mrp: null, tags: ["masoor","dal","loose"] },
  { id: "cat_dal_urad_loose",        name: "Urad Dal (Khula)",          categoryId: "dal_pulses", brand: "",           mrp: null, tags: ["urad","dal","loose"] },
  { id: "cat_dal_rajma_loose",       name: "Rajma (Khula)",             categoryId: "dal_pulses", brand: "",           mrp: null, tags: ["rajma","kidney beans","loose"] },
  { id: "cat_dal_tata_1kg",          name: "Tata Sampann Toor Dal 1kg", categoryId: "dal_pulses", brand: "Tata",       mrp: 165,  tags: ["toor","tata","sampann","dal"] },
  { id: "cat_dal_tata_chana_1kg",    name: "Tata Sampann Chana Dal 1kg",categoryId: "dal_pulses", brand: "Tata",       mrp: 135,  tags: ["chana","tata","sampann","dal"] },

  // ── Rice & Grains ───────────────────────────────────────────────────────────
  { id: "cat_rice_basmati_loose",    name: "Basmati Rice (Khula)",      categoryId: "rice_grains", brand: "",          mrp: null, tags: ["basmati","rice","loose"] },
  { id: "cat_rice_sona_loose",       name: "Sona Masoori (Khula)",      categoryId: "rice_grains", brand: "",          mrp: null, tags: ["sona","masoori","rice","loose"] },
  { id: "cat_rice_indiagate_5kg",    name: "India Gate Basmati 5kg",    categoryId: "rice_grains", brand: "India Gate", mrp: 420, tags: ["basmati","indiagate","rice"] },
  { id: "cat_rice_indiagate_1kg",    name: "India Gate Basmati 1kg",    categoryId: "rice_grains", brand: "India Gate", mrp: 90,  tags: ["basmati","indiagate","rice"] },
  { id: "cat_poha_loose",            name: "Poha (Khula)",              categoryId: "rice_grains", brand: "",          mrp: null, tags: ["poha","flattened rice","loose"] },
  { id: "cat_daliya_loose",          name: "Daliya (Khula)",            categoryId: "rice_grains", brand: "",          mrp: null, tags: ["daliya","broken wheat","loose"] },

  // ── Sugar, Salt & Jaggery ───────────────────────────────────────────────────
  { id: "cat_cheeni_loose",          name: "Cheeni / Sugar (Khula)",    categoryId: "sugar_salt", brand: "",          mrp: null, tags: ["cheeni","sugar","loose"] },
  { id: "cat_salt_tata_1kg",         name: "Tata Salt 1kg",             categoryId: "sugar_salt", brand: "Tata",      mrp: 24,  tags: ["salt","namak","tata"] },
  { id: "cat_salt_captain_1kg",      name: "Captain Cook Salt 1kg",     categoryId: "sugar_salt", brand: "Captain Cook", mrp: 20, tags: ["salt","captain cook"] },
  { id: "cat_gur_loose",             name: "Gur / Jaggery (Khula)",     categoryId: "sugar_salt", brand: "",          mrp: null, tags: ["gur","jaggery","loose"] },
  { id: "cat_bura_sugar_loose",      name: "Bura Cheeni (Khula)",       categoryId: "sugar_salt", brand: "",          mrp: null, tags: ["bura","powdered sugar","loose"] },

  // ── Cooking Oil ─────────────────────────────────────────────────────────────
  { id: "cat_oil_fortune_1l",        name: "Fortune Soyabean Oil 1L",   categoryId: "cooking_oil", brand: "Fortune",  mrp: 135, tags: ["oil","soyabean","fortune"] },
  { id: "cat_oil_fortune_5l",        name: "Fortune Soyabean Oil 5L",   categoryId: "cooking_oil", brand: "Fortune",  mrp: 640, tags: ["oil","soyabean","fortune"] },
  { id: "cat_oil_sundrop_1l",        name: "Sundrop Sunflower Oil 1L",  categoryId: "cooking_oil", brand: "Sundrop",  mrp: 145, tags: ["oil","sunflower","sundrop"] },
  { id: "cat_oil_patanjali_1l",      name: "Patanjali Sarson Oil 1L",   categoryId: "cooking_oil", brand: "Patanjali",mrp: 125, tags: ["oil","mustard","sarson","patanjali"] },
  { id: "cat_oil_mustard_loose",     name: "Sarson Tel (Khula)",        categoryId: "cooking_oil", brand: "",         mrp: null, tags: ["sarson","mustard oil","loose"] },
  { id: "cat_oil_soyabean_loose",    name: "Soyabean Tel (Khula)",      categoryId: "cooking_oil", brand: "",         mrp: null, tags: ["soyabean","oil","loose"] },
  { id: "cat_oil_groundnut_loose",   name: "Moongfali Tel (Khula)",     categoryId: "cooking_oil", brand: "",         mrp: null, tags: ["groundnut","mungfali","oil","loose"] },

  // ── Ghee & Vanaspati ────────────────────────────────────────────────────────
  { id: "cat_ghee_amul_500g",        name: "Amul Ghee 500g",            categoryId: "ghee_vanaspati", brand: "Amul",    mrp: 295, tags: ["ghee","amul"] },
  { id: "cat_ghee_amul_1kg",         name: "Amul Ghee 1kg",             categoryId: "ghee_vanaspati", brand: "Amul",    mrp: 570, tags: ["ghee","amul"] },
  { id: "cat_ghee_patanjali_500g",   name: "Patanjali Ghee 500g",       categoryId: "ghee_vanaspati", brand: "Patanjali",mrp: 280, tags: ["ghee","patanjali"] },
  { id: "cat_dalda_vanaspati_1kg",   name: "Dalda Vanaspati 1kg",       categoryId: "ghee_vanaspati", brand: "Dalda",   mrp: 120, tags: ["dalda","vanaspati"] },

  // ── Masala & Spices ─────────────────────────────────────────────────────────
  { id: "cat_jeera_loose",           name: "Jeera (Khula)",             categoryId: "masala_spices", brand: "",        mrp: null, tags: ["jeera","cumin","loose"] },
  { id: "cat_haldi_loose",           name: "Haldi (Khula)",             categoryId: "masala_spices", brand: "",        mrp: null, tags: ["haldi","turmeric","loose"] },
  { id: "cat_lalmirch_loose",        name: "Lal Mirch (Khula)",         categoryId: "masala_spices", brand: "",        mrp: null, tags: ["mirch","chilli","red pepper","loose"] },
  { id: "cat_dhaniya_loose",         name: "Dhaniya Powder (Khula)",    categoryId: "masala_spices", brand: "",        mrp: null, tags: ["dhaniya","coriander","loose"] },
  { id: "cat_saunf_loose",           name: "Saunf (Khula)",             categoryId: "masala_spices", brand: "",        mrp: null, tags: ["saunf","fennel","loose"] },
  { id: "cat_ajwain_loose",          name: "Ajwain (Khula)",            categoryId: "masala_spices", brand: "",        mrp: null, tags: ["ajwain","carom","loose"] },
  { id: "cat_mdh_jeera_100g",        name: "MDH Jeera Powder 100g",     categoryId: "masala_spices", brand: "MDH",     mrp: 65,  tags: ["jeera","mdh","masala"] },
  { id: "cat_mdh_haldi_100g",        name: "MDH Haldi 100g",            categoryId: "masala_spices", brand: "MDH",     mrp: 50,  tags: ["haldi","turmeric","mdh"] },
  { id: "cat_mdh_chholey_50g",       name: "MDH Chhole Masala 50g",     categoryId: "masala_spices", brand: "MDH",     mrp: 40,  tags: ["chhole","masala","mdh"] },
  { id: "cat_everest_garam_50g",     name: "Everest Garam Masala 50g",  categoryId: "masala_spices", brand: "Everest", mrp: 55,  tags: ["garam masala","everest"] },
  { id: "cat_everest_pav_50g",       name: "Everest Pav Bhaji 50g",     categoryId: "masala_spices", brand: "Everest", mrp: 45,  tags: ["pav bhaji","masala","everest"] },

  // ── Biscuits & Snacks ───────────────────────────────────────────────────────
  { id: "cat_biscuit_parleg_100g",   name: "Parle-G Biscuit 100g",      categoryId: "biscuits_snacks", brand: "Parle",     mrp: 10, tags: ["parleg","biscuit","glucose"] },
  { id: "cat_biscuit_parleg_50g",    name: "Parle-G Biscuit 50g",       categoryId: "biscuits_snacks", brand: "Parle",     mrp: 5,  tags: ["parleg","biscuit","glucose"] },
  { id: "cat_biscuit_monaco_75g",    name: "Monaco Biscuit 75g",        categoryId: "biscuits_snacks", brand: "Parle",     mrp: 20, tags: ["monaco","biscuit","salty"] },
  { id: "cat_biscuit_marie_150g",    name: "Britannia Marie 150g",      categoryId: "biscuits_snacks", brand: "Britannia", mrp: 25, tags: ["marie","biscuit","britannia"] },
  { id: "cat_biscuit_goodday_75g",   name: "Good Day Butter 75g",       categoryId: "biscuits_snacks", brand: "Britannia", mrp: 20, tags: ["goodday","butter","biscuit","britannia"] },
  { id: "cat_biscuit_bourbon_100g",  name: "Bourbon Biscuit 100g",      categoryId: "biscuits_snacks", brand: "Britannia", mrp: 25, tags: ["bourbon","chocolate","biscuit"] },
  { id: "cat_biscuit_hide_seek_120g",name: "Hide & Seek 120g",          categoryId: "biscuits_snacks", brand: "Parle",     mrp: 35, tags: ["hide seek","chocolate","biscuit"] },
  { id: "cat_chips_lays_26g",        name: "Lays Classic 26g",          categoryId: "biscuits_snacks", brand: "PepsiCo",   mrp: 20, tags: ["lays","chips","snack"] },
  { id: "cat_chips_kurkure_90g",     name: "Kurkure Masala 90g",        categoryId: "biscuits_snacks", brand: "PepsiCo",   mrp: 20, tags: ["kurkure","masala","snack"] },
  { id: "cat_bhujia_haldiram_200g",  name: "Haldirams Bhujia 200g",     categoryId: "biscuits_snacks", brand: "Haldirams", mrp: 60, tags: ["bhujia","haldirams","namkeen"] },
  { id: "cat_bingomad_52g",          name: "Bingo Mad Angles 52g",      categoryId: "biscuits_snacks", brand: "Bingo",     mrp: 20, tags: ["bingo","mad angles","snack"] },

  // ── Noodles & Instant Food ──────────────────────────────────────────────────
  { id: "cat_maggi_70g",             name: "Maggi Noodles 70g",         categoryId: "noodles_instant", brand: "Nestle",   mrp: 14, tags: ["maggi","noodles","instant"] },
  { id: "cat_yippee_70g",            name: "Yippee Noodles 70g",        categoryId: "noodles_instant", brand: "ITC",      mrp: 14, tags: ["yippee","noodles","instant"] },
  { id: "cat_sunfeast_pasta_64g",    name: "Sunfeast Pasta 64g",        categoryId: "noodles_instant", brand: "ITC",      mrp: 25, tags: ["pasta","sunfeast","instant"] },
  { id: "cat_oats_saffola_1kg",      name: "Saffola Oats 1kg",          categoryId: "noodles_instant", brand: "Marico",   mrp: 160, tags: ["oats","saffola","breakfast"] },
  { id: "cat_knorr_soup_50g",        name: "Knorr Soup Tomato 50g",     categoryId: "noodles_instant", brand: "HUL",      mrp: 30, tags: ["soup","knorr","tomato","instant"] },

  // ── Beverages & Cold Drinks ─────────────────────────────────────────────────
  { id: "cat_cola_coke_600ml",       name: "Coca-Cola 600ml",           categoryId: "beverages", brand: "Coca-Cola", mrp: 40, tags: ["coke","cola","cold drink"] },
  { id: "cat_cola_thumpsup_750ml",   name: "Thums Up 750ml",            categoryId: "beverages", brand: "Coca-Cola", mrp: 45, tags: ["thums up","cola","cold drink"] },
  { id: "cat_cola_sprite_600ml",     name: "Sprite 500ml",              categoryId: "beverages", brand: "Coca-Cola", mrp: 35, tags: ["sprite","lime","cold drink"] },
  { id: "cat_juice_maaza_600ml",     name: "Maaza 600ml",               categoryId: "beverages", brand: "Coca-Cola", mrp: 30, tags: ["maaza","mango","juice"] },
  { id: "cat_frooti_200ml",          name: "Frooti 200ml",              categoryId: "beverages", brand: "Parle Agro",mrp: 20, tags: ["frooti","mango","tetra"] },
  { id: "cat_water_bisleri_1l",      name: "Bisleri 1L",                categoryId: "beverages", brand: "Bisleri",   mrp: 20, tags: ["water","bisleri","mineral"] },
  { id: "cat_water_kinley_1l",       name: "Kinley 1L",                 categoryId: "beverages", brand: "Kinley",    mrp: 20, tags: ["water","kinley","mineral"] },
  { id: "cat_redbull_250ml",         name: "Red Bull 250ml",            categoryId: "beverages", brand: "Red Bull",  mrp: 115, tags: ["red bull","energy drink"] },
  { id: "cat_pepsi_600ml",           name: "Pepsi 600ml",               categoryId: "beverages", brand: "PepsiCo",   mrp: 40, tags: ["pepsi","cola","cold drink"] },
  { id: "cat_limca_300ml",           name: "Limca 300ml",               categoryId: "beverages", brand: "Coca-Cola", mrp: 20, tags: ["limca","lime","cold drink"] },

  // ── Dairy & Frozen ──────────────────────────────────────────────────────────
  { id: "cat_milk_amul_500ml",       name: "Amul Doodh 500ml",          categoryId: "dairy_frozen", brand: "Amul",    mrp: 28, tags: ["milk","doodh","amul"] },
  { id: "cat_milk_motherdairy_500ml",name: "Mother Dairy Milk 500ml",   categoryId: "dairy_frozen", brand: "Mother Dairy",mrp: 27, tags: ["milk","mother dairy"] },
  { id: "cat_dahi_amul_400g",        name: "Amul Dahi 400g",            categoryId: "dairy_frozen", brand: "Amul",    mrp: 40, tags: ["dahi","curd","amul"] },
  { id: "cat_butter_amul_100g",      name: "Amul Butter 100g",          categoryId: "dairy_frozen", brand: "Amul",    mrp: 55, tags: ["butter","amul"] },
  { id: "cat_cheese_amul_200g",      name: "Amul Cheese Slices 200g",   categoryId: "dairy_frozen", brand: "Amul",    mrp: 95, tags: ["cheese","amul"] },
  { id: "cat_milk_loose",            name: "Taza Doodh (Khula)",        categoryId: "dairy_frozen", brand: "",        mrp: null, tags: ["milk","loose","fresh"] },

  // ── Personal Care ───────────────────────────────────────────────────────────
  { id: "cat_soap_lux_100g",         name: "Lux Soap 100g",             categoryId: "personal_care", brand: "HUL",      mrp: 40, tags: ["soap","lux","bath"] },
  { id: "cat_soap_dove_100g",        name: "Dove Soap 100g",            categoryId: "personal_care", brand: "HUL",      mrp: 55, tags: ["soap","dove","moisturizing"] },
  { id: "cat_soap_lifebuoy_100g",    name: "Lifebuoy Soap 100g",        categoryId: "personal_care", brand: "HUL",      mrp: 35, tags: ["soap","lifebuoy","health"] },
  { id: "cat_shampoo_hs_340ml",      name: "Head & Shoulders 340ml",    categoryId: "personal_care", brand: "P&G",      mrp: 290, tags: ["shampoo","head shoulders","dandruff"] },
  { id: "cat_shampoo_sunsilk_350ml", name: "Sunsilk Shampoo 350ml",     categoryId: "personal_care", brand: "HUL",      mrp: 180, tags: ["shampoo","sunsilk","hair"] },
  { id: "cat_tp_colgate_200g",       name: "Colgate MaxFresh 200g",     categoryId: "personal_care", brand: "Colgate",  mrp: 130, tags: ["toothpaste","colgate","maxfresh"] },
  { id: "cat_tp_closeup_150g",       name: "Close Up 150g",             categoryId: "personal_care", brand: "HUL",      mrp: 100, tags: ["toothpaste","closeup"] },
  { id: "cat_facewash_ponds_150ml",  name: "Ponds Face Wash 150ml",     categoryId: "personal_care", brand: "HUL",      mrp: 130, tags: ["facewash","ponds","skin"] },
  { id: "cat_blade_gillette_5s",     name: "Gillette Blade 5pcs",       categoryId: "personal_care", brand: "P&G",      mrp: 65, tags: ["blade","gillette","shaving"] },

  // ── Household & Cleaning ─────────────────────────────────────────────────────
  { id: "cat_det_surfexcel_1kg",     name: "Surf Excel 1kg",            categoryId: "household_cleaning", brand: "HUL",     mrp: 130, tags: ["surf","detergent","washing"] },
  { id: "cat_det_ariel_500g",        name: "Ariel Detergent 500g",      categoryId: "household_cleaning", brand: "P&G",     mrp: 100, tags: ["ariel","detergent","washing"] },
  { id: "cat_det_tide_1kg",          name: "Tide Plus 1kg",             categoryId: "household_cleaning", brand: "P&G",     mrp: 120, tags: ["tide","detergent","washing"] },
  { id: "cat_vim_bar_200g",          name: "Vim Bar 200g",              categoryId: "household_cleaning", brand: "HUL",     mrp: 30, tags: ["vim","dishwash","bar"] },
  { id: "cat_harpic_1l",             name: "Harpic Toilet Cleaner 1L",  categoryId: "household_cleaning", brand: "Reckitt", mrp: 120, tags: ["harpic","toilet cleaner","lizol"] },
  { id: "cat_lizol_500ml",           name: "Lizol Floor Cleaner 500ml", categoryId: "household_cleaning", brand: "Reckitt", mrp: 110, tags: ["lizol","floor cleaner"] },
  { id: "cat_odonil_50g",            name: "Odonil Air Freshener 50g",  categoryId: "household_cleaning", brand: "Dabur",   mrp: 50, tags: ["odonil","air freshener","bathroom"] },

  // ── Medicine & Health ────────────────────────────────────────────────────────
  { id: "cat_med_disprin_10s",       name: "Disprin Strip 10 tabs",     categoryId: "medicine_health", brand: "Reckitt", mrp: 10, tags: ["disprin","aspirin","painkiller"] },
  { id: "cat_med_crocin_10s",        name: "Crocin Strip 10 tabs",      categoryId: "medicine_health", brand: "GSK",     mrp: 30, tags: ["crocin","paracetamol","fever"] },
  { id: "cat_med_eno_5g",            name: "Eno Sachet 5g",             categoryId: "medicine_health", brand: "GSK",     mrp: 10, tags: ["eno","antacid","acidity"] },
  { id: "cat_med_ors_sachet",        name: "ORS Sachet",                categoryId: "medicine_health", brand: "Electral", mrp: 10, tags: ["ors","electral","hydration"] },
  { id: "cat_dettol_antiseptic_500ml",name:"Dettol Antiseptic 500ml",   categoryId: "medicine_health", brand: "Reckitt", mrp: 250, tags: ["dettol","antiseptic","wound"] },
  { id: "cat_bandaid_10s",           name: "Band-Aid Regular 10pcs",    categoryId: "medicine_health", brand: "J&J",     mrp: 50, tags: ["bandaid","wound","dressing"] },

  // ── Pooja & Stationery ───────────────────────────────────────────────────────
  { id: "cat_agarbatti_cycle_15s",   name: "Cycle Agarbatti 15 Sticks", categoryId: "pooja_stationery", brand: "Cycle",    mrp: 15, tags: ["agarbatti","incense","pooja"] },
  { id: "cat_agarbatti_uth_19s",     name: "Uth Agarbatti 19 Sticks",   categoryId: "pooja_stationery", brand: "Uth",      mrp: 10, tags: ["agarbatti","incense"] },
  { id: "cat_camphor_50g",           name: "Camphor / Kapoor 50g",      categoryId: "pooja_stationery", brand: "",         mrp: 40, tags: ["kapoor","camphor","pooja"] },
  { id: "cat_candle_small",          name: "Candle (White)",            categoryId: "pooja_stationery", brand: "",         mrp: 15, tags: ["candle","wax","diya"] },
  { id: "cat_pen_reynolds_blue",     name: "Reynolds Pen Blue",         categoryId: "pooja_stationery", brand: "Reynolds", mrp: 15, tags: ["pen","reynolds","blue","ballpoint"] },
  { id: "cat_pen_reynolds_black",    name: "Reynolds Pen Black",        categoryId: "pooja_stationery", brand: "Reynolds", mrp: 15, tags: ["pen","reynolds","black","ballpoint"] },
  { id: "cat_pen_cello_blue",        name: "Cello Pen Blue",            categoryId: "pooja_stationery", brand: "Cello",    mrp: 12, tags: ["pen","cello","blue"] },
  { id: "cat_notebook_classmate_a4", name: "Classmate Notebook A4",     categoryId: "pooja_stationery", brand: "Classmate", mrp: 50, tags: ["notebook","classmate","a4"] },
  { id: "cat_fevicol_50g",           name: "Fevicol 50g",               categoryId: "pooja_stationery", brand: "Pidilite",  mrp: 20, tags: ["fevicol","glue","adhesive"] },
  { id: "cat_cellotape",             name: "Cellotape Roll",            categoryId: "pooja_stationery", brand: "",          mrp: 30, tags: ["tape","cello tape","sticky"] },
  { id: "cat_battery_aa_2pk",        name: "AA Battery 2pc",            categoryId: "pooja_stationery", brand: "Duracell",  mrp: 85, tags: ["battery","aa","duracell"] },

  // ── Tea & Coffee ─────────────────────────────────────────────────────────────
  { id: "cat_tea_brooke_250g",       name: "Brooke Bond Red Label 250g",categoryId: "tea_coffee", brand: "HUL",     mrp: 120, tags: ["tea","red label","brooke bond"] },
  { id: "cat_tea_brooke_500g",       name: "Brooke Bond Red Label 500g",categoryId: "tea_coffee", brand: "HUL",     mrp: 230, tags: ["tea","red label","brooke bond"] },
  { id: "cat_tea_tatacha_250g",      name: "Tata Chai 250g",            categoryId: "tea_coffee", brand: "Tata",    mrp: 100, tags: ["tea","tata","chai"] },
  { id: "cat_tea_taaza_250g",        name: "Taaza Tea 250g",            categoryId: "tea_coffee", brand: "HUL",     mrp: 100, tags: ["tea","taaza"] },
  { id: "cat_tea_loose",             name: "Patti Chai (Khula)",        categoryId: "tea_coffee", brand: "",        mrp: null, tags: ["chai","tea","loose"] },
  { id: "cat_nescafe_200g",          name: "Nescafe Coffee 200g",       categoryId: "tea_coffee", brand: "Nestle",  mrp: 380, tags: ["coffee","nescafe","instant"] },
  { id: "cat_bru_200g",              name: "Bru Gold Coffee 200g",      categoryId: "tea_coffee", brand: "HUL",     mrp: 340, tags: ["coffee","bru","gold"] },
];

// ── Lookup helpers ────────────────────────────────────────────────────────────

/** Products filtered by category */
export const getProductsByCategory = (categoryId: string): CatalogProduct[] =>
  PRODUCT_CATALOG.filter((p) => p.categoryId === categoryId);

/** Full-text search across name, brand, tags */
export const searchCatalog = (query: string, categoryId?: string): CatalogProduct[] => {
  const q = query.toLowerCase().trim();
  let pool = categoryId ? getProductsByCategory(categoryId) : PRODUCT_CATALOG;
  if (!q) return pool;
  return pool.filter(
    (p) =>
      p.name.toLowerCase().includes(q) ||
      p.brand.toLowerCase().includes(q) ||
      p.tags.some((t) => t.includes(q))
  );
};
