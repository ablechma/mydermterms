import { useState, useEffect } from "react";

// Set to true to show clinical reference images once they are added
var SHOW_IMAGES = false;

const CONDITIONS = [
  {
    id: "seborrheic-keratosis", conditionName: "Seborrheic Keratosis", commonName: "Seborrheic Keratosis",
    description: "Seborrheic keratoses are very common, benign (non-cancerous) skin growths that appear as waxy, stuck-on looking patches or bumps. They range in color from light tan to dark brown or black and often have a rough, warty texture. They typically appear after age 30 and increase in number with age.",
    symptoms: ["Round or oval, waxy, stuck-on appearing growths","Light tan, brown, or black coloration","Rough, scaly, or slightly elevated texture","Typically painless, though may itch occasionally","Variable size from very small to over an inch across","Occur most often on the trunk, head, and neck"],
    careInstructions: ["No treatment is usually required as these are benign growths.","Avoid picking or scratching, which can lead to irritation or infection.","See a dermatologist if a growth changes rapidly, bleeds, or looks unusual.","Removal options include cryotherapy, curettage, or electrosurgery if desired for cosmetic reasons.","Monitor for any new or changing lesions and report them to your provider."],
    affectedAreas: ["Trunk","Face","Neck","Shoulders","Scalp"], prevalence: "Extremely common; affects most adults over age 50",
  },
  {
    id: "actinic-keratosis", conditionName: "Actinic Keratosis", commonName: "Actinic Keratosis (Solar Keratosis)",
    description: "Actinic keratoses are rough, scaly patches on the skin caused by years of cumulative sun exposure. They are considered precancerous because a small percentage can progress to squamous cell carcinoma if left untreated. Early detection and treatment are important for prevention.",
    symptoms: ["Rough, dry, or sandpaper-like scaly patches on skin","Flat to slightly raised pink, red, or brown lesions","Typically found on sun-exposed areas of skin","May itch, burn, or feel tender to the touch","Patches may come and go, sometimes recurring in the same spot","Surrounding skin often shows signs of sun damage"],
    careInstructions: ["See a dermatologist promptly for evaluation and possible treatment.","Treatment options include cryotherapy, topical medications (5-fluorouracil, imiquimod), and photodynamic therapy.","Apply broad-spectrum SPF 30+ sunscreen daily, reapplying every two hours when outdoors.","Wear protective clothing, wide-brimmed hats, and seek shade during peak sun hours.","Schedule regular skin exams with your dermatologist for ongoing monitoring."],
    affectedAreas: ["Face","Scalp","Ears","Forearms","Hands","Neck"], prevalence: "Very common; affects over 58 million Americans",
  },
  {
    id: "lichenoid-keratosis", conditionName: "Lichenoid Keratosis", commonName: "Lichenoid Keratosis (Benign Lichenoid Keratosis)",
    description: "A lichenoid keratosis is a benign inflammatory skin lesion that typically develops when the immune system attacks a pre-existing solar lentigo or seborrheic keratosis. It appears as a solitary, pink to violaceous or brown flat patch or thin plaque, often on sun-exposed skin. It is harmless but may be biopsied to rule out other conditions.",
    symptoms: ["Solitary pink, red-brown, or violaceous flat patch or thin plaque","Typically 3-15 mm in diameter","May appear scaly or slightly rough on the surface","Usually asymptomatic, though occasionally mildly itchy","Occurs on sun-exposed areas, most commonly the trunk and arms","Often develops at the site of a pre-existing sun spot"],
    careInstructions: ["No treatment is required since lichenoid keratoses are benign.","A biopsy may be performed to confirm the diagnosis and rule out other conditions.","The lesion often resolves on its own over weeks to months.","Apply daily broad-spectrum SPF 30+ sunscreen to prevent new sun-related lesions.","See a dermatologist if the lesion changes, grows, or becomes symptomatic."],
    affectedAreas: ["Trunk","Arms","Forearms","Chest","Upper back"], prevalence: "Common; frequently encountered in adults with sun-damaged skin",
  },
  {
    id: "cherry-angioma", conditionName: "Capillary (Cherry) Angioma", commonName: "Cherry Angioma",
    description: "Cherry angiomas are small, bright red or purple dome-shaped bumps made up of clusters of tiny blood vessels (capillaries). They are the most common type of angioma and are completely benign. They typically begin appearing in the 30s and increase in number with age.",
    symptoms: ["Small, bright red to dark purple dome-shaped papules","Typically 1-5 mm in diameter, though can grow larger","Smooth, round surface that may become raised over time","May bleed if scratched, bumped, or irritated","Usually painless and asymptomatic","Increase in number with age"],
    careInstructions: ["No treatment is needed as cherry angiomas are harmless.","Avoid picking or scratching to prevent bleeding.","If a lesion bleeds frequently or is bothersome, consult your dermatologist about removal.","Removal methods include electrocautery, laser treatment, or shave excision.","See a dermatologist if a growth does not look like a typical cherry angioma or changes suddenly."],
    affectedAreas: ["Trunk","Arms","Legs","Shoulders","Chest"], prevalence: "Very common; found in most adults over age 30",
  },
  {
    id: "lentigo", conditionName: "Lentigo (Lentigines)", commonName: "Liver Spots / Sun Spots / Age Spots",
    description: "Lentigines are flat, well-defined brown spots on the skin that result from increased melanocyte activity, most commonly due to chronic sun exposure (solar lentigines). They are benign and are sometimes called age spots or liver spots.",
    symptoms: ["Flat, well-defined brown, tan, or dark spots","Uniform color that is darker than surrounding skin","Range from a few millimeters to several centimeters","Occur on sun-exposed areas of skin","Do not fade with sun avoidance, unlike freckles","Usually have regular, well-defined borders"],
    careInstructions: ["No treatment is required since lentigines are benign.","Monitor spots for changes in size, shape, color, or borders.","See a dermatologist if any spot develops irregular borders, multiple colors, or changes rapidly.","Use daily broad-spectrum SPF 30+ sunscreen to prevent new spots.","Cosmetic options include cryotherapy, laser therapy, or topical retinoids if desired.","Have a dermatologist evaluate any new dark spots to rule out melanoma."],
    affectedAreas: ["Face","Hands","Forearms","Shoulders","Upper back"], prevalence: "Very common; affects more than 90% of Caucasians over age 60",
  },
  {
    id: "dermatofibroma", conditionName: "Dermatofibroma", commonName: "Dermatofibroma (Fibrous Histiocytoma)",
    description: "Dermatofibromas are common, benign firm nodules that occur in the skin, most often on the legs. They are thought to develop as a reaction to minor trauma such as insect bites or small injuries. They are harmless and typically do not require treatment.",
    symptoms: ["Firm, round, slightly raised nodule in the skin","Usually brown, pink, tan, or reddish-brown in color","Typically 5-10 mm in diameter","Dimples inward when pinched from the sides (dimple sign)","May be mildly tender or itchy","Usually develops slowly and remains stable over time"],
    careInstructions: ["No treatment is usually necessary since dermatofibromas are benign.","Avoid trauma to the area to minimize irritation.","See a dermatologist if the nodule grows rapidly, changes color, or becomes painful.","Surgical excision can be performed if the lesion is bothersome.","A biopsy may be recommended if the clinical appearance is atypical."],
    affectedAreas: ["Legs (most common)","Arms","Trunk"], prevalence: "Common; more frequently seen in women than men",
  },
  {
    id: "warts", conditionName: "Warts (Verruca Vulgaris)", commonName: "Common Warts",
    description: "Common warts are benign skin growths caused by human papillomavirus (HPV) infection. They appear as rough, raised bumps with a characteristic rough surface and may have small dark dots (thrombosed capillaries). They are contagious through direct contact.",
    symptoms: ["Rough, raised, rounded bumps with an irregular surface","Flesh-colored, white, pink, or tan appearance","Small black dots within the wart (thrombosed capillaries)","May occur singly or in clusters (mosaic warts)","Typically painless, though plantar warts can cause discomfort","May spread to other areas through scratching or shaving"],
    careInstructions: ["Over-the-counter salicylic acid treatments can be effective with consistent daily use.","Avoid picking, biting, or scratching warts, which can spread the virus.","Keep warts covered with a bandage to reduce spread to others.","Wash hands thoroughly after touching a wart.","See a dermatologist if warts are persistent, painful, spreading, or on the face.","Professional treatments include cryotherapy, laser therapy, and immunotherapy."],
    affectedAreas: ["Fingers","Hands","Feet","Knees","Elbows","Face"], prevalence: "Very common; affects approximately 10% of the population",
  },
  {
    id: "melanocytic-nevus", conditionName: "Melanocytic Nevus (Mole)", commonName: "Mole",
    description: "Melanocytic nevi (moles) are benign clusters of melanocytes (pigment-producing cells) that appear as small, colored spots on the skin. Most adults have between 10 and 40 moles. While the vast majority are harmless, monitoring for changes is important since melanoma can develop from or mimic a mole.",
    symptoms: ["Small, round or oval spots on the skin","Uniform color \u2014 usually brown, tan, or skin-colored","Smooth, well-defined borders","Flat or slightly raised surface","Typically less than 6 mm in diameter","May slowly change in appearance over decades"],
    careInstructions: ["Perform monthly self-skin checks using the ABCDEs: Asymmetry, Border irregularity, Color variation, Diameter >6mm, Evolving.","Protect moles from sun damage with sunscreen and protective clothing.","See a dermatologist promptly if a mole changes size, shape, color, or starts itching or bleeding.","Schedule annual skin exams with a dermatologist.","Do not attempt to remove moles at home.","Photograph moles periodically to track changes over time."],
    affectedAreas: ["Anywhere on the body","Face","Trunk","Arms","Legs"], prevalence: "Universal; most adults have 10\u201340 moles",
  },
  {
    id: "atypical-nevus", conditionName: "Atypical/Dysplastic Nevus", commonName: "Atypical/Dysplastic Mole",
    description: "Atypical nevi (dysplastic nevi or Clark's nevi) are moles that have irregular features under the microscope and clinically, but are not cancerous. They tend to be larger than common moles, with irregular borders and uneven color. Having multiple atypical nevi is a risk factor for melanoma, so regular monitoring is important.",
    symptoms: ["Larger than common moles, typically greater than 6 mm","Irregular or poorly defined borders","Uneven color with mixtures of tan, brown, and pink","Flat or slightly raised, often with a flat component surrounding a raised center","May occur anywhere but common on sun-exposed areas and trunk","Often multiple atypical nevi are present"],
    careInstructions: ["Schedule regular full-body skin exams with a dermatologist for monitoring.","Perform monthly self-skin checks using the ABCDE criteria.","Photograph atypical moles to track any changes over time.","Protect skin with SPF 30+ sunscreen and sun-protective clothing.","A biopsy may be recommended if a mole shows concerning changes.","Discuss your personal melanoma risk factors with your dermatologist."],
    affectedAreas: ["Trunk","Back","Arms","Legs","Sun-exposed areas"], prevalence: "Present in approximately 2\u201310% of the general population",
  },
  {
    id: "periorificial-dermatitis", conditionName: "Periorificial Dermatitis", commonName: "Periorificial (Perioral) Dermatitis",
    description: "Periorificial dermatitis is an inflammatory skin condition that causes clusters of small, red, bumpy papules and pustules around the mouth, nose, and sometimes eyes. It is often triggered by topical corticosteroid use, heavy face creams, or fluorinated toothpaste.",
    symptoms: ["Small red papules and pustules around the mouth, nose, or eyes","Characteristic sparing of the skin immediately around the lip border","Mild burning, stinging, or itching sensation","Dry, flaky skin in the affected areas","May worsen with topical steroid use","Can recur after treatment if triggers are not avoided"],
    careInstructions: ["Discontinue all topical corticosteroids (may cause initial flare before improvement).","Use only gentle, fragrance-free cleansers and moisturizers.","See a dermatologist for prescription treatment (oral antibiotics or topical metronidazole).","Switch to a non-fluorinated toothpaste.","Avoid heavy face creams, makeup, and fragranced skin products.","Be patient \u2014 improvement may take several weeks of consistent treatment."],
    affectedAreas: ["Around the mouth","Around the nose","Around the eyes","Chin"], prevalence: "Relatively common; predominantly affects women ages 20\u201345",
  },
  {
    id: "sebaceous-hyperplasia", conditionName: "Sebaceous Hyperplasia", commonName: "Sebaceous Hyperplasia",
    description: "Sebaceous hyperplasia is a common, benign condition in which enlarged sebaceous (oil) glands form small, yellowish, soft bumps on the skin, most often on the face. They typically have a central dimple or umbilication and are often mistaken for basal cell carcinoma. They are completely harmless but can be treated for cosmetic reasons.",
    symptoms: ["Small (1-5 mm), yellowish or skin-colored soft papules","Central dimple or umbilication is a characteristic feature","Typically appear on the forehead, cheeks, and nose","May occur singly or in groups","Painless and non-tender","Increase in number with age"],
    careInstructions: ["No treatment is required since sebaceous hyperplasia is benign.","See a dermatologist if lesions are cosmetically bothersome \u2014 treatment options include electrocautery, laser, cryotherapy, or topical retinoids.","A dermatologist can distinguish these from basal cell carcinoma, which may look similar.","Avoid squeezing or picking at the bumps.","Daily retinoid use may help reduce the appearance of existing lesions."],
    affectedAreas: ["Forehead","Cheeks","Nose","Chin","Face"], prevalence: "Very common; affects approximately 25% of adults, especially after age 40",
  },
  {
    id: "epidermal-inclusion-cyst", conditionName: "Epidermal Inclusion Cyst", commonName: "Epidermoid Cyst / Sebaceous Cyst",
    description: "Epidermal inclusion cysts (often called epidermoid cysts or incorrectly \"sebaceous cysts\") are very common, benign, slow-growing nodules beneath the skin surface. They form when surface skin cells become trapped below the surface and produce keratin, creating a cyst wall and central contents. They may become inflamed or infected, causing pain and swelling.",
    symptoms: ["Firm, round, mobile nodule under the skin","Skin-colored to slightly yellowish","Often has a visible central punctum (small dark pore)","Typically 1-5 cm in diameter, can grow larger","Painless unless inflamed or infected","May express thick, cheese-like, foul-smelling keratin material if ruptured"],
    careInstructions: ["No treatment is needed for asymptomatic cysts.","Do NOT squeeze or attempt to pop the cyst \u2014 this can cause infection and scarring.","Apply warm compresses if the cyst becomes inflamed.","See a dermatologist if the cyst becomes painful, red, swollen, or rapidly enlarging.","Complete surgical excision (including the cyst wall) is the only definitive treatment to prevent recurrence.","If infected, antibiotics or incision and drainage may be needed before definitive excision."],
    affectedAreas: ["Face","Neck","Trunk","Behind ears","Back","Scalp"], prevalence: "Very common; one of the most frequently encountered skin cysts",
  },
  {
    id: "pilar-cyst", conditionName: "Pilar Cyst", commonName: "Pilar Cyst (Trichilemmal Cyst)",
    description: "Pilar cysts (trichilemmal cysts) are common, benign, keratin-filled cysts that arise from the outer root sheath of hair follicles. They are the second most common type of skin cyst after epidermal inclusion cysts and occur predominantly on the scalp. They tend to run in families and may be multiple.",
    symptoms: ["Firm, smooth, round, mobile nodule under the skin","Most commonly found on the scalp","Skin-colored, typically without a central punctum","Usually 1-4 cm in diameter","Painless unless inflamed or traumatized","Often multiple, and may run in families"],
    careInstructions: ["No treatment is required for asymptomatic pilar cysts.","Avoid picking, squeezing, or traumatizing the cyst.","See a dermatologist if the cyst becomes painful, inflamed, or is cosmetically bothersome.","Surgical excision is the standard treatment and is often straightforward on the scalp.","The cyst wall must be completely removed to prevent recurrence.","Inform your dermatologist if you have a family history of pilar cysts."],
    affectedAreas: ["Scalp (90% of cases)","Neck","Face","Trunk"], prevalence: "Common; occurs in 5\u201310% of the population, more often in women",
  },
  {
    id: "molluscum-contagiosum", conditionName: "Molluscum Contagiosum", commonName: "Molluscum Contagiosum",
    description: "Molluscum contagiosum is a common viral skin infection caused by a poxvirus that produces small, firm, dome-shaped papules with a characteristic central dimple (umbilication). It is spread by direct skin-to-skin contact or through contaminated objects. It is most common in children but also occurs in adults.",
    symptoms: ["Small (2-5 mm), firm, dome-shaped, flesh-colored papules","Characteristic central dimple or umbilication","Painless, though may become itchy or inflamed","May occur singly or in groups/clusters","Spreads easily by scratching or touching lesions","Surrounding skin may become red or eczematous (molluscum dermatitis)"],
    careInstructions: ["Molluscum is self-limiting and often resolves on its own within 6\u201312 months.","Avoid scratching, picking, or shaving over lesions to prevent spread.","Do not share towels, clothing, or personal items with others.","See a dermatologist for treatment options if lesions are widespread, bothersome, or persistent.","Treatment options include cryotherapy, curettage, cantharidin, or topical agents.","Keep affected areas covered with clothing or bandages to reduce transmission."],
    affectedAreas: ["Face","Trunk","Arms","Legs","Axillae","Genital area (adults)"], prevalence: "Very common; affects approximately 5\u20138% of children worldwide",
  },
  {
    id: "basal-cell-carcinoma", conditionName: "Basal Cell Carcinoma", commonName: "Basal Cell Carcinoma (BCC)",
    description: "Basal cell carcinoma is the most common type of skin cancer, arising from basal cells in the epidermis. It is strongly associated with cumulative and intermittent intense sun exposure. While BCCs rarely metastasize, they can cause significant local tissue destruction if untreated.",
    symptoms: ["Pearly or waxy bump, often with visible blood vessels","Flat, flesh-colored or brown scar-like lesion","Bleeding or oozing sore that heals and recurs","Pink, raised growth with a rolled, raised border","Slowly enlarging lesion that may crust or bleed centrally","Most commonly appears on sun-exposed areas"],
    careInstructions: ["See a dermatologist immediately for any suspicious new or changing skin lesion.","Treatment options include surgical excision, Mohs surgery, and electrodessication and curettage.","Apply daily broad-spectrum SPF 30+ sunscreen and wear sun-protective clothing.","Attend regular follow-up skin exams (having one BCC increases future risk).","Avoid tanning beds and minimize unprotected sun exposure.","Perform regular self-skin examinations to catch recurrences early."],
    affectedAreas: ["Face (especially nose)","Ears","Neck","Scalp","Shoulders","Back"], prevalence: "Most common skin cancer; over 3 million cases annually in the US",
  },
  {
    id: "squamous-cell-carcinoma", conditionName: "Squamous Cell Carcinoma", commonName: "Squamous Cell Carcinoma (SCC)",
    description: "Squamous cell carcinoma is the second most common form of skin cancer, arising from squamous cells in the outer layers of the skin. It is primarily caused by cumulative UV radiation exposure. While most SCCs are treatable when caught early, some can metastasize if left untreated.",
    symptoms: ["Firm, red, scaly nodule or flat sore with a crusty surface","New sore or raised area on existing scar, ulcer, or chronic wound","Rough, thickened, or wart-like patch on the skin","Open sore that bleeds, crusts, and does not heal","Tender or painful lesion that persists","May develop rapidly over weeks to months"],
    careInstructions: ["See a dermatologist urgently for any non-healing sore or rapidly growing nodule.","Treatment typically involves surgical excision or Mohs surgery for high-risk locations.","Apply broad-spectrum SPF 30+ sunscreen daily and reapply every two hours outdoors.","Schedule regular skin cancer screenings with your dermatologist.","Protect skin from UV exposure with clothing, hats, and shade.","Report any new or changing lesions to your dermatologist promptly."],
    affectedAreas: ["Face","Ears","Lips","Scalp","Hands","Arms","Legs"], prevalence: "Second most common skin cancer; over 1 million cases annually in the US",
  },
  {
    id: "melanoma", conditionName: "Melanoma", commonName: "Melanoma",
    description: "Melanoma is the most serious form of skin cancer, arising from melanocytes, the pigment-producing cells of the skin. While less common than BCC and SCC, melanoma is far more likely to metastasize. Early detection is critical and dramatically improves outcomes.",
    symptoms: ["Asymmetry \u2014 one half of the mole does not match the other","Border irregularity \u2014 edges are ragged, notched, or blurred","Color variation \u2014 multiple shades of brown, black, red, white, or blue","Diameter \u2014 larger than 6mm (size of a pencil eraser)","Evolving \u2014 mole that changes in size, shape, or color","New mole that looks different from your other moles (ugly duckling sign)"],
    careInstructions: ["See a dermatologist IMMEDIATELY if you notice ABCDE warning signs.","Do not delay \u2014 early-stage melanoma has an excellent prognosis.","Perform monthly self-skin checks and have a partner check hard-to-see areas.","Schedule annual full-body skin exams with a dermatologist.","Protect skin with SPF 30+ sunscreen, protective clothing, and sun avoidance.","Know your risk factors: fair skin, many moles, family history, history of sunburns."],
    affectedAreas: ["Anywhere on the body","Back (common in men)","Legs (common in women)","Face","Trunk"], prevalence: "Approximately 1 in 38 people will be diagnosed in their lifetime",
  },
  {
    id: "mohs-surgery", conditionName: "Mohs Surgery", commonName: "Mohs Surgery",
    description: "Mohs micrographic surgery is a precise surgical technique used to treat skin cancer. The surgeon removes thin layers of cancer-containing skin one at a time, examining each layer under a microscope until only cancer-free tissue remains. This technique has the highest cure rate while sparing the maximum amount of healthy tissue.",
    symptoms: ["Indicated for basal cell carcinoma and squamous cell carcinoma","Especially valuable for cancers on the face, ears, nose, and lips","Used for recurrent or aggressive skin cancers","Recommended when cancer borders are poorly defined","Important for cancers in cosmetically or functionally sensitive areas","May be indicated for large or high-risk melanoma in situ"],
    careInstructions: ["Follow all post-operative wound care instructions from your surgeon.","Keep the surgical site clean and change dressings as directed.","Avoid strenuous activity for the time period recommended by your surgeon.","Take prescribed pain medications and antibiotics as directed.","Attend all follow-up appointments for wound checks and suture removal.","Schedule regular skin cancer screenings as recurrence and new cancers are possible."],
    affectedAreas: ["Face","Nose","Ears","Lips","Eyelids","Hands"], prevalence: "Over 800,000 Mohs procedures performed annually in the US",
  },
  {
    id: "porokeratosis", conditionName: "Porokeratosis", commonName: "Porokeratosis",
    description: "Porokeratosis is a group of keratinization disorders characterized by well-demarcated patches or plaques with a distinctive raised, ridge-like border (cornoid lamella). Several variants exist, including disseminated superficial actinic porokeratosis (DSAP), which is the most common form and is associated with sun exposure. While generally benign, porokeratosis carries a small risk of malignant transformation.",
    symptoms: ["Well-demarcated, round to oval patches or thin plaques","Distinctive raised, ridge-like border (cornoid lamella)","Central area may be slightly atrophic or depressed","Typically brown, red-brown, or skin-colored","Usually asymptomatic, though may itch mildly","DSAP variant: many small lesions on sun-exposed extremities"],
    careInstructions: ["See a dermatologist for diagnosis and monitoring, as there is a small risk of malignant transformation.","Protect skin with daily broad-spectrum SPF 30+ sunscreen, especially for DSAP.","Treatment options include cryotherapy, topical 5-fluorouracil, imiquimod, or laser therapy.","Schedule regular follow-up exams to monitor for any changes.","Report any lesion that becomes thickened, ulcerated, or rapidly changing.","Avoid excessive sun exposure, which can worsen DSAP."],
    affectedAreas: ["Arms","Legs","Trunk","Face","Sun-exposed areas"], prevalence: "Relatively uncommon; DSAP is the most frequently seen variant",
  },
  {
    id: "eczema", conditionName: "Eczema", commonName: "Atopic Dermatitis",
    description: "Atopic dermatitis is a chronic inflammatory skin condition that causes dry, itchy, and inflamed patches of skin. It is one of the most common skin disorders, often beginning in childhood and persisting into adulthood. Flare-ups can be triggered by environmental factors, stress, or allergens.",
    symptoms: ["Intense itching, especially at night","Dry, cracked, or scaly skin patches","Red to brownish-gray discoloration","Small raised bumps that may leak fluid when scratched","Thickened or leathery skin from chronic scratching","Swollen or sensitive skin in affected areas"],
    careInstructions: ["Apply a fragrance-free moisturizer within 3 minutes of bathing.","Use lukewarm water for showers \u2014 avoid hot water.","Wear soft, breathable fabrics like cotton and avoid wool or synthetics.","Apply prescribed topical corticosteroids during flare-ups as directed.","Identify and avoid personal triggers such as certain soaps, detergents, or foods.","Keep fingernails short to minimize skin damage from scratching."],
    affectedAreas: ["Inner elbows","Behind knees","Hands","Face","Neck"], prevalence: "Affects approximately 15\u201320% of children and 1\u20133% of adults",
  },
  {
    id: "psoriasis", conditionName: "Psoriasis", commonName: "Plaque Psoriasis",
    description: "Plaque psoriasis is an autoimmune condition that accelerates the skin cell lifecycle, causing cells to build up rapidly on the surface. This results in thick, silvery scales and dry, red patches that can be itchy and sometimes painful.",
    symptoms: ["Raised, inflamed patches covered with silvery-white scales","Dry, cracked skin that may bleed during flare-ups","Itching, burning, or soreness around plaques","Thickened, pitted, or ridged fingernails","Stiff or swollen joints (psoriatic arthritis)","Well-defined patch borders with surrounding redness"],
    careInstructions: ["Keep skin consistently moisturized with thick, emollient-based creams.","Use medicated shampoos containing coal tar or salicylic acid for scalp.","Get controlled, brief sun exposure \u2014 UV light can slow skin cell turnover.","Avoid skin injuries which can trigger new plaques (Koebner phenomenon).","Follow prescribed treatment plans (topical steroids, biologics, or systemic therapies).","Manage stress through regular exercise, sleep hygiene, or mindfulness."],
    affectedAreas: ["Scalp","Elbows","Knees","Lower back","Nails"], prevalence: "Affects approximately 2\u20133% of the global population",
  },
  {
    id: "seborrheic-dermatitis", conditionName: "Seborrheic Dermatitis", commonName: "Seborrheic Dermatitis (Dandruff)",
    description: "Seborrheic dermatitis is a common, chronic inflammatory skin condition that causes flaky, scaly patches and redness, primarily in areas rich in oil glands. In its mildest form on the scalp, it is known as dandruff. It is associated with Malassezia yeast overgrowth.",
    symptoms: ["Flaky, white or yellowish scales on the scalp (dandruff)","Red, greasy skin covered with flaky scales","Itching that may worsen during flare-ups","Scaly patches along the hairline, eyebrows, and nasolabial folds","Crusty or flaky skin behind the ears","May flare during cold, dry weather or periods of stress"],
    careInstructions: ["Use medicated shampoos with ketoconazole, selenium sulfide, zinc pyrithione, or coal tar.","Alternate between different active ingredients to prevent tolerance.","Apply shampoo to affected areas, leave on for 5 minutes before rinsing.","Use a gentle moisturizer on affected facial and body skin.","See a dermatologist if OTC treatments are not effective.","Manage stress and get adequate sleep, as flare-ups often correlate with stress."],
    affectedAreas: ["Scalp","Eyebrows","Nasolabial folds","Behind ears","Chest","Upper back"], prevalence: "Affects 3\u20135% of the population (dandruff affects up to 50%)",
  },
  {
    id: "acne", conditionName: "Acne", commonName: "Acne Vulgaris",
    description: "Acne vulgaris is the most common skin condition, caused by clogged hair follicles from excess oil, dead skin cells, and bacterial overgrowth. It manifests as comedones, papules, pustules, and in severe cases, nodules and cysts.",
    symptoms: ["Open comedones (blackheads) and closed comedones (whiteheads)","Inflammatory red papules and pus-filled pustules","Deep, painful nodules or cysts in severe cases","Oily skin, especially in the T-zone of the face","Post-inflammatory hyperpigmentation after lesions heal","Potential scarring from deep or repeatedly inflamed lesions"],
    careInstructions: ["Wash affected areas gently twice daily with a mild, non-comedogenic cleanser.","Use OTC treatments with benzoyl peroxide, salicylic acid, or adapalene (Differin).","Avoid picking, squeezing, or popping acne \u2014 this worsens inflammation and causes scarring.","Use oil-free, non-comedogenic moisturizers and sunscreen.","See a dermatologist for moderate to severe acne (retinoids, antibiotics, or isotretinoin).","Be patient \u2014 most acne therapies take 6-8 weeks to show noticeable improvement."],
    affectedAreas: ["Face","Forehead","Chest","Upper back","Shoulders"], prevalence: "Affects approximately 85% of people between ages 12 and 24",
  },
  {
    id: "rosacea", conditionName: "Rosacea", commonName: "Rosacea",
    description: "Rosacea is a chronic inflammatory skin condition that primarily affects the central face, causing persistent redness, visible blood vessels, and sometimes acne-like bumps. It tends to flare and remit, and can worsen over time without treatment. Triggers include sun exposure, heat, spicy foods, alcohol, and stress.",
    symptoms: ["Persistent facial redness, especially on cheeks, nose, chin, and forehead","Visible small blood vessels (telangiectasia) on the face","Acne-like bumps and pustules without blackheads","Burning, stinging, or tight sensation on the face","Thickened skin on the nose (rhinophyma) in advanced cases","Eye involvement (ocular rosacea) with dryness, irritation, and redness"],
    careInstructions: ["See a dermatologist for proper diagnosis and a personalized treatment plan.","Use gentle, fragrance-free cleansers and moisturizers designed for sensitive skin.","Apply broad-spectrum SPF 30+ mineral sunscreen daily (zinc oxide or titanium dioxide preferred).","Identify and avoid personal triggers (keep a flare diary).","Prescription treatments may include topical metronidazole, azelaic acid, ivermectin, or oral antibiotics.","Avoid topical steroids on the face, which can worsen rosacea."],
    affectedAreas: ["Cheeks","Nose","Chin","Forehead","Eyes"], prevalence: "Affects approximately 5% of the global population; more common in fair-skinned individuals",
  },
  {
    id: "hidradenitis-suppurativa", conditionName: "Hidradenitis Suppurativa", commonName: "Hidradenitis Suppurativa",
    description: "A chronic inflammatory skin condition characterized by recurrent painful nodules, abscesses, and sinus tracts in intertriginous areas. The disease involves hair follicles and apocrine sweat glands, leading to scarring and significant morbidity. It typically worsens with heat, sweating, and friction.",
    symptoms: ["Painful nodules and boils","Draining abscesses with purulent discharge","Itching and burning sensations","Sinus tract formation and scarring","Recurrent flare-ups triggered by friction or sweating","Lymphadenopathy in affected regions"],
    careInstructions: ["Keep affected areas clean and dry, avoiding friction with loose clothing.","Maintain regular hygiene with antibacterial washes and avoid harsh soaps.","Apply warm compresses during flare-ups to reduce inflammation.","Avoid shaving; consider depilation or electrolysis in affected areas.","Manage stress and hormonal triggers; consider dietary modifications.","Follow prescribed antibiotic or biologic therapy as directed by dermatologist."],
    affectedAreas: ["Axillae (armpits)","Inguinal region (groin)","Perianal and perineal areas","Inframammary folds","Nape of neck"], prevalence: "Affects approximately 1\u20134% of the population worldwide",
  },
  {
    id: "vitiligo", conditionName: "Vitiligo", commonName: "Vitiligo",
    description: "An acquired depigmentation disorder resulting from loss of melanocytes, causing distinct white patches on the skin. The condition can be localized or generalized and often has a significant psychological impact. Vitiligo may be triggered by autoimmune mechanisms, genetic factors, or trauma.",
    symptoms: ["Well-demarcated white patches on skin","Premature whitening of hair in affected areas","Loss of color in mucous membranes and around eyes","Photosensitivity and increased sunburn risk","Progressive expansion of depigmented patches","Cosmetic concern and psychological distress"],
    careInstructions: ["Apply broad-spectrum sunscreen (SPF 50+) to prevent sunburn on affected areas.","Use cosmetic cover-up products or self-tanning agents to blend patches.","Avoid trauma and skin irritation that may trigger Koebner phenomenon.","Consider topical corticosteroids or calcineurin inhibitors as prescribed.","Explore phototherapy options including NB-UVB or PUVA treatments.","Manage stress and seek psychological support if needed."],
    affectedAreas: ["Face","Hands","Feet","Genitals","Mucous membranes"], prevalence: "Occurs in approximately 0.5\u20132% of the global population",
  },
  {
    id: "melasma", conditionName: "Melasma", commonName: "Melasma (Chloasma)",
    description: "A common hypermelanosis disorder presenting as symmetric brown to gray-brown patches primarily on the face. The condition is more prevalent in individuals with darker skin types and is often triggered by UV exposure, hormonal factors, or genetic predisposition.",
    symptoms: ["Symmetric brownish or grayish patches","Primarily affects cheeks, forehead, and upper lip","Hyperpigmentation that darkens with sun exposure","Sharp demarcation from surrounding skin","No associated pruritus or burning","Worsening during summer months or with heat exposure"],
    careInstructions: ["Apply broad-spectrum sunscreen daily (SPF 50+) as primary prevention.","Avoid prolonged sun exposure and use protective clothing or hats.","Consider discontinuing hormonal contraceptives if feasible.","Use depigmenting agents such as hydroquinone, tretinoin, or combination formulations.","Explore professional treatments including chemical peels or laser therapy.","Maintain consistent skincare routine and avoid irritants."],
    affectedAreas: ["Cheeks","Forehead","Upper lip","Nose bridge","Temporal regions"], prevalence: "Affects 8\u201340% of the population, particularly in women of Hispanic, Asian, African, and Middle Eastern descent",
  },
  {
    id: "granuloma-annulare", conditionName: "Granuloma Annulare", commonName: "Granuloma Annulare",
    description: "A benign inflammatory condition characterized by ring-shaped papules formed by palisading granulomas. The localized form is most common, though disseminated and subcutaneous variants exist. The etiology remains unclear, though associations with diabetes and trauma have been reported.",
    symptoms: ["Flesh-colored or erythematous ring-shaped papules","Grouped lesions forming circular patterns","Typically asymptomatic; may have mild pruritus","Slow progression over months to years","No systemic involvement in localized form","Sudden onset often followed by gradual enlargement"],
    careInstructions: ["Monitor lesions regularly as many resolve spontaneously over time.","Apply topical corticosteroids to reduce inflammation if symptomatic.","Avoid unnecessary trauma to lesions.","Consider intralesional corticosteroid injections for persistent cases.","Use protective measures if lesions are in areas prone to friction.","Discuss treatment options with dermatologist if lesions expand."],
    affectedAreas: ["Dorsal hands and fingers","Feet and toes","Elbows","Knees","Extensor surfaces"], prevalence: "Occurs in approximately 0.1\u20130.4% of the population, with peak incidence between ages 20\u201340",
  },
  {
    id: "contact-dermatitis", conditionName: "Contact Dermatitis", commonName: "Contact Dermatitis",
    description: "An inflammatory skin reaction resulting from direct contact with allergens or irritants. The condition is divided into allergic contact dermatitis (type IV hypersensitivity) and irritant contact dermatitis (from chemical exposure). Symptoms typically appear within minutes to days of exposure.",
    symptoms: ["Erythema and inflammation at contact site","Intense pruritus and burning sensation","Vesicles, blisters, and weeping in acute phase","Edema and swelling in affected areas","Scaling and dryness as lesions resolve","Recurrence upon re-exposure to triggering agent"],
    careInstructions: ["Identify and avoid the offending allergen or irritant.","Cleanse affected area gently with mild soap and cool water immediately after exposure.","Apply topical corticosteroids to reduce inflammation and itching.","Use emollients regularly to repair skin barrier and prevent irritation.","Wear protective gloves and clothing when handling known irritants.","Consider patch testing with dermatologist to identify specific allergens."],
    affectedAreas: ["Hands and fingers","Face","Neck","Wrists and forearms","Eyelids"], prevalence: "Affects about 15\u201320% of all occupational diseases and approximately 5\u20137% of the population annually",
  },
  {
    id: "lichen-planus", conditionName: "Lichen Planus", commonName: "Lichen Planus",
    description: "A chronic inflammatory condition of the skin and mucous membranes characterized by distinctive violaceous papules with a reticular pattern. Lichen planus involves a T-cell mediated immune response and can persist for years despite treatment. The condition has cutaneous, oral, and other mucosal variants.",
    symptoms: ["Violaceous, flat-topped papules with shiny surface","Wickham striae (white reticular lines) on lesion surface","Intense pruritus, especially in evening","White, lacy patches in oral lichen planus","Painful erosions in mucosal variants","Photodistributed lesions on exposed areas"],
    careInstructions: ["Apply potent topical corticosteroids to affected areas twice daily.","Use oral topical corticosteroids or rinses for oral involvement.","Avoid spicy foods, alcohol, and tobacco if oral mucosa affected.","Minimize sun exposure on affected skin areas.","Consider systemic corticosteroids or retinoids for severe cases.","Maintain good oral hygiene and regular dental follow-up for oral lichen planus."],
    affectedAreas: ["Wrists and forearms","Shins","Oral mucosa","Genitals","Lower back","Nails"], prevalence: "Occurs in approximately 1\u20132% of the population, with peak incidence in adults aged 40\u201360",
  },
  {
    id: "acne-necrotica-miliaris", conditionName: "Acne Necrotica Miliaris", commonName: "Acne Necrotica Miliaris",
    description: "A rare, chronic folliculitis characterized by small follicular papules and pustules with central necrosis on the scalp, forehead, and hairline. The condition is often mistaken for acne and may cause scarring alopecia with permanent hair loss.",
    symptoms: ["Small firm papules and pustules with central necrosis","Concentrated on scalp margin and hairline","Mild to moderate pruritus and tenderness","Purulent drainage from lesions","Progressive scarring alopecia","Lesions that heal with permanent scarring"],
    careInstructions: ["Rule out underlying systemic infections.","Maintain gentle scalp hygiene with non-irritating shampoos.","Apply topical corticosteroids or antibiotics as prescribed.","Avoid unnecessary manipulation or picking of lesions.","Consider systemic antibiotics if infection is confirmed.","Monitor for progressive scarring alopecia."],
    affectedAreas: ["Scalp margin and hairline","Forehead","Anterior scalp","Temporal regions"], prevalence: "A rare condition with uncertain prevalence, more commonly seen in adults",
  },
  {
    id: "discoid-lupus", conditionName: "Discoid Lupus Erythematosus", commonName: "Discoid Lupus",
    description: "A chronic form of cutaneous lupus erythematosus characterized by well-demarcated erythematous patches and plaques with follicular plugging. The condition primarily affects sun-exposed areas and can result in permanent scarring and alopecia. Systemic lupus involvement occurs in 5\u201310% of patients.",
    symptoms: ["Erythematous patches with well-defined borders","Follicular plugging and central atrophy","Hyperkeratotic scaling","Photosensitivity exacerbating lesions","Scarring alopecia if scalp is involved","Depigmentation and hyperpigmentation at lesion edges"],
    careInstructions: ["Apply broad-spectrum sunscreen (SPF 50+) daily and avoid sun exposure.","Use topical corticosteroids or calcineurin inhibitors on lesions.","Consider antimalarial agents such as hydroxychloroquine.","Monitor for systemic lupus erythematosus with periodic laboratory testing.","Use photoprotective clothing and hats when outdoors.","Avoid irritants and trauma to sensitive areas."],
    affectedAreas: ["Scalp","Face (cheeks and nose)","Ears","Lips","Neck"], prevalence: "Occurs in approximately 0.02\u20130.1% of the population",
  },
  {
    id: "tinea-versicolor", conditionName: "Tinea Versicolor", commonName: "Pityriasis Versicolor",
    description: "A common fungal infection caused by Malassezia species, characterized by hypo- or hyperpigmented patches on the skin. The condition results from an imbalance between normal skin flora and environmental factors. Tinea versicolor is not contagious but may persist or recur without appropriate treatment.",
    symptoms: ["Hypo- or hyperpigmented macules and patches","Fine powdery scale on lesion surface","Lack of pruritus or pain","Clustering of lesions on trunk and proximal extremities","Color variation from white to brown or reddish","Worsening in warm, humid climates"],
    careInstructions: ["Apply topical antifungal agents such as selenium sulfide or azoles daily for 2 weeks.","Use ketoconazole shampoo or zinc pyrithione for scalp and body.","Maintain good hygiene and keep skin dry.","Consider oral antifungal therapy for extensive or recurrent cases.","Apply topical antifungals periodically in warm months for prevention.","Wear breathable, loose clothing to reduce moisture and heat."],
    affectedAreas: ["Upper back and chest","Trunk","Neck","Shoulders","Proximal arms"], prevalence: "Affects approximately 3\u20135% of the population globally, higher in tropical climates",
  },
  {
    id: "tinea-corporis", conditionName: "Tinea Corporis", commonName: "Ringworm",
    description: "A dermatophyte infection of the trunk and extremities caused by fungi such as Trichophyton rubrum. The condition typically presents as annular erythematous patches with central clearing and raised borders. Tinea corporis is contagious through direct contact, shared personal items, or contaminated surfaces.",
    symptoms: ["Annular erythematous patches with raised borders","Central clearing creating ring-like appearance","Fine scaling on lesion surface","Mild to moderate pruritus","Progression if untreated","Potential for secondary bacterial infection"],
    careInstructions: ["Apply topical antifungal creams (azoles or allylamines) twice daily for 4\u20136 weeks.","Keep affected area clean and dry.","Avoid sharing personal items, towels, or clothing.","Wash hands thoroughly after touching affected areas.","Consider oral antifungal therapy if extensive or treatment failure.","Wash clothing regularly in hot water."],
    affectedAreas: ["Trunk","Extremities","Flexural areas","Any non-scalp non-nail body surface"], prevalence: "One of the most common fungal infections, occurring in 10\u201315% of the population at some point in life",
  },
  {
    id: "onychomycosis", conditionName: "Onychomycosis", commonName: "Nail Fungus",
    description: "A fungal infection of the toenails or fingernails most commonly caused by dermatophytes, candida, or non-dermatophyte molds. The infection causes discoloration, thickening, and deterioration of the nail structure. Onychomycosis is more prevalent in toenails and may be accompanied by pain or functional impairment.",
    symptoms: ["Nail discoloration (yellow, brown, or white)","Nail thickening and brittleness","Crumbling and deterioration of nail structure","Subungual debris accumulation","Onycholysis (separation from nail bed)","Potential secondary bacterial infection"],
    careInstructions: ["Apply topical antifungal solutions (amorolfine or ciclopirox) to affected nails regularly.","File nails short and keep them dry.","Wear breathable footwear and moisture-wicking socks.","Consider oral antifungal therapy for severe or extensive infection.","Trim nails straight across and avoid tight footwear.","Attend periodic follow-up appointments to monitor treatment response."],
    affectedAreas: ["Toenails (great toe most common)","Fingernails","Nail bed","Nail matrix"], prevalence: "Affects approximately 10\u201315% of the global population, higher in older adults and diabetics",
  },
  {
    id: "alopecia-areata", conditionName: "Alopecia Areata", commonName: "Alopecia Areata",
    description: "An autoimmune condition where the immune system attacks hair follicles, resulting in patchy hair loss. The condition can affect any hair-bearing area of the body and may progress to complete hair loss in severe cases. Hair regrowth is possible, though unpredictable.",
    symptoms: ["Patchy hair loss on scalp","Round or oval bald patches","Hair loss that develops over days or weeks","Itching or tingling before hair loss","Nail pitting or ridge formation","Psychological distress or anxiety"],
    careInstructions: ["Avoid harsh hair treatments and tight hairstyles.","Use gentle hair care products and soft brushes.","Manage stress through relaxation techniques.","Consider topical corticosteroids or minoxidil.","Consult dermatologist for immunosuppressive treatments.","Wear wigs or hats if desired for confidence."],
    affectedAreas: ["Scalp","Beard","Eyebrows","Eyelashes","Body hair"], prevalence: "Affects approximately 1\u20132% of the population worldwide, with onset typically before age 40",
  },
  {
    id: "urticaria", conditionName: "Urticaria (Hives)", commonName: "Hives",
    description: "A skin condition characterized by raised, red welts (hives) that appear suddenly due to allergic reactions or other triggers. The welts are often itchy and may appear and disappear within minutes to hours. Episodes can be acute (lasting less than 6 weeks) or chronic (lasting longer than 6 weeks).",
    symptoms: ["Raised red or pink welts","Intense itching","Burning or stinging sensation","Welts that change shape and location","Swelling of lips or throat in severe cases","Symptoms appearing and disappearing rapidly"],
    careInstructions: ["Avoid known triggers and allergens.","Use antihistamines as directed by provider.","Apply cool compresses to affected areas.","Wear loose, breathable clothing.","Avoid hot water and irritating soaps.","Keep skin moisturized with gentle products."],
    affectedAreas: ["Face","Neck","Trunk","Extremities","Lips","Throat"], prevalence: "Affects approximately 15\u201320% of people at least once in their lifetime",
  },
  {
    id: "hyperhidrosis", conditionName: "Hyperhidrosis", commonName: "Excessive Sweating",
    description: "A condition characterized by abnormally excessive sweating beyond what is needed for thermoregulation. The condition can be primary (idiopathic) or secondary to underlying medical conditions. Excessive sweating can significantly impact quality of life and social interactions.",
    symptoms: ["Excessive sweating during rest","Wet hands, feet, or underarms","Visible sweat stains on clothing","Frequent need to change clothes or wipe skin","Maceration or softening of skin","Increased body odor or fungal infections"],
    careInstructions: ["Use antiperspirants with aluminum chloride.","Apply antiperspirant before bedtime for better absorption.","Wear moisture-wicking breathable fabrics.","Maintain good hygiene and dry skin thoroughly.","Consider botulinum toxin injections if severe.","Consult dermatologist about oral medications or iontophoresis."],
    affectedAreas: ["Palms","Soles of feet","Underarms","Forehead","Face","Trunk"], prevalence: "Affects approximately 1\u20133% of the population",
  },
  {
    id: "herpes-zoster", conditionName: "Herpes Zoster (Shingles)", commonName: "Shingles",
    description: "A viral infection caused by reactivation of the varicella-zoster virus (the same virus that causes chickenpox). The infection typically appears as a painful rash in a dermatomal distribution on one side of the body. Early antiviral treatment is crucial to reduce complications and duration of illness.",
    symptoms: ["Burning or sharp pain along nerve distribution","Tingling or numbness before rash appears","Red rash that progresses to fluid-filled blisters","Fever and chills","Fatigue and malaise","Sensitivity to touch in affected area"],
    careInstructions: ["Start antiviral medication (acyclovir, valacyclovir) as soon as possible.","Keep blisters clean and dry.","Apply cool compresses for pain relief.","Use topical pain relievers like lidocaine patches.","Avoid touching or scratching blisters to prevent secondary infection.","Watch for complications like postherpetic neuralgia."],
    affectedAreas: ["Thoracic dermatomal distribution","Trigeminal nerve distribution (face)","Lumbar or sacral areas","Neck and shoulder region"], prevalence: "Affects approximately 1 million people annually in the US, with incidence increasing after age 50",
  },
  {
    id: "pilomatrixoma", conditionName: "Pilomatrixoma", commonName: "Hair Matrix Tumor",
    description: "A benign tumor originating from hair matrix cells, typically presenting as a firm, skin-colored nodule. The tumor is usually asymptomatic and grows slowly, though it may become inflamed or infected. Surgical excision is the standard treatment and typically results in complete resolution.",
    symptoms: ["Firm nodule or bump under the skin","Skin-colored to bluish appearance","Slow growth over months to years","Possible inflammation or tenderness","Hard consistency on palpation","No itching or pain unless infected"],
    careInstructions: ["Avoid picking at or irritating the lesion.","Keep area clean and dry.","Monitor for signs of infection.","Seek surgical removal for cosmetic concerns.","Prevent trauma to the area.","Follow post-operative care after surgical excision."],
    affectedAreas: ["Face","Neck","Scalp","Upper extremities"], prevalence: "Accounts for 0.1\u20133% of all skin tumors; most common in children and young adults",
  },
  {
    id: "milium-cyst", conditionName: "Milium Cyst", commonName: "Milium",
    description: "Milium cysts are small, white or yellowish cysts filled with keratin that form in hair follicles or at the site of skin trauma. These benign lesions are extremely common and usually appear on the face, particularly around the eyes. Milia can be primary or secondary to other skin conditions and are generally harmless.",
    symptoms: ["Tiny white or yellowish bump","Hard, firm texture","No itching or pain","Usually asymptomatic","Painless unless traumatized","Multiple lesions may develop"],
    careInstructions: ["Avoid squeezing or attempting to extract.","Use gentle facial cleansing routine.","Avoid heavy face creams that may obstruct pores.","Apply retinoids to promote cell turnover.","Professional extraction by dermatologist if desired.","Protect skin from sun exposure."],
    affectedAreas: ["Around eyes","Cheeks","Nose","Forehead","Upper eyelids"], prevalence: "Extremely common; occurs in approximately 40% of neonates and frequently in adults of all ages",
  },
  {
    id: "scc-in-situ", conditionName: "Squamous Cell Carcinoma In Situ", commonName: "Bowen\u0027s Disease",
    description: "Squamous cell carcinoma in situ (SCC in situ), also known as Bowen\u0027s disease, is a pre-malignant skin lesion with potential to progress to invasive squamous cell carcinoma. It presents as a scaly, erythematous patch that typically develops on sun-exposed areas. Early detection and treatment are important to prevent progression.",
    symptoms: ["Well-demarcated scaly patch or plaque","Erythematous or brown coloration","Hyperkeratosis with scaling","Slowly enlarging lesion","May have crusting or bleeding","Itching or burning sensation"],
    careInstructions: ["Avoid sun exposure and use broad-spectrum sunscreen.","Perform regular skin self-examinations.","Follow up with dermatologist after treatment.","Consider photodynamic therapy or topical treatments.","Monitor for recurrence or progression.","Schedule regular dermatology follow-ups."],
    affectedAreas: ["Face","Ears","Dorsal hands","Forearms","Lower legs"], prevalence: "Accounts for 10\u201315% of all skin cancers, with incidence increasing with age and sun exposure",
  },
  {
    id: "electrodesiccation-curettage", conditionName: "Electrodesiccation and Curettage", commonName: "ED&C Procedure",
    description: "Electrodesiccation and curettage (ED&C) is a minor surgical procedure used to treat benign and pre-malignant skin lesions. The procedure involves scraping the lesion with a curette followed by electrical cauterization to destroy remaining tissue and achieve hemostasis.",
    symptoms: ["Used for actinic keratosis removal","Treats small basal cell carcinoma","Removes seborrheic keratosis","Addresses warts and skin tags","Treats small superficial skin cancers","Effective for sebaceous hyperplasia"],
    careInstructions: ["Keep wound clean and dry for 24 hours.","Apply antibiotic ointment twice daily.","Cover with bandage for first few days.","Avoid water and excessive moisture on wound.","Do not pick at scab or allow it to get wet.","Avoid sun exposure to prevent hyperpigmentation during healing."],
    affectedAreas: ["Face","Trunk","Extremities","Any area suitable for minor surgery"], prevalence: "One of the most common dermatologic procedures, performed thousands of times annually",
  },
  {
    id: "standard-excision", conditionName: "Standard Excision", commonName: "Surgical Excision",
    description: "Standard excision is a minor surgical procedure in which a skin lesion is completely removed by cutting out the lesion and surrounding tissue margin. The wound is then closed with sutures to ensure proper healing and minimize scarring.",
    symptoms: ["Removal of moles and nevi","Treatment of skin cancer with required margins","Removal of cysts and lipomas","Excision of suspicious lesions requiring pathology","Removal of benign skin growths","Treatment of melanoma or other malignancies"],
    careInstructions: ["Keep sutures clean and dry.","Avoid strenuous activity and heavy lifting for 1\u20132 weeks.","Do not get sutures wet for first 24 hours.","Take antibiotics as prescribed.","Return for suture removal at scheduled time (typically 7\u201314 days).","Protect scar from sun exposure with sunscreen."],
    affectedAreas: ["Any skin location","Face","Trunk","Extremities","Scalp"], prevalence: "A fundamental dermatologic procedure performed thousands of times daily worldwide",
  },
  {
    id: "shave-biopsy", conditionName: "Shave Biopsy", commonName: "Shave Biopsy",
    description: "A shave biopsy is a diagnostic procedure where a superficial portion of a skin lesion is removed using a scalpel held parallel to the skin surface. The specimen is then submitted for histopathologic examination to establish a diagnosis.",
    symptoms: ["Used to diagnose suspicious pigmented lesions","Evaluates atypical moles or melanoma concerns","Assesses scaling lesions and keratosis","Diagnoses inflammatory skin conditions","Evaluates nodules and growths","Confirms or rules out malignancy"],
    careInstructions: ["Maintain wound cleanliness with gentle washing.","Apply antibiotic ointment for 5\u20137 days.","Use bandage if area is prone to trauma.","Avoid strenuous activity for 1 week.","Do not submerge wound in water for 24 hours.","Monitor for signs of infection and follow up with results."],
    affectedAreas: ["Face","Scalp","Trunk","Extremities","Any accessible skin area"], prevalence: "One of the most frequently performed diagnostic procedures in dermatology",
  },
  {
    id: "angiokeratoma", conditionName: "Angiokeratoma", commonName: "Angiokeratoma",
    description: "Angiokeratomas are small, dark red to purple papules caused by dilated superficial blood vessels with an overlying hyperkeratotic (thickened) epidermis. They can appear as solitary lesions or in clusters and are most commonly found on the lower extremities, scrotum, or vulva. They are benign but may be confused with melanoma due to their dark coloration.",
    symptoms: ["Small dark red, purple, or black papules","Rough or warty surface texture","May bleed if traumatized","Usually 1-5 mm in diameter","Can appear solitary or in clusters","Painless unless irritated or injured"],
    careInstructions: ["No treatment is usually required as angiokeratomas are benign.","Avoid picking or scratching to prevent bleeding.","See a dermatologist if a lesion changes rapidly or looks unusual to rule out melanoma.","Treatment options include electrocautery, laser therapy, or cryotherapy if desired.","Monitor for any new or changing lesions.","Protect lesions from trauma in areas prone to friction."],
    affectedAreas: ["Lower extremities","Scrotum or vulva","Trunk","Fingers","Toes"], prevalence: "Relatively common; solitary angiokeratomas are frequently seen, with Fordyce type affecting up to 14% of older males",
  },
  {
    id: "incision-drainage", conditionName: "Incision and Drainage", commonName: "I&D Procedure",
    description: "Incision and drainage (I&D) is a minor surgical procedure used to evacuate fluid or pus from an abscess or cyst. A small incision is made over the lesion to allow drainage of accumulated material, relieving pressure and pain.",
    symptoms: ["Treatment of skin abscesses","Drains infected cysts","Relieves pressure from fluid-filled lesions","Addresses bacterial infections","Treats pilonidal cysts","Manages infected inclusion cysts"],
    careInstructions: ["Change dressings daily or as instructed.","Keep wound clean and dry between changes.","Soak area in warm water to promote drainage.","Apply antibiotic ointment after cleansing.","Take prescribed antibiotics as directed.","Monitor for excessive drainage or signs of spreading infection."],
    affectedAreas: ["Any skin area with abscess","Perirectal region","Axilla","Groin","Other areas prone to infection"], prevalence: "A common procedure performed in dermatology and general medicine for skin and soft tissue infections",
  },
  {
    id: "actinic-purpura", conditionName: "Actinic (Solar) Purpura", commonName: "Senile Purpura",
    description: "Actinic purpura, also called solar purpura or senile purpura, is a common benign condition caused by sun damage and aging that weakens blood vessel walls and the surrounding connective tissue in the skin. This leads to easy bruising, producing dark purple or red blotches, typically on the forearms and hands, from minor trauma or even without noticeable injury.",
    symptoms: ["Dark purple or red irregularly shaped patches on the skin","Flat, non-raised lesions that do not blanch with pressure","Most common on forearms and dorsal hands","Bruises appear with minimal or no trauma","Lesions resolve slowly over 1\u20133 weeks, often leaving brown discoloration","Thin, fragile, easily torn skin in affected areas"],
    careInstructions: ["No specific treatment is required as this is a benign condition.","Protect skin from further sun damage with SPF 30+ sunscreen and protective clothing.","Avoid blood thinners and NSAIDs if possible (consult your doctor before stopping medications).","Use moisturizers to help maintain skin integrity.","Wear long sleeves to protect fragile forearm skin from trauma.","See a dermatologist if bruising is unusually severe or widespread to rule out other causes."],
    affectedAreas: ["Forearms","Dorsal hands","Arms","Any sun-damaged skin"], prevalence: "Extremely common in older adults; affects most people over age 65 with sun-damaged skin",
  },
  {
    id: "acrochordon", conditionName: "Acrochordon (Skin Tag)", commonName: "Skin Tag",
    description: "Acrochordons, commonly known as skin tags, are small, soft, benign skin growths that hang off the skin by a thin stalk (peduncle). They are composed of loose collagen fibers and blood vessels surrounded by skin. They are extremely common, especially in areas of friction, and are completely harmless.",
    symptoms: ["Small, soft, flesh-colored or slightly darker growths","Hang from the skin by a thin stalk","Typically 2\u20135 mm but can grow larger","Painless unless irritated by friction, jewelry, or clothing","Often appear in clusters in skin folds","May become irritated or bleed if snagged or twisted"],
    careInstructions: ["No treatment is necessary since skin tags are benign.","Avoid pulling, twisting, or cutting skin tags at home.","See a dermatologist if a skin tag becomes painful, bleeds, or changes in appearance.","Removal options include snip excision, cryotherapy, or electrocautery.","Skin tags that are frequently irritated by clothing or jewelry may be removed for comfort.","New skin tags may develop even after removal of existing ones."],
    affectedAreas: ["Neck","Axillae (armpits)","Groin folds","Under breasts","Eyelids"], prevalence: "Extremely common; affects approximately 46% of the general population, increasing with age",
  },
  {
    id: "cafe-au-lait", conditionName: "Caf\u00e9 au Lait Spot", commonName: "Caf\u00e9 au Lait Macule",
    description: "Caf\u00e9 au lait spots are flat, pigmented birthmarks that are the color of coffee with milk (light brown). They are caused by a higher concentration of melanin in the skin. One or two spots are very common and benign, but having six or more may be associated with neurofibromatosis or other genetic conditions.",
    symptoms: ["Flat, uniformly light brown (coffee-with-milk colored) patches","Well-defined, smooth borders","Range from a few millimeters to over 20 cm","Present at birth or appear in early childhood","Do not darken significantly with sun exposure","Usually oval or round in shape"],
    careInstructions: ["No treatment is required for isolated caf\u00e9 au lait spots.","Monitor for the development of additional spots, especially in children.","See a dermatologist or geneticist if six or more spots are present, as this may indicate neurofibromatosis.","Cosmetic treatments such as laser therapy are available if desired.","Spots do not require sun protection beyond normal recommendations.","Photograph spots periodically to track any changes in size or number."],
    affectedAreas: ["Trunk","Buttocks","Legs","Arms","Anywhere on the body"], prevalence: "Very common; 10\u201320% of the general population has at least one",
  },
  {
    id: "bullous-pemphigoid", conditionName: "Bullous Pemphigoid", commonName: "Bullous Pemphigoid",
    description: "Bullous pemphigoid is a chronic autoimmune blistering disease that causes large, tense, fluid-filled blisters on the skin. It results from antibodies attacking the basement membrane zone between the epidermis and dermis. It primarily affects older adults and can cause significant discomfort and secondary infections if untreated.",
    symptoms: ["Large, tense, fluid-filled blisters on the skin","Blisters may arise on normal or reddened skin","Intense itching, often preceding blister formation","Blisters most common on trunk, arms, and legs","Blisters do not rupture easily due to thick roof","May have urticarial (hive-like) patches before blisters appear"],
    careInstructions: ["See a dermatologist promptly for diagnosis and treatment.","Treatment typically involves topical or systemic corticosteroids.","Keep blisters intact when possible to prevent infection.","Gently cleanse ruptured blisters and apply prescribed topical treatments.","Immunosuppressive medications may be needed for severe or resistant cases.","Attend regular follow-up visits to monitor disease activity and medication side effects."],
    affectedAreas: ["Trunk","Arms","Legs","Groin","Axillae"], prevalence: "Relatively uncommon; primarily affects adults over age 60, with incidence of approximately 6\u201313 per million per year",
  },
  {
    id: "erysipelas", conditionName: "Erysipelas", commonName: "Erysipelas",
    description: "Erysipelas is an acute superficial bacterial skin infection, most commonly caused by Group A Streptococcus. It involves the upper dermis and superficial lymphatics, producing a well-demarcated, raised, bright red, painful area of skin. It requires prompt antibiotic treatment to prevent complications.",
    symptoms: ["Bright red, well-demarcated, raised area of skin","Rapid onset with pain, warmth, and swelling","Skin surface may have an orange-peel (peau d\u0027orange) texture","Fever, chills, and malaise often accompany the rash","May have a clear entry point such as a wound or crack in the skin","Spreading red streaks (lymphangitis) may be visible"],
    careInstructions: ["Seek medical attention promptly as antibiotics are required.","Complete the full course of prescribed antibiotics (usually penicillin or amoxicillin).","Elevate the affected limb to reduce swelling.","Apply cool compresses for comfort.","Treat any underlying skin breaks, wounds, or athlete\u0027s foot that may have served as entry points.","See a doctor urgently if symptoms worsen despite antibiotic therapy."],
    affectedAreas: ["Lower legs (most common)","Face","Arms","Trunk"], prevalence: "Common bacterial skin infection; incidence approximately 200 per 100,000 persons per year",
  },
  {
    id: "abscess", conditionName: "Abscess", commonName: "Skin Abscess (Boil)",
    description: "A skin abscess is a localized collection of pus within the skin and subcutaneous tissue, typically caused by bacterial infection, most commonly Staphylococcus aureus. It forms when bacteria enter through a break in the skin, leading to inflammation, tissue destruction, and an enclosed pocket of pus. Abscesses are painful and often require drainage.",
    symptoms: ["Firm, tender, fluctuant swelling under the skin","Red, warm, and painful to the touch","May develop a visible white or yellow point (head)","Surrounding skin often red and swollen (cellulitis)","May cause fever if large or deep","Pain increases as the abscess enlarges with pressure buildup"],
    careInstructions: ["See a healthcare provider for evaluation \u2014 most abscesses require incision and drainage.","Do not attempt to squeeze or lance an abscess at home.","Apply warm compresses to promote drainage and relieve pain.","Take prescribed antibiotics if recommended by your provider.","Keep the area clean and change dressings as instructed after drainage.","Return promptly if the area worsens, spreads, or you develop fever."],
    affectedAreas: ["Axillae (armpits)","Groin","Buttocks","Face","Any area of skin"], prevalence: "Very common; skin abscesses account for approximately 3% of emergency department visits",
  },
  {
    id: "carbuncle", conditionName: "Carbuncle (Furuncle)", commonName: "Boil / Carbuncle",
    description: "A furuncle (boil) is a deep infection of a hair follicle resulting in a painful, pus-filled nodule. A carbuncle is a cluster of interconnected furuncles forming a larger, deeper area of infection with multiple drainage points. Both are most commonly caused by Staphylococcus aureus and tend to occur in areas of friction and sweating.",
    symptoms: ["Painful, red, swollen nodule centered around a hair follicle","Develops a central white or yellow pustular head","Surrounding skin is red, warm, and tender","Carbuncles have multiple heads and drain from several points","May cause fever and malaise, especially with carbuncles","Tender regional lymph nodes may be present"],
    careInstructions: ["Apply warm, moist compresses several times daily to promote drainage.","See a healthcare provider if the boil is large, on the face, or does not drain on its own.","Do not squeeze or cut open a boil at home.","Take prescribed antibiotics if your provider recommends them.","Keep the area clean and covered after drainage.","Wash hands frequently and avoid sharing towels or razors to prevent spread."],
    affectedAreas: ["Back of neck","Face","Axillae","Thighs","Buttocks"], prevalence: "Common; furuncles affect approximately 2% of the population annually",
  },
  {
    id: "acanthosis-nigricans", conditionName: "Acanthosis Nigricans", commonName: "Acanthosis Nigricans",
    description: "Acanthosis nigricans is a skin condition characterized by dark, thick, velvety patches in body folds and creases. It is most commonly associated with insulin resistance and obesity, and can be an early sign of type 2 diabetes. Less commonly, it may be associated with certain medications or underlying malignancies.",
    symptoms: ["Dark, velvety, thickened patches of skin","Gradual onset, often unnoticed initially","Skin may feel soft and velvety to the touch","Most prominent in skin folds and creases","May be accompanied by skin tags in the same areas","Rarely itchy or painful"],
    careInstructions: ["See a healthcare provider to evaluate for underlying insulin resistance or diabetes.","Weight loss and increased physical activity can significantly improve the condition.","Treat underlying causes such as diabetes or hormonal imbalances.","Topical retinoids or keratolytics may improve skin appearance.","See a dermatologist if onset is rapid or widespread, as this may indicate an internal malignancy.","Cosmetic treatments are generally not effective without addressing the underlying cause."],
    affectedAreas: ["Back of neck","Axillae (armpits)","Groin","Knuckles","Elbows"], prevalence: "Common; affects up to 74% of obese adults and is increasingly prevalent with rising obesity rates",
  },
  {
    id: "erythema-multiforme", conditionName: "Erythema Multiforme", commonName: "Erythema Multiforme",
    description: "Erythema multiforme is an acute, immune-mediated skin condition characterized by distinctive target-shaped (bulls-eye) lesions. It is most commonly triggered by herpes simplex virus (HSV) infection, though medications and other infections can also be causes. It is usually self-limiting but can recur.",
    symptoms: ["Distinctive target or bulls-eye shaped lesions with concentric rings","Lesions appear symmetrically on the body","Mild itching or burning at lesion sites","May involve the lips and oral mucosa with painful erosions","Lesions evolve over several days, with new crops appearing","Low-grade fever and malaise may accompany the rash"],
    careInstructions: ["See a dermatologist for diagnosis and to identify the trigger.","Treat underlying herpes simplex infection if identified as the cause.","Symptomatic relief with antihistamines for itching and topical corticosteroids.","Use a gentle mouthwash or topical anesthetic for oral lesions.","Prophylactic antiviral therapy may be prescribed for recurrent HSV-related episodes.","Discontinue any suspected causative medication under medical guidance."],
    affectedAreas: ["Hands and palms","Feet and soles","Forearms","Face","Oral mucosa"], prevalence: "Relatively uncommon; peak incidence in young adults aged 20\u201340",
  },
  {
    id: "erythema-nodosum", conditionName: "Erythema Nodosum", commonName: "Erythema Nodosum",
    description: "Erythema nodosum is an inflammatory condition that causes tender, red or violet nodules (bumps) under the skin, most commonly on the shins. It represents a hypersensitivity reaction and can be triggered by infections, medications, inflammatory bowel disease, sarcoidosis, or pregnancy. It is the most common form of panniculitis.",
    symptoms: ["Tender, firm, red or violet nodules under the skin","Most commonly on the anterior shins","Nodules are warm and painful to the touch","Lesions evolve from red to purple to bruise-like yellow-green over 2\u20136 weeks","Fever, malaise, and joint pain may accompany the nodules","Multiple nodules typically appear in crops bilaterally"],
    careInstructions: ["See a healthcare provider to identify and treat the underlying cause.","Rest and elevate the legs to reduce pain and swelling.","NSAIDs (ibuprofen, naproxen) can help with pain and inflammation.","Compression stockings may provide comfort.","The condition usually resolves on its own within 6\u20138 weeks.","A workup for underlying conditions such as sarcoidosis or IBD may be recommended."],
    affectedAreas: ["Shins (most common)","Knees","Ankles","Thighs","Forearms"], prevalence: "Relatively uncommon; more common in women aged 20\u201340, with incidence of 1\u20135 per 100,000 per year",
  },
  {
    id: "erythrasma", conditionName: "Erythrasma", commonName: "Erythrasma",
    description: "Erythrasma is a common superficial bacterial skin infection caused by Corynebacterium minutissimum. It produces well-demarcated, reddish-brown, slightly scaly patches in intertriginous (skin fold) areas. It is often mistaken for a fungal infection. Diagnosis can be confirmed with a Wood\u0027s lamp, which shows characteristic coral-red fluorescence.",
    symptoms: ["Well-demarcated, reddish-brown patches","Fine scaling on the surface","Mild itching, often asymptomatic","Located in skin folds and moist areas","Patches may slowly enlarge over time","Coral-red fluorescence under Wood\u0027s lamp examination"],
    careInstructions: ["Topical erythromycin or clindamycin applied twice daily for 2 weeks is first-line treatment.","Keep affected areas clean and dry.","Antibacterial soaps may help prevent recurrence.","Oral erythromycin may be prescribed for widespread or resistant cases.","Wear breathable, loose-fitting clothing to reduce moisture in skin folds.","Manage underlying conditions like diabetes or obesity that increase risk."],
    affectedAreas: ["Groin","Axillae (armpits)","Inframammary folds","Toe web spaces","Intergluteal cleft"], prevalence: "Common; affects approximately 4% of the population, more prevalent in warm, humid climates and in diabetics",
  },
  {
    id: "angioedema", conditionName: "Angioedema", commonName: "Angioedema",
    description: "Angioedema is a sudden swelling of the deeper layers of the skin (dermis and subcutaneous tissue), often occurring around the eyes, lips, tongue, and throat. It can be allergic (histamine-mediated), hereditary (bradykinin-mediated), or medication-induced (commonly from ACE inhibitors). Severe cases involving the airway require emergency treatment.",
    symptoms: ["Sudden swelling of the face, lips, tongue, or throat","Swelling of hands, feet, or genitals","Skin may feel tight or tingly before swelling","Usually not itchy, unlike hives","Abdominal pain and nausea in hereditary forms","Difficulty breathing or swallowing if throat is involved (medical emergency)"],
    careInstructions: ["Seek emergency medical care immediately if there is throat swelling or difficulty breathing.","Antihistamines can help with mild allergic angioedema.","Identify and avoid triggers such as medications, foods, or allergens.","If caused by an ACE inhibitor, your doctor must discontinue the medication.","Carry an epinephrine auto-injector if you have a history of severe episodes.","See an allergist for evaluation, especially if episodes are recurrent or the cause is unclear."],
    affectedAreas: ["Lips","Eyelids","Tongue","Throat","Hands","Feet"], prevalence: "Common; affects approximately 15% of the population at some point in their lifetime",
  },
  {
    id: "cold-sore", conditionName: "Cold Sore (Herpes Simplex)", commonName: "Cold Sore / Fever Blister",
    description: "Cold sores are small, painful, fluid-filled blisters caused by herpes simplex virus type 1 (HSV-1), though HSV-2 can also cause them. After initial infection, the virus remains dormant in nerve ganglia and can reactivate periodically, especially during times of stress, illness, sun exposure, or immune suppression. Cold sores are highly contagious.",
    symptoms: ["Tingling, itching, or burning sensation before blisters appear (prodrome)","Cluster of small, fluid-filled blisters on or around the lips","Blisters break open and form a shallow ulcer, then crust over","Pain and tenderness at the blister site","Healing typically takes 7\u201314 days","Recurrences often occur in the same location"],
    careInstructions: ["Start antiviral medication (acyclovir, valacyclovir) at the first sign of tingling for best results.","Apply topical antiviral cream (docosanol or acyclovir) as directed.","Avoid touching, picking, or squeezing blisters to prevent spread.","Do not kiss or share utensils, towels, or lip products during an outbreak.","Protect lips from sun exposure with SPF lip balm, as UV light can trigger recurrences.","See a doctor about daily suppressive antiviral therapy if outbreaks are frequent."],
    affectedAreas: ["Lips (most common)","Around the mouth","Nose","Chin","Inside the mouth"], prevalence: "Extremely common; approximately 67% of the global population under age 50 has HSV-1 infection",
  },
  {
    id: "cryosurgery", conditionName: "Cryosurgery", commonName: "Cryotherapy / Freezing",
    description: "Cryosurgery (cryotherapy) is a common dermatological procedure that uses extreme cold, typically liquid nitrogen at -196\u00b0C, to destroy abnormal or diseased tissue. It is a quick, minimally invasive procedure used to treat a wide variety of benign and premalignant skin lesions. The freezing causes cell death and the treated lesion typically blisters and falls off within 1\u20133 weeks.",
    symptoms: ["Treatment of actinic keratoses (precancerous spots)","Removal of warts and viral lesions","Treatment of seborrheic keratoses","Removal of skin tags","Treatment of molluscum contagiosum","Destruction of superficial basal cell carcinomas in select cases"],
    careInstructions: ["A blister or scab will form at the treatment site \u2014 this is normal.","Keep the area clean and apply petroleum jelly or prescribed ointment.","Do not pick at or remove the blister or scab; let it heal naturally.","Mild pain, redness, and swelling are expected for 1\u20133 days after treatment.","Take over-the-counter pain medication if needed.","Temporary lightening or darkening of the skin at the treatment site is common and usually fades."],
    affectedAreas: ["Face","Hands","Arms","Trunk","Legs","Any accessible skin surface"], prevalence: "One of the most commonly performed dermatologic procedures worldwide",
  },
  {
    id: "blue-nevus", conditionName: "Blue Nevus", commonName: "Blue Mole",
    description: "A blue nevus is a benign melanocytic nevus that appears blue or blue-gray due to the deep dermal location of melanin-producing cells. The Tyndall effect causes the blue color, as shorter wavelengths of light are reflected back through the skin. While the vast majority are benign, rare malignant variants exist, so monitoring is important.",
    symptoms: ["Well-circumscribed, dome-shaped blue or blue-gray papule","Usually small, less than 10 mm in diameter","Firm to palpation","Uniform color throughout the lesion","Typically solitary and stable over time","Most commonly appears in childhood or adolescence"],
    careInstructions: ["No treatment is required for stable, typical blue nevi.","Monitor for any changes in size, shape, or color.","See a dermatologist for evaluation to distinguish from melanoma.","A biopsy may be recommended if the lesion is atypical or changing.","Photograph the lesion periodically to track stability.","Surgical excision can be performed if there is diagnostic uncertainty."],
    affectedAreas: ["Dorsal hands and feet","Face","Scalp","Buttocks","Arms"], prevalence: "Relatively common; found in approximately 1\u20132% of the general population",
  },
  {
    id: "lipoma", conditionName: "Lipoma", commonName: "Lipoma (Fatty Lump)",
    description: "A lipoma is a slow-growing, benign tumor composed of mature fat cells enclosed in a thin fibrous capsule. Lipomas are the most common soft tissue tumor in adults. They are soft, mobile, and painless, typically found just beneath the skin. They are harmless but can be removed if bothersome.",
    symptoms: ["Soft, doughy, easily movable lump under the skin","Usually painless unless pressing on nearby nerves","Typically 2\u20135 cm in diameter but can grow larger","Grows slowly over months to years","Skin overlying the lipoma appears normal","May have multiple lipomas (lipomatosis)"],
    careInstructions: ["No treatment is needed for asymptomatic lipomas.","See a doctor if a lump grows rapidly, becomes painful, or feels hard.","Surgical excision is the definitive treatment if removal is desired.","Liposuction can be used for larger lipomas in some cases.","Lipomas rarely recur after complete excision.","New lipomas may develop elsewhere even after removal of existing ones."],
    affectedAreas: ["Upper back","Shoulders","Neck","Arms","Trunk","Thighs"], prevalence: "Very common; affects approximately 1% of the population, more common in adults aged 40\u201360",
  },
  {
    id: "ephelis", conditionName: "Freckle (Ephelis)", commonName: "Freckles",
    description: "Freckles (ephelides) are small, flat, light to dark brown spots that appear on sun-exposed skin. They are caused by an increase in melanin production (not an increase in melanocyte number) in response to UV radiation. They are most common in fair-skinned individuals and tend to fade in winter and darken in summer.",
    symptoms: ["Small, flat, light brown to dark brown spots","Typically 1\u20135 mm in diameter","Appear on sun-exposed areas of skin","Darken with sun exposure and fade in winter","More common in fair-skinned and red-haired individuals","Usually appear in childhood and may decrease with age"],
    careInstructions: ["No treatment is required as freckles are completely benign.","Apply broad-spectrum SPF 30+ sunscreen daily to prevent darkening.","Wear hats and protective clothing during peak sun hours.","See a dermatologist if any spot becomes irregular, multicolored, or rapidly changing.","Cosmetic treatments such as laser therapy or chemical peels are available if desired.","Distinguish from lentigines, which do not fade with reduced sun exposure."],
    affectedAreas: ["Face","Nose","Cheeks","Shoulders","Arms","Upper back"], prevalence: "Extremely common in fair-skinned populations; prevalence varies by ethnicity and sun exposure",
  },
  {
    id: "keloid", conditionName: "Keloid", commonName: "Keloid Scar",
    description: "Keloids are raised, thickened scars that extend beyond the original boundaries of a wound. They result from an overgrowth of collagen during the wound healing process. Unlike hypertrophic scars, keloids continue to grow beyond the wound margins and rarely regress spontaneously. They can be cosmetically disfiguring and may cause pain or itching.",
    symptoms: ["Raised, firm, smooth scar tissue extending beyond wound borders","Pink, red, or dark brown coloration depending on skin tone","May be itchy, tender, or painful","Slowly enlarges over weeks to months after initial wound healing","Can develop after surgery, piercings, burns, acne, or minor injuries","May restrict movement if located over a joint"],
    careInstructions: ["See a dermatologist for treatment options before keloids enlarge.","Intralesional corticosteroid injections are a first-line treatment.","Silicone gel sheets or silicone-based creams may help flatten keloids.","Pressure therapy can be used for ear keloids after excision.","Surgical removal alone has a high recurrence rate and is usually combined with other treatments.","Avoid unnecessary skin trauma, piercings, and elective procedures on keloid-prone skin."],
    affectedAreas: ["Earlobes","Chest","Shoulders","Upper back","Jawline"], prevalence: "Affects approximately 4.5\u201316% of the general population, with higher prevalence in people with darker skin tones",
  },
  {
    id: "pyogenic-granuloma", conditionName: "Pyogenic Granuloma", commonName: "Pyogenic Granuloma",
    description: "Pyogenic granulomas are benign vascular growths that appear as rapidly growing, bright red, moist papules or nodules that bleed easily. Despite the name, they are neither infectious (pyogenic) nor true granulomas. They are composed of proliferating blood vessels and often develop after minor trauma. They are common in children and pregnant women.",
    symptoms: ["Rapidly growing, bright red or dark red papule or nodule","Bleeds easily and profusely with minor trauma","Usually painless unless ulcerated","Typically 5\u201315 mm in diameter","Moist, glistening surface that may have a collarette of scale at the base","Develops over days to weeks, then stabilizes"],
    careInstructions: ["See a dermatologist for evaluation and treatment.","Shave excision with electrocautery of the base is the most common treatment.","Silver nitrate cauterization may be used for small lesions.","A biopsy is usually performed to confirm the diagnosis and rule out amelanotic melanoma.","Recurrence is possible, especially if the base is not adequately treated.","Pregnancy-related pyogenic granulomas often resolve after delivery."],
    affectedAreas: ["Fingers and hands","Lips","Face","Gums","Trunk"], prevalence: "Common; accounts for approximately 0.5% of all skin nodules in children",
  },
  {
    id: "spider-angioma", conditionName: "Spider Angioma", commonName: "Spider Nevus",
    description: "A spider angioma (spider nevus) is a benign vascular lesion consisting of a central arteriole with radiating capillary branches resembling spider legs. They blanch with pressure applied to the central point. One or two spider angiomas are common and benign, but multiple lesions may be associated with liver disease, pregnancy, or estrogen excess.",
    symptoms: ["Small, red, spider-like lesion with a central dot and radiating vessels","Blanches when pressure is applied to the central arteriole","Typically 1\u201310 mm in diameter","Most common on the face, neck, and upper body","Usually painless and asymptomatic","May pulsate visibly in the central arteriole"],
    careInstructions: ["No treatment is needed for isolated, asymptomatic spider angiomas.","See a doctor if multiple spider angiomas appear, as this may indicate liver disease.","Electrocautery or laser treatment can remove lesions for cosmetic reasons.","Pregnancy-related spider angiomas often resolve after delivery.","Avoid alcohol if liver disease is suspected or confirmed.","A liver function evaluation may be recommended if multiple lesions are present."],
    affectedAreas: ["Face","Neck","Upper chest","Arms","Hands"], prevalence: "Common; found in approximately 10\u201315% of healthy adults, more common in children and pregnant women",
  },
  {
    id: "telangiectasia", conditionName: "Telangiectasia", commonName: "Broken Blood Vessels / Spider Veins",
    description: "Telangiectasias are small, dilated blood vessels visible near the surface of the skin, appearing as thin red, purple, or blue lines. They can occur anywhere but are most common on the face and legs. They may be caused by sun damage, aging, rosacea, genetic conditions, or chronic venous insufficiency.",
    symptoms: ["Fine, visible red, blue, or purple thread-like lines on the skin","Typically 0.5\u20131 mm in diameter","Usually painless and asymptomatic","May gradually increase in number over time","Blanch momentarily with pressure","Commonly cluster in groups"],
    careInstructions: ["No treatment is required unless for cosmetic concerns.","Laser therapy (pulsed dye laser or KTP laser) is effective for facial telangiectasias.","Sclerotherapy can treat larger telangiectasias on the legs.","Apply broad-spectrum SPF 30+ sunscreen daily to prevent worsening.","Avoid triggers such as alcohol, extreme temperatures, and spicy foods if associated with rosacea.","See a dermatologist to evaluate for underlying conditions such as rosacea or hereditary hemorrhagic telangiectasia."],
    affectedAreas: ["Nose","Cheeks","Chin","Legs","Chest"], prevalence: "Extremely common; facial telangiectasias affect most adults over age 40, leg telangiectasias affect up to 80% of adults",
  },
  {
    id: "folliculitis", conditionName: "Folliculitis", commonName: "Folliculitis",
    description: "Folliculitis is an inflammation or infection of hair follicles, most commonly caused by Staphylococcus aureus bacteria. It appears as small red bumps or white-headed pimples around hair follicles. It can be superficial or deep and may be caused by bacteria, fungi, viruses, or physical irritation from shaving or friction.",
    symptoms: ["Small red bumps or white-headed pustules around hair follicles","Itching, burning, or tenderness in affected areas","Clusters of bumps that may spread","Skin may become red and inflamed around follicles","May develop into crusty sores that do not heal quickly","Hot tub folliculitis causes widespread itchy red bumps 1\u20132 days after exposure"],
    careInstructions: ["Keep the affected area clean with antibacterial soap.","Apply warm compresses to relieve discomfort and promote drainage.","Avoid shaving the affected area until it heals.","Over-the-counter antibiotic ointments may help mild cases.","See a dermatologist if folliculitis is widespread, recurrent, or does not improve.","Wear loose, breathable clothing to reduce friction and moisture."],
    affectedAreas: ["Beard area","Scalp","Chest","Back","Buttocks","Thighs"], prevalence: "Very common; one of the most frequently seen skin infections in primary care",
  },
  {
    id: "impetigo", conditionName: "Impetigo", commonName: "Impetigo",
    description: "Impetigo is a highly contagious superficial bacterial skin infection most commonly caused by Staphylococcus aureus or Group A Streptococcus. It primarily affects children and presents as honey-colored crusted lesions or fluid-filled blisters. It spreads through direct contact and can be easily treated with antibiotics.",
    symptoms: ["Red sores that quickly rupture and ooze, then form honey-colored crusts","Fluid-filled blisters (bullous impetigo)","Itching in affected areas","Sores most commonly around the nose and mouth","Lesions spread easily to other areas through scratching","Surrounding skin may appear red and inflamed"],
    careInstructions: ["See a healthcare provider for diagnosis and antibiotic treatment.","Apply prescribed topical antibiotics (mupirocin) for localized cases.","Oral antibiotics may be needed for widespread infection.","Gently wash crusted areas with warm soapy water before applying medication.","Keep affected areas covered to prevent spreading to others.","Do not share towels, clothing, or bedding until the infection has cleared."],
    affectedAreas: ["Around nose and mouth","Face","Hands","Arms","Legs"], prevalence: "Very common in children; affects approximately 162 million children worldwide at any given time",
  },
  {
    id: "keratosis-pilaris", conditionName: "Keratosis Pilaris", commonName: "Chicken Skin",
    description: "Keratosis pilaris is a very common, harmless skin condition that causes small, rough, skin-colored or slightly red bumps, often described as feeling like sandpaper. It occurs when keratin plugs block the openings of hair follicles. It is most common in children and adolescents and often improves with age.",
    symptoms: ["Small, rough, skin-colored or slightly red bumps","Sandpaper-like texture when touched","Typically painless but may be mildly itchy","Tends to worsen in dry, cold weather","May have a slightly reddened or inflamed appearance","Often improves in summer and with age"],
    careInstructions: ["Moisturize regularly with thick, emollient-based creams, especially after bathing.","Use gentle exfoliating products containing urea, lactic acid, or salicylic acid.","Avoid harsh scrubbing, which can irritate the skin and worsen the condition.","Take lukewarm showers instead of hot showers to prevent drying.","Apply a humectant moisturizer within minutes of bathing.","See a dermatologist if the appearance is bothersome \u2014 prescription retinoids may help."],
    affectedAreas: ["Upper arms","Thighs","Buttocks","Cheeks (in children)"], prevalence: "Extremely common; affects approximately 50\u201380% of adolescents and 40% of adults",
  },
  {
    id: "lichen-simplex-chronicus", conditionName: "Lichen Simplex Chronicus", commonName: "Neurodermatitis",
    description: "Lichen simplex chronicus (neurodermatitis) is a chronic skin condition caused by repeated scratching or rubbing of the same area of skin. This creates a self-perpetuating itch-scratch cycle that leads to thickened, leathery, darkened patches of skin. Breaking the itch-scratch cycle is essential for treatment.",
    symptoms: ["Thickened, leathery patch of skin (lichenification)","Intense itching, often worse at night or during stress","Skin may appear darker or reddish compared to surrounding skin","Accentuated skin lines and markings in the affected area","Well-defined borders of the affected patch","Excoriations (scratch marks) may be visible"],
    careInstructions: ["Break the itch-scratch cycle \u2014 this is the most important step.","Apply potent topical corticosteroids to reduce itching and inflammation.","Keep the area moisturized with fragrance-free emollients.","Cover the area with bandages or clothing to prevent unconscious scratching.","Manage stress, which often triggers or worsens itching.","Consider antihistamines at bedtime to reduce nighttime scratching."],
    affectedAreas: ["Back of neck","Ankles","Wrists","Forearms","Genital area","Scalp"], prevalence: "Common; affects approximately 12% of the population, more common in women aged 30\u201350",
  },
  {
    id: "paronychia", conditionName: "Paronychia", commonName: "Nail Infection",
    description: "Paronychia is an infection of the skin around the fingernail or toenail (the nail fold). Acute paronychia is usually caused by bacteria (Staphylococcus aureus) entering through a break in the skin, often from nail biting, manicures, or hangnails. Chronic paronychia is typically caused by Candida and is associated with prolonged moisture exposure.",
    symptoms: ["Red, swollen, tender skin alongside or around the nail","Pain and throbbing in the affected finger or toe","Pus may accumulate under the nail fold","Nail may become discolored or distorted","Acute onset after trauma (acute) or gradual onset (chronic)","Chronic paronychia may cause ridged or thickened nails"],
    careInstructions: ["Soak the affected finger or toe in warm water for 15 minutes, 3\u20134 times daily.","See a doctor if pus has accumulated \u2014 incision and drainage may be needed.","Antibiotics (oral or topical) are prescribed for bacterial paronychia.","Antifungal medications are used for chronic, Candida-related paronychia.","Avoid nail biting, picking at cuticles, and aggressive manicures.","Keep hands dry and wear gloves when working with water or chemicals."],
    affectedAreas: ["Fingernails","Toenails","Nail folds","Cuticle area"], prevalence: "Common; one of the most frequent hand infections, accounting for approximately 35% of all hand infections",
  },
  {
    id: "pityriasis-rosea", conditionName: "Pityriasis Rosea", commonName: "Pityriasis Rosea",
    description: "Pityriasis rosea is a common, self-limiting skin condition that typically begins with a single large, scaly patch called a herald patch, followed 1\u20132 weeks later by a widespread rash of smaller oval patches arranged in a Christmas tree pattern on the trunk. It is thought to be triggered by a viral infection (HHV-6 or HHV-7).",
    symptoms: ["Initial herald patch: large (2\u201310 cm), oval, pink, scaly patch","Subsequent eruption of smaller oval patches on the trunk and proximal limbs","Patches follow skin cleavage lines in a Christmas tree pattern on the back","Fine collarette of scale within the lesions","Mild to moderate itching in about half of cases","May be preceded by mild upper respiratory symptoms"],
    careInstructions: ["No treatment is usually necessary as the rash resolves on its own in 6\u201310 weeks.","Antihistamines and topical corticosteroids can relieve itching.","Moisturizers and lukewarm oatmeal baths may soothe the skin.","Avoid hot showers and harsh soaps, which can worsen itching.","See a dermatologist to confirm the diagnosis and rule out other conditions.","Pityriasis rosea rarely recurs and is not contagious."],
    affectedAreas: ["Trunk","Back","Chest","Upper arms","Thighs"], prevalence: "Common; affects approximately 0.5\u20132% of the population, most commonly in ages 10\u201335",
  },
  {
    id: "scabies", conditionName: "Scabies", commonName: "Scabies (The Itch)",
    description: "Scabies is a highly contagious skin infestation caused by the microscopic mite Sarcoptes scabiei. The female mite burrows into the skin to lay eggs, causing an intensely itchy allergic reaction. It spreads through prolonged skin-to-skin contact and can affect anyone regardless of hygiene. Prompt treatment of the affected person and close contacts is essential.",
    symptoms: ["Intense itching, especially at night","Small, raised, thread-like burrow tracks in the skin","Red papules, vesicles, or nodules","Rash may appear eczematous from scratching","Itching may take 2\u20136 weeks to develop after initial infestation","Secondary bacterial infection from scratching is common"],
    careInstructions: ["See a healthcare provider for diagnosis and prescription treatment.","Apply prescribed permethrin 5% cream from neck to toes, leave on 8\u201314 hours, then wash off.","All household members and close contacts should be treated simultaneously.","Wash all bedding, clothing, and towels in hot water and dry on high heat.","Items that cannot be washed should be sealed in plastic bags for 72 hours.","Itching may persist for 2\u20134 weeks after successful treatment \u2014 this does not mean treatment failed."],
    affectedAreas: ["Between fingers","Wrists","Elbows","Axillae","Waistline","Genitals"], prevalence: "Affects approximately 200 million people worldwide at any given time",
  },
  {
    id: "xerosis", conditionName: "Xerosis (Dry Skin)", commonName: "Dry Skin",
    description: "Xerosis is the medical term for abnormally dry skin. It occurs when the skin loses too much water or oil, leading to a compromised skin barrier. It is extremely common, especially in older adults and during cold, dry weather. While usually a minor condition, severe xerosis can lead to cracking, bleeding, and secondary infections.",
    symptoms: ["Rough, dry, flaky, or scaly skin","Tightness or tautness, especially after bathing","Itching that may range from mild to severe","Fine lines or cracks in the skin surface","Skin may appear dull or ashy","Severe cases may develop deep fissures that bleed"],
    careInstructions: ["Moisturize immediately after bathing while skin is still damp.","Use thick, fragrance-free creams or ointments rather than lotions.","Take short, lukewarm showers or baths instead of long, hot ones.","Use gentle, soap-free cleansers that do not strip natural oils.","Run a humidifier in your home during dry winter months.","See a dermatologist if dry skin is severe, persistent, or does not respond to moisturizers."],
    affectedAreas: ["Lower legs (shins)","Arms","Hands","Trunk","Feet"], prevalence: "Extremely common; affects nearly all people at some point, with prevalence increasing significantly after age 60",
  },
];

var CATEGORIES = [
  { label: "All Conditions", filter: null },
  { label: "Benign Growths", filter: ["seborrheic-keratosis","lichenoid-keratosis","porokeratosis","cherry-angioma","lentigo","dermatofibroma","warts","melanocytic-nevus","atypical-nevus","sebaceous-hyperplasia","epidermal-inclusion-cyst","pilar-cyst","molluscum-contagiosum","pilomatrixoma","milium-cyst","angiokeratoma","actinic-purpura","acrochordon","cafe-au-lait","blue-nevus","lipoma","ephelis","keloid","pyogenic-granuloma","spider-angioma","telangiectasia"] },
  { label: "Malignant Growths", filter: ["actinic-keratosis","basal-cell-carcinoma","squamous-cell-carcinoma","melanoma","scc-in-situ"] },
  { label: "Rashes", filter: ["eczema","psoriasis","seborrheic-dermatitis","acne","rosacea","periorificial-dermatitis","hidradenitis-suppurativa","vitiligo","melasma","granuloma-annulare","contact-dermatitis","lichen-planus","acne-necrotica-miliaris","discoid-lupus","tinea-versicolor","tinea-corporis","onychomycosis","alopecia-areata","urticaria","hyperhidrosis","herpes-zoster","bullous-pemphigoid","erysipelas","abscess","carbuncle","acanthosis-nigricans","erythema-multiforme","erythema-nodosum","erythrasma","angioedema","cold-sore","folliculitis","impetigo","keratosis-pilaris","lichen-simplex-chronicus","paronychia","pityriasis-rosea","scabies","xerosis"] },
  { label: "Procedures", filter: ["mohs-surgery","electrodesiccation-curettage","standard-excision","shave-biopsy","incision-drainage","cryosurgery"] },
];

function LogoIcon({ size }) {
  var s = size || 40;
  return (
    <svg width={s} height={s} viewBox="0 0 60 60" xmlns="http://www.w3.org/2000/svg" style={{ display:"block", flexShrink:0 }}>
      <defs>
        <linearGradient id="ls1" x1="0%" y1="0%" x2="100%" y2="0%"><stop offset="0%" stopColor="#fde68a"/><stop offset="100%" stopColor="#fcd34d"/></linearGradient>
        <linearGradient id="ls2" x1="0%" y1="0%" x2="100%" y2="0%"><stop offset="0%" stopColor="#fdba74"/><stop offset="100%" stopColor="#fb923c"/></linearGradient>
        <linearGradient id="ls3" x1="0%" y1="0%" x2="100%" y2="0%"><stop offset="0%" stopColor="#fca5a5"/><stop offset="100%" stopColor="#f87171"/></linearGradient>
      </defs>
      <rect x="0" y="0" width="60" height="60" rx="14" fill="#1e40af"/>
      <path d="M10 16 Q30 11 50 16 L50 25 Q30 20 10 25 Z" fill="url(#ls1)" opacity="0.92"/>
      <path d="M10 25 Q30 20 50 25 L50 34 Q30 29 10 34 Z" fill="url(#ls2)" opacity="0.92"/>
      <path d="M10 34 Q30 29 50 34 L50 43 Q30 38 10 43 Z" fill="url(#ls3)" opacity="0.92"/>
      <text x="20" y="44" fontFamily="sans-serif" fontSize="32" fontWeight="700" fill="#ffffff" opacity="0.22">D</text>
    </svg>
  );
}

function Section({ title, emoji, accent, children }) {
  return (
    <div style={{ borderRadius:16, border: accent ? "1px solid #bfdbfe" : "1px solid #e5e7eb", backgroundColor: accent ? "#eff6ff" : "#fff", padding:20, boxShadow:"0 1px 2px rgba(0,0,0,0.04)" }}>
      <div style={{ display:"flex", alignItems:"center", gap:10, marginBottom:14 }}>
        <span style={{ width:32, height:32, borderRadius:8, display:"flex", alignItems:"center", justifyContent:"center", fontSize:15, backgroundColor: accent ? "#1e40af" : "#f3f4f6", color: accent ? "#fff" : undefined }}>{emoji}</span>
        <span style={{ fontWeight:700, fontSize:15, color:"#111827" }}>{title}</span>
      </div>
      {children}
    </div>
  );
}

function ConditionPage({ condition, onBack, onNavigate }) {
  var permalink = "https://mydermterms.com/condition/" + condition.id;
  return (
    <div style={{ minHeight:"100vh", backgroundColor:"#f9fafb", fontFamily:"-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" }}>
      <div style={{ position:"sticky", top:0, zIndex:10, backgroundColor:"rgba(255,255,255,0.95)", borderBottom:"1px solid #e5e7eb", backdropFilter:"blur(8px)" }}>
        <div style={{ maxWidth:800, margin:"0 auto", padding:"12px 16px", display:"flex", alignItems:"center", gap:12 }}>
          <button onClick={onBack} style={{ width:36, height:36, borderRadius:10, border:"none", backgroundColor:"#f3f4f6", cursor:"pointer", fontSize:18, display:"flex", alignItems:"center", justifyContent:"center" }}>
            {"<"}
          </button>
          <div style={{ flex:1, display:"flex", alignItems:"center", gap:8 }}>
            <LogoIcon size={28} />
            <span style={{ fontWeight:700, fontSize:14, color:"#111827" }}>MyDermTerms</span>
          </div>
          <button onClick={function(){window.print()}} style={{ width:36, height:36, borderRadius:10, border:"none", backgroundColor:"#f3f4f6", cursor:"pointer", fontSize:16, display:"flex", alignItems:"center", justifyContent:"center" }} title="Print this page">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#374151" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M6 9V2h12v7"/><path d="M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2"/><rect x="6" y="14" width="12" height="8"/></svg>
          </button>
        </div>
      </div>
      <div style={{ maxWidth:800, margin:"0 auto", padding:"20px 16px 40px", display:"flex", flexDirection:"column", gap:20 }}>
        <div>
          <h1 style={{ fontSize:24, fontWeight:800, color:"#111827", margin:0, lineHeight:1.2 }}>{condition.conditionName}</h1>
          <p style={{ fontSize:15, color:"#6b7280", margin:"4px 0 0", fontWeight:500 }}>{condition.commonName}</p>
        </div>
        {SHOW_IMAGES && (
        <div style={{ width:"100%", borderRadius:16, border:"1px solid #bfdbfe", background:"linear-gradient(135deg, #eff6ff 0%, #dbeafe 50%, #e0e7ff 100%)", display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"center", gap:8, padding:"40px 20px" }}>
          <span style={{ fontSize:40 }}>{"🔬"}</span>
          <p style={{ fontSize:13, fontWeight:600, color:"#1d4ed8", margin:0 }}>Clinical Reference Image</p>
          <p style={{ fontSize:11, color:"#3b82f6", margin:0 }}>{condition.conditionName}</p>
        </div>
        )}
        <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:12 }}>
          <div style={{ borderRadius:12, backgroundColor:"#fff", border:"1px solid #e5e7eb", padding:14 }}>
            <p style={{ fontSize:10, fontWeight:700, color:"#6b7280", textTransform:"uppercase", margin:"0 0 6px" }}>Prevalence</p>
            <p style={{ fontSize:12, color:"#374151", margin:0, lineHeight:1.5 }}>{condition.prevalence}</p>
          </div>
          <div style={{ borderRadius:12, backgroundColor:"#fff", border:"1px solid #e5e7eb", padding:14 }}>
            <p style={{ fontSize:10, fontWeight:700, color:"#6b7280", textTransform:"uppercase", margin:"0 0 6px" }}>Common Areas</p>
            <p style={{ fontSize:12, color:"#374151", margin:0, lineHeight:1.5 }}>{condition.affectedAreas.slice(0,3).join(", ")}</p>
          </div>
        </div>
        <Section title="Overview" emoji={"i"}>
          <p style={{ fontSize:14, color:"#374151", lineHeight:1.7, margin:0 }}>{condition.description}</p>
        </Section>
        <Section title="Key Symptoms" emoji={"!"}>
          <div style={{ display:"flex", flexDirection:"column", gap:10 }}>
            {condition.symptoms.map(function(s, i) {
              return (
                <div key={i} style={{ display:"flex", alignItems:"flex-start", gap:10 }}>
                  <span style={{ width:8, height:8, borderRadius:"50%", backgroundColor:"#3b82f6", marginTop:6, flexShrink:0 }} />
                  <span style={{ fontSize:14, color:"#374151", lineHeight:1.5 }}>{s}</span>
                </div>
              );
            })}
          </div>
        </Section>
        <Section title="Affected Areas" emoji={"@"}>
          <div style={{ display:"flex", flexWrap:"wrap", gap:8 }}>
            {condition.affectedAreas.map(function(area, i) {
              return (
                <span key={i} style={{ padding:"6px 14px", borderRadius:999, backgroundColor:"#eff6ff", color:"#1d4ed8", fontSize:12, fontWeight:500, border:"1px solid #bfdbfe" }}>{area}</span>
              );
            })}
          </div>
        </Section>
        <Section title="Care Instructions" emoji={"+"} accent>
          <div style={{ display:"flex", flexDirection:"column", gap:12 }}>
            {condition.careInstructions.map(function(step, i) {
              return (
                <div key={i} style={{ display:"flex", alignItems:"flex-start", gap:12 }}>
                  <span style={{ width:24, height:24, borderRadius:"50%", backgroundColor:"#1e40af", color:"#fff", fontSize:12, fontWeight:700, display:"flex", alignItems:"center", justifyContent:"center", flexShrink:0, marginTop:2 }}>{i + 1}</span>
                  <span style={{ fontSize:14, color:"#374151", lineHeight:1.5 }}>{step}</span>
                </div>
              );
            })}
          </div>
        </Section>
        <div style={{ borderRadius:12, backgroundColor:"#fffbeb", border:"1px solid #fde68a", padding:16, display:"flex", gap:12 }}>
          <span style={{ fontSize:16, flexShrink:0 }}>{"!"}</span>
          <div>
            <p style={{ fontSize:12, fontWeight:600, color:"#92400e", margin:"0 0 4px" }}>Medical Disclaimer</p>
            <p style={{ fontSize:12, color:"#a16207", margin:0, lineHeight:1.5 }}>This information is for educational purposes only and does not replace professional medical advice. Always consult a qualified dermatologist for diagnosis and treatment.</p>
          </div>
        </div>
        <div style={{ borderRadius:12, backgroundColor:"#f0f9ff", border:"1px solid #bae6fd", padding:16, textAlign:"center" }}>
          <p style={{ fontSize:11, fontWeight:600, color:"#0369a1", margin:"0 0 4px" }}>Permalink for this condition</p>
          <p style={{ fontSize:13, color:"#0c4a6e", margin:0, fontFamily:"monospace", wordBreak:"break-all" }}>{permalink}</p>
        </div>
      </div>
      <Footer onNavigate={onNavigate} />
    </div>
  );
}

var CONDITION_COLORS = {
  "seborrheic-keratosis": "#8B6914", "actinic-keratosis": "#C2185B", "lichenoid-keratosis": "#7B1FA2",
  "porokeratosis": "#00695C", "cherry-angioma": "#D32F2F", "lentigo": "#5D4037",
  "dermatofibroma": "#E65100", "warts": "#33691E", "melanocytic-nevus": "#4E342E",
  "atypical-nevus": "#1A237E", "sebaceous-hyperplasia": "#F9A825", "epidermal-inclusion-cyst": "#546E7A",
  "pilar-cyst": "#455A64", "molluscum-contagiosum": "#00838F", "basal-cell-carcinoma": "#B71C1C",
  "squamous-cell-carcinoma": "#880E4F", "melanoma": "#311B92", "mohs-surgery": "#0D47A1",
  "periorificial-dermatitis": "#AD1457", "eczema": "#E53935", "psoriasis": "#6A1B9A",
  "seborrheic-dermatitis": "#EF6C00", "acne": "#F44336", "rosacea": "#C62828",
  "hidradenitis-suppurativa": "#6D4C41", "vitiligo": "#78909C", "melasma": "#8D6E63",
  "granuloma-annulare": "#00796B", "contact-dermatitis": "#D84315", "lichen-planus": "#4A148C",
  "acne-necrotica-miliaris": "#BF360C", "discoid-lupus": "#C51162", "tinea-versicolor": "#2E7D32",
  "tinea-corporis": "#1B5E20", "onychomycosis": "#3E2723", "alopecia-areata": "#37474F",
  "urticaria": "#FF6F00", "hyperhidrosis": "#0277BD", "herpes-zoster": "#6A1B9A",
  "pilomatrixoma": "#795548", "milium-cyst": "#90A4AE", "scc-in-situ": "#9C27B0",
  "electrodesiccation-curettage": "#1565C0", "standard-excision": "#0D47A1", "shave-biopsy": "#1976D2",
  "angiokeratoma": "#8E24AA",
  "incision-drainage": "#0097A7",
  "actinic-purpura": "#7B1FA2", "acrochordon": "#8D6E63", "cafe-au-lait": "#A1887F",
  "bullous-pemphigoid": "#C62828", "erysipelas": "#D50000", "abscess": "#BF360C",
  "carbuncle": "#E65100", "acanthosis-nigricans": "#3E2723", "erythema-multiforme": "#AD1457",
  "erythema-nodosum": "#880E4F", "erythrasma": "#4E342E", "angioedema": "#1565C0",
  "cold-sore": "#D81B60", "cryosurgery": "#00838F",
  "blue-nevus": "#283593", "lipoma": "#6D4C41", "ephelis": "#FF8F00", "keloid": "#4E342E",
  "pyogenic-granuloma": "#C62828", "spider-angioma": "#D32F2F", "telangiectasia": "#E91E63",
  "folliculitis": "#F57F17", "impetigo": "#FFB300", "keratosis-pilaris": "#8D6E63",
  "lichen-simplex-chronicus": "#5D4037", "paronychia": "#E64A19", "pityriasis-rosea": "#AB47BC",
  "scabies": "#795548", "xerosis": "#90A4AE",
};

function ConditionTile({ condition, onSelect, hoveredId, setHoveredId }) {
  var isHovered = hoveredId === condition.id;
  var color = CONDITION_COLORS[condition.id] || "#1e40af";
  return (
    <div style={{ position:"relative" }}
      onMouseEnter={function(){setHoveredId(condition.id)}}
      onMouseLeave={function(){setHoveredId(null)}}>
      <button onClick={function(){onSelect(condition)}} style={{
        backgroundColor: isHovered ? "#f0f4ff" : "#fff", borderRadius:12,
        border: isHovered ? "2px solid #1e40af" : "1px solid #e5e7eb",
        padding:"16px 12px", cursor:"pointer",
        boxShadow: isHovered ? "0 4px 16px rgba(30,64,175,0.18)" : "0 1px 3px rgba(0,0,0,0.05)",
        display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"center",
        textAlign:"center", minHeight:80, width:"100%", boxSizing:"border-box",
        transition:"all 0.15s ease"
      }}>
        <span style={{ fontSize:14, fontWeight:700, color:"#111827", lineHeight:1.3 }}>{condition.conditionName}</span>
      </button>
      {isHovered && (
        <div style={{
          position:"absolute", bottom:"100%", left:"50%", transform:"translateX(-50%)",
          marginBottom:8, zIndex:100, width:200, borderRadius:12,
          backgroundColor:"#fff", border:"1px solid #d1d5db",
          boxShadow:"0 8px 30px rgba(0,0,0,0.18)", overflow:"hidden", pointerEvents:"none"
        }}>
          {SHOW_IMAGES && (
          <div style={{
            width:"100%", height:130,
            background:"linear-gradient(135deg, " + color + "22 0%, " + color + "44 50%, " + color + "66 100%)",
            display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"center", gap:6
          }}>
            <div style={{
              width:56, height:56, borderRadius:"50%", backgroundColor: color + "33",
              border:"2px solid " + color + "55",
              display:"flex", alignItems:"center", justifyContent:"center",
              fontSize:22, fontWeight:800, color: color
            }}>{condition.conditionName.charAt(0)}</div>
            <span style={{ fontSize:10, fontWeight:700, color: color, textTransform:"uppercase", letterSpacing:0.5 }}>Clinical Reference</span>
          </div>
          )}
          <div style={{ padding:"8px 12px", backgroundColor:"#f9fafb", borderTop: SHOW_IMAGES ? "1px solid #e5e7eb" : "none" }}>
            <p style={{ fontSize:11, fontWeight:700, color:"#111827", margin:"0 0 2px" }}>{condition.conditionName}</p>
            <p style={{ fontSize:10, color:"#6b7280", margin:0, lineHeight:1.4 }}>{condition.description.substring(0, 80)}...</p>
          </div>
          <div style={{
            position:"absolute", bottom:-6, left:"50%", transform:"translateX(-50%) rotate(45deg)",
            width:12, height:12, backgroundColor:"#f9fafb",
            borderRight:"1px solid #d1d5db", borderBottom:"1px solid #d1d5db"
          }} />
        </div>
      )}
    </div>
  );
}

function ConditionList({ onSelect, onNavigate }) {
  var _s = useState("");
  var query = _s[0]; var setQuery = _s[1];
  var _c = useState(null);
  var catFilter = _c[0]; var setCatFilter = _c[1];
  var _h = useState(null);
  var hoveredId = _h[0]; var setHoveredId = _h[1];

  var filtered = CONDITIONS.filter(function(c) {
    var matchesSearch = c.conditionName.toLowerCase().indexOf(query.toLowerCase()) !== -1 || c.commonName.toLowerCase().indexOf(query.toLowerCase()) !== -1;
    var matchesCat = catFilter === null || catFilter.indexOf(c.id) !== -1;
    return matchesSearch && matchesCat;
  }).sort(function(a, b) {
    return a.conditionName.localeCompare(b.conditionName);
  });

  return (
    <div style={{ minHeight:"100vh", backgroundColor:"#f9fafb", fontFamily:"-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" }}>
      <div style={{ backgroundColor:"#1e40af", color:"#fff", padding:"32px 16px 24px" }}>
        <div style={{ maxWidth:1200, margin:"0 auto" }}>
          <div style={{ display:"flex", alignItems:"center", gap:10, marginBottom:10, flexWrap:"wrap" }}>
            <LogoIcon size={40} />
            <span style={{ fontSize:20, fontWeight:800, letterSpacing:-0.5 }}>MyDermTerms</span>
            <div style={{ flex:1 }} />
            <a href="/downloads/MyDermTerms_QR_Handout.pdf" download style={{
              display:"flex", alignItems:"center", gap:10, padding:"10px 20px",
              borderRadius:12, backgroundColor:"rgba(255,255,255,0.22)",
              border:"1.5px solid rgba(255,255,255,0.4)", color:"#fff",
              fontSize:15, fontWeight:700, textDecoration:"none", cursor:"pointer",
              whiteSpace:"nowrap"
            }}>
              <svg width="36" height="28" viewBox="0 0 36 28" xmlns="http://www.w3.org/2000/svg" style={{ flexShrink:0 }}>
                <rect x="0" y="0" width="36" height="28" rx="3" fill="rgba(255,255,255,0.15)" stroke="rgba(255,255,255,0.5)" strokeWidth="1"/>
                <rect x="3" y="3" width="6" height="6" rx="1" fill="#93c5fd"/>
                <rect x="11" y="3" width="6" height="6" rx="1" fill="#93c5fd"/>
                <rect x="19" y="3" width="6" height="6" rx="1" fill="#93c5fd"/>
                <rect x="27" y="3" width="6" height="6" rx="1" fill="#93c5fd"/>
                <rect x="3" y="11" width="6" height="6" rx="1" fill="#93c5fd"/>
                <rect x="11" y="11" width="6" height="6" rx="1" fill="#93c5fd"/>
                <rect x="19" y="11" width="6" height="6" rx="1" fill="#93c5fd"/>
                <rect x="27" y="11" width="6" height="6" rx="1" fill="#93c5fd"/>
                <rect x="3" y="19" width="6" height="6" rx="1" fill="#bfdbfe"/>
                <rect x="11" y="19" width="6" height="6" rx="1" fill="#bfdbfe"/>
                <rect x="19" y="19" width="6" height="6" rx="1" fill="#bfdbfe"/>
                <rect x="27" y="19" width="6" height="6" rx="1" fill="#bfdbfe"/>
              </svg>
              <span>Download QR Handout</span>
            </a>
          </div>
          <h1 style={{ fontSize:22, fontWeight:800, margin:"0 0 4px", lineHeight:1.3 }}>Dermatology Condition Guide</h1>
          <p style={{ fontSize:14, color:"#93c5fd", margin:0 }}>Scan a QR code or browse all {CONDITIONS.length} conditions below.</p>
          <div style={{ marginTop:14 }}>
            <input type="text" value={query} onChange={function(e){setQuery(e.target.value)}} placeholder="Search conditions..." style={{ width:"100%", padding:"10px 16px", borderRadius:12, border:"1px solid rgba(255,255,255,0.25)", backgroundColor:"rgba(255,255,255,0.15)", color:"#fff", fontSize:14, outline:"none", boxSizing:"border-box" }} />
          </div>
        </div>
      </div>
      <div style={{ maxWidth:1200, margin:"0 auto", padding:"14px 16px 0" }}>
        <div style={{ display:"flex", flexWrap:"wrap", gap:8, marginBottom:16 }}>
          {CATEGORIES.map(function(cat) {
            var active = catFilter === cat.filter;
            return (
              <button key={cat.label} onClick={function(){setCatFilter(cat.filter)}} style={{ padding:"8px 16px", borderRadius:999, border: active ? "2px solid #1e40af" : "1px solid #d1d5db", backgroundColor: active ? "#1e40af" : "#fff", color: active ? "#fff" : "#374151", fontSize:13, fontWeight:600, cursor:"pointer" }}>{cat.label}</button>
            );
          })}
        </div>
      </div>
      <div style={{ maxWidth:1200, margin:"0 auto", padding:"0 16px 32px" }}>
        <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fill, minmax(180px, 1fr))", gap:10 }}>
          {filtered.map(function(condition) {
            return (
              <ConditionTile key={condition.id} condition={condition} onSelect={onSelect} hoveredId={hoveredId} setHoveredId={setHoveredId} />
            );
          })}
        </div>
        {filtered.length === 0 && (
          <div style={{ textAlign:"center", padding:"48px 0" }}>
            <p style={{ fontSize:14, color:"#6b7280", fontWeight:500 }}>No conditions found</p>
            <p style={{ fontSize:12, color:"#9ca3af", marginTop:4 }}>Try a different search term or category</p>
          </div>
        )}
      </div>
      <Footer onNavigate={onNavigate} />
    </div>
  );
}

function Footer({ onNavigate }) {
  var linkStyle = { color:"#6b7280", textDecoration:"none", fontSize:13, cursor:"pointer", background:"none", border:"none", padding:0, fontFamily:"inherit" };
  return (
    <div style={{ borderTop:"1px solid #e5e7eb", backgroundColor:"#f9fafb", padding:"24px 16px 32px", marginTop:40 }}>
      <div style={{ maxWidth:1200, margin:"0 auto", textAlign:"center" }}>
        <div style={{ display:"flex", justifyContent:"center", gap:24, flexWrap:"wrap", marginBottom:16 }}>
          <button onClick={function(){onNavigate("disclaimer")}} style={linkStyle}>Medical Disclaimer</button>
          <button onClick={function(){onNavigate("terms")}} style={linkStyle}>Terms of Use</button>
          <button onClick={function(){onNavigate("privacy")}} style={linkStyle}>Privacy Policy</button>
        </div>
        <p style={{ fontSize:12, color:"#9ca3af", margin:0 }}>{"\u00A9"} {new Date().getFullYear()} MyDermTerms.com. All rights reserved.</p>
        <p style={{ fontSize:11, color:"#d1d5db", margin:"6px 0 0" }}>This website is for educational purposes only and does not constitute medical advice.</p>
      </div>
    </div>
  );
}

function LegalPage({ title, onBack, onNavigate, children }) {
  return (
    <div style={{ minHeight:"100vh", backgroundColor:"#f9fafb", fontFamily:"-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" }}>
      <div style={{ position:"sticky", top:0, zIndex:10, backgroundColor:"rgba(255,255,255,0.95)", borderBottom:"1px solid #e5e7eb", backdropFilter:"blur(8px)" }}>
        <div style={{ maxWidth:800, margin:"0 auto", padding:"12px 16px", display:"flex", alignItems:"center", gap:12 }}>
          <button onClick={onBack} style={{ width:36, height:36, borderRadius:10, border:"none", backgroundColor:"#f3f4f6", cursor:"pointer", fontSize:18, display:"flex", alignItems:"center", justifyContent:"center" }}>{"<"}</button>
          <div style={{ flex:1, display:"flex", alignItems:"center", gap:8 }}>
            <LogoIcon size={28} />
            <span style={{ fontWeight:700, fontSize:14, color:"#111827" }}>MyDermTerms</span>
          </div>
        </div>
      </div>
      <div style={{ maxWidth:800, margin:"0 auto", padding:"32px 16px 20px" }}>
        <h1 style={{ fontSize:28, fontWeight:800, color:"#111827", margin:"0 0 24px" }}>{title}</h1>
        <div style={{ fontSize:15, color:"#374151", lineHeight:1.8 }}>{children}</div>
      </div>
      <Footer onNavigate={onNavigate} />
    </div>
  );
}

function DisclaimerPage({ onBack, onNavigate }) {
  return (
    <LegalPage title="Medical Disclaimer" onBack={onBack} onNavigate={onNavigate}>
      <p style={{ margin:"0 0 16px" }}><strong>Last updated:</strong> February 2026</p>
      <p style={{ margin:"0 0 16px" }}>The information provided on MyDermTerms.com is intended for general educational and informational purposes only. It is not intended to be, and should not be used as, a substitute for professional medical advice, diagnosis, or treatment.</p>
      <p style={{ margin:"0 0 16px" }}><strong>No Doctor-Patient Relationship.</strong> Use of this website does not create a doctor-patient or other healthcare professional relationship between you and MyDermTerms.com or any of its contributors.</p>
      <p style={{ margin:"0 0 16px" }}><strong>Not Medical Advice.</strong> The content on this site, including text, descriptions, images, and other materials, is provided for informational purposes only. Nothing on this website should be construed as medical advice or used to diagnose, treat, cure, or prevent any medical condition.</p>
      <p style={{ margin:"0 0 16px" }}><strong>Consult Your Physician.</strong> Always seek the advice of a qualified dermatologist or other healthcare provider with any questions you may have regarding a medical condition. Never disregard professional medical advice or delay in seeking it because of something you have read on this website.</p>
      <p style={{ margin:"0 0 16px" }}><strong>No Guarantees.</strong> While we strive to provide accurate and up-to-date information, MyDermTerms.com makes no representations or warranties of any kind, express or implied, about the completeness, accuracy, reliability, suitability, or availability of the information contained on this website.</p>
      <p style={{ margin:"0 0 16px" }}><strong>Emergency Situations.</strong> If you think you may have a medical emergency, call your doctor or emergency services immediately. MyDermTerms.com does not recommend or endorse any specific tests, physicians, products, procedures, opinions, or other information that may be mentioned on the site.</p>
      <p style={{ margin:"0 0 16px" }}><strong>Limitation of Liability.</strong> In no event shall MyDermTerms.com, its owners, contributors, or affiliates be liable for any direct, indirect, incidental, consequential, or punitive damages arising out of your access to, use of, or reliance on any information provided on this website.</p>
      <p style={{ margin:"0 0 0" }}><strong>Use at Your Own Risk.</strong> Your use of any information or materials on this website is entirely at your own risk. You assume full responsibility for any decisions or actions you take based on the information provided.</p>
    </LegalPage>
  );
}

function TermsPage({ onBack, onNavigate }) {
  return (
    <LegalPage title="Terms of Use" onBack={onBack} onNavigate={onNavigate}>
      <p style={{ margin:"0 0 16px" }}><strong>Last updated:</strong> February 2026</p>
      <p style={{ margin:"0 0 16px" }}>Welcome to MyDermTerms.com. By accessing or using this website, you agree to be bound by these Terms of Use. If you do not agree to these terms, please do not use this website.</p>
      <p style={{ margin:"0 0 16px" }}><strong>1. Acceptance of Terms.</strong> By using MyDermTerms.com, you acknowledge that you have read, understood, and agree to be bound by these Terms of Use and our Privacy Policy. We reserve the right to modify these terms at any time, and your continued use of the site constitutes acceptance of any changes.</p>
      <p style={{ margin:"0 0 16px" }}><strong>2. Purpose and Use.</strong> This website provides general educational information about dermatological conditions and procedures. The content is intended solely for informational purposes and is not a substitute for professional medical advice, diagnosis, or treatment. You may use this site for personal, non-commercial educational purposes only.</p>
      <p style={{ margin:"0 0 16px" }}><strong>3. Intellectual Property.</strong> All content on this website, including text, graphics, logos, icons, images, and software, is the property of MyDermTerms.com or its content suppliers and is protected by copyright and intellectual property laws. You may not reproduce, distribute, modify, or create derivative works from any content without prior written consent.</p>
      <p style={{ margin:"0 0 16px" }}><strong>4. No Medical Advice.</strong> As described in our Medical Disclaimer, nothing on this site constitutes medical advice. Always consult a qualified healthcare professional for medical questions and decisions.</p>
      <p style={{ margin:"0 0 16px" }}><strong>5. User Conduct.</strong> You agree not to: (a) use the site for any unlawful purpose; (b) attempt to gain unauthorized access to any part of the site; (c) interfere with or disrupt the site or its servers; (d) reproduce or scrape content for commercial purposes without permission; or (e) transmit any harmful code or materials.</p>
      <p style={{ margin:"0 0 16px" }}><strong>6. Third-Party Links and Advertising.</strong> This site may contain links to third-party websites or display advertisements. We are not responsible for the content, privacy practices, or policies of any third-party sites. The inclusion of any link or advertisement does not imply endorsement by MyDermTerms.com.</p>
      <p style={{ margin:"0 0 16px" }}><strong>7. Disclaimer of Warranties.</strong> This website is provided on an "as is" and "as available" basis. MyDermTerms.com makes no warranties, express or implied, regarding the site's operation, content accuracy, or availability. We do not warrant that the site will be uninterrupted, error-free, or free of harmful components.</p>
      <p style={{ margin:"0 0 16px" }}><strong>8. Limitation of Liability.</strong> To the fullest extent permitted by law, MyDermTerms.com and its owners, contributors, and affiliates shall not be liable for any damages of any kind arising from the use of, or inability to use, this website, including but not limited to direct, indirect, incidental, punitive, and consequential damages.</p>
      <p style={{ margin:"0 0 16px" }}><strong>9. Indemnification.</strong> You agree to indemnify, defend, and hold harmless MyDermTerms.com and its owners, contributors, and affiliates from any claims, losses, damages, liabilities, and expenses arising out of your use of the website or violation of these Terms.</p>
      <p style={{ margin:"0 0 16px" }}><strong>10. Governing Law.</strong> These Terms of Use shall be governed by and construed in accordance with the laws of the United States. Any disputes arising under these terms shall be resolved in the courts of competent jurisdiction.</p>
      <p style={{ margin:"0 0 0" }}><strong>11. Contact.</strong> If you have questions about these Terms of Use, please contact us through the website.</p>
    </LegalPage>
  );
}

function PrivacyPage({ onBack, onNavigate }) {
  return (
    <LegalPage title="Privacy Policy" onBack={onBack} onNavigate={onNavigate}>
      <p style={{ margin:"0 0 16px" }}><strong>Last updated:</strong> February 2026</p>
      <p style={{ margin:"0 0 16px" }}>MyDermTerms.com is committed to protecting your privacy. This Privacy Policy describes how we collect, use, and safeguard information when you visit our website.</p>
      <p style={{ margin:"0 0 16px" }}><strong>1. Information We Collect.</strong> We do not currently require users to create accounts or provide personal information to use this site. However, we may collect certain non-personal information automatically, including: browser type and version, operating system, referring URLs, pages visited and time spent, IP address (anonymized where possible), and device type.</p>
      <p style={{ margin:"0 0 16px" }}><strong>2. How We Use Information.</strong> Any information collected is used solely to: improve the functionality and content of our website, analyze usage patterns and site performance, and ensure the security and integrity of our site.</p>
      <p style={{ margin:"0 0 16px" }}><strong>3. Cookies and Tracking Technologies.</strong> This site may use cookies and similar tracking technologies to enhance your browsing experience. Cookies are small data files stored on your device. You can control cookie settings through your browser preferences. Third-party services such as analytics providers or advertising networks may also place cookies on your device when you visit our site.</p>
      <p style={{ margin:"0 0 16px" }}><strong>4. Third-Party Advertising.</strong> We may display advertisements from third-party advertising networks on our site. These networks may use cookies, web beacons, or similar technologies to collect information about your visits to this and other websites in order to provide relevant advertisements. We do not control these third-party tracking technologies. Please refer to the respective privacy policies of any third-party advertisers for more information.</p>
      <p style={{ margin:"0 0 16px" }}><strong>5. Data Sharing.</strong> We do not sell, trade, or otherwise transfer your personal information to outside parties, except: when required by law or to respond to legal process; to protect the rights, property, or safety of MyDermTerms.com or others; or with service providers who assist in site operations, subject to confidentiality agreements.</p>
      <p style={{ margin:"0 0 16px" }}><strong>6. Data Security.</strong> We implement reasonable security measures to protect against unauthorized access to or alteration of information. However, no method of electronic transmission or storage is 100% secure, and we cannot guarantee absolute security.</p>
      <p style={{ margin:"0 0 16px" }}><strong>7. Children's Privacy.</strong> This website is not directed at children under the age of 13. We do not knowingly collect personal information from children under 13. If we become aware that we have collected such information, we will take steps to delete it promptly.</p>
      <p style={{ margin:"0 0 16px" }}><strong>8. External Links.</strong> Our site may contain links to other websites. We are not responsible for the privacy practices of these external sites and encourage you to read their privacy policies.</p>
      <p style={{ margin:"0 0 16px" }}><strong>9. Changes to This Policy.</strong> We may update this Privacy Policy from time to time. Changes will be posted on this page with an updated revision date. Your continued use of the site after any changes constitutes acceptance of the updated policy.</p>
      <p style={{ margin:"0 0 0" }}><strong>10. Contact Us.</strong> If you have questions or concerns about this Privacy Policy, please contact us through the website.</p>
    </LegalPage>
  );
}

function getInitialState() {
  var path = window.location.pathname;
  if (path.indexOf("/condition/") === 0) {
    var slug = path.replace("/condition/", "").replace(/\/$/, "");
    var found = CONDITIONS.find(function(c) { return c.id === slug; });
    if (found) return { active: found, page: null };
  }
  if (path === "/disclaimer") return { active: null, page: "disclaimer" };
  if (path === "/terms") return { active: null, page: "terms" };
  if (path === "/privacy") return { active: null, page: "privacy" };
  return { active: null, page: null };
}

export default function MyDermTerms() {
  var init = getInitialState();
  var _s = useState(init.active);
  var active = _s[0]; var setActive = _s[1];
  var _p = useState(init.page);
  var page = _p[0]; var setPage = _p[1];

  useEffect(function() {
    function onPopState() {
      var state = getInitialState();
      setActive(state.active);
      setPage(state.page);
      window.scrollTo(0, 0);
    }
    window.addEventListener("popstate", onPopState);
    return function() { window.removeEventListener("popstate", onPopState); };
  }, []);

  // Dynamic SEO: update page title and meta description based on current view
  useEffect(function() {
    var metaDesc = document.querySelector('meta[name="description"]');
    if (active) {
      document.title = active.conditionName + " — MyDermTerms.com";
      if (metaDesc) metaDesc.setAttribute("content", active.description.substring(0, 160));
    } else if (page === "disclaimer") {
      document.title = "Medical Disclaimer — MyDermTerms.com";
      if (metaDesc) metaDesc.setAttribute("content", "Medical disclaimer for MyDermTerms.com. This site is for educational purposes only.");
    } else if (page === "terms") {
      document.title = "Terms of Use — MyDermTerms.com";
      if (metaDesc) metaDesc.setAttribute("content", "Terms of use for MyDermTerms.com dermatology condition guide.");
    } else if (page === "privacy") {
      document.title = "Privacy Policy — MyDermTerms.com";
      if (metaDesc) metaDesc.setAttribute("content", "Privacy policy for MyDermTerms.com.");
    } else {
      document.title = "MyDermTerms.com \u2014 Dermatology Condition Guide";
      if (metaDesc) metaDesc.setAttribute("content", "MyDermTerms - Your dermatology condition guide. Browse " + CONDITIONS.length + " skin conditions with symptoms, care instructions, and QR code handouts.");
    }
  }, [active, page]);

  function updateUrl(path) {
    window.history.pushState(null, "", path);
  }

  function handleNavigate(pg) {
    setActive(null);
    setPage(pg);
    updateUrl("/" + pg);
    window.scrollTo(0, 0);
  }

  function handleSelect(condition) {
    setActive(condition);
    updateUrl("/condition/" + condition.id);
    window.scrollTo(0, 0);
  }

  function handleBackToHome() {
    setActive(null);
    setPage(null);
    updateUrl("/");
  }

  if (page === "disclaimer") {
    return <DisclaimerPage onBack={function(){setPage(null);updateUrl("/")}} onNavigate={handleNavigate} />;
  }
  if (page === "terms") {
    return <TermsPage onBack={function(){setPage(null);updateUrl("/")}} onNavigate={handleNavigate} />;
  }
  if (page === "privacy") {
    return <PrivacyPage onBack={function(){setPage(null);updateUrl("/")}} onNavigate={handleNavigate} />;
  }
  if (active) {
    return <ConditionPage condition={active} onBack={handleBackToHome} onNavigate={handleNavigate} />;
  }
  return <ConditionList onSelect={handleSelect} onNavigate={handleNavigate} />;
}
