import React from 'react';
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import DatePicker from 'react-datepicker';
import "react-datepicker/dist/react-datepicker.css";
import Image from 'next/image';

interface FlightSearchFormProps {
  from: string;
  to: string;
  date: Date | null;
  returnDate: Date | null;
  tripType: string;
  setFrom: (value: string) => void;
  setTo: (value: string) => void;
  setDate: (date: Date | null) => void;
  setReturnDate: (date: Date | null) => void;
  setTripType: (type: string) => void;
  fetchFlights: () => void;
}

const FlightSearchForm: React.FC<FlightSearchFormProps> = ({
  from, to, date, returnDate, tripType, setFrom, setTo, setDate, setReturnDate, setTripType, fetchFlights
}) => {
  const handleDepartDateChange = (selectedDate: Date | null) => {
    setDate(selectedDate);
    if (returnDate && selectedDate && returnDate < selectedDate) {
      setReturnDate(null);
    }
  };

  const handleReturnDateChange = (selectedDate: Date | null) => {
    if (date && selectedDate) {
      setReturnDate(selectedDate < date ? date : selectedDate);
    } else {
      setReturnDate(selectedDate);
    }
  };

  return (
    <div>
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4 sm:mb-6">
        <h2 className="text-lg sm:text-xl font-bold flex items-center mb-2 sm:mb-0">
          <Image src="/icons/plane.svg" alt="Plane" width={24} height={24} className="mr-2" />
          <span className="text-black">BOOK YOUR FLIGHT</span>
        </h2>
        <div className="inline-flex rounded-md overflow-hidden">
          <button
            className={`px-3 sm:px-6 py-1 sm:py-2 text-sm sm:text-base ${tripType === 'round' ? 'bg-purple-600 text-white' : 'bg-gray-200'}`}
            onClick={() => setTripType('round')}
          >
            Round Trip
          </button>
          <button
            className={`px-3 sm:px-6 py-1 sm:py-2 text-sm sm:text-base ${tripType === 'one' ? 'bg-purple-600 text-white' : 'bg-gray-200'}`}
            onClick={() => setTripType('one')}
          >
            One Way
          </button>
        </div>
      </div>
      <div className={`grid ${tripType === 'round' ? 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-4' : 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3'} gap-2 sm:gap-4`}>
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
        onClick={fetchFlights}
      >
        Show Flights
      </Button>
    </div>
  );
};

export default FlightSearchForm;