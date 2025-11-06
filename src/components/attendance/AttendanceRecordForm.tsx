
import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { CalendarIcon } from 'lucide-react';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';
// import type{ Shift } from '@/types/attendance';

const attendanceSchema = z.object({
  attendanceDate: z.date(),
  shift: z.enum(['Morning', 'Evening', 'Night']),
  inTime: z.string().min(1, 'In-time is required'),
  outTime: z.string().min(1, 'Out-time is required'),
  otHours: z.number().min(0, 'OT hours cannot be negative'),
});

type AttendanceFormData = z.infer<typeof attendanceSchema>;

interface AttendanceRecordFormProps {
  onSubmit: (data: AttendanceFormData) => void;
}

const AttendanceRecordForm: React.FC<AttendanceRecordFormProps> = ({ onSubmit }) => {
  const form = useForm<AttendanceFormData>({
    resolver: zodResolver(attendanceSchema),
    defaultValues: {
      attendanceDate: new Date(),
      shift: 'Morning',
      inTime: '09:00',
      outTime: '18:00',
      otHours: 0,
    },
  });

  const handleSubmit = (data: AttendanceFormData) => {
    onSubmit(data);
    form.reset();
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="attendanceDate"
          render={({ field }) => (
            <FormItem className="flex flex-col">
              <FormLabel>Attendance Date</FormLabel>
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
                    disabled={(date) => date > new Date()}
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
          name="shift"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Shift</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger className='w-full'>
                    <SelectValue placeholder="Select shift" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="Morning">Morning</SelectItem>
                  <SelectItem value="Evening">Evening</SelectItem>
                  <SelectItem value="Night">Night</SelectItem>
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="grid grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="inTime"
            render={({ field }) => (
              <FormItem>
                <FormLabel>In-Time</FormLabel>
                <FormControl>
                  <Input type="time" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="outTime"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Out-Time</FormLabel>
                <FormControl>
                  <Input type="time" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <FormField
          control={form.control}
          name="otHours"
          render={({ field }) => (
            <FormItem>
              <FormLabel>OT Hours</FormLabel>
              <FormControl>
                <Input
                  type="number"
                  step="0.5"
                  min="0"
                  {...field}
                  onChange={e => field.onChange(parseFloat(e.target.value))}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button type="submit" className="w-full">
          Record Attendance
        </Button>
      </form>
    </Form>
  );
};

export default AttendanceRecordForm;