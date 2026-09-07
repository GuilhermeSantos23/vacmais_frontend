import { useRef, useState } from 'react';
import { CameraOutlined, CloseOutlined } from '@ant-design/icons';

interface CampaignImageUploadProps {
  /** Preview atual (data-URL local ou, futuramente, URL vinda da API). */
  value: string | null;
  onChange: (image: string | null) => void;
  error?: string;
}

const TIPOS_ACEITOS = ['image/png', 'image/jpeg', 'image/jpg'];

// Componente reutilizável de upload de imagem com preview.
// Sem back-end: o arquivo é convertido para data-URL apenas para exibir o
// preview localmente. Quando a API existir, basta enviar `file` (guardado
// antes da conversão) num FormData em vez de gerar o data-URL.
function CampaignImageUpload({ value, onChange, error }: CampaignImageUploadProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [localError, setLocalError] = useState<string | undefined>(undefined);

  function handleFileSelected(file: File | undefined) {
    if (!file) return;

    if (!TIPOS_ACEITOS.includes(file.type)) {
      setLocalError('Formato inválido. Envie um arquivo PNG, JPG ou JPEG.');
      return;
    }

    setLocalError(undefined);

    const reader = new FileReader();
    reader.onload = () => {
      onChange(typeof reader.result === 'string' ? reader.result : null);
    };
    reader.readAsDataURL(file);
  }

  function handleRemove() {
    onChange(null);
    setLocalError(undefined);
    if (inputRef.current) inputRef.current.value = '';
  }

  const mensagemErro = error ?? localError;

  return (
    <div>
      <label className="mb-1 block text-sm font-medium text-gray-900">Imagem</label>

      {value ? (
        <div className="relative w-fit">
          <img
            src={value}
            alt="Preview da campanha"
            className="h-24 w-24 rounded-lg border border-gray-200 object-cover"
          />
          <button
            type="button"
            onClick={handleRemove}
            aria-label="Remover imagem"
            className="absolute -top-2 -right-2 flex h-6 w-6 items-center justify-center rounded-full bg-white text-gray-500 shadow ring-1 ring-gray-200 hover:text-red-500"
          >
            <CloseOutlined className="text-xs" />
          </button>
        </div>
      ) : (
        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          className={`flex h-11 w-11 items-center justify-center rounded-lg border text-gray-400 hover:border-emerald-500 hover:text-emerald-500 ${
            mensagemErro ? 'border-red-400' : 'border-gray-300'
          }`}
        >
          <CameraOutlined />
        </button>
      )}

      <input
        ref={inputRef}
        type="file"
        accept="image/png,image/jpeg,image/jpg"
        className="hidden"
        onChange={(e) => handleFileSelected(e.target.files?.[0])}
      />

      {mensagemErro && <p className="mt-1 text-xs text-red-500">{mensagemErro}</p>}
    </div>
  );
}

export default CampaignImageUpload;
