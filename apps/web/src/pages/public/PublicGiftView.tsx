import React, { useEffect, useState } from 'react';
import { useParams, useSearchParams } from 'react-router-dom';
import { fetchPublicGift } from '../../services/api';
import { GiftExperience } from '../../components/public/GiftExperience';
import { Heart, Lock } from 'lucide-react';

export const PublicGiftView: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const [searchParams] = useSearchParams();
  const captureMode = searchParams.get('capture') === 'true';

  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!slug) return;
    setLoading(true);
    fetchPublicGift(slug)
      .then((res) => {
        setData(res);
        setLoading(false);
      })
      .catch((err) => {
        setError(err.message || 'No fue posible cargar el regalo.');
        setLoading(false);
      });
  }, [slug]);

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center p-6 text-center text-pink-200 space-y-4">
        <Heart className="w-14 h-14 animate-beat text-pink-500 fill-pink-500 drop-shadow-[0_0_20px_rgba(236,72,153,0.8)]" />
        <p className="text-xl font-serif tracking-wide text-white">Cargando tu experiencia especial…</p>
      </div>
    );
  }

  if (error || !data || !data.project || !data.sections) {
    return (
      <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center p-6 text-center text-white space-y-4">
        <Lock className="w-14 h-14 text-rose-500 mx-auto" />
        <h2 className="text-2xl font-bold">Regalo no disponible</h2>
        <p className="max-w-md text-slate-400 text-sm">
          {error || 'El regalo consultado no existe, no tiene secciones activas o no está publicado.'}
        </p>
        <a href="/" className="px-6 py-2.5 rounded-full bg-pink-600 font-semibold text-sm text-white hover:bg-pink-500">
          Ir al sitio principal
        </a>
      </div>
    );
  }

  const { project, sections, media = [], timeline = [] } = data;

  return (
    <GiftExperience
      project={project}
      sections={sections}
      media={media}
      timeline={timeline}
      mode="public"
      captureMode={captureMode}
    />
  );
};

export default PublicGiftView;
