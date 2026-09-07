import { useEffect, useRef, useState } from 'react';
import { SearchOutlined, CloseOutlined } from '@ant-design/icons';
import type { HealthUnit } from '../../../types/campaign';
import { searchHealthUnits } from '../../../services/healthUnitServices';

interface CampaignLocationSearchProps {
  value: HealthUnit[];
  onChange: (units: HealthUnit[]) => void;
  error?: string;
}

// Autocomplete de unidades de saúde com seleção múltipla.
// Hoje busca em `services/healthUnitServices.ts` (que filtra um mock local),
// mas a função já é assíncrona — quando a API existir, o componente não
// precisa mudar nada, só o serviço passa a chamar `fetch`.
function CampaignLocationSearch({ value, onChange, error }: CampaignLocationSearchProps) {
  const [query, setQuery] = useState('');
  const [sugestoes, setSugestoes] = useState<HealthUnit[]>([]);
  const [aberto, setAberto] = useState(false);
  const [buscando, setBuscando] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!aberto) return;

    let ativo = true;
    setBuscando(true);

    searchHealthUnits(query).then((resultado) => {
      if (!ativo) return;
      setSugestoes(resultado.filter((unit) => !value.some((selecionada) => selecionada.id === unit.id)));
      setBuscando(false);
    });

    return () => {
      ativo = false;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [query, aberto, value]);

  useEffect(() => {
    function handleClickFora(event: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setAberto(false);
      }
    }

    document.addEventListener('mousedown', handleClickFora);
    return () => document.removeEventListener('mousedown', handleClickFora);
  }, []);

  function selecionarUnidade(unit: HealthUnit) {
    onChange([...value, unit]);
    setQuery('');
    setAberto(false);
  }

  function removerUnidade(id: number) {
    onChange(value.filter((unit) => unit.id !== id));
  }

  return (
    <div ref={containerRef} className="relative">
      <label className="mb-1 block text-sm font-medium text-gray-900">Local</label>

      <div
        className={`flex flex-wrap items-center gap-2 rounded-lg border px-2 py-1.5 ${
          error ? 'border-red-400' : 'border-gray-300'
        }`}
      >
        {value.map((unit) => (
          <span
            key={unit.id}
            className="flex items-center gap-1 rounded-full bg-emerald-50 px-2 py-1 text-xs font-medium text-emerald-700"
          >
            {unit.name}
            <button
              type="button"
              onClick={() => removerUnidade(unit.id)}
              aria-label={`Remover ${unit.name}`}
              className="text-emerald-500 hover:text-emerald-700"
            >
              <CloseOutlined className="text-[10px]" />
            </button>
          </span>
        ))}

        <div className="flex min-w-[140px] flex-1 items-center gap-1.5">
          <SearchOutlined className="text-gray-400" />
          <input
            type="text"
            value={query}
            onFocus={() => setAberto(true)}
            onChange={(e) => {
              setQuery(e.target.value);
              setAberto(true);
            }}
            placeholder={value.length === 0 ? 'Pesquisar unidade de saúde' : 'Adicionar outra unidade'}
            className="min-w-0 flex-1 py-0.5 text-sm text-gray-700 outline-none"
          />
        </div>
      </div>

      {aberto && (
        <div className="absolute z-20 mt-1 max-h-48 w-full overflow-y-auto rounded-lg border border-gray-100 bg-white p-1 shadow-md">
          {buscando && <p className="px-3 py-2 text-sm text-gray-400">Buscando...</p>}

          {!buscando && sugestoes.length === 0 && (
            <p className="px-3 py-2 text-sm text-gray-400">Nenhuma unidade encontrada.</p>
          )}

          {!buscando &&
            sugestoes.map((unit) => (
              <button
                key={unit.id}
                type="button"
                onClick={() => selecionarUnidade(unit)}
                className="flex w-full flex-col rounded-md px-3 py-2 text-left hover:bg-emerald-50"
              >
                <span className="text-sm text-gray-800">{unit.name}</span>
                {unit.region && <span className="text-xs text-gray-400">{unit.region}</span>}
              </button>
            ))}
        </div>
      )}

      {error && <p className="mt-1 text-xs text-red-500">{error}</p>}
    </div>
  );
}

export default CampaignLocationSearch;
