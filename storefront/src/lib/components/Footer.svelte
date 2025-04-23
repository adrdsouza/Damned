<script>
  import { Instagram, Facebook, Twitter, Mail } from "lucide-svelte";
  
  const currentYear = new Date().getFullYear();
</script>

<footer class="bg-cream pt-12 pb-6">
  <div class="container-wide">
    <div class="grid grid-cols-1 md:grid-cols-4 gap-8 mb-12">
      <div>
        <h3 class="font-bold text-lg mb-4">Damned Designs</h3>
        <p class="text-gray-700 mb-4">
          Premium knives and EDC gear designed with passion and precision.
        </p>
        <div class="flex space-x-4">
          <a href="https://instagram.com/damneddesigns" class="text-primary hover:text-gray-700" aria-label="Instagram">
            <Instagram size={20} />
          </a>
          <a href="https://facebook.com/damneddesigns" class="text-primary hover:text-gray-700" aria-label="Facebook">
            <Facebook size={20} />
          </a>
          <a href="https://twitter.com/damneddesigns" class="text-primary hover:text-gray-700" aria-label="Twitter">
            <Twitter size={20} />
          </a>
          <a href="mailto:contact@damneddesigns.com" class="text-primary hover:text-gray-700" aria-label="Email">
            <Mail size={20} />
          </a>
        </div>
      </div>
      
      <div>
        <h3 class="font-bold text-lg mb-4">Shop</h3>
        <ul class="space-y-2">
          <li><a href="/products" class="text-gray-700 hover:text-primary">All Products</a></li>
          <li><a href="/products?category=knives" class="text-gray-700 hover:text-primary">Knives</a></li>
          <li><a href="/products?category=tools" class="text-gray-700 hover:text-primary">Tools</a></li>
          <li><a href="/products?category=accessories" class="text-gray-700 hover:text-primary">Accessories</a></li>
          <li><a href="/products?category=new" class="text-gray-700 hover:text-primary">New Arrivals</a></li>
        </ul>
      </div>
      
      <div>
        <h3 class="font-bold text-lg mb-4">Company</h3>
        <ul class="space-y-2">
          <li><a href="/about" class="text-gray-700 hover:text-primary">About Us</a></li>
          <li><a href="/contact" class="text-gray-700 hover:text-primary">Contact</a></li>
          <li><a href="/blog" class="text-gray-700 hover:text-primary">Blog</a></li>
          <li><a href="/reviews" class="text-gray-700 hover:text-primary">Reviews</a></li>
        </ul>
      </div>
      
      <div>
        <h3 class="font-bold text-lg mb-4">Customer Service</h3>
        <ul class="space-y-2">
          <li><a href="/shipping-returns" class="text-gray-700 hover:text-primary">Shipping & Returns</a></li>
          <li><a href="/faq" class="text-gray-700 hover:text-primary">FAQ</a></li>
          <li><a href="/warranty" class="text-gray-700 hover:text-primary">Warranty</a></li>
          <li><a href="/privacy-policy" class="text-gray-700 hover:text-primary">Privacy Policy</a></li>
          <li><a href="/terms-of-service" class="text-gray-700 hover:text-primary">Terms of Service</a></li>
        </ul>
      </div>
    </div>
    
    <div class="border-t border-gray-200 pt-6 text-center text-gray-600 text-sm">
      <p>&copy; {currentYear} Damned Designs. All rights reserved.</p>
    </div>
  </div>
</footer>