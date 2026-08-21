import { Target, Eye, HeartHandshake } from 'lucide-react';
import MainLayout from '../../layouts/MainLayout/MainLayout';
import MissionCard from '../../components/Missao/MissaoCard/MissaoCard';
import InstitutionalSection from '../../components/Missao/InstitutionalSection/InstitutionalSection';

// Dados dos três cards principais da página.
// Mantidos em um array para permitir a renderização via map()
// e facilitar futuras alterações de conteúdo.
const missionCards = [
  {
    icon: Target,
    title: 'MISSÃO',
    description:
      'Democratizar o acesso à informação vacinal e conectar cidadãos, profissionais e gestores em um sistema seguro e transparente.',
  },
  {
    icon: Eye,
    title: 'VISÃO',
    description:
      'Ser a principal plataforma de gestão vacinal no Brasil, referência em rastreabilidade, segurança e combate à desinformação.',
  },
  {
    icon: HeartHandshake,
    title: 'VALORES',
    description:
      'Transparência, ética, inclusão, ciência, humanização e compromisso com a saúde pública brasileira.',
  },
];

// Parágrafos da seção institucional exibida no final da página.
const institutionalParagraphs = [
  'O Vac+ nasceu da convicção de que vacinação é um direito de todos e que a tecnologia pode ser uma aliada poderosa para garantir cobertura, rastreabilidade e confiança nesse processo. Conectamos UBSs, clínicas privadas, profissionais e cidadãos em uma única plataforma.',
  'Combatemos a desinformação com conteúdo validado, oferecemos ferramentas de gestão para unidades de saúde e empoderamos o cidadão com sua caderneta vacinal digital. Tudo isso seguindo rigorosamente a LGPD e as diretrizes do Ministério da Saúde.',
];

function Missao() {
  return (
    <MainLayout>
      <div className="flex flex-col gap-6">
        {/* Cabeçalho da página */}
        <header>
          <h1 className="text-2xl font-bold text-gray-900">
            Quem somos e o que nos move
          </h1>
          <p className="mt-1 text-sm text-gray-600">
            Uma healthtech brasileira dedicada à imunização inteligente,
            transparente e acessível.
          </p>
        </header>

        {/* Cards de Missão, Visão e Valores */}
        <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
          {missionCards.map((card) => (
            <MissionCard
              key={card.title}
              icon={card.icon}
              title={card.title}
              description={card.description}
            />
          ))}
        </div>

        {/* Seção institucional */}
        <InstitutionalSection
          title="TECNOLOGIA À SERVIÇO DA SAÚDE PÚBLICA"
          paragraphs={institutionalParagraphs}
        />
      </div>
    </MainLayout>
  );
}

export default Missao;
