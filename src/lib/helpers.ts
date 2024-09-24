export interface Flight {
  id: string;
  flightNumber: string;
  route: {
    destinations: string[];
    airportCodes?: string[];
  };
  scheduleDateTime: string;
  flightDirection: string;
  publicFlightState?: string;
  publicEstimatedOffBlockTime?: string;
  estimatedLandingTime?: string;
  terminal?: string;
  gate?: string;
  aircraftType?: {
    iatamain?: string;
    iatasub?: string;
  };
  airlineCode?: string;
  reservations?: number; // Bu satırı ekleyin
}

export function getDestinationName(code: string): string {
  const destinations: { [key: string]: string } = {
    'AMS': 'Amsterdam',
    'ATH': 'Athens',
    'BCN': 'Barcelona',
    'BEG': 'Belgrade',
    'BER': 'Berlin',
    'BRU': 'Brussels',
    'BUD': 'Budapest',
    'CPH': 'Copenhagen',
    'DUB': 'Dublin',
    'DUS': 'Dusseldorf',
    'EDI': 'Edinburgh',
    'FCO': 'Rome Fiumicino',
    'FRA': 'Frankfurt',
    'GVA': 'Geneva',
    'HAM': 'Hamburg',
    'HEL': 'Helsinki',
    'KRK': 'Krakow',
    'LEJ': 'Leipzig',
    'LIS': 'Lisbon',
    'LJU': 'Ljubljana',
    'LON': 'London',
    'MAD': 'Madrid',
    'MIL': 'Milan',
    'MUC': 'Munich',
    'MXP': 'Milan',
    'NAP': 'Naples',
    'OSL': 'Oslo',
    'OTP': 'Bucharest',
    'PAR': 'Paris',
    'PRG': 'Prague',
    'RIX': 'Riga',
    'ROM': 'Rome',
    'SOF': 'Sofia',
    'STO': 'Stockholm',
    'STR': 'Stuttgart',
    'TLL': 'Tallinn',
    'VCE': 'Venice',
    'VIE': 'Vienna',
    'VNO': 'Vilnius',
    'WAW': 'Warsaw',
    'ZAG': 'Zagreb',
    'ZRH': 'Zurich',
    'ADA': 'Adana',
    'ADB': 'Izmir',
    'ASR': 'Kayseri',
    'AYT': 'Antalya',
    'BJV': 'Bodrum',
    'DIY': 'Diyarbakir',
    'DLM': 'Dalaman',
    'DNZ': 'Denizli',
    'ERZ': 'Erzurum',
    'ESB': 'Ankara',
    'GZP': 'Alanya',
    'GZT': 'Gaziantep',
    'IST': 'Istanbul',
    'KYA': 'Konya',
    'TZX': 'Trabzon',
    'VAN': 'Van',
    'ANC': 'Anchorage',
    'ATL': 'Atlanta',
    'BOS': 'Boston',
    'DEN': 'Denver',
    'DFW': 'Dallas',
    'HNL': 'Honolulu',
    'IAD': 'Washington D.C.',
    'LAS': 'Las Vegas',
    'LAX': 'Los Angeles',
    'MIA': 'Miami',
    'NYC': 'New York',
    'ORD': 'Chicago',
    'PHX': 'Phoenix',
    'SEA': 'Seattle',
    'SFO': 'San Francisco',
    'KZN': 'Kazan',
    'LED': 'St. Petersburg',
    'MOW': 'Moscow',
    'BNE': 'Brisbane',
    'MEL': 'Melbourne',
    'SYD': 'Sydney',
    'ADD': 'Addis Ababa',
    'ALG': 'Algiers',
    'AUH': 'Abu Dhabi',
    'CAI': 'Cairo',
    'CMN': 'Casablanca',
    'CPT': 'Cape Town',
    'DAR': 'Dar es Salaam',
    'DOH': 'Doha',
    'DXB': 'Dubai',
    'JNB': 'Johannesburg',
    'LOS': 'Lagos',
    'NBO': 'Nairobi',
    'RUH': 'Riyadh',
    'TUN': 'Tunis',
    'CAN': 'Guangzhou',
    'CTU': 'Chengdu',
    'PEK': 'Beijing',
    'SHA': 'Shanghai',
    'SZX': 'Shenzhen',
    'FUK': 'Fukuoka',
    'NGO': 'Nagoya',
    'OSA': 'Osaka',
    'SPK': 'Sapporo',
    'TYO': 'Tokyo'
  };
  return destinations[code.toUpperCase()] || code;
}

export function getFlightStatusText(status: string): string {
  const statusMap: { [key: string]: string } = {
    SCH: "Scheduled",
    AIR: "Airborne",
    EXP: "Expected landing",
    LND: "Landed",
    ARR: "Arrived",
    DEL: "Delayed",
    WIL: "Wait in Lounge",
    BRD: "Boarding",
    DEP: "Departed",
    CNX: "Cancelled"
  };
  return statusMap[status] || status;
}

export function getAirlineLogo() {
  return "/general-airline-logo.png";
}