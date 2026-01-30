import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const quotes = [
  { text: "Me fail English? That's unpossible!", season: 6, episode: 8 },
  { text: "Hi, Super Nintendo Chalmers!", season: 5, episode: 19 },
  { text: "I'm learnding!", season: 5, episode: 19 },
  { text: "My cat's breath smells like cat food.", season: 4, episode: 15 },
  { text: "I bent my wookie.", season: 7, episode: 4 },
  { text: "I picked the purple one!", season: 3, episode: 16 },
  { text: "That's where I saw the leprechaun. He tells me to burn things.", season: 10, episode: 20 },
  { text: "My daddy shoots people!", season: 3, episode: 18 },
  { text: "I'm a furniture!", season: 11, episode: 22 },
  { text: "I'm Idaho!", season: 5, episode: 19 },
  { text: "My parents won't let me use scissors.", season: 8, episode: 25 },
  { text: "When I grow up, I'm going to Bovine University!", season: 6, episode: 22 },
  { text: "Sleep! That's where I'm a Viking!", season: 8, episode: 4 },
  { text: "I found a moon rock in my nose!", season: 5, episode: 8 },
  { text: "Mrs. Krabappel and Principal Skinner were in the closet making babies and I saw one of the babies and the baby looked at me!", season: 5, episode: 19 },
  { text: "The doctor said I wouldn't have so many nosebleeds if I kept my finger outta there.", season: 5, episode: 19 },
  { text: "I'm a unitard!", season: 16, episode: 14 },
  { text: "Principal Skinner, I got carsick in your office.", season: 6, episode: 22 },
  { text: "My knob tastes funny.", season: 6, episode: 19 },
  { text: "I'm pedaling backwards!", season: 9, episode: 5 },
  { text: "Look, Big Daddy, it's regular Daddy!", season: 11, episode: 22 },
  { text: "Daddy says I'm this close to being an only child.", season: 14, episode: 21 },
  { text: "Go banana!", season: 6, episode: 22 },
  { text: "The pointy kitty took it!", season: 6, episode: 10 },
  { text: "I dress myself!", season: 5, episode: 19 },
  { text: "It tastes like burning!", season: 8, episode: 11 },
  { text: "I love Lisa Simpson, and when I grow up, I'm going to marry her!", season: 4, episode: 15 },
  { text: "My face is on fire!", season: 12, episode: 7 },
  { text: "I ated the purple berries!", season: 5, episode: 6 },
  { text: "Slow down, Bart! My legs don't know how to be as long as yours.", season: 5, episode: 19 },
  { text: "I heard your dad went into a restaurant, and ate all the food in the restaurant, and they had to close the restaurant.", season: 7, episode: 7 },
  { text: "I'm gonna be a triangle!", season: 13, episode: 17 },
  { text: "Oh boy, sleep! That's where I'm a Viking!", season: 8, episode: 4 },
  { text: "What's a battle?", season: 5, episode: 19 },
  { text: "Even I knew that!", season: 6, episode: 8 },
  { text: "Can you open my milk, Mommy?", season: 6, episode: 10 },
  { text: "Daddy, I'm scared. Too scared to even wet my pants.", season: 5, episode: 6 },
  { text: "Hi, Lisa! Hi, Super Nintendo Chalmers!", season: 5, episode: 19 },
  { text: "Chocolate microscopes!", season: 14, episode: 21 },
  { text: "I want to be a horse!", season: 15, episode: 21 },
  { text: "My worm went in my mouth and then I ate it. Can I have a new one?", season: 5, episode: 19 },
  { text: "Yay! I'm a failure!", season: 17, episode: 21 },
  { text: "Your hair's flammable!", season: 15, episode: 9 },
  { text: "I'm still in love with milhouse!", season: 19, episode: 8 },
  { text: "Brush teeth, then mouthwash, or mouthwash, then brush teeth?", season: 15, episode: 21 },
  { text: "I'm not popular enough to be different!", season: 11, episode: 22 },
  { text: "I eated the purple berries! They taste like... burning.", season: 7, episode: 3 },
  { text: "What's a diorama?", season: 5, episode: 19 },
  { text: "I found a penny!", season: 6, episode: 8 },
  { text: "That's my sandbox, I'm not allowed to go in the deep end.", season: 5, episode: 19 },
];

async function main() {
  console.log("Seeding database with Ralph Wiggum quotes...");

  // Clear existing quotes and votes
  await prisma.vote.deleteMany();
  await prisma.quote.deleteMany();

  // Insert quotes
  const result = await prisma.quote.createMany({
    data: quotes,
  });

  console.log(`Seeded ${String(result.count)} quotes successfully!`);
}

main()
  .catch((e: unknown) => {
    console.error("Error seeding database:", e);
    process.exit(1);
  })
  .finally(() => {
    void prisma.$disconnect();
  });
