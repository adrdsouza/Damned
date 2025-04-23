<script lang="ts">
  import { onMount } from "svelte";
  import { goto } from "$app/navigation";
  import { user, isAuthenticated } from "$lib/stores/userStore";
  import { ChevronRight, Plus, Filter, Search } from "lucide-svelte";
  import toast from "svelte-french-toast";
  
  let tickets = [];
  let isLoading = true;
  let error = null;
  
  // Filter states
  let statusFilter = "all";
  let categoryFilter = "all";
  let priorityFilter = "all";
  let searchQuery = "";
  
  // Pagination
  let currentPage = 1;
  let itemsPerPage = 10;
  
  $: filteredTickets = tickets
    .filter(ticket => 
      (statusFilter === "all" || ticket.status === statusFilter) &&
      (categoryFilter === "all" || ticket.category === categoryFilter) &&
      (priorityFilter === "all" || ticket.priority === priorityFilter) &&
      (searchQuery === "" || 
        ticket.subject.toLowerCase().includes(searchQuery.toLowerCase()) ||
        ticket.description.toLowerCase().includes(searchQuery.toLowerCase()))
    );
  
  $: paginatedTickets = filteredTickets.slice(
    (currentPage - 1) * itemsPerPage, 
    currentPage * itemsPerPage
  );
  
  $: totalPages = Math.ceil(filteredTickets.length / itemsPerPage);
  
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
  
  async function fetchTickets() {
    isLoading = true;
    error = null;
    
    try {
      // Fetch tickets from our API endpoint
      const response = await fetch('/api/tickets');
      
      if (!response.ok) {
        throw new Error('Failed to fetch tickets');
      }
      
      const data = await response.json();
      tickets = data.tickets;
    } catch (err) {
      console.error('Error fetching tickets:', err);
      error = 'Failed to load tickets. Please try again.';
      toast.error(error);
    } finally {
      isLoading = false;
    }
  }
  
  function handlePageChange(page) {
    if (page >= 1 && page <= totalPages) {
      currentPage = page;
    }
  }
  
  onMount(() => {
    if (!$isAuthenticated) {
      goto('/login');
      return;
    }
    
    fetchTickets();
  });
</script>

<svelte:head>
  <title>My Support Tickets | Damned Designs</title>
  <meta name="description" content="View and manage your support tickets with Damned Designs customer service." />
</svelte:head>

<div class="container py-12">
  <div class="flex items-center text-sm mb-6">
    <a href="/" class="hover:underline">Home</a>
    <ChevronRight size={16} class="mx-2" />
    <a href="/help" class="hover:underline">Support</a>
    <ChevronRight size={16} class="mx-2" />
    <span>My Tickets</span>
  </div>
  
  <div class="flex justify-between items-center mb-8">
    <h1 class="text-3xl font-bold">My Support Tickets</h1>
    <a href="/help/tickets/new" class="btn btn-primary flex items-center">
      <Plus size={18} class="mr-2" />
      New Ticket
    </a>
  </div>
  
  <!-- Filters -->
  <div class="bg-white p-6 rounded-lg shadow-sm mb-8">
    <div class="flex flex-col md:flex-row md:items-center gap-4">
      <div class="flex items-center">
        <Filter size={18} class="mr-2 text-gray-500" />
        <span class="font-bold">Filters:</span>
      </div>
      
      <div class="grid grid-cols-1 md:grid-cols-4 gap-4 flex-grow">
        <div>
          <label for="statusFilter" class="block text-sm font-medium text-gray-700 mb-1">Status</label>
          <select 
            id="statusFilter" 
            bind:value={statusFilter}
            class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-primary"
          >
            <option value="all">All Statuses</option>
            <option value="open">Open</option>
            <option value="in_progress">In Progress</option>
            <option value="resolved">Resolved</option>
            <option value="closed">Closed</option>
          </select>
        </div>
        
        <div>
          <label for="categoryFilter" class="block text-sm font-medium text-gray-700 mb-1">Category</label>
          <select 
            id="categoryFilter" 
            bind:value={categoryFilter}
            class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-primary"
          >
            <option value="all">All Categories</option>
            <option value="technical">Technical</option>
            <option value="billing">Billing</option>
            <option value="shipping">Shipping</option>
            <option value="product">Product</option>
            <option value="other">Other</option>
          </select>
        </div>
        
        <div>
          <label for="priorityFilter" class="block text-sm font-medium text-gray-700 mb-1">Priority</label>
          <select 
            id="priorityFilter" 
            bind:value={priorityFilter}
            class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-primary"
          >
            <option value="all">All Priorities</option>
            <option value="low">Low</option>
            <option value="medium">Medium</option>
            <option value="high">High</option>
            <option value="urgent">Urgent</option>
          </select>
        </div>
        
        <div>
          <label for="searchQuery" class="block text-sm font-medium text-gray-700 mb-1">Search</label>
          <div class="relative">
            <input 
              id="searchQuery" 
              type="text" 
              bind:value={searchQuery}
              placeholder="Search tickets..."
              class="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-primary"
            />
            <div class="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">
              <Search size={16} />
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
  
  {#if isLoading}
    <div class="flex justify-center items-center py-12">
      <div class="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
    </div>
  {:else if error}
    <div class="bg-red-50 border-l-4 border-red-500 p-4 mb-8">
      <p class="text-red-700">{error}</p>
      <button 
        class="mt-2 text-red-700 underline"
        on:click={fetchTickets}
      >
        Try Again
      </button>
    </div>
  {:else if filteredTickets.length === 0}
    <div class="bg-white p-12 rounded-lg shadow-sm text-center">
      <div class="mb-4 text-gray-400">
        <svg xmlns="http://www.w3.org/2000/svg" class="h-16 w-16 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
        </svg>
      </div>
      <h2 class="text-xl font-bold mb-2">No tickets found</h2>
      {#if searchQuery || statusFilter !== 'all' || categoryFilter !== 'all' || priorityFilter !== 'all'}
        <p class="text-gray-600 mb-4">No tickets match your current filters. Try adjusting your search criteria.</p>
        <button 
          class="btn btn-secondary"
          on:click={() => {
            searchQuery = '';
            statusFilter = 'all';
            categoryFilter = 'all';
            priorityFilter = 'all';
          }}
        >
          Clear Filters
        </button>
      {:else}
        <p class="text-gray-600 mb-4">You haven't created any support tickets yet.</p>
        <a href="/help/tickets/new" class="btn btn-primary">Create Your First Ticket</a>
      {/if}
    </div>
  {:else}
    <div class="bg-white rounded-lg shadow-sm overflow-hidden">
      <div class="overflow-x-auto">
        <table class="min-w-full divide-y divide-gray-200">
          <thead class="bg-gray-50">
            <tr>
              <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Ticket
              </th>
              <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Category
              </th>
              <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Status
              </th>
              <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Priority
              </th>
              <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Last Updated
              </th>
              <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody class="bg-white divide-y divide-gray-200">
            {#each paginatedTickets as ticket}
              <tr class="hover:bg-gray-50">
                <td class="px-6 py-4 whitespace-nowrap">
                  <div class="text-sm font-medium text-gray-900">{ticket.subject}</div>
                  <div class="text-sm text-gray-500 truncate max-w-xs">{ticket.description}</div>
                </td>
                <td class="px-6 py-4 whitespace-nowrap">
                  <div class="text-sm text-gray-900">{formatCategory(ticket.category)}</div>
                </td>
                <td class="px-6 py-4 whitespace-nowrap">
                  <span class={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusClass(ticket.status)}`}>
                    {formatStatus(ticket.status)}
                  </span>
                </td>
                <td class="px-6 py-4 whitespace-nowrap">
                  <span class={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getPriorityClass(ticket.priority)}`}>
                    {formatPriority(ticket.priority)}
                  </span>
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {formatDate(ticket.updated_at)}
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  <a href={`/help/tickets/${ticket.id}`} class="text-primary hover:text-gray-700">
                    View
                  </a>
                </td>
              </tr>
            {/each}
          </tbody>
        </table>
      </div>
      
      <!-- Pagination -->
      {#if totalPages > 1}
        <div class="px-6 py-4 bg-gray-50 border-t border-gray-200 flex items-center justify-between">
          <div>
            <p class="text-sm text-gray-700">
              Showing <span class="font-medium">{(currentPage - 1) * itemsPerPage + 1}</span> to <span class="font-medium">{Math.min(currentPage * itemsPerPage, filteredTickets.length)}</span> of <span class="font-medium">{filteredTickets.length}</span> tickets
            </p>
          </div>
          <div class="flex space-x-2">
            <button 
              class="px-3 py-1 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
              disabled={currentPage === 1}
              on:click={() => handlePageChange(currentPage - 1)}
            >
              Previous
            </button>
            {#each Array(totalPages) as _, i}
              <button 
                class={`px-3 py-1 border rounded-md text-sm font-medium ${currentPage === i + 1 ? 'bg-primary text-white border-primary' : 'text-gray-700 border-gray-300 hover:bg-gray-50'}`}
                on:click={() => handlePageChange(i + 1)}
              >
                {i + 1}
              </button>
            {/each}
            <button 
              class="px-3 py-1 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
              disabled={currentPage === totalPages}
              on:click={() => handlePageChange(currentPage + 1)}
            >
              Next
            </button>
          </div>
        </div>
      {/if}
    </div>
  {/if}
</div>