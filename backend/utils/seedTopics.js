const Topic = require("../models/Topic");

const defaultTopics = [
  {
    title: "Morning Ride",
    difficulty: "easy",
    content:
      "The sun is up and the road is clear. I start my bike and check the lights. The helmet feels safe and the jacket keeps me warm. I ride slowly through the quiet street. Birds sing near the trees. A small shop sells tea and bread. I wave to a friend and keep going. The wind is soft on my face. I stop at a red light and wait. Green comes soon and I move again. The city wakes up with cars and people. I take a turn toward the park. Kids play and dogs run on the grass. I park near a bench and rest. Later I ride home with a smile. Simple days like this make riding fun. I clean the bike and put it away. Tomorrow I will ride again. Stay safe, stay calm, and enjoy every mile.",
  },
  {
    title: "City Streets",
    difficulty: "easy",
    content:
      "The city is busy but I stay focused. I look left and right before I move. Buses stop and start. Bikes wait in a line. I keep space around my motorcycle. A horn sounds far away. I do not rush. The road has marks that guide me. I follow them and stay in my lane. Rain starts to fall in small drops. I slow down and hold the bars well. Lights shine on the wet street. I reach the bridge and cross with care. On the other side a bakery smells sweet. I buy a snack and drink water. Then I ride back before night. Home is close now. I park, lock the bike, and go inside. A good ride is a safe ride. That is the rule I keep every day.",
  },
  {
    title: "Friends and Fun",
    difficulty: "easy",
    content:
      "My friends meet me at the corner. We put on helmets and start together. We ride to the lake for a picnic. The path is wide and the air is fresh. We talk about school, work, and games. One friend brings fruit. Another brings juice. We sit under a tree and laugh. After lunch we walk by the water. Fish jump and ducks swim. Then we ride home in a small group. We keep a safe distance. We use signals at each turn. No one speeds. No one shows off. We just enjoy the trip. At the end we say goodbye. I feel happy and tired. Riding with friends is better when we all stay kind and careful. That is how we have fun on the road.",
  },
  {
    title: "Learn to Type",
    difficulty: "easy",
    content:
      "Typing is a useful skill. Sit tall and keep your hands relaxed. Place your fingers on the home keys. Look at the screen, not the keyboard. Type short words first. Then try longer sentences. If you make a mistake, slow down. Accuracy is more important than speed at the start. Practice a little every day. Soon your fingers will remember the path. You can write notes, emails, and stories. In this game, typing also moves your bike. Fast and correct typing helps you win. Wrong keys slow you down. Stay calm and keep going. One letter at a time. That is how you grow. Soon you will type with ease and ride with pride.",
  },
  {
    title: "Weekend Trip",
    difficulty: "easy",
    content:
      "On Saturday I pack a small bag. I take a map, a bottle, and a snack. The weather is warm and bright. I ride out of town toward the hills. The road curves but it is not hard. Flowers grow by the fence. A farmer waves from a field. I stop at a viewpoint and look far. The valley is green. Clouds move slowly. I take a photo and rest. Then I ride to a village cafe. The soup is hot and the bread is fresh. I thank the cook and leave a tip. On the way back the sky turns gold. I reach home before dark. I wash the bike and charge my phone. A simple trip can fill a whole week with good memories. I already plan the next one.",
  },
  {
    title: "Track Discipline",
    difficulty: "medium",
    content:
      "A race is not only about speed. It is about control, timing, and respect for the machine. Before every session I inspect the tires, brakes, chain, and lights. I warm the engine and settle my mind. On the track I look ahead, not at the wheel in front of me. Corners reward patience. I brake in a straight line, turn smoothly, and open the throttle as the bike stands up. If I rush, I lose line and time. If I panic, I lose the race. Weather can change the grip in minutes, so I stay alert. After the session I write notes: what worked, what failed, and what to fix. Progress comes from honest review. Champions are built in quiet practice, not only under bright lights.",
  },
  {
    title: "Engine and Road",
    difficulty: "medium",
    content:
      "A motorcycle is a conversation between rider and road. The engine speaks through vibration. The tires speak through lean and slip. Your job is to listen early, before a small warning becomes a crash. Keep your visor clean. Keep your body loose but ready. In traffic, assume that some drivers will not see you. Leave an escape path. On open roads, watch for gravel, animals, and sudden wind near trucks. Maintenance is part of the ride: oil, coolant, pressure, and fasteners. A neglected bike will betray you at the worst moment. Skill grows when you repeat good habits until they feel natural. Then speed becomes a result, not a demand. That is the difference between a tourist and a rider who belongs on the road.",
  },
  {
    title: "Typing Under Pressure",
    difficulty: "medium",
    content:
      "Pressure changes everything. Your pulse rises, your fingers tighten, and simple words suddenly feel heavy. The trick is to treat each keystroke as a decision, not a panic. Breathe, reset your shoulders, and return to rhythm. Accuracy protects your score because errors cost more than a brief pause. Build a streak, then protect it. When a mistake appears, correct it without drama and continue. In TypeRider, that same calm converts into throttle. A messy burst of speed looks exciting, but a clean line wins the minute. Train with mixed sentences, numbers, and punctuation so the keyboard never surprises you. Confidence is not loud. It is the quiet feeling that you can recover. That is how you beat both the clock and the opponent.",
  },
  {
    title: "Night Circuit",
    difficulty: "medium",
    content:
      "Night racing has its own language. Floodlights paint the asphalt in silver strips, and the rest of the world falls into shadow. Depth is harder to judge, so markers and braking boards matter more than instinct. I roll in with a plan: first lap for sight, second for grip, third for attack. The black bike beside me flickers in and out of the glow. I do not chase headlights. I chase my own apex. When the timer starts, noise becomes a tunnel. I hear the engine, the wind, and the click of my visor. One clean sector can open a gap. One greedy corner can close it. The finish is not a surprise. It is the sum of a hundred small choices made in the dark.",
  },
  {
    title: "Garage Lessons",
    difficulty: "medium",
    content:
      "The garage is where races are quietly won. Torque wrenches, tire warmers, and notebooks sit beside coffee cups and spare gloves. I measure sag, check alignment, and clean the chain until it runs silent. Setup is a map of trade-offs. More front grip can steal rear drive. A stiffer spring can help a heavy rider and hurt a light one. We test, log, and refuse to guess when data is available. Mentors teach more than settings. They teach how to speak about a problem without blame. When the bike talks, we listen together. Then we go back out and verify. Glory belongs to Sunday, but Sunday is built on Tuesday nights when nobody is watching and the floor is covered in tools.",
  },
  {
    title: "Apex Theory",
    difficulty: "hard",
    content:
      "Velocity is a consequence of geometry, not a personality trait. The late apex is a contract: sacrifice a fragment of entry speed to purchase a longer, cleaner exit where horsepower can actually work. Trail braking knits deceleration into steering, transferring load to the front contact patch while the chassis rotates. Exceed that bargain and the front tucks; abandon it too early and you run wide, collecting the painted sausage curbs that punish ambition. Body position is not theatre. It is mass management. A still head, a loaded outside footpeg, and a relaxed inside arm keep the bike from wrestling itself. Data loggers reveal what pride conceals: you were not as committed as you felt, or you were committed in the wrong place. Mastery is the patience to be slightly slower until the line is true, then to be mercilessly fast once it is.",
  },
  {
    title: "Cognitive Throttle",
    difficulty: "hard",
    content:
      "Typing, like racing, is a closed-loop control problem. Perception, prediction, and correction must occur faster than conscious narration. Chunking converts letters into motor programs; rhythm converts anxiety into cadence. Accuracy is not a moral virtue here; it is signal integrity. Each substitution error injects noise that your downstream systems must filter, costing time and, in this arena, traction. A high streak is evidence that working memory and proprioception are aligned. Nitro, in game terms, is what engineers would call a temporary gain schedule: more output for a bounded window, paid for by prior stability. Chase it too greedily and you overshoot. Ignore it and you leave performance unused. The opponent's pace will breathe; yours should, too. The winning minute is the one in which you refuse both panic and complacency.",
  },
  {
    title: "Monsoon Grid",
    difficulty: "hard",
    content:
      "Rain rewrites the circuit. Standing water hides in the braking zone like a trapdoor; painted lines become glass; rubbered-in racing line, once a gift, becomes a liability. You hunt for the dull, dark asphalt that still bites. Throttle is applied as if the rear tire were a diplomatic negotiation. ABS and traction control are advisors, not saviors. Visibility collapses behind rooster tails, so you ride the gap, not the draft. In the garage, we change pressures, soften compression, and discuss whether intermediates are courage or vanity. A cautious first sector can buy a ruthless final lap if others throw their machines away. There is no poetry in a crash, only physics. The brave rider is not the one who ignores the wet; it is the one who reads it precisely and still dares to pass when the window is real.",
  },
  {
    title: "Heritage of Speed",
    difficulty: "hard",
    content:
      "Motorcycling's mythology is crowded with legends, yet the useful history is practical. Early machines taught balance before power; later decades taught that aero, electronics, and tire chemistry can outrun nostalgia. Still, the rider remains the irregular variable. Culture around the paddock matters: mechanics who tell the truth, teammates who share a setup without surrendering identity, and rivals who raise the standard without sabotage. Sponsorship can fund a season or distort it. The clock does not care about narratives, but audiences do, and a sport without spectators withers. Between those pressures, the craft persists: a human, a motorcycle, and a strip of asphalt asking the same question every weekend. Can you be precise when it counts? That question is older than carbon fiber and younger than the next qualifying lap.",
  },
  {
    title: "Precision Language",
    difficulty: "hard",
    content:
      "Language, like a racetrack, rewards commitment to a line. Punctuation is braking. Clauses are gears. A semicolon is a chicane that keeps two ideas in conversation without a full stop. Vague verbs leak time; concrete ones drive. When you type under a countdown, ornament becomes drag. Prefer the exact noun, the honest verb, and the necessary comma. Numbers, quotations, and parentheses appear as hazards that still belong on the course; skip them and you are no longer riding the given text. The mind wants to predict the next word; the fingers must wait for the character that is actually there. That tension, held without tremor, is fluency. In TypeRider it also becomes velocity: clean transcription, rising speed, and a red motorcycle that finally refuses to be caught.",
  },
];

async function seedDefaultTopics() {
  const count = await Topic.countDocuments();
  if (count > 0) {
    return { seeded: false, count };
  }

  await Topic.insertMany(defaultTopics.map((topic) => ({ ...topic, isActive: true })));
  return { seeded: true, count: defaultTopics.length };
}

module.exports = { seedDefaultTopics, defaultTopics };
