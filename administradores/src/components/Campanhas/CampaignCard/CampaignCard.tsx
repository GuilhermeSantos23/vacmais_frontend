import { CalendarOutlined, EnvironmentOutlined, PictureOutlined } from '@ant-design/icons';
import type { Campaign, CampaignStatus as CampaignStatusType } from '../../../types/campaign';
import { formatDateBR } from '../../../utils/date';
import CampaignStatus from '../CampaignStatus/CampaignStatus';

interface CampaignCardProps {
  campaign: Campaign;
  onEdit: (campaign: Campaign) => void;
  onChangeStatus: (campaign: Campaign, status: CampaignStatusType) => void;
}

const statusOptions: { value: CampaignStatusType; label: string }[] = [
  { value: 'ativa', label: 'Ativa' },
  { value: 'agendada', label: 'Agendada' },
  { value: 'encerrada', label: 'Encerrada' },
];

function CampaignCard({ campaign, onEdit, onChangeStatus }: CampaignCardProps) {
  return (
    <div className="flex flex-col gap-4 rounded-xl border border-gray-100 bg-white p-5 shadow-sm sm:flex-row">
      <div className="h-28 w-full shrink-0 overflow-hidden rounded-lg bg-emerald-50 sm:h-28 sm:w-28">
        {campaign.image ? (
          <img src={campaign.image} alt={campaign.title} className="h-full w-full object-cover" />
        ) : (
          <div className="flex h-full w-full items-center justify-center text-2xl text-emerald-300">
            <PictureOutlined />
          </div>
        )}
      </div>

      <div className="flex flex-1 flex-col">
        <h3 className="text-lg font-bold text-gray-900">{campaign.title}</h3>

        <div className="mt-1 flex items-center gap-2">
          <CampaignStatus status={campaign.status} />

          <select
            aria-label="Alterar status da campanha"
            value={campaign.status}
            onChange={(e) => onChangeStatus(campaign, e.target.value as CampaignStatusType)}
            className="rounded-md border border-gray-200 bg-white px-2 py-0.5 text-xs text-gray-500 outline-none focus:border-emerald-500"
          >
            {statusOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>

        <p className="mt-2 line-clamp-2 text-sm text-gray-500">{campaign.description}</p>

        <div className="mt-3 flex flex-col gap-1.5 text-sm text-gray-600">
          <div className="flex items-center gap-2">
            <CalendarOutlined className="text-gray-400" />
            <span>Publicada: {formatDateBR(campaign.publishedAt)}</span>
          </div>
          <div className="flex items-center gap-2">
            <CalendarOutlined className="text-gray-400" />
            <span>Até: {formatDateBR(campaign.endDate)}</span>
          </div>
          {campaign.locations.length > 0 && (
            <div className="flex items-center gap-2">
              <EnvironmentOutlined className="text-gray-400" />
              <span>{campaign.locations.map((unit) => unit.name).join(', ')}</span>
            </div>
          )}
        </div>

        <div className="mt-4 flex justify-end">
          <button
            type="button"
            onClick={() => onEdit(campaign)}
            className="text-sm font-medium text-emerald-600 hover:text-emerald-700"
          >
            Editar
          </button>
        </div>
      </div>
    </div>
  );
}

export default CampaignCard;