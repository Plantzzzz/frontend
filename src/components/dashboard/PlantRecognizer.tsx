import React, { useState } from 'react';
import { db, auth } from '../../firebase';
import { addDoc, collection } from 'firebase/firestore';
import { storage } from '../../firebase';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';


const PlantRecognizer = () => {
  const [image, setImage] = useState<File | null>(null);
  const [result, setResult] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [saved, setSaved] = useState(false);

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
      const res = await fetch('http://localhost:5000/identify', {
        method: 'POST',
        body: formData,
      });

      if (!res.ok) {
        const err = await res.text();
        throw new Error(`Napaka: ${res.status} - ${err}`);
      }

      const data = await res.json();
      setResult(data);
      console.log(result);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

const savePlantToFirestore = async () => {
  if (!result || !result.plantnet_result?.results?.length || !auth.currentUser || !image) return;

  try {
    // 1. Najprej naloži sliko v Firebase Storage
    const storageRef = ref(storage, `plant_images/${auth.currentUser.uid}/${Date.now()}_${image.name}`);
    await uploadBytes(storageRef, image);
    const imageUrl = await getDownloadURL(storageRef); // pridobi URL naložene slike

    // 2. Nato shrani vse skupaj v Firestore
    const plantData = {
      userId: auth.currentUser.uid,
      scientificName: result.plantnet_result.results[0].species?.scientificNameWithoutAuthor || '',
      commonNames: result.plantnet_result.results[0].species?.commonNames || [],
      score: result.plantnet_result.results[0].score || 0,
      description: result.plantnet_result.results[0].species?.description?.value || '',
      origin: result.plantnet_result.results[0].species?.distribution?.native || [],
      watering: result.perenual_detail?.watering || '',
      sunlight: result.perenual_detail?.sunlight || [],
      cycle: result.perenual_detail?.cycle || '',
      imageUploaded: imageUrl, // uporabi pravi URL
      createdAt: new Date().toISOString(),
    };

    await addDoc(collection(db, 'saved_plants'), plantData);
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  } catch (error) {
    console.error('Napaka pri shranjevanju:', error);
    console.log("UID:", auth.currentUser?.uid);
console.log("Storage path:", `plant_images/${auth.currentUser?.uid}/${Date.now()}_${image.name}`);

  }
};


  return (
    <div className="min-h-screen bg-gray-900 text-gray-200 flex items-center justify-center px-4 py-8">
      <div className="w-full max-w-xl bg-gray-800 rounded-xl shadow-lg p-6 border border-gray-700">
        <h2 className="text-3xl font-semibold mb-6 text-center text-green-400">🌿 Prepoznaj rastlino</h2>

        <label className="block text-sm font-medium text-gray-300 mb-2" htmlFor="imageUpload">
          Naloži sliko:
        </label>
        <input
          id="imageUpload"
          type="file"
          accept="image/*"
          onChange={handleImageUpload}
          className="block w-full text-sm text-gray-300 file:mr-4 file:py-2 file:px-4
            file:rounded-md file:border-0 file:text-sm file:font-semibold
            file:bg-green-700 file:text-green-200 hover:file:bg-green-600 mb-4"
        />

        <button
          onClick={handleSubmit}
          disabled={loading}
          className="w-full bg-green-600 text-gray-100 font-semibold py-2 rounded-md hover:bg-green-500 transition-colors mb-4"
        >
          {loading ? 'Prepoznavanje...' : 'Prepoznaj'}
        </button>

        {error && (
          <div className="bg-red-700 text-red-300 p-3 rounded mb-4 border border-red-600">
            {error}
          </div>
        )}

        {result && result.plantnet_result?.results?.length > 0 && (
          <div className="mt-6 p-4 border border-green-700 rounded-md bg-gray-800">
            <h3 className="text-xl font-semibold text-green-400 mb-2">
              🌿 Najverjetnejša rastlina
            </h3>
            <p className="text-lg font-bold text-green-300">
              {result.plantnet_result.results[0].species?.scientificNameWithoutAuthor}
            </p>
            <p className="text-green-500 italic mb-1">
              Verjetnost: {(result.plantnet_result.results[0].score * 100).toFixed(2)}%
            </p>

            {result.plantnet_result.results[0].species?.commonNames?.length > 0 && (
              <p className="text-sm text-gray-400 mb-1">
                🌱 Skupna imena: {result.plantnet_result.results[0].species.commonNames.join(', ')}
              </p>
            )}

            {result.plantnet_result.results[0].species?.description?.value && (
              <p className="text-sm text-gray-300 mt-2">
                📝 {result.plantnet_result.results[0].species.description.value}
              </p>
            )}

            {result.plantnet_result.results[0].species?.distribution?.native && (
              <p className="text-xs text-gray-500 mt-2">
                🌍 Izvor: {result.plantnet_result.results[0].species.distribution.native.join(', ')}
              </p>
            )}

            {image && (
              <div className="mt-4">
                <h4 className="text-md font-semibold mb-1 text-green-400">🖼️ Slika rastline:</h4>
                <img
                  src={URL.createObjectURL(image)}
                  alt="Vaša naložena rastlina"
                  className="rounded-lg shadow-md max-w-xs"
                />
              </div>
            )}

            {result.perenual_detail && (
              <div className="mt-4 pt-4 border-t border-green-700">
                <h4 className="text-lg font-semibold text-green-400 mb-2">
                  📋 Dodatne informacije (Perenual)
                </h4>
                {result.perenual_detail.watering && (
                  <p>💧 Zalivanje: {result.perenual_detail.watering}</p>
                )}
                {result.perenual_detail.sunlight && result.perenual_detail.sunlight.length > 0 && (
                  <p>☀️ Svetloba: {result.perenual_detail.sunlight.join(', ')}</p>
                )}
                {result.perenual_detail.cycle && (
                  <p>🔁 Cikel rasti: {result.perenual_detail.cycle}</p>
                )}
                {result.perenual_detail.default_image?.medium_url && (
                  <img
                    src={result.perenual_detail.default_image.medium_url}
                    alt="Rastlina"
                    className="mt-3 rounded-lg shadow-md max-w-xs"
                  />
                )}
              </div>
            )}

            {result.perenual_error && (
              <p className="text-red-600 mt-2">⚠️ {result.perenual_error}</p>
            )}

            <button
              onClick={savePlantToFirestore}
              disabled={saved}
              className={`mt-4 w-full font-semibold py-2 rounded-md transition-all duration-500
                ${saved ? 'bg-green-500 text-gray-100' : 'bg-green-700 text-gray-100 hover:bg-green-600'}`}
            >
              {saved ? '✅ Uspešno shranjeno!' : '💾 Shrani med moje rastline'}
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default PlantRecognizer;
