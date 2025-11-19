type JerseyEntry = {
  number: number;
  names: string[];
};

const canonicalSuffixes = new Set(['jr', 'sr', 'ii', 'iii', 'iv', 'v']);

export const normalizePlayerName = (name: string): string => {
  if (!name) {
    return '';
  }

  const tokens = name
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, ' ')
    .split(' ')
    .map(token => token.trim())
    .filter(Boolean)
    .filter(token => token.length > 1 || canonicalSuffixes.has(token));

  tokens.sort();
  return tokens.join(' ');
};

const rawEntries: JerseyEntry[] = [
  { number: 0, names: ['Dalin Afu', 'Dalin N. Afu'] },
  { number: 1, names: ['David Dean', 'David B. Dean'] },
  { number: 2, names: ['Gunner Michaelis', 'Gunner B. Michaelis'] },
  { number: 3, names: ['Jackson Theobald', 'Jackson K. Theobald'] },
  { number: 4, names: ['Corbin Bauerle', 'Corbin D. Bauerle'] },
  { number: 5, names: ['Noah Behm', 'Noah H. Behm'] },
  { number: 6, names: ['Beckham Rees', 'Beckham B. Rees'] },
  { number: 7, names: ['Derek Manning', 'Derek R. Manning'] },
  { number: 8, names: ['Christian Hanshaw'] },
  { number: 9, names: ['Dyson Richards'] },
  { number: 10, names: ['Prince Afu'] },
  { number: 11, names: ['Damian Wilkinson', 'Damian C. Wilkinson'] },
  { number: 12, names: ['Sawyer Hayward', 'Sawyer R. Hayward'] },
  { number: 13, names: ['Preston Fairbanks', 'Preston J. Fairbanks'] },
  { number: 14, names: ['Jack Reutzel'] },
  { number: 15, names: ['Ocean Bishop', 'Ocean T. Bishop'] },
  { number: 16, names: ['Owen Gardner', 'Owen D. Gardner'] },
  { number: 17, names: ['Nate Childs', 'Nathan B. Childs'] },
  { number: 18, names: ['Kapono Manuela', 'Kapono R. Manuela'] },
  { number: 19, names: ['Hayden Reutzel', 'Hayden D. Reutzel'] },
  { number: 20, names: ['Luke Broadbent', 'Luke O. Broadbent'] },
  { number: 21, names: ['Andrew Aaron', 'Andrew M. Aaron'] },
  { number: 23, names: ['Latani Vaki', 'Latani H. Vaki'] },
  { number: 24, names: ['Maxon Degroot', 'Maxon J. DeGroot'] },
  { number: 25, names: ['Jett Prestwich', 'Jett J. Prestwich'] },
  { number: 26, names: ['Brady Belliston', 'Brady J. Belliston'] },
  { number: 27, names: ['Rhett Jensen'] },
  { number: 28, names: ['Madden Jensen', 'Madden S. Jensen'] },
  { number: 29, names: ['Lincoln Miller', 'Lincoln M. Miller'] },
  { number: 30, names: ['Max Larson', 'Maxwell A. Larson'] },
  { number: 31, names: ['Ziah Lueng-Wai', 'Ziah A. Leung-Wai'] },
  { number: 32, names: ['Ryker Tippets', 'Ryker F. Tippets'] },
  { number: 33, names: ['Carter Jorgensen', 'Carter J. Jorgenson'] },
  { number: 34, names: ['Jake Matsen'] },
  { number: 35, names: ['Samson Thompson', 'Samson N. Thompson'] },
  { number: 36, names: ['Mathew Nelson'] },
  { number: 37, names: ['Owen Peterson', 'Owen T. Peterson'] },
  { number: 38, names: ['Talon Willardson', 'Talon J. Willardson'] },
  { number: 39, names: ['Ty Wilson', 'Ty M. Wilson'] },
  { number: 40, names: ['Drew Greenwood'] },
  { number: 41, names: ['Levi Woods', 'Levi E. Woods'] },
  { number: 42, names: ['Mack Segura', 'Mack T. Segura'] },
  { number: 43, names: ['Trigg Camberlango', 'Trigg A. Camberlango'] },
  { number: 44, names: ['David Lambourne'] },
  { number: 45, names: ['Luke Vernon', 'Luke S. Vernon'] },
  { number: 46, names: ['Samuel Merten'] },
  { number: 50, names: ['Matthew Bowen', 'Matthew A. Bowen'] },
  {
    number: 51,
    names: ['Tuapasi Jr Uluilakepa', 'Tuapasi A. Uluilakepa Jr', 'Tuapasi Uluilakepa Jr'],
  },
  { number: 52, names: ['Xander Voeller', 'Xander D. Voeller'] },
  { number: 53, names: ['Mason Petersen', 'Mason T. Petersen'] },
  { number: 54, names: ['Kale Hansen'] },
  { number: 54, names: ['Josh Jackson', 'Joshua C. Jackson'] },
  { number: 55, names: ['Mitt Palmer'] },
  { number: 56, names: ['Logan Giles', 'Logan R. Giles'] },
  { number: 57, names: ['Madden Mack', 'Madden S. Mack'] },
  { number: 58, names: ['Aiden Genessy'] },
  { number: 59, names: ['Blake Averrett', 'Blake H. Averett'] },
  { number: 61, names: ['Dalin Afu', 'Dalin N. Afu'] },
  { number: 62, names: ['Hauati Schwenke'] },
  { number: 64, names: ['Tyler Andrus', 'Tyler R. Andrus'] },
  { number: 65, names: ["Jaybian Na'a", "Jaybian-Damani V. Na'a"] },
  { number: 66, names: ['McKay Christensen', 'Mckay Christensen'] },
  { number: 67, names: ['Collin Christensen', 'Collin J. Christensen'] },
  { number: 68, names: ['Elijah Chadwick'] },
  { number: 69, names: ['Jackson Chadwick', 'Jackson T. Chadwick'] },
  { number: 70, names: ['Carson Thorne', 'Carson A. Thorne'] },
  { number: 71, names: ['Ryan Dawson', 'Ryan J. Dawson'] },
  { number: 72, names: ['Cason Davis', 'Cason K. Davis'] },
  { number: 73, names: ['Nate Higley', 'Nathan S. Higley'] },
  { number: 76, names: ['Talon Roberts', 'Talon K. Roberts'] },
  { number: 77, names: ['Hudson Taylor', 'Hudson B. Taylor'] },
  { number: 79, names: ['Kaedin Laursen', 'Kaedin J. Laursen'] },
  { number: 80, names: ['Braylon Carroll', 'Braylon T. Carroll'] },
  { number: 81, names: ['Mason Brooks', 'Mason R. Brooks'] },
  { number: 82, names: ['Cash Taiese', 'Cash Talese', 'Cash T. Talese'] },
  { number: 84, names: ['Dayton Hansen', 'Dayton C. Hansen'] },
  { number: 85, names: ['Ty Holmstead'] },
  { number: 86, names: ['Octavious Luna'] },
  { number: 87, names: ['Rahim Matador'] },
  { number: 88, names: ['Zach Cowie', 'Zachary D. Cowie'] },
  { number: 89, names: ['Parker Pulley', 'Parker L. Pulley'] },
  { number: 90, names: ['Bodee Bond', 'Bodee N. Bond'] },
  { number: 91, names: ['Magnum Clark'] },
  { number: 92, names: ['Tyler Ellery'] },
  { number: 93, names: ['Ben Iongi'] },
  { number: 94, names: ['Riley Averett', 'Riley R. Averett'] },
  { number: 95, names: ['Zack Lewis', 'Zackary S. Lewis'] },
  { number: 96, names: ['Jace Worthington'] },
  { number: 97, names: ['Manatua Fano', 'Manatua J. Fano'] },
  { number: 98, names: ['Dylan Latu', 'Dylan S. Latu'] },
  { number: 99, names: ['Daedae Mausia', 'Eikipeavale T. Mausia'] },
];

export const jerseyNumberOptions: Record<string, number[]> = {};

rawEntries.forEach(entry => {
  entry.names.forEach(nameVariant => {
    const normalized = normalizePlayerName(nameVariant);
    if (!normalized) {
      return;
    }
    if (!jerseyNumberOptions[normalized]) {
      jerseyNumberOptions[normalized] = [];
    }
    if (!jerseyNumberOptions[normalized].includes(entry.number)) {
      jerseyNumberOptions[normalized].push(entry.number);
    }
  });
});

