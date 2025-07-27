export const expenseRequests = [
  {
    id: 1,
    type: 'Travel Expenses',
    amount: 150.00,
    submittedDate: 'Apr 5, 2025',
    status: 'payment',
    stages: ['request', 'verification', 'approved', 'payment', 'reimbursed']
  },
  {
    id: 2,
    type: 'Office Supplies',
    amount: 45.00,
    submittedDate: 'Apr 3, 2025',
    status: 'verification',
    stages: ['request', 'verification', 'approved', 'payment', 'reimbursed']
  },
  {
    id: 3,
    type: 'Travel Expenses',
    amount: 320.00,
    submittedDate: 'Jul 28, 2025',
    status: 'verification',
    stages: ['request', 'verification', 'approved', 'payment', 'reimbursed']
  },
  {
    id: 4,
    type: 'Mileage',
    amount: 127.00,
    submittedDate: 'Oct 28, 2024',
    status: 'approved',
    stages: ['request', 'verification', 'approved', 'payment', 'reimbursed']
  },
  {
    id: 5,
    type: 'Equipment Rental',
    amount: 220.00,
    submittedDate: 'Sep 28, 2024',
    status: 'approved',
    stages: ['request', 'verification', 'approved', 'payment', 'reimbursed']
  },
  {
    id: 6,
    type: 'Meals and Entertainment',
    amount: 120.00,
    submittedDate: 'Jan 2, 2024',
    status: 'approved',
    stages: ['request', 'verification', 'approved', 'payment', 'reimbursed']
  },
  {
    id: 7,
    type: 'Transporation',
    amount: 440.00,
    submittedDate: 'Aug 18, 2024',
    status: 'approved',
    stages: ['request', 'verification', 'approved', 'payment', 'reimbursed']
  }
];

export const employeeReimbursements = [
  {
    id: 1,
    name: 'Lucas prices',
    amount: 125.30,
    date: 'Apr 8, 2024',
    type: 'Travel Expenses',
    status: 'reimbursed',
    stages: ['request', 'verification', 'approved', 'reimbursed']
  },
  {
    id: 2,
    name: 'James Ferdinand',
    amount: 74.10,
    date: 'Apr 8, 2024',
    type: 'Office Supplies',
    status: 'reimbursed',
    stages: ['request', 'verification', 'approved', 'reimbursed']
  },
  {
    id: 3,
    name: 'Scarlett Groves',
    amount: 98.50,
    date: 'Apr 9, 2024',
    type: 'Mileage',
    status: 'payment-initiated',
    stages: ['request', 'verification', 'payment-initiated', 'reimbursed']
  },
  {
    id: 4,
    name: 'Michael Chen',
    amount: 89.75,
    date: 'Apr 10, 2024',
    type: 'Meals & Entertainment',
    status: 'approved',
    stages: ['request', 'verification', 'approved', 'payment', 'reimbursed']
  },
  {
    id: 5,
    name: 'Sarah Johnson',
    amount: 156.20,
    date: 'Apr 11, 2024',
    type: 'Conference Fees',
    status: 'verification',
    stages: ['request', 'verification', 'approved', 'payment', 'reimbursed']
  },
  {
    id: 6,
    name: 'David Wilson',
    amount: 67.80,
    date: 'Apr 12, 2024',
    type: 'Transportation',
    status: 'approved',
    stages: ['request', 'verification', 'approved', 'payment', 'reimbursed']
  },
  {
    id: 7,
    name: 'Emma Davis',
    amount: 234.50,
    date: 'Apr 13, 2024',
    type: 'Training Materials',
    status: 'payment-initiated',
    stages: ['request', 'verification', 'approved', 'payment-initiated', 'reimbursed']
  },
  {
    id: 8,
    name: 'Alex Rodriguez',
    amount: 43.25,
    date: 'Apr 14, 2024',
    type: 'Office Supplies',
    status: 'verification',
    stages: ['request', 'verification', 'approved', 'payment', 'reimbursed']
  },
  {
    id: 9,
    name: 'Lisa Zhang',
    amount: 178.90,
    date: 'Apr 15, 2024',
    type: 'Travel Expenses',
    status: 'approved',
    stages: ['request', 'verification', 'approved', 'payment', 'reimbursed']
  },
  {
    id: 10,
    name: 'Robert Smith',
    amount: 92.15,
    date: 'Apr 16, 2024',
    type: 'Equipment Rental',
    status: 'reimbursed',
    stages: ['request', 'verification', 'approved', 'reimbursed']
  }
];

export const checkedInEmployees = [
  { name: 'John', time: '10:02 AM', avatar: '👤', date: 'July 25, 2025', fullDateTime: 'Fri, Jul 25, 2025 at 10:02 AM' },
  { name: 'Caroline', time: '9:25 AM', avatar: '👩', date: 'July 25, 2025', fullDateTime: 'Fri, Jul 25, 2025 at 9:25 AM' },
  { name: 'Unknown', time: '8:48 AM', avatar: '👤', date: 'July 25, 2025', fullDateTime: 'Fri, Jul 25, 2025 at 8:48 AM' },
  { name: 'Sarah Johnson', time: '8:30 AM', avatar: '👩', date: 'July 25, 2025', fullDateTime: 'Fri, Jul 25, 2025 at 8:30 AM' },
  { name: 'Mike Chen', time: '9:15 AM', avatar: '👤', date: 'July 25, 2025', fullDateTime: 'Fri, Jul 25, 2025 at 9:15 AM' },
  { name: 'Emma Davis', time: '9:45 AM', avatar: '👩', date: 'July 24, 2025', fullDateTime: 'Thu, Jul 24, 2025 at 9:45 AM' },
  { name: 'Alex Rodriguez', time: '8:15 AM', avatar: '👤', date: 'July 24, 2025', fullDateTime: 'Thu, Jul 24, 2025 at 8:15 AM' }
];

export const checkedOutEmployees = [
  { name: 'David Wilson', time: '6:30 PM', avatar: '👤', date: 'July 24, 2025', fullDateTime: 'Thu, Jul 24, 2025 at 6:30 PM' },
  { name: 'Lisa Zhang', time: '5:45 PM', avatar: '👩', date: 'July 24, 2025', fullDateTime: 'Thu, Jul 24, 2025 at 5:45 PM' },
  { name: 'Robert Smith', time: '6:00 PM', avatar: '👤', date: 'July 24, 2025', fullDateTime: 'Thu, Jul 24, 2025 at 6:00 PM' },
  { name: 'Jennifer Lee', time: '5:30 PM', avatar: '👩', date: 'July 23, 2025', fullDateTime: 'Wed, Jul 23, 2025 at 5:30 PM' },
  { name: 'Mark Thompson', time: '7:15 PM', avatar: '👤', date: 'July 23, 2025', fullDateTime: 'Wed, Jul 23, 2025 at 7:15 PM' }
];

export const motionEvents = [
  { time: '10:12 AM', avatar: '👤' },
  { time: '9:25 AM', avatar: '👩' },
  { time: '8:48 AM', avatar: '👤' }
];