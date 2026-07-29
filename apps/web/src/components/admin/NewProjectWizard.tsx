import React, { useState, useMemo } from 'react';
import {
  RELATIONSHIP_OPTIONS,
  OCCASION_OPTIONS,
  TONE_OPTIONS,
  THEMES,
  ThemeId,
  RelationshipType,
  OccasionType,
  EmotionalTone,
  generateDefaultGiftPreset,
} from '@recuerdos-qr/shared';
import { createProject } from '../../services/api';
import {
  Heart,
  User,
  Users,
  Sparkles,
  Gift,
  ArrowRight,
  ArrowLeft,
  CheckCircle2,
  Smile,
  X,
} from 'lucide-react';

interface NewProjectWizardProps {
  onClose: () => void;
  onCreated: (project: any) => void;
}

export const NewProjectWizard: React.FC<NewProjectWizardProps> = ({ onClose, onCreated }) => {
  const [step, setStep] = useState(1);

  // Form State
  const [clientId, setClientId] = useState('usr_admin_default');
  const [clientName, setClientName] = useState('Cliente Directo (Público General)');
  const [senderName, setSenderName] = useState('');
  const [recipientName, setRecipientName] = useState('');
  const [finalSignature, setFinalSignature] = useState('');
  const [relationship, setRelationship] = useState<RelationshipType>('couple');
  const [customRelationship, setCustomRelationship] = useState('');
  const [occasion, setOccasion] = useState<OccasionType>('anniversary');
  const [customOccasion, setCustomOccasion] = useState('');
  const [tone, setTone] = useState<EmotionalTone>('romantic');
  const [selectedTheme, setSelectedTheme] = useState<ThemeId>('romantic_elegant');
  const [occasionDate, setOccasionDate] = useState(new Date().toISOString().split('T')[0]);
  const [startDate, setStartDate] = useState(new Date().toISOString().split('T')[0]);
  const [creating, setCreating] = useState(false);

  // Compute preset recommendations
  const recommendation = useMemo(() => {
    return generateDefaultGiftPreset({
      senderName: senderName || 'Remitente',
      recipientName: recipientName || 'Destinatario',
      finalSignature,
      relationship,
      occasion,
      tone,
    });
  }, [senderName, recipientName, finalSignature, relationship, occasion, tone]);

  // Update theme selection when step 6 opens if theme wasn't manually clicked
  const handleGoToStep6 = () => {
    if (recommendation.recommendedThemes.length > 0) {
      setSelectedTheme(recommendation.recommendedThemes[0]);
    }
    setStep(6);
  };

  const handleCreate = async () => {
    setCreating(true);
    const internalName = `Regalo de ${senderName || 'Remitente'} para ${recipientName || 'Destinatario'}`;
    const payload = {
      client_id: clientId,
      internal_name: internalName,
      sender_name: senderName,
      recipient_name: recipientName,
      final_signature: finalSignature || `Con todo mi cariño, ${senderName}`,
      person_one_name: senderName,
      person_two_name: recipientName,
      relationship_type: relationship,
      custom_relationship: relationship === 'other' ? customRelationship : undefined,
      occasion_type: occasion,
      custom_occasion: occasion === 'custom' ? customOccasion : undefined,
      emotional_tone: tone,
      occasion_date: occasionDate,
      relationship_start_date: startDate,
      counter_display_mode: recommendation.counterDisplayMode,
      template_id: selectedTheme,
      language: 'es',
    };

    try {
      const data = await createProject(payload);
      onCreated(data.project);
    } catch (err: any) {
      alert('Error: ' + err.message);
      setCreating(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-3 sm:p-6 overflow-y-auto animate-fade-in">
      <div className="relative w-full max-w-2xl bg-slate-900 border border-slate-800 rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[92vh]">
        {/* Header Bar */}
        <div className="px-6 py-4 border-b border-slate-800 flex items-center justify-between bg-slate-950/60">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-full bg-pink-500/20 border border-pink-500/30 flex items-center justify-center text-pink-400 font-bold text-xs">
              {step}/7
            </div>
            <div>
              <h2 className="text-base font-bold text-white leading-tight">Creador Universal de Regalos</h2>
              <p className="text-xs text-slate-400">
                {step === 1 && 'Paso 1: Cliente registrado'}
                {step === 2 && 'Paso 2: ¿Para quién es este regalo?'}
                {step === 3 && 'Paso 3: Tipo de relación'}
                {step === 4 && 'Paso 4: Ocasión especial'}
                {step === 5 && 'Paso 5: Tono emocional'}
                {step === 6 && 'Paso 6: Recomendación visual de plantilla'}
                {step === 7 && 'Paso 7: Resumen antes de crear'}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-full text-slate-400 hover:text-white hover:bg-slate-800 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Progress Bar */}
        <div className="w-full bg-slate-800 h-1">
          <div
            className="bg-gradient-to-r from-pink-500 to-rose-500 h-full transition-all duration-300"
            style={{ width: `${(step / 7) * 100}%` }}
          />
        </div>

        {/* Step Body Container */}
        <div className="p-6 overflow-y-auto flex-1 space-y-6">
          {/* STEP 1: CLIENT SELECTION */}
          {step === 1 && (
            <div className="space-y-5 animate-fade-in">
              <div className="text-center space-y-1">
                <h3 className="text-xl font-bold text-white">Selecciona o registra al cliente</h3>
                <p className="text-xs text-slate-400">
                  Es quien realiza la compra y queda registrado en la cartera de clientes de la plataforma.
                </p>
              </div>

              <div className="space-y-3 bg-slate-800/60 p-4 rounded-2xl border border-slate-700/60">
                <label className="block text-xs font-semibold text-slate-300">Nombre del cliente</label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={clientName}
                    onChange={(e) => setClientName(e.target.value)}
                    placeholder="Ej. María González"
                    className="w-full p-3 rounded-xl bg-slate-900 border border-slate-700 text-white text-sm focus:border-pink-500 outline-none"
                  />
                </div>
                <p className="text-[11px] text-slate-400 italic">
                  Nota: El cliente que paga no es necesariamente quien firma públicamente en el regalo.
                </p>
              </div>
            </div>
          )}

          {/* STEP 2: SENDER, RECIPIENT & SIGNATURE */}
          {step === 2 && (
            <div className="space-y-5 animate-fade-in">
              <div className="text-center space-y-1">
                <h3 className="text-xl font-bold text-white">¿Para quién es este regalo?</h3>
                <p className="text-xs text-slate-400">
                  Indica quién entrega el detalle y quién lo recibe. Puedes incluir una o varias personas.
                </p>
              </div>

              <div className="space-y-4">
                <div className="space-y-1.5">
                  <label className="block text-xs font-semibold text-slate-300">
                    Quién entrega el regalo (Remitente) <span className="text-pink-400">*</span>
                  </label>
                  <input
                    type="text"
                    value={senderName}
                    onChange={(e) => setSenderName(e.target.value)}
                    placeholder="Ej: Diego / Tus hijos / Mamá y papá / Toda la familia / Tu mejor amiga"
                    className="w-full p-3 rounded-xl bg-slate-800 border border-slate-700 text-white text-sm focus:border-pink-500 outline-none"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="block text-xs font-semibold text-slate-300">
                    Quién recibe el regalo (Destinatario) <span className="text-pink-400">*</span>
                  </label>
                  <input
                    type="text"
                    value={recipientName}
                    onChange={(e) => setRecipientName(e.target.value)}
                    placeholder="Ej: Camila / Mamá / Papá / Mi pequeña Sofía / Nuestros abuelos"
                    className="w-full p-3 rounded-xl bg-slate-800 border border-slate-700 text-white text-sm focus:border-pink-500 outline-none"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="block text-xs font-semibold text-slate-300">Firma final opcional</label>
                  <input
                    type="text"
                    value={finalSignature}
                    onChange={(e) => setFinalSignature(e.target.value)}
                    placeholder="Ej: Con amor, tu hijo / Tus padres que te aman / Con cariño, todo el equipo"
                    className="w-full p-3 rounded-xl bg-slate-800 border border-slate-700 text-white text-sm focus:border-pink-500 outline-none"
                  />
                </div>
              </div>
            </div>
          )}

          {/* STEP 3: RELATIONSHIP TYPE */}
          {step === 3 && (
            <div className="space-y-5 animate-fade-in">
              <div className="text-center space-y-1">
                <h3 className="text-xl font-bold text-white">¿Qué relación existe entre ambos?</h3>
                <p className="text-xs text-slate-400">
                  Selecciona la relación para adaptar el lenguaje y evitar frases rígidas o pronombres inadecuados.
                </p>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5 max-h-[320px] overflow-y-auto pr-1">
                {RELATIONSHIP_OPTIONS.map((opt) => (
                  <button
                    key={opt.value}
                    type="button"
                    onClick={() => setRelationship(opt.value)}
                    className={`p-3 rounded-2xl border text-left text-xs font-semibold transition ${
                      relationship === opt.value
                        ? 'bg-pink-600 border-pink-400 text-white shadow-lg'
                        : 'bg-slate-800/80 border-slate-700/80 text-slate-200 hover:bg-slate-700'
                    }`}
                  >
                    <span className="block font-bold truncate">{opt.label}</span>
                    <span className="text-[10px] opacity-75 font-normal block">{opt.group}</span>
                  </button>
                ))}
              </div>

              {relationship === 'other' && (
                <div className="space-y-1.5 pt-2">
                  <label className="block text-xs font-semibold text-slate-300">Especifica la relación personalizada</label>
                  <input
                    type="text"
                    value={customRelationship}
                    onChange={(e) => setCustomRelationship(e.target.value)}
                    placeholder="Ej: Madrina a ahijado / Mentor a emprendedor"
                    className="w-full p-3 rounded-xl bg-slate-800 border border-slate-700 text-white text-sm focus:border-pink-500 outline-none"
                  />
                </div>
              )}
            </div>
          )}

          {/* STEP 4: OCCASION */}
          {step === 4 && (
            <div className="space-y-5 animate-fade-in">
              <div className="text-center space-y-1">
                <h3 className="text-xl font-bold text-white">¿Qué quieres celebrar o expresar?</h3>
                <p className="text-xs text-slate-400">
                  La ocasión define la temática del detalle (Cumpleaños, Aniversario, Graduación, Homenaje, etc.).
                </p>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5 max-h-[280px] overflow-y-auto pr-1">
                {OCCASION_OPTIONS.map((opt) => (
                  <button
                    key={opt.value}
                    type="button"
                    onClick={() => setOccasion(opt.value)}
                    className={`p-3 rounded-2xl border text-left text-xs font-semibold transition ${
                      occasion === opt.value
                        ? 'bg-pink-600 border-pink-400 text-white shadow-lg'
                        : 'bg-slate-800/80 border-slate-700/80 text-slate-200 hover:bg-slate-700'
                    }`}
                  >
                    {opt.label}
                  </button>
                ))}
              </div>

              {occasion === 'custom' && (
                <div className="space-y-1.5 pt-2">
                  <label className="block text-xs font-semibold text-slate-300">Especifica la ocasión personalizada</label>
                  <input
                    type="text"
                    value={customOccasion}
                    onChange={(e) => setCustomOccasion(e.target.value)}
                    placeholder="Ej: Inauguración de negocio / Viaje de ensueño"
                    className="w-full p-3 rounded-xl bg-slate-800 border border-slate-700 text-white text-sm focus:border-pink-500 outline-none"
                  />
                </div>
              )}

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Fecha de la ocasión / evento</label>
                  <input
                    type="date"
                    value={occasionDate}
                    onChange={(e) => setOccasionDate(e.target.value)}
                    className="w-full p-3 rounded-xl bg-slate-800 border border-slate-700 text-white text-xs outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Fecha de inicio / hito especial</label>
                  <input
                    type="date"
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                    className="w-full p-3 rounded-xl bg-slate-800 border border-slate-700 text-white text-xs outline-none"
                  />
                </div>
              </div>
            </div>
          )}

          {/* STEP 5: EMOTIONAL TONE */}
          {step === 5 && (
            <div className="space-y-5 animate-fade-in">
              <div className="text-center space-y-1">
                <h3 className="text-xl font-bold text-white">¿Qué emoción debe transmitir?</h3>
                <p className="text-xs text-slate-400">
                  El tono emocional ajusta el ambiente visual, las decoraciones y las partículas de fondo.
                </p>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5 max-h-[320px] overflow-y-auto pr-1">
                {TONE_OPTIONS.map((opt) => (
                  <button
                    key={opt.value}
                    type="button"
                    onClick={() => setTone(opt.value)}
                    className={`p-3.5 rounded-2xl border text-left transition ${
                      tone === opt.value
                        ? 'bg-pink-600 border-pink-400 text-white shadow-lg'
                        : 'bg-slate-800/80 border-slate-700/80 text-slate-200 hover:bg-slate-700'
                    }`}
                  >
                    <div className="flex items-center gap-1.5 mb-1">
                      <span className="text-base">{opt.emoji}</span>
                      <strong className="text-xs font-bold">{opt.label}</strong>
                    </div>
                    <p className="text-[10px] opacity-80 leading-tight">{opt.description}</p>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* STEP 6: VISUAL CATALOG & RECOMMENDATIONS */}
          {step === 6 && (
            <div className="space-y-5 animate-fade-in">
              <div className="text-center space-y-1">
                <h3 className="text-xl font-bold text-white">Recomendación Automática de Plantilla</h3>
                <p className="text-xs text-slate-400">
                  Según tus selecciones de relación y tono, te sugerimos estas familias visuales. Puedes elegir la que prefieras.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-h-[340px] overflow-y-auto pr-1">
                {(Object.values(THEMES) as any[]).map((theme) => {
                  const isRecommended = recommendation.recommendedThemes.includes(theme.id);
                  const isSelected = selectedTheme === theme.id;
                  return (
                    <div
                      key={theme.id}
                      onClick={() => setSelectedTheme(theme.id)}
                      className={`cursor-pointer p-4 rounded-2xl border transition relative overflow-hidden flex flex-col justify-between ${
                        isSelected
                          ? 'border-pink-500 ring-2 ring-pink-500/50 shadow-xl'
                          : 'border-slate-700/80 hover:border-slate-500'
                      }`}
                      style={{ background: theme.cardBg }}
                    >
                      {isRecommended && (
                        <span className="absolute top-2.5 right-2.5 px-2.5 py-0.5 rounded-full bg-pink-500 text-white font-bold text-[10px] uppercase tracking-wider shadow">
                          Recomendado ✨
                        </span>
                      )}
                      <div>
                        <div className="flex items-center gap-2 mb-1.5">
                          <span className="text-xl">{theme.emoji}</span>
                          <h4 className="font-bold text-sm" style={{ color: theme.titleColor }}>
                            {theme.name}
                          </h4>
                        </div>
                        <p className="text-xs opacity-90 leading-relaxed" style={{ color: theme.textColor }}>
                          {theme.description}
                        </p>
                      </div>
                      <div className="mt-3 flex items-center justify-between pt-2 border-t border-white/10">
                        <span className="text-[10px] font-semibold opacity-75" style={{ color: theme.kickerColor }}>
                          Estilo visual
                        </span>
                        {isSelected && <CheckCircle2 className="w-5 h-5 text-pink-400" />}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* STEP 7: SUMMARY & CONFIRMATION */}
          {step === 7 && (
            <div className="space-y-5 animate-fade-in">
              <div className="text-center space-y-1">
                <h3 className="text-xl font-bold text-white">Resumen de la Experiencia Creada</h3>
                <p className="text-xs text-slate-400">
                  Revisa los datos antes de generar la estructura inicial del regalo en el editor.
                </p>
              </div>

              <div className="bg-slate-800/80 p-5 rounded-2xl border border-slate-700/80 space-y-3.5 text-xs">
                <div className="flex justify-between border-b border-slate-700/60 pb-2">
                  <span className="text-slate-400 font-semibold">Cliente Registrado:</span>
                  <span className="text-white font-bold">{clientName}</span>
                </div>
                <div className="flex justify-between border-b border-slate-700/60 pb-2">
                  <span className="text-slate-400 font-semibold">Entrega el regalo:</span>
                  <span className="text-pink-400 font-bold">{senderName || 'No especificado'}</span>
                </div>
                <div className="flex justify-between border-b border-slate-700/60 pb-2">
                  <span className="text-slate-400 font-semibold">Recibe el regalo:</span>
                  <span className="text-pink-400 font-bold">{recipientName || 'No especificado'}</span>
                </div>
                <div className="flex justify-between border-b border-slate-700/60 pb-2">
                  <span className="text-slate-400 font-semibold">Firma pública:</span>
                  <span className="text-slate-200 italic">{finalSignature || `Con todo mi cariño, ${senderName}`}</span>
                </div>
                <div className="flex justify-between border-b border-slate-700/60 pb-2">
                  <span className="text-slate-400 font-semibold">Tipo de Relación:</span>
                  <span className="text-white font-bold">
                    {RELATIONSHIP_OPTIONS.find((r) => r.value === relationship)?.label}
                  </span>
                </div>
                <div className="flex justify-between border-b border-slate-700/60 pb-2">
                  <span className="text-slate-400 font-semibold">Ocasión Celebrada:</span>
                  <span className="text-white font-bold">
                    {OCCASION_OPTIONS.find((o) => o.value === occasion)?.label}
                  </span>
                </div>
                <div className="flex justify-between border-b border-slate-700/60 pb-2">
                  <span className="text-slate-400 font-semibold">Tono Emocional:</span>
                  <span className="text-white font-bold">
                    {TONE_OPTIONS.find((t) => t.value === tone)?.label}
                  </span>
                </div>
                <div className="flex justify-between pb-1">
                  <span className="text-slate-400 font-semibold">Plantilla Visual:</span>
                  <span className="text-pink-400 font-bold">{THEMES[selectedTheme]?.name}</span>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer Navigation Bar */}
        <div className="px-6 py-4 border-t border-slate-800 bg-slate-950 flex items-center justify-between">
          {step > 1 ? (
            <button
              onClick={() => setStep((s) => s - 1)}
              className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-slate-800 text-slate-300 text-xs font-semibold hover:bg-slate-700 transition"
            >
              <ArrowLeft className="w-4 h-4" />
              Atrás
            </button>
          ) : (
            <div />
          )}

          {step < 7 ? (
            <button
              onClick={() => {
                if (step === 2 && (!senderName.trim() || !recipientName.trim())) {
                  alert('Por favor indica quién entrega y quién recibe el regalo.');
                  return;
                }
                if (step === 5) {
                  handleGoToStep6();
                } else {
                  setStep((s) => s + 1);
                }
              }}
              className="flex items-center gap-1.5 px-6 py-2.5 rounded-xl bg-pink-600 text-white text-xs font-bold shadow-lg hover:bg-pink-500 transition"
            >
              Siguiente
              <ArrowRight className="w-4 h-4" />
            </button>
          ) : (
            <button
              onClick={handleCreate}
              disabled={creating}
              className="flex items-center gap-2 px-7 py-3 rounded-xl bg-gradient-to-r from-pink-500 to-rose-500 text-white text-xs font-bold shadow-xl hover:brightness-110 active:scale-95 transition"
            >
              <Gift className="w-4 h-4" />
              {creating ? 'Generando regalo…' : 'Crear Regalo y Abrir Editor ✨'}
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
