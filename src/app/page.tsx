'use client';

import React, { useState, useEffect, useCallback, memo } from 'react';
import axios from 'axios';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import DatePicker from 'react-datepicker';
import "react-datepicker/dist/react-datepicker.css";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import * as CheckboxPrimitive from "@radix-ui/react-checkbox";
import { Check } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import PlaneIcon from '../../public/icons/plane.svg';
import CarIcon from '../../public/icons/car.svg';
import HotelIcon from '../../public/icons/hotel.svg';
import TravelIcon from '../../public/icons/travel.svg';

interface Flight {
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
  reservations?: number;
}

export default function Home() {
  const [flights, setFlights] = useState<Flight[]>([]);
  const [date, setDate] = useState<Date | null>(null);
  const [returnDate, setReturnDate] = useState<Date | null>(null);
  const [direction, setDirection] = useState<string | null>(null);
  const [tripType, setTripType] = useState('round');
  const [sortOption, setSortOption] = useState('recommended');
  const [arrivalTime, setArrivalTime] = useState<string[]>([]);
  const [stops, setStops] = useState<string[]>([]);
  const [airlines, setAirlines] = useState<string[]>([]);
  const router = useRouter();
  const [filteredFlights, setFilteredFlights] = useState<Flight[]>([]);
  const [expandedFlights, setExpandedFlights] = useState<{ [key: string]: boolean }>({});
  const [from, setFrom] = useState('');
  const [to, setTo] = useState('');

  useEffect(() => {
    if (date && direction) {
      fetchFlights();
    }
  }, [date, direction]);


  useEffect(() => {
    if (flights.length > 0) {
      sortFlights(sortOption);
    }
  }, [sortOption]);

  const fetchFlights = async () => {
    try {
      if (!date || !direction || !from || !to) {
        return;
      }

      console.log('Fetching flights with:', { date, direction, from, to });
      const formattedDate = date.toISOString().split('T')[0];
      const response = await axios.get<{ flights: Flight[] }>('/api/flights', { 
        params: { 
          date: formattedDate, 
          direction,
          from: from.toUpperCase(),
          to: to.toUpperCase()
        } 
      });
      console.log('API response:', response.data);
      
      const flightsWithDestinations = response.data.flights.map(flight => {
        if (!flight.route.destinations || flight.route.destinations.length < 2) {
          flight.route.destinations = [from.toUpperCase(), to.toUpperCase()];
        }
        return flight;
      });

      const filteredFlights = flightsWithDestinations.filter(flight => {
        console.log('Checking flight:', flight);
        console.log('From:', flight.route.destinations[0], 'To:', flight.route.destinations[1]);
        return flight.route.destinations[0].toUpperCase() === from && 
               flight.route.destinations[1].toUpperCase() === to;
      });
      console.log('Filtered flights:', filteredFlights);

      setFlights(filteredFlights);
      setFilteredFlights(filteredFlights);
      
      if (filteredFlights.length === 0) {
      } else {
      }

      // Eğer Round Trip modundaysak, dönüş uçuşlarını da getir
      if (tripType === 'round' && returnDate) {
        const formattedReturnDate = returnDate.toISOString().split('T')[0];
        const returnResponse = await axios.get<{ flights: Flight[] }>('/api/flights', { 
          params: { 
            date: formattedReturnDate, 
            direction: 'A', // Dönüş uçuşları için yönü tersine çevir
            from: to.toUpperCase(),
            to: from.toUpperCase()
          } 
        });
        console.log('Return API response:', returnResponse.data);

        const returnFlightsWithDestinations = returnResponse.data.flights.map(flight => {
          if (!flight.route.destinations || flight.route.destinations.length < 2) {
            flight.route.destinations = [to.toUpperCase(), from.toUpperCase()];
          }
          return flight;
        });

        const filteredReturnFlights = returnFlightsWithDestinations.filter(flight => {
          console.log('Checking return flight:', flight);
          console.log('From:', flight.route.destinations[0], 'To:', flight.route.destinations[1]);
          return flight.route.destinations[0].toUpperCase() === to && 
                 flight.route.destinations[1].toUpperCase() === from;
        });
        console.log('Filtered return flights:', filteredReturnFlights);

        setFlights(prevFlights => [...prevFlights, ...filteredReturnFlights]);
        setFilteredFlights(prevFlights => [...prevFlights, ...filteredReturnFlights]);
        
        if (filteredReturnFlights.length === 0) {
        } else {
        }
      }
    } catch (error) {
      console.error('Failed to fetch flights', error);
      if (axios.isAxiosError(error)) {
        console.error('Error details:', error.response?.data);
      }
    }
  };

  const sortFlights = useCallback((option: string) => {
    setFlights(prevFlights => {
      const sortedFlights = [...prevFlights];
      switch (option) {
        case 'lowest':
          sortedFlights.sort((a, b) => {
            return 0; // Geçici olarak sıralama yapılmıyor
          });
          break;
        case 'recommended':
          // Önerilen sıralama mantığı
          break;
        default:
          break;
      }
      return sortedFlights;
    });
  }, []);

  const makeReservation = async (flight: Flight) => {
    const currentDate = new Date();
    const flightDate = new Date(flight.scheduleDateTime);

    if (flightDate < currentDate) {
      return;
    }

    try {
      const response = await axios.post('/api/reservations', {
        flightId: flight.id,
        userId: 'example-user-id',
        flightDetails: flight
      });

      if (response.data.success) {
        console.log('Updating flight with id:', flight.id);

        // Uçuş bilgilerini güncelle
        const updateResponse = await axios.put('/api/flights', {
          id: flight.id,
          flightDetails: {
            ...flight,
            reservations: (flight.reservations || 0) + 1
          }
        });


        if (updateResponse.data.success) {
          console.log('Flight updated successfully');
          await fetchFlights(); // Uçuş listesini yenile
        } else {
          console.error('Failed to update flight:', updateResponse.data.error);
        }

        // Yönlendirmeyi hemen yap
        router.push('/my-flights');
      } else {
      }
    } catch (error) {
      console.error('Reservation error:', error);
    }
  };

  function getAirlineLogo() {
    return "/general-airline-logo.png";
  }

  // Gidiş tarihini ayarlayan fonksiyon
  const handleDepartDateChange = (selectedDate: Date | null) => {
    setDate(selectedDate);
    // Eğer dönüş tarihi, yeni gidiş tarihinden önceyse veya null ise, dönüş tarihini sıfırla
    if (returnDate && selectedDate && returnDate < selectedDate) {
      setReturnDate(null);
    }
  };

  // Dönüş tarihini ayarlayan fonksiyon
  const handleReturnDateChange = (selectedDate: Date | null) => {
    if (date && selectedDate) {
      // Eğer seçilen dönüş tarihi, gidiş tarihinden önceyse, dönüş tarihini gidiş tarihine eşitle
      setReturnDate(selectedDate < date ? date : selectedDate);
    } else {
      setReturnDate(selectedDate);
    }
  };

  const filterFlights = useCallback(() => {
    if (flights.length === 0) return;

    console.log('Filtering flights. Current flights:', flights);
    console.log('Current filter criteria:', { from, to, arrivalTime, stops, airlines });

    let newFilteredFlights = flights.filter(flight => {
      const fromMatch = (flight.route.airportCodes?.[0] || flight.route.destinations[0])?.toUpperCase().includes(from) || 
                      getDestinationName(flight.route.airportCodes?.[0] || flight.route.destinations[0]).toUpperCase().includes(from);
      const toMatch = (flight.route.airportCodes?.[1] || flight.route.destinations[1])?.toUpperCase().includes(to) || 
                    getDestinationName(flight.route.airportCodes?.[1] || flight.route.destinations[1]).toUpperCase().includes(to);
      console.log(`Flight ${flight.flightNumber}: fromMatch=${fromMatch}, toMatch=${toMatch}`);
      return fromMatch && toMatch;
    });


    console.log('Flights after destination filter:', newFilteredFlights);

    // Arrival Time filtresi
    if (arrivalTime.length > 0) {
      newFilteredFlights = newFilteredFlights.filter(flight => {
        const arrivalHour = new Date(flight.scheduleDateTime).getHours();
        return (arrivalTime.includes('morning') && arrivalHour >= 5 && arrivalHour < 12) ||
               (arrivalTime.includes('afternoon') && arrivalHour >= 12 && arrivalHour < 18);
      });
    }

    // Stops filtresi
    if (stops.length > 0) {
      newFilteredFlights = newFilteredFlights.filter(flight => {
        // Bu örnek için, uçuşların hepsini non-stop kabul ediyoruz
        // Gerçek verilerinizde bu bilgi varsa, ona göre filtreleme yapabilirsiniz
        return stops.includes('nonstop');
      });
    }

    // Airlines filtresi
    if (airlines.length > 0) {
      newFilteredFlights = newFilteredFlights.filter(flight => {
        // Bu örnek için, uçuş numarasının ilk iki harfini havayolu kodu olarak kullanıyoruz
        const airlineCode = flight.flightNumber.slice(0, 2);
        return airlines.includes(airlineCode.toLowerCase());
      });
    }

    setFilteredFlights(newFilteredFlights);
    console.log('Final filtered flights:', newFilteredFlights);
  }, [flights, from, to, arrivalTime, stops, airlines]);

  useEffect(() => {
    filterFlights();
  }, [filterFlights, sortOption]);

  const MemoizedCheckbox = memo(({ id, checked, onCheckedChange, children }: { id: string; checked: boolean; onCheckedChange: (checked: boolean) => void; children: React.ReactNode }) => (
    <div className="flex items-center">
      <CheckboxPrimitive.Root
        id={id}
        checked={checked}
        onCheckedChange={onCheckedChange}
        className="h-4 w-4 rounded border border-gray-300 bg-white focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2"
      >
        <CheckboxPrimitive.Indicator className="flex items-center justify-center">
          <Check className="h-3 w-3 text-purple-600" />
        </CheckboxPrimitive.Indicator>
      </CheckboxPrimitive.Root>
      <label htmlFor={id} className="ml-2 text-sm text-gray-700">
        {children}
      </label>
    </div>
  ));

  MemoizedCheckbox.displayName = "MemoizedCheckbox";

  const getDestinationName = (code: string): string => {
    console.log('Getting destination name for code:', code);
    const destinations: { [key: string]: string } = {
      // Avrupa (40 şehir)
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
    // Türkiye (15 şehir)
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
    // ABD (15 şehir)
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
    // Rusya (3 şehir)
    'KZN': 'Kazan',
    'LED': 'St. Petersburg',
    'MOW': 'Moscow',

    // Avustralya (3 şehir)
    'BNE': 'Brisbane',
    'MEL': 'Melbourne',
    'SYD': 'Sydney',
    // Arap Yarımadası ve Afrika (14 şehir)
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
    // Çin (5 şehir)
    'CAN': 'Guangzhou',
    'CTU': 'Chengdu',
    'PEK': 'Beijing',
    'SHA': 'Shanghai',
    'SZX': 'Shenzhen',

    // Japonya (5 şehir)
    'FUK': 'Fukuoka',
    'NGO': 'Nagoya',
    'OSA': 'Osaka',
    'SPK': 'Sapporo',
    'TYO': 'Tokyo'



      // Diğer destinasyonları buraya ekleyin
    };
    const result = destinations[code.toUpperCase()] || code;
    console.log('Destination name result:', result);
    return result;
  };

  function getFlightStatusText(status: string): string {
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
      CNX: "Cancelled",
      // Diğer durumları da ekleyebilirsiniz
    };
    return statusMap[status] || status;
  }

  return (
    <div className="bg-purple-300 min-h-screen p-2 sm:p-4">
      <Card className="bg-gradient-to-br from-purple-100 to-gray-200">
        <CardContent className="p-3 sm:p-6">
          <header className="flex flex-col sm:flex-row justify-between items-center mb-4 sm:mb-8">
            <Link href="/" className="flex items-center space-x-2 mb-4 sm:mb-0">
              <div className="w-8 h-8 bg-purple-600 rounded-full flex items-center justify-center">
                <PlaneIcon className="w-5 h-5" fill="white" />
              </div>
              <span className="text-xl font-bold text-purple-600">PLANE SCAPE</span>
            </Link>
            <nav className="flex flex-wrap justify-center sm:justify-end items-center space-x-2 sm:space-x-4">
              <a href="#" className="text-purple-600 flex items-center font-semibold text-sm sm:text-lg mb-2 sm:mb-0">
                <Image src="/icons/tag.svg" alt="Deals" width={20} height={20} className="mr-1 sm:mr-2" />
                Deals
              </a>
              <a href="#" className="text-purple-600 flex items-center font-semibold text-sm sm:text-lg mb-2 sm:mb-0">
                <Image src="/icons/worldwide.svg" alt="Discover" width={20} height={20} className="mr-1 sm:mr-2" />
                Discover
              </a>
              <div className="flex items-center space-x-2">
                <Image
                  src="/profile-photo.jpg"
                  alt="Joane Smith"
                  width={32}
                  height={32}
                  className="rounded-full object-cover"
                />
                <span className="font-semibold text-sm sm:text-lg">Joane Smith</span>
              </div>
            </nav>
          </header>

          <div className="flex flex-col lg:flex-row gap-4 lg:gap-8">
            <div className="w-full lg:w-3/4">
              <Card className="mb-4 sm:mb-8 bg-white">
                <CardContent className="p-3 sm:p-6">
                  <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4 sm:mb-6">
                    <h2 className="text-lg sm:text-xl font-bold flex items-center mb-2 sm:mb-0">
                      <PlaneIcon className="mr-2 w-5 h-5 sm:w-6 sm:h-6 text-purple-600" />
                      <span className="text-black">BOOK YOUR FLIGHT</span>
                    </h2>
                    <div className="inline-flex rounded-md overflow-hidden">
                      <button
                        className={`px-3 sm:px-6 py-1 sm:py-2 text-sm sm:text-base ${
                          tripType === 'round' ? 'bg-purple-600 text-white' : 'bg-gray-200'
                        }`}
                        onClick={() => setTripType('round')}
                      >
                        Round Trip
                      </button>
                      <button
                        className={`px-3 sm:px-6 py-1 sm:py-2 text-sm sm:text-base ${
                          tripType === 'one' ? 'bg-purple-600 text-white' : 'bg-gray-200'
                        }`}
                        onClick={() => setTripType('one')}
                      >
                        One Way
                      </button>
                    </div>
                  </div>
                  <div className={`grid ${tripType === 'round' ? 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-4' : 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3'} gap-2 sm:gap-4`}>
                    {/* From input */}
                    <div className="relative">
                      <Input 
                        id="from" 
                        className="pl-10 pr-3" 
                        placeholder="Select departure" 
                        value={from}
                        onChange={(e) => setFrom(e.target.value.toUpperCase())}
                      />
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <Image 
                          src="/icons/departures.svg"
                          alt="Departure"
                          width={20}
                          height={20}
                        />
                      </div>
                    </div>
                    {/* To input */}
                    <div className="relative">
                      <Input 
                        id="to" 
                        className="pl-10 pr-3" 
                        placeholder="Select arrival" 
                        value={to}
                        onChange={(e) => setTo(e.target.value.toUpperCase())}
                      />
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <Image 
                          src="/icons/arrivals.svg" 
                          alt="Arrival" 
                          width={20} 
                          height={20} 
                        />
                      </div>
                    </div>
                    {/* Depart date picker */}
                    <div className="relative">
                      <DatePicker
                        selected={date}
                        onChange={handleDepartDateChange}
                        minDate={new Date()}
                        customInput={
                          <Input
                            id="depart"
                            className="pl-10 pr-3"
                            placeholder="Select date"
                          />
                        }
                        wrapperClassName="w-full"
                        popperClassName="react-datepicker-right"
                        popperPlacement="bottom-start"
                      />
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <Image 
                          src="/icons/calendar.svg" 
                          alt="Calendar" 
                          width={20} 
                          height={20} 
                        />
                      </div>
                    </div>
                    {/* Return date picker (only for round trip) */}
                    {tripType === 'round' && (
                      <div className="relative">
                        <DatePicker
                          selected={returnDate}
                          onChange={handleReturnDateChange}
                          minDate={date || new Date()}
                          customInput={
                            <Input
                              id="return"
                              className="pl-10 pr-3"
                              placeholder="Select date"
                            />
                          }
                          wrapperClassName="w-full"
                          popperClassName="react-datepicker-right"
                          popperPlacement="bottom-start"
                        />
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                          <Image 
                            src="/icons/calendar.svg" 
                            alt="Calendar" 
                            width={20} 
                            height={20} 
                          />
                        </div>
                      </div>
                    )}
                  </div>
                  <Button 
                    className="w-full sm:w-32 bg-purple-600 hover:bg-purple-700 mt-4" 
                    onClick={() => {
                      setDirection('D');
                      fetchFlights();
                    }}
                  >
                    Show Flights
                  </Button>
                </CardContent>
              </Card>

              {/* Flight results */}
              {flights.length > 0 && (
                <div className="flex flex-col lg:flex-row gap-4">
                  <div className="w-full lg:w-3/4">
                    <AnimatePresence>
                      {filteredFlights.length > 0 ? (
                        filteredFlights.map((flight) => (
                          <motion.div
                            key={flight.id}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -20 }}
                            transition={{ duration: 0.3 }}
                          >
                            <Card className="mb-4 sm:mb-10 bg-white relative">
                              <CardContent className="p-3 sm:p-4 pb-16">
                                <div className="flex flex-col sm:flex-row justify-between items-center">
                                  <div className="w-1/3 flex flex-col justify-center h-full">
                                    <p className="font-semibold text-base sm:text-lg mb-2">
                                      {`${getDestinationName(flight.route.destinations[0].toUpperCase())} - ${getDestinationName(flight.route.destinations[1].toUpperCase())}`}
                                    </p>
                                    <div className="flex items-center mb-1">
                                      <Image src="/icons/departures.svg" alt="Departure" width={20} height={20} className="text-purple-600 mr-2" />
                                      <span className="text-sm text-gray-500">Departure</span>
                                    </div>
                                    <p className="font-semibold">
                                      {new Date(flight.scheduleDateTime).toLocaleTimeString('en-US', { 
                                        hour: 'numeric', 
                                        minute: '2-digit', 
                                        hour12: true 
                                      })}
                                    </p>
                                    <p className="text-sm text-gray-500 mt-2">Flight Number: {flight.flightNumber}</p>
                                  </div>
                                  <div className="w-1/3 flex flex-col items-center justify-center h-full py-4">
                                    <Image 
                                      src={getAirlineLogo()}
                                      alt="Airline Logo" 
                                      width={80}
                                      height={80}
                                      className="mb-4 object-contain p-2 bg-white rounded-lg shadow-md"
                                    />
                                    <div className="flex flex-col items-center">
                                      <PlaneIcon className="text-purple-600 mb-2 w-6 h-6" />
                                      <p className="text-sm text-gray-500">2h 25m (Nonstop)</p>
                                    </div>
                                    <p className="font-semibold mt-2">
                                      <span className="text-purple-600 mr-2">Price:</span>$200
                                    </p>
                                    <p className="text-sm text-gray-500">{tripType === 'round' ? 'Round Trip' : 'One Way'}</p>
                                  </div>
                                  <div className="w-1/3 flex flex-col items-end justify-center h-full">
                                    <div className="flex items-center mb-1">
                                      <Image src="/icons/arrivals.svg" alt="Arrival" width={20} height={20} className="text-purple-600 mr-2" />
                                      <span className="text-sm text-gray-500">Arrival</span>
                                    </div>
                                    <p className="font-semibold">
                                      {new Date(new Date(flight.scheduleDateTime).getTime() + 2*60*60*1000).toLocaleTimeString('en-US', { 
                                        hour: 'numeric', 
                                        minute: '2-digit', 
                                        hour12: true 
                                      })}
                                    </p>
                                  </div>
                                </div>
                                <div className="flex justify-between items-center mt-4">
                                  <Button 
                                    className="absolute -bottom-4 left-4 bg-purple-600 hover:bg-purple-700 text-white text-xs py-1 px-2 rounded-b-md"
                                    onClick={() => setExpandedFlights(prev => ({ ...prev, [flight.id]: !prev[flight.id] }))}
                                  >
                                    {expandedFlights[flight.id] ? 'Hide Details' : 'Check the Details'}
                                  </Button>
                                  <Button 
                                    className="absolute bottom-4 right-4 bg-purple-600 hover:bg-purple-700 text-white"
                                    onClick={() => makeReservation(flight)}
                                  >
                                    Book Flight
                                  </Button>
                                </div>
                              </CardContent>
                              {expandedFlights[flight.id] && (
                                <motion.div
                                  initial={{ opacity: 0, height: 0 }}
                                  animate={{ opacity: 1, height: 'auto' }}
                                  exit={{ opacity: 0, height: 0 }}
                                  transition={{ duration: 0.3 }}
                                  className="px-4 pb-16 pt-6 border-t border-gray-200"
                                >
                                  <p className="text-sm font-semibold mb-2">
                                    Flight Number: {flight.flightNumber}
                                  </p>
                                  <p className="text-sm mb-2">
                                    Status: {getFlightStatusText(flight.publicFlightState || 'N/A')}
                                  </p>
                                  <p className="text-sm mb-2">
                                    Estimated Departure: {flight.publicEstimatedOffBlockTime || 'N/A'}
                                  </p>
                                  <p className="text-sm mb-2">
                                    Estimated Arrival: {flight.estimatedLandingTime || 'N/A'}
                                  </p>
                                  <p className="text-sm mb-2">
                                    Terminal: {flight.terminal || 'N/A'}, Gate: {flight.gate || 'N/A'}
                                  </p>
                                  <p className="text-sm mb-2">
                                    Aircraft: {flight.aircraftType ? `${flight.aircraftType.iatamain || ''} ${flight.aircraftType.iatasub || ''}` : 'N/A'}
                                  </p>
                                  <p className="text-sm">
                                    Airline: {flight.airlineCode || 'N/A'}
                                  </p>
                                </motion.div>
                              )}
                            </Card>
                          </motion.div>
                        ))
                      ) : (
                        <motion.div
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: -20 }}
                          transition={{ duration: 0.3 }}
                          className="bg-white rounded-lg p-8 text-center shadow-md"
                        >
                          <p className="text-2xl text-gray-800 font-semibold">
                            Unfortunately, no flights matching your criteria were found.
                          </p>
                          <p className="mt-4 text-lg text-gray-600">
                            Please try adjusting your search parameters or select a different date.
                          </p>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                  <div className="w-full lg:w-1/4">
                    <Card className="bg-white">
                      <CardContent className="p-4">
                        <h4 className="font-semibold mb-4">Sort by:</h4>
                        <div className="space-y-4">
                          <div>
                            <select
                              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                              value={sortOption}
                              onChange={(e) => {
                                setSortOption(e.target.value);
                                sortFlights(e.target.value);
                              }}
                            >
                              <option value="recommended">Recommended</option>
                              <option value="lowest">Lowest Price</option>
                            </select>
                          </div>
                          <div>
                            <Label className="block mb-2 text-sm font-medium text-gray-700">Arrival Time</Label>
                            <div className="space-y-2">
                              <MemoizedCheckbox
                                id="morning"
                                checked={arrivalTime.includes('morning')}
                                onCheckedChange={(checked) => {
                                  if (checked) {
                                    setArrivalTime(prev => [...prev, 'morning']);
                                  } else {
                                    setArrivalTime(prev => prev.filter(time => time !== 'morning'));
                                  }
                                }}
                              >
                                5:00 AM - 11:59 AM
                              </MemoizedCheckbox>
                              <MemoizedCheckbox
                                id="afternoon"
                                checked={arrivalTime.includes('afternoon')}
                                onCheckedChange={(checked) => {
                                  if (checked) {
                                    setArrivalTime(prev => [...prev, 'afternoon']);
                                  } else {
                                    setArrivalTime(prev => prev.filter(time => time !== 'afternoon'));
                                  }
                                }}
                              >
                                12:00 PM - 5:59 PM
                              </MemoizedCheckbox>
                            </div>
                          </div>
                          <div>
                            <Label className="block mb-2 text-sm font-medium text-gray-700">Stops</Label>
                            <div className="space-y-2">
                              <MemoizedCheckbox
                                id="nonstop"
                                checked={stops.includes('nonstop')}
                                onCheckedChange={(checked) => {
                                  if (checked) {
                                    setStops(prev => [...prev, 'nonstop']);
                                  } else {
                                    setStops(prev => prev.filter(stop => stop !== 'nonstop'));
                                  }
                                }}
                              >
                                Nonstop
                              </MemoizedCheckbox>
                              <MemoizedCheckbox
                                id="oneStop"
                                checked={stops.includes('oneStop')}
                                onCheckedChange={(checked) => {
                                  if (checked) {
                                    setStops(prev => [...prev, 'oneStop']);
                                  } else {
                                    setStops(prev => prev.filter(stop => stop !== 'oneStop'));
                                  }
                                }}
                              >
                                1 Stop
                              </MemoizedCheckbox>
                              <MemoizedCheckbox
                                id="twoOrMoreStops"
                                checked={stops.includes('twoOrMoreStops')}
                                onCheckedChange={(checked) => {
                                  if (checked) {
                                    setStops(prev => [...prev, 'twoOrMoreStops']);
                                  } else {
                                    setStops(prev => prev.filter(stop => stop !== 'twoOrMoreStops'));
                                  }
                                }}
                              >
                                2+ Stops
                              </MemoizedCheckbox>
                            </div>
                          </div>
                          <div>
                            <Label className="block mb-2 text-sm font-medium text-gray-700">Airlines included</Label>
                            <div className="space-y-2">
                              {['Alitalia', 'Lufthansa', 'Air France', 'Brussels Airlines', 'Air Italy', 'Turkish Airlines', 'Siberia'].map((airline) => (
                                <MemoizedCheckbox
                                  key={airline}
                                  id={airline.toLowerCase().replace(' ', '-')}
                                  checked={airlines.includes(airline.toLowerCase().slice(0, 2))}
                                  onCheckedChange={(checked: boolean) => {
                                    if (checked) {
                                      setAirlines((prev: string[]) => [...prev, airline.toLowerCase().slice(0, 2)]);
                                    } else {
                                      setAirlines((prev: string[]) => prev.filter((a: string) => a !== airline.toLowerCase().slice(0, 2)));
                                    }
                                  }}
                                >
                                  {airline}
                                </MemoizedCheckbox>
                              ))}
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                </div>
              )}
            </div>

            <div className="w-full lg:w-1/4 space-y-4">
              <Card className="bg-gradient-to-r from-teal-400 to-blue-500 text-white rounded-lg overflow-hidden shadow-sm transition-transform hover:scale-102 aspect-square relative">
                <div className="absolute inset-0">
                  <Image 
                    src="/car-rental.jpg" 
                    alt="Car rental" 
                    fill
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    className="rounded-lg object-cover"
                    priority 
                  />
                </div>
                <div className="absolute bottom-0 left-0 p-4 bg-gradient-to-t from-black/60 to-transparent w-full">
                  <div className="flex flex-col items-start">
                    <CarIcon className="w-8 h-8 mb-1 text-white" />
                    <h3 className="text-lg font-bold text-white drop-shadow-lg">CAR RENTALS</h3>
                  </div>
                </div>
              </Card>
              <Card className="bg-gradient-to-r from-blue-400 to-indigo-500 text-white rounded-lg overflow-hidden shadow-sm transition-transform hover:scale-102 aspect-square relative">
                <div className="absolute inset-0">
                  <Image 
                    src="/hotels.jpg" 
                    alt="Hotels" 
                    fill
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    className="rounded-lg object-cover"
                    priority 
                  />
                </div>
                <div className="absolute bottom-0 left-0 p-4 bg-gradient-to-t from-black/60 to-transparent w-full">
                  <div className="flex flex-col items-start">
                    <HotelIcon className="w-8 h-8 mb-1 text-white" />
                    <h3 className="text-lg font-bold text-white drop-shadow-lg">HOTELS</h3>
                  </div>
                </div>
              </Card>
              <Card className="bg-gradient-to-r from-green-400 to-lime-500 text-white rounded-lg overflow-hidden shadow-sm transition-transform hover:scale-102 aspect-square relative">
                <div className="absolute inset-0">
                  <Image 
                    src="/travel.jpg" 
                    alt="Travel packages" 
                    fill
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    className="rounded-lg object-cover"
                    priority 
                  />
                </div>
                <div className="absolute bottom-0 left-0 p-4 bg-gradient-to-t from-black/60 to-transparent w-full">
                  <div className="flex flex-col items-start">
                    <TravelIcon className="w-8 h-8 mb-1 text-white" />
                    <h3 className="text-lg font-bold text-white drop-shadow-lg">TRAVEL PACKAGES</h3>
                  </div>
                </div>
              </Card>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
