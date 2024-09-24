'use client';

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Image from 'next/image';
import Link from 'next/link';
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { motion, AnimatePresence } from "framer-motion";
import PlaneIcon from '../../../public/icons/plane.svg';

interface Reservation {
  _id: string;
  flightId: string;
  userId: string;
  flightDetails: {
    id: string;
    flightNumber: string;
    route: {
      destinations: string[];
    };
    scheduleDateTime: string;
    flightDirection: string;
  };
  createdAt: string;
}

const Star = ({ filled, onClick }: { filled: boolean; onClick: () => void }) => (
  <svg
    className="w-4 h-4 cursor-pointer"
    viewBox="0 0 24 24"
    fill={filled ? "#7c3aed" : "none"}
    stroke="#7c3aed"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    onClick={onClick}
  >
    <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
  </svg>
);

export default function MyFlights() {
  const [reservations, setReservations] = useState<Reservation[]>([]);
  const [expandedFlights, setExpandedFlights] = useState<{ [key: string]: boolean }>({});
  const [stars, setStars] = useState(Array(30).fill(false));

  useEffect(() => {
    fetchReservations();
  }, []);


  const fetchReservations = async () => {
    try {
      const response = await axios.get<{ reservations: Reservation[] }>('/api/reservations');
      console.log('Fetched reservations:', response.data);
      setReservations(response.data.reservations);
    } catch (error) {
      console.error('Failed to fetch reservations', error);
    }
  };

  const cancelReservation = async (reservationId: string) => {
    try {
      const response = await axios.delete(`/api/reservations/${reservationId}`);
      if (response.data.success) {
        fetchReservations();
      } else {
        console.error('Failed to cancel reservation:', response.data.error);
      }
    } catch (error) {
      console.error('Failed to cancel reservation', error);
    }
  };

  function getAirlineLogo() {
    return "/general-airline-logo.png";
  }

  const getDestinationName = (code: string): string => {
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
    };
    return destinations[code.toUpperCase()] || code;
  };

  const toggleStar = (index: number) => {
    setStars(stars.map((star, i) => i === index ? !star : star));
  };

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

          <Card className="mb-4 sm:mb-8 bg-white">
            <CardContent className="p-3 sm:p-4">
              <div className="flex flex-col sm:flex-row justify-between items-center">
                <div className="flex flex-wrap justify-center sm:justify-start space-x-2 mb-4 sm:mb-0">
                  <Button variant="outline" className="text-xs sm:text-sm py-1 px-2 font-bold h-8 mb-2 sm:mb-0">Times</Button>
                  <Button variant="outline" className="text-xs sm:text-sm py-1 px-2 font-bold h-8 mb-2 sm:mb-0">Stops</Button>
                  <Button variant="outline" className="text-xs sm:text-sm py-1 px-2 font-bold h-8 mb-2 sm:mb-0">Airlines</Button>
                  <Button variant="outline" className="text-xs sm:text-sm py-1 px-2 font-bold h-8 mb-2 sm:mb-0">Airports</Button>
                  <Button variant="outline" className="text-xs sm:text-sm py-1 px-2 font-bold h-8 mb-2 sm:mb-0">Amenities</Button>
                  <Input placeholder="Edit Search" className="w-full sm:w-40 h-8 mb-2 sm:mb-0" />
                </div>
                <div className="flex flex-wrap justify-center sm:justify-end space-x-1">
                  {[...Array(15)].map((_, colIndex) => (
                    <div key={colIndex} className="flex flex-col items-center space-y-1">
                      {[...Array(2)].map((_, rowIndex) => (
                        <Star 
                          key={rowIndex}
                          filled={stars[colIndex * 2 + rowIndex]} 
                          onClick={() => toggleStar(colIndex * 2 + rowIndex)} 
                        />
                      ))}
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>

          <h2 className="text-xl sm:text-2xl font-semibold mb-4 sm:mb-6">My Reservations</h2>

          {reservations.map((reservation) => (
            <Card key={reservation._id} className="mb-6 sm:mb-10 bg-white relative">
              <CardContent className="p-3 sm:p-4 pb-16">
                <div className="flex flex-col sm:flex-row justify-between items-start">
                  <div className="flex-1 mb-4 sm:mb-0">
                    <p className="font-semibold text-base sm:text-lg mb-2">
                      {`${getDestinationName(reservation.flightDetails.route.destinations[0] || 'N/A')} - ${getDestinationName(reservation.flightDetails.route.destinations[1] || 'N/A')}`}
                    </p>
                    <div className="flex items-center mb-1">
                      <Image src="/icons/departures.svg" alt="Departure" width={20} height={20} className="text-purple-600 mr-2" />
                      <span className="text-sm text-gray-500">Departure</span>
                    </div>
                    <p className="font-semibold">
                      {new Date(reservation.flightDetails.scheduleDateTime).toLocaleTimeString('en-US', { 
                        hour: 'numeric', 
                        minute: '2-digit', 
                        hour12: true 
                      })}
                    </p>
                    <p className="text-sm text-gray-500 mb-4">Flight Number: {reservation.flightDetails.flightNumber}</p>
                    <p className="font-semibold">
                      <span className="text-purple-600 mr-2">Price:</span>$200
                    </p>
                    <p className="text-sm text-gray-500">Round Trip</p>
                  </div>
                  <div className="flex-1 flex flex-col items-center justify-center mb-4 sm:mb-0">
                    <Image 
                      src={getAirlineLogo()}
                      alt="Airline Logo" 
                      width={80}
                      height={80}
                      className="mb-2 object-contain p-2 bg-white rounded-lg shadow-md"
                    />
                    <PlaneIcon className="text-purple-600 mb-2 w-6 h-6" />
                    <p className="text-sm text-gray-500">2h 25m (Nonstop)</p>
                  </div>
                  <div className="flex-1 text-right">
                    <p className="font-semibold text-lg mb-2 invisible">Placeholder</p>
                    <div className="flex items-center justify-end mb-1">
                      <Image src="/icons/arrivals.svg" alt="Arrival" width={20} height={20} className="text-purple-600 mr-2" />
                      <span className="text-sm text-gray-500">Arrival</span>
                    </div>
                    <p className="font-semibold">
                      {new Date(new Date(reservation.flightDetails.scheduleDateTime).getTime() + 2*60*60*1000).toLocaleTimeString('en-US', { 
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
                    onClick={() => setExpandedFlights(prev => ({ ...prev, [reservation._id]: !prev[reservation._id] }))}
                  >
                    {expandedFlights[reservation._id] ? 'Hide Details' : 'Check the Details'}
                  </Button>
                  <Button 
                    className="absolute bottom-4 right-4 bg-red-600 hover:bg-red-700 text-white"
                    onClick={() => cancelReservation(reservation._id)}
                  >
                    Cancel Reservation
                  </Button>
                </div>
              </CardContent>
              <AnimatePresence>
                {expandedFlights[reservation._id] && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    transition={{ duration: 0.3 }}
                    className="px-4 pb-16 pt-6 border-t border-gray-200"
                  >
                    <p className="text-sm font-semibold mb-2">
                      Flight Number: {reservation.flightDetails.flightNumber}
                    </p>
                    <p className="text-sm mb-2">
                      Status: {reservation.flightDetails.flightDirection}
                    </p>
                    <p className="text-sm mb-2">
                      Estimated Departure: {new Date(reservation.flightDetails.scheduleDateTime).toLocaleString()}
                    </p>
                    <p className="text-sm mb-2">
                      Estimated Arrival: {new Date(new Date(reservation.flightDetails.scheduleDateTime).getTime() + 2*60*60*1000).toLocaleString()}
                    </p>
                    {/* Diğer detayları buraya ekleyebilirsiniz */}
                  </motion.div>
                )}
              </AnimatePresence>
            </Card>
          ))}
        </CardContent>
      </Card>
    </div>
  );
}