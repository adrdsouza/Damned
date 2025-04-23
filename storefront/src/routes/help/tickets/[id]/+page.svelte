<script lang="ts">
  import { page } from "$app/stores";
  import { onMount } from "svelte";
  import { goto } from "$app/navigation";
  import { user, isAuthenticated } from "$lib/stores/userStore";
  import { ChevronRight, Send, Paperclip as PaperClip, AlertTriangle } from "lucide-svelte";
  import toast from "svelte-french-toast";
  
  let ticket = null;
  let messages = [];
  let isLoading = true;
  let error = null;
  let newMessage = "";
  let isSending = false;
  
  // Get the ticket ID from the URL
  const ticketId = $page.params.id;
  
  function formatDate(dateString) {
    const date = new Date(dateString);
    return date.toLocaleDateString() + ' ' + date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  }
  
  function getStatusClass(status) {
    switch(status) {
      case 'open':
        return 'bg-blue-100 text-blue-800';
      case 'in_progress':
        return 'bg-yellow-100 text-yellow-800';
      case 'resolved':
        return 'bg-green-100 text-green-800';
      case 'closed':
        return 'bg-gray-100 text-gray-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  }
  
  function getPriorityClass(priority) {
    switch(priority) {
      case 'low':
        return 'bg-green-100 text-green-800';
      case 'medium':
        return 'bg-blue-100 text-blue-800';
      case 'high':
        return 'bg-orange-100 text-orange-800';
      case 'urgent':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  }
  
  function formatStatus(status) {
    return status.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase());
  }
  
  function formatPriority(priority) {
    return priority.charAt(0).toUpperCase() + priority.slice(1);
  }
  
  function formatCategory(category) {
    return category.charAt(0).toUpperCase() + category.slice(1);
  }
  
  async function fetchTicket() {
    isLoading = true;
    error = null;
    
    try {
      // Fetch ticket from our API endpoint
      const ticketResponse = await fetch(`/api/tickets/${ticketId}`);
      
      if (!ticketResponse.ok) {
        if (ticketResponse.status === 404) {
          throw new Error('Ticket not found');
        }
        throw new Error('Failed to fetch ticket');
      }
      
      const ticketData = await ticketResponse.json();
      ticket = ticketData.ticket;
      
      // Fetch messages from our API endpoint
      const messagesResponse = await fetch(`/api/tickets/${ticketId}/messages`);
      
      if (!messagesResponse.ok) {
        throw new Error('Failed to fetch messages');
      }
      
      const messagesData = await messagesResponse.json();
      messages = messagesData.messages;
    } catch (err) {
      console.error('Error fetching ticket:', err);
      error = err.message === 'Ticket not found' 
        ? 'Ticket not found. It may have been deleted or you don\'t have permission to view it.'
        : 'Failed to load ticket. Please try again.';
      toast.error(error);
    } finally {
      isLoading = false;
    }
  }
  
  async function sendMessage() {
    if (!newMessage.trim()) {
      toast.error('Please enter a message');
      return;
    }
    
    isSending = true;
    
    try {
      // In a real app, this would be an API call to send the message
      // For now, we'll simulate it with a timeout
      const response = await fetch(`/api/tickets/${ticketId}/messages`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ message: newMessage })
      });
      
      if (!response.ok) {
        throw new Error('Failed to send message');
      }
      
      const data = await response.json();
      
      // Add the new message to the list
      messages = [...messages, data.message];
      newMessage = '';
      
      // Update the ticket's updated_at timestamp
      ticket.updated_at = new Date().toISOString();
      
      toast.success('Message sent successfully');
    } catch (err) {
      console.error('Error sending message:', err);
      toast.error('Failed to send message. Please try again.');
    } finally {
      isSending = false;
    }
  }
  
  onMount(() => {
    if (!$isAuthenticated) {
      goto('/login');
      return;
    }
    
    fetchTicket();
  });
</script>

<svelte:head>
  <title>Support Ticket #{ticketId} | Damned Designs</title>
  <meta name="description" content="View and manage your support ticket with Damned Designs customer service." />
</svelte:head>

<div class="container py-12">
  <div class="flex items-center text-sm mb-6">
    <a href="/" class="hover:underline">Home</a>
    <ChevronRight size={16} class="mx-2" />
    <a href="/help" class="hover:underline">Support</a>
    <ChevronRight size={16} class="mx-2" />
    <a href="/help/tickets" class="hover:underline">My Tickets</a>
    <ChevronRight size={16} class="mx-2" />
    <span>Ticket #{ticketId}</span>
  </div>
  
  {#if isLoading}
    <div class="flex justify-center items-center py-12">
      <div class="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
    </div>
  {:else if error}
    <div class="bg-white p-12 rounded-lg shadow-sm text-center">
      <div class="mb-4 text-red-500">
        <AlertTriangle size={48} class="mx-auto" />
      </div>
      <h2 class="text-xl font-bold mb-2">{error}</h2>
      <p class="text-gray-600 mb-6">Please check the ticket ID or try again later.</p>
      <a href="/help/tickets" class="btn btn-primary">Back to Tickets</a>
    </div>
  {:else}
    <div class="grid grid-cols-1 lg:grid-cols-3 gap-8">
      <!-- Ticket Details -->
      <div class="lg:col-span-2">
        <div class="bg-white p-6 rounded-lg shadow-sm mb-8">
          <div class="flex justify-between items-start mb-4">
            <h1 class="text-2xl font-bold">{ticket.subject}</h1>
            <span class={`px-3 py-1 rounded-full text-sm font-medium ${getStatusClass(ticket.status)}`}>
              {formatStatus(ticket.status)}
            </span>
          </div>
          
          <div class="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <div>
              <p class="text-sm text-gray-500">Category</p>
              <p class="font-medium">{formatCategory(ticket.category)}</p>
            </div>
            <div>
              <p class="text-sm text-gray-500">Priority</p>
              <p class="font-medium">{formatPriority(ticket.priority)}</p>
            </div>
            <div>
              <p class="text-sm text-gray-500">Created</p>
              <p class="font-medium">{formatDate(ticket.created_at)}</p>
            </div>
          </div>
          
          {#if ticket.order_id}
            <div class="bg-gray-50 p-4 rounded-lg mb-6">
              <p class="text-sm text-gray-500">Related Order</p>
              <a href={`/account/orders/${ticket.order_id}`} class="text-primary hover:underline font-medium">
                Order #{ticket.order_id}
              </a>
            </div>
          {/if}
          
          <div>
            <h2 class="font-bold mb-2">Description</h2>
            <p class="text-gray-700 whitespace-pre-line">{ticket.description}</p>
          </div>
        </div>
        
        <!-- Message Thread -->
        <div class="bg-white p-6 rounded-lg shadow-sm mb-8">
          <h2 class="text-xl font-bold mb-6">Conversation</h2>
          
          <div class="space-y-6 mb-6">
            {#each messages as message}
              <div class={`flex ${message.is_from_customer ? 'justify-end' : 'justify-start'}`}>
                <div class={`max-w-3/4 rounded-lg p-4 ${message.is_from_customer ? 'bg-primary text-white' : 'bg-gray-100'}`}>
                  <p class="whitespace-pre-line">{message.message}</p>
                  <p class={`text-xs mt-2 ${message.is_from_customer ? 'text-gray-200' : 'text-gray-500'}`}>
                    {formatDate(message.created_at)}
                  </p>
                </div>
              </div>
            {/each}
          </div>
          
          {#if ticket.status !== 'closed'}
            <div class="border-t border-gray-200 pt-6">
              <h3 class="font-bold mb-3">Reply</h3>
              <div class="flex">
                <textarea 
                  bind:value={newMessage}
                  rows="3"
                  class="flex-grow px-4 py-2 border border-gray-300 rounded-l-md focus:outline-none focus:ring-2 focus:ring-primary"
                  placeholder="Type your message here..."
                  disabled={isSending}
                ></textarea>
                <button 
                  class="bg-primary text-white px-4 rounded-r-md hover:bg-gray-800 transition-colors flex items-center"
                  on:click={sendMessage}
                  disabled={isSending || !newMessage.trim()}
                >
                  <Send size={18} />
                </button>
              </div>
              <div class="flex justify-between items-center mt-3">
                <button class="text-gray-500 hover:text-gray-700 flex items-center text-sm">
                  <PaperClip size={16} class="mr-1" />
                  Attach File
                </button>
                <p class="text-xs text-gray-500">
                  We typically respond within 24 hours
                </p>
              </div>
            </div>
          {:else}
            <div class="border-t border-gray-200 pt-6">
              <div class="bg-gray-50 p-4 rounded-lg text-center">
                <p class="text-gray-700">This ticket is closed. If you need further assistance, please create a new ticket.</p>
                <a href="/help/tickets/new" class="btn btn-primary mt-3">Create New Ticket</a>
              </div>
            </div>
          {/if}
        </div>
      </div>
      
      <!-- Sidebar -->
      <div class="lg:col-span-1">
        <div class="bg-white p-6 rounded-lg shadow-sm sticky top-24">
          <h2 class="text-xl font-bold mb-4">Ticket Information</h2>
          
          <div class="space-y-4">
            <div>
              <p class="text-sm text-gray-500">Ticket ID</p>
              <p class="font-medium">#{ticket.id}</p>
            </div>
            
            <div>
              <p class="text-sm text-gray-500">Status</p>
              <p class={`inline-block px-2 py-1 rounded-full text-sm font-medium ${getStatusClass(ticket.status)}`}>
                {formatStatus(ticket.status)}
              </p>
            </div>
            
            <div>
              <p class="text-sm text-gray-500">Priority</p>
              <p class={`inline-block px-2 py-1 rounded-full text-sm font-medium ${getPriorityClass(ticket.priority)}`}>
                {formatPriority(ticket.priority)}
              </p>
            </div>
            
            <div>
              <p class="text-sm text-gray-500">Category</p>
              <p class="font-medium">{formatCategory(ticket.category)}</p>
            </div>
            
            <div>
              <p class="text-sm text-gray-500">Created</p>
              <p class="font-medium">{formatDate(ticket.created_at)}</p>
            </div>
            
            <div>
              <p class="text-sm text-gray-500">Last Updated</p>
              <p class="font-medium">{formatDate(ticket.updated_at)}</p>
            </div>
            
            {#if ticket.order_id}
              <div>
                <p class="text-sm text-gray-500">Related Order</p>
                <a href={`/account/orders/${ticket.order_id}`} class="text-primary hover:underline font-medium">
                  Order #{ticket.order_id}
                </a>
              </div>
            {/if}
          </div>
          
          <div class="mt-6 pt-6 border-t border-gray-200">
            <h3 class="font-bold mb-3">Actions</h3>
            
            {#if ticket.status === 'open' || ticket.status === 'in_progress'}
              <button class="btn btn-secondary w-full mb-3">
                Close Ticket
              </button>
            {:else if ticket.status === 'closed'}
              <button class="btn btn-primary w-full mb-3">
                Reopen Ticket
              </button>
            {/if}
            
            <a href="/help/tickets" class="btn btn-outline w-full block text-center">
              Back to Tickets
            </a>
          </div>
        </div>
      </div>
    </div>
  {/if}
</div>