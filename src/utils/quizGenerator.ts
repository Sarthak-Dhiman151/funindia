import airportData from '../data/airports.json';
import airforceData from '../data/airforce.json';
import floraFaunaData from '../data/florafauna.json';
import navyData from '../data/indianNavy.json';
import mountainData from '../data/mountain.json';

export interface Question {
  id: number;
  type: string;
  question: string;
  options: string[];
  correctAnswer: string;
  explanation?: string;
}

interface Airport {
  name: string;
  iata_code: string;
  city: string;
  funfact: string;
  state: string;
}

interface Aircraft {
  name: string;
  type: string;
  role: string[];
  funfact: string;
  origin: string;
}

let cachedAirports: Airport[] | null = null;
let cachedAircraft: Aircraft[] | null = null;

const getAllAirports = (): Airport[] => {
  if (cachedAirports) return cachedAirports;

  const airports: Airport[] = [];
  const data = airportData.indian_airports_funfacts;

  // Process States
  Object.entries(data.states).forEach(([state, stateData]) => {
    stateData.airports.forEach((airport: any) => {
      airports.push({ ...airport, state });
    });
  });

  // Process Union Territories
  Object.entries(data.union_territories).forEach(([ut, utData]) => {
    utData.airports.forEach((airport: any) => {
      airports.push({ ...airport, state: ut });
    });
  });

  cachedAirports = airports;
  return airports;
};

const getAllAircraft = (): Aircraft[] => {
  if (cachedAircraft) return cachedAircraft;

  const aircraft: Aircraft[] = [];
  const data = airforceData.indian_air_force.aircraft.currently_active;

  Object.values(data).forEach((list: any) => {
    list.forEach((item: any) => {
      aircraft.push(item);
    });
  });

  cachedAircraft = aircraft;
  return aircraft;
};

const shuffleArray = <T>(array: T[]): T[] => {
  const newArray = [...array];
  for (let i = newArray.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
  }
  return newArray;
};

export const generateQuestions = (count: number = 10, category: string = 'airports'): Question[] => {
  if (category === 'airforce') {
    return generateAirForceQuestions(count);
  } else if (category === 'florafauna') {
    return generateFloraFaunaQuestions(count);
  } else if (category === 'navy') {
    return generateNavyQuestions(count);
  } else if (category === 'mountains') {
    return generateMountainQuestions(count);
  }
  
  const allAirports = getAllAirports();
  const questions: Question[] = [];
  const usedIndices = new Set<number>();

  while (questions.length < count) {
    const index = Math.floor(Math.random() * allAirports.length);
    if (usedIndices.has(index)) continue;
    usedIndices.add(index);

    const airport = allAirports[index];
    
    // Check if the airport name contains the city name (e.g., "Jalgaon Airport" contains "Jalgaon")
    // If so, we shouldn't ask "Where is Jalgaon Airport?" or "Which airport serves Jalgaon?"
    const isObvious = airport.name.toLowerCase().includes(airport.city.toLowerCase());
    
    const validTypes = ['iata-to-city', 'city-to-iata'];
    if (!isObvious) {
      validTypes.push('city-to-airport', 'airport-to-city');
    }

    const selectedType = validTypes[Math.floor(Math.random() * validTypes.length)];
    
    let question: Question;
    const otherAirports = shuffleArray(allAirports.filter(a => a.name !== airport.name)).slice(0, 3);

    switch (selectedType) {
      case 'city-to-airport':
        question = {
          id: questions.length,
          type: 'city-to-airport',
          question: `Which airport serves the city of ${airport.city}?`,
          correctAnswer: airport.name,
          options: shuffleArray([airport.name, ...otherAirports.map(a => a.name)]),
          explanation: `${airport.name} serves ${airport.city}. \n\nDid you know? ${airport.funfact}`
        };
        break;
      case 'airport-to-city':
        question = {
          id: questions.length,
          type: 'airport-to-city',
          question: `Where is ${airport.name} located?`,
          correctAnswer: airport.city,
          options: shuffleArray([airport.city, ...otherAirports.map(a => a.city)]),
          explanation: `${airport.name} is located in ${airport.city}. \n\nDid you know? ${airport.funfact}`
        };
        break;
      case 'iata-to-city':
        question = {
          id: questions.length,
          type: 'iata-to-city',
          question: `Which city is identified by the airport code "${airport.iata_code}"?`,
          correctAnswer: airport.city,
          options: shuffleArray([airport.city, ...otherAirports.map(a => a.city)]),
          explanation: `${airport.iata_code} is the code for ${airport.city} (${airport.name}). \n\nDid you know? ${airport.funfact}`
        };
        break;
      case 'city-to-iata':
        question = {
          id: questions.length,
          type: 'city-to-iata',
          question: `What is the airport code for ${airport.city}?`,
          correctAnswer: airport.iata_code,
          options: shuffleArray([airport.iata_code, ...otherAirports.map(a => a.iata_code)]),
          explanation: `${airport.iata_code} is the code for ${airport.name} in ${airport.city}. \n\nDid you know? ${airport.funfact}`
        };
        break;
    }

    questions.push(question!);
  }

  return questions;
};

const generateAirForceQuestions = (count: number): Question[] => {
  const allAircraft = getAllAircraft();
  const questions: Question[] = [];
  const usedIndices = new Set<number>();

  while (questions.length < count) {
    const index = Math.floor(Math.random() * allAircraft.length);
    if (usedIndices.has(index)) continue;
    usedIndices.add(index);

    const aircraft = allAircraft[index];
    const type = Math.random();
    
    let question: Question;
    const otherAircraft = shuffleArray(allAircraft.filter(a => a.name !== aircraft.name)).slice(0, 3);

    if (type < 0.5) {
      // Role question
      question = {
        id: questions.length,
        type: 'aircraft-role',
        question: `What is the primary role of the ${aircraft.name}?`,
        correctAnswer: aircraft.role[0],
        options: shuffleArray([aircraft.role[0], ...otherAircraft.map(a => a.role[0])]),
        explanation: `${aircraft.name} is primarily used for ${aircraft.role.join(', ')}. \n\nDid you know? ${aircraft.funfact}`
      };
    } else {
      // Origin question
      const countries = ['USA', 'Russia', 'France', 'India', 'UK', 'Israel'].filter(c => !aircraft.origin.includes(c));
      const wrongOptions = shuffleArray(countries).slice(0, 3);
      
      question = {
        id: questions.length,
        type: 'aircraft-origin',
        question: `Which country is the origin of ${aircraft.name}?`,
        correctAnswer: aircraft.origin,
        options: shuffleArray([aircraft.origin, ...wrongOptions]),
        explanation: `${aircraft.name} originates from ${aircraft.origin}. \n\nDid you know? ${aircraft.funfact}`
      };
    }

    questions.push(question!);
  }

  return questions;
};

const generateFloraFaunaQuestions = (count: number): Question[] => {
  const statesData = (floraFaunaData as any).indian_biodiversity.states;
  const states = Object.keys(statesData);
  const questions: Question[] = [];
  const usedStateIndices = new Set<number>();

  while (questions.length < count) {
    const index = Math.floor(Math.random() * states.length);
    // Allow reuse of states if we run out, but try to avoid it
    if (usedStateIndices.size < states.length && usedStateIndices.has(index)) continue;
    usedStateIndices.add(index);

    const stateName = states[index];
    const data = statesData[stateName];
    const formattedStateName = stateName.replace(/_/g, ' ');
    
    const questionTypes = [];
    if (data.state_animal) questionTypes.push('animal');
    if (data.state_bird) questionTypes.push('bird');
    if (data.state_tree) questionTypes.push('tree');
    if (data.national_parks && data.national_parks.length > 0) questionTypes.push('park');

    if (questionTypes.length === 0) continue;

    const type = questionTypes[Math.floor(Math.random() * questionTypes.length)];
    const otherStates = shuffleArray(states.filter(s => s !== stateName)).slice(0, 3).map(s => s.replace(/_/g, ' '));
    
    let question: Question;

    switch (type) {
      case 'animal':
        question = {
          id: questions.length,
          type: 'state-animal',
          question: `What is the state animal of ${formattedStateName}?`,
          correctAnswer: data.state_animal.name,
          options: shuffleArray([data.state_animal.name, ...otherStates.map(s => {
             const otherData = statesData[s.replace(/ /g, '_')];
             return otherData?.state_animal?.name || 'Tiger'; // Fallback
          })]),
          explanation: `The state animal of ${formattedStateName} is the ${data.state_animal.name}. \n\nDid you know? ${data.state_animal.funfact}`
        };
        break;
      case 'bird':
        question = {
          id: questions.length,
          type: 'state-bird',
          question: `What is the state bird of ${formattedStateName}?`,
          correctAnswer: data.state_bird.name,
          options: shuffleArray([data.state_bird.name, ...otherStates.map(s => {
             const otherData = statesData[s.replace(/ /g, '_')];
             return otherData?.state_bird?.name || 'Peacock'; // Fallback
          })]),
          explanation: `The state bird of ${formattedStateName} is the ${data.state_bird.name}. \n\nDid you know? ${data.state_bird.funfact}`
        };
        break;
      case 'tree':
        question = {
          id: questions.length,
          type: 'state-tree',
          question: `What is the state tree of ${formattedStateName}?`,
          correctAnswer: data.state_tree.name,
          options: shuffleArray([data.state_tree.name, ...otherStates.map(s => {
             const otherData = statesData[s.replace(/ /g, '_')];
             return otherData?.state_tree?.name || 'Banyan'; // Fallback
          })]),
          explanation: `The state tree of ${formattedStateName} is the ${data.state_tree.name}. \n\nDid you know? ${data.state_tree.funfact}`
        };
        break;
      case 'park':
        const park = data.national_parks[0];
        question = {
          id: questions.length,
          type: 'national-park',
          question: `In which state is ${park.name} located?`,
          correctAnswer: formattedStateName,
          options: shuffleArray([formattedStateName, ...otherStates]),
          explanation: `${park.name} is located in ${formattedStateName}. \n\nDid you know? ${park.funfact}`
        };
        break;
    }

    if (question!) questions.push(question!);
  }

  return questions;
};

const generateNavyQuestions = (count: number): Question[] => {
  const data = (navyData as any).indian_navy;
  const questionPool: any[] = [];

  // Helper to get random items
  const getRandom = (arr: any[], n: number) => shuffleArray(arr).slice(0, n);

  // 1. Ship Classes (Destroyers)
  data.vessels.destroyers.active.forEach((ship: any) => {
    const shipName = ship.name.replace('INS ', '');
    questionPool.push({
      type: 'ship-class',
      question: `Which class of destroyers does INS ${shipName} belong to?`,
      correctAnswer: ship.class.split('(')[0].trim(),
      options: [ship.class.split('(')[0].trim(), 'Delhi-class', 'Rajput-class', 'Kolkata-class', 'Visakhapatnam-class'],
      explanation: `INS ${shipName} belongs to the ${ship.class}. \n\nDid you know? ${ship.funfact}`
    });
  });

  // 2. Submarines (Conventional)
  data.vessels.submarines.conventional_submarines.diesel_electric.forEach((sub: any) => {
    const subName = sub.name.replace('INS ', '');
    questionPool.push({
      type: 'submarine-type',
      question: `What class of submarine is INS ${subName}?`,
      correctAnswer: sub.class,
      options: [sub.class, 'Arihant-class', 'Chakra-class', 'Scorpène-class', 'Kilo-class'],
      explanation: `INS ${subName} is a ${sub.class} submarine. \n\nDid you know? ${sub.funfact}`
    });
  });

  // 3. Aircraft Roles
  data.naval_aviation.fixed_wing_aircraft.forEach((aircraft: any) => {
    questionPool.push({
      type: 'aircraft-role',
      question: `What is the primary role of the ${aircraft.name} in the Indian Navy?`,
      correctAnswer: aircraft.role[0],
      options: [aircraft.role[0], 'Transport', 'Training', 'Heavy Lift', 'Airborne Early Warning'],
      explanation: `${aircraft.name} is primarily used for ${aircraft.role[0]}. \n\nDid you know? ${aircraft.funfact}`
    });
  });

  // 4. Missiles
  data.missiles_and_weapons.anti_ship_missiles.forEach((missile: any) => {
    questionPool.push({
      type: 'missile-type',
      question: `What type of missile is the ${missile.name}?`,
      correctAnswer: missile.type,
      options: [missile.type, 'Surface-to-Air Missile', 'Ballistic Missile', 'Torpedo', 'Anti-Submarine Rocket'],
      explanation: `${missile.name} is a ${missile.type}. \n\nDid you know? ${missile.funfact}`
    });
  });

  // 5. Special Forces (MARCOS)
  const marcos = data.special_forces.marcos;
  questionPool.push({
    type: 'special-forces',
    question: `What is the motto of the Indian Navy's Marine Commandos (MARCOS)?`,
    correctAnswer: marcos.motto,
    options: [marcos.motto, 'Service Before Self', 'Valor and Wisdom', 'Touch the Sky with Glory', 'Victory is Everywhere'],
    explanation: `The motto of MARCOS is "${marcos.motto}". \n\nDid you know? ${marcos.funfact}`
  });

  // 6. Historic Operations
  data.historic_operations.forEach((op: any) => {
    questionPool.push({
      type: 'history',
      question: `Which operation was conducted by the Indian Navy during the ${op.war || op.date}?`,
      correctAnswer: op.name,
      options: [op.name, 'Operation Trident', 'Operation Python', 'Operation Cactus', 'Operation Vijay'],
      explanation: `${op.name} was conducted in ${op.location}. Result: ${op.result}. \n\nDid you know? ${op.funfact}`
    });
  });

  // 7. Fun Facts
  data.fun_facts_and_records.forEach((fact: any) => {
    questionPool.push({
      type: 'fun-fact',
      question: `Which of the following is true about the Indian Navy?`,
      correctAnswer: fact.fact,
      options: [fact.fact, 'It is the largest navy in the world', 'It operates 10 aircraft carriers', 'It has no submarines', 'It was founded in 2000'],
      explanation: `${fact.fact}. \n\nDid you know? ${fact.funfact}`
    });
  });

  // Shuffle and select unique questions
  // Ensure options are unique and don't contain the correct answer twice
  const processedQuestions = questionPool.map(q => {
    const uniqueOptions = Array.from(new Set(q.options)).filter(o => o !== q.correctAnswer);
    const finalOptions = shuffleArray(uniqueOptions).slice(0, 3);
    finalOptions.push(q.correctAnswer);
    return {
      ...q,
      options: shuffleArray(finalOptions)
    };
  });

  const selectedQuestions = shuffleArray(processedQuestions).slice(0, count);

  return selectedQuestions.map((q, index) => ({
    id: index,
    ...q
  }));
};

const generateMountainQuestions = (count: number): Question[] => {
  const data = (mountainData as any).indian_mountain_ranges;
  const questionPool: any[] = [];

  // Helper to get random items
  const getRandom = (arr: any[], n: number) => shuffleArray(arr).slice(0, n);

  // 1. Major Mountain Ranges
  Object.values(data.major_mountain_ranges).forEach((range: any) => {
    // Highest Peak Question
    if (range.highest_peak) {
      questionPool.push({
        type: 'highest-peak',
        question: `What is the highest peak in the ${range.name}?`,
        correctAnswer: range.highest_peak,
        options: [range.highest_peak, 'K2', 'Kangchenjunga', 'Nanda Devi', 'Anamudi'],
        explanation: `The highest peak in the ${range.name} is ${range.highest_peak}. \n\nDid you know? ${range.funfact}`
      });
    }

    // Famous Mountains Location
    if (range.famous_mountains) {
      range.famous_mountains.forEach((mountain: any) => {
        questionPool.push({
          type: 'mountain-location',
          question: `In which mountain range is ${mountain.name} located?`,
          correctAnswer: range.name,
          options: [range.name, 'The Himalayas', 'Western Ghats', 'Eastern Ghats', 'Aravalli Range'],
          explanation: `${mountain.name} is located in the ${range.name}. \n\nDid you know? ${mountain.funfact}`
        });
      });
    }

    // Famous Treks
    if (range.famous_treks) {
      range.famous_treks.forEach((trek: any) => {
        questionPool.push({
          type: 'trek-location',
          question: `Where can you find the ${trek.name} trek?`,
          correctAnswer: range.name,
          options: [range.name, 'Himachal Pradesh', 'Uttarakhand', 'Kerala', 'Sikkim'],
          explanation: `The ${trek.name} trek is in the ${range.name}. \n\nDid you know? ${trek.funfact}`
        });
      });
    }
  });

  // 2. Summary Statistics
  const stats = data.summary_statistics;
  
  // Oldest Range
  questionPool.push({
    type: 'oldest-range',
    question: `Which is the oldest mountain range in India?`,
    correctAnswer: stats.oldest_mountain_range.name,
    options: [stats.oldest_mountain_range.name, 'The Himalayas', 'Western Ghats', 'Satpura Range', 'Vindhya Range'],
    explanation: `${stats.oldest_mountain_range.name} is the oldest mountain range in India, formed in the ${stats.oldest_mountain_range.age}.`
  });

  // Youngest Range
  questionPool.push({
    type: 'youngest-range',
    question: `Which is the youngest mountain range in India?`,
    correctAnswer: stats.youngest_mountain_range.name,
    options: [stats.youngest_mountain_range.name, 'Aravalli Range', 'Western Ghats', 'Eastern Ghats', 'Satpura Range'],
    explanation: `${stats.youngest_mountain_range.name} is the youngest mountain range in India, formed in the ${stats.youngest_mountain_range.age}.`
  });

  // Highest Peak in India
  questionPool.push({
    type: 'highest-peak-india',
    question: `What is the highest peak in India?`,
    correctAnswer: stats.highest_peak_in_india.name,
    options: [stats.highest_peak_in_india.name, 'Mount Everest', 'Nanda Devi', 'Kamet', 'Saltoro Kangri'],
    explanation: `${stats.highest_peak_in_india.name} is the highest peak in India at ${stats.highest_peak_in_india.height}.`
  });

  // Longest Range
  questionPool.push({
    type: 'longest-range',
    question: `Which is the longest mountain range in India?`,
    correctAnswer: stats.longest_range_in_india,
    options: [stats.longest_range_in_india, 'Western Ghats', 'Eastern Ghats', 'Aravalli Range', 'Vindhya Range'],
    explanation: `The ${stats.longest_range_in_india} is the longest mountain range in India.`
  });

  // 3. Interesting Facts
  data.interesting_facts.forEach((fact: any) => {
    questionPool.push({
      type: 'fun-fact',
      question: `Which of the following is a fact about Indian mountains?`,
      correctAnswer: fact.fact,
      options: [fact.fact, 'The Himalayas are shrinking', 'There are no volcanoes in India', 'Western Ghats are older than Himalayas', 'Mount Everest is in India'],
      explanation: `${fact.fact}. \n\nDid you know? ${fact.funfact}`
    });
  });

  // Shuffle and select unique questions
  const processedQuestions = questionPool.map((q, i) => {
    // Ensure unique options
    const uniqueOptions = Array.from(new Set(q.options)).filter(o => o !== q.correctAnswer);
    // Fill up to 3 wrong options if not enough
    const fillers = ['The Himalayas', 'Western Ghats', 'Eastern Ghats', 'Aravalli Range', 'K2', 'Kangchenjunga', 'Nanda Devi', 'Anamudi'];
    while (uniqueOptions.length < 3) {
      const filler = fillers[Math.floor(Math.random() * fillers.length)];
      if (filler !== q.correctAnswer && !uniqueOptions.includes(filler)) {
        uniqueOptions.push(filler);
      }
    }
    
    const finalOptions = shuffleArray(uniqueOptions).slice(0, 3);
    finalOptions.push(q.correctAnswer);
    
    return {
      id: i,
      type: q.type,
      question: q.question,
      options: shuffleArray(finalOptions) as string[],
      correctAnswer: q.correctAnswer,
      explanation: q.explanation
    };
  });

  return shuffleArray(processedQuestions).slice(0, count);
};
