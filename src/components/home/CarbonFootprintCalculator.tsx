import { useState, useEffect } from 'react';

const CarbonFootprintCalculator = () => {
  const [serviceType, setServiceType] = useState('Cuci Dasar');
  const [numberOfShoes, setNumberOfShoes] = useState(1);
  const [showResults, setShowResults] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);

  // Data sumber daya yang "diselamatkan" per pasang sepatu
  const resourceSavings = {
    "Cuci Dasar": { water: 15, energy: 0.3, plastic: 0.05, trees: 0.001 },
    "Cuci Premium": { water: 25, energy: 0.5, plastic: 0.08, trees: 0.002 },
    "Repaint & Restoration": { water: 45, energy: 1.2, plastic: 0.2, trees: 0.005 }
  };

  // Fakta lucu tentang penghematan
  const funFacts = [
    "Tahukah kamu? Air yang kamu hemat bisa digunakan ikan koi untuk berenang seharian!",
    "Energi yang kamu hemat setara dengan menonton 5 episode drama Korea!",
    "Plastik yang kamu hemat bisa digunakan untuk membungkus 10 gorengan!",
    "Pohon yang kamu selamatkan sedang mengirim pesan terima kasih via telepati!",
    "Kalau semua orang di Indonesia sepertimu, kita bisa mendirikan negara baru di Mars!",
    "Dengan energi yang kamu hemat, alien di galaksi sebelah jadi tertarik berkunjung!"
  ];

  // Equivalen lucu untuk penghematan
  const funEquivalents = {
    water: [
      "gelas es teh manis",
      "ember untuk mandi kucing",
      "kolam renang mainan"
    ],
    energy: [
      "jam main game mobile",
      "kali charge hape",
      "jam nonton TV"
    ],
    plastic: [
      "sedotan plastik",
      "kantong kresek",
      "botol air mineral"
    ],
    trees: [
      "kertas ujian yang tak perlu digunakan",
      "buku komik",
      "lembar tisu toilet"
    ]
  };

  const handleCalculate = () => {
    setIsAnimating(true);
    setTimeout(() => {
      setShowResults(true);
      setIsAnimating(false);
    }, 2000);
  };

  const resetCalculator = () => {
    setShowResults(false);
    setServiceType('Cuci Dasar');
    setNumberOfShoes(1);
  };

  // Menghitung penghematan berdasarkan jenis layanan dan jumlah sepatu
  const calculateSavings = () => {
    const savings = resourceSavings[serviceType as keyof typeof resourceSavings];
    return {
      water: (savings.water * numberOfShoes).toFixed(1),
      energy: (savings.energy * numberOfShoes).toFixed(2),
      plastic: (savings.plastic * numberOfShoes).toFixed(2),
      trees: (savings.trees * numberOfShoes).toFixed(3)
    };
  };

  // Mendapatkan equivalen lucu secara acak
  const getRandomEquivalent = (resourceType: keyof typeof funEquivalents) => {
    const equivalents = funEquivalents[resourceType];
    const randomIndex = Math.floor(Math.random() * equivalents.length);
    return equivalents[randomIndex];
  };

  // Mendapatkan fakta lucu secara acak
  const getRandomFunFact = () => {
    const randomIndex = Math.floor(Math.random() * funFacts.length);
    return funFacts[randomIndex];
  };

  // Animasi ikon pohon
  const [treeScale, setTreeScale] = useState(1);
  
  useEffect(() => {
    if (showResults) {
      const interval = setInterval(() => {
        setTreeScale(prev => prev === 1 ? 1.1 : 1);
      }, 1000);
      
      return () => clearInterval(interval);
    }
  }, [showResults]);

  const savings = calculateSavings();

  return (
    <div className="max-w-md mx-auto bg-white rounded-xl shadow-md overflow-hidden md:max-w-2xl">
      <div className="p-8">
        <h2 className="text-2xl font-bold text-green-700 mb-4">
          Kalkulator Jejak Karbon
        </h2>
        <p className="text-gray-600 mb-6">
          Hitung berapa banyak kontribusimu menyelamatkan planet dengan mencuci sepatu di SikaCling! 🌍
        </p>

        {!showResults ? (
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2" htmlFor="service-type">
                Pilih Jenis Layanan
              </label>
              <select
                id="service-type"
                value={serviceType}
                onChange={(e) => setServiceType(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
              >
                <option value="Cuci Dasar">Cuci Dasar</option>
                <option value="Cuci Premium">Cuci Premium</option>
                <option value="Repaint & Restoration">Repaint & Restoration</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2" htmlFor="number-of-shoes">
                Jumlah Pasang Sepatu
              </label>
              <input
                id="number-of-shoes"
                type="number"
                min="1"
                max="100"
                value={numberOfShoes}
                onChange={(e) => setNumberOfShoes(Math.min(100, Math.max(1, parseInt(e.target.value) || 1)))}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
              />
            </div>

            <button
              onClick={handleCalculate}
              className="w-full bg-green-600 hover:bg-green-700 text-white font-bold py-3 px-4 rounded-md transition duration-200"
            >
              {isAnimating ? (
                <div className="flex items-center justify-center">
                  <div className="animate-spin rounded-full h-5 w-5 border-t-2 border-b-2 border-white mr-2"></div>
                  Menghitung...
                </div>
              ) : (
                "Hitung Kontribusi Hijau Saya"
              )}
            </button>
          </div>
        ) : (
          <div className="space-y-6">
            <div className="bg-green-50 p-6 rounded-lg border border-green-100">
              <h3 className="text-lg font-semibold text-green-800 mb-4">Jejak Hijau Kamu</h3>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-white p-4 rounded-lg shadow-sm">
                  <div className="flex items-center mb-2">
                    <span className="text-blue-500 text-2xl mr-2">💧</span>
                    <h4 className="font-medium">Air</h4>
                  </div>
                  <p className="text-2xl font-bold text-blue-600">{savings.water} liter</p>
                  <p className="text-sm text-gray-500">Setara dengan {Math.round(Number(savings.water) * 4)} {getRandomEquivalent('water')}</p>
                </div>
                
                <div className="bg-white p-4 rounded-lg shadow-sm">
                  <div className="flex items-center mb-2">
                    <span className="text-yellow-500 text-2xl mr-2">⚡</span>
                    <h4 className="font-medium">Energi</h4>
                  </div>
                  <p className="text-2xl font-bold text-yellow-600">{savings.energy} kWh</p>
                  <p className="text-sm text-gray-500">Setara dengan {Math.round(Number(savings.energy) * 10)} {getRandomEquivalent('energy')}</p>
                </div>
                
                <div className="bg-white p-4 rounded-lg shadow-sm">
                  <div className="flex items-center mb-2">
                    <span className="text-gray-500 text-2xl mr-2">🛍️</span>
                    <h4 className="font-medium">Plastik</h4>
                  </div>
                  <p className="text-2xl font-bold text-gray-600">{savings.plastic} kg</p>
                  <p className="text-sm text-gray-500">Setara dengan {Math.round(Number(savings.plastic) * 100)} {getRandomEquivalent('plastic')}</p>
                </div>
                
                <div className="bg-white p-4 rounded-lg shadow-sm">
                  <div className="flex items-center mb-2">
                    <span 
                      className="text-green-500 text-2xl mr-2"
                      style={{transform: `scale(${treeScale})`, transition: 'transform 0.5s ease'}}
                    >
                      🌳
                    </span>
                    <h4 className="font-medium">Pohon</h4>
                  </div>
                  <p className="text-2xl font-bold text-green-600">{savings.trees} pohon</p>
                  <p className="text-sm text-gray-500">Setara dengan {Math.round(Number(savings.trees) * 1000)} {getRandomEquivalent('trees')}</p>
                </div>
              </div>
              
              <div className="mt-6 bg-yellow-50 p-4 rounded-lg border border-yellow-100">
                <div className="flex items-start">
                  <span className="text-yellow-500 text-2xl mr-2">💡</span>
                  <p className="text-sm text-gray-700">{getRandomFunFact()}</p>
                </div>
              </div>
              
              <div className="mt-6 text-center">
                <p className="text-green-700 font-medium mb-2">
                  Ciyee! Kamu sudah jadi pahlawan bumi! 🦸‍♂️
                </p>
                <p className="text-sm text-gray-600 mb-4">
                  Bagikan ke teman-temanmu dan ajak mereka ikut menjaga bumi!
                </p>
                <div className="flex space-x-2 justify-center">
                  <button className="bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded-full text-sm">
                    <span className="mr-1">📱</span> WhatsApp
                  </button>
                  <button className="bg-pink-500 hover:bg-pink-600 text-white px-3 py-1 rounded-full text-sm">
                    <span className="mr-1">📸</span> Instagram
                  </button>
                  <button className="bg-blue-400 hover:bg-blue-500 text-white px-3 py-1 rounded-full text-sm">
                    <span className="mr-1">🐦</span> Twitter
                  </button>
                </div>
              </div>
            </div>
            
            <button
              onClick={resetCalculator}
              className="w-full bg-gray-200 hover:bg-gray-300 text-gray-800 font-bold py-2 px-4 rounded-md transition duration-200"
            >
              Hitung Lagi
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default CarbonFootprintCalculator;