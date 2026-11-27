import { useState, type FormEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import AuthLayout from '../../layouts/AuthLayout/AuthLayout';
import FormField from '../../components/form/FormField/FormField';
import { useUser } from '../../hooks/useUser';

function AlterarSenha() {
  const [senhaAtual, setSenhaAtual] = useState('');
  const [senhaNova, setSenhaNova] = useState('');
  const [confirmacao, setConfirmacao] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { changePassword } = useUser();

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError('');
    if (!senhaAtual) return setError('Informe sua senha atual.');
    if (senhaNova.length < 8) return setError('A nova senha deve possuir pelo menos 8 caracteres.');
    if (senhaNova !== confirmacao) return setError('A confirmação da nova senha não confere.');

    setLoading(true);
    try {
      const result = await changePassword(senhaAtual, senhaNova, confirmacao);
      if (!result.success) { setError(result.message); return; }
      navigate('/dashboard', { replace: true });
    } catch (requestError) {
      setError(requestError instanceof Error ? requestError.message : 'Não foi possível alterar a senha.');
    } finally { setLoading(false); }
  }

  return (
    <AuthLayout>
      <div>
        <h2 className="text-2xl font-bold text-gray-900 sm:text-3xl">Atualize sua senha</h2>
        <p className="mt-1 text-sm text-gray-500">Para continuar, cadastre uma nova senha para sua conta.</p>
        <form onSubmit={handleSubmit} className="mt-6 flex flex-col gap-4" noValidate>
          <FormField label="Senha atual" type="password" autoComplete="current-password" value={senhaAtual} onChange={(event) => setSenhaAtual(event.target.value)} />
          <FormField label="Nova senha" type="password" autoComplete="new-password" value={senhaNova} onChange={(event) => setSenhaNova(event.target.value)} />
          <FormField label="Confirmar nova senha" type="password" autoComplete="new-password" value={confirmacao} onChange={(event) => setConfirmacao(event.target.value)} />
          {error && <p role="alert" className="text-sm text-red-600">{error}</p>}
          <button type="submit" disabled={loading} className="mt-2 w-full rounded-lg bg-emerald-300 py-3 text-sm font-semibold text-emerald-950 transition-colors hover:bg-emerald-400 disabled:cursor-not-allowed disabled:opacity-60">
            {loading ? 'Salvando...' : 'Salvar nova senha'}
          </button>
        </form>
      </div>
    </AuthLayout>
  );
}
export default AlterarSenha;
