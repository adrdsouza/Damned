<script lang="ts">
  import { onMount } from 'svelte';
  
  // Page metadata
  const pageTitle = "Shipping & Returns";
  const pageDescription = "Information about our shipping policies and return process.";
  
  onMount(() => {
    // Set page title
    document.title = `${pageTitle} | Damned Designs`;
  });
</script>

<svelte:head>
  <title>{pageTitle} | Damned Designs</title>
  <meta name="description" content={pageDescription} />
</svelte:head>

<div class="container mx-auto px-4 py-12 max-w-6xl">
  <h1 class="text-4xl font-bold mb-8 text-center">{pageTitle}</h1>
  
  <div class="bg-white rounded-lg shadow-md p-8 mb-8">
    <h2 class="text-2xl font-semibold mb-4">Shipping Information</h2>
    
    <div class="space-y-6">
      <div>
        <h3 class="text-xl font-medium mb-2">Processing Time</h3>
        <p class="text-gray-700">
          All orders are processed within 1-3 business days. Orders placed on weekends or holidays will be processed on the next business day.
        </p>
      </div>
      
      <div>
        <h3 class="text-xl font-medium mb-2">Shipping Methods</h3>
        <p class="text-gray-700 mb-4">
          We offer the following shipping options:
        </p>
        <ul class="list-disc pl-6 space-y-2 text-gray-700">
          <li><span class="font-medium">Standard Shipping:</span> 5-7 business days</li>
          <li><span class="font-medium">Express Shipping:</span> 2-3 business days</li>
          <li><span class="font-medium">Next Day Shipping:</span> Next business day (orders must be placed before 1 PM EST)</li>
        </ul>
      </div>
      
      <div>
        <h3 class="text-xl font-medium mb-2">International Shipping</h3>
        <p class="text-gray-700">
          We ship to most countries worldwide. International orders typically take 7-14 business days for delivery. Please note that customs fees, taxes, and duties are the responsibility of the recipient and are not included in the shipping cost.
        </p>
      </div>
      
      <div>
        <h3 class="text-xl font-medium mb-2">Tracking Information</h3>
        <p class="text-gray-700">
          Tracking information will be sent to the email address provided at checkout once your order has been shipped. You can also track your order by logging into your account.
        </p>
      </div>
    </div>
  </div>
  
  <div class="bg-white rounded-lg shadow-md p-8">
    <h2 class="text-2xl font-semibold mb-4">Returns Policy</h2>
    
    <div class="space-y-6">
      <div>
        <h3 class="text-xl font-medium mb-2">Return Period</h3>
        <p class="text-gray-700">
          We offer a 30-day return policy from the date of delivery. To be eligible for a return, your item must be unused and in the same condition that you received it, with all original packaging and tags.
        </p>
      </div>
      
      <div>
        <h3 class="text-xl font-medium mb-2">Return Process</h3>
        <p class="text-gray-700 mb-4">
          To initiate a return:
        </p>
        <ol class="list-decimal pl-6 space-y-2 text-gray-700">
          <li>Log into your account and go to your order history</li>
          <li>Select the order containing the item(s) you wish to return</li>
          <li>Click on "Return Items" and follow the instructions</li>
          <li>Print the return shipping label provided</li>
          <li>Package your items securely with the original packaging</li>
          <li>Drop off the package at your nearest shipping carrier</li>
        </ol>
      </div>
      
      <div>
        <h3 class="text-xl font-medium mb-2">Refunds</h3>
        <p class="text-gray-700">
          Once we receive and inspect your return, we will send you an email to notify you that we have received your returned item. If approved, your refund will be processed, and a credit will automatically be applied to your original method of payment within 5-7 business days.
        </p>
      </div>
      
      <div>
        <h3 class="text-xl font-medium mb-2">Exchanges</h3>
        <p class="text-gray-700">
          If you need to exchange an item for a different size or color, please return the original item for a refund and place a new order for the desired item.
        </p>
      </div>
      
      <div class="bg-gray-100 p-4 rounded-lg mt-4">
        <h3 class="text-xl font-medium mb-2">Need Help?</h3>
        <p class="text-gray-700 mb-4">
          If you have any questions about our shipping or return policies, please contact our customer service team:
        </p>
        <div class="flex flex-col md:flex-row gap-4">
          <a href="/contact" class="inline-block bg-black text-white px-6 py-3 rounded-md text-center">Contact Us</a>
          <a href="/help" class="inline-block bg-gray-200 text-gray-800 px-6 py-3 rounded-md text-center">Help Center</a>
        </div>
      </div>
    </div>
  </div>
</div>