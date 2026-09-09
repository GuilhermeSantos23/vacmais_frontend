interface ComingSoonProps {
  title: string;
}

/**
 * Placeholder para itens de navegação que ainda não possuem tela própria.
 * O foco deste trabalho é exclusivamente Clínicas Privadas.
 */
function ComingSoon({ title }: ComingSoonProps) {
  return (
    <div className="flex flex-col items-center justify-center gap-2 rounded-lg border border-dashed border-gray-300 bg-white px-6 py-20 text-center">
      <h1 className="text-xl font-semibold text-gray-900">{title}</h1>
      <p className="text-sm text-gray-500">Esta área ainda será implementada.</p>
    </div>
  );
}

export default ComingSoon;
