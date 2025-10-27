import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Calendar } from '@/components/ui/calendar';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { CalendarIcon } from 'lucide-react';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';
import type { Employee } from '@/types/employee';
import { Card } from './ui/card';

const employeeSchema = z.object({
  employeeId: z.string().min(1, 'Employee ID is required'),
  fullName: z.string().min(1, 'Full name is required'),
  dob: z.date(),
  gender: z.enum(['male', 'female', 'other']),
  contactDetails: z.object({
    email: z.string().email('Invalid email'),
    phone: z.string().min(10, 'Invalid phone number'),
  }),
  address: z.object({
    street: z.string().min(1, 'Street is required'),
    city: z.string().min(1, 'City is required'),
    state: z.string().min(1, 'State is required'),
    pincode: z.string().min(6, 'Invalid pincode'),
  }),
  emergencyContact: z.object({
    name: z.string().min(1, 'Name is required'),
    relationship: z.string().min(1, 'Relationship is required'),
    phone: z.string().min(10, 'Invalid phone number'),
  }),
  department: z.string().min(1, 'Department is required'),
  designation: z.string().min(1, 'Designation is required'),
  reportingManager: z.string().min(1, 'Reporting manager is required'),
  dateOfJoining: z.date(),
  employmentType: z.enum(['permanent', 'contract']),
  bankDetails: z.object({
    accountNumber: z.string().min(1, 'Account number is required'),
    bankName: z.string().min(1, 'Bank name is required'),
    ifscCode: z.string().min(1, 'IFSC code is required'),
  }),
  pan: z.string().min(10, 'Invalid PAN'),
  aadhaar: z.string().min(12, 'Invalid Aadhaar'),
  uan: z.string().min(1, 'UAN is required'),
  esiNumber: z.string().optional(),
  ctcDetails: z.object({
    basic: z.number().min(0, 'Basic must be positive'),
    hra: z.number().min(0, 'HRA must be positive'),
    allowances: z.number().min(0, 'Allowances must be positive'),
    deductions: z.number().min(0, 'Deductions must be positive'),
  }),
});

interface EmployeeFormProps {
  employee?: Employee;
  onSubmit: (data: z.infer<typeof employeeSchema>) => void;
  onCancel: () => void;
}

export function EmployeeForm({ employee, onSubmit, onCancel }: EmployeeFormProps) {
  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<z.infer<typeof employeeSchema>>({
    resolver: zodResolver(employeeSchema),
    defaultValues: employee ? {
      ...employee,
      dob: new Date(employee.dob),
      dateOfJoining: new Date(employee.dateOfJoining),
    } : undefined,
  });

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <div className="grid grid-cols-2 gap-4">
        {/* Personal Information */}
        <Card className="col-span-2 p-4 pb-6 gap-0 rounded ">
          <h3 className="text-sm font-semibold mb-4">Personal Information</h3>
          <div className="grid grid-cols-2 gap-4">
            <div className='flex flex-col gap-y-2'>
              <Label htmlFor="employeeId">Employee ID</Label>
              <Input
                id="employeeId"
                {...register('employeeId')}
                placeholder="EMP001"
              />
              {errors.employeeId && (
                <p className="text-sm text-red-500">{errors.employeeId.message}</p>
              )}
            </div>
            <div className='flex flex-col gap-y-2'>
              <Label htmlFor="fullName">Full Name</Label>
              <Input
                id="fullName"
                {...register('fullName')}
                placeholder="John Doe"
              />
              {errors.fullName && (
                <p className="text-sm text-red-500">{errors.fullName.message}</p>
              )}
            </div>
            <div className='flex flex-col gap-y-2'>
              <Label>Date of Birth</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={cn(
                      "w-full justify-start text-left font-normal",
                      !watch('dob') && "text-muted-foreground"
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {watch('dob') ? format(watch('dob'), 'PPP') : 'Pick a date'}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <Calendar
                    mode="single"
                    selected={watch('dob')}
                    onSelect={(date) => setValue('dob', date!)}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
              {errors.dob && (
                <p className="text-sm text-red-500">{errors.dob.message}</p>
              )}
            </div>
            <div className='flex flex-col gap-y-2'>
              <Label htmlFor="gender">Gender</Label>
              <Select onValueChange={(value) => setValue('gender', value as any)} defaultValue={watch('gender')}>
                <SelectTrigger className='w-full'>
                  <SelectValue placeholder="Select gender" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="male">Male</SelectItem>
                  <SelectItem value="female">Female</SelectItem>
                  <SelectItem value="other">Other</SelectItem>
                </SelectContent>
              </Select>
              {errors.gender && (
                <p className="text-sm text-red-500">{errors.gender.message}</p>
              )}
            </div>
          </div>
        </Card>

        {/* Contact Details */}
        <Card className="col-span-2 p-4 pb-6 gap-0 rounded ">
          <h3 className="text-sm font-semibold mb-4">Contact Details</h3>
          <div className="grid grid-cols-2 gap-4">
            <div className='flex flex-col gap-y-2'>
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                {...register('contactDetails.email')}
                placeholder="john@company.com"
              />
              {errors.contactDetails?.email && (
                <p className="text-sm text-red-500">{errors.contactDetails.email.message}</p>
              )}
            </div>
            <div className='flex flex-col gap-y-2'>
              <Label htmlFor="phone">Phone</Label>
              <Input
                id="phone"
                {...register('contactDetails.phone')}
                placeholder="+91 9876543210"
              />
              {errors.contactDetails?.phone && (
                <p className="text-sm text-red-500">{errors.contactDetails.phone.message}</p>
              )}
            </div>
          </div>
        </Card>

        {/* Address */}
        <Card className="col-span-2 p-4 pb-6 gap-0 rounded ">
          <h3 className="text-sm font-semibold mb-4">Address</h3>
          <div className="grid grid-cols-2 gap-4">
            <div className='flex flex-col gap-y-2'>
              <Label htmlFor="street">Street</Label>
              <Input
                id="street"
                {...register('address.street')}
                placeholder="123 Main St"
              />
              {errors.address?.street && (
                <p className="text-sm text-red-500">{errors.address.street.message}</p>
              )}
            </div>
            <div className='flex flex-col gap-y-2'>
              <Label htmlFor="city">City</Label>
              <Input
                id="city"
                {...register('address.city')}
                placeholder="Mumbai"
              />
              {errors.address?.city && (
                <p className="text-sm text-red-500">{errors.address.city.message}</p>
              )}
            </div>
            <div className='flex flex-col gap-y-2'>
              <Label htmlFor="state">State</Label>
              <Input
                id="state"
                {...register('address.state')}
                placeholder="Maharashtra"
              />
              {errors.address?.state && (
                <p className="text-sm text-red-500">{errors.address.state.message}</p>
              )}
            </div>
            <div className='flex flex-col gap-y-2'>
              <Label htmlFor="pincode">Pincode</Label>
              <Input
                id="pincode"
                {...register('address.pincode')}
                placeholder="400001"
              />
              {errors.address?.pincode && (
                <p className="text-sm text-red-500">{errors.address.pincode.message}</p>
              )}
            </div>
          </div>
        </Card>

        {/* Emergency Contact */}
        <Card className="col-span-2 p-4 pb-6 gap-0 rounded ">
          <h3 className="text-sm font-semibold mb-4">Emergency Contact</h3>
          <div className="grid grid-cols-2 gap-4">
            <div className='flex flex-col gap-y-2'>
              <Label htmlFor="emergencyName">Name</Label>
              <Input
                id="emergencyName"
                {...register('emergencyContact.name')}
                placeholder="Jane Doe"
              />
              {errors.emergencyContact?.name && (
                <p className="text-sm text-red-500">{errors.emergencyContact.name.message}</p>
              )}
            </div>
            <div className='flex flex-col gap-y-2'>
              <Label htmlFor="relationship">Relationship</Label>
              <Input
                id="relationship"
                {...register('emergencyContact.relationship')}
                placeholder="Spouse"
              />
              {errors.emergencyContact?.relationship && (
                <p className="text-sm text-red-500">{errors.emergencyContact.relationship.message}</p>
              )}
            </div>
            <div className='flex flex-col gap-y-2'>
              <Label htmlFor="emergencyPhone">Phone</Label>
              <Input
                id="emergencyPhone"
                {...register('emergencyContact.phone')}
                placeholder="+91 9876543211"
              />
              {errors.emergencyContact?.phone && (
                <p className="text-sm text-red-500">{errors.emergencyContact.phone.message}</p>
              )}
            </div>
          </div>
        </Card>

        {/* Employment Details */}
        <Card className="col-span-2 p-4 pb-6 gap-0 rounded ">
          <h3 className="text-sm font-semibold mb-4">Employment Details</h3>
          <div className="grid grid-cols-2 gap-4">
            <div className='flex flex-col gap-y-2'>
              <Label htmlFor="department">Department</Label>
              <Input
                id="department"
                {...register('department')}
                placeholder="Engineering"
              />
              {errors.department && (
                <p className="text-sm text-red-500">{errors.department.message}</p>
              )}
            </div>
            <div className='flex flex-col gap-y-2'>
              <Label htmlFor="designation">Designation</Label>
              <Input
                id="designation"
                {...register('designation')}
                placeholder="Software Engineer"
              />
              {errors.designation && (
                <p className="text-sm text-red-500">{errors.designation.message}</p>
              )}
            </div>
            <div className='flex flex-col gap-y-2'>
              <Label htmlFor="reportingManager">Reporting Manager</Label>
              <Input
                id="reportingManager"
                {...register('reportingManager')}
                placeholder="Sarah Wilson"
              />
              {errors.reportingManager && (
                <p className="text-sm text-red-500">{errors.reportingManager.message}</p>
              )}
            </div>
            <div className='flex flex-col gap-y-2'>
              <Label htmlFor="employmentType">Employment Type</Label>
              <Select onValueChange={(value) => setValue('employmentType', value as any)} defaultValue={watch('employmentType')}>
                <SelectTrigger className='w-full'>
                  <SelectValue placeholder="Select type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="permanent">Permanent</SelectItem>
                  <SelectItem value="contract">Contract</SelectItem>
                </SelectContent>
              </Select>
              {errors.employmentType && (
                <p className="text-sm text-red-500">{errors.employmentType.message}</p>
              )}
            </div>
            <div className='flex flex-col gap-y-2'>
              <Label>Date of Joining</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={cn(
                      "w-full justify-start text-left font-normal",
                      !watch('dateOfJoining') && "text-muted-foreground"
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {watch('dateOfJoining') ? format(watch('dateOfJoining'), 'PPP') : 'Pick a date'}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <Calendar
                    mode="single"
                    selected={watch('dateOfJoining')}
                    onSelect={(date) => setValue('dateOfJoining', date!)}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
              {errors.dateOfJoining && (
                <p className="text-sm text-red-500">{errors.dateOfJoining.message}</p>
              )}
            </div>
          </div>
        </Card>

        {/* Bank Details */}
        <Card className="col-span-2 p-4 pb-6 gap-0 rounded ">
          <h3 className="text-sm font-semibold mb-4">Bank Details</h3>
          <div className="grid grid-cols-2 gap-4">
            <div className='flex flex-col gap-y-2'>
              <Label htmlFor="accountNumber">Account Number</Label>
              <Input
                id="accountNumber"
                {...register('bankDetails.accountNumber')}
                placeholder="1234567890"
              />
              {errors.bankDetails?.accountNumber && (
                <p className="text-sm text-red-500">{errors.bankDetails.accountNumber.message}</p>
              )}
            </div>
            <div className='flex flex-col gap-y-2'>
              <Label htmlFor="bankName">Bank Name</Label>
              <Input
                id="bankName"
                {...register('bankDetails.bankName')}
                placeholder="HDFC Bank"
              />
              {errors.bankDetails?.bankName && (
                <p className="text-sm text-red-500">{errors.bankDetails.bankName.message}</p>
              )}
            </div>
            <div className='flex flex-col gap-y-2'>
              <Label htmlFor="ifscCode">IFSC Code</Label>
              <Input
                id="ifscCode"
                {...register('bankDetails.ifscCode')}
                placeholder="HDFC0001234"
              />
              {errors.bankDetails?.ifscCode && (
                <p className="text-sm text-red-500">{errors.bankDetails.ifscCode.message}</p>
              )}
            </div>
          </div>
        </Card>

        {/* Statutory Details */}
        <Card className="col-span-2 p-4 pb-6 gap-0 rounded ">
          <h3 className="text-sm font-semibold mb-4">Statutory Details</h3>
          <div className="grid grid-cols-2 gap-4">
            <div className='flex flex-col gap-y-2'>
              <Label htmlFor="pan">PAN</Label>
              <Input
                id="pan"
                {...register('pan')}
                placeholder="ABCDE1234F"
              />
              {errors.pan && (
                <p className="text-sm text-red-500">{errors.pan.message}</p>
              )}
            </div>
            <div className='flex flex-col gap-y-2'>
              <Label htmlFor="aadhaar">Aadhaar</Label>
              <Input
                id="aadhaar"
                {...register('aadhaar')}
                placeholder="1234 5678 9012"
              />
              {errors.aadhaar && (
                <p className="text-sm text-red-500">{errors.aadhaar.message}</p>
              )}
            </div>
            <div className='flex flex-col gap-y-2'>
              <Label htmlFor="uan">UAN</Label>
              <Input
                id="uan"
                {...register('uan')}
                placeholder="123456789012"
              />
              {errors.uan && (
                <p className="text-sm text-red-500">{errors.uan.message}</p>
              )}
            </div>
            <div className='flex flex-col gap-y-2'>
              <Label htmlFor="esiNumber">ESI Number</Label>
              <Input
                id="esiNumber"
                {...register('esiNumber')}
                placeholder="ESI Number"
              />
            </div>
          </div>
        </Card>

        {/* CTC Details */}
        <Card className="col-span-2 p-4 pb-6 gap-0 rounded ">
          <h3 className="text-sm font-semibold mb-4">CTC Details</h3>
          <div className="grid grid-cols-4 gap-4">
            <div className='flex flex-col gap-y-2'>
              <Label htmlFor="basic">Basic</Label>
              <Input
                id="basic"
                type="number"
                {...register('ctcDetails.basic', { valueAsNumber: true })}
                placeholder="50000"
              />
              {errors.ctcDetails?.basic && (
                <p className="text-sm text-red-500">{errors.ctcDetails.basic.message}</p>
              )}
            </div>
            <div className='flex flex-col gap-y-2'>
              <Label htmlFor="hra">HRA</Label>
              <Input
                id="hra"
                type="number"
                {...register('ctcDetails.hra', { valueAsNumber: true })}
                placeholder="20000"
              />
              {errors.ctcDetails?.hra && (
                <p className="text-sm text-red-500">{errors.ctcDetails.hra.message}</p>
              )}
            </div>
            <div className='flex flex-col gap-y-2'>
              <Label htmlFor="allowances">Allowances</Label>
              <Input
                id="allowances"
                type="number"
                {...register('ctcDetails.allowances', { valueAsNumber: true })}
                placeholder="10000"
              />
              {errors.ctcDetails?.allowances && (
                <p className="text-sm text-red-500">{errors.ctcDetails.allowances.message}</p>
              )}
            </div>
            <div className='flex flex-col gap-y-2'>
              <Label htmlFor="deductions">Deductions</Label>
              <Input
                id="deductions"
                type="number"
                {...register('ctcDetails.deductions', { valueAsNumber: true })}
                placeholder="5000"
              />
              {errors.ctcDetails?.deductions && (
                <p className="text-sm text-red-500">{errors.ctcDetails.deductions.message}</p>
              )}
            </div>
          </div>
        </Card>
      </div>

      <div className="flex justify-end space-x-2">
        <Button type="button" variant="outline" onClick={onCancel}>
          Cancel
        </Button>
        <Button type="submit">
          {employee ? 'Update' : 'Create'} Employee
        </Button>
      </div>
    </form>
  );
}