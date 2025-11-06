// components/attendance/LeaveApplicationForm.tsx
import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { CalendarIcon } from 'lucide-react';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';
import type { LeaveType, LeaveBalance } from '@/types/attendance';

const leaveSchema = z.object({
  leaveType: z.enum(['CL', 'PL', 'SL']),
  fromDate: z.date(),
  toDate: z.date(),
  reason: z.string().min(10, 'Reason must be at least 10 characters'),
}).refine((data) => data.toDate >= data.fromDate, {
  message: 'To date must be after from date',
  path: ['toDate'],
});

type LeaveFormData = z.infer<typeof leaveSchema>;

interface LeaveApplicationFormProps {
  onSubmit: (data: LeaveFormData) => void;
  balances: LeaveBalance;
}

const LeaveApplicationForm: React.FC<LeaveApplicationFormProps> = ({ onSubmit, balances }) => {
  const form = useForm<LeaveFormData>({
    resolver: zodResolver(leaveSchema),
    defaultValues: {
      leaveType: 'CL',
      fromDate: new Date(),
      toDate: new Date(),
      reason: '',
    },
  });

  const handleSubmit = (data: LeaveFormData) => {
    onSubmit(data);
    form.reset();
  };

  const selectedLeaveType = form.watch('leaveType');
  const fromDate = form.watch('fromDate');
  const toDate = form.watch('toDate');

  const getAvailableLeaves = (type: LeaveType) => {
    switch (type) {
      case 'CL': return balances.cl;
      case 'PL': return balances.pl;
      case 'SL': return balances.sl;
      default: return 0;
    }
  };

  const calculateLeaveDays = () => {
    if (!fromDate || !toDate) return 0;
    return Math.ceil((toDate.getTime() - fromDate.getTime()) / (1000 * 60 * 60 * 24)) + 1;
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="leaveType"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Leave Type</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger className='w-full'>
                    <SelectValue placeholder="Select leave type" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="CL">Casual Leave ({balances.cl} available)</SelectItem>
                  <SelectItem value="PL">Privileged Leave ({balances.pl} available)</SelectItem>
                  <SelectItem value="SL">Sick Leave ({balances.sl} available)</SelectItem>
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="grid md:grid-cols-2 grid-cols-1 gap-4">
          <FormField
            control={form.control}
            name="fromDate"
            render={({ field }) => (
              <FormItem className="flex flex-col">
                <FormLabel>From Date</FormLabel>
                <Popover>
                  <PopoverTrigger asChild>
                    <FormControl>
                      <Button
                        variant="outline"
                        className={cn(
                          'w-full pl-3 text-left font-normal',
                          !field.value && 'text-muted-foreground'
                        )}
                      >
                        {field.value ? format(field.value, 'PPP') : <span>Pick a date</span>}
                        <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                      </Button>
                    </FormControl>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={field.value}
                      onSelect={field.onChange}
                      disabled={(date) => date < new Date()}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="toDate"
            render={({ field }) => (
              <FormItem className="flex flex-col">
                <FormLabel>To Date</FormLabel>
                <Popover>
                  <PopoverTrigger asChild>
                    <FormControl>
                      <Button
                        variant="outline"
                        className={cn(
                          'w-full pl-3 text-left font-normal',
                          !field.value && 'text-muted-foreground'
                        )}
                      >
                        {field.value ? format(field.value, 'PPP') : <span>Pick a date</span>}
                        <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                      </Button>
                    </FormControl>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={field.value}
                      onSelect={field.onChange}
                      disabled={(date) => date < fromDate}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="p-3 bg-blue-50 rounded-lg">
          <div className="text-sm text-blue-800">
            <div>Leave Days: {calculateLeaveDays()}</div>
            <div>Available {selectedLeaveType}: {getAvailableLeaves(selectedLeaveType)}</div>
            {calculateLeaveDays() > getAvailableLeaves(selectedLeaveType) && (
              <div className="text-red-600 font-semibold mt-1">
                Insufficient leave balance!
              </div>
            )}
          </div>
        </div>

        <FormField
          control={form.control}
          name="reason"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Reason</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Please provide a detailed reason for your leave..."
                  className="resize-none"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button
          type="submit"
          className="w-full"
          disabled={calculateLeaveDays() > getAvailableLeaves(selectedLeaveType)}
        >
          Apply for Leave
        </Button>
      </form>
    </Form>
  );
};

export default LeaveApplicationForm;