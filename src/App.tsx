import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ThemeProvider } from "@/components/theme-provider";
import { AuthProvider } from "@/contexts/AuthContext";
import { CartProvider } from "@/contexts/CartContext";
import { ToastProvider } from "@/components/Toast";
import AppLayout from "@/components/AppLayout";
import HomePage from "@/pages/HomePage";
import ProductDetailPage from "@/pages/ProductDetailPage";
import CartPage from "@/pages/CartPage";
import CheckoutPage from "@/pages/CheckoutPage";
import LoginPage from "@/pages/LoginPage";
import ProfilePage from "@/pages/ProfilePage";
import CategoryPage from "@/pages/CategoryPage";
import CategoriesPage from "@/pages/CategoriesPage";
import ArticlesPage from "@/pages/ArticlesPage";
import ArticleDetailPage from "@/pages/ArticleDetailPage";
import SearchPage from "@/pages/SearchPage";
import PromoPage from "@/pages/PromoPage";
import OrdersPage from "@/pages/OrdersPage";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <ThemeProvider defaultTheme="light">
    <AuthProvider>
      <CartProvider>
        <ToastProvider>
          <QueryClientProvider client={queryClient}>
            <TooltipProvider>
              <Toaster />
              <Sonner />
              <BrowserRouter>
                <Routes>
                  <Route element={<AppLayout />}>
                    <Route path="/" element={<HomePage />} />
                    <Route path="/product/:handle" element={<ProductDetailPage />} />
                    <Route path="/cart" element={<CartPage />} />
                    <Route path="/checkout" element={<CheckoutPage />} />
                    <Route path="/login" element={<LoginPage />} />
                    <Route path="/profile" element={<ProfilePage />} />
                    <Route path="/category/:handle" element={<CategoryPage />} />
                    <Route path="/categories" element={<CategoriesPage />} />
                    <Route path="/articles" element={<ArticlesPage />} />
                    <Route path="/article/:slug" element={<ArticleDetailPage />} />
                    <Route path="/search" element={<SearchPage />} />
                    <Route path="/promo" element={<PromoPage />} />
                    <Route path="/orders" element={<OrdersPage />} />
                  </Route>
                  <Route path="*" element={<NotFound />} />
                </Routes>
              </BrowserRouter>
            </TooltipProvider>
          </QueryClientProvider>
        </ToastProvider>
      </CartProvider>
    </AuthProvider>
  </ThemeProvider>
);

export default App;
