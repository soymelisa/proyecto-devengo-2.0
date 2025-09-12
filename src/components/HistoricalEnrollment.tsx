import React, { useState } from 'react';
import { History, Users, TrendingUp, Calendar, Filter, Download, Search, Eye, Plus, AlertTriangle } from 'lucide-react';
import { mockActiveStudents, mockEnrollmentProjections, mockMonthlyEnrollmentCuts } from '../data/mockData';

const HistoricalEnrollment: React.FC = () => {
  const [activeTab, setActiveTab] = useState('summary');
  const [selectedBrand, setSelectedBrand] = useState('all');
  const [selectedCampus, setSelectedCampus] = useState('all');
  const [selectedProgram, setSelectedProgram] = useState('all');
  const [selectedPeriod, setSelectedPeriod] = useState('2024-01');

  const tabs = [
    { id: 'summary', name: 'Resumen', icon: History },
    { id: 'students', name: 'Lista de Estudiantes', icon: Users }
  ];

  // Filtrar estudiantes activos
  const filteredStudents = mockActiveStudents.filter(student => {
    return (selectedBrand === 'all' || student.brand === selectedBrand) &&
           (selectedCampus === 'all' || student.campus === selectedCampus) &&
           (selectedProgram === 'all' || student.program === selectedProgram);
  });

  // Calcular métricas
  const totalStudents = filteredStudents.length;
  const activeStudents = filteredStudents.filter(s => s.status === 'Activa').length;
  const riskStudents = filteredStudents.filter(s => s.status === 'Activa en Riesgo').length;
  const noCxCStudents = filteredStudents.filter(s => s.status === 'Activa sin CxC').length;
  const nextCycleEnrolled = filteredStudents.filter(s => s.nextCycleEnrolled).length;

  // Análisis por tipo de inscripción
  const enrollmentTypeAnalysis = {
    'RI': filteredStudents.filter(s => s.enrollmentType === 'RI').length,
    'NI': filteredStudents.filter(s => s.enrollmentType === 'NI').length,
    'RA': filteredStudents.filter(s => s.enrollmentType === 'RA').length
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Activa': return 'bg-green-100 text-green-800 border-green-200';
      case 'Activa en Riesgo': return 'bg-orange-100 text-orange-800 border-orange-200';
      case 'Activa sin CxC': return 'bg-blue-100 text-blue-800 border-blue-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getEnrollmentTypeColor = (type: string) => {
    switch (type) {
      case 'RI': return 'bg-blue-100 text-blue-800';
      case 'NI': return 'bg-green-100 text-green-800';
      case 'RA': return 'bg-purple-100 text-purple-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getEnrollmentTypeName = (type: string) => {
    switch (type) {
      case 'RI': return 'Reinscripción';
      case 'NI': return 'Nuevo Ingreso';
      case 'RA': return 'Reactivación';
      default: return type;
    }
  };

  return (
    <div className="p-6">
      <div className="mb-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Matrícula Histórica</h1>
            <p className="text-gray-600 mt-2">Análisis histórico de matrícula activa y caracterización de estudiantes</p>
          </div>
          <button 
            onClick={() => alert('Función de reporte de errores - En desarrollo')}
            className="flex items-center px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-colors"
          >
            <AlertTriangle className="w-4 h-4 mr-2" />
            Reportar Error
          </button>
        </div>
      </div>

      {/* Filtros */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 mb-6">
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Período</label>
            <select
              value={selectedPeriod}
              onChange={(e) => setSelectedPeriod(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="2024-01">2024-01</option>
              <option value="2023-02">2023-02</option>
              <option value="2023-01">2023-01</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Marca</label>
            <select
              value={selectedBrand}
              onChange={(e) => setSelectedBrand(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="all">Todas las Marcas</option>
              <option value="Lottus">Lottus</option>
              <option value="UVM">UVM</option>
              <option value="UNITEC">UNITEC</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Campus</label>
            <select
              value={selectedCampus}
              onChange={(e) => setSelectedCampus(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="all">Todos los Campus</option>
              <option value="Ciudad de México">Ciudad de México</option>
              <option value="Guadalajara">Guadalajara</option>
              <option value="Monterrey">Monterrey</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Programa</label>
            <select
              value={selectedProgram}
              onChange={(e) => setSelectedProgram(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="all">Todos los Programas</option>
              <option value="Ingeniería en Sistemas">Ingeniería en Sistemas</option>
              <option value="Administración de Empresas">Administración de Empresas</option>
              <option value="Derecho">Derecho</option>
            </select>
          </div>

          <div className="flex items-end">
            <button className="w-full flex items-center justify-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
              <Filter className="w-4 h-4 mr-2" />
              Aplicar
            </button>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 mb-6">
        <div className="border-b border-gray-200">
          <nav className="flex">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center px-6 py-4 text-sm font-medium border-b-2 transition-colors ${
                    activeTab === tab.id
                      ? 'border-blue-500 text-blue-600'
                      : 'border-transparent text-gray-600 hover:text-gray-900 hover:border-gray-300'
                  }`}
                >
                  <Icon className="w-4 h-4 mr-2" />
                  {tab.name}
                </button>
              );
            })}
          </nav>
        </div>

        <div className="p-6">
          {activeTab === 'summary' && (
            <div>
              {/* Métricas principales */}
              <div className="grid grid-cols-1 md:grid-cols-5 gap-6 mb-8">
                <div className="bg-blue-50 border border-blue-200 rounded-xl p-6">
                  <div className="flex items-center justify-between">
                    <div className="p-3 rounded-lg bg-blue-100">
                      <Users className="w-6 h-6 text-blue-600" />
                    </div>
                  </div>
                  <div className="mt-4">
                    <h3 className="text-2xl font-bold text-blue-900">{totalStudents}</h3>
                    <p className="text-blue-700 text-sm mt-1">Total Estudiantes</p>
                  </div>
                </div>

                <div className="bg-green-50 border border-green-200 rounded-xl p-6">
                  <div className="flex items-center justify-between">
                    <div className="p-3 rounded-lg bg-green-100">
                      <TrendingUp className="w-6 h-6 text-green-600" />
                    </div>
                  </div>
                  <div className="mt-4">
                    <h3 className="text-2xl font-bold text-green-900">{activeStudents}</h3>
                    <p className="text-green-700 text-sm mt-1">Matrícula Activa</p>
                    <p className="text-xs text-green-600 mt-1">
                      {Math.round((activeStudents / totalStudents) * 100)}% del total
                    </p>
                  </div>
                </div>

                <div className="bg-orange-50 border border-orange-200 rounded-xl p-6">
                  <div className="flex items-center justify-between">
                    <div className="p-3 rounded-lg bg-orange-100">
                      <AlertTriangle className="w-6 h-6 text-orange-600" />
                    </div>
                  </div>
                  <div className="mt-4">
                    <h3 className="text-2xl font-bold text-orange-900">{riskStudents}</h3>
                    <p className="text-orange-700 text-sm mt-1">En Riesgo</p>
                    <p className="text-xs text-orange-600 mt-1">Requiere seguimiento</p>
                  </div>
                </div>

                <div className="bg-purple-50 border border-purple-200 rounded-xl p-6">
                  <div className="flex items-center justify-between">
                    <div className="p-3 rounded-lg bg-purple-100">
                      <Calendar className="w-6 h-6 text-purple-600" />
                    </div>
                  </div>
                  <div className="mt-4">
                    <h3 className="text-2xl font-bold text-purple-900">{noCxCStudents}</h3>
                    <p className="text-purple-700 text-sm mt-1">Sin CxC</p>
                    <p className="text-xs text-purple-600 mt-1">Al corriente</p>
                  </div>
                </div>

                <div className="bg-indigo-50 border border-indigo-200 rounded-xl p-6">
                  <div className="flex items-center justify-between">
                    <div className="p-3 rounded-lg bg-indigo-100">
                      <Users className="w-6 h-6 text-indigo-600" />
                    </div>
                  </div>
                  <div className="mt-4">
                    <h3 className="text-2xl font-bold text-indigo-900">{nextCycleEnrolled}</h3>
                    <p className="text-indigo-700 text-sm mt-1">Próximo Ciclo</p>
                    <p className="text-xs text-indigo-600 mt-1">
                      {Math.round((nextCycleEnrolled / totalStudents) * 100)}% inscritos
                    </p>
                  </div>
                </div>
              </div>

              {/* Análisis por tipo de inscripción */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
                <div className="bg-white border border-gray-200 rounded-xl p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Distribución por Tipo de Inscripción</h3>
                  <div className="space-y-4">
                    {Object.entries(enrollmentTypeAnalysis).map(([type, count]) => (
                      <div key={type} className="flex items-center justify-between">
                        <div className="flex items-center">
                          <span className={`px-3 py-1 text-sm font-medium rounded-full mr-3 ${getEnrollmentTypeColor(type)}`}>
                            {type}
                          </span>
                          <span className="text-sm text-gray-700">{getEnrollmentTypeName(type)}</span>
                        </div>
                        <div className="flex items-center">
                          <div className="w-24 bg-gray-200 rounded-full h-2 mr-3">
                            <div 
                              className="bg-blue-500 h-2 rounded-full"
                              style={{ width: `${(count / totalStudents) * 100}%` }}
                            ></div>
                          </div>
                          <span className="text-sm font-bold text-gray-900">{count}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="bg-white border border-gray-200 rounded-xl p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Cortes Mensuales de Matrícula</h3>
                  <div className="space-y-3">
                    {mockMonthlyEnrollmentCuts.map((cut) => (
                      <div key={cut.id} className="border border-gray-200 rounded-lg p-3">
                        <div className="flex items-center justify-between mb-2">
                          <h4 className="font-medium text-gray-900">{cut.month} {cut.year}</h4>
                          <span className="text-sm text-gray-600">{cut.cutDate}</span>
                        </div>
                        <div className="grid grid-cols-3 gap-3 text-sm">
                          <div className="text-center">
                            <p className="font-bold text-green-600">{cut.totalActive}</p>
                            <p className="text-xs text-gray-600">Activos</p>
                          </div>
                          <div className="text-center">
                            <p className="font-bold text-orange-600">{cut.totalRisk}</p>
                            <p className="text-xs text-gray-600">En Riesgo</p>
                          </div>
                          <div className="text-center">
                            <p className="font-bold text-blue-600">{cut.totalNoCxC}</p>
                            <p className="text-xs text-gray-600">Sin CxC</p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'students' && (
            <div>
              {/* Barra de búsqueda y filtros */}
              <div className="flex items-center justify-between mb-6">
                <div className="relative flex-1 max-w-md">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <input
                    type="text"
                    placeholder="Buscar estudiante..."
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
                <div className="flex items-center space-x-3">
                  <button className="flex items-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors">
                    <Download className="w-4 h-4 mr-2" />
                    Exportar
                  </button>
                </div>
              </div>

              {/* Tabla de estudiantes */}
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50 border-b border-gray-200">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Estudiante
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Programa
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Campus
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Modalidad
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Tipo
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Estado
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Total Pagado
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Próximo Ciclo
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Acciones
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {filteredStudents.map((student) => (
                      <tr key={student.id} className="hover:bg-gray-50 transition-colors">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div>
                            <div className="text-sm font-medium text-gray-900">{student.name}</div>
                            <div className="text-sm text-gray-500">{student.programLevel}</div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {student.program}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {student.campus}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {student.modality}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`px-2 py-1 text-xs font-medium rounded-full ${getEnrollmentTypeColor(student.enrollmentType)}`}>
                            {student.enrollmentType}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`px-3 py-1 text-xs font-medium rounded-full border ${getStatusColor(student.status)}`}>
                            {student.status}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                          ${student.totalPaid.toLocaleString()}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`px-3 py-1 text-xs font-medium rounded-full border ${
                            student.nextCycleEnrolled 
                              ? 'bg-green-100 text-green-800 border-green-200' 
                              : 'bg-red-100 text-red-800 border-red-200'
                          }`}>
                            {student.nextCycleEnrolled ? 'Inscrito' : 'No inscrito'}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                          <button className="text-blue-600 hover:text-blue-900 transition-colors">
                            <Eye className="w-4 h-4" />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default HistoricalEnrollment;