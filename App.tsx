import React, { useState, useCallback, useEffect } from 'react';
import { Place, Phrase } from './types';
import { generateTravelPhrases } from './services/geminiService';
import Map from './components/Map';
import PhraseCard from './components/PhraseCard';
import Loader from './components/Loader';
import { MapPinIcon, SparklesIcon, GlobeIcon, XIcon, KeyIcon, CheckIcon, ExternalLinkIcon, AlertTriangleIcon } from './components/icons';
import PlacesAutocomplete from './components/PlacesAutocomplete';
import ApiKeyModal from './components/ApiKeyModal';
import WelcomeNotice from './components/WelcomeNotice';

const App: React.FC = () => {
  const [selectedPlaces, setSelectedPlaces] = useState<Place[]>([]);
  const [phrases, setPhrases] = useState<Record<string, Phrase[]>>({});
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [apiKey, setApiKey] = useState<string>('');
  const [inputApiKey, setInputApiKey] = useState<string>('');
  const [isKeySaved, setIsKeySaved] = useState<boolean>(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [showWelcomeNotice, setShowWelcomeNotice] = useState(false);

  useEffect(() => {
    if (localStorage.getItem('hasSeenWelcomeNotice') !== 'true') {
      setShowWelcomeNotice(true);
    }
  }, []);

  const handleCloseWelcomeNotice = () => {
    localStorage.setItem('hasSeenWelcomeNotice', 'true');
    setShowWelcomeNotice(false);
  };

  const handleSaveKey = () => {
    if (!inputApiKey.trim()) {
        setError('유효한 API 키를 입력해주세요.');
        return;
    }
    setApiKey(inputApiKey);
    setIsKeySaved(true);
    setError(null);
    setTimeout(() => setIsKeySaved(false), 2000);
  };


  const handleAddPlace = useCallback((place: Omit<Place, 'id'>) => {
    const newPlace: Place = {
      ...place,
      id: `${place.location.lat}_${place.location.lng}`
    };
    setSelectedPlaces(prev => {
      if (prev.find(p => p.id === newPlace.id)) {
        return prev;
      }
      return [...prev, newPlace];
    });
    setError(null);
  }, []);

  const handleRemovePlace = useCallback((placeId: string) => {
    setSelectedPlaces(prev => prev.filter(p => p.id !== placeId));
    setPhrases(prev => {
      const newPhrases = { ...prev };
      delete newPhrases[placeId];
      return newPhrases;
    });
  }, []);

  const handleGeneratePhrases = async () => {
    if (!apiKey) {
      setError('Gemini API 키를 먼저 입력하고 저장해주세요.');
      return;
    }
    if (selectedPlaces.length === 0) return;

    setIsLoading(true);
    setError(null);
    setPhrases({});

    try {
      const phrasePromises = selectedPlaces.map(place =>
        generateTravelPhrases(place.name, place.countryCode, apiKey)
          .then(phrases => ({
            placeId: place.id,
            data: phrases,
          }))
          .catch(error => {
            console.error(`Error for ${place.name}:`, error);
            return {
              placeId: place.id,
              error: error,
            };
          })
      );
      
      const results = await Promise.all(phrasePromises);
      
      const newPhrases: Record<string, Phrase[]> = {};
      const errors: string[] = [];
      let overallError: string | null = null;

      results.forEach(result => {
        if ('data'in result) {
          newPhrases[result.placeId] = result.data;
        } else if ('error'in result) {
          const place = selectedPlaces.find(p => p.id === result.placeId);
          errors.push(`'${place?.name || 'Unknown'}'`);
          if (result.error instanceof Error) {
            overallError = result.error.message;
          }
        }
      });
      
      setPhrases(newPhrases);

      if (errors.length > 0) {
        let errorMessage = `${errors.join(', ')} 장소의 표현 생성에 실패했습니다. `;
        if (overallError) {
          errorMessage += overallError;
        } else {
          errorMessage += '다시 시도해 주세요.';
        }
        setError(errorMessage);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An unknown error occurred.');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-200">
      <WelcomeNotice show={showWelcomeNotice} onClose={handleCloseWelcomeNotice} />
      <header className="bg-slate-900/80 backdrop-blur-lg shadow-sm sticky top-0 z-20 border-b border-slate-700">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <GlobeIcon className="w-8 h-8 text-amber-400" />
            <h1 className="text-2xl font-bold text-slate-50 tracking-tight">
              AI 여행 회화 생성기
            </h1>
          </div>
        </div>
      </header>

      <main className="container mx-auto p-4 sm:p-6 lg:p-8 grid grid-cols-1 lg:grid-cols-2 gap-10">
        <div className="flex flex-col h-[450px] lg:h-[calc(100vh-130px)] rounded-2xl shadow-lg bg-slate-900 overflow-hidden border border-slate-700">
          <div className="p-6 bg-slate-800/50 border-b border-slate-700">
            <h2 className="text-lg font-semibold text-slate-100">1. 지도에서 목적지 선택하기</h2>
            <PlacesAutocomplete onPlaceSelected={handleAddPlace} />
            <p className="text-sm text-slate-400 mt-3">주소를 검색하거나, 여행할 장소를 클릭하여 마커를 추가하세요. 마커를 다시 클릭하면 삭제됩니다.</p>
          </div>
          <div className="flex-grow">
            <Map places={selectedPlaces} onMapClick={handleAddPlace} onMarkerClick={handleRemovePlace} />
          </div>
        </div>

        <div className="flex flex-col space-y-8">
          <div className="bg-slate-900 p-6 rounded-2xl shadow-lg border border-slate-700">
            <h2 className="text-lg font-semibold text-slate-100 mb-4">2. Gemini API 키 입력</h2>
            <div className="flex items-center space-x-3">
                <div className="relative flex-grow">
                    <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3.5">
                        <KeyIcon className="h-5 w-5 text-slate-400" />
                    </div>
                    <input
                        type="password"
                        value={inputApiKey}
                        onChange={(e) => setInputApiKey(e.target.value)}
                        placeholder="Gemini API 키를 여기에 붙여넣으세요"
                        className="block w-full rounded-lg border-slate-600 bg-slate-800 text-slate-200 placeholder-slate-400 pl-10 shadow-sm focus:border-amber-500 focus:ring-2 focus:ring-amber-500/50 sm:text-sm py-2 px-3 transition"
                        aria-label="Gemini API Key"
                    />
                </div>
                <button
                    onClick={handleSaveKey}
                    className={`px-4 py-2 border border-transparent text-sm font-bold rounded-lg transition-colors flex-shrink-0 ${
                        isKeySaved 
                            ? 'bg-emerald-600 hover:bg-emerald-700 text-white' 
                            : 'bg-amber-500 hover:bg-amber-600 text-slate-900'
                    } focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-slate-900 focus:ring-amber-500`}
                >
                    {isKeySaved ? <CheckIcon className="w-5 h-5"/> : '저장'}
                </button>
            </div>
            <p className="text-xs text-slate-400 mt-2 flex items-center space-x-2 flex-wrap">
                <button onClick={() => setIsModalOpen(true)} className="text-amber-500 hover:underline font-medium focus:outline-none focus:ring-2 focus:ring-amber-500/50 rounded px-1 py-0.5">
                    API 키는 어떻게 사용되나요?
                </button>
                <span className="text-slate-600">|</span>
                <a href="https://aistudio.google.com/app/apikey" target="_blank" rel="noopener noreferrer" className="text-amber-500 hover:underline font-medium inline-flex items-center">
                    Google AI Studio에서 키 발급 <ExternalLinkIcon className="w-3 h-3 ml-1" />
                </a>
            </p>
          </div>

          <div className="bg-slate-900 p-6 rounded-2xl shadow-lg border border-slate-700">
            <h2 className="text-lg font-semibold text-slate-100 mb-4">3. 선택된 장소 & 회화 생성</h2>
            {selectedPlaces.length > 0 ? (
              <div className="space-y-4">
                <div className="space-y-2 max-h-52 overflow-y-auto pr-2">
                  {selectedPlaces.map(place => (
                    <div key={place.id} className="p-3 border border-slate-700 bg-slate-800 rounded-lg flex items-center justify-between animate-fade-in">
                      <div className="flex items-start space-x-3 overflow-hidden">
                        <MapPinIcon className="w-5 h-5 text-amber-400 mt-1 flex-shrink-0" />
                        <div className="overflow-hidden">
                          <h3 className="font-bold text-sm text-slate-100 truncate">{place.name}</h3>
                          <p className="text-xs text-slate-400 truncate">{place.address}</p>
                        </div>
                      </div>
                      <button 
                        onClick={() => handleRemovePlace(place.id)} 
                        className="ml-2 p-1 rounded-full hover:bg-red-500/20 text-slate-400 hover:text-red-400 flex-shrink-0 transition-colors"
                        aria-label={`Remove ${place.name}`}
                      >
                        <XIcon className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                </div>
                <button
                  onClick={handleGeneratePhrases}
                  disabled={isLoading || !apiKey}
                  className="w-full flex items-center justify-center px-6 py-3 border border-transparent text-base font-bold rounded-lg text-slate-900 bg-amber-500 hover:bg-amber-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-slate-900 focus:ring-amber-500 disabled:bg-slate-600 disabled:text-slate-400 disabled:cursor-not-allowed disabled:hover:scale-100 transition-all duration-300 transform hover:scale-105"
                >
                  {isLoading ? (
                    <>
                      <Loader />
                      <span className="ml-2">생성 중...</span>
                    </>
                  ) : (
                    <>
                      <SparklesIcon className="w-5 h-5 mr-2" />
                      <span>{`AI로 ${selectedPlaces.length}개 장소 표현 생성하기`}</span>
                    </>
                  )}
                </button>
              </div>
            ) : (
              <div className="text-center py-8 px-4 border-2 border-dashed border-slate-700 rounded-lg">
                <p className="text-slate-400">지도에서 장소를 선택해주세요.</p>
              </div>
            )}
          </div>

          {error && (
            <div className="bg-red-900/50 border border-red-700/50 text-red-300 p-4 rounded-lg flex items-start space-x-3" role="alert">
              <AlertTriangleIcon className="w-5 h-5 text-red-400 flex-shrink-0 mt-0.5" />
              <div>
                <p className="font-bold">오류 발생</p>
                <p className="text-sm">{error}</p>
              </div>
            </div>
          )}

          {Object.keys(phrases).length > 0 && (
             <div className="space-y-8">
                <h3 className="text-2xl font-bold text-slate-50 tracking-tight">생성된 여행 회화</h3>
                {selectedPlaces.map(place => {
                   if (!phrases[place.id] || phrases[place.id].length === 0) return null;
                   return (
                     <div key={place.id} className="bg-slate-900 p-6 rounded-2xl shadow-lg border border-slate-700 animate-fade-in">
                       <div className="flex items-center space-x-3 mb-4 border-b-2 border-amber-500/20 pb-3">
                         <MapPinIcon className="w-6 h-6 text-amber-400"/>
                         <h4 className="text-xl font-semibold text-slate-100">{place.name}</h4>
                       </div>
                       <div className="space-y-4">
                         {phrases[place.id].map((phrase, index) => (
                           <PhraseCard key={index} phrase={phrase} />
                         ))}
                       </div>
                     </div>
                   );
                })}
             </div>
           )}
        </div>
      </main>
      <ApiKeyModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
    </div>
  );
};

export default App;