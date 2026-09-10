import { useEffect, useState } from 'react';
import { SearchOutlined } from '@ant-design/icons';
import type { Campaign, CampaignFormData, CampaignStatus } from '../../types/campaign';
import {
  createCampaign,
  getCampaigns,
  updateCampaign,
  updateCampaignStatus,
} from '../../services/campaignServices';
import { formatDateBR } from '../../utils/date';
import CampaignCard from '../../components/Campanhas/CampaignCard/CampaignCard';
import CampaignForm from '../../components/Campanhas/CampaignForm/CampaignForm';

function Campanhas() {
  const [campanhas, setCampanhas] = useState<Campaign[]>([]);
  const [carregando, setCarregando] = useState(true);
  const [busca, setBusca] = useState('');

  const [modalAberto, setModalAberto] = useState(false);
  const [campanhaEmEdicao, setCampanhaEmEdicao] = useState<Campaign | undefined>(undefined);
  const [salvando, setSalvando] = useState(false);

  useEffect(() => {
    getCampaigns().then((resultado) => {
      setCampanhas(resultado);
      setCarregando(false);
    });
  }, []);

  const campanhasFiltradas = campanhas.filter((campanha) => {
    const termo = busca.trim().toLowerCase();
    if (!termo) return true;

    return (
      campanha.title.toLowerCase().includes(termo) ||
      formatDateBR(campanha.publishedAt).includes(termo) ||
      formatDateBR(campanha.endDate).includes(termo)
    );
  });

  function abrirCriacao() {
    setCampanhaEmEdicao(undefined);
    setModalAberto(true);
  }

  function abrirEdicao(campanha: Campaign) {
    setCampanhaEmEdicao(campanha);
    setModalAberto(true);
  }

  function fecharModal() {
    setModalAberto(false);
    setCampanhaEmEdicao(undefined);
  }

  async function handleSubmit(data: CampaignFormData) {
    setSalvando(true);

    const resultado = campanhaEmEdicao
      ? await updateCampaign(campanhaEmEdicao.id, data)
      : await createCampaign(data);

    if (resultado) {
      setCampanhas((atual) => {
        const existe = atual.some((campanha) => campanha.id === resultado.id);
        return existe
          ? atual.map((campanha) => (campanha.id === resultado.id ? resultado : campanha))
          : [resultado, ...atual];
      });
    }

    setSalvando(false);
    fecharModal();
  }

  async function handleChangeStatus(campanha: Campaign, status: CampaignStatus) {
    const resultado = await updateCampaignStatus(campanha.id, status);

    if (resultado) {
      setCampanhas((atual) =>
        atual.map((c) => (c.id === resultado.id ? resultado : c)),
      );
    }
  }

  return (
    <div>
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Campanhas e Alertas</h1>
          <p className="mt-1 text-sm text-gray-500">Criação e postagem de informativos</p>
        </div>

        <button
          type="button"
          onClick={abrirCriacao}
          className="text-sm font-medium text-emerald-600 hover:text-emerald-700"
        >
          + Criar campanha
        </button>
      </div>

      <div className="relative mt-6 max-w-md">
        <SearchOutlined className="pointer-events-none absolute top-1/2 left-3 -translate-y-1/2 text-gray-400" />
        <input
          type="text"
          value={busca}
          onChange={(e) => setBusca(e.target.value)}
          placeholder="Buscar campanha"
          className="w-full rounded-lg border border-gray-200 bg-white py-2 pr-3 pl-9 text-sm text-gray-700 outline-none focus:border-emerald-500"
        />
      </div>

      <div className="mt-5 flex flex-col gap-4">
        {carregando &&
          [1, 2, 3].map((placeholder) => (
            <div
              key={placeholder}
              className="h-32 animate-pulse rounded-xl border border-gray-100 bg-white shadow-sm"
            />
          ))}

        {!carregando && campanhasFiltradas.length === 0 && (
          <div className="rounded-xl border border-gray-100 bg-white p-10 text-center shadow-sm">
            <p className="font-medium text-gray-700">Nenhuma campanha encontrada.</p>
            <p className="mt-1 text-sm text-gray-400">
              Tente pesquisar por outro título ou data.
            </p>
          </div>
        )}

        {!carregando &&
          campanhasFiltradas.map((campanha) => (
            <CampaignCard
              key={campanha.id}
              campaign={campanha}
              onEdit={abrirEdicao}
              onChangeStatus={handleChangeStatus}
            />
          ))}
      </div>

      {modalAberto && (
        <CampaignForm
          campaign={campanhaEmEdicao}
          onSubmit={handleSubmit}
          onCancel={fecharModal}
          submitting={salvando}
        />
      )}
    </div>
  );
}

export default Campanhas;