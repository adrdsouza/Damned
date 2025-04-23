<script>
  import { ChevronRight } from "lucide-svelte";
</script>

<svelte:head>
  <title>About Us | Damned Designs</title>
  <meta name="description" content="Learn about Damned Designs, our mission, values, and the story behind our premium knives and EDC gear." />
</svelte:head>

<div class="container py-12">
  <div class="flex items-center text-sm mb-6">
    <a href="/" class="hover:underline">Home</a>
    <ChevronRight size={16} class="mx-2" />
    <span>About Us</span>
  </div>
  
  <div class="max-w-4xl mx-auto">
    <h1 class="text-4xl font-bold mb-8">About Damned Designs</h1>
    
    <div class="aspect-video bg-gray-100 rounded-lg overflow-hidden mb-8">
      <img 
        src="/images/about-hero.jpg" 
        alt="Damned Designs workshop" 
        class="w-full h-full object-cover"
      />
    </div>
    
    <div class="prose max-w-none">
      <h2 class="text-2xl font-bold mt-8 mb-4">Our Story</h2>
      <p class="mb-4">
        Damned Designs was founded in 2015 by Adrian D'Souza, a passionate knife enthusiast with a vision to create exceptional everyday carry tools that combine innovative design, premium materials, and superior craftsmanship.
      </p>
      <p class="mb-4">
        What began as a small workshop in Adrian's garage has grown into a respected brand in the EDC community, known for pushing boundaries and challenging conventional knife design while maintaining the highest standards of quality and performance.
      </p>
      
      <h2 class="text-2xl font-bold mt-8 mb-4">Our Philosophy</h2>
      <p class="mb-4">
        At Damned Designs, we believe that the tools you carry every day should be as exceptional as the people who carry them. We're committed to creating products that are not only functional and reliable but also beautiful and inspiring.
      </p>
      <p class="mb-4">
        Each knife we create is a perfect balance of form and function, designed to be used and appreciated for years to come. We take pride in our attention to detail, our innovative approach to design, and our unwavering commitment to quality.
      </p>
      
      <h2 class="text-2xl font-bold mt-8 mb-4">Our Process</h2>
      <p class="mb-4">
        Every Damned Designs product begins as a concept, carefully sketched and refined until it meets our exacting standards. We then create detailed 3D models and prototypes, testing and iterating until we achieve the perfect balance of aesthetics, ergonomics, and performance.
      </p>
      <p class="mb-4">
        We work with skilled manufacturers who share our passion for quality and precision, using only the finest materials and the most advanced production techniques. Each knife undergoes rigorous quality control before it bears the Damned Designs name.
      </p>
      
      <h2 class="text-2xl font-bold mt-8 mb-4">Our Community</h2>
      <p class="mb-4">
        We're proud to be part of the vibrant and passionate EDC community. We value the feedback and support of our customers, and we're constantly inspired by the ways they use and appreciate our products.
      </p>
      <p class="mb-4">
        We're committed to giving back to this community through collaborations with artists and makers, support for knife shows and events, and our ongoing efforts to innovate and elevate the world of everyday carry tools.
      </p>
    </div>
    
    <div class="mt-12 grid grid-cols-1 md:grid-cols-2 gap-8">
      <div class="bg-gray-100 p-8 rounded-lg">
        <h3 class="text-xl font-bold mb-4">Our Values</h3>
        <ul class="list-disc pl-5 space-y-2">
          <li>Innovation in design and materials</li>
          <li>Uncompromising quality and craftsmanship</li>
          <li>Functionality and performance</li>
          <li>Transparency and integrity</li>
          <li>Community engagement and support</li>
        </ul>
      </div>
      
      <div class="bg-gray-100 p-8 rounded-lg">
        <h3 class="text-xl font-bold mb-4">Contact Us</h3>
        <p class="mb-4">
          We love hearing from our customers and the EDC community. Whether you have questions about our products, feedback on your purchase, or ideas for future designs, we'd love to hear from you.
        </p>
        <a href="/contact" class="btn btn-primary">Get in Touch</a>
      </div>
    </div>
  </div>
</div>