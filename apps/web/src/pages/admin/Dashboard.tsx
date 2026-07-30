import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { fetchProjects, publishProject, unpublishProject, duplicateProject, deleteProject } from '../../services/api';
import { NewProjectWizard } from '../../components/admin/NewProjectWizard';
import { QrAndCardModal } from '../../components/admin/QrAndCardModal';
import { Plus, Search, Eye, Edit, Copy, QrCode, FileText, Trash2, Heart, Share2, LogOut, CheckCircle2, Clock, Sparkles, User, Users } from 'lucide-react';
import { RELATIONSHIP_OPTIONS, OCCASION_OPTIONS } from '@recuerdos-qr/shared';

export const Dashboard: React.FC = () => {
  const [projects, setProjects] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [showCreateWizard, setShowCreateWizard] = useState(false);
  const [selectedProjectForQr, setSelectedProjectForQr] = useState<any | null>(null);

  const navigate = useNavigate();

  const loadData = () => {
    setLoading(true);
    fetchProjects(undefined, { search, status: statusFilter })
      .then((res) => {
        setProjects(res.projects || []);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  };

  useEffect(() => {
    loadData();
  }, [search, statusFilter]);

  const handleTogglePublish = async (project: any) => {
    try {
      if (project.status === 'published') {
        await unpublishProject(project.id);
      } else {
        await publishProject(project.id);
      }
      loadData();
    } catch (err: any) {
      alert(err.message || 'Error al cambiar estado de publicación.');
    }
  };

  const handleDuplicate = async (id: string) => {
    try {
      await duplicateProject(id);
      loadData();
    } catch (err: any) {
      alert(err.message);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('¿Estás seguro de eliminar este regalo? Esta acción es irreversible.')) return;
    try {
      await deleteProject(id);
      loadData();
    } catch (err: any) {
      alert(err.message);
    }
  };

  const totalProjects = projects.length;
  const publishedProjects = projects.filter((p) => p.status === 'published').length;
  const draftProjects = projects.filter((p) => p.status === 'draft').length;
  const totalVisits = projects.reduce((acc, p) => acc + (p.view_count || 0), 0);

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans selection:bg-pink-500">
      {/* Top Admin Header */}
      <header className="px-8 py-4 bg-slate-900 border-b border-slate-800 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Heart className="w-8 h-8 text-pink-500 fill-pink-500" />
          <div>
            <h1 className="text-xl font-bold text-white">Recuerdos QR</h1>
            <p className="text-xs text-slate-400">Plataforma de Regalos Digitales Multirelación</p>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <button
            onClick={() => setShowCreateWizard(true)}
            className="flex items-center gap-2 py-2.5 px-5 rounded-xl bg-gradient-to-r from-pink-500 to-rose-500 font-bold text-white shadow-lg hover:brightness-110 active:scale-95 transition text-sm"
          >
            <Plus className="w-4 h-4" />
            Crear nuevo regalo
          </button>
          <button
            onClick={() => {
              localStorage.removeItem('adminToken');
              navigate('/admin/login');
            }}
            className="p-2.5 rounded-xl bg-slate-800 text-slate-400 hover:text-white hover:bg-slate-700 transition"
            title="Cerrar sesión"
          >
            <LogOut className="w-5 h-5" />
          </button>
        </div>
      </header>

      {/* Main Dashboard Content */}
      <main className="flex-1 p-8 max-w-7xl mx-auto w-full space-y-8">
        {/* Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-4 gap-5">
          <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 shadow-xl space-y-2">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Total Regalos</span>
            <strong className="block text-3xl font-bold text-white">{totalProjects}</strong>
          </div>
          <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 shadow-xl space-y-2">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Publicados</span>
            <strong className="block text-3xl font-bold text-emerald-400">{publishedProjects}</strong>
          </div>
          <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 shadow-xl space-y-2">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Borradores</span>
            <strong className="block text-3xl font-bold text-amber-400">{draftProjects}</strong>
          </div>
          <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 shadow-xl space-y-2">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Total Visitas</span>
            <strong className="block text-3xl font-bold text-pink-400">{totalVisits}</strong>
          </div>
        </div>

        {/* Search & Filter Bar */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 bg-slate-900 p-4 rounded-2xl border border-slate-800">
          <div className="relative w-full sm:w-80">
            <Search className="w-5 h-5 absolute left-3.5 top-3 text-slate-500" />
            <input
              type="text"
              placeholder="Buscar por cliente o remitente/destinatario…"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-11 pr-4 py-2.5 rounded-xl bg-slate-800 border border-slate-700 text-white placeholder-slate-500 focus:outline-none focus:border-pink-500 text-sm"
            />
          </div>

          <div className="flex items-center gap-3 w-full sm:w-auto">
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-4 py-2.5 rounded-xl bg-slate-800 border border-slate-700 text-white text-sm focus:outline-none"
            >
              <option value="">Todos los estados</option>
              <option value="published">Publicados</option>
              <option value="draft">Borradores</option>
              <option value="unpublished">Despublicados</option>
            </select>
          </div>
        </div>

        {/* Project Cards Grid */}
        {loading ? (
          <div className="text-center py-16 text-slate-400">Cargando lista de regalos…</div>
        ) : projects.length === 0 ? (
          <div className="text-center py-16 bg-slate-900 rounded-3xl border border-slate-800 text-slate-400 space-y-3">
            <Heart className="w-12 h-12 mx-auto text-slate-600" />
            <p className="text-lg font-medium">No se encontraron regalos</p>
            <p className="text-sm">Crea tu primer regalo para comenzar a personalizar experiencias.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {projects.map((p) => {
              const sender = p.sender_name || p.person_one_name || 'Remitente';
              const recipient = p.recipient_name || p.person_two_name || 'Destinatario';
              const relLabel = RELATIONSHIP_OPTIONS.find((r: any) => r.value === p.relationship_type)?.label || 'Pareja';
              const occLabel = OCCASION_OPTIONS.find((o: any) => o.value === p.occasion_type)?.label || 'Aniversario';

              return (
                <div
                  key={p.id}
                  className="p-6 rounded-2xl bg-slate-900 border border-slate-800 shadow-xl space-y-4 hover:border-slate-700 transition flex flex-col justify-between"
                >
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider ${
                          p.status === 'published'
                            ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/30'
                            : 'bg-amber-500/10 text-amber-400 border border-amber-500/30'
                        }`}
                      >
                        {p.status === 'published' ? 'Publicado' : 'Borrador'}
                      </span>
                      <span className="text-xs text-pink-300 font-semibold px-2.5 py-0.5 rounded-md bg-slate-800 border border-slate-700">
                        {occLabel}
                      </span>
                    </div>

                    <div>
                      <h3 className="text-lg font-bold text-white leading-tight">{p.internal_name}</h3>
                      <p className="text-xs text-slate-300 font-semibold mt-1 flex items-center gap-1">
                        <Users className="w-3.5 h-3.5 text-pink-400" />
                        De: <span className="text-pink-300">{sender}</span> → Para: <span className="text-pink-300">{recipient}</span>
                      </p>
                      <span className="inline-block mt-1.5 px-2 py-0.5 rounded bg-slate-800 text-[11px] font-medium text-slate-400 border border-slate-700">
                        Relación: {relLabel}
                      </span>
                    </div>

                    <div className="text-xs text-slate-400 space-y-1">
                      <p>Creado: {new Date(p.created_at).toLocaleDateString('es-CL')}</p>
                      <p className="font-mono text-pink-400/90">/r/{p.slug}</p>
                    </div>
                  </div>

                  {/* Actions Footer */}
                  <div className="pt-4 border-t border-slate-800 grid grid-cols-5 gap-1.5 text-center text-[11px] font-semibold">
                    <button
                      onClick={() => navigate(`/admin/editor/${p.id}`)}
                      className="p-2 rounded-lg bg-slate-800 text-slate-200 hover:bg-pink-600 hover:text-white transition flex flex-col items-center gap-1"
                      title="Editar"
                    >
                      <Edit className="w-4 h-4" />
                      Editar
                    </button>

                    <a
                      href={`/r/${p.slug}`}
                      target="_blank"
                      rel="noreferrer"
                      className="p-2 rounded-lg bg-slate-800 text-slate-200 hover:bg-slate-700 transition flex flex-col items-center gap-1"
                      title="Previsualizar"
                    >
                      <Eye className="w-4 h-4" />
                      Ver
                    </a>

                    <button
                      onClick={() => setSelectedProjectForQr(p)}
                      className="p-2 rounded-lg bg-pink-950/60 text-pink-300 hover:bg-pink-600 hover:text-white border border-pink-500/20 transition flex flex-col items-center gap-1"
                      title="Código QR y Tarjeta Imprimible"
                    >
                      <QrCode className="w-4 h-4" />
                      QR/Tarjeta
                    </button>

                    <button
                      onClick={() => handleTogglePublish(p)}
                      className={`p-2 rounded-lg text-white transition flex flex-col items-center gap-1 ${
                        p.status === 'published' ? 'bg-amber-600/80 hover:bg-amber-600' : 'bg-emerald-600/80 hover:bg-emerald-600'
                      }`}
                      title="Publicar/Despublicar"
                    >
                      {p.status === 'published' ? <Clock className="w-4 h-4" /> : <CheckCircle2 className="w-4 h-4" />}
                      {p.status === 'published' ? 'Pausar' : 'Publicar'}
                    </button>

                    <button
                      onClick={() => handleDelete(p.id)}
                      className="p-2 rounded-lg bg-rose-950/60 text-rose-300 hover:bg-rose-600 hover:text-white transition flex flex-col items-center gap-1"
                      title="Eliminar"
                    >
                      <Trash2 className="w-4 h-4" />
                      Borrar
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </main>

      {/* New Project Universal Wizard Modal */}
      {showCreateWizard && (
        <NewProjectWizard
          onClose={() => setShowCreateWizard(false)}
          onCreated={(createdProj) => {
            setShowCreateWizard(false);
            navigate(`/admin/editor/${createdProj.id}`);
          }}
        />
      )}

      {/* QR & Tarjeta Modal */}
      {selectedProjectForQr && (
        <QrAndCardModal
          project={selectedProjectForQr}
          onClose={() => setSelectedProjectForQr(null)}
        />
      )}
    </div>
  );
};

