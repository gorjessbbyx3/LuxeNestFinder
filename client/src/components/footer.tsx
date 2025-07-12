import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { 
  Facebook, 
  Twitter, 
  Instagram, 
  Mail, 
  Phone, 
  MapPin,
  Shield,
  Users
} from "lucide-react";

export default function Footer() {
  return (
    <footer className="bg-gray-900 text-white">
      <div className="container mx-auto px-6 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Company Info */}
          <div className="col-span-1 md:col-span-2">
            <div className="flex items-center space-x-3 mb-6">
              <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center">
                <span className="text-white font-bold text-lg">P</span>
              </div>
              <span className="font-serif font-bold text-2xl">Prestige Hawaii</span>
            </div>
            <p className="text-gray-300 mb-6 max-w-md">
              Hawaii's premier luxury real estate platform featuring AI-powered property matching, 
              virtual tours, and authentic MLS data for the most exclusive properties across all islands.
            </p>
            <div className="flex space-x-4">
              <Button size="icon" variant="ghost" className="text-gray-300 hover:text-white">
                <Facebook className="h-5 w-5" />
              </Button>
              <Button size="icon" variant="ghost" className="text-gray-300 hover:text-white">
                <Twitter className="h-5 w-5" />
              </Button>
              <Button size="icon" variant="ghost" className="text-gray-300 hover:text-white">
                <Instagram className="h-5 w-5" />
              </Button>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="font-semibold text-lg mb-4">Quick Links</h3>
            <ul className="space-y-3">
              <li>
                <Link href="/properties">
                  <span className="text-gray-300 hover:text-white cursor-pointer transition-colors">
                    Browse Properties
                  </span>
                </Link>
              </li>
              <li>
                <Link href="/virtual-tours">
                  <span className="text-gray-300 hover:text-white cursor-pointer transition-colors">
                    Virtual Tours
                  </span>
                </Link>
              </li>
              <li>
                <Link href="/neighborhoods">
                  <span className="text-gray-300 hover:text-white cursor-pointer transition-colors">
                    Neighborhoods
                  </span>
                </Link>
              </li>
              <li>
                <Link href="/sell-your-home">
                  <span className="text-gray-300 hover:text-white cursor-pointer transition-colors">
                    Sell Your Home
                  </span>
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h3 className="font-semibold text-lg mb-4">Contact Us</h3>
            <ul className="space-y-3">
              <li className="flex items-center space-x-3">
                <Phone className="h-4 w-4 text-gray-400" />
                <span className="text-gray-300">(808) 555-LUXE</span>
              </li>
              <li className="flex items-center space-x-3">
                <Mail className="h-4 w-4 text-gray-400" />
                <span className="text-gray-300">info@prestigehawaii.com</span>
              </li>
              <li className="flex items-start space-x-3">
                <MapPin className="h-4 w-4 text-gray-400 mt-1" />
                <span className="text-gray-300">
                  1000 Bishop Street<br />
                  Honolulu, HI 96813
                </span>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-gray-800 mt-8 pt-8 flex flex-col md:flex-row justify-between items-center">
          <div className="flex items-center space-x-6 mb-4 md:mb-0">
            <p className="text-gray-400 text-sm">
              © 2025 Prestige Hawaii. All rights reserved.
            </p>
            <div className="flex space-x-4 text-sm">
              <a href="#" className="text-gray-400 hover:text-white transition-colors">
                Privacy Policy
              </a>
              <a href="#" className="text-gray-400 hover:text-white transition-colors">
                Terms of Service
              </a>
            </div>
          </div>

          {/* Discreet Realtors Portal Button */}
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2 text-xs text-gray-500">
              <Shield className="h-3 w-3" />
              <span>Licensed Real Estate Platform</span>
            </div>
            <Link href="/agent-portal">
              <Button 
                size="sm" 
                variant="ghost" 
                className="text-xs text-gray-400 hover:text-white border border-gray-700 hover:border-gray-500"
              >
                <Users className="h-3 w-3 mr-2" />
                Agent Portal
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}