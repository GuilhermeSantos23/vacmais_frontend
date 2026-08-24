import { useState } from 'react';

interface AgeGroupSchedule {
  age: string;
  vaccines: string[];
}

const tabs = [
  'Crianças',
  'Gestantes',
  'Idosos',
  'Imunosuprimidos',
  'Profissionais',
  'Viajantes',
  'Comorbidades',
];

const childrenSchedule: AgeGroupSchedule[] = [
  { age: 'Ao nascer', vaccines: ['BCG', 'Hepatite B'] },
  { age: '2 meses', vaccines: ['Penta', 'VIP', 'Pneumo 10', 'Rota Vírus'] },
  { age: '4 meses', vaccines: ['Penta', 'VIP', 'Pneumo 10', 'Rota Vírus'] },
  { age: '6 meses', vaccines: ['Penta', 'VIP', 'Influenza', 'Rota Vírus'] },
  { age: '12 meses', vaccines: ['Tríplice Viral', 'Pneumo 10', 'Meningo C'] },
  { age: '15 meses', vaccines: ['DTP', 'VOP', 'Hepatite A', 'Tetra Viral'] },
];

function Calendario() {
  const [activeTab, setActiveTab] = useState('Crianças');

  const schedule = activeTab === 'Crianças' ? childrenSchedule : [];

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-800">Calendário Vacinal</h1>
      <p className="mt-1 text-sm text-gray-500">
        Visualize o calendário vacinal atualizado para cada público
      </p>

      <div className="mt-4 flex flex-wrap gap-5 border-b border-gray-200">
        {tabs.map((tab) => (
          <button
            key={tab}
            type="button"
            onClick={() => setActiveTab(tab)}
            className={`pb-2 text-sm font-medium ${
              activeTab === tab
                ? 'border-b-2 border-emerald-700 text-emerald-700'
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      <div className="mt-6 rounded-lg border border-gray-100 bg-white p-5 shadow-sm">
        <h2 className="text-base font-bold text-gray-800">Idade/Momento</h2>

        <div className="mt-4 flex flex-col divide-y divide-gray-100">
          {schedule.length > 0 ? (
            schedule.map((item) => (
              <div
                key={item.age}
                className="flex flex-col gap-3 py-4 sm:flex-row sm:items-center sm:gap-6"
              >
                <span className="w-28 shrink-0 text-sm font-medium text-gray-700">
                  {item.age}
                </span>
                <div className="flex flex-wrap gap-2">
                  {item.vaccines.map((vaccine) => (
                    <span
                      key={vaccine}
                      className="rounded-full bg-emerald-100 px-3 py-1 text-xs font-medium text-emerald-800"
                    >
                      {vaccine}
                    </span>
                  ))}
                </div>
              </div>
            ))
          ) : (
            <p className="py-4 text-sm text-gray-400">
              Calendário em breve para este público.
            </p>
          )}
        </div>
      </div>
    </div>
  );
}

export default Calendario;