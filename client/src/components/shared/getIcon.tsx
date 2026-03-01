import { 
  Wifi, 
  Coffee, 
  Tv, 
  Wind, 
  Waves, 
  Dumbbell, 
  UtensilsCrossed, 
  CarFront, 
  Sparkles, 
  ShoppingBag, 
  Cctv, 
  Wine,
  WashingMachine,
  Sofa,
  Bath,
  Balloon,
  Bus,
} from 'lucide-react';

export const getIcon = (object: string) => {
    const text = object.toLowerCase();

    if (text.includes('wifi')) {
        return <Wifi className="w-4 h-4" />;
    }
    
    if (text.includes('coffee') || text.includes('breakfast')) {
        return <Coffee className="w-4 h-4" />;
    }

    if (text.includes('tv')) {
        return <Tv className="w-4 h-4" />;
    }

    if (text.includes('air conditioning') || text.includes('ac')) {
        return <Wind className="w-4 h-4" />;
    }

    if (text.includes('bar') || text.includes('lounge')) {
        return <Wine className="w-4 h-4" />;
    }
    
    if (text.includes('pool') || text.includes('beach')) {
        return <Waves className="w-4 h-4" />;
    }

    if (text.includes('fitness') || text.includes('gym')) {
        return <Dumbbell className="w-4 h-4" />;
    }

    if (text.includes('restaurant') || text.includes('cooking') || text.includes('kitchen')) {
        return <UtensilsCrossed className="w-4 h-4" />;
    }

    if (text.includes('parking')) {
        return <CarFront className="w-4 h-4" />;
    }

    if (text.includes('spa') || text.includes('wellness') || text.includes('massage') || text.includes('service')) {
        return <Sparkles className="w-4 h-4" />;
    }

    if (text.includes('mart') || text.includes('shop')) {
        return <ShoppingBag className="w-4 h-4" />;
    }

    if (text.includes('cctv') || text.includes('security')) {
        return <Cctv className="w-4 h-4" />;
    }

    if (text.includes('laundry') || text.includes('washer')) {
        return <WashingMachine className="w-4 h-4" />;
    }


    if (text.includes('living')) {
        return <Sofa className="w-4 h-4" />;
    }

    if (text.includes('bath') || text.includes('shower')) {
        return <Bath className="w-4 h-4" />;
    }

    if (text.includes('kid') || text.includes('activities')) {
        return <Balloon className="w-4 h-4" />;
    }

    if (text.includes('shuttle')) {
        return <Bus className="w-4 h-4" />;
    }
    
    return null;
};