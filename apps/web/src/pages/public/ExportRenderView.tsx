import React, { useEffect, useState } from 'react';
import { useParams, useSearchParams } from 'react-router-dom';
import { fetchPublicGift } from '../../services/api';
import { GiftExperience } from '../../components/public/GiftExperience';

export const ExportRenderView: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const [searchParams] = useSearchParams();
  const format = searchParams.get('format') || '9:16';

  const [data, setData] = useState<any>(null);

  useEffect(() => {
    if (!slug) return;
    fetchPublicGift(slug)
      .then((res: any) => setData(res))
      .catch((err: any) => console.error('Export render view error:', err));
  }, [slug]);

  if (!data || !data.project) {
    return <div className="min-h-screen bg-slate-950 text-white p-8 flex items-center justify-center font-mono text-sm">Cargando experiencia de renderizado...</div>;
  }

  const { project, sections, media, timeline } = data;

  const aspectRatioClass =
    format === '9:16'
      ? 'w-[430px] h-[764px]'
      : format === '4:5'
      ? 'w-[540px] h-[675px]'
      : format === '1:1'
      ? 'w-[600px] h-[600px]'
      : 'w-[960px] h-[540px]';

  return (
    <div className="min-h-screen bg-slate-950 flex items-center justify-center overflow-hidden font-sans select-none">
      <div className={`relative overflow-hidden rounded-none shadow-none ${aspectRatioClass}`}>
        <GiftExperience
          project={project}
          sections={sections}
          media={media}
          timeline={timeline}
          mode="public"
        />
      </div>
    </div>
  );
};
