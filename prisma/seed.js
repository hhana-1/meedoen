// Run: node prisma/seed.js
const { PrismaClient } = require('@prisma/client')
const bcrypt = require('bcryptjs')

const prisma = new PrismaClient()

const PASSWORD_HASH = bcrypt.hashSync('password123', 12)

// ─── Job Seekers ─────────────────────────────────────────────────────────────

const jobSeekers = [
  {
    email: 'amira.hassan@example.com',
    language: 'ar',
    profile: {
      name: 'Amira Hassan',
      phone: '+31612345001',
      vnr: 'V-2024-001',
      dateOfBirth: '1995-03-14',
      nationality: 'Syrian',
      docNumber: 'SY-12345678',
      docValidUntil: '2026-03-14',
      bio: 'Motivated and hardworking with experience in hospitality and customer service. Quick learner, eager to build a new life in the Netherlands.',
      age: 29,
      experience: JSON.stringify([
        { role: 'Waitress', company: 'Al-Nour Restaurant, Damascus', years: '2018–2022' },
        { role: 'Cashier', company: 'Damascus Mall', years: '2016–2018' },
      ]),
      education: JSON.stringify([
        { degree: 'High School Diploma', school: 'Al-Farouk Secondary School', year: '2014' },
      ]),
      languages: JSON.stringify(['ar', 'en']),
      hoursPerWeek: 32,
      shifts: JSON.stringify(['morning', 'afternoon']),
      linkedin: 'https://linkedin.com/in/amira-hassan-nl',
    },
    services: ['Waitress / Hospitality', 'Cashier'],
  },
  {
    email: 'omar.ali@example.com',
    language: 'so',
    profile: {
      name: 'Omar Ali',
      phone: '+31612345002',
      vnr: 'V-2024-002',
      dateOfBirth: '1992-07-22',
      nationality: 'Somali',
      docNumber: 'SO-87654321',
      docValidUntil: '2026-12-01',
      bio: 'Experienced warehouse worker and forklift operator. Strong work ethic, reliable, and always on time. Looking for full-time work in logistics.',
      age: 32,
      experience: JSON.stringify([
        { role: 'Warehouse Operative', company: 'Mogadishu Port Authority', years: '2015–2023' },
        { role: 'Forklift Operator', company: 'Benadir Logistics', years: '2013–2015' },
      ]),
      education: JSON.stringify([
        { degree: 'Vocational Certificate – Logistics', school: 'Mogadishu Technical Institute', year: '2012' },
      ]),
      languages: JSON.stringify(['so', 'en', 'ar']),
      hoursPerWeek: 40,
      shifts: JSON.stringify(['morning', 'afternoon', 'night']),
    },
    services: ['Warehouse Worker', 'Forklift Operator', 'Loading / Unloading'],
  },
  {
    email: 'kateryna.kovalenko@example.com',
    language: 'uk',
    profile: {
      name: 'Kateryna Kovalenko',
      phone: '+31612345003',
      vnr: 'V-2023-115',
      dateOfBirth: '1988-11-05',
      nationality: 'Ukrainian',
      docNumber: 'UA-11223344',
      docValidUntil: '2025-11-05',
      bio: 'Former accountant with 10 years of experience. Fluent in English and German, currently learning Dutch. Highly organized and detail-oriented.',
      age: 36,
      experience: JSON.stringify([
        { role: 'Senior Accountant', company: 'Kyiv Finance Group', years: '2013–2022' },
        { role: 'Bookkeeper', company: 'Lviv Trade Company', years: '2010–2013' },
      ]),
      education: JSON.stringify([
        { degree: "Master's – Finance & Accounting", school: 'Kyiv National Economic University', year: '2010' },
      ]),
      languages: JSON.stringify(['uk', 'en', 'de', 'ru']),
      hoursPerWeek: 36,
      shifts: JSON.stringify(['morning', 'afternoon']),
      linkedin: 'https://linkedin.com/in/kateryna-kovalenko',
    },
    services: ['Bookkeeper / Accountant', 'Office Administration', 'Data Entry'],
  },
  {
    email: 'ali.demir@example.com',
    language: 'tr',
    profile: {
      name: 'Ali Demir',
      phone: '+31612345004',
      vnr: 'V-2023-088',
      dateOfBirth: '1999-01-30',
      nationality: 'Turkish',
      docNumber: 'TR-55667788',
      docValidUntil: '2027-01-30',
      bio: 'Young and energetic cook with 4 years of kitchen experience. Passionate about food and eager to learn Dutch cuisine.',
      age: 25,
      experience: JSON.stringify([
        { role: 'Line Cook', company: 'Demir Family Restaurant, Istanbul', years: '2020–2023' },
        { role: 'Kitchen Assistant', company: 'Bosphorus Hotel, Istanbul', years: '2019–2020' },
      ]),
      education: JSON.stringify([
        { degree: 'Culinary Arts Certificate', school: 'Istanbul Vocational College', year: '2019' },
      ]),
      languages: JSON.stringify(['tr', 'en', 'de']),
      hoursPerWeek: 40,
      shifts: JSON.stringify(['afternoon', 'evening']),
      instagram: 'https://instagram.com/alidemir_cook',
    },
    services: ['Cook / Kitchen Staff', 'Dishwasher', 'Food Prep'],
  },
  {
    email: 'fatuma.warsame@example.com',
    language: 'so',
    profile: {
      name: 'Fatuma Warsame',
      phone: '+31612345005',
      vnr: 'V-2022-207',
      dateOfBirth: '1990-06-18',
      nationality: 'Somali',
      docNumber: 'SO-22334455',
      docValidUntil: '2026-06-18',
      bio: 'Experienced cleaner and housekeeper with attention to detail. Dependable, discreet, and hard-working. Available for both residential and commercial cleaning.',
      age: 34,
      experience: JSON.stringify([
        { role: 'Housekeeper', company: 'Nairobi Grand Hotel, Kenya', years: '2014–2022' },
        { role: 'Domestic Cleaner', company: 'Various private clients', years: '2011–2014' },
      ]),
      education: JSON.stringify([
        { degree: 'Primary Education', school: 'Mogadishu Primary School', year: '2005' },
      ]),
      languages: JSON.stringify(['so', 'en', 'sw']),
      hoursPerWeek: 24,
      shifts: JSON.stringify(['morning', 'afternoon']),
    },
    services: ['Cleaning / Housekeeping', 'Laundry', 'Ironing'],
  },
  {
    email: 'dawit.tekle@example.com',
    language: 'ti',
    profile: {
      name: 'Dawit Tekle',
      phone: '+31612345006',
      vnr: 'V-2023-344',
      dateOfBirth: '1994-09-12',
      nationality: 'Eritrean',
      docNumber: 'ER-99887766',
      docValidUntil: '2026-09-12',
      bio: 'Skilled bicycle mechanic and general maintenance worker. Experienced in repairs, assembly, and customer service at a busy repair shop.',
      age: 30,
      experience: JSON.stringify([
        { role: 'Bicycle Mechanic', company: 'Asmara Cycles', years: '2016–2023' },
        { role: 'General Maintenance', company: 'Tekle Construction, Asmara', years: '2014–2016' },
      ]),
      education: JSON.stringify([
        { degree: 'Technical Diploma – Mechanical Maintenance', school: 'Eritrea Institute of Technology', year: '2014' },
      ]),
      languages: JSON.stringify(['ti', 'en', 'ar']),
      hoursPerWeek: 36,
      shifts: JSON.stringify(['morning', 'afternoon']),
    },
    services: ['Bicycle Mechanic', 'General Maintenance', 'Assembly Work'],
  },
  {
    email: 'nadia.popescu@example.com',
    language: 'uk',
    profile: {
      name: 'Nadia Popescu',
      phone: '+31612345007',
      vnr: 'V-2024-056',
      dateOfBirth: '2001-04-03',
      nationality: 'Ukrainian',
      docNumber: 'UA-33445566',
      docValidUntil: '2026-04-03',
      bio: 'Recent secondary school graduate, friendly and customer-oriented. Previous retail experience. Currently learning Dutch and motivated to work in a Dutch-speaking environment.',
      age: 23,
      experience: JSON.stringify([
        { role: 'Sales Assistant', company: 'Epicenter, Kyiv', years: '2021–2022' },
      ]),
      education: JSON.stringify([
        { degree: 'Secondary School Diploma', school: 'Kyiv Lyceum No. 14', year: '2020' },
      ]),
      languages: JSON.stringify(['uk', 'en', 'ru']),
      hoursPerWeek: 20,
      shifts: JSON.stringify(['morning', 'afternoon', 'weekend']),
      instagram: 'https://instagram.com/nadia.nl',
    },
    services: ['Retail Assistant', 'Cashier', 'Stock Management'],
  },
  {
    email: 'hassan.al-rashid@example.com',
    language: 'ar',
    profile: {
      name: 'Hassan Al-Rashid',
      phone: '+31612345008',
      vnr: 'V-2022-412',
      dateOfBirth: '1985-12-25',
      nationality: 'Iraqi',
      docNumber: 'IQ-66778899',
      docValidUntil: '2025-12-25',
      bio: 'Qualified electrician with 12 years of experience in residential and commercial installations. Holds international certification and is working toward Dutch EREC accreditation.',
      age: 40,
      experience: JSON.stringify([
        { role: 'Electrician', company: 'Baghdad Municipal Works', years: '2011–2022' },
        { role: 'Electrical Apprentice', company: 'Al-Rashid Construction', years: '2009–2011' },
      ]),
      education: JSON.stringify([
        { degree: 'Electrical Engineering (HND)', school: 'Baghdad Polytechnic University', year: '2009' },
      ]),
      languages: JSON.stringify(['ar', 'en']),
      hoursPerWeek: 40,
      shifts: JSON.stringify(['morning', 'afternoon']),
      linkedin: 'https://linkedin.com/in/hassan-alrashid-electrician',
    },
    services: ['Electrician', 'Electrical Installation', 'Maintenance'],
  },
]

// ─── Employers ────────────────────────────────────────────────────────────────

const employers = [
  {
    email: 'hr@schoonmaakpro.nl',
    language: 'nl',
    profile: {
      companyName: 'SchoonmaakPro B.V.',
      description: 'One of the leading cleaning companies in the Netherlands, operating across offices, hotels, and residential buildings in the Randstad region. We value reliability, teamwork, and diversity.',
      website: 'https://schoonmaakpro.nl',
      verified: true,
      orgType: 'B.V.',
      kvkNumber: '12345678',
      address: 'Industrieweg 14, 1042 Amsterdam',
      phone: '+31204560001',
    },
    listings: [
      {
        title: 'Cleaner – Office Buildings (Amsterdam)',
        description: 'We are looking for reliable cleaners to join our office cleaning team in Amsterdam. You will clean offices, communal areas, and toilets each morning before business hours.',
        requirements: JSON.stringify(['Reliable and punctual', 'Physical fitness', 'Own transport or good public-transport access', 'No experience required – training provided']),
        location: 'Amsterdam',
        hoursPerWeek: 20,
        shifts: JSON.stringify(['morning']),
        salaryMin: 13.27,
        salaryMax: 14.50,
        category: 'cleaning',
        jobType: 'parttime',
        stages: JSON.stringify(['applied', 'intake', 'trialDay', 'trialPeriod', 'contracted']),
      },
      {
        title: 'Hotel Housekeeper – Rotterdam',
        description: 'Responsible for cleaning and preparing hotel rooms to a high standard. Previous hospitality experience is a plus but not required.',
        requirements: JSON.stringify(['Attention to detail', 'Ability to work independently', 'Good physical condition']),
        location: 'Rotterdam',
        hoursPerWeek: 32,
        shifts: JSON.stringify(['morning', 'afternoon']),
        salaryMin: 13.27,
        salaryMax: 15.00,
        category: 'cleaning',
        jobType: 'regular',
        stages: JSON.stringify(['applied', 'intake', 'trialDay', 'contracted']),
      },
    ],
  },
  {
    email: 'recruitment@logisticsfast.nl',
    language: 'nl',
    profile: {
      companyName: 'LogisticsFast Nederland B.V.',
      description: 'Logistics and distribution company with warehouses in Rotterdam and Utrecht. We specialize in last-mile delivery and e-commerce fulfilment. Fast-paced, inclusive workplace.',
      website: 'https://logisticsfast.nl',
      verified: true,
      orgType: 'B.V.',
      kvkNumber: '23456789',
      address: 'Havenweg 55, 3011 Rotterdam',
      phone: '+31104560002',
    },
    listings: [
      {
        title: 'Warehouse Operative – Day Shift',
        description: 'Pick, pack, and prepare customer orders for dispatch. Work in a structured, fast-moving warehouse environment with a diverse team.',
        requirements: JSON.stringify(['Ability to stand for long periods', 'Basic numeracy', 'Team player', 'Forklift licence is a plus']),
        location: 'Rotterdam',
        hoursPerWeek: 40,
        shifts: JSON.stringify(['morning', 'afternoon']),
        salaryMin: 13.27,
        salaryMax: 15.50,
        category: 'logistics',
        jobType: 'regular',
        stages: JSON.stringify(['applied', 'intake', 'trialDay', 'trialPeriod', 'contracted']),
      },
      {
        title: 'Forklift Operator – Night Shift',
        description: 'Operate forklift trucks to move goods around our Rotterdam distribution centre. Valid forklift certificate required.',
        requirements: JSON.stringify(['Valid forklift certificate (VCA)', 'Night shift availability', 'Reliable']),
        location: 'Rotterdam',
        hoursPerWeek: 40,
        shifts: JSON.stringify(['night']),
        salaryMin: 15.00,
        salaryMax: 18.00,
        category: 'logistics',
        jobType: 'regular',
        stages: JSON.stringify(['applied', 'intake', 'trialDay', 'contracted']),
      },
    ],
  },
  {
    email: 'personeel@restaurantbrasserie.nl',
    language: 'nl',
    profile: {
      companyName: 'Brasserie De Gouden Tulp',
      description: 'Cosy and well-established Dutch brasserie in the heart of Utrecht. We serve 200+ covers per day and pride ourselves on a warm, multicultural team.',
      website: 'https://degoudentulp.nl',
      verified: false,
      orgType: 'Eenmanszaak',
      kvkNumber: '34567890',
      address: 'Oudegracht 88, 3511 Utrecht',
      phone: '+31304560003',
    },
    listings: [
      {
        title: 'Kitchen Assistant / Dishwasher',
        description: 'Support the kitchen team with prep work, dishwashing, and keeping the kitchen clean during busy service. Great entry point into the hospitality industry.',
        requirements: JSON.stringify(['Willing to work evenings and weekends', 'Energetic', 'No experience necessary']),
        location: 'Utrecht',
        hoursPerWeek: 24,
        shifts: JSON.stringify(['afternoon', 'evening']),
        salaryMin: 13.27,
        salaryMax: 14.00,
        category: 'hospitality',
        jobType: 'parttime',
        stages: JSON.stringify(['applied', 'trialDay', 'contracted']),
      },
      {
        title: 'Line Cook',
        description: 'Prepare dishes according to our menu. Work under the head chef in a structured kitchen. Dutch cooking experience preferred but international experience welcome.',
        requirements: JSON.stringify(['1+ year cooking experience', 'Ability to follow recipes precisely', 'Works well under pressure', 'Available for split shifts']),
        location: 'Utrecht',
        hoursPerWeek: 36,
        shifts: JSON.stringify(['afternoon', 'evening']),
        salaryMin: 14.00,
        salaryMax: 17.00,
        category: 'hospitality',
        jobType: 'regular',
        stages: JSON.stringify(['applied', 'intake', 'trialDay', 'trialPeriod', 'contracted']),
      },
    ],
  },
  {
    email: 'jobs@fietsenrepairshop.nl',
    language: 'nl',
    profile: {
      companyName: 'Fietsen & Meer Den Haag',
      description: 'The biggest bicycle repair and sales shop in Den Haag. We repair thousands of bikes per year and are always looking for skilled hands.',
      website: 'https://fietsenenmeer.nl',
      verified: true,
      orgType: 'B.V.',
      kvkNumber: '45678901',
      address: 'Rijswijkseweg 120, 2516 Den Haag',
      phone: '+31704560004',
    },
    listings: [
      {
        title: 'Bicycle Mechanic',
        description: 'Diagnose and repair bicycles ranging from city bikes to e-bikes. Customer-facing role with a busy workshop. Dutch language skills helpful but not required.',
        requirements: JSON.stringify(['Experience repairing bicycles', 'Ability to diagnose technical faults', 'Customer-friendly attitude']),
        location: 'Den Haag',
        hoursPerWeek: 32,
        shifts: JSON.stringify(['morning', 'afternoon']),
        salaryMin: 14.50,
        salaryMax: 18.00,
        category: 'technical',
        jobType: 'regular',
        stages: JSON.stringify(['applied', 'intake', 'trialDay', 'contracted']),
      },
    ],
  },
  {
    email: 'hr@superversmarkt.nl',
    language: 'nl',
    profile: {
      companyName: 'SuperVersmarkt Eindhoven',
      description: 'Local supermarket chain with 6 locations in the Eindhoven area. We believe in giving everyone a chance and have successfully integrated many new Nederlanders into our team.',
      website: 'https://superversmarkt.nl',
      verified: true,
      orgType: 'B.V.',
      kvkNumber: '56789012',
      address: 'Vestdijk 12, 5611 Eindhoven',
      phone: '+31404560005',
    },
    listings: [
      {
        title: 'Cashier / Sales Assistant',
        description: 'Serve customers at the checkout, restock shelves, and keep your section of the store tidy. Friendly team, flexible hours.',
        requirements: JSON.stringify(['Customer-friendly', 'Basic Dutch (A2 level or higher)', 'Reliable']),
        location: 'Eindhoven',
        hoursPerWeek: 20,
        shifts: JSON.stringify(['morning', 'afternoon', 'weekend']),
        salaryMin: 13.27,
        salaryMax: 14.50,
        category: 'retail',
        jobType: 'parttime',
        stages: JSON.stringify(['applied', 'intake', 'trialDay', 'contracted']),
      },
      {
        title: 'Stock Room Assistant',
        description: 'Unload deliveries, organise the stock room, and replenish shelves before opening hours. Early morning role – perfect for those who like a quiet start to the day.',
        requirements: JSON.stringify(['Physical fitness', 'Organised', 'Available early mornings']),
        location: 'Eindhoven',
        hoursPerWeek: 24,
        shifts: JSON.stringify(['early morning']),
        salaryMin: 13.27,
        salaryMax: 14.00,
        category: 'retail',
        jobType: 'parttime',
        stages: JSON.stringify(['applied', 'trialDay', 'contracted']),
      },
    ],
  },
]

// ─── Candidates (separate model) ─────────────────────────────────────────────

const candidates = [
  {
    firstName: 'Amira',
    lastName: 'Hassan',
    vNumber: 'V-2024-001',
    phoneNumber: '+31612345001',
    emailAddress: 'amira.hassan@example.com',
    address: { street: 'Vluchtstraat 4', city: 'Amsterdam', postalCode: '1011 AA', country: 'Netherlands' },
    skills: ['Customer Service', 'Hospitality', 'Cash Handling', 'Arabic (native)', 'English (B2)'],
  },
  {
    firstName: 'Omar',
    lastName: 'Ali',
    vNumber: 'V-2024-002',
    phoneNumber: '+31612345002',
    emailAddress: 'omar.ali@example.com',
    address: { street: 'Havenstraat 18', city: 'Rotterdam', postalCode: '3011 BB', country: 'Netherlands' },
    skills: ['Forklift (VCA)', 'Warehouse Operations', 'Heavy Lifting', 'Inventory Management'],
  },
  {
    firstName: 'Kateryna',
    lastName: 'Kovalenko',
    vNumber: 'V-2023-115',
    phoneNumber: '+31612345003',
    emailAddress: 'kateryna.kovalenko@example.com',
    address: { street: 'Nieuwstraat 9', city: 'Utrecht', postalCode: '3511 CC', country: 'Netherlands' },
    skills: ['Accounting', 'Bookkeeping', 'Excel', 'Financial Reporting', 'English (C1)', 'German (B2)'],
  },
  {
    firstName: 'Dawit',
    lastName: 'Tekle',
    vNumber: 'V-2023-344',
    phoneNumber: '+31612345006',
    emailAddress: 'dawit.tekle@example.com',
    address: { street: 'Rijswijkseweg 55', city: 'Den Haag', postalCode: '2516 DD', country: 'Netherlands' },
    skills: ['Bicycle Repair', 'Electrical Systems', 'Mechanical Maintenance', 'Tool Use'],
  },
  {
    firstName: 'Nadia',
    lastName: 'Popescu',
    vNumber: 'V-2024-056',
    phoneNumber: '+31612345007',
    emailAddress: 'nadia.popescu@example.com',
    address: { street: 'Vestdijk 33', city: 'Eindhoven', postalCode: '5611 EE', country: 'Netherlands' },
    skills: ['Retail Sales', 'Cash Register', 'Stock Management', 'Customer Service'],
  },
]

// ─── Companies (separate model) ───────────────────────────────────────────────

const companies = [
  {
    companyName: 'SchoonmaakPro B.V.',
    kvkNumber: '12345678',
    emailAddress: 'hr@schoonmaakpro.nl',
    address: { street: 'Industrieweg 14', city: 'Amsterdam', postalCode: '1042 AB', country: 'Netherlands' },
    jobOfferings: ['Cleaner – Office Buildings', 'Hotel Housekeeper'],
  },
  {
    companyName: 'LogisticsFast Nederland B.V.',
    kvkNumber: '23456789',
    emailAddress: 'recruitment@logisticsfast.nl',
    address: { street: 'Havenweg 55', city: 'Rotterdam', postalCode: '3011 AA', country: 'Netherlands' },
    jobOfferings: ['Warehouse Operative – Day Shift', 'Forklift Operator – Night Shift'],
  },
  {
    companyName: 'Brasserie De Gouden Tulp',
    kvkNumber: '34567890',
    emailAddress: 'personeel@restaurantbrasserie.nl',
    address: { street: 'Oudegracht 88', city: 'Utrecht', postalCode: '3511 AA', country: 'Netherlands' },
    jobOfferings: ['Kitchen Assistant / Dishwasher', 'Line Cook'],
  },
  {
    companyName: 'Fietsen & Meer Den Haag',
    kvkNumber: '45678901',
    emailAddress: 'jobs@fietsenrepairshop.nl',
    address: { street: 'Rijswijkseweg 120', city: 'Den Haag', postalCode: '2516 AA', country: 'Netherlands' },
    jobOfferings: ['Bicycle Mechanic'],
  },
  {
    companyName: 'SuperVersmarkt Eindhoven',
    kvkNumber: '56789012',
    emailAddress: 'hr@superversmarkt.nl',
    address: { street: 'Vestdijk 12', city: 'Eindhoven', postalCode: '5611 AA', country: 'Netherlands' },
    jobOfferings: ['Cashier / Sales Assistant', 'Stock Room Assistant'],
  },
]

// ─── Main ─────────────────────────────────────────────────────────────────────

async function main() {
  console.log('Seeding database...\n')

  // 1. Job Seekers
  const createdSeekers = []
  for (const seeker of jobSeekers) {
    const user = await prisma.user.upsert({
      where: { email: seeker.email },
      update: {},
      create: {
        email: seeker.email,
        password: PASSWORD_HASH,
        role: 'jobseeker',
        language: seeker.language,
        jobSeekerProfile: {
          create: {
            ...seeker.profile,
            services: {
              create: seeker.services.map(s => ({
                serviceType: s,
                description: `Experienced in: ${s}`,
                approved: true,
                active: true,
              })),
            },
          },
        },
      },
      include: { jobSeekerProfile: true },
    })
    createdSeekers.push(user)
    console.log(`  ✓ Job seeker: ${seeker.profile.name} (${seeker.email})`)
  }

  // 2. Employers + Job Listings
  const createdListings = []
  for (const employer of employers) {
    const user = await prisma.user.upsert({
      where: { email: employer.email },
      update: {},
      create: {
        email: employer.email,
        password: PASSWORD_HASH,
        role: 'employer',
        language: employer.language,
        employerProfile: {
          create: {
            ...employer.profile,
            jobListings: {
              create: employer.listings,
            },
          },
        },
      },
      include: { employerProfile: { include: { jobListings: true } } },
    })
    for (const listing of user.employerProfile.jobListings) {
      createdListings.push(listing)
    }
    console.log(`  ✓ Employer: ${employer.profile.companyName} (${employer.listings.length} listings)`)
  }

  // 3. Applications (first 4 seekers apply to relevant jobs)
  const applicationPairs = [
    { seekerIdx: 0, listingTitle: 'Hotel Housekeeper – Rotterdam' },
    { seekerIdx: 0, listingTitle: 'Cleaner – Office Buildings (Amsterdam)' },
    { seekerIdx: 1, listingTitle: 'Warehouse Operative – Day Shift' },
    { seekerIdx: 1, listingTitle: 'Forklift Operator – Night Shift' },
    { seekerIdx: 2, listingTitle: 'Stock Room Assistant' },
    { seekerIdx: 3, listingTitle: 'Kitchen Assistant / Dishwasher' },
    { seekerIdx: 3, listingTitle: 'Line Cook' },
    { seekerIdx: 4, listingTitle: 'Cleaner – Office Buildings (Amsterdam)' },
    { seekerIdx: 4, listingTitle: 'Hotel Housekeeper – Rotterdam' },
    { seekerIdx: 5, listingTitle: 'Bicycle Mechanic' },
    { seekerIdx: 6, listingTitle: 'Cashier / Sales Assistant' },
    { seekerIdx: 7, listingTitle: 'Warehouse Operative – Day Shift' },
  ]

  const stages = ['applied', 'intake', 'trialDay', 'trialPeriod', 'contracted']

  for (const pair of applicationPairs) {
    const listing = createdListings.find(l => l.title === pair.listingTitle)
    const seeker = createdSeekers[pair.seekerIdx]
    if (!listing || !seeker) continue

    const stage = stages[Math.floor(Math.random() * 3)]
    await prisma.application.upsert({
      where: {
        // Composite unique not defined, use findFirst + create pattern
        id: `seed-app-${seeker.id}-${listing.id}`.slice(0, 24),
      },
      update: {},
      create: {
        jobListingId: listing.id,
        userId: seeker.id,
        status: stage === 'contracted' ? 'accepted' : 'applied',
        stage,
        coverLetter: `I am very interested in the position of "${listing.title}". I believe my background and work ethic make me a great fit for your team. I am available to start immediately and would welcome the opportunity to discuss my application further.`,
      },
    }).catch(() => {
      // Ignore duplicate if already exists from a previous seed run
    })
  }
  console.log(`  ✓ Created ${applicationPairs.length} applications`)

  // 4. Reviews
  const reviewData = [
    { fromIdx: 0, toIdx: 2, rating: 5, comment: 'Amira was fantastic to work with — reliable, friendly, and always goes the extra mile.' },
    { fromIdx: 1, toIdx: 3, rating: 4, comment: 'Omar showed up on time every day and was a hard worker in the warehouse.' },
    { fromIdx: 2, toIdx: 4, rating: 5, comment: 'Kateryna is exceptionally organised and professional. Highly recommended.' },
    { fromIdx: 3, toIdx: 0, rating: 4, comment: 'Ali is a quick learner in the kitchen and has great energy during service.' },
  ]

  for (const r of reviewData) {
    const from = createdSeekers[r.fromIdx]
    const to = createdSeekers[r.toIdx]
    if (!from || !to) continue
    await prisma.review.create({
      data: {
        fromUserId: from.id,
        toUserId: to.id,
        rating: r.rating,
        comment: r.comment,
        flagged: false,
      },
    }).catch(() => {})
  }
  console.log('  ✓ Created reviews')

  // 5. Candidates (parallel model)
  for (const c of candidates) {
    await prisma.candidate.upsert({
      where: { vNumber: c.vNumber },
      update: {},
      create: c,
    })
  }
  console.log(`  ✓ Created ${candidates.length} Candidate records`)

  // 6. Companies (parallel model)
  for (const co of companies) {
    await prisma.company.upsert({
      where: { kvkNumber: co.kvkNumber },
      update: {},
      create: { ...co, password: PASSWORD_HASH },
    })
  }
  console.log(`  ✓ Created ${companies.length} Company records`)

  console.log('\nDone! All seed data inserted.\n')
  console.log('Login credentials for all accounts: password = password123')
}

main()
  .catch(err => { console.error(err); process.exit(1) })
  .finally(() => prisma.$disconnect())
