import { useState, type FormEvent } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { MailOutlined } from '@ant-design/icons';
import AuthLayout from '../../layouts/AuthLayout/AuthLayout';
import FormField from '../../components/form/FormField/FormField';
import ValidationOverlay from '../../components/common/ValidationOverlay/ValidationOverlay';
import { maskCPF, maskNumeric } from '../../utils/masks';

type Etapa = 'identificador' | 'codigo';
type ValidationStep = 'idle' | 'validating' | 'success';

/**
 * MOCK visual até o backend receber os endpoints específicos de recuperação
 * de admin_unidade. Não consulta o banco nem envia e-mail nesta versão.
 * Qualquer código de 6 dígitos é aprovado pelo mock e retorna ao login.
 */
function EsqueciSenha() {
  const [etapa, setEtapa] = useState<Etapa>('identificador');
  const [validationStep, setValidationStep] = useState<ValidationStep>('idle');
  const [cpf, setCpf] = useState('');
  const [cpfErro, setCpfErro] = useState('');
  const [codigo, setCodigo] = useState('');
  const [codigoErro, setCodigoErro] = useState('');
  const [codigoUnidade, setCodigoUnidade] = useState('');
  const [unidadeError, setUnidadeError] = useState('');
  const navigate = useNavigate();

  function avancarComValidacao(proximaEtapa: Etapa) {
    setValidationStep('validating');
    window.setTimeout(() => {
      setValidationStep('success');
      window.setTimeout(() => {
        setValidationStep('idle');
        setEtapa(proximaEtapa);
      }, 700);
    }, 650);
  }

  function aprovarCodigoMock() {
    setValidationStep('validating');
    window.setTimeout(() => {
      setValidationStep('success');
      window.setTimeout(() => navigate('/login', { replace: true }), 700);
    }, 650);
  }

  function handleSubmitIdentificador(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const cpfOk = cpf.replace(/\D/g, '').length === 11;
    const unidadeOk = codigoUnidade.replace(/\D/g, '').length === 6;
    setCpfErro(cpfOk ? '' : 'Informe um CPF com 11 dígitos.');
    setUnidadeError(unidadeOk ? '' : 'Informe o código da unidade com 6 dígitos.');
    if (!cpfOk || !unidadeOk) return;
    avancarComValidacao('codigo');
  }

  function handleSubmitCodigo(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (codigo.replace(/\D/g, '').length !== 6) {
      setCodigoErro('Informe o código de 6 dígitos recebido por e-mail.');
      return;
    }
    setCodigoErro('');
    aprovarCodigoMock();
  }

  const validatingTextoPorEtapa: Record<Etapa, string> = {
    identificador: 'Localizando cadastro...',
    codigo: 'Confirmando código...',
  };
  const successTextoPorEtapa: Record<Etapa, string> = {
    identificador: 'Solicitação aprovada',
    codigo: 'Código aprovado',
  };

  return (
    <AuthLayout>
      <div className="relative">
        {etapa === 'identificador' && (
          <>
            <h2 className="text-2xl font-bold text-gray-900 sm:text-3xl">Esqueci a senha</h2>
            <p className="mt-1 text-sm text-gray-500">
              Informe o CPF e o código da unidade para solicitar um código de verificação ao e-mail cadastrado.
            </p>
            <form onSubmit={handleSubmitIdentificador} className="mt-6 flex flex-col gap-4" noValidate>
              <FormField label="CPF" type="text" inputMode="numeric" placeholder="123.456.789-00" value={cpf} onChange={(event) => setCpf(maskCPF(event.target.value))} error={cpfErro} />
              <FormField label="Código da unidade" type="text" inputMode="numeric" maxLength={6} placeholder="123456" value={codigoUnidade} onChange={(event) => setCodigoUnidade(maskNumeric(event.target.value, 6))} error={unidadeError} />
              <button type="submit" className="mt-2 w-full rounded-lg bg-emerald-300 py-3 text-sm font-semibold text-emerald-950 transition-colors hover:bg-emerald-400">Enviar código</button>
              <Link to="/login" className="text-center text-sm font-medium text-emerald-700 hover:underline">Voltar para o login</Link>
            </form>
          </>
        )}
        {etapa === 'codigo' && (
          <>
            <span className="flex h-12 w-12 items-center justify-center rounded-full bg-emerald-100 text-xl text-emerald-700"><MailOutlined /></span>
            <h2 className="mt-4 text-2xl font-bold text-gray-900 sm:text-3xl">Verifique seu e-mail</h2>
            <p className="mt-1 text-sm text-gray-500">Informe o código de 6 dígitos enviado para o e-mail cadastrado.</p>
            <form onSubmit={handleSubmitCodigo} className="mt-6 flex flex-col gap-4" noValidate>
              <FormField label="Código de verificação" type="text" inputMode="numeric" autoComplete="one-time-code" maxLength={6} placeholder="000000" value={codigo} onChange={(event) => setCodigo(maskNumeric(event.target.value, 6))} error={codigoErro} />
              <button type="submit" className="mt-2 w-full rounded-lg bg-emerald-300 py-3 text-sm font-semibold text-emerald-950 transition-colors hover:bg-emerald-400">Confirmar código</button>
              <Link to="/login" className="text-center text-sm font-medium text-emerald-700 hover:underline">Voltar para o login</Link>
            </form>
          </>
        )}
        {validationStep !== 'idle' && (
          <ValidationOverlay status={validationStep === 'validating' ? 'validating' : 'success'} validatingText={validatingTextoPorEtapa[etapa]} successText={successTextoPorEtapa[etapa]} />
        )}
      </div>
    </AuthLayout>
  );
}

export default EsqueciSenha;
