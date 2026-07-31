import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { fetchProjectById, updateProject, uploadMediaFile, deleteMediaFile, createProjectExport, fetchProjectExports, deleteProjectExport, resolveMediaUrl, getPrintableCardUrl, getQrCodeUrl, getPublicGiftUrl, API_BASE } from '../../services/api';
import { ArrowLeft, Save, Upload, Trash2, QrCode, Smartphone, Check, Sparkles, Image as ImageIcon, Film, Heart, Type, Layers, FileText, Clock, RotateCcw, AlertTriangle, Eye, Download, Music, Loader2, CheckCircle2, Copy, ExternalLink, Printer, Share2, Palette, Edit3, Layout, Maximize2, Shield, Move } from 'lucide-react';
import { THEMES, ThemeId, generateDefaultGiftPreset } from '@recuerdos-qr/shared';
import { NumberPicker } from '../../components/admin/NumberPicker';
import { MemoryStoryGallery } from '../../components/public/gallery/MemoryStoryGallery';
import { CinematicMemoryGallery } from '../../components/public/gallery/CinematicMemoryGallery';
import { GiftExperience } from '../../components/public/GiftExperience';
import { QrAndCardModal, CARD_STYLES, FONT_OPTIONS, QR_POSITIONS, BORDER_STYLES } from '../../components/admin/QrAndCardModal';
import { CardCanvasEditor, CustomCanvasConfig, DEFAULT_CANVAS_CONFIG } from '../../components/admin/CardCanvasEditor';

const compressImageFile = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    if (!file.type.startsWith('image/')) {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = reject;
      reader.readAsDataURL(file);
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement('canvas');
        let width = img.width;
        let height = img.height;
        const maxDim = 1920;

        if (width > maxDim || height > maxDim) {
          if (width > height) {
            height = Math.round((height * maxDim) / width);
            width = maxDim;
          } else {
            width = Math.round((width * maxDim) / height);
            height = maxDim;
          }
        }

        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        if (ctx) {
          ctx.drawImage(img, 0, 0, width, height);
          resolve(canvas.toDataURL('image/jpeg', 0.85));
        } else {
          resolve(e.target?.result as string);
        }
      };
      img.onerror = () => resolve(e.target?.result as string);
      img.src = e.target?.result as string;
    };
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
};

export const ProjectEditor: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const [project, setProject] = useState<any>(null);
  const [sections, setSections] = useState<any[]>([]);
  const [media, setMedia] = useState<any[]>([]);
  const [activeTab, setActiveTab] = useState('info');
  const [saving, setSaving] = useState(false);
  const [saveStatus, setSaveStatus] = useState<string>('Cambios guardados');
  const [uploading, setUploading] = useState(false);

  const [editorQrColor, setEditorQrColor] = useState('#e83482');
  const [editorQrBgColor, setEditorQrBgColor] = useState('#ffffff');
  const [editorQrCopied, setEditorQrCopied] = useState(false);
  const [showQrModal, setShowQrModal] = useState(false);

  const [editorCardStyleId, setEditorCardStyleId] = useState<string>('midnight_velvet');
  const [editorCardKicker, setEditorCardKicker] = useState<string>('HECHO ESPECIALMENTE PARA');
  const [editorCardMessage, setEditorCardMessage] = useState<string>(
    'Escanea este código con la cámara de tu teléfono y descubre un recuerdo preparado con mucho amor.'
  );
  const [editorCardNames, setEditorCardNames] = useState<string>('');

  const [editorCardQrPosition, setEditorCardQrPosition] = useState<string>('bottom_right');
  const [editorCardFontFamily, setEditorCardFontFamily] = useState<string>('playfair');
  const [editorCardTitleSize, setEditorCardTitleSize] = useState<string>('medium');
  const [editorCardQrSize, setEditorCardQrSize] = useState<string>('medium');
  const [editorCardBorderStyle, setEditorCardBorderStyle] = useState<string>('double_gold');

  const [editorCardMode, setEditorCardMode] = useState<'preset' | 'canva'>('canva');
  const [editorCardCanvasConfig, setEditorCardCanvasConfig] = useState<CustomCanvasConfig>(DEFAULT_CANVAS_CONFIG);

  const [exportsList, setExportsList] = useState<any[]>([]);
  const [exportFormat, setExportFormat] = useState<'9:16' | '4:5' | '1:1' | '16:9'>('9:16');
  const [exportProfile, setExportProfile] = useState<'reel_short' | 'reel_social' | 'full_experience'>('full_experience');
  const [exportMusicUrl, setExportMusicUrl] = useState<string>('');
  const [exportMusicVolume, setExportMusicVolume] = useState<number>(0.3);
  const [exportVideoVolume, setExportVideoVolume] = useState<number>(1.0);
  const [exportAutoDucking, setExportAutoDucking] = useState<boolean>(true);
  const [exportRightsAgreed, setExportRightsAgreed] = useState<boolean>(true);
  const [isExporting, setIsExporting] = useState<boolean>(false);

  const reloadExports = () => {
    if (!id) return;
    fetchProjectExports(id)
      .then((res) => setExportsList(res.exports || []))
      .catch(() => {});
  };

  useEffect(() => {
    if (!id) return;
    fetchProjectById(id)
      .then((res) => {
        setProject(res.project);
        setSections(res.sections || []);
        setMedia(res.media || []);

        const cardSettings = res.project.settings_json?.card_settings || {};
        if (cardSettings.styleId) setEditorCardStyleId(cardSettings.styleId);
        if (cardSettings.kicker) setEditorCardKicker(cardSettings.kicker);
        if (cardSettings.message) setEditorCardMessage(cardSettings.message);
        if (cardSettings.qrPosition) setEditorCardQrPosition(cardSettings.qrPosition);
        if (cardSettings.fontFamily) setEditorCardFontFamily(cardSettings.fontFamily);
        if (cardSettings.titleSize) setEditorCardTitleSize(cardSettings.titleSize);
        if (cardSettings.qrSize) setEditorCardQrSize(cardSettings.qrSize);
        if (cardSettings.borderStyle) setEditorCardBorderStyle(cardSettings.borderStyle);
        if (cardSettings.custom_canvas) setEditorCardCanvasConfig(cardSettings.custom_canvas);

        if (cardSettings.names) {
          setEditorCardNames(cardSettings.names);
        } else {
          const sender = res.project.sender_name || res.project.person_one_name || 'Remitente';
          const recipient = res.project.recipient_name || res.project.person_two_name || 'Destinatario';
          setEditorCardNames(`${sender} & ${recipient}`);
        }
      })
      .catch((err) => alert('Error al cargar proyecto: ' + err.message));

    reloadExports();
    const interval = setInterval(reloadExports, 4000);
    return () => clearInterval(interval);
  }, [id]);

  const handleStartExport = async () => {
    if (!project) return;
    if (!exportRightsAgreed) {
      alert('Por favor confirma que posees derechos o autorización para la música utilizada.');
      return;
    }
    setIsExporting(true);
    try {
      await createProjectExport(project.id, {
        format: exportFormat,
        profile: exportProfile,
        bg_music_url: exportMusicUrl,
        bg_music_volume: exportMusicVolume,
        video_audio_volume: exportVideoVolume,
        auto_ducking: exportAutoDucking,
      });
      reloadExports();
    } catch (err: any) {
      alert('Error al iniciar exportación: ' + err.message);
    } finally {
      setIsExporting(false);
    }
  };

  const handleDeleteExportJob = async (exportId: string) => {
    if (!project || !window.confirm('¿Deseas eliminar este registro de exportación?')) return;
    try {
      await deleteProjectExport(project.id, exportId);
      reloadExports();
    } catch (err: any) {
      alert('Error al eliminar: ' + err.message);
    }
  };

  const handleSave = async () => {
    if (!project) return;
    setSaving(true);
    setSaveStatus('Guardando…');
    try {
      const updatedSettings = {
        ...(project.settings_json || {}),
        card_settings: {
          styleId: editorCardStyleId,
          kicker: editorCardKicker,
          message: editorCardMessage,
          names: editorCardNames,
          qrPosition: editorCardQrPosition,
          fontFamily: editorCardFontFamily,
          titleSize: editorCardTitleSize,
          qrSize: editorCardQrSize,
          borderStyle: editorCardBorderStyle,
          custom_canvas: editorCardCanvasConfig,
        },
      };

      await updateProject(project.id, {
        ...project,
        settings_json: updatedSettings,
        sections,
      });
      setSaveStatus('Cambios guardados ✓');
    } catch (err: any) {
      setSaveStatus('Error al guardar ✖');
    } finally {
      setSaving(false);
    }
  };

  const handleRestoreDefaults = () => {
    if (!project) return;
    if (
      window.confirm(
        '¿Deseas restaurar los textos y estilo recomendados para este tipo de regalo, relación y ocasión? No se borrarán tus fotos ni videos.'
      )
    ) {
      const preset = generateDefaultGiftPreset({
        senderName: project.sender_name || project.person_one_name || 'Remitente',
        recipientName: project.recipient_name || project.person_two_name || 'Destinatario',
        finalSignature: project.final_signature,
        relationship: project.relationship_type || 'couple',
        occasion: project.occasion_type || 'anniversary',
        tone: project.emotional_tone || 'romantic',
      });

      setProject((prev: any) => ({
        ...prev,
        template_id: preset.recommendedThemes[0] || prev.template_id,
        counter_display_mode: preset.counterDisplayMode,
        final_signature: preset.signature,
      }));

      setSections((prev: any[]) =>
        prev.map((sec) => {
          if (sec.section_type === 'hero') {
            return { ...sec, title: preset.heroTitle, subtitle: preset.heroSubtitle };
          }
          if (sec.section_type === 'counter') {
            return { ...sec, title: preset.counterTitle, subtitle: preset.counterFooter };
          }
          if (sec.section_type === 'letter') {
            return {
              ...sec,
              title: preset.letterHeading,
              subtitle: preset.letterTitle,
              content: JSON.stringify(preset.letterParagraphs),
            };
          }
          if (sec.section_type === 'final_message') {
            return { ...sec, title: preset.finalTitle, subtitle: preset.finalSubtitle };
          }
          return sec;
        })
      );

      setSaveStatus('Textos y estilo recomendados aplicados ✓');
    }
  };

const checkVideoDuration = (file: File): Promise<number> => {
  return new Promise((resolve) => {
    const video = document.createElement('video');
    video.preload = 'metadata';
    const objectUrl = URL.createObjectURL(file);
    video.onloadedmetadata = () => {
      URL.revokeObjectURL(objectUrl);
      resolve(video.duration);
    };
    video.onerror = () => {
      URL.revokeObjectURL(objectUrl);
      resolve(0);
    };
    video.src = objectUrl;
  });
};

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>, targetSection?: 'hero' | 'photos' | 'video') => {
    const files = Array.from(e.target.files || []);
    if (!files.length || !project) return;

    e.target.value = '';
    setUploading(true);

    try {
      const newMediaList: any[] = [];
      let updatedSections = [...sections];

      for (const file of files) {
        // En la sección de fotos solo se permiten minivideos de máximo 2 segundos
        if (file.type.startsWith('video/')) {
          if (targetSection === 'photos') {
            const duration = await checkVideoDuration(file);
            if (duration > 2.05) {
              alert(
                `El video "${file.name}" dura ${duration.toFixed(1)} segundos. En la galería de fotos solo se permiten minivideos de máximo 2 segundos.`
              );
              continue;
            }
          }
        }

        let fileDataUrl = '';
        if (file.type.startsWith('image/')) {
          try {
            fileDataUrl = await compressImageFile(file);
          } catch (e) {}
        }

        let mediaItem: any = null;
        try {
          const res = await uploadMediaFile(project.id, file);
          mediaItem = res.media;
        } catch (serverErr) {
          console.warn('Server upload warning, using compressed Data URL:', serverErr);
          if (fileDataUrl) {
            mediaItem = {
              id: `med_local_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
              project_id: project.id,
              media_type: 'image',
              public_url: fileDataUrl,
              original_filename: file.name,
              position: media.length + newMediaList.length + 1,
            };
          } else {
            throw serverErr;
          }
        }

        const finalUrl = resolveMediaUrl(mediaItem.public_url) || fileDataUrl;
        mediaItem.public_url = finalUrl;
        newMediaList.push(mediaItem);

        if (targetSection === 'hero') {
          updatedSections = updatedSections.map((sec) =>
            sec.section_type === 'hero'
              ? { ...sec, settings_json: { ...sec.settings_json, cover: finalUrl } }
              : sec
          );
          break;
        } else if (targetSection === 'video') {
          updatedSections = updatedSections.map((sec) =>
            sec.section_type === 'video'
              ? { ...sec, settings_json: { ...sec.settings_json, videoUrl: finalUrl } }
              : sec
          );
          break;
        }
      }

      const allMedia = [...media, ...newMediaList];
      setMedia(allMedia);
      setSections(updatedSections);

      // Auto-save project changes to database so mobile devices see the photos immediately
      setSaving(true);
      await updateProject(project.id, {
        ...project,
        sections: updatedSections,
      });
      setSaveStatus('¡Fotos subidas y guardadas! ✓');
      setTimeout(() => setSaveStatus('Cambios guardados'), 3000);
    } catch (err: any) {
      alert(err.message || 'Error al procesar las imágenes.');
    } finally {
      setUploading(false);
      setSaving(false);
    }
  };

  const handleDeleteMedia = async (mediaId: string) => {
    try {
      await deleteMediaFile(mediaId);
      setMedia((prev) => prev.filter((m) => m.id !== mediaId));
    } catch (err: any) {
      alert(err.message);
    }
  };

  if (!project) {
    return <div className="min-h-screen bg-slate-950 p-8 text-white">Cargando editor del regalo…</div>;
  }

  const heroSec = sections.find((s) => s.section_type === 'hero');
  const counterSec = sections.find((s) => s.section_type === 'counter') || {
    id: `sec_counter_${project.id}`,
    section_type: 'counter',
    title: 'Desde aquel día han pasado',
    subtitle: 'y todavía quedan muchos recuerdos por crear.',
    settings_json: {},
  };
  const letterSec = sections.find((s) => s.section_type === 'letter');
  const photosSec = sections.find((s) => s.section_type === 'photos');
  const videoSec = sections.find((s) => s.section_type === 'video');
  const finalSec = sections.find((s) => s.section_type === 'final_message');

  // Letter content helper
  let letterParagraphsText = '';
  try {
    if (letterSec?.content) {
      const parsed = JSON.parse(letterSec.content);
      if (Array.isArray(parsed)) letterParagraphsText = parsed.join('\n');
      else letterParagraphsText = String(letterSec.content);
    }
  } catch (e) {
    letterParagraphsText = letterSec?.content || '';
  }

  const updateLetterContent = (rawText: string) => {
    const lines = rawText.split('\n');
    setSections((prev) =>
      prev.map((s) => (s.id === letterSec.id ? { ...s, content: JSON.stringify(lines) } : s))
    );
  };

  const updateAutoplayMode = (mode: 'auto_and_manual' | 'manual_only') => {
    if (!photosSec) return;
    setSections((prev) =>
      prev.map((s) =>
        s.id === photosSec.id
          ? { ...s, settings_json: { ...s.settings_json, autoplay_mode: mode } }
          : s
      )
    );
  };

  const updateCounterSection = (field: 'title' | 'subtitle', val: string) => {
    setSections((prev) => {
      const exists = prev.some((s) => s.section_type === 'counter');
      if (exists) {
        return prev.map((s) => (s.section_type === 'counter' ? { ...s, [field]: val } : s));
      } else {
        return [
          ...prev,
          {
            ...counterSec,
            [field]: val,
            project_id: project.id,
            position: 1.5,
            is_enabled: true,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
          },
        ];
      }
    });
  };

  const updateCounterSetting = (settingKey: string, val: any) => {
    setSections((prev) => {
      const exists = prev.some((s) => s.section_type === 'counter');
      if (exists) {
        return prev.map((s) =>
          s.section_type === 'counter'
            ? { ...s, settings_json: { ...s.settings_json, [settingKey]: val } }
            : s
        );
      } else {
        return [
          ...prev,
          {
            ...counterSec,
            settings_json: { ...counterSec.settings_json, [settingKey]: val },
            project_id: project.id,
            position: 1.5,
            is_enabled: true,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
          },
        ];
      }
    });
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans selection:bg-pink-500">
      {/* Editor Header */}
      <header className="px-3 sm:px-6 py-3 sm:py-4 bg-slate-900 border-b border-slate-800 flex items-center justify-between sticky top-0 z-30 gap-2">
        <div className="flex items-center gap-2 sm:gap-4 min-w-0">
          <button
            onClick={() => navigate('/admin/dashboard')}
            className="p-2 sm:p-2.5 rounded-xl bg-slate-800 text-slate-300 hover:bg-slate-700 hover:text-white transition flex-shrink-0"
          >
            <ArrowLeft className="w-4 h-4 sm:w-5 sm:h-5" />
          </button>
          <div className="min-w-0">
            <h1 className="text-sm sm:text-lg font-bold text-white truncate max-w-[140px] sm:max-w-none">{project.internal_name}</h1>
            <p className="text-[10px] sm:text-xs text-pink-400 font-mono truncate">/r/{project.slug}</p>
          </div>
        </div>

        <div className="flex items-center gap-2 sm:gap-4 flex-shrink-0">
          <span className="hidden sm:block text-xs font-semibold text-slate-400">{saveStatus}</span>

          <button
            onClick={() => setShowQrModal(true)}
            className="flex items-center gap-1.5 py-2 px-3.5 rounded-xl bg-pink-500/10 border border-pink-500/30 text-pink-300 font-bold text-xs sm:text-sm hover:bg-pink-500 hover:text-white transition shadow-sm"
            title="Código QR y Tarjeta de Presentación"
          >
            <QrCode className="w-4 h-4" />
            <span className="hidden sm:inline">QR / Tarjeta</span>
          </button>

          <a
            href={`/r/${project.slug}`}
            target="_blank"
            rel="noreferrer"
            className="hidden sm:flex items-center gap-2 py-2 px-3 rounded-xl bg-slate-800 text-slate-200 text-sm font-semibold hover:bg-slate-700 transition"
          >
            <Smartphone className="w-4 h-4" />
            Vista previa
          </a>
          {/* Mobile: icon-only preview link */}
          <a
            href={`/r/${project.slug}`}
            target="_blank"
            rel="noreferrer"
            className="sm:hidden p-2 rounded-xl bg-slate-800 text-slate-200 hover:bg-slate-700 transition"
            title="Vista previa"
          >
            <Smartphone className="w-4 h-4" />
          </a>

          <button
            onClick={handleSave}
            disabled={saving}
            className="flex items-center gap-1.5 sm:gap-2 py-2 sm:py-2.5 px-3 sm:px-6 rounded-xl bg-gradient-to-r from-pink-500 to-rose-500 text-white text-xs sm:text-sm font-bold shadow-lg hover:brightness-110 active:scale-95 transition"
          >
            <Save className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
            <span className="hidden sm:inline">Guardar cambios</span>
            <span className="sm:hidden">Guardar</span>
          </button>
        </div>
      </header>

      {/* Editor Main Layout */}
      <div className="flex-1 flex flex-col lg:flex-row overflow-hidden">

        {/* Mobile: Horizontal scrollable tabs */}
        <nav className="lg:hidden flex overflow-x-auto gap-1 px-3 py-2 bg-slate-900 border-b border-slate-800 scrollbar-hide">
          {[
            { id: 'info', label: 'Identidad', icon: Heart },
            { id: 'design', label: 'Tema', icon: Layers },
            { id: 'preview', label: 'Preview', icon: Eye },
            { id: 'hero', label: 'Portada', icon: ImageIcon },
            { id: 'letter', label: 'Carta', icon: Type },
            { id: 'photos', label: 'Fotos', icon: ImageIcon },
            { id: 'video', label: 'Video', icon: Film },
            { id: 'export', label: 'Exportar', icon: Film },
            { id: 'final', label: 'Cierre', icon: Sparkles },
            { id: 'qr', label: 'QR', icon: QrCode },
          ].map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex-shrink-0 flex items-center gap-1.5 px-3 py-2 rounded-lg font-semibold text-xs transition whitespace-nowrap ${
                  activeTab === tab.id
                    ? 'bg-pink-600/25 text-pink-400 border border-pink-500/30'
                    : 'text-slate-400 hover:text-white hover:bg-slate-800'
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                {tab.label}
              </button>
            );
          })}
        </nav>

        {/* Desktop: Sidebar Navigation Tabs */}
        <aside className="hidden lg:block w-72 bg-slate-900 border-r border-slate-800 p-4 space-y-1 overflow-y-auto">
          {[
            { id: 'info', label: '1. Identidad & Contador', icon: Heart },
            { id: 'design', label: '2. Tema & Estilo Visual', icon: Layers },
            { id: 'preview', label: '3. 👁️ Vista Previa En Vivo', icon: Eye },
            { id: 'hero', label: '4. Portada Principal', icon: ImageIcon },
            { id: 'letter', label: '5. Carta Personalizada', icon: Type },
            { id: 'photos', label: '6. Galería de Fotos', icon: ImageIcon },
            { id: 'video', label: '7. Video Especial', icon: Film },
            { id: 'export', label: '8. 🎬 Exportar & Descargar Video', icon: Film },
            { id: 'final', label: '9. Mensaje Cierre', icon: Sparkles },
            { id: 'qr', label: '10. Código QR & Tarjeta PDF', icon: QrCode },
          ].map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`w-full flex items-center gap-3 text-left px-4 py-3 rounded-xl font-semibold text-sm transition ${
                  activeTab === tab.id
                    ? 'bg-pink-600/20 text-pink-400 border border-pink-500/30 shadow-md'
                    : 'text-slate-400 hover:text-white hover:bg-slate-800'
                }`}
              >
                <Icon className="w-4 h-4" />
                {tab.label}
              </button>
            );
          })}
        </aside>

        {/* Tab Content Panel */}
        <main className="flex-1 p-4 sm:p-8 overflow-y-auto max-w-4xl space-y-6">
          {/* Tab 1: Info & Time Counter */}
          {activeTab === 'info' && (
            <div className="space-y-6">
              <div className="bg-slate-900 p-6 rounded-3xl border border-slate-800 space-y-4">
                <div className="flex items-center justify-between">
                  <h2 className="text-xl font-bold text-white">Identidad & Participantes del Regalo</h2>
                  <button
                    type="button"
                    onClick={handleRestoreDefaults}
                    className="py-2 px-3.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-pink-400 font-bold text-xs border border-pink-500/20 flex items-center gap-1.5 transition cursor-pointer"
                  >
                    <RotateCcw className="w-3.5 h-3.5" />
                    Restaurar recomendados
                  </button>
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-400 mb-1">Quién entrega el regalo (Remitente)</label>
                    <input
                      type="text"
                      value={project.sender_name || project.person_one_name || ''}
                      onChange={(e) =>
                        setProject({
                          ...project,
                          sender_name: e.target.value,
                          person_one_name: e.target.value,
                        })
                      }
                      placeholder="Ej: Pablo / Tus hijos / Mamá y papá"
                      className="w-full p-3 rounded-xl bg-slate-800 border border-slate-700 text-white text-sm"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-400 mb-1">Quién recibe el regalo (Destinatario)</label>
                    <input
                      type="text"
                      value={project.recipient_name || project.person_two_name || ''}
                      onChange={(e) =>
                        setProject({
                          ...project,
                          recipient_name: e.target.value,
                          person_two_name: e.target.value,
                        })
                      }
                      placeholder="Ej: Carolina / Mamá / Mi pequeña Sofía"
                      className="w-full p-3 rounded-xl bg-slate-800 border border-slate-700 text-white text-sm"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-400 mb-1">Firma final pública</label>
                    <input
                      type="text"
                      value={project.final_signature || ''}
                      onChange={(e) => setProject({ ...project, final_signature: e.target.value })}
                      placeholder="Ej: Con amor, tu hijo / Con cariño, todo el equipo"
                      className="w-full p-3 rounded-xl bg-slate-800 border border-slate-700 text-white text-sm"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-400 mb-1">Nombre afectivo (Opcional)</label>
                    <input
                      type="text"
                      value={project.affectionate_name || ''}
                      onChange={(e) => setProject({ ...project, affectionate_name: e.target.value })}
                      placeholder="Ej: Para Mamá con amor"
                      className="w-full p-3 rounded-xl bg-slate-800 border border-slate-700 text-white text-sm"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-4 pt-2 border-t border-slate-800">
                  <div>
                    <label className="block text-xs font-bold text-slate-400 mb-1">Tipo de Relación</label>
                    <select
                      value={project.relationship_type || 'couple'}
                      onChange={(e) => setProject({ ...project, relationship_type: e.target.value })}
                      className="w-full p-3 rounded-xl bg-slate-800 border border-slate-700 text-white text-xs font-semibold"
                    >
                      <option value="couple">Pareja</option>
                      <option value="husband_to_wife">Esposo a esposa</option>
                      <option value="wife_to_husband">Esposa a esposo</option>
                      <option value="father_to_daughter">Padre a hija</option>
                      <option value="mother_to_son">Madre a hijo</option>
                      <option value="daughter_to_mother">Hija a madre</option>
                      <option value="son_to_mother">Hijo a madre</option>
                      <option value="parents_to_child">Padres a hijo/hija</option>
                      <option value="friends">Entre amigos</option>
                      <option value="best_friends">Mejor amigo/amiga</option>
                      <option value="siblings">Entre hermanos</option>
                      <option value="family">Familia</option>
                      <option value="coworkers">Compañeros de trabajo</option>
                      <option value="student_to_teacher">Alumno a profesor</option>
                      <option value="tribute">Homenaje</option>
                      <option value="in_memory">En memoria de alguien</option>
                      <option value="other">Otra relación</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-400 mb-1">Ocasión Celebrada</label>
                    <select
                      value={project.occasion_type || 'anniversary'}
                      onChange={(e) => setProject({ ...project, occasion_type: e.target.value })}
                      className="w-full p-3 rounded-xl bg-slate-800 border border-slate-700 text-white text-xs font-semibold"
                    >
                      <option value="anniversary">Aniversario</option>
                      <option value="birthday">Cumpleaños</option>
                      <option value="mothers_day">Día de la Madre</option>
                      <option value="fathers_day">Día del Padre</option>
                      <option value="graduation">Graduación</option>
                      <option value="birth">Nacimiento</option>
                      <option value="wedding">Matrimonio</option>
                      <option value="marriage_proposal">Propuesta</option>
                      <option value="valentines">San Valentín</option>
                      <option value="friendship">Amistad</option>
                      <option value="gratitude">Agradecimiento</option>
                      <option value="retirement">Jubilación</option>
                      <option value="personal_achievement">Logro personal</option>
                      <option value="tribute">Homenaje</option>
                      <option value="in_memory">En memoria de alguien</option>
                      <option value="no_occasion">Sin ocasión especial</option>
                      <option value="custom">Personalizado</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-400 mb-1">Tono Emocional</label>
                    <select
                      value={project.emotional_tone || 'romantic'}
                      onChange={(e) => setProject({ ...project, emotional_tone: e.target.value })}
                      className="w-full p-3 rounded-xl bg-slate-800 border border-slate-700 text-white text-xs font-semibold"
                    >
                      <option value="romantic">🌹 Romántico</option>
                      <option value="family">🏡 Familiar</option>
                      <option value="emotional">💖 Emotivo</option>
                      <option value="joyful">🎉 Alegre</option>
                      <option value="funny">🤪 Divertido</option>
                      <option value="tender">🧸 Tierno</option>
                      <option value="childish">⭐ Infantil</option>
                      <option value="elegant">✨ Elegante</option>
                      <option value="nostalgic">📜 Nostálgico</option>
                      <option value="inspiring">🌿 Inspirador</option>
                      <option value="solemn">🕊️ Solemne</option>
                      <option value="grateful">🙏 Agradecido</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4 pt-2 border-t border-slate-800">
                  <div>
                    <label className="block text-xs font-bold text-slate-400 mb-1">Fecha de Ocasión / Evento</label>
                    <input
                      type="date"
                      value={project.occasion_date}
                      onChange={(e) => setProject({ ...project, occasion_date: e.target.value })}
                      className="w-full p-3 rounded-xl bg-slate-800 border border-slate-700 text-white font-mono text-xs"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-400 mb-1">Fecha de Inicio / Hito</label>
                    <input
                      type="date"
                      value={project.relationship_start_date}
                      onChange={(e) => {
                        setProject({ ...project, relationship_start_date: e.target.value });
                        updateCounterSetting('customYears', '');
                        updateCounterSetting('customMonths', '');
                        updateCounterSetting('customDays', '');
                      }}
                      className="w-full p-3 rounded-xl bg-slate-800 border border-slate-700 text-white font-mono text-xs"
                    />
                  </div>
                </div>
              </div>

              {/* Contador de Tiempo / Fechas Especiales */}
              <div className="bg-slate-900 p-6 rounded-3xl border border-slate-800 space-y-5">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-pink-400 font-bold">
                    <Clock className="w-5 h-5" />
                    <h3 className="text-lg text-white">Configuración del Contador de Tiempo</h3>
                  </div>

                  {/* Counter Display Mode Selector */}
                  <select
                    value={project.counter_display_mode || counterSec.settings_json?.display_mode || 'elapsed_time'}
                    onChange={(e) => {
                      const val = e.target.value;
                      setProject({ ...project, counter_display_mode: val });
                      updateCounterSetting('display_mode', val);
                      setSections((prev) =>
                        prev.map((s) => (s.section_type === 'counter' ? { ...s, is_enabled: val !== 'hidden' } : s))
                      );
                    }}
                    className="p-2 px-3 rounded-xl bg-slate-800 border border-slate-700 text-xs font-bold text-pink-400"
                  >
                    <option value="elapsed_time">Modo: Tiempo transcurrido</option>
                    <option value="countdown">Modo: Cuenta regresiva</option>
                    <option value="show_date_only">Modo: Solo mostrar fecha</option>
                    <option value="hidden">Modo: Ocultar contador</option>
                  </select>
                </div>

                {(project.counter_display_mode || counterSec.settings_json?.display_mode) !== 'hidden' && (
                  <>
                    <div>
                      <label className="block text-xs font-bold text-slate-400 mb-1">
                        Texto Superior (Ej: "Desde aquel día han pasado" / "Nuestra amistad comenzó hace")
                      </label>
                      <input
                        type="text"
                        value={counterSec.title || 'Desde aquel día han pasado'}
                        onChange={(e) => updateCounterSection('title', e.target.value)}
                        className="w-full p-3 rounded-xl bg-slate-800 border border-slate-700 text-white text-sm"
                      />
                    </div>

                    {/* Premium Number Pickers */}
                    <div className="p-5 rounded-2xl bg-slate-800/60 border border-slate-700 space-y-4">
                      <div className="flex items-center justify-between">
                        <label className="text-xs font-bold text-pink-400 uppercase tracking-wider">
                          Ajuste Manual del Contador
                        </label>
                        <button
                          type="button"
                          onClick={() => {
                            updateCounterSetting('customYears', '');
                            updateCounterSetting('customMonths', '');
                            updateCounterSetting('customDays', '');
                          }}
                          className="text-xs text-slate-400 hover:text-pink-400 flex items-center gap-1 transition"
                        >
                          <RotateCcw className="w-3 h-3" />
                          Usar cálculo automático por fecha
                        </button>
                      </div>
                      <p className="text-xs text-slate-500">
                        Escribe un número o usa el selector ▼ para elegirlo. Si dejas en blanco, se calcula automáticamente desde la fecha elegida.
                      </p>

                      <div
                        style={{
                          display: 'flex',
                          gap: 12,
                          alignItems: 'flex-start',
                          justifyContent: 'center',
                          paddingTop: 4,
                          paddingBottom: 8,
                          position: 'relative',
                          zIndex: 10,
                        }}
                      >
                        <NumberPicker
                          label="Años"
                          value={counterSec.settings_json?.customYears}
                          onChange={(val) => updateCounterSetting('customYears', val)}
                          min={0}
                          max={50}
                          unit="años"
                        />
                        <div style={{ width: 1, alignSelf: 'stretch', background: 'rgba(255,255,255,0.06)', margin: '4px 0' }} />
                        <NumberPicker
                          label="Meses"
                          value={counterSec.settings_json?.customMonths}
                          onChange={(val) => updateCounterSetting('customMonths', val)}
                          min={0}
                          max={11}
                          unit="meses"
                        />
                        <div style={{ width: 1, alignSelf: 'stretch', background: 'rgba(255,255,255,0.06)', margin: '4px 0' }} />
                        <NumberPicker
                          label="Días"
                          value={counterSec.settings_json?.customDays}
                          onChange={(val) => updateCounterSetting('customDays', val)}
                          min={0}
                          max={31}
                          unit="días"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-400 mb-1">
                        Frase Inferior del Contador
                      </label>
                      <input
                        type="text"
                        value={counterSec.subtitle || 'y todavía quedan muchos recuerdos por crear.'}
                        onChange={(e) => updateCounterSection('subtitle', e.target.value)}
                        className="w-full p-3 rounded-xl bg-slate-800 border border-slate-700 text-white font-serif italic text-sm"
                      />
                    </div>
                  </>
                )}
              </div>

              {/* Acceso Rápido a Código QR & Tarjeta de Presentación */}
              <div className="bg-slate-900 p-6 rounded-3xl border border-slate-800 space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <QrCode className="w-5 h-5 text-pink-500" />
                    <div>
                      <h3 className="text-base font-bold text-white leading-tight">Código QR &amp; Tarjeta de Presentación</h3>
                      <p className="text-xs text-slate-400">Entrega rápida para tu cliente</p>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={() => setShowQrModal(true)}
                    className="px-3.5 py-1.5 rounded-xl bg-pink-600/20 hover:bg-pink-600 text-pink-300 hover:text-white border border-pink-500/30 text-xs font-bold transition flex items-center gap-1.5"
                  >
                    <Sparkles className="w-3.5 h-3.5" />
                    Abrir Personalizador QR
                  </button>
                </div>

                <div className="flex flex-col sm:flex-row items-center gap-5 bg-slate-950/60 p-4 rounded-2xl border border-slate-800">
                  <div className="p-3 bg-white rounded-xl shadow-lg flex-shrink-0">
                    <img
                      src={getQrCodeUrl(project.id, 'png', '#e83482', '#ffffff')}
                      alt="Código QR del regalo"
                      className="w-24 h-24 object-contain"
                    />
                  </div>

                  <div className="space-y-3 flex-1 text-xs">
                    <div>
                      <span className="text-[10px] font-bold text-pink-400 uppercase tracking-wider block">Enlace público asignado</span>
                      <p className="font-mono text-slate-200 text-xs truncate max-w-md">{getPublicGiftUrl(project.slug)}</p>
                    </div>

                    <div className="flex flex-wrap gap-2 pt-1">
                      <a
                        href={getQrCodeUrl(project.id, 'png', '#e83482', '#ffffff')}
                        download={`qr_${project.slug}.png`}
                        className="inline-flex items-center gap-1.5 py-2 px-3 rounded-lg bg-pink-600 text-white font-bold hover:bg-pink-500 transition"
                      >
                        <Download className="w-3.5 h-3.5" />
                        Descargar QR (PNG)
                      </a>
                      <a
                        href={getPrintableCardUrl(project.id)}
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex items-center gap-1.5 py-2 px-3 rounded-lg bg-slate-800 text-slate-200 font-bold hover:bg-slate-700 transition"
                      >
                        <FileText className="w-3.5 h-3.5" />
                        Descargar Tarjeta PDF (9x9 cm)
                      </a>
                      <a
                        href={`https://api.whatsapp.com/send?text=${encodeURIComponent(
                          `¡Hola! Tu regalo personalizado ya está listo. Puedes ver la experiencia aquí: ${getPublicGiftUrl(project.slug)}`
                        )}`}
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex items-center gap-1.5 py-2 px-3 rounded-lg bg-emerald-600 text-white font-bold hover:bg-emerald-500 transition"
                      >
                        <Share2 className="w-3.5 h-3.5" />
                        Enviar por WhatsApp
                      </a>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Tab 2: Design */}
          {activeTab === 'design' && (
            <div className="space-y-6 bg-slate-900 p-6 rounded-3xl border border-slate-800">
              <div>
                <h2 className="text-xl font-bold text-white">Diseño Visual del Regalo</h2>
                <p className="text-xs text-slate-400 mt-1">
                  Elige entre 4 diseños premium únicos. El tema se aplica a toda la experiencia del destinatario.
                </p>
              </div>

              <div className="grid grid-cols-2 gap-5">
                {(Object.values(THEMES) as any[]).map((t) => {
                  const isSelected = project.template_id === t.id;
                  return (
                    <button
                      key={t.id}
                      type="button"
                      onClick={() => setProject({ ...project, template_id: t.id })}
                      style={{ all: 'unset', display: 'block', cursor: 'pointer', width: '100%' }}
                    >
                      <div
                        style={{
                          borderRadius: 20,
                          overflow: 'hidden',
                          border: isSelected
                            ? '2.5px solid rgba(236,72,153,0.9)'
                            : '1.5px solid rgba(255,255,255,0.07)',
                          boxShadow: isSelected
                            ? '0 0 0 4px rgba(236,72,153,0.18), 0 20px 50px rgba(0,0,0,0.5)'
                            : '0 8px 24px rgba(0,0,0,0.4)',
                          transition: 'all 0.22s ease',
                          transform: isSelected ? 'scale(1.02)' : 'scale(1)',
                          position: 'relative',
                        }}
                        onMouseEnter={(e) => {
                          if (!isSelected) (e.currentTarget as HTMLElement).style.transform = 'scale(1.015)';
                        }}
                        onMouseLeave={(e) => {
                          if (!isSelected) (e.currentTarget as HTMLElement).style.transform = 'scale(1)';
                        }}
                      >
                        {/* ── Theme Background Preview ── */}
                        <div
                          style={{
                            height: 110,
                            background: t.bgGradient,
                            position: 'relative',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            flexDirection: 'column',
                            gap: 4,
                            padding: '12px 16px',
                          }}
                        >
                          {/* Emoji icon */}
                          <span style={{ fontSize: 28, lineHeight: 1 }}>{t.emoji}</span>

                          {/* Mini "card" inside preview */}
                          <div
                            style={{
                              background: t.cardBg,
                              border: `1px solid ${t.cardBorder}`,
                              borderRadius: 10,
                              padding: '6px 14px',
                              boxShadow: t.cardShadow,
                            }}
                          >
                            <p
                              style={{
                                fontFamily: t.fontTitle,
                                color: t.titleColor,
                                fontSize: 12,
                                fontWeight: 700,
                                margin: 0,
                                letterSpacing: '0.03em',
                                whiteSpace: 'nowrap',
                              }}
                            >
                              Tú & Yo
                            </p>
                          </div>

                          {/* Selected badge */}
                          {isSelected && (
                            <div
                              style={{
                                position: 'absolute',
                                top: 10,
                                right: 10,
                                background: 'rgba(236,72,153,0.95)',
                                borderRadius: '50%',
                                width: 24,
                                height: 24,
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                              }}
                            >
                              <Check style={{ width: 13, height: 13, color: '#fff' }} />
                            </div>
                          )}
                        </div>

                        {/* ── Theme Info ── */}
                        <div
                          style={{
                            background: 'rgba(15,12,28,0.97)',
                            padding: '12px 14px',
                          }}
                        >
                          {/* Color swatches */}
                          <div style={{ display: 'flex', gap: 5, marginBottom: 8 }}>
                            {[t.titleColor, t.accentColor, t.kickerColor, t.counterNumberColor].map((c, i) => (
                              <div
                                key={i}
                                style={{
                                  width: 16,
                                  height: 16,
                                  borderRadius: '50%',
                                  background: c,
                                  border: '1.5px solid rgba(255,255,255,0.12)',
                                  flexShrink: 0,
                                }}
                              />
                            ))}
                            <span
                              style={{
                                fontSize: 9,
                                color: 'rgba(255,255,255,0.4)',
                                alignSelf: 'center',
                                marginLeft: 2,
                                fontFamily: 'Inter, sans-serif',
                                letterSpacing: '0.06em',
                                textTransform: 'uppercase',
                              }}
                            >
                              paleta
                            </span>
                          </div>

                          <h3
                            style={{
                              color: '#f8f8f8',
                              fontWeight: 700,
                              fontSize: 14,
                              margin: '0 0 4px 0',
                              fontFamily: 'Inter, system-ui, sans-serif',
                            }}
                          >
                            {t.name}
                          </h3>
                          <p
                            style={{
                              color: 'rgba(200,190,220,0.6)',
                              fontSize: 11,
                              lineHeight: 1.45,
                              margin: 0,
                              fontFamily: 'Inter, system-ui, sans-serif',
                            }}
                          >
                            {t.description}
                          </p>
                        </div>
                      </div>
                    </button>
                  );
                })}
              </div>

              {/* Current theme indicator */}
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 10,
                  padding: '10px 16px',
                  borderRadius: 12,
                  background: 'rgba(255,255,255,0.04)',
                  border: '1px solid rgba(255,255,255,0.07)',
                }}
              >
                <span style={{ fontSize: 20 }}>
                  {THEMES[project.template_id as keyof typeof THEMES]?.emoji || '🎨'}
                </span>
                <div>
                  <p style={{ margin: 0, fontSize: 12, fontWeight: 700, color: '#e0d8f8', fontFamily: 'Inter' }}>
                    Tema activo: {THEMES[project.template_id as keyof typeof THEMES]?.name || project.template_id}
                  </p>
                  <p style={{ margin: 0, fontSize: 10, color: 'rgba(180,170,200,0.55)', fontFamily: 'Inter' }}>
                    Guarda los cambios para que el destinatario vea el nuevo diseño.
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Tab 3: Live Preview */}
          {activeTab === 'preview' && (
            <div className="space-y-4">
              <div className="bg-slate-900 p-5 rounded-3xl border border-slate-800 flex items-center justify-between">
                <div>
                  <h2 className="text-xl font-bold text-white">👁️ Vista Previa Interactiva en Tiempo Real</h2>
                  <p className="text-xs text-slate-400 mt-0.5">
                    Cualquier cambio de relación, tono o colores se refleja de inmediato aquí sin necesidad de guardar o recargar.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={handleRestoreDefaults}
                  className="py-2.5 px-4 rounded-xl bg-slate-800 hover:bg-slate-700 text-pink-400 font-bold text-xs border border-pink-500/20 flex items-center gap-1.5 transition cursor-pointer"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  Restaurar recomendados
                </button>
              </div>

              <div className="rounded-3xl overflow-hidden border border-slate-800 shadow-2xl bg-slate-950 min-h-[680px]">
                <GiftExperience
                  project={project}
                  sections={sections}
                  media={media}
                  mode="preview"
                />
              </div>
            </div>
          )}

          {/* Tab 4: Hero */}
          {activeTab === 'hero' && heroSec && (
            <div className="space-y-6 bg-slate-900 p-6 rounded-3xl border border-slate-800">
              <h2 className="text-xl font-bold text-white">Configuración de la Portada Principal</h2>
              <div>
                <label className="block text-xs font-bold text-slate-400 mb-1">Título Principal de la Portada</label>
                <input
                  type="text"
                  value={heroSec.title || ''}
                  onChange={(e) =>
                    setSections((prev) =>
                      prev.map((s) => (s.id === heroSec.id ? { ...s, title: e.target.value } : s))
                    )
                  }
                  className="w-full p-3 rounded-xl bg-slate-800 border border-slate-700 text-white"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-400 mb-1">Texto de Introducción</label>
                <textarea
                  value={heroSec.subtitle || ''}
                  onChange={(e) =>
                    setSections((prev) =>
                      prev.map((s) => (s.id === heroSec.id ? { ...s, subtitle: e.target.value } : s))
                    )
                  }
                  className="w-full p-3 rounded-xl bg-slate-800 border border-slate-700 text-white min-h-[90px]"
                />
              </div>

              {/* ── Portada photo ── */}
              <div className="space-y-3">
                <label className="block text-xs font-bold text-slate-400">Fotografía Principal de Portada</label>
                {heroSec.settings_json?.cover && (
                  <div className="relative w-full max-w-sm h-48 rounded-2xl overflow-hidden bg-slate-800 border border-slate-700">
                    <img src={resolveMediaUrl(heroSec.settings_json.cover)} alt="Portada" className="w-full h-full object-cover" />
                  </div>
                )}
                <div className="flex flex-wrap items-center gap-3">
                  <label className="cursor-pointer inline-flex items-center gap-2 py-2.5 px-5 rounded-xl bg-pink-600 text-white text-xs font-bold shadow-lg hover:brightness-110 transition">
                    <Upload className="w-4 h-4" />
                    {uploading ? 'Subiendo imagen…' : 'Cambiar Imagen de Portada'}
                    <input type="file" accept="image/*" onChange={(e) => handleFileUpload(e, 'hero')} className="hidden" />
                  </label>
                  {heroSec.settings_json?.cover && (
                    <button
                      type="button"
                      onClick={() => {
                        setSections((prev) =>
                          prev.map((s) =>
                            s.id === heroSec.id
                              ? { ...s, settings_json: { ...s.settings_json, cover: '' } }
                              : s
                          )
                        );
                      }}
                      className="py-2.5 px-4 rounded-xl bg-rose-600/30 hover:bg-rose-600 text-rose-300 hover:text-white text-xs font-bold transition flex items-center gap-1.5 cursor-pointer"
                    >
                      <Trash2 className="w-4 h-4" />
                      Quitar Foto de Portada
                    </button>
                  )}
                </div>
              </div>

              <div className="mt-6 pt-6 border-t border-slate-800 space-y-4">
                <h3 className="text-base font-bold text-pink-400 flex items-center gap-2">
                  🎵 Foto para "La canción que empezó todo"
                </h3>
                <p className="text-xs text-slate-400">
                  Esta foto aparece como polaroid debajo del reproductor al inicio de la experiencia. Si no subes ninguna, se usa la foto de portada.
                </p>

                {/* Preview */}
                {project.settings_json?.song_photo_url && (
                  <div className="relative w-full max-w-xs h-44 rounded-2xl overflow-hidden border border-slate-700 bg-slate-800">
                    <img
                      src={resolveMediaUrl(project.settings_json.song_photo_url)}
                      alt="Foto de la canción"
                      className="w-full h-full object-cover"
                    />
                    <button
                      type="button"
                      onClick={() =>
                        setProject((p: any) => ({
                          ...p,
                          settings_json: { ...p.settings_json, song_photo_url: '' },
                        }))
                      }
                      className="absolute top-2 right-2 p-1.5 rounded-full bg-black/60 text-white hover:bg-red-600 transition"
                      title="Quitar foto"
                    >
                      ✕
                    </button>
                  </div>
                )}

                <label className="cursor-pointer inline-flex items-center gap-2 py-2.5 px-5 rounded-xl bg-pink-600 text-white text-xs font-bold shadow-lg hover:brightness-110 transition">
                  <Upload className="w-4 h-4" />
                  {uploading ? 'Subiendo…' : 'Subir foto de la canción (polaroid)'}
                  <input
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={async (e) => {
                      const file = e.target.files?.[0];
                      if (!file) return;
                      setUploading(true);
                      try {
                        const dataUrl = await compressImageFile(file);
                        // Convert dataUrl to Blob for FormData
                        const res = await fetch(dataUrl);
                        const blob = await res.blob();
                        const compressed = new File([blob], file.name, { type: blob.type });
                        const fd = new FormData();
                        fd.append('file', compressed);
                        fd.append('projectId', project.id);
                        const apiBase = (window as any).__VITE_API_URL__ || 'https://sorpresas-app-backend-production.up.railway.app';
                        const resp = await fetch(`${apiBase}/api/media/upload`, {
                          method: 'POST',
                          headers: { Authorization: `Bearer ${localStorage.getItem('auth_token')}` },
                          body: fd,
                        });
                        if (resp.ok) {
                          const data = await resp.json();
                          const url = data.media?.url || data.url || data.media?.public_url || '';
                          setProject((p: any) => ({
                            ...p,
                            settings_json: { ...p.settings_json, song_photo_url: url },
                          }));
                        }
                      } catch (err) {
                        console.error('Error uploading song photo', err);
                      } finally {
                        setUploading(false);
                      }
                    }}
                  />
                </label>

                {/* Song name & artist editable */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                  <div>
                    <label className="block text-xs font-bold text-slate-400 mb-1">Nombre de la canción</label>
                    <input
                      type="text"
                      value={project.settings_json?.song_name || 'Until Found'}
                      onChange={(e) =>
                        setProject((p: any) => ({
                          ...p,
                          settings_json: { ...p.settings_json, song_name: e.target.value },
                        }))
                      }
                      className="w-full p-2.5 rounded-xl bg-slate-800 border border-slate-700 text-white text-sm"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-400 mb-1">Artista</label>
                    <input
                      type="text"
                      value={project.settings_json?.song_artist || 'Sam Smith'}
                      onChange={(e) =>
                        setProject((p: any) => ({
                          ...p,
                          settings_json: { ...p.settings_json, song_artist: e.target.value },
                        }))
                      }
                      className="w-full p-2.5 rounded-xl bg-slate-800 border border-slate-700 text-white text-sm"
                    />
                  </div>
                </div>
              </div>
            </div>
          )}


          {/* Tab 4: Letter */}
          {activeTab === 'letter' && letterSec && (
            <div className="space-y-6 bg-slate-900 p-6 rounded-3xl border border-slate-800">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-xl font-bold text-white">Edición Completa de la Carta Personalizada</h2>
                  <p className="text-xs text-slate-400 mt-0.5">
                    Puedes editar la etiqueta superior, título, subtítulo interno, texto completo y firma.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={handleRestoreDefaults}
                  className="py-2 px-3.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-pink-400 font-bold text-xs border border-pink-500/20 flex items-center gap-1.5 transition cursor-pointer"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  Restaurar sugeridos
                </button>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-400 mb-1">Etiqueta Superior (Kicker)</label>
                  <input
                    type="text"
                    value={letterSec.settings_json?.kicker || ''}
                    onChange={(e) =>
                      setSections((prev) =>
                        prev.map((s) =>
                          s.id === letterSec.id
                            ? { ...s, settings_json: { ...s.settings_json, kicker: e.target.value } }
                            : s
                        )
                      )
                    }
                    placeholder="Ej: LO QUE SIENTO POR TI / UN MENSAJE ESPECIAL"
                    className="w-full p-3 rounded-xl bg-slate-800 border border-slate-700 text-white text-sm"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-400 mb-1">Título Principal de la Sección</label>
                  <input
                    type="text"
                    value={letterSec.title || ''}
                    onChange={(e) =>
                      setSections((prev) =>
                        prev.map((s) => (s.id === letterSec.id ? { ...s, title: e.target.value } : s))
                      )
                    }
                    placeholder="Ej: Te amo / Gracias por estar siempre"
                    className="w-full p-3 rounded-xl bg-slate-800 border border-slate-700 text-white text-sm font-serif"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-400 mb-1">Subtítulo de la Carta (Encabezado Interno)</label>
                  <input
                    type="text"
                    value={letterSec.subtitle || ''}
                    onChange={(e) =>
                      setSections((prev) =>
                        prev.map((s) => (s.id === letterSec.id ? { ...s, subtitle: e.target.value } : s))
                      )
                    }
                    placeholder="Ej: Para ti, mi amor / Todo lo que aprendí de ti"
                    className="w-full p-3 rounded-xl bg-slate-800 border border-slate-700 text-white text-sm font-serif"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-400 mb-1">Firma de la Carta</label>
                  <input
                    type="text"
                    value={letterSec.settings_json?.signature || project.final_signature || ''}
                    onChange={(e) => {
                      const val = e.target.value;
                      setProject((prev: any) => ({ ...prev, final_signature: val }));
                      setSections((prev) =>
                        prev.map((s) =>
                          s.id === letterSec.id
                            ? { ...s, settings_json: { ...s.settings_json, signature: val } }
                            : s
                        )
                      );
                    }}
                    placeholder="Ej: Con todo mi amor, Diego / Con cariño, tus hijos"
                    className="w-full p-3 rounded-xl bg-slate-800 border border-slate-700 text-white text-sm font-serif"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-400 mb-1">
                  Cuerpo del Mensaje (Presiona Enter para crear párrafos independientes)
                </label>
                <textarea
                  value={letterParagraphsText}
                  onChange={(e) => updateLetterContent(e.target.value)}
                  placeholder="Escribe aquí tu mensaje especial..."
                  className="w-full p-4 rounded-xl bg-slate-800 border border-slate-700 text-white font-serif italic text-base min-h-[200px]"
                />
              </div>
            </div>
          )}

          {/* Tab 5: Photos */}
          {activeTab === 'photos' && (() => {
            // URL of the hero cover photo & main video — exclude them from gallery
            const heroCoverUrl = sections.find((s) => s.section_type === 'hero')?.settings_json?.cover || '';
            const videoSecUrl = sections.find((s) => s.section_type === 'video')?.settings_json?.videoUrl || '';
            const galleryPhotos = media.filter(
              (m) =>
                (m.media_type === 'image' || m.media_type === 'video') &&
                m.public_url !== heroCoverUrl &&
                m.public_url !== videoSecUrl
            );
            return (
              <div className="space-y-6 bg-slate-900 p-6 rounded-3xl border border-slate-800">
                <div className="flex items-center justify-between">
                  <div>
                    <h2 className="text-xl font-bold text-white">Galería de Fotografías &amp; Minivideos</h2>
                    <p className="text-xs text-slate-400 mt-0.5">
                      Sube fotos o minivideos de máximo 2 segundos (estilo Live Photo). La foto de portada no aparece aquí.
                    </p>
                  </div>
                  <label className="cursor-pointer py-2.5 px-5 rounded-xl bg-pink-600 text-white text-xs font-bold shadow-lg flex items-center gap-1.5 hover:brightness-110 transition">
                    <Upload className="w-4 h-4" />
                    {uploading ? 'Subiendo…' : 'Subir fotos / minivideos (máx 2s)'}
                    <input
                      type="file"
                      accept="image/*,video/*"
                      multiple
                      onChange={(e) => handleFileUpload(e, 'photos')}
                      className="hidden"
                    />
                  </label>
                </div>

                <div className="p-4 rounded-2xl bg-slate-800/80 border border-slate-700/80 space-y-2">
                  <label className="block text-xs font-bold text-pink-400 uppercase tracking-wider">
                    Avance de las fotografías y minivideos en la historia pública
                  </label>
                  <div className="flex items-center gap-4">
                    <label className="flex items-center gap-2 text-sm text-slate-200 cursor-pointer">
                      <input
                        type="radio"
                        name="autoplay_mode"
                        checked={(photosSec?.settings_json?.autoplay_mode || 'auto_and_manual') === 'auto_and_manual'}
                        onChange={() => updateAutoplayMode('auto_and_manual')}
                        className="accent-pink-500"
                      />
                      <span>Automático y manual (Recomendado)</span>
                    </label>
                    <label className="flex items-center gap-2 text-sm text-slate-200 cursor-pointer">
                      <input
                        type="radio"
                        name="autoplay_mode"
                        checked={photosSec?.settings_json?.autoplay_mode === 'manual_only'}
                        onChange={() => updateAutoplayMode('manual_only')}
                        className="accent-pink-500"
                      />
                      <span>Solo manual</span>
                    </label>
                  </div>
                </div>

                {/* ─── LIVE REAL PREVIEW IN ADMIN PANEL ─── */}
                {galleryPhotos.length > 0 && (
                  <div className="space-y-2">
                    <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider">
                      Vista previa cinematográfica interactiva (mismo resultado público y exportable)
                    </label>
                    <div className="rounded-3xl overflow-hidden border border-slate-800 shadow-2xl bg-slate-950 min-h-[580px]">
                      <CinematicMemoryGallery
                        photos={galleryPhotos}
                        theme={THEMES[project.template_id as ThemeId] || THEMES.romantic_elegant}
                        autoplayMode={photosSec?.settings_json?.autoplay_mode || 'auto_and_manual'}
                        isAdminPreview={true}
                      />
                    </div>
                  </div>
                )}

                {galleryPhotos.length === 0 ? (
                  <div className="flex flex-col items-center justify-center py-14 gap-3 text-slate-500 border-2 border-dashed border-slate-700 rounded-2xl">
                    <Upload className="w-8 h-8" />
                    <p className="text-sm font-semibold">No hay recuerdos en la galería todavía</p>
                    <p className="text-xs">Pulsa «Subir fotos / minivideos» para agregar recuerdos (máx 2s)</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    <h3 className="text-sm font-bold text-slate-300 uppercase tracking-wider">
                      Gestión de Fotografías / Minivideos &amp; Textos Animados ({galleryPhotos.length} elementos)
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {galleryPhotos.map((item, idx) => {
                        const targetUrl = resolveMediaUrl(item.public_url || item.url || item.storage_path || item.media_url);
                        const isVideoItem = item.media_type === 'video' || /\.(mp4|webm|mov|m4v|ogv)$/i.test(targetUrl.split('?')[0]);

                        return (
                          <div
                            key={item.id}
                            className="relative group rounded-2xl overflow-hidden bg-slate-800 border border-slate-700 p-4 space-y-3"
                          >
                            <div className="flex items-center gap-3">
                              <div className="relative w-20 h-20 rounded-xl overflow-hidden bg-black flex-shrink-0 border border-slate-700">
                                {isVideoItem ? (
                                  <video
                                    src={targetUrl}
                                    autoPlay
                                    loop
                                    muted
                                    playsInline
                                    className={`w-full h-full object-cover ${item.is_bw ? 'filter grayscale' : ''}`}
                                  />
                                ) : (
                                  <img
                                    src={targetUrl}
                                    alt="Foto"
                                    className={`w-full h-full object-cover ${item.is_bw ? 'filter grayscale' : ''}`}
                                  />
                                )}
                                <span className="absolute top-1 left-1 bg-black/70 text-white text-[9px] font-mono px-1.5 py-0.5 rounded">
                                  #{idx + 1} {isVideoItem ? '🎥 2s' : ''}
                                </span>
                              </div>
                            <div className="flex-1 space-y-1.5">
                              <input
                                type="text"
                                value={item.title || ''}
                                onChange={(e) => {
                                  const val = e.target.value;
                                  setMedia((prev) => prev.map((m) => (m.id === item.id ? { ...m, title: val } : m)));
                                }}
                                placeholder="Título del recuerdo (ej: Viaje al sur)"
                                className="w-full p-2 text-xs font-bold rounded-lg bg-slate-900 border border-slate-700 text-white"
                              />
                              <input
                                type="text"
                                value={item.caption || ''}
                                onChange={(e) => {
                                  const val = e.target.value;
                                  setMedia((prev) => prev.map((m) => (m.id === item.id ? { ...m, caption: val } : m)));
                                }}
                                placeholder="Frase principal (animada por palabras)"
                                className="w-full p-2 text-xs rounded-lg bg-slate-900 border border-slate-700 text-white"
                              />
                            </div>
                          </div>

                          <div className="grid grid-cols-2 gap-2 text-xs">
                            <div>
                              <label className="block text-[10px] font-bold text-slate-400 mb-0.5">Fecha / Ubicación</label>
                              <input
                                type="text"
                                value={item.event_date || ''}
                                onChange={(e) => {
                                  const val = e.target.value;
                                  setMedia((prev) => prev.map((m) => (m.id === item.id ? { ...m, event_date: val } : m)));
                                }}
                                placeholder="Ej: Verano 2024"
                                className="w-full p-2 text-xs rounded-lg bg-slate-900 border border-slate-700 text-white font-mono"
                              />
                            </div>
                            <div>
                              <label className="block text-[10px] font-bold text-slate-400 mb-0.5">Posición de Texto</label>
                              <select
                                value={item.text_position || 'auto'}
                                onChange={(e) => {
                                  const val = e.target.value as any;
                                  setMedia((prev) => prev.map((m) => (m.id === item.id ? { ...m, text_position: val } : m)));
                                }}
                                className="w-full p-2 text-xs rounded-lg bg-slate-900 border border-slate-700 text-white"
                              >
                                <option value="auto">Auto (Inteligente)</option>
                                <option value="bottom">Abajo</option>
                                <option value="top">Arriba</option>
                                <option value="overlay">Superpuesto</option>
                              </select>
                            </div>
                          </div>

                          <div className="flex items-center justify-between pt-1 border-t border-slate-700/60">
                            <label className="flex items-center gap-2 text-xs text-slate-300 cursor-pointer">
                              <input
                                type="checkbox"
                                checked={!!item.is_bw}
                                onChange={(e) => {
                                  const val = e.target.checked;
                                  setMedia((prev) => prev.map((m) => (m.id === item.id ? { ...m, is_bw: val } : m)));
                                }}
                                className="accent-pink-500 rounded"
                              />
                              <span>Filtro Blanco y Negro</span>
                            </label>
                            <button
                              type="button"
                              onClick={() => handleDeleteMedia(item.id)}
                              className="py-1 px-3 rounded-lg bg-rose-600/30 hover:bg-rose-600 text-rose-300 hover:text-white text-xs font-semibold flex items-center gap-1 transition"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                              Eliminar foto
                            </button>
                          </div>
                        </div>
                      );
                    })}
                    </div>
                  </div>
                )}
              </div>
            );
          })()}

          {/* Tab 6: Video Especial */}
          {activeTab === 'video' && videoSec && (
            <div className="space-y-6 bg-slate-900 p-6 rounded-3xl border border-slate-800">
              <div>
                <h2 className="text-xl font-bold text-white">Video Especial &amp; Advertencia</h2>
                <p className="text-xs text-slate-400 mt-1">Configura el video, el mensaje previo y la advertencia dramática que aparecerá al pulsar el botón.</p>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-400 mb-1">Título de la Sección de Video</label>
                <input
                  type="text"
                  value={videoSec.title || ''}
                  onChange={(e) =>
                    setSections((prev) =>
                      prev.map((s) => (s.id === videoSec.id ? { ...s, title: e.target.value } : s))
                    )
                  }
                  placeholder="Ej: Un regalo especial en video"
                  className="w-full p-3 rounded-xl bg-slate-800 border border-slate-700 text-white"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-400 mb-1">
                  Mensaje Personalizado de Introducción (Tarjeta previa)
                </label>
                <textarea
                  value={videoSec.subtitle || ''}
                  onChange={(e) =>
                    setSections((prev) =>
                      prev.map((s) => (s.id === videoSec.id ? { ...s, subtitle: e.target.value } : s))
                    )
                  }
                  placeholder="Ej: Tengo una sorpresa guardada en video para ti. Presiona el botón para descubrirla."
                  className="w-full p-3 rounded-xl bg-slate-800 border border-slate-700 text-white min-h-[90px] font-serif italic"
                />
              </div>

              {/* Editable Warning Text Block */}
              <div className="p-4 rounded-2xl bg-amber-950/30 border border-amber-500/30 space-y-2">
                <div className="flex items-center gap-2 text-amber-400 font-bold text-xs">
                  <AlertTriangle className="w-4 h-4" />
                  <span>Texto de Advertencia (Ventana emergente)</span>
                </div>
                <textarea
                  value={
                    videoSec.settings_json?.warningText ||
                    '⚠️ ADVERTENCIA: Video no apto para cardíacos ni personas propensas a llorar de emoción... ¿Deseas continuar?'
                  }
                  onChange={(e) =>
                    setSections((prev) =>
                      prev.map((s) =>
                        s.id === videoSec.id
                          ? { ...s, settings_json: { ...s.settings_json, warningText: e.target.value } }
                          : s
                      )
                    )
                  }
                  placeholder="Ej: ⚠️ ADVERTENCIA: Video no apto para cardíacos..."
                  className="w-full p-3 rounded-xl bg-slate-900 border border-amber-500/30 text-amber-200 text-xs font-serif italic min-h-[80px]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-400 mb-1">Texto del Botón de Apertura de Video</label>
                <input
                  type="text"
                  value={videoSec.settings_json?.buttonText || 'Pulsa aquí para ver el video ✨'}
                  onChange={(e) =>
                    setSections((prev) =>
                      prev.map((s) =>
                        s.id === videoSec.id
                          ? { ...s, settings_json: { ...s.settings_json, buttonText: e.target.value } }
                          : s
                      )
                    )
                  }
                  className="w-full p-3 rounded-xl bg-slate-800 border border-slate-700 text-white"
                />
              </div>

              <div className="space-y-3 pt-2">
                <label className="block text-xs font-bold text-slate-400">Archivo de Video (MP4, WebM o MOV)</label>

                {videoSec.settings_json?.videoUrl ? (
                  <div className="p-4 rounded-2xl bg-slate-800 border border-slate-700 space-y-3">
                    <span className="text-xs text-emerald-400 font-bold">✓ Video cargado exitosamente</span>
                    <video src={videoSec.settings_json.videoUrl} controls className="w-full max-h-64 rounded-xl bg-black" />
                  </div>
                ) : (
                  <div className="p-6 text-center rounded-2xl border-2 border-dashed border-slate-800 text-slate-500">
                    Aún no has subido ningún video para este regalo.
                  </div>
                )}

                  <div className="flex flex-wrap items-center gap-3 pt-2">
                    <label className="cursor-pointer inline-flex items-center gap-2 py-3 px-6 rounded-xl bg-gradient-to-r from-pink-500 to-rose-500 text-white text-sm font-bold shadow-lg hover:brightness-110 transition">
                      <Film className="w-5 h-5" />
                      {uploading ? 'Subiendo video…' : 'Seleccionar o Reemplazar Video'}
                      <input
                        type="file"
                        accept="video/mp4,video/webm,video/quicktime"
                        onChange={(e) => handleFileUpload(e, 'video')}
                        className="hidden"
                      />
                    </label>

                    {videoSec.settings_json?.videoUrl && (
                      <button
                        type="button"
                        onClick={() => {
                          if (window.confirm('¿Deseas quitar el video principal de esta sección?')) {
                            setSections((prev) =>
                              prev.map((s) =>
                                s.id === videoSec.id
                                  ? { ...s, settings_json: { ...s.settings_json, videoUrl: '' } }
                                  : s
                              )
                            );
                          }
                        }}
                        className="py-3 px-4 rounded-xl bg-rose-600/30 hover:bg-rose-600 text-rose-300 hover:text-white text-xs font-bold transition flex items-center gap-1.5 cursor-pointer"
                      >
                        <Trash2 className="w-4 h-4" />
                        Quitar Video Principal
                      </button>
                    )}

                  {videoSec.settings_json?.videoUrl && (
                    <>
                      <a
                        href={`${API_BASE}/projects/${project.id}/video/download?type=original`}
                        download
                        className="py-3 px-4 rounded-xl bg-slate-800 hover:bg-slate-700 text-white text-xs font-bold border border-slate-700 flex items-center gap-1.5 transition"
                      >
                        <Download className="w-4 h-4 text-pink-400" />
                        Descargar Original
                      </a>
                      <a
                        href={`${API_BASE}/projects/${project.id}/video/download?type=optimized`}
                        download
                        className="py-3 px-4 rounded-xl bg-slate-800 hover:bg-slate-700 text-white text-xs font-bold border border-slate-700 flex items-center gap-1.5 transition"
                      >
                        <Download className="w-4 h-4 text-pink-400" />
                        Descargar Optimizada (MP4 H.264)
                      </a>
                    </>
                  )}
                </div>

                <div className="p-4 rounded-2xl bg-slate-800/80 border border-slate-700/80 mt-4 flex items-center justify-between">
                  <div>
                    <label className="block text-xs font-bold text-white">Permitir que el destinatario descargue este video</label>
                    <p className="text-[11px] text-slate-400">Al activar esta opción, aparecerá un botón «Descargar este video» en la página pública.</p>
                  </div>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={project.allow_public_video_download !== false}
                      onChange={(e) => setProject({ ...project, allow_public_video_download: e.target.checked })}
                      className="w-5 h-5 accent-pink-500 rounded cursor-pointer"
                    />
                    <span className="text-xs font-bold text-pink-400">
                      {project.allow_public_video_download !== false ? 'Activado (Público)' : 'Desactivado'}
                    </span>
                  </label>
                </div>
              </div>
            </div>
          )}

          {/* Tab 8: Export Complete Experience */}
          {activeTab === 'export' && (
            <div className="space-y-6 bg-slate-900 p-6 rounded-3xl border border-slate-800">
              <div>
                <h2 className="text-xl font-bold text-white">🎬 Exportar Video Completo de la Experiencia (MP4)</h2>
                <p className="text-xs text-slate-400 mt-1">
                  Genera un video en alta definición listo para publicar en Instagram Reels, TikTok, YouTube Shorts y WhatsApp.
                </p>
              </div>

              {/* Profiles & Format Selector */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-400 mb-1">Formato de Video</label>
                  <select
                    value={exportFormat}
                    onChange={(e) => setExportFormat(e.target.value as any)}
                    className="w-full p-3 rounded-xl bg-slate-800 border border-slate-700 text-white text-xs font-bold"
                  >
                    <option value="9:16">Vertical 9:16 (1080×1920 - Reels / TikTok / Shorts)</option>
                    <option value="4:5">Vertical 4:5 (1080×1350 - Feed Instagram / Facebook)</option>
                    <option value="1:1">Cuadrado 1:1 (1080×1080 - Post)</option>
                    <option value="16:9">Horizontal 16:9 (1920×1080 - YouTube / TV)</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-400 mb-1">Perfil de Duración</label>
                  <select
                    value={exportProfile}
                    onChange={(e) => setExportProfile(e.target.value as any)}
                    className="w-full p-3 rounded-xl bg-slate-800 border border-slate-700 text-white text-xs font-bold"
                  >
                    <option value="full_experience">Experiencia Completa (Automática)</option>
                    <option value="reel_social">Reel Redes Sociales (30 a 60 seg)</option>
                    <option value="reel_short">Reel Breve (15 seg)</option>
                  </select>
                </div>
              </div>

              {/* Audio & Ducking Controls */}
              <div className="p-4 rounded-2xl bg-slate-800/80 border border-slate-700 space-y-4">
                <div className="flex items-center gap-2 text-pink-400 font-bold text-xs uppercase tracking-wider">
                  <Music className="w-4 h-4" />
                  <span>Música de Fondo &amp; Mezcla Automática de Voz</span>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[11px] font-bold text-slate-400 mb-1">Volumen Música de Fondo ({Math.round(exportMusicVolume * 100)}%)</label>
                    <input
                      type="range"
                      min="0"
                      max="1"
                      step="0.05"
                      value={exportMusicVolume}
                      onChange={(e) => setExportMusicVolume(parseFloat(e.target.value))}
                      className="w-full accent-pink-500"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-bold text-slate-400 mb-1">Volumen Video / Voz ({Math.round(exportVideoVolume * 100)}%)</label>
                    <input
                      type="range"
                      min="0"
                      max="1"
                      step="0.05"
                      value={exportVideoVolume}
                      onChange={(e) => setExportVideoVolume(parseFloat(e.target.value))}
                      className="w-full accent-pink-500"
                    />
                  </div>
                </div>

                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={exportAutoDucking}
                    onChange={(e) => setExportAutoDucking(e.target.checked)}
                    className="accent-pink-500 rounded"
                  />
                  <span className="text-xs text-slate-200 font-semibold">Reducir automáticamente la música (al 10%) cuando haya voz en el video</span>
                </label>
              </div>

              {/* Rights Agreement */}
              <label className="flex items-center gap-2 cursor-pointer p-3 rounded-xl bg-slate-800/40 border border-slate-700/60">
                <input
                  type="checkbox"
                  checked={exportRightsAgreed}
                  onChange={(e) => setExportRightsAgreed(e.target.checked)}
                  className="accent-pink-500 rounded"
                />
                <span className="text-xs text-slate-300">Confirma que tienes autorización para utilizar la pista o audio incorporado en este video.</span>
              </label>

              {/* Action Button */}
              <button
                type="button"
                onClick={handleStartExport}
                disabled={isExporting}
                className="w-full py-4 rounded-2xl bg-gradient-to-r from-pink-500 via-rose-500 to-amber-500 text-white font-bold text-sm shadow-xl hover:brightness-110 active:scale-95 transition flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
              >
                {isExporting ? <Loader2 className="w-5 h-5 animate-spin" /> : <Film className="w-5 h-5" />}
                {isExporting ? 'Procesando exportación…' : '⚡ Generar Video Completo MP4 para Redes'}
              </button>

              {/* Exports History Table */}
              <div className="space-y-3 pt-4 border-t border-slate-800">
                <h3 className="text-sm font-bold text-slate-300 uppercase tracking-wider">Historial de Exportaciones del Regalo</h3>
                {exportsList.length === 0 ? (
                  <p className="text-xs text-slate-500">No hay videos exportados aún.</p>
                ) : (
                  <div className="space-y-3">
                    {exportsList.map((job) => (
                      <div key={job.id} className="p-4 rounded-2xl bg-slate-800 border border-slate-700 flex items-center justify-between gap-4">
                        <div className="space-y-1">
                          <div className="flex items-center gap-2">
                            <span className="px-2 py-0.5 rounded bg-pink-500/20 text-pink-400 font-mono text-[10px] font-bold uppercase">{job.format}</span>
                            <span className="text-xs font-bold text-white">{job.resolution || '1080x1920'}</span>
                            <span className={`text-[10px] font-bold px-2 py-0.5 rounded ${job.status === 'completed' ? 'bg-emerald-500/20 text-emerald-400' : 'bg-amber-500/20 text-amber-300'}`}>
                              {job.status === 'completed' ? '✓ Listo (100%)' : `${job.status} (${job.progress_percent || 0}%)`}
                            </span>
                          </div>
                          <p className="text-[11px] text-slate-400 font-mono">{new Date(job.created_at).toLocaleString()}</p>
                        </div>

                        <div className="flex items-center gap-2">
                          {job.status === 'completed' && job.output_url && (
                            <a
                              href={`${API_BASE}/projects/${project.id}/exports/${job.id}/download`}
                              download
                              className="py-2 px-3.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs shadow flex items-center gap-1.5 transition"
                            >
                              <Download className="w-3.5 h-3.5" />
                              Descargar MP4
                            </a>
                          )}
                          <button
                            type="button"
                            onClick={() => handleDeleteExportJob(job.id)}
                            className="p-2 rounded-xl bg-rose-600/20 text-rose-400 hover:bg-rose-600 hover:text-white transition"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Tab 7: Final */}
          {activeTab === 'final' && finalSec && (
            <div className="space-y-6 bg-slate-900 p-6 rounded-3xl border border-slate-800">
              <h2 className="text-xl font-bold text-white">Mensaje de Cierre y Despedida</h2>
              <div>
                <label className="block text-xs font-bold text-slate-400 mb-1">Título del Cierre</label>
                <input
                  type="text"
                  value={finalSec.title || ''}
                  onChange={(e) =>
                    setSections((prev) =>
                      prev.map((s) => (s.id === finalSec.id ? { ...s, title: e.target.value } : s))
                    )
                  }
                  className="w-full p-3 rounded-xl bg-slate-800 border border-slate-700 text-white"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-400 mb-1">Mensaje o Frase Final</label>
                <textarea
                  value={finalSec.subtitle || ''}
                  onChange={(e) =>
                    setSections((prev) =>
                      prev.map((s) => (s.id === finalSec.id ? { ...s, subtitle: e.target.value } : s))
                    )
                  }
                  className="w-full p-3 rounded-xl bg-slate-800 border border-slate-700 text-white min-h-[100px]"
                />
              </div>
            </div>
          )}

          {/* Tab 10: QR & PDF Imprimible */}
          {activeTab === 'qr' && (
            <div className="space-y-8 bg-slate-900 p-6 sm:p-8 rounded-3xl border border-slate-800">
              <div>
                <h2 className="text-xl font-bold text-white flex items-center gap-2">
                  <QrCode className="w-5 h-5 text-pink-500" />
                  Código QR &amp; Tarjeta de Presentación Imprimible
                </h2>
                <p className="text-xs text-slate-400 mt-1">
                  Genera la tarjeta física de 9x9 cm para impresión de alta calidad o descarga el código QR digital personalizado.
                </p>
              </div>

              {/* 1. Tarjeta de Presentación Imprimible (9x9 cm) */}
              <div className="space-y-6">
                {/* Mode Switcher */}
                <div className="flex items-center justify-between bg-slate-950 p-2 rounded-2xl border border-slate-800">
                  <span className="text-xs font-bold text-slate-300 px-3 flex items-center gap-2">
                    <Sparkles className="w-4 h-4 text-pink-400" />
                    Modo de Diseño de la Tarjeta:
                  </span>
                  <div className="flex gap-2">
                    <button
                      onClick={() => setEditorCardMode('canva')}
                      className={`px-4 py-2 rounded-xl text-xs font-bold transition flex items-center gap-2 cursor-pointer ${
                        editorCardMode === 'canva'
                          ? 'bg-gradient-to-r from-pink-500 to-rose-500 text-white shadow-lg'
                          : 'bg-slate-900 text-slate-400 hover:text-white'
                      }`}
                    >
                      <Move className="w-3.5 h-3.5" />
                      🖐️ Edición Libre Canva (Drag &amp; Drop)
                    </button>
                    <button
                      onClick={() => setEditorCardMode('preset')}
                      className={`px-4 py-2 rounded-xl text-xs font-bold transition flex items-center gap-2 cursor-pointer ${
                        editorCardMode === 'preset'
                          ? 'bg-gradient-to-r from-pink-500 to-rose-500 text-white shadow-lg'
                          : 'bg-slate-900 text-slate-400 hover:text-white'
                      }`}
                    >
                      <Layout className="w-3.5 h-3.5" />
                      📐 Plantillas Automáticas
                    </button>
                  </div>
                </div>

                {/* Style Selector */}
                <div className="space-y-3">
                  <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center gap-2">
                    <Palette className="w-4 h-4 text-pink-400" />
                    Paleta &amp; Estilo Elegante
                  </label>

                  <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
                    {CARD_STYLES.map((style) => (
                      <button
                        key={style.id}
                        onClick={() => setEditorCardStyleId(style.id)}
                        className={`p-3 rounded-2xl border text-left transition relative overflow-hidden flex flex-col justify-between h-24 cursor-pointer ${
                          editorCardStyleId === style.id
                            ? 'border-pink-500 ring-2 ring-pink-500/50 shadow-xl scale-[1.02]'
                            : 'border-slate-800 hover:border-slate-700 opacity-80 hover:opacity-100'
                        }`}
                        style={{ background: style.bgStyle }}
                      >
                        <div className="flex items-center justify-between">
                          <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded border ${style.badgeBg}`}>
                            {style.tag}
                          </span>
                          {editorCardStyleId === style.id && (
                            <div className="w-4 h-4 rounded-full bg-pink-500 text-white flex items-center justify-center">
                              <Check className="w-3 h-3" />
                            </div>
                          )}
                        </div>

                        <div>
                          <span className="block text-xs font-bold truncate" style={{ color: style.namesColor }}>
                            {style.name}
                          </span>
                          <div className="flex items-center gap-1 mt-1">
                            <span className="w-2.5 h-2.5 rounded-full border border-white/20" style={{ backgroundColor: style.borderColor }} />
                            <span className="w-2.5 h-2.5 rounded-full border border-white/20" style={{ backgroundColor: style.kickerColor }} />
                          </div>
                        </div>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Live Card Mockup & Customization Inputs */}
                {(() => {
                  const currentTheme = CARD_STYLES.find((s) => s.id === editorCardStyleId) || CARD_STYLES[0];
                  const currentFont = FONT_OPTIONS.find((f) => f.id === editorCardFontFamily) || FONT_OPTIONS[0];

                  const currentPdfUrl = getPrintableCardUrl(project.id, project.slug, {
                    styleId: editorCardStyleId,
                    kicker: editorCardKicker,
                    message: editorCardMessage,
                    names: editorCardNames || `${project.sender_name || 'Remitente'} & ${project.recipient_name || 'Destinatario'}`,
                    qrPosition: editorCardQrPosition,
                    fontFamily: editorCardFontFamily,
                    titleSize: editorCardTitleSize,
                    qrSize: editorCardQrSize,
                    borderStyle: editorCardBorderStyle,
                    canvasData: editorCardMode === 'canva' ? editorCardCanvasConfig : undefined,
                  });

                  const currentQrUrl = getQrCodeUrl(project.id, 'png', currentTheme.qrDark, currentTheme.qrLight, project.slug);

                  if (editorCardMode === 'canva') {
                    return (
                      <div className="bg-slate-950/70 p-6 rounded-3xl border border-slate-800 space-y-4">
                        <CardCanvasEditor
                          selectedTheme={currentTheme}
                          selectedFont={currentFont}
                          kickerText={editorCardKicker || 'HECHO ESPECIALMENTE PARA'}
                          namesText={editorCardNames || `${project.sender_name || 'Remitente'} & ${project.recipient_name || 'Destinatario'}`}
                          messageText={editorCardMessage || 'Escanea este código...'}
                          pngQrUrl={currentQrUrl}
                          config={editorCardCanvasConfig}
                          onChange={(newCfg) => setEditorCardCanvasConfig(newCfg)}
                        />

                        <div className="pt-2 flex flex-col sm:flex-row gap-3">
                          <a
                            href={currentPdfUrl}
                            target="_blank"
                            rel="noreferrer"
                            className="flex-1 inline-flex items-center justify-center gap-2 py-3.5 px-6 rounded-xl bg-gradient-to-r from-pink-500 to-rose-500 font-bold text-white text-sm shadow-xl hover:brightness-110 active:scale-95 transition"
                          >
                            <Download className="w-4 h-4" />
                            Descargar Tarjeta PDF Personalizada (9x9 cm)
                          </a>
                          <a
                            href={currentPdfUrl}
                            target="_blank"
                            rel="noreferrer"
                            className="inline-flex items-center justify-center gap-2 py-3.5 px-5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-semibold text-sm transition"
                          >
                            <Printer className="w-4 h-4" />
                            Imprimir
                          </a>
                        </div>
                      </div>
                    );
                  }

                  let nameSizeClass = 'text-lg';
                  if (editorCardTitleSize === 'small') nameSizeClass = 'text-sm';
                  if (editorCardTitleSize === 'large') nameSizeClass = 'text-xl sm:text-2xl';

                  let qrSizeClass = 'w-20 h-20';
                  if (editorCardQrSize === 'small') qrSizeClass = 'w-16 h-16';
                  if (editorCardQrSize === 'large') qrSizeClass = 'w-24 h-24 sm:w-28 sm:h-28';

                  const namesText = editorCardNames || `${project.sender_name || 'Remitente'} & ${project.recipient_name || 'Destinatario'}`;

                  return (
                    <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-start bg-slate-950/60 p-6 rounded-2xl border border-slate-800">
                      {/* Physical Card Mockup */}
                      <div className="md:col-span-6 flex flex-col items-center justify-center space-y-3">
                        <div
                          className="relative w-80 h-80 rounded-2xl p-5 shadow-2xl flex flex-col justify-between overflow-hidden border transition-all duration-500"
                          style={{
                            background: currentTheme.bgStyle,
                            borderColor: editorCardBorderStyle === 'no_border' ? 'transparent' : currentTheme.borderColor,
                            boxShadow: `0 25px 60px rgba(0,0,0,0.65), inset 0 0 0 1px ${currentTheme.innerBorderColor}`,
                          }}
                        >
                          {editorCardBorderStyle !== 'no_border' && (
                            <div
                              className="absolute inset-2.5 pointer-events-none rounded-xl border"
                              style={{ borderColor: currentTheme.innerBorderColor }}
                            />
                          )}

                          {editorCardBorderStyle !== 'no_border' && (
                            <>
                              <div className="absolute top-2 left-2 w-1.5 h-1.5 rotate-45" style={{ backgroundColor: currentTheme.borderColor }} />
                              <div className="absolute top-2 right-2 w-1.5 h-1.5 rotate-45" style={{ backgroundColor: currentTheme.borderColor }} />
                              <div className="absolute bottom-2 left-2 w-1.5 h-1.5 rotate-45" style={{ backgroundColor: currentTheme.borderColor }} />
                              <div className="absolute bottom-2 right-2 w-1.5 h-1.5 rotate-45" style={{ backgroundColor: currentTheme.borderColor }} />
                            </>
                          )}

                          {/* DYNAMIC POSITIONS IN EDITOR MOCKUP */}
                          {editorCardQrPosition === 'center_large' ? (
                            <div className="flex flex-col items-center justify-between h-full z-10 text-center">
                              <div className="space-y-1">
                                <span className="block uppercase text-[8.5px] tracking-widest font-bold" style={{ color: currentTheme.kickerColor }}>
                                  {editorCardKicker || 'HECHO ESPECIALMENTE PARA'}
                                </span>
                                <h4 className={`font-bold leading-tight ${nameSizeClass} ${currentFont.class}`} style={{ color: currentTheme.namesColor }}>
                                  {namesText}
                                </h4>
                              </div>

                              <div className={`${qrSizeClass} bg-white p-1 rounded-xl shadow-inner flex items-center justify-center my-2 border`} style={{ borderColor: currentTheme.borderColor }}>
                                <img src={currentQrUrl} alt="Código QR Tarjeta" className="w-full h-full object-contain" />
                              </div>

                              <p className="text-[10px] leading-snug font-serif italic max-w-[90%]" style={{ color: currentTheme.messageColor }}>
                                {editorCardMessage || 'Escanea este código con la cámara de tu teléfono y descubre un recuerdo preparado con mucho amor.'}
                              </p>
                            </div>
                          ) : editorCardQrPosition === 'bottom_center' ? (
                            <div className="flex flex-col items-center justify-between h-full z-10 text-center">
                              <div className="space-y-1">
                                <span className="block uppercase text-[8.5px] tracking-widest font-bold" style={{ color: currentTheme.kickerColor }}>
                                  {editorCardKicker || 'HECHO ESPECIALMENTE PARA'}
                                </span>
                                <h4 className={`font-bold leading-tight ${nameSizeClass} ${currentFont.class}`} style={{ color: currentTheme.namesColor }}>
                                  {namesText}
                                </h4>
                                <p className="text-[10px] leading-snug font-serif italic max-w-[90%] pt-1" style={{ color: currentTheme.messageColor }}>
                                  {editorCardMessage || 'Escanea este código con la cámara de tu teléfono y descubre un recuerdo preparado con mucho amor.'}
                                </p>
                              </div>

                              <div className={`${qrSizeClass} bg-white p-1 rounded-xl shadow-inner flex items-center justify-center border`} style={{ borderColor: currentTheme.borderColor }}>
                                <img src={currentQrUrl} alt="Código QR Tarjeta" className="w-full h-full object-contain" />
                              </div>
                            </div>
                          ) : editorCardQrPosition === 'top_right' ? (
                            <div className="flex flex-col justify-between h-full z-10">
                              <div className="flex items-start justify-between gap-3">
                                <div className="space-y-1 flex-1">
                                  <span className="block uppercase text-[8.5px] tracking-widest font-bold" style={{ color: currentTheme.kickerColor }}>
                                    {editorCardKicker || 'HECHO ESPECIALMENTE PARA'}
                                  </span>
                                  <h4 className={`font-bold leading-tight ${nameSizeClass} ${currentFont.class}`} style={{ color: currentTheme.namesColor }}>
                                    {namesText}
                                  </h4>
                                </div>
                                <div className={`${qrSizeClass} bg-white p-1 rounded-xl shadow-inner flex items-center justify-center flex-shrink-0 border`} style={{ borderColor: currentTheme.borderColor }}>
                                  <img src={currentQrUrl} alt="Código QR Tarjeta" className="w-full h-full object-contain" />
                                </div>
                              </div>

                              <p className="text-[10px] leading-snug font-serif italic pt-2" style={{ color: currentTheme.messageColor }}>
                                {editorCardMessage || 'Escanea este código con la cámara de tu teléfono y descubre un recuerdo preparado con mucho amor.'}
                              </p>
                            </div>
                          ) : editorCardQrPosition === 'left_split' ? (
                            <div className="flex items-center gap-4 h-full z-10">
                              <div className={`${qrSizeClass} bg-white p-1 rounded-xl shadow-inner flex items-center justify-center flex-shrink-0 border`} style={{ borderColor: currentTheme.borderColor }}>
                                <img src={currentQrUrl} alt="Código QR Tarjeta" className="w-full h-full object-contain" />
                              </div>
                              <div className="space-y-2 flex-1">
                                <span className="block uppercase text-[8.5px] tracking-widest font-bold" style={{ color: currentTheme.kickerColor }}>
                                  {editorCardKicker || 'HECHO ESPECIALMENTE PARA'}
                                </span>
                                <h4 className={`font-bold leading-tight ${nameSizeClass} ${currentFont.class}`} style={{ color: currentTheme.namesColor }}>
                                  {namesText}
                                </h4>
                                <p className="text-[10px] leading-snug font-serif italic" style={{ color: currentTheme.messageColor }}>
                                  {editorCardMessage || 'Escanea este código con la cámara de tu teléfono y descubre un recuerdo preparado con mucho amor.'}
                                </p>
                              </div>
                            </div>
                          ) : (
                            /* Standard bottom_right */
                            <div className="flex flex-col justify-between h-full z-10">
                              <div className="space-y-1">
                                <span className="block uppercase text-[8.5px] tracking-widest font-bold" style={{ color: currentTheme.kickerColor }}>
                                  {editorCardKicker || 'HECHO ESPECIALMENTE PARA'}
                                </span>
                                <h4 className={`font-bold leading-tight ${nameSizeClass} ${currentFont.class}`} style={{ color: currentTheme.namesColor }}>
                                  {namesText}
                                </h4>
                              </div>

                              <div className="flex items-center gap-3">
                                <p className="text-[10px] leading-snug font-serif italic flex-1" style={{ color: currentTheme.messageColor }}>
                                  {editorCardMessage || 'Escanea este código con la cámara de tu teléfono y descubre un recuerdo preparado con mucho amor.'}
                                </p>
                                <div className={`${qrSizeClass} bg-white p-1 rounded-xl shadow-inner flex items-center justify-center flex-shrink-0 border`} style={{ borderColor: currentTheme.borderColor }}>
                                  <img src={currentQrUrl} alt="Código QR Tarjeta" className="w-full h-full object-contain" />
                                </div>
                              </div>
                            </div>
                          )}
                        </div>

                        <span className="text-[11px] text-slate-500 font-mono">
                          Escala física real: 9 x 9 cm (300 DPI Vectorial PDF)
                        </span>
                      </div>

                      {/* Controls Column */}
                      <div className="md:col-span-6 space-y-5">
                        {/* 1. Position Selector */}
                        <div>
                          <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                            <Layout className="w-4 h-4 text-pink-400" />
                            Disposición &amp; Posición del QR
                          </label>
                          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                            {QR_POSITIONS.map((pos) => (
                              <button
                                key={pos.id}
                                onClick={() => setEditorCardQrPosition(pos.id)}
                                className={`p-2 rounded-xl border text-left transition cursor-pointer ${
                                  editorCardQrPosition === pos.id
                                    ? 'border-pink-500 bg-pink-500/10 text-white font-bold'
                                    : 'border-slate-800 bg-slate-900 text-slate-400 hover:text-slate-200'
                                }`}
                              >
                                <span className="block text-xs">{pos.name}</span>
                                <span className="block text-[9px] text-slate-500 font-normal">{pos.desc}</span>
                              </button>
                            ))}
                          </div>
                        </div>

                        {/* 2. Typography Selector */}
                        <div>
                          <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                            <Type className="w-4 h-4 text-pink-400" />
                            Fuente Tipográfica
                          </label>
                          <select
                            value={editorCardFontFamily}
                            onChange={(e) => setEditorCardFontFamily(e.target.value)}
                            className="w-full p-2.5 rounded-xl bg-slate-900 border border-slate-700 text-white text-xs font-semibold"
                          >
                            {FONT_OPTIONS.map((f) => (
                              <option key={f.id} value={f.id}>
                                {f.name}
                              </option>
                            ))}
                          </select>
                        </div>

                        {/* 3. Sizes */}
                        <div className="grid grid-cols-2 gap-3">
                          <div>
                            <label className="block text-xs font-semibold text-slate-400 mb-1.5 flex items-center gap-1">
                              <Maximize2 className="w-3.5 h-3.5" /> Tamaño del Título
                            </label>
                            <div className="flex rounded-xl bg-slate-900 border border-slate-700 p-1 gap-1">
                              {['small', 'medium', 'large'].map((s) => (
                                <button
                                  key={s}
                                  onClick={() => setEditorCardTitleSize(s)}
                                  className={`flex-1 py-1 text-[10px] font-bold uppercase rounded-lg transition cursor-pointer ${
                                    editorCardTitleSize === s ? 'bg-pink-600 text-white shadow' : 'text-slate-400 hover:text-white'
                                  }`}
                                >
                                  {s === 'small' ? 'Pequ' : s === 'medium' ? 'Med' : 'Gran'}
                                </button>
                              ))}
                            </div>
                          </div>

                          <div>
                            <label className="block text-xs font-semibold text-slate-400 mb-1.5 flex items-center gap-1">
                              <QrCode className="w-3.5 h-3.5" /> Tamaño del QR
                            </label>
                            <div className="flex rounded-xl bg-slate-900 border border-slate-700 p-1 gap-1">
                              {['small', 'medium', 'large'].map((s) => (
                                <button
                                  key={s}
                                  onClick={() => setEditorCardQrSize(s)}
                                  className={`flex-1 py-1 text-[10px] font-bold uppercase rounded-lg transition cursor-pointer ${
                                    editorCardQrSize === s ? 'bg-pink-600 text-white shadow' : 'text-slate-400 hover:text-white'
                                  }`}
                                >
                                  {s === 'small' ? '2.5cm' : s === 'medium' ? '3.2cm' : '4.0cm'}
                                </button>
                              ))}
                            </div>
                          </div>
                        </div>

                        {/* 4. Text Form */}
                        <div className="space-y-3 pt-1">
                          <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
                            <Edit3 className="w-4 h-4 text-pink-400" />
                            Contenidos Editables
                          </label>

                          <div className="grid grid-cols-2 gap-3">
                            <div>
                              <label className="block text-[11px] text-slate-400 mb-1">Encabezado</label>
                              <input
                                type="text"
                                value={editorCardKicker}
                                onChange={(e) => setEditorCardKicker(e.target.value)}
                                className="w-full p-2 rounded-xl bg-slate-900 border border-slate-700 text-white text-xs font-semibold"
                              />
                            </div>
                            <div>
                              <label className="block text-[11px] text-slate-400 mb-1">Nombres</label>
                              <input
                                type="text"
                                value={editorCardNames}
                                onChange={(e) => setEditorCardNames(e.target.value)}
                                className="w-full p-2 rounded-xl bg-slate-900 border border-slate-700 text-white text-xs font-semibold"
                              />
                            </div>
                          </div>

                          <div>
                            <label className="block text-[11px] text-slate-400 mb-1">Mensaje Escáner</label>
                            <textarea
                              value={editorCardMessage}
                              onChange={(e) => setEditorCardMessage(e.target.value)}
                              rows={2}
                              className="w-full p-2 rounded-xl bg-slate-900 border border-slate-700 text-white text-xs font-serif italic"
                            />
                          </div>
                        </div>

                        {/* Download Actions */}
                        <div className="flex flex-wrap gap-3 pt-2">
                          <a
                            href={currentPdfUrl}
                            target="_blank"
                            rel="noreferrer"
                            className="flex-1 inline-flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-gradient-to-r from-pink-500 to-rose-500 font-bold text-white text-xs shadow-lg hover:brightness-110 active:scale-95 transition"
                          >
                            <Download className="w-4 h-4" />
                            Descargar Tarjeta PDF (9x9 cm)
                          </a>
                          <a
                            href={currentPdfUrl}
                            target="_blank"
                            rel="noreferrer"
                            className="inline-flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-semibold text-xs transition"
                          >
                            <Printer className="w-4 h-4" />
                            Imprimir
                          </a>
                        </div>
                      </div>
                    </div>
                  );
                })()}
              </div>

              {/* 2. Personalizador & Descargas de Código QR */}
              <div className="space-y-4">
                <h3 className="text-sm font-bold text-slate-300 uppercase tracking-wider flex items-center gap-2">
                  <QrCode className="w-4 h-4 text-pink-400" />
                  2. Código QR Digital Personalizado
                </h3>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 bg-slate-950/60 p-6 rounded-2xl border border-slate-800">
                  {/* Live QR Image Box */}
                  <div className="flex flex-col items-center justify-center p-6 bg-slate-900 rounded-2xl border border-slate-800 space-y-4">
                    <div className="p-4 rounded-2xl shadow-xl transition-all" style={{ backgroundColor: editorQrBgColor }}>
                      <img
                        src={getQrCodeUrl(project.id, 'png', editorQrColor, editorQrBgColor)}
                        alt="Vista previa QR"
                        className="w-48 h-48 object-contain"
                      />
                    </div>
                    <div className="text-center space-y-1 max-w-full">
                      <span className="text-xs text-slate-400 font-mono block truncate px-2">
                        {getPublicGiftUrl(project.slug)}
                      </span>
                    </div>
                  </div>

                  {/* Customizer Controls */}
                  <div className="space-y-5 flex flex-col justify-between">
                    <div className="space-y-4">
                      {/* Dark Color Picker */}
                      <div>
                        <label className="block text-xs font-semibold text-slate-400 mb-1.5">
                          Color del Código
                        </label>
                        <div className="flex items-center gap-3">
                          <input
                            type="color"
                            value={editorQrColor}
                            onChange={(e) => setEditorQrColor(e.target.value)}
                            className="w-10 h-10 rounded-xl bg-slate-800 border border-slate-700 cursor-pointer p-1"
                          />
                          <div className="flex gap-1.5 flex-wrap">
                            {['#e83482', '#27000f', '#000000', '#6366f1', '#10b981', '#f59e0b'].map((c) => (
                              <button
                                key={c}
                                onClick={() => setEditorQrColor(c)}
                                className={`w-6 h-6 rounded-full border-2 transition ${
                                  editorQrColor === c ? 'border-pink-500 scale-110' : 'border-transparent opacity-80 hover:opacity-100'
                                }`}
                                style={{ backgroundColor: c }}
                              />
                            ))}
                          </div>
                        </div>
                      </div>

                      {/* Background Color Picker */}
                      <div>
                        <label className="block text-xs font-semibold text-slate-400 mb-1.5">
                          Color de Fondo
                        </label>
                        <div className="flex items-center gap-3">
                          <input
                            type="color"
                            value={editorQrBgColor}
                            onChange={(e) => setEditorQrBgColor(e.target.value)}
                            className="w-10 h-10 rounded-xl bg-slate-800 border border-slate-700 cursor-pointer p-1"
                          />
                          <div className="flex gap-1.5 flex-wrap">
                            {['#ffffff', '#fbcfe8', '#27000f', '#0f172a', '#18181b'].map((c) => (
                              <button
                                key={c}
                                onClick={() => setEditorQrBgColor(c)}
                                className={`w-6 h-6 rounded-full border-2 transition ${
                                  editorQrBgColor === c ? 'border-pink-500 scale-110' : 'border-transparent opacity-80 hover:opacity-100'
                                }`}
                                style={{ backgroundColor: c }}
                              />
                            ))}
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Copy Link Box */}
                    <div className="p-3 rounded-xl bg-slate-900 border border-slate-800 space-y-2">
                      <label className="block text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
                        Enlace Público Directo
                      </label>
                      <div className="flex items-center gap-2">
                        <input
                          type="text"
                          readOnly
                          value={getPublicGiftUrl(project.slug)}
                          className="flex-1 bg-slate-950 border border-slate-800 px-3 py-1.5 rounded-lg text-xs font-mono text-pink-300 focus:outline-none"
                        />
                        <button
                          onClick={() => {
                            navigator.clipboard.writeText(getPublicGiftUrl(project.slug));
                            setEditorQrCopied(true);
                            setTimeout(() => setEditorQrCopied(false), 2000);
                          }}
                          className="px-3 py-1.5 rounded-lg bg-pink-600/20 hover:bg-pink-600 text-pink-300 hover:text-white border border-pink-500/30 text-xs font-bold transition flex items-center gap-1"
                        >
                          {editorQrCopied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                          {editorQrCopied ? 'Copiado' : 'Copiar'}
                        </button>
                      </div>
                    </div>

                    {/* Buttons PNG & SVG */}
                    <div className="grid grid-cols-2 gap-3">
                      <a
                        href={getQrCodeUrl(project.id, 'png', editorQrColor, editorQrBgColor)}
                        download={`qr_${project.slug}.png`}
                        className="flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl bg-pink-600 text-white font-bold text-xs hover:bg-pink-500 shadow-md transition"
                      >
                        <Download className="w-3.5 h-3.5" />
                        Descargar PNG
                      </a>
                      <a
                        href={getQrCodeUrl(project.id, 'svg', editorQrColor, editorQrBgColor)}
                        download={`qr_${project.slug}.svg`}
                        className="flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl bg-slate-800 text-slate-200 font-bold text-xs hover:bg-slate-700 transition"
                      >
                        <Download className="w-3.5 h-3.5" />
                        Descargar SVG
                      </a>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </main>
      </div>

      {showQrModal && (
        <QrAndCardModal
          project={project}
          onClose={() => setShowQrModal(false)}
        />
      )}
    </div>
  );
};
