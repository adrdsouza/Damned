import { json } from '@sveltejs/kit';

// Mock data for tickets
const mockTickets = [
  {
    id: '1',
    subject: 'Order not received',
    description: 'I placed an order a week ago and haven\'t received it yet.',
    status: 'open',
    priority: 'high',
    category: 'shipping',
    created_at: '2023-12-01T10:30:00Z',
    updated_at: '2023-12-01T10:30:00Z',
    user_id: 'user123',
    order_id: '1001',
    ticket_messages: [
      {
        id: '1',
        message: 'I placed an order a week ago and haven\'t received it yet.',
        is_from_customer: true,
        created_at: '2023-12-01T10:30:00Z',
        user_id: 'user123',
        ticket_id: '1'
      }
    ]
  },
  {
    id: '2',
    subject: 'Question about product warranty',
    description: 'I would like to know more details about the warranty for the Djinn XL knife.',
    status: 'in_progress',
    priority: 'medium',
    category: 'product',
    created_at: '2023-11-28T14:15:00Z',
    updated_at: '2023-11-29T09:45:00Z',
    user_id: 'user123',
    ticket_messages: [
      {
        id: '2',
        message: 'I would like to know more details about the warranty for the Djinn XL knife.',
        is_from_customer: true,
        created_at: '2023-11-28T14:15:00Z',
        user_id: 'user123',
        ticket_id: '2'
      },
      {
        id: '3',
        message: 'Thank you for your inquiry. Our knives come with a lifetime warranty against manufacturing defects. Could you please let me know what specific aspects of the warranty you\'d like to know about?',
        is_from_customer: false,
        created_at: '2023-11-29T09:45:00Z',
        ticket_id: '2'
      }
    ]
  },
  {
    id: '3',
    subject: 'Billing issue with recent order',
    description: 'I was charged twice for my recent order #12345.',
    status: 'resolved',
    priority: 'urgent',
    category: 'billing',
    created_at: '2023-11-20T08:00:00Z',
    updated_at: '2023-11-22T11:30:00Z',
    user_id: 'user123',
    order_id: '1002',
    ticket_messages: [
      {
        id: '4',
        message: 'I was charged twice for my recent order #12345.',
        is_from_customer: true,
        created_at: '2023-11-20T08:00:00Z',
        user_id: 'user123',
        ticket_id: '3'
      },
      {
        id: '5',
        message: 'I apologize for the inconvenience. I can see the duplicate charge in our system. We will process a refund for the extra charge immediately.',
        is_from_customer: false,
        created_at: '2023-11-20T10:15:00Z',
        ticket_id: '3'
      },
      {
        id: '6',
        message: 'The refund has been processed and should appear in your account within 3-5 business days.',
        is_from_customer: false,
        created_at: '2023-11-22T11:30:00Z',
        ticket_id: '3'
      }
    ]
  }
];

export async function GET({ url }) {
  try {
    // Simulate a delay to mimic network request
    await new Promise(resolve => setTimeout(resolve, 500));
    
    // Get query parameters
    const status = url.searchParams.get('status');
    const category = url.searchParams.get('category');
    const priority = url.searchParams.get('priority');
    
    // Filter tickets based on query parameters
    let filteredTickets = [...mockTickets];
    
    if (status) {
      filteredTickets = filteredTickets.filter(ticket => ticket.status === status);
    }
    
    if (category) {
      filteredTickets = filteredTickets.filter(ticket => ticket.category === category);
    }
    
    if (priority) {
      filteredTickets = filteredTickets.filter(ticket => ticket.priority === priority);
    }
    
    return json({ tickets: filteredTickets });
  } catch (error) {
    console.error('Error in GET handler:', error);
    return json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function POST({ request }) {
  try {
    // Simulate a delay to mimic network request
    await new Promise(resolve => setTimeout(resolve, 500));
    
    // Get the ticket data from the request
    const ticketData = await request.json();
    
    // Validate required fields
    if (!ticketData.subject || !ticketData.description || !ticketData.category) {
      return json({ error: 'Missing required fields' }, { status: 400 });
    }
    
    // Create a new ticket with a unique ID
    const newTicket = {
      id: (mockTickets.length + 1).toString(),
      user_id: 'user123',
      subject: ticketData.subject,
      description: ticketData.description,
      category: ticketData.category,
      priority: ticketData.priority || 'medium',
      status: 'open',
      order_id: ticketData.order_id || null,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      ticket_messages: [
        {
          id: Date.now().toString(),
          message: ticketData.description,
          is_from_customer: true,
          created_at: new Date().toISOString(),
          user_id: 'user123',
          ticket_id: (mockTickets.length + 1).toString()
        }
      ]
    };
    
    // In a real app, we would save this to a database
    // For now, we'll just return the new ticket
    return json({ ticket: newTicket });
  } catch (error) {
    console.error('Error in POST handler:', error);
    return json({ error: 'Internal server error' }, { status: 500 });
  }
}