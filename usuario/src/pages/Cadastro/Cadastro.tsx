import { useState, type FormEvent } from 'react';
import { CheckCircleOutlined } from '@ant-design/icons';
import AuthLayout from '../../layouts/AuthLayout/AuthLayout';
import FormField from '../../components/form/FormField/FormField';
import { maskCPF, maskTelefone } from '../../utils/masks';

interface CadastroErrors {
  nome?: string;
  cpf?: string;
  telefone?: string;
  email?: string;
  senha?: string;
}

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function Cadastro() {
  const [nome, setNome] = useState('');
  const [cpf, setCpf] = useState('');
  const [cartaoSus, setCartaoSus] = useState('');
  const [telefone, setTelefone] = useState('');
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [errors, setErrors] = useState<CadastroErrors>({});
  const [enviado, setEnviado] = useState(false);

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const novosErros: CadastroErrors = {};
    if (!nome.trim()) novosErros.nome = 'Nome completo é obrigatório.';
    if (!cpf.trim()) novosErros.cpf = 'CPF é obrigatório.';
    if (!telefone.trim()) novosErros.telefone = 'Telefone é obrigatório.';
    if (!email.trim()) {
      novosErros.email = 'E-mail é obrigatório.';
    } else if (!EMAIL_REGEX.test(email)) {
      novosErros.email = 'Informe um e-mail válido.';
    }
    if (!senha.trim()) novosErros.senha = 'Senha é obrigatória.';
    // Cartão SUS é opcional, por isso não entra na validação.

    setErrors(novosErros);
    setEnviado(Object.keys(novosErros).length === 0);
  }

  return (
    <AuthLayout>
      <h2 className="text-2xl font-bold text-gray-900 sm:text-3xl">
        Criar conta de cidadão
      </h2>
      <p className="mt-1 text-sm text-gray-500">
        Acesse sua caderneta vacinal digital em segundos
      </p>

      <form
        onSubmit={handleSubmit}
        className="mt-6 flex flex-col gap-4"
        noValidate
      >
        <FormField
          label="Nome completo"
          type="text"
          value={nome}
          onChange={(event) => setNome(event.target.value)}
          error={errors.nome}
        />

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
          <FormField
            label="CPF"
            type="text"
            inputMode="numeric"
            placeholder="000.000.000-00"
            value={cpf}
            onChange={(event) => setCpf(maskCPF(event.target.value))}
            error={errors.cpf}
          />

          <FormField
            label="Cartão SUS"
            type="text"
            inputMode="numeric"
            placeholder="opcional"
            value={cartaoSus}
            onChange={(event) => setCartaoSus(event.target.value)}
          />

          <FormField
            label="Telefone"
            type="tel"
            placeholder="(00) 00000-0000"
            value={telefone}
            onChange={(event) => setTelefone(maskTelefone(event.target.value))}
            error={errors.telefone}
          />
        </div>

        <FormField
          label="E-mail"
          type="email"
          value={email}
          onChange={(event) => setEmail(event.target.value)}
          error={errors.email}
        />

        <FormField
          label="Senha"
          type="password"
          value={senha}
          onChange={(event) => setSenha(event.target.value)}
          error={errors.senha}
        />

        <p className="text-sm text-gray-600">
          Já tem conta?{' '}
          <a href="#" className="font-medium text-emerald-700 hover:underline">
            Entre
          </a>
        </p>

        {enviado && (
          <p className="flex items-center gap-2 rounded-lg bg-emerald-50 px-3 py-2 text-sm text-emerald-700">
            <CheckCircleOutlined />
            Dados válidos! O cadastro será integrado futuramente.
          </p>
        )}

        <button
          type="submit"
          className="mt-2 w-full rounded-lg bg-emerald-300 py-3 text-sm font-semibold text-emerald-950 transition-colors hover:bg-emerald-400"
        >
          Criar conta
        </button>
      </form>
    </AuthLayout>
  );
}

export default Cadastro;
