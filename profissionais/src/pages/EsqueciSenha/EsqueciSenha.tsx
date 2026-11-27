import { useState, type FormEvent } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { MailOutlined } from '@ant-design/icons';
import AuthLayout from '../../layouts/AuthLayout/AuthLayout';
import FormField from '../../components/form/FormField/FormField';
import ValidationOverlay from '../../components/common/ValidationOverlay/ValidationOverlay';
import { maskCPF, maskNumeric } from '../../utils/masks';

type Step = 'identificador' | 'codigo';
type OverlayStatus = 'idle' | 'validating' | 'success';

/**
 * MOCK visual até o backend disponibilizar recuperação por e-mail para profissional.
 * Não envia e-mail nem valida a existência da conta. CPF/unidade são validados
 * apenas pelo formato; qualquer código de 6 dígitos recebe aprovação simulada.
 * Após a aprovação, retorna ao login. O fluxo não cria sessão nem troca senha.
 */
function EsqueciSenha() {
  const navigate = useNavigate();
  const [step, setStep] = useState<Step>('identificador');
  const [overlay, setOverlay] = useState<OverlayStatus>('idle');
  const [cpf, setCpf] = useState('');
  const [codigoUnidade, setCodigoUnidade] = useState('');
  const [codigoEmail, setCodigoEmail] = useState('');
  const [erroCpf, setErroCpf] = useState('');
  const [erroUnidade, setErroUnidade] = useState('');
  const [erroCodigo, setErroCodigo] = useState('');

  function handleIdentificador(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const cpfOk = cpf.replace(/\D/g, '').length === 11;
    const unidadeOk = codigoUnidade.replace(/\D/g, '').length === 6;
    setErroCpf(cpfOk ? '' : 'Informe um CPF válido.');
    setErroUnidade(unidadeOk ? '' : 'Informe o código da unidade com 6 dígitos.');
    if (!cpfOk || !unidadeOk) return;
    setOverlay('validating');
    window.setTimeout(() => {
      setOverlay('success');
      window.setTimeout(() => { setOverlay('idle'); setStep('codigo'); }, 700);
    }, 650);
  }

  function handleCodigo(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (codigoEmail.replace(/\D/g, '').length !== 6) {
      setErroCodigo('Informe o código de 6 dígitos recebido por e-mail.');
      return;
    }
    setErroCodigo('');
    setOverlay('validating');
    window.setTimeout(() => {
      setOverlay('success');
      window.setTimeout(() => navigate('/login', { replace: true }), 700);
    }, 650);
  }

  return (
    <AuthLayout>
      <div className="relative">
        {step === 'identificador' ? (
          <>
            <h2 className="text-2xl font-bold text-gray-900 sm:text-3xl">Esqueci minha senha</h2>
            <p className="mt-1 text-sm text-gray-500">Informe seu CPF e o código da unidade para solicitar a recuperação.</p>
            <form onSubmit={handleIdentificador} className="mt-6 flex flex-col gap-4" noValidate>
              <FormField label="CPF" type="text" inputMode="numeric" autoComplete="username" placeholder="123.456.789-00" value={cpf} onChange={(event) => setCpf(maskCPF(event.target.value))} error={erroCpf} />
              <FormField label="Código da unidade" type="text" inputMode="numeric" maxLength={6} placeholder="123456" value={codigoUnidade} onChange={(event) => setCodigoUnidade(maskNumeric(event.target.value, 6))} error={erroUnidade} />
              <button type="submit" className="mt-2 w-full rounded-lg bg-emerald-300 py-3 text-sm font-semibold text-emerald-950 transition-colors hover:bg-emerald-400">Enviar código</button>
              <Link to="/login" className="text-center text-sm font-medium text-emerald-700 hover:underline">Voltar para o login</Link>
            </form>
          </>
        ) : (
          <>
            <span className="flex h-12 w-12 items-center justify-center rounded-full bg-emerald-100 text-xl text-emerald-700"><MailOutlined /></span>
            <h2 className="mt-4 text-2xl font-bold text-gray-900 sm:text-3xl">Verifique seu e-mail</h2>
            <p className="mt-1 text-sm text-gray-500">Informe o código de 6 dígitos enviado para o e-mail cadastrado.</p>
            <form onSubmit={handleCodigo} className="mt-6 flex flex-col gap-4" noValidate>
              <FormField label="Código de verificação" type="text" inputMode="numeric" autoComplete="one-time-code" maxLength={6} placeholder="000000" value={codigoEmail} onChange={(event) => setCodigoEmail(maskNumeric(event.target.value, 6))} error={erroCodigo} />
              <button type="submit" className="mt-2 w-full rounded-lg bg-emerald-300 py-3 text-sm font-semibold text-emerald-950 transition-colors hover:bg-emerald-400">Confirmar código</button>
              <Link to="/login" className="text-center text-sm font-medium text-emerald-700 hover:underline">Voltar para o login</Link>
            </form>
          </>
        )}
        {overlay !== 'idle' && (
          <ValidationOverlay
            status={overlay}
            validatingText={step === 'identificador' ? 'Localizando cadastro...' : 'Confirmando código...'}
            successText={step === 'identificador' ? 'Código enviado' : 'Código aprovado'}
          />
        )}
      </div>
    </AuthLayout>
  );
}

export default EsqueciSenha;
