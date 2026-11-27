import { useEffect, useState, type FormEvent } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { MailOutlined } from '@ant-design/icons';
import AuthLayout from '../../layouts/AuthLayout/AuthLayout';
import FormField from '../../components/form/FormField/FormField';
import SelectField from '../../components/form/SelectField/SelectField';
import ValidationOverlay from '../../components/common/ValidationOverlay/ValidationOverlay';
import { maskCPF, maskNumeric } from '../../utils/masks';
import { requestPasswordRecovery, verifyRecoveryCode } from '../../services/forgotPasswordService';

const REGIONAL_CODE_OPTIONS = [
  { value: 'SAR12', label: 'SAR12 (Pimentas)' },
  { value: 'SAR06', label: 'SAR06 (Cantareira)' },
  { value: 'SAR05', label: 'SAR05 (Centro)' },
];

type Step = 'identificador' | 'codigo';
type OverlayStatus = 'validating' | 'success';
interface OverlayConfig { status: OverlayStatus; validatingText: string; successText: string; }

/** Fluxo de demonstração. O envio e a confirmação ainda não chamam a API. */
function EsqueciSenha() {
  const navigate = useNavigate();
  const [step, setStep] = useState<Step>('identificador');
  const [overlay, setOverlay] = useState<OverlayConfig | null>(null);
  const [cpf, setCpf] = useState('');
  const [codigoRegional, setCodigoRegional] = useState('');
  const [erroCpf, setErroCpf] = useState('');
  const [erroRegional, setErroRegional] = useState('');
  const [codigo, setCodigo] = useState('');
  const [erroCodigo, setErroCodigo] = useState('');
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    if (overlay?.status !== 'success') return;
    const timer = window.setTimeout(() => setOverlay(null), 650);
    return () => window.clearTimeout(timer);
  }, [overlay]);

  async function handleSubmitIdentificador(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (busy) return;
    const cpfOk = cpf.replace(/\D/g, '').length === 11;
    const regionalOk = /^SAR\d{2}$/.test(codigoRegional);
    setErroCpf(cpfOk ? '' : 'Informe um CPF válido.');
    setErroRegional(regionalOk ? '' : 'Selecione o código da regional.');
    if (!cpfOk || !regionalOk) return;

    setBusy(true);
    setOverlay({ status: 'validating', validatingText: 'Localizando cadastro...', successText: 'Código enviado' });
    try {
      const result = await requestPasswordRecovery(cpf, codigoRegional);
      if (!result.success) throw new Error('Não foi possível iniciar a recuperação.');
      setOverlay({ status: 'success', validatingText: 'Localizando cadastro...', successText: 'Código enviado' });
      window.setTimeout(() => { setStep('codigo'); setOverlay(null); }, 650);
    } catch (error) {
      setOverlay(null);
      setErroCpf(error instanceof Error ? error.message : 'Não foi possível iniciar a recuperação.');
    } finally { setBusy(false); }
  }

  async function handleSubmitCodigo(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (busy) return;
    if (codigo.replace(/\D/g, '').length !== 6) { setErroCodigo('Informe o código de 6 dígitos.'); return; }
    setErroCodigo('');
    setBusy(true);
    setOverlay({ status: 'validating', validatingText: 'Confirmando código...', successText: 'Código aprovado' });
    try {
      const result = await verifyRecoveryCode(cpf, codigoRegional, codigo);
      if (!result.success) throw new Error('Não foi possível confirmar o código.');
      setOverlay({ status: 'success', validatingText: 'Confirmando código...', successText: 'Código aprovado' });
      window.setTimeout(() => navigate('/login', { replace: true }), 700);
    } catch (error) {
      setOverlay(null);
      setErroCodigo(error instanceof Error ? error.message : 'Não foi possível confirmar o código.');
    } finally { setBusy(false); }
  }

  return (
    <AuthLayout>
      <div className="relative">
        {step === 'identificador' ? (
          <>
            <h2 className="text-2xl font-bold text-gray-900 sm:text-3xl">Esqueci minha senha</h2>
            <p className="mt-1 text-sm text-gray-500">Informe seu CPF e o código da regional para iniciar a recuperação.</p>
            <form onSubmit={handleSubmitIdentificador} className="mt-6 flex flex-col gap-4" noValidate>
              <FormField label="CPF" type="text" inputMode="numeric" placeholder="123.456.789-00" value={cpf} onChange={(event) => setCpf(maskCPF(event.target.value))} error={erroCpf} />
              <SelectField label="Código da regional" value={codigoRegional} onChange={(event) => setCodigoRegional(event.target.value)} error={erroRegional} options={[{ value: '', label: 'Selecione a regional' }, ...REGIONAL_CODE_OPTIONS]} />
              <button type="submit" disabled={busy} className="mt-2 w-full rounded-lg bg-emerald-300 py-3 text-sm font-semibold text-emerald-950 transition-colors hover:bg-emerald-400 disabled:opacity-60">Enviar código</button>
              <Link to="/login" className="text-center text-sm font-medium text-emerald-700 hover:underline">Voltar para o login</Link>
            </form>
          </>
        ) : (
          <>
            <span className="flex h-12 w-12 items-center justify-center rounded-full bg-emerald-100 text-xl text-emerald-700"><MailOutlined /></span>
            <h2 className="mt-4 text-2xl font-bold text-gray-900 sm:text-3xl">Verifique seu e-mail</h2>
            <p className="mt-1 text-sm text-gray-500">Informe o código de 6 dígitos enviado para o e-mail cadastrado.</p>
            <form onSubmit={handleSubmitCodigo} className="mt-6 flex flex-col gap-4" noValidate>
              <FormField label="Código de verificação" type="text" inputMode="numeric" autoComplete="one-time-code" maxLength={6} placeholder="000000" value={codigo} onChange={(event) => setCodigo(maskNumeric(event.target.value, 6))} error={erroCodigo} />
              <button type="submit" disabled={busy} className="mt-2 w-full rounded-lg bg-emerald-300 py-3 text-sm font-semibold text-emerald-950 transition-colors hover:bg-emerald-400 disabled:opacity-60">Confirmar código</button>
              <Link to="/login" className="text-center text-sm font-medium text-emerald-700 hover:underline">Voltar para o login</Link>
            </form>
          </>
        )}
        {overlay && <ValidationOverlay status={overlay.status} validatingText={overlay.validatingText} successText={overlay.successText} />}
      </div>
    </AuthLayout>
  );
}

export default EsqueciSenha;
