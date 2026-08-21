import { useState, type FormEvent } from 'react';
import { CheckCircleOutlined } from '@ant-design/icons';
import AuthLayout from '../../layouts/AuthLayout/AuthLayout';
import FormField from '../../components/form/FormField/FormField';
import { maskCPF } from '../../utils/masks';

interface LoginErrors {
  cpf?: string;
  senha?: string;
}

function Login() {
  const [cpf, setCpf] = useState('');
  const [senha, setSenha] = useState('');
  const [errors, setErrors] = useState<LoginErrors>({});
  const [enviado, setEnviado] = useState(false);

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const novosErros: LoginErrors = {};
    if (!cpf.trim()) novosErros.cpf = 'CPF é obrigatório.';
    if (!senha.trim()) novosErros.senha = 'Senha é obrigatória.';

    setErrors(novosErros);
    setEnviado(Object.keys(novosErros).length === 0);
  }

  return (
    <AuthLayout>
      <h2 className="text-2xl font-bold text-gray-900 sm:text-3xl">
        Bem-vindo de volta
      </h2>
      <p className="mt-1 text-sm text-gray-500">Acesse sua conta Vac+</p>

      <form
        onSubmit={handleSubmit}
        className="mt-6 flex flex-col gap-4"
        noValidate
      >
        <FormField
          label="CPF"
          type="text"
          inputMode="numeric"
          placeholder="123.456.789-00"
          value={cpf}
          onChange={(event) => setCpf(maskCPF(event.target.value))}
          error={errors.cpf}
        />

        <FormField
          label="Senha"
          type="password"
          value={senha}
          onChange={(event) => setSenha(event.target.value)}
          error={errors.senha}
        />

        <p className="text-sm text-gray-600">
          Não tem conta?{' '}
          <a href="#" className="font-medium text-emerald-700 hover:underline">
            Cadastre-se
          </a>
        </p>

        {enviado && (
          <p className="flex items-center gap-2 rounded-lg bg-emerald-50 px-3 py-2 text-sm text-emerald-700">
            <CheckCircleOutlined />
            Dados válidos! A autenticação será integrada futuramente.
          </p>
        )}

        <button
          type="submit"
          className="mt-2 w-full rounded-lg bg-emerald-300 py-3 text-sm font-semibold text-emerald-950 transition-colors hover:bg-emerald-400"
        >
          Entrar
        </button>
      </form>
    </AuthLayout>
  );
}

export default Login;
