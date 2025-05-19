const dotdev = document.getElementById("dotdev");

const intro = ".dev";
let currentPhrase = intro;
let currentChar = 0;
let isDeleting = false;
let started = false;
let lastPhrase = "";

const seasonalPhrases = {
  spring: [
    " (blooming)",
    " :flower:",
    ": fresh!",
    ": new start!",
    ": chirp~",
    " blooming <3",
    ": fresh start!",
    " :tulip:",
    ": growing!",
    ": april showers~",
    ": sunny days!",
    ": birdsong!",
    ": green vibes",
    ": sprouts!",
    ": dewdrops",
    ": budding!",
    ": rain dance",
    " :cherry_blossom:",
    ": springtime!",
    ": renewal!",
    ": awakening~",
    ": fresh air!",
    ": pastel mood",
    ": garden time",
    ": rainbow after rain"
  ],
  summer: [
    " :sun:",
    ": is hot!",
    ": beach++",
    ": sunglasses on.",
    ": poolside!",
    ": ice cream!",
    ": golden hour",
    ": camp vibes",
    ": BBQ time!",
    ": vacation mode",
    ": tan lines",
    ": fireflies!",
    ": sunset!",
    ": hammock life",
    ": flip flops",
    ": beach hair",
    ": lemonade!",
    ": watermelon!",
    ": road trip!",
    ": adventure!",
    ": stargazing",
    ": night swim",
    ": festival!",
    ": sundress!"
  ],
  autumn: [
    " :leaves:",
    ": cozy~",
    ": hoodie szn",
    ": pumpkin!",
    " leaves++",
    ": sweater weather",
    ": pumpkin spice!",
    ": apple picking",
    ": cinnamon!",
    ": amber vibes",
    ": hayrides!",
    ": bonfire!",
    ": flannel!",
    ": harvest!",
    ": gratitude!",
    ": golden leaves",
    ": crisp air",
    ": corn maze",
    ": acorns!",
    ": thanksgiving!",
    ": scarf season",
    ": apple cider",
    ": pie time!",
    ": football!",
    ": cozy reads"
  ],
  winter: [
    " :snow:",
    ": is chilly!",
    " cocoa <3",
    ": brrr!",
    ": snowww",
    ": hot chocolate!",
    ": fireplace!",
    ": mittens!",
    ": sledding!",
    ": frosted!",
    ": holiday spirit!",
    ": twinkle lights",
    ": ice skating",
    ": snow angels",
    ": cabin vibes",
    ": wool socks",
    ": frozen!",
    ": icicles!",
    ": winter wonderland",
    ": snuggle time",
    ": cookies!",
    ": candlelight",
    ": ski slopes",
    ": fresh powder",
    ": frosty morning"
  ],
  neutral: [
    " (he/him)",
    " <3",
    " ^^",
    " is cool!",
    " loves code!",
    "!!!!",
    "++",
    "~",
    ".exe",
    "; 404!",
    " is dreaming~",
    " is typing...",
    ": moo!",
    ".dev",
    " :3",
    ": meow!",
    "; debugging...",
    "; git commit",
    "; npm install",
    "; sudo happy",
    "; ctrl+z",
    "; recursive!",
    "; async/await",
    ": hello world!",
    "; binary dreams",
    "; pixel perfect",
    "; stack overflow",
    "; merge conflict",
    "; 200 OK!",
    "; cache cleared",
    "; compiled!",
    "; deployed!",
    "; responsive!",
    "; authenticated",
    "; refactored!",
    "; optimized!",
    "; validated!",
    "; encrypted!",
    "; localhost",
    "; full-stack!",
    "; open source",
    "; version 2.0",
    "; beta testing",
    "; light mode",
    "; dark mode",
    "; accessibility+",
    "; performance++",
    "; clean code",
    "; code review",
    "; rubber duck",
    "; caffeine.exe",
    "; sleep() needed",
    "; weekend.load()",
    "; motivation.push()",
    "; energy.pop()",
    "; focus.set(true)",
    "; creativity.max()",
    "; inspiration.find()",
    "; dreams.render()",
    "; goals.achieve()",
    "; success.await()",
    "; happiness.call()",
    "; adventure.start()",
    "; memory.create()",
    "; smile.trigger()",
    "; laugh.repeat()",
    "; hugs.available()",
    "; friendship.connect()",
    "; love.compile()",
    "; hope.execute()",
    "; magic.happen()",
    "; wonder.explore()",
    "; curiosity.peek()",
    "; learning.continue()",
    "; growing.always()",
    "; evolving.constantly()",
    "; creating.forever()",
    ": needs coffee",
    "; caffeine loading...",
    ": pizza time!",
    ": snack break!",
    ": nom nom",
    ": you got this!",
    ": keep going!",
    ": never give up!",
    ": dream big!",
    ": unstoppable!",
    ": // TODO: fix this???"
  ],
  halloween: [
    " :pumpkin:!",
    ": spooked!",
    ": boo~",
    " :candy:",
    " :ghost:",
    ": trick or treat!",
    ": spooky szn",
    ": witchy vibes",
    ": haunted!",
    ": eerie!",
    ": ghostly!",
    ": creepy cute",
    ": midnight!",
    ": full moon",
    ": black cat!",
    ": spider web",
    ": skeleton dance",
    ": zombie walk",
    ": vampire bite",
    ": monster mash",
    ": pumpkin patch",
    ": cauldron bubble",
    ": spell casting",
    ": haunted house",
    ": graveyard shift"
  ],
  pride: [
    ": u r valid!",
    " pride <3",
    ": love wins!",
    ": diversity!",
    ": inclusion!",
    ": equality!",
    ": visibility!",
    ": solidarity!",
    ": chosen family",
    ": brave & true",
    ": fierce!",
    ": fabulous!",
    ": proud always",
    ": love is love",
    ": be yourself!",
    ": shine bright",
    ": unapologetic"
  ],
  birthday: [
    ": birthday!",
    ": cake time!",
    ": wishes!",
    ": another year!",
    ": celebration!",
    ": party mode!",
    ": confetti!",
    ": candles!",
    ": growing up!",
    ": special day!",
    ": getting older!",
    ": party hat on!",
    ": balloon fest!",
    ": age++",
    ": birthday magic",
    ": surprise party!",
    ": birthday boy!",
    ": turning ${age}! ",
    ": birthday blessings",
    ": cake & ice cream!",
    ": birthday fun!"
  ],
  newyears: [
    ": new year!",
    ": resolutions!",
    ": countdown!",
    ": champagne!",
    ": new beginnings",
    ": goals set!",
    ": year++",
    ": auld lang syne",
    ": fireworks!",
    ": new chapter",
    ": resolution.exe",
    ": midnight kiss",
    ": ball drop!",
    ": 365 days!",
    ": clean slate",
    ": new adventures",
    ": hope rising",
    ": fresh dreams",
    ": year.reset()",
    ": possibilities!",
    ": time to grow",
    ": new horizon"
  ],
  christmas: [
    ": merry christmas!",
    ": santa's coming!",
    ": jingle bells!",
    ": cookies for santa",
    ": christmas magic!",
    ": present time!",
    ": ho ho ho!",
    " :christmas_tree:",
    ": milk & cookies",
    ": wrapping gifts",
    ": christmas eve!",
    ": stockings hung",
    ": holiday cheer",
    ": family time!",
    ": cozy christmas",
    ": snowflakes!",
    ": hot cocoa",
    ": christmas lights",
    ": deck the halls",
    ": peace on earth",
    ": joy to the world",
    ": silent night",
    ": christmas spirit",
    ": reindeer games",
    ": mistletoe!",
    ": christmas cookies",
    ": holiday movies"
  ]
};

function getSeasonOrEvent() {
  const now = new Date();
  const month = now.getMonth(); // 0 = Jan; 11 = Dec
  const date = now.getDate();

  if (month === 11 && date >= 20 && date <= 26) return "christmas";
  if ((month === 11 && date >= 26) || (month === 0 && date <= 7)) return "newyears";
  if (month === 3 && date === 5) return "birthday";
  
  if (month === 5) return "pride";
  if (month === 9) return "halloween";
  
  if (month >= 2 && month < 5) return "spring";
  if (month >= 5 && month < 8) return "summer";
  if (month >= 8 && month < 11) return "autumn";
  
  return "winter";
}

function pickRandomPhrase(season) {
  const pool = [
    ...(seasonalPhrases[season] || []),
    ...seasonalPhrases.neutral,
  ];
  let phrase;
  do {
    phrase = pool[Math.floor(Math.random() * pool.length)];
  } while (phrase === lastPhrase);
  lastPhrase = phrase;
  return phrase;
}

function typeEffect() {
  const display = currentPhrase.slice(0, currentChar);
  dotdev.textContent = display;

  let speed = isDeleting ? 35 : 100;

  if (!isDeleting && currentChar === currentPhrase.length) {
    speed = 7000;
    isDeleting = true;
  } else if (isDeleting && currentChar === 0) {
    isDeleting = false;
    started = true;
    currentPhrase = started ? pickRandomPhrase(getSeasonOrEvent()) : intro;
    speed = 1000;
  } else {
    currentChar += isDeleting ? -1 : 1;
  }

  setTimeout(typeEffect, speed);
}
typeEffect();