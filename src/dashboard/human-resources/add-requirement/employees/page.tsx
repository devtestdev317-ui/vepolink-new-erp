'use client';

import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from '@/components/ui/dialog';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { MoreHorizontal, Plus, Upload } from 'lucide-react';
import { EmployeeForm } from '@/components/employee-form';
import type { Employee } from '@/types/employee';

// Mock data - replace with actual API calls
const mockEmployees: Employee[] = [
    {
        id: '1',
        employeeId: 'EMP001',
        fullName: 'John Doe',
        dob: new Date('1990-01-15'),
        gender: 'male',
        contactDetails: {
            email: 'john@company.com',
            phone: '+91 9876543210',
        },
        address: {
            street: '123 Main St',
            city: 'Mumbai',
            state: 'Maharashtra',
            pincode: '400001',
        },
        emergencyContact: {
            name: 'Jane Doe',
            relationship: 'Spouse',
            phone: '+91 9876543211',
        },
        department: 'Engineering',
        designation: 'Senior Software Engineer',
        reportingManager: 'Sarah Wilson',
        dateOfJoining: new Date('2020-06-01'),
        employmentType: 'permanent',
        bankDetails: {
            accountNumber: '1234567890',
            bankName: 'HDFC Bank',
            ifscCode: 'HDFC0001234',
        },
        pan: 'ABCDE1234F',
        aadhaar: '123456789012',
        uan: '123456789012',
        esiNumber: 'ESI123456',
        ctcDetails: {
            basic: 80000,
            hra: 32000,
            allowances: 15000,
            deductions: 8000,
        },
        documents: [],
        assets: [],
    },
];

export default function EmployeeManagementPage() {
    const [employees, setEmployees] = useState<Employee[]>(mockEmployees);
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [editingEmployee, setEditingEmployee] = useState<Employee | undefined>();
    const [searchTerm, setSearchTerm] = useState('');

    const filteredEmployees = employees.filter(employee =>
        employee.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        employee.employeeId.toLowerCase().includes(searchTerm.toLowerCase()) ||
        employee.department.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const handleAddEmployee = (data: any) => {
        const newEmployee: Employee = {
            ...data,
            id: Date.now().toString(),
            employeeId: `EMP${String(employees.length + 1).padStart(3, '0')}`, // Generate employee ID
            documents: [],
            assets: [],
        };
        setEmployees(prev => [...prev, newEmployee]);
        setIsDialogOpen(false);
    };

    const handleEditEmployee = (data: any) => {
        if (editingEmployee) {
            setEmployees(prev =>
                prev.map(emp =>
                    emp.id === editingEmployee.id ? { ...data, id: editingEmployee.id } : emp
                )
            );
            setEditingEmployee(undefined);
            setIsDialogOpen(false);
        }
    };

    const handleDeleteEmployee = (id: string) => {
        setEmployees(prev => prev.filter(emp => emp.id !== id));
    };

    const handleBulkImport = (event: React.ChangeEvent<HTMLInputElement>) => {
        // Implement Excel import logic here
        const file = event.target.files?.[0];
        if (file) {

            // Process Excel file
            console.log(file.arrayBuffer())
            console.log('Processing file:', file.name);
        }
    };

    return (
        <div className="container mx-auto p-6">
            <div className="flex flex-wrap justify-between items-center mb-6">
                <div className='md:mb-0 lg:mb-0 mb-4'>
                    <h1 className="text-3xl font-bold">Employee Master Data</h1>
                    <p className="text-muted-foreground">Manage employee profiles and information</p>
                </div>
                <div className="flex space-x-2">
                    <Button variant="outline" onClick={() => document.getElementById('bulk-import')?.click()}>
                        <Upload className="w-4 h-4 mr-2" />
                        Bulk Import
                    </Button>
                    <input
                        id="bulk-import"
                        type="file"
                        accept=".xlsx,.xls,.csv"
                        onChange={handleBulkImport}
                        className="hidden"
                    />
                    <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                        <DialogTrigger asChild>
                            <Button onClick={() => setEditingEmployee(undefined)}>
                                <Plus className="w-4 h-4 mr-2" />
                                Add Employee
                            </Button>
                        </DialogTrigger>
                        <DialogContent style={{ maxWidth: "892px" }} className="max-w-none md:max-h-[90vh] max-h-[80vh] w-[90%] overflow-y-auto">
                            <DialogHeader>
                                <DialogTitle>
                                    {editingEmployee ? 'Edit Employee' : 'Add New Employee'}
                                </DialogTitle>
                            </DialogHeader>
                            <EmployeeForm
                                employee={editingEmployee}
                                onSubmit={editingEmployee ? handleEditEmployee : handleAddEmployee}
                                onCancel={() => {
                                    setIsDialogOpen(false);
                                    setEditingEmployee(undefined);
                                }}
                            />
                        </DialogContent>
                    </Dialog>
                </div>
            </div>

            <div className="mb-6">
                <Input
                    placeholder="Search employees by name, ID, or department..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="max-w-md"
                />
            </div>

            <div className="border rounded-lg">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Employee ID</TableHead>
                            <TableHead>Full Name</TableHead>
                            <TableHead>Department</TableHead>
                            <TableHead>Designation</TableHead>
                            <TableHead>Employment Type</TableHead>
                            <TableHead>Date of Joining</TableHead>
                            <TableHead className="text-right">Actions</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {filteredEmployees.map((employee) => (
                            <TableRow key={employee.id}>
                                <TableCell className="font-medium">{employee.employeeId}</TableCell>
                                <TableCell>{employee.fullName}</TableCell>
                                <TableCell>{employee.department}</TableCell>
                                <TableCell>{employee.designation}</TableCell>
                                <TableCell>
                                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${employee.employmentType === 'permanent'
                                        ? 'bg-green-100 text-green-800'
                                        : 'bg-blue-100 text-blue-800'
                                        }`}>
                                        {employee.employmentType}
                                    </span>
                                </TableCell>
                                <TableCell>
                                    {employee.dateOfJoining.toLocaleDateString()}
                                </TableCell>
                                <TableCell className="text-right">
                                    <DropdownMenu>
                                        <DropdownMenuTrigger asChild>
                                            <Button variant="ghost" className="h-8 w-8 p-0">
                                                <MoreHorizontal className="h-4 w-4" />
                                            </Button>
                                        </DropdownMenuTrigger>
                                        <DropdownMenuContent align="end">
                                            <DropdownMenuItem
                                                onClick={() => {
                                                    setEditingEmployee(employee);
                                                    setIsDialogOpen(true);
                                                }}
                                            >
                                                Edit
                                            </DropdownMenuItem>
                                            <DropdownMenuItem
                                                onClick={() => handleDeleteEmployee(employee.id)}
                                                className="text-red-600"
                                            >
                                                Delete
                                            </DropdownMenuItem>
                                        </DropdownMenuContent>
                                    </DropdownMenu>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </div>

            {filteredEmployees.length === 0 && (
                <div className="text-center py-12">
                    <p className="text-muted-foreground">No employees found.</p>
                </div>
            )}
        </div>
    );
}