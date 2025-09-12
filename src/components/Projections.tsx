import React, { useState } from 'react';
import { Calculator, TrendingUp, Save, RotateCcw, Calendar, AlertTriangle, Plus, Eye, Edit, Filter, Download, ChevronDown, ChevronRight, X, Settings, Users, Building2, BookOpen, Tag, ChevronLeft } from 'lucide-react';
import { mockEnrollmentProjections } from '../data/mockData';

interface ProjectionParams {
  startMonth: string;
  startYear: number;
  endMonth: string;
  endYear: number;
  selectedBrands: string[];
  selectedCampuses: string[];
  selectedPrograms: string[];
  programParams: Record<string, {
    retentionIntercycle: number;
    retentionIntracycle: number;
    scholarshipPercentage: number;
    tuitionPrice: number;
    enrollmentPrice: number;
    enrollmentDiscount: number;
    tuitionDiscount: number;
  }>;
}

interface ProjectionResults {
  id: string;
  name: string;
  params: ProjectionParams;
  createdAt: string;
  months: string[];
}

interface DetailedResults {
  campus: string;
  program: string;
  modality: string;
  brand: string;
  studentType: 'NI' | 'RI';
  studentCount: number;
  enrollmentRevenue: number;
  tuitionRevenue: number;
  enrollmentDiscountPercent: number;
  tuitionDiscountPercent: number;
  enrollmentDiscountAmount: number;
  tuitionDiscountAmount: number;
  netEnrollmentRevenue: number;
  netTuitionRevenue: number;
  netTotalRevenue: number;
  accruableDays: number;
  accruablePercentage: number;
}

const Projections: React.FC = () => {
  const [showConfig, setShowConfig] = useState(false);
  const [showSidebar, setShowSidebar] = useState(false);
  const [savedProjections, setSavedProjections] = useState<any[]>([]);
  const [selectedProjection, setSelectedProjection] = useState<any>(null);
  const [currentProjection, setCurrentProjection] = useState<any>(null);
  const [selectedMonth, setSelectedMonth] = useState('');
  const [showParametersSummary, setShowParametersSummary] = useState(false);
  const [expandedRows, setExpandedRows] = useState<Set<string>>(new Set());

  // Estados para dropdowns
  const [showBrandDropdown, setShowBrandDropdown] = useState(false);
  const [showCampusDropdown, setShowCampusDropdown] = useState(false);
  const [showProgramDropdown, setShowProgramDropdown] = useState(false);

  // Datos de configuración
  const [configData, setConfigData] = useState({
    startMonth: '',
    startYear: 2025,
    endMonth: '',
    endYear: 2025,
    selectedBrands: [] as string[],
    selectedCampuses: [] as string[],
    selectedPrograms: [] as string[],
    parameters: {} as Record<string, any>
  });

  // Datos estáticos
  const brands = ['Lottus', 'UVM', 'UNITEC', 'ULA', 'UANE'];
  const campuses = ['Ciudad de México', 'Guadalajara', 'Monterrey', 'Puebla', 'Tijuana'];
  const programs = ['Ingeniería en Sistemas', 'Administración de Empresas', 'Derecho', 'Medicina', 'Psicología'];
  const months = ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'];
  const years = [2025, 2026, 2027];
  const modalities = ['Presencial', 'Online', 'Sabatina'];

  // Función para generar combinaciones de parámetros
  const generateParameterCombinations = () => {
    const combinations: string[] = [];
    configData.selectedBrands.forEach(brand => {
      configData.selectedCampuses.forEach(campus => {
        configData.selectedPrograms.forEach(program => {
          combinations.push(`${brand}-${campus}-${program}`);
        });
      });
    });
    return combinations;
  };

  // Función para actualizar parámetros
  const updateParameter = (key: string, field: string, value: string) => {
    setConfigData(prev => ({
      ...prev,
      parameters: {
        ...prev.parameters,
        [key]: {
          ...prev.parameters[key],
          [field]: value
        }
      }
    }));
  };

  // Función para obtener días devengables por modalidad
  const getEarnableDaysForMonth = (month: string, modality: string): number => {
    // Simulación de días devengables por modalidad
    const baseDays = 30;
    switch (modality) {
      case 'Presencial': return Math.floor(baseDays * 0.75); // 22-23 días
      case 'Online': return baseDays; // 30 días
      case 'Sabatina': return 4; // 4 sábados
      default: return baseDays;
    }
  };

  const handleConfigSubmit = () => {
    // Crear proyección temporal (no guardada aún)
    const tempProjection = {
      id: `temp-${Date.now()}`,
      name: `Proyección ${configData.startMonth} ${configData.startYear} - ${configData.endMonth} ${configData.endYear}`,
      version: `V${new Date().getFullYear()}.${String(new Date().getMonth() + 1).padStart(2, '0')}`,
      createdBy: 'Usuario Actual',
      createdAt: new Date().toISOString().split('T')[0],
      startMonth: configData.startMonth,
      startYear: configData.startYear,
      endMonth: configData.endMonth,
      endYear: configData.endYear,
      brands: configData.selectedBrands,
      campuses: configData.selectedCampuses,
      programs: configData.selectedPrograms,
      parameters: configData.parameters,
      isTemporary: true
    };
    
    setCurrentProjection(tempProjection);
    console.log('Proyección temporal creada:', {
      ...configData,
      parameters: configData.parameters
    });
    
    setShowConfig(false);
    
    // Establecer el primer mes disponible
    const startIndex = months.indexOf(configData.startMonth);
    const firstMonth = months[startIndex];
    setSelectedMonth(firstMonth);
  };

  const handleSaveProjection = () => {
    if (currentProjection) {
      const savedProjection = {
        ...currentProjection,
        id: Date.now().toString(),
        isTemporary: false
      };
      
      setSavedProjections(prev => [...prev, savedProjection]);
      setSelectedProjection(savedProjection);
      setCurrentProjection(null);
    }
  };

  const handleProjectionSelect = (projection: any) => {
    setSelectedProjection(projection);
    setShowParametersSummary(true);
    
    // Establecer el primer mes disponible
    const startIndex = months.indexOf(projection.startMonth);
    const firstMonth = months[startIndex];
    setSelectedMonth(firstMonth);
  };

  // Generar datos de ejemplo para la tabla
  const generateTableData = () => {
    const projection = selectedProjection || currentProjection;
    if (!projection) return [];

    const data: any[] = [];
    
    projection.brands.forEach((brand: string) => {
      projection.campuses.forEach((campus: string) => {
        projection.programs.forEach((program: string) => {
          modalities.forEach((modality: string) => {
            const key = `${brand}-${campus}-${program}`;
            const params = projection.parameters[key] || {};
            
            const baseEnrollmentPrice = params.enrollmentPrice || 12500;
            const baseTuitionPrice = params.tuitionPrice || 8500;
            
            // Datos consolidados iniciales
            const totalStudents = 45;
            
            const enrollmentRevenue = totalStudents * baseEnrollmentPrice;
            const tuitionRevenue = totalStudents * baseTuitionPrice;
            
            const enrollmentDiscountPercent = params.enrollmentDiscount || 10;
            const tuitionDiscountPercent = params.tuitionDiscount || 15;
            
            const enrollmentDiscountAmount = enrollmentRevenue * (enrollmentDiscountPercent / 100);
            const tuitionDiscountAmount = tuitionRevenue * (tuitionDiscountPercent / 100);
            
            const netEnrollmentAmount = enrollmentRevenue - enrollmentDiscountAmount;
            const netTuitionAmount = tuitionRevenue - tuitionDiscountAmount;
            
            const earnableDays = getEarnableDaysForMonth(selectedMonth, modality);
            const monthIndex = months.indexOf(selectedMonth);
            const totalDaysInMonth = new Date(2025, monthIndex + 1, 0).getDate();
            const earnedPercentage = (earnableDays / totalDaysInMonth) * 100;
            
            // Fila consolidada (inicial)
            data.push({
              id: `${brand}-${campus}-${program}-${modality}-consolidated`,
              brand,
              campus,
              program,
              modality,
              students: totalStudents,
              enrollmentRevenue,
              tuitionRevenue,
              enrollmentDiscountPercent,
              tuitionDiscountPercent,
              enrollmentDiscountAmount,
              tuitionDiscountAmount,
              netEnrollmentAmount,
              netTuitionAmount,
              earnableDays,
              earnedPercentage,
              isConsolidated: true,
              type: null,
              children: []
            });
            
            // Datos desglosados (se muestran solo al expandir)
            const niStudents = Math.round(totalStudents * 0.6); // 60% NI
            const riStudents = totalStudents - niStudents; // 40% RI
            
            const consolidatedIndex = data.length - 1;
            
            // Desglose NI
            const niEnrollmentRevenue = niStudents * baseEnrollmentPrice;
            const niTuitionRevenue = niStudents * baseTuitionPrice;
            const niEnrollmentDiscountAmount = niEnrollmentRevenue * (enrollmentDiscountPercent / 100);
            const niTuitionDiscountAmount = niTuitionRevenue * (tuitionDiscountPercent / 100);
            
            const niNetEnrollmentAmount = niEnrollmentRevenue - niEnrollmentDiscountAmount;
            const niNetTuitionAmount = niTuitionRevenue - niTuitionDiscountAmount;
            
            data[consolidatedIndex].children.push({
              id: `${brand}-${campus}-${program}-${modality}-NI`,
              brand,
              campus,
              program,
              modality,
              students: niStudents,
              enrollmentRevenue: niEnrollmentRevenue,
              tuitionRevenue: niTuitionRevenue,
              enrollmentDiscountPercent,
              tuitionDiscountPercent,
              enrollmentDiscountAmount: niEnrollmentDiscountAmount,
              tuitionDiscountAmount: niTuitionDiscountAmount,
              netEnrollmentAmount: niNetEnrollmentAmount,
              netTuitionAmount: niNetTuitionAmount,
              earnableDays,
              earnedPercentage,
              isConsolidated: false,
              type: 'NI'
            });
            
            // Desglose RI
            const riEnrollmentRevenue = riStudents * baseEnrollmentPrice;
            const riTuitionRevenue = riStudents * baseTuitionPrice;
            const riEnrollmentDiscountAmount = riEnrollmentRevenue * (enrollmentDiscountPercent / 100);
            const riTuitionDiscountAmount = riTuitionRevenue * (tuitionDiscountPercent / 100);
            
            const riNetEnrollmentAmount = riEnrollmentRevenue - riEnrollmentDiscountAmount;
            const riNetTuitionAmount = riTuitionRevenue - riTuitionDiscountAmount;
            
            data[consolidatedIndex].children.push({
              id: `${brand}-${campus}-${program}-${modality}-RI`,
              brand,
              campus,
              program,
              modality,
              students: riStudents,
              enrollmentRevenue: riEnrollmentRevenue,
              tuitionRevenue: riTuitionRevenue,
              enrollmentDiscountPercent,
              tuitionDiscountPercent,
              enrollmentDiscountAmount: riEnrollmentDiscountAmount,
              tuitionDiscountAmount: riTuitionDiscountAmount,
              netEnrollmentAmount: riNetEnrollmentAmount,
              netTuitionAmount: riNetTuitionAmount,
              earnableDays,
              earnedPercentage,
              isConsolidated: false,
              type: 'RI'
            });
          });
        });
      });
    });

    return data;
  };

  const tableData = generateTableData();
  const projection = selectedProjection || currentProjection;

  // Calcular totales
  const totals = tableData.reduce((acc, row) => {
    if (row.isConsolidated) { // Solo sumar filas consolidadas para evitar duplicados
      acc.students += row.students;
      acc.enrollmentRevenue += row.enrollmentRevenue;
      acc.tuitionRevenue += row.tuitionRevenue;
      acc.enrollmentDiscountAmount += row.enrollmentDiscountAmount;
      acc.tuitionDiscountAmount += row.tuitionDiscountAmount;
      acc.netEnrollmentAmount += row.netEnrollmentAmount;
      acc.netTuitionAmount += row.netTuitionAmount;
    }
    return acc;
  }, {
    students: 0,
    enrollmentRevenue: 0,
    tuitionRevenue: 0,
    enrollmentDiscountAmount: 0,
    tuitionDiscountAmount: 0,
    netEnrollmentAmount: 0,
    netTuitionAmount: 0
  });

  const toggleRowExpansion = (rowId: string) => {
    setExpandedRows(prev => {
      const newSet = new Set(prev);
      if (newSet.has(rowId)) {
        newSet.delete(rowId);
      } else {
        newSet.add(rowId);
      }
      return newSet;
    });
  };

  return (
    <div className="p-6 relative">
      <div className="mb-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Proyecciones de Matrícula</h1>
            <p className="text-gray-600 mt-2">Gestión de proyecciones de matrícula y análisis financiero</p>
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
              onClick={() => setShowConfig(true)}
              className="flex items-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
            >
              <Plus className="w-4 h-4 mr-2" />
              Nueva Proyección
            </button>
            <button 
              onClick={() => setShowSidebar(!showSidebar)}
              className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              <Eye className="w-4 h-4 mr-2" />
              Proyecciones Guardadas
            </button>
          </div>
        </div>
      </div>

      {/* Resumen de parámetros (solo cuando hay proyección seleccionada) */}
      {projection && showParametersSummary && (
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 mb-6">
          <div 
            onClick={() => setShowParametersSummary(!showParametersSummary)}
            className="p-4 cursor-pointer flex items-center justify-between hover:bg-gray-50 transition-colors"
          >
            <div className="flex items-center space-x-4">
              <h3 className="text-lg font-semibold text-gray-900">Parámetros de Proyección</h3>
              <span className="text-sm text-gray-600">{projection.name}</span>
            </div>
            <div className="flex items-center space-x-2">
              <span className="text-xs text-gray-500">
                {projection.brands?.length || 0} marcas, {projection.campuses?.length || 0} campus, {projection.programs?.length || 0} programas
              </span>
              {showParametersSummary ? <ChevronDown className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
            </div>
          </div>

          {showParametersSummary && (
            <div className="border-t border-gray-200 p-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div>
                  <h4 className="font-medium text-gray-900 mb-3">Período</h4>
                  <p className="text-sm text-gray-600">
                    {projection.startMonth} {projection.startYear} - {projection.endMonth} {projection.endYear}
                  </p>
                </div>
                <div>
                  <h4 className="font-medium text-gray-900 mb-3">Dimensiones</h4>
                  <div className="text-sm text-gray-600 space-y-1">
                    <p><strong>Marcas:</strong> {projection.brands?.join(', ') || 'N/A'}</p>
                    <p><strong>Campus:</strong> {projection.campuses?.join(', ') || 'N/A'}</p>
                    <p><strong>Programas:</strong> {projection.programs?.join(', ') || 'N/A'}</p>
                  </div>
                </div>
                <div>
                  <h4 className="font-medium text-gray-900 mb-3">Parámetros Configurados</h4>
                  <p className="text-sm text-gray-600">
                    {Object.keys(projection.parameters || {}).length} configuraciones de programa
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Navegación mensual y tabla de resultados */}
      {projection && (
        <div className="bg-white rounded-xl shadow-sm border border-gray-100">
          {/* Navegación mensual */}
          <div className="border-b border-gray-200">
            <nav className="flex overflow-x-auto">
              {months.slice(months.indexOf(projection.startMonth), months.indexOf(projection.endMonth) + 1).map((month) => (
                <button
                  key={month}
                  onClick={() => setSelectedMonth(month)}
                  className={`flex-shrink-0 px-6 py-4 text-sm font-medium border-b-2 transition-colors ${
                    selectedMonth === month
                      ? 'border-blue-500 text-blue-600'
                      : 'border-transparent text-gray-600 hover:text-gray-900 hover:border-gray-300'
                  }`}
                >
                  {month}
                </button>
              ))}
            </nav>
          </div>

          {/* Tabla de resultados */}
          <div className="p-6">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Marca</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Campus</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Programa</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Modalidad</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Alumnos</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">$ Inscripción</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">$ Colegiatura</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">% Desc. Insc.</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">% Desc. Col.</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">$ Desc. Insc.</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">$ Desc. Col.</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">$ Insc. Neto</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">$ Col. Neto</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Días Dev.</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">% Dev.</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {tableData.map((row) => {
                    const isExpanded = expandedRows.has(row.id);
                    
                    return (
                      <React.Fragment key={row.id}>
                        {/* Fila consolidada */}
                        <tr className="hover:bg-gray-50 transition-colors">
                          <td className="px-4 py-4 whitespace-nowrap">
                            <div className="flex items-center">
                              <button
                                onClick={() => toggleRowExpansion(row.id)}
                                className="mr-2 p-1 hover:bg-gray-200 rounded"
                              >
                                {isExpanded ? (
                                  <ChevronDown className="w-4 h-4 text-gray-600" />
                                ) : (
                                  <ChevronRight className="w-4 h-4 text-gray-600" />
                                )}
                              </button>
                              <div>
                                <div className="text-sm font-medium text-gray-900">{row.brand}</div>
                              </div>
                            </div>
                          </td>
                          <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-900">{row.campus}</td>
                          <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-900">{row.program}</td>
                          <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-900">{row.modality}</td>
                          <td className="px-4 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{row.students}</td>
                          <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-900">${row.enrollmentRevenue.toLocaleString()}</td>
                          <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-900">${row.tuitionRevenue.toLocaleString()}</td>
                          <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-900">{row.enrollmentDiscountPercent}%</td>
                          <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-900">{row.tuitionDiscountPercent}%</td>
                          <td className="px-4 py-4 whitespace-nowrap text-sm text-red-600">${row.enrollmentDiscountAmount.toLocaleString()}</td>
                          <td className="px-4 py-4 whitespace-nowrap text-sm text-red-600">${row.tuitionDiscountAmount.toLocaleString()}</td>
                          <td className="px-4 py-4 whitespace-nowrap text-sm font-medium text-green-600">${row.netEnrollmentAmount.toLocaleString()}</td>
                          <td className="px-4 py-4 whitespace-nowrap text-sm font-medium text-green-600">${row.netTuitionAmount.toLocaleString()}</td>
                          <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-900">{row.earnableDays}</td>
                          <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-900">{row.earnedPercentage.toFixed(1)}%</td>
                        </tr>
                        
                        {/* Filas desglosadas (solo si está expandido) */}
                        {isExpanded && row.children.map((child: any) => (
                          <tr 
                            key={child.id}
                            className={`${
                              child.type === 'NI' ? 'bg-blue-50' : 'bg-green-50'
                            } hover:bg-opacity-75 transition-colors`}
                          >
                            <td className="px-4 py-4 whitespace-nowrap">
                              <div className="flex items-center pl-8">
                                <div>
                                  <div className="text-sm font-medium text-gray-900">{child.brand}</div>
                                  <div className="text-xs text-gray-500">
                                    {child.type === 'NI' ? 'Nuevo Ingreso' : 'Reingreso'}
                                  </div>
                                </div>
                              </div>
                            </td>
                            <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-900">{child.campus}</td>
                            <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-900">{child.program}</td>
                            <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-900">{child.modality}</td>
                            <td className="px-4 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{child.students}</td>
                            <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-900">${child.enrollmentRevenue.toLocaleString()}</td>
                            <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-900">${child.tuitionRevenue.toLocaleString()}</td>
                            <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-900">{child.enrollmentDiscountPercent}%</td>
                            <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-900">{child.tuitionDiscountPercent}%</td>
                            <td className="px-4 py-4 whitespace-nowrap text-sm text-red-600">${child.enrollmentDiscountAmount.toLocaleString()}</td>
                            <td className="px-4 py-4 whitespace-nowrap text-sm text-red-600">${child.tuitionDiscountAmount.toLocaleString()}</td>
                            <td className="px-4 py-4 whitespace-nowrap text-sm font-medium text-green-600">${child.netEnrollmentAmount.toLocaleString()}</td>
                            <td className="px-4 py-4 whitespace-nowrap text-sm font-medium text-green-600">${child.netTuitionAmount.toLocaleString()}</td>
                            <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-900">{child.earnableDays}</td>
                            <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-900">{child.earnedPercentage.toFixed(1)}%</td>
                          </tr>
                        ))}
                      </React.Fragment>
                    );
                  })}
                  
                  {/* Fila de totales */}
                  <tr className="bg-gray-100 font-medium border-t-2 border-gray-300">
                    <td className="px-4 py-4 whitespace-nowrap text-sm font-bold text-gray-900" colSpan={4}>
                      TOTALES
                    </td>
                    <td className="px-4 py-4 whitespace-nowrap text-sm font-bold text-gray-900">{totals.students}</td>
                    <td className="px-4 py-4 whitespace-nowrap text-sm font-bold text-gray-900">${totals.enrollmentRevenue.toLocaleString()}</td>
                    <td className="px-4 py-4 whitespace-nowrap text-sm font-bold text-gray-900">${totals.tuitionRevenue.toLocaleString()}</td>
                    <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-500">-</td>
                    <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-500">-</td>
                    <td className="px-4 py-4 whitespace-nowrap text-sm font-bold text-red-600">${totals.enrollmentDiscountAmount.toLocaleString()}</td>
                    <td className="px-4 py-4 whitespace-nowrap text-sm font-bold text-red-600">${totals.tuitionDiscountAmount.toLocaleString()}</td>
                    <td className="px-4 py-4 whitespace-nowrap text-sm font-bold text-green-600">${totals.netEnrollmentAmount.toLocaleString()}</td>
                    <td className="px-4 py-4 whitespace-nowrap text-sm font-bold text-green-600">${totals.netTuitionAmount.toLocaleString()}</td>
                    <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-500">-</td>
                    <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-500">-</td>
                  </tr>
                </tbody>
              </table>
            </div>
            
            {/* Botón de guardar proyección (solo para proyecciones temporales) */}
            {currentProjection && currentProjection.isTemporary && (
              <div className="mt-6 flex justify-center">
                <button
                  onClick={handleSaveProjection}
                  className="flex items-center px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-medium"
                >
                  <Save className="w-5 h-5 mr-2" />
                  Guardar Proyección
                </button>
              </div>
            )}
          </div>
        </div>
      )}
      
      {/* Vista cuando no hay proyección seleccionada */}
      {!selectedProjection && !currentProjection && (
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-12 text-center">
          <Calculator className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No hay proyección seleccionada</h3>
          <p className="text-gray-600 mb-6">
            Configura una nueva proyección o selecciona una existente de la barra lateral
          </p>
          <button 
            onClick={() => setShowConfig(true)}
            className="flex items-center justify-center mx-auto px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            <Plus className="w-5 h-5 mr-2" />
            Configurar Proyección
          </button>
        </div>
      )}

      {/* Modal de configuración */}
      {showConfig && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center">
          <div className="bg-white rounded-xl shadow-xl max-w-6xl w-full mx-4 max-h-[90vh] flex flex-col">
            {/* Header */}
            <div className="p-6 border-b border-gray-200 flex-shrink-0">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-2xl font-bold text-gray-900">Configurar Nueva Proyección</h2>
                  <p className="text-gray-600 mt-1">Define los parámetros para generar proyecciones financieras</p>
                </div>
                <button 
                  onClick={() => setShowConfig(false)}
                  className="p-2 text-gray-400 hover:text-gray-600 transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Content */}
            <div className="p-6 flex-1 overflow-y-auto">
              {/* Left Column - Configuration */}
              <div className="w-1/2 border-r border-gray-200">
                <div className="flex-1 overflow-y-auto min-h-0">
                  <div className="p-6 pb-20">
                    <div className="space-y-8">
                      {/* Período */}
                      <div>
                        <h3 className="text-lg font-semibold text-gray-900 mb-4">Período de Proyección</h3>
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Mes de Inicio</label>
                            <select
                              value={configData.startMonth}
                              onChange={(e) => setConfigData(prev => ({ ...prev, startMonth: e.target.value }))}
                              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                            >
                              <option value="">Seleccionar mes</option>
                              {months.map(month => (
                                <option key={month} value={month}>{month}</option>
                              ))}
                            </select>
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Año de Inicio</label>
                            <select
                              value={configData.startYear}
                              onChange={(e) => setConfigData(prev => ({ ...prev, startYear: parseInt(e.target.value) }))}
                              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                            >
                              <option value="">Seleccionar año</option>
                              {years.map(year => (
                                <option key={year} value={year}>{year}</option>
                              ))}
                            </select>
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Mes de Fin</label>
                            <select
                              value={configData.endMonth}
                              onChange={(e) => setConfigData(prev => ({ ...prev, endMonth: e.target.value }))}
                              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                            >
                              <option value="">Seleccionar mes</option>
                              {months.map(month => (
                                <option key={month} value={month}>{month}</option>
                              ))}
                            </select>
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Año de Fin</label>
                            <select
                              value={configData.endYear}
                              onChange={(e) => setConfigData(prev => ({ ...prev, endYear: parseInt(e.target.value) }))}
                              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                            >
                              <option value="">Seleccionar año</option>
                              {years.map(year => (
                                <option key={year} value={year}>{year}</option>
                              ))}
                            </select>
                          </div>
                        </div>
                      </div>

                      {/* Multiselect Marcas */}
                      <div>
                        <h3 className="text-lg font-semibold text-gray-900 mb-4">Selección de Marcas</h3>
                        <div className="relative">
                          <button
                            onClick={() => setShowBrandDropdown(!showBrandDropdown)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 bg-white text-left flex items-center justify-between"
                          >
                            <span className="text-sm">
                              {configData.selectedBrands.length === 0 
                                ? 'Seleccionar marcas' 
                                : `${configData.selectedBrands.length} marca(s) seleccionada(s)`
                              }
                            </span>
                            <ChevronDown className={`w-4 h-4 transition-transform ${showBrandDropdown ? 'rotate-180' : ''}`} />
                          </button>
                          
                          {showBrandDropdown && (
                            <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-gray-300 rounded-lg shadow-lg z-50 max-h-48 overflow-y-auto">
                              {brands.map((brand) => (
                                <label key={brand} className="flex items-center px-3 py-2 hover:bg-gray-50 cursor-pointer">
                                  <input
                                    type="checkbox"
                                    checked={configData.selectedBrands.includes(brand)}
                                    onChange={(e) => {
                                      if (e.target.checked) {
                                        setConfigData(prev => ({
                                          ...prev,
                                          selectedBrands: [...prev.selectedBrands, brand]
                                        }));
                                      } else {
                                        setConfigData(prev => ({
                                          ...prev,
                                          selectedBrands: prev.selectedBrands.filter(b => b !== brand)
                                        }));
                                      }
                                    }}
                                    className="mr-3 h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                                  />
                                  <span className="text-sm text-gray-900">{brand}</span>
                                </label>
                              ))}
                            </div>
                          )}
                          
                          {configData.selectedBrands.length > 0 && (
                            <div className="mt-2 flex flex-wrap gap-2">
                              {configData.selectedBrands.map((brand) => (
                                <div key={brand} className="flex items-center bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm">
                                  <span>{brand}</span>
                                  <button
                                    onClick={() => {
                                      setConfigData(prev => ({
                                        ...prev,
                                        selectedBrands: prev.selectedBrands.filter(b => b !== brand)
                                      }));
                                    }}
                                    className="ml-2 hover:bg-blue-200 rounded-full p-0.5"
                                  >
                                    <X className="w-3 h-3" />
                                  </button>
                                </div>
                              ))}
                            </div>
                          )}
                        </div>
                      </div>

                      {/* Multiselect Campus */}
                      <div>
                        <h3 className="text-lg font-semibold text-gray-900 mb-4">Selección de Campus</h3>
                        <div className="relative">
                          <button
                            onClick={() => setShowCampusDropdown(!showCampusDropdown)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 bg-white text-left flex items-center justify-between"
                          >
                            <span className="text-sm">
                              {configData.selectedCampuses.length === 0 
                                ? 'Seleccionar campus' 
                                : `${configData.selectedCampuses.length} campus seleccionado(s)`
                              }
                            </span>
                            <ChevronDown className={`w-4 h-4 transition-transform ${showCampusDropdown ? 'rotate-180' : ''}`} />
                          </button>
                          
                          {showCampusDropdown && (
                            <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-gray-300 rounded-lg shadow-lg z-50 max-h-48 overflow-y-auto">
                              {campuses.map((campus) => (
                                <label key={campus} className="flex items-center px-3 py-2 hover:bg-gray-50 cursor-pointer">
                                  <input
                                    type="checkbox"
                                    checked={configData.selectedCampuses.includes(campus)}
                                    onChange={(e) => {
                                      if (e.target.checked) {
                                        setConfigData(prev => ({
                                          ...prev,
                                          selectedCampuses: [...prev.selectedCampuses, campus]
                                        }));
                                      } else {
                                        setConfigData(prev => ({
                                          ...prev,
                                          selectedCampuses: prev.selectedCampuses.filter(c => c !== campus)
                                        }));
                                      }
                                    }}
                                    className="mr-3 h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                                  />
                                  <span className="text-sm text-gray-900">{campus}</span>
                                </label>
                              ))}
                            </div>
                          )}
                          
                          {configData.selectedCampuses.length > 0 && (
                            <div className="mt-2 flex flex-wrap gap-2">
                              {configData.selectedCampuses.map((campus) => (
                                <div key={campus} className="flex items-center bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm">
                                  <span>{campus}</span>
                                  <button
                                    onClick={() => {
                                      setConfigData(prev => ({
                                        ...prev,
                                        selectedCampuses: prev.selectedCampuses.filter(c => c !== campus)
                                      }));
                                    }}
                                    className="ml-2 hover:bg-green-200 rounded-full p-0.5"
                                  >
                                    <X className="w-3 h-3" />
                                  </button>
                                </div>
                              ))}
                            </div>
                          )}
                        </div>
                      </div>

                      {/* Multiselect Programas */}
                      <div>
                        <h3 className="text-lg font-semibold text-gray-900 mb-4">Selección de Programas</h3>
                        <div className="relative">
                          <button
                            onClick={() => setShowProgramDropdown(!showProgramDropdown)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 bg-white text-left flex items-center justify-between"
                          >
                            <span className="text-sm">
                              {configData.selectedPrograms.length === 0 
                                ? 'Seleccionar programas' 
                                : `${configData.selectedPrograms.length} programa(s) seleccionado(s)`
                              }
                            </span>
                            <ChevronDown className={`w-4 h-4 transition-transform ${showProgramDropdown ? 'rotate-180' : ''}`} />
                          </button>
                          
                          {showProgramDropdown && (
                            <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-gray-300 rounded-lg shadow-lg z-50 max-h-48 overflow-y-auto">
                              {programs.map((program) => (
                                <label key={program} className="flex items-center px-3 py-2 hover:bg-gray-50 cursor-pointer">
                                  <input
                                    type="checkbox"
                                    checked={configData.selectedPrograms.includes(program)}
                                    onChange={(e) => {
                                      if (e.target.checked) {
                                        setConfigData(prev => ({
                                          ...prev,
                                          selectedPrograms: [...prev.selectedPrograms, program]
                                        }));
                                      } else {
                                        setConfigData(prev => ({
                                          ...prev,
                                          selectedPrograms: prev.selectedPrograms.filter(p => p !== program)
                                        }));
                                      }
                                    }}
                                    className="mr-3 h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                                  />
                                  <span className="text-sm text-gray-900">{program}</span>
                                </label>
                              ))}
                            </div>
                          )}
                          
                          {configData.selectedPrograms.length > 0 && (
                            <div className="mt-2 flex flex-wrap gap-2">
                              {configData.selectedPrograms.map((program) => (
                                <div key={program} className="flex items-center bg-purple-100 text-purple-800 px-3 py-1 rounded-full text-sm">
                                  <span>{program}</span>
                                  <button
                                    onClick={() => {
                                      setConfigData(prev => ({
                                        ...prev,
                                        selectedPrograms: prev.selectedPrograms.filter(p => p !== program)
                                      }));
                                    }}
                                    className="ml-2 hover:bg-purple-200 rounded-full p-0.5"
                                  >
                                    <X className="w-3 h-3" />
                                  </button>
                                </div>
                              ))}
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Right Column - Parameters */}
              <div className="w-1/2">
                <div className="flex-1 overflow-y-auto min-h-0">
                  <div className="p-6 pb-20">
                    <div className="space-y-6">
                      <h3 className="text-lg font-semibold text-gray-900">Parámetros por Combinación</h3>
                      
                      {generateParameterCombinations().length === 0 ? (
                        <div className="text-center py-8 text-gray-500">
                          <Settings className="w-12 h-12 mx-auto mb-3 text-gray-300" />
                          <p>Selecciona marcas, campus y programas para configurar parámetros</p>
                        </div>
                      ) : (
                        <div className="space-y-4">
                          {generateParameterCombinations().map((key) => {
                            const [brand, campus, program] = key.split('-');
                            const params = configData.parameters[key] || {};
                            
                            return (
                              <div key={key} className="border border-gray-200 rounded-lg p-4">
                                <h4 className="font-medium text-gray-900 mb-3">
                                  {brand} - {campus} - {program}
                                </h4>
                                
                                <div className="grid grid-cols-2 gap-4">
                                  <div>
                                    <label className="block text-xs font-medium text-gray-700 mb-1">Retención Interciclo (%)</label>
                                    <input
                                      type="text"
                                      value={params.retentionIntercycle || ''}
                                      onChange={(e) => updateParameter(key, 'retentionIntercycle', e.target.value)}
                                      className="w-full px-2 py-1 border border-gray-300 rounded text-sm"
                                      placeholder="85"
                                    />
                                  </div>
                                  <div>
                                    <label className="block text-xs font-medium text-gray-700 mb-1">Retención Intraciclo (%)</label>
                                    <input
                                      type="text"
                                      value={params.retentionIntracycle || ''}
                                      onChange={(e) => updateParameter(key, 'retentionIntracycle', e.target.value)}
                                      className="w-full px-2 py-1 border border-gray-300 rounded text-sm"
                                      placeholder="92"
                                    />
                                  </div>
                                  <div>
                                    <label className="block text-xs font-medium text-gray-700 mb-1">Precio Inscripción</label>
                                    <input
                                      type="text"
                                      value={params.enrollmentPrice || ''}
                                      onChange={(e) => updateParameter(key, 'enrollmentPrice', e.target.value)}
                                      className="w-full px-2 py-1 border border-gray-300 rounded text-sm"
                                      placeholder="12500"
                                    />
                                  </div>
                                  <div>
                                    <label className="block text-xs font-medium text-gray-700 mb-1">Precio Colegiatura</label>
                                    <input
                                      type="text"
                                      value={params.tuitionPrice || ''}
                                      onChange={(e) => updateParameter(key, 'tuitionPrice', e.target.value)}
                                      className="w-full px-2 py-1 border border-gray-300 rounded text-sm"
                                      placeholder="8500"
                                    />
                                  </div>
                                  <div>
                                    <label className="block text-xs font-medium text-gray-700 mb-1">Descuento Inscripción (%)</label>
                                    <input
                                      type="text"
                                      value={params.enrollmentDiscount || ''}
                                      onChange={(e) => updateParameter(key, 'enrollmentDiscount', e.target.value)}
                                      className="w-full px-2 py-1 border border-gray-300 rounded text-sm"
                                      placeholder="10"
                                    />
                                  </div>
                                  <div>
                                    <label className="block text-xs font-medium text-gray-700 mb-1">Descuento Colegiatura (%)</label>
                                    <input
                                      type="text"
                                      value={params.tuitionDiscount || ''}
                                      onChange={(e) => updateParameter(key, 'tuitionDiscount', e.target.value)}
                                      className="w-full px-2 py-1 border border-gray-300 rounded text-sm"
                                      placeholder="15"
                                    />
                                  </div>
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Footer */}
            <div className="p-6 border-t border-gray-200 flex justify-between flex-shrink-0">
              <div className="flex items-center justify-end space-x-4">
                <button 
                  onClick={() => setShowConfig(false)}
                  className="px-6 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
                >
                  Cancelar
                </button>
                <button 
                  onClick={handleConfigSubmit}
                  disabled={!configData.startMonth || !configData.endMonth || configData.selectedBrands.length === 0}
                  className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Continuar
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Barra lateral de proyecciones guardadas */}
      <div className={`fixed top-0 right-0 h-full bg-white shadow-lg transition-all duration-300 ease-in-out z-40 ${
        showSidebar ? 'w-80' : 'w-16'
      }`}>
        {/* Toggle Button */}
        <button
          onClick={() => setShowSidebar(!showSidebar)}
          className="absolute -left-3 top-8 w-6 h-6 bg-white border border-gray-300 rounded-full flex items-center justify-center shadow-md hover:shadow-lg transition-shadow z-10"
        >
          {showSidebar ? (
            <ChevronRight className="w-3 h-3 text-gray-600" />
          ) : (
            <ChevronLeft className="w-3 h-3 text-gray-600" />
          )}
        </button>
        
        {/* Header */}
        <div className={`p-4 border-b border-gray-200 ${showSidebar ? '' : 'text-center'}`}>
          {showSidebar ? (
            <div>
              <h3 className="text-lg font-semibold text-gray-900">Proyecciones Guardadas</h3>
              <p className="text-sm text-gray-600 mt-1">Selecciona una proyección</p>
            </div>
          ) : (
            <div className="flex justify-center" title="Proyecciones Guardadas">
              <Calculator className="w-6 h-6 text-gray-600" />
            </div>
          )}
        </div>
        
        {/* Content */}
        <div className="flex-1 overflow-y-auto">
          {showSidebar ? (
            <div className="p-4">
              {savedProjections.length === 0 ? (
                <div className="text-center py-8">
                  <Calculator className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                  <p className="text-sm text-gray-500">No hay proyecciones guardadas</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {savedProjections.map((projection) => (
                    <div
                      key={projection.id}
                      onClick={() => handleProjectionSelect(projection)}
                      className={`p-3 border rounded-lg cursor-pointer transition-colors ${
                        selectedProjection?.id === projection.id
                          ? 'bg-blue-50 border-blue-300'
                          : 'border-gray-200 hover:bg-gray-50'
                      }`}
                    >
                      <h4 className="font-medium text-gray-900 text-sm">{projection.name}</h4>
                      <p className="text-xs text-gray-600 mt-1">{projection.version}</p>
                      <div className="flex items-center justify-between mt-2">
                        <span className="text-xs text-gray-500">{projection.createdAt}</span>
                        <span className="text-xs text-blue-600">{projection.brands.length} marca(s)</span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          ) : (
            <div className="p-2">
              {savedProjections.map((projection) => (
                <div
                  key={projection.id}
                  onClick={() => handleProjectionSelect(projection)}
                  className={`p-2 mb-2 rounded cursor-pointer transition-colors ${
                    selectedProjection?.id === projection.id
                      ? 'bg-blue-50'
                      : 'hover:bg-gray-50'
                  }`}
                  title={projection.name}
                >
                  <div className="w-8 h-8 bg-blue-100 rounded flex items-center justify-center mx-auto">
                    <span className="text-xs font-medium text-blue-600">
                      {projection.name.charAt(0)}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
        
        {/* Footer */}
        {showSidebar && (
          <div className="p-4 border-t border-gray-200 bg-gray-50">
            <div className="text-xs text-gray-500 text-center">
              <p>{savedProjections.length} proyección(es) guardada(s)</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Projections;