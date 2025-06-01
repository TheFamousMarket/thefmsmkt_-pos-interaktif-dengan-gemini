
import React, { useState, useCallback } from 'react';
import PageHeader from '../../components/common/PageHeader';
import { useLanguage } from '../../contexts/LanguageContext';
import { mockEmployeesData } from '../../constants/mockData';
import KioskInput from '../../components/common/KioskInput';
import KioskButton from '../../components/common/KioskButton';
import { Employee } from '../../types';
import EmployeeModal from './EmployeeModal';
import { useToast } from '../../contexts/ToastContext';

const EmployeeTable: React.FC<{
    employees: Employee[]; 
    onEdit: (employee: Employee) => void;
    onDelete: (employeeId: string) => void;
}> = ({ employees, onEdit, onDelete }) => {
    const { translate } = useLanguage();

    if (employees.length === 0) {
        return <p className="text-center py-8 text-lg text-stone-400">{translate('table_no_employees')}</p>;
    }
    
    return (
        <div className="overflow-x-auto">
            <table className="w-full text-left">
                <thead className="bg-slate-700">
                    <tr>
                        <th className="p-3 text-sm font-semibold tracking-wide text-left">{translate('table_employee_id')}</th>
                        <th className="p-3 text-sm font-semibold tracking-wide text-left">{translate('table_employee_name')}</th>
                        <th className="p-3 text-sm font-semibold tracking-wide text-left">{translate('table_employee_role')}</th>
                        <th className="p-3 text-sm font-semibold tracking-wide text-left">{translate('table_employee_status')}</th>
                        <th className="p-3 text-sm font-semibold tracking-wide text-left">{translate('table_actions')}</th>
                    </tr>
                </thead>
                <tbody className="divide-y divide-slate-700">
                    {employees.map(emp => (
                        <tr key={emp.id} className="hover:bg-slate-700/50 transition-colors">
                            <td className="p-3 text-sm text-stone-300 whitespace-nowrap">{emp.id}</td>
                            <td className="p-3 text-sm text-stone-100 font-medium whitespace-nowrap">{emp.fullname}</td>
                            <td className="p-3 text-sm text-stone-300 whitespace-nowrap" data-lang-key={`role_${emp.role.toLowerCase()}`}>
                                {translate(`role_${emp.role.toLowerCase()}`) || emp.role}
                            </td>
                            <td className="p-3 text-sm text-stone-300 whitespace-nowrap">
                                <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${emp.status === 'Aktif' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                                    {emp.status}
                                </span>
                            </td>
                            <td className="p-3 text-sm whitespace-nowrap">
                                <button onClick={() => onEdit(emp)} className="text-green-400 hover:text-green-300 mr-3 font-medium">{translate('btn_edit')}</button>
                                <button onClick={() => onDelete(emp.id)} className="text-red-400 hover:text-red-300 font-medium">{translate('btn_delete')}</button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}


const EmployeePage: React.FC = () => {
  const { translate } = useLanguage();
  const { showToast } = useToast();
  const [searchTerm, setSearchTerm] = useState('');
  const [employees, setEmployees] = useState<Employee[]>(mockEmployeesData);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingEmployee, setEditingEmployee] = useState<Employee | null>(null);

  const handleAddEmployee = () => {
    setEditingEmployee(null);
    setIsModalOpen(true);
  };

  const handleEditEmployee = (employee: Employee) => {
    setEditingEmployee(employee);
    setIsModalOpen(true);
  };
  
  const handleDeleteEmployee = (employeeId: string) => {
    // Add confirmation dialog in a real app
    setEmployees(prev => prev.filter(emp => emp.id !== employeeId));
    showToast(translate('toast_employee_deleted'), 'success');
  };


  const handleSaveEmployee = useCallback((employee: Employee) => {
    setEmployees(prev => {
        const existingIndex = prev.findIndex(emp => emp.id === employee.id);
        if (existingIndex > -1) {
            const updated = [...prev];
            updated[existingIndex] = employee;
            showToast(translate('toast_employee_updated'), 'success');
            return updated;
        }
        showToast(translate('toast_employee_added'), 'success');
        return [...prev, { ...employee, id: employee.id || `E${String(prev.length + 101).padStart(3, '0')}`} ];
    });
    setIsModalOpen(false);
  }, [showToast, translate]);


  const filteredEmployees = employees.filter(emp => 
    emp.fullname.toLowerCase().includes(searchTerm.toLowerCase()) ||
    emp.id.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div>
      <PageHeader 
        title={translate('employee_title')} 
        subtitle={translate('employee_subtitle')}
        actions={
             <KioskButton variant="primary" onClick={handleAddEmployee} className="w-full sm:w-auto">
                {translate('employee_btn_add')}
            </KioskButton>
        }
      />
      <div className="bg-slate-800 p-6 rounded-xl shadow-lg">
        <div className="flex flex-col sm:flex-row justify-between items-center mb-6 gap-4">
            <KioskInput 
                type="text" 
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder={translate('employee_search_placeholder')} 
                className="w-full sm:w-2/3 lg:w-1/2"
            />
        </div>
        <EmployeeTable 
            employees={filteredEmployees} 
            onEdit={handleEditEmployee}
            onDelete={handleDeleteEmployee}
        />
      </div>
      <EmployeeModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={handleSaveEmployee}
        employee={editingEmployee}
      />
    </div>
  );
};

export default EmployeePage;
