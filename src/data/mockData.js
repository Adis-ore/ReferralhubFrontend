// Mock Data for Referral Hub - 50 Staff Users + All Endpoint Data

// Helper function to generate dates
const getRandomDate = (startDate, endDate) => {
  return new Date(startDate.getTime() + Math.random() * (endDate.getTime() - startDate.getTime()));
};

// Helper function to generate random Nigerian phone
const generatePhone = () => {
  const prefixes = ['803', '806', '810', '813', '816', '907', '908', '909'];
  const prefix = prefixes[Math.floor(Math.random() * prefixes.length)];
  const rest = Math.floor(Math.random() * 10000000).toString().padStart(7, '0');
  return `+234 ${prefix} ${rest.slice(0, 3)} ${rest.slice(3)}`;
};

// Helper function to generate referral code
const generateReferralCode = (index) => {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  let code = 'REF';
  for (let i = 0; i < 5; i++) {
    code += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return code + index.toString().padStart(2, '0');
};

// Classifications/professions
const classifications = ['Registered Nurse', 'Care Worker', 'Support Worker', 'Admin Staff', 'Driver'];

// Bank names for mock bank accounts
const bankNames = ['GTBank', 'Access Bank', 'Zenith Bank', 'First Bank', 'UBA', 'Sterling Bank', 'Fidelity Bank'];

// Profession-based conversion rates
export const professionRates = [
  { id: 1, classification: 'Registered Nurse', pointsPerUnit: 2, cashPerPoint: 2.5, currencySymbol: '$', currencyCode: 'AUD', isActive: true },
  { id: 2, classification: 'Care Worker', pointsPerUnit: 2, cashPerPoint: 0.5, currencySymbol: '$', currencyCode: 'AUD', isActive: true },
  { id: 3, classification: 'Support Worker', pointsPerUnit: 2, cashPerPoint: 0.5, currencySymbol: '$', currencyCode: 'AUD', isActive: true },
  { id: 4, classification: 'Admin Staff', pointsPerUnit: 2, cashPerPoint: 0.5, currencySymbol: '$', currencyCode: 'AUD', isActive: true },
  { id: 5, classification: 'Driver', pointsPerUnit: 2, cashPerPoint: 0.5, currencySymbol: '$', currencyCode: 'AUD', isActive: true },
];

// 50 Staff Users
export const staffUsers = [
  // Sales Department (20 users)
  { id: 1, firstName: 'Adewale', lastName: 'Johnson', email: 'adewale.johnson@company.com', phone: generatePhone(), password: 'password123', referralCode: 'REFAX9K01', department: 'Sales', position: 'Senior', location: 'Lagos', joinDate: '2024-03-15', isActive: true, pointsBalance: 12500, totalReferrals: 18, successfulReferrals: 15, avatar: 'https://i.pravatar.cc/150?img=1' },
  { id: 2, firstName: 'Chioma', lastName: 'Okafor', email: 'chioma.okafor@company.com', phone: generatePhone(), password: 'password123', referralCode: 'REFBX2P02', department: 'Sales', position: 'Junior', location: 'Lagos', joinDate: '2024-08-20', isActive: true, pointsBalance: 8900, totalReferrals: 12, successfulReferrals: 10, avatar: 'https://i.pravatar.cc/150?img=2' },
  { id: 3, firstName: 'Oluwaseun', lastName: 'Adebayo', email: 'oluwaseun.adebayo@company.com', phone: generatePhone(), password: 'password123', referralCode: 'REFC3Y7Q03', department: 'Sales', position: 'Manager', location: 'Lagos', joinDate: '2023-05-10', isActive: true, pointsBalance: 15000, totalReferrals: 20, successfulReferrals: 18, avatar: 'https://i.pravatar.cc/150?img=3' },
  { id: 4, firstName: 'Blessing', lastName: 'Eze', email: 'blessing.eze@company.com', phone: generatePhone(), password: 'password123', referralCode: 'REFD4M8N04', department: 'Sales', position: 'Junior', location: 'Abuja', joinDate: '2024-09-01', isActive: true, pointsBalance: 6700, totalReferrals: 9, successfulReferrals: 7, avatar: 'https://i.pravatar.cc/150?img=4' },
  { id: 5, firstName: 'Emeka', lastName: 'Nwosu', email: 'emeka.nwosu@company.com', phone: generatePhone(), password: 'password123', referralCode: 'REFE5K1L05', department: 'Sales', position: 'Senior', location: 'Lagos', joinDate: '2023-11-22', isActive: true, pointsBalance: 11200, totalReferrals: 16, successfulReferrals: 14, avatar: 'https://i.pravatar.cc/150?img=5' },
  { id: 6, firstName: 'Fatima', lastName: 'Abdullahi', email: 'fatima.abdullahi@company.com', phone: generatePhone(), password: 'password123', referralCode: 'REFF6P9R06', department: 'Sales', position: 'Junior', location: 'Abuja', joinDate: '2024-07-14', isActive: true, pointsBalance: 7800, totalReferrals: 11, successfulReferrals: 9, avatar: 'https://i.pravatar.cc/150?img=6' },
  { id: 7, firstName: 'Ibrahim', lastName: 'Yusuf', email: 'ibrahim.yusuf@company.com', phone: generatePhone(), password: 'password123', referralCode: 'REFG7T2S07', department: 'Sales', position: 'Senior', location: 'Abuja', joinDate: '2024-01-30', isActive: true, pointsBalance: 10500, totalReferrals: 15, successfulReferrals: 13, avatar: 'https://i.pravatar.cc/150?img=7' },
  { id: 8, firstName: 'Ngozi', lastName: 'Okonkwo', email: 'ngozi.okonkwo@company.com', phone: generatePhone(), password: 'password123', referralCode: 'REFH8W5T08', department: 'Sales', position: 'Junior', location: 'Port Harcourt', joinDate: '2024-10-05', isActive: true, pointsBalance: 5400, totalReferrals: 7, successfulReferrals: 6, avatar: 'https://i.pravatar.cc/150?img=8' },
  { id: 9, firstName: 'Tunde', lastName: 'Olatunji', email: 'tunde.olatunji@company.com', phone: generatePhone(), password: 'password123', referralCode: 'REFI9Q6U09', department: 'Sales', position: 'Senior', location: 'Lagos', joinDate: '2023-07-18', isActive: true, pointsBalance: 13400, totalReferrals: 19, successfulReferrals: 16, avatar: 'https://i.pravatar.cc/150?img=9' },
  { id: 10, firstName: 'Amarachi', lastName: 'Ikenna', email: 'amarachi.ikenna@company.com', phone: generatePhone(), password: 'password123', referralCode: 'REFJ0L7V10', department: 'Sales', position: 'Junior', location: 'Lagos', joinDate: '2024-06-25', isActive: true, pointsBalance: 8100, totalReferrals: 10, successfulReferrals: 8, avatar: 'https://i.pravatar.cc/150?img=10' },
  { id: 11, firstName: 'Kunle', lastName: 'Adeyemi', email: 'kunle.adeyemi@company.com', phone: generatePhone(), password: 'password123', referralCode: 'REFK1N8W11', department: 'Sales', position: 'Senior', location: 'Lagos', joinDate: '2023-12-08', isActive: true, pointsBalance: 9800, totalReferrals: 14, successfulReferrals: 12, avatar: 'https://i.pravatar.cc/150?img=11' },
  { id: 12, firstName: 'Zainab', lastName: 'Mohammed', email: 'zainab.mohammed@company.com', phone: generatePhone(), password: 'password123', referralCode: 'REFL2M9X12', department: 'Sales', position: 'Junior', location: 'Abuja', joinDate: '2024-11-12', isActive: true, pointsBalance: 4200, totalReferrals: 5, successfulReferrals: 4, avatar: 'https://i.pravatar.cc/150?img=12' },
  { id: 13, firstName: 'Chinedu', lastName: 'Okoro', email: 'chinedu.okoro@company.com', phone: generatePhone(), password: 'password123', referralCode: 'REFM3P0Y13', department: 'Sales', position: 'Senior', location: 'Port Harcourt', joinDate: '2024-02-14', isActive: false, pointsBalance: 2100, totalReferrals: 3, successfulReferrals: 2, avatar: 'https://i.pravatar.cc/150?img=13' },
  { id: 14, firstName: 'Aisha', lastName: 'Bello', email: 'aisha.bello@company.com', phone: generatePhone(), password: 'password123', referralCode: 'REFN4Q1Z14', department: 'Sales', position: 'Junior', location: 'Abuja', joinDate: '2024-05-20', isActive: true, pointsBalance: 7200, totalReferrals: 8, successfulReferrals: 7, avatar: 'https://i.pravatar.cc/150?img=14' },
  { id: 15, firstName: 'Segun', lastName: 'Bakare', email: 'segun.bakare@company.com', phone: generatePhone(), password: 'password123', referralCode: 'REFO5R2A15', department: 'Sales', position: 'Manager', location: 'Lagos', joinDate: '2023-04-10', isActive: true, pointsBalance: 14700, totalReferrals: 20, successfulReferrals: 17, avatar: 'https://i.pravatar.cc/150?img=15' },
  { id: 16, firstName: 'Nneka', lastName: 'Chukwu', email: 'nneka.chukwu@company.com', phone: generatePhone(), password: 'password123', referralCode: 'REFP6S3B16', department: 'Sales', position: 'Junior', location: 'Port Harcourt', joinDate: '2024-08-30', isActive: true, pointsBalance: 6300, totalReferrals: 8, successfulReferrals: 6, avatar: 'https://i.pravatar.cc/150?img=16' },
  { id: 17, firstName: 'Babatunde', lastName: 'Afolabi', email: 'babatunde.afolabi@company.com', phone: generatePhone(), password: 'password123', referralCode: 'REFQ7T4C17', department: 'Sales', position: 'Senior', location: 'Lagos', joinDate: '2023-09-05', isActive: true, pointsBalance: 11800, totalReferrals: 17, successfulReferrals: 14, avatar: 'https://i.pravatar.cc/150?img=17' },
  { id: 18, firstName: 'Hauwa', lastName: 'Aliyu', email: 'hauwa.aliyu@company.com', phone: generatePhone(), password: 'password123', referralCode: 'REFR8U5D18', department: 'Sales', position: 'Junior', location: 'Abuja', joinDate: '2024-07-22', isActive: true, pointsBalance: 5900, totalReferrals: 7, successfulReferrals: 5, avatar: 'https://i.pravatar.cc/150?img=18' },
  { id: 19, firstName: 'Chijioke', lastName: 'Nnadi', email: 'chijioke.nnadi@company.com', phone: generatePhone(), password: 'password123', referralCode: 'REFS9V6E19', department: 'Sales', position: 'Senior', location: 'Lagos', joinDate: '2024-03-18', isActive: false, pointsBalance: 1800, totalReferrals: 2, successfulReferrals: 1, avatar: 'https://i.pravatar.cc/150?img=19' },
  { id: 20, firstName: 'Folake', lastName: 'Odusanya', email: 'folake.odusanya@company.com', phone: generatePhone(), password: 'password123', referralCode: 'REFT0W7F20', department: 'Sales', position: 'Junior', location: 'Lagos', joinDate: '2024-09-14', isActive: true, pointsBalance: 6800, totalReferrals: 9, successfulReferrals: 7, avatar: 'https://i.pravatar.cc/150?img=20' },

  // Marketing Department (12 users)
  { id: 21, firstName: 'Ahmed', lastName: 'Musa', email: 'ahmed.musa@company.com', phone: generatePhone(), password: 'password123', referralCode: 'REFU1X8G21', department: 'Marketing', position: 'Manager', location: 'Lagos', joinDate: '2023-06-12', isActive: true, pointsBalance: 13900, totalReferrals: 18, successfulReferrals: 16, avatar: 'https://i.pravatar.cc/150?img=21' },
  { id: 22, firstName: 'Grace', lastName: 'Adekunle', email: 'grace.adekunle@company.com', phone: generatePhone(), password: 'password123', referralCode: 'REFV2Y9H22', department: 'Marketing', position: 'Senior', location: 'Lagos', joinDate: '2024-01-20', isActive: true, pointsBalance: 10200, totalReferrals: 13, successfulReferrals: 11, avatar: 'https://i.pravatar.cc/150?img=22' },
  { id: 23, firstName: 'Michael', lastName: 'Obi', email: 'michael.obi@company.com', phone: generatePhone(), password: 'password123', referralCode: 'REFW3Z0I23', department: 'Marketing', position: 'Junior', location: 'Abuja', joinDate: '2024-10-01', isActive: true, pointsBalance: 4800, totalReferrals: 6, successfulReferrals: 5, avatar: 'https://i.pravatar.cc/150?img=23' },
  { id: 24, firstName: 'Kemi', lastName: 'Fashola', email: 'kemi.fashola@company.com', phone: generatePhone(), password: 'password123', referralCode: 'REFX4A1J24', department: 'Marketing', position: 'Senior', location: 'Lagos', joinDate: '2023-10-15', isActive: true, pointsBalance: 11500, totalReferrals: 15, successfulReferrals: 13, avatar: 'https://i.pravatar.cc/150?img=24' },
  { id: 25, firstName: 'Damilola', lastName: 'Taiwo', email: 'damilola.taiwo@company.com', phone: generatePhone(), password: 'password123', referralCode: 'REFY5B2K25', department: 'Marketing', position: 'Junior', location: 'Lagos', joinDate: '2024-06-08', isActive: true, pointsBalance: 7500, totalReferrals: 10, successfulReferrals: 8, avatar: 'https://i.pravatar.cc/150?img=25' },
  { id: 26, firstName: 'Yusuf', lastName: 'Ibrahim', email: 'yusuf.ibrahim@company.com', phone: generatePhone(), password: 'password123', referralCode: 'REFZ6C3L26', department: 'Marketing', position: 'Senior', location: 'Abuja', joinDate: '2024-02-28', isActive: true, pointsBalance: 9400, totalReferrals: 12, successfulReferrals: 10, avatar: 'https://i.pravatar.cc/150?img=26' },
  { id: 27, firstName: 'Bukola', lastName: 'Ojo', email: 'bukola.ojo@company.com', phone: generatePhone(), password: 'password123', referralCode: 'REFA7D4M27', department: 'Marketing', position: 'Junior', location: 'Port Harcourt', joinDate: '2024-11-20', isActive: true, pointsBalance: 3600, totalReferrals: 4, successfulReferrals: 3, avatar: 'https://i.pravatar.cc/150?img=27' },
  { id: 28, firstName: 'Oluwatobi', lastName: 'Martins', email: 'oluwatobi.martins@company.com', phone: generatePhone(), password: 'password123', referralCode: 'REFB8E5N28', department: 'Marketing', position: 'Senior', location: 'Lagos', joinDate: '2023-08-14', isActive: true, pointsBalance: 12100, totalReferrals: 16, successfulReferrals: 14, avatar: 'https://i.pravatar.cc/150?img=28' },
  { id: 29, firstName: 'Sade', lastName: 'Williams', email: 'sade.williams@company.com', phone: generatePhone(), password: 'password123', referralCode: 'REFC9F6O29', department: 'Marketing', position: 'Junior', location: 'Lagos', joinDate: '2024-05-12', isActive: false, pointsBalance: 2700, totalReferrals: 3, successfulReferrals: 2, avatar: 'https://i.pravatar.cc/150?img=29' },
  { id: 30, firstName: 'Bolaji', lastName: 'Adeleke', email: 'bolaji.adeleke@company.com', phone: generatePhone(), password: 'password123', referralCode: 'REFD0G7P30', department: 'Marketing', position: 'Senior', location: 'Abuja', joinDate: '2024-04-05', isActive: true, pointsBalance: 8700, totalReferrals: 11, successfulReferrals: 9, avatar: 'https://i.pravatar.cc/150?img=30' },
  { id: 31, firstName: 'Ifeanyi', lastName: 'Uche', email: 'ifeanyi.uche@company.com', phone: generatePhone(), password: 'password123', referralCode: 'REFE1H8Q31', department: 'Marketing', position: 'Junior', location: 'Port Harcourt', joinDate: '2024-09-22', isActive: true, pointsBalance: 5100, totalReferrals: 6, successfulReferrals: 5, avatar: 'https://i.pravatar.cc/150?img=31' },
  { id: 32, firstName: 'Titilayo', lastName: 'Ogunleye', email: 'titilayo.ogunleye@company.com', phone: generatePhone(), password: 'password123', referralCode: 'REFF2I9R32', department: 'Marketing', position: 'Senior', location: 'Lagos', joinDate: '2023-11-30', isActive: true, pointsBalance: 10800, totalReferrals: 14, successfulReferrals: 12, avatar: 'https://i.pravatar.cc/150?img=32' },

  // IT Department (8 users)
  { id: 33, firstName: 'Victor', lastName: 'Eze', email: 'victor.eze@company.com', phone: generatePhone(), password: 'password123', referralCode: 'REFG3J0S33', department: 'IT', position: 'Manager', location: 'Lagos', joinDate: '2023-05-20', isActive: true, pointsBalance: 14200, totalReferrals: 19, successfulReferrals: 17, avatar: 'https://i.pravatar.cc/150?img=33' },
  { id: 34, firstName: 'Jennifer', lastName: 'Okeke', email: 'jennifer.okeke@company.com', phone: generatePhone(), password: 'password123', referralCode: 'REFH4K1T34', department: 'IT', position: 'Senior', location: 'Lagos', joinDate: '2024-01-15', isActive: true, pointsBalance: 9900, totalReferrals: 13, successfulReferrals: 11, avatar: 'https://i.pravatar.cc/150?img=34' },
  { id: 35, firstName: 'Samuel', lastName: 'Adeyinka', email: 'samuel.adeyinka@company.com', phone: generatePhone(), password: 'password123', referralCode: 'REFI5L2U35', department: 'IT', position: 'Junior', location: 'Abuja', joinDate: '2024-08-05', isActive: true, pointsBalance: 6100, totalReferrals: 8, successfulReferrals: 6, avatar: 'https://i.pravatar.cc/150?img=35' },
  { id: 36, firstName: 'Chiamaka', lastName: 'Nnamdi', email: 'chiamaka.nnamdi@company.com', phone: generatePhone(), password: 'password123', referralCode: 'REFJ6M3V36', department: 'IT', position: 'Senior', location: 'Lagos', joinDate: '2023-12-10', isActive: true, pointsBalance: 10600, totalReferrals: 14, successfulReferrals: 12, avatar: 'https://i.pravatar.cc/150?img=36' },
  { id: 37, firstName: 'Daniel', lastName: 'Okpara', email: 'daniel.okpara@company.com', phone: generatePhone(), password: 'password123', referralCode: 'REFK7N4W37', department: 'IT', position: 'Junior', location: 'Abuja', joinDate: '2024-07-18', isActive: true, pointsBalance: 7100, totalReferrals: 9, successfulReferrals: 7, avatar: 'https://i.pravatar.cc/150?img=37' },
  { id: 38, firstName: 'Funmi', lastName: 'Lawal', email: 'funmi.lawal@company.com', phone: generatePhone(), password: 'password123', referralCode: 'REFL8O5X38', department: 'IT', position: 'Senior', location: 'Port Harcourt', joinDate: '2024-03-25', isActive: false, pointsBalance: 3200, totalReferrals: 4, successfulReferrals: 3, avatar: 'https://i.pravatar.cc/150?img=38' },
  { id: 39, firstName: 'Abdullahi', lastName: 'Suleiman', email: 'abdullahi.suleiman@company.com', phone: generatePhone(), password: 'password123', referralCode: 'REFM9P6Y39', department: 'IT', position: 'Junior', location: 'Abuja', joinDate: '2024-10-12', isActive: true, pointsBalance: 4500, totalReferrals: 5, successfulReferrals: 4, avatar: 'https://i.pravatar.cc/150?img=39' },
  { id: 40, firstName: 'Rachael', lastName: 'Dike', email: 'rachael.dike@company.com', phone: generatePhone(), password: 'password123', referralCode: 'REFN0Q7Z40', department: 'IT', position: 'Senior', location: 'Lagos', joinDate: '2023-09-08', isActive: true, pointsBalance: 11300, totalReferrals: 15, successfulReferrals: 13, avatar: 'https://i.pravatar.cc/150?img=40' },

  // HR Department (5 users)
  { id: 41, firstName: 'Precious', lastName: 'Oluwole', email: 'precious.oluwole@company.com', phone: generatePhone(), password: 'password123', referralCode: 'REFO1R8A41', department: 'HR', position: 'Manager', location: 'Lagos', joinDate: '2023-04-15', isActive: true, pointsBalance: 13600, totalReferrals: 18, successfulReferrals: 16, avatar: 'https://i.pravatar.cc/150?img=41' },
  { id: 42, firstName: 'Godwin', lastName: 'Amadi', email: 'godwin.amadi@company.com', phone: generatePhone(), password: 'password123', referralCode: 'REFP2S9B42', department: 'HR', position: 'Senior', location: 'Lagos', joinDate: '2024-02-20', isActive: true, pointsBalance: 9200, totalReferrals: 12, successfulReferrals: 10, avatar: 'https://i.pravatar.cc/150?img=42' },
  { id: 43, firstName: 'Mary', lastName: 'Ajayi', email: 'mary.ajayi@company.com', phone: generatePhone(), password: 'password123', referralCode: 'REFQ3T0C43', department: 'HR', position: 'Junior', location: 'Abuja', joinDate: '2024-06-30', isActive: true, pointsBalance: 6900, totalReferrals: 9, successfulReferrals: 7, avatar: 'https://i.pravatar.cc/150?img=43' },
  { id: 44, firstName: 'Gbenga', lastName: 'Olaniyan', email: 'gbenga.olaniyan@company.com', phone: generatePhone(), password: 'password123', referralCode: 'REFR4U1D44', department: 'HR', position: 'Senior', location: 'Abuja', joinDate: '2023-10-25', isActive: false, pointsBalance: 2400, totalReferrals: 3, successfulReferrals: 2, avatar: 'https://i.pravatar.cc/150?img=44' },
  { id: 45, firstName: 'Esther', lastName: 'Nwachukwu', email: 'esther.nwachukwu@company.com', phone: generatePhone(), password: 'password123', referralCode: 'REFS5V2E45', department: 'HR', position: 'Junior', location: 'Port Harcourt', joinDate: '2024-09-10', isActive: true, pointsBalance: 5600, totalReferrals: 7, successfulReferrals: 6, avatar: 'https://i.pravatar.cc/150?img=45' },

  // Operations Department (5 users)
  { id: 46, firstName: 'Chukwuma', lastName: 'Obi', email: 'chukwuma.obi@company.com', phone: generatePhone(), password: 'password123', referralCode: 'REFT6W3F46', department: 'Operations', position: 'Manager', location: 'Lagos', joinDate: '2023-07-05', isActive: true, pointsBalance: 14500, totalReferrals: 19, successfulReferrals: 17, avatar: 'https://i.pravatar.cc/150?img=46' },
  { id: 47, firstName: 'Olayinka', lastName: 'Balogun', email: 'olayinka.balogun@company.com', phone: generatePhone(), password: 'password123', referralCode: 'REFU7X4G47', department: 'Operations', position: 'Senior', location: 'Lagos', joinDate: '2024-01-12', isActive: true, pointsBalance: 10400, totalReferrals: 14, successfulReferrals: 12, avatar: 'https://i.pravatar.cc/150?img=47' },
  { id: 48, firstName: 'Elizabeth', lastName: 'Ogundipe', email: 'elizabeth.ogundipe@company.com', phone: generatePhone(), password: 'password123', referralCode: 'REFV8Y5H48', department: 'Operations', position: 'Junior', location: 'Abuja', joinDate: '2024-08-15', isActive: true, pointsBalance: 6400, totalReferrals: 8, successfulReferrals: 7, avatar: 'https://i.pravatar.cc/150?img=48' },
  { id: 49, firstName: 'Ikechukwu', lastName: 'Anyanwu', email: 'ikechukwu.anyanwu@company.com', phone: generatePhone(), password: 'password123', referralCode: 'REFW9Z6I49', department: 'Operations', position: 'Senior', location: 'Port Harcourt', joinDate: '2023-11-18', isActive: false, pointsBalance: 1500, totalReferrals: 2, successfulReferrals: 1, avatar: 'https://i.pravatar.cc/150?img=49' },
  { id: 50, firstName: 'Amina', lastName: 'Bala', email: 'amina.bala@company.com', phone: generatePhone(), password: 'password123', referralCode: 'REFX0A7J50', department: 'Operations', position: 'Junior', location: 'Abuja', joinDate: '2024-10-28', isActive: true, pointsBalance: 4100, totalReferrals: 5, successfulReferrals: 4, avatar: 'https://i.pravatar.cc/150?img=50' }
];

// Hourly rates by classification
const hourlyRateByClassification = {
  'Registered Nurse': 35,
  'Care Worker': 25,
  'Support Worker': 22,
  'Admin Staff': 20,
  'Driver': 23,
};

// Enrich staff users with classification, bank account, lastActiveDate, hourlyRate, connecteamData
staffUsers.forEach((user, index) => {
  user.classification = classifications[index % classifications.length];
  user.hourlyRate = hourlyRateByClassification[user.classification] || 22;
  user.connecteamUserId = `ct-${1000 + user.id}`;
  user.lastActiveDate = user.isActive
    ? getRandomDate(new Date('2026-01-01'), new Date('2026-02-09')).toISOString().split('T')[0]
    : getRandomDate(new Date('2025-06-01'), new Date('2025-10-01')).toISOString().split('T')[0];
  // ~70% of users have bank accounts set up
  if (Math.random() > 0.3) {
    user.bankAccount = {
      bankName: bankNames[Math.floor(Math.random() * bankNames.length)],
      accountNumber: String(Math.floor(Math.random() * 9000000000) + 1000000000),
      accountName: `${user.firstName} ${user.lastName}`,
    };
  } else {
    user.bankAccount = null;
  }
});

// 3 Admin Users
export const adminUsers = [
  {
    id: 'admin-1',
    name: 'Admin Super',
    email: 'admin@company.com',
    password: 'admin123',
    role: 'super_admin',
    permissions: ['all'],
    createdAt: '2023-01-01T00:00:00.000Z',
    lastLogin: '2026-01-15T08:30:00.000Z'
  },
  {
    id: 'admin-2',
    name: 'Manager User',
    email: 'manager@company.com',
    password: 'manager123',
    role: 'manager',
    permissions: ['view_users', 'view_referrals', 'view_withdrawals', 'approve_withdrawals', 'view_reports'],
    createdAt: '2023-02-15T00:00:00.000Z',
    lastLogin: '2026-01-14T14:20:00.000Z'
  },
  {
    id: 'admin-3',
    name: 'Analyst User',
    email: 'analyst@company.com',
    password: 'analyst123',
    role: 'analyst',
    permissions: ['view_users', 'view_referrals', 'view_withdrawals', 'view_reports'],
    createdAt: '2023-03-10T00:00:00.000Z',
    lastLogin: '2026-01-13T11:45:00.000Z'
  }
];

// Generate 250+ Referrals
const generateReferrals = () => {
  const referrals = [];
  const statuses = ['pending', 'approved', 'completed', 'rejected'];
  const statusWeights = [0.3, 0.25, 0.35, 0.1]; // 30%, 25%, 35%, 10%

  let referralId = 1;

  staffUsers.forEach(user => {
    const numReferrals = user.totalReferrals;

    for (let i = 0; i < numReferrals; i++) {
      const randomValue = Math.random();
      let status;
      let cumulativeWeight = 0;

      for (let j = 0; j < statusWeights.length; j++) {
        cumulativeWeight += statusWeights[j];
        if (randomValue < cumulativeWeight) {
          status = statuses[j];
          break;
        }
      }

      const createdDate = getRandomDate(new Date(user.joinDate), new Date());

      referrals.push({
        id: referralId++,
        userId: user.id,
        referrerName: `${user.firstName} ${user.lastName}`,
        referrerCode: user.referralCode,
        refereeName: `Referee ${referralId}`,
        refereeEmail: `referee${referralId}@example.com`,
        refereePhone: generatePhone(),
        status: status,
        pointsAwarded: status === 'completed' ? 500 : 0,
        createdAt: createdDate.toISOString(),
        updatedAt: status === 'pending' ? createdDate.toISOString() : getRandomDate(createdDate, new Date()).toISOString(),
        notes: status === 'rejected' ? 'Duplicate entry' : status === 'completed' ? 'Successfully onboarded' : ''
      });
    }
  });

  return referrals;
};

export const referrals = generateReferrals();

// Generate 500+ Point Transactions
const generatePointTransactions = () => {
  const transactions = [];
  const types = ['earned', 'bonus', 'deduction', 'withdrawal'];
  let transactionId = 1;

  staffUsers.forEach(user => {
    const numTransactions = Math.floor(Math.random() * 15) + 5; // 5-20 transactions per user

    for (let i = 0; i < numTransactions; i++) {
      const type = types[Math.floor(Math.random() * types.length)];
      const createdDate = getRandomDate(new Date(user.joinDate), new Date());

      let amount, description;
      switch (type) {
        case 'earned':
          amount = 500;
          description = 'Points earned from successful referral';
          break;
        case 'bonus':
          amount = Math.floor(Math.random() * 1000) + 500;
          description = 'Performance bonus points';
          break;
        case 'deduction':
          amount = -Math.floor(Math.random() * 500) - 100;
          description = 'Point adjustment';
          break;
        case 'withdrawal':
          amount = -Math.floor(Math.random() * 5000) - 1000;
          description = 'Withdrawal processed';
          break;
      }

      transactions.push({
        id: transactionId++,
        userId: user.id,
        userName: `${user.firstName} ${user.lastName}`,
        type: type,
        amount: amount,
        balance: user.pointsBalance,
        description: description,
        createdAt: createdDate.toISOString(),
        referralId: type === 'earned' ? Math.floor(Math.random() * referrals.length) + 1 : null
      });
    }
  });

  return transactions.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
};

export const pointTransactions = generatePointTransactions();

// Generate 120+ Withdrawal Requests
const generateWithdrawals = () => {
  const withdrawals = [];
  const statuses = ['pending', 'approved', 'processing', 'completed', 'rejected'];
  const statusWeights = [0.21, 0.25, 0.12, 0.33, 0.09]; // Pending: 25, Approved: 30, Processing: 15, Completed: 40, Rejected: 10
  let withdrawalId = 1;

  // Select random users for withdrawals
  const usersWithWithdrawals = staffUsers
    .filter(u => u.pointsBalance > 5000)
    .sort(() => 0.5 - Math.random())
    .slice(0, 40); // 40 users will have withdrawals

  usersWithWithdrawals.forEach(user => {
    const numWithdrawals = Math.floor(Math.random() * 4) + 1; // 1-4 withdrawals per user

    for (let i = 0; i < numWithdrawals; i++) {
      const randomValue = Math.random();
      let status;
      let cumulativeWeight = 0;

      for (let j = 0; j < statusWeights.length; j++) {
        cumulativeWeight += statusWeights[j];
        if (randomValue < cumulativeWeight) {
          status = statuses[j];
          break;
        }
      }

      const amount = Math.floor(Math.random() * 50000) + 10000; // 10,000 - 60,000
      const points = amount * 10; // 10 points per naira
      const createdDate = getRandomDate(new Date(user.joinDate), new Date());

      withdrawals.push({
        id: withdrawalId++,
        userId: user.id,
        userName: `${user.firstName} ${user.lastName}`,
        amount: amount,
        points: points,
        status: status,
        bankName: ['GTBank', 'Access Bank', 'Zenith Bank', 'First Bank', 'UBA'][Math.floor(Math.random() * 5)],
        accountNumber: Math.floor(Math.random() * 9000000000) + 1000000000,
        accountName: `${user.firstName} ${user.lastName}`,
        createdAt: createdDate.toISOString(),
        processedAt: status === 'completed' || status === 'rejected' ? getRandomDate(createdDate, new Date()).toISOString() : null,
        processedBy: status === 'completed' || status === 'rejected' ? adminUsers[Math.floor(Math.random() * adminUsers.length)].name : null,
        rejectionReason: status === 'rejected' ? 'Invalid account details' : null
      });
    }
  });

  return withdrawals.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
};

export const withdrawals = generateWithdrawals();

// Generate 200+ Audit Logs
const generateAuditLogs = () => {
  const logs = [];
  const actions = [
    'User login',
    'User logout',
    'Referral approved',
    'Referral rejected',
    'Withdrawal approved',
    'Withdrawal rejected',
    'Points adjusted',
    'User deactivated',
    'User activated',
    'Settings updated',
    'Report generated',
    'Rate changed'
  ];

  for (let i = 1; i <= 215; i++) {
    const admin = adminUsers[Math.floor(Math.random() * adminUsers.length)];
    const action = actions[Math.floor(Math.random() * actions.length)];
    const createdDate = getRandomDate(new Date('2024-01-01'), new Date());

    logs.push({
      id: i,
      adminId: admin.id,
      adminName: admin.name,
      action: action,
      target: action.includes('User') ? `User ${Math.floor(Math.random() * 50) + 1}` :
              action.includes('Referral') ? `Referral ${Math.floor(Math.random() * 250) + 1}` :
              action.includes('Withdrawal') ? `Withdrawal ${Math.floor(Math.random() * 120) + 1}` : 'System',
      description: `${admin.name} performed ${action}`,
      ipAddress: `192.168.${Math.floor(Math.random() * 255)}.${Math.floor(Math.random() * 255)}`,
      createdAt: createdDate.toISOString()
    });
  }

  return logs.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
};

export const auditLogs = generateAuditLogs();

// Generate 150+ Notifications
const generateNotifications = () => {
  const notifications = [];
  const types = ['referral', 'withdrawal', 'points', 'system'];
  const titles = {
    referral: ['New Referral Approved', 'Referral Completed', 'Referral Rejected'],
    withdrawal: ['Withdrawal Approved', 'Withdrawal Completed', 'Withdrawal Rejected'],
    points: ['Points Awarded', 'Bonus Points', 'Points Deducted'],
    system: ['System Update', 'New Feature', 'Maintenance Notice']
  };

  let notificationId = 1;

  staffUsers.forEach(user => {
    const numNotifications = Math.floor(Math.random() * 5) + 1; // 1-5 notifications per user

    for (let i = 0; i < numNotifications; i++) {
      const type = types[Math.floor(Math.random() * types.length)];
      const titleOptions = titles[type];
      const title = titleOptions[Math.floor(Math.random() * titleOptions.length)];
      const createdDate = getRandomDate(new Date(user.joinDate), new Date());

      notifications.push({
        id: notificationId++,
        userId: user.id,
        type: type,
        title: title,
        message: `${title} - Check your dashboard for details`,
        isRead: Math.random() > 0.4, // 60% read, 40% unread
        createdAt: createdDate.toISOString()
      });
    }
  });

  return notifications.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
};

export const notifications = generateNotifications();

// Conversion Rates
export const conversionRates = [
  {
    id: 1,
    rate: 10,
    effectiveFrom: '2024-01-01T00:00:00.000Z',
    effectiveTo: '2024-06-30T23:59:59.999Z',
    createdBy: 'admin-1',
    createdAt: '2023-12-15T00:00:00.000Z'
  },
  {
    id: 2,
    rate: 10,
    effectiveFrom: '2024-07-01T00:00:00.000Z',
    effectiveTo: null,
    createdBy: 'admin-1',
    createdAt: '2024-06-20T00:00:00.000Z'
  }
];

// System Settings
export const systemSettings = {
  timezone: 'Australia/Sydney',
  currency: 'AUD',
  currencySymbol: '$',
  pointsPerUnit: 2,
  minimumWithdrawal: 100,
  maximumWithdrawal: 2500,
  maxWithdrawalPoints: 2500,
  referralHoursCap: 120,
  inactivityPeriods: {
    flagInactive: 3,
    deleteAccount: 6,
  },
  features: {
    referralSystem: true,
    withdrawalSystem: true,
    pointsSystem: true,
    notifications: true,
    professionBasedRates: true,
  },
  retentionYears: 5
};

// Reports
export const reports = [
  {
    id: 1,
    title: 'Monthly Referral Report',
    type: 'referral',
    description: 'Summary of all referrals for the month',
    createdBy: 'admin-1',
    createdAt: '2026-01-01T00:00:00.000Z',
    schedule: 'monthly',
    nextRun: '2026-02-01T00:00:00.000Z'
  },
  {
    id: 2,
    title: 'Weekly Withdrawal Report',
    type: 'withdrawal',
    description: 'Summary of all withdrawals for the week',
    createdBy: 'admin-2',
    createdAt: '2026-01-08T00:00:00.000Z',
    schedule: 'weekly',
    nextRun: '2026-01-15T00:00:00.000Z'
  },
  {
    id: 3,
    title: 'Quarterly Performance Report',
    type: 'performance',
    description: 'Staff performance summary for the quarter',
    createdBy: 'admin-1',
    createdAt: '2025-12-31T00:00:00.000Z',
    schedule: 'quarterly',
    nextRun: '2026-03-31T00:00:00.000Z'
  }
];

// FAQ Data
export const faqData = [
  {
    id: 1,
    category: 'Referrals',
    question: 'How do I refer someone?',
    answer: 'Share your unique referral code with potential candidates. When they sign up and complete onboarding, you will earn points.'
  },
  {
    id: 2,
    category: 'Referrals',
    question: 'How many points do I earn per referral?',
    answer: 'You earn 500 points for each successful referral that completes the onboarding process.'
  },
  {
    id: 3,
    category: 'Points',
    question: 'How do I check my points balance?',
    answer: 'Your current points balance is displayed on your dashboard. You can also view your points history in the Points section.'
  },
  {
    id: 4,
    category: 'Points',
    question: 'What is the conversion rate?',
    answer: 'The current conversion rate is 10 points per 1 Naira. This rate may be adjusted by management.'
  },
  {
    id: 5,
    category: 'Withdrawals',
    question: 'What is the minimum withdrawal amount?',
    answer: 'The minimum withdrawal amount is 5,000 Naira (50,000 points).'
  },
  {
    id: 6,
    category: 'Withdrawals',
    question: 'How long does withdrawal processing take?',
    answer: 'Withdrawals are typically processed within 3-5 business days after approval.'
  },
  {
    id: 7,
    category: 'Withdrawals',
    question: 'Can I cancel a withdrawal request?',
    answer: 'Yes, you can cancel a withdrawal request as long as it has not been approved or processed.'
  },
  {
    id: 8,
    category: 'Account',
    question: 'How do I update my profile information?',
    answer: 'Go to your Profile page and click the Edit button to update your information.'
  },
  {
    id: 9,
    category: 'Account',
    question: 'How do I change my password?',
    answer: 'Navigate to Profile > Security and use the Change Password form.'
  },
  {
    id: 10,
    category: 'General',
    question: 'Who can I contact for support?',
    answer: 'Use the Support form on the Help page or contact your HR representative.'
  }
];

// Connecteam Settings
export const connecteamSettings = {
  apiKey: '',
  organizationId: '',
  webhookUrl: '',
  syncFrequency: 'daily',
  lastSync: '2026-03-02T22:00:00.000Z',
  isConnected: false,
  autoSync: true,
  shiftMultipliers: {
    regular: 1.0,
    overtime: 1.5,
    weekend: 2.0,
    public_holiday: 2.5,
  },
};

// Shift types for imported hours
const shiftTypes = ['regular', 'overtime', 'weekend', 'public_holiday'];
const shiftTypeWeights = [0.55, 0.2, 0.17, 0.08];
const importStatuses = ['pending', 'approved', 'rejected'];

const pickShiftType = () => {
  const r = Math.random();
  let cum = 0;
  for (let i = 0; i < shiftTypeWeights.length; i++) {
    cum += shiftTypeWeights[i];
    if (r < cum) return shiftTypes[i];
  }
  return 'regular';
};

// Shift multipliers map
const multiplierMap = { regular: 1.0, overtime: 1.5, weekend: 2.0, public_holiday: 2.5 };

// 20 Imported Hours Records (pending/approved/rejected mix)
const generateImportedHours = () => {
  const records = [];
  const selectedUsers = staffUsers.slice(0, 20);
  const statuses = ['pending', 'pending', 'pending', 'approved', 'approved', 'approved', 'approved', 'approved', 'rejected', 'rejected'];
  const today = new Date('2026-03-03');

  selectedUsers.forEach((user, i) => {
    const shiftType = pickShiftType();
    const hours = parseFloat((Math.random() * 6 + 2).toFixed(2)); // 2 - 8 hours
    const professionRate = professionRates.find(p => p.classification === user.classification)?.cashPerPoint || 0.5;
    const multiplier = multiplierMap[shiftType];
    const pointsToAward = Math.round(hours * user.hourlyRate * professionRate * multiplier);

    const shiftDate = new Date(today);
    shiftDate.setDate(shiftDate.getDate() - i);

    const status = statuses[i % statuses.length];
    records.push({
      id: `IH-${1000 + i + 1}`,
      userId: user.id,
      userName: `${user.firstName} ${user.lastName}`,
      classification: user.classification,
      connecteamUserId: user.connecteamUserId,
      shiftDate: shiftDate.toISOString().split('T')[0],
      clockIn: '07:00',
      clockOut: `${7 + Math.floor(hours)}:${String(Math.round((hours % 1) * 60)).padStart(2, '0')}`,
      hoursWorked: hours,
      shiftType,
      multiplier,
      hourlyRate: user.hourlyRate,
      professionRate,
      pointsToAward,
      status,
      approvedBy: status === 'approved' ? 'admin-1' : status === 'rejected' ? 'admin-2' : null,
      approvedAt: status !== 'pending' ? new Date(shiftDate.getTime() + 86400000).toISOString() : null,
      rejectionReason: status === 'rejected' ? 'Shift not verified in rostering system' : null,
      connecteamShiftId: `cs-${5000 + i}`,
      importedAt: new Date(today.getTime() - i * 3600000).toISOString(),
    });
  });

  return records;
};

export const importedHours = generateImportedHours();

// 15 Connecteam Sync Logs
export const connecteamSyncLogs = (() => {
  const logs = [];
  const base = new Date('2026-03-03T22:00:00.000Z');
  for (let i = 0; i < 15; i++) {
    const syncDate = new Date(base.getTime() - i * 86400000);
    const recordsFetched = Math.floor(Math.random() * 25) + 5;
    const failed = Math.random() > 0.85 ? Math.floor(Math.random() * 3) + 1 : 0;
    const success = i !== 4 && i !== 10; // logs 4 and 10 are failures
    logs.push({
      id: `SL-${100 + i}`,
      syncedAt: syncDate.toISOString(),
      status: success ? 'success' : 'failed',
      recordsFetched: success ? recordsFetched : 0,
      recordsImported: success ? recordsFetched - failed : 0,
      recordsFailed: success ? failed : 0,
      duration: success ? `${Math.floor(Math.random() * 8) + 2}s` : '0s',
      triggeredBy: i % 3 === 0 ? 'manual' : 'scheduled',
      errorMessage: success ? null : 'Connection timeout: Unable to reach Connecteam API',
      adminId: i % 3 === 0 ? 'admin-1' : null,
    });
  }
  return logs;
})();

// Dashboard Stats
export const dashboardStats = {
  totalUsers: staffUsers.length,
  activeUsers: staffUsers.filter(u => u.isActive).length,
  inactiveUsers: staffUsers.filter(u => !u.isActive).length,
  totalReferrals: referrals.length,
  pendingReferrals: referrals.filter(r => r.status === 'pending').length,
  approvedReferrals: referrals.filter(r => r.status === 'approved').length,
  completedReferrals: referrals.filter(r => r.status === 'completed').length,
  rejectedReferrals: referrals.filter(r => r.status === 'rejected').length,
  totalWithdrawals: withdrawals.length,
  pendingWithdrawals: withdrawals.filter(w => w.status === 'pending').length,
  approvedWithdrawals: withdrawals.filter(w => w.status === 'approved').length,
  processingWithdrawals: withdrawals.filter(w => w.status === 'processing').length,
  completedWithdrawals: withdrawals.filter(w => w.status === 'completed').length,
  rejectedWithdrawals: withdrawals.filter(w => w.status === 'rejected').length,
  totalPoints: staffUsers.reduce((sum, u) => sum + u.pointsBalance, 0),
  totalWithdrawalAmount: withdrawals.filter(w => w.status === 'completed').reduce((sum, w) => sum + w.amount, 0)
};

// Chart Data
export const chartData = {
  referralsByMonth: [
    { month: 'Jan', count: 28 },
    { month: 'Feb', count: 32 },
    { month: 'Mar', count: 25 },
    { month: 'Apr', count: 30 },
    { month: 'May', count: 35 },
    { month: 'Jun', count: 29 },
    { month: 'Jul', count: 33 },
    { month: 'Aug', count: 27 },
    { month: 'Sep', count: 31 },
    { month: 'Oct', count: 26 },
    { month: 'Nov', count: 22 },
    { month: 'Dec', count: 19 }
  ],
  withdrawalsByMonth: [
    { month: 'Jan', amount: 450000 },
    { month: 'Feb', amount: 520000 },
    { month: 'Mar', amount: 380000 },
    { month: 'Apr', amount: 490000 },
    { month: 'May', amount: 610000 },
    { month: 'Jun', amount: 550000 },
    { month: 'Jul', amount: 580000 },
    { month: 'Aug', amount: 420000 },
    { month: 'Sep', amount: 530000 },
    { month: 'Oct', amount: 470000 },
    { month: 'Nov', amount: 390000 },
    { month: 'Dec', amount: 340000 }
  ],
  topPerformers: staffUsers
    .sort((a, b) => b.successfulReferrals - a.successfulReferrals)
    .slice(0, 10)
    .map(u => ({
      name: `${u.firstName} ${u.lastName}`,
      referrals: u.successfulReferrals
    })),
  departmentBreakdown: [
    { department: 'Sales', count: 20, percentage: 40 },
    { department: 'Marketing', count: 12, percentage: 24 },
    { department: 'IT', count: 8, percentage: 16 },
    { department: 'HR', count: 5, percentage: 10 },
    { department: 'Operations', count: 5, percentage: 10 }
  ]
};

// Recent Activity
export const recentActivity = [
  ...referrals.slice(0, 5).map(r => ({
    id: `ref-${r.id}`,
    type: 'referral',
    message: `${r.referrerName} referred ${r.refereeName}`,
    status: r.status,
    timestamp: r.createdAt
  })),
  ...withdrawals.slice(0, 5).map(w => ({
    id: `withdrawal-${w.id}`,
    type: 'withdrawal',
    message: `${w.userName} requested withdrawal of NGN ${w.amount.toLocaleString()}`,
    status: w.status,
    timestamp: w.createdAt
  }))
].sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp)).slice(0, 10);

// Alerts
export const alerts = [
  {
    id: 1,
    type: 'warning',
    title: 'Pending Withdrawals',
    message: `${dashboardStats.pendingWithdrawals} withdrawals pending approval`,
    count: dashboardStats.pendingWithdrawals,
    link: '/admin/withdrawals?status=pending'
  },
  {
    id: 2,
    type: 'info',
    title: 'Pending Referrals',
    message: `${dashboardStats.pendingReferrals} referrals awaiting review`,
    count: dashboardStats.pendingReferrals,
    link: '/admin/referrals?status=pending'
  },
  {
    id: 3,
    type: 'success',
    title: 'Active Users',
    message: `${dashboardStats.activeUsers} users currently active`,
    count: dashboardStats.activeUsers,
    link: '/admin/users?status=active'
  }
];
