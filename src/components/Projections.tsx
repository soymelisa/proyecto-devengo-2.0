import React, { useState } from 'react';
import { Calculator, TrendingUp, DollarSign, Users, Plus, X, Save, AlertTriangle, ChevronDown, Building2, BookOpen } from 'lucide-react';

interface ProjectionParameters {
  activeEnrollment: number;
  retentionRate: number;
  reinscriptionRate: number;
  discountRate: number;
  basePrice: number;
}

interface ProjectionResults {
  projectedRevenue: number;
  adjustedRevenue: number;
  studentCount: number;
  averagePayment: number;
}

interface Projection {
  id: string;
  version: string;
  createdBy: string;
  createdAt: string;
  campus: string[];
  program: string[];
  modality: string[];
  brand: string[];
  parameters: ProjectionParameters;
  results: ProjectionResults;
  isHypothetical?: boolean;
  hypotheticalTag?: string;
}

const Projections: React.FC = () => {
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [currentStep, setCurrentStep] = useState(1);
  const [selectedProjection, setSelectedProjection] = useState<Projection | null>(null);
  
  // Estados para multiselect
  const [showBrandDropdown, setShowBrandDropdown] = useState(false);
  const [showCampusDropdown, setShowCampusDropdown] = useState(false);
  const [showProgramDropdown, setShowProgramDropdown] = useState(false);
  const [showModalityDropdown, setShowModalityDropdown] = useState(false);

  const [newProjection, setNewProjection] = useState({
    version: '',
    brand: [] as string[],
    campus: [] as string[],
    program: [] as string[],
    modality: [] as string[],
    parameters: {
      activeEnrollment: 150,
      retentionRate: 85,
      reinscriptionRate: 90,
      discountRate: 10,
      basePrice: 12500
    },
    isHypothetical: false,
    hypotheticalTag: ''
  });

  // Mock data
  const mockProjections: Projection[] = [
    {
      id: '1',
      version: 'V2024.01',
      createdBy: 'Juan Pérez',
      createdAt: '2024-01-15',
      campus: ['Ciudad de México'],
      program: ['Ingeniería en Sistemas'],
      modality: ['Presencial'],
      brand: ['Lottus'],
      parameters: {
        activeEnrollment: 150,
        retentionRate: 85,
        reinscriptionRate: 90,
        discountRate: 10,
        basePrice: 12500
      },
      results: {
        projectedRevenue: 1595000,
        adjustedRevenue: 1435500,
        studentCount: 128,
        averagePayment: 11225
      }
    },
    {
      id: '2',
      version: 'V2024.02-HYP',
      createdBy: 'María García',
      createdAt: '2024-02-01',
      campus: ['Guadalajara', 'Monterrey'],
      program: ['Administración de Empresas', 'Derecho'],
      modality: ['Online', 'Sabatina'],
      brand: ['UVM'],
      parameters: {
        activeEnrollment: 200,
        retentionRate: 88,
        reinscriptionRate: 92,
        discountRate: 15,
        basePrice: 11000
      },
      results: {
        projectedRevenue: 1820000,
        adjustedRevenue: 1547000,
        studentCount: 184,
        averagePayment: 8408
      },
      isHypothetical: true,
      hypotheticalTag: 'EXPANSION-2025'
    }
  ];

  const availableBrands = ['Lottus', 'UVM', 'UNITEC', 'ULA', 'UANE'];
  const availableCampuses = ['Ciudad de México', 'Guadalajara', 'Monterrey', 'Puebla', 'Tijuana'];
  const availablePrograms = ['Ingeniería en Sistemas', 'Administración de Empresas', 'Derecho', 'Medicina', 'Psicología'];
  const availableModalities = ['Presencial', 'Online', 'Sabatina'];

  const handleMultiSelectToggle = (category: 'brand' | 'campus' | 'program' | 'modality', value: string) => {
    setNewProjection(prev => ({
      ...prev,
      [category]: prev[category].includes(value)
        ? prev[category].filter(item => item !== value)
        : [...prev[category], value]
    }));
  };

  const clearSelection = (category: 'brand' | 'campus' | 'program' | 'modality') => {
    setNewProjection(prev => ({
      ...prev,
      [category]: []
    }));
  };

  const removeTag = (category: 'brand' | 'campus' | 'program' | 'modality', value: string) => {
    setNewProjection(prev => ({
      ...prev,
      [category]: prev[category].filter(item => item !== value)
    }));
  };

  const calculateResults = (): ProjectionResults => {
    const { activeEnrollment, retentionRate, reinscriptionRate, discountRate, basePrice } = newProjection.parameters;
    
    const retainedStudents = Math.round(activeEnrollment * (retentionRate / 100));
    const reinscribedStudents = Math.round(retainedStudents * (reinscriptionRate / 100));
    const projectedRevenue = reinscribedStudents * basePrice;
    const adjustedRevenue = projectedRevenue * (1 - discountRate / 100);
    const averagePayment = adjustedRevenue / reinscribedStudents;

    return {
      projectedRevenue,
      adjustedRevenue,
      studentCount: reinscribedStudents,
      averagePayment
    };
  };

  const handleCreateProjection = () => {
    const results = calculateResults();
    console.log('Crear proyección:', { ...newProjection, results });
    setShowCreateModal(false);
    setCurrentStep(1);
    // Reset form
    setNewProjection({
      version: '',
      brand: [],
      campus: [],
      program: [],
      modality: [],
      parameters: {
        activeEnrollment: 150,
        retentionRate: 85,
        reinscriptionRate: 90,
        discountRate: 10,
        basePrice: 12500
      },
      isHypothetical: false,
      hypotheticalTag: ''
    });
  };

  const nextStep = () => {
    if (currentStep < 3) setCurrentStep(currentStep + 1);
  };

  const prevStep = () => {
    if (currentStep > 1) setCurrentStep(currentStep - 1);
  };

  const getBrandColor = (brand: string) => {
    const colors = {
      'Lottus': 'bg-teal-100 text-teal-800',
      'UVM': 'bg-blue-100 text-blue-800',
      'UNITEC': 'bg-purple-100 text-purple-800',
      'ULA': 'bg-green-100 text-green-800',
      'UANE': 'bg-orange-100 text-orange-800'
    };
    return colors[brand as keyof typeof colors] || 'bg-gray-100 text-gray-800';
  };

  return (
    <div className="p-6">
      <div className="mb-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Proyecciones Financieras</h1>
            <p className="text-gray-600 mt-2">Modelado y análisis de proyecciones de ingresos</p>
          </div>
          <div className="flex items-center space-x-3">
            <button 
              onClick={() => alert('Función de reporte de errores - En desarrollo')}
              className="flex items-center px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-colors"
            >
              <AlertTriangle className="w-4 h-4 mr-2" />
              Reportar Error
            </button>
            <button 
              onClick={() => setShowCreateModal(true)}
              className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              <Plus className="w-4 h-4 mr-2" />
              Nueva Proyección
            </button>
          </div>
        </div>
      </div>

      {/* Métricas principales */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <div className="flex items-center justify-between">
            <div className="p-3 rounded-lg bg-blue-50">
              <Calculator className="w-6 h-6 text-blue-600" />
            </div>
          </div>
          <div className="mt-4">
            <h3 className="text-2xl font-bold text-gray-900">{mockProjections.length}</h3>
            <p className="text-gray-600 text-sm mt-1">Proyecciones Activas</p>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <div className="flex items-center justify-between">
            <div className="p-3 rounded-lg bg-green-50">
              <DollarSign className="w-6 h-6 text-green-600" />
            </div>
          </div>
          <div className="mt-4">
            <h3 className="text-2xl font-bold text-gray-900">$3.4M</h3>
            <p className="text-gray-600 text-sm mt-1">Ingresos Proyectados</p>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <div className="flex items-center justify-between">
            <div className="p-3 rounded-lg bg-purple-50">
              <Users className="w-6 h-6 text-purple-600" />
            </div>
          </div>
          <div className="mt-4">
            <h3 className="text-2xl font-bold text-gray-900">312</h3>
            <p className="text-gray-600 text-sm mt-1">Estudiantes Proyectados</p>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <div className="flex items-center justify-between">
            <div className="p-3 rounded-lg bg-orange-50">
              <TrendingUp className="w-6 h-6 text-orange-600" />
            </div>
          </div>
          <div className="mt-4">
            <h3 className="text-2xl font-bold text-gray-900">87%</h3>
            <p className="text-gray-600 text-sm mt-1">Retención Promedio</p>
          </div>
        </div>
      </div>

      {/* Lista de proyecciones */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100">
        <div className="p-6 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900">Proyecciones Existentes</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Versión
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Marca
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Campus
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Programa
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Ingresos Proyectados
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Estudiantes
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Creado por
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Estado
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {mockProjections.map((projection) => (
                <tr key={projection.id} className="hover:bg-gray-50 cursor-pointer" onClick={() => setSelectedProjection(projection)}>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">{projection.version}</div>
                    <div className="text-sm text-gray-500">{projection.createdAt}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex flex-wrap gap-1">
                      {projection.brand.map((brand, index) => (
                        <span key={index} className={`px-2 py-1 text-xs font-medium rounded-full ${getBrandColor(brand)}`}>
                          {brand}
                        </span>
                      ))}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">
                      {projection.campus.length > 1 ? `${projection.campus[0]} +${projection.campus.length - 1}` : projection.campus[0]}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">
                      {projection.program.length > 1 ? `${projection.program[0]} +${projection.program.length - 1}` : projection.program[0]}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-green-600">
                      ${(projection.results.adjustedRevenue / 1000000).toFixed(1)}M
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {projection.results.studentCount}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {projection.createdBy}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                      projection.isHypothetical 
                        ? 'bg-purple-100 text-purple-800' 
                        : 'bg-green-100 text-green-800'
                    }`}>
                      {projection.isHypothetical ? 'Hipotética' : 'Activa'}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal para crear nueva proyección */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-4xl max-h-[90vh] flex flex-col">
            {/* Header fijo */}
            <div className="p-6 border-b border-gray-200 flex-shrink-0">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-xl font-semibold text-gray-900">Nueva Proyección Financiera</h3>
                  <p className="text-sm text-gray-600 mt-1">Paso {currentStep} de 3</p>
                </div>
                <button 
                  onClick={() => setShowCreateModal(false)}
                  className="p-2 text-gray-400 hover:text-gray-600 transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
              
              {/* Progress bar */}
              <div className="mt-4">
                <div className="flex items-center">
                  {[1, 2, 3].map((step) => (
                    <div key={step} className="flex items-center">
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                        step <= currentStep ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-600'
                      }`}>
                        {step}
                      </div>
                      {step < 3 && (
                        <div className={`w-16 h-1 mx-2 ${
                          step < currentStep ? 'bg-blue-600' : 'bg-gray-200'
                        }`}></div>
                      )}
                    </div>
                  ))}
                </div>
                <div className="flex justify-between mt-2 text-xs text-gray-600">
                  <span>Configuración</span>
                  <span>Parámetros</span>
                  <span>Resultados</span>
                </div>
              </div>
            </div>

            {/* Content con scroll */}
            <div className="flex-1 overflow-y-auto">
              <div className="p-6">
                {/* Paso 1: Configuración */}
                {currentStep === 1 && (
                  <div className="space-y-6">
                    <div>
                      <h4 className="text-lg font-medium text-gray-900 mb-4">Configuración de la Proyección</h4>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Versión <span className="text-red-500">*</span>
                          </label>
                          <input
                            type="text"
                            value={newProjection.version}
                            onChange={(e) => setNewProjection(prev => ({ ...prev, version: e.target.value }))}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            placeholder="Ej: V2024.03"
                          />
                        </div>
                      </div>

                      {/* Multiselect Marca */}
                      <div className="mb-6">
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Marca <span className="text-red-500">*</span>
                        </label>
                        <div className="relative">
                          <button
                            onClick={() => setShowBrandDropdown(!showBrandDropdown)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white text-left flex items-center justify-between"
                          >
                            <span className="text-sm">
                              {newProjection.brand.length === 0 
                                ? 'Seleccionar marcas' 
                                : `${newProjection.brand.length} marca(s) seleccionada(s)`
                              }
                            </span>
                            <ChevronDown className={`w-4 h-4 transition-transform ${showBrandDropdown ? 'rotate-180' : ''}`} />
                          </button>
                          
                          {showBrandDropdown && (
                            <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-gray-300 rounded-lg shadow-lg z-50 max-h-48 overflow-y-auto">
                              <div className="p-3 border-b border-gray-200 bg-gray-50">
                                <div className="flex items-center justify-between">
                                  <span className="text-sm font-medium text-gray-700">Seleccionar marcas</span>
                                  {newProjection.brand.length > 0 && (
                                    <button
                                      onClick={() => clearSelection('brand')}
                                      className="text-sm text-gray-600 hover:text-gray-800"
                                    >
                                      Limpiar
                                    </button>
                                  )}
                                </div>
                              </div>
                              
                              <div className="py-2">
                                {availableBrands.map((brand) => (
                                  <label
                                    key={brand}
                                    className="flex items-center px-3 py-2 hover:bg-gray-50 cursor-pointer"
                                  >
                                    <input
                                      type="checkbox"
                                      checked={newProjection.brand.includes(brand)}
                                      onChange={() => handleMultiSelectToggle('brand', brand)}
                                      className="mr-3 h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                                    />
                                    <span className="text-sm text-gray-900">{brand}</span>
                                  </label>
                                ))}
                              </div>
                            </div>
                          )}
                        </div>
                        
                        {/* Tags de marcas seleccionadas */}
                        {newProjection.brand.length > 0 && (
                          <div className="mt-3 flex flex-wrap gap-2">
                            {newProjection.brand.map((brand) => (
                              <div
                                key={brand}
                                className={`flex items-center px-3 py-1 rounded-full text-sm ${getBrandColor(brand)}`}
                              >
                                <span>{brand}</span>
                                <button
                                  onClick={() => removeTag('brand', brand)}
                                  className="ml-2 hover:bg-opacity-20 hover:bg-gray-600 rounded-full p-0.5"
                                >
                                  <X className="w-3 h-3" />
                                </button>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>

                      {/* Multiselect Campus */}
                      <div className="mb-6">
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Campus <span className="text-red-500">*</span>
                        </label>
                        <div className="relative">
                          <button
                            onClick={() => setShowCampusDropdown(!showCampusDropdown)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white text-left flex items-center justify-between"
                          >
                            <span className="text-sm">
                              {newProjection.campus.length === 0 
                                ? 'Seleccionar campus' 
                                : `${newProjection.campus.length} campus seleccionado(s)`
                              }
                            </span>
                            <ChevronDown className={`w-4 h-4 transition-transform ${showCampusDropdown ? 'rotate-180' : ''}`} />
                          </button>
                          
                          {showCampusDropdown && (
                            <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-gray-300 rounded-lg shadow-lg z-50 max-h-48 overflow-y-auto">
                              <div className="p-3 border-b border-gray-200 bg-gray-50">
                                <div className="flex items-center justify-between">
                                  <span className="text-sm font-medium text-gray-700">Seleccionar campus</span>
                                  {newProjection.campus.length > 0 && (
                                    <button
                                      onClick={() => clearSelection('campus')}
                                      className="text-sm text-gray-600 hover:text-gray-800"
                                    >
                                      Limpiar
                                    </button>
                                  )}
                                </div>
                              </div>
                              
                              <div className="py-2">
                                {availableCampuses.map((campus) => (
                                  <label
                                    key={campus}
                                    className="flex items-center px-3 py-2 hover:bg-gray-50 cursor-pointer"
                                  >
                                    <input
                                      type="checkbox"
                                      checked={newProjection.campus.includes(campus)}
                                      onChange={() => handleMultiSelectToggle('campus', campus)}
                                      className="mr-3 h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                                    />
                                    <div className="flex items-center">
                                      <Building2 className="w-4 h-4 text-gray-400 mr-2" />
                                      <span className="text-sm text-gray-900">{campus}</span>
                                    </div>
                                  </label>
                                ))}
                              </div>
                            </div>
                          )}
                        </div>
                        
                        {/* Tags de campus seleccionados */}
                        {newProjection.campus.length > 0 && (
                          <div className="mt-3 flex flex-wrap gap-2">
                            {newProjection.campus.map((campus) => (
                              <div
                                key={campus}
                                className="flex items-center bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm"
                              >
                                <Building2 className="w-3 h-3 mr-1" />
                                <span>{campus}</span>
                                <button
                                  onClick={() => removeTag('campus', campus)}
                                  className="ml-2 hover:bg-blue-200 rounded-full p-0.5"
                                >
                                  <X className="w-3 h-3" />
                                </button>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>

                      {/* Multiselect Programa */}
                      <div className="mb-6">
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Programa <span className="text-red-500">*</span>
                        </label>
                        <div className="relative">
                          <button
                            onClick={() => setShowProgramDropdown(!showProgramDropdown)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white text-left flex items-center justify-between"
                          >
                            <span className="text-sm">
                              {newProjection.program.length === 0 
                                ? 'Seleccionar programas' 
                                : `${newProjection.program.length} programa(s) seleccionado(s)`
                              }
                            </span>
                            <ChevronDown className={`w-4 h-4 transition-transform ${showProgramDropdown ? 'rotate-180' : ''}`} />
                          </button>
                          
                          {showProgramDropdown && (
                            <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-gray-300 rounded-lg shadow-lg z-50 max-h-48 overflow-y-auto">
                              <div className="p-3 border-b border-gray-200 bg-gray-50">
                                <div className="flex items-center justify-between">
                                  <span className="text-sm font-medium text-gray-700">Seleccionar programas</span>
                                  {newProjection.program.length > 0 && (
                                    <button
                                      onClick={() => clearSelection('program')}
                                      className="text-sm text-gray-600 hover:text-gray-800"
                                    >
                                      Limpiar
                                    </button>
                                  )}
                                </div>
                              </div>
                              
                              <div className="py-2">
                                {availablePrograms.map((program) => (
                                  <label
                                    key={program}
                                    className="flex items-center px-3 py-2 hover:bg-gray-50 cursor-pointer"
                                  >
                                    <input
                                      type="checkbox"
                                      checked={newProjection.program.includes(program)}
                                      onChange={() => handleMultiSelectToggle('program', program)}
                                      className="mr-3 h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                                    />
                                    <div className="flex items-center">
                                      <BookOpen className="w-4 h-4 text-gray-400 mr-2" />
                                      <span className="text-sm text-gray-900">{program}</span>
                                    </div>
                                  </label>
                                ))}
                              </div>
                            </div>
                          )}
                        </div>
                        
                        {/* Tags de programas seleccionados */}
                        {newProjection.program.length > 0 && (
                          <div className="mt-3 flex flex-wrap gap-2">
                            {newProjection.program.map((program) => (
                              <div
                                key={program}
                                className="flex items-center bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm"
                              >
                                <BookOpen className="w-3 h-3 mr-1" />
                                <span>{program}</span>
                                <button
                                  onClick={() => removeTag('program', program)}
                                  className="ml-2 hover:bg-green-200 rounded-full p-0.5"
                                >
                                  <X className="w-3 h-3" />
                                </button>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>

                      {/* Multiselect Modalidad */}
                      <div className="mb-6">
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Modalidad <span className="text-red-500">*</span>
                        </label>
                        <div className="relative">
                          <button
                            onClick={() => setShowModalityDropdown(!showModalityDropdown)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white text-left flex items-center justify-between"
                          >
                            <span className="text-sm">
                              {newProjection.modality.length === 0 
                                ? 'Seleccionar modalidades' 
                                : `${newProjection.modality.length} modalidad(es) seleccionada(s)`
                              }
                            </span>
                            <ChevronDown className={`w-4 h-4 transition-transform ${showModalityDropdown ? 'rotate-180' : ''}`} />
                          </button>
                          
                          {showModalityDropdown && (
                            <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-gray-300 rounded-lg shadow-lg z-50 max-h-48 overflow-y-auto">
                              <div className="p-3 border-b border-gray-200 bg-gray-50">
                                <div className="flex items-center justify-between">
                                  <span className="text-sm font-medium text-gray-700">Seleccionar modalidades</span>
                                  {newProjection.modality.length > 0 && (
                                    <button
                                      onClick={() => clearSelection('modality')}
                                      className="text-sm text-gray-600 hover:text-gray-800"
                                    >
                                      Limpiar
                                    </button>
                                  )}
                                </div>
                              </div>
                              
                              <div className="py-2">
                                {availableModalities.map((modality) => (
                                  <label
                                    key={modality}
                                    className="flex items-center px-3 py-2 hover:bg-gray-50 cursor-pointer"
                                  >
                                    <input
                                      type="checkbox"
                                      checked={newProjection.modality.includes(modality)}
                                      onChange={() => handleMultiSelectToggle('modality', modality)}
                                      className="mr-3 h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                                    />
                                    <span className="text-sm text-gray-900">{modality}</span>
                                  </label>
                                ))}
                              </div>
                            </div>
                          )}
                        </div>
                        
                        {/* Tags de modalidades seleccionadas */}
                        {newProjection.modality.length > 0 && (
                          <div className="mt-3 flex flex-wrap gap-2">
                            {newProjection.modality.map((modality) => (
                              <div
                                key={modality}
                                className="flex items-center bg-purple-100 text-purple-800 px-3 py-1 rounded-full text-sm"
                              >
                                <span>{modality}</span>
                                <button
                                  onClick={() => removeTag('modality', modality)}
                                  className="ml-2 hover:bg-purple-200 rounded-full p-0.5"
                                >
                                  <X className="w-3 h-3" />
                                </button>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>

                      {/* Opción hipotética */}
                      <div className="p-4 bg-purple-50 border border-purple-200 rounded-lg">
                        <label className="flex items-center mb-3">
                          <input
                            type="checkbox"
                            checked={newProjection.isHypothetical}
                            onChange={(e) => setNewProjection(prev => ({ ...prev, isHypothetical: e.target.checked }))}
                            className="mr-3 h-4 w-4 text-purple-600 focus:ring-purple-500 border-gray-300 rounded"
                          />
                          <span className="text-sm font-medium text-purple-900">Proyección Hipotética</span>
                        </label>
                        {newProjection.isHypothetical && (
                          <div>
                            <label className="block text-sm font-medium text-purple-700 mb-2">Tag Identificador</label>
                            <input
                              type="text"
                              value={newProjection.hypotheticalTag}
                              onChange={(e) => setNewProjection(prev => ({ ...prev, hypotheticalTag: e.target.value }))}
                              className="w-full px-3 py-2 border border-purple-300 rounded-lg focus:ring-2 focus:ring-purple-500"
                              placeholder="Ej: EXPANSION-2025, NUEVO-CAMPUS"
                            />
                            <p className="text-xs text-purple-600 mt-1">
                              Este tag ayudará a identificar la proyección en los análisis
                            </p>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                )}

                {/* Paso 2: Parámetros */}
                {currentStep === 2 && (
                  <div className="space-y-6">
                    <div>
                      <h4 className="text-lg font-medium text-gray-900 mb-4">Parámetros de Proyección</h4>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Matrícula Activa Base
                          </label>
                          <input
                            type="number"
                            value={newProjection.parameters.activeEnrollment}
                            onChange={(e) => setNewProjection(prev => ({
                              ...prev,
                              parameters: { ...prev.parameters, activeEnrollment: parseInt(e.target.value) }
                            }))}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                            placeholder="150"
                          />
                          <p className="text-xs text-gray-500 mt-1">Número de estudiantes activos actuales</p>
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Tasa de Retención (%)
                          </label>
                          <input
                            type="number"
                            min="0"
                            max="100"
                            value={newProjection.parameters.retentionRate}
                            onChange={(e) => setNewProjection(prev => ({
                              ...prev,
                              parameters: { ...prev.parameters, retentionRate: parseFloat(e.target.value) }
                            }))}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                            placeholder="85"
                          />
                          <p className="text-xs text-gray-500 mt-1">Porcentaje de estudiantes que continúan</p>
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Tasa de Reinscripción (%)
                          </label>
                          <input
                            type="number"
                            min="0"
                            max="100"
                            value={newProjection.parameters.reinscriptionRate}
                            onChange={(e) => setNewProjection(prev => ({
                              ...prev,
                              parameters: { ...prev.parameters, reinscriptionRate: parseFloat(e.target.value) }
                            }))}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                            placeholder="90"
                          />
                          <p className="text-xs text-gray-500 mt-1">Porcentaje de estudiantes retenidos que se reinscriben</p>
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Tasa de Descuento (%)
                          </label>
                          <input
                            type="number"
                            min="0"
                            max="100"
                            value={newProjection.parameters.discountRate}
                            onChange={(e) => setNewProjection(prev => ({
                              ...prev,
                              parameters: { ...prev.parameters, discountRate: parseFloat(e.target.value) }
                            }))}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                            placeholder="10"
                          />
                          <p className="text-xs text-gray-500 mt-1">Descuento promedio aplicado</p>
                        </div>

                        <div className="md:col-span-2">
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Precio Base por Estudiante
                          </label>
                          <input
                            type="number"
                            value={newProjection.parameters.basePrice}
                            onChange={(e) => setNewProjection(prev => ({
                              ...prev,
                              parameters: { ...prev.parameters, basePrice: parseInt(e.target.value) }
                            }))}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                            placeholder="12500"
                          />
                          <p className="text-xs text-gray-500 mt-1">Precio promedio por estudiante por período</p>
                        </div>
                      </div>

                      {/* Vista previa de cálculos */}
                      <div className="mt-8 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                        <h5 className="text-sm font-medium text-blue-900 mb-3">Vista Previa de Cálculos</h5>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                          <div>
                            <p className="text-blue-700">Estudiantes Retenidos</p>
                            <p className="font-bold text-blue-900">
                              {Math.round(newProjection.parameters.activeEnrollment * (newProjection.parameters.retentionRate / 100))}
                            </p>
                          </div>
                          <div>
                            <p className="text-blue-700">Estudiantes Reinscritos</p>
                            <p className="font-bold text-blue-900">
                              {Math.round(newProjection.parameters.activeEnrollment * (newProjection.parameters.retentionRate / 100) * (newProjection.parameters.reinscriptionRate / 100))}
                            </p>
                          </div>
                          <div>
                            <p className="text-blue-700">Ingresos Brutos</p>
                            <p className="font-bold text-blue-900">
                              ${(Math.round(newProjection.parameters.activeEnrollment * (newProjection.parameters.retentionRate / 100) * (newProjection.parameters.reinscriptionRate / 100)) * newProjection.parameters.basePrice).toLocaleString()}
                            </p>
                          </div>
                          <div>
                            <p className="text-blue-700">Ingresos Netos</p>
                            <p className="font-bold text-blue-900">
                              ${Math.round((Math.round(newProjection.parameters.activeEnrollment * (newProjection.parameters.retentionRate / 100) * (newProjection.parameters.reinscriptionRate / 100)) * newProjection.parameters.basePrice) * (1 - newProjection.parameters.discountRate / 100)).toLocaleString()}
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* Paso 3: Resultados */}
                {currentStep === 3 && (
                  <div className="space-y-6">
                    <div>
                      <h4 className="text-lg font-medium text-gray-900 mb-4">Resultados de la Proyección</h4>
                      
                      {(() => {
                        const results = calculateResults();
                        return (
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="bg-green-50 border border-green-200 rounded-xl p-6">
                              <div className="flex items-center justify-between mb-4">
                                <div className="p-3 rounded-lg bg-green-100">
                                  <DollarSign className="w-6 h-6 text-green-600" />
                                </div>
                              </div>
                              <div>
                                <h3 className="text-2xl font-bold text-green-900">
                                  ${(results.adjustedRevenue / 1000000).toFixed(1)}M
                                </h3>
                                <p className="text-green-700 text-sm mt-1">Ingresos Proyectados Netos</p>
                                <p className="text-xs text-green-600 mt-1">
                                  Después de descuentos
                                </p>
                              </div>
                            </div>

                            <div className="bg-blue-50 border border-blue-200 rounded-xl p-6">
                              <div className="flex items-center justify-between mb-4">
                                <div className="p-3 rounded-lg bg-blue-100">
                                  <Users className="w-6 h-6 text-blue-600" />
                                </div>
                              </div>
                              <div>
                                <h3 className="text-2xl font-bold text-blue-900">{results.studentCount}</h3>
                                <p className="text-blue-700 text-sm mt-1">Estudiantes Proyectados</p>
                                <p className="text-xs text-blue-600 mt-1">
                                  Reinscritos para el período
                                </p>
                              </div>
                            </div>

                            <div className="bg-purple-50 border border-purple-200 rounded-xl p-6">
                              <div className="flex items-center justify-between mb-4">
                                <div className="p-3 rounded-lg bg-purple-100">
                                  <TrendingUp className="w-6 h-6 text-purple-600" />
                                </div>
                              </div>
                              <div>
                                <h3 className="text-2xl font-bold text-purple-900">
                                  ${Math.round(results.averagePayment).toLocaleString()}
                                </h3>
                                <p className="text-purple-700 text-sm mt-1">Pago Promedio</p>
                                <p className="text-xs text-purple-600 mt-1">
                                  Por estudiante
                                </p>
                              </div>
                            </div>

                            <div className="bg-orange-50 border border-orange-200 rounded-xl p-6">
                              <div className="flex items-center justify-between mb-4">
                                <div className="p-3 rounded-lg bg-orange-100">
                                  <Calculator className="w-6 h-6 text-orange-600" />
                                </div>
                              </div>
                              <div>
                                <h3 className="text-2xl font-bold text-orange-900">
                                  {newProjection.parameters.retentionRate}%
                                </h3>
                                <p className="text-orange-700 text-sm mt-1">Tasa de Retención</p>
                                <p className="text-xs text-orange-600 mt-1">
                                  Utilizada en el cálculo
                                </p>
                              </div>
                            </div>
                          </div>
                        );
                      })()}

                      {/* Resumen de configuración */}
                      <div className="mt-8 p-6 bg-gray-50 border border-gray-200 rounded-lg">
                        <h5 className="text-sm font-medium text-gray-900 mb-4">Resumen de Configuración</h5>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                          <div>
                            <p className="text-gray-600 mb-1">Versión:</p>
                            <p className="font-medium text-gray-900">{newProjection.version}</p>
                          </div>
                          <div>
                            <p className="text-gray-600 mb-1">Marcas:</p>
                            <p className="font-medium text-gray-900">{newProjection.brand.join(', ')}</p>
                          </div>
                          <div>
                            <p className="text-gray-600 mb-1">Campus:</p>
                            <p className="font-medium text-gray-900">{newProjection.campus.join(', ')}</p>
                          </div>
                          <div>
                            <p className="text-gray-600 mb-1">Programas:</p>
                            <p className="font-medium text-gray-900">{newProjection.program.join(', ')}</p>
                          </div>
                          <div>
                            <p className="text-gray-600 mb-1">Modalidades:</p>
                            <p className="font-medium text-gray-900">{newProjection.modality.join(', ')}</p>
                          </div>
                          <div>
                            <p className="text-gray-600 mb-1">Tipo:</p>
                            <p className="font-medium text-gray-900">
                              {newProjection.isHypothetical ? `Hipotética (${newProjection.hypotheticalTag})` : 'Estándar'}
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Footer fijo */}
            <div className="p-6 border-t border-gray-200 flex justify-between flex-shrink-0">
              <button 
                onClick={prevStep}
                disabled={currentStep === 1}
                className="px-6 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Anterior
              </button>
              
              <div className="flex space-x-3">
                <button 
                  onClick={() => setShowCreateModal(false)}
                  className="px-6 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
                >
                  Cancelar
                </button>
                
                {currentStep < 3 ? (
                  <button 
                    onClick={nextStep}
                    disabled={
                      (currentStep === 1 && (!newProjection.version || newProjection.brand.length === 0 || newProjection.campus.length === 0 || newProjection.program.length === 0 || newProjection.modality.length === 0))
                    }
                    className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Siguiente
                  </button>
                ) : (
                  <button 
                    onClick={handleCreateProjection}
                    className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    <Save className="w-4 h-4 mr-2 inline" />
                    Crear Proyección
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Modal de detalle de proyección */}
      {selectedProjection && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">Detalle de Proyección</h3>
                  <p className="text-sm text-gray-600">{selectedProjection.version}</p>
                </div>
                <button 
                  onClick={() => setSelectedProjection(null)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>
            
            <div className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Información general */}
                <div>
                  <h4 className="font-medium text-gray-900 mb-3">Información General</h4>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Creado por:</span>
                      <span className="font-medium">{selectedProjection.createdBy}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Fecha:</span>
                      <span className="font-medium">{selectedProjection.createdAt}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Estado:</span>
                      <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                        selectedProjection.isHypothetical 
                          ? 'bg-purple-100 text-purple-800' 
                          : 'bg-green-100 text-green-800'
                      }`}>
                        {selectedProjection.isHypothetical ? 'Hipotética' : 'Activa'}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Resultados */}
                <div>
                  <h4 className="font-medium text-gray-900 mb-3">Resultados</h4>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Ingresos Proyectados:</span>
                      <span className="font-medium text-green-600">
                        ${(selectedProjection.results.adjustedRevenue / 1000000).toFixed(1)}M
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Estudiantes:</span>
                      <span className="font-medium">{selectedProjection.results.studentCount}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Pago Promedio:</span>
                      <span className="font-medium">${selectedProjection.results.averagePayment.toLocaleString()}</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Configuración */}
              <div className="mt-6">
                <h4 className="font-medium text-gray-900 mb-3">Configuración</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                  <div>
                    <p className="text-gray-600 mb-1">Marcas:</p>
                    <div className="flex flex-wrap gap-1">
                      {selectedProjection.brand.map((brand, index) => (
                        <span key={index} className={`px-2 py-1 text-xs font-medium rounded-full ${getBrandColor(brand)}`}>
                          {brand}
                        </span>
                      ))}
                    </div>
                  </div>
                  <div>
                    <p className="text-gray-600 mb-1">Campus:</p>
                    <p className="font-medium text-gray-900">{selectedProjection.campus.join(', ')}</p>
                  </div>
                  <div>
                    <p className="text-gray-600 mb-1">Programas:</p>
                    <p className="font-medium text-gray-900">{selectedProjection.program.join(', ')}</p>
                  </div>
                  <div>
                    <p className="text-gray-600 mb-1">Modalidades:</p>
                    <p className="font-medium text-gray-900">{selectedProjection.modality.join(', ')}</p>
                  </div>
                </div>
              </div>

              {/* Parámetros */}
              <div className="mt-6">
                <h4 className="font-medium text-gray-900 mb-3">Parámetros Utilizados</h4>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                  <div className="bg-gray-50 p-3 rounded-lg">
                    <p className="text-gray-600">Matrícula Base</p>
                    <p className="font-bold text-gray-900">{selectedProjection.parameters.activeEnrollment}</p>
                  </div>
                  <div className="bg-gray-50 p-3 rounded-lg">
                    <p className="text-gray-600">Retención</p>
                    <p className="font-bold text-gray-900">{selectedProjection.parameters.retentionRate}%</p>
                  </div>
                  <div className="bg-gray-50 p-3 rounded-lg">
                    <p className="text-gray-600">Reinscripción</p>
                    <p className="font-bold text-gray-900">{selectedProjection.parameters.reinscriptionRate}%</p>
                  </div>
                  <div className="bg-gray-50 p-3 rounded-lg">
                    <p className="text-gray-600">Descuento</p>
                    <p className="font-bold text-gray-900">{selectedProjection.parameters.discountRate}%</p>
                  </div>
                  <div className="bg-gray-50 p-3 rounded-lg">
                    <p className="text-gray-600">Precio Base</p>
                    <p className="font-bold text-gray-900">${selectedProjection.parameters.basePrice.toLocaleString()}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Projections;