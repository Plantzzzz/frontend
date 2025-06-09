import React, { useState } from 'react';
import { db, auth, storage } from '../../firebase';
import { addDoc, collection } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import SavePlantModal from './SavePlantModal';
import { onAuthStateChanged } from 'firebase/auth';

const PlantRecognizer: React.FC = () => {
  const [image, setImage] = useState<File | null>(null);
  const [result, setResult] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [customName, setCustomName] = useState('');
  const [location, setLocation] = useState('');
  const [notes, setNotes] = useState('');
  const [userUid, setUserUid] = useState<string | null>(null);
  const [scientificName, setScientificName] = useState('');
  const [description, setDescription] = useState('');
  const [family, setFamily] = useState('');
  const [growthRate, setGrowthRate] = useState('');
  const [watering, setWatering] = useState('');


  // Listen for auth state
  React.useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUserUid(user?.uid || null);
    });
    return unsubscribe;
  }, []);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImage(file);
      setResult(null);
      setError(null);
    }
  };

  const handleSubmit = async () => {
    if (!image) return;
    setLoading(true);
    setError(null);

    const formData = new FormData();
    formData.append('image', image);

    try {
      const res = await fetch('https://petalbot.onrender.com/identify', {
        method: 'POST',
        body: formData,
      });

      if (!res.ok) {
        const err = await res.text();
        throw new Error(`Error: ${res.status} - ${err}`);
      }

      const data = await res.json();
      setResult(data);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleOpenSaveModal = () => {
    setCustomName('');
    setLocation('');
    setNotes('');

    setScientificName(result.plantnet_result.results[0].species?.scientificNameWithoutAuthor || '');
    setDescription(result.plantnet_result.results[0].species?.description?.value || '');
    setFamily(result.plantnet_result.results[0].species?.family?.scientificName || '');
    setGrowthRate(result.perenual_detail?.growth_rate || '');
    setWatering(result.perenual_detail?.watering || '');

    setIsModalOpen(true);
  };


  const handleSavePlant = async () => {
    if (!userUid) {
      console.log('Napaka: uporabnik ni prijavljen.');
      return;
    }

    try {
      const plantData = {
        uid: userUid,
        customName,
        location,
        notes,
        scientificName: scientificName || result?.plantnet_result.results[0].species?.scientificNameWithoutAuthor || '',
        commonNames: result?.plantnet_result.results[0].species?.commonNames || [],
        description: description || result?.plantnet_result.results[0].species?.description?.value || '',
        family,
        growthRate,
        watering: watering || result?.perenual_detail?.watering || '',
        sunlight: result?.perenual_detail?.sunlight || [],
        cycle: result?.perenual_detail?.cycle || '',
        perenualImage: result?.perenual_detail?.default_image?.medium_url || '',
        probability: result?.plantnet_result.results[0].score || null,
        createdAt: new Date().toISOString(),
      };

      await addDoc(collection(db, 'saved_plants'), plantData);
      setIsModalOpen(false);
    } catch (err) {
      console.error('Napaka pri shranjevanju rastline:', err);
    }
  };


  return (
    <div className="max-w-7xl mx-auto px-4 py-8 text-white">
      <div className="w-full max-w-xl bg-gray-800 rounded-xl shadow-lg p-6 border border-gray-700 mx-auto">
        <h2 className="text-2xl md:text-3xl font-bold mb-6 text-center text-green-400">
          Recognize Your Plant
        </h2>

        <div className="mb-4">
          <label htmlFor="imageUpload" className="block text-sm font-medium text-gray-300 mb-2">
            Upload an image:
          </label>
          <input
            id="imageUpload"
            type="file"
            accept="image/*"
            onChange={handleImageUpload}
            className="block w-full text-sm text-gray-300 file:mr-4 file:py-2 file:px-4
              file:rounded-md file:border-0 file:text-sm file:font-semibold
              file:bg-green-700 file:text-green-200 hover:file:bg-green-600"
          />
        </div>

        <button
          onClick={handleSubmit}
          disabled={loading}
          type="button"
          className="w-full bg-green-600 text-white font-semibold py-2 rounded-md hover:bg-green-500 transition-colors"
        >
          {loading ? 'Recognizing...' : 'Recognize'}
        </button>

        {error && (
          <div className="mt-4 bg-red-700 text-red-200 p-3 rounded-md border border-red-600">
            Sorry, we couldn’t recognize your plant.
          </div>
        )}

        {result && result.plantnet_result?.results?.length > 0 && (
          <div className="mt-6 p-4 border border-green-700 rounded-md bg-gray-800">
            <h3 className="text-lg font-semibold text-green-400 mb-2">
              Most likely:
            </h3>
            <p className="text-lg font-bold text-green-300">
              {result.plantnet_result.results[0].species?.scientificNameWithoutAuthor}
            </p>
            <p className="text-green-500 italic mb-1">
              Probability: {(result.plantnet_result.results[0].score * 100).toFixed(2)}%
            </p>

            {result.plantnet_result.results[0].species?.commonNames?.length > 0 && (
              <p className="text-sm text-gray-400 mb-1">
                Other names: {result.plantnet_result.results[0].species.commonNames.join(', ')}
              </p>
            )}

            {result.plantnet_result.results[0].species?.description?.value && (
              <p className="text-sm text-gray-300 mt-2">
                {result.plantnet_result.results[0].species.description.value}
              </p>
            )}

            {result.plantnet_result.results[0].species?.distribution?.native && (
              <p className="text-xs text-gray-500 mt-2">
                Native to: {result.plantnet_result.results[0].species.distribution.native.join(', ')}
              </p>
            )}

            {image && (
              <div className="mt-4">
                <h4 className="text-md font-semibold mb-1 text-green-400">
                  Uploaded Image:
                </h4>
                <img
                  src={URL.createObjectURL(image)}
                  alt="Uploaded Plant"
                  className="rounded-lg shadow-md max-w-xs"
                />
              </div>
            )}

            {result.perenual_detail && (
              <div className="mt-4 pt-4 border-t border-green-700">
                <h4 className="text-md font-semibold text-green-400 mb-2">
                  Additional Information (Perenual)
                </h4>
                {result.perenual_detail.watering && (
                  <p>💧 Watering: {result.perenual_detail.watering}</p>
                )}
                {result.perenual_detail.sunlight?.length > 0 && (
                  <p>☀️ Sunlight: {result.perenual_detail.sunlight.join(', ')}</p>
                )}
                {result.perenual_detail.cycle && (
                  <p>🔁 Growth cycle: {result.perenual_detail.cycle}</p>
                )}
                {result.perenual_detail.default_image?.medium_url && (
                  <img
                    src={result.perenual_detail.default_image.medium_url}
                    alt="Plant"
                    className="mt-3 rounded-lg shadow-md max-w-xs"
                  />
                )}
              </div>
            )}

            {result.perenual_error && (
              <p className="text-red-500 mt-2">
                ⚠️ {result.perenual_error}
              </p>
            )}

            <button
              onClick={handleOpenSaveModal}
              className="mt-6 w-full bg-green-700 text-white py-2 rounded-md hover:bg-green-600"
            >
              Shrani rastlino
            </button>
          </div>
        )}
      </div>

      <SavePlantModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={handleSavePlant}
        customName={customName}
        setCustomName={setCustomName}
        location={location}
        setLocation={setLocation}
        notes={notes}
        setNotes={setNotes}
        scientificName={scientificName}
        setScientificName={setScientificName}
        description={description}
        setDescription={setDescription}
        family={family}
        setFamily={setFamily}
        growthRate={growthRate}
        setGrowthRate={setGrowthRate}
        watering={watering}
        setWatering={setWatering}
      />

    </div>
  );
};

export default PlantRecognizer;
